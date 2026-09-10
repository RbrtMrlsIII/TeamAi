/**
 * V2.2 — Bind MACHINE_NAV_MAP to existing right chrome (Vision).
 * Mounts a single <select> into `.seat-stack` (or `[data-machine-nav]`).
 * Does not fork a second rail. Presentation only · no 029-released claim · Issue #214
 */
import { MACHINE_NAV_MAP, machineNavById } from './hero-machine-nav-map.js';

const SELECT_CLASS = 'machine-nav__select';
const WRAP_CLASS = 'machine-nav';

export function resolveMachineNavMount(root = document) {
  const explicit = root.querySelector('[data-machine-nav]');
  if (explicit) return explicit;
  return root.querySelector('.seat-stack');
}

export function buildMachineNavSelect(entries = MACHINE_NAV_MAP) {
  const select = document.createElement('select');
  select.className = SELECT_CLASS;
  select.setAttribute('aria-label', 'Machine parts and trees');
  select.dataset.machineNavSelect = '1';
  for (const entry of entries) {
    const opt = document.createElement('option');
    opt.value = entry.id;
    opt.textContent = entry.label + (entry.optional ? ' (optional)' : '');
    if (entry.cameraId) opt.dataset.camera = entry.cameraId;
    if (entry.hierarchyChildId) opt.dataset.hierarchyChild = entry.hierarchyChildId;
    if (entry.kind) opt.dataset.kind = entry.kind;
    select.appendChild(opt);
  }
  return select;
}

export function mountMachineNav(root = document) {
  const mount = resolveMachineNavMount(root);
  if (!mount) return null;
  if (mount.querySelector(`[data-machine-nav-select]`)) return mount.querySelector(`[data-machine-nav-select]`);

  const wrap = document.createElement('div');
  wrap.className = WRAP_CLASS;
  wrap.dataset.machineNavChrome = '1';
  const label = document.createElement('label');
  label.className = 'machine-nav__label';
  label.textContent = 'Parts / trees';
  const select = buildMachineNavSelect();
  label.appendChild(select);
  wrap.appendChild(label);
  mount.insertBefore(wrap, mount.firstChild);

  select.addEventListener('change', () => {
    const entry = machineNavById(select.value);
    if (!entry) return;
    const detail = {
      id: entry.id,
      kind: entry.kind,
      cameraId: entry.cameraId || null,
      hierarchyChildId: entry.hierarchyChildId || null,
      source: 'v2.2-machine-nav',
      presentationOnly: true,
    };
    root.dispatchEvent(new CustomEvent('teamai:machine-nav-select', { detail, bubbles: true }));
  });

  return select;
}

// Auto-mount when DOM ready (browser)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountMachineNav(document));
  } else {
    mountMachineNav(document);
  }
}
