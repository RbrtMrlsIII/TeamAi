import {
  createMcpCapabilityBranch,
  createMcpLifecycleIntent,
  MCP_LIFECYCLE_STAGES,
} from './mcp-capability.js';
import {
  createEmptyMcpRuntimeReadModel,
  listMcpDiscoveryVocabulary,
  normalizeMcpRuntimeReadModel,
} from './mcp-capability-runtime-read-model.js';
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MCP_FACILITY_ROOT_ID = 'hero-mcp-facility';
export const MCP_FACILITY_SPATIAL_CONTEXT = createSpatialConstructionContext({
  slice: 'S15',
  owner: 'frontend/spatial/mcp-capability-facility.js',
  semanticId: MCP_FACILITY_ROOT_ID,
  semanticBoundary: 'presentation-only',
});

let panel = null;
let activeCapabilityId = '';
let targetType = '';
let targetId = '';
let branchPath = [];
let readModel = createEmptyMcpRuntimeReadModel();

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, { detail: Object.freeze({ ...detail, presentationOnly: true }) }));
}

function visibleCapabilities() {
  if (readModel.authenticated) return readModel.capabilities;
  return listMcpDiscoveryVocabulary();
}

function getEntry() {
  const entries = visibleCapabilities();
  return entries.find((entry) => entry.id === activeCapabilityId) || entries[0] || null;
}

function getReadiness(entry) {
  if (!entry) return null;
  if (!readModel.authenticated || entry.discoveryOnly) {
    return Object.freeze({
      capabilityId: entry.id,
      state: 'DISCOVERABLE_LOCKED',
      usable: false,
      presentationOnly: true,
    });
  }
  return entry.readiness || null;
}

function getTargets(entry) {
  const capabilityTargets = entry?.targets?.length ? entry.targets : readModel.targets;
  return capabilityTargets.filter((target) => target?.eligible !== false);
}

function getBranchPaths(entry) {
  return Array.isArray(entry?.branchPaths) ? entry.branchPaths : [];
}

function nextLifecycleStage(readiness) {
  switch (readiness?.state) {
    case 'INSTALLABLE': return 'INSTALL';
    case 'AUTH_HANDOFF_REQUIRED': return 'AUTH_HANDOFF';
    case 'PERMISSION_CONFIGURATION_REQUIRED':
    case 'PROJECT_SCOPE_REQUIRED':
    case 'TARGET_NOT_ALLOWED': return 'CONFIGURE_PERMISSIONS';
    case 'HEALTH_TEST_REQUIRED':
    case 'HEALTH_DEGRADED': return 'HEALTH_TEST';
    case 'READY': return 'EQUIP';
    default: return null;
  }
}

function updateTargetOptions(entry) {
  const select = panel?.querySelector('[data-mcp-target]');
  if (!select) return;

  const targets = getTargets(entry);
  select.innerHTML = '';

  if (!targets.length) {
    select.disabled = true;
    targetType = '';
    targetId = '';
    select.append(new Option('Backend target state unavailable', ''));
    return;
  }

  select.disabled = false;
  targets.forEach((target) => {
    const value = target.type + ':' + target.id;
    select.append(new Option(target.label + ' · ' + target.type, value));
  });

  const current = targets.find((target) => target.type === targetType && target.id === targetId) || targets[0];
  targetType = current.type;
  targetId = current.id;
  select.value = current.type + ':' + current.id;
}

function updatePathOptions(entry) {
  const select = panel?.querySelector('[data-mcp-path]');
  if (!select) return;

  const paths = getBranchPaths(entry);
  select.innerHTML = '';

  if (!paths.length) {
    branchPath = [];
    select.disabled = true;
    select.append(new Option('Branch shape unavailable', ''));
    return;
  }

  select.disabled = false;
  paths.forEach((path, index) => {
    const value = String(index);
    const label = path.join(' › ');
    select.append(new Option(label, value));
  });

  const currentIndex = paths.findIndex((path) => JSON.stringify(path) === JSON.stringify(branchPath));
  const selected = currentIndex >= 0 ? currentIndex : 0;
  branchPath = [...paths[selected]];
  select.value = String(selected);
}

function updateNextAction(entry) {
  const button = panel?.querySelector('[data-mcp-next]');
  if (!button) return;

  const readiness = getReadiness(entry);
  const stage = nextLifecycleStage(readiness);
  const blocked = !readModel.authenticated ||
    !entry ||
    !stage ||
    (stage === 'EQUIP' && (!readModel.contextAvailable || readiness?.usable !== true));
  button.hidden = !readModel.authenticated || !entry || !stage;
  button.disabled = blocked;
  button.textContent = stage === 'EQUIP'
    ? 'Request equip intent'
    : 'Request ' + stage.replaceAll('_', ' ').toLowerCase();
}

function updateBranchPreview(entry) {
  const field = panel?.querySelector('[data-mcp-branch]');
  const note = panel?.querySelector('[data-mcp-branch-note]');
  if (!field || !note) return;

  if (!readModel.contextAvailable || !entry || !targetId || !branchPath.length) {
    field.textContent = 'Branch preview unavailable';
    note.textContent = 'A backend-owned capability target and branch shape are required before a branch can be proposed.';
    return;
  }

  try {
    const branch = createMcpCapabilityBranch({
      capabilityId: entry.id,
      ownerType: targetType,
      ownerId: targetId,
      path: branchPath,
    });
    field.textContent = branch.id;
    note.textContent = 'Target-owned semantic branch preview. Equipping is backend-authoritative.';
  } catch {
    field.textContent = 'Branch preview unavailable';
    note.textContent = 'A valid backend target and branch path are required before a branch can be proposed.';
  }
}

function renderInventory() {
  const inventory = panel?.querySelector('[data-mcp-inventory]');
  const state = panel?.querySelector('[data-mcp-state]');
  const authAction = panel?.querySelector('[data-mcp-auth]');
  if (!inventory || !state || !authAction) return;

  const entries = visibleCapabilities();
  inventory.innerHTML = entries.map((entry) => {
    const readiness = getReadiness(entry);
    const selected = entry.id === activeCapabilityId;
    const meta = readiness?.state || (entry.kind + ' · DISCOVERABLE_LOCKED');
    return '<button type="button" class="mcp-facility__capability' +
      (selected ? ' is-selected' : '') +
      '" data-mcp-capability="' + entry.id +
      '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="mcp-facility__capability-name">' + entry.label + '</span>' +
      '<span class="mcp-facility__capability-meta">' + meta + '</span>' +
      '</button>';
  }).join('');

  const entry = getEntry();
  activeCapabilityId = entry?.id || '';
  const readiness = getReadiness(entry);

  if (!readModel.authenticated) {
    state.textContent = 'Guest · DISCOVERABLE LOCKED';
    state.dataset.state = 'DISCOVERABLE_LOCKED';
  } else if (readModel.contextAvailable) {
    state.textContent = 'Authenticated context · backend capability state available';
    state.dataset.state = 'READY';
  } else {
    state.textContent = 'Authenticated context · BACKEND STATE REQUIRED';
    state.dataset.state = 'BACKEND_STATE_REQUIRED';
  }

  authAction.hidden = readModel.authenticated;
  authAction.disabled = readModel.authenticated;

  updateTargetOptions(entry);
  updatePathOptions(entry);
  updateNextAction(entry);
  updateBranchPreview(entry);
  if (readiness?.state === 'READY') {
    const result = panel.querySelector('[data-mcp-result]');
    if (result) result.textContent = 'Capability is ready for an authoritative equip request.';
  }
}

function setCapability(id) {
  if (!visibleCapabilities().some((entry) => entry.id === id)) return;
  activeCapabilityId = id;
  renderInventory();
}

function requestAuth() {
  close();
  dispatch('teamai:app-ui-handoff', {
    appUiHandoff: true,
    normalUi: true,
    notAuthority: true,
    targetSection: 'auth',
    itemId: (activeCapabilityId || 'mcp') + '#login',
    source: 'mcp-facility',
  });
}

function requestLifecycle(stage) {
  const entry = getEntry();
  const readiness = getReadiness(entry);
  if (!entry || !readModel.authenticated) return;

  const expectedStage = nextLifecycleStage(readiness);
  if (!MCP_LIFECYCLE_STAGES.includes(stage) || expectedStage !== stage) return;

  const intent = createMcpLifecycleIntent({
    capabilityId: entry.id,
    stage,
    ...(targetId ? { ownerType: targetType, ownerId: targetId } : {}),
    path: branchPath,
  });

  dispatch('teamai:mcp-lifecycle-intent', intent);
  const status = panel?.querySelector('[data-mcp-result]');
  if (status) {
    status.textContent = stage + ' intent requested for ' + entry.label + '. Authoritative runtime confirmation is still required.';
  }
}

function close() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-mcp-facility-open');
}

function open() {
  mountMcpFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-mcp-facility-open', '1');
  renderInventory();
  panel.querySelector('[data-mcp-close]')?.focus();
}

function build() {
  const el = document.createElement('section');
  el.id = MCP_FACILITY_ROOT_ID;
  el.className = 'mcp-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'mcp-facility-title');
  el.innerHTML =
    '<div class="mcp-facility__header">' +
      '<div><p class="mcp-facility__eyebrow">Capability facility</p><h2 id="mcp-facility-title">MCP / Capability</h2></div>' +
      '<button type="button" data-mcp-close aria-label="Close MCP capability facility">Close</button>' +
    '</div>' +
    '<p class="mcp-facility__note">Discover, inspect, configure, test, and equip TeamAi capabilities. Provider credentials, entitlement, authorization, and execution remain outside this presentation layer.</p>' +
    '<div class="mcp-facility__state-row"><span data-mcp-state data-state="DISCOVERABLE_LOCKED">Guest · DISCOVERABLE LOCKED</span><span>Presentation only</span></div>' +
    '<div class="mcp-facility__lifecycle" aria-label="MCP lifecycle">' +
      MCP_LIFECYCLE_STAGES.map((stage) => '<span data-mcp-stage="' + stage + '">' + stage.replaceAll('_', ' ') + '</span>').join('<span aria-hidden="true">›</span>') +
    '</div>' +
    '<section class="mcp-facility__section" aria-labelledby="mcp-inventory-title">' +
      '<div class="mcp-facility__section-heading"><div><p class="mcp-facility__eyebrow">Inventory</p><h3 id="mcp-inventory-title">Available capabilities</h3></div><span data-mcp-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="mcp-facility__inventory" data-mcp-inventory role="list"></div>' +
    '</section>' +
    '<section class="mcp-facility__section" aria-labelledby="mcp-target-title">' +
      '<div class="mcp-facility__section-heading"><div><p class="mcp-facility__eyebrow">Equip target</p><h3 id="mcp-target-title">Target-owned branch</h3></div><span class="mcp-facility__target-status">Dynamic / recursive</span></div>' +
      '<div class="mcp-facility__controls">' +
        '<label>Owner<select data-mcp-target aria-label="Capability owner"></select></label>' +
        '<label>Path<select data-mcp-path aria-label="Capability branch path"></select></label>' +
      '</div>' +
      '<code class="mcp-facility__branch" data-mcp-branch>Branch preview unavailable</code>' +
      '<p class="mcp-facility__branch-note" data-mcp-branch-note>Backend-owned capability state is required before a branch can be proposed.</p>' +
    '</section>' +
    '<div class="mcp-facility__actions">' +
      '<button type="button" data-mcp-auth class="primary">Sign in to configure</button>' +
      '<button type="button" data-mcp-next class="primary" hidden>Request next lifecycle step</button>' +
      '<button type="button" data-mcp-close>Back to world</button>' +
    '</div>';
  return el;
}

export function mountMcpFacility(rootNode = document) {
  if (panel) return panel;
  const host = rootNode.querySelector('.hero-shell');
  if (!host) return null;
  panel = build();
  host.append(panel);

  panel.querySelectorAll('[data-mcp-close]').forEach((button) => button.addEventListener('click', close));
  panel.querySelector('[data-mcp-auth]')?.addEventListener('click', requestAuth);
  panel.querySelector('[data-mcp-next]')?.addEventListener('click', () => {
    const entry = getEntry();
    const stage = nextLifecycleStage(getReadiness(entry));
    if (stage) requestLifecycle(stage);
  });
  panel.querySelector('[data-mcp-target]')?.addEventListener('change', (event) => {
    const value = String(event.target?.value || '');
    const parts = value.split(':');
    if (parts.length !== 2) return;
    targetType = parts[0];
    targetId = parts[1];
    updateBranchPreview(getEntry());
  });
  panel.querySelector('[data-mcp-path]')?.addEventListener('change', (event) => {
    const entry = getEntry();
    const paths = getBranchPaths(entry);
    const index = Number(event.target?.value);
    if (!Number.isInteger(index) || !paths[index]) return;
    branchPath = [...paths[index]];
    updateBranchPreview(entry);
  });
  panel.querySelector('[data-mcp-inventory]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const id = target.closest('[data-mcp-capability]')?.getAttribute('data-mcp-capability');
    if (id) setCapability(id);
  });

  renderInventory();
  return panel;
}

export function openMcpFacility() {
  open();
}

export function closeMcpFacility() {
  close();
}

export function setMcpReadModel(value = {}) {
  readModel = normalizeMcpRuntimeReadModel(value);
  activeCapabilityId = readModel.capabilities[0]?.id || '';
  targetType = '';
  targetId = '';
  branchPath = [];
  renderInventory();
}

export function setMcpPresentationAuthState(value) {
  setMcpReadModel({
    ...readModel,
    authenticated: Boolean(value),
    capabilities: Boolean(value) ? readModel.capabilities : [],
    targets: Boolean(value) ? readModel.targets : [],
  });
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountMcpFacility(document);
    document.querySelector('[data-mcp-open]')?.addEventListener('click', openMcpFacility);
    window.addEventListener('teamai:mcp-runtime-read-model', (event) => {
      setMcpReadModel(event.detail || {});
    });
    if (mounted) renderInventory();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiMcpFacility = Object.freeze({
    open: openMcpFacility,
    close: closeMcpFacility,
    mount: mountMcpFacility,
    setReadModel: setMcpReadModel,
    setPresentationAuthState: setMcpPresentationAuthState,
    getState: () => Object.freeze({
      authenticated: readModel.authenticated,
      contextAvailable: readModel.contextAvailable,
      activeCapabilityId,
      targetType,
      targetId,
      branchPath: [...branchPath],
    }),
    requestLifecycle,
  });
}
