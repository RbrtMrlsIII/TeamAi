/**
 * 029 semantic Seat-division geometry contract.
 * Geometry is derived from payload/clearance inputs rather than a universal mesh size.
 * Presentation-only: no provider, authorization, or durable domain writes.
 */

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export const SEAT1_CONNECTION_GEOMETRY_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY';

export function measureDivisionPayload(payload = {}) {
  const labels = Array.isArray(payload.labels) ? payload.labels : [];
  const controls = Array.isArray(payload.controls) ? payload.controls : [];
  const density = payload.density === 'compact' ? 0.82 : 1;
  const textChars = labels.reduce((sum, label) => sum + String(label ?? '').length, 0);
  const surfaceUnits = Math.max(1, labels.length * 0.75 + controls.length * 0.55 + textChars / 42);
  return {
    surfaceUnits,
    density,
    textChars,
    controlCount: controls.length,
    labelCount: labels.length,
  };
}

export function buildSeatDivisionGeometry({
  center = { x: 0, y: 0, z: 0 },
  angle = 0,
  radialDistance = 0,
  payload = {},
  baseWidth = 0.55,
  baseDepth = 0.38,
  baseHeight = 0.08,
  clearance = 0.16,
  workspaceTarget = { x: 0, y: 0.5, z: 0 },
} = {}) {
  const measured = measureDivisionPayload(payload);
  const payloadScale = clamp(1 + (measured.surfaceUnits - 1) * 0.08, 0.9, 1.55) * measured.density;
  const width = baseWidth * payloadScale;
  const depth = baseDepth * clamp(1 + (measured.controlCount - 1) * 0.06, 0.9, 1.35);
  const height = baseHeight * clamp(1 + measured.labelCount * 0.045, 1, 1.25);
  const corridorRadius = Math.max(0.025, clearance * 0.42);
  const normal = { x: Math.cos(angle), y: 0, z: Math.sin(angle) };
  const port = {
    x: center.x + normal.x * (depth * 0.5),
    y: center.y,
    z: center.z + normal.z * (depth * 0.5),
  };
  const start = { ...port };
  const end = {
    x: Number(workspaceTarget.x) || 0,
    y: Number(workspaceTarget.y) || 0,
    z: Number(workspaceTarget.z) || 0,
  };
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const corridorLength = Math.max(0.02, Math.hypot(dx, dz));

  return {
    id: SEAT1_CONNECTION_GEOMETRY_ID,
    semantic: 'SEAT_CONNECTION',
    center: { x: Number(center.x) || 0, y: Number(center.y) || 0, z: Number(center.z) || 0 },
    dimensions: { width, depth, height },
    clearance,
    payload: measured,
    port,
    corridor: {
      start,
      end,
      length: corridorLength,
      radius: corridorRadius,
      yaw: Math.atan2(dz, dx),
      owner: SEAT1_CONNECTION_GEOMETRY_ID,
      reservedFor: ['adjacent-divisions', 'workspace-center'],
    },
    radialDistance: Number(radialDistance) || 0,
  };
}

export function connectionCorridorPoint(geometry, amount = 0) {
  const t = clamp(amount, 0, 1);
  const a = geometry?.corridor?.start || geometry?.port || { x: 0, y: 0, z: 0 };
  const b = geometry?.corridor?.end || { x: 0, y: 0, z: 0 };
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}
