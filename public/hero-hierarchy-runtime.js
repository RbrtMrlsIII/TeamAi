/**
 * Issue #144 — Seat shell hierarchy v1 / Hierarchy Runtime (presentation only).
 * Number home remains docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md §9.
 */

/** Living numbers from baseline §9 — amend §9 + code together if learned. */
export const SEAT_REST_Y = 0.62;
export const SEAT_OPEN_LIFT = 0.28;
export const CHILD_STEP_Y = 0.22;
export const CHILD_STEP_R = -0.14;
export const OPEN_DURATION_MS = 520;
export const CLOSE_DURATION_MS = 420;
export const HIERARCHY_REDUCED_SNAP = true;
export const CAMERA_LERP_MS = 700;

export const HIERARCHY_PART = {
  SEAT_SHELL: 'SEAT_SHELL',
  SEAT_CONNECTION: 'SEAT_CONNECTION',
  SEAT_BEHAVIOR: 'SEAT_BEHAVIOR',
  SEAT_CAPABILITIES: 'SEAT_CAPABILITIES',
  SEAT_AUTHORIZATION: 'SEAT_AUTHORIZATION',
  SEAT_WORKSPACE_SCOPE: 'SEAT_WORKSPACE_SCOPE',
  SEAT_TASK_EVIDENCE: 'SEAT_TASK_EVIDENCE',
  SEAT_CONNECTION_HEALTH_FACE: 'SEAT_CONNECTION_HEALTH_FACE',
  WORKSPACE_BACKEND_DISPLAY: 'WORKSPACE_BACKEND_DISPLAY',
  WORKSPACE_BACKEND_THREAD: 'WORKSPACE_BACKEND_THREAD',
  WORKSPACE_SETUP_ENGINE: 'WORKSPACE_SETUP_ENGINE',
  WORKSPACE_AUTH_MECHANISM: 'WORKSPACE_AUTH_MECHANISM',
  WORKSPACE_CONFIG_BRANCH: 'WORKSPACE_CONFIG_BRANCH',
};

export const BACKEND_DISPLAY_V1 = Object.freeze([
  { id: 'WORKSPACE_BACKEND_DISPLAY#docs', label: 'Docs platform' },
  { id: 'WORKSPACE_BACKEND_DISPLAY#rules', label: 'Rules platform' },
  { id: 'WORKSPACE_BACKEND_DISPLAY#connect', label: 'Connect face' },
]);

export const SETUP_CONFIG_V1 = Object.freeze([
  { id: 'WORKSPACE_SETUP_ENGINE#core', label: 'Setup engine', kind: 'engine' },
  { id: 'WORKSPACE_AUTH_MECHANISM#login', label: 'Login mechanism', kind: 'auth' },
  { id: 'WORKSPACE_AUTH_MECHANISM#register', label: 'Register mechanism', kind: 'auth' },
  { id: 'WORKSPACE_CONFIG_BRANCH#primary', label: 'Config branch', kind: 'branch' },
]);

export const HIERARCHY_PHASE = {
  REST: 'rest',
  OPENING: 'opening',
  OPEN: 'open',
  CLOSING: 'closing',
};

export const HIERARCHY_INPUT = {
  NAVIGATE: 'NAVIGATE',
  INSPECT: 'INSPECT',
  DEMO: 'DEMO',
};

export const HEALTH_STATUS = {
  UNKNOWN: 'unknown',
  LOADING: 'loading',
  UNAVAILABLE: 'unavailable',
};

export const SEAT_SHELL_V1_CHILDREN = [
  HIERARCHY_PART.SEAT_CONNECTION,
  HIERARCHY_PART.SEAT_BEHAVIOR,
  HIERARCHY_PART.SEAT_CAPABILITIES,
  HIERARCHY_PART.SEAT_AUTHORIZATION,
  HIERARCHY_PART.SEAT_WORKSPACE_SCOPE,
  HIERARCHY_PART.SEAT_TASK_EVIDENCE,
];

export function seatShellParentId(index) {
  return HIERARCHY_PART.SEAT_SHELL + '#' + index;
}

export function createHierarchyRuntime(seed = {}) {
  return {
    openParentId: seed.openParentId ?? null,
    focusedChildId: seed.focusedChildId ?? null,
    focusedLeafId: seed.focusedLeafId ?? null,
    phase: seed.phase ?? HIERARCHY_PHASE.REST,
    openAmount: seed.openAmount ?? 0,
    phaseStartMs: seed.phaseStartMs ?? 0,
    selectedSeatIndex: seed.selectedSeatIndex ?? 0,
    motionMode: seed.motionMode ?? 'full',
    cameraId: seed.cameraId ?? 'HERO_WIDE',
    inputMode: seed.inputMode ?? HIERARCHY_INPUT.NAVIGATE,
    healthStatus: seed.healthStatus ?? HEALTH_STATUS.UNKNOWN,
    presentationOnly: true,
    durable: false,
  };
}

export function syncHierarchyRuntime(state, globals = {}) {
  if (globals.selectedSeatIndex != null) state.selectedSeatIndex = globals.selectedSeatIndex;
  if (globals.cameraId != null) state.cameraId = globals.cameraId;
  if (globals.reducedMotion != null) state.motionMode = globals.reducedMotion ? 'reduced' : 'full';
  if (globals.demo != null && globals.demo) state.inputMode = HIERARCHY_INPUT.DEMO;
  return state;
}

export function closeHierarchyParent(state, opts = {}) {
  const snap = Boolean(opts.snap);
  const now = opts.nowMs ?? 0;
  state.focusedLeafId = null;
  state.focusedChildId = null;
  state.phaseStartMs = now;
  if (snap) {
    state.phase = HIERARCHY_PHASE.REST;
    state.openAmount = 0;
    state.openParentId = null;
    state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  } else {
    state.phase = HIERARCHY_PHASE.CLOSING;
  }
  return state;
}

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

export function tickHierarchyPose(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (state.phase === HIERARCHY_PHASE.OPENING) {
    if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
      state.openAmount = 1;
      state.phase = HIERARCHY_PHASE.OPEN;
    } else {
      const progress = Math.min((now - state.phaseStartMs) / OPEN_DURATION_MS, 1);
      state.openAmount = smoothstep(progress);
      if (progress >= 1) state.phase = HIERARCHY_PHASE.OPEN;
    }
  } else if (state.phase === HIERARCHY_PHASE.CLOSING) {
    if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
      state.openAmount = 0;
      state.phase = HIERARCHY_PHASE.REST;
      state.openParentId = null;
      state.inputMode = HIERARCHY_INPUT.NAVIGATE;
    } else {
      const progress = Math.min((now - state.phaseStartMs) / CLOSE_DURATION_MS, 1);
      state.openAmount = 1 - smoothstep(progress);
      if (progress >= 1) {
        state.openAmount = 0;
        state.phase = HIERARCHY_PHASE.REST;
        state.openParentId = null;
        state.inputMode = HIERARCHY_INPUT.NAVIGATE;
      }
    }
  } else if (state.phase === HIERARCHY_PHASE.OPEN) state.openAmount = 1;
  else if (state.phase === HIERARCHY_PHASE.REST) state.openAmount = 0;
  return state;
}

export function openSeatShellParent(state, seatIndex, opts = {}) {
  const index = Math.max(0, Math.floor(Number(seatIndex) || 0));
  const snap = Boolean(opts.snap);
  const now = opts.nowMs ?? 0;
  state.openParentId = seatShellParentId(index);
  state.selectedSeatIndex = index;
  state.focusedChildId = HIERARCHY_PART.SEAT_CONNECTION;
  state.focusedLeafId = null;
  state.phaseStartMs = now;
  if (snap) { state.phase = HIERARCHY_PHASE.OPEN; state.openAmount = 1; }
  else { state.phase = HIERARCHY_PHASE.OPENING; state.openAmount = 0; }
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  return state;
}

export function seatOpenY() { return SEAT_REST_Y + SEAT_OPEN_LIFT; }
export function seatAltitudeY(openAmount) {
  const a = Math.max(0, Math.min(1, Number(openAmount) || 0));
  return SEAT_REST_Y + SEAT_OPEN_LIFT * a;
}

export function childStackOffset(index, openAmount = 1) {
  const i = Math.max(0, Math.floor(Number(index) || 0));
  const a = Math.max(0, Math.min(1, Number(openAmount) || 0));
  return { dy: CHILD_STEP_Y * i * a, dr: CHILD_STEP_R * i * a, scale: 0.42 + 0.08 * (1 - Math.min(i, 4) / 4) };
}

export function childLocalPosition(seatAngle, seatRadius, index, openAmount = 1) {
  const off = childStackOffset(index, openAmount);
  const r = seatRadius + off.dr;
  return { x: Math.cos(seatAngle) * r, y: off.dy, z: Math.sin(seatAngle) * r, scale: off.scale, childId: SEAT_SHELL_V1_CHILDREN[index] || null };
}

export function focusChild(state, childId) {
  if (!state.openParentId) return state;
  if (!SEAT_SHELL_V1_CHILDREN.includes(childId)) return state;
  state.focusedChildId = childId;
  state.focusedLeafId = null;
  return state;
}

export function focusLeaf(state, leafId) {
  if (!state.openParentId) return state;
  if (leafId !== HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE) return state;
  state.focusedChildId = HIERARCHY_PART.SEAT_CONNECTION;
  state.focusedLeafId = leafId;
  return state;
}

export function clearLeafFocus(state) {
  state.focusedLeafId = null;
  return state;
}

export function healthLeafAccessibleName(status = HEALTH_STATUS.UNKNOWN) {
  const s = status || HEALTH_STATUS.UNKNOWN;
  return `Seat connection health: ${s}. Presentation only; not authorization.`;
}

export function getHierarchySnapshot(state) {
  return Object.assign({}, state);
}

/** R1/R2 ring focus (presentation only — not auth / not seat hierarchy). */
export function createRingFocusState() {
  return { ring: null, index: 0 };
}

export function ringCatalog(ring) {
  if (ring === 'r1') return BACKEND_DISPLAY_V1;
  if (ring === 'r2') return SETUP_CONFIG_V1;
  return [];
}

export function focusRingItem(ringFocus, ring, index) {
  const catalog = ringCatalog(ring);
  if (!catalog.length) return ringFocus;
  const i = ((Math.floor(Number(index)) % catalog.length) + catalog.length) % catalog.length;
  ringFocus.ring = ring;
  ringFocus.index = i;
  return ringFocus;
}

export function cycleRingFocus(ringFocus, ring, delta = 1) {
  const catalog = ringCatalog(ring);
  if (!catalog.length) return ringFocus;
  if (ringFocus.ring !== ring) {
    ringFocus.ring = ring;
    ringFocus.index = 0;
    return ringFocus;
  }
  const n = catalog.length;
  ringFocus.index = ((ringFocus.index + delta) % n + n) % n;
  return ringFocus;
}

export function clearRingFocus(ringFocus) {
  ringFocus.ring = null;
  ringFocus.index = 0;
  return ringFocus;
}

export function ringFocusAccessibleName(ringFocus) {
  if (!ringFocus || !ringFocus.ring) return 'No workspace ring face focused. Presentation only.';
  const catalog = ringCatalog(ringFocus.ring);
  const item = catalog[ringFocus.index];
  if (!item) return 'Workspace ring face. Presentation only.';
  const ringLabel = ringFocus.ring === 'r1' ? 'Backend display' : 'Setup configuration';
  return `${ringLabel}: ${item.label}. Presentation only; not authorization.`;
}
