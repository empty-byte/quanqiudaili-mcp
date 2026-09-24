import { createHash, randomBytes } from 'node:crypto';
import { inputRequired, inputResponse, type CallToolResult, type InputRequiredResult, type ServerContext } from '@modelcontextprotocol/server';
import { text } from './http.js';
import type { JsonSchema, ToolDef } from './types.js';

export const TOKEN_TTL_MS = 5 * 60_000;

export const CONFIRM_TOKEN_SCHEMA: JsonSchema = {
  type: 'string',
  description: '确认码。客户端不支持弹窗确认时，第一次调用只返回操作预览和确认码；把预览告诉用户并得到同意后，用相同参数带上确认码再调一次。支持弹窗确认的客户端不需要这个参数',
};

/** 给用户看的操作预览：工具、首句说明、逐个参数；product_type_id 带上中文产品名 */
export function preview(tool: ToolDef, args: Record<string, unknown>): string {
  const lines = [`${tool.title}（${tool.name}）`, tool.description.split(/[。；]/)[0]];
  for (const [k, v] of Object.entries(args)) {
    if (v === undefined || v === null) continue;
    lines.push(`- ${k}：${render(tool, k, v)}`);
  }
  return lines.join('\n');
}

function render(tool: ToolDef, key: string, v: unknown): string {
  if (key === 'product_type_id') {
    const desc = tool.inputSchema.properties.product_type_id?.description ?? '';
    const m = desc.match(new RegExp(`${String(v)}=([^，,]+)`));
    return m ? `${String(v)}（${m[1]}）` : String(v);
  }
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

const canon = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(canon)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon((v as Record<string, unknown>)[k])]))
  : v;
const fingerprint = (tool: string, args: Record<string, unknown>): string =>
  createHash('sha256').update(tool + JSON.stringify(canon(args))).digest('hex');

/** 客户端不支持弹窗确认时用的一次性确认码：绑定工具与参数，过期或参数变了都作废 */
export class ConfirmTokens {
  private pending = new Map<string, { fp: string; expires: number }>();
  constructor(private now: () => number = Date.now) {}

  issue(tool: string, args: Record<string, unknown>): string {
    const token = randomBytes(4).toString('hex');
    this.pending.set(token, { fp: fingerprint(tool, args), expires: this.now() + TOKEN_TTL_MS });
    return token;
  }

  consume(token: string, tool: string, args: Record<string, unknown>): 'ok' | 'unknown' | 'expired' | 'mismatch' {
    const p = this.pending.get(token);
    if (!p) return 'unknown';
    this.pending.delete(token);
    if (p.expires < this.now()) return 'expired';
    return p.fp === fingerprint(tool, args) ? 'ok' : 'mismatch';
  }
}

export interface ConfirmDeps {
  supportsElicitation: (ctx: ServerContext) => boolean;
  exec: (args: Record<string, unknown>) => Promise<CallToolResult>;
  tokens: ConfirmTokens;
}

/**
 * 写操作先确认再执行。客户端支持弹窗（elicitation）就弹给用户点；不支持就退到确认码：
 * 第一次调用只回预览和确认码，模型转述给用户后带码重调。
 */
export function withConfirm(tool: ToolDef, deps: ConfirmDeps) {
  return async (input: Record<string, unknown>, ctx: ServerContext): Promise<CallToolResult | InputRequiredResult> => {
    const { confirm_token, ...args } = input;

    if (deps.supportsElicitation(ctx)) {
      const answer = inputResponse(ctx.mcpReq.inputResponses, 'confirm');
      if (answer.kind === 'missing') {
        return inputRequired({
          inputRequests: {
            confirm: inputRequired.elicit({
              message: `${preview(tool, args)}\n\n确认执行以上操作？`,
              requestedSchema: {
                type: 'object',
                properties: { confirm: { type: 'boolean', title: '确认执行', description: '勾选表示同意执行上述操作' } },
                required: ['confirm'],
              },
            }),
          },
        });
      }
      if (answer.kind === 'elicit' && answer.action === 'accept' && answer.content?.confirm === true) return deps.exec(args);
      return text('用户没有确认，操作已取消，没有请求后端。', true);
    }

    if (typeof confirm_token !== 'string' || !confirm_token) {
      const token = deps.tokens.issue(tool.name, args);
      return text(
        `待确认，尚未执行。\n${preview(tool, args)}\n\n请把以上内容原样告诉用户；用户明确同意后，用相同参数加 confirm_token=${token} 再调用一次（5 分钟内有效，只能用一次）。用户不同意就不要再调。`,
        false,
      );
    }
    const state = deps.tokens.consume(confirm_token, tool.name, args);
    if (state === 'mismatch') return text('确认码对应的参数与本次不同，已作废。请不带确认码重新调用，重新向用户确认。', true);
    if (state !== 'ok') return text('确认码无效或已过期。请不带确认码重新调用，重新向用户确认。', true);
    return deps.exec(args);
  };
}
