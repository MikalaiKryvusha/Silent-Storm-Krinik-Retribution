# Krinik-Retribution — External structure map

> **The EXTERNAL map: what the project looks like from the outside** — directories, files and the
> dependencies between them. Companion: `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` (the logic).
> **Living reference — never DONE-tagged.** *Planned* = written into the plan, not on disk yet.

---

## The tree

```
Krinik-Retribution/
├── GOAL.md · Krinik_Reforged_TZ_Stack_and_Plan.md   # the owner's originals (verbatim, commit af47732)
├── AGENT_GUIDE.md · PHILOSOPHY.md · *_FRAMEWORK.md  # KAIF canon (agent-facing, English)
├── STATUS.md · MASTER_PLAN.md · KAIF_FRAMEWORK.md   # owner-facing state and plan (Russian)
├── HOUSE_RULES.md                                    # local law: owner rules, machine dossier, tools table
├── CMakeLists.txt                                    # root build (core + tests | core + web) [NOT-TESTED]
├── AGENTS.md · .agents/skills/                       # Kimi entry rules + 37 native project skills
├── .kimi-code/mcp.json                               # Kimi MCP: KUIPS + REA + Context7 + Serena
├── package.json                                      # doctor, build/test, kimi:skills, kaif:*
├── tools/                                            # toolchain, build, doctor, Kimi skill/voice adapters
├── design/flow-map/flow-map.json                     # KUIPS screen-flow manifest (empty skeleton)
├── testcases/reports/                                # run reports and browser screenshots
├── plans/ ideas/ bugs/ researches/ interviews/ homeworks/ reports/   # KAIF knowledge dirs
├── .claude/settings.json · .mcp.json                 # legacy Claude wiring; Kimi does not read it
├── .kaif/                                            # KAIF machinery, including Kimi hook adapters
├── core/ · tests/ · platform/web/ · web/             # working native + WASM/WebGPU vertical slice
├── upstream/                                         # separate Nival checkout used by the port; git-ignored
└── Silent-Storm-Reconstruction/ · silent-storm-port/ # owner's separate clones — git-ignored, not part of this repo
```

## What each part is

| Path | What it is | Depends on / references |
|------|-----------|-------------------------|
| `tools/toolchain.mjs` | tool paths, `KR_TOOLS` override, `emscriptenEnv()` | `D:\work\ai_sandbox\_tools`, Visual Studio 2022 |
| `tools/doctor.mjs` | `npm run doctor` — runs every tool, MCP handshakes | `tools/toolchain.mjs` |
| `.mcp.json` | MCP servers for this project: `kuips`, `rea` | `D:\work\ai_sandbox\KUIPS`, `_tools\node24\rea`, `_tools\ghidra` |
| `.claude/settings.json` | KAIF hooks (16) + Superpowers marketplace/plugin | `.kaif/hooks/`, `_tools\superpowers` |
| `CMakeLists.txt` | working native/web root build; `core/`, `tests/`, `platform/web/` | Catch2 via FetchContent; Emscripten toolchain file |
| `.kimi-code/mcp.json` | four Kimi MCP servers | KUIPS, REA, Context7, Serena; requires a trusted workspace |
| `design/flow-map/` | KUIPS manifest of screens and transitions | KUIPS 1.3.1 |
| `AUTHOR_STYLOMETRY.md` | owner's voice portrait (public snapshot) — git-ignored | copied from sibling projects |

## Cross-references & dependency rules

- `core/` depends on nothing in this repo; `platform/*` and `tests/` depend on `core/`.
- Tool paths: only `tools/toolchain.mjs` holds them; `HOUSE_RULES.md` §6 is the human table of the same facts.
- Machinery under `.kaif/` is not edited by hand — use `node .kaif/kaif-core.mjs` commands.
- The owner's originals (`GOAL.md`, the TZ) are never rewritten.

## Entry points

1. `STATUS.md` — where we are. 2. `HOUSE_RULES.md` — tools and machine. 3. `npm run doctor` — is the toolchain alive.
4. `AGENT_GUIDE.md` — how to work. 5. `MASTER_PLAN.md` — where we are going.

---

> Keep this map honest: when you add, move or rename a file/directory, or LEARN the tree differs, fix it in the same turn.
