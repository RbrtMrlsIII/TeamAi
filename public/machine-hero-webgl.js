/**
 * Compatibility preview entry point.
 * Rendering authority lives in machine-world-renderer.js.
 */
import { createMachineWorldRenderer } from './machine-world-renderer.js';

export function mountMachineWebGLPreview(root = globalThis.document) {
  if (!root?.querySelector) return null;
  if (root.querySelector('[data-machine-hero-webgl]')) return null;
  const host = root.querySelector('.hero-shell') || root.querySelector('.machine-core-shell');
  if (!host) return null;

  const panel = root.createElement('aside');
  panel.className = 'machine-hero-preview machine-hero-preview--webgl';
  panel.dataset.machineHeroWebgl = '1';
  panel.innerHTML = '<div class="machine-hero-preview__header"><strong>Machine 3D</strong><span>semantic machine → physical envelope → wiring → camera</span></div><div class="machine-hero-preview__controls"><button type="button" data-machine-webgl-expand>Expand machine</button><button type="button" data-machine-webgl-nudge>Move selected seat</button><output data-machine-webgl-state>collapsed · 0%</output></div><canvas aria-label="Interactive Machine Hero WebGL preview"></canvas>';
  host.append(panel);

  const canvas = panel.querySelector('canvas');
  if (!canvas) {
    panel.querySelector('[data-machine-webgl-state]').textContent = 'WebGL unavailable';
    return panel;
  }

  let renderer;
  try {
    renderer = createMachineWorldRenderer({ canvas });
  } catch {
    panel.querySelector('[data-machine-webgl-state]').textContent = 'WebGL unavailable';
    return panel;
  }
  let expanded = false;
  let selectedSeat = 0;
  let rafId = null;
  let offset = 0;

  const now = () => Number(globalThis.performance?.now?.() ?? Date.now());
  const render = (timestamp = now()) => {
    const frame = renderer.render(timestamp, {
      seatCount: 10,
      selectedSeat,
      hierarchyOpen: expanded,
      expanded,
      branchId: `BRANCH-SEAT-${String(selectedSeat + 1).padStart(2, '0')}`,
      reducedMotion: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true,
      navOrbitYaw: offset * 0.08,
      navOrbitPitch: 0,
      navZoom: 1,
    });
    const state = panel.querySelector('[data-machine-webgl-state]');
    const action = panel.querySelector('[data-machine-webgl-expand]');
    if (state) state.textContent = `${frame.state} · ${Math.round(frame.amount * 100)}% · ${frame.moduleCount} modules`;
    if (action) action.textContent = expanded ? 'Collapse machine' : 'Expand machine';
    rafId = requestAnimationFrame(render);
  };

  const setExpanded = (value) => {
    expanded = Boolean(value);
    renderer.setExpanded(expanded, now());
  };

  panel.querySelector('[data-machine-webgl-expand]')?.addEventListener('click', () => setExpanded(!expanded));
  panel.querySelector('[data-machine-webgl-nudge]')?.addEventListener('click', () => {
    selectedSeat = (selectedSeat + 1) % 10;
    offset += 1;
    const state = panel.querySelector('[data-machine-webgl-state]');
    if (state) state.textContent = `selected seat ${selectedSeat + 1}`;
    renderer.setExpanded(expanded, now());
  });


  rafId = requestAnimationFrame(render);
  panel._machineRenderer = renderer;
  panel._machineDispose = () => { if (rafId !== null) cancelAnimationFrame(rafId); renderer.dispose(); };
  return panel;
}

const machineQuery = globalThis.location && new URLSearchParams(globalThis.location.search).get('machine-preview');
if (machineQuery === 'webgl') {
  if (globalThis.document?.readyState === 'loading') globalThis.document.addEventListener('DOMContentLoaded', () => mountMachineWebGLPreview(), { once: true });
  else if (globalThis.document) mountMachineWebGLPreview();
}
