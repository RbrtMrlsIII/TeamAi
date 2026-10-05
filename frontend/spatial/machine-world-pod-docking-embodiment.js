/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only endpoint docking and structural chassis embodiment.
 *
 * Derives physical hardware and a bounded support frame from already-projected
 * pod-division conduit endpoints. It does not create topology, alter routes,
 * or own semantic identity.
 */

export const MACHINE_WORLD_POD_DOCKING_EMBODIMENT_ID = 'MACHINE-WORLD-POD-DOCKING-EMBODIMENT';
export const MACHINE_WORLD_POD_DOCKING_EMBODIMENT_VERSION = 'S8-DOCKING-V4';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const endpointDescriptor = (role, point, direction) => {
  const dx = finite(direction?.x);
  const dy = finite(direction?.y);
  const dz = finite(direction?.z);
  const horizontal = Math.hypot(dx, dz);
  const vertical = Math.abs(dy);
  if (horizontal > vertical + 0.000001 || vertical < 0.000001) return null;

  const length = Math.hypot(dx, dy, dz);
  if (length < 0.000001) return null;

  return Object.freeze({
    role,
    point: Object.freeze({
      x: finite(point?.x),
      y: finite(point?.y),
      z: finite(point?.z),
    }),
    unitY: dy / length,
  });
};


export function derivePodDivisionDockingSockets(
  conduitSegments = [],
  {
    socketRadiusFactor = 1.25,
    socketLengthFactor = 3.0,
    minimumRadius = 0.035,
    maximumRadius = 0.065,
    minimumLength = 0.08,
    maximumLength = 0.16,
  } = {},
) {
  const groups = new Map();
  for (const segment of Array.isArray(conduitSegments) ? conduitSegments : []) {
    if (
      segment?.edgeKind !== 'pod-division'
      || segment?.routeContinuous !== true
      || !segment?.semanticEdgeId
    ) continue;
    const list = groups.get(segment.semanticEdgeId) || [];
    list.push(segment);
    groups.set(segment.semanticEdgeId, list);
  }

  const sockets = [];
  for (const [semanticEdgeId, segments] of groups) {
    segments.sort((a, b) => Number(a.segmentIndex) - Number(b.segmentIndex));
    const first = segments[0];
    const last = segments[segments.length - 1];
    let horizontal = null;

    for (const segment of segments) {
      const dx = finite(segment?.end?.x) - finite(segment?.start?.x);
      const dy = finite(segment?.end?.y) - finite(segment?.start?.y);
      const dz = finite(segment?.end?.z) - finite(segment?.start?.z);
      const horizontalLength = Math.hypot(dx, dz);
      const length = Math.hypot(dx, dy, dz);
      if (length < 0.000001 || horizontalLength <= Math.abs(dy) + 0.000001) continue;
      horizontal = {
        x: dx / horizontalLength,
        y: 0,
        z: dz / horizontalLength,
      };
      break;
    }
    if (!horizontal) continue;

    const endpoints = [
      {
        role: 'division-socket',
        point: first?.start,
        direction: horizontal,
      },
      {
        role: 'pod-socket',
        point: last?.end,
        direction: {
          x: -horizontal.x,
          y: 0,
          z: -horizontal.z,
        },
      },
    ];

    for (const endpoint of endpoints) {
      const conduitRadius = Math.max(
        0.01,
        finite(
          endpoint.role === 'pod-socket'
            ? last?.radius
            : first?.radius,
          0.035,
        ),
      );
      const radius = Math.min(
        Math.max(0.01, finite(maximumRadius, 0.065)),
        Math.max(
          Math.max(0.01, finite(minimumRadius, 0.035)),
          conduitRadius * Math.max(0.1, finite(socketRadiusFactor, 1.25)),
        ),
      );
      const length = Math.min(
        Math.max(0.025, finite(maximumLength, 0.16)),
        Math.max(
          Math.max(0.025, finite(minimumLength, 0.08)),
          conduitRadius * Math.max(0.1, finite(socketLengthFactor, 3.0)),
        ),
      );
      sockets.push(Object.freeze({
        id: 'SOCKET:' + semanticEdgeId + ':' + endpoint.role,
        semanticEdgeId,
        edgeKind: 'pod-division',
        role: endpoint.role,
        segmentIndex: endpoint.role === 'pod-socket' ? last.segmentIndex : first.segmentIndex,
        point: Object.freeze({
          x: finite(endpoint.point?.x),
          y: finite(endpoint.point?.y),
          z: finite(endpoint.point?.z),
        }),
        center: Object.freeze({
          x: finite(endpoint.point?.x),
          y: finite(endpoint.point?.y),
          z: finite(endpoint.point?.z),
        }),
        direction: Object.freeze(endpoint.direction),
        radius,
        length,
        routeContinuous: true,
        presentationOnly: true,
      }));
    }
  }

  return Object.freeze(sockets);
}


export function derivePodDivisionMountingFixtures(
  conduitSegments = [],
  divisionDescriptors = [],
  {
    flangeRadiusFactor = 0.28,
    neckRadiusFactor = 0.16,
    flangeLengthFactor = 0.18,
    neckLengthFactor = 0.24,
    minimumFlangeRadius = 0.09,
    maximumFlangeRadius = 0.18,
    minimumNeckRadius = 0.06,
    maximumNeckRadius = 0.12,
    minimumFlangeLength = 0.06,
    maximumFlangeLength = 0.10,
    minimumNeckLength = 0.08,
    maximumNeckLength = 0.14,
  } = {},
) {
  const divisions = Array.isArray(divisionDescriptors)
    ? divisionDescriptors.filter((entry) => entry?.semanticId)
    : [];
  const bySemanticId = new Map();
  for (const descriptor of divisions) {
    const key = String(descriptor.semanticId);
    const existing = bySemanticId.get(key) || {
      x: 0,
      y: 0,
      z: 0,
    };
    existing.x = Math.max(existing.x, Math.abs(finite(descriptor?.dimensions?.x)));
    existing.y = Math.max(existing.y, Math.abs(finite(descriptor?.dimensions?.y)));
    existing.z = Math.max(existing.z, Math.abs(finite(descriptor?.dimensions?.z)));
    bySemanticId.set(key, existing);
  }

  const groups = new Map();
  for (const segment of Array.isArray(conduitSegments) ? conduitSegments : []) {
    if (
      segment?.edgeKind !== 'pod-division'
      || segment?.routeContinuous !== true
      || !segment?.semanticEdgeId
    ) continue;
    const list = groups.get(segment.semanticEdgeId) || [];
    list.push(segment);
    groups.set(segment.semanticEdgeId, list);
  }

  const fixtures = [];
  for (const [semanticEdgeId, segments] of groups) {
    segments.sort((a, b) => Number(a.segmentIndex) - Number(b.segmentIndex));
    const first = segments[0];
    const semanticMatch = String(semanticEdgeId).match(/TREE-HERO-SEAT#[0-9]+:(SEAT_[A-Z_]+)/);
    const semanticId = semanticMatch?.[1] || null;
    const envelope = semanticId ? bySemanticId.get(semanticId) : null;
    if (!first || !semanticId || !envelope) continue;

    const dx = finite(first.end?.x) - finite(first.start?.x);
    const dy = finite(first.end?.y) - finite(first.start?.y);
    const dz = finite(first.end?.z) - finite(first.start?.z);
    const horizontal = Math.hypot(dx, dz);
    const routeLength = Math.hypot(dx, dy, dz);
    if (routeLength < 0.000001 || horizontal > Math.abs(dy) + 0.000001 || Math.abs(dy) < 0.000001) continue;

    const unitY = dy / routeLength;
    const footprint = Math.max(0.02, Math.min(
      envelope.x || 0,
      envelope.z || 0,
    ));
    const flangeRadius = Math.min(
      Math.max(0.01, finite(maximumFlangeRadius, 0.18)),
      Math.max(
        Math.max(0.01, finite(minimumFlangeRadius, 0.09)),
        footprint * Math.max(0.05, finite(flangeRadiusFactor, 0.28)),
      ),
    );
    const neckRadius = Math.min(
      Math.max(0.01, finite(maximumNeckRadius, 0.12)),
      Math.max(
        Math.max(0.01, finite(minimumNeckRadius, 0.06)),
        footprint * Math.max(0.05, finite(neckRadiusFactor, 0.16)),
      ),
    );
    const flangeLength = Math.min(
      Math.max(0.025, finite(maximumFlangeLength, 0.10)),
      Math.max(
        Math.max(0.025, finite(minimumFlangeLength, 0.06)),
        footprint * Math.max(0.05, finite(flangeLengthFactor, 0.18)),
      ),
    );
    const neckLength = Math.min(
      Math.max(0.025, finite(maximumNeckLength, 0.14)),
      Math.max(
        Math.max(0.025, finite(minimumNeckLength, 0.08)),
        footprint * Math.max(0.05, finite(neckLengthFactor, 0.24)),
      ),
    );
    const point = {
      x: finite(first.start?.x),
      y: finite(first.start?.y),
      z: finite(first.start?.z),
    };
    fixtures.push(
      Object.freeze({
        id: 'MOUNT:' + semanticEdgeId + ':FLANGE',
        semanticEdgeId,
        semanticId,
        edgeKind: 'pod-division',
        role: 'division-mount-flange',
        segmentIndex: first.segmentIndex,
        point: Object.freeze(point),
        center: Object.freeze({
          x: point.x,
          y: point.y + unitY * flangeLength * 0.5,
          z: point.z,
        }),
        radius: flangeRadius,
        length: flangeLength,
        routeContinuous: true,
        presentationOnly: true,
      }),
      Object.freeze({
        id: 'MOUNT:' + semanticEdgeId + ':NECK',
        semanticEdgeId,
        semanticId,
        edgeKind: 'pod-division',
        role: 'division-mount-neck',
        segmentIndex: first.segmentIndex,
        point: Object.freeze(point),
        center: Object.freeze({
          x: point.x,
          y: point.y + unitY * (flangeLength + neckLength * 0.5),
          z: point.z,
        }),
        radius: neckRadius,
        length: neckLength,
        routeContinuous: true,
        presentationOnly: true,
      }),
    );
  }

  return Object.freeze(fixtures);
}


export function derivePodDivisionStructuralChassis(
  conduitSegments = [],
  divisionDescriptors = [],
  {
    railRadiusFactor = 1.0,
    railSpacingFactor = 4.5,
    crossbarRadiusFactor = 0.9,
    minimumRailRadius = 0.035,
    maximumRailRadius = 0.075,
    minimumRailSpacing = 0.16,
    maximumRailSpacing = 0.26,
    minimumCrossbarRadius = 0.03,
    maximumCrossbarRadius = 0.06,
    minimumRailLength = 0.08,
  } = {},
) {
  const divisionIds = new Set(
    Array.isArray(divisionDescriptors)
      ? divisionDescriptors
        .map((entry) => String(entry?.semanticId || ''))
        .filter(Boolean)
      : [],
  );
  if (!divisionIds.size) return Object.freeze([]);

  const groups = new Map();
  for (const segment of Array.isArray(conduitSegments) ? conduitSegments : []) {
    if (
      segment?.edgeKind !== 'pod-division'
      || segment?.routeContinuous !== true
      || !segment?.semanticEdgeId
    ) continue;
    const match = String(segment.semanticEdgeId).match(/(?:TREE-HERO-SEAT#[0-9]+:)?(SEAT_[A-Z_]+)/);
    const semanticId = match?.[1] || null;
    if (!semanticId || !divisionIds.has(semanticId)) continue;
    const list = groups.get(segment.semanticEdgeId) || [];
    list.push(segment);
    groups.set(segment.semanticEdgeId, list);
  }

  const chassis = [];
  for (const [semanticEdgeId, segments] of groups) {
    segments.sort((a, b) => Number(a.segmentIndex) - Number(b.segmentIndex));
    const horizontal = segments.find((segment) => {
      const dx = finite(segment.end?.x) - finite(segment.start?.x);
      const dy = finite(segment.end?.y) - finite(segment.start?.y);
      const dz = finite(segment.end?.z) - finite(segment.start?.z);
      const length = Math.hypot(dx, dy, dz);
      return length >= 0.000001 && Math.hypot(dx, dz) > Math.abs(dy) + 0.000001;
    });
    if (!horizontal) continue;

    const dx = finite(horizontal.end?.x) - finite(horizontal.start?.x);
    const dy = finite(horizontal.end?.y) - finite(horizontal.start?.y);
    const dz = finite(horizontal.end?.z) - finite(horizontal.start?.z);
    const length = Math.hypot(dx, dy, dz);
    const horizontalLength = Math.hypot(dx, dz);
    if (length < 0.000001 || horizontalLength < 0.000001) continue;

    const direction = Object.freeze({
      x: dx / horizontalLength,
      y: 0,
      z: dz / horizontalLength,
    });
    const perpendicular = Object.freeze({
      x: -direction.z,
      y: 0,
      z: direction.x,
    });
    const conduitRadius = Math.max(0.01, finite(horizontal.radius, 0.035));
    const railRadius = Math.min(
      Math.max(0.01, finite(maximumRailRadius, 0.075)),
      Math.max(
        Math.max(0.01, finite(minimumRailRadius, 0.035)),
        conduitRadius * Math.max(0.1, finite(railRadiusFactor, 1.0)),
      ),
    );
    const crossbarRadius = Math.min(
      Math.max(0.01, finite(maximumCrossbarRadius, 0.06)),
      Math.max(
        Math.max(0.01, finite(minimumCrossbarRadius, 0.03)),
        conduitRadius * Math.max(0.1, finite(crossbarRadiusFactor, 0.9)),
      ),
    );
    const spacing = Math.min(
      Math.max(0.02, finite(maximumRailSpacing, 0.26)),
      Math.max(
        Math.max(0.02, finite(minimumRailSpacing, 0.16)),
        conduitRadius * Math.max(0.1, finite(railSpacingFactor, 4.5)),
      ),
    );
    const railLength = Math.max(
      Math.max(0.02, finite(minimumRailLength, 0.08)),
      horizontalLength - crossbarRadius * 2,
    );
    const midpoint = {
      x: (finite(horizontal.start?.x) + finite(horizontal.end?.x)) * 0.5,
      y: (finite(horizontal.start?.y) + finite(horizontal.end?.y)) * 0.5,
      z: (finite(horizontal.start?.z) + finite(horizontal.end?.z)) * 0.5,
    };
    const center = Object.freeze(midpoint);
    const crossbarLength = spacing + railRadius * 2;
    const startPoint = Object.freeze({
      x: finite(horizontal.start?.x),
      y: finite(horizontal.start?.y),
      z: finite(horizontal.start?.z),
    });
    const endPoint = Object.freeze({
      x: finite(horizontal.end?.x),
      y: finite(horizontal.end?.y),
      z: finite(horizontal.end?.z),
    });
    const semanticId = String(semanticEdgeId).match(/(?:TREE-HERO-SEAT#[0-9]+:)?(SEAT_[A-Z_]+)/)?.[1] || null;
    const pieces = [
      {
        suffix: 'RAIL:LEFT',
        role: 'division-chassis-rail',
        point: Object.freeze({
          x: center.x + perpendicular.x * spacing * 0.5,
          y: center.y,
          z: center.z + perpendicular.z * spacing * 0.5,
        }),
        direction,
        radius: railRadius,
        length: railLength,
      },
      {
        suffix: 'RAIL:RIGHT',
        role: 'division-chassis-rail',
        point: Object.freeze({
          x: center.x - perpendicular.x * spacing * 0.5,
          y: center.y,
          z: center.z - perpendicular.z * spacing * 0.5,
        }),
        direction,
        radius: railRadius,
        length: railLength,
      },
      {
        suffix: 'CROSSBAR:DIVISION',
        role: 'division-chassis-crossbar',
        point: startPoint,
        direction: perpendicular,
        radius: crossbarRadius,
        length: crossbarLength,
      },
      {
        suffix: 'CROSSBAR:POD',
        role: 'division-chassis-crossbar',
        point: endPoint,
        direction: perpendicular,
        radius: crossbarRadius,
        length: crossbarLength,
      },
    ];

    for (const piece of pieces) {
      chassis.push(Object.freeze({
        id: 'CHASSIS:' + semanticEdgeId + ':' + piece.suffix,
        semanticEdgeId,
        semanticId,
        edgeKind: 'pod-division',
        role: piece.role,
        segmentIndex: horizontal.segmentIndex,
        point: piece.point,
        center: piece.point,
        direction: piece.direction,
        radius: piece.radius,
        length: piece.length,
        routeContinuous: true,
        presentationOnly: true,
      }));
    }
  }

  return Object.freeze(chassis);
}

export function derivePodDivisionDockingCollars(
  conduitSegments = [],
  {
    collarRadiusFactor = 1.6,
    collarLengthFactor = 4.0,
    minimumRadius = 0.04,
    maximumRadius = 0.09,
    minimumLength = 0.10,
    maximumLength = 0.18,
  } = {},
) {
  const groups = new Map();
  for (const segment of Array.isArray(conduitSegments) ? conduitSegments : []) {
    if (
      segment?.edgeKind !== 'pod-division'
      || segment?.routeContinuous !== true
      || !segment?.semanticEdgeId
    ) continue;
    const list = groups.get(segment.semanticEdgeId) || [];
    list.push(segment);
    groups.set(segment.semanticEdgeId, list);
  }

  const collars = [];
  for (const [semanticEdgeId, segments] of groups) {
    segments.sort((a, b) => Number(a.segmentIndex) - Number(b.segmentIndex));
    const first = segments[0];
    const last = segments[segments.length - 1];
    const endpoints = [
      endpointDescriptor(
        'division-dock',
        first?.start,
        {
          x: finite(first?.end?.x) - finite(first?.start?.x),
          y: finite(first?.end?.y) - finite(first?.start?.y),
          z: finite(first?.end?.z) - finite(first?.start?.z),
        },
      ),
      endpointDescriptor(
        'pod-dock',
        last?.end,
        {
          x: finite(last?.start?.x) - finite(last?.end?.x),
          y: finite(last?.start?.y) - finite(last?.end?.y),
          z: finite(last?.start?.z) - finite(last?.end?.z),
        },
      ),
    ].filter(Boolean);

    for (const endpoint of endpoints) {
      const conduitRadius = Math.max(
        0.01,
        finite(
          endpoint.role === 'pod-dock'
            ? last?.radius
            : first?.radius,
          0.035,
        ),
      );
      const radius = Math.min(
        Math.max(0.01, finite(maximumRadius, 0.09)),
        Math.max(
          Math.max(0.01, finite(minimumRadius, 0.04)),
          conduitRadius * Math.max(0.1, finite(collarRadiusFactor, 1.6)),
        ),
      );
      const length = Math.min(
        Math.max(0.025, finite(maximumLength, 0.18)),
        Math.max(
          Math.max(0.025, finite(minimumLength, 0.10)),
          conduitRadius * Math.max(0.1, finite(collarLengthFactor, 4.0)),
        ),
      );
      collars.push(Object.freeze({
        id: 'DOCKING:' + semanticEdgeId + ':' + endpoint.role,
        semanticEdgeId,
        edgeKind: 'pod-division',
        role: endpoint.role,
        segmentIndex: endpoint.role === 'pod-dock' ? last.segmentIndex : first.segmentIndex,
        point: endpoint.point,
        center: Object.freeze({
          x: endpoint.point.x,
          y: endpoint.point.y + endpoint.unitY * length * 0.5,
          z: endpoint.point.z,
        }),
        radius,
        length,
        routeContinuous: true,
        presentationOnly: true,
      }));
    }
  }

  return Object.freeze(collars);
}
