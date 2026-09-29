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
  Object.freeze([-0.90, -0.25]),
  Object.freeze([-0.55, -0.58]),
  Object.freeze([0.18, -0.62]),
  Object.freeze([0.78, -0.30]),
  Object.freeze([0.90, 0.12]),
  Object.freeze([0.50, 0.50]),
  Object.freeze([-0.30, 0.58]),
  Object.freeze([-0.82, 0.30]),
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
