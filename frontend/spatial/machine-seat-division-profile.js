/**
 * TEAM-EXPERIENCE-029 / S4
 * Presentation-neutral authored profile contracts for Seat divisions.
 *
 * This module contains renderer-facing shape identity only. It does not own
 * semantic identity, topology, dimensions, attachment travel, authorization,
 * or durable runtime state.
 */

export const MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE = 'authorization-shield';
export const MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE = 'S4_AUTHORIZATION_SHIELD';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE = 'rule-baffles';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE = 'S4_BEHAVIOR_BAFFLE';

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
  return fallbackShape;
}
