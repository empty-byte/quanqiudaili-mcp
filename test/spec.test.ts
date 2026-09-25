import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generate, loadPages } from '../scripts/build-spec.js';
import { placePages } from '../scripts/lib/merge.js';

const tools = generate();
const byName = (n: string) => {
  const t = tools.find(x => x.name === n);
  if (!t) throw new Error(`没有工具 ${n}`);
  return t;
};

describe('spec/tools.json', () => {
  it('恰好 33 个工具，19 个只读，名字与设计文档一致', () => {
    expect(tools.map(t => t.name)).toEqual([
      'bandwidth_detail', 'bandwidth_monitoring_list', 'bandwidth_package_list', 'bandwidth_trend', 'bandwidth_upgrade_price',
      'dynamic_city_list', 'dynamic_country_list', 'dynamic_state_list',
      'order_bandwidth_upgrade', 'order_buy_dynamic', 'order_buy_test_ip', 'order_buy_time_ip', 'order_refund_apply', 'order_renew',
      'product_list', 'product_unit_price',
      'static_city_list', 'static_country_list', 'static_ip_range_list', 'static_region_stock', 'stock_check',
      'sub_account_add', 'sub_account_delete', 'sub_account_delete_batch', 'sub_account_flow_query', 'sub_account_limit_flow',
      'sub_account_list', 'sub_account_set_credentials', 'sub_account_set_limit_flow', 'sub_account_toggle_direct',
      'sub_account_update', 'sub_account_update_batch', 'user_info',
    ]);
    expect(tools.filter(t => t.readOnly)).toHaveLength(19);
    for (const t of tools) expect(t.inputSchema.additionalProperties, t.name).toBe(false);
  });

  it('只读 GET、其余 POST；删除与扣费带 destructive', () => {
    for (const t of tools) expect(t.method, t.name).toBe(t.readOnly ? 'GET' : 'POST');
    expect(tools.filter(t => t.destructive).map(t => t.name).sort()).toEqual([
      'order_bandwidth_upgrade', 'order_buy_dynamic', 'order_buy_test_ip', 'order_buy_time_ip', 'order_renew',
      'sub_account_delete', 'sub_account_delete_batch',
    ]);
    for (const t of tools.filter(x => x.destructive)) expect(t.description, t.name).toMatch(/^(会从账户余额|不可恢复)/);
  });

  it('购买接口按产品拆成两个工具', () => {
    const dyn = byName('order_buy_dynamic');
    expect(dyn.inputSchema.properties.product_type_id.enum).toEqual([1, 6]);
    expect(Object.keys(dyn.inputSchema.properties).sort()).toEqual(['bill_timelen', 'num', 'product_type_id']);
    expect(dyn.inputSchema.required).toEqual(['product_type_id', 'num']);

    const ip = byName('order_buy_time_ip');
    expect(ip.inputSchema.properties.product_type_id.enum).toEqual([2, 3, 4, 8]);
    expect([...ip.inputSchema.required].sort()).toEqual(['agree', 'country', 'num', 'product_type_id', 'timelen']);
    expect(ip.inputSchema.properties.appoint_ip).toMatchObject({
      type: 'array',
      items: { type: 'object', properties: { ip_str: { type: 'string' }, count: { type: 'integer' } } },
    });
    expect(ip.inputSchema.properties.country.description).toMatch(/ISO 3166-1/);
  });

  it('括号参数转成结构化参数', () => {
    const cred = byName('sub_account_set_credentials');
    expect(cred.inputSchema.properties.content).toMatchObject({
      type: 'array',
      items: { type: 'object', required: ['id', 'customUsername', 'customPassword'] },
    });
    expect(cred.inputSchema.properties.content.items?.properties?.id.type).toBe('string');
    expect(cred.inputSchema.required).toEqual(['product_type_id', 'content']);

    expect(byName('order_refund_apply').inputSchema.properties.ids).toMatchObject({ type: 'array', items: { type: 'string' } });
    expect(byName('bandwidth_monitoring_list').inputSchema.properties.subAccounts).toMatchObject({ type: 'array' });
    expect(byName('sub_account_list').inputSchema.properties.searchArr).toMatchObject({ type: 'array', items: { type: 'string' } });
  });

  it('子账号列表覆盖全部产品，pagesize 注明上限', () => {
    const list = byName('sub_account_list');
    expect(list.inputSchema.properties.product_type_id.enum).toEqual([1, 2, 3, 4, 6, 8]);
    expect(list.inputSchema.required).toEqual(['product_type_id', 'page', 'pagesize']);
    expect(list.inputSchema.properties.pagesize.description).toMatch(/100/);
  });

  it('带宽升级固定余额支付且不暴露 pay_method', () => {
    const up = byName('order_bandwidth_upgrade');
    expect(up.fixed).toEqual({ pay_method: 'balance' });
    expect(up.inputSchema.properties.pay_method).toBeUndefined();
    expect([...up.inputSchema.required].sort()).toEqual(['bandwidth_num', 'product_type_id', 'subAccountIds']);
  });

  it('文档缺陷兜底生效', () => {
    const limit = byName('sub_account_set_limit_flow');
    expect(limit.inputSchema.properties.type).toMatchObject({ type: 'integer', enum: [0, 1] });
    expect(limit.inputSchema.properties.timelen.type).toBe('integer');
    expect(byName('sub_account_limit_flow').inputSchema.required).toEqual(['product_type_id', 'id']);
    expect([...byName('order_renew').inputSchema.required].sort()).toEqual(['product_type_id', 'sub_account_ids', 'timelen']);
  });

  it('子账号 id 类参数一律 string，数组元素也是；id 区间边界与订单号除外', () => {
    const idLike = (k: string) => /subAccount|sub_account|^ids?$/i.test(k) && !/Start$|End$|Name$/.test(k);
    for (const t of tools) {
      for (const [k, v] of Object.entries(t.inputSchema.properties)) {
        if (!idLike(k)) continue;
        const leaf = v.type === 'array' ? v.items : v;
        if (leaf?.type === 'object') expect(leaf.properties?.id?.type, `${t.name}.${k}[].id`).toBe('string');
        else expect(leaf?.type, `${t.name}.${k}`).toBe('string');
      }
    }
  });

  it('spec/tools.json 与当前生成结果一致（改了 overrides 要重新 npm run build-spec）', () => {
    expect(JSON.parse(readFileSync(new URL('../spec/tools.json', import.meta.url), 'utf8'))).toEqual(tools);
  });

  it('spec/pages 的目录与文件名符合 placePages 规则（sync-docs 按同一规则落盘，不要手动改名）', () => {
    const pages = loadPages();
    expect(pages).toHaveLength(85);
    for (const [file, p] of placePages(pages)) expect(file, p.id).toBe(`${p.id}.md`);
  });

  it('完整快照', () => {
    expect(tools).toMatchSnapshot();
  });
});
