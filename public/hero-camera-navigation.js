import { MACHINE_FACILITY_BRANCH_IDS } from './machine-facility-assembly.js';
import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';
import { deriveMachineWorldProfile } from './hero-world-profile.js';

const FACILITY_FOCUS_LABELS = Object.freeze({
  'BRANCH-OUTER-ALPHA': 'Analysis · Telescope',
  'BRANCH-OUTER-BETA': 'Operations · Fin deployment',
  'BRANCH-OUTER-GAMMA': 'Control · Rotating core',
  'BRANCH-OUTER-DELTA': 'Access · Sensor array',
});

const HERO_CAMERA_IDS = new Set([
  'HERO_WIDE',
  'TEAM_ORBIT',
  'SEAT_CLOSE',
  'WORKSPACE_CLOSE',
  'OVERHEAD_MAP',
  'DETAIL_ANCHOR',
]);

/** Hero camera navigation state. All target geometry/camera math remains renderer-owned. */
export function createHeroCameraNavigationController({
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  getCameraId = () => 'HERO_WIDE',
  setBaseCamera = () => 'HERO_WIDE',
  resetToWorld = () => {},
  stopLoop = () => {},
  getHierarchyOpen = () => false,
  getSelectedSeat = () => 0,
  getSeatCount = () => 10,
} = {}) {
  let activeBranchId = null;

  function updateControls() {
    for (const button of documentRef.querySelectorAll('[data-facility-focus]')) {
      button.setAttribute('aria-pressed', String(button.dataset.facilityFocus === activeBranchId));
    }
    const status = documentRef.querySelector('#facility-focus-status');
    if (status) {
      status.textContent = activeBranchId
        ? 'Inspecting: ' + FACILITY_FOCUS_LABELS[activeBranchId]
        : 'World overview';
    }
  }

  function emit(detail) {
    windowRef.dispatchEvent(new windowRef.CustomEvent('teamai:facility-focus-change', {
      detail: { ...detail, presentationOnly: true },
    }));
  }

  function clear() {
    activeBranchId = null;
    updateControls();
    return null;
  }

  function setCamera(requestedId) {
    clear();
    return setBaseCamera(HERO_CAMERA_IDS.has(requestedId) ? requestedId : 'HERO_WIDE');
  }

  function returnToWorld() {
    stopLoop();
    resetToWorld();
    activeBranchId = null;
    updateControls();
    emit({ branchId: null, mode: 'WORLD_OVERVIEW' });
    return Object.freeze({
      ok: true,
      branchId: null,
      mode: 'WORLD_OVERVIEW',
      cameraId: getCameraId(),
      presentationOnly: true,
    });
  }

  function focusFacility(branchId) {
    const requestedBranchId = typeof branchId === 'string' ? branchId : '';
    stopLoop();
    if (!MACHINE_FACILITY_BRANCH_IDS.includes(requestedBranchId)) {
      returnToWorld();
      return Object.freeze({
        ok: false,
        reason: 'UNKNOWN_FACILITY_BRANCH',
        branchId: requestedBranchId || null,
        presentationOnly: true,
      });
    }
    resetToWorld();
    activeBranchId = requestedBranchId;
    updateControls();
    emit({ branchId: requestedBranchId, mode: 'FACILITY_FOCUS' });
    return Object.freeze({
      ok: true,
      branchId: requestedBranchId,
      mode: 'FACILITY_FOCUS',
      cameraId: getCameraId(),
      presentationOnly: true,
    });
  }

  function getState() {
    return Object.freeze({
      active: Boolean(activeBranchId),
      branchId: activeBranchId,
      mode: activeBranchId ? 'FACILITY_FOCUS' : 'WORLD_OVERVIEW',
      cameraId: getCameraId(),
      presentationOnly: true,
    });
  }

  function getSubjectLockSnapshot() {
    const shellOpen = Boolean(getHierarchyOpen());
    const cameraId = getCameraId();
    const selectedSeat = getSelectedSeat();
    const seatCount = getSeatCount();
    const seatRadius = deriveMachineWorldProfile(seatCount).seatShellRadius;
    const dock = resolveSelectedSeatDock(
      cameraId,
      selectedSeat,
      seatCount,
      { seatRadius },
      shellOpen ? { force: true } : {},
    );
    return {
      active: shellOpen || cameraId === 'SEAT_CLOSE' || cameraId === 'DETAIL_ANCHOR',
      cameraId,
      selectedSeat,
      seatCount,
      shellOpen,
      target: dock?.t ?? null,
    };
  }

  function bindNavigation() {
    for (const button of documentRef.querySelectorAll('[data-world-camera-request]')) {
      button.addEventListener('click', () => setCamera(button.dataset.worldCameraRequest));
    }
    for (const button of documentRef.querySelectorAll('[data-facility-focus]')) {
      button.addEventListener('click', () => focusFacility(button.dataset.facilityFocus));
    }
    for (const button of documentRef.querySelectorAll('[data-facility-focus-return]')) {
      button.addEventListener('click', () => returnToWorld());
    }
    updateControls();
  }

  return Object.freeze({
    bindNavigation,
    clear,
    setCamera,
    focusFacility,
    returnToWorld,
    getState,
    getBranchId: () => activeBranchId,
    getSubjectLockSnapshot,
  });
}
