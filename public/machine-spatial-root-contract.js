/**
 * TEAM-EXPERIENCE-029 spatial construction root contract.
 *
 * This module is semantic and geometry-neutral. It defines the inheritance
 * boundary every spatial assembly carries; it is not a Product Law, geometry,
 * topology, backend, or theme authority.
 */

export const SPATIAL_SLICE_PHASES = Object.freeze([
  Object.freeze({ from: 0, to: 10, layer: 'structural-root' }),
  Object.freeze({ from: 11, to: 21, layer: 'product-runtime' }),
  Object.freeze({ from: 22, to: 29, layer: 'world-expression' }),
  Object.freeze({ from: 30, to: 33, layer: 'verification-acceptance' }),
]);

const MAX_SPATIAL_SLICE = SPATIAL_SLICE_PHASES.at(-1).to;

export const SPATIAL_SLICE_PLAN = Object.freeze(
  Array.from({ length: MAX_SPATIAL_SLICE + 1 }, (_, index) => {
    const phase = SPATIAL_SLICE_PHASES.find(({ from, to }) => index >= from && index <= to);
    return Object.freeze({
      slice: `S${index}`,
      layer: phase?.layer || null,
    });
  }),
);

export const STRUCTURAL_ROOT_SLICES = Object.freeze(
  SPATIAL_SLICE_PLAN.filter(({ layer }) => layer === 'structural-root').map(({ slice }) => slice),
);

export const PRODUCT_RUNTIME_SLICES = Object.freeze(
  SPATIAL_SLICE_PLAN.filter(({ layer }) => layer === 'product-runtime').map(({ slice }) => slice),
);

export const WORLD_EXPRESSION_SLICES = Object.freeze(
  SPATIAL_SLICE_PLAN.filter(({ layer }) => layer === 'world-expression').map(({ slice }) => slice),
);

export const FINAL_PROOF_SLICES = Object.freeze(
  SPATIAL_SLICE_PLAN.filter(({ layer }) => layer === 'verification-acceptance').map(({ slice }) => slice),
);

function parseSliceNumber(slice) {
  const match = String(slice || '').trim().toUpperCase().match(/^S(\d+)$/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isInteger(value) || value < 0 || value > MAX_SPATIAL_SLICE) return null;
  return value;
}

/**
 * Returns the structural machine roots required by a construction slice.
 *
 * S0 has no predecessor.
 * Each structural slice S1-S10 depends on the structural roots that precede it.
 * Every slice after S10 inherits the complete S0-S10 structural machine.
 */
export function requiredStructuralRootsForSlice(slice) {
  const value = parseSliceNumber(slice);
  if (value == null || value === 0) return Object.freeze([]);
  if (value <= 10) return Object.freeze(STRUCTURAL_ROOT_SLICES.slice(0, value));
  return STRUCTURAL_ROOT_SLICES;
}

export function spatialLayerForSlice(slice) {
  const value = parseSliceNumber(slice);
  return value == null ? null : SPATIAL_SLICE_PLAN[value].layer;
}

export function createSpatialConstructionContext({
  slice,
  owner,
  semanticId = null,
  semanticBoundary = 'semantic',
} = {}) {
  const normalizedSlice = parseSliceNumber(slice);
  if (normalizedSlice == null) {
    throw new Error('spatial construction context requires a valid slice');
  }

  const normalizedOwner = String(owner || '').trim();
  if (!normalizedOwner) {
    throw new Error('spatial construction context requires an owner');
  }

  return Object.freeze({
    constructionSlice: `S${normalizedSlice}`,
    constructionLayer: spatialLayerForSlice(`S${normalizedSlice}`),
    constructionOwner: normalizedOwner,
    semanticId: semanticId == null ? null : String(semanticId),
    semanticBoundary: semanticBoundary === 'presentation-only' ? 'presentation-only' : 'semantic',
    inheritedStructuralRoots: requiredStructuralRootsForSlice(`S${normalizedSlice}`),
  });
}

export function withSpatialConstructionContext(target, context) {
  if (!target || typeof target !== 'object') {
    throw new Error('spatial construction target must be an object');
  }
  const resolved = context?.constructionSlice
    ? context
    : createSpatialConstructionContext(context || {});

  return Object.freeze({
    ...target,
    constructionSlice: resolved.constructionSlice,
    constructionLayer: resolved.constructionLayer,
    constructionOwner: resolved.constructionOwner,
    semanticBoundary: resolved.semanticBoundary,
    inheritedStructuralRoots: resolved.inheritedStructuralRoots,
  });
}

export function validateSpatialConstructionNode(node = {}) {
  const reasons = [];
  const normalizedSlice = String(node.constructionSlice || '').trim().toUpperCase();
  const sliceNumber = parseSliceNumber(normalizedSlice);

  if (sliceNumber == null) reasons.push('MISSING_CONSTRUCTION_SLICE');
  if (!String(node.constructionOwner || '').trim()) reasons.push('MISSING_CONSTRUCTION_OWNER');

  const semanticBoundary = node.semanticBoundary === 'presentation-only'
    ? 'presentation-only'
    : 'semantic';

  if (!node.semanticId && semanticBoundary !== 'presentation-only') {
    reasons.push('MISSING_SEMANTIC_ID');
  }

  if (sliceNumber != null) {
    const expectedRoots = requiredStructuralRootsForSlice(normalizedSlice);
    const actualRoots = Array.isArray(node.inheritedStructuralRoots)
      ? node.inheritedStructuralRoots
      : [];

    if (
      expectedRoots.length !== actualRoots.length
      || expectedRoots.some((root, index) => root !== actualRoots[index])
    ) {
      reasons.push('STRUCTURAL_ROOT_INHERITANCE_MISMATCH');
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    constructionSlice: sliceNumber == null ? null : normalizedSlice,
    constructionLayer: sliceNumber == null ? null : spatialLayerForSlice(normalizedSlice),
    inheritedStructuralRoots: Object.freeze(requiredStructuralRootsForSlice(normalizedSlice)),
  });
}

const CORE_PART_ROOTS = Object.freeze({
  hub: Object.freeze({
    constructionSlice: 'S2',
    constructionOwner: 'frontend/spatial/hero-workspace-core.js',
  }),
  'inner-pod': Object.freeze({
    constructionSlice: 'S3',
    constructionOwner: 'frontend/spatial/machine-pod-assembly.js',
  }),
  'outer-housing': Object.freeze({
    constructionSlice: 'S7',
    constructionOwner: 'frontend/spatial/machine-core-layout.js',
  }),
});

function validateCorePartRoot(part) {
  const expected = CORE_PART_ROOTS[part?.kind];
  if (!expected) return Object.freeze([]);

  const reasons = [];
  if (part.constructionSlice !== expected.constructionSlice) {
    reasons.push('CORE_PART_CONSTRUCTION_SLICE_MISMATCH');
  }
  if (part.constructionOwner !== expected.constructionOwner) {
    reasons.push('CORE_PART_CONSTRUCTION_OWNER_MISMATCH');
  }
  return Object.freeze(reasons);
}

export function validateSpatialRootedCore(core = {}) {
  const reasons = [];
  const parts = Array.isArray(core.parts) ? core.parts : [];
  const connections = Array.isArray(core.connections) ? core.connections : [];

  const hubCount = parts.filter((part) => part?.kind === 'hub').length;
  const podCount = parts.filter((part) => part?.kind === 'inner-pod').length;
  const outerCount = parts.filter((part) => part?.kind === 'outer-housing').length;

  if (hubCount !== 1) reasons.push('S2_HUB_ROOT_NOT_PROVEN');
  if (podCount < 1) reasons.push('S3_POD_ROOT_NOT_PROVEN');
  if (outerCount !== 4) reasons.push('S7_FACILITY_ROOT_NOT_PROVEN');
  if (connections.length < 1) reasons.push('S8_TOPOLOGY_ROOT_NOT_PROVEN');

  for (const part of parts) {
    const nodeValidation = validateSpatialConstructionNode(part);
    if (!nodeValidation.valid) {
      reasons.push(...nodeValidation.reasons.map((reason) => `${part?.id || 'unknown'}:${reason}`));
    }
    reasons.push(...validateCorePartRoot(part).map((reason) => `${part?.id || 'unknown'}:${reason}`));
  }

  for (const connection of connections) {
    const nodeValidation = validateSpatialConstructionNode({
      ...connection,
      semanticId: connection.semanticEdgeId,
    });
    if (!nodeValidation.valid) {
      reasons.push(...nodeValidation.reasons.map((reason) => `${connection?.id || 'unknown'}:${reason}`));
    }
    if (connection?.constructionSlice !== 'S8') {
      reasons.push(`${connection?.id || 'unknown'}:CONNECTION_NOT_ROOTED_AT_S8`);
    }
    if (connection?.constructionOwner !== 'frontend/spatial/machine-core-topology.js') {
      reasons.push(`${connection?.id || 'unknown'}:CONNECTION_NOT_OWNED_BY_TOPOLOGY_ROOT`);
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}
