# quanqiudaili-mcp

全球代理（quanqiudaili.com）开放接口的 MCP 服务器。接入 Claude Code、Claude Desktop、Cursor、Codex 等支持 MCP 的 AI 客户端后，可以用自然语言查询子账号、库存、价格与余额，并在确认后完成下单、续费与子账号管理。

- 只读模式 `--readonly` 仅暴露 20 个查询工具，不会产生任何费用。
- 下单、续费、删除等 14 个写操作执行前都需要用户确认，AI 无法代替用户确认。
- 参数按接口文档生成并在本地校验，不合法的参数不会发送到后端。

业务逻辑、鉴权与扣费均由后端完成，本项目只是一个 HTTP 客户端。

## 环境要求

- Node.js 20 或更新版本，Windows、macOS、Linux 均可。
- 使用 npx 方式接入时，本机需安装 `git` 并能访问 GitHub。

## 快速开始

### 1. 获取 API Key

登录 quanqiudaili.com，点击右上角头像进入 API Keys，新建一个 Key 并复制完整字符串（形如 `sk-…`）。Key 永久有效，每个账号最多 20 个，等同于账号权限，请勿泄露或写入代码。

### 2. 接入客户端

两种方式任选其一。

**方式一：npx，无需安装（推荐）**

在客户端配置中把启动命令写成 `npx -y github:empty-byte/quanqiudaili-mcp`。首次拉起时会自动下载、编译并缓存，耗时一到两分钟，之后直接复用。

打印所有客户端的配置片段（只输出文本，不修改任何文件）：

```bash
npx -y github:empty-byte/quanqiudaili-mcp setup --npx --token <API Key>
```

Claude Code：

```bash
claude mcp add -s user -e QQDL_TOKEN=<API Key> quanqiudaili -- npx -y github:empty-byte/quanqiudaili-mcp
```

Claude Desktop，写入 `claude_desktop_config.json`（Windows：`%APPDATA%\Claude\`；macOS：`~/Library/Application Support/Claude/`）：

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "npx",
      "args": ["-y", "github:empty-byte/quanqiudaili-mcp"],
      "env": { "QQDL_TOKEN": "<API Key>" }
    }
  }
}
```

Windows 下若客户端提示找不到 `npx`，将 `command` 改为 `cmd`，并在 `args` 最前面加入 `"/c", "npx"`。

**方式二：本地安装**

```bash
git clone https://github.com/empty-byte/quanqiudaili-mcp.git
cd quanqiudaili-mcp
npm ci
```

`npm ci` 会自动编译到 `dist/`。启动命令为 `node <安装目录>/dist/src/index.js`，打印配置片段：

```bash
node <安装目录>/dist/src/index.js setup --token <API Key>
```

Claude Code（`<安装目录>` 为绝对路径，Windows 也使用正斜杠，如 `C:/tools/quanqiudaili-mcp`）：

```bash
claude mcp add -s user -e QQDL_TOKEN=<API Key> quanqiudaili -- node <安装目录>/dist/src/index.js
```

Claude Desktop：

```json
{
  "mcpServers": {
    "quanqiudaili": {
      "command": "node",
      "args": ["<安装目录>/dist/src/index.js"],
      "env": { "QQDL_TOKEN": "<API Key>" }
    }
  }
}
```

更新：在安装目录执行 `git pull && npm ci`。

### 3. 验证

重启客户端后，向 AI 提问"我的账户余额是多少"，能返回金额即接入成功。Claude Code 中可用 `/mcp` 查看连接状态。

## 配置

`setup` 子命令的输出按客户端分段，包含 Claude Code、Codex CLI、Claude Desktop、Cursor、Windsurf、VS Code、Zed 的配置，以及适用于任何 stdio 客户端的标准 `mcpServers` JSON。加 `--readonly` 可生成只读版配置。

启动参数：

| 参数 | 说明 |
|---|---|
| 无 | 暴露全部 34 个工具 |
| `--readonly` | 仅暴露 20 个只读工具 |
| `--yes` | 写操作不再确认，仅供自动化脚本使用 |

环境变量：

| 变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQDL_TOKEN` | 是 | 无 | API Key |
| `QQDL_BASE_URL` | 否 | `https://admin.quanqiudaili.com` | 接口地址 |
| `QQDL_TIMEOUT_MS` | 否 | `30000` | 单次请求超时（毫秒） |
| `QQDL_CONFIRM_QUIET_MS` | 否 | `10000` | 确认码生效前的静默期（毫秒） |

环境变量必须写在客户端配置的 `env` 中。服务由客户端作为子进程拉起，不会继承终端中设置的变量。API Key 失效时工具会返回"token 无效"，在网站重新生成并更新配置即可。

## 写操作确认

写操作工具在执行前会先向用户确认：

- 客户端支持 MCP 弹窗确认（elicitation）时，弹出操作预览，用户确认后才请求后端。
- 客户端不支持弹窗，或弹窗未获确认时，工具只返回操作预览和一个一次性确认码，由 AI 转述给用户；用户同意后，AI 需携带确认码以相同参数再次调用。确认码 5 分钟内有效，发出后 10 秒内不能使用，提前使用会被拒绝并顺延生效时间，用于阻止 AI 未经用户同意自行重试。
- 每次操作均需单独确认，参数变化或再次执行同样的操作都会重新确认。
- 该确认与客户端自身的工具权限提示相互独立，可能出现两次询问。

## 工具清单

产品类型 `product_type_id`：1 动态住宅流量（不限时长）、6 动态住宅流量（包月）、2 静态住宅（普通）、3 静态住宅（原生）、4 静态住宅（运营商原生）、8 数据中心。国家使用 ISO 3166-1 二字码，如 `US`。

只读工具（`--readonly` 模式暴露的全部工具）：

| 工具 | 说明 |
|---|---|
| user_info | 账号信息 |
| user_balance | 账户余额 |
| product_list | 产品列表 |
| product_unit_price | 各产品单价、折扣与按国家的自定义价 |
| dynamic_country_list / dynamic_state_list / dynamic_city_list | 动态产品（1、6）的国家、州、城市 |
| static_country_list / static_city_list | 时长产品（2、3、4、8）的国家、城市 |
| static_region_stock | 时长产品地区库存 |
| static_ip_range_list | 时长产品 IP 段 |
| stock_check | 下单前库存检测 |
| sub_account_list | 子账号列表，覆盖全部产品 |
| sub_account_flow_query | 动态子账号月度流量 |
| sub_account_limit_flow | 子账号流量上限与已用量 |
| bandwidth_package_list / bandwidth_monitoring_list / bandwidth_trend / bandwidth_detail | 带宽套餐、监控、趋势、详情 |
| bandwidth_upgrade_price | 带宽升级价格试算 |

写操作工具（默认模式暴露）：

| 工具 | 说明 |
|---|---|
| sub_account_add | 新增动态子账号 |
| sub_account_update / sub_account_update_batch | 修改子账号备注 |
| sub_account_set_credentials | 设置子账号自定义账密 |
| sub_account_toggle_direct | 批量开关直连 |
| sub_account_set_limit_flow | 设置流量上限 |
| sub_account_delete / sub_account_delete_batch | 删除子账号，不可恢复 |
| order_buy_dynamic | 购买动态住宅流量（产品 1、6），扣费 |
| order_buy_time_ip | 购买时长 IP（产品 2、3、4、8），扣费 |
| order_buy_test_ip | 购买时长测试 IP，扣费 |
| order_renew | 续费时长 IP，扣费；不改变子账号的自动续费设置 |
| order_bandwidth_upgrade | 带宽升级下单，余额支付 |
| order_refund_apply | 申请退单 |

资源 `quanqiudaili://docs/dynamic-proxy-session`：动态住宅代理连接串的参数说明与示例。

## 调试

使用官方 Inspector 直接查看工具列表或手动调用，API Key 通过 `-e` 传入：

```bash
npx @modelcontextprotocol/inspector -e QQDL_TOKEN=<API Key> -- node <安装目录>/dist/src/index.js
```

## 开发与维护

```bash
npm test             # 构建并运行全部测试，不联网
npm run sync-docs    # 从文档站重新生成工具定义，并打印与上一版的差异
npm run build-spec   # 仅用本地已下载的文档页重新生成工具定义
```

工具定义由 <https://develop.quanqiudaili.com/llms.txt> 生成，不手写；工具名、描述与文档修正维护在 `spec/overrides.yaml`。涉及在后端创建数据的操作不做自动化联调，由维护者用测试账号手动验证。设计与实施文档见 `docs/`。

## 许可

MIT，见 `LICENSE`。
