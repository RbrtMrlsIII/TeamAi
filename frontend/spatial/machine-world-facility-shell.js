/**
 * TEAM-EXPERIENCE-029 / S7
 * Presentation-only body shells for the four authored outer modules.
 *
 * The authoritative outer-housing center, dimensions, silhouette, and interface
 * remain owned by S7/S8. This module only gives the existing housing a coherent
 * visible body in the structural World preview.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_FACILITY_SHELL_ID = 'MACHINE-WORLD-FACILITY-SHELL';
export const MACHINE_WORLD_FACILITY_SHELL_VERSION = 'S7-OUTER-BODY-V2';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const BODY_SCALE = 1.22;

// Authored faceted silhouettes keep the existing S7 housing envelope while
// replacing the legacy box-like presentation with manufactured machine bodies.
// The normalized outlines are intentionally asymmetric/chamfered and are
// consumed by the Three.js adapter as presentation geometry only.
export const MACHINE_WORLD_FACILITY_BODY_OUTLINES = Object.freeze({
  fin: Object.freeze([
    [-0.82, -0.52], [-0.42, -0.90], [0.34, -0.82], [0.90, -0.34],
    [0.76, 0.36], [0.30, 0.88], [-0.40, 0.72], [-0.86, 0.18],
  ]),
  arc: Object.freeze([
    [-0.84, -0.36], [-0.56, -0.76], [0.08, -0.94], [0.72, -0.62],
    [0.90, -0.02], [0.66, 0.66], [0.10, 0.90], [-0.66, 0.64],
  ]),
  diamond: Object.freeze([
    [-0.06, -1.00], [0.62, -0.68], [1.00, -0.05], [0.66, 0.60],
    [0.10, 1.00], [-0.62, 0.66], [-1.00, 0.02], [-0.66, -0.64],
  ]),
  blade: Object.freeze([
    [-0.82, -0.70], [-0.18, -0.92], [0.50, -0.76], [0.92, -0.28],
    [0.72, 0.22], [0.30, 0.92], [-0.48, 0.74], [-0.90, 0.12],
  ]),
});


export function getMachineWorldFacilityBodyOutline(silhouette) {
  return MACHINE_WORLD_FACILITY_BODY_OUTLINES[String(silhouette || '')] || null;
}

const scale = (value, factor, minimum = 0.06) =>
  Math.max(minimum, finite(value, minimum) * factor);

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S7',
    owner: 'frontend/spatial/machine-world-facility-shell.js',
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function deriveShell(entry) {
  const housing = entry?.outerHousing;
  if (!housing?.center || !housing?.dimensions || !entry?.branchId) return [];

  const angle = Math.atan2(
    finite(housing.center.z),
    finite(housing.center.x),
  );
  const silhouetteByMachineRole = {
    analysis: 'fin',
    operations: 'arc',
    control: 'diamond',
    'access-commerce': 'blade',
  };
  const silhouette = String(entry.silhouette || housing.silhouette || silhouetteByMachineRole[entry.machineRole] || 'arc');

  const profiles = {
    fin: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.08 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.12 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.14 * BODY_SCALE),
      },
      rotationY: angle,
    },
    arc: {
      shape: 'CYLINDER',
      dimensions: {
        x: scale(housing.dimensions.x, 1.06 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.10 * BODY_SCALE),
        z: scale(housing.dimensions.x, 1.06 * BODY_SCALE),
      },
      rotationY: 0,
    },
    diamond: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.04 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.10 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.04 * BODY_SCALE),
      },
      rotationY: angle + Math.PI * 0.25,
    },
    blade: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.10 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.14 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.06 * BODY_SCALE),
      },
      rotationY: angle,
    },
  }[silhouette] || null;

  if (!profiles) return [];

  const body = {
    id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':MAIN',
    semanticId: entry.branchId,
    role: 'facility-body-shell',
    shape: 'FACILITY_FACETED_BODY',
    profile: 'facility-body-' + silhouette,
    center: Object.freeze({ ...housing.center }),
    depthOffset: 0,
    dimensions: Object.freeze(profiles.dimensions),
    rotationY: finite(profiles.rotationY),
    materialRole: 'metal2',
    outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
    constructionSlice: 'S7',
    constructionOwner: 'frontend/spatial/machine-world-facility-shell.js',
    branchId: entry.branchId,
    silhouette,
    layer: 'main-shell',
    presentationOnly: true,
    ...rootContext('FACILITY-BODY:' + entry.branchId + ':MAIN'),
  };

  const bodyWidth = Number(body.dimensions.x);
  const bodyDepth = Number(body.dimensions.z);
  const bodyHeight = Number(body.dimensions.y);
  const bodyMin = Math.min(bodyWidth, bodyDepth);
  const radial = { x: Math.cos(angle), z: Math.sin(angle) };
  const depthOffset = (fraction) => bodyMin * fraction;

  const layered = [
    body,
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':BASE',
      profile: 'facility-body-' + silhouette + '-base',
      center: Object.freeze({
        x: housing.center.x - radial.x * depthOffset(0.12),
        y: housing.center.y - bodyHeight * 0.39,
        z: housing.center.z - radial.z * depthOffset(0.12),
      }),
      depthOffset: -depthOffset(0.12),
      dimensions: Object.freeze({
        x: bodyWidth * 0.78,
        y: Math.max(0.08, bodyHeight * 0.12),
        z: bodyDepth * 0.78,
      }),
      layer: 'base-collar',
      materialRole: 'metal',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':BASE'),
    }),
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':SHOULDER',
      profile: 'facility-body-' + silhouette + '-shoulder',
      center: Object.freeze({
        x: housing.center.x + radial.x * depthOffset(0.05),
        y: housing.center.y + bodyHeight * 0.29,
        z: housing.center.z + radial.z * depthOffset(0.05),
      }),
      depthOffset: depthOffset(0.05),
      dimensions: Object.freeze({
        x: bodyWidth * 0.84,
        y: Math.max(0.08, bodyHeight * 0.13),
        z: bodyDepth * 0.84,
      }),
      layer: 'shoulder-plate',
      materialRole: 'metal2',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':SHOULDER'),
    }),
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':CAP',
      profile: 'facility-body-' + silhouette + '-cap',
      center: Object.freeze({
        x: housing.center.x + radial.x * depthOffset(0.12),
        y: housing.center.y + bodyHeight * 0.41,
        z: housing.center.z + radial.z * depthOffset(0.12),
      }),
      depthOffset: depthOffset(0.12),
      dimensions: Object.freeze({
        x: bodyWidth * 0.58,
        y: Math.max(0.08, bodyHeight * 0.08),
        z: bodyDepth * 0.58,
      }),
      rotationY: 0,
      layer: 'upper-cap',
      materialRole: 'glass',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':CAP'),
    }),
  ];

  const coreProfiles = {
    analysis: {
      center: Object.freeze({
        x: housing.center.x + Math.cos(angle) * bodyMin * 0.12,
        y: housing.center.y + bodyHeight * 0.06,
        z: housing.center.z + Math.sin(angle) * bodyMin * 0.12,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.34,
        y: Math.max(0.10, bodyHeight * 0.34),
        z: bodyMin * 0.34,
      }),
      shape: 'CYLINDER',
      materialRole: 'glass',
      rotationY: angle,
    },
    operations: {
      center: Object.freeze({
        x: housing.center.x,
        y: housing.center.y + bodyHeight * 0.08,
        z: housing.center.z,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.32,
        y: Math.max(0.10, bodyHeight * 0.42),
        z: bodyMin * 0.20,
      }),
      shape: 'BOX',
      materialRole: 'metal2',
      rotationY: angle,
    },
    control: {
      center: Object.freeze({
        x: housing.center.x,
        y: housing.center.y + bodyHeight * 0.06,
        z: housing.center.z,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.40,
        y: Math.max(0.10, bodyHeight * 0.30),
        z: bodyMin * 0.40,
      }),
      shape: 'CYLINDER',
      materialRole: 'energy',
      rotationY: 0,
    },
    'access-commerce': {
      center: Object.freeze({
        x: housing.center.x + Math.cos(angle) * bodyMin * 0.08,
        y: housing.center.y + bodyHeight * 0.17,
        z: housing.center.z + Math.sin(angle) * bodyMin * 0.08,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.20,
        y: Math.max(0.10, bodyHeight * 0.52),
        z: bodyMin * 0.20,
      }),
      shape: 'CYLINDER',
      materialRole: 'glass',
      rotationY: 0,
    },
  };

  const core = coreProfiles[entry.machineRole] || coreProfiles.control;
  layered.push(Object.freeze({
    ...body,
    id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':CORE',
    profile: 'facility-body-core-' + entry.machineRole,
    shape: core.shape,
    center: core.center,
    depthOffset: Math.cos(angle) * (core.center.x - housing.center.x)
      + Math.sin(angle) * (core.center.z - housing.center.z),
    dimensions: core.dimensions,
    rotationY: finite(core.rotationY),
    materialRole: core.materialRole,
    outline: null,
    layer: 'mechanism-housing',
    ...rootContext('FACILITY-BODY:' + entry.branchId + ':CORE'),
  }));

  return layered;
}

export function deriveMachineWorldFacilityShellDescriptors(
  facilities,
  { mode = 'WORLD_OVERVIEW' } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);
  return Object.freeze(
    (Array.isArray(facilities) ? facilities : [])
      .flatMap(deriveShell),
  );
}

export function validateMachineWorldFacilityShellDescriptors(descriptors = []) {
  const reasons = [];
  const list = Array.isArray(descriptors) ? descriptors : [];
  const seen = new Set();

  for (const descriptor of list) {
    const id = descriptor?.id || 'unknown';
    if (seen.has(id)) reasons.push('DUPLICATE_ID:' + id);
    seen.add(id);
    if (descriptor?.constructionSlice !== 'S7') reasons.push(id + ':NOT_S7');
    if (descriptor?.constructionOwner !== 'frontend/spatial/machine-world-facility-shell.js') reasons.push(id + ':OWNER_MISMATCH');
    if (descriptor?.presentationOnly !== true) reasons.push(id + ':NOT_PRESENTATION_ONLY');
    if (!descriptor?.branchId) reasons.push(id + ':MISSING_BRANCH_ID');
    if (!descriptor?.center || !['x','y','z'].every((axis) => Number.isFinite(Number(descriptor.center[axis])))) {
      reasons.push(id + ':NONFINITE_CENTER');
    }
    if (!descriptor?.dimensions || !['x','y','z'].every((axis) => Number(descriptor.dimensions[axis]) > 0)) {
      reasons.push(id + ':INVALID_DIMENSIONS');
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    descriptorCount: list.length,
  });
}