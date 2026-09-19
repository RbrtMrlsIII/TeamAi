/**
 * 029 Seat-1 semantic connection edge.
 * Presentation geometry only. The edge identity is stable and suitable for
 * later electrical traversal; it does not authorize provider/domain writes.
 */

export const SEAT1_CONNECTION_PORT_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT';
export const SEAT1_CONNECTION_EDGE_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION→WORKSPACE_CENTER';

/**
 * Stable port derived from the rendered connection face center.
 * @param {{x:number,y:number,z:number}} point
 */
export function seat1ConnectionPort(point) {
  return {
    id: SEAT1_CONNECTION_PORT_ID,
    tree: 'TREE-HERO-SEAT',
    seatIndex: 0,
    division: 'SEAT_CONNECTION',
    role: 'connection-port',
    x: Number(point?.x) || 0,
    y: Number(point?.y) || 0,
    z: Number(point?.z) || 0,
  };
}

/**
 * Explicit semantic edge from Seat-1 connection into the shared workspace center.
 * @param {{x:number,y:number,z:number}} start
 * @param {{x:number,y:number,z:number}} end
 */
export function seat1ConnectionEdge(start, end = { x: 0, y: 0.5, z: 0 }) {
  const from = seat1ConnectionPort(start);
  const to = {
    id: 'WORKSPACE_CENTER',
    role: 'workspace-center-target',
    x: Number(end?.x) || 0,
    y: Number(end?.y) || 0,
    z: Number(end?.z) || 0,
  };
  return {
    id: SEAT1_CONNECTION_EDGE_ID,
    from: from.id,
    to: to.id,
    source: from,
    target: to,
    semantic: true,
    presentationOnly: true,
  };
}

export function connectionEdgePoint(edge, amount = 0) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  const a = edge?.source || {};
  const b = edge?.target || {};
  return {
    x: Number(a.x) + (Number(b.x) - Number(a.x)) * t,
    y: Number(a.y) + (Number(b.y) - Number(a.y)) * t,
    z: Number(a.z) + (Number(b.z) - Number(a.z)) * t,
  };
}
