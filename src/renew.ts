import type { CallToolResult, InputRequiredResult, ServerContext } from '@modelcontextprotocol/server';
import { callApi, text, type Cfg } from './http.js';
import type { ToolDef } from './types.js';

type Handler = (input: Record<string, unknown>, ctx: ServerContext) => Promise<CallToolResult | InputRequiredResult>;

/**
 * 后端续费接口会把本次的 is_renew（文档没写，不传当 0）和 renew_with_bandwidth 写回子账号的自动续费设置，
 * 照文档直接调一次就会把用户开着的自动续费关掉。所以续费前先查子账号当前值：
 * is_renew 一律沿用，renew_with_bandwidth 没传才沿用；子账号之间不一致就报错让调用方分开续费。
 */
export async function fillRenewDefaults(args: Record<string, unknown>, list: ToolDef, cfg: Cfg, fetchImpl?: typeof fetch): Promise<Record<string, unknown>> {
  const fields = ['is_renew', 'renew_with_bandwidth'].filter(f => args[f] === undefined);
  const ids = String(args.sub_account_ids).split(',').map(s => s.trim()).filter(Boolean);
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const r = await callApi(list, { product_type_id: args.product_type_id, ids: ids.slice(i, i + 100).join(','), page: 1, pagesize: 100 }, cfg, fetchImpl);
    const body = (r.content[0] as { text: string }).text;
    if (r.isError) throw new Error(`续费前查询子账号当前的自动续费设置失败，尚未续费：${body}`);
    rows.push(...((JSON.parse(body).data?.rows ?? []) as Record<string, unknown>[]));
  }
  const found = new Set(rows.map(r => String(r.id)));
  const lost = ids.filter(id => !found.has(id));
  if (lost.length) throw new Error(`子账号 ${lost.join(',')} 在该产品下不存在，尚未续费`);
  const filled = { ...args };
  for (const f of fields) {
    const values = [...new Set(rows.map(r => Number(r[f] ?? 0)))];
    if (values.length > 1) {
      throw new Error(`这些子账号当前的 ${f} 设置不一致，而后端一次续费只能统一设置，尚未续费。请按当前设置分开续费${f === 'renew_with_bandwidth' ? '，或显式传 renew_with_bandwidth' : ''}。`);
    }
    filled[f] = values[0] ?? 0;
  }
  return filled;
}

/** 补齐要在确认之前做，预览里才是真正要发的值 */
export function withRenewDefaults(next: Handler, list: ToolDef, cfg: Cfg): Handler {
  return async (input, ctx) => {
    let filled: Record<string, unknown>;
    try {
      filled = await fillRenewDefaults(input, list, cfg);
    } catch (e) {
      return text((e as Error).message, true);
    }
    return next(filled, ctx);
  };
}
