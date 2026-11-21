# Research 01 — source trees and the real build baseline

> **Created:** 2026-11-21 · **Parent:** `GOAL.md` and `MASTER_PLAN.md` phases 0–1 · **Status:** Active recon; dependency restoration started · **Outbound:** choose the MVP integration path from observed source, not from the original technical spec alone

## Observed trees

- `Silent-Storm-Reconstruction/`: separate repository, branch `develop`, clean, commit `ae4c7f2`. Its README reports a behavior-equivalent Silent Storm 1.2 effort and a completed Allied campaign on Steam data. The build is Win32-only with Visual Studio 2022 and CMake.
- `silent-storm-port/`: separate repository, branch `main`, clean, commit `57b49ef`. It contains SDL3 input/platform adapters, a bgfx renderer facade, miniaudio, video, UI and save-game work. Its docs record native builds and visual smoke runs, but those are historical results from another machine, not results of this checkout.
- Both remotes are reachable. The trees remain independent repositories and are excluded from the root repository.

## Dependency state observed here

- `silent-storm-port/third_party/bgfx/` is empty; `git submodule status` reports uninitialized commit `cf47cdd6b2dd1b45d19450b2b4c3a2267b6a9e87`.
- `silent-storm-port/upstream/` is absent, while the CMake files require its Nival source and game-data tree.
- `VCPKG_ROOT` is unset and no vcpkg checkout was found in the configured tools roots.
- The port's manifest requires SDL3, fmt, flatbuffers, FFmpeg and RmlUi.
- `npm run doctor` on 2026-11-21 completed with all 13 checks OK, including Emscripten 7.0.0, LLVM 23.1.6, REA (263 MCP tools), KUIPS (6 MCP tools) and Playwright.

## Architecture facts that affect the MVP

- The Reconstruction tree proves the current Windows game logic baseline; the port supplies modernization adapters. Reuse both instead of writing a replacement game core from scratch.
- The port currently documents SDL3 + bgfx with Vulkan/D3D11 native rendering. This is not yet the requested Emscripten + EmdawnWebGPU browser build.
- The port's CMake assumes `../upstream/Soft/Andy/Jan03/a5dll/` and x86 MSVC. A browser target needs an explicit compatibility inventory; x86 inline assembly and Win32-only paths cannot be assumed portable.
- Original game data remains under its own license. The root project's MIT license applies only to its own work.

## Immediate restoration

1. Clone `https://github.com/TanghaohanSC/Silent-Storm.git` as `<root>/upstream/`. Correction after the first configure: `silent-storm-port/cmake/VendoredJan03.cmake` resolves `silent-storm-port/../upstream`, so a checkout inside the port is not found.
2. Initialize the pinned bgfx submodule recursively.
3. Install vcpkg under `D:/work/ai_sandbox/_tools/vcpkg`, then use its CMake toolchain for the port's existing presets.
4. Run the native configure/build before designing the browser adaptation; record the actual compiler or linker blockers rather than copying historical success claims.

## Unresolved engineering fork

A direct Emscripten port of the Reconstruction tree and an adaptation of the bgfx-based port have different costs and risks. Do not choose between them until the native baseline and the browser-incompatible construct inventory are observed.
