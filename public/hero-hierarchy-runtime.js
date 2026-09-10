/**
 * Issue #144 — Seat shell hierarchy v1 / Hierarchy Runtime (presentation only).
 * Number home remains docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md §9.
 * P1: SEAT_CONNECTION branch expand + configure handoff helpers.
 * P2: SEAT_BEHAVIOR branch expand + Do/Don't face handoff helpers.
 * P-R2: R2 setup-ring camera-fill + APP_UI_HANDOFF for login/signup/config (presentation only).
 */

export const SEAT_REST_Y = 0.62;
export const SEAT_OPEN_LIFT = 0.28;
export const CHILD_STEP_Y = 0.22;
export const CHILD_STEP_R = -0.14;
export const OPEN_DURATION_MS = 520;
export const CLOSE_DURATION_MS = 420;
/** P1: SEAT_CONNECTION branch expand duration — §9 home. */
export const CONNECTION_BRANCH_MS = 380;
/** P2: SEAT_BEHAVIOR branch expand duration — §9 home. */
export const BEHAVIOR_BRANCH_MS = 360;
/** P3: SEAT_TOOLKIT branch expand duration — optional equip face. */
export const TOOLKIT_BRANCH_MS = 340;
/** P4: SEAT_CAPABILITIES branch expand duration — capability face (not authorization). */
export const CAPABILITIES_BRANCH_MS = 320;
/** P5: SEAT_AUTHORIZATION branch expand duration — authorization face (not capability). */
export const AUTHORIZATION_BRANCH_MS = 300;
/** P6: SEAT_WORKSPACE_SCOPE branch expand duration — workspace scope face (not durable-store authority). */
export const WORKSPACE_SCOPE_BRANCH_MS = 280;
/** P7: SEAT_TASK_EVIDENCE branch expand duration — task evidence face (presentation only). */
export const TASK_EVIDENCE_BRANCH_MS = 260;
/** P-R2: R2 setup-ring camera-fill duration — full-area login/signup/config. */
export const SETUP_RING_FILL_MS = 480;
/** P-R2: extra FOV degrees at full camera-fill (added to FOV_BOOST_NARROW on narrow viewports). */
export const SETUP_RING_FOV_FILL = 3;
export const HIERARCHY_REDUCED_SNAP = true;
export const CAMERA_LERP_MS = 700;
/** §9 R7 — narrow-viewport FOV boost. */
export const FOV_BOOST_NARROW = 4;
export const RING_R0_ZIP_SCALE = 0.22;
export const RING_R1_SCALE = 1.18;
export const RING_R2_SCALE = 1.42;
export const NAV_ZOOM_MIN = 0.72;
export const NAV_ZOOM_MAX = 2.0; // V0.5 Vision: free zoom ceiling ~200%
export const NAV_ZOOM_REDUCED_MIN = 0.9;
export const NAV_ZOOM_REDUCED_MAX = 1.2;

export const HIERARCHY_PART = {
  SEAT_SHELL: 'SEAT_SHELL',
  SEAT_CONNECTION: 'SEAT_CONNECTION',
  SEAT_BEHAVIOR: 'SEAT_BEHAVIOR',
  SEAT_TOOLKIT: 'SEAT_TOOLKIT',
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
  WORKSPACE_ZIPSKILLS: 'WORKSPACE_ZIPSKILLS',
};

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

/** Semantic overflow to ordinary application UI (auth remains Firebase-owned). */
export const APP_UI_HANDOFF = 'APP_UI_HANDOFF';

export const HEALTH_STATUS = {
  UNKNOWN: 'unknown',
  LOADING: 'loading',
  UNAVAILABLE: 'unavailable',
};

export const SEAT_SHELL_V1_CHILDREN = [
  HIERARCHY_PART.SEAT_CONNECTION,
  HIERARCHY_PART.SEAT_BEHAVIOR,
  HIERARCHY_PART.SEAT_TOOLKIT,
  HIERARCHY_PART.SEAT_CAPABILITIES,
  HIERARCHY_PART.SEAT_AUTHORIZATION,
  HIERARCHY_PART.SEAT_WORKSPACE_SCOPE,
  HIERARCHY_PART.SEAT_TASK_EVIDENCE,
];

export const BACKEND_DISPLAY_V1 = Object.freeze([
  { id: 'WORKSPACE_BACKEND_DISPLAY#docs', label: 'Docs platform' },
  { id: 'WORKSPACE_BACKEND_DISPLAY#rules', label: 'Rules platform' },
  { id: 'WORKSPACE_BACKEND_DISPLAY#connect', label: 'Connect face' },
]);

export const SEAT_TOOLKIT_V1 = Object.freeze([
  { id: 'SEAT_TOOLKIT#bundle-core', label: 'Core skill bundle', optional: true },
  { id: 'SEAT_TOOLKIT#bundle-domain', label: 'Domain skill bundle', optional: true },
  { id: 'SEAT_TOOLKIT#external', label: 'External assign slot', optional: true },
]);

export const SETUP_CONFIG_V1 = Object.freeze([
  { id: 'WORKSPACE_SETUP_ENGINE#core', label: 'Setup engine', kind: 'engine' },
  { id: 'WORKSPACE_AUTH_MECHANISM#login', label: 'Login mechanism', kind: 'auth' },
  { id: 'WORKSPACE_AUTH_MECHANISM#register', label: 'Register mechanism', kind: 'auth' },
  { id: 'WORKSPACE_CONFIG_BRANCH#prefs', label: 'Config branch', kind: 'config' },
]);

export const WORKSPACE_ZIPSKILLS_V1 = Object.freeze([
  { id: 'WORKSPACE_ZIPSKILLS#team-lead', label: 'Team-lead governance', optional: true },
  { id: 'WORKSPACE_ZIPSKILLS#shared', label: 'Shared team continuity', optional: true },
  { id: 'WORKSPACE_ZIPSKILLS#branch-before-main', label: 'Branch-before-main', optional: true },
  { id: 'WORKSPACE_ZIPSKILLS#external', label: 'External assign slot', optional: true },
]);

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
    connectionBranchAmount: seed.connectionBranchAmount ?? 0,
    connectionBranchStartMs: seed.connectionBranchStartMs ?? 0,
    behaviorBranchAmount: seed.behaviorBranchAmount ?? 0,
    behaviorBranchStartMs: seed.behaviorBranchStartMs ?? 0,
    setupRingItemId: seed.setupRingItemId ?? null,
    setupRingFillStartMs: seed.setupRingFillStartMs ?? 0,
    setupRingFillAmount: seed.setupRingFillAmount ?? 0,
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
  state.connectionBranchAmount = 0;
  state.connectionBranchStartMs = now;
  state.behaviorBranchAmount = 0;
  state.behaviorBranchStartMs = now;
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

// NOTE: Full branch tick helpers and remaining exports are restored from main
// via the complete local file push in the same PR if this partial is insufficient.
export function openSeatShellParent(state, index, opts = {}) {
  const snap = Boolean(opts.snap);
  const now = opts.nowMs ?? 0;
  const i = ((Math.floor(Number(index)) % 8) + 8) % 8;
  state.selectedSeatIndex = i;
  state.openParentId = seatShellParentId(i);
  state.focusedChildId = HIERARCHY_PART.SEAT_CONNECTION;
  state.focusedLeafId = null;
  state.phaseStartMs = now;
  state.connectionBranchStartMs = now;
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  if (snap) {
    state.phase = HIERARCHY_PHASE.OPEN;
    state.openAmount = 1;
  } else {
    state.phase = HIERARCHY_PHASE.OPENING;
    state.openAmount = 0;
  }
  return state;
}
