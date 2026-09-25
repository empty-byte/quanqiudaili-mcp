# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目是什么

全球代理（quanqiudaili.com）对外 HTTP 接口 `externalapi` 的 MCP 服务器。TypeScript，官方 MCP SDK v2（`@modelcontextprotocol/server` 2.x），仅 stdio。不带参数暴露全部 34 个工具（含下单扣费与删除），`--readonly` 只暴露 20 个只读工具，旧参数 `query`/`manage` 仍接受；14 个写操作工具执行前先向用户确认（`src/confirm.ts`），`--yes` 关闭确认；`setup` 子命令打印各客户端的配置片段，不写文件。参数业务校验、鉴权、扣费都在 PHP 后端，本项目只是 HTTP 客户端，不改后端。面向其他使用者，环境要求与命令示例不以某台开发机为准。

## 常用命令

- `npm ci`：安装并自动构建（`prepare` 跑 `tsc`，输出到 `dist/`）。
- `npm test`：构建 + 全部测试。不联网，端到端测试起本地假后端。
- `npx vitest run test/http.test.ts`：跑单个测试文件；`npx vitest run test/spec.test.ts -u` 更新快照。
- `npm run build-spec`：用本地 `spec/pages/` 重新生成 `spec/tools.json`，不联网。
- `npm run sync-docs`：联网重新下载文档站全部接口页到 `spec/pages/`，随后自动 build-spec 并打印与上一版的差异。
- 本机若装了 RTK hook，`npx vitest` 的输出会被改写成看不到结果，改用 `rtk proxy npm test` 或 `rtk proxy npx vitest run …`。
- 运行：`node dist/src/index.js [--readonly] [--yes]`。环境变量 `QQDL_TOKEN`（必填）、`QQDL_BASE_URL`（默认线上）、`QQDL_TIMEOUT_MS`、`QQDL_CONFIRM_QUIET_MS`（确认码静默期，默认 10000，端到端测试设 0）。
- 配置片段：`node dist/src/index.js setup --token xxx [--readonly] [--npx]`，打印 Claude Code、Claude Desktop、Codex、Cursor、VS Code、Zed、Windsurf 的配置，生成逻辑在 `src/setup.ts`（纯文本函数，有单测）。默认按本机路径生成 `node …/dist/src/index.js`，`--npx` 生成 `npx -y github:empty-byte/quanqiudaili-mcp`（从 GitHub 拉起，npm 上尚未发布）。
- 发布：目前从 GitHub 分发，推到 `main` 就是发布，使用者 `npx -y github:…` 时 npm 会克隆仓库、装依赖、跑 `prepare` 构建，再按 `files` 白名单（`dist/src`、`spec/tools.json`、`spec/dynamic-proxy-session.md`）打包，所以使用者机器要有 `git`。npm 账号注册好后再 `npm publish`，流程相同。运行期从 `dist/src/index.js` 往上两级找包根，两种安装布局一致。
- 调试：`npx @modelcontextprotocol/inspector -e QQDL_TOKEN=xxx -- node dist/src/index.js`。客户端拉起子进程时不继承终端环境变量，token 只能通过客户端配置或 Inspector 的 `-e` 传入。

## 架构：两条链路

开发期（生成链路）：文档站 `llms.txt` → `scripts/sync-docs.ts` 下载 81 个接口页（每页一个 OpenAPI 3.0.1 YAML 块），按文档站左侧分组存成 `spec/pages/<分组英文名>/<控制器>-<方法>.md`（映射表 `TAG_DIR`，产品分组带 `product_type_id` 前缀，如 `2-static-standard/device-accountList.md`），同一分组同一接口有多页时文件名带 Apifox 页面 id → `scripts/lib/merge.ts` 按接口路径合并变体页、应用 `spec/overrides.yaml` → `scripts/build-spec.ts` 写出 `spec/tools.json`。原始页和生成物都提交入库，`spec/pages/` 同时是快照测试的输入；目录与文件名由 `placePages()` 决定，不要手动改名，`test/spec.test.ts` 会校验。

运行期：`src/index.ts` 只读 `spec/tools.json`，用 `fromJsonSchema()` 把每个工具的 JSON Schema 原样注册给 SDK，SDK 用内置 Ajv 在调用前校验（所有对象都 `additionalProperties: false`，写错参数名会被拒绝而不是发给后端）。`src/http.ts` 把参数经 `src/form.ts` 编成 `application/x-www-form-urlencoded`（PHP 括号格式 `content[0][id]=…`），只读工具 GET、其余 POST，每个请求都附带参数 `is_mcp_send=1` 和请求头 `User-Agent: quanqiudaili mcp` 供后端识别 MCP 流量，再把后端 `{code,msg,time,data}` 映射成 MCP 结果。`--readonly` 就是按 `readOnly` 过滤同一份工具表。运行期不 import zod、不解析 YAML、不联网拉文档。

写操作确认（`src/confirm.ts`）：非只读工具的处理器被 `withConfirm` 包一层。客户端声明了 elicitation 能力（2025 版协议看连接初始化时的能力，2026 版看每个请求信封里的 `CLIENT_CAPABILITIES_META_KEY`）就返回 `inputRequired(...)` 让客户端弹出操作预览，用户点确认后 SDK 重入处理器，从 `ctx.mcpReq.inputResponses` 读到 accept 且 confirm=true 才调后端；弹窗没拿到同意（decline、cancel、未勾选）和不支持弹窗的客户端都退到确认码：返回预览和一次性 `confirm_token`（绑定工具与参数、5 分钟有效），模型转述给用户后带码重调。弹窗的拒绝不直接当取消，是因为 Claude Code 的 VS Code 插件声明支持 elicitation 却不显示弹窗就回 decline，当取消会让写操作在它上面永远做不成。带了 `confirm_token` 的调用不再弹窗，直接校验确认码。确认码发出后有静默期（默认 10 秒）：模型拿到码不问用户就重调，间隔只有几秒，会收到"还不能用"且不消费、生效时间顺延；只有停下来等用户回复之后才用得上。这是确认码路径能给的最强保证，弹窗路径每次都弹。为此写工具的 schema 在注册时多一个可选 `confirm_token`，`spec/tools.json` 本身不含它。预览文案由 `preview()` 从工具标题、描述首句和参数拼出，不查价、不查余额。

续费兜底（`src/renew.ts`）：`order_renew` 的处理器外面套了 `withRenewDefaults`，在确认之前先按 ids 查 `sub_account_list`，`is_renew` 一律沿用当前值（工具不暴露这个参数，续费不改开关），`renew_with_bandwidth` 没传才沿用；子账号之间设置不一致就报错让分开续费。预览里看到的就是补齐后真正要发的值。原因见下面后端事实里续费接口那条。

## 改工具定义的正确姿势

不要手改 `spec/tools.json`。工具名、中文描述、只读与破坏性标注、按产品拆分、参数类型/描述/枚举/必填的修正都在 `spec/overrides.yaml`，按接口路径做 key；改完 `npm run build-spec`，再 `npm test`，快照变化合理就 `-u`。`test/spec.test.ts` 会校验 `tools.json` 与当前生成结果一致，忘了重生成会红。同一接口只取 data 里一个字段的派生工具（如 `user_balance` 取 `user_info` 的 `money`）写在 overrides 顶层 `derived`，生成时从来源工具复制并带上 `pick`，运行期 `callApi` 只返回该字段。

合并规则要点（细节见 `docs/2026-09-24-设计方案.md` 第 3 节）：同路径各页参数取并集；顶层参数要在全部变体页都必填才必填，部分必填写进描述；`product_type_id` 强制 integer，枚举取各页"此处固定为 N"；`name[0][key]` 转对象数组，`name[]` 转数组；描述去掉 HTML 标签。文档站新增接口会让生成失败并列出路径，把它加进 overrides 或 `ignore`。文档缺陷的兜底条目在 overrides 里带"文档缺陷兜底"注释，并登记到设计文档第 11 节，文档站修好后删除。

## 后端事实（已对照 proxy-distribution-system 源码核实）

- token 是网站 API Keys 页面生成的 API Key（永久有效），放请求头 `token`。登录、登出、token 检测与刷新接口已下线。成功 `{code:1,…}`；业务错误 HTTP 200 `{code:0,msg}`；未登录 HTTP 401 `{code:401,msg:"请先登录"}`；限流 `{code:0,msg:"访问频繁,请稍后再试!"}`，每接口每 IP 每分钟 180 次。
- 所有查询接口用 `request->param()` 取参，GET 和 POST 都收，所以"查询一律 GET"是安全的。
- `product_type_id`：1 动态住宅流量不限时长、6 动态住宅流量包月、2 静态住宅普通、3 静态住宅原生、4 静态住宅运营商原生、8 数据中心。
- `createBandwidthUpgradeOrder` 的 `pay_method` 固定 `balance`，用 overrides 的 `fixed` 加 `drop` 实现。
- `createRenewProductBuyOrder` 接受文档没写的 `is_renew`（0/1，不传当 0），并把 `is_renew`、`renew_with_bandwidth`、`renew_timelen` 写回子账号的自动续费设置（`ProductPackage.php` 续费流程），照文档直接调一次就会把用户开着的自动续费关掉。
- 子账号 id 类参数一律 string（数组元素也是），`test/spec.test.ts` 有断言；`subAccountStart`/`subAccountEnd` 与 `order_product_buy_id` 保持 integer。

## 规则

- stdout 是 MCP 协议通道，日志只用 `console.error`。token 不进日志、不进返回给模型的错误文本。
- 写操作的确认层不能绕过：新增写工具自动带确认；测试里要直接打假后端就连 `--yes` 或在客户端声明 elicitation 并自动同意。
- 自动化测试不打线上。新增子账号、下单、续费、退单、删除等会在后端创建或删除数据的操作，只由维护者用测试账号手动验证，Claude 不代跑；只读工具和 `sub_account_update` 改备注可以联调。清单在 `docs/2026-09-24-联调记录.md`。
- 注释只写后来者不查资料就能懂的"为什么"，不复述库函数行为、协议版本或 SDK 内部术语；仓库没有 eslint，不写 eslint 指令。

## 文档

`docs/2026-09-24-设计方案.md` 是规格，`docs/2026-09-24-实施计划.md` 是实施计划与实施后修订说明，`docs/2026-09-24-联调记录.md` 是联调清单与结果。
