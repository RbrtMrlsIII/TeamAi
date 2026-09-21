/**
 * Compatibility preview entry point.
 * Rendering authority lives in machine-world-renderer.js.
 */
import { createMachineWorldRenderer } from './machine-world-renderer.js';

export function mountMagnificentMachine(root = globalThis.document) {
  const canvas = root?.querySelector?.('[data-machine-magnificent]');
  if (!canvas) return null;
  if (canvas._machineController) return canvas._machineController;
  let renderer;
  try {
    renderer = createMachineWorldRenderer({ canvas });
  } catch {
    return null;
  }
  let expanded = false;
  let branchId = 'HUB-CORE';
  let raf = null;

  const render = (timestamp) => {
    raf = requestAnimationFrame(render);
    renderer.render(timestamp, {
      seatCount: 10,
      selectedSeat: 0,
      hierarchyOpen: expanded,
      expanded,
      branchId,
      reducedMotion: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true,
      navOrbitYaw: 0,
      navOrbitPitch: 0,
      navZoom: 1,
    });
  };

  const controller = {
    setExpanded(value) {
      expanded = Boolean(value);
      renderer.setExpanded(expanded, performance.now());
    },
    selectBranch(next) {
      if (next) branchId = String(next);
    },
    dispose() {
      if (raf !== null) cancelAnimationFrame(raf);
      renderer.dispose();
      canvas._machineController = null;
    },
  };
  canvas._machineController = controller;
  raf = requestAnimationFrame(render);
  return controller;
}

if (globalThis.document && new URLSearchParams(globalThis.location?.search || '').get('machine-preview') === 'magnificent') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountMagnificentMachine(), { once: true });
  } else {
    mountMagnificentMachine();
  }
}
