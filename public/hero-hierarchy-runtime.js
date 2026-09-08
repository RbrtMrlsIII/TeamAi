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

/** v1 visible children in Product Law order (Toolkit/ZipSkills deferred). */
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

/** Create HierarchyRuntimeState. Presentation only — never entitlement. */
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
  };
}

export function syncHierarchyRuntime(state, globals) {
  state.selectedSeatIndex = globals.selectedSeatIndex;
  state.cameraId = globals.cameraId;
  state.motionMode = globals.reducedMotion ? 'reduced' : 'full';
  if (globals.demo) state.inputMode = HIERARCHY_INPUT.DEMO;
  else if (state.phase === HIERARCHY_PHASE.REST) state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  else state.inputMode = HIERARCHY_INPUT.INSPECT;
  return state;
}

export function closeHierarchyParent(state, opts = {}) {
  const snap = Boolean(opts.snap);
  const now = opts.nowMs ?? 0;
  if (snap || !state.openParentId) {
    state.openParentId = null;
    state.focusedChildId = null;
    state.focusedLeafId = null;
    state.phase = HIERARCHY_PHASE.REST;
    state.openAmount = 0;
    state.phaseStartMs = now;
    return state;
  }
  state.phase = HIERARCHY_PHASE.CLOSING;
  state.phaseStartMs = now;
  state.focusedLeafId = null;
  return state;
}

export function tickHierarchyPose(state, nowMs, reducedMotion) {
  const snap = HIERARCHY_REDUCED_SNAP && reducedMotion;
  if (state.phase === HIERARCHY_PHASE.OPENING) {
    if (snap) {
      state.openAmount = 1;
      state.phase = HIERARCHY_PHASE.OPEN;
      return state;
    }
    const t = Math.max(0, Math.min(1, (nowMs - state.phaseStartMs) / OPEN_DURATION_MS));
    state.openAmount = t * t * (3 - 2 * t);
    if (t >= 1) {
      state.openAmount = 1;
      state.phase = HIERARCHY_PHASE.OPEN;
    }
  } else if (state.phase === HIERARCHY_PHASE.CLOSING) {
    if (snap) {
      state.openAmount = 0;
      state.openParentId = null;
      state.focusedChildId = null;
      state.focusedLeafId = null;
      state.phase = HIERARCHY_PHASE.REST;
      return state;
    }
    const t = Math.max(0, Math.min(1, (nowMs - state.phaseStartMs) / CLOSE_DURATION_MS));
    const e = t * t * (3 - 2 * t);
    state.openAmount = 1 - e;
    if (t >= 1) {
      state.openAmount = 0;
      state.openParentId = null;
      state.focusedChildId = null;
      state.focusedLeafId = null;
      state.phase = HIERARCHY_PHASE.REST;
    }
  } else if (state.phase === HIERARCHY_PHASE.OPEN) {
    state.openAmount = 1;
  } else if (state.phase === HIERARCHY_PHASE.REST) {
    state.openAmount = 0;
  }
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
  if (snap) {
    state.phase = HIERARCHY_PHASE.OPEN;
    state.openAmount = 1;
  } else {
    state.phase = HIERARCHY_PHASE.OPENING;
    state.openAmount = 0;
  }
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  return state;
}

export function seatOpenY() {
  return SEAT_REST_Y + SEAT_OPEN_LIFT;
}

export function seatAltitudeY(openAmount) {
  const a = Math.max(0, Math.min(1, Number(openAmount) || 0));
  return SEAT_REST_Y + SEAT_OPEN_LIFT * a;
}

/** Child stack offsets inside an open Seat shell (baseline §9). */
export function childStackOffset(index, openAmount = 1) {
  const i = Math.max(0, Math.floor(Number(index) || 0));
  const a = Math.max(0, Math.min(1, Number(openAmount) || 0));
  return {
    dy: CHILD_STEP_Y * i * a,
    dr: CHILD_STEP_R * i * a,
    scale: 0.42 + 0.08 * (1 - Math.min(i, 4) / 4),
  };
}

export function childLocalPosition(seatAngle, seatRadius, index, openAmount = 1) {
  const off = childStackOffset(index, openAmount);
  const r = seatRadius + off.dr;
  return {
    x: Math.cos(seatAngle) * r,
    y: off.dy,
    z: Math.sin(seatAngle) * r,
    scale: off.scale,
    childId: SEAT_SHELL_V1_CHILDREN[index] || null,
  };
}

export function focusChild(state, childId) {
  if (!state.openParentId) return state;
  if (!SEAT_SHELL_V1_CHILDREN.includes(childId)) return state;
  state.focusedChildId = childId;
  state.focusedLeafId = null;
  return state;
}

export function getHierarchySnapshot(state) {
  return Object.assign({}, state);
}
