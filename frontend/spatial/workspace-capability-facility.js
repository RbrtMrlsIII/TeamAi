import { createSpatialConstructionContext, validateSpatialConstructionNode } from './machine-spatial-root-contract.js';
import {
  createWorkspaceCapabilityBranch,
  createWorkspaceCapabilityIntent,
  getWorkspaceCapability,
  listWorkspaceCapabilities,
  WORKSPACE_CENTER_ID,
} from './workspace-capability.js';
import {
  createEmptyWorkspaceReadModel,
  normalizeWorkspaceReadModel,
} from './workspace-runtime-read-model.js';

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
let readModel = createEmptyWorkspaceReadModel();

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function getReadiness() {
  return readModel;
}

function renderReadModelList(selector, items, emptyText) {
  const target = panel?.querySelector(selector);
  if (!target) return;
  target.replaceChildren();

  if (!readModel.contextAvailable || !items.length) {
    const empty = document.createElement('span');
    empty.className = 'workspace-facility__empty';
    empty.textContent = emptyText;
    target.append(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'workspace-facility__read-model-list';
  items.slice(0, 6).forEach((item) => {
    const entry = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = item.label;
    entry.append(label);
    if (item.state || item.kind) {
      const meta = document.createElement('span');
      meta.textContent = [item.kind, item.state].filter(Boolean).join(' · ');
      entry.append(meta);
    }
    list.append(entry);
  });
  target.append(list);
}

function renderReadModelContext() {
  const teamLabel = panel?.querySelector('[data-workspace-team-label]');
  const seatSummary = panel?.querySelector('[data-workspace-seat-summary]');
  const task = panel?.querySelector('[data-workspace-task]');

  if (!readModel.contextAvailable) {
    if (teamLabel) teamLabel.textContent = 'Unavailable until authorized Workspace read model is available';
    if (seatSummary) seatSummary.textContent = 'Seat projection unavailable';
    if (task) task.textContent = 'Active task unavailable';
  } else {
    if (teamLabel) teamLabel.textContent = readModel.team?.label || 'Team unavailable';
    if (seatSummary) seatSummary.textContent = \`\${readModel.seats.length} Seat projection\${readModel.seats.length === 1 ? '' : 's'} supplied by the backend read model\`;
    if (task) task.textContent = readModel.activeTask?.label || 'No active task reported by the backend read model';
  }

  renderReadModelList('[data-workspace-evidence]', readModel.evidence, 'No evidence records reported by the backend read model');
  renderReadModelList('[data-workspace-results]', readModel.results, 'No result records reported by the backend read model');
}

function updateBranchPreview() {
  const field = panel?.querySelector('[data-workspace-branch]');
  const note = panel?.querySelector('[data-workspace-branch-note]');
  const capability = getWorkspaceCapability(activeCapabilityId);
  if (!field || !note || !capability) return;

  if (!readModel.contextAvailable) {
    field.textContent = 'Branch preview unavailable';
    note.textContent = 'An authorized backend Workspace read model is required before a project-scoped branch can be projected.';
    return;
  }

  try {
    const branch = createWorkspaceCapabilityBranch({
      capabilityId: capability.id,
      workspaceId: readModel.workplace.id,
      projectId: readModel.project.id,
      path: ['context'],
    });
    field.textContent = branch.id;
    note.textContent = 'Workspace-owned semantic branch preview derived from the authorized read model. Durable state and execution remain backend-owned.';
  } catch {
    field.textContent = 'Branch preview unavailable';
    note.textContent = 'A valid authorized Workspace context is required before a branch can be projected.';
  }
}

function render() {
  const state = panel?.querySelector('[data-workspace-state]');
  const inventory = panel?.querySelector('[data-workspace-inventory]');
  const request = panel?.querySelector('[data-workspace-request]');
  if (!state || !inventory || !request) return;

  const readiness = getReadiness();
  state.textContent = readiness.authenticated
    ? readiness.contextAvailable
      ? 'Authenticated · Workspace context READY'
      : 'Authenticated context · Workspace read model unavailable'
    : 'Guest · DISCOVERABLE LOCKED';
  state.dataset.state = readiness.state;

  const workplaceLabel = panel?.querySelector('[data-workspace-name]');
  const projectLabel = panel?.querySelector('[data-workspace-project-label]');
  if (workplaceLabel) workplaceLabel.textContent = readModel.workplace?.label || 'Unavailable until authorized Workspace read model is available';
  if (projectLabel) projectLabel.textContent = readModel.project?.label || 'Unavailable until authorized Workspace read model is available';
  renderReadModelContext();

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
  request.disabled = !readiness.usable || !readModel.contextAvailable;
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
      '<div><span>Current Workplace</span><strong data-workspace-name>Unavailable until authorized Workspace read model is available</strong></div>' +
      '<div><span>Current Project</span><strong data-workspace-project-label>Unavailable until authorized Workspace read model is available</strong></div>' +
      '<div><span>Current Team</span><strong data-workspace-team-label>Unavailable until authorized Workspace read model is available</strong></div>' +
    '</div>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-runtime-context-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Runtime context</p><h3 id="workspace-runtime-context-title">Current work</h3></div><span>Backend read model</span></div>' +
      '<div class="workspace-facility__read-model-grid">' +
        '<div class="workspace-facility__read-model-card"><span>Seat projection</span><strong data-workspace-seat-summary>Seat projection unavailable</strong></div>' +
        '<div class="workspace-facility__read-model-card"><span>Active task</span><strong data-workspace-task>Active task unavailable</strong></div>' +
      '</div>' +
    '</section>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-evidence-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Continuity</p><h3 id="workspace-evidence-title">Evidence / results</h3></div><span>Metadata only</span></div>' +
      '<div class="workspace-facility__read-model-grid">' +
        '<div class="workspace-facility__read-model-card"><span>Evidence</span><div data-workspace-evidence>Evidence unavailable</div></div>' +
        '<div class="workspace-facility__read-model-card"><span>Results</span><div data-workspace-results>Results unavailable</div></div>' +
      '</div>' +
    '</section>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-capabilities-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Capability surface</p><h3 id="workspace-capabilities-title">Workspace capabilities</h3></div><span data-workspace-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="workspace-facility__inventory" data-workspace-inventory role="list"></div>' +
    '</section>' +
    '<section class="workspace-facility__section" aria-labelledby="workspace-branch-title">' +
      '<div class="workspace-facility__section-heading"><div><p class="workspace-facility__eyebrow">Target-owned branch</p><h3 id="workspace-branch-title">Semantic scope</h3></div><span>Workspace-owned / recursive</span></div>' +
      '<div class="workspace-facility__controls">' +
        '<span class="workspace-facility__context-note">Project scope is supplied by the authorized Workspace read model; the facility does not invent or switch project identity locally.</span>' +
      '</div>' +
      '<code class="workspace-facility__branch" data-workspace-branch>Branch preview unavailable</code>' +
      '<p class="workspace-facility__branch-note" data-workspace-branch-note>An authorized backend Workspace read model is required before a project-scoped branch can be projected.</p>' +
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
  const authenticated = Boolean(value);
  readModel = normalizeWorkspaceReadModel({
    ...readModel,
    readiness: { ...readModel, authenticated },
  });
  render();
}

export function setWorkspaceReadModel(value) {
  readModel = normalizeWorkspaceReadModel(value);
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
  window.addEventListener('teamai:workspace-runtime-read-model', (event) => {
    if (event.detail?.readModel) setWorkspaceReadModel(event.detail.readModel);
  });

  window.TeamAiWorkspaceFacility = Object.freeze({
    open: openWorkspaceFacility,
    close: closeWorkspaceFacility,
    mount: mountWorkspaceFacility,
    setPresentationAuthState: setWorkspacePresentationAuthState,
    setReadModel: setWorkspaceReadModel,
    focusWorkspace,
    getState: () => Object.freeze({
      authenticated: readModel.authenticated,
      activeCapabilityId,
      contextAvailable: readModel.contextAvailable,
      workplaceId: readModel.workplace?.id || null,
      projectId: readModel.project?.id || null,
    }),
  });
}
