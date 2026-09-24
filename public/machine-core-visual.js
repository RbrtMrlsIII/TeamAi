import { createMachineWorldRenderer } from './machine-world-renderer.js';
import { parseSeatCountParam } from './seat-capacity.js';
import { createBranchConnectionCore, resolveBranchCamera } from './machine-core-layout-runtime.js';

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
    panel.dataset.machineCoreRenderer = 'canonical';
  } catch {
    panel.dataset.machineCoreRenderer = 'unavailable';
    panel.querySelector('[data-core-state').textContent = 'WebGL unavailable';
    return panel;
  }
  const seatCount = parseSeatCountParam();
  const semanticScene = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
  let branchId = 'HUB-CORE';
  let focusedChildId = null;
  let expanded = false;
  let raf = 0;

  const isSeatBranch = (value) => /^BRANCH-SEAT-\d{2}$/.test(String(value || ''));

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
      seatDivisionBranchAmounts: {
        connectionBranchAmount: expanded && isSeatBranch(branchId) ? 1 : 0,
      },
      focusedChildId: expanded && isSeatBranch(branchId) ? focusedChildId : null,
      focusedChildIndex: expanded && isSeatBranch(branchId) ? 0 : -1,
      focusedChildAmount: expanded && isSeatBranch(branchId) ? 1 : 0,
      connectionBranchAmount: expanded && isSeatBranch(branchId) ? 1 : 0,
    });
    const count = panel.querySelector('[data-core-count]');
    const state = panel.querySelector('[data-core-state]');
    if (count) count.textContent = `${frame.moduleCount} modules · ${frame.seatCount} seats · 4 outer housings · 1 hub`;
    if (state) {
      const camera = resolveBranchCamera(semanticScene, branchId) || semanticScene.cameras[0];
      const motionPrefix = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true ? 'reduced-motion ' : '';
      state.textContent = `${motionPrefix}${frame.state} · ${Math.round(frame.amount * 100)}% · ${semanticScene.parts.length} independent modules · camera ${camera?.cameraId || 'BRANCH_CAMERA_HUB-CORE'}`;
    }
    raf = requestAnimationFrame(render);
  };

  const select = panel.querySelector('[data-core-camera]');
  const populate = () => {
    if (!select) return;
    select.innerHTML = '';
    const labels = semanticScene.cameras.map((camera) => camera.branchId);
    for (const value of labels) {
      const option = root.createElement('option');
      option.value = value;
      option.textContent = value.replace('BRANCH-', '') + (value === 'HUB-CORE' ? ' · WORLD' : ' · SEAT_CLOSE');
      option.selected = value === branchId;
      select.append(option);
    }
  };
  populate();

  canvas.addEventListener('machine:config-change', (event) => {
    const detail = event.detail || {};
    if (detail.profile !== undefined) canvas.dataset.configProfile = String(detail.profile);
    if (detail.density !== undefined) canvas.dataset.configDensity = String(detail.density);
  });

  const setExpanded = (value) => {
    expanded = Boolean(value);
    renderer.setExpanded(expanded, performance.now());
  };

  select?.addEventListener('change', () => {
    branchId = select.value || 'HUB-CORE';
    focusedChildId = isSeatBranch(branchId) ? 'SEAT_CONNECTION' : null;
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
