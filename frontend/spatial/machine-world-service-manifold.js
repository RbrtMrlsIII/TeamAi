/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only physical carrier for facility-facility topology.
 *
 * Semantic S8 edges remain authoritative. This module only projects the
 * existing four facility links onto a shared, geometry-derived service ring.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_SERVICE_MANIFOLD_ID = 'MACHINE-WORLD-SERVICE-MANIFOLD';
export const MACHINE_WORLD_SERVICE_MANIFOLD_VERSION = 'S8-MANIFOLD-V2';
const ROOT_OWNER = 'frontend/spatial/machine-world-service-manifold.js';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const radial = (point) => Math.hypot(finite(point?.x), finite(point?.z));

const rootContext = (semanticId) => createSpatialConstructionContext({
  slice: 'S8',
  owner: ROOT_OWNER,
  semanticId,
  semanticBoundary: 'presentation-only',
});

const pointAtRadius = (angle, radius, y) => Object.freeze({
  x: Math.cos(angle) * radius,
  y: finite(y),
  z: Math.sin(angle) * radius,
});

const positiveDelta = (delta) => {
  const tau = Math.PI * 2;
  const value = delta % tau;
  return value < 0 ? value + tau : value;
};

function deriveArcSteps(radius, innerBoundary, deltaAngle) {
  const safeRadius = Math.max(0.01, radius);
  const safeSagitta = Math.max(0.01, (radius - innerBoundary) * 0.5);
  const cosine = Math.max(-1, Math.min(1, 1 - safeSagitta / safeRadius));
  const maxStep = Math.max(0.08, 2 * Math.acos(cosine));
  return Math.max(3, Math.ceil(deltaAngle / maxStep));
}

function segmentGeometry(start, end, radius) {
  const dx = finite(end.x) - finite(start.x);
  const dy = finite(end.y) - finite(start.y);
  const dz = finite(end.z) - finite(start.z);
  const length = Math.hypot(dx, dy, dz);
  const horizontal = Math.hypot(dx, dz);
  const vertical = Math.abs(dy) >= horizontal;
  const thickness = Math.max(0.02, radius * 2);
  return Object.freeze({
    center: Object.freeze({
      x: (finite(start.x) + finite(end.x)) * 0.5,
      y: (finite(start.y) + finite(end.y)) * 0.5,
      z: (finite(start.z) + finite(end.z)) * 0.5,
    }),
    dimensions: Object.freeze(
      vertical
        ? { x: thickness, y: length + thickness, z: thickness }
        : { x: length + thickness, y: thickness, z: thickness },
    ),
    rotationY: vertical ? 0 : Math.atan2(dz, dx),
  });
}

export function deriveMachineWorldServiceManifold({
  topology = null,
  scene = null,
  machinery = [],
  clearance = 0.16,
  serviceEndpointPoints = [],
  conduitRadius = 0.035,
} = {}) {
  const edges = Array.isArray(topology?.edges)
    ? topology.edges.filter((edge) => edge?.kind === 'facility-facility')
    : [];
  const machines = Array.isArray(machinery) ? machinery.filter(Boolean) : [];
  const pods = Array.isArray(scene?.parts)
    ? scene.parts.filter((part) => part?.kind === 'inner-pod')
    : [];
  const divisionEdges = Array.isArray(topology?.edges)
    ? topology.edges.filter((edge) => edge?.kind === 'pod-division')
    : [];

  const clearanceBudget = Math.max(0, finite(clearance, 0.16));
  const halfConduit = Math.max(0.01, finite(conduitRadius, 0.035));

  const divisionReach = divisionEdges.flatMap((edge) =>
    (Array.isArray(edge?.route) ? edge.route : []).map(radial)
  );
  const divisionBoundary = (
    divisionReach.length
      ? Math.max(...divisionReach)
      : Math.max(...pods.map((pod) =>
        radial(pod.center) + Math.hypot(
          finite(pod.dimensions?.x) * 0.5,
          finite(pod.dimensions?.z) * 0.5,
        ),
      ), 0)
  );
  const machineEnvelopeBoundary = Math.max(
    ...machines.map((machine) =>
      radial(machine?.outerHousing?.center) + finite(machine?.envelope?.radius)
    ),
    0,
  );
  const serviceRingBoundary = Math.max(divisionBoundary, machineEnvelopeBoundary);
  const serviceRingMargin = Math.max(0.08, finite(clearanceBudget * 0.75, 0.12));
  const innerBoundary = serviceRingBoundary + clearanceBudget + halfConduit;
  const outerBoundary = innerBoundary + serviceRingMargin * 2;
  const radius = (innerBoundary + outerBoundary) * 0.5;

  const maxPodTop = Math.max(
    ...pods.map((pod) =>
      finite(pod?.center?.y) + Math.abs(finite(pod?.dimensions?.y)) * 0.5
    ),
    0,
  );
  const serviceEndpointY = Math.max(
    ...edges.flatMap((edge) => [
      finite(edge?.sourcePort?.point?.y),
      finite(edge?.targetPort?.point?.y),
    ]),
    ...serviceEndpointPoints.map((point) => finite(point?.y)),
    maxPodTop,
    0,
  );
  const manifoldY = serviceEndpointY + clearanceBudget + 0.18;

  const reasons = [];
  if (edges.length !== 4) reasons.push('FACILITY_EDGE_COUNT_MISMATCH');
  if (machines.length !== 4) reasons.push('MACHINE_COUNT_MISMATCH');
  if (!radius) reasons.push('NO_SAFE_RADIAL_BAND');
  if (radius && outerBoundary - innerBoundary < Math.max(0.08, halfConduit * 2)) {
    reasons.push('RADIAL_BAND_TOO_TIGHT');
  }

  const anchorByBranch = new Map(
    machines
      .filter((machine) => machine?.branchId && machine?.outerHousing?.center)
      .map((machine) => {
        const angle = Math.atan2(
          finite(machine.outerHousing.center.z),
          finite(machine.outerHousing.center.x),
        );
        return [machine.branchId, Object.freeze({
          branchId: machine.branchId,
          angle,
          point: radius == null ? null : pointAtRadius(angle, radius, manifoldY),
        })];
      }),
  );

  const facilityAnchors = Object.freeze(
    Array.from(anchorByBranch.values()).map((anchor) => Object.freeze({
      branchId: anchor.branchId,
      angle: anchor.angle,
      point: anchor.point ? Object.freeze({ ...anchor.point }) : null,
    })),
  );

  const segments = [];
  if (radius != null) {
    for (const edge of edges) {
      const sourceAnchor = anchorByBranch.get(edge.sourceBranchId);
      const targetAnchor = anchorByBranch.get(edge.targetBranchId);
      const sourcePoint = edge.sourcePort?.point || edge.route?.[0];
      const targetPoint = edge.targetPort?.point || edge.route?.at?.(-1);
      if (!sourceAnchor?.point || !targetAnchor?.point || !sourcePoint || !targetPoint) {
        reasons.push(edge.semanticEdgeId + ':ANCHOR_MISSING');
        continue;
      }

      const deltaAngle = positiveDelta(targetAnchor.angle - sourceAnchor.angle);
      const arcSteps = deriveArcSteps(radius, innerBoundary, deltaAngle);
      const arcPoints = Array.from({ length: arcSteps + 1 }, (_, index) =>
        pointAtRadius(
          sourceAnchor.angle + deltaAngle * (index / arcSteps),
          radius,
          manifoldY,
        )
      );
      const routes = [
        {
          role: 'facility-output-spur',
          points: [Object.freeze({ ...sourcePoint }), sourceAnchor.point],
          excludedBranches: [edge.sourceBranchId],
        },
        ...arcPoints.slice(1).map((point, index) => ({
          role: 'manifold-arc',
          points: [arcPoints[index], point],
          excludedBranches: [],
        })),
        {
          role: 'facility-input-spur',
          points: [targetAnchor.point, Object.freeze({ ...targetPoint })],
          excludedBranches: [edge.targetBranchId],
        },
      ];

      routes.forEach((route, segmentIndex) => {
        const [start, end] = route.points;
        segments.push(Object.freeze({
          id: 'MANIFOLD:' + edge.semanticEdgeId + ':' + route.role + ':' + segmentIndex,
          semanticEdgeId: edge.semanticEdgeId,
          edgeKind: 'facility-facility',
          segmentRole: route.role,
          segmentIndex,
          start: Object.freeze({ ...start }),
          end: Object.freeze({ ...end }),
          ...segmentGeometry(start, end, halfConduit),
          radius: halfConduit,
          corridorRadius: halfConduit,
          obstacleBranchIds: Object.freeze(route.excludedBranches),
          routeContinuous: true,
          ...rootContext('MANIFOLD:' + edge.semanticEdgeId + ':' + segmentIndex),
          presentationOnly: true,
        }));
      });
    }
  }

  return Object.freeze({
    id: MACHINE_WORLD_SERVICE_MANIFOLD_ID,
    version: MACHINE_WORLD_SERVICE_MANIFOLD_VERSION,
    ...rootContext(MACHINE_WORLD_SERVICE_MANIFOLD_ID),
    valid: reasons.length === 0 && segments.length > 0,
    reasons: Object.freeze([...new Set(reasons)]),
    radius,
    innerBoundary,
    outerBoundary,
    divisionBoundary,
    machineEnvelopeBoundary,
    serviceRingMargin,
    manifoldY,
    arcSegmentCount: segments.filter((segment) => segment.segmentRole === 'manifold-arc').length,
    facilitySpurCount: segments.filter((segment) => segment.segmentRole !== 'manifold-arc').length,
    facilityAnchors,
    segments: Object.freeze(segments),
    presentationOnly: true,
  });
}

export function validateMachineWorldServiceManifold(
  manifold,
  topology,
  { expectedFacilityEdges = 4 } = {},
) {
  const reasons = [];
  if (manifold?.constructionSlice !== 'S8') reasons.push('MANIFOLD_NOT_S8');
  if (manifold?.constructionOwner !== ROOT_OWNER) reasons.push('MANIFOLD_OWNER_MISMATCH');
  if (manifold?.semanticBoundary !== 'presentation-only') reasons.push('MANIFOLD_NOT_PRESENTATION_ONLY');
  const edgeIds = new Set(
    (topology?.edges || [])
      .filter((edge) => edge?.kind === 'facility-facility')
      .map((edge) => edge.semanticEdgeId),
  );
  const projectedIds = new Set((manifold?.segments || []).map((segment) => segment.semanticEdgeId));
  if (edgeIds.size !== expectedFacilityEdges) reasons.push('FACILITY_EDGE_COUNT_MISMATCH');
  for (const id of edgeIds) if (!projectedIds.has(id)) reasons.push(id + ':MISSING_MANIFOLD_PROJECTION');
  for (const id of projectedIds) if (!edgeIds.has(id)) reasons.push(id + ':ORPHAN_MANIFOLD_PROJECTION');
  if (!(Number(manifold?.radius) > Number(manifold?.innerBoundary))
    || !(Number(manifold?.radius) < Number(manifold?.outerBoundary))) {
    reasons.push('MANIFOLD_RADIUS_OUTSIDE_SAFE_BAND');
  }
  if (!(Number(manifold?.innerBoundary) > Number(manifold?.machineEnvelopeBoundary))) {
    reasons.push('MANIFOLD_NOT_OUTSIDE_MACHINE_ENVELOPE');
  }
  if (!Array.isArray(manifold?.segments) || manifold.segments.length < expectedFacilityEdges) {
    reasons.push('MANIFOLD_SEGMENTS_INCOMPLETE');
  }
  return Object.freeze({
    valid: reasons.length === 0 && manifold?.valid === true,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}
