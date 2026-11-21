# Bug 03 — Kimi сжимал контекст до срабатывания хука окна

**Status:** ✅ DONE · **Severity:** S2 · **Version/build:** Kimi Code CLI 2.7.2 ·
**When/context:** 2026-11-21, автоматическое compaction при показанных 85 %
**Closed:** 2026-11-21 15:22 +03:00

## Goal vector / done when

**Type:** Achieve. Во время длинного хода Kimi свежий счётчик окна должен запускать предупреждения
75/80/85 % до автоматического compaction; после compaction старые записи не должны считаться текущими.

## Symptom

Kimi выполнил автоматическое compaction, хотя KAIF не успел начать мягкое закрытие на 85 %.
Предыдущий адаптер ждал `Stop`, которое наступает только после завершения хода.

## Repro (deterministic)

1. Записать в Kimi `agents/main/wire.jsonl` `token_counting.measured` с 891655 токенами.
2. Вызвать `.kaif/hooks/context-window.mjs --kimi` с событием `PostToolUse`.
3. Ожидание: одна строка 85 % с `/skill:end-chat-soft`; повтор без новой ступени молчит.
4. Добавить `context.apply_compaction`, вызвать `PostCompact`, затем свежий счётчик 840000.
5. Ожидание: старые 85 % не возвращаются, свежие 80 % дают ступень логического среза.

## Forensics

- Живой `context.apply_compaction`: `tokensBefore: 851835`, `tokensAfter: 23531`.
- Последний `token_counting.measured` перед ним: 891655 — 85,04 % от 1048576.
- Официальная документация Kimi: внешний счётчик по умолчанию `measured+estimated`; внутренний
  compaction управляется `loop_control.reserved_context_size`. Это разные значения.
- До исправления Kimi-адаптер учитывал только `ev.usage` на `Stop` и не читал wire во время хода.

## Root cause

Неправильно выбраны событие и источник измерения для Kimi: `Stop` слишком поздно, а provider usage
не обязан совпадать с отображаемым `token_counting.measured`.

## Fix

- `lastKimiContext` читает свежий `token_counting.measured`, с fallback на `usage.record`;
  запись `context.apply_compaction` отсекает старую историю.
- `kimiWireOf` находит журнал по `session_id` в `$KIMI_CODE_HOME/sessions`.
- Хук подключён к `UserPromptSubmit` и `PostToolUse`; `Stop` и `PostCompact` сохранены.
- Блокирующий ответ на 85/92 % используется только на `Stop`; observation-only события не блокируются.
- Тот же fix перенесён в канонический `D:/work/ai_sandbox/KAIF/framework/hooks/`.

## Verification

[TESTED: 2026-11-21 15:22 +03:00 · настоящий hook executable на Kimi-событиях и живом wire ·
отчёт `testcases/reports/2026-11-21_kimi_context_window.md`]

- Hygiene: `node .kaif/hooks/context-window.mjs --selftest` — all ok; `kimi doctor` — config valid;
  `npm run doctor` — 17/17 OK.
- Functional run: `PostToolUse` на fixture 85 % выдал soft closure один раз; compaction + fresh 80 %
  сработали повторно. Mutant без чтения wire сделал оба новых сценария красными.
- REAL WORLD: accumulated · текущий живой `session_e2cb9129…/agents/main/wire.jsonl` · хук прочитал
  127927 токенов, ниже порога корректно промолчал, exit 0.

## Decisions made without the owner

[AI] Для предупреждений выбран отображаемый Kimi `token_counting.measured`, а не внутренний
`tokensBefore`: владелец видит первый. Точный резерв auto-compaction не выдумывается и в расчёт не
подставляется. Claude-ветка не изменена.

## Links

- https://www.kimi.com/code/docs/en/kimi-code-cli/configuration/config-files.html
- https://www.kimi.com/code/docs/en/kimi-code-cli/guides/sessions.html
- `D:/work/ai_sandbox/KAIF/researches/48_kimi_code_adapter_recon.md` §5
