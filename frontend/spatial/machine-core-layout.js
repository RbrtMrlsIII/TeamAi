const TAU = Math.PI * 2;
const polar = (radius, angle, y = 0) => ({ x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius });
const DEFAULT_SEAT_COUNT = 10;
const MIN_SEAT_COUNT = 2;
const MAX_SEAT_COUNT = 16;
const OUTER_COUNT = 4;
const seatLevel = (seatIndex) => 0.60 + ((seatIndex * 0.17) % 0.31);
const makeUiSurface = (part, style, scale = 1) => Object.freeze({
  style,
  anchor: { ...part.center, y: part.level + part.dimensions.y * 0.46 },
  width: part.dimensions.x * 0.66 * scale,
  depth: part.dimensions.z * 0.54 * scale,
  clearance: part.seam * 1.8,
});
const outerProfiles = [
  { branchId: 'BRANCH-OUTER-ALPHA', height: 0.94, silhouette: 'fin', uiStyle: 'outer-fin', uiScale: 0.78 },
  { branchId: 'BRANCH-OUTER-BETA', height: 1.08, silhouette: 'arc', uiStyle: 'outer-arc', uiScale: 0.82 },
  { branchId: 'BRANCH-OUTER-GAMMA', height: 0.98, silhouette: 'diamond', uiStyle: 'outer-diamond', uiScale: 0.88 },
  { branchId: 'BRANCH-OUTER-DELTA', height: 1.16, silhouette: 'blade', uiStyle: 'outer-blade', uiScale: 0.80 },
];
const silhouetteDimensions = {
  pod: { x: 1.34, y: 0.62, z: 1.08, seam: 0.18 }, fin: { x: 1.85, y: 0.82, z: 1.22, seam: 0.22 },
  arc: { x: 2.05, y: 0.92, z: 1.46, seam: 0.24 }, diamond: { x: 1.72, y: 1.08, z: 1.72, seam: 0.26 }, blade: { x: 1.96, y: 0.98, z: 1.28, seam: 0.24 },
};
const makeCamera = (branchId, position, target, seatIndex = null, role = 'branch') => Object.freeze({ cameraId: `BRANCH_CAMERA_${branchId}`, branchId, seatIndex, role, position: { ...position }, target: { ...target }, fov: role === 'hub' ? 38 : 34 });
const cameraForPart = (part, angle) => makeCamera(part.branchId, polar(part.kind === 'hub' ? 10.2 : 7.6, angle, part.level + (part.kind === 'hub' ? 5.1 : 2.9)), part.center, part.seatIndex, part.kind === 'hub' ? 'hub' : 'branch');
export function createBranchConnectionCore({ seatCount = DEFAULT_SEAT_COUNT, expanded = false } = {}) {
  const count = Math.min(MAX_SEAT_COUNT, Math.max(MIN_SEAT_COUNT, Math.floor(Number(seatCount) || DEFAULT_SEAT_COUNT)));
  const hub = { id: 'machine-hub-core', branchId: 'HUB-CORE', kind: 'hub', level: 0.42, center: { x: 0, y: 0.42, z: 0 }, dimensions: { x: 2.6, y: 0.78, z: 2.6 }, silhouette: 'hex', seam: 0.26, port: { x: 0, y: 0.42, z: 1.45 }, uiStyle: 'command-core', expanded: true };
  hub.uiSurface = makeUiSurface(hub, hub.uiStyle, 0.72); hub.camera = cameraForPart(hub, Math.PI / 2);
  const inner = Array.from({ length: count }, (_, seatIndex) => {
    const angle = TAU * seatIndex / count, level = seatLevel(seatIndex), center = polar(expanded ? 4.55 : 4.05, angle, level), dims = silhouetteDimensions.pod, branchId = `BRANCH-SEAT-${String(seatIndex + 1).padStart(2, '0')}`;
    const part = { id: `branch-seat-${String(seatIndex + 1).padStart(2, '0')}`, branchId, seatIndex, kind: 'inner-pod', level, center, dimensions: { ...dims }, silhouette: 'pod', seam: dims.seam, uiStyle: 'seat-configuration', port: polar(expanded ? 1.02 : 0.92, angle, level) };
    part.uiSurface = makeUiSurface(part, part.uiStyle); part.camera = cameraForPart(part, angle); return part;
  });
  const outer = outerProfiles.map((profile, outerIndex) => {
    const angle = TAU * (outerIndex * count / OUTER_COUNT + 0.5) / count, center = polar(expanded ? 7.15 : 6.45, angle, profile.height), dims = silhouetteDimensions[profile.silhouette];
    const part = { id: profile.branchId.toLowerCase(), branchId: profile.branchId, seatIndex: null, kind: 'outer-housing', level: profile.height, center, dimensions: { ...dims }, silhouette: profile.silhouette, seam: dims.seam, uiStyle: profile.uiStyle, port: polar(1.12, angle, profile.height) };
    part.uiSurface = makeUiSurface(part, part.uiStyle, profile.uiScale); part.camera = cameraForPart(part, angle); return part;
  });
  const parts = [hub, ...inner, ...outer], byBranch = new Map(parts.map((part) => [part.branchId, part])), connections = [];
  for (const pod of inner) connections.push({ id: `${pod.branchId}:HUB`, sourceBranchId: 'HUB-CORE', targetBranchId: pod.branchId, sourcePort: hub.port, targetPort: pod.port, kind: 'inner-spoke', route: [hub.port, { x: pod.center.x * 0.52, y: Math.max(hub.level, pod.level) + 0.22, z: pod.center.z * 0.52 }, pod.port] });
  outer.forEach((housing, index) => {
    const base = Math.floor(index * count / OUTER_COUNT + 0.5), left = inner[base % count], right = inner[(base + 1) % count];
    connections.push({ id: `${housing.branchId}:HUB`, sourceBranchId: 'HUB-CORE', targetBranchId: housing.branchId, sourcePort: hub.port, targetPort: housing.port, kind: 'outer-spine', route: [hub.port, { x: housing.center.x * 0.35, y: housing.level + 0.26, z: housing.center.z * 0.35 }, housing.port] });
    for (const pod of new Set([left, right])) connections.push({ id: `${housing.branchId}:${pod.branchId}`, sourceBranchId: housing.branchId, targetBranchId: pod.branchId, sourcePort: housing.port, targetPort: pod.port, kind: 'lattice-link', route: [housing.port, { x: (housing.center.x + pod.center.x) / 2, y: Math.max(housing.level, pod.level) + 0.36, z: (housing.center.z + pod.center.z) / 2 }, pod.port] });
  });
  return Object.freeze({ seatCount: count, hub, parts: Object.freeze(parts), connections: Object.freeze(connections), cameras: Object.freeze(parts.map((part) => part.camera)), byBranch });
}
export function getBranchCamera(core, branchId) { return core?.byBranch?.get(branchId)?.camera || null; }
export function resolveBranchCamera(core, branchId) { const part = core?.byBranch?.get(branchId); if (!part?.camera) return null; return Object.freeze({ ...part.camera, target: { ...part.center } }); }
