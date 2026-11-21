# Test run report — Kimi context-window hook

**Created:** 2026-11-21 15:33 +03:00 · **Run by:** Kimi · **Version/build:** working tree, Kimi Code CLI 2.7.2

## 1. Work

Fix `bugs/03`: Kimi auto-compacted during a long turn before the Stop-only KAIF hook could start the
soft closure. Expected basis: `.kaif/kaif.json` thresholds 75/80/85/92 and the owner's request to
rework the hook. Official contract: Kimi configuration docs, `loop_control` and `token_counting`.

## 2. Contour

REAL WORLD: accumulated · the owner's live Kimi session and existing 1M model configuration ·
`session_e2cb9129-33d8-4117-8cd0-2ad6c4494d72/agents/main/wire.jsonl`. Synthetic 85%/compaction
fixtures run through the real hook executable in a temporary KIMI_CODE_HOME, not a mocked decision.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-21 15:22 +03:00 | `node .kaif/hooks/context-window.mjs --selftest` | all ok after fixture correction |
| 2 | 2026-11-21 15:22 +03:00 | real `--kimi` PostToolUse on the live wire | exit 0 · read 127927 · silence below 75 % |
| 3 | 2026-11-21 15:22 +03:00 | mutant copy with wire reading disabled | exit 1 · exactly both new Kimi cases red |
| 4 | 2026-11-21 15:22 +03:00 | `kimi doctor` | config valid |
| 5 | 2026-11-21 15:22 +03:00 | `npm run doctor` | 17/17 OK |
| 6 | 2026-11-21 15:33 +03:00 | `node .kaif/tools/kaif-experience-lint.mjs check` | 0 findings |

## 4. Checks

Hygiene: selftest all ok; config doctor valid; experience lint 0; mutation red on both addressed cases.
Functional run: real PostToolUse events walked through the deployed hook; READ the emitted 85 % soft
closure line, its once-only silence, the post-compaction reset and fresh 80 % cut line; on the owner's
live current wire READ state `seen: 127927` and correct silence below the threshold.

| Case | Status | Observation |
|---|---|---|
| Smoke: current live session measured without false close | pass | 127927 tokens, exit 0, no output |
| 85 % during PostToolUse | pass | 891655/1048576 → 85 % + `/skill:end-chat-soft` |
| Duplicate level | pass | second identical event silent |
| Compaction and stale records | pass | PostCompact/reset silent; pre-compaction count ignored |
| Rearm at fresh 80 % | pass | 840000/1048576 → logical-cut line |
| Broken-version control | pass | disabled wire read → exactly the two new cases red |

## 5. Found

- none

Observation notes: the displayed count and compaction's internal `tokensBefore` differ (891655 vs
851835); no exact reserved threshold is inferred. One fixture initially used 800000 as though it were
80 % of 1048576; the hook correctly reported 76 %, and the fixture was corrected to 840000.

## 6. Traces

- live `context.apply_compaction`: tokensBefore 851835, tokensAfter 23531
- `.kaif/context-window.json` current session `seen: 127927`
- `bugs/03_DONE_kimi_context_window.md`
- commands and outputs in this session transcript

## 7. Verdict

pass — the hook's intended warning path was executed and read during a turn, including the real
current session and a broken-version control. No claim is made about Kimi's undisclosed reserve.
