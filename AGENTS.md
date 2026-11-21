# Agent rules

This project is KAIF-wrapped and uses Superpowers. Before every task read `AGENT_GUIDE.md` (the canon) and `STATUS.md` (current state); think per `PHILOSOPHY.md`; write requirements per `REQUIREMENTS_FRAMEWORK.md`; test per `TESTING_FRAMEWORK.md`; debug per `BUG_FIXING_FRAMEWORK.md`; execute tasks per the fable loop (`/skill:fable-method`, `/skill:fable-judge`).

Invoke every relevant project or Superpowers skill before acting on the task. Project skills live in `.agents/skills/`; Superpowers skills come from the enabled `superpowers` Kimi plugin. Do not substitute a remembered skill for its current file.

## Kimi Code conventions

- Invoke project skills explicitly as `/skill:<name>`. Start a fresh work session with `/skill:resume`; Kimi's unprefixed session-history command is a different feature.
- A message that opens with the word `resume` (or its Russian alias) is an ORDER to run `/skill:resume` in full before the rest of the message (`AGENT_GUIDE.md` → "A leading skill word is an order").
- Monitor context occupancy throughout the session. Follow `.kaif/kaif.json` → `contextWindow`: warn at 75%, reach a logical cut at 80%, start `/skill:end-chat-soft` at 85%, and use `/skill:end-chat-force` at 92% when closure has not begun. After compaction, re-read the core documents and refresh `.kaif/refresh-marker.json`.
- Close a normal work session through `/skill:end-chat-soft`; use `/skill:end-chat-force` only for urgent closure. Write the handover to `STATUS.md` and `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` so the next `/skill:resume` can restore the work.
- Project MCP servers live in `.kimi-code/mcp.json`. They become available in a new trusted session; `/reload` refreshes skills and plugin configuration.
