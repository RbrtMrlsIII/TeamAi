/**
 * Cam-4 — proportional edge-drag + swipe whole-web PoV (presentation only).
 * Authority: TEAMAI_029_EXPERIENCE_REBASELINE.md C7.
 * no 029-released claim.
 */

export const EDGE_ZONE_FRAC = 0.08;
export const EDGE_YAW_RATE = 0.55;
export const EDGE_PITCH_RATE = 0.35;
export const EDGE_PITCH_MIN = -0.45;
export const EDGE_PITCH_MAX = 0.55;
export const PROPORTIONAL_SWIPE_YAW = Math.PI;
export const PROPORTIONAL_SWIPE_PITCH = 1.2;

export function pointerNorm(clientX, clientY, width, height) {
  const w = Math.max(1, Number(width) || 1);
  const h = Math.max(1, Number(height) || 1);
  return {
    nx: Math.max(0, Math.min(1, clientX / w)),
    ny: Math.max(0, Math.min(1, clientY / h)),
  };
}

export function edgePressure(nx, ny, zoneFrac = EDGE_ZONE_FRAC) {
  const z = Math.max(0.02, Math.min(0.25, Number(zoneFrac) || EDGE_ZONE_FRAC));
  let px = 0;
  let py = 0;
  if (nx < z) px = -((z - nx) / z);
  else if (nx > 1 - z) px = (nx - (1 - z)) / z;
  if (ny < z) py = -((z - ny) / z);
  else if (ny > 1 - z) py = (ny - (1 - z)) / z;
  return { px: Math.max(-1, Math.min(1, px)), py: Math.max(-1, Math.min(1, py)) };
}

export function edgeDriftDelta(pressure, dtSec, { reducedMotion = false } = {}) {
  if (reducedMotion) return { dYaw: 0, dPitch: 0 };
  const dt = Math.max(0, Math.min(0.05, Number(dtSec) || 0));
  const px = pressure?.px || 0;
  const py = pressure?.py || 0;
  return {
    dYaw: px * EDGE_YAW_RATE * dt,
    dPitch: py * EDGE_PITCH_RATE * dt,
  };
}

/** Natural mapping: swipe right → orbit right; swipe up → pitch up. */
export function proportionalSwipeDelta(dxNorm, dyNorm, {
  yawScale = PROPORTIONAL_SWIPE_YAW,
  pitchScale = PROPORTIONAL_SWIPE_PITCH,
} = {}) {
  const dx = Number(dxNorm) || 0;
  const dy = Number(dyNorm) || 0;
  return {
    dYaw: dx * yawScale,
    dPitch: dy * pitchScale,
  };
}

/* Backward-named export for source compatibility only. It now uses proportional semantics. */
export const inverseSwipeDelta = proportionalSwipeDelta;

export function clampPitch(pitch) {
  const p = Number(pitch) || 0;
  return Math.max(EDGE_PITCH_MIN, Math.min(EDGE_PITCH_MAX, p));
}
