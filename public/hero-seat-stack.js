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

/** Workspace / task / evidence presentation. Not durable system of record. */
const TASK_STATES = Object.freeze({
  idle: { label: 'IDL', title: 'Idle — no active workspace task (preview)' },
  queued: { label: 'QUE', title: 'Queued — waiting for eligible execution (preview)' },
  running: { label: 'RUN', title: 'Running — execution in progress (preview)' },
  blocked: { label: 'BLK', title: 'Blocked — cannot proceed until a reason is cleared (preview)' },
  complete: { label: 'DONE', title: 'Complete — result available for inspection (preview)' },
  failed: { label: 'FAIL', title: 'Failed — result/evidence records a failure (preview)' }
});

const RESULT_STATES = Object.freeze({
  none: { label: 'NONE', title: 'No result/artifact attached (preview)' },
  attached: { label: 'ART', title: 'Result/artifact attached to workspace (preview)' },
  stale: { label: 'STL', title: 'Attached result is stale versus current task (preview)' }
});

const EVIDENCE_STATES = Object.freeze({
  none: { label: 'NONE', title: 'No verification/evidence yet (preview)' },
  pending: { label: 'PEND', title: 'Verification pending (preview)' },
  recorded: { label: 'EVD', title: 'Evidence recorded — inspect in normal UI (preview)' },
  disputed: { label: 'DSP', title: 'Evidence disputed — reason-bearing, not color-only (preview)' }
});

const LAYERS = [
  { id: 'identity', label: 'Identity', sub: 'Web AI Seat label / role (presentation)', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_IDENTITY', handoff: 'identity' },
  { id: 'responsibility', label: 'Responsibility', sub: 'duty dial (presentation, not authority)', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_RESPONSIBILITY', handoff: 'responsibility', dial: true },
  { id: 'connection', label: 'Connection', sub: 'external app account / integration', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_CONNECTION', handoff: 'connection', health: true },
  { id: 'behavior', label: 'Behavior', sub: 'Do / Don’t', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_BEHAVIOR', handoff: 'behavior' },
  { id: 'toolkit', label: 'Built-in Toolkit', sub: 'included skills (optional seat-scoped)', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_SKILLS', handoff: 'skills' },
  /** ZipSkills: interim stack label; canonical home is workspace tree (WORKSPACE_ZIPSKILLS). Optional; not required. Legacy semantic id kept for e2e. */
  { id: 'zipskills', label: 'ZipSkills', sub: 'optional workspace equip (not seat authority)', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_ZIPSKILLS', canonicalSemanticCamera: 'WORKSPACE_ZIPSKILLS', handoff: 'zipskills', optional: true, workspaceScoped: true },
  { id: 'capabilities', label: 'Capabilities', sub: 'tools / MCP availability', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_CAPABILITY', handoff: 'capabilities' },
  { id: 'authorization', label: 'Authorization', sub: 'scope / approvals (reason-bearing preview)', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_AUTHORIZATION', handoff: 'authorization', auth: true },
  { id: 'workspace', label: 'Workspace', sub: 'shared ref / history (preview, not Firestore)', camera: 'WORKSPACE_CLOSE', semanticCamera: 'MECHANISM_WORKSPACE', handoff: 'workspace', workspace: true },
  { id: 'task', label: 'Task / Evidence', sub: 'state / result / provenance / verification (preview)', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_TASK', handoff: 'task-evidence', task: true }
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
let workspaceRef = 'shared-workspace';
let historyCount = 0;
let handoffReady = false;
let taskState = 'idle';
let resultState = 'none';
let evidenceState = 'none';
let provenanceLabel = 'no-trace';

function authorizationReason() {
  const auth = AUTH_STATES[authorizationState] || AUTH_STATES.unavailable;
  const ent = ENTITLEMENT_STATES[entitlementState] || ENTITLEMENT_STATES.none;
  const approval = approvalRequired ? 'approval required' : 'no extra approval shown';
  return `${auth.title} · scope=${authorizationScope} · ${ent.title} · ${approval}`;
}

function workspaceReason() {
  const ready = handoffReady ? 'handoff ready' : 'handoff not ready';
  return `Workspace ref=${workspaceRef} · history=${historyCount} · ${ready} (presentation, not durable)`;
}

function taskReason() {
  const task = TASK_STATES[taskState] || TASK_STATES.idle;
  const result = RESULT_STATES[resultState] || RESULT_STATES.none;
  const evidence = EVIDENCE_STATES[evidenceState] || EVIDENCE_STATES.none;
  return `${task.title} · result=${result.title} · evidence=${evidence.title} · rail=${provenanceLabel}`;
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
    } else if (id === 'workspace' && state) {
      state.textContent = handoffReady ? 'RDY' : 'WS';
      state.title = workspaceReason();
      el.dataset.workspaceRef = workspaceRef;
      el.dataset.historyCount = String(historyCount);
      el.dataset.handoffReady = String(handoffReady);
      el.setAttribute('data-workspace-ready', String(handoffReady));
      el.setAttribute('aria-label', `Workspace: ${workspaceReason()}`);
    } else if (id === 'task' && state) {
      const task = TASK_STATES[taskState] || TASK_STATES.idle;
      state.textContent = task.label;
      state.title = taskReason();
      el.dataset.taskState = taskState;
      el.dataset.resultState = resultState;
      el.dataset.evidenceState = evidenceState;
      el.dataset.provenance = provenanceLabel;
      el.setAttribute('data-task-state', taskState);
      el.setAttribute('data-result-state', resultState);
      el.setAttribute('data-evidence-state', evidenceState);
      el.setAttribute('aria-label', `Task / Evidence: ${taskReason()}`);
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
  stack.dataset.workspaceRef = workspaceRef;
  stack.dataset.historyCount = String(historyCount);
  stack.dataset.handoffReady = String(handoffReady);
  stack.dataset.taskState = taskState;
  stack.dataset.resultState = resultState;
  stack.dataset.evidenceState = evidenceState;
  stack.dataset.provenance = provenanceLabel;
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
      canonicalSemanticCamera: activeLayer ? (layer.canonicalSemanticCamera || layer.semanticCamera) : null,
      connectionHealth,
      responsibilityDial,
      authorizationState,
      authorizationScope,
      approvalRequired,
      entitlementState,
      workspaceRef,
      historyCount,
      handoffReady,
      taskState,
      resultState,
      evidenceState,
      provenanceLabel,
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
  if (layer.canonicalSemanticCamera) button.dataset.canonicalSemanticCamera = layer.canonicalSemanticCamera;
  if (layer.optional) button.dataset.optional = 'true';
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
note.textContent = 'Connect through the external app’s supported account/integration flow. No file upload is required. Health, authorization, workspace, and task/evidence badges are presentation previews only. ZipSkills is optional workspace equip — not a required setup.';
stack.appendChild(note);

const distinction = document.createElement('p');
distinction.className = 'seat-stack__distinction';
distinction.innerHTML = '<b>Capability ≠ Authorization · Workspace ≠ Firestore</b><span>Availability is inspected separately from allowed scope. The shared Web AI workspace is not TeamAi, not the scheduler, and not durable authority. Identity, responsibility, connection health, authorization, task, result, provenance, and evidence labels are presentation only — they do not invent or persist records and do not grant permission.</span>';
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
    detail: {
      layer: id,
      equipped: value,
      semanticCamera: layer.semanticCamera,
      canonicalSemanticCamera: layer.canonicalSemanticCamera || layer.semanticCamera,
      presentationOnly: true
    }
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

function setWorkspaceTaskPresentation(next = {}) {
  if (typeof next.workspaceRef === 'string' && next.workspaceRef.trim()) {
    workspaceRef = next.workspaceRef.trim().slice(0, 48);
  }
  if (Number.isFinite(Number(next.historyCount))) {
    historyCount = Math.max(0, Math.min(999, Math.floor(Number(next.historyCount))));
  }
  if (typeof next.handoffReady === 'boolean') {
    handoffReady = next.handoffReady;
  }
  if (next.taskState && Object.prototype.hasOwnProperty.call(TASK_STATES, next.taskState)) {
    taskState = next.taskState;
  }
  if (next.resultState && Object.prototype.hasOwnProperty.call(RESULT_STATES, next.resultState)) {
    resultState = next.resultState;
  }
  if (next.evidenceState && Object.prototype.hasOwnProperty.call(EVIDENCE_STATES, next.evidenceState)) {
    evidenceState = next.evidenceState;
  }
  if (typeof next.provenance === 'string' && next.provenance.trim()) {
    provenanceLabel = next.provenance.trim().slice(0, 48);
  }
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-workspace-task-preview', {
    detail: {
      workspaceRef,
      historyCount,
      handoffReady,
      taskState,
      resultState,
      evidenceState,
      provenance: provenanceLabel,
      reason: `${workspaceReason()} · ${taskReason()}`,
      presentationOnly: true,
      durable: false,
      systemOfRecord: false
    }
  }));
  return getWorkspaceTaskPresentation();
}

function getWorkspaceTaskPresentation() {
  return {
    workspaceRef,
    historyCount,
    handoffReady,
    taskState,
    resultState,
    evidenceState,
    provenance: provenanceLabel,
    reason: `${workspaceReason()} · ${taskReason()}`,
    presentationOnly: true,
    durable: false
  };
}

window.TeamAiHeroSeatStack = {
  layers: () => LAYERS.map((layer) => ({ ...layer })),
  authStates: () => Object.keys(AUTH_STATES),
  entitlementStates: () => Object.keys(ENTITLEMENT_STATES),
  taskStates: () => Object.keys(TASK_STATES),
  resultStates: () => Object.keys(RESULT_STATES),
  evidenceStates: () => Object.keys(EVIDENCE_STATES),
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
  getWorkspaceTaskPresentation,
  inspect: (id) => {
    const layer = LAYERS.find((item) => item.id === id);
    if (layer) inspect(layer);
    return activeLayer;
  },
  setEquipped,
  setConnectionHealth,
  setResponsibilityDial,
  setAuthorizationPresentation,
  setWorkspaceTaskPresentation,
  setConfiguration: (configuration = {}) => {
    Object.keys(configuration).forEach((id) => setEquipped(id, Boolean(configuration[id])));
    return Array.from(equipped);
  }
};

setVisualState();
