import { createMachineWorldRenderer } from './machine-world-renderer.js';
import { parseSeatCountParam } from './seat-capacity.js';

export function mountMachineCoreVisual(root = globalThis.document) {
  const host = root?.querySelector?.('.machine-core-shell');
  if (!host || host.querySelector('[data-machine-core-visual]')) return null;

  const panel = root.createElement('section');
  panel.className = 'machine-core-visual';
  panel.dataset.machineCoreVisual = '1';
  panel.innerHTML = '<div class="machine-core-visual__hud"><strong>BRANCH CONNECTION CORE</strong><span data-core-count></span><label>Branch <select data-core-camera aria-label="Branch camera"></select></label><button type="button" data-core-expand>Expand</button><button type="button" data-core-reset>Reset</button></div><canvas tabindex="0" aria-label="3D modular branch connection core"></canvas><output data-core-state>collapsed · 0%</output>';
  host.append(panel);

  const canvas = panel.querySelector('canvas');
  if (!canvas) {
    panel.querySelector('[data-core-state]').textContent = 'WebGL unavailable';
    return panel;
  }

  let renderer;
  try {
    renderer = createMachineWorldRenderer({ canvas });
  } catch {
    panel.querySelector('[data-core-state]').textContent = 'WebGL unavailable';
    return panel;
  }
  const seatCount = parseSeatCountParam();
  let branchId = 'HUB-CORE';
  let expanded = false;
  let raf = 0;

  const render = (timestamp = performance.now()) => {
    const frame = renderer.render(timestamp, {
      seatCount,
      selectedSeat: 0,
      hierarchyOpen: branchId !== 'HUB-CORE',
      expanded,
      branchId,
      reducedMotion: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true,
      navOrbitYaw: 0,
      navOrbitPitch: 0,
      navZoom: 1,
      machineLayer: true,
    });
    const count = panel.querySelector('[data-core-count]');
    const state = panel.querySelector('[data-core-state]');
    if (count) count.textContent = `${frame.moduleCount} modules · ${frame.seatCount} seats · canonical world renderer`;
    if (state) state.textContent = `${frame.state} · ${Math.round(frame.amount * 100)}% · camera ${branchId}`;
    raf = requestAnimationFrame(render);
  };

  const select = panel.querySelector('[data-core-camera]');
  const populate = () => {
    if (!select) return;
    select.innerHTML = '';
    const labels = ['HUB-CORE', ...Array.from({ length: Math.min(seatCount, 10) }, (_, i) => `BRANCH-SEAT-${String(i + 1).padStart(2, '0')}`)];
    for (const value of labels) {
      const option = root.createElement('option');
      option.value = value;
      option.textContent = value.replace('BRANCH-', '') + (value === 'HUB-CORE' ? ' · WORLD' : ' · SEAT_CLOSE');
      option.selected = value === branchId;
      select.append(option);
    }
  };
  populate();

  const setExpanded = (value) => {
    expanded = Boolean(value);
    renderer.setExpanded(expanded, performance.now());
  };

  select?.addEventListener('change', () => {
    branchId = select.value || 'HUB-CORE';
  });
  panel.querySelector('[data-core-expand]')?.addEventListener('click', () => setExpanded(true));
  panel.querySelector('[data-core-reset]')?.addEventListener('click', () => {
    branchId = 'HUB-CORE';
    expanded = false;
    renderer.setExpanded(false, performance.now());
    if (select) select.value = branchId;
  });

  raf = requestAnimationFrame(render);
  panel._machineCoreDispose = () => {
    if (raf) cancelAnimationFrame(raf);
    renderer.dispose();
  };
  return panel;
}

if (globalThis.document) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountMachineCoreVisual(), { once: true });
  } else {
    mountMachineCoreVisual();
  }
}
