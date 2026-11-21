# Bug 01 — Reconstruction собирается, но runtime на текущих данных не принят

**Status:** 🔬 research-only · **Severity:** S2 · **Version/build:** `ae4c7f2`, Win32 Release ·
**When/context:** 2026-11-21, первая проверка исходных деревьев

## Goal vector / done when

**Type:** Achieve. Собранный Reconstruction должен пройти воспроизводимый сценарий загрузки на
совместимых данных и закрыться через harness `quit` без исключения. Текущая работа не утверждает, что
причина находится в игровом коде.

## Symptom

`Game.exe` собирается успешно. На `upstream/Versions/Current` процесс падает с access violation
`0xc0000005` после нескольких секунд; на `upstream/Complete` наблюдался ранний выход 127. Ни один
вариант не показал принятый игровой экран.

## Repro

1. Собрать `Silent-Storm-Reconstruction` как Win32 Release.
2. Запустить `build/Release/Game.exe -windowed -nosound -harness` в выбранном data root.
3. Прочитать код выхода, `_saveload.log`, `_console.log` и свежие системные события.

## Forensics

- Windows Application Error: exception `0xc0000005`, fault offset `0x0010726d` в `Game.exe` на
  `Versions/Current` (2026-11-21 13:53 +03:00).
- `Complete/game.db` имеет 34 596 563 байта; `Versions/Current/game.db` — 1827 байта. Это разные
  состояния данных, не взаимозаменяемые доказательства.
- Сборка не модифицировала исходники Reconstruction.

## Root cause / Hypotheses

Причина не установлена. Сначала проверить совместимость data root и загрузку DLL, затем снять
символический backtrace через harness; не патчить по одному offset.

## Fix plan

1. Записать минимальный data/loader inventory для каждого runtime root.
2. Запустить существующий harness на данных с полным совместимым набором и получить backtrace.
3. Открыть отдельный дефект кода только после локализации наблюдаемой причины.

## Decisions made without the owner

Использованы локальные данные из загруженного upstream; оригинальные ресурсы не опубликованы.
