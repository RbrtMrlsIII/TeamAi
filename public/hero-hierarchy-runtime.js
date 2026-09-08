/**
 * Issue #144 — Seat shell hierarchy v1 / Hierarchy Runtime R1 (presentation only).
 * Number home remains docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md §9.
 * Open/close pose and child faces land in later ladder steps.
 */

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

/**
 * Create HierarchyRuntimeState. Presentation only — never entitlement.
 */
export function createHierarchyRuntime(seed = {}) {
  return {
    openParentId: seed.openParentId ?? null,
    focusedChildId: seed.focusedChildId ?? null,
    focusedLeafId: seed.focusedLeafId ?? null,
    phase: seed.phase ?? HIERARCHY_PHASE.REST,
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

/** Close any open parent (one-open rule). Pose animation is a later step. */
export function closeHierarchyParent(state) {
  state.openParentId = null;
  state.focusedChildId = null;
  state.focusedLeafId = null;
  state.phase = HIERARCHY_PHASE.REST;
  return state;
}

/**
 * Open one Seat shell parent (v1 one-open). Presentation only — not entitlement.
 * Caller docks camera to SEAT_CLOSE separately (R3).
 */
export function openSeatShellParent(state, seatIndex) {
  const index = Math.max(0, Math.floor(Number(seatIndex) || 0));
  state.openParentId = seatShellParentId(index);
  state.selectedSeatIndex = index;
  state.focusedChildId = HIERARCHY_PART.SEAT_CONNECTION;
  state.focusedLeafId = null;
  state.phase = HIERARCHY_PHASE.OPEN; // pose animation is Step 3; state is open for inspect
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  return state;
}

export function getHierarchySnapshot(state) {
  return Object.assign({}, state);
}
