import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { buildSpec } from './build-spec.js';

const SITE = 'https://develop.quanqiudaili.com';
const SESSION_PAGE = '5263349m0.md'; // 动态IP Session验证。包月那页（5270947m0）内容相同，只取这一页
const PAGES = new URL('../spec/pages/', import.meta.url);

async function get(path: string): Promise<string> {
  const res = await fetch(`${SITE}/${path}`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

const llms = await get('llms.txt');
const ids = [...new Set([...llms.matchAll(/develop\.quanqiudaili\.com\/(\d+e0)\.md/g)].map(m => m[1]))];
if (ids.length < 50) throw new Error(`llms.txt 只找到 ${ids.length} 个接口页，疑似格式变化，中止`);

mkdirSync(PAGES, { recursive: true });
for (const f of readdirSync(PAGES)) {
  if (!ids.includes(f.replace(/\.md$/, ''))) {
    rmSync(new URL(f, PAGES));
    console.error(`删除已下线页面 ${f}`);
  }
}
for (let i = 0; i < ids.length; i += 5) {
  await Promise.all(ids.slice(i, i + 5).map(async id => writeFileSync(new URL(`${id}.md`, PAGES), await get(`${id}.md`))));
}
writeFileSync(new URL('../spec/dynamic-proxy-session.md', import.meta.url), await get(SESSION_PAGE));
console.error(`已下载 ${ids.length} 个接口页与 Session 说明页`);
buildSpec();
