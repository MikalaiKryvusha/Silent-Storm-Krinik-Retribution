// tools/toolchain.mjs — the ONE place that knows where the project's tools live.
//
// Every build/test/doctor script imports these paths instead of hard-coding its own copy
// (DRY: HOUSE_RULES.md §6 is the human-readable table, this module is the machine truth —
// keep both in step). The root of the shared tools folder can be overridden with the
// KR_TOOLS environment variable (default: the owner's rule R1, D:\work\ai_sandbox\_tools).
// [TESTED: 2026-11-21 · every path resolved and ran via `npm run doctor` (13/13 OK);
//  KR_TOOLS override observed working in the doctor control run · testcases/reports/2026-11-21_toolchain-doctor.md]
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const TOOLS_ROOT = process.env.KR_TOOLS || 'D:/work/ai_sandbox/_tools';
export const SANDBOX_ROOT = join(TOOLS_ROOT, '..');

const VS_ROOT = process.env.KR_VS_ROOT || 'C:/Program Files/Microsoft Visual Studio/2022/Community';
const VS_CMAKE = join(VS_ROOT, 'Common7/IDE/CommonExtensions/Microsoft/CMake');

// Pick the newest directory in `dir` whose name starts with `prefix` (e.g. the LLVM drop).
function newestDir(dir, prefix) {
  if (!existsSync(dir)) return null;
  const hits = readdirSync(dir).filter((n) => n.startsWith(prefix)).sort();
  return hits.length ? join(dir, hits[hits.length - 1]) : null;
}

const llvmRoot = newestDir(TOOLS_ROOT, 'clang+llvm-');
const node24Root = newestDir(join(TOOLS_ROOT, 'node24'), 'node-v24');

export const tools = {
  emsdk: join(TOOLS_ROOT, 'emsdk'),
  emcc: join(TOOLS_ROOT, 'emsdk/upstream/emscripten/emcc.exe'),
  emConfig: join(TOOLS_ROOT, 'emsdk/.emscripten'),
  emToolchainFile: join(TOOLS_ROOT, 'emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake'),
  llvmBin: llvmRoot ? join(llvmRoot, 'bin') : null,
  clangCl: llvmRoot ? join(llvmRoot, 'bin/clang-cl.exe') : null,
  clangTidy: llvmRoot ? join(llvmRoot, 'bin/clang-tidy.exe') : null,
  clangFormat: llvmRoot ? join(llvmRoot, 'bin/clang-format.exe') : null,
  cmake: join(VS_CMAKE, 'CMake/bin/cmake.exe'),
  ctest: join(VS_CMAKE, 'CMake/bin/ctest.exe'),
  ninja: join(VS_CMAKE, 'Ninja/ninja.exe'),
  vcvars64: join(VS_ROOT, 'VC/Auxiliary/Build/vcvars64.bat'),
  node24: node24Root ? join(node24Root, 'node.exe') : null,
  rea: join(TOOLS_ROOT, 'node24/rea/node_modules/rea-agents/scripts/rea.mjs'),
  ghidra: newestDir(join(TOOLS_ROOT, 'ghidra'), 'ghidra_'),
  superpowers: join(TOOLS_ROOT, 'superpowers'),
  kuips: join(SANDBOX_ROOT, 'KUIPS/bin/kuips.mjs'),
  playwright: join(SANDBOX_ROOT, 'KUIPS/node_modules/playwright'),
  vcpkg: join(TOOLS_ROOT, 'vcpkg/vcpkg.exe'),
  context7: join(TOOLS_ROOT, 'context7/node_modules/@upstash/context7-mcp/dist/index.js'),
  serena: join(TOOLS_ROOT, 'uv-bin/serena.exe'),
  voicePython: join(SANDBOX_ROOT, 'tools/silero_tts/venv/Scripts/pythonw.exe'),
  voiceSay: join(SANDBOX_ROOT, 'tools/silero_tts/say.py'),
  voiceGlass: join(SANDBOX_ROOT, 'tools/silero_tts/glass.opus'),
};

// Environment for running Emscripten without touching the user's global PATH:
// emcc reads EM_CONFIG for node/python/llvm locations.
export function emscriptenEnv(base = process.env) {
  return {
    ...base,
    EMSDK: tools.emsdk,
    EM_CONFIG: tools.emConfig,
    PATH: [join(tools.emsdk, 'upstream/emscripten'), base.PATH || base.Path || ''].join(';'),
  };
}
