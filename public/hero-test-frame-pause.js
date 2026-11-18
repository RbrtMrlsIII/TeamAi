// QA-only Hero frame clock. Ordinary routes pass testMode=false and never
// install the frozen pause hook. This module does not draw, and it does
// not own geometry, camera, materials, depth order, ports, or topology.
export function bindHeroFrameClock(frame, testMode, canvas) {
  let paused = false;
  let handle = 0;
  const schedule = () => {
    if (paused) {
      handle = 0;
      return;
    }
    handle = requestAnimationFrame(frame);
  };
  if (testMode) {
    Object.defineProperty(window, '__TEAMAI_HERO_TEST_HOOKS__', {
      configurable: false,
      enumerable: false,
      value: Object.freeze({
        pauseFrame() {
          paused = true;
          if (handle) cancelAnimationFrame(handle);
          handle = 0;
          return Object.freeze({
            paused: true,
            transparencyPass: canvas.getAttribute('data-machine-world-facility-control-transparency-pass'),
            cameraMode: canvas.getAttribute('data-machine-world-camera-mode'),
            branchId: canvas.getAttribute('data-machine-world-facility-focus-branch'),
          });
        },
        resumeFrame() {
          if (!paused) return Object.freeze({ paused: false });
          paused = false;
          if (!handle) handle = requestAnimationFrame(frame);
          return Object.freeze({ paused: false });
        },
      }),
    });
  }
  return schedule;
}
