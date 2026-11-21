# Bug 02 — silent-storm-port собирается, но не показывает принятый runtime

**Status:** 🔬 research-only · **Severity:** S2 · **Version/build:** `57b49ef`, MSVC x86 Debug ·
**When/context:** 2026-11-21, после успешной сборки 1356 шагов

## Goal vector / done when

**Type:** Achieve. `silent_storm.exe` должен пройти существующий native smoke по документированному
сценарию порта и показать наблюдаемый экран без аварийного завершения.

## Symptom

Собранный `build/msvc-debug/bin/silent_storm.exe` завершился с кодом 127 через несколько секунд,
без stdout/stderr и без процесса с главным окном. Исторические логи в data root не обновились.

## Repro

1. Восстановить upstream, bgfx и vcpkg dependencies.
2. Выполнить `cmake --preset msvc-debug` и `cmake --build --preset msvc-debug` с vcvars32.
3. Запустить полученный `silent_storm.exe` на `upstream/Complete` и прочитать код/журналы.

## Forensics

- Сборка и `ss_state_translator_test.exe` завершились с кодом 0.
- Проверка PE imports не нашла отсутствующей продуктовой DLL после восстановления runtime paths;
  оставшиеся имена относились к внутренним компонентам Windows.
- Причина пока не наблюдена; код 127 сам по себе не локализует дефект.

## Root cause / Hypotheses

Нужно отличить loader failure, ранний программный выход и несовместимость данных. Исторические
«phase complete» документы не являются проверкой этого checkout.

## Fix plan

1. Выполнить поставленные smoke-тесты порта и зафиксировать их результаты.
2. Запустить игру с новым, отдельным log directory и инструментировать ранний вход/выход, если
   существующие журналы остаются пустыми.
3. Сузить причину по наблюдению, затем изменить только соответствующий код или setup.

## Decisions made without the owner

Использованы штатные зависимости и локальный upstream; сторонний репозиторий не опубликован.
