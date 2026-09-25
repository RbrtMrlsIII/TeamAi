import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

/**
 * TEAM-EXPERIENCE-029 / S10
 * Semantic machine camera specification.
 *
 * Camera identity comes from the existing controller vocabulary. This module
 * translates that identity into a camera target subject and framing profile;
 * it does not own scene geometry, hierarchy state, topology, or backend state.
 */
export const MACHINE_CAMERA_MODE = Object.freeze({
  WORLD_OVERVIEW: 'WORLD_OVERVIEW',
  POD_FOCUS: 'POD_FOCUS',
  CORE_FOCUS: 'CORE_FOCUS',
  DIVISION_FOCUS: 'DIVISION_FOCUS',
  FACILITY_FOCUS: 'FACILITY_FOCUS',
  EXPANSION_FOLLOW: 'EXPANSION_FOLLOW',
  RETURN_TO_PARENT: 'RETURN_TO_PARENT',
  RETURN_TO_WORLD: 'RETURN_TO_WORLD',
});

export const MACHINE_CAMERA_ID = Object.freeze({
  WORLD: 'HERO_WIDE',
  ORBIT: 'TEAM_ORBIT',
  SEAT: 'SEAT_CLOSE',
  WORKSPACE: 'WORKSPACE_CLOSE',
  OVERHEAD: 'OVERHEAD_MAP',
  DETAIL: 'DETAIL_ANCHOR',
});

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const clamp = (value, min, max) => Math.max(min, Math.min(max, finite(value, min)));

const ROOT_OWNER = 'frontend/spatial/machine-camera.js';

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S10',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function validSubject(subject) {
  return Boolean(
    subject?.center
    && subject?.min
    && subject?.max
    && [
      subject.center.x, subject.center.y, subject.center.z,
      subject.min.x, subject.min.y, subject.min.z,
      subject.max.x, subject.max.y, subject.max.z,
    ].every(Number.isFinite),
  );
}

function subjectSpan(subject) {
  if (!validSubject(subject)) return 1;
  return Math.max(
    finite(subject.max.x) - finite(subject.min.x),
    finite(subject.max.z) - finite(subject.min.z),
    0.4,
  );
}

function chooseSubject({
  mode,
  worldSubject,
  podSubject,
  divisionSubject,
  coreSubject,
  facilitySubject,
  parentSubject,
} = {}) {
  switch (mode) {
    case MACHINE_CAMERA_MODE.DIVISION_FOCUS:
    case MACHINE_CAMERA_MODE.EXPANSION_FOLLOW:
      return validSubject(divisionSubject)
        ? divisionSubject
        : (validSubject(podSubject) ? podSubject : worldSubject);
    case MACHINE_CAMERA_MODE.POD_FOCUS:
      return validSubject(podSubject) ? podSubject : worldSubject;
    case MACHINE_CAMERA_MODE.CORE_FOCUS:
      return validSubject(coreSubject) ? coreSubject : worldSubject;
    case MACHINE_CAMERA_MODE.FACILITY_FOCUS:
      return validSubject(facilitySubject) ? facilitySubject : worldSubject;
    case MACHINE_CAMERA_MODE.RETURN_TO_PARENT:
      return validSubject(parentSubject)
        ? parentSubject
        : (validSubject(podSubject) ? podSubject : worldSubject);
    case MACHINE_CAMERA_MODE.RETURN_TO_WORLD:
    case MACHINE_CAMERA_MODE.WORLD_OVERVIEW:
    default:
      return worldSubject;
  }
}

export function resolveMachineCameraMode({
  cameraId = MACHINE_CAMERA_ID.WORLD,
  hierarchyOpen = false,
  focusedChildId = null,
  focusedDivision = false,
  expansionFollowing = false,
  returningToParent = false,
  returningToWorld = false,
  facilityFocused = false,
} = {}) {
  if (returningToWorld) return MACHINE_CAMERA_MODE.RETURN_TO_WORLD;
  if (returningToParent) return MACHINE_CAMERA_MODE.RETURN_TO_PARENT;
  if (expansionFollowing) return MACHINE_CAMERA_MODE.EXPANSION_FOLLOW;
  if (facilityFocused) return MACHINE_CAMERA_MODE.FACILITY_FOCUS;
  if (hierarchyOpen && (focusedDivision || focusedChildId)) {
    return cameraId === MACHINE_CAMERA_ID.WORLD
      ? MACHINE_CAMERA_MODE.POD_FOCUS
      : MACHINE_CAMERA_MODE.DIVISION_FOCUS;
  }
  if (cameraId === MACHINE_CAMERA_ID.WORKSPACE) {
    return MACHINE_CAMERA_MODE.CORE_FOCUS;
  }
  if (
    hierarchyOpen
    || cameraId === MACHINE_CAMERA_ID.SEAT
    || cameraId === MACHINE_CAMERA_ID.DETAIL
  ) {
    return MACHINE_CAMERA_MODE.POD_FOCUS;
  }
  return MACHINE_CAMERA_MODE.WORLD_OVERVIEW;
}

export function deriveMachineCameraSpec({
  cameraId = MACHINE_CAMERA_ID.WORLD,
  mode = null,
  worldSubject = null,
  podSubject = null,
  divisionSubject = null,
  coreSubject = null,
  facilitySubject = null,
  parentSubject = null,
  viewport = { width: 1, height: 1 },
  reducedMotion = false,
} = {}) {
  const resolvedMode = mode || resolveMachineCameraMode({ cameraId });
  const subject = chooseSubject({
    mode: resolvedMode,
    worldSubject,
    podSubject,
    divisionSubject,
    coreSubject,
    facilitySubject,
    parentSubject,
  });
  const span = subjectSpan(subject);
  const aspect = finite(viewport.width, 1) / Math.max(1, finite(viewport.height, 1));
  const narrow = aspect < 0.8;
  const compact = aspect < 1.1;

  let distance = clamp(
    span * (
      resolvedMode === MACHINE_CAMERA_MODE.DIVISION_FOCUS
      || resolvedMode === MACHINE_CAMERA_MODE.EXPANSION_FOLLOW
        ? 1.55
        : resolvedMode === MACHINE_CAMERA_MODE.POD_FOCUS
          ? 1.35
          : resolvedMode === MACHINE_CAMERA_MODE.CORE_FOCUS
            ? 1.28
          : resolvedMode === MACHINE_CAMERA_MODE.FACILITY_FOCUS
            ? 1.48
            : 1.12
    ) + (resolvedMode === MACHINE_CAMERA_MODE.WORLD_OVERVIEW ? 6 : 3.5),
    8,
    22,
  );

  if (resolvedMode === MACHINE_CAMERA_MODE.RETURN_TO_WORLD) distance = Math.max(distance, 12);
  if (narrow) distance *= 1.25;
  else if (compact) distance *= 1.10;

  let pitch = resolvedMode === MACHINE_CAMERA_MODE.FACILITY_FOCUS
    ? Math.max(2.6, distance * 0.30)
    : resolvedMode === MACHINE_CAMERA_MODE.DIVISION_FOCUS
      || resolvedMode === MACHINE_CAMERA_MODE.EXPANSION_FOLLOW
        ? Math.max(2.2, distance * 0.27)
        : Math.max(2.8, distance * 0.34);

  let bearing = 0.10;

  if (resolvedMode === MACHINE_CAMERA_MODE.FACILITY_FOCUS && validSubject(facilitySubject)) {
    bearing = Math.atan2(
      finite(facilitySubject.center.x),
      finite(facilitySubject.center.z),
    ) + 0.10;
  } else if (
    validSubject(subject)
    && resolvedMode !== MACHINE_CAMERA_MODE.WORLD_OVERVIEW
    && resolvedMode !== MACHINE_CAMERA_MODE.RETURN_TO_WORLD
  ) {
    bearing = Math.atan2(
      finite(subject.center.x),
      finite(subject.center.z),
    ) + 0.10;
  }

  if (cameraId === MACHINE_CAMERA_ID.OVERHEAD) {
    pitch = 0.8;
    bearing = 0.10;
    distance = Math.max(distance, 13);
  }

  return Object.freeze({
    ...rootContext('S10:CAMERA-SPEC:' + String(cameraId || MACHINE_CAMERA_ID.WORLD)),
    cameraId: String(cameraId || MACHINE_CAMERA_ID.WORLD),
    mode: resolvedMode,
    target: Object.freeze(validSubject(subject)
      ? { ...subject.center }
      : { x: 0, y: 0.5, z: 0 }),
    radius: distance,
    pitch,
    bearing,
    fov: narrow ? 48 : resolvedMode === MACHINE_CAMERA_MODE.DIVISION_FOCUS ? 40 : 44,
    subjectEnvelope: validSubject(subject)
      ? Object.freeze({ min: { ...subject.min }, max: { ...subject.max } })
      : null,
    reducedMotion: Boolean(reducedMotion),
    presentationOnly: true,
  });
}
