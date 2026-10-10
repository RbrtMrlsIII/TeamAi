/**
 * TEAM-EXPERIENCE-029 / World presentation
 * Presentation-only contraction of the outer facility ring.
 *
 * Canonical S5 placement and safety geometry remain unchanged. This projection
 * moves only render-space facility assemblies and their attached World routes
 * from the runtime safety radius toward the authored outer-housing radius.
 */
import { MACHINE_WORLD_PROFILE, deriveMachineWorldProfile, seatPopulationDensity } from './hero-world-profile.js';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function scaleXZ(point, factor) {
  if (!point) return point;
  return Object.freeze({
    ...point,
    x: finite(point.x) * factor,
    z: finite(point.z) * factor,
  });
}

export function deriveMachineWorldFacilityStagingScale(seatCount = 10) {
  const density = seatPopulationDensity(seatCount);
  const authoredRadius = MACHINE_WORLD_PROFILE.outerHousingRadius.min
    + (MACHINE_WORLD_PROFILE.outerHousingRadius.max - MACHINE_WORLD_PROFILE.outerHousingRadius.min) * density;
  const runtimeRadius = deriveMachineWorldProfile(seatCount).outerHousingRadius;
  return runtimeRadius > 0 ? authoredRadius / runtimeRadius : 1;
}

function transformFacility(facility, scale) {
  if (!facility?.outerHousing?.center) return facility;
  const transformCenter = (point) => scaleXZ(point, scale);
  return Object.freeze({
    ...facility,
    outerHousing: Object.freeze({
      ...facility.outerHousing,
      center: transformCenter(facility.outerHousing.center),
    }),
    components: Object.freeze((facility.components || []).map((component) => Object.freeze({
      ...component,
      center: transformCenter(component.center),
    }))),
    mechanicalDetails: Object.freeze((facility.mechanicalDetails || []).map((component) => Object.freeze({
      ...component,
      center: transformCenter(component.center),
    }))),
    physicalInterfaces: Object.freeze((facility.physicalInterfaces || []).map((port) => Object.freeze({
      ...port,
      point: transformCenter(port.point),
      center: port.center ? transformCenter(port.center) : port.center,
      adapterStart: port.adapterStart ? transformCenter(port.adapterStart) : port.adapterStart,
      adapterEnd: port.adapterEnd ? transformCenter(port.adapterEnd) : port.adapterEnd,
    }))),
    ports: Object.freeze((facility.ports || []).map((port) => Object.freeze({
      ...port,
      point: transformCenter(port.point),
    }))),
  });
}

function transformRoute(edge, scale) {
  const route = Array.isArray(edge?.route) ? edge.route : [];
  if (route.length < 2) return route;

  const indicesToTransform = new Set();
  if (edge.kind === 'facility-facility' || edge.kind === 'outer-spine') {
    route.forEach((_, index) => indicesToTransform.add(index));
  } else if (edge.kind === 'lattice-link') {
    indicesToTransform.add(0);
    indicesToTransform.add(1);
  } else if (edge.kind === 'workspace-contribution') {
    route.forEach((_, index) => {
      if (index >= 2) indicesToTransform.add(index);
    });
  }

  return Object.freeze(route.map((point, index) =>
    indicesToTransform.has(index) ? scaleXZ(point, scale) : Object.freeze({ ...point }),
  ));
}

function transformManifoldSegment(segment, scale) {
  if (!segment) return segment;
  const role = segment.segmentRole;
  // The service ring and its anchors stay at the geometry-derived safe radius.
  // Only the machine-side end of each spur moves with the contracted facility.
  const start = role === 'facility-output-spur' ? scaleXZ(segment.start, scale) : segment.start;
  const end = role === 'facility-input-spur' ? scaleXZ(segment.end, scale) : segment.end;
  if (start === segment.start && end === segment.end) return segment;

  const dx = finite(end?.x) - finite(start?.x);
  const dy = finite(end?.y) - finite(start?.y);
  const dz = finite(end?.z) - finite(start?.z);
  const length = Math.hypot(dx, dy, dz);
  const horizontal = Math.hypot(dx, dz);
  const vertical = Math.abs(dy) >= horizontal;
  const radius = Math.max(0.01, finite(segment.radius, 0.035));
  const thickness = Math.max(0.02, radius * 2);
  return Object.freeze({
    ...segment,
    start,
    end,
    center: Object.freeze({
      x: (finite(start?.x) + finite(end?.x)) * 0.5,
      y: (finite(start?.y) + finite(end?.y)) * 0.5,
      z: (finite(start?.z) + finite(end?.z)) * 0.5,
    }),
    dimensions: Object.freeze(
      vertical
        ? { x: thickness, y: length + thickness, z: thickness }
        : { x: length + thickness, y: thickness, z: thickness },
    ),
    rotationY: vertical ? 0 : Math.atan2(dz, dx),
  });
}

export function deriveMachineWorldPresentationProjection({
  facilities = [],
  topology = null,
  seatCount = 10,
  enabled = true,
} = {}) {
  if (!enabled) return Object.freeze({ facilities: Object.freeze([...(Array.isArray(facilities) ? facilities : [])]), topology });
  const scale = deriveMachineWorldFacilityStagingScale(seatCount);
  const facilityList = Array.isArray(facilities) ? facilities : [];
  const facilityBranchIds = new Set(facilityList.map((facility) => facility?.branchId).filter(Boolean));
  const projectedFacilities = Object.freeze(facilityList.map((facility) => transformFacility(facility, scale)));
  if (!topology) return Object.freeze({ facilities: projectedFacilities, topology: null, scale });

  const projectedEdges = Object.freeze((topology.edges || []).map((edge) => Object.freeze({
    ...edge,
    route: transformRoute(edge, scale),
  })));
  const projectedManifold = topology.serviceManifold
    ? Object.freeze({
      ...topology.serviceManifold,
      segments: Object.freeze((topology.serviceManifold.segments || [])
        .map((segment) => transformManifoldSegment(segment, scale))),
    })
    : topology.serviceManifold;
  const projectedTopology = Object.freeze({
    ...topology,
    edges: projectedEdges,
    serviceManifold: projectedManifold,
  });
  return Object.freeze({ facilities: projectedFacilities, topology: projectedTopology, scale });
}

export function validateMachineWorldPresentationProjection({ facilities = [], topology = null, scale = 1 } = {}) {
  const reasons = [];
  if (!(Number(scale) > 0 && Number(scale) <= 1.000001)) reasons.push('SCALE_OUT_OF_BOUNDS');
  if (Array.isArray(topology?.edges)) {
    for (const edge of topology.edges) {
      if (!Array.isArray(edge?.route) || edge.route.length < 2) reasons.push((edge?.semanticEdgeId || edge?.id || 'EDGE') + ':ROUTE_INVALID');
      if (edge?.routeContinuous === false) reasons.push((edge?.semanticEdgeId || edge?.id || 'EDGE') + ':ROUTE_NOT_CONTINUOUS');
    }
  }
  const manifold = topology?.serviceManifold;
  if (manifold) {
    const segments = Array.isArray(manifold.segments) ? manifold.segments : [];
    const samePoint = (a, b, tolerance = 1e-8) =>
      Boolean(a && b)
      && Math.hypot(
        finite(a.x) - finite(b.x),
        finite(a.y) - finite(b.y),
        finite(a.z) - finite(b.z),
      ) <= tolerance;
    const junctions = Array.isArray(manifold.junctions) ? manifold.junctions : [];
    if (junctions.length !== 4) reasons.push('MANIFOLD_JUNCTION_COUNT_INVALID');
    for (const junction of junctions) {
      const touching = segments.filter((segment) =>
        samePoint(segment.start, junction.center) || samePoint(segment.end, junction.center));
      if (junction.routeContinuous !== true || touching.length !== 4) {
        reasons.push((junction.id || 'MANIFOLD_JUNCTION') + ':INCIDENCE_NOT_CONTINUOUS');
      }
      if (touching.some((segment) => segment.routeContinuous !== true || segment.obstacleAvoidance !== true)) {
        reasons.push((junction.id || 'MANIFOLD_JUNCTION') + ':INCIDENT_SEGMENT_UNSAFE');
      }
    }
  }
  if (!Array.isArray(facilities) || facilities.length !== 4) reasons.push('FACILITY_COUNT_INVALID');
  return Object.freeze({ valid: reasons.length === 0, reasons: Object.freeze(reasons) });
}