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
export const MACHINE_WORLD_FACILITY_SHELL_VERSION = 'S7-OUTER-BODY-V1';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

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
  if (!housing?.center || !housing?.dimensions || !entry?.branchId) return null;

  const angle = Math.atan2(
    finite(housing.center.z),
    finite(housing.center.x),
  );
  const silhouette = String(entry.silhouette || housing.silhouette || 'arc');

  const profiles = {
    fin: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.08),
        y: scale(housing.dimensions.y, 1.12),
        z: scale(housing.dimensions.z, 1.14),
      },
      rotationY: angle,
    },
    arc: {
      shape: 'CYLINDER',
      dimensions: {
        x: scale(housing.dimensions.x, 1.06),
        y: scale(housing.dimensions.y, 1.10),
        z: scale(housing.dimensions.x, 1.06),
      },
      rotationY: 0,
    },
    diamond: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.04),
        y: scale(housing.dimensions.y, 1.10),
        z: scale(housing.dimensions.z, 1.04),
      },
      rotationY: angle + Math.PI * 0.25,
    },
    blade: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.10),
        y: scale(housing.dimensions.y, 1.14),
        z: scale(housing.dimensions.z, 1.06),
      },
      rotationY: angle,
    },
  }[silhouette] || null;

  if (!profiles) return null;

  return Object.freeze({
    id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId,
    semanticId: entry.branchId,
    shape: profiles.shape,
    profile: 'facility-body-' + silhouette,
    center: Object.freeze({ ...housing.center }),
    dimensions: Object.freeze(profiles.dimensions),
    rotationY: finite(profiles.rotationY),
    materialRole: 'metal2',
    constructionSlice: 'S7',
    constructionOwner: 'frontend/spatial/machine-world-facility-shell.js',
    branchId: entry.branchId,
    silhouette,
    presentationOnly: true,
    ...rootContext('FACILITY-BODY:' + entry.branchId),
  });
}

export function deriveMachineWorldFacilityShellDescriptors(
  facilities,
  { mode = 'WORLD_OVERVIEW' } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);
  return Object.freeze(
    (Array.isArray(facilities) ? facilities : [])
      .map(deriveShell)
      .filter(Boolean),
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