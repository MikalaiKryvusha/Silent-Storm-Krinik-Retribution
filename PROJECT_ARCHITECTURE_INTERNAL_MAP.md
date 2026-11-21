# Krinik-Retribution — Internal architecture map

> **The INTERNAL map: the project's logical architecture** — the abstractions and how they interact.
> Where `PROJECT_STRUCTURE_EXTERNAL_MAP.md` says *where things live*, this says *how the system thinks*.
> **Living reference — never DONE-tagged.**
>
> State 2026-11-21 after the vertical slice: a small platform-independent core builds and passes native
> tests; the web adapter presents WebGPU clear frames and routes mouse/touch into that core. This is a
> vertical slice, not the ported Silent Storm game. Rows marked *planned* describe later behavior.

---

## The core abstractions

| Abstraction | What it *is* (essence) | Responsibility |
|-------------|------------------------|----------------|
| Simulation core (`core/`) | platform-free C++20 library | currently viewport/pointer state; later game rules, pathfinding, line of sight and turns — the only place a game result is computed |
| Platform layer (`platform/web/`) | the adapter between core and one platform | entry point, main loop, mouse/touch → core commands, core state → renderer; one directory per platform |
| Renderer (WebGPU) | EmdawnWebGPU behind the platform layer | currently turns the core state into clear frames; later draws game snapshots |
| Web shell (`web/`) | thin HTML/JS around the WASM module | canvas, resize / devicePixelRatio, HUD DOM; Emscripten owns the input callbacks |
| Toolchain registry (`tools/toolchain.mjs`) | the one machine-readable list of tool paths | every script imports paths from it; `tools/doctor.mjs` proves them |
| Methodology layer (KAIF, `.kaif/`, skills, hooks) | the agent's operating framework | canon documents, rituals, refresh hooks, guards |
| UI design layer (KUIPS, `design/flow-map/`) | screen flow map outside the code | screens, transitions, states; built and shot by the `kuips` MCP |

## How they interact

```
web shell ──events──▶ platform layer ──commands──▶ simulation core
                         │   ▲                         │
                         │   └──── read-only state ────┘
                         └──snapshot──▶ renderer ──frames──▶ canvas (WebGPU)

scripts ──paths──▶ tools/toolchain.mjs ◀──proves── tools/doctor.mjs
```

## Invariants & rules of the model

- The simulation core includes no platform, browser or graphics-API header (the RULE in `AGENT_GUIDE.md`).
- The renderer never mutates game state; the same core state renders identically on any backend.
- JavaScript is a thin shell: no game rules in JS, no per-draw-call JS↔WASM traffic.
- A tool path appears in exactly one machine place — `tools/toolchain.mjs`.

## Key decisions embedded in the architecture

- `[AI]` Core/platform split by directory, enforced by includes (cheap to check, standard for multi-platform engines).
- `[AI]` WebGPU through emdawnwebgpu (Dawn's maintained `webgpu.h` for Emscripten) instead of the deprecated `-sUSE_WEBGPU`.
- `[OWNER]` C++ → WebAssembly → Emscripten + EmdawnWebGPU → WebGPU stack · `GOAL.md` → «Технологический стек» (commit `af47732`).

---

> Keep this in sync with the real logic: when you LEARN how a part works, or see it differ from this map, the line
> here changes in the same turn. File/directory placement belongs in `PROJECT_STRUCTURE_EXTERNAL_MAP.md`.
