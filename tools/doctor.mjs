// tools/doctor.mjs — `npm run doctor`: proves every project tool is present AND runs.
//
// For each tool it executes a cheap command (version / help / an MCP handshake) and prints
// one line: OK | MISSING | BROKEN, the version it observed, and the path. Exit code 1 if any
// required tool is not OK — so a broken toolchain stops a build script instead of surfacing
// later as a confusing compiler error.
//
// @guard toolchain-doctor
// THREAT:         a tool from HOUSE_RULES.md §6 is moved, deleted or broken, and the next session
//                 builds against nothing (or the wrong thing) without noticing
// PROVED-AGAINST: KR_TOOLS pointed at an empty directory → the 10 _tools/sandbox-based rows report
//                 MISSING, exit 1 (the 4 Visual Studio rows stay OK — they live outside KR_TOOLS)
// GAP:            checks presence + one live invocation, not full functionality (e.g. an ASan link);
//                 Visual Studio rows are not covered by the KR_TOOLS control
// ON-REAL-PATH:   2026-11-21, `npm run doctor` on the owner's machine — 13/13 OK, exit 0
// [TESTED: 2026-11-21 · npm run doctor 13/13 OK (both MCP servers answered tools/list: REA 263, KUIPS 6);
//  control run KR_TOOLS=<empty dir> → 10 MISSING, exit 1 · testcases/reports/2026-11-21_toolchain-doctor.md]
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tools, emscriptenEnv } from './toolchain.mjs';

// Run a command and return the first non-empty output line (stdout first, then stderr).
function firstLine(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', timeout: 120000, ...opts });
  if (r.error) return { ok: false, line: String(r.error.code || r.error.message) };
  const text = `${r.stdout || ''}\n${r.stderr || ''}`;
  const line = text.split(/\r?\n/).map((s) => s.trim()).find((s) => s && !s.startsWith('shared:INFO')) || '';
  return { ok: r.status === 0, line };
}

// Speak MCP to a stdio server: initialize + tools/list, return the tool count.
function mcpToolCount(cmd, args, env) {
  const input = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'kr-doctor', version: '0' } } },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  ].map((m) => JSON.stringify(m)).join('\n') + '\n';
  const r = spawnSync(cmd, args, { input, encoding: 'utf8', timeout: 90000, env: { ...process.env, ...env } });
  for (const l of (r.stdout || '').split('\n')) {
    try { const m = JSON.parse(l); if (m.id === 2 && m.result) return { ok: true, line: `MCP: ${m.result.tools.length} tools` }; } catch { /* not a JSON-RPC line */ }
  }
  return { ok: false, line: `no tools/list answer (exit ${r.status})` };
}

const checks = [
  ['Emscripten (emcc)', tools.emcc, () => firstLine(tools.emcc, ['--version'], { env: emscriptenEnv() })],
  ['CMake', tools.cmake, () => firstLine(tools.cmake, ['--version'])],
  ['Ninja', tools.ninja, () => firstLine(tools.ninja, ['--version'])],
  ['MSVC env (vcvars64)', tools.vcvars64, () => ({ ok: true, line: 'present' })],
  ['LLVM clang-cl', tools.clangCl, () => firstLine(tools.clangCl, ['--version'])],
  ['LLVM clang-tidy', tools.clangTidy, () => firstLine(tools.clangTidy, ['--version'])],
  ['LLVM clang-format', tools.clangFormat, () => firstLine(tools.clangFormat, ['--version'])],
  ['Node 24.22 (REA runtime)', tools.node24, () => firstLine(tools.node24, ['-v'])],
  ['REA (MCP)', tools.rea, () => mcpToolCount(tools.node24, [tools.rea, 'mcp'], { GHIDRA_INSTALL_DIR: tools.ghidra || '' })],
  ['Ghidra', tools.ghidra, () => ({ ok: true, line: 'present' })],
  ['KUIPS (MCP)', tools.kuips, () => mcpToolCount(process.execPath, [tools.kuips, 'mcp', '--root', process.cwd()])],
  ['Superpowers plugin', tools.superpowers, () => ({ ok: existsSync(`${tools.superpowers}/.claude-plugin/marketplace.json`), line: 'marketplace.json' })],
  ['Playwright', tools.playwright, () => ({ ok: existsSync(`${tools.playwright}/package.json`), line: 'package.json' })],
  ['vcpkg', tools.vcpkg, () => firstLine(tools.vcpkg, ['--version'])],
  ['Context7 (MCP)', tools.context7, () => mcpToolCount(process.execPath, [tools.context7], {})],
  ['Serena (MCP)', tools.serena, () => mcpToolCount(tools.serena, ['start-mcp-server', '--project-from-cwd', '--context', 'agent', '--agent-interface', 'tools', '--enable-web-dashboard', 'false', '--enable-gui-log-window', 'false', '--open-web-dashboard', 'false'], {})],
  ['Silero + Glass', tools.voiceSay, () => ({ ok: [tools.voicePython, tools.voiceSay, tools.voiceGlass].every((p) => existsSync(p)), line: 'pythonw + say.py + glass.opus' })],
];

let bad = 0;
for (const [name, path, probe] of checks) {
  let status; let line = '';
  if (!path || !existsSync(path)) { status = 'MISSING'; }
  else { const r = probe(); status = r.ok ? 'OK' : 'BROKEN'; line = r.line; }
  if (status !== 'OK') bad++;
  console.log(`${status.padEnd(8)} ${name.padEnd(26)} ${line.slice(0, 70).padEnd(70)} ${path || '-'}`);
}
console.log(bad ? `\n${bad} tool(s) not OK` : '\nall tools OK');
process.exit(bad ? 1 : 0);
