import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const ENTRY = 'dist/src/index.js';

type Hit = { url: string; method: string; body: string; token?: string };
const hits: Hit[] = [];
let baseUrl = '';

const backend = createServer((req, res) => {
  let body = '';
  req.on('data', c => (body += c));
  req.on('end', () => {
    hits.push({ url: req.url ?? '', method: req.method ?? '', body, token: req.headers.token as string | undefined });
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ code: 1, msg: 'ok', time: '1', data: { echo: true } }));
  });
});

beforeAll(async () => {
  await new Promise<void>(r => backend.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${(backend.address() as { port: number }).port}`;
});
afterAll(() => backend.close());

async function connect(args: string[]): Promise<Client> {
  const client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: [ENTRY, ...args],
    env: { ...(process.env as Record<string, string>), QQDL_TOKEN: 'test-token', QQDL_BASE_URL: baseUrl },
    stderr: 'ignore',
  }));
  return client;
}

const textOf = (r: { content?: unknown }) => ((r.content as { text: string }[])[0]).text;

describe('stdio server', () => {
  it('不带参数暴露全部 33 个工具，扣费与删除工具带 destructiveHint', async () => {
    const c = await connect([]);
    const { tools } = await c.listTools();
    expect(tools).toHaveLength(33);
    const buy = tools.find(t => t.name === 'order_buy_time_ip');
    expect(buy?.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true, idempotentHint: false });
    await c.close();
  }, 20_000);

  it('--readonly 只暴露 19 个只读工具与 1 个资源', async () => {
    const c = await connect(['--readonly']);
    const { tools } = await c.listTools();
    expect(tools).toHaveLength(19);
    expect(tools.every(t => t.annotations?.readOnlyHint === true)).toBe(true);
    expect(tools.find(t => t.name === 'sub_account_list')?.inputSchema.required).toEqual(['product_type_id', 'page', 'pagesize']);

    const { resources } = await c.listResources();
    expect(resources.map(r => r.uri)).toEqual(['quanqiudaili://docs/dynamic-proxy-session']);
    const read = await c.readResource({ uri: 'quanqiudaili://docs/dynamic-proxy-session' });
    expect((read.contents[0] as { text: string }).text).toContain('ss');
    await c.close();
  }, 20_000);

  it('旧写法 query 等价于 --readonly', async () => {
    const c = await connect(['query']);
    expect((await c.listTools()).tools).toHaveLength(19);
    await c.close();
  }, 20_000);

  it('调用工具：GET 带 query 与 token；POST 走表单并展开括号参数', async () => {
    const c = await connect([]);
    hits.length = 0;

    const r1 = await c.callTool({ name: 'sub_account_list', arguments: { product_type_id: 1, page: 1, pagesize: 10 } });
    expect(r1.isError).toBeFalsy();
    expect(JSON.parse(textOf(r1))).toEqual({ code: 1, msg: 'ok', data: { echo: true } });
    expect(hits[0]).toMatchObject({ method: 'GET', url: '/externalapi/device/accountList?product_type_id=1&page=1&pagesize=10', token: 'test-token' });

    await c.callTool({
      name: 'sub_account_set_credentials',
      arguments: { product_type_id: 1, content: [{ id: 32, customUsername: 'user0001', customPassword: 'pass0001' }] },
    });
    expect(hits[1].method).toBe('POST');
    expect(hits[1].url).toBe('/externalapi/device/batchUpdateSubAccountUsernamePassword');
    expect(decodeURIComponent(hits[1].body)).toBe('product_type_id=1&content[0][id]=32&content[0][customUsername]=user0001&content[0][customPassword]=pass0001');
    await c.close();
  }, 20_000);

  it('参数不符合 schema 时 SDK 直接返回 isError 且不请求后端；未知工具在客户端抛协议错误', async () => {
    const c = await connect([]);
    hits.length = 0;
    const bad = await c.callTool({ name: 'sub_account_update_batch', arguments: { product_type_id: 1, ids: [1, 2] } });
    expect(bad.isError).toBe(true);
    expect(textOf(bad)).toMatch(/must be string/);
    expect(hits).toHaveLength(0);
    await expect(c.callTool({ name: 'no_such_tool', arguments: {} })).rejects.toThrow(/not found/);
    await c.close();
  }, 20_000);

  it('写错的参数名被 schema 拦截，不会发给后端', async () => {
    const c = await connect(['--readonly']);
    hits.length = 0;
    const r = await c.callTool({ name: 'sub_account_list', arguments: { product_type_id: 1, page: 1, pagesize: 10, page_size: 10 } });
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/additional properties/);
    expect(hits).toHaveLength(0);
    await c.close();
  }, 20_000);

  it('setup 子命令打印各客户端的配置片段并以 0 退出，不需要 token 环境变量', () => {
    const r = spawnSync(process.execPath, [ENTRY, 'setup', '--token', 'abc'], { encoding: 'utf8', env: { ...process.env, QQDL_TOKEN: '' } });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('claude mcp add');
    expect(r.stdout).toContain('QQDL_TOKEN=abc');
    expect(r.stdout).toContain('context_servers');
    expect(r.stdout).toContain('dist/src/index.js');
  });

  it('参数不认识或缺少 QQDL_TOKEN 时以退出码 2 结束并给出提示', () => {
    const bad = spawnSync(process.execPath, [ENTRY, 'bogus'], { encoding: 'utf8' });
    expect(bad.status).toBe(2);
    expect(bad.stderr).toContain('用法');

    const noToken = spawnSync(process.execPath, [ENTRY], { encoding: 'utf8', env: { ...process.env, QQDL_TOKEN: '' } });
    expect(noToken.status).toBe(2);
    expect(noToken.stderr).toContain('QQDL_TOKEN');
  });
});
