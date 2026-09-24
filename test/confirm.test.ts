import { describe, expect, it, vi } from 'vitest';
import type { ServerContext } from '@modelcontextprotocol/server';
import { ConfirmTokens, TOKEN_TTL_MS, preview, withConfirm } from '../src/confirm.js';
import type { ToolDef } from '../src/types.js';

const tool: ToolDef = {
  name: 'sub_account_update_batch',
  title: '批量修改子账号备注',
  description: '批量修改多个子账号的备注，ids 为逗号分隔的子账号 id。',
  readOnly: false,
  destructive: false,
  method: 'POST',
  path: '/externalapi/device/accountUpdateList',
  inputSchema: {
    type: 'object',
    properties: {
      product_type_id: { type: 'integer', enum: [1, 6], description: '产品类型：1=动态住宅流量（不限时长），6=动态住宅流量（包月）' },
      ids: { type: 'string', description: '子账号id集' },
      remark: { type: 'string', description: '备注' },
      content: { type: 'array', items: { type: 'string' } },
    },
    required: ['product_type_id', 'ids'],
    additionalProperties: false,
  },
};
const args = { product_type_id: 1, ids: '12,13', remark: '测试', content: ['a'] };
const ok = { content: [{ type: 'text' as const, text: 'done' }] };
const textOf = (r: unknown): string => (r as { content: { text: string }[] }).content[0].text;

describe('preview', () => {
  it('列出工具、首句说明与全部参数，product_type_id 带中文产品名，跳过空值', () => {
    expect(preview(tool, { ...args, remark: undefined }).split('\n')).toEqual([
      '批量修改子账号备注（sub_account_update_batch）',
      '批量修改多个子账号的备注，ids 为逗号分隔的子账号 id',
      '- product_type_id：1（动态住宅流量（不限时长））',
      '- ids：12,13',
      '- content：["a"]',
    ]);
  });
});

describe('ConfirmTokens', () => {
  it('确认码绑定工具与参数，只能用一次，参数顺序不同也算同一组', () => {
    const t = new ConfirmTokens();
    const token = t.issue('x', { a: 1, b: [1, 2] });
    expect(t.consume(token, 'x', { b: [1, 2], a: 1 })).toBe('ok');
    expect(t.consume(token, 'x', { a: 1, b: [1, 2] })).toBe('unknown');
  });

  it('参数变了或工具变了报 mismatch 并作废；过期报 expired', () => {
    let now = 1_000;
    const t = new ConfirmTokens(() => now);
    expect(t.consume(t.issue('x', { a: 1 }), 'x', { a: 2 })).toBe('mismatch');
    expect(t.consume(t.issue('x', { a: 1 }), 'y', { a: 1 })).toBe('mismatch');
    const token = t.issue('x', { a: 1 });
    now += TOKEN_TTL_MS + 1;
    expect(t.consume(token, 'x', { a: 1 })).toBe('expired');
    expect(t.consume(token, 'x', { a: 1 })).toBe('unknown');
  });
});

describe('withConfirm', () => {
  const ctxWith = (responses?: Record<string, unknown>): ServerContext => ({ mcpReq: { inputResponses: responses } }) as unknown as ServerContext;

  it('客户端支持弹窗：第一次返回 input_required，预览在弹窗文案里；用户同意后才执行', async () => {
    const exec = vi.fn(async () => ok);
    const h = withConfirm(tool, { supportsElicitation: () => true, exec, tokens: new ConfirmTokens() });

    const ask = (await h(args, ctxWith())) as { resultType?: string; inputRequests?: Record<string, { params: { message: string } }> };
    expect(ask.resultType).toBe('input_required');
    expect(ask.inputRequests?.confirm.params.message).toContain('批量修改子账号备注（sub_account_update_batch）');
    expect(ask.inputRequests?.confirm.params.message).toContain('- ids：12,13');
    expect(exec).not.toHaveBeenCalled();

    expect(await h(args, ctxWith({ confirm: { action: 'accept', content: { confirm: true } } }))).toBe(ok);
    expect(exec).toHaveBeenCalledWith(args);
  });

  it('客户端支持弹窗：拒绝、取消或没勾选都不执行', async () => {
    const exec = vi.fn(async () => ok);
    const h = withConfirm(tool, { supportsElicitation: () => true, exec, tokens: new ConfirmTokens() });
    for (const answer of [{ action: 'decline' }, { action: 'cancel' }, { action: 'accept', content: { confirm: false } }]) {
      const r = await h(args, ctxWith({ confirm: answer }));
      expect(r).toMatchObject({ isError: true });
      expect(textOf(r)).toContain('取消');
    }
    expect(exec).not.toHaveBeenCalled();
  });

  it('客户端不支持弹窗：先给预览和确认码，带码且参数相同才执行，确认码不进后端参数', async () => {
    const exec = vi.fn(async () => ok);
    const h = withConfirm(tool, { supportsElicitation: () => false, exec, tokens: new ConfirmTokens() });

    const first = await h(args, ctxWith());
    expect((first as { isError?: boolean }).isError).toBeFalsy();
    expect(textOf(first)).toContain('待确认');
    expect(textOf(first)).toContain('- product_type_id：1（动态住宅流量（不限时长））');
    const token = textOf(first).match(/confirm_token=([0-9a-f]+)/)?.[1];
    expect(token).toBeTruthy();
    expect(exec).not.toHaveBeenCalled();

    const wrong = await h({ ...args, remark: '改了', confirm_token: token }, ctxWith());
    expect(wrong).toMatchObject({ isError: true });
    expect(textOf(wrong)).toContain('参数与本次不同');

    const again = await h({ ...args, confirm_token: token }, ctxWith());
    expect(again).toMatchObject({ isError: true });
    expect(textOf(again)).toContain('无效或已过期');

    const token2 = textOf(await h(args, ctxWith())).match(/confirm_token=([0-9a-f]+)/)?.[1];
    expect(await h({ ...args, confirm_token: token2 }, ctxWith())).toBe(ok);
    expect(exec).toHaveBeenCalledWith(args);
  });
});
