/**
 * 029 semantic Seat-division geometry contract.
 * Geometry is derived from payload/clearance inputs rather than a universal mesh size.
 * Presentation-only: no provider, authorization, or durable domain writes.
 */

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const normalize = (value) => Number(Number(value).toFixed(12));

export const SEAT1_CONNECTION_GEOMETRY_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY';

export const SEAT_DIVISION_FAN_SPAN = (5 * Math.PI) / 6;
export const SEAT_DIVISION_FAN_MAX_INDEX = 6;
export const SEAT_DIVISION_PORT_RADIUS = 0.28;

export function seatDivisionFanAngle(childIndex = 0) {
  const index = Math.max(0, Math.min(SEAT_DIVISION_FAN_MAX_INDEX, Number(childIndex) || 0));
  return -SEAT_DIVISION_FAN_SPAN / 2 + (SEAT_DIVISION_FAN_SPAN * index) / SEAT_DIVISION_FAN_MAX_INDEX;
}

export function seatDivisionFanDirection(parent = {}, childIndex = 0) {
  const radialAngle = Math.atan2(
    Number(parent?.center?.z) || 0,
    Number(parent?.center?.x) || 0,
  );
  const fanAngle = seatDivisionFanAngle(childIndex);
  const radialX = Math.cos(radialAngle);
  const radialZ = Math.sin(radialAngle);
  const tangentX = -radialZ;
  const tangentZ = radialX;
  return Object.freeze({
    radialAngle,
    fanAngle,
    x: radialX * Math.cos(fanAngle) + tangentX * Math.sin(fanAngle),
    z: radialZ * Math.cos(fanAngle) + tangentZ * Math.sin(fanAngle),
  });
}

export function seatDivisionFanRadius(parent = {}, amount = 0) {
  const scale = Math.max(
    Number(parent?.dimensions?.x) || 0,
    Number(parent?.dimensions?.z) || 0,
    0.2,
  );
  const t = clamp(amount, 0, 1);
  return scale * (1.4 + 0.3 * t);
}

export function resolveSeatDivisionSemanticId(id) {
  const match = String(id ?? '').match(/:((?:SEAT|WORKSPACE)_[A-Z_]+):GEOMETRY$/);
  return match ? match[1] : null;
}

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
  id = SEAT1_CONNECTION_GEOMETRY_ID,
} = {}) {
  const measured = measureDivisionPayload(payload);
  const payloadScale = clamp(1 + (measured.surfaceUnits - 1) * 0.08, 0.9, 1.55) * measured.density;
  const width = normalize(baseWidth * payloadScale);
  const depth = normalize(baseDepth * clamp(1 + (measured.controlCount - 1) * 0.06, 0.9, 1.35));
  const height = normalize(baseHeight * clamp(1 + measured.labelCount * 0.045, 1, 1.25));
  const corridorRadius = normalize(Math.max(0.025, clearance * 0.42));
  const normal = { x: Math.cos(angle), y: 0, z: Math.sin(angle) };
  const port = {
    x: normalize(center.x + normal.x * (depth * 0.5)),
    y: normalize(center.y),
    z: normalize(center.z + normal.z * (depth * 0.5)),
  };
  const start = { ...port };
  const end = {
    x: normalize(Number(workspaceTarget.x) || 0),
    y: normalize(Number(workspaceTarget.y) || 0),
    z: normalize(Number(workspaceTarget.z) || 0),
  };
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const corridorLength = normalize(Math.max(0.02, Math.hypot(dx, dz)));

  return {
    id,
    semantic: resolveSeatDivisionSemanticId(id) || 'UNKNOWN',
    center: {
      x: normalize(Number(center.x) || 0),
      y: normalize(Number(center.y) || 0),
      z: normalize(Number(center.z) || 0),
    },
    dimensions: { width, depth, height },
    clearance: normalize(clearance),
    payload: measured,
    port,
    corridor: {
      start,
      end,
      length: corridorLength,
      radius: corridorRadius,
      yaw: normalize(Math.atan2(dz, dx)),
      owner: id,
      reservedFor: ['adjacent-divisions', 'workspace-center'],
    },
    radialDistance: normalize(Number(radialDistance) || 0),
  };
}

export function connectionCorridorPoint(geometry, amount = 0) {
  const t = clamp(amount, 0, 1);
  const a = geometry?.corridor?.start || geometry?.port || { x: 0, y: 0, z: 0 };
  const b = geometry?.corridor?.end || { x: 0, y: 0, z: 0 };
  return {
    x: normalize(a.x + (b.x - a.x) * t),
    y: normalize(a.y + (b.y - a.y) * t),
    z: normalize(a.z + (b.z - a.z) * t),
  };
}
