import { describe, expect, it } from 'vitest';
import { renderSetup } from '../src/setup.js';

const win = { indexPath: 'C:\\tools\\quanqiudaili-mcp\\dist\\src\\index.js', token: 'abc', readonly: false, platform: 'win32' as const };
const args = ['C:/tools/quanqiudaili-mcp/dist/src/index.js'];
const env = { QQDL_TOKEN: 'abc' };

describe('renderSetup', () => {
  it('Windows 路径转成正斜杠，Claude Code 与 Codex 各给一条命令', () => {
    const out = renderSetup(win);
    expect(out).toContain('claude mcp add -s user -e QQDL_TOKEN=abc quanqiudaili -- node C:/tools/quanqiudaili-mcp/dist/src/index.js');
    expect(out).toContain('codex mcp add quanqiudaili --env QQDL_TOKEN=abc -- node C:/tools/quanqiudaili-mcp/dist/src/index.js');
    expect(out).not.toContain('--readonly');
  });

  it('标准 mcpServers JSON 原样可粘贴，VS Code 用 servers，Zed 用 context_servers，Codex 有 TOML 段', () => {
    const out = renderSetup(win);
    expect(out).toContain(JSON.stringify({ mcpServers: { quanqiudaili: { command: 'node', args, env } } }, null, 2));
    expect(out).toContain(JSON.stringify({ servers: { quanqiudaili: { type: 'stdio', command: 'node', args, env } } }, null, 2));
    expect(out).toContain(JSON.stringify({ context_servers: { quanqiudaili: { command: 'node', args, env } } }, null, 2));
    expect(out).toContain(
      '[mcp_servers.quanqiudaili]\ncommand = "node"\nargs = ["C:/tools/quanqiudaili-mcp/dist/src/index.js"]\n\n[mcp_servers.quanqiudaili.env]\nQQDL_TOKEN = "abc"',
    );
  });

  it('--readonly 进入每种客户端的参数列表', () => {
    const out = renderSetup({ ...win, readonly: true });
    expect(out).toContain('-- node C:/tools/quanqiudaili-mcp/dist/src/index.js --readonly');
    expect(out).toContain('"--readonly"');
    expect(out).toContain('args = ["C:/tools/quanqiudaili-mcp/dist/src/index.js", "--readonly"]');
  });

  it('没给 token 时留占位并提醒', () => {
    const out = renderSetup({ ...win, token: undefined });
    expect(out).toContain('QQDL_TOKEN=你的token');
    expect(out).toContain('把 你的token 换成');
  });

  it('配置文件位置按操作系统给', () => {
    const w = renderSetup(win);
    expect(w).toContain('%APPDATA%\\Claude\\claude_desktop_config.json');
    expect(w).toContain('%APPDATA%\\devin\\mcp_config.json');
    const mac = renderSetup({ ...win, indexPath: '/opt/quanqiudaili-mcp/dist/src/index.js', platform: 'darwin' });
    expect(mac).toContain('~/Library/Application Support/Claude/claude_desktop_config.json');
    expect(mac).toContain('~/.config/devin/mcp_config.json');
    expect(mac).toContain('-- node /opt/quanqiudaili-mcp/dist/src/index.js');
  });
});
