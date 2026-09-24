import { describe, expect, it } from 'vitest';
import { callApi, cfgFromEnv } from '../src/http.js';
import type { ToolDef } from '../src/types.js';

const cfg = { baseUrl: 'https://example.test', token: 'tk', timeoutMs: 1000 };

const tool = (over: Partial<ToolDef> = {}): ToolDef => ({
  name: 't', title: 't', description: '', readOnly: true, destructive: false,
  method: 'GET', path: '/externalapi/user/getUserInfo',
  inputSchema: { type: 'object', properties: { ids: { type: 'string' }, page: { type: 'integer' } }, required: [], additionalProperties: false },
  ...over,
});

type Seen = { url?: string; init?: RequestInit };
const stub = (status: number, body: string, seen: Seen = {}) =>
  ((input: string | URL | Request, init?: RequestInit) => {
    seen.url = String(input);
    seen.init = init;
    return Promise.resolve(new Response(body, { status }));
  }) as typeof fetch;

const textOf = (r: { content: unknown[] }) => (r.content[0] as { text: string }).text;

describe('cfgFromEnv', () => {
  it('去掉 token 首尾空白和 baseUrl 末尾斜杠，超时默认 30000', () => {
    expect(cfgFromEnv({ QQDL_TOKEN: ' abc \n', QQDL_BASE_URL: 'https://x.test/' }))
      .toEqual({ baseUrl: 'https://x.test', token: 'abc', timeoutMs: 30000 });
  });
  it('缺 token 抛出带提示的错误', () => {
    expect(() => cfgFromEnv({})).toThrow(/QQDL_TOKEN/);
  });
});

describe('callApi', () => {
  it('GET 把参数放 query、token 放 header，code=1 返回 {code,msg,data}', async () => {
    const seen: Seen = {};
    const r = await callApi(tool(), { page: 1 }, cfg,
      stub(200, JSON.stringify({ code: 1, msg: 'ok', time: '1', data: { balance: 9 } }), seen));
    expect(seen.url).toBe('https://example.test/externalapi/user/getUserInfo?page=1');
    expect((seen.init?.headers as Record<string, string>).token).toBe('tk');
    expect(r.isError).toBeUndefined();
    expect(JSON.parse(textOf(r))).toEqual({ code: 1, msg: 'ok', data: { balance: 9 } });
  });

  it('POST 用表单编码并附加 fixed 参数', async () => {
    const seen: Seen = {};
    await callApi(tool({ method: 'POST', fixed: { pay_method: 'balance' } }), { page: 2 }, cfg,
      stub(200, '{"code":1,"msg":"","data":null}', seen));
    expect(seen.init?.method).toBe('POST');
    expect((seen.init?.headers as Record<string, string>)['content-type']).toBe('application/x-www-form-urlencoded');
    expect(seen.init?.body).toBe('page=2&pay_method=balance');
    expect(seen.url).toBe('https://example.test/externalapi/user/getUserInfo');
  });

  it('code=0 是业务错误：isError 且文本为 msg', async () => {
    const r = await callApi(tool(), {}, cfg, stub(200, '{"code":0,"msg":"数量必须在1-300之间","data":null}'));
    expect(r.isError).toBe(true);
    expect(textOf(r)).toBe('数量必须在1-300之间');
  });

  it('code 为字符串 "1" 也算成功，返回时归一为数字', async () => {
    const r = await callApi(tool(), {}, cfg, stub(200, '{"code":"1","msg":"ok","data":[]}'));
    expect(r.isError).toBeUndefined();
    expect(JSON.parse(textOf(r))).toEqual({ code: 1, msg: 'ok', data: [] });
  });

  it('HTTP 401 或 code 401 提示 token 失效，且不回显 token', async () => {
    const r = await callApi(tool(), {}, cfg, stub(401, '{"code":401,"msg":"请先登录","data":null}'));
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/token 无效或已过期.*请先登录/);
    expect(textOf(r)).not.toContain('tk');
  });

  it('限流提示附带 180 次说明', async () => {
    const r = await callApi(tool(), {}, cfg, stub(200, '{"code":0,"msg":"访问频繁,请稍后再试!","data":null}'));
    expect(textOf(r)).toMatch(/180/);
  });

  it('非 JSON 响应返回状态码与前 200 字', async () => {
    const r = await callApi(tool(), {}, cfg, stub(502, '<html>Bad Gateway</html>'));
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/^HTTP 502/);
  });

  it('网络异常映射为 isError', async () => {
    const boom = (() => Promise.reject(new Error('ECONNREFUSED'))) as unknown as typeof fetch;
    const r = await callApi(tool(), {}, cfg, boom);
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/ECONNREFUSED/);
  });

  it('HTTP 5xx 带 JSON 体但没有 code 时，返回状态码与正文片段', async () => {
    const r = await callApi(tool(), {}, cfg, stub(502, '{"error":"upstream unavailable"}'));
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/^HTTP 502/);
    expect(textOf(r)).toContain('upstream unavailable');
  });

  it('响应体是 JSON null 时不抛异常，按格式异常处理', async () => {
    const r = await callApi(tool(), {}, cfg, stub(200, 'null'));
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/^HTTP 200/);
  });

  it('HTTP 200 但 code 为 401 同样提示 token 失效', async () => {
    const r = await callApi(tool(), {}, cfg, stub(200, '{"code":401,"msg":"请先登录","data":null}'));
    expect(textOf(r)).toMatch(/token 无效或已过期/);
  });

  it('HTTP 401 但 code 不是 401 同样提示 token 失效', async () => {
    const r = await callApi(tool(), {}, cfg, stub(401, '{"code":0,"msg":"Unauthorized","data":null}'));
    expect(textOf(r)).toMatch(/token 无效或已过期/);
  });

  it('网络异常带出 Node fetch 的底层原因', async () => {
    const boom = (() => Promise.reject(Object.assign(new TypeError('fetch failed'), { cause: new Error('ECONNREFUSED 127.0.0.1:9') }))) as unknown as typeof fetch;
    const r = await callApi(tool(), {}, cfg, boom);
    expect(textOf(r)).toContain('fetch failed');
    expect(textOf(r)).toContain('ECONNREFUSED 127.0.0.1:9');
  });

  it('超时时说明超过了多少毫秒', async () => {
    const slow = (() => Promise.reject(Object.assign(new Error('The operation was aborted due to timeout'), { name: 'TimeoutError' }))) as unknown as typeof fetch;
    const r = await callApi(tool(), {}, cfg, slow);
    expect(r.isError).toBe(true);
    expect(textOf(r)).toContain('1000');
  });
});
