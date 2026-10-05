/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only endpoint docking embodiment.
 *
 * Derives small physical collars from the already-projected pod-division
 * conduit endpoints. It does not create topology, alter routes, or own
 * semantic identity.
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


export function derivePodDivisionArticulatedMounts(
  conduitSegments = [],
  divisionDescriptors = [],
  {
    bridgeRadiusFactor = 0.10,
    bridgeLengthFactor = 0.44,
    hingeRadiusFactor = 0.16,
    hingeLengthFactor = 0.38,
    minimumBridgeRadius = 0.045,
    maximumBridgeRadius = 0.075,
    minimumBridgeLength = 0.12,
    maximumBridgeLength = 0.22,
    minimumHingeRadius = 0.075,
    maximumHingeRadius = 0.12,
    minimumHingeLength = 0.18,
    maximumHingeLength = 0.30,
  } = {},
) {
  const divisions = Array.isArray(divisionDescriptors)
    ? divisionDescriptors.filter((entry) => entry?.semanticId)
    : [];
  const bySemanticId = new Map();
  for (const descriptor of divisions) {
    const key = String(descriptor.semanticId);
    const existing = bySemanticId.get(key) || { x: 0, z: 0 };
    existing.x = Math.max(existing.x, Math.abs(finite(descriptor?.dimensions?.x)));
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

  const mounts = [];
  for (const [semanticEdgeId, segments] of groups) {
    segments.sort((a, b) => Number(a.segmentIndex) - Number(b.segmentIndex));
    const first = segments[0];
    const second = segments.find((segment) => (
      Number(segment.segmentIndex) > Number(first?.segmentIndex)
    ));
    if (!first || !second) continue;

    const semanticMatch = String(semanticEdgeId).match(
      /TREE-HERO-SEAT#[0-9]+:(SEAT_[A-Z_]+)/,
    );
    const semanticId = semanticMatch?.[1] || null;
    const envelope = semanticId ? bySemanticId.get(semanticId) : null;
    if (!semanticId || !envelope) continue;

    const sourceDx = finite(first.end?.x) - finite(first.start?.x);
    const sourceDy = finite(first.end?.y) - finite(first.start?.y);
    const sourceDz = finite(first.end?.z) - finite(first.start?.z);
    const horizontalSource = Math.hypot(sourceDx, sourceDz);
    const sourceLength = Math.hypot(sourceDx, sourceDy, sourceDz);
    if (
      sourceLength < 0.000001
      || horizontalSource > Math.abs(sourceDy) + 0.000001
      || Math.abs(sourceDy) < 0.000001
    ) continue;

    const deckDx = finite(second.end?.x) - finite(second.start?.x);
    const deckDz = finite(second.end?.z) - finite(second.start?.z);
    const deckLength = Math.hypot(deckDx, deckDz);
    if (deckLength < 0.000001) continue;

    const inward = {
      x: deckDx / deckLength,
      y: 0,
      z: deckDz / deckLength,
    };
    const tangent = {
      x: -inward.z,
      y: 0,
      z: inward.x,
    };
    const point = {
      x: finite(first.start?.x),
      y: finite(first.start?.y),
      z: finite(first.start?.z),
    };

    const footprint = Math.max(
      0.02,
      Math.min(envelope.x || 0, envelope.z || 0),
    );
    const bridgeRadius = Math.min(
      Math.max(0.01, finite(maximumBridgeRadius, 0.075)),
      Math.max(
        Math.max(0.01, finite(minimumBridgeRadius, 0.045)),
        footprint * Math.max(0.05, finite(bridgeRadiusFactor, 0.10)),
      ),
    );
    const bridgeLength = Math.min(
      Math.max(0.025, finite(maximumBridgeLength, 0.22)),
      Math.max(
        Math.max(0.025, finite(minimumBridgeLength, 0.12)),
        footprint * Math.max(0.05, finite(bridgeLengthFactor, 0.44)),
      ),
    );
    const hingeRadius = Math.min(
      Math.max(0.01, finite(maximumHingeRadius, 0.12)),
      Math.max(
        Math.max(0.01, finite(minimumHingeRadius, 0.075)),
        footprint * Math.max(0.05, finite(hingeRadiusFactor, 0.16)),
      ),
    );
    const hingeLength = Math.min(
      Math.max(0.025, finite(maximumHingeLength, 0.30)),
      Math.max(
        Math.max(0.025, finite(minimumHingeLength, 0.18)),
        footprint * Math.max(0.05, finite(hingeLengthFactor, 0.38)),
      ),
    );

    const hingeCenter = {
      x: point.x + inward.x * bridgeLength * 0.85,
      y: point.y,
      z: point.z + inward.z * bridgeLength * 0.85,
    };
    const bridgeCenter = {
      x: point.x + inward.x * bridgeLength * 0.50,
      y: point.y,
      z: point.z + inward.z * bridgeLength * 0.50,
    };

    mounts.push(
      Object.freeze({
        id: 'ARTICULATED-MOUNT:' + semanticEdgeId + ':BRIDGE',
        semanticEdgeId,
        semanticId,
        edgeKind: 'pod-division',
        role: 'division-articulated-bridge',
        segmentIndex: first.segmentIndex,
        point: Object.freeze(point),
        center: Object.freeze(bridgeCenter),
        direction: Object.freeze(inward),
        radius: bridgeRadius,
        length: bridgeLength,
        routeContinuous: true,
        presentationOnly: true,
        mountMode: 'compact-articulated',
      }),
      Object.freeze({
        id: 'ARTICULATED-MOUNT:' + semanticEdgeId + ':HINGE',
        semanticEdgeId,
        semanticId,
        edgeKind: 'pod-division',
        role: 'division-articulated-hinge',
        segmentIndex: first.segmentIndex,
        point: Object.freeze(point),
        center: Object.freeze(hingeCenter),
        direction: Object.freeze(tangent),
        radius: hingeRadius,
        length: hingeLength,
        routeContinuous: true,
        presentationOnly: true,
        mountMode: 'compact-articulated',
      }),
    );
  }

  return Object.freeze(mounts);
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
