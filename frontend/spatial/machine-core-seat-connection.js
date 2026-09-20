/**
 * 029 machine-core Seat-1 child composition.
 * Canonical identity is fail-closed. Geometry remains a replaceable candidate.
 * Presentation only: no provider, authorization, scheduler, or durable-domain authority.
 */
import { buildSeatDivisionGeometry } from './seat-division-geometry.js';
import { deriveMachineExpansionProfile, interpolateMachineDimensions } from './machine-hero-adaptive-geometry.js';
import {
  connectionEdgePoint,
  seat1ConnectionEdge,
  SEAT1_CONNECTION_EDGE_ID,
  SEAT1_CONNECTION_PORT_ID,
} from './seat-connection-edge.js';

export const MACHINE_CORE_SEAT1_BRANCH_ID = 'BRANCH-SEAT-01';
export const MACHINE_CORE_SEAT1_SHELL_KEY = 'TREE-HERO-SEAT#0:SEAT_SHELL';
export const MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY = 'TREE-HERO-SEAT#0:SEAT_CONNECTION';
export const MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY = 'SEAT_CONNECTION_HEALTH_FACE';

const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));
const SEAT1_CONNECTION_PAYLOAD = Object.freeze({
  labels: Object.freeze(['Connection', 'Health']),
  controls: Object.freeze(['configure']),
  density: 'default',
});

export function isCanonicalSeat1Shell(shell) {
  return Boolean(
    shell
    && shell.branchId === MACHINE_CORE_SEAT1_BRANCH_ID
    && shell.seatIndex === 0
    && shell.semanticId === 'SEAT_SHELL'
    && shell.semanticKey === MACHINE_CORE_SEAT1_SHELL_KEY,
  );
}

export function buildMachineCoreSeat1Connection({
  shell,
  expansionAmount = 0,
  workspaceTarget = { x: 0, y: 0.5, z: 0 },
  density = 'default',
} = {}) {
  if (!isCanonicalSeat1Shell(shell)) return null;

  const amount = clamp01(expansionAmount);
  if (amount <= 0.02) return null;

  const angle = Math.atan2(shell.center.z, shell.center.x);
  const radialDistance = Math.hypot(shell.center.x, shell.center.z);
  const center = {
    x: shell.center.x + Math.cos(angle) * 0.06 * amount,
    y: shell.level + shell.dimensions.y * 0.68 + 0.12 * amount,
    z: shell.center.z + Math.sin(angle) * 0.06 * amount,
  };
  const divisionPayload = density === 'compact'
    ? Object.freeze({ ...SEAT1_CONNECTION_PAYLOAD, density: 'compact' })
    : SEAT1_CONNECTION_PAYLOAD;
  const geometry = buildSeatDivisionGeometry({
    center,
    angle,
    radialDistance,
    payload: divisionPayload,
    workspaceTarget,
  });
  const expansionProfile = deriveMachineExpansionProfile({
    dimensions: geometry.dimensions,
    payload: divisionPayload,
  }, { clearance: geometry.clearance });
  const adaptiveDimensions = interpolateMachineDimensions(expansionProfile, amount);
  const edge = seat1ConnectionEdge(geometry.port, geometry.corridor.end);

  return Object.freeze({
    semanticKey: MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY,
    parentSemanticKey: MACHINE_CORE_SEAT1_SHELL_KEY,
    semanticId: 'SEAT_CONNECTION',
    geometry: Object.freeze({
      ...geometry,
      dimensions: Object.freeze({ ...adaptiveDimensions }),
    }),
    adaptive: Object.freeze({
      collapsed: Object.freeze({ ...expansionProfile.collapsed }),
      expanded: Object.freeze({ ...expansionProfile.expanded }),
      current: Object.freeze({ ...adaptiveDimensions }),
      normalizedLoad: expansionProfile.normalizedLoad,
      contentLoad: expansionProfile.contentLoad,
      clearance: expansionProfile.clearance,
    }),
    edge,
    edgeId: SEAT1_CONNECTION_EDGE_ID,
    portId: SEAT1_CONNECTION_PORT_ID,
    healthLeaf: Object.freeze({
      semanticKey: MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY,
      status: 'unknown',
      presentationOnly: true,
      point: Object.freeze({ ...center }),
    }),
    amount,
    previewPoint: Object.freeze(connectionEdgePoint(edge, amount)),
    presentationOnly: true,
    geometryCandidate: true,
    proof: Object.freeze({
      semanticBindingResolved: true,
      geometryResolved: Boolean(geometry?.id && geometry?.port),
      connectionPathExecuted: Boolean(edge?.id && edge?.source && edge?.target),
      webglDrawPathExecuted: false,
    }),
  });
}
