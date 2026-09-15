/**
 * Semantic camera authority contract.
 *
 * Camera configuration may select a named camera, but semantic subject identity
 * and target are independently derived from the active machine transition.
 * Presentation-only: no provider, authorization, scheduler, or durable-domain authority.
 */

export const HERO_WORLD_BASELINE_CAMERA_ID = 'HERO_WIDE';

function validPoint(point) {
  return point && Number.isFinite(Number(point.x))
    && Number.isFinite(Number(point.y))
    && Number.isFinite(Number(point.z));
}

export function resolveHeroCameraId({
  requestedCameraId,
  hierarchyCameraId,
  baselineCameraId = HERO_WORLD_BASELINE_CAMERA_ID,
} = {}) {
  const requested = String(requestedCameraId || '').trim();
  if (requested) return requested;

  const hierarchy = String(hierarchyCameraId || '').trim();
  if (hierarchy) return hierarchy;

  const baseline = String(baselineCameraId || HERO_WORLD_BASELINE_CAMERA_ID).trim();
  return baseline || HERO_WORLD_BASELINE_CAMERA_ID;
}

export function resolveHeroCameraTarget({ subject, fallbackTarget } = {}) {
  if (validPoint(subject?.center)) {
    return {
      x: Number(subject.center.x),
      y: Number(subject.center.y),
      z: Number(subject.center.z),
      source: 'semantic-subject',
    };
  }

  if (validPoint(fallbackTarget)) {
    return {
      x: Number(fallbackTarget.x),
      y: Number(fallbackTarget.y),
      z: Number(fallbackTarget.z),
      source: 'camera-configuration',
    };
  }

  return null;
}

export function resolveHeroCameraState({
  requestedCameraId,
  hierarchyCameraId,
  baselineCameraId,
  subject,
  fallbackTarget,
} = {}) {
  return {
    cameraId: resolveHeroCameraId({ requestedCameraId, hierarchyCameraId, baselineCameraId }),
    target: resolveHeroCameraTarget({ subject, fallbackTarget }),
  };
}
