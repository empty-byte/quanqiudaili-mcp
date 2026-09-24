#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { McpServer, fromJsonSchema, type JsonSchemaType } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { callApi, cfgFromEnv, type Cfg } from './http.js';
import type { ToolDef } from './types.js';

const mode = process.argv[2];
if (mode !== 'query' && mode !== 'manage') {
  console.error('用法：quanqiudaili-mcp <query|manage>\n  query   只读工具\n  manage  全部工具，含下单扣费与删除');
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
const tools = mode === 'query' ? all.filter(t => t.readOnly) : all;

const SESSION_URI = 'quanqiudaili://docs/dynamic-proxy-session';

const INSTRUCTIONS = `全球代理（quanqiudaili.com）externalapi 的 MCP 封装，直接调用后端接口，后端校验参数并返回结果。
- product_type_id：1=动态住宅流量（不限时长）、6=动态住宅流量（包月）、2=静态住宅（普通）、3=静态住宅（原生）、4=静态住宅（运营商原生）、8=数据中心。产品 1/6 的国家、州、城市用 dynamic_* 工具查，产品 2/3/4/8 用 static_* 工具查。
- 国家一律用 ISO 3166-1 二字码（如 US）；分页参数 pagesize 最大 100。
- 下单、续费、带宽升级、删除类工具会从余额扣费或不可恢复：调用前先用 stock_check、product_unit_price、bandwidth_upgrade_price、user_info 查清库存、价格和余额，把参数与预计费用告诉用户并取得明确确认。
- 工具成功时返回 {code, msg, data} 的 JSON；失败时 isError 为 true，文本就是后端给出的原因。若提示 token 无效或过期，请用户重新登录获取 token 并更新 QQDL_TOKEN。
- 动态住宅代理连接串的写法（cty/st/ct/ss/tm/spec 参数）见资源 ${SESSION_URI}。`;

function createServer(): McpServer {
  const server = new McpServer({ name: `quanqiudaili-${mode}`, version }, { instructions: INSTRUCTIONS });

  for (const t of tools) {
    server.registerTool(
      t.name,
      {
        title: t.title,
        description: t.description,
        // 生成好的 JSON Schema 原样下发；SDK 用内置 Ajv 在调用前校验参数
        inputSchema: fromJsonSchema<Record<string, unknown>>(t.inputSchema as JsonSchemaType),
        annotations: {
          title: t.title,
          readOnlyHint: t.readOnly,
          destructiveHint: t.destructive,
          idempotentHint: t.readOnly,
          openWorldHint: true,
        },
      },
      args => callApi(t, args, cfg),
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

if (mode === 'manage') console.error('[quanqiudaili-mcp] manage 模式：包含下单扣费与删除子账号的操作工具。');
serveStdio(createServer, { onerror: e => console.error(`[quanqiudaili-mcp] ${e.message}`) });
