/**
 * 029 machine-core Seat-1 child composition.
 * Reuses the existing Seat-1 payload-driven geometry and semantic edge contracts.
 * Presentation only: no provider, authorization, scheduler, or durable-domain authority.
 */
import { buildSeatDivisionGeometry } from './seat-division-geometry.js';
import {
  connectionEdgePoint,
  seat1ConnectionEdge,
  SEAT1_CONNECTION_EDGE_ID,
  SEAT1_CONNECTION_PORT_ID,
} from './seat-connection-edge.js';

export const MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY = 'TREE-HERO-SEAT#0:SEAT_CONNECTION';
export const MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:HEALTH_FACE';
export const MACHINE_CORE_SEAT1_CONNECTION_PAYLOAD = Object.freeze({
  labels: Object.freeze(['Connection', 'Health']),
  controls: Object.freeze(['configure']),
  density: 'default',
});

const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));

export function buildMachineCoreSeat1Connection({
  shell,
  expansionAmount = 0,
  workspaceTarget = { x: 0, y: 0.5, z: 0 },
} = {}) {
  if (
    !shell
    || shell.kind !== 'inner-pod'
    || shell.seatIndex !== 0
    || shell.semanticId !== 'SEAT_SHELL'
    || !shell.semanticKey
  ) {
    return null;
  }

  const amount = clamp01(expansionAmount);
  if (amount <= 0.02) return null;

  const angle = Math.atan2(shell.center.z, shell.center.x);
  const radialDistance = Math.hypot(shell.center.x, shell.center.z);
  const center = {
    x: shell.center.x + Math.cos(angle) * 0.06 * amount,
    y: shell.level + shell.dimensions.y * 0.68 + 0.12 * amount,
    z: shell.center.z + Math.sin(angle) * 0.06 * amount,
  };
  const geometry = buildSeatDivisionGeometry({
    center,
    angle,
    radialDistance,
    payload: MACHINE_CORE_SEAT1_CONNECTION_PAYLOAD,
    workspaceTarget,
  });
  const edge = seat1ConnectionEdge(geometry.port, geometry.corridor.end);

  return Object.freeze({
    semanticKey: MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY,
    parentSemanticKey: shell.semanticKey,
    semanticId: 'SEAT_CONNECTION',
    geometry,
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
    previewPoint: Object.freeze(connectionEdgePoint(edge, amount * 0.28)),
    presentationOnly: true,
  });
}
