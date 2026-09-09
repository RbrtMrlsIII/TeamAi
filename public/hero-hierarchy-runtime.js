/**
 * Issue #144 — Seat shell hierarchy v1 / Hierarchy Runtime (presentation only).
 * Number home remains docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md §9.
 * P1: SEAT_CONNECTION branch expand + configure handoff helpers.
 * P2: SEAT_BEHAVIOR branch expand + Do/Don't face handoff helpers.
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
export const HIERARCHY_REDUCED_SNAP = true;
export const CAMERA_LERP_MS = 700;
export const RING_R0_ZIP_SCALE = 0.22;
export const RING_R1_SCALE = 1.18;
export const RING_R2_SCALE = 1.42;
export const NAV_ZOOM_MIN = 0.72;
export const NAV_ZOOM_MAX = 1.55;
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

export function tickConnectionBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_CONNECTION) {
    if ((state.connectionBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_CONNECTION) {
      state.connectionBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.connectionBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.connectionBranchAmount = 0;
    return state;
  }
  const start = state.connectionBranchStartMs ?? now;
  const progress = Math.min((now - start) / CONNECTION_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.connectionBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getConnectionBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.connectionBranchAmount) || 0));
}

export function connectionFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? 'expanded' : 'opening';
  return `Seat connection face (${open}). Presentation only; not live bind. Press C to configure seat in normal UI.`;
}

export function requestConnectionConfigureHandoff(detail = {}) {
  const intent = {
    source: 'p1-seat-connection',
    targetSection: detail.targetSection || 'connection',
    normalUi: true,
    presentationOnly: true,
  };
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', { detail: intent }));
  }
  return intent;
}

export function tickBehaviorBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_BEHAVIOR) {
    if ((state.behaviorBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_BEHAVIOR) {
      state.behaviorBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.behaviorBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.behaviorBranchAmount = 0;
    return state;
  }
  const start = state.behaviorBranchStartMs ?? now;
  const progress = Math.min((now - start) / BEHAVIOR_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.behaviorBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getBehaviorBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.behaviorBranchAmount) || 0));
}

export function behaviorFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? 'expanded' : 'opening';
  return "Seat behavior face (" + open + "). Do/Dont presentation only; not durable policy. Press B for normal UI.";
}

export function requestBehaviorConfigureHandoff(detail = {}) {
  const intent = {
    source: 'p2-seat-behavior',
    targetSection: detail.targetSection || 'behavior',
    normalUi: true,
    presentationOnly: true,
  };
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', { detail: intent }));
  }
  return intent;
}


export function tickToolkitBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_TOOLKIT) {
    if ((state.toolkitBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_TOOLKIT) {
      state.toolkitBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.toolkitBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.toolkitBranchAmount = 0;
    return state;
  }
  const start = state.toolkitBranchStartMs ?? now;
  const progress = Math.min((now - start) / TOOLKIT_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.toolkitBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getToolkitBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.toolkitBranchAmount) || 0));
}

export function toolkitFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat toolkit face (" + open + "). Optional equip only; not required setup; not entitlement. Press T for normal UI.";
}

export function requestToolkitConfigureHandoff(detail = {}) {
  const intent = {
    source: "p3-seat-toolkit",
    targetSection: detail.targetSection || "toolkit",
    normalUi: true,
    presentationOnly: true,
    optional: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}


export function tickCapabilitiesBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_CAPABILITIES) {
    if ((state.capabilitiesBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_CAPABILITIES) {
      state.capabilitiesBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.capabilitiesBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.capabilitiesBranchAmount = 0;
    return state;
  }
  const start = state.capabilitiesBranchStartMs ?? now;
  const progress = Math.min((now - start) / CAPABILITIES_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.capabilitiesBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getCapabilitiesBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.capabilitiesBranchAmount) || 0));
}

export function capabilitiesFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat capabilities face (" + open + "). Capability only; not authorization; not entitlement. Press K for normal UI.";
}

export function requestCapabilitiesConfigureHandoff(detail = {}) {
  const intent = {
    source: "p4-seat-capabilities",
    targetSection: detail.targetSection || "capabilities",
    normalUi: true,
    presentationOnly: true,
    notAuthorization: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}


export function tickAuthorizationBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_AUTHORIZATION) {
    if ((state.authorizationBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_AUTHORIZATION) {
      state.authorizationBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.authorizationBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.authorizationBranchAmount = 0;
    return state;
  }
  const start = state.authorizationBranchStartMs ?? now;
  const progress = Math.min((now - start) / AUTHORIZATION_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.authorizationBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getAuthorizationBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.authorizationBranchAmount) || 0));
}

export function authorizationFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat authorization face (" + open + "). Authorization only; not capability; not entitlement. Press A for normal UI.";
}

export function requestAuthorizationConfigureHandoff(detail = {}) {
  const intent = {
    source: "p5-seat-authorization",
    targetSection: detail.targetSection || "authorization",
    normalUi: true,
    presentationOnly: true,
    notCapability: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
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
  state.connectionBranchStartMs = now;
  if (snap) {
    state.phase = HIERARCHY_PHASE.OPEN;
    state.openAmount = 1;
    state.connectionBranchAmount = 1;
  } else {
    state.phase = HIERARCHY_PHASE.OPENING;
    state.openAmount = 0;
    state.connectionBranchAmount = 0;
  }
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

export function focusChild(state, childId, opts = {}) {
  if (!state.openParentId) return state;
  if (!SEAT_SHELL_V1_CHILDREN.includes(childId)) return state;
  state.focusedChildId = childId;
  state.focusedLeafId = null;
  const now = opts.nowMs ?? 0;
  const snap = Boolean(opts.snap);
  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    state.capabilitiesBranchStartMs = now;
    state.capabilitiesBranchAmount = snap ? 1 : Math.min(state.capabilitiesBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_AUTHORIZATION) {
    state.authorizationBranchStartMs = now;
    state.authorizationBranchAmount = snap ? 1 : Math.min(state.authorizationBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  }
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

export function toolkitChildAccessibleName() {
  return 'Seat toolkit (optional). Not required; external assignment allowed. Presentation only; not entitlement.';
}

export function zipskillsAccessibleName(item) {
  const label = item && item.label ? item.label : 'Workspace ZipSkills';
  return `${label} (optional). Not required; external assignment allowed. Workspace-tree governance continuity only. Presentation only; not entitlement or authority.`;
}

export function healthLeafAccessibleName(status = HEALTH_STATUS.UNKNOWN) {
  const s = status || HEALTH_STATUS.UNKNOWN;
  return `Seat connection health: ${s}. Presentation only; not authorization.`;
}

export function getHierarchySnapshot(state) {
  return Object.assign({}, state);
}

export function createRingFocusState() {
  return { ring: null, index: 0 };
}

export function ringCatalog(ring) {
  if (ring === 'r0') return WORKSPACE_ZIPSKILLS_V1;
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
  const ringLabel = ringFocus.ring === 'r0'
    ? 'Workspace ZipSkills'
    : (ringFocus.ring === 'r1' ? 'Backend display' : 'Setup configuration');
  if (ringFocus.ring === 'r0') return zipskillsAccessibleName(item);
  return `${ringLabel}: ${item.label}. Presentation only; not authorization.`;
}
