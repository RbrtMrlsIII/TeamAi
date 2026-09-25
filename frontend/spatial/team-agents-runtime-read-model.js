import { getAgentRole, resolveAgentReadiness } from './team-agents.js';

const MAX_AGENTS = 50;
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

function normalizeSeats(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.slice(0, MAX_SEATS).map((seat) => {
    if (!seat || typeof seat !== 'object') return null;
    const id = text(seat.id || seat.seatId);
    const label = text(seat.label || seat.name, id);
    if (!id || !label) return null;
    return Object.freeze({
      id,
      label,
      state: text(seat.state, 'UNKNOWN'),
    });
  }).filter(Boolean));
}

function normalizeAgents(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value.slice(0, MAX_AGENTS).map((agent) => {
    if (!agent || typeof agent !== 'object') return null;
    const id = text(agent.id || agent.agentId);
    const label = text(agent.label || agent.name);
    const role = text(agent.role);
    const seatId = text(agent.seatId);
    if (!id || !label || !role || !seatId || !getAgentRole(role)) return null;
    return Object.freeze({
      id,
      label,
      role,
      seatId,
      capabilityProfile: text(agent.capabilityProfile || agent.profile, 'Capability profile unavailable'),
      skillBundle: Object.freeze(Array.isArray(agent.skillBundle)
        ? agent.skillBundle.map((item) => text(item)).filter(Boolean).slice(0, 25)
        : []),
      readiness: resolveAgentReadiness({
        authenticated: true,
        agentKnown: true,
        seatKnown: true,
        roleConfigured: Boolean(role),
        authorized: Boolean(agent.authorized),
        entitled: Boolean(agent.entitled),
        healthy: Boolean(agent.healthy),
      }),
    });
  }).filter(Boolean));
}

export function normalizeTeamAgentsReadModel(input = {}) {
  const readinessInput = input.readiness && typeof input.readiness === 'object'
    ? input.readiness
    : input;

  const team = normalizeEntity(input.team, 'team');
  const seats = normalizeSeats(input.seats);
  const agents = normalizeAgents(input.agents);
  const authenticated = Boolean(readinessInput.authenticated);
  const workspaceKnown = Boolean(readinessInput.workspaceKnown);
  const authorized = Boolean(readinessInput.authorized);
  const entitled = Boolean(readinessInput.entitled);

  const completeContext = authenticated && workspaceKnown && authorized && entitled && Boolean(readinessInput.healthy) && Boolean(team);
  const usableAgents = completeContext
    ? agents.filter((agent) => agent.readiness.usable)
    : [];

  return Object.freeze({
    source: 'backend-read-model',
    authenticated,
    workspaceKnown,
    authorized,
    entitled,
    healthy: Boolean(readinessInput.healthy),
    contextAvailable: completeContext,
    state: completeContext ? 'READY' : authenticated ? 'BACKEND_STATE_REQUIRED' : 'DISCOVERABLE_LOCKED',
    usable: completeContext && usableAgents.length > 0,
    team,
    seats: completeContext ? seats : Object.freeze([]),
    agents: Object.freeze(usableAgents),
  });
}

export function createEmptyTeamAgentsReadModel() {
  return normalizeTeamAgentsReadModel({
    authenticated: false,
    workspaceKnown: false,
    authorized: false,
    entitled: false,
    healthy: false,
  });
}
