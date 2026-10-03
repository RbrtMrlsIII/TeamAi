/**
 * TEAM-EXPERIENCE-029 / S4
 * Presentation-neutral authored profile/construction contracts for Seat divisions.
 *
 * This module owns renderer-facing shape identity and manufactured presentation
 * recipes only. It does not own semantic identity, topology, semantic dimensions,
 * attachment travel, authorization, or durable runtime state.
 */

export const MACHINE_SEAT_CONNECTION_COUPLER_PROFILE = 'coupler-ring';
export const MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE = 'S4_CONNECTION_COUPLER';
export const MACHINE_SEAT_CONNECTION_COUPLER_ELEMENT_RENDER_SHAPE = 'S4_CONNECTION_COUPLER_ELEMENT';
export const MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE = 'authorization-shield';
export const MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE = 'S4_AUTHORIZATION_SHIELD';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE = 'rule-baffles';
export const MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE = 'S4_BEHAVIOR_BAFFLE';
export const MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE = 'scope-frame';
export const MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE = 'capability-lattice';
export const MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE = 'S4_CAPABILITY_LATTICE';
export const MACHINE_SEAT_CAPABILITIES_LATTICE_ELEMENT_RENDER_SHAPE = 'S4_CAPABILITY_LATTICE_ELEMENT';
export const MACHINE_SEAT_TOOLKIT_RACK_PROFILE = 'equipment-rack';
export const MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE = 'S4_TOOLKIT_RACK';
export const MACHINE_SEAT_TOOLKIT_RACK_ELEMENT_RENDER_SHAPE = 'S4_TOOLKIT_RACK_ELEMENT';

const CAPABILITIES_LATTICE_RECIPE = Object.freeze([
  Object.freeze({ id: 'front-rail', center: Object.freeze({ x: 0, z: 0.44 }), dimensions: Object.freeze({ x: 1.00, z: 0.12 }), rotationY: 0, thickness: 0.14 }),
  Object.freeze({ id: 'rear-rail', center: Object.freeze({ x: 0, z: -0.44 }), dimensions: Object.freeze({ x: 1.00, z: 0.12 }), rotationY: 0, thickness: 0.14 }),
  Object.freeze({ id: 'left-rail', center: Object.freeze({ x: -0.44, z: 0 }), dimensions: Object.freeze({ x: 1.00, z: 0.12 }), rotationY: Math.PI * 0.5, thickness: 0.14 }),
  Object.freeze({ id: 'right-rail', center: Object.freeze({ x: 0.44, z: 0 }), dimensions: Object.freeze({ x: 1.00, z: 0.12 }), rotationY: Math.PI * 0.5, thickness: 0.14 }),
  ...Array.from({ length: 6 }, (_, index) => {
    const rotationY = index * Math.PI / 3;
    return Object.freeze({
      id: 'radial-spoke-' + String(index + 1),
      center: Object.freeze({
        x: 0.22 * Math.cos(rotationY),
        z: 0.22 * Math.sin(rotationY),
      }),
      dimensions: Object.freeze({ x: 0.44, z: 0.08 }),
      rotationY,
      thickness: 0.14,
    });
  }),
]);

export function getMachineSeatCapabilitiesLatticeRecipe() {
  return CAPABILITIES_LATTICE_RECIPE.map((entry) => Object.freeze({
    id: entry.id,
    center: Object.freeze({ ...entry.center }),
    dimensions: Object.freeze({ ...entry.dimensions }),
    rotationY: entry.rotationY,
    thickness: entry.thickness,
  }));
}

export function resolveMachineSeatCapabilitiesLatticeRailThickness({ dimensions = {}, element = {} } = {}) {
  const footprint = Math.min(
    Math.abs(Number(dimensions.x) || 0),
    Math.abs(Number(dimensions.z) || 0),
  );
  const normalizedThickness = Math.max(0, Number(element.thickness) || 0);
  return Math.max(0.001, footprint * normalizedThickness);
}

const CONNECTION_COUPLER_RECIPE = Object.freeze([
  ...Array.from({ length: 8 }, (_, index) => {
    const angle = index * Math.PI / 4;
    return Object.freeze({
      id: 'coupler-segment-' + String(index + 1),
      center: Object.freeze({
        x: 0.44 * Math.cos(angle),
        z: 0.44 * Math.sin(angle),
      }),
      dimensions: Object.freeze({ x: 0.34, z: 0.12 }),
      rotationY: angle + Math.PI * 0.5,
      thickness: 0.14,
    });
  }),
  ...Array.from({ length: 4 }, (_, index) => {
    const rotationY = index * Math.PI / 2;
    return Object.freeze({
      id: 'locking-lug-' + String(index + 1),
      center: Object.freeze({
        x: 0.40 * Math.cos(rotationY),
        z: 0.40 * Math.sin(rotationY),
      }),
      dimensions: Object.freeze({ x: 0.20, z: 0.16 }),
      rotationY,
      thickness: 0.14,
    });
  }),
]);

export function getMachineSeatConnectionCouplerRecipe() {
  return CONNECTION_COUPLER_RECIPE.map((entry) => Object.freeze({
    id: entry.id,
    center: Object.freeze({ ...entry.center }),
    dimensions: Object.freeze({ ...entry.dimensions }),
    rotationY: entry.rotationY,
    thickness: entry.thickness,
  }));
}

export function resolveMachineSeatConnectionCouplerRailThickness({ dimensions = {}, element = {} } = {}) {
  const footprint = Math.min(
    Math.abs(Number(dimensions.x) || 0),
    Math.abs(Number(dimensions.z) || 0),
  );
  const normalizedThickness = Math.max(0, Number(element.thickness) || 0);
  return Math.max(0.001, footprint * normalizedThickness);
}
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

const TOOLKIT_RACK_RECIPE = Object.freeze([
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
  Object.freeze({
    id: 'mid-shelf-front',
    center: Object.freeze({ x: 0, z: 0.145 }),
    dimensions: Object.freeze({ x: 1.00, z: 0.10 }),
    thickness: 0.14,
  }),
  Object.freeze({
    id: 'mid-shelf-rear',
    center: Object.freeze({ x: 0, z: -0.145 }),
    dimensions: Object.freeze({ x: 1.00, z: 0.10 }),
    thickness: 0.14,
  }),
]);

export function getMachineSeatToolkitRackRecipe() {
  return TOOLKIT_RACK_RECIPE.map((entry) => Object.freeze({
    id: entry.id,
    center: Object.freeze({ ...entry.center }),
    dimensions: Object.freeze({ ...entry.dimensions }),
    thickness: entry.thickness,
  }));
}

export function resolveMachineSeatToolkitRackRailThickness({ dimensions = {}, rail = {} } = {}) {
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
  if (normalizedProfile === MACHINE_SEAT_TOOLKIT_RACK_PROFILE) {
    return getMachineSeatToolkitRackRecipe();
  }
  if (normalizedProfile === MACHINE_SEAT_CONNECTION_COUPLER_PROFILE) {
    return getMachineSeatConnectionCouplerRecipe();
  }
  if (normalizedProfile === MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE) {
    return getMachineSeatCapabilitiesLatticeRecipe();
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
  if (normalizedProfile === MACHINE_SEAT_CONNECTION_COUPLER_PROFILE) {
    return MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE;
  }
  if (normalizedProfile === MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE) {
    return MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE;
  }
  if (normalizedProfile === MACHINE_SEAT_TOOLKIT_RACK_PROFILE) {
    return MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE;
  }
  if (normalizedProfile === MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE) {
    return MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE;
  }
  return fallbackShape;
}
