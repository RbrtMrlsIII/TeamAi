import { createBranchConnectionCore, resolveBranchCamera } from './machine-core-layout-runtime.js';
import { branchAtRingAngle } from './machine-core-hit-testing.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || min));

function parseSeatCount(){const raw=new URLSearchParams(globalThis.location?.search||'').get('seats');const requested=raw==null||raw.trim()===''?10:Number(raw);return Number.isFinite(requested)?Math.min(16,Math.max(2,Math.floor(requested))):10;}

function bind() {
  const panel = document.querySelector('[data-machine-core-visual]');
  const canvas = panel?.querySelector('canvas');
  const select = panel?.querySelector('[data-core-camera]');
  if (!canvas || !select || select.dataset.machineInteractionBound) return;
  select.dataset.machineInteractionBound = '1';
  const core = createBranchConnectionCore({ seatCount: parseSeatCount() });
  const branches = core.parts.filter((part) => part.kind !== 'hub');
  const inspector = document.createElement('aside');
  inspector.className = 'machine-core-inspector';
  inspector.setAttribute('aria-label', 'Selected branch configuration');
  inspector.dataset.branchInspector = '1';
  inspector.innerHTML = '<span class="machine-core-inspector__role">Command hub</span><strong>HUB-CORE</strong>';

  panel.append(inspector);

  const branchState = new Map();
  for (const part of core.parts) {
    branchState.set(part.branchId, {
      profile: part.uiStyle,
      intensity: 72,
      density: part.kind === 'outer-housing' ? 68 : 56,
    });
  }

  function renderInspector(branchId) {
    const branch = core.byBranch.get(branchId) || core.hub;
    const camera = resolveBranchCamera(core, branch.branchId) || branch.camera;
    const state = branchState.get(branch.branchId) || { profile: branch.uiStyle, intensity: 72, density: 56 };
    const role = branch.kind === 'inner-pod' ? `Seat ${branch.seatIndex + 1}` : branch.kind === 'hub' ? 'Command hub' : 'Outer branch';
    inspector.innerHTML = `
      <span class="machine-core-inspector__role">${role}</span>
      <strong>${branch.branchId}</strong>
      <dl>
        <div><dt>Configuration</dt><dd>${state.profile}</dd></div>
        <div><dt>Level</dt><dd>${branch.level.toFixed(2)}</dd></div>
        <div><dt>Surface</dt><dd>${Math.round(branch.uiSurface.width * 100)} × ${Math.round(branch.uiSurface.depth * 100)}</dd></div>
        <div><dt>Camera</dt><dd>${camera.cameraId}</dd></div>
      </dl>
      <label class="machine-core-inspector__control">Profile
        <select data-inspector-profile aria-label="Branch configuration profile">
          <option value="${branch.uiStyle}">${branch.uiStyle}</option>
          <option value="balanced">balanced</option>
          <option value="precision">precision</option>
          <option value="adaptive">adaptive</option>
        </select>
      </label>
      <label class="machine-core-inspector__control">Intensity
        <input data-inspector-intensity aria-label="Branch intensity" type="range" min="0" max="100" value="${state.intensity}">
        <output data-inspector-intensity-value>${state.intensity}%</output>
      </label>
      <label class="machine-core-inspector__control">Density
        <input data-inspector-density aria-label="Branch density" type="range" min="20" max="100" value="${state.density}">
        <output data-inspector-density-value>${state.density}%</output>
      </label>
      <button type="button" data-inspector-open>Open branch</button>`;

    inspector.querySelector('[data-inspector-profile]')?.addEventListener('change', (event) => {
      state.profile = event.target.value;
      renderInspector(branch.branchId);
      canvas.dispatchEvent(new CustomEvent('machine:config-change', { detail: { branchId: branch.branchId, profile: state.profile } }));
    });
    inspector.querySelector('[data-inspector-intensity]')?.addEventListener('input', (event) => {
      state.intensity = clamp(event.target.value, 0, 100);
      inspector.querySelector('[data-inspector-intensity-value]').textContent = `${state.intensity}%`;
      canvas.dispatchEvent(new CustomEvent('machine:config-change', { detail: { branchId: branch.branchId, intensity: state.intensity } }));
    });
    inspector.querySelector('[data-inspector-density]')?.addEventListener('input', (event) => {
      state.density = clamp(event.target.value, 20, 100);
      inspector.querySelector('[data-inspector-density-value]').textContent = `${state.density}%`;
      canvas.dispatchEvent(new CustomEvent('machine:config-change', { detail: { branchId: branch.branchId, density: state.density } }));
    });
    inspector.querySelector('[data-inspector-open]')?.addEventListener('click', () => {
      canvas.dispatchEvent(new CustomEvent('machine:branch-open', { detail: { branchId: branch.branchId } }));
      panel.querySelector('[data-core-expand]')?.click();
    }, { once: true });
  }

  function selectBranch(branch) {
    if (!branch) return;
    select.value = branch.branchId;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    canvas.dataset.selectedBranch = branch.branchId;
    renderInspector(branch.branchId);
    canvas.focus({ preventScroll: true });
  }

  function selectByOffset(offset) {
    const current = branches.findIndex((part) => part.branchId === canvas.dataset.selectedBranch);
    const start = current < 0 ? 0 : current;
    const next = branches[(start + offset + branches.length) % branches.length];
    selectBranch(next);
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    const branch = branchAtRingAngle(core, angle, { maxAngularDistance: 0.22 });
    selectBranch(branch);
  });

  canvas.addEventListener('dblclick', (event) => {
    event.preventDefault();
    const branchId = canvas.dataset.selectedBranch;
    if (!branchId) return;
    canvas.dispatchEvent(new CustomEvent('machine:branch-open', { detail: { branchId } }));
    panel.querySelector('[data-core-expand]')?.click();
  });

  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      selectByOffset(1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      selectByOffset(-1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const branchId = canvas.dataset.selectedBranch;
      const branch = core.byBranch.get(branchId);
      if (branch) {
        canvas.dispatchEvent(new CustomEvent('machine:branch-open', { detail: { branchId } }));
        panel.querySelector('[data-core-expand]')?.click();
      }
    }
  });

  select.addEventListener('change', () => renderInspector(select.value));
  renderInspector(select.value || 'HUB-CORE');
}

if (globalThis.document) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();
}
