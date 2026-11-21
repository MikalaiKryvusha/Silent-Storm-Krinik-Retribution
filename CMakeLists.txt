# Krinik-Retribution — root build.
#
# Two build flavours share one platform-independent core:
#   * native  (MSVC / clang-cl)  -> kr_core + Catch2 unit tests (CTest)
#   * web     (Emscripten)       -> kr_core + WebGPU renderer -> kr.js / kr.wasm + HTML shell
#
# Driven by tools/build.mjs (`npm run build:web`, `npm run test:native`), which sets up
# the toolchain environment; plain CMake works too when the toolchain is already on PATH.
# [TESTED: 2026-11-21 · native CTest + Emscripten/WebGPU build · testcases/reports/2026-11-21_browser_mvp.md]
cmake_minimum_required(VERSION 3.24)
project(KrinikRetribution VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

option(KR_BUILD_TESTS "Build the native Catch2 unit tests" ON)
option(KR_ASAN "Build native targets with AddressSanitizer" OFF)
option(KR_UBSAN "Build native targets with UndefinedBehaviorSanitizer (clang only)" OFF)

# --- Sanitizers (native only) -------------------------------------------------------------
if(NOT EMSCRIPTEN)
  if(KR_ASAN)
    if(MSVC)
      add_compile_options(/fsanitize=address /Zi)
      add_link_options(/INCREMENTAL:NO)
    else()
      add_compile_options(-fsanitize=address -fno-omit-frame-pointer)
      add_link_options(-fsanitize=address)
    endif()
  endif()
  if(KR_UBSAN)
    add_compile_options(-fsanitize=undefined)
    add_link_options(-fsanitize=undefined)
  endif()
endif()

# --- Warnings ------------------------------------------------------------------------------
if(MSVC)
  add_compile_options(/W4 /permissive- /utf-8)
else()
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

add_subdirectory(core)

if(EMSCRIPTEN)
  add_subdirectory(platform/web)
elseif(KR_BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
endif()
