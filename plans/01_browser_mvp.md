# Plan 01 — browser MVP vertical slice

> **Created:** 2026-11-21 · **Parent:** `MASTER_PLAN.md` phase 1 · **Status:** Verified 2026-11-21 14:39 +03:00 — native tests, web build and headed browser run passed · **Outbound:** results recorded in `STATUS.md` and `testcases/reports/`

## Goal vector

**Type:** Achieve. The project currently has a root CMake file but no product code. Deliver the smallest real
vertical slice in which C++ owns platform-independent state, Emscripten builds it to WebAssembly, WebGPU
presents frames, and pointer input changes the visible result on desktop and touch-sized viewports.

## Acceptance criteria

- Native CTest executes the core behavior cases and exits 0.
- `npm run build:web` produces `build/web/kr.js`, `kr.wasm` and `index.html` with no compiler/linker error.
- A Playwright run opens the real page, observes WebGPU initialization or records the exact unsupported reason,
  sends pointer input and captures the visible result.
- The core includes no browser, Emscripten or WebGPU header; a source guard checks this boundary.

## Steps

- [x] Write and observe failing core tests; implement only enough core behavior to pass them.
- [x] Add native/web CMake targets and the `tools/build.mjs` command layer using `tools/toolchain.mjs`.
- [x] Add the WebGPU clear-frame platform adapter and responsive HTML canvas shell.
- [x] Build web, serve the generated directory, and run the Playwright scenario with console and screenshot evidence.
- [x] Record actual limitations; do not call the slice a game remaster or claim touch hardware was observed when only
  emulation was used.

## Risks

- **High:** legacy source portability is unrelated to this minimal slice; the slice must not be presented as the
  completed port. The source recon (`researches/01`) owns that larger integration fork.
- **Medium:** headless Chromium may lack WebGPU on this machine; capture the browser's actual capability result.
- **Low:** device-pixel-ratio changes can leave the surface stale; reconfigure it when the observed canvas size changes.
