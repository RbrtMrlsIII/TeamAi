const TAU = Math.PI * 2;

const polar = (radius, angle, y = 0) => ({ x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius });

const innerProfiles = [
  { branchId: 'BRANCH-SEAT-01', seatIndex: 0, angle: 0, height: 0.62, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-02', seatIndex: 1, angle: TAU * 1 / 8, height: 0.76, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-03', seatIndex: 2, angle: TAU * 2 / 8, height: 0.68, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-04', seatIndex: 3, angle: TAU * 3 / 8, height: 0.83, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-05', seatIndex: 4, angle: TAU * 4 / 8, height: 0.70, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-06', seatIndex: 5, angle: TAU * 5 / 8, height: 0.88, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-07', seatIndex: 6, angle: TAU * 6 / 8, height: 0.66, silhouette: 'pod' },
  { branchId: 'BRANCH-SEAT-08', seatIndex: 7, angle: TAU * 7 / 8, height: 0.80, silhouette: 'pod' },
];

const outerProfiles = [
  { branchId: 'BRANCH-OUTER-ALPHA', angle: TAU * 0.25 / 4, height: 0.94, silhouette: 'fin' },
  { branchId: 'BRANCH-OUTER-BETA', angle: TAU * 1.25 / 4, height: 1.08, silhouette: 'arc' },
  { branchId: 'BRANCH-OUTER-GAMMA', angle: TAU * 2.25 / 4, height: 0.98, silhouette: 'diamond' },
  { branchId: 'BRANCH-OUTER-DELTA', angle: TAU * 3.25 / 4, height: 1.16, silhouette: 'blade' },
];

const silhouetteDimensions = {
  pod: { x: 1.34, y: 0.62, z: 1.08, seam: 0.18 },
  fin: { x: 1.85, y: 0.82, z: 1.22, seam: 0.22 },
  arc: { x: 2.05, y: 0.92, z: 1.46, seam: 0.24 },
  diamond: { x: 1.72, y: 1.08, z: 1.72, seam: 0.26 },
  blade: { x: 1.96, y: 0.98, z: 1.28, seam: 0.24 },
};

const makeCamera = (branchId, position, target, seatIndex = null, role = 'branch') => Object.freeze({
  cameraId: `BRANCH_CAMERA_${branchId}`,
  branchId,
  seatIndex,
  role,
  position: { ...position },
  target: { ...target },
  fov: role === 'hub' ? 38 : 34,
});

export function createBranchConnectionCore({ expanded = false } = {}) {
  const hub = {
    id: 'machine-hub-core', branchId: 'HUB-CORE', kind: 'hub', level: 0.42,
    center: { x: 0, y: 0.42, z: 0 }, dimensions: { x: 2.6, y: 0.78, z: 2.6 },
    silhouette: 'hex', seam: 0.26, port: { x: 0, y: 0.42, z: 1.45 },
    uiStyle: 'command-core', expanded: true,
  };
  hub.camera = makeCamera('HUB-CORE', { x: 0, y: 5.8, z: 8.4 }, hub.center, null, 'hub');

  const inner = innerProfiles.map((profile) => {
    const center = polar(expanded ? 4.25 : 3.75, profile.angle, profile.height);
    const dims = silhouetteDimensions.pod;
    return {
      id: profile.branchId.toLowerCase(), branchId: profile.branchId, seatIndex: profile.seatIndex,
      kind: 'inner-pod', level: profile.height, center, dimensions: { ...dims },
      silhouette: profile.silhouette, seam: dims.seam, uiStyle: 'seat-configuration',
      port: polar(expanded ? 1.02 : 0.92, profile.angle, profile.height),
      camera: makeCamera(profile.branchId, polar(7.6, profile.angle, profile.height + 2.9), center, profile.seatIndex),
    };
  });

  const outer = outerProfiles.map((profile) => {
    const center = polar(expanded ? 6.9 : 6.25, profile.angle, profile.height);
    const dims = silhouetteDimensions[profile.silhouette];
    return {
      id: profile.branchId.toLowerCase(), branchId: profile.branchId, seatIndex: null,
      kind: 'outer-housing', level: profile.height, center, dimensions: { ...dims },
      silhouette: profile.silhouette, seam: dims.seam, uiStyle: `outer-${profile.silhouette}`,
      port: polar(1.12, profile.angle, profile.height),
      camera: makeCamera(profile.branchId, polar(10.2, profile.angle, profile.height + 4.1), center),
    };
  });

  const parts = [hub, ...inner, ...outer];
  const byBranch = new Map(parts.map((part) => [part.branchId, part]));
  const connections = [];
  for (const pod of inner) connections.push({ id: `${pod.branchId}:HUB`, sourceBranchId: 'HUB-CORE', targetBranchId: pod.branchId, sourcePort: hub.port, targetPort: pod.port, kind: 'inner-spoke', route: [hub.port, { x: pod.center.x * 0.52, y: Math.max(hub.level, pod.level) + 0.22, z: pod.center.z * 0.52 }, pod.port] });
  outer.forEach((housing, index) => {
    const left = inner[(index * 2) % inner.length];
    const right = inner[(index * 2 + 1) % inner.length];
    connections.push({ id: `${housing.branchId}:HUB`, sourceBranchId: 'HUB-CORE', targetBranchId: housing.branchId, sourcePort: hub.port, targetPort: housing.port, kind: 'outer-spine', route: [hub.port, { x: housing.center.x * 0.35, y: housing.level + 0.26, z: housing.center.z * 0.35 }, housing.port] });
    connections.push({ id: `${housing.branchId}:${left.branchId}`, sourceBranchId: housing.branchId, targetBranchId: left.branchId, sourcePort: housing.port, targetPort: left.port, kind: 'lattice-link', route: [housing.port, { x: (housing.center.x + left.center.x) / 2, y: Math.max(housing.level, left.level) + 0.36, z: (housing.center.z + left.center.z) / 2 }, left.port] });
    connections.push({ id: `${housing.branchId}:${right.branchId}`, sourceBranchId: housing.branchId, targetBranchId: right.branchId, sourcePort: housing.port, targetPort: right.port, kind: 'lattice-link', route: [housing.port, { x: (housing.center.x + right.center.x) / 2, y: Math.max(housing.level, right.level) + 0.42, z: (housing.center.z + right.center.z) / 2 }, right.port] });
  });
  return Object.freeze({ hub, parts: Object.freeze(parts), connections: Object.freeze(connections), cameras: Object.freeze(parts.map((part) => part.camera)), byBranch });
}
export function getBranchCamera(core, branchId) { return core?.byBranch?.get(branchId)?.camera || null; }
