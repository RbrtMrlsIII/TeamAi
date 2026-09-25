import {
  AGENT_ROLES,
  createAgentAssignmentBranch,
  createAgentAssignmentIntent,
  getAgentRole,
} from './team-agents.js';
import {
  createEmptyTeamAgentsReadModel,
  normalizeTeamAgentsReadModel,
} from './team-agents-runtime-read-model.js';

export const TEAM_AGENTS_FACILITY_ROOT_ID = 'hero-team-agents-facility';

let panel = null;
let activeAgentId = null;
let selectedSeatId = null;
let selectedRole = null;
let readModel = createEmptyTeamAgentsReadModel();

function dispatch(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, {
    detail: Object.freeze({ ...detail, presentationOnly: true }),
  }));
}

function getAgent() {
  return readModel.agents.find((agent) => agent.id === activeAgentId) || readModel.agents[0] || null;
}

function renderBranch() {
  const field = panel?.querySelector('[data-agent-branch]');
  const note = panel?.querySelector('[data-agent-branch-note]');
  const agent = getAgent();
  if (!field || !note || !agent) return;
  try {
    const branch = createAgentAssignmentBranch({
      agentId: agent.id,
      seatId: selectedSeatId,
      role: selectedRole,
    });
    field.textContent = branch.id;
    note.textContent = 'Assignment preview only. Role and Seat mutation remain backend-authoritative.';
  } catch {
    field.textContent = 'Assignment preview unavailable';
    note.textContent = 'A valid Agent and role are required before a branch can be proposed.';
  }
}

function render() {
  const inventory = panel?.querySelector('[data-agent-inventory]');
  const state = panel?.querySelector('[data-agent-state]');
  const role = panel?.querySelector('[data-agent-role]');
  const seat = panel?.querySelector('[data-agent-seat]');
  const request = panel?.querySelector('[data-agent-request]');
  const profile = panel?.querySelector('[data-agent-profile]');
  if (!inventory || !state || !role || !seat || !request || !profile) return;

  const agent = getAgent();
  const readiness = resolveAgentReadiness({
    authenticated,
    agentKnown: false,
    seatKnown: false,
    roleConfigured: false,
    authorized: false,
    entitled: false,
    healthy: false,
  });

  state.textContent = authenticated
    ? 'Authenticated context · backend Team / Agent state required'
    : 'Guest · DISCOVERABLE LOCKED';
  state.dataset.state = readiness.state;

  inventory.innerHTML = listTeamAgents().map((item) => {
    const selected = item.id === activeAgentId;
    return '<button type="button" class="team-agents-facility__agent' +
      (selected ? ' is-selected' : '') +
      '" data-agent-id="' + item.id +
      '" aria-pressed="' + (selected ? 'true' : 'false') + '">' +
      '<span class="team-agents-facility__agent-name">' + item.label + '</span>' +
      '<span class="team-agents-facility__agent-meta">' + (getAgentRole(item.role)?.label || item.role) + ' · ' + item.seatId + '</span>' +
      '</button>';
  }).join('');

  profile.textContent = agent.capabilityProfile + ' · presentation profile';

  for (const option of role.options) option.textContent = getAgentRole(option.value)?.label || option.value;
  role.value = selectedRole;
  seat.value = selectedSeatId;

  request.disabled = !authenticated;
  renderBranch();
}

function focusTeam() {
  const hero = window.TeamAiHero;
  if (hero && typeof hero.setCamera === 'function') hero.setCamera('TEAM_ORBIT');
  const status = panel?.querySelector('[data-agent-result]');
  if (status) status.textContent = 'Team / Agent relationship focused. Camera state is presentation-only.';
}

function requestAuth() {
  closeTeamAgentsFacility();
  dispatch('teamai:app-ui-handoff', {
    appUiHandoff: true,
    normalUi: true,
    notAuthority: true,
    targetSection: 'auth',
    itemId: activeAgentId + '#login',
    source: 'team-agents-facility',
  });
}

function requestAssignment() {
  const intent = createAgentAssignmentIntent({
    agentId: activeAgentId,
    seatId: selectedSeatId,
    role: selectedRole,
  });
  dispatch('teamai:agent-assignment-intent', intent);
  const status = panel?.querySelector('[data-agent-result]');
  if (status) status.textContent = 'Role / Seat assignment intent requested. Authoritative TeamAi state is still required.';
}

function closeTeamAgentsFacility() {
  if (!panel) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.documentElement.removeAttribute('data-team-agents-facility-open');
}

function openTeamAgentsFacility() {
  mountTeamAgentsFacility();
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.documentElement.setAttribute('data-team-agents-facility-open', '1');
  render();
  panel.querySelector('[data-team-agents-close]')?.focus();
}

function build() {
  const el = document.createElement('section');
  el.id = TEAM_AGENTS_FACILITY_ROOT_ID;
  el.className = 'team-agents-facility';
  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'false');
  el.setAttribute('aria-labelledby', 'team-agents-facility-title');
  el.innerHTML =
    '<div class="team-agents-facility__header">' +
      '<div><p class="team-agents-facility__eyebrow">Team / Agents</p><h2 id="team-agents-facility-title">Responsibility management</h2></div>' +
      '<button type="button" data-team-agents-close aria-label="Close Team / Agents facility">Close</button>' +
    '</div>' +
    '<p class="team-agents-facility__note">Inspect configured AI applications, responsibility profiles, Seat assignment, capability profile, and readiness. Browser controls only preview or request intent; authorization, entitlement, durable state, and scheduler eligibility remain external authorities.</p>' +
    '<div class="team-agents-facility__state-row"><span data-agent-state data-state="DISCOVERABLE_LOCKED">Guest · DISCOVERABLE LOCKED</span><span>Presentation only</span></div>' +
    '<section class="team-agents-facility__section" aria-labelledby="team-agents-inventory-title">' +
      '<div class="team-agents-facility__section-heading"><div><p class="team-agents-facility__eyebrow">Configured agents</p><h3 id="team-agents-inventory-title">Team participants</h3></div><span data-agent-result role="status">Inspection changes presentation only.</span></div>' +
      '<div class="team-agents-facility__inventory" data-agent-inventory role="list"></div>' +
    '</section>' +
    '<section class="team-agents-facility__section" aria-labelledby="team-agents-profile-title">' +
      '<div class="team-agents-facility__section-heading"><div><p class="team-agents-facility__eyebrow">Responsibility profile</p><h3 id="team-agents-profile-title">Role + Seat preview</h3></div><span data-agent-profile>Planning + review · presentation profile</span></div>' +
      '<div class="team-agents-facility__controls">' +
        '<label>Seat<select data-agent-seat><option value="seat-01">Seat 1</option><option value="seat-02">Seat 2</option><option value="seat-03">Seat 3</option></select></label>' +
        '<label>Role<select data-agent-role>' + AGENT_ROLES.map((role) => '<option value="' + role.id + '">' + role.label + '</option>').join('') + '</select></label>' +
      '</div>' +
      '<code class="team-agents-facility__branch" data-agent-branch>BRANCH-TEAM::agent/agent-alpha/seat/seat-01/role/planner/configuration</code>' +
      '<p class="team-agents-facility__branch-note" data-agent-branch-note>Assignment preview only. Role and Seat mutation remain backend-authoritative.</p>' +
    '</section>' +
    '<div class="team-agents-facility__actions">' +
      '<button type="button" data-agent-focus>Focus team relationship</button>' +
      '<button type="button" data-agent-auth class="primary">Sign in to manage team</button>' +
      '<button type="button" data-agent-request class="primary">Request assignment intent</button>' +
      '<button type="button" data-team-agents-close>Back to world</button>' +
    '</div>';
  return el;
}

export function mountTeamAgentsFacility(rootNode = document) {
  if (panel) return panel;
  const host = rootNode.querySelector('.hero-shell');
  if (!host) return null;
  panel = build();
  host.append(panel);

  panel.querySelectorAll('[data-team-agents-close]').forEach((button) => button.addEventListener('click', closeTeamAgentsFacility));
  panel.querySelector('[data-agent-focus]')?.addEventListener('click', focusTeam);
  panel.querySelector('[data-agent-auth]')?.addEventListener('click', requestAuth);
  panel.querySelector('[data-agent-request]')?.addEventListener('click', requestAssignment);
  panel.querySelector('[data-agent-seat]')?.addEventListener('change', (event) => {
    selectedSeatId = String(event.target?.value || 'seat-01');
    renderBranch();
  });
  panel.querySelector('[data-agent-role]')?.addEventListener('change', (event) => {
    const next = String(event.target?.value || 'planner');
    if (getAgentRole(next)) selectedRole = next;
    renderBranch();
  });
  panel.querySelector('[data-agent-inventory]')?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const id = target.closest('[data-agent-id]')?.getAttribute('data-agent-id');
    if (!id || !getTeamAgent(id)) return;
    activeAgentId = id;
    const agent = getAgent();
    selectedSeatId = agent.seatId;
    selectedRole = agent.role;
    render();
  });

  render();
  return panel;
}

export function setTeamAgentsPresentationAuthState(value) {
  authenticated = Boolean(value);
  render();
}

if (typeof document !== 'undefined') {
  queueMicrotask(() => {
    const mounted = mountTeamAgentsFacility(document);
    document.querySelector('[data-team-agents-open]')?.addEventListener('click', openTeamAgentsFacility);
    if (mounted) render();
  });
}

if (typeof window !== 'undefined') {
  window.TeamAiTeamAgentsFacility = Object.freeze({
    open: openTeamAgentsFacility,
    close: closeTeamAgentsFacility,
    mount: mountTeamAgentsFacility,
    setPresentationAuthState: setTeamAgentsPresentationAuthState,
    focusTeam,
    getState: () => Object.freeze({
      authenticated,
      activeAgentId,
      selectedSeatId,
      selectedRole,
    }),
  });
}
