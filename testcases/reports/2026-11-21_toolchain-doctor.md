# Test run report — toolchain doctor (`npm run doctor`)

**Created:** 2026-11-21 12:03 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** working tree before the first code commit (tools/doctor.mjs, tools/toolchain.mjs)

## 1. Work

The toolchain doctor that proves every tool in `HOUSE_RULES.md` §6 is present and runs: Emscripten
7.0.0, CMake, Ninja, MSVC env, LLVM 23.1.6 (clang-cl, clang-tidy, clang-format), Node 24.22, REA MCP,
Ghidra, KUIPS MCP, Superpowers marketplace, Playwright. Basis: GOAL.md step 3 ("find local tools,
connect them; download, install and connect the missing ones") and owner rule R1 (tools live in
`D:\work\ai_sandbox\_tools`).

## 2. Contour

The owner's own workstation (Windows 11 Pro 10.0.26200, Git Bash), the real tool installs under
`D:\work\ai_sandbox\_tools`, `D:\work\ai_sandbox\KUIPS` and Visual Studio 2022 Community — no copies,
no stubs. REAL WORLD: accumulated — the owner's existing installs (REA, Ghidra, Superpowers, KUIPS were
already on disk); data and machine — the owner's machine; path — the command the agent and the owner
both run, `npm run doctor`.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-21 12:01 +03:00 | `npm run -s doctor` | exit 0 · 13/13 OK |
| 2 | 2026-11-21 12:02 +03:00 | `KR_TOOLS="$SP/empty-tools" node tools/doctor.mjs` | exit 1 · 10 MISSING (control) |

## 4. Checks

Hygiene: NONE (no lint/unit suite for the scripts yet)
Functional run: `npm run doctor` walked on the owner's machine; READ every printed line — versions and
the two MCP handshakes' tool counts; the control run READ as 10 MISSING rows and exit 1.

| Case | Status | Observation |
|---|---|---|
| C1 every tool resolves and runs | pass | 13 rows `OK`; emcc 7.0.0, clang 23.1.6, cmake 3.31.6, ninja 1.12.1, node v24.22.2 |
| C2 REA MCP answers `tools/list` | pass | `MCP: 263 tools` |
| C3 KUIPS MCP answers `tools/list` | pass | `MCP: 6 tools` |
| C4 control: empty KR_TOOLS → red | pass | 10 `MISSING`, `10 tool(s) not OK`, exit 1 |
| C5 Visual Studio rows under the control | skipped | they live outside KR_TOOLS, stay OK by design — named as GAP in the guard block |

## 5. Found

- none

## 6. Traces

- console output of runs 1–2 in this session's transcript
- `tools/doctor.mjs` guard block (THREAT · PROVED-AGAINST · GAP · ON-REAL-PATH)

## 7. Verdict

pass — every tool was observed running on the owner's machine, and the check was observed going red when the tools were absent.
