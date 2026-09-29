/**
 * TEAM-EXPERIENCE-029 / S4
 * Presentation-neutral authored profile/construction contracts for Seat divisions.
 *
 * This module owns renderer-facing shape identity and manufactured presentation
 * recipes only. It does not own semantic identity, topology, semantic dimensions,
 * attachment travel, authorization, or durable runtime state.
 */

export const MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE = 'authorization-shield';
export const MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE = 'S4_AUTHORIZATION_SHIELD';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE = 'rule-baffles';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE = 'S4_BEHAVIOR_BAFFLE';
export const MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE = 'scope-frame';
export const MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE = 'S4_WORKSPACE_SCOPE_FRAME';
export const MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RAIL_RENDER_SHAPE = 'S4_SCOPE_FRAME_RAIL';

const AUTHORIZATION_SHIELD_OUTLINE = Object.freeze([
  Object.freeze([-0.78, -0.54]),
  Object.freeze([0.00, -0.78]),
  Object.freeze([0.78, -0.54]),
  Object.freeze([0.68, 0.30]),
  Object.freeze([0.34, 0.64]),
  Object.freeze([0.00, 0.78]),
  Object.freeze([-0.34, 0.64]),
  Object.freeze([-0.68, 0.30]),
]);

export function getMachineSeatAuthorizationShieldOutline() {
  return Object.freeze(
    AUTHORIZATION_SHIELD_OUTLINE.map(([x, z]) => Object.freeze([x, z])),
  );
}

const BEHAVIOR_BAFFLE_OUTLINE = Object.freeze([
  Object.freeze([-0.58, -0.60]),
  Object.freeze([0.50, -0.60]),
  Object.freeze([0.60, -0.18]),
  Object.freeze([0.42, 0.42]),
  Object.freeze([0.16, 0.60]),
  Object.freeze([-0.48, 0.46]),
  Object.freeze([-0.60, 0.04]),
  Object.freeze([-0.60, -0.34]),
]);

export function getMachineSeatBehaviorBaffleOutline() {
  return Object.freeze(
    BEHAVIOR_BAFFLE_OUTLINE.map(([x, z]) => Object.freeze([x, z])),
  );
}

const WORKSPACE_SCOPE_FRAME_RECIPE = Object.freeze([
  Object.freeze({
    id: 'front-rail',
    center: Object.freeze({ x: 0, z: 0.43 }),
    dimensions: Object.freeze({ x: 1.00, z: 0.14 }),
    thickness: 0.14,
  }),
  Object.freeze({
    id: 'rear-rail',
    center: Object.freeze({ x: 0, z: -0.43 }),
    dimensions: Object.freeze({ x: 1.00, z: 0.14 }),
    thickness: 0.14,
  }),
  Object.freeze({
    id: 'left-rail',
    center: Object.freeze({ x: -0.43, z: 0 }),
    dimensions: Object.freeze({ x: 0.14, z: 1.00 }),
    thickness: 0.14,
  }),
  Object.freeze({
    id: 'right-rail',
    center: Object.freeze({ x: 0.43, z: 0 }),
    dimensions: Object.freeze({ x: 0.14, z: 1.00 }),
    thickness: 0.14,
  }),
]);

export function getMachineSeatWorkspaceScopeFrameRecipe() {
  return WORKSPACE_SCOPE_FRAME_RECIPE.map((entry) => Object.freeze({
    id: entry.id,
    center: Object.freeze({ ...entry.center }),
    dimensions: Object.freeze({ ...entry.dimensions }),
    thickness: entry.thickness,
  }));
}

export function resolveMachineSeatWorkspaceScopeFrameRailThickness({ dimensions = {}, rail = {} } = {}) {
  const footprint = Math.min(
    Math.abs(Number(dimensions.x) || 0),
    Math.abs(Number(dimensions.z) || 0),
  );
  const normalizedThickness = Math.max(0, Number(rail.thickness) || 0);
  return Math.max(0.001, footprint * normalizedThickness);
}

export function resolveMachineSeatDivisionProfileRecipe({ profile = '' } = {}) {
  const normalizedProfile = String(profile || '').trim().toLowerCase();
  if (normalizedProfile === MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE) {
    return getMachineSeatWorkspaceScopeFrameRecipe();
  }
  return null;
}

export function resolveMachineSeatDivisionProfileShape({
  profile = '',
  fallbackShape = '',
} = {}) {
  const normalizedProfile = String(profile || '').trim().toLowerCase();
  if (normalizedProfile === MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE) {
    return MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE;
  }
  if (normalizedProfile === MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE) {
    return MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE;
  }
  if (normalizedProfile === MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE) {
    return MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE;
  }
  return fallbackShape;
}
