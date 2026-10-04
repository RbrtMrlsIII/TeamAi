/**
 * TEAM-EXPERIENCE-029 / S3
 * Canonical authored Pod shell profile.
 *
 * Presentation-neutral geometry vocabulary owned by S3 and consumed by
 * renderer adapters. This prevents raw WebGL and Three.js from carrying
 * divergent copies of the same authored silhouette.
 */
export const MACHINE_POD_SHELL_PROFILE = 'authored-seat-pod-shell';

export const MACHINE_POD_SHELL_OUTLINE = Object.freeze([
  Object.freeze([-0.90, 0.00]),
  Object.freeze([-0.78, -0.35]),
  Object.freeze([-0.45, -0.55]),
  Object.freeze([0.00, -0.60]),
  Object.freeze([0.45, -0.55]),
  Object.freeze([0.78, -0.35]),
  Object.freeze([0.90, 0.00]),
  Object.freeze([0.78, 0.35]),
  Object.freeze([0.45, 0.55]),
  Object.freeze([0.00, 0.60]),
  Object.freeze([-0.45, 0.55]),
  Object.freeze([-0.78, 0.35]),
]);

export const MACHINE_POD_SHELL_OUTLINE_BOUNDS = Object.freeze({
  width: 1.80,
  depth: 1.20,
});

export function getMachinePodShellOutline() {
  return Object.freeze(
    MACHINE_POD_SHELL_OUTLINE.map(([x, z]) => Object.freeze([x, z])),
  );
}
