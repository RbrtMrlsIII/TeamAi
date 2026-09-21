export const TEAM_AGENTS_FEATURE_ID = 'team-agents';

export const AGENT_ROLES = Object.freeze([
  Object.freeze({ id: 'planner', label: 'Planner' }),
  Object.freeze({ id: 'coder', label: 'Coder' }),
  Object.freeze({ id: 'researcher', label: 'Researcher' }),
  Object.freeze({ id: 'reviewer', label: 'Reviewer' }),
  Object.freeze({ id: 'tester-verifier', label: 'Tester / Verifier' }),
  Object.freeze({ id: 'coordinator', label: 'Coordinator' }),
]);

export const TEAM_AGENTS = Object.freeze([
  Object.freeze({
    id: 'agent-alpha',
    label: 'Alpha',
    role: 'planner',
    seatId: 'seat-01',
    capabilityProfile: 'Planning + review',
  }),
  Object.freeze({
    id: 'agent-beta',
    label: 'Beta',
    role: 'coder',
    seatId: 'seat-02',
    capabilityProfile: 'Working + tool use',
  }),
  Object.freeze({
    id: 'agent-gamma',
    label: 'Gamma',
    role: 'reviewer',
    seatId: 'seat-03',
    capabilityProfile: 'Review + verification',
  }),
]);

const AGENT_BY_ID = new Map(TEAM_AGENTS.map((agent) => [agent.id, agent]));

function normalizePart(value, fallback) {
  const normalized = String(value ?? fallback).trim();
  return normalized || fallback;
}

export function getTeamAgent(id) {
  return AGENT_BY_ID.get(String(id || '')) || null;
}

export function listTeamAgents() {
  return TEAM_AGENTS.slice();
}

export function getAgentRole(id) {
  return AGENT_ROLES.find((role) => role.id === String(id || '')) || null;
}

export function createAgentAssignmentBranch({
  agentId = 'agent-alpha',
  seatId = 'seat-01',
  role = 'planner',
  path = ['configuration'],
} = {}) {
  const agent = getTeamAgent(agentId);
  const roleDefinition = getAgentRole(role);
  if (!agent) throw new Error('unknown Team agent');
  if (!roleDefinition) throw new Error('unknown Agent role');
  const seat = normalizePart(seatId, agent.seatId);
  const normalizedRole = roleDefinition.id;
  const segments = Array.isArray(path)
    ? path.map((part) => normalizePart(part, '')).filter(Boolean)
    : [];
  return Object.freeze({
    id: 'BRANCH-TEAM::agent/' + normalizePart(agent.id, 'agent') + '/seat/' + seat + '/role/' + normalizedRole + '/' + segments.join('/'),
    featureId: TEAM_AGENTS_FEATURE_ID,
    semanticOwner: 'TEAM_AGENTS',
    agentId: agent.id,
    seatId: seat,
    role: normalizedRole,
    path: Object.freeze([...segments]),
    presentationOnly: true,
    notAuthorization: true,
    notEntitlement: true,
  });
}

export function createAgentAssignmentIntent({
  agentId = 'agent-alpha',
  seatId = 'seat-01',
  role = 'planner',
} = {}) {
  const branch = createAgentAssignmentBranch({ agentId, seatId, role, path: ['configuration'] });
  return Object.freeze({
    agentAssignmentIntent: true,
    featureId: TEAM_AGENTS_FEATURE_ID,
    agentId: branch.agentId,
    seatId: branch.seatId,
    role: branch.role,
    branchId: branch.id,
    presentationOnly: true,
    notAuthority: true,
    notAuthorization: true,
    notEntitlement: true,
    notDurableState: true,
    notSchedulerAuthority: true,
    notExecution: true,
    source: 'team-agents-facility',
  });
}

export function resolveAgentReadiness(input = {}) {
  const values = {
    authenticated: Boolean(input.authenticated),
    agentKnown: Boolean(input.agentKnown),
    seatKnown: Boolean(input.seatKnown),
    roleConfigured: Boolean(input.roleConfigured),
    authorized: Boolean(input.authorized),
    entitled: Boolean(input.entitled),
    healthy: Boolean(input.healthy),
  };
  const ready = Object.values(values).every(Boolean);
  return Object.freeze({
    ...values,
    state: ready ? 'READY' : values.authenticated ? 'BACKEND_STATE_REQUIRED' : 'DISCOVERABLE_LOCKED',
    usable: ready,
    presentationOnly: true,
  });
}
