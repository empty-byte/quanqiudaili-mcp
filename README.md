# quanqiudaili-mcp

全球代理（quanqiudaili.com）对外 API 的 MCP 服务器。让 Claude Code、Claude Desktop 等 MCP 客户端可以查询子账号、库存、价格，并在你确认后下单、续费、改配置。

- `query`：19 个只读工具，适合日常查询，装了它不会产生任何费用。
- `manage`：全部 33 个工具，含下单扣费、续费、删除子账号。删除与扣费工具都带 `destructiveHint` 标注；支持该标注的客户端会在调用前要求确认，不支持的客户端不会，所以只在需要时启用 manage。

业务逻辑、参数校验、鉴权、扣费全部在后端完成，本项目只是一个 HTTP 客户端。

## 环境要求

Node.js 20 或更新（推荐当前 LTS）。Windows、macOS、Linux 均可。

## 安装

```bash
git clone <仓库地址> quanqiudaili-mcp
cd quanqiudaili-mcp
npm ci
```

`npm ci` 结束时会自动编译到 `dist/`。之后用 `node <安装目录>/dist/src/index.js query` 启动；也可以 `npm install -g .`，得到全局命令 `quanqiudaili-mcp query`。

## 获取 token

MCP 只接受 token，不做账号密码登录。用你的账号密码调一次登录接口，取返回里的 `data.userinfo.token`（有效期 30 天）：

```bash
curl -X POST https://admin.quanqiudaili.com/externalapi/user/login \
  -d "account=你的账号" -d "password=你的密码"
```

Windows PowerShell 里 `curl` 是 `Invoke-WebRequest` 的别名，要写 `curl.exe`，并且不能用反斜杠续行：

```powershell
curl.exe -X POST https://admin.quanqiudaili.com/externalapi/user/login -d "account=你的账号" -d "password=你的密码"
```

token 过期后工具会返回"token 无效或已过期"，重新登录取新 token 并更新配置即可。

## 配置

环境变量：

| 变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQDL_TOKEN` | 是 | 无 | 登录接口返回的 token |
| `QQDL_BASE_URL` | 否 | `https://admin.quanqiudaili.com` | 指向测试环境时修改 |
| `QQDL_TIMEOUT_MS` | 否 | `30000` | 单次请求超时（毫秒） |

Claude Code（把 `<安装目录>` 换成实际路径，Windows 也用正斜杠，例如 `C:/tools/quanqiudaili-mcp`）：

```bash
claude mcp add quanqiudaili-query  -e QQDL_TOKEN=你的token -- node <安装目录>/dist/src/index.js query
claude mcp add quanqiudaili-manage -e QQDL_TOKEN=你的token -- node <安装目录>/dist/src/index.js manage
```

Claude Desktop 的 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "quanqiudaili-query": {
      "command": "node",
      "args": ["<安装目录>/dist/src/index.js", "query"],
      "env": { "QQDL_TOKEN": "你的token" }
    }
  }
}
```

其它支持 stdio 的客户端同理：命令 `node`，参数 `<安装目录>/dist/src/index.js query|manage`，环境变量 `QQDL_TOKEN`。

## 工具清单

产品类型 `product_type_id`：1 动态住宅流量（不限时长）、6 动态住宅流量（包月）、2 静态住宅（普通）、3 静态住宅（原生）、4 静态住宅（运营商原生）、8 数据中心。国家一律用 ISO 3166-1 二字码（如 `US`）。

只读（query 与 manage 都有）：

| 工具 | 说明 |
|---|---|
| user_info | 账号信息与余额 |
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

写操作（仅 manage）：

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
| order_renew | 续费时长 IP，扣费 |
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
