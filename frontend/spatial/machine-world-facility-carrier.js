/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only articulated carrier projection for existing outer-spine routes.
 *
 * The semantic route and its endpoints remain owned by S8 topology. This module
 * only turns the route into a staged mechanical carrier with derived hinges.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_FACILITY_CARRIER_ID = 'MACHINE-WORLD-FACILITY-CARRIER';
export const MACHINE_WORLD_FACILITY_CARRIER_VERSION = 'S8-FACILITY-CARRIER-V1';

const EDGE_KIND = 'outer-spine';
const STAGE_FRACTIONS = Object.freeze([0.08, 0.38, 0.72, 1]);
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S8',
    owner: 'frontend/spatial/machine-world-facility-carrier.js',
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function distance(a, b) {
  return Math.hypot(
    finite(b?.x) - finite(a?.x),
    finite(b?.y) - finite(a?.y),
    finite(b?.z) - finite(a?.z),
  );
}

function pointOnRoute(route, fraction) {
  const points = Array.isArray(route) ? route.filter(Boolean) : [];
  if (points.length < 2) return null;

  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const length = distance(points[index - 1], points[index]);
    lengths.push(length);
    total += length;
  }
  if (!(total > 0)) return null;

  const target = Math.max(0, Math.min(1, Number(fraction) || 0)) * total;
  let traversed = 0;
  for (let index = 1; index < points.length; index += 1) {
    const length = lengths[index - 1];
    if (target <= traversed + length || index === points.length - 1) {
      const t = length > 0 ? (target - traversed) / length : 0;
      const start = points[index - 1];
      const end = points[index];
      return Object.freeze({
        x: finite(start.x) + (finite(end.x) - finite(start.x)) * t,
        y: finite(start.y) + (finite(end.y) - finite(start.y)) * t,
        z: finite(start.z) + (finite(end.z) - finite(start.z)) * t,
      });
    }
    traversed += length;
  }
  return Object.freeze({ ...points.at(-1) });
}

function stageRadius(index) {
  return [0.12, 0.105, 0.09][Math.max(0, Math.min(2, index))];
}

function stageDescriptor(edge, index, start, end) {
  const dx = finite(end.x) - finite(start.x);
  const dz = finite(end.z) - finite(start.z);
  const horizontal = Math.hypot(dx, dz);
  if (horizontal < 0.06) return null;
  return Object.freeze({
    id: 'FACILITY-CARRIER:' + edge.semanticEdgeId + ':STAGE:' + index,
    semanticId: edge.semanticEdgeId,
    shape: 'BOX',
    profile: 'facility-carrier-stage-' + index,
    center: Object.freeze({
      x: (finite(start.x) + finite(end.x)) * 0.5,
      y: (finite(start.y) + finite(end.y)) * 0.5,
      z: (finite(start.z) + finite(end.z)) * 0.5,
    }),
    dimensions: Object.freeze({
      x: Math.max(0.08, horizontal),
      y: stageRadius(index) * 1.65,
      z: stageRadius(index) * 2.20,
    }),
    rotationY: Math.atan2(dz, dx),
    materialRole: 'metal2',
    constructionSlice: 'S8',
    constructionOwner: 'frontend/spatial/machine-world-facility-carrier.js',
    semanticEdgeId: edge.semanticEdgeId,
    edgeKind: EDGE_KIND,
    carrierStage: index,
    routeContinuous: true,
    presentationOnly: true,
    ...rootContext('FACILITY-CARRIER:' + edge.semanticEdgeId + ':STAGE:' + index),
  });
}

function hingeDescriptor(edge, index, point) {
  return Object.freeze({
    id: 'FACILITY-CARRIER:' + edge.semanticEdgeId + ':HINGE:' + index,
    semanticId: edge.semanticEdgeId,
    shape: 'TORUS',
    profile: 'facility-carrier-hinge',
    center: Object.freeze({ ...point }),
    dimensions: Object.freeze({ x: 0.72, y: 0.14, z: 0.72 }),
    rotationY: 0,
    materialRole: 'metal2',
    constructionSlice: 'S8',
    constructionOwner: 'frontend/spatial/machine-world-facility-carrier.js',
    semanticEdgeId: edge.semanticEdgeId,
    edgeKind: EDGE_KIND,
    carrierStage: index,
    routeContinuous: true,
    presentationOnly: true,
    ...rootContext('FACILITY-CARRIER:' + edge.semanticEdgeId + ':HINGE:' + index),
  });
}

export function deriveMachineWorldFacilityCarrierDescriptors(
  topology,
  { mode = 'WORLD_OVERVIEW' } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);

  const descriptors = [];
  for (const edge of Array.isArray(topology?.edges) ? topology.edges : []) {
    if (
      edge?.kind !== EDGE_KIND
      || edge?.routeContinuous !== true
      || !edge?.semanticEdgeId
      || !Array.isArray(edge?.route)
      || edge.route.length < 2
    ) continue;

    const points = STAGE_FRACTIONS.map((fraction) => pointOnRoute(edge.route, fraction));
    if (points.some((point) => !point)) continue;

    for (let index = 1; index < points.length; index += 1) {
      const descriptor = stageDescriptor(edge, index - 1, points[index - 1], points[index]);
      if (descriptor) descriptors.push(descriptor);
    }
    for (let index = 1; index < STAGE_FRACTIONS.length - 1; index += 1) {
      descriptors.push(hingeDescriptor(edge, index, points[index]));
    }
  }

  return Object.freeze(descriptors);
}

export function validateMachineWorldFacilityCarrierDescriptors(
  descriptors = [],
  { topology = null } = {},
) {
  const reasons = [];
  const list = Array.isArray(descriptors) ? descriptors : [];
  const routeIds = new Set(
    (Array.isArray(topology?.edges) ? topology.edges : [])
      .filter((edge) => edge?.kind === EDGE_KIND && edge?.routeContinuous === true)
      .map((edge) => edge.semanticEdgeId)
      .filter(Boolean),
  );
  const seen = new Set();

  for (const descriptor of list) {
    if (!descriptor?.id) reasons.push('MISSING_DESCRIPTOR_ID');
    if (descriptor?.id && seen.has(descriptor.id)) reasons.push('DUPLICATE_DESCRIPTOR_ID:' + descriptor.id);
    if (descriptor?.id) seen.add(descriptor.id);
    if (!routeIds.has(descriptor?.semanticEdgeId)) {
      reasons.push((descriptor?.id || 'unknown') + ':SOURCE_EDGE_NOT_FOUND');
    }
    if (descriptor?.constructionSlice !== 'S8') reasons.push((descriptor?.id || 'unknown') + ':NOT_S8');
    if (descriptor?.presentationOnly !== true) reasons.push((descriptor?.id || 'unknown') + ':NOT_PRESENTATION_ONLY');
    if (descriptor?.routeContinuous !== true) reasons.push((descriptor?.id || 'unknown') + ':ROUTE_NOT_CONTINUOUS');
    if (!descriptor?.center || ![descriptor.center.x, descriptor.center.y, descriptor.center.z].every(Number.isFinite)) {
      reasons.push((descriptor?.id || 'unknown') + ':NONFINITE_CENTER');
    }
    if (!descriptor?.dimensions || ![descriptor.dimensions.x, descriptor.dimensions.y, descriptor.dimensions.z].every(Number.isFinite)) {
      reasons.push((descriptor?.id || 'unknown') + ':NONFINITE_DIMENSIONS');
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    descriptorCount: list.length,
  });
}
