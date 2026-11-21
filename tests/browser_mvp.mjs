// Functional browser run of the generated MVP, with observable input and screenshot evidence.
// [TESTED: 2026-11-21 · functional headed Chromium run · testcases/reports/2026-11-21_browser_mvp.md]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { tools } from '../tools/toolchain.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(tools.playwright);
const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'build', 'web');
const screenshot = join(root, 'testcases', 'reports', '2026-11-21_browser-mvp.png');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm' };

for (const file of ['index.html', 'kr.js', 'kr.wasm']) {
  if (!existsSync(join(dist, file))) throw new Error(`missing web artifact: ${file}`);
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const relative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.slice(1));
  const file = resolve(dist, relative);
  if (!file.startsWith(`${dist}${require('node:path').sep}`) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end('not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(response);
});
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();

let browser;
const consoleLines = [];
try {
  browser = await chromium.launch({
    headless: process.env.KR_BROWSER_HEADED !== '1',
    args: ['--enable-unsafe-webgpu', '--ignore-gpu-blocklist'],
  });
  const context = await browser.newContext({ viewport: { width: 800, height: 600 }, hasTouch: true });
  const page = await context.newPage();
  page.on('console', (message) => consoleLines.push(`${message.type()}: ${message.text()}`));
  page.on('pageerror', (error) => consoleLines.push(`pageerror: ${error.message}`));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('#status')?.dataset.state !== 'loading', { timeout: 60000 });
  const initialState = await page.locator('#status').getAttribute('data-state');
  const statusText = await page.locator('#status').textContent();
  console.log(`initial WebGPU state: ${initialState} — ${statusText}`);
  if (initialState !== 'ready') throw new Error(`WebGPU not ready: ${statusText}`);

  const canvas = page.locator('#canvas');
  await page.mouse.move(400, 300);
  await page.mouse.click(400, 300);
  await page.waitForFunction(() => Number(document.querySelector('#canvas')?.dataset.pointerCount) > 0);
  console.log(`pointer evidence after mouse: ${await canvas.getAttribute('data-pointer-count')}`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.touchscreen.tap(195, 422);
  const count = Number(await canvas.getAttribute('data-pointer-count'));
  if (count < 2) throw new Error(`touch did not reach the C++ input path: count=${count}`);
  console.log(`pointer evidence after touch: ${count}`);
  await page.screenshot({ path: screenshot });
  console.log(`screenshot: ${screenshot}`);
  console.log('console:\n' + consoleLines.join('\n'));
} finally {
  console.log('console:\n' + consoleLines.join('\n'));
  if (browser) await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
