/**
 * TEAM-EXPERIENCE-029 / S8
 * Physical embodiment of already-authored Facility interfaces.
 *
 * This module projects S7 machine ports and S6 facility adapter endpoints into
 * compact collars/flanges. It owns no topology or product-feature identity.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_FACILITY_DOCKING_EMBODIMENT_ID =
  'MACHINE-WORLD-FACILITY-DOCKING-EMBODIMENT';
export const MACHINE_WORLD_FACILITY_DOCKING_EMBODIMENT_VERSION = 'S8-ENDPOINT-V1';

const ROOT_OWNER = 'frontend/spatial/machine-world-facility-docking-embodiment.js';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const rootContext = (semanticId) => createSpatialConstructionContext({
  slice: 'S8',
  owner: ROOT_OWNER,
  semanticId,
  semanticBoundary: 'presentation-only',
});

const radialDirection = (machine, point) => {
  const center = machine?.outerHousing?.center || { x: 0, z: 0 };
  const dx = finite(point?.x) - finite(center?.x);
  const dz = finite(point?.z) - finite(center?.z);
  const length = Math.hypot(dx, dz);
  if (length < 0.000001) return Object.freeze({ x: 1, z: 0 });
  return Object.freeze({ x: dx / length, z: dz / length });
};

const descriptor = ({
  id,
  role,
  portId,
  facilityId = null,
  point,
  direction,
  radius,
  length,
}) => Object.freeze({
  id,
  role,
  portId,
  facilityId,
  edgeKind: role === 'facility-port-flange'
    ? 'facility-port'
    : 'machine-endpoint',
  center: Object.freeze({
    x: finite(point?.x),
    y: finite(point?.y),
    z: finite(point?.z),
  }),
  point: Object.freeze({
    x: finite(point?.x),
    y: finite(point?.y),
    z: finite(point?.z),
  }),
  direction: Object.freeze({
    x: finite(direction?.x),
    y: 0,
    z: finite(direction?.z),
  }),
  radius: Math.max(0.01, finite(radius, 0.10)),
  length: Math.max(0.025, finite(length, 0.10)),
  dimensions: Object.freeze({
    x: Math.max(0.04, finite(radius, 0.10) * 2.2),
    y: Math.max(0.05, finite(length, 0.10) * 0.46),
    z: Math.max(0.04, finite(radius, 0.10) * 2.2),
  }),
  rotationY: Math.atan2(finite(direction?.z), finite(direction?.x)),
  presentationOnly: true,
});

export function deriveMachineWorldFacilityDockingEmbodiment(
  facilityMachinery = [],
  {
    endpointRadius = 0.13,
    endpointLength = 0.14,
    facilityRadius = 0.11,
    facilityLength = 0.10,
  } = {},
) {
  const machines = Array.isArray(facilityMachinery)
    ? facilityMachinery.filter(Boolean)
    : [];
  const descriptors = [];

  for (const machine of machines) {
    const branchId = String(machine.branchId || machine.id || 'MACHINE');
    const machinePorts = Array.isArray(machine.ports)
      ? machine.ports.filter((port) =>
        port?.role === 'machine-core-input' || port?.role === 'machine-output'
      )
      : [];

    for (const port of machinePorts) {
      const direction = radialDirection(machine, port.point);
      descriptors.push(
        descriptor({
          id: 'FACILITY-ENDPOINT:' + branchId + ':' + port.role,
          role: 'machine-endpoint-collar',
          portId: port.id,
          point: port.point,
          direction,
          radius: Math.min(0.16, Math.max(0.09, finite(endpointRadius, 0.13))),
          length: Math.min(0.18, Math.max(0.08, finite(endpointLength, 0.14))),
        }),
      );
    }

    const interfaces = Array.isArray(machine.physicalInterfaces)
      ? machine.physicalInterfaces.filter((entry) => entry?.role === 'facility-port-adapter')
      : [];

    for (const entry of interfaces) {
      const point = entry.adapterEnd || entry.center;
      const direction = radialDirection(machine, point);
      descriptors.push(
        descriptor({
          id: 'FACILITY-FLANGE:' + branchId + ':' + String(entry.facilityId || entry.id),
          role: 'facility-port-flange',
          portId: entry.portId,
          facilityId: entry.facilityId || null,
          point,
          direction,
          radius: Math.min(0.14, Math.max(0.08, finite(facilityRadius, 0.11))),
          length: Math.min(0.14, Math.max(0.07, finite(facilityLength, 0.10))),
        }),
      );
    }
  }

  return Object.freeze(descriptors.map((entry) => Object.freeze({
    ...entry,
    ...rootContext(entry.id),
  })));
}

export function validateMachineWorldFacilityDockingEmbodiment(
  descriptors = [],
  facilityMachinery = [],
  {
    expectedMachineCount = 4,
    expectedFacilityPortCount = 11,
  } = {},
) {
  const reasons = [];
  const list = Array.isArray(descriptors) ? descriptors : [];
  const machines = Array.isArray(facilityMachinery) ? facilityMachinery : [];
  const endpointCount = list.filter((entry) => entry.role === 'machine-endpoint-collar').length;
  const facilityCount = list.filter((entry) => entry.role === 'facility-port-flange').length;

  if (machines.length !== expectedMachineCount) reasons.push('MACHINE_COUNT_MISMATCH');
  if (endpointCount !== expectedMachineCount * 2) reasons.push('MACHINE_ENDPOINT_COUNT_MISMATCH');
  if (facilityCount !== expectedFacilityPortCount) reasons.push('FACILITY_PORT_COUNT_MISMATCH');

  const ids = new Set();
  for (const entry of list) {
    if (!entry?.id) reasons.push('MISSING_DESCRIPTOR_ID');
    if (entry?.id && ids.has(entry.id)) reasons.push('DUPLICATE_DESCRIPTOR_ID:' + entry.id);
    if (entry?.id) ids.add(entry.id);
    if (entry?.constructionSlice !== 'S8') reasons.push(entry?.id + ':NOT_S8');
    if (entry?.constructionOwner !== ROOT_OWNER) reasons.push(entry?.id + ':OWNER_MISMATCH');
    if (entry?.semanticBoundary !== 'presentation-only') reasons.push(entry?.id + ':NOT_PRESENTATION_ONLY');
    if (!(Number(entry?.radius) > 0 && Number(entry?.radius) <= 0.16)) reasons.push(entry?.id + ':RADIUS_OUT_OF_BOUNDS');
    if (!(Number(entry?.length) > 0 && Number(entry?.length) <= 0.18)) reasons.push(entry?.id + ':LENGTH_OUT_OF_BOUNDS');
    for (const point of [entry?.point, entry?.center]) {
      if (![point?.x, point?.y, point?.z].every(Number.isFinite)) {
        reasons.push(entry?.id + ':NONFINITE_POINT');
      }
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    descriptorCount: list.length,
    endpointCount,
    facilityCount,
  });
}
