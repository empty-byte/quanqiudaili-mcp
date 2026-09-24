import type { CallToolResult } from '@modelcontextprotocol/server';
import { toForm } from './form.js';
import type { ToolDef } from './types.js';

export interface Cfg {
  baseUrl: string;
  token: string;
  timeoutMs: number;
}

export function cfgFromEnv(env: NodeJS.ProcessEnv = process.env): Cfg {
  const token = (env.QQDL_TOKEN ?? '').trim();
  if (!token) {
    throw new Error(
      '缺少环境变量 QQDL_TOKEN。请先用账号密码调用 externalapi/user/login 取得 token，做法见 README。' +
        '客户端拉起本服务时不继承终端里的环境变量，token 要写在客户端配置里（如 claude mcp add -e QQDL_TOKEN=…），用 Inspector 调试时通过 -e 传入。',
    );
  }
  const baseUrl = (env.QQDL_BASE_URL ?? 'https://admin.quanqiudaili.com').trim().replace(/\/+$/, '');
  const timeoutMs = Number(env.QQDL_TIMEOUT_MS ?? 30000);
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new Error('QQDL_TIMEOUT_MS 必须是正整数（毫秒）');
  return { baseUrl, token, timeoutMs };
}

export const text = (t: string, isError = false): CallToolResult => ({
  content: [{ type: 'text', text: t }],
  ...(isError ? { isError: true } : {}),
});

type Body = { code?: unknown; msg?: unknown; data?: unknown };

/** 只接受 JSON 对象；非 JSON、null、数组都当格式异常 */
function parseBody(raw: string): Body | undefined {
  try {
    const v: unknown = JSON.parse(raw);
    return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Body) : undefined;
  } catch {
    return undefined;
  }
}

export async function callApi(
  tool: ToolDef,
  args: Record<string, unknown>,
  cfg: Cfg,
  fetchImpl: typeof fetch = fetch,
): Promise<CallToolResult> {
  const form = toForm({ ...args, ...tool.fixed }).toString();
  const url = new URL(cfg.baseUrl + tool.path);
  const headers: Record<string, string> = { token: cfg.token, accept: 'application/json' };
  const init: RequestInit = { method: tool.method, headers, signal: AbortSignal.timeout(cfg.timeoutMs) };
  if (tool.method === 'GET') {
    url.search = form;
  } else {
    headers['content-type'] = 'application/x-www-form-urlencoded';
    init.body = form;
  }

  let status: number;
  let raw: string;
  try {
    const res = await fetchImpl(url, init);
    status = res.status;
    raw = await res.text();
  } catch (e) {
    const err = e as Error & { cause?: { message?: string } };
    if (err.name === 'TimeoutError') return text(`请求 ${tool.path} 超过 ${cfg.timeoutMs} ms 未响应`, true);
    const cause = err.cause?.message ? `（${err.cause.message}）` : '';
    return text(`请求 ${tool.path} 失败：${err.message}${cause}`, true);
  }

  const body = parseBody(raw);
  const code = body ? Number(body.code) : NaN;
  if (!body || !Number.isFinite(code)) return text(`HTTP ${status}，响应格式异常：${raw.slice(0, 200)}`, true);

  const msg = String(body.msg ?? '');
  if (code === 1) return text(JSON.stringify({ code, msg, data: body.data ?? null }));
  if (code === 401 || code === 403 || status === 401) {
    return text(`token 无效或已过期（${msg}）。请重新调用 externalapi/user/login 获取 token，更新 QQDL_TOKEN 后重启本 MCP。`, true);
  }
  if (msg.includes('访问频繁')) return text(`${msg} 后端限流为每个接口每 IP 每分钟 180 次，请稍后重试。`, true);
  return text(body.data == null ? msg : `${msg}\n${JSON.stringify(body.data)}`, true);
}
