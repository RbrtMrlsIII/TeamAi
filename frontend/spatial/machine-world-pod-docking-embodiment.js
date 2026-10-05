/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only endpoint docking embodiment.
 *
 * Derives small physical collars from the already-projected pod-division
 * conduit endpoints. It does not create topology, alter routes, or own
 * semantic identity.
 */

export const MACHINE_WORLD_POD_DOCKING_EMBODIMENT_ID = 'MACHINE-WORLD-POD-DOCKING-EMBODIMENT';
export const MACHINE_WORLD_POD_DOCKING_EMBODIMENT_VERSION = 'S8-DOCKING-V2';

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
