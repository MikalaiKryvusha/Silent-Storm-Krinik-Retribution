// Emscripten + EmdawnWebGPU vertical slice. Rendering reads core state but never mutates it.
// [TESTED: 2026-11-21 · headed Chromium WebGPU + mouse/touch · testcases/reports/2026-11-21_browser_mvp.md]
#include <emscripten.h>
#include <emscripten/html5.h>
#include <webgpu/webgpu_cpp.h>

#include <algorithm>
#include <cmath>
#include <cstdio>

#include "kr_core.h"

namespace {

wgpu::Instance instance = wgpuCreateInstance(nullptr);
wgpu::Adapter adapter;
wgpu::Device device;
wgpu::Queue queue;
wgpu::Surface surface;
wgpu::TextureFormat surfaceFormat;
kr::PrototypeState state;
uint32_t configuredWidth = 0;
uint32_t configuredHeight = 0;

void setStatus(const char* stateName, const char* message) {
  EM_ASM({
    const status = document.getElementById('status');
    status.dataset.state = UTF8ToString($0);
    status.textContent = UTF8ToString($1);
  }, stateName, message);
}

void updatePointerEvidence() {
  EM_ASM({
    document.getElementById('canvas').dataset.pointerCount = String($0);
  }, state.pointerCount);
}

void configureSurface() {
  double cssWidth = 0.0;
  double cssHeight = 0.0;
  emscripten_get_element_css_size("#canvas", &cssWidth, &cssHeight);
  const double scale = emscripten_get_device_pixel_ratio();
  const auto width = static_cast<uint32_t>(std::max(1.0, std::round(cssWidth * scale)));
  const auto height = static_cast<uint32_t>(std::max(1.0, std::round(cssHeight * scale)));
  kr::setViewport(state, static_cast<int>(width), static_cast<int>(height));
  if (width == configuredWidth && height == configuredHeight) return;

  wgpu::SurfaceConfiguration config{};
  config.device = device;
  config.format = surfaceFormat;
  config.usage = wgpu::TextureUsage::RenderAttachment;
  config.width = width;
  config.height = height;
  config.alphaMode = wgpu::CompositeAlphaMode::Auto;
  config.presentMode = wgpu::PresentMode::Fifo;
  surface.Configure(&config);
  configuredWidth = width;
  configuredHeight = height;
  std::printf("[KR] canvas %u x %u (device scale %.2f)\n", width, height, scale);
}

void renderFrame() {
  if (!device || !surface) return;
  configureSurface();

  wgpu::SurfaceTexture current{};
  surface.GetCurrentTexture(&current);
  if (!current.texture) return;

  const auto clear = kr::clearColor(state);
  wgpu::RenderPassColorAttachment attachment{};
  attachment.view = current.texture.CreateView();
  attachment.loadOp = wgpu::LoadOp::Clear;
  attachment.storeOp = wgpu::StoreOp::Store;
  attachment.clearValue = {clear[0], clear[1], clear[2], clear[3]};

  wgpu::RenderPassDescriptor passDescriptor{};
  passDescriptor.colorAttachmentCount = 1;
  passDescriptor.colorAttachments = &attachment;

  const wgpu::CommandEncoder encoder = device.CreateCommandEncoder();
  const wgpu::RenderPassEncoder pass = encoder.BeginRenderPass(&passDescriptor);
  pass.End();
  const wgpu::CommandBuffer commands = encoder.Finish();
  queue.Submit(1, &commands);
}

EM_BOOL onPointer(int, const EmscriptenMouseEvent* event, void*) {
  kr::registerPointer(state, static_cast<float>(event->targetX), static_cast<float>(event->targetY));
  updatePointerEvidence();
  return EM_TRUE;
}

EM_BOOL onTouch(int, const EmscriptenTouchEvent* event, void*) {
  if (event->numTouches < 1) return EM_FALSE;
  const auto& point = event->touches[0];
  kr::registerPointer(state, static_cast<float>(point.targetX), static_cast<float>(point.targetY));
  updatePointerEvidence();
  return EM_TRUE;
}

void installInput() {
  emscripten_set_mousemove_callback("#canvas", nullptr, true, onPointer);
  emscripten_set_mousedown_callback("#canvas", nullptr, true, onPointer);
  emscripten_set_touchstart_callback("#canvas", nullptr, true, onTouch);
  emscripten_set_touchmove_callback("#canvas", nullptr, true, onTouch);
}

void onDevice(wgpu::RequestDeviceStatus status, wgpu::Device value, wgpu::StringView message) {
  if (status != wgpu::RequestDeviceStatus::Success) {
    std::printf("[KR] RequestDevice failed: %.*s\n", static_cast<int>(message.length), message.data);
    setStatus("error", "WebGPU device request failed");
    return;
  }
  device = value;
  queue = device.GetQueue();
  queue.SetLabel("Krinik prototype queue");

  wgpu::EmscriptenSurfaceSourceCanvasHTMLSelector canvasDescriptor{};
  canvasDescriptor.selector = "#canvas";
  wgpu::SurfaceDescriptor surfaceDescriptor{};
  surfaceDescriptor.nextInChain = &canvasDescriptor;
  surface = instance.CreateSurface(&surfaceDescriptor);

  wgpu::SurfaceCapabilities capabilities{};
  surface.GetCapabilities(adapter, &capabilities);
  if (!capabilities.formatCount || !capabilities.formats) {
    setStatus("error", "WebGPU canvas has no supported surface format");
    return;
  }
  surfaceFormat = capabilities.formats[0];

  kr::setViewport(state, 1, 1);
  installInput();
  configureSurface();
  setStatus("ready", "WebGPU ready — move or touch");
  std::printf("[KR] WebGPU ready\n");
  emscripten_set_main_loop(renderFrame, 0, false);
}

void onAdapter(wgpu::RequestAdapterStatus status, wgpu::Adapter value, wgpu::StringView message) {
  if (status != wgpu::RequestAdapterStatus::Success) {
    std::printf("[KR] RequestAdapter failed: %.*s\n", static_cast<int>(message.length), message.data);
    setStatus("error", "WebGPU is unavailable in this browser");
    return;
  }
  adapter = value;
  wgpu::DeviceDescriptor descriptor{};
  descriptor.SetUncapturedErrorCallback([](const wgpu::Device&, wgpu::ErrorType type, wgpu::StringView text) {
    std::printf("[KR] WebGPU error %d: %.*s\n", static_cast<int>(type), static_cast<int>(text.length), text.data);
  });
  adapter.RequestDevice(&descriptor, wgpu::CallbackMode::AllowSpontaneous, onDevice);
}

}  // namespace

int main() {
  setStatus("loading", "Requesting WebGPU…");
  instance.RequestAdapter(nullptr, wgpu::CallbackMode::AllowSpontaneous, onAdapter);
  return 0;
}
