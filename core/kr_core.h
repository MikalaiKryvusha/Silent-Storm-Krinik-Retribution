#pragma once

#include <array>

namespace kr {

// Platform-independent state for the first browser vertical slice.
// [TESTED: 2026-11-21 · Catch2 native cases + browser input · testcases/reports/2026-11-21_browser_mvp.md]
struct PrototypeState {
  int width = 0;
  int height = 0;
  float pointerX = 0.0F;
  float pointerY = 0.0F;
  unsigned pointerCount = 0;
};

PrototypeState makePrototypeState(int width, int height);
void setViewport(PrototypeState& state, int width, int height);
void registerPointer(PrototypeState& state, float x, float y);
std::array<float, 4> clearColor(const PrototypeState& state);

}  // namespace kr
