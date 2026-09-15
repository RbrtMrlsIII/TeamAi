import { createBranchConnectionCore } from './machine-core-layout-runtime.js';
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
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    const branch = branchAtRingAngle(core, angle, { maxAngularDistance: 0.22 });
    if (!branch) return;
    select.value = branch.branchId;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    canvas.dataset.selectedBranch = branch.branchId;
  });
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
}
