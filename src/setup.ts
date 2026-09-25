export interface SetupOptions {
  /** dist/src/index.js 的绝对路径 */
  indexPath: string;
  token?: string;
  readonly: boolean;
  /** 用 npx -y 从 npm 拉起，不依赖本机安装位置 */
  npx?: boolean;
  platform: NodeJS.Platform;
}

const NAME = 'quanqiudaili';
const PACKAGE = 'quanqiudaili-mcp';

/** 生成各客户端可直接粘贴的配置片段，只产出文本，不碰任何文件 */
export function renderSetup(o: SetupOptions): string {
  const script = o.indexPath.replace(/\\/g, '/');
  const token = o.token ?? '你的token';
  const command = o.npx ? 'npx' : 'node';
  const args = [...(o.npx ? ['-y', PACKAGE] : [script]), ...(o.readonly ? ['--readonly'] : [])];
  const env = { QQDL_TOKEN: token };
  const cli = `${command} ${args.join(' ')}`;
  const json = (v: unknown): string => JSON.stringify(v, null, 2);
  const standard = json({ mcpServers: { [NAME]: { command, args, env } } });
  const tomlArgs = `[${args.map(a => JSON.stringify(a)).join(', ')}]`;

  const win = o.platform === 'win32';
  const desktopPath = win
    ? '%APPDATA%\\Claude\\claude_desktop_config.json'
    : o.platform === 'darwin'
      ? '~/Library/Application Support/Claude/claude_desktop_config.json'
      : '~/.config/Claude/claude_desktop_config.json';
  const windsurfPath = win ? '%APPDATA%\\devin\\mcp_config.json' : '~/.config/devin/mcp_config.json';

  return [
    `quanqiudaili-mcp 客户端配置片段${o.readonly ? '（只读模式）' : '（全部工具）'}`,
    '',
    `服务名 ${NAME}；命令 ${command}；参数 ${JSON.stringify(args)}；环境变量 QQDL_TOKEN。`,
    ...(o.token ? [] : ['下面所有片段里请把 你的token 换成网站 API Keys 页面生成的 API Key，做法见 README。']),
    'token 必须写在客户端配置里，终端里设置的环境变量不会传给客户端拉起的子进程。改完配置后重启对应客户端。',
    '',
    '== Claude Code ==',
    `claude mcp add -s user -e QQDL_TOKEN=${token} ${NAME} -- ${cli}`,
    '',
    '== Codex CLI ==',
    `codex mcp add ${NAME} --env QQDL_TOKEN=${token} -- ${cli}`,
    '或写进 ~/.codex/config.toml：',
    `[mcp_servers.${NAME}]`,
    `command = "${command}"`,
    `args = ${tomlArgs}`,
    '',
    `[mcp_servers.${NAME}.env]`,
    `QQDL_TOKEN = "${token}"`,
    '',
    `== Claude Desktop ==（${desktopPath}）`,
    standard,
    '',
    '== Cursor ==（全局 ~/.cursor/mcp.json，或项目内 .cursor/mcp.json）',
    standard,
    '',
    `== Windsurf / Devin 桌面版 ==（${windsurfPath}；旧版 Windsurf 为 ~/.codeium/windsurf/mcp_config.json）`,
    standard,
    '',
    '== VS Code ==（命令面板 "MCP: Open User Configuration" 打开的 mcp.json，或项目内 .vscode/mcp.json）',
    json({ servers: { [NAME]: { type: 'stdio', command, args, env } } }),
    '',
    '== Zed ==（命令面板 "zed: open settings file" 打开的 settings.json）',
    json({ context_servers: { [NAME]: { command, args, env } } }),
    '',
    '== 其它支持 stdio 的客户端 ==（标准 mcpServers 格式）',
    standard,
    '',
  ].join('\n');
}
