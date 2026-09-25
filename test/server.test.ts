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
    const data = req.url?.startsWith('/externalapi/user/getUserInfo') ? { money: '3347.42', give_money: '54.19' } : { echo: true };
    res.end(JSON.stringify({ code: 1, msg: 'ok', time: '1', data }));
  });
});

beforeAll(async () => {
  await new Promise<void>(r => backend.listen(0, '127.0.0.1', r));
  baseUrl = `http://127.0.0.1:${(backend.address() as { port: number }).port}`;
});
afterAll(() => backend.close());

type ConnectOptions = { elicit?: 'accept' | 'decline'; messages?: string[]; modern?: boolean };

async function connect(args: string[], opts: ConnectOptions = {}): Promise<Client> {
  const client = new Client({ name: 'test', version: '0.0.0' }, {
    capabilities: opts.elicit ? { elicitation: {} } : {},
    versionNegotiation: opts.modern ? { mode: 'auto' } : undefined,
  });
  if (opts.elicit) {
    client.setRequestHandler('elicitation/create', async request => {
      opts.messages?.push((request.params as { message: string }).message);
      return opts.elicit === 'accept' ? { action: 'accept', content: { confirm: true } } : { action: 'decline' };
    });
  }
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
  it('不带参数暴露全部 34 个工具，扣费与删除工具带 destructiveHint', async () => {
    const c = await connect([]);
    const { tools } = await c.listTools();
    expect(tools).toHaveLength(34);
    const buy = tools.find(t => t.name === 'order_buy_time_ip');
    expect(buy?.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true, idempotentHint: false });
    await c.close();
  }, 20_000);

  it('--readonly 只暴露 20 个只读工具与 1 个资源', async () => {
    const c = await connect(['--readonly']);
    const { tools } = await c.listTools();
    expect(tools).toHaveLength(20);
    expect(tools.every(t => t.annotations?.readOnlyHint === true)).toBe(true);
    expect(tools.find(t => t.name === 'sub_account_list')?.inputSchema.required).toEqual(['product_type_id', 'page', 'pagesize']);

    const { resources } = await c.listResources();
    expect(resources.map(r => r.uri)).toEqual(['quanqiudaili://docs/dynamic-proxy-session']);
    const read = await c.readResource({ uri: 'quanqiudaili://docs/dynamic-proxy-session' });
    expect((read.contents[0] as { text: string }).text).toContain('ss');
    await c.close();
  }, 20_000);

  it('派生工具 user_balance 只返回 data 里的 money', async () => {
    const c = await connect(['--readonly']);
    const r = await c.callTool({ name: 'user_balance', arguments: {} });
    expect(JSON.parse(textOf(r))).toEqual({ code: 1, msg: 'ok', data: '3347.42' });
    await c.close();
  }, 20_000);

  it('旧写法 query 等价于 --readonly', async () => {
    const c = await connect(['query']);
    expect((await c.listTools()).tools).toHaveLength(20);
    await c.close();
  }, 20_000);

  it('调用工具：GET 带 query 与 token；POST 走表单并展开括号参数', async () => {
    const c = await connect(['--yes']);
    hits.length = 0;

    const r1 = await c.callTool({ name: 'sub_account_list', arguments: { product_type_id: 1, page: 1, pagesize: 10 } });
    expect(r1.isError).toBeFalsy();
    expect(JSON.parse(textOf(r1))).toEqual({ code: 1, msg: 'ok', data: { echo: true } });
    expect(hits[0]).toMatchObject({ method: 'GET', url: '/externalapi/device/accountList?product_type_id=1&page=1&pagesize=10', token: 'test-token' });

    await c.callTool({
      name: 'sub_account_set_credentials',
      arguments: { product_type_id: 1, content: [{ id: '32', customUsername: 'user0001', customPassword: 'pass0001' }] },
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

describe('写操作确认', () => {
  const WRITE = { name: 'sub_account_update_batch', arguments: { product_type_id: 1, ids: '12,13', remark: '测试' } };
  const LIST = { name: 'sub_account_list', arguments: { product_type_id: 1, page: 1, pagesize: 10 } };

  it('客户端支持弹窗确认：弹窗文案含工具名与参数，用户同意后才请求后端', async () => {
    const messages: string[] = [];
    const c = await connect([], { elicit: 'accept', messages });
    hits.length = 0;
    const r = await c.callTool(WRITE);
    expect(r.isError).toBeFalsy();
    expect(JSON.parse(textOf(r))).toMatchObject({ code: 1 });
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('批量修改子账号备注（sub_account_update_batch）');
    expect(messages[0]).toContain('- product_type_id：1（动态住宅流量（不限时长））');
    expect(hits).toHaveLength(1);
    expect(decodeURIComponent(hits[0].body)).toBe('product_type_id=1&ids=12,13&remark=测试');
    await c.close();
  }, 20_000);

  it('新协议客户端同样走弹窗确认', async () => {
    const messages: string[] = [];
    const c = await connect([], { elicit: 'accept', messages, modern: true });
    hits.length = 0;
    expect((await c.callTool(WRITE)).isError).toBeFalsy();
    expect(messages).toHaveLength(1);
    expect(hits).toHaveLength(1);
    await c.close();
  }, 20_000);

  it('用户在弹窗里拒绝：不请求后端，返回取消', async () => {
    const c = await connect([], { elicit: 'decline' });
    hits.length = 0;
    const r = await c.callTool(WRITE);
    expect(r.isError).toBe(true);
    expect(textOf(r)).toContain('取消');
    expect(hits).toHaveLength(0);
    await c.close();
  }, 20_000);

  it('客户端不支持弹窗：先返回预览与确认码，带码重调才执行，确认码只能用一次', async () => {
    const c = await connect([]);
    hits.length = 0;
    const first = await c.callTool(WRITE);
    expect(first.isError).toBeFalsy();
    expect(textOf(first)).toContain('待确认');
    expect(textOf(first)).toContain('- ids：12,13');
    const token = textOf(first).match(/confirm_token=([0-9a-f]+)/)?.[1];
    expect(token).toBeTruthy();
    expect(hits).toHaveLength(0);

    const done = await c.callTool({ ...WRITE, arguments: { ...WRITE.arguments, confirm_token: token } });
    expect(done.isError).toBeFalsy();
    expect(hits).toHaveLength(1);
    expect(decodeURIComponent(hits[0].body)).toBe('product_type_id=1&ids=12,13&remark=测试');

    const reused = await c.callTool({ ...WRITE, arguments: { ...WRITE.arguments, confirm_token: token } });
    expect(reused.isError).toBe(true);
    expect(hits).toHaveLength(1);
    await c.close();
  }, 20_000);

  it('--yes 时写操作直接执行，不弹窗', async () => {
    const messages: string[] = [];
    const c = await connect(['--yes'], { elicit: 'accept', messages });
    hits.length = 0;
    expect((await c.callTool(WRITE)).isError).toBeFalsy();
    expect(messages).toHaveLength(0);
    expect(hits).toHaveLength(1);
    await c.close();
  }, 20_000);

  it('只读工具从不确认；只有写工具的 schema 带 confirm_token', async () => {
    const messages: string[] = [];
    const c = await connect([], { elicit: 'accept', messages });
    hits.length = 0;
    expect((await c.callTool(LIST)).isError).toBeFalsy();
    expect(messages).toHaveLength(0);
    expect(hits).toHaveLength(1);
    const { tools } = await c.listTools();
    expect(tools.find(t => t.name === 'sub_account_update_batch')?.inputSchema.properties).toHaveProperty('confirm_token');
    expect(tools.find(t => t.name === 'sub_account_list')?.inputSchema.properties).not.toHaveProperty('confirm_token');
    await c.close();
  }, 20_000);
});
