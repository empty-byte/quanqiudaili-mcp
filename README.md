# quanqiudaili-mcp

全球代理（quanqiudaili.com）对外 API 的 MCP 服务器。让 Claude Code、Claude Desktop 等 MCP 客户端可以查询子账号、库存、价格，并在你确认后下单、续费、改配置。

默认暴露全部 34 个工具，含下单扣费、续费、删除子账号；加 `--readonly` 只暴露 20 个只读工具，装了不会产生任何费用。新建、修改、下单、续费、删除这 14 个写操作执行前都会先向你确认（见下文"写操作确认"），AI 替不了你点；不需要写操作的人直接配 `--readonly`。

业务逻辑、参数校验、鉴权、扣费全部在后端完成，本项目只是一个 HTTP 客户端。

## 环境要求

Node.js 20 或更新（推荐当前 LTS）。Windows、macOS、Linux 均可。

## 安装

```bash
git clone <仓库地址> quanqiudaili-mcp
cd quanqiudaili-mcp
npm ci
```

`npm ci` 结束时会自动编译到 `dist/`。启动命令是 `node <安装目录>/dist/src/index.js`，只读加 `--readonly`，自动化脚本加 `--yes` 跳过写操作确认；也可以 `npm install -g .` 得到全局命令 `quanqiudaili-mcp`。

## 获取 token

token 就是网站的 API Key，永久有效，每个账号最多 20 个：

1. 登录 quanqiudaili.com，点右上角头像，进 API Keys。
2. 新建一个 Key，复制形如 `sk-…` 的完整字符串。
3. 填到下文配置里的 `QQDL_TOKEN`。

Key 被删除或复制不完整时，工具会返回"token 无效"，到 API Keys 页面核对或重新生成后更新配置即可。Key 等同于账号权限，不要分享给他人或写进客户端代码。

## 配置

环境变量：

| 变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQDL_TOKEN` | 是 | 无 | 网站 API Keys 页面生成的 API Key |
| `QQDL_BASE_URL` | 否 | `https://admin.quanqiudaili.com` | 指向测试环境时修改 |
| `QQDL_TIMEOUT_MS` | 否 | `30000` | 单次请求超时（毫秒） |

装一次之后，跑一条命令把所有客户端的配置片段打印出来，贴进你用的那个即可（只打印，不改任何文件）：

```bash
node <安装目录>/dist/src/index.js setup --token 你的token
node <安装目录>/dist/src/index.js setup --token 你的token --readonly   # 只读版
```

输出里按客户端分段：Claude Code 与 Codex CLI 各一条可直接执行的命令，Claude Desktop、Cursor、Windsurf/Devin、VS Code、Zed 各给配置文件位置和 JSON 或 TOML 片段，最后一段是任何支持 stdio 的客户端都能用的标准 `mcpServers` JSON。路径会按你的操作系统和实际安装位置填好。

两个最常用的示例（`<安装目录>` 换成实际路径，Windows 也用正斜杠，例如 `C:/tools/quanqiudaili-mcp`）。Claude Code：

```bash
claude mcp add -s user -e QQDL_TOKEN=你的token quanqiudaili -- node <安装目录>/dist/src/index.js
```

Claude Desktop 的 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "node",
      "args": ["<安装目录>/dist/src/index.js"],
      "env": { "QQDL_TOKEN": "你的token" }
    }
  }
}
```

只读版在 `args` 末尾加 `"--readonly"`。

注意：服务是被客户端当子进程拉起的，只继承一小份白名单环境变量，你在终端里 `export` 或 `$env:` 设置的 `QQDL_TOKEN` 传不进去，token 必须像上面那样写在客户端配置里。

## 写操作确认

新建、修改、下单、续费、升级、退单、删除这 14 个工具执行前都会先向你确认：

- 客户端支持 MCP 的弹窗确认（elicitation）时，会弹出操作预览（工具、参数、产品名），你点确认后才请求后端。Inspector、VS Code 支持；其它客户端以实际是否弹窗为准。弹窗没得到确认（你点了拒绝或关掉，或者客户端声明支持却没显示弹窗，Claude Code 的 VS Code 插件目前就这样）都会退到下面的确认码方式，由助手在对话里再向你确认一次，你不同意就不执行。
- 客户端不支持时，第一次调用只返回预览和一个 5 分钟有效、只能用一次的确认码，AI 要把预览告诉你，你同意后它再带确认码用同样参数调一次。这一路靠 AI 转述，弱于弹窗。
- 这层确认与客户端自带的工具权限弹窗是叠加的，可能问两次。
- 自动化脚本不想被打断，启动参数加 `--yes`，写操作直接执行。`--readonly` 模式没有写工具，不涉及确认。

## 调试

不接客户端、想直接看工具列表或手动调一个工具，用官方 Inspector，token 同样要通过它的 `-e` 传入：

```bash
npx @modelcontextprotocol/inspector -e QQDL_TOKEN=你的token -- node <安装目录>/dist/src/index.js
```

浏览器里点 Connect，Tools 页能看到全部工具、填参数、看返回。调写操作工具时会弹出确认表单，点同意才真正发请求；用它也能最快看出某个客户端走的是弹窗还是确认码。

## 工具清单

产品类型 `product_type_id`：1 动态住宅流量（不限时长）、6 动态住宅流量（包月）、2 静态住宅（普通）、3 静态住宅（原生）、4 静态住宅（运营商原生）、8 数据中心。国家一律用 ISO 3166-1 二字码（如 `US`）。

只读（`--readonly` 模式暴露的全部工具）：

| 工具 | 说明 |
|---|---|
| user_info | 账号信息与余额 |
| user_balance | 账户余额，data 直接是金额 |
| product_unit_price | 各产品单价、折扣、按国家自定义价 |
| product_list | 产品信息 |
| dynamic_country_list / dynamic_state_list / dynamic_city_list | 动态产品 1、6 的国家、州、城市 |
| static_country_list / static_city_list | 时长产品 2、3、4、8 的国家、城市 |
| static_region_stock | 时长产品地区库存 |
| static_ip_range_list | 时长产品 IP 段 |
| stock_check | 下单前库存检测，不扣费 |
| sub_account_list | 子账号列表，覆盖全部产品 |
| sub_account_flow_query | 动态子账号月度流量 |
| sub_account_limit_flow | 子账号流量上限与已用量 |
| bandwidth_package_list / bandwidth_monitoring_list / bandwidth_trend / bandwidth_detail | 带宽套餐、监控、趋势、详情 |
| bandwidth_upgrade_price | 带宽升级价格试算，不扣费 |

写操作（默认模式才有，`--readonly` 不暴露）：

| 工具 | 说明 |
|---|---|
| sub_account_add | 新增动态子账号 |
| sub_account_update / sub_account_update_batch | 修改备注 |
| sub_account_set_credentials | 自定义子账号账密 |
| sub_account_toggle_direct | 批量开关直连 |
| sub_account_set_limit_flow | 设置流量上限 |
| sub_account_delete / sub_account_delete_batch | 删除子账号，不可恢复 |
| order_buy_dynamic | 购买动态住宅流量（产品 1、6），扣费 |
| order_buy_time_ip | 购买时长 IP（产品 2、3、4、8），扣费 |
| order_buy_test_ip | 购买时长测试 IP，扣费 |
| order_renew | 续费时长 IP，扣费；不改子账号的自动续费开关，不传 renew_with_bandwidth 时沿用当前设置 |
| order_bandwidth_upgrade | 带宽升级下单，余额支付 |
| order_refund_apply | 申请退单 |

资源 `quanqiudaili://docs/dynamic-proxy-session`：动态住宅代理连接串的参数写法与示例。

工具的参数、类型与必填项由文档站生成，调用时 SDK 会先按 JSON Schema 校验，不符合的参数直接返回错误，不会打到后端。

## 跟随文档站更新

工具定义由 <https://develop.quanqiudaili.com/llms.txt> 生成，不手写：

```bash
npm run sync-docs   # 下载全部接口页到 spec/pages/，重新生成 spec/tools.json，打印与上一版的差异
npm test            # 若快照变化且差异合理：npx vitest run -u 更新快照
```

新增接口会让生成失败并列出路径，把它加进 `spec/overrides.yaml`（或 `ignore`）再跑一次。工具名、中文描述、标注与文档缺陷的修正都在 `spec/overrides.yaml`。

## 开发

```bash
npm test               # 构建 + 全部测试（不联网，端到端测试用本地假后端）
npm run build-spec     # 只用本地 spec/pages 重新生成 tools.json（不联网）
```

涉及在后端创建数据的操作（新增子账号、下单、续费等）不做自动化联调，由维护者用测试账号手动验证。设计与实施文档见 `docs/`。
