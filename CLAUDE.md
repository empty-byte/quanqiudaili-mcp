# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目是什么

全球代理（quanqiudaili.com）对外 HTTP 接口 `externalapi` 的 MCP 服务器。TypeScript，官方 MCP SDK v2（`@modelcontextprotocol/server` 2.x），仅 stdio。两种启动模式：`query`（19 个只读工具）、`manage`（全部 33 个，含下单扣费与删除）。参数业务校验、鉴权、扣费都在 PHP 后端，本项目只是 HTTP 客户端，不改后端。面向其他使用者，环境要求与命令示例不以某台开发机为准。

## 常用命令

- `npm ci`：安装并自动构建（`prepare` 跑 `tsc`，输出到 `dist/`）。
- `npm test`：构建 + 全部测试。不联网，端到端测试起本地假后端。
- `npx vitest run test/http.test.ts`：跑单个测试文件；`npx vitest run test/spec.test.ts -u` 更新快照。
- `npm run build-spec`：用本地 `spec/pages/` 重新生成 `spec/tools.json`，不联网。
- `npm run sync-docs`：联网重新下载文档站全部接口页到 `spec/pages/`，随后自动 build-spec 并打印与上一版的差异。
- 本机若装了 RTK hook，`npx vitest` 的输出会被改写成看不到结果，改用 `rtk proxy npm test` 或 `rtk proxy npx vitest run …`。
- 运行：`node dist/src/index.js query|manage`。环境变量 `QQDL_TOKEN`（必填）、`QQDL_BASE_URL`（默认线上）、`QQDL_TIMEOUT_MS`。

## 架构：两条链路

开发期（生成链路）：文档站 `llms.txt` → `scripts/sync-docs.ts` 下载 85 个接口页（每页一个 OpenAPI 3.0.1 YAML 块）→ `scripts/lib/merge.ts` 按接口路径合并变体页、应用 `spec/overrides.yaml` → `scripts/build-spec.ts` 写出 `spec/tools.json`。原始页和生成物都提交入库，`spec/pages/` 同时是快照测试的输入。

运行期：`src/index.ts` 只读 `spec/tools.json`，用 `fromJsonSchema()` 把每个工具的 JSON Schema 原样注册给 SDK，SDK 用内置 Ajv 在调用前校验（所有对象都 `additionalProperties: false`，写错参数名会被拒绝而不是发给后端）。`src/http.ts` 把参数经 `src/form.ts` 编成 `application/x-www-form-urlencoded`（PHP 括号格式 `content[0][id]=…`），只读工具 GET、其余 POST，再把后端 `{code,msg,time,data}` 映射成 MCP 结果。`query` 模式就是按 `readOnly` 过滤同一份工具表。运行期不 import zod、不解析 YAML、不联网拉文档。

## 改工具定义的正确姿势

不要手改 `spec/tools.json`。工具名、中文描述、只读与破坏性标注、按产品拆分、参数类型/描述/枚举/必填的修正都在 `spec/overrides.yaml`，按接口路径做 key；改完 `npm run build-spec`，再 `npm test`，快照变化合理就 `-u`。`test/spec.test.ts` 会校验 `tools.json` 与当前生成结果一致，忘了重生成会红。

合并规则要点（细节见 `docs/2026-09-24-设计方案.md` 第 3 节）：同路径各页参数取并集；顶层参数要在全部变体页都必填才必填，部分必填写进描述；`product_type_id` 强制 integer，枚举取各页"此处固定为 N"；`name[0][key]` 转对象数组，`name[]` 转数组；描述去掉 HTML 标签。文档站新增接口会让生成失败并列出路径，把它加进 overrides 或 `ignore`。文档缺陷的兜底条目在 overrides 里带"文档缺陷兜底"注释，并登记到设计文档第 11 节，文档站修好后删除。

## 后端事实（已对照 proxy-distribution-system 源码核实）

- token 放请求头 `token`。成功 `{code:1,…}`；业务错误 HTTP 200 `{code:0,msg}`；未登录 HTTP 401 `{code:401,msg:"请先登录"}`；限流 `{code:0,msg:"访问频繁,请稍后再试!"}`，每接口每 IP 每分钟 180 次。
- 所有查询接口用 `request->param()` 取参，GET 和 POST 都收，所以"查询一律 GET"是安全的。
- `product_type_id`：1 动态住宅流量不限时长、6 动态住宅流量包月、2 静态住宅普通、3 静态住宅原生、4 静态住宅运营商原生、8 数据中心。
- `createBandwidthUpgradeOrder` 的 `pay_method` 固定 `balance`，用 overrides 的 `fixed` 加 `drop` 实现。

## 规则

- stdout 是 MCP 协议通道，日志只用 `console.error`。token 不进日志、不进返回给模型的错误文本。
- 自动化测试不打线上。新增子账号、下单、续费、退单、删除等会在后端创建或删除数据的操作，只由维护者用测试账号手动验证，Claude 不代跑；只读工具和 `sub_account_update` 改备注可以联调。清单在 `docs/2026-09-24-联调记录.md`。
- 注释只写后来者不查资料就能懂的"为什么"，不复述库函数行为、协议版本或 SDK 内部术语；仓库没有 eslint，不写 eslint 指令。

## 文档

`docs/2026-09-24-设计方案.md` 是规格，`docs/2026-09-24-实施计划.md` 是实施计划与实施后修订说明，`docs/2026-09-24-联调记录.md` 是联调清单与结果。
