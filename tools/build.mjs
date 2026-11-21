// Native and web builds for the vertical slice; all machine paths come from toolchain.mjs.
// [TESTED: 2026-11-21 · native/web build commands · testcases/reports/2026-11-21_browser_mvp.md]
import { spawnSync } from 'node:child_process';
import { copyFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { emscriptenEnv, tools } from './toolchain.mjs';

const root = resolve(import.meta.dirname, '..');
const command = process.argv[2] || 'check';

function run(tool, args, options = {}) {
  const result = spawnSync(tool, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

function checkCoreBoundary() {
  const forbidden = /#\s*include\s*[<"](?:emscripten|webgpu|windows\.h|Win32|d3d)/i;
  for (const entry of readdirSync(join(root, 'core'), { withFileTypes: true })) {
    if (!entry.isFile() || !/\.(?:h|hpp|cpp)$/.test(entry.name)) continue;
    const file = join(root, 'core', entry.name);
    if (forbidden.test(readFileSync(file, 'utf8'))) {
      console.error(`core platform boundary violated: ${file}`);
      process.exit(1);
    }
  }
  console.log('core platform boundary: OK');
}

if (command === 'check') {
  checkCoreBoundary();
} else if (command === 'native') {
  checkCoreBoundary();
  run(tools.cmake, ['-S', '.', '-B', 'build/native', '-A', 'Win32']);
  run(tools.cmake, ['--build', 'build/native', '--config', 'Debug']);
  run(tools.ctest, ['--test-dir', 'build/native', '-C', 'Debug', '--output-on-failure']);
} else if (command === 'web') {
  checkCoreBoundary();
  run(tools.cmake, ['-S', '.', '-B', 'build/web', '-G', 'Ninja', `-DCMAKE_TOOLCHAIN_FILE=${tools.emToolchainFile}`, `-DCMAKE_MAKE_PROGRAM=${tools.ninja}`, '-DCMAKE_BUILD_TYPE=Release'], { env: emscriptenEnv() });
  run(tools.cmake, ['--build', 'build/web'], { env: emscriptenEnv() });
  copyFileSync(join(root, 'web', 'index.html'), join(root, 'build', 'web', 'index.html'));
} else {
  console.error('usage: node tools/build.mjs check|native|web');
  process.exit(2);
}
