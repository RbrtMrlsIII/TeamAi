import { resolveWorkspaceCapabilityReadiness } from './workspace-capability.js';

const MAX_ITEMS = 50;

function text(value, fallback = '') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizeEntity(value, fallbackKind) {
  if (!value || typeof value !== 'object') return null;
  const id = text(value.id || value[fallbackKind + 'Id']);
  const label = text(value.label || value.name);
  if (!id || !label) return null;
  return Object.freeze({ id, label });
}

function normalizeItems(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.slice(0, MAX_ITEMS).map((item) => {
    if (!item || typeof item !== 'object') return null;
    const id = text(item.id);
    const label = text(item.label || item.name);
    if (!id || !label) return null;
    return Object.freeze({
      id,
      label,
      state: text(item.state, 'UNKNOWN'),
      kind: text(item.kind, 'item'),
    });
  }).filter(Boolean));
}

export function normalizeWorkspaceReadModel(input = {}) {
  const readinessInput = input.readiness && typeof input.readiness === 'object'
    ? input.readiness
    : input;

  const readiness = resolveWorkspaceCapabilityReadiness({
    authenticated: readinessInput.authenticated,
    workspaceKnown: readinessInput.workspaceKnown,
    projectKnown: readinessInput.projectKnown,
    authorized: readinessInput.authorized,
    entitled: readinessInput.entitled,
    schedulerEligible: readinessInput.schedulerEligible,
    healthy: readinessInput.healthy,
  });

  const workplace = normalizeEntity(input.workplace || input.workspace, 'workplace');
  const project = normalizeEntity(input.project, 'project');
  const team = normalizeEntity(input.team, 'team');

  const contextValid = readiness.ready &&
    workplace &&
    project &&
    team;

  return Object.freeze({
    ...readiness,
    source: 'backend-read-model',
    workplace,
    project,
    team,
    seats: normalizeItems(input.seats),
    activeTask: normalizeEntity(input.activeTask || input.task, 'task'),
    evidence: normalizeItems(input.evidence),
    results: normalizeItems(input.results),
    contextAvailable: Boolean(contextValid),
    context: contextValid
      ? Object.freeze({ workplace, project, team })
      : null,
  });
}

export function createEmptyWorkspaceReadModel() {
  return normalizeWorkspaceReadModel({
    authenticated: false,
    workspaceKnown: false,
    projectKnown: false,
    authorized: false,
    entitled: false,
    schedulerEligible: false,
    healthy: false,
  });
}
