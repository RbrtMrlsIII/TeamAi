import { clampSeatCount, MACHINE_DEFAULT_SEAT_COUNT } from './seat-capacity.js';
import { deriveExpandedMachineCoreRadii } from './hero-world-profile.js';
import { createSpatialConstructionContext, validateSpatialRootedCore } from './machine-spatial-root-contract.js';
import { buildMachineCoreConnections } from './machine-core-topology.js';
import { deriveMachinePodAssembly, validateMachinePodAssembly } from './machine-pod-assembly.js';
const TAU = Math.PI * 2;
const polar = (radius, angle, y = 0) => ({ x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius });
const DEFAULT_SEAT_COUNT = 10;
const OUTER_COUNT = 4;
const TREE_HERO_SEAT = 'TREE-HERO-SEAT';
const SEAT_SHELL = 'SEAT_SHELL';
const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));
const seatLevel = (seatIndex) => 0.60 + ((seatIndex * 0.17) % 0.31);
const makeUiSurface = (part, style, scale = 1) => Object.freeze({ style, anchor: { ...part.center, y: part.level + part.dimensions.y * 0.46 }, width: part.dimensions.x * 0.66 * scale, depth: part.dimensions.z * 0.54 * scale, clearance: part.seam * 1.8 });
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
const ROOT_OWNER = Object.freeze({
  scene: 'frontend/spatial/machine-core-layout.js',
  hub: 'frontend/spatial/hero-workspace-core.js',
  pod: 'frontend/spatial/machine-pod-assembly.js',
  facility: 'frontend/spatial/machine-core-layout.js',
  topology: 'frontend/spatial/machine-core-topology.js',
});
const outerAngle = (count, outerIndex) => {
  if (count < OUTER_COUNT) return (outerIndex + 0.5) * (TAU / OUTER_COUNT);
  const quadrant = TAU * outerIndex / OUTER_COUNT;
  const step = TAU / count;
  const nearestSeatIndex = Math.floor(quadrant / step);
  return (nearestSeatIndex + 0.5) * step;
};

export function seatShellBranchId(seatIndex) {
  return `BRANCH-SEAT-${String(Number(seatIndex) + 1).padStart(2, '0')}`;
}

/** Projection from canonical Census identity. This is not a second semantic hierarchy. */
export function bindSeatShellProjection({ seatIndex, branchId } = {}) {
  const index = Number.isInteger(Number(seatIndex)) ? Number(seatIndex) : NaN;
  const expected = Number.isInteger(index) ? seatShellBranchId(index) : null;
  if (!Number.isInteger(index) || index < 0 || branchId !== expected) {
    return Object.freeze({
      treeId: null,
      semanticId: null,
      semanticKey: null,
      semanticBoundary: 'presentation-only',
    });
  }
  return Object.freeze({
    treeId: TREE_HERO_SEAT,
    semanticId: SEAT_SHELL,
    semanticKey: `${TREE_HERO_SEAT}#${index}:${SEAT_SHELL}`,
    semanticBoundary: 'presentation-only',
  });
};
export function createBranchConnectionCore({ seatCount = DEFAULT_SEAT_COUNT, expanded = false, expansionAmount = null } = {}) {
  const count = clampSeatCount(seatCount, MACHINE_DEFAULT_SEAT_COUNT);
  const amount = expansionAmount == null ? (expanded ? 1 : 0) : clamp01(expansionAmount);
  const coreRadii = deriveExpandedMachineCoreRadii(count, amount);
  const innerRadius = coreRadii.seatShellRadius;
  const adjacentCenterSpacing = count > 1
    ? 2 * innerRadius * Math.sin(Math.PI / count)
    : null;
  const outerRadius = coreRadii.outerHousingRadius;
  let hub = { id: 'machine-hub-core', branchId: 'HUB-CORE', kind: 'hub', level: 0.42, center: { x: 0, y: 0.42, z: 0 }, dimensions: { x: 2.6, y: 0.78, z: 2.6 }, silhouette: 'hex', seam: 0.26, port: { x: 0, y: 0.42, z: 1.45 }, uiStyle: 'command-core', expanded: true, semanticId: null, semanticKey: null, semanticBoundary: 'presentation-only', ...createSpatialConstructionContext({ slice: 'S2', owner: ROOT_OWNER.hub, semanticBoundary: 'presentation-only' }) };
  hub.uiSurface = makeUiSurface(hub, hub.uiStyle, 0.72); hub.camera = cameraForPart(hub, Math.PI / 2);
  const inner = Array.from({ length: count }, (_, seatIndex) => {
    const angle = TAU * seatIndex / count, level = seatLevel(seatIndex), center = polar(innerRadius, angle, level), dims = silhouetteDimensions.pod, branchId = seatShellBranchId(seatIndex);
    const semantic = bindSeatShellProjection({ seatIndex, branchId });
    const part = { id: `branch-seat-${String(seatIndex + 1).padStart(2, '0')}`, branchId, seatIndex, kind: 'inner-pod', level, center, dimensions: { ...dims }, silhouette: 'pod', seam: dims.seam, uiStyle: 'seat-configuration', port: null, ...semantic, ...createSpatialConstructionContext({ slice: 'S3', owner: ROOT_OWNER.pod, semanticId: semantic.semanticId, semanticBoundary: semantic.semanticBoundary }) };
    const podAssembly = deriveMachinePodAssembly({
      part,
      expansionAmount: amount,
      adjacentCenterSpacing,
    });
    const podAssemblyValidation = validateMachinePodAssembly(podAssembly);
    if (!podAssemblyValidation.valid) {
      throw new Error(`invalid S3 pod assembly: ${podAssemblyValidation.reasons.join(', ')}`);
    }
    part.podAssembly = podAssembly;
    part.port = Object.freeze({ ...podAssembly.localInterfaces.connection.point });
    part.uiSurface = makeUiSurface(part, part.uiStyle); part.camera = cameraForPart(part, angle); return part;
  });
  const outer = outerProfiles.map((profile, outerIndex) => {
    const angle = outerAngle(count, outerIndex), center = polar(outerRadius, angle, profile.height), dims = silhouetteDimensions[profile.silhouette];
    const part = { id: profile.branchId.toLowerCase(), branchId: profile.branchId, seatIndex: null, kind: 'outer-housing', level: profile.height, center, dimensions: { ...dims }, silhouette: profile.silhouette, seam: dims.seam, uiStyle: profile.uiStyle, port: polar(1.12, angle, profile.height), semanticId: null, semanticKey: null, semanticBoundary: 'presentation-only', ...createSpatialConstructionContext({ slice: 'S7', owner: ROOT_OWNER.facility, semanticBoundary: 'presentation-only' }) };
    part.uiSurface = makeUiSurface(part, profile.uiStyle, profile.uiScale); part.camera = cameraForPart(part, angle); return part;
  });
  const parts = [hub, ...inner, ...outer], byBranch = new Map(parts.map((part) => [part.branchId, part]));
  const connections = buildMachineCoreConnections({
    hub,
    innerPods: inner,
    outerHousings: outer,
    seatCount: count,
    expansionAmount: amount,
  });
  const sceneContext = createSpatialConstructionContext({ slice: 'S1', owner: ROOT_OWNER.scene, semanticBoundary: 'presentation-only' });
  const validation = validateSpatialRootedCore({ seatCount: count, expansionAmount: amount, parts, connections });
  if (!validation.valid) throw new Error(`invalid spatial root contract: ${validation.reasons.join(', ')}`);
  return Object.freeze({ seatCount: count, expansionAmount: amount, hub, parts: Object.freeze(parts), connections: Object.freeze(connections), cameras: Object.freeze(parts.map((part) => part.camera)), byBranch, constructionSlice: sceneContext.constructionSlice, constructionLayer: sceneContext.constructionLayer, constructionOwner: sceneContext.constructionOwner, inheritedStructuralRoots: sceneContext.inheritedStructuralRoots, rootValidation: validation });
}
export function getBranchCamera(core, branchId) { return core?.byBranch?.get(branchId)?.camera || null; }
export function resolveBranchCamera(core, branchId) { const part = core?.byBranch?.get(branchId); if (!part?.camera) return null; return Object.freeze({ ...part.camera, target: { ...part.center } }); }
