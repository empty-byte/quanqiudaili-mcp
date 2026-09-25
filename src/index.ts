#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLIENT_CAPABILITIES_META_KEY, McpServer, fromJsonSchema, type ClientCapabilities, type JsonSchemaType, type ServerContext } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { CONFIRM_TOKEN_SCHEMA, ConfirmTokens, withConfirm } from './confirm.js';
import { callApi, cfgFromEnv, type Cfg } from './http.js';
import { withRenewDefaults } from './renew.js';
import { renderSetup } from './setup.js';
import type { ToolDef } from './types.js';

const USAGE = `用法：quanqiudaili-mcp [--readonly] [--yes]
      quanqiudaili-mcp setup [--token 你的token] [--readonly]
  不带参数     全部 34 个工具，含下单扣费与删除子账号；写操作执行前先向用户确认
  --readonly   只暴露 20 个只读工具
  --yes        写操作不确认直接执行，给自动化脚本用
  setup        打印 Claude Code、Claude Desktop、Codex、Cursor、VS Code、Zed、Windsurf 的配置片段，不改任何文件`;

const argv = process.argv.slice(2);

if (argv[0] === 'setup') {
  const withEq = argv.find(a => a.startsWith('--token='));
  const at = argv.indexOf('--token');
  const token = withEq ? withEq.slice('--token='.length) : at >= 0 ? argv[at + 1] : undefined;
  console.log(renderSetup({ indexPath: fileURLToPath(import.meta.url), token, readonly: argv.includes('--readonly'), platform: process.platform }));
  process.exit(0);
}

const flags = new Set(argv);
const readonly = flags.has('--readonly') || flags.has('query');
const yes = flags.has('--yes');
for (const known of ['--readonly', 'query', 'manage', '--yes']) flags.delete(known);
if (flags.size) {
  console.error(USAGE);
  process.exit(2);
}

let cfg: Cfg;
try {
  cfg = cfgFromEnv();
} catch (e) {
  console.error(`[quanqiudaili-mcp] ${(e as Error).message}`);
  process.exit(2);
}

// 编译后本文件在 dist/src/，包根在上两级
const read = (rel: string): string => readFileSync(new URL(rel, import.meta.url), 'utf8');
const { version } = JSON.parse(read('../../package.json')) as { version: string };
const all = JSON.parse(read('../../spec/tools.json')) as ToolDef[];
const tools = readonly ? all.filter(t => t.readOnly) : all;

const SESSION_URI = 'quanqiudaili://docs/dynamic-proxy-session';

const INSTRUCTIONS = `全球代理（quanqiudaili.com）externalapi 的 MCP 封装，直接调用后端接口，后端校验参数并返回结果。
- product_type_id：1=动态住宅流量（不限时长）、6=动态住宅流量（包月）、2=静态住宅（普通）、3=静态住宅（原生）、4=静态住宅（运营商原生）、8=数据中心。产品 1/6 的国家、州、城市用 dynamic_* 工具查，产品 2/3/4/8 用 static_* 工具查。
- 术语："时长类"指产品 2/3/4/8，按 IP 按天计费；"动态类"指产品 1/6，按流量计费。
- 子账号 id 一律取 sub_account_list 返回的 id 字段，按字符串传（如 "77"）；要传多个时按参数说明用数组或英文逗号连接；要按订单操作时看该列表每条的 order_product_buy_id。
- 国家一律用 ISO 3166-1 二字码（如 US）；分页参数 pagesize 最大 100。
- 下单、续费、带宽升级、删除类工具会从余额扣费或不可恢复：调用前先用 stock_check、product_unit_price、bandwidth_upgrade_price、user_info 查清库存、价格和余额，把参数与预计费用告诉用户并取得明确确认。
- 写操作工具执行前必须经用户确认：支持弹窗的客户端会弹出操作预览让用户点选；没弹窗或不支持的客户端会返回预览和 confirm_token，要把预览原样转述给用户，得到明确同意后再带 confirm_token 用相同参数调用。返回文本说"弹窗没有得到确认"时，可能是客户端没显示弹窗，也可能是用户拒绝了，同样只转述一次，用户不要就停。不要替用户做决定，用户没回答就不要带确认码重试。
- 工具成功时返回 {code, msg, data} 的 JSON；失败时 isError 为 true，文本就是后端给出的原因。若提示 token 无效，请用户到网站 API Keys 页面核对或重新生成 API Key，并更新 QQDL_TOKEN。
- 动态住宅代理连接串的写法（cty/st/ct/ss/tm/spec 参数）见资源 ${SESSION_URI}。`;

function createServer(): McpServer {
  const server = new McpServer({ name: 'quanqiudaili-mcp', version }, { instructions: INSTRUCTIONS });

  const tokens = new ConfirmTokens();
  const listTool = all.find(t => t.name === 'sub_account_list');
  if (!listTool) throw new Error('spec/tools.json 缺少 sub_account_list');
  // 2026 版协议把客户端能力放在每个请求的信封里，2025 版放在连接初始化时
  const supportsElicitation = (ctx: ServerContext): boolean => {
    const fromEnvelope = (ctx.mcpReq.envelope as Record<string, unknown> | undefined)?.[CLIENT_CAPABILITIES_META_KEY] as ClientCapabilities | undefined;
    return !!(fromEnvelope ?? server.server.getClientCapabilities())?.elicitation;
  };

  for (const t of tools) {
    const confirm = !yes && !t.readOnly;
    const schema = confirm ? { ...t.inputSchema, properties: { ...t.inputSchema.properties, confirm_token: CONFIRM_TOKEN_SCHEMA } } : t.inputSchema;
    const exec = (args: Record<string, unknown>) => callApi(t, args, cfg);
    const base = confirm ? withConfirm(t, { supportsElicitation, exec, tokens }) : exec;
    const handler = t.name === 'order_renew' ? withRenewDefaults(base, listTool, cfg) : base;
    server.registerTool(
      t.name,
      {
        title: t.title,
        description: t.description,
        // 生成好的 JSON Schema 原样下发；SDK 用内置 Ajv 在调用前校验参数
        inputSchema: fromJsonSchema<Record<string, unknown>>(schema as JsonSchemaType),
        annotations: {
          title: t.title,
          readOnlyHint: t.readOnly,
          destructiveHint: t.destructive,
          idempotentHint: t.readOnly,
          openWorldHint: true,
        },
      },
      handler,
    );
  }

  server.registerResource(
    'dynamic-proxy-session',
    SESSION_URI,
    {
      title: '动态 IP Session 使用说明',
      description: '动态住宅代理连接串的参数规则（cty、st、ct、ss、tm、spec）、正误示例与资源池性能参考',
      mimeType: 'text/markdown',
    },
    async uri => ({ contents: [{ uri: uri.href, mimeType: 'text/markdown', text: read('../../spec/dynamic-proxy-session.md') }] }),
  );

  return server;
}

if (!readonly) {
  console.error(yes
    ? '[quanqiudaili-mcp] --yes：写操作不经确认直接执行。'
    : '[quanqiudaili-mcp] 当前包含下单扣费与删除子账号的操作工具，执行前会向用户确认；只想查询请加 --readonly。');
}
serveStdio(createServer, { onerror: e => console.error(`[quanqiudaili-mcp] ${e.message}`) });
