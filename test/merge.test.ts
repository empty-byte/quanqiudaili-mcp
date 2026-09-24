import { describe, expect, it } from 'vitest';
import { buildTools, loadOverrides, mergeGroup, parsePage, placePages, tokens, type Page, type ToolOverride } from '../scripts/lib/merge.js';
import type { JsonSchema } from '../src/types.js';

type P = [name: string, required: boolean, type?: JsonSchema['type'], description?: string];
const page = (id: string, path: string, pid: number | undefined, params: P[]): Page => ({
  id, path, summary: 's', productTypeId: pid,
  params: params.map(([name, required, type = 'string', description = '']) => ({ name, required, schema: { type }, description })),
});
const ov = (name: string, extra: Partial<ToolOverride> = {}): ToolOverride => ({ name, title: name, description: 'd', ...extra });

describe('tokens', () => {
  it('拆开括号参数名', () => {
    expect(tokens('content[0][id]')).toEqual(['content', '0', 'id']);
    expect(tokens('ids[]')).toEqual(['ids', '']);
    expect(tokens('page')).toEqual(['page']);
  });
});

describe('mergeGroup', () => {
  it('括号参数转成对象数组，index 0 的必填决定 items.required 与顶层必填', () => {
    const t = mergeGroup([page('a', '/p', 1, [
      ['product_type_id', true, 'integer'], ['content[0][id]', true], ['content[0][name]', true], ['content[1][id]', false],
    ])], ov('x'));
    expect(t.inputSchema.properties.content).toEqual({
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'string' }, name: { type: 'string' } },
        required: ['id', 'name'],
        additionalProperties: false,
      },
    });
    expect(t.inputSchema.required).toEqual(['product_type_id', 'content']);
    expect(t.inputSchema.additionalProperties).toBe(false);
  });

  it('ids[] 与 searchArr[0] 变成标量数组，array 类型取 items', () => {
    const p = page('a', '/p', 2, [['ids[]', false, 'array'], ['searchArr[0]', false], ['searchArr[1]', false]]);
    const t = mergeGroup([p], ov('x'));
    expect(t.inputSchema.properties.ids).toEqual({ type: 'array', items: { type: 'string' } });
    expect(t.inputSchema.properties.searchArr).toEqual({ type: 'array', items: { type: 'string' } });
  });

  it('必填取所有变体的交集，部分必填写进描述；product_type_id 得到枚举与标签', () => {
    const t = mergeGroup([
      page('a', '/p', 1, [['product_type_id', true, 'integer'], ['num', true, 'integer']]),
      page('b', '/p', 6, [['product_type_id', true, 'integer'], ['num', true, 'integer'], ['bill_timelen', true, 'integer', '包月月数']]),
    ], ov('x'));
    expect(t.inputSchema.required).toEqual(['product_type_id', 'num']);
    expect(t.inputSchema.properties.bill_timelen.description).toBe('包月月数。产品 6 下必填');
    expect(t.inputSchema.properties.product_type_id).toEqual({
      type: 'integer', enum: [1, 6], description: '产品类型：1=动态住宅流量（不限时长），6=动态住宅流量（包月）',
    });
  });

  it('类型冲突时 integer 优先，描述取最长的一条', () => {
    const t = mergeGroup([
      page('a', '/p', 1, [['id', true, 'string', '子账号id']]),
      page('b', '/p', 6, [['id', true, 'integer', '子账号 id，见子账号列表']]),
    ], ov('x'));
    expect(t.inputSchema.properties.id).toEqual({ type: 'integer', description: '子账号 id，见子账号列表' });
  });

  it('country/country_code 追加 ISO 说明，pagesize 追加最大 100', () => {
    const t = mergeGroup([page('a', '/p', 2, [['country_code', true, 'string', '国家编码'], ['pagesize', false, 'integer', '每页数量']])], ov('x'));
    expect(t.inputSchema.properties.country_code.description).toBe('国家编码。国家用 ISO 3166-1 二字码，如 US');
    expect(t.inputSchema.properties.pagesize.description).toBe('每页数量，最大 100');
  });

  it('overrides 的 drop、params、fixed、readOnly 生效，readOnly 决定动词', () => {
    const p = page('a', '/p', undefined, [['pay_method', false], ['bandwidth_num', false, 'string'], ['product_type_id', false, 'string', '产品类型']]);
    const t = mergeGroup([p], ov('x', {
      readOnly: true, fixed: { pay_method: 'balance' }, drop: ['pay_method'],
      params: { bandwidth_num: { type: 'integer', required: true }, product_type_id: { enum: [2, 3, 4, 8] } },
    }));
    expect(t.inputSchema.properties.pay_method).toBeUndefined();
    expect(t.fixed).toEqual({ pay_method: 'balance' });
    expect(t.inputSchema.properties.bandwidth_num.type).toBe('integer');
    expect(t.inputSchema.required).toEqual(['bandwidth_num', 'product_type_id']);
    expect(t.inputSchema.properties.product_type_id.enum).toEqual([2, 3, 4, 8]);
    expect(t.method).toBe('GET');
  });

  it('同一参数一页写成 array 一页写成标量时取标量并丢掉 items', () => {
    const t = mergeGroup([
      page('a', '/p', 2, [['page', false, 'array']]),
      page('b', '/p', 3, [['page', false, 'string', '分页']]),
    ], ov('x'));
    expect(t.inputSchema.properties.page).toEqual({ type: 'string', description: '分页' });
  });

  it('overrides 引用文档里不存在的参数时报错', () => {
    expect(() => mergeGroup([page('a', '/p', 1, [])], ov('x', { params: { nope: { type: 'integer' } } }))).toThrow(/nope/);
  });
});

describe('buildTools', () => {
  it('未配置的路径报错并列出路径；ignore 的路径跳过', () => {
    const pages = [page('a', '/externalapi/new/thing', 1, []), page('b', '/externalapi/user/login', undefined, [])];
    expect(() => buildTools(pages, { ignore: ['/externalapi/user/login'], tools: {} })).toThrow(/\/externalapi\/new\/thing/);
  });

  it('split 按 product_type_id 分组生成多个工具，结果按名字排序', () => {
    const pages = [
      page('a', '/buy', 1, [['product_type_id', true, 'integer'], ['num', true, 'integer']]),
      page('b', '/buy', 6, [['product_type_id', true, 'integer'], ['num', true, 'integer'], ['bill_timelen', false, 'integer']]),
      page('c', '/buy', 2, [['product_type_id', true, 'integer'], ['num', true, 'integer'], ['timelen', true, 'integer']]),
    ];
    const tools = buildTools(pages, { ignore: [], tools: { '/buy': { split: [
      { ...ov('order_buy_time_ip'), productTypeIds: [2, 3, 4, 8] },
      { ...ov('order_buy_dynamic'), productTypeIds: [1, 6] },
    ] } } });
    expect(tools.map(t => t.name)).toEqual(['order_buy_dynamic', 'order_buy_time_ip']);
    expect(Object.keys(tools[0].inputSchema.properties)).toEqual(['product_type_id', 'num', 'bill_timelen']);
    expect(tools[1].inputSchema.properties.product_type_id.enum).toEqual([2]);
  });

  it('split 漏掉页面时报错', () => {
    const pages = [page('a', '/buy', 1, [['product_type_id', true, 'integer']]), page('c', '/buy', 2, [['product_type_id', true, 'integer']])];
    expect(() => buildTools(pages, { ignore: [], tools: { '/buy': { split: [{ ...ov('x'), productTypeIds: [1] }] } } })).toThrow(/未被拆分规则覆盖/);
  });
});

describe('parsePage', () => {
  it('提取 path、summary、固定产品类型，跳过 header 参数，合并 query 与 body', () => {
    const md = [
      '# 标题', '', '```yaml', 'openapi: 3.0.1', 'paths:', '  /externalapi/device/accountList:', '    get:', '      summary: 列表',
      '      tags:', '        - 用户IP子账号管理/动态住宅流量子账号（不限时长）',
      '      x-run-in-apifox: https://app.apifox.com/web/project/5275065/apis/api-222033931-run', '      parameters:', '        - name: product_type_id', '          in: query', '          description: 产品类型id，此处固定类别为：1',
      '          required: true', '          schema:', '            type: integer', '        - name: token', '          in: header',
      '          schema:', '            type: string', '      requestBody:', '        content:', '          application/x-www-form-urlencoded:',
      '            schema:', '              type: object', '              properties:', '                remark:', '                  type: string',
      '                  description: 备注', '              required:', '                - remark', '```', '',
    ].join('\n');
    const p = parsePage('1e0', md);
    expect(p).toMatchObject({ id: '1e0', path: '/externalapi/device/accountList', summary: '列表', productTypeId: 1, tag: '用户IP子账号管理/动态住宅流量子账号（不限时长）', apiId: '222033931' });
    expect(p.params).toEqual([
      { name: 'product_type_id', required: true, schema: { type: 'integer' }, description: '产品类型id，此处固定类别为：1' },
      { name: 'remark', required: true, schema: { type: 'string' }, description: '备注' },
    ]);
  });
});

describe('placePages', () => {
  const p = (id: string, path: string, tag?: string, apiId?: string): Page => ({ id, path, summary: 's', tag, apiId, params: [] });
  const files = (...pages: Page[]) => [...placePages(pages).keys()];

  it('目录按文档站分组映射成英文名，产品分组带 product_type_id 前缀，文件名取接口路径，分组名里的空格忽略', () => {
    expect(files(p('1e0', '/externalapi/device/accountList', '用户IP子账号管理/动态住宅流量子账号 （包月）'))).toEqual(['6-dynamic-monthly/device-accountList.md']);
    expect(files(p('2e0', '/externalapi/order_back/createOrderBack', '用户IP子账号管理/静态住宅（运营商原生）时长子账号'))).toEqual(['4-static-isp-native/order_back-createOrderBack.md']);
  });

  it('非产品分组也走映射表', () => {
    expect(files(p('3e0', '/externalapi/bandwidth/getBandwidthList', '增值带宽'))).toEqual(['bandwidth/bandwidth-getBandwidthList.md']);
  });

  it('未登记的分组报错', () => {
    expect(() => files(p('4e0', '/externalapi/device/accountList', '用户IP子账号管理/移动住宅子账号'))).toThrow(/未登记的文档分组/);
  });

  it('同一分组同一接口有多页时都带 Apifox 页面 id 后缀', () => {
    expect(files(
      p('a', '/externalapi/product_order/createRenewProductBuyOrder', '用户IP子账号管理/数据中心时长子账号', '222489108'),
      p('b', '/externalapi/product_order/createRenewProductBuyOrder', '用户IP子账号管理/数据中心时长子账号', '313083924'),
      p('c', '/externalapi/device/accountList', '用户IP子账号管理/数据中心时长子账号', '222488896'),
    )).toEqual([
      '8-datacenter/product_order-createRenewProductBuyOrder.222489108.md',
      '8-datacenter/product_order-createRenewProductBuyOrder.313083924.md',
      '8-datacenter/device-accountList.md',
    ]);
  });
});

describe('parsePage 描述清理', () => {
  it('描述里的 HTML 标签被去掉', () => {
    const md = [
      '```yaml', 'paths:', '  /p:', '    get:', '      summary: s', '      parameters:', '        - name: country', '          in: query',
      "          description: 国家编码。可从<a href='/x' target='_blank'>国家列表</a>获取", '          schema:', '            type: string', '```',
    ].join('\n');
    expect(parsePage('1', md).params[0].description).toBe('国家编码。可从国家列表获取');
  });
});

describe('loadOverrides', () => {
  it('缺 name/title/description 时报错', () => {
    expect(() => loadOverrides('tools:\n  /p:\n    name: x\n')).toThrow(/\/p 缺 title/);
  });
});
