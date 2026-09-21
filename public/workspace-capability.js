export const WORKSPACE_HQ_FEATURE_ID = 'workspace-hq';
export const WORKSPACE_CENTER_ID = 'WORKSPACE_CENTER';

export const WORKSPACE_CAPABILITIES = Object.freeze([
  Object.freeze({ id: 'workspace-context', label: 'Workspace context', purpose: 'Current Workplace / Project / Team read-model' }),
  Object.freeze({ id: 'workspace-projects', label: 'Project scope', purpose: 'Project selection and scope presentation' }),
  Object.freeze({ id: 'workspace-team', label: 'Team readiness', purpose: 'Participating Seats and readiness projection' }),
  Object.freeze({ id: 'workspace-evidence', label: 'Evidence continuity', purpose: 'Tasks, results, artifacts, and handoff projection' }),
]);

const CAPABILITY_BY_ID = new Map(WORKSPACE_CAPABILITIES.map((item) => [item.id, item]));

function normalizePart(value, fallback) {
  const normalized = String(value ?? fallback).trim();
  return normalized || fallback;
}

export function getWorkspaceCapability(id) {
  return CAPABILITY_BY_ID.get(String(id || '')) || null;
}

export function listWorkspaceCapabilities() {
  return WORKSPACE_CAPABILITIES.slice();
}

export function createWorkspaceCapabilityBranch({
  capabilityId = 'workspace-context',
  workspaceId = 'workspace-main',
  projectId = 'command-deck',
  path = ['context'],
} = {}) {
  const capability = getWorkspaceCapability(capabilityId);
  if (!capability) throw new Error('unknown workspace capability');
  const workspace = normalizePart(workspaceId, 'workspace-main');
  const project = normalizePart(projectId, 'command-deck');
  const segments = Array.isArray(path)
    ? path.map((part) => normalizePart(part, '')).filter(Boolean)
    : [];
  return Object.freeze({
    id: 'BRANCH-WORKSPACE::' + [workspace, capability.id, project, ...segments].join('/'),
    semanticTarget: WORKSPACE_CENTER_ID,
    featureId: WORKSPACE_HQ_FEATURE_ID,
    capabilityId: capability.id,
    workspaceId: workspace,
    projectId: project,
    path: Object.freeze([...segments]),
    presentationOnly: true,
    notDurableAuthority: true,
  });
}

export function createWorkspaceCapabilityIntent({
  capabilityId = 'workspace-context',
  workspaceId = 'workspace-main',
  projectId = 'command-deck',
  action = 'inspect',
} = {}) {
  const branch = createWorkspaceCapabilityBranch({ capabilityId, workspaceId, projectId });
  return Object.freeze({
    workspaceCapabilityIntent: true,
    action: normalizePart(action, 'inspect'),
    featureId: WORKSPACE_HQ_FEATURE_ID,
    capabilityId: branch.capabilityId,
    workspaceId: branch.workspaceId,
    projectId: branch.projectId,
    semanticTarget: WORKSPACE_CENTER_ID,
    presentationOnly: true,
    notAuthority: true,
    notDurableState: true,
    notSchedulerAuthority: true,
    notExecution: true,
    source: 'workspace-capability-facility',
  });
}

export function resolveWorkspaceCapabilityReadiness(input = {}) {
  const values = {
    authenticated: Boolean(input.authenticated),
    workspaceKnown: Boolean(input.workspaceKnown),
    projectKnown: Boolean(input.projectKnown),
    authorized: Boolean(input.authorized),
    entitled: Boolean(input.entitled),
    schedulerEligible: Boolean(input.schedulerEligible),
    healthy: Boolean(input.healthy),
  };
  const ready = Object.values(values).every(Boolean);
  let state = 'DISCOVERABLE_LOCKED';
  if (ready) state = 'READY';
  else if (values.authenticated) state = 'BACKEND_STATE_REQUIRED';
  return Object.freeze({ ...values, state, usable: ready, presentationOnly: true });
}
