const HEALTH = Object.freeze({
  unknown: { label: '·', title: 'Connection health unknown (presentation)' },
  offline: { label: 'OFF', title: 'Offline (presentation preview)' },
  degraded: { label: 'DEG', title: 'Degraded (presentation preview)' },
  healthy: { label: 'OK', title: 'Healthy (presentation preview)' }
});

/** Reason-bearing authorization presentation. Not durable authority. */
const AUTH_STATES = Object.freeze({
  available: { label: 'AVL', title: 'Available — authorized for presented scope (preview)' },
  blocked: { label: 'BLK', title: 'Blocked — policy or eligibility prevents use (preview)' },
  unauthorized: { label: 'UNA', title: 'Unauthorized — no grant for this seat/scope (preview)' },
  degraded: { label: 'DEG', title: 'Degraded — entitled but compatibility/health reduced (preview)' },
  unavailable: { label: 'NAV', title: 'Unavailable — capability or connection not present (preview)' }
});

const ENTITLEMENT_STATES = Object.freeze({
  none: { label: 'NONE', title: 'No TeamAi entitlement projection (presentation)' },
  entitled: { label: 'ENT', title: 'Entitled (presentation projection)' },
  expired: { label: 'EXP', title: 'Entitlement expired (presentation projection)' }
});

const LAYERS = [
  { id: 'identity', label: 'Identity', sub: 'Web AI Seat label / role (presentation)', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_IDENTITY', handoff: 'identity' },
  { id: 'responsibility', label: 'Responsibility', sub: 'duty dial (presentation, not authority)', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_RESPONSIBILITY', handoff: 'responsibility', dial: true },
  { id: 'connection', label: 'Connection', sub: 'external app account / integration', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_CONNECTION', handoff: 'connection', health: true },
  { id: 'behavior', label: 'Behavior', sub: 'Do / Don’t', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_BEHAVIOR', handoff: 'behavior' },
  { id: 'toolkit', label: 'Built-in Toolkit', sub: 'included skills', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_SKILLS', handoff: 'skills' },
  { id: 'zipskills', label: 'ZipSkills', sub: 'optional skills', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_ZIPSKILLS', handoff: 'zipskills' },
  { id: 'capabilities', label: 'Capabilities', sub: 'tools / MCP availability', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_CAPABILITY', handoff: 'capabilities' },
  { id: 'authorization', label: 'Authorization', sub: 'scope / approvals (reason-bearing preview)', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_AUTHORIZATION', handoff: 'authorization', auth: true },
  { id: 'workspace', label: 'Workspace', sub: 'shared ref / state', camera: 'WORKSPACE_CLOSE', semanticCamera: 'MECHANISM_WORKSPACE', handoff: 'workspace' },
  { id: 'task', label: 'Task / Evidence', sub: 'state / verification', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_TASK', handoff: 'task-evidence' }
];

const stack = document.querySelector('.seat-stack');
if (!stack) throw new Error('Web AI Seat stack mount missing');

let activeLayer = null;
const equipped = new Set();
let connectionHealth = 'unknown';
let responsibilityDial = 0.35;
let authorizationState = 'unavailable';
let authorizationScope = 'project';
let approvalRequired = true;
let entitlementState = 'none';

function authorizationReason() {
  const auth = AUTH_STATES[authorizationState] || AUTH_STATES.unavailable;
  const ent = ENTITLEMENT_STATES[entitlementState] || ENTITLEMENT_STATES.none;
  const approval = approvalRequired ? 'approval required' : 'no extra approval shown';
  return `${auth.title} · scope=${authorizationScope} · ${ent.title} · ${approval}`;
}

function setVisualState() {
  stack.querySelectorAll('[data-seat-layer]').forEach((el) => {
    const id = el.dataset.seatLayer;
    const selected = activeLayer === id;
    const isEquipped = equipped.has(id);
    el.setAttribute('aria-pressed', String(selected));
    el.dataset.equipped = String(isEquipped);
    el.classList.toggle('is-equipped-focus', selected);
    el.classList.toggle('is-equipped', isEquipped);
    const state = el.querySelector('.seat-stack__state');
    if (id === 'connection' && state) {
      const h = HEALTH[connectionHealth] || HEALTH.unknown;
      state.textContent = h.label;
      state.title = h.title;
      el.dataset.connectionHealth = connectionHealth;
      el.setAttribute('data-health', connectionHealth);
    } else if (id === 'authorization' && state) {
      const auth = AUTH_STATES[authorizationState] || AUTH_STATES.unavailable;
      state.textContent = auth.label;
      state.title = authorizationReason();
      el.dataset.authState = authorizationState;
      el.dataset.authScope = authorizationScope;
      el.dataset.approvalRequired = String(approvalRequired);
      el.dataset.entitlement = entitlementState;
      el.setAttribute('data-auth-state', authorizationState);
      el.setAttribute('aria-label', `Authorization: ${authorizationReason()}`);
    } else if (state) {
      state.textContent = isEquipped ? 'ON' : '·';
      state.removeAttribute('title');
    }
    if (id === 'responsibility') {
      el.style.setProperty('--responsibility-dial', String(responsibilityDial));
      el.dataset.responsibilityDial = String(responsibilityDial);
      const dial = el.querySelector('.seat-stack__dial');
      if (dial) dial.style.setProperty('--dial', String(responsibilityDial));
    }
  });
  stack.dataset.activeLayer = activeLayer || '';
  stack.dataset.connectionHealth = connectionHealth;
  stack.dataset.authState = authorizationState;
  stack.dataset.authScope = authorizationScope;
  stack.dataset.approvalRequired = String(approvalRequired);
  stack.dataset.entitlement = entitlementState;
  stack.style.setProperty('--equipped-count', String(equipped.size));
  stack.style.setProperty('--responsibility-dial', String(responsibilityDial));
}

function inspect(layer) {
  activeLayer = activeLayer === layer.id ? null : layer.id;
  setVisualState();
  if (activeLayer) document.querySelector(`[data-camera="${layer.camera}"]`)?.click();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-inspection', {
    detail: {
      layer: activeLayer,
      camera: activeLayer ? layer.camera : null,
      semanticCamera: activeLayer ? layer.semanticCamera : null,
      connectionHealth,
      responsibilityDial,
      authorizationState,
      authorizationScope,
      approvalRequired,
      entitlementState,
      presentationOnly: true
    }
  }));
}

LAYERS.forEach((layer, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'seat-stack__module';
  button.dataset.seatLayer = layer.id;
  button.dataset.semanticCamera = layer.semanticCamera;
  button.style.setProperty('--stack-depth', String(index));
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `${layer.label}: inspect ${layer.semanticCamera}`);
  const dialHtml = layer.dial
    ? '<span class="seat-stack__dial" aria-hidden="true"><span class="seat-stack__dial-fill"></span></span>'
    : '<span class="seat-stack__gear" aria-hidden="true"></span>';
  button.innerHTML = `
    ${dialHtml}
    <span class="seat-stack__copy"><b>${layer.label}</b><small>${layer.sub}</small></span>
    <span class="seat-stack__state" aria-hidden="true">·</span>
  `;
  button.addEventListener('click', () => inspect(layer));
  stack.appendChild(button);
});

const note = document.createElement('p');
note.className = 'seat-stack__note';
note.textContent = 'Connect through the external app’s supported account/integration flow. No file upload is required. Health and authorization badges are presentation previews only.';
stack.appendChild(note);

const distinction = document.createElement('p');
distinction.className = 'seat-stack__distinction';
distinction.innerHTML = '<b>Capability ≠ Authorization</b><span>Availability is inspected separately from allowed scope. Identity, responsibility, connection health, and authorization labels are presentation only — not durable authority and not an action that grants permission.</span>';
stack.appendChild(distinction);

const handoff = document.createElement('button');
handoff.type = 'button';
handoff.className = 'seat-stack__handoff';
handoff.textContent = 'Configure Seat → normal UI';
handoff.addEventListener('click', () => {
  const layer = LAYERS.find((item) => item.id === activeLayer);
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', {
    detail: {
      targetSection: layer?.handoff || 'connection',
      seatContext: 'current',
      presentationOnly: true,
      normalUi: true,
      semanticCamera: 'APP_UI_HANDOFF'
    }
  }));
});
stack.appendChild(handoff);

function setEquipped(id, value = true) {
  const layer = LAYERS.find((item) => item.id === id);
  if (!layer) return false;
  if (value) equipped.add(id); else equipped.delete(id);
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-equipment-preview', {
    detail: { layer: id, equipped: value, semanticCamera: layer.semanticCamera, presentationOnly: true }
  }));
  return equipped.has(id);
}

function setConnectionHealth(next = 'unknown') {
  const key = Object.prototype.hasOwnProperty.call(HEALTH, next) ? next : 'unknown';
  connectionHealth = key;
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-connection-health', {
    detail: { health: connectionHealth, presentationOnly: true, durable: false }
  }));
  return connectionHealth;
}

function setResponsibilityDial(value = 0.35) {
  const n = Number(value);
  responsibilityDial = Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.35;
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-responsibility-dial', {
    detail: { dial: responsibilityDial, presentationOnly: true, durable: false }
  }));
  return responsibilityDial;
}

function setAuthorizationPresentation(next = {}) {
  if (next.state && Object.prototype.hasOwnProperty.call(AUTH_STATES, next.state)) {
    authorizationState = next.state;
  }
  if (typeof next.scope === 'string' && next.scope.trim()) {
    authorizationScope = next.scope.trim().slice(0, 48);
  }
  if (typeof next.approvalRequired === 'boolean') {
    approvalRequired = next.approvalRequired;
  }
  if (next.entitlement && Object.prototype.hasOwnProperty.call(ENTITLEMENT_STATES, next.entitlement)) {
    entitlementState = next.entitlement;
  }
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-authorization-preview', {
    detail: {
      state: authorizationState,
      scope: authorizationScope,
      approvalRequired,
      entitlement: entitlementState,
      reason: authorizationReason(),
      presentationOnly: true,
      durable: false,
      grantsPermission: false
    }
  }));
  return {
    state: authorizationState,
    scope: authorizationScope,
    approvalRequired,
    entitlement: entitlementState
  };
}

window.TeamAiHeroSeatStack = {
  layers: () => LAYERS.map((layer) => ({ ...layer })),
  authStates: () => Object.keys(AUTH_STATES),
  entitlementStates: () => Object.keys(ENTITLEMENT_STATES),
  getActiveLayer: () => activeLayer,
  getEquippedLayers: () => Array.from(equipped),
  getConnectionHealth: () => connectionHealth,
  getResponsibilityDial: () => responsibilityDial,
  getAuthorizationPresentation: () => ({
    state: authorizationState,
    scope: authorizationScope,
    approvalRequired,
    entitlement: entitlementState,
    reason: authorizationReason(),
    presentationOnly: true,
    durable: false
  }),
  inspect: (id) => {
    const layer = LAYERS.find((item) => item.id === id);
    if (layer) inspect(layer);
    return activeLayer;
  },
  setEquipped,
  setConnectionHealth,
  setResponsibilityDial,
  setAuthorizationPresentation,
  setConfiguration: (configuration = {}) => {
    Object.keys(configuration).forEach((id) => setEquipped(id, Boolean(configuration[id])));
    return Array.from(equipped);
  }
};

setVisualState();
