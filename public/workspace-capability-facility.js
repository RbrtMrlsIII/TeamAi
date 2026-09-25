import { createSpatialConstructionContext, validateSpatialConstructionNode } from './machine-spatial-root-contract.js';
import {
  createWorkspaceCapabilityBranch,
  createWorkspaceCapabilityIntent,
  getWorkspaceCapability,
  listWorkspaceCapabilities,
  resolveWorkspaceCapabilityReadiness,
  WORKSPACE_CENTER_ID,
} from './workspace-capability.js';

export const WORKSPACE_FACILITY_ROOT_ID = 'hero-workspace-facility';

export const WORKSPACE_FACILITY_SPATIAL_CONTEXT = Object.freeze(
  createSpatialConstructionContext({
    slice: 'S13',
    owner: 'frontend/spatial/workspace-capability-facility.js',
    semanticId: WORKSPACE_CENTER_ID,
    semanticBoundary: 'presentation-only',
  }),
);

if (!validateSpatialConstructionNode(WORKSPACE_FACILITY_SPATIAL_CONTEXT).valid) {
  throw new Error('invalid S13 Workspace spatial root contract');
}

let panel = null;
let activeCapabilityId = 'workspace-context';
let workspaceId = 'workspace-main';
let projectId = 'command-deck';
let authenticated = false;

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function getReadiness() {
  return resolveWorkspaceCapabilityReadiness({
    authenticated,
    workspaceKnown: false,
    projectKnown: false,
    authorized: false,
    entitled: false,
    schedulerEligible: false,
    healthy: false,
  });
}

function updateBranchPreview() {
  const field = panel?.querySelector('[data-workspace-branch]');
  const note = panel?.querySelector('[data-workspace-branch-note]');
  const capability = getWorkspaceCapability(activeCapabilityId);
  if (!field || !note || !capability) return;
  try {
    const branch = createWorkspaceCapabilityBranch({
      capabilityId: capability.id,
      workspaceId,
      projectId,
      path: ['context'],
    });
    field.textContent = branch.id;
    note.textContent = 'Workspace-owned semantic branch preview. Durable state and execution remain backend-owned.';
  } catch {
    field.textContent = 'Branch preview unavailable';
    note.textContent = 'A valid Workspace capability is required before a branch can be proposed.';
  }
}

function render() {
  const state = panel?.querySelector('[data-workspace-state]');
  const inventory = panel?.querySelector('[data-workspace-inventory]');
  const request = panel?.querySelector('[data-workspace-request]');
  if (!state || !inventory || !request) return;

  const readiness = getReadiness();
  state.textContent = authenticated
    ? 'Authenticated context · backend Workspace state required'
    : 'Guest · DISCOVERABLE LOCKED';
  state.dataset.state = readiness.state;

  inventory.innerHTML = listWorkspaceCapabilities().map((capability) => {
    const selected = capability.id === activeCapabilityId;
    return '<button type="button" class="workspace-facility__capability' +
      (selected ? ' is-selected' : '') +
      '" data-workspace-capability="' + capability.id +
      '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="workspace-facility__capability-name">' + capability.label + '</span>' +
      '<span class="workspace-facility__capability-meta">' + capability.purpose + '</span>' +
      '</button>';
  }).join('');

  request.hidden = false;
  request.disabled = !authenticated;
  updateBranchPreview();
}

function focusWorkspace() {
  const hero = window.TeamAiHero;
  if (hero && typeof hero.setCamera === 'function') hero.setCamera('WORKSPACE_CLOSE');
  const status = panel?.querySelector('[data-workspace-result]');
  if (status) status.textContent = 'Workspace center focused. Camera state is presentation-only.';
}

function requestAuth() {
  closeWorkspaceFacility();
  dispatch('teamai:app-ui-handoff', {
    appUiHandoff: true,
    normalUi: true,
    notAuthority: true,
    targetSection: 'auth',
    itemId: activeCapabilityId + '#login',
    source: 'workspace-facility',
  });
}

function requestCapabilityIntent() {
  const status = panel?.querySelector('[data-workspace-result]');
  if (!readModel.contextAvailable) {
    if (status) status.textContent = 'Workspace capability intent is unavailable until an authorized Workspace read model is present.';
    return;
  }

  const intent = createWorkspaceCapabilityIntent({
    capabilityId: activeCapabilityId,
    workspaceId: readModel.workplace.id,
    projectId: readModel.project.id,
    action: 'inspect',
  });
  dispatch('teamai:workspace-capability-intent', intent);
  const status = panel?.querySelector('[data-workspace-result]');
  if (status) status.textContent = 'Workspace capability intent requested. Authoritative runtime confirmation is still required.';
}

function closeWorkspaceFacility() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-workspace-facility-open');
}

function openWorkspaceFacility() {
  mountWorkspaceFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-workspace-facility-open', '1');
  render();
  panel.querySelector('[data-workspace-close]')?.focus();
}

function build() {
  const el = document.createElement('section');
  el.id = WORKSPACE_FACILITY_ROOT_ID;
  el.className = 'workspace-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'workspace-facility-title');
  el.innerHTML =
    '<div class="workspace-facility__header">' +
      '<div><p class="workspace-facility__eyebrow">Workspace capability</p><h2 id="workspace-facility-title">Workspace HQ</h2></div>' +
      '<button type="button" data-workspace-close aria-label="Close Workspace capability facility">Close</button>' +
    '</div>' +
    '<p class="workspace-facility__note">A first-party TeamAi capability surface for Workplace, Project, Team, task, and evidence context. The visual surface does not own Firestore state, authorization, scheduler eligibility, or execution.</p>' +
    '<div class="workspace-facility__state-row"><span data-workspace-state data-state="DISCOVERABLE_LOCKED">Guest · DISCOVERABLE LOCKED</span><span>Presentation only</span></div>' +
    '<div class="workspace-facility__summary">' +
      '<div><span>Semantic target</span><strong>' + WORKSPACE_CENTER_ID + '</strong></div>' +
      '<div><span>Current Workplace</span><strong data-workspace-name>Northstar Workplace</strong></div>' +
      '<div><span>Current Project</span><strong data-workspace-project-label>Command Deck</strong></div>' +
    '</div>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-capabilities-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Capability surface</p><h3 id="workspace-capabilities-title">Workspace capabilities</h3></div><span data-workspace-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="workspace-facility__inventory" data-workspace-inventory role="list"></div>' +
    '</section>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-branch-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Target-owned branch</p><h3 id="workspace-branch-title">Semantic scope</h3></div><span>Workspace-owned / recursive</span></div>' +
      '<div class="workspace-facility__controls">' +
        '<label>Project<select data-workspace-project-id><option value="command-deck">Command Deck</option><option value="atlas">Atlas Migration</option><option value="recovery">Recovery Lab</option></select></label>' +
      '</div>' +
      '<code class="workspace-facility__branch" data-workspace-branch>BRANCH-WORKSPACE::workspace-main/workspace-context/command-deck/context</code>' +
      '<p class="workspace-facility__branch-note" data-workspace-branch-note>Workspace-owned semantic branch preview. Durable state and execution remain backend-owned.</p>' +
    '</section>' +
    '<div class="workspace-facility__actions">' +
      '<button type="button" data-workspace-focus>Center workspace</button>' +
      '<button type="button" data-workspace-auth class="primary">Sign in to configure</button>' +
      '<button type="button" data-workspace-request class="primary">Request capability intent</button>' +
      '<button type="button" data-workspace-close>Back to world</button>' +
    '</div>';
  return el;
}

export function mountWorkspaceFacility(rootNode = document) {
  if (panel) return panel;
  const host = rootNode.querySelector('.hero-shell');
  if (!host) return null;
  panel = build();
  host.append(panel);

  panel.querySelectorAll('[data-workspace-close]').forEach((button) => button.addEventListener('click', closeWorkspaceFacility));
  panel.querySelector('[data-workspace-focus]')?.addEventListener('click', focusWorkspace);
  panel.querySelector('[data-workspace-auth]')?.addEventListener('click', requestAuth);
  panel.querySelector('[data-workspace-request]')?.addEventListener('click', requestCapabilityIntent);
  panel.querySelector('[data-workspace-project-id]')?.addEventListener('change', (event) => {
    projectId = String(event.target?.value || 'command-deck');
    const display = panel?.querySelector('[data-workspace-project-label]');
    const labels = { 'command-deck': 'Command Deck', atlas: 'Atlas Migration', recovery: 'Recovery Lab' };
    if (display) display.textContent = labels[projectId] || projectId;
    render();
  });
  panel.querySelector('[data-workspace-inventory]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const id = target.closest('[data-workspace-capability]')?.getAttribute('data-workspace-capability');
    if (!id || !getWorkspaceCapability(id)) return;
    activeCapabilityId = id;
    render();
  });

  render();
  return panel;
}

export function setWorkspacePresentationAuthState(value) {
  authenticated = Boolean(value);
  render();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountWorkspaceFacility(document);
    document.querySelector('[data-workspace-open]')?.addEventListener('click', openWorkspaceFacility);
    if (mounted) render();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiWorkspaceFacility = Object.freeze({
    open: openWorkspaceFacility,
    close: closeWorkspaceFacility,
    mount: mountWorkspaceFacility,
    setPresentationAuthState: setWorkspacePresentationAuthState,
    focusWorkspace,
    getState: () => Object.freeze({ authenticated, activeCapabilityId, workspaceId, projectId }),
  });
}
