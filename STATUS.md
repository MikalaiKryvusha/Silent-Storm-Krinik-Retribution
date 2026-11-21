# Krinik-Retribution — текущий статус

> Агент читает этот файл перед каждой задачей и обновляет при каждом значимом изменении. Это главная
> передача эстафеты между сессиями: новая сессия с пустым контекстом должна стать продуктивной по
> одному этому файлу. 🧠 Главный принцип — `PHILOSOPHY.md` (KISS + Оккам); рабочий канон — `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS — сводка «сейчас», не летопись** (ориентир ~200 строк). Закрытое переезжает дословно в
> `PROJECT_HISTORY.md` (стрижка бонсая в `/skill:end-chat-soft`).

---

## Что сделано (короткий хвост — старое в PROJECT_HISTORY.md)

### Сессия 1 — 2026-11-21: фундамент ✅
- **KAIF 2.9 (+ предрелиз 2.10)** развёрнут из `D:\work\ai_sandbox\KAIF`, язык ru, сфера programming.
- **Название** — Krinik-Retribution (слово владельца); репозиторий GitHub переименован:
  `https://github.com/MikalaiKryvusha/Silent-Storm-Krinik-Retribution`.
- **Карты, мастер-план, домашние правила** заполнены.

### Сессия 2 — 2026-11-21 14:39 +03:00: Kimi и первый вертикальный срез ✅
- **37 KAIF-скилов** адаптированы и реально обнаружены Kimi из `.agents/skills/`; вызов `/skill:fable-method`
  подтверждён. Проверка — `npm run kimi:skills`.
- **Kimi CLI 2.7.2** установлен; адаптированные хуки активированы в `~/.kimi-code/config.toml` после
  `kimi doctor`; режим `auto` включён по `[OWNER] «Всегда ДА, разрешаю» · 2026-11-21 · чат этой сессии`.
  В новой сессии наблюдены `UserPromptSubmit` и
  запись usage через `Stop`. Контроль окна — 1 048 576 токенов, пороги 75/80/85/92%.
  После живого compaction хук исправлен: читает `token_counting.measured` на `UserPromptSubmit` и
  `PostToolUse`, а не ждёт `Stop`; 85 %, повтор и re-arm после compaction проверены (`bugs/03_DONE`).
- **Superpowers 7.0.2** имеет нативный Kimi-манифест; установка плагина ещё ждёт действия владельца ниже.
- **Инструменты:** `npm run doctor` — **17/17 OK**. Добавлены vcpkg, Context7 и Serena; Context7 выполнил
  реальный запрос документации, Serena вернула 28 MCP-инструментов.
- **Голос:** `tools/kimi-voice-hook.mjs` зовёт владельца на `PermissionRequest` через существующий
  Silero + Glass (`say.py --file`), фоном и через `pythonw.exe` без окна терминала.
- **Оба native-дерева собраны:** `Silent-Storm-Reconstruction` (Win32 Release) и `silent-storm-port`
  (MSVC x86 Debug, 1356 шагов). Загружены upstream и bgfx; vcpkg-зависимости установлены.
- **Браузерный MVP:** `core/` + native Catch2 + Emscripten/WASM + EmdawnWebGPU + HTML canvas.
  `KR_BROWSER_HEADED=1 npm run test:browser` наблюдал WebGPU ready, mouse, touch и resize 800×600 → 390×844;
  скриншот — `testcases/reports/2026-11-21_browser-mvp.png`.

---

## Где мы сейчас

Есть работающий **вертикальный срез**, не портированная игра. Следующий технический шаг — расширить ввод
и начать тактическое ядро, сохраняя source-based архитектуру из `researches/01_source_and_toolchain_recon.md`.

| Фаза (`MASTER_PLAN.md`) | Статус | Что там |
|-------|--------|--------------|
| 0 — Фундамент | ✅ | KAIF + Kimi ✅, инструменты ✅, двуязычный README ✅ |
| 1 — Браузерная платформа | 🔧 работает срез | native/WASM/WebGPU/mouse/touch ✅; wheel/щипок и полировка 🔲 |
| 2 — Тактическое ядро | 🔲 | следующая крупная задача |
| 3–5 | 🔲 | — |

---

## 🤖 Пул автономных задач (без человека и без особого железа)

- [ ] Фаза 1: wheel и pinch, дополнительные viewport/частные случаи ввода
- [ ] Фаза 2: сетка, бойцы, очки действий, путь, линия огня, смена ходов, Catch2 + ASan/UBSan
- [ ] `.clang-tidy` / `.clang-format` и команда `npm run lint` на LLVM 23.1.6
- [ ] Идея владельца на будущее: `ideas/01_64_bit_port.md` — 64-битный вариант после первого MVP

---

## ❓ Ждёт владельца (интервью / домашние задания)

- 👀 Вычитать опубликованный `README.md` на GitHub; машинная и независимая языковая проверки уже зелёные,
  окончательная оценка текста принадлежит владельцу.
- 🧰 Установить нативный Superpowers в Kimi: `/plugins install D:/work/ai_sandbox/_tools/superpowers`,
  затем `/reload` или `/new`. Проверка — `using-superpowers` появляется в новой сессии.
- 🧰 При запуске новой сессии доверить эту папку Kimi («Trust this folder»), чтобы включить четыре
  проектных MCP-сервера. Без этого Kimi намеренно их не запускает.
- 🧰 Отложенное переименование папки в `Krinik-Retribution`: закрыть VS Code/Kimi, затем в PowerShell
  `Rename-Item D:\work\ai_sandbox\Silent-Storm-Krinik-Retribution Krinik-Retribution`; после — поправить
  пути в `AGENT_GUIDE.md`, обоих MCP-конфигах и хуках Kimi.

---

## Где продолжить в следующей сессии

1. Запустить `/skill:resume` (не путать с встроенным восстановлением сессий Kimi).
2. `npm run doctor` · `git status` · `git log --oneline -5`.
3. Если Superpowers ещё не установлен — выполнить действие выше; затем продолжить текущую фазу.

KNOWLEDGE: нативные контракты Kimi для скилов, хуков, MCP, голоса и WebGPU проверены живыми вызовами;
результаты записаны в `AGENTS.md`, `HOUSE_RULES.md`, обеих картах и `researches/01–02`.

---

## Открытые баги

- `bugs/01_reconstruction_native_runtime.md` — сборка есть, runtime на текущих данных не принят.
- `bugs/02_port_native_runtime.md` — сборка есть, `silent_storm.exe` завершается без принятого окна.
  Эти исследования не блокируют уже проверенный новый WebGPU-срез.
