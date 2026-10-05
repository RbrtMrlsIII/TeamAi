/**
 * TEAM-EXPERIENCE-029 / S8
 * Volumetric presentation projection for existing Core/Facility structural routes.
 *
 * This module consumes authored S8 semantic routes. It does not create or
 * mutate topology and remains presentation-only.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

const ROOT_OWNER = 'frontend/spatial/machine-world-structural-conduit.js';
const STRUCTURAL_EDGE_KINDS = Object.freeze([
  'inner-spoke',
  'outer-spine',
  'lattice-link',
]);

const RADIUS_BY_EDGE_KIND = Object.freeze({
  'inner-spoke': 0.080,
  'outer-spine': 0.100,
  'lattice-link': 0.070,
});

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S8',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

export function getRenderableMachineWorldStructuralConduitSegments(
  topology,
  {
    mode = 'WORLD_OVERVIEW',
    branchId = null,
  } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);

  const segments = [];
  for (const edge of Array.isArray(topology?.edges) ? topology.edges : []) {
    if (!STRUCTURAL_EDGE_KINDS.includes(edge?.kind)) continue;
    if (!edge?.semanticEdgeId || edge?.routeContinuous !== true) continue;
    if (!Array.isArray(edge?.route) || edge.route.length < 2) continue;

    const radius = RADIUS_BY_EDGE_KIND[edge.kind];
    for (let index = 1; index < edge.route.length; index += 1) {
      const start = edge.route[index - 1];
      const end = edge.route[index];
      const dx = finite(end?.x) - finite(start?.x);
      const dy = finite(end?.y) - finite(start?.y);
      const dz = finite(end?.z) - finite(start?.z);
      const length = Math.hypot(dx, dy, dz);
      if (length < 0.01) continue;

      segments.push(Object.freeze({
        id: 'STRUCTURAL-CONDUIT:' + edge.semanticEdgeId + ':' + index,
        semanticEdgeId: edge.semanticEdgeId,
        edgeKind: edge.kind,
        segmentIndex: index,
        start: Object.freeze({
          x: finite(start?.x),
          y: finite(start?.y),
          z: finite(start?.z),
        }),
        end: Object.freeze({
          x: finite(end?.x),
          y: finite(end?.y),
          z: finite(end?.z),
        }),
        center: Object.freeze({
          x: (finite(start?.x) + finite(end?.x)) * 0.5,
          y: (finite(start?.y) + finite(end?.y)) * 0.5,
          z: (finite(start?.z) + finite(end?.z)) * 0.5,
        }),
        radius,
        corridorRadius: Math.max(0, radius),
        length,
        routeContinuous: true,
        structuralConduit: true,
        presentationOnly: true,
        ...rootContext('STRUCTURAL-CONDUIT:' + edge.semanticEdgeId + ':' + index),
      }));
    }
  }

  return Object.freeze(segments);
}

export function validateMachineWorldStructuralConduitSegments(
  segments = [],
  {
    topology = null,
  } = {},
) {
  const reasons = [];
  const list = Array.isArray(segments) ? segments : [];
  const topologyIds = new Set(
    (Array.isArray(topology?.edges) ? topology.edges : [])
      .filter((edge) => STRUCTURAL_EDGE_KINDS.includes(edge?.kind))
      .map((edge) => edge?.semanticEdgeId)
      .filter(Boolean),
  );

  const seen = new Set();
  for (const segment of list) {
    if (!segment?.semanticEdgeId) reasons.push('MISSING_SEMANTIC_EDGE_ID');
    if (seen.has(segment?.id)) reasons.push('DUPLICATE_SEGMENT_ID');
    if (segment?.id) seen.add(segment.id);
    if (!topologyIds.has(segment?.semanticEdgeId)) {
      reasons.push(segment?.id + ':SOURCE_EDGE_NOT_FOUND');
    }
    if (segment?.routeContinuous !== true) reasons.push(segment?.id + ':ROUTE_NOT_CONTINUOUS');
    if (segment?.structuralConduit !== true) reasons.push(segment?.id + ':NOT_STRUCTURAL_CONDUIT');
    if (!(Number(segment?.radius) > 0 && Number(segment?.radius) <= 0.12)) {
      reasons.push(segment?.id + ':RADIUS_OUT_OF_BOUNDS');
    }
    for (const point of [segment?.start, segment?.end, segment?.center]) {
      if (!point || ![point.x, point.y, point.z].every(Number.isFinite)) {
        reasons.push(segment?.id + ':NONFINITE_POINT');
      }
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    segmentCount: list.length,
  });
}

export const MACHINE_WORLD_STRUCTURAL_CONDUIT_EDGE_KINDS = STRUCTURAL_EDGE_KINDS;
