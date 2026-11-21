# Test run report — browser MVP vertical slice

**Created:** 2026-11-21 14:39 +03:00 · **Run by:** Kimi Code ·
**Version/build:** root working tree; C++20 / Catch2 3.16.1 / Emscripten 7.0.0 / EmdawnWebGPU

## 1. Work

Verified the acceptance criteria of `plans/01_browser_mvp.md`: native core behavior, the core/platform
boundary, web artifact generation, real WebGPU presentation, mouse/touch input and viewport resize.
The source case set is `tests/kr_core_test.cpp` plus the functional driver `tests/browser_mvp.mjs`.

## 2. Contour

Native Win32 Debug on Visual Studio 2022; web Release served from `build/web` over local HTTP.
Browser: Playwright Chromium on the logged-in Windows desktop. `KR_BROWSER_HEADED=1` is required here
because headless Chromium returned `No available adapters`. No production deployment is involved.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-21 14:39 +03:00 | `npm run check:core` | 0 · no forbidden platform include in `core/` |
| 2 | 2026-11-21 14:39 +03:00 | `npm run test:native` | 0 · Catch2 executable and CTest passed |
| 3 | 2026-11-21 14:39 +03:00 | `npm run build:web` | 0 · `index.html`, `kr.js`, `kr.wasm` produced |
| 4 | 2026-11-21 14:39 +03:00 | `KR_BROWSER_HEADED=1 npm run test:browser` | 0 · WebGPU, mouse, touch, resize observed |
| 5 | 2026-11-21 14:39 +03:00 | `npm run kimi:skills` | 0 · 37 valid project skills |
| 6 | 2026-11-21 14:39 +03:00 | `npm run doctor` | 0 · all 17 tools OK |
| 7 | 2026-11-21 14:39 +03:00 | `npm run kaif:check` | 0 · manifest and synchronized mirrors satisfied |

## 4. Checks

Hygiene: 3 core cases passed; source guard green; 37/37 skill files valid; 17/17 tool checks green.
Functional run: the generated page was opened through HTTP in headed Chromium; console, HUD, input
counters, resize log and the captured canvas were read.

| Case | Status | Observation |
|---|---|---|
| Initial core viewport and clear color | pass | native Catch2 expectations passed |
| Pointer normalization and bounds | pass | native Catch2 expectations passed |
| WebGPU startup | pass | HUD state `ready`; console `[KR] WebGPU ready` |
| Mouse input | pass | observable pointer count reached 3 |
| Touch input | pass | observable pointer count reached 4 |
| Desktop to touch-sized resize | pass | console reported 800×600 then 390×844 |
| Visible WebGPU frame | pass | screenshot shows the rendered color and readable HUD |
| Browser console hygiene | pass | final run has no 404 or page error |

## 5. Found

- `bugs/01_reconstruction_native_runtime.md` — separate historical native runtime is not accepted.
- `bugs/02_port_native_runtime.md` — separate port runtime is not accepted.
- No defect remained in the browser MVP's final run.

## 6. Traces

- `testcases/reports/2026-11-21_browser-mvp.png`
- `tests/browser_mvp.mjs`
- `tests/kr_core_test.cpp`
- `plans/01_browser_mvp.md`

## 7. Verdict

pass — the browser vertical slice met its stated acceptance criteria by observed native and functional runs.
