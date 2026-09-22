import {
  createMcpCapabilityBranch,
  createMcpLifecycleIntent,
  listMcpCapabilities,
  listMcpLifecycleStages,
  resolveMcpCapabilityReadiness,
} from './mcp-capability.js';

export const MCP_FACILITY_ROOT_ID = 'hero-mcp-facility';

let panel = null;
let activeCapabilityId = 'workspace';
let targetType = 'SEAT';
let targetId = 'seat-01';
let branchPath = ['configuration'];
let authenticated = false;

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, { detail: Object.freeze({ ...detail, presentationOnly: true }) }));
}

function getEntry() {
  const entries = listMcpCapabilities();
  return entries.find((entry) => entry.id === activeCapabilityId) || entries[0];
}

function getReadiness(entry) {
  return resolveMcpCapabilityReadiness(entry, { available: true, installed: false });
}

function updateBranchPreview() {
  const entry = getEntry();
  const field = panel?.querySelector('[data-mcp-branch]');
  const note = panel?.querySelector('[data-mcp-branch-note]');
  if (!entry || !field || !note) return;
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
    note.textContent = 'A valid target is required before a branch can be proposed.';
  }
}

function renderInventory() {
  const inventory = panel?.querySelector('[data-mcp-inventory]');
  const state = panel?.querySelector('[data-mcp-state]');
  const action = panel?.querySelector('[data-mcp-auth]');
  if (!inventory || !state || !action) return;

  inventory.innerHTML = listMcpCapabilities().map((entry) => {
    const readiness = getReadiness(entry);
    const selected = entry.id === activeCapabilityId;
    return '<button type="button" class="mcp-facility__capability' +
      (selected ? ' is-selected' : '') +
      '" data-mcp-capability="' + entry.id +
      '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="mcp-facility__capability-name">' + entry.label + '</span>' +
      '<span class="mcp-facility__capability-meta">' + entry.kind + ' · ' + readiness.state + '</span>' +
      '</button>';
  }).join('');

  const entry = getEntry();
  const readiness = getReadiness(entry);
  state.textContent = authenticated
    ? 'Authenticated context · backend authority required'
    : 'Guest · ' + readiness.state + ' · locked';
  state.dataset.state = authenticated ? 'AUTHENTICATED_CONTEXT' : 'DISCOVERABLE_LOCKED';

  action.hidden = authenticated;
  action.disabled = authenticated;

  const intentButton = panel.querySelector('[data-mcp-intent]');
  if (intentButton) {
    intentButton.hidden = !authenticated;
    intentButton.disabled = !readiness.usable;
  }

  updateBranchPreview();
}

function setCapability(id) {
  if (!listMcpCapabilities().some((entry) => entry.id === id)) return;
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
    itemId: activeCapabilityId + '#login',
    source: 'mcp-facility',
  });
}

function requestLifecycle(stage) {
  const entry = getEntry();
  if (!entry) return;
  const intent = createMcpLifecycleIntent({
    capabilityId: entry.id,
    stage,
    ownerType: targetType,
    ownerId: targetId,
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
    '<div class="mcp-facility__state-row"><span data-mcp-state data-state="DISCOVERABLE_LOCKED">Guest · INSTALLABLE · locked</span><span>Presentation only</span></div>' +
    '<div class="mcp-facility__lifecycle" aria-label="MCP lifecycle">' +
      listMcpLifecycleStages().map((stage) => '<span data-mcp-stage="' + stage + '">' + stage.replaceAll('_', ' ') + '</span>').join('<span aria-hidden="true">›</span>') +
    '</div>' +
    '<section class="mcp-facility__section" aria-labelledby="mcp-inventory-title">' +
      '<div class="mcp-facility__section-heading"><div><p class="mcp-facility__eyebrow">Inventory</p><h3 id="mcp-inventory-title">Available capabilities</h3></div><span data-mcp-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="mcp-facility__inventory" data-mcp-inventory role="list"></div>' +
    '</section>' +
    '<section class="mcp-facility__section" aria-labelledby="mcp-target-title">' +
      '<div class="mcp-facility__section-heading"><div><p class="mcp-facility__eyebrow">Equip target</p><h3 id="mcp-target-title">Target-owned branch</h3></div><span class="mcp-facility__target-status">Dynamic / recursive</span></div>' +
      '<div class="mcp-facility__controls">' +
        '<label>Owner<select data-mcp-target><option value="SEAT:seat-01">Seat 1</option><option value="SEAT:seat-02">Seat 2</option><option value="WORKSPACE:workspace-main">Workspace</option></select></label>' +
        '<label>Path<select data-mcp-path><option value="configuration">Configuration</option><option value="configuration,authorization">Configuration › Authorization</option><option value="tools,github">Tools › GitHub</option></select></label>' +
      '</div>' +
      '<code class="mcp-facility__branch" data-mcp-branch>BRANCH-MCP::workspace/SEAT/seat-01/configuration</code>' +
      '<p class="mcp-facility__branch-note" data-mcp-branch-note>Target-owned semantic branch preview. Equipping is backend-authoritative.</p>' +
    '</section>' +
    '<div class="mcp-facility__actions">' +
      '<button type="button" data-mcp-auth class="primary">Sign in to configure</button>' +
      '<button type="button" data-mcp-intent class="primary" hidden>Request equip intent</button>' +
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
  panel.querySelector('[data-mcp-intent]')?.addEventListener('click', () => requestLifecycle('EQUIP'));
  panel.querySelector('[data-mcp-target]')?.addEventListener('change', (event) => {
    const value = String(event.target?.value || '');
    const parts = value.split(':');
    if (parts[0] === 'SEAT' || parts[0] === 'WORKSPACE') {
      targetType = parts[0];
      targetId = parts[1] || targetId;
      updateBranchPreview();
    }
  });
  panel.querySelector('[data-mcp-path]')?.addEventListener('change', (event) => {
    branchPath = String(event.target?.value || 'configuration').split(',').filter(Boolean);
    updateBranchPreview();
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

export function setMcpPresentationAuthState(value) {
  authenticated = Boolean(value);
  renderInventory();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountMcpFacility(document);
    document.querySelector('[data-mcp-open]')?.addEventListener('click', openMcpFacility);
    if (mounted) renderInventory();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiMcpFacility = Object.freeze({
    open: openMcpFacility,
    close: closeMcpFacility,
    mount: mountMcpFacility,
    setPresentationAuthState: setMcpPresentationAuthState,
    getState: () => Object.freeze({
      authenticated,
      activeCapabilityId,
      targetType,
      targetId,
      branchPath: [...branchPath],
    }),
    requestLifecycle,
  });
}
