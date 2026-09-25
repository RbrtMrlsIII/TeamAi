import { clampSeatCount, GUEST_SEAT_COUNT } from './seat-capacity.js';
import {
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_REST_Y,
  SEAT_OPEN_LIFT,
  CHILD_STEP_Y,
  CHILD_STEP_R,
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  HIERARCHY_REDUCED_SNAP,
  HEALTH_STATUS,
  BACKEND_DISPLAY_V1,
  SETUP_CONFIG_V1,
  SEAT_TOOLKIT_V1,
  WORKSPACE_ZIPSKILLS_V1,
  toolkitChildAccessibleName,
  zipskillsAccessibleName,
  RING_R0_ZIP_SCALE,
  RING_R1_SCALE,
  RING_R2_SCALE,
  NAV_ZOOM_MIN,
  NAV_ZOOM_MAX,
  NAV_ZOOM_REDUCED_MIN,
  NAV_ZOOM_REDUCED_MAX,
  HIERARCHY_INPUT,
  createRingFocusState,
  focusRingItem,
  cycleRingFocus,
  clearRingFocus,
  ringFocusAccessibleName,
  createHierarchyRuntime,
  syncHierarchyRuntime,
  closeHierarchyParent as closeHierarchyParentState,
  openSeatShellParent as openSeatShellParentState,
  tickHierarchyPose,
  tickDivisionFocusTransition,
  tickSeatDivisionBranches,
  getSeatDivisionBranchAmount,
  getSeatDivisionBranchAmounts,
  getConnectionBranchAmount,
  getBehaviorBranchAmount,
  getToolkitBranchAmount,
  getCapabilitiesBranchAmount,
  getAuthorizationBranchAmount,
  getWorkspaceScopeBranchAmount,


  connectionFaceAccessibleName,



  behaviorFaceAccessibleName,

  BEHAVIOR_BRANCH_MS,


  toolkitFaceAccessibleName,

  TOOLKIT_BRANCH_MS,


  capabilitiesFaceAccessibleName,

  CAPABILITIES_BRANCH_MS,


  authorizationFaceAccessibleName,

  AUTHORIZATION_BRANCH_MS,


  workspaceScopeFaceAccessibleName,

  WORKSPACE_SCOPE_BRANCH_MS,

  getTaskEvidenceBranchAmount,
  taskEvidenceFaceAccessibleName,

  TASK_EVIDENCE_BRANCH_MS,
  SETUP_RING_FILL_MS,
  SETUP_RING_FOV_FILL,
  FOV_BOOST_NARROW,
  APP_UI_HANDOFF,
  setupRingFocusedItem,
  isSetupFullAreaItem,
  setupRingCameraId,
  beginSetupRingFill,
  tickSetupRingFill,
  getSetupRingFillAmount,
  setupRingAccessibleName,
  requestSetupRingHandoff,
  setupRingFovBoost,
  CONNECTION_BRANCH_MS,
  focusChild as focusHierarchyChild,
  focusLeaf as focusHierarchyLeaf,
  clearLeafFocus,
  healthLeafAccessibleName,
  getHierarchySnapshot,
  seatShellParentId,
  resolveSeatDivisionConfigCommand,
  requestSeatDivisionConfigure,
} from './hero-hierarchy-runtime.js';
import { cycleSeatShellBranchFocus } from './hero-seat-branch-walk.js';
import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';
import { shouldApplyTreeNav } from './hero-cam3-tree-center-zoom.js';
import { createMachineWorldRenderer } from './machine-world-renderer.js';
import { deriveMachineWorldProfile } from './hero-world-profile.js';
import { resolveMachineGuestPresentation } from './machine-guest-state.js';

const canvas = document.querySelector('#hero-canvas');
const shell = document.querySelector('.hero-shell');
const stateLabel = document.querySelector('#state-label');
const seatLabel = document.querySelector('#seat-label');
const demoButton = document.querySelector('#demo-toggle');
const motionButton = document.querySelector('#motion-toggle');
if (!canvas || !shell) throw new Error('3D Hero canvas and shell are required.');

const machineWorldRenderer = createMachineWorldRenderer({ canvas });

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const normalizeSeatIndex = (value, count = seatCount) => {
  const total = Math.max(1, count | 0);
  return ((Math.floor(Number(value)) % total) + total) % total;
};
// Camera-facing values resolve from the shared world profile; WebGL geometry remains renderer-owned.
const profile = (count) => {
  const world = deriveMachineWorldProfile(count);
  return {
    workspace: world.workspaceFootprint,
    seatRadius: world.seatShellRadius,
    seatScale: world.seatScale,
    cameraDist: world.cameraDistance,
  };
};

let cameraId = 'HERO_WIDE';
let seatCount = GUEST_SEAT_COUNT;
let selectedSeat = 0;
let state = 'IDLE';
let demo = false;
let reducedMotion = false;
let contribution = 0;
let stateStart = performance.now();
let navOrbitYaw = 0;
let navOrbitPitch = 0;
let navZoom = 1;
let lastNavBaseCameraId = 'HERO_WIDE';
let authTransitionOpen = false;
let lastFrameAt = performance.now();
let lastNavigationInputAt = performance.now();
let touchState = null;
let pinchStart = null;
let seats = [];
let traces = [];

const hierarchyRuntime = createHierarchyRuntime({
  selectedSeatIndex: selectedSeat,
  cameraId,
});
const ringFocus = createRingFocusState();

function rebuildSeats() {
  seats = Array.from({ length: seatCount }, (_, index) => ({
    id: 'seat-' + (index + 1),
    label: 'Web AI Seat ' + (index + 1),
    index,
  }));
}
rebuildSeats();

function syncHierarchyFromGlobals() {
  return syncHierarchyRuntime(hierarchyRuntime, {
    selectedSeatIndex: selectedSeat,
    cameraId,
    reducedMotion,
    demo,
  });
}

function getHierarchyState() {
  return getHierarchySnapshot(syncHierarchyFromGlobals());
}

function addTrace() {
  traces.push(Object.freeze({
    seatIndex: selectedSeat,
    seatId: seats[selectedSeat]?.id ?? null,
    state: 'REFLECT',
    presentationOnly: true,
  }));
}

function setState(next, reason = 'transition') {
  const previous = state;
  state = next;
  stateStart = performance.now();
  updateLabels();
  window.dispatchEvent(new CustomEvent('teamai:hero-state-change', {
    detail: {
      previous,
      state,
      selectedSeat,
      seatId: seats[selectedSeat]?.id ?? null,
      reason,
      presentationOnly: true,
      traceCount: traces.length,
    },
  }));
}

function seatCameraProfile() {
  return {
    seatRadius: deriveMachineWorldProfile(seatCount).seatShellRadius,
  };
}

function setCamera(id) {
  const allowed = new Set([
    'HERO_WIDE',
    'TEAM_ORBIT',
    'SEAT_CLOSE',
    'WORKSPACE_CLOSE',
    'OVERHEAD_MAP',
    'DETAIL_ANCHOR',
  ]);
  cameraId = allowed.has(id) ? id : 'HERO_WIDE';
  lastNavBaseCameraId = cameraId;
  hierarchyRuntime.cameraId = cameraId;
  return cameraId;
}

function getSubjectLockSnapshot() {
  const shellOpen = Boolean(hierarchyRuntime.openParentId);
  const active = shellOpen || cameraId === 'SEAT_CLOSE' || cameraId === 'DETAIL_ANCHOR';
  const dock = resolveSelectedSeatDock(
    cameraId,
    selectedSeat,
    seatCount,
    seatCameraProfile(),
    shellOpen ? { force: true } : {},
  );
  return {
    active,
    cameraId,
    selectedSeat,
    seatCount,
    shellOpen,
    target: dock?.t ?? null,
  };
}

function retargetSubjectLock() {
  return getSubjectLockSnapshot();
}

function setSelectedSeat(index) {
  selectedSeat = normalizeSeatIndex(index);
  rebuildSeats();
  hierarchyRuntime.selectedSeatIndex = selectedSeat;
  return retargetSubjectLock();
}

function selectSeatShell(index) {
  selectedSeat = normalizeSeatIndex(index);
  rebuildSeats();
  const now = performance.now();
  const snap = HIERARCHY_REDUCED_SNAP && reducedMotion;
  openSeatShellParentState(hierarchyRuntime, selectedSeat, { snap, nowMs: now });
  setCamera('SEAT_CLOSE');
  syncHierarchyFromGlobals();
  setState('FOCUS', 'seat-shell-select');
  return getHierarchyState();
}

function returnFromSeatShell() {
  const now = performance.now();
  const snap = HIERARCHY_REDUCED_SNAP && reducedMotion;
  closeHierarchyParentState(hierarchyRuntime, { snap, nowMs: now });
  navOrbitYaw = 0;
  navOrbitPitch = 0;
  navZoom = 1;
  setCamera('HERO_WIDE');
  syncHierarchyFromGlobals();
  setState('IDLE', 'seat-shell-close');
  return getHierarchyState();
}

function closeHierarchyParent() {
  return returnFromSeatShell();
}

function readDocumentMotionReduced() {
  const value = (document.documentElement.getAttribute('data-motion') || '').toLowerCase();
  return value === 'reduced' || value === 'reduce';
}

function syncReducedMotionFromDocument() {
  reducedMotion = readDocumentMotionReduced();
  return reducedMotion;
}

function setReducedMotion(next, { writeDocument = true } = {}) {
  reducedMotion = Boolean(next);
  if (writeDocument) {
    try {
      document.documentElement.setAttribute('data-motion', reducedMotion ? 'reduced' : 'full');
    } catch (_) {
      // documentElement can be absent in isolated tests.
    }
  }
  return reducedMotion;
}

function startLoop() {
  demo = true;
  setState('FOCUS', 'loop-start');
}

function stopLoop() {
  demo = false;
  contribution = 0;
  setState('IDLE', 'loop-stop');
}

function cycleTurn(now) {
  if (!demo) return;
  const elapsed = now - stateStart;
  const durations = {
    focus: reducedMotion ? 245 : 700,
    active: reducedMotion ? 315 : 900,
    contribute: reducedMotion ? 385 : 1100,
    absorb: reducedMotion ? 182 : 520,
    reflect: reducedMotion ? 182 : 520,
    handoff: reducedMotion ? 280 : 800,
  };
  if (state === 'FOCUS' && elapsed > durations.focus) setState('ACTIVE');
  else if (state === 'ACTIVE' && elapsed > durations.active) {
    contribution = 0;
    setState('CONTRIBUTE', 'contribution-start');
  } else if (state === 'CONTRIBUTE') {
    contribution = clamp(elapsed / durations.contribute, 0, 1);
    if (elapsed > durations.contribute) {
      contribution = 1;
      setState('ABSORB', 'workspace-absorb');
    }
  } else if (state === 'ABSORB' && elapsed > durations.absorb) setState('REFLECT', 'workspace-reflect');
  else if (state === 'REFLECT' && elapsed > durations.reflect) {
    addTrace();
    setState('HANDOFF', 'trace-committed');
  }
  else if (state === 'HANDOFF' && elapsed > durations.handoff) {
    selectedSeat = (selectedSeat + 1) % seatCount;
    rebuildSeats();
    setState('FOCUS', 'next-seat-focus');
    setCamera('SEAT_CLOSE');
  }
}

function getGuestMachineState() {
  return resolveMachineGuestPresentation({
    authenticated: false,
    authTransition: authTransitionOpen,
    worldLayer: shell.dataset.heroLayer === 'machine',
    reducedMotion,
  });
}

function updateGuestPresentation() {
  const guest = getGuestMachineState();
  shell.dataset.guestState = guest.state;
  shell.dataset.guestLimited = String(guest.limited);
  shell.dataset.guestOrbit = String(guest.autoOrbitEnabled);
  const status = document.querySelector('.world-navigation__status');
  if (status) {
    status.textContent = guest.authTransition
      ? 'Authentication · orbit paused'
      : guest.limited
        ? 'Guest · limited actions'
        : '3D workspace';
  }

  document.querySelectorAll('[data-feature-id]').forEach((button) => {
    const locked = guest.lockedFeatureIds.includes(button.dataset.featureId || '');
    button.dataset.guestState = locked ? 'locked' : 'available';
  });
  return guest;
}

function applyGuestOrbit(now, guest) {
  const elapsed = Math.max(0, Math.min(64, now - lastFrameAt));
  lastFrameAt = now;
  if (!guest.autoOrbitEnabled || cameraId !== 'HERO_WIDE') return;
  if (hierarchyRuntime.openParentId) return;
  if (now - lastNavigationInputAt < 1800) return;
  navOrbitYaw += elapsed * 0.000025;
  if (navOrbitYaw > Math.PI * 2) navOrbitYaw -= Math.PI * 2;
}

function updateLabels() {
  if (stateLabel) stateLabel.textContent = state;
  const seat = seats[selectedSeat] || seats[0];
  let seatText = `${state === 'IDLE' ? 'Next: ' : ''}${seat?.label || 'Web AI Seat'} · ${seatCount} seat${seatCount === 1 ? '' : 's'} unlocked`;

  if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedLeafId === HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE) {
    seatText = healthLeafAccessibleName(hierarchyRuntime.healthStatus);
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_CONNECTION) {
    seatText = connectionFaceAccessibleName(getConnectionBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    seatText = behaviorFaceAccessibleName(getBehaviorBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_TOOLKIT) {
    seatText = toolkitFaceAccessibleName(getToolkitBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    seatText = capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_AUTHORIZATION) {
    seatText = authorizationFaceAccessibleName(getAuthorizationBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE) {
    seatText = workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_TASK_EVIDENCE) {
    seatText = taskEvidenceFaceAccessibleName(getTaskEvidenceBranchAmount(hierarchyRuntime));
  } else if (hierarchyRuntime.openParentId && hierarchyRuntime.focusedChildId) {
    seatText = `${seat?.label || 'Web AI Seat'} · ${hierarchyRuntime.focusedChildId}`;
  } else if (ringFocus.ring === 'r2') {
    seatText = setupRingAccessibleName(
      setupRingFocusedItem(ringFocus),
      getSetupRingFillAmount(hierarchyRuntime),
    );
  } else if (ringFocus.ring) {
    seatText = ringFocusAccessibleName(ringFocus);
  }

  if (seatLabel) {
    seatLabel.textContent = seatText;
    seatLabel.setAttribute('aria-live', 'polite');
    seatLabel.setAttribute('role', 'status');
  }
  if (demoButton) demoButton.textContent = demo ? 'Stop turn loop' : 'Start turn loop';
  if (motionButton) motionButton.textContent = `Reduced motion: ${reducedMotion ? 'on' : 'off'}`;

  shell.dataset.state = state;
  shell.dataset.hierarchyOpen = hierarchyRuntime.openParentId ? 'true' : 'false';
  shell.dataset.focusedChild = hierarchyRuntime.focusedChildId || '';
  shell.dataset.focusedLeaf = hierarchyRuntime.focusedLeafId || '';
  shell.dataset.traceCount = String(traces.length);
}

function setSeatCount(next) {
  const count = clampSeatCount(next);
  if (count === seatCount) return seatCount;
  seatCount = count;
  selectedSeat %= seatCount;
  rebuildSeats();
  machineWorldRenderer.setExpanded(Boolean(hierarchyRuntime.openParentId), performance.now());
  return updateLabels(), seatCount;
}

function applyNavCamera() {
  if (!shouldApplyTreeNav(hierarchyRuntime)) return getSubjectLockSnapshot();
  navZoom = clamp(navZoom, NAV_ZOOM_MIN, NAV_ZOOM_MAX);
  if (reducedMotion) navZoom = clamp(navZoom, NAV_ZOOM_REDUCED_MIN, NAV_ZOOM_REDUCED_MAX);
  return {
    cameraId,
    navZoom,
    navOrbitYaw,
    navOrbitPitch,
    subjectLock: getSubjectLockSnapshot(),
  };
}

function onWheel(event) {
  event.preventDefault();
  lastNavigationInputAt = performance.now();
  const delta = Math.sign(event.deltaY) * 0.08;
  navZoom = clamp(navZoom + delta, NAV_ZOOM_MIN, NAV_ZOOM_MAX);
  if (reducedMotion) navZoom = clamp(navZoom, NAV_ZOOM_REDUCED_MIN, NAV_ZOOM_REDUCED_MAX);
  if (navZoom >= NAV_ZOOM_MAX - 1e-6) lastNavBaseCameraId = 'HERO_WIDE';
  applyNavCamera();
}

function onPointerDown(event) {
  if (event.pointerType === 'touch' || event.button === 1 || event.button === 2 || event.shiftKey) {
    touchState = { id: event.pointerId, x: event.clientX, y: event.clientY };
    try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
  }
}

function onPointerMove(event) {
  if (!touchState || touchState.id !== event.pointerId) return;
  lastNavigationInputAt = performance.now();
  const dx = (event.clientX - touchState.x) / Math.max(1, canvas.clientWidth);
  const dy = (event.clientY - touchState.y) / Math.max(1, canvas.clientHeight);
  touchState.x = event.clientX;
  touchState.y = event.clientY;
  navOrbitYaw += dx * Math.PI;
  navOrbitPitch = clamp(navOrbitPitch + dy * 1.2, -0.45, 0.55);
  if (reducedMotion) {
    navOrbitYaw = 0;
    navOrbitPitch = 0;
  }
  applyNavCamera();
}

function onPointerUp(event) {
  if (touchState && touchState.id === event.pointerId) touchState = null;
}

function onTouchStart(event) {
  if (event.touches.length !== 2) return;
  const [a, b] = event.touches;
  pinchStart = {
    dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
    zoom: navZoom,
  };
  event.preventDefault();
}

function onTouchMove(event) {
  if (event.touches.length !== 2 || !pinchStart) return;
  lastNavigationInputAt = performance.now();
  const [a, b] = event.touches;
  const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  navZoom = clamp(
    pinchStart.zoom * (pinchStart.dist / Math.max(1, dist)),
    NAV_ZOOM_MIN,
    NAV_ZOOM_MAX,
  );
  if (reducedMotion) navZoom = clamp(navZoom, NAV_ZOOM_REDUCED_MIN, NAV_ZOOM_REDUCED_MAX);
  applyNavCamera();
  event.preventDefault();
}

function cycleRing(ring, direction = 1) {
  cycleRingFocus(ringFocus, ring, direction);
  if (ring === 'r2') {
    const item = setupRingFocusedItem(ringFocus);
    if (item) {
      setupRingCameraId(item);
      beginSetupRingFill(hierarchyRuntime, ringFocus, { nowMs: performance.now() });
    }
  }
  updateLabels();
  return ringFocusAccessibleName(ringFocus);
}

function handleKeyDown(event) {
  const key = event.key;
  if (key.toLowerCase() === 'd') {
    demo ? stopLoop() : startLoop();
    return;
  }
  if (key.toLowerCase() === 'm') {
    setReducedMotion(!reducedMotion);
    updateLabels();
    return;
  }
  if (/^[1-9]$/.test(key)) {
    setSeatCount(Number(key));
    return;
  }
  if (key === '0') {
    setSeatCount(10);
    return;
  }
  if (key === 'Enter') {
    if (
      hierarchyRuntime.openParentId &&
      hierarchyRuntime.focusedChildId === HIERARCHY_PART.SEAT_CONNECTION &&
      hierarchyRuntime.focusedLeafId !== HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE
    ) {
      focusHierarchyLeaf(hierarchyRuntime, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
      event.preventDefault();
    } else if (hierarchyRuntime.focusedLeafId === HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE) {
      const order = [HEALTH_STATUS.UNKNOWN, HEALTH_STATUS.LOADING, HEALTH_STATUS.UNAVAILABLE];
      const current = order.indexOf(hierarchyRuntime.healthStatus || HEALTH_STATUS.UNKNOWN);
      hierarchyRuntime.healthStatus = order[(current + 1 + order.length) % order.length];
      event.preventDefault();
    } else if (!hierarchyRuntime.openParentId && ringFocus.ring === 'r2') {
      const item = setupRingFocusedItem(ringFocus);
      if (isSetupFullAreaItem(item)) {
        requestSetupRingHandoff({
          item,
          targetSection: item.kind === 'auth' ? 'auth' : 'setup',
        });
      } else {
        beginSetupRingFill(hierarchyRuntime, ringFocus, { nowMs: performance.now() });
      }
      event.preventDefault();
    } else {
      selectSeatShell(selectedSeat);
      event.preventDefault();
    }
  }
  if (key === 'Escape') {
    if (hierarchyRuntime.focusedLeafId) {
      clearLeafFocus(hierarchyRuntime);
      event.preventDefault();
    } else if (ringFocus.ring && !hierarchyRuntime.openParentId) {
      clearRingFocus(ringFocus);
      updateLabels();
      event.preventDefault();
    } else if (hierarchyRuntime.openParentId) {
      returnFromSeatShell();
      event.preventDefault();
    }
  }
  if (key === 'z' || key === 'x') {
    if (!hierarchyRuntime.openParentId) {
      cycleRing('r0', key === 'z' ? 1 : -1);
      event.preventDefault();
    }
  }
  if (key === '[' || key === ']') {
    if (!hierarchyRuntime.openParentId) {
      cycleRing('r1', key === ']' ? 1 : -1);
      event.preventDefault();
    }
  }
  if (key === '{' || key === '}' || key === ';' || key === "'") {
    if (!hierarchyRuntime.openParentId) {
      cycleRing('r2', (key === '}' || key === "'") ? 1 : -1);
      event.preventDefault();
    }
  }
  if (key === '.' && !hierarchyRuntime.openParentId) {
    clearRingFocus(ringFocus);
    updateLabels();
    event.preventDefault();
  }
  if ((key === 'ArrowRight' || key === 'ArrowLeft') && hierarchyRuntime.openParentId) {
    cycleSeatShellBranchFocus(
      hierarchyRuntime,
      key === 'ArrowRight' ? 1 : -1,
      {
        nowMs: performance.now(),
        snap: HIERARCHY_REDUCED_SNAP && reducedMotion,
        interactive: true,
      },
    );
    syncHierarchyFromGlobals();
    updateLabels();
    event.preventDefault();
  }

    const handoff = resolveSeatDivisionConfigCommand(key);
  if (
    handoff
    && hierarchyRuntime.openParentId
    && hierarchyRuntime.focusedChildId === handoff.childId
  ) {
    requestSeatDivisionConfigure(handoff.childId, {
      targetSection: handoff.targetSection,
    });
    event.preventDefault();
  }

  if (key.toLowerCase() === 'l' && !hierarchyRuntime.openParentId && ringFocus.ring === 'r2') {
    const item = setupRingFocusedItem(ringFocus);
    requestSetupRingHandoff({
      item,
      targetSection: item?.kind === 'auth' ? 'auth' : 'setup',
    });
    event.preventDefault();
  }
  updateLabels();
}

function frame(now) {
  syncReducedMotionFromDocument();
  const guest = updateGuestPresentation();
  applyGuestOrbit(now, guest);
  cycleTurn(now);
  tickHierarchyPose(hierarchyRuntime, now, reducedMotion);
  tickDivisionFocusTransition(hierarchyRuntime, now, reducedMotion);
  tickSeatDivisionBranches(hierarchyRuntime, now, reducedMotion);
  tickSetupRingFill(hierarchyRuntime, ringFocus, now, reducedMotion);
  syncHierarchyFromGlobals();
  updateLabels();

  machineWorldRenderer.render(now, {
    seatCount,
    selectedSeat,
    hierarchyOpen: Boolean(hierarchyRuntime.openParentId),
    expanded: Boolean(hierarchyRuntime.openParentId || ['FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB'].includes(state)),
    branchId: `BRANCH-SEAT-${String(selectedSeat + 1).padStart(2, '0')}`,
    cameraId,
    reducedMotion,
    navOrbitYaw,
    navOrbitPitch,
    navZoom,
    seatDivisionBranchAmounts: getSeatDivisionBranchAmounts(hierarchyRuntime),
    focusedChildId: hierarchyRuntime.focusedChildId,
    focusedChildIndex: SEAT_SHELL_V1_CHILDREN.indexOf(hierarchyRuntime.focusedChildId),
    hierarchyOpenAmount: hierarchyRuntime.openAmount,
    heroState: state,
    contributionAmount: contribution,
    focusedChildAmount:
      getSeatDivisionBranchAmount(hierarchyRuntime, hierarchyRuntime.focusedChildId),
    hierarchyPhase: hierarchyRuntime.phase,
    ringFocus: { ring: ringFocus.ring, index: ringFocus.index },
    setupRingFillAmount: getSetupRingFillAmount(hierarchyRuntime),
    machineLayer: shell.dataset.heroLayer === 'machine',
  });

  requestAnimationFrame(frame);
}

canvas.addEventListener('click', (event) => {
  event.preventDefault();
});

canvas.addEventListener('wheel', onWheel, { passive: false });
canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointercancel', () => { touchState = null; });
canvas.addEventListener('touchstart', onTouchStart, { passive: false });
canvas.addEventListener('touchmove', onTouchMove, { passive: false });
canvas.addEventListener('touchend', () => { pinchStart = null; });

document.querySelectorAll('[data-camera]').forEach((button) => {
  button.addEventListener('click', () => setCamera(button.dataset.camera));
});
demoButton?.addEventListener('click', () => demo ? stopLoop() : startLoop());
motionButton?.addEventListener('click', () => {
  setReducedMotion(!reducedMotion);
  updateLabels();
});

document.querySelectorAll('[data-world-camera-request]').forEach((button) => {
  button.addEventListener('click', () => setCamera(button.dataset.worldCameraRequest));
});

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('teamai:web-ai-seat-unlocked', (event) => {
  setSeatCount(event.detail?.seatCount ?? event.detail?.count ?? seatCount + 1);
});

window.addEventListener('teamai:hero-auth-visibility', (event) => {
  authTransitionOpen = event.detail?.open === true;
  updateGuestPresentation();
});

window.TeamAiHero = {
  setSeatCount,
  getSeatCount: () => seatCount,
  setTeamSize: setSeatCount,
  setCamera,
  startLoop,
  stopLoop,
  getState: () => state,
  getTraceCount: () => traces.length,
  getSelectedSeat: () => selectedSeat,
  getContributionProgress: () => contribution,
  getReducedMotion: () => reducedMotion,
  setReducedMotion,
  getGuestMachineState,
  getNavOrbitYaw: () => navOrbitYaw,
  getHierarchyState,
  selectSeatShell,
  closeHierarchyParent,
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_REST_Y,
  SEAT_OPEN_LIFT,
  CHILD_STEP_Y,
  CHILD_STEP_R,
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  focusChild: (id) => focusHierarchyChild(hierarchyRuntime, id),
  focusLeaf: (id) => focusHierarchyLeaf(hierarchyRuntime, id),
  HEALTH_STATUS,
  healthLeafAccessibleName,
  BACKEND_DISPLAY_V1,
  SETUP_CONFIG_V1,
  SEAT_TOOLKIT_V1,
  toolkitChildAccessibleName,
  WORKSPACE_ZIPSKILLS_V1,
  zipskillsAccessibleName,
  RING_R0_ZIP_SCALE,
  RING_R1_SCALE,
  RING_R2_SCALE,
  NAV_ZOOM_MIN,
  NAV_ZOOM_MAX,
  getRingFocus: () => ({ ring: ringFocus.ring, index: ringFocus.index }),
  focusRing: (ring, index) => {
    focusRingItem(ringFocus, ring, index);
    updateLabels();
    return ringFocusAccessibleName(ringFocus);
  },
  cycleRing,
  getNavZoom: () => navZoom,
  getBaseCameraId: () => lastNavBaseCameraId,
  resetNav: () => {
    navOrbitYaw = 0;
    navOrbitPitch = 0;
    navZoom = 1;
    return applyNavCamera();
  },
  getSubjectLockSnapshot,
  retargetSubjectLock,
  setSelectedSeat,
  getSubjectLockCameraTarget: () => getSubjectLockSnapshot().target,
  getConnectionBranchAmount: () => getConnectionBranchAmount(hierarchyRuntime),
  getSeat1AdjacentWiring: () => machineWorldRenderer.getSeat1AdjacentWiring(),
  requestConnectionConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_CONNECTION),
  CONNECTION_BRANCH_MS,
  connectionFaceAccessibleName,
  getBehaviorBranchAmount: () => getBehaviorBranchAmount(hierarchyRuntime),
  requestBehaviorConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_BEHAVIOR),
  BEHAVIOR_BRANCH_MS,
  behaviorFaceAccessibleName,
  getToolkitBranchAmount: () => getToolkitBranchAmount(hierarchyRuntime),
  requestToolkitConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_TOOLKIT),
  TOOLKIT_BRANCH_MS,
  toolkitFaceAccessibleName,
  getCapabilitiesBranchAmount: () => getCapabilitiesBranchAmount(hierarchyRuntime),
  requestCapabilitiesConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_CAPABILITIES),
  CAPABILITIES_BRANCH_MS,
  capabilitiesFaceAccessibleName,
  getAuthorizationBranchAmount: () => getAuthorizationBranchAmount(hierarchyRuntime),
  requestAuthorizationConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_AUTHORIZATION),
  AUTHORIZATION_BRANCH_MS,
  authorizationFaceAccessibleName,
  getWorkspaceScopeBranchAmount: () => getWorkspaceScopeBranchAmount(hierarchyRuntime),
  requestWorkspaceScopeConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_WORKSPACE_SCOPE),
  WORKSPACE_SCOPE_BRANCH_MS,
  workspaceScopeFaceAccessibleName,
  getTaskEvidenceBranchAmount: () => getTaskEvidenceBranchAmount(hierarchyRuntime),
  requestTaskEvidenceConfigure: () => requestSeatDivisionConfigure(HIERARCHY_PART.SEAT_TASK_EVIDENCE),
  TASK_EVIDENCE_BRANCH_MS,
  taskEvidenceFaceAccessibleName,
  SETUP_RING_FILL_MS,
  SETUP_RING_FOV_FILL,
  FOV_BOOST_NARROW,
  APP_UI_HANDOFF,
  getSetupRingFillAmount: () => getSetupRingFillAmount(hierarchyRuntime),
  setupRingAccessibleName,
  requestSetupRingHandoff: (item) => requestSetupRingHandoff({ item }),
  setupRingCameraId,
  isSetupFullAreaItem,
};

const query = new URLSearchParams(location.search);
if (query.has('seats')) setSeatCount(Number(query.get('seats')));
syncReducedMotionFromDocument();
setCamera('HERO_WIDE');
updateLabels();
requestAnimationFrame(frame);
