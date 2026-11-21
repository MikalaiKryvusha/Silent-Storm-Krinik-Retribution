# Домашние правила — Krinik-Retribution

> Уровень 4 таксономии документов (`AGENT_GUIDE.md`): местный закон этого проекта. `AGENT_GUIDE.md`
> отвечает, КАК агент работает (метод KAIF); этот файл — С ЧЕМ он работает здесь: правила владельца,
> внешние системы, стенды, досье машины, маршруты и инструменты. `/resume` читает его на входе в сессию.

**Создан:** 2026-11-21 · **Владелец:** Mikalai Kryvusha · **Перенесено из гайда:** пока ничего

## 1. Постоянные правила владельца

### R1. Инструменты хранить в `D:\work\ai_sandbox\_tools\` (или выше, в `D:\work\ai_sandbox\`)

1. Ставь любой новый инструмент (SDK, компилятор, утилиту) в `D:\work\ai_sandbox\_tools\<имя>`.
2. Перед установкой ищи уже установленное: `_tools\`, `D:\work\ai_sandbox\`, Visual Studio, PATH.
3. Ссылайся на инструмент из проекта по абсолютному пути (таблица §6), не копируй его в репозиторий.
- **Исключение:** зависимости сборки, которые CMake скачивает сам (Catch2 через FetchContent), живут в `build/`.

[OWNER] 2026-11-21 · `GOAL.md` → «Инструменты для работы храним в» · коммит `af47732`

## 2. Внешние системы и доступ

| Система | Что агент там делает | Точка входа | Где лежат учётные данные |
|---|---|---|---|
| GitHub — репозиторий проекта | push, issues, releases (по правилам git-политики гайда) | `https://github.com/MikalaiKryvusha/Krinik-Retribution`, `gh` | системное хранилище ключей Windows (`gh auth status` → keyring) |

## 3. Стенды, окружения и устройства

| Стенд / устройство | Для чего | Как агент до него дотягивается | Известные ловушки |
|---|---|---|---|
| Браузер Chromium (Playwright) | функциональный прогон веб-сборки | `npm run test:browser`; при необходимости `KR_BROWSER_HEADED=1 npm run test:browser` | WebGPU headless на этой машине не даёт adapter; headed разрешён владельцем и проверен на реальном MVP |

## 4. Досье окружения — факты машины

> **Досье окружения.** Снято: `2026-11-21` · Пересъёмка: `/refresh-context` → шаг досье (перезапусти
> пробы из колонки 3 и перепиши значения и эту дату) · **Устаревание: факты старше четырёх недель —
> ГИПОТЕЗЫ, перепроверь перед опорой на них.**

| Факт | Значение | Проба |
|---|---|---|
| ОС | Windows 11 Pro 10.0.26200 | `ver` |
| CPU / RAM / GPU | AMD Ryzen 7 5700G (8 ядер / 16 потоков) · 32 ГБ · NVIDIA GeForce RTX 5070 Ti, драйвер 621.01 | `Get-CimInstance Win32_Processor` · `nvidia-smi` |
| Диски | D: ≈ 28 ГБ свободно из 954 (98 % занято) · C: ≈ 223 ГБ свободно | `df -h /c /d` |
| Оболочки | Git Bash (основная для агента) · Windows PowerShell 5.1 | — |
| Кодировка консоли | cp866 (OEM); PowerShell `[Console]::OutputEncoding` = cp866 | `chcp` |
| Локаль | PowerShell `ru-RU`; Git Bash `LANG` не задан | `(Get-Culture).Name` · `echo $LANG` |
| Среды выполнения | Node 24.15.0 (PATH) · Node 24.22.2 (`_tools\node24`) · Python 3.14.4 · Java (OpenJDK) 25.0.5.1 · git (mingw64) | `node -v` · `python --version` · `java -version` |
| Сборка C++ | MSVC 14.44 (VS 2022 Community) · CMake 3.31.6 и Ninja 1.12.1 из VS · Windows SDK 10.0.26100 | см. §6 |
| `tar` / `curl` / `find` в Git Bash | `/usr/bin/tar` (GNU tar 1.35) · `/mingw64/bin/curl` · `/usr/bin/find` | `type tar curl find` |
| Политика переводов строк | `core.autocrlf=true` · credential helper `manager` | `git config --get core.autocrlf` |
| Пакетные менеджеры | winget 1.29 · Chocolatey · npm | `winget --version` |
| Node и пути Git Bash | Windows-`node` не понимает пути вида `/c/...` — передавай `C:/...` | (урок этой сессии) |

## 5. Маршруты, рецепты и соглашения — указатель своей работы

| Поверхность | Где лежит работа | Что покрывает |
|---|---|---|
| Push и авторизация на GitHub | `gh` (keyring, протокол https) — `gh auth setup-git` при сбое | non-fast-forward → `git pull --rebase` → повтор (`AGENT_GUIDE.md` → «Push / GitHub authentication») |
| Сигнатуры WebGPU (emdawnwebgpu) | `_tools\emsdk\upstream\emscripten\cache\ports\emdawnwebgpu\emdawnwebgpu_pkg\webgpu_cpp\include\webgpu\webgpu_cpp.h` | колбэки — лямбды `(Status, Object, StringView)`; поверхность — `EmscriptenSurfaceSourceCanvasHTMLSelector` |

## 6. Инструменты этого проекта

| Инструмент | Где / команда | Для чего |
|---|---|---|
| KAIF 2.9 (+ 2.10 WIP) | `node .kaif/kaif-core.mjs <команда>` · `npm run kaif:check` · `npm run kimi:skills` | методология: канон, 37 нативных скилов Kimi в `.agents/skills/`, проверка их YAML и команд |
| Kimi Code | проектный `AGENTS.md` · `.kimi-code/mcp.json` | основная агентская среда; вход `/skill:resume`, мягкое закрытие `/skill:end-chat-soft` |
| Emscripten SDK 7.0.0 | `D:\work\ai_sandbox\_tools\emsdk` (`upstream\emscripten\emcc.exe`, конфиг `.emscripten`) | C++ → WebAssembly |
| EmdawnWebGPU (Dawn v20260423.175430) | флаг `--use-port=emdawnwebgpu` (порт кешируется в emsdk) | WebGPU из C++ (`webgpu.h` / `webgpu_cpp.h`) |
| LLVM 23.1.6 | `D:\work\ai_sandbox\_tools\clang+llvm-23.1.6-x86_64-pc-windows-msvc\bin` | clang-cl, clang-tidy, clang-format, Static Analyzer, ASan, UBSan, libFuzzer |
| MSVC 14.44 + ASan | Visual Studio 2022 Community (`VC\Auxiliary\Build\vcvars64.bat`) | нативная сборка и тесты, `/fsanitize=address` |
| CMake 3.31.6 · Ninja 1.12.1 | `C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\CMake\` | система сборки |
| Catch2 v3.16.1 | CMake FetchContent (`tests/CMakeLists.txt`) | модульные тесты C++ |
| Superpowers 7.0.2 | `D:\work\ai_sandbox\_tools\superpowers` · нативный `.kimi-plugin/plugin.json`; установка `/plugins install D:/work/ai_sandbox/_tools/superpowers` | навыки процесса: brainstorming, планы, TDD, отладка, ревью; автозагрузка `using-superpowers` |
| Silero + Glass | `D:\work\ai_sandbox\tools\silero_tts\venv\Scripts\pythonw.exe -I D:\work\ai_sandbox\tools\silero_tts\say.py --file <фраза.txt>` | голосовой зов владельца; `tools/kimi-voice-hook.mjs` вызывает фоном на `PermissionRequest` |
| KUIPS 1.3.1 | `D:\work\ai_sandbox\KUIPS\bin\kuips.mjs` · MCP `kuips` в `.mcp.json` · манифест `design/flow-map/flow-map.json` | прототипирование интерфейса: экраны, переходы, снимки |
| REA 6.10.1 | `D:\work\ai_sandbox\_tools\node24\rea` (Node 24.22.2) · MCP `rea` в `.mcp.json` | MCP-набор для исследования программ (263 инструмента) |
| Ghidra 12.2 | `D:\work\ai_sandbox\_tools\ghidra\ghidra_12.2_PUBLIC` (`GHIDRA_INSTALL_DIR` для REA) | движок анализа нативных бинарников для REA |
| Playwright | пакет в `D:\work\ai_sandbox\KUIPS\node_modules\playwright`, браузеры в `%LOCALAPPDATA%\ms-playwright` | функциональный прогон в браузере, снимки |

## 7. Знания о продукте

Пока нет: концепция игры Krinik-Retribution — решение владельца, ещё не принято.
