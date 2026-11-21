# Research 02 — additional Kimi tooling for a large game codebase

> **Created:** 2026-11-21 · **Parent:** Owner's request to find and install only active, proven tools that materially improve Kimi · **Status:** Candidates selected; installation and MCP verification in progress · **Outbound:** only observed-working tools may enter `.kimi-code/mcp.json` and the project toolchain

## Selection rule

Kimi already provides skills, subagents, hooks, MCP, browser automation and goal mode. KAIF and Superpowers already own the work methodology. Another planning framework would add conflicting instructions rather than capability. New tools must add a measurable capability to this large legacy C++ project.

## Evidence collected on 2026-11-21

| Candidate | Observed activity and adoption | Useful capability here | Decision |
|---|---|---|---|
| `oraios/serena` | 31,562 GitHub stars; 2,148 forks; pushed 2026-11-19; release v2.1.0 on 2026-10-19 | LSP-backed symbol retrieval, references, diagnostics and symbol editing for C/C++; installed LLVM already contains `clangd.exe` | Install and verify |
| `upstash/context7` | 65,208 GitHub stars; 3,260 forks; pushed 2026-11-20; current releases | Current, versioned library documentation through MCP instead of recalled APIs | Install and verify |
| `bmad-code-org/BMAD-METHOD` | 55,590 stars; active; current release | Another agile/planning methodology | Reject here: overlaps KAIF + Superpowers |
| Claude-specific orchestration/plugins | Varies | Not native to Kimi or duplicates built-in Agent/AgentSwarm/goals | Reject |

## Verification contract

1. Install tools outside the product repository under `D:/work/ai_sandbox/_tools/`.
2. Run each server's own version/help or initialization command.
3. Perform an MCP `initialize` + `tools/list` handshake and read the tool names.
4. For Serena, use C/C++ with the installed `clangd`; a handshake alone does not prove semantic analysis. Run a real symbol lookup after a compile database exists.
5. Record failures as blocked; do not document installation as working from popularity alone.

## License note

Serena's application is GPL-3.0-or-later and SolidLSP is MIT. It is used as an external local tool, not copied into the MIT product. Context7 is MIT. Original game data remains under its own license.
