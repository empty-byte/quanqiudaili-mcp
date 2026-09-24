import { parse as parseYaml } from 'yaml';
import type { JsonSchema, ToolDef } from '../../src/types.js';

export interface RawParam { name: string; required: boolean; schema: JsonSchema; description: string }
export interface Page { id: string; path: string; summary: string; tag?: string; apiId?: string; productTypeId?: number; params: RawParam[] }
export type ParamOverride = Partial<Omit<JsonSchema, 'required'>> & { required?: boolean };
export interface ToolOverride {
  name: string;
  title: string;
  description: string;
  readOnly?: boolean;
  destructive?: boolean;
  fixed?: Record<string, string | number>;
  drop?: string[];
  params?: Record<string, ParamOverride>;
}
export interface SplitPart extends ToolOverride { productTypeIds: number[] }
export interface Overrides { ignore: string[]; tools: Record<string, ToolOverride | { split: SplitPart[] }> }

export const PRODUCT_LABELS: Record<number, string> = {
  1: '动态住宅流量（不限时长）', 6: '动态住宅流量（包月）', 2: '静态住宅（普通）',
  3: '静态住宅（原生）', 4: '静态住宅（运营商原生）', 8: '数据中心',
};
const ALL_PRODUCTS = [1, 2, 3, 4, 6, 8];

// 文档 YAML 是外部输入，字段形状不受我们控制，解析阶段用 any
type Any = any;

/** 文档描述里夹着 <a href> 之类的 HTML，对模型是噪音，统一去掉 */
const clean = (d: unknown): string => String(d ?? '').replace(/<[^>]+>/g, '').trim();

export function parsePage(id: string, md: string): Page {
  const m = md.match(/```yaml\r?\n([\s\S]*?)```/);
  if (!m) throw new Error(`${id}: 页面里没有 yaml 块`);
  const doc = parseYaml(m[1]) as Any;
  const entries = Object.entries(doc?.paths ?? {});
  if (entries.length !== 1) throw new Error(`${id}: 期望恰好一个 path，实际 ${entries.length}`);
  const [path, ops] = entries[0] as [string, Any];
  const op = Object.values(ops)[0] as Any;

  const params: RawParam[] = [];
  for (const p of op.parameters ?? []) {
    if (p.in === 'header') continue;
    params.push({ name: p.name, required: !!p.required, schema: pick(p.schema ?? {}), description: clean(p.description) });
  }
  const body = op.requestBody?.content?.['application/x-www-form-urlencoded']?.schema;
  const bodyRequired: string[] = body?.required ?? [];
  for (const [name, s] of Object.entries<Any>(body?.properties ?? {})) {
    if (params.some(q => q.name === name)) continue; // 同一页 query 与 body 重复声明时只留一份
    params.push({ name, required: bodyRequired.includes(name), schema: pick(s), description: clean(s.description) });
  }
  const pid = params.find(p => p.name === 'product_type_id');
  const fixed = pid?.description.match(/固定(?:类别)?为[：:]\s*(\d+)/);
  const tag = op.tags?.[0];
  const apiId = String(op['x-run-in-apifox'] ?? '').match(/api-(\d+)-run/)?.[1];
  return {
    id, path, summary: String(op.summary ?? '').trim(), tag: tag === undefined ? undefined : String(tag), apiId,
    productTypeId: fixed ? Number(fixed[1]) : undefined, params,
  };
}

// 文档站左侧分组 → 目录名，产品分组带 product_type_id 前缀。有 19 页参数描述里没写"固定为 N"，但分组都归属明确，所以目录按分组走；
// 文档站新增分组时这里会报错，补一行即可
const TAG_DIR: Record<string, string> = {
  '用户IP子账号管理/动态住宅流量子账号（不限时长）': '1-dynamic-no-expiry',
  '用户IP子账号管理/动态住宅流量子账号（包月）': '6-dynamic-monthly',
  '用户IP子账号管理/静态住宅（普通非原生）时长子账号': '2-static-standard',
  '用户IP子账号管理/静态住宅（原生）时长子账号': '3-static-native',
  '用户IP子账号管理/静态住宅（运营商原生）时长子账号': '4-static-isp-native',
  '用户IP子账号管理/数据中心时长子账号': '8-datacenter',
  'Token管理': 'token', '用户管理': 'user', '工具管理': 'tool', '增值带宽': 'bandwidth',
};

/** 全部页面在 spec/pages/ 下的位置：`分组目录/控制器-方法.md`；同一分组同一接口有多页时带上 Apifox 页面 id 区分 */
export function placePages(pages: Page[]): Map<string, Page> {
  const stems = pages.map(p => {
    const tag = (p.tag ?? '').replace(/\s+/g, '');
    const dir = TAG_DIR[tag];
    if (!dir) throw new Error(`${p.id}: 未登记的文档分组「${tag}」，请在 TAG_DIR 补上目录名`);
    return `${dir}/${p.path.replace(/^\/externalapi\//, '').replace(/\//g, '-')}`;
  });
  const count = new Map<string, number>();
  for (const stem of stems) count.set(stem, (count.get(stem) ?? 0) + 1);
  return new Map(pages.map((p, i) => [`${stems[i]}${count.get(stems[i])! > 1 ? `.${p.apiId ?? p.id}` : ''}.md`, p]));
}

function pick(s: Any): JsonSchema {
  const out: JsonSchema = {};
  if (typeof s.type === 'string') out.type = s.type;
  if (s.items?.type) out.items = { type: s.items.type };
  if (Array.isArray(s.enum)) out.enum = s.enum;
  return out;
}

/** content[0][id] → ['content','0','id']；ids[] → ['ids','']；page → ['page'] */
export function tokens(name: string): string[] {
  const m = name.match(/^([^[]+)((?:\[[^\]]*\])*)$/);
  if (!m) return [name];
  return [m[1], ...[...m[2].matchAll(/\[([^\]]*)\]/g)].map(x => x[1])];
}

const isIndex = (s: string): boolean => s === '' || /^\d+$/.test(s);
const TYPE_RANK: Record<string, number> = { integer: 0, number: 1, boolean: 2, string: 3, array: 4, object: 5 };

function pickType(a?: JsonSchema['type'], b?: JsonSchema['type']): JsonSchema['type'] {
  if (!a) return b;
  if (!b) return a;
  return (TYPE_RANK[a] ?? 9) <= (TYPE_RANK[b] ?? 9) ? a : b;
}

function insert(node: JsonSchema, segs: string[], leaf: JsonSchema): void {
  if (segs.length === 0) {
    node.type = pickType(node.type, leaf.type);
    if (node.type !== 'array') delete node.items; // 某页把标量误写成 array 时，以标量为准
    if (node.type !== 'object') delete node.properties;
    if (leaf.description && (!node.description || leaf.description.length > node.description.length)) node.description = leaf.description;
    if (leaf.enum) node.enum = [...new Set([...(node.enum ?? []), ...leaf.enum])];
    return;
  }
  const [s, ...rest] = segs;
  if (isIndex(s)) {
    if (node.type && node.type !== 'array') return; // 标量已定，忽略把它写成 array 的变体
    node.type = 'array';
    insert((node.items ??= {}), rest, leaf);
  } else {
    node.type = 'object';
    node.properties ??= {};
    insert((node.properties[s] ??= {}), rest, leaf);
  }
}

function locate(root: JsonSchema, base: string, segs: string[]): JsonSchema | undefined {
  let node = root.properties?.[base];
  for (const s of segs) {
    if (!node) return undefined;
    node = isIndex(s) ? node.items : node.properties?.[s];
  }
  return node;
}

interface Track { requiredIn: Set<string>; seenIn: Set<string> }
const trackKey = (base: string, segs: string[]): string => [base, ...segs.map(s => (isIndex(s) ? '[]' : s))].join('.');
function getTrack(track: Map<string, Track>, key: string): Track {
  let t = track.get(key);
  if (!t) track.set(key, (t = { requiredIn: new Set(), seenIn: new Set() }));
  return t;
}

function appendNote(s: JsonSchema, note: string): void {
  s.description = s.description ? `${s.description}。${note}` : note;
}

function finalizeNested(node: JsonSchema, key: string, track: Map<string, Track>): void {
  if (node.type === 'array' && node.items) finalizeNested(node.items, `${key}.[]`, track);
  if (node.type === 'object' && node.properties) {
    node.additionalProperties = false;
    const req = Object.keys(node.properties).filter(k => {
      const t = track.get(`${key}.${k}`);
      return !!t && t.seenIn.size > 0 && [...t.seenIn].every(x => t.requiredIn.has(x));
    });
    if (req.length) node.required = req;
    for (const [k, child] of Object.entries(node.properties)) finalizeNested(child, `${key}.${k}`, track);
  }
}

export function mergeGroup(pages: Page[], ov: ToolOverride): ToolDef {
  const props: Record<string, JsonSchema> = {};
  const root: JsonSchema = { type: 'object', properties: props };
  const track = new Map<string, Track>();
  const pageKeys = pages.map(p => String(p.productTypeId ?? p.id));

  // 1. 合并全部变体页
  for (const page of pages) {
    const key = String(page.productTypeId ?? page.id);
    for (const raw of page.params) {
      if (ov.drop?.includes(raw.name)) continue;
      const [base, ...segs] = tokens(raw.name);
      let leaf: JsonSchema = { ...raw.schema };
      if (leaf.type === 'array') {
        leaf = leaf.items ?? { type: 'string' };
        if (segs.length === 0) segs.push('');
      }
      if (raw.description) leaf.description = raw.description;
      // 只有下标段全是 0 或空的路径才算数：content[1][id] 不影响 content 的必填；键名段（id）不参与判断
      const primary = segs.filter(isIndex).every(s => s === '' || s === '0');
      for (let i = 0; i <= segs.length; i++) {
        const t = getTrack(track, trackKey(base, segs.slice(0, i)));
        t.seenIn.add(key);
        if (raw.required && primary) t.requiredIn.add(key);
      }
      insert((props[base] ??= {}), segs, leaf);
    }
  }

  // 2. 参数级 overrides
  for (const [rawName, o] of Object.entries(ov.params ?? {})) {
    const [base, ...segs] = tokens(rawName);
    const node = locate(root, base, segs);
    if (!node) throw new Error(`${ov.name}: overrides 参数 ${rawName} 在文档里不存在`);
    const { required, ...rest } = o;
    Object.assign(node, rest);
    if (required !== undefined) {
      const all = required ? new Set(pageKeys) : new Set<string>();
      getTrack(track, trackKey(base, [])).requiredIn = new Set(all);
      getTrack(track, trackKey(base, segs)).requiredIn = new Set(all);
    }
  }

  // 3. product_type_id：整数、必填、枚举与中文标签
  const pid = props.product_type_id;
  if (pid) {
    pid.type = 'integer';
    const derived = pages.every(p => p.productTypeId !== undefined)
      ? [...new Set(pages.map(p => p.productTypeId as number))].sort((a, b) => a - b)
      : undefined;
    const en = (ov.params?.product_type_id?.enum as number[] | undefined) ?? derived;
    if (en) pid.enum = en;
    else delete pid.enum;
    pid.description = '产品类型：' + (en ?? ALL_PRODUCTS).map(id => `${id}=${PRODUCT_LABELS[id] ?? id}`).join('，');
    getTrack(track, 'product_type_id').requiredIn = new Set(pageKeys);
  }

  // 4. 通用描述补充
  for (const [name, s] of Object.entries(props)) {
    if ((name === 'country' || name === 'country_code') && !/ISO/.test(s.description ?? '')) appendNote(s, '国家用 ISO 3166-1 二字码，如 US');
    if (name === 'pagesize' && !/100/.test(s.description ?? '')) s.description = `${s.description ?? '每页数量'}，最大 100`;
  }

  // 5. 必填：顶层要在全部变体都必填；部分必填写进描述
  const numericKeys = pageKeys.every(k => /^\d+$/.test(k));
  const required: string[] = [];
  for (const [name, s] of Object.entries(props)) {
    const t = getTrack(track, name);
    if (pageKeys.every(k => t.requiredIn.has(k))) required.push(name);
    else if (t.requiredIn.size && numericKeys) appendNote(s, `产品 ${[...t.requiredIn].map(Number).sort((a, b) => a - b).join('、')} 下必填`);
    finalizeNested(s, name, track);
  }

  return {
    name: ov.name,
    title: ov.title,
    description: ov.description,
    readOnly: !!ov.readOnly,
    destructive: !!ov.destructive,
    method: ov.readOnly ? 'GET' : 'POST',
    path: pages[0].path,
    ...(ov.fixed ? { fixed: ov.fixed } : {}),
    inputSchema: { type: 'object', properties: props, required, additionalProperties: false },
  };
}

export function buildTools(pages: Page[], ov: Overrides): ToolDef[] {
  const byPath = new Map<string, Page[]>();
  for (const p of pages) byPath.set(p.path, [...(byPath.get(p.path) ?? []), p]);

  const missing = [...byPath.keys()].filter(p => !ov.ignore.includes(p) && !ov.tools[p]);
  if (missing.length) throw new Error(`overrides.yaml 缺少这些路径的配置（文档新增了接口？）：\n${missing.join('\n')}`);
  for (const p of Object.keys(ov.tools)) if (!byPath.has(p)) console.error(`警告：overrides 里的 ${p} 在文档中已不存在`);

  const tools: ToolDef[] = [];
  for (const [path, group] of byPath) {
    const o = ov.tools[path];
    if (!o) continue;
    if ('split' in o) {
      const covered = (p: Page) => o.split.some(s => p.productTypeId !== undefined && s.productTypeIds.includes(p.productTypeId));
      const unassigned = group.filter(p => !covered(p));
      if (unassigned.length) throw new Error(`${path} 有页面未被拆分规则覆盖：${unassigned.map(p => p.id).join(', ')}`);
      for (const part of o.split) {
        const sub = group.filter(p => p.productTypeId !== undefined && part.productTypeIds.includes(p.productTypeId));
        if (!sub.length) throw new Error(`${path} 的拆分 ${part.name} 没有匹配到任何页面`);
        tools.push(mergeGroup(sub, part));
      }
    } else {
      tools.push(mergeGroup(group, o));
    }
  }
  const dup = tools.map(t => t.name).filter((n, i, a) => a.indexOf(n) !== i);
  if (dup.length) throw new Error(`工具名重复：${dup.join(', ')}`);
  return tools.sort((a, b) => a.name.localeCompare(b.name));
}

export function loadOverrides(yamlText: string): Overrides {
  const raw = parseYaml(yamlText) as Any;
  const ov: Overrides = { ignore: raw?.ignore ?? [], tools: raw?.tools ?? {} };
  const bad: string[] = [];
  for (const [path, o] of Object.entries(ov.tools)) {
    const parts: ToolOverride[] = 'split' in o ? o.split : [o];
    for (const p of parts) for (const f of ['name', 'title', 'description'] as const) if (!p[f]) bad.push(`${path} 缺 ${f}`);
  }
  if (bad.length) throw new Error(`overrides.yaml 不完整：\n${bad.join('\n')}`);
  return ov;
}
