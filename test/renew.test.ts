import { describe, expect, it } from 'vitest';
import { fillRenewDefaults } from '../src/renew.js';
import type { ToolDef } from '../src/types.js';

const cfg = { baseUrl: 'https://example.test', token: 'tk', timeoutMs: 1000 };
const list: ToolDef = {
  name: 'sub_account_list', title: '', description: '', readOnly: true, destructive: false,
  method: 'GET', path: '/externalapi/device/accountList',
  inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },
};
const args = { product_type_id: 3, timelen: 0, sub_account_ids: '77,76' };
type Setting = { is_renew: string; renew_with_bandwidth: string };

/** 假后端：按 ids 返回各子账号的自动续费设置，记录每次请求的查询串 */
const backend = (byId: Record<string, Setting>, queries: string[] = []) =>
  ((input: string | URL) => {
    const url = new URL(String(input));
    queries.push(decodeURIComponent(url.search));
    const rows = (url.searchParams.get('ids') ?? '').split(',').filter(id => byId[id]).map(id => ({ id, ...byId[id] }));
    return Promise.resolve(new Response(JSON.stringify({ code: 1, msg: 'ok', data: { total: rows.length, rows } })));
  }) as typeof fetch;

describe('fillRenewDefaults', () => {
  it('is_renew 一律沿用子账号当前值，renew_with_bandwidth 没传也沿用；按产品与 ids 查', async () => {
    const queries: string[] = [];
    const on: Setting = { is_renew: '1', renew_with_bandwidth: '0' };
    expect(await fillRenewDefaults(args, list, cfg, backend({ 77: on, 76: on }, queries))).toEqual({ ...args, is_renew: 1, renew_with_bandwidth: 0 });
    expect(queries).toEqual(['?product_type_id=3&ids=77,76&page=1&pagesize=100&is_mcp_send=1']);
  });

  it('传了 renew_with_bandwidth 就用传的值', async () => {
    const off: Setting = { is_renew: '0', renew_with_bandwidth: '0' };
    expect(await fillRenewDefaults({ ...args, renew_with_bandwidth: 1 }, list, cfg, backend({ 77: off, 76: off })))
      .toEqual({ ...args, renew_with_bandwidth: 1, is_renew: 0 });
  });

  it('子账号之间设置不一致就报错，不续费', async () => {
    const fetchImpl = backend({ 77: { is_renew: '1', renew_with_bandwidth: '0' }, 76: { is_renew: '0', renew_with_bandwidth: '0' } });
    await expect(fillRenewDefaults(args, list, cfg, fetchImpl)).rejects.toThrow(/is_renew 设置不一致.*尚未续费/);
  });

  it('子账号不存在就报错', async () => {
    await expect(fillRenewDefaults(args, list, cfg, backend({ 77: { is_renew: '1', renew_with_bandwidth: '0' } }))).rejects.toThrow(/子账号 76 /);
  });

  it('查询失败时带出后端原因', async () => {
    const limited = (() => Promise.resolve(new Response('{"code":0,"msg":"访问频繁,请稍后再试!","data":null}'))) as typeof fetch;
    await expect(fillRenewDefaults(args, list, cfg, limited)).rejects.toThrow(/尚未续费.*访问频繁/);
  });

  it('超过 100 个子账号分批查', async () => {
    const ids = Array.from({ length: 150 }, (_, i) => String(i + 1));
    const byId = Object.fromEntries(ids.map(id => [id, { is_renew: '1', renew_with_bandwidth: '1' }]));
    const queries: string[] = [];
    const filled = await fillRenewDefaults({ ...args, sub_account_ids: ids.join(',') }, list, cfg, backend(byId, queries));
    expect(queries).toHaveLength(2);
    expect(filled).toMatchObject({ is_renew: 1, renew_with_bandwidth: 1 });
  });
});
