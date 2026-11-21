// Call the owner through the installed Silero + Glass voice without blocking Kimi's hook runner.
// [TESTED: 2026-11-21 · real PermissionRequest call, owner heard Glass + Eugene, soft voice log · .kaif/kimi-voice.log]
import { spawn } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const PYTHON = 'D:/work/ai_sandbox/tools/silero_tts/venv/Scripts/pythonw.exe';
const SAY = 'D:/work/ai_sandbox/tools/silero_tts/say.py';
const PHRASE = 'Николай, это Кими. Нужно ваше разрешение.';
const MARKER = join('.kaif', 'kaif.json');

function projectRoot(cwd) {
  for (let dir = resolve(cwd || '.'); ;) {
    if (existsSync(join(dir, MARKER))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const pad = (value) => String(value).padStart(2, '0');
function stamp(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

try {
  const event = JSON.parse(readFileSync(0, 'utf8').replace(/^\uFEFF/, '') || '{}');
  if (event.hook_event_name !== 'PermissionRequest') process.exit(0);
  const root = projectRoot(event.cwd || process.cwd());
  if (!root) process.exit(0);

  const voiceDir = join(root, 'voice');
  mkdirSync(voiceDir, { recursive: true });
  const phraseFile = join(voiceDir, `${stamp()}_permission-request.txt`);
  writeFileSync(phraseFile, `${PHRASE}\n`, 'utf8');

  if (process.argv.includes('--dry-run')) {
    console.log(`KAIF voice: prepared ${phraseFile}`);
    process.exit(0);
  }

  const logFile = join(root, '.kaif', 'kimi-voice.log');
  const log = openSync(logFile, 'a');
  const child = spawn(PYTHON, ['-I', SAY, '--file', phraseFile], {
    windowsHide: true,
    stdio: ['ignore', log, log],
  });
  child.on('error', (error) => writeFileSync(logFile, `voice spawn failed: ${error.message}\n`, { flag: 'a' }));
  child.unref();
  closeSync(log);
} catch {
  // Hooks fail open: a voice failure must never block the permission flow.
}
process.exit(0);
