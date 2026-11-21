// [TESTED: 2026-11-21 · Catch2 native cases + browser input · testcases/reports/2026-11-21_browser_mvp.md]
#include "kr_core.h"

#include <algorithm>

namespace kr {

PrototypeState makePrototypeState(int width, int height) {
  PrototypeState state;
  setViewport(state, width, height);
  return state;
}

void setViewport(PrototypeState& state, int width, int height) {
  state.width = std::max(width, 0);
  state.height = std::max(height, 0);
  state.pointerX = std::clamp(state.pointerX, 0.0F, static_cast<float>(state.width));
  state.pointerY = std::clamp(state.pointerY, 0.0F, static_cast<float>(state.height));
}

void registerPointer(PrototypeState& state, float x, float y) {
  state.pointerX = std::clamp(x, 0.0F, static_cast<float>(state.width));
  state.pointerY = std::clamp(y, 0.0F, static_cast<float>(state.height));
  state.pointerCount++;
}

std::array<float, 4> clearColor(const PrototypeState& state) {
  const float x = state.width > 0 ? state.pointerX / static_cast<float>(state.width) : 0.0F;
  const float y = state.height > 0 ? state.pointerY / static_cast<float>(state.height) : 0.0F;
  return {0.02F + 0.5F * x, 0.03F + 0.5F * y, 0.08F, 1.0F};
}

}  // namespace kr
