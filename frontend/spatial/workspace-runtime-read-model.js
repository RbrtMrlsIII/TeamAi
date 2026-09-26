import { resolveWorkspaceCapabilityReadiness } from './workspace-capability.js';

const MAX_ITEMS = 50;
const MAX_SEATS = 10;

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

  const contextValid = readiness.usable &&
    workplace &&
    project &&
    team;
  const contextAvailable = Boolean(contextValid);
  const seats = contextAvailable
    ? Object.freeze(normalizeItems(input.seats).slice(0, MAX_SEATS))
    : Object.freeze([]);
  const activeTask = contextAvailable
    ? normalizeEntity(input.activeTask || input.task, 'task')
    : null;
  const evidence = contextAvailable ? normalizeItems(input.evidence) : Object.freeze([]);
  const results = contextAvailable ? normalizeItems(input.results) : Object.freeze([]);

  const visibleWorkplace = contextAvailable ? workplace : null;
  const visibleProject = contextAvailable ? project : null;
  const visibleTeam = contextAvailable ? team : null;

  return Object.freeze({
    ...readiness,
    source: 'backend-read-model',
    workplace: visibleWorkplace,
    project: visibleProject,
    team: visibleTeam,
    seats,
    activeTask,
    evidence,
    results,
    contextAvailable,
    context: contextValid
      ? Object.freeze({ workplace: visibleWorkplace, project: visibleProject, team: visibleTeam })
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
