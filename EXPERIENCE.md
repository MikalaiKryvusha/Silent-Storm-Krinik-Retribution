# EXPERIENCE — the agent's accumulated experience

> The agent's growing log of lessons. **Externalized memory of *what works and what doesn't*** — so a
> fresh, context-less session (or an autonomous loop) never repeats a dead end. Consult it BEFORE a task;
> append to it AFTER a meaningful attempt (success **or** failure). Grep, don't scroll.
>
> **Tags live inline on every entry** (not in a central list) — so one grep finds the experiences directly:
> `grep '#loop' EXPERIENCE.md` · `grep -i '#context\|#build' EXPERIENCE.md` · `grep '❌' -A4 EXPERIENCE.md`
> · `grep 'EXP-0007' EXPERIENCE.md`. Reuse an existing tag where one fits (grep to see what's in use).
>
> **Entry format (keep it short and grep-friendly).** Newest on top. Every entry starts with a stable id,
> an ISO date, an outcome marker (`✅` / `❌` / `❌→✅`), and inline `#tags`:
>
> ```
> ### EXP-0001 · 2026-01-01 · ✅ · #tag #area
> class: <slug from the class list below — the UNIT OF RECURRENCE>
> **Context:** one line — what was being done.
> **Tried / did:** the approach, briefly.
> **Result:** ✅/❌ — what happened.
> **Lesson:** the reusable takeaway (the reason this entry exists).   → link: bugs/NN · ideas/NN · plans/NN
> **Repro:** the ready-to-run command/check that verifies or applies the lesson — a weak session
>   executes a pasted command reliably, an essay it won't act on. REQUIRED since 2.1: a lesson
>   with no Repro line is not accepted (field-proven: lessons with a Repro command get executed,
>   essay-lessons get read and ignored). If the lesson genuinely has no command, say what to
>   OBSERVE instead — but say it as an action.
> **Trigger:** for class-level lessons — the decision point that must invoke this lesson, as
>   "writing X → run Y" (the lesson names WHERE it applies, instead of hoping to be remembered).
> **Not for:** the lesson's validity range — where it does NOT apply. A documented lesson is still a
>   hypothesis; applied outside its range it kills good ideas.
> ```
>
> **A lesson that repeats is a lesson that failed as text.** When the same class recurs in NEW code
> after its entry was recorded, the journal has proven insufficient — the lesson MUST become
> executable (a linter rule, a guard, a gate), and the entry gains the line
> `mechanized: <the tool>`. Two strikes → a mechanism, never a third reminder.
>
> **The deadline is RUN, not remembered** (2.7, epic EL; origin issue #69 — a field audit of one
> project's journal: 14 of 15 failure classes recurred AFTER their lesson was written, five lessons
> written 6–17 times in different words, 5.8 % mechanized): `node .kaif/tools/kaif-experience-lint.mjs
> check` reads the `class:` field as the UNIT of recurrence and reddens on the SECOND failure entry of
> one class with no `mechanized:`, naming the class and both entries by id. Two fates clear it, both
> WRITTEN: name the guard in the entry (`mechanized: <the tool>`), or re-check the price once for the
> WHOLE class and declare it — `<!-- class-ok: <slug> — <why it is not cheaply possible> -->` (an empty
> declaration is itself a finding; the declared classes are printed on the summary line and that list
> only shrinks). A third record is never a fate. It also warns when
> `mechanized:` names a command this project does not contain, and when a slug is outside the list
> below; `--shrink EXP-NNNN` collapses a MECHANIZED entry to one line pointing at its guard (shows by
> default, `--yes` writes — the text itself stays in the git history). The command belongs in the
> closing ritual (`/end-chat-soft`).
>
> **The class list of this journal** — a CONTROLLED list, not a closed one: pick a slug from it, and
> when a lesson genuinely brings a new class, add the slug here in the same write (the linter warns
> about an unlisted slug, it never refuses). The starter list below is what a field audit had already
> measured (origin issue #69) — replace and grow it with your project's own classes.
>
> <!-- classes: question-already-answered, guard-not-proven-against-threat, shown-as-link,
>      claim-before-evidence, owner-decision-not-applied, text-in-agents-world,
>      etalon-from-dirty-tree, shell-lied, escaping-layer, twins-missed,
>      field-dropped-in-rebuild -->
>
> | Class slug | The failure it names |
> |---|---|
> | `question-already-answered` | the owner is asked what his own past word, the goal doc or a run already decided |
> | `guard-not-proven-against-threat` | a guard shipped without being seen red on the threat it claims to stop |
> | `shown-as-link` | showing replaced by a link or a path instead of the thing itself |
> | `claim-before-evidence` | a claim written wider than the observation behind it |
> | `owner-decision-not-applied` | a decision the owner gave is recorded and not carried into the artifact |
> | `text-in-agents-world` | text written for the agent's own world instead of the owner's |
> | `etalon-from-dirty-tree` | a reference/etalon captured from a tree that was not clean |
> | `shell-lied` | the shell or the tool swallowed/rewrote what was passed to it |
> | `escaping-layer` | one escaping level lost between the tool and the file |
> | `twins-missed` | one of two layers/copies moved and the twin stayed behind |
> | `field-dropped-in-rebuild` | a field or section silently lost when an artifact was regenerated |
>
> The `#tags` are **trigger-tags**: before a task, grep by the task's tags and QUOTE the relevant
> lessons in your report (id + one line) — or state "no relevant lessons". An unquoted recall is
> unverifiable; `/fable-judge` checks for this line.
>
> Skill: `/experience` (capture a lesson · recall relevant lessons).

## Entries

### EXP-0003 · 2026-11-21 · ❌→✅ · #kimi #hooks #context-window #compaction
class: claim-before-evidence
**Context:** Kimi auto-compacted at a displayed 85 % before KAIF started the soft closure.
**Tried / did:** read the official `loop_control`/`token_counting` contract and the live wire; moved Kimi measurement from Stop-only usage to fresh `token_counting.measured` on prompt/tool events.
**Result:** ❌→✅ — 85 % now fires during the turn once; compaction invalidates old counts and a fresh 80 % rearms the cut step. → link: bugs/03
**Lesson:** provider usage, the displayed context count and the internal compaction trigger are different observables; adapt to the actual event stream, not to Claude's transcript shape.
**Repro:** `node .kaif/hooks/context-window.mjs --selftest` — the two Kimi wire cases pass; disabling wire reads makes both red.
**Trigger:** changing context monitoring → inspect `token_counting.measured`, `usage.record` and `context.apply_compaction` in the live wire before choosing a hook event.
**Not for:** inferring Kimi's exact reserved compaction threshold; the docs do not disclose it for this configuration.
mechanized: .kaif/hooks/context-window.mjs --selftest

### EXP-0002 · 2026-11-21 · ❌→✅ · #kimi #hooks #windows
class: shell-lied
**Context:** adapting KAIF skills/hooks and the voice/browser harness to Kimi on Windows.
**Tried / did:** treated copied Claude skills, shell commands and headless browser behavior as working by default; then added
native validators, real Kimi invocation, MCP handshakes and a headed browser run.
**Result:** ❌→✅ — all 37 copied descriptions failed YAML parsing before normalization; after it Kimi listed and invoked them.
Windows console/voice and headless WebGPU assumptions also failed until replaced by observed Kimi/Windows-specific paths.
**Lesson:** an adapter is done at the live client event, not at file copying: parse the payload, call the real path, read the result.
On Windows pass text through files, hide Python with pythonw, and use headed WebGPU where headless has no adapter. → link: plans/01
**Repro:** `npm run kimi:skills && npm run doctor && KR_BROWSER_HEADED=1 npm run test:browser`.
**Trigger:** adapting any agent mechanism → run its native schema and one real event before activation.
**Not for:** claiming every future Kimi/Chrome version behaves identically; re-probe after upgrades.
mechanized: tools/check-kimi-skills.mjs + tools/doctor.mjs + tests/browser_mvp.mjs

### EXP-0001 · 2026-11-21 · ❌ · #kaif #install #checkpoint
class: claim-before-evidence
**Context:** KAIF adaptation — writing the two project maps, then `checkpoint maps`.
**Tried / did:** sent the two map Writes and the checkpoint in ONE batch; one Write was refused ("file modified since
read" — an earlier `sed` had renamed its H1), but the checkpoint had already recorded `maps done`.
**Result:** ❌ — the checkpoint stood true for ~2 minutes while the external map was still the template; caught by
reading the tool results, fixed by Read → Write.
**Lesson:** a checkpoint (or any "done" mark) goes in a LATER call than the writes it vouches for, after their results
are read; and a file edited by a shell command must be Read again before a Write tool call.   → link: (none)
**Repro:** `grep -c "<project root>/" PROJECT_STRUCTURE_EXTERNAL_MAP.md` prints `0` before `checkpoint maps` is run.
**Trigger:** about to run `node .kaif/kaif-core.mjs checkpoint <item>` → first read the results of the writes it covers.
**Not for:** checkpoints that execute their own gate (`placeholders`, `project-name`) — those verify themselves.
mechanized: node .kaif/kaif-core.mjs check
