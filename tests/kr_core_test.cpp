#include <catch2/catch_approx.hpp>
#include <catch2/catch_test_macros.hpp>

#include "kr_core.h"

using Catch::Approx;

TEST_CASE("prototype starts with a known viewport and clear color") {
  const auto state = kr::makePrototypeState(800, 600);
  REQUIRE(state.width == 800);
  REQUIRE(state.height == 600);
  REQUIRE(state.pointerCount == 0);
  const auto color = kr::clearColor(state);
  REQUIRE(color[0] == Approx(0.02F));
  REQUIRE(color[1] == Approx(0.03F));
  REQUIRE(color[2] == Approx(0.08F));
  REQUIRE(color[3] == Approx(1.0F));
}

TEST_CASE("pointer position is normalized into the clear color") {
  auto state = kr::makePrototypeState(800, 600);
  kr::registerPointer(state, 400.0F, 300.0F);
  REQUIRE(state.pointerX == Approx(400.0F));
  REQUIRE(state.pointerY == Approx(300.0F));
  REQUIRE(state.pointerCount == 1);
  const auto color = kr::clearColor(state);
  REQUIRE(color[0] == Approx(0.27F));
  REQUIRE(color[1] == Approx(0.28F));
}

TEST_CASE("pointer coordinates stay inside the viewport") {
  auto state = kr::makePrototypeState(800, 600);
  kr::registerPointer(state, -50.0F, 900.0F);
  REQUIRE(state.pointerX == 0.0F);
  REQUIRE(state.pointerY == 600.0F);
  const auto color = kr::clearColor(state);
  REQUIRE(color[0] == Approx(0.02F));
  REQUIRE(color[1] == Approx(0.53F));
}
