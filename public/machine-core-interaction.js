import { createBranchConnectionCore, resolveBranchCamera } from './machine-core-layout-runtime.js';
import { branchAtRingAngle } from './machine-core-hit-testing.js';

function bind() {
  const panel = document.querySelector('[data-machine-core-visual]');
  const canvas = panel?.querySelector('canvas');
  const select = panel?.querySelector('[data-core-camera]');
  if (!canvas || !select || select.dataset.machineInteractionBound) return;
  select.dataset.machineInteractionBound = '1';
  const params = new URLSearchParams(globalThis.location?.search || '');
  const count = Number(params.get('seats')) || 10;
  const core = createBranchConnectionCore({ seatCount: count });
  const inspector = document.createElement('aside');
  inspector.className = 'machine-core-inspector';
  inspector.setAttribute('aria-label', 'Selected branch configuration');
  inspector.dataset.branchInspector = '1';
  panel.append(inspector);

  function renderInspector(branchId) {
    const branch = core.byBranch.get(branchId) || core.hub;
    const camera = resolveBranchCamera(core, branch.branchId) || branch.camera;
    const role = branch.kind === 'inner-pod' ? `Seat ${branch.seatIndex + 1}` : branch.kind === 'hub' ? 'Command hub' : 'Outer branch';
    inspector.innerHTML = `<span class="machine-core-inspector__role">${role}</span><strong>${branch.branchId}</strong><dl><div><dt>Configuration</dt><dd>${branch.uiStyle}</dd></div><div><dt>Level</dt><dd>${branch.level.toFixed(2)}</dd></div><div><dt>Surface</dt><dd>${Math.round(branch.uiSurface.width * 100)} × ${Math.round(branch.uiSurface.depth * 100)}</dd></div><div><dt>Camera</dt><dd>${camera.cameraId}</dd></div></dl><button type="button" data-inspector-open>Open branch</button>`;
    inspector.querySelector('[data-inspector-open]')?.addEventListener('click', () => panel.querySelector('[data-core-expand]')?.click(), { once: true });
  }

  function selectBranch(branch) {
    if (!branch) return;
    select.value = branch.branchId;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    canvas.dataset.selectedBranch = branch.branchId;
    renderInspector(branch.branchId);
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    const branch = branchAtRingAngle(core, angle, { maxAngularDistance: 0.22 });
    selectBranch(branch);
  });

  select.addEventListener('change', () => renderInspector(select.value));
  renderInspector(select.value || 'HUB-CORE');
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
}
