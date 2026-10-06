/**
 * TEAM-EXPERIENCE-029 / Y1
 * Three.js scene/rendering adapter.
 *
 * This module consumes existing spatial descriptors and converts them into
 * Three.js scene objects. It does not decide semantic identity, topology,
 * geometry ownership, camera subject, authorization, or runtime truth.
 */

import { mapHeroThemeLighting } from './hero-theme-lighting-adapter.js';
import { deriveBackendDisplayPlacements, BACKEND_DISPLAY_V1 } from './hero-r1-backend-display.js';
import { deriveSetupConfigPlacements, SETUP_CONFIG_V1 } from './hero-r2-setup-ring.js';
import { deriveConcentricRingEnvelope } from './hero-ring-envelope.js';
import { deriveWorkspaceCoreGeometry } from './hero-workspace-core.js';
import { deriveMachineWorldProfile } from './hero-world-profile.js';
import { RING_R1_SCALE, RING_R2_SCALE } from './hero-world-contract.js';

import { authoredHeroMaterialSet } from './hero-authored-materials.js';
import { getRenderableMachineWorldConduitSegments } from './machine-world-topology.js';
import { getRenderableMachineWorldStructuralConduitSegments } from './machine-world-structural-conduit.js';
import {
  derivePodDivisionDockingCollars,
  derivePodDivisionDockingSockets,
  derivePodDivisionMountingFixtures,
} from './machine-world-pod-docking-embodiment.js';
import {
  MACHINE_POD_SHELL_PROFILE,
  getMachinePodShellOutline,
} from './machine-pod-profile.js';
import {
  getMachineSeatAuthorizationShieldOutline,
  getMachineSeatBehaviorBaffleOutline,
  getMachineSeatWorkspaceScopeFrameRecipe,
  resolveMachineSeatWorkspaceScopeFrameRailThickness,
  getMachineSeatCapabilitiesLatticeRecipe,
  resolveMachineSeatCapabilitiesLatticeRailThickness,
  getMachineSeatConnectionCouplerRecipe,
  resolveMachineSeatConnectionCouplerRailThickness,
  getMachineSeatToolkitRackRecipe,
  resolveMachineSeatToolkitRackRailThickness,
  MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE,
  MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE,
  MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE,
  MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE,
  MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE,
  MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE,
  resolveMachineSeatDivisionProfileShape,
} from './machine-seat-division-profile.js';

export const MACHINE_THREE_ADAPTER_ID = 'MACHINE-THREE-SCENE-ADAPTER';
export const MACHINE_THREE_ADAPTER_VERSION = 'Y1-V2';
export const MACHINE_THREE_REQUIRED_WEBGL = 'WEBGL2';

export const AUTHORED_POD_SHELL_PROFILE = MACHINE_POD_SHELL_PROFILE;

export function resolveThreePodShellOutline() {
  return getMachinePodShellOutline();
}

const SHAPE_BY_PROFILE = Object.freeze([
  [AUTHORED_POD_SHELL_PROFILE, 'POD_SHELL'],
  ['concentric-articulation', 'TORUS'],
  ['status-band', 'TORUS'],
  ['torus', 'TORUS'],
  ['cylinder', 'CYLINDER'],
  ['connection-port', 'CYLINDER'],
  ['radial-collar', 'CYLINDER'],
  ['oct-', 'CYLINDER'],
  ['hex-', 'CYLINDER'],
  ['dodec-', 'CYLINDER'],
  ['reactor-guard', 'BOX'],
  ['brace', 'BOX'],
  ['rail', 'BOX'],
  ['panel', 'BOX'],
  ['strut', 'BOX'],
]);

const DEFAULT_SHAPE = 'BOX';

export function resolveThreeConduitRenderShape(segment = {}) {
  return segment?.structuralConduit === true || segment?.edgeKind === 'pod-division' ? 'TUBE' : 'BOX';
}


export function deriveThreeCanonicalRingDescriptors({
  seatCount = 10,
  seatRingRadius = null,
  articulationAmount = 0,
  signalAmount = 0,
  ringFocus = null,
  reducedMotion = true,
} = {}) {
  const profile = deriveMachineWorldProfile(seatCount);
  const workspaceCore = deriveWorkspaceCoreGeometry({
    workspaceRadius: profile.workspaceFootprint,
    expansionAmount: articulationAmount,
  });
  const resolvedSeatRingRadius = Number.isFinite(Number(seatRingRadius))
    ? Number(seatRingRadius)
    : profile.seatShellRadius;
  const envelope = deriveConcentricRingEnvelope({
    r0Radius: workspaceCore.radius,
    r3Radius: resolvedSeatRingRadius,
    ringR1Scale: RING_R1_SCALE,
    ringR2Scale: RING_R2_SCALE,
  });
  const descriptors = [];

  const r1Placements = deriveBackendDisplayPlacements({
    workspaceRadius: profile.workspaceFootprint,
    ringScale: RING_R1_SCALE,
    ringRadius: envelope.r1Radius,
    catalog: BACKEND_DISPLAY_V1,
  });
  const r1Articulation = Math.max(0, Math.min(1, Number(articulationAmount) || 0));
  const r1Deploy = 0.68 + 0.32 * r1Articulation;
  for (const placement of r1Placements) {
    const focused = ringFocus?.ring === 'r1' && ringFocus.index === placement.index;
    descriptors.push(
      {
        id: placement.id + ':MOUNT',
        semanticId: placement.id,
        parentId: 'R1-BACKEND-DISPLAY-RING',
        shape: 'CYLINDER',
        profile: 'r1-backend-display-mount',
        center: { x: placement.x, y: placement.y - 0.08, z: placement.z },
        dimensions: {
          x: 0.56 * r1Deploy,
          y: 0.12 * r1Deploy,
          z: 0.56 * r1Deploy,
        },
        rotationY: placement.angle,
        materialRole: 'metal',
        constructionSlice: 'R1',
        constructionOwner: 'frontend/spatial/hero-r1-backend-display.js',
        presentationOnly: true,
        ringId: 'R1',
        ringRadius: envelope.r1Radius,
      },
      {
        id: placement.id + ':BODY',
        semanticId: placement.id,
        parentId: 'R1-BACKEND-DISPLAY-RING',
        shape: 'CUBE',
        profile: 'r1-backend-display-body',
        center: { x: placement.x, y: placement.y - 0.01, z: placement.z },
        dimensions: {
          x: 1.44 * r1Deploy,
          y: 0.16 * r1Deploy,
          z: 0.52 * r1Deploy,
        },
        rotationY: placement.angle,
        materialRole: 'metal2',
        constructionSlice: 'R1',
        constructionOwner: 'frontend/spatial/hero-r1-backend-display.js',
        presentationOnly: true,
        ringId: 'R1',
        ringRadius: envelope.r1Radius,
      },
      {
        id: placement.id + ':FACE',
        semanticId: placement.id,
        parentId: 'R1-BACKEND-DISPLAY-RING',
        shape: 'CUBE',
        profile: 'r1-backend-display-face',
        center: { x: placement.x, y: placement.y + 0.13 * r1Articulation, z: placement.z },
        dimensions: {
          x: 1.10 * r1Deploy * (focused ? 1.08 : 1),
          y: 0.12 * r1Deploy,
          z: 0.76 * r1Deploy * (focused ? 1.08 : 1),
        },
        rotationY: placement.angle + Math.PI / 2,
        materialRole: 'glass',
        constructionSlice: 'R1',
        constructionOwner: 'frontend/spatial/hero-r1-backend-display.js',
        presentationOnly: true,
        ringId: 'R1',
        ringRadius: envelope.r1Radius,
      },
      {
        id: placement.id + ':RING',
        semanticId: placement.id,
        parentId: 'R1-BACKEND-DISPLAY-RING',
        shape: 'TORUS',
        profile: 'r1-backend-display-ring',
        center: { x: placement.x, y: placement.y + 0.08, z: placement.z },
        dimensions: { x: 0.44, y: 0.12, z: 0.44 },
        rotationY: 0,
        materialRole: focused ? 'energy' : 'trace',
        constructionSlice: 'R1',
        constructionOwner: 'frontend/spatial/hero-r1-backend-display.js',
        presentationOnly: true,
        ringId: 'R1',
        ringRadius: envelope.r1Radius,
      },
    );
  }

  const r2Placements = deriveSetupConfigPlacements({
    workspaceRadius: profile.workspaceFootprint,
    ringScale: RING_R2_SCALE,
    ringRadius: envelope.r2Radius,
    items: SETUP_CONFIG_V1,
  });
  const r2Articulation = Math.max(0, Math.min(1, Number(articulationAmount) || 0));
  const r2Fill = Math.max(0, Math.min(1, Number(signalAmount) || 0));
  const r2Scale = 0.84 + 0.16 * r2Articulation;
  for (const placement of r2Placements) {
    const itemScale = (placement.kind === 'engine' || placement.kind === 'auth' ? 0.42 : 0.36) * r2Scale * (1 + 0.14 * r2Fill);
    descriptors.push(
      {
        id: placement.id + ':BASE',
        semanticId: placement.id,
        parentId: 'R2-SETUP-CONFIG-RING',
        shape: 'CYLINDER',
        profile: 'r2-setup-config-base',
        center: { x: placement.x, y: placement.y, z: placement.z },
        dimensions: { x: itemScale * 2.2, y: 0.14, z: itemScale * 2.2 },
        rotationY: placement.angle,
        materialRole: 'metal',
        constructionSlice: 'R2',
        constructionOwner: 'frontend/spatial/hero-r2-setup-ring.js',
        presentationOnly: true,
        ringId: 'R2',
        ringRadius: envelope.r2Radius,
      },
      {
        id: placement.id + ':RING',
        semanticId: placement.id,
        parentId: 'R2-SETUP-CONFIG-RING',
        shape: 'TORUS',
        profile: 'r2-setup-config-ring',
        center: { x: placement.x, y: placement.y + 0.09, z: placement.z },
        dimensions: { x: itemScale * 2, y: 0.12, z: itemScale * 2 },
        rotationY: 0,
        materialRole: placement.kind === 'auth' ? 'energy' : 'metal2',
        constructionSlice: 'R2',
        constructionOwner: 'frontend/spatial/hero-r2-setup-ring.js',
        presentationOnly: true,
        ringId: 'R2',
        ringRadius: envelope.r2Radius,
      },
      {
        id: placement.id + ':FACE',
        semanticId: placement.id,
        parentId: 'R2-SETUP-CONFIG-RING',
        shape: 'CUBE',
        profile: 'r2-setup-config-face',
        center: { x: placement.x, y: placement.y + 0.16, z: placement.z },
        dimensions: { x: 0.22, y: 0.06, z: 0.14 },
        rotationY: placement.angle,
        materialRole: 'glass',
        constructionSlice: 'R2',
        constructionOwner: 'frontend/spatial/hero-r2-setup-ring.js',
        presentationOnly: true,
        ringId: 'R2',
        ringRadius: envelope.r2Radius,
      },
    );
  }

  return Object.freeze(descriptors.map((entry) => Object.freeze({
    ...entry,
    dimensions: Object.freeze({ ...entry.dimensions }),
    center: Object.freeze({ ...entry.center }),
  })));
}

export function normalizeThreeShape({ shape = '', profile = '' } = {}) {
  const rawShape = String(shape || '').trim().toUpperCase();
  const profileShape = resolveMachineSeatDivisionProfileShape({
    profile,
    fallbackShape: '',
  });
  if (profileShape) return profileShape;
  if (rawShape === 'TORUS') return 'TORUS';
  if (rawShape === 'CYL' || rawShape === 'CYLINDER') return 'CYLINDER';
  if (rawShape === 'SPH' || rawShape === 'SPHERE') return 'SPHERE';
  if (rawShape === 'CUBE' || rawShape === 'BOX') return 'BOX';

  const normalizedProfile = String(profile || '').trim().toLowerCase();
  for (const [token, resolved] of SHAPE_BY_PROFILE) {
    if (normalizedProfile.includes(token)) return resolved;
  }
  return DEFAULT_SHAPE;
}

export function normalizeThreeDescriptor(part, parentId = 'MACHINE') {
  if (!part?.id) throw new Error('Three.js descriptor requires an id');
  const center = {
    x: Number.isFinite(Number(part.center?.x)) ? Number(part.center.x) : 0,
    y: Number.isFinite(Number(part.center?.y)) ? Number(part.center.y) : 0,
    z: Number.isFinite(Number(part.center?.z)) ? Number(part.center.z) : 0,
  };
  const dimensions = {
    x: Math.max(0.001, Number(part.dimensions?.x) || (Number(part.radius) || 0.5) * 2),
    y: Math.max(0.001, Number(part.dimensions?.y) || Number(part.height) || 0.5),
    z: Math.max(0.001, Number(part.dimensions?.z) || (Number(part.radius) || 0.5) * 2),
  };
  const outline = Array.isArray(part.outline)
    ? Object.freeze(part.outline.map((point) => Object.freeze([
        Number(point?.[0]) || 0,
        Number(point?.[1]) || 0,
      ])))
    : null;
  return Object.freeze({
    id: String(part.id),
    semanticId: part.semanticId == null ? null : String(part.semanticId),
    parentId: String(parentId),
    shape: normalizeThreeShape(part),
    profile: String(part.profile || part.role || ''),
    center: Object.freeze(center),
    outline,
    dimensions: Object.freeze(dimensions),
    rotationY: Number.isFinite(Number(part.rotationY)) ? Number(part.rotationY) : 0,
    materialRole: part.role === 'status-indicator'
      ? 'accent'
      : DIVISION_AUTHORED_ROLE_BY_SEMANTIC_ID[String(part.semanticId || '')]
        || String(part.materialRole || 'substrate-neutral'),
    constructionSlice: String(part.constructionSlice || ''),
    constructionOwner: String(part.constructionOwner || ''),
  });
}

export function resolveThreePolygonSegments({ profile = '', semanticId = '', shape = '' } = {}) {
  if (String(shape || '').toUpperCase() !== 'CYLINDER') return 10;
  const identity = String(profile || semanticId || '').toLowerCase();
  if (identity.includes('dodec')) return 12;
  if (identity.includes('oct')) return 8;
  if (identity.includes('hex')) return 6;
  return 10;
}

export function collectThreeDescriptors({ core = null, pods = [], facilities = [], divisions = [], extras = [] } = {}) {
  const descriptors = [];
  const add = (part, parentId) => {
    if (!part) return;
    descriptors.push(normalizeThreeDescriptor(part, parentId));
  };

  for (const part of core?.components || []) add(part, core?.id || 'MACHINE-CORE-ASSEMBLY');
  for (const part of core?.mechanicalDetails || []) add(part, core?.id || 'MACHINE-CORE-ASSEMBLY');
  for (const pod of Array.isArray(pods) ? pods : []) {
    const mechanical = pod?.mechanicalPresentation;
    for (const part of pod?.components || []) {
      if (
        part?.role === 'outer-shell'
        && mechanical
        && Number(mechanical.amount) > 0.02
      ) {
        for (const side of [-1, 1]) {
          add({
            ...part,
            id: part.id + ':PANEL:' + (side > 0 ? 'RIGHT' : 'LEFT'),
            center: {
              x: part.center.x
                + Number(mechanical.tangent?.x || 0) * Number(mechanical.shellPanelSeparation || 0) * side
                + Number(mechanical.outward?.x || 0) * Number(mechanical.shellPanelTravel || 0),
              y: part.center.y + Number(mechanical.shellPanelLift || 0),
              z: part.center.z
                + Number(mechanical.tangent?.z || 0) * Number(mechanical.shellPanelSeparation || 0) * side
                + Number(mechanical.outward?.z || 0) * Number(mechanical.shellPanelTravel || 0),
            },
            dimensions: {
              x: Math.abs(Number(part.dimensions?.x) || 0) * 0.54,
              y: Number(part.dimensions?.y) || 0,
              z: Math.abs(Number(part.dimensions?.z) || 0) * 0.88,
            },
            rotationY: Number(part.rotationY || 0)
              + Number(mechanical.outwardAngle || 0)
              - Number(part.rotationY || 0)
              + Number(mechanical.shellPanelRotation || 0) * side,
          }, pod?.id || 'MACHINE-POD-ASSEMBLY');
        }
        continue;
      }
      add(part, pod?.id || 'MACHINE-POD-ASSEMBLY');
    }
    for (const part of pod?.mechanicalDetails || []) add(part, pod?.id || 'MACHINE-POD-ASSEMBLY');
  }
  for (const facility of Array.isArray(facilities) ? facilities : []) {
    for (const part of facility?.components || []) add(part, facility?.id || 'MACHINE-FACILITY-ASSEMBLY');
    for (const part of facility?.mechanicalDetails || []) add(part, facility?.id || 'MACHINE-FACILITY-ASSEMBLY');
  }
  for (const facility of Array.isArray(facilities) ? facilities : []) {
    for (const part of facility?.physicalInterfaces || []) add(part, facility?.id || 'MACHINE-FACILITY-MACHINERY');
  }
  for (const division of Array.isArray(divisions) ? divisions : []) {
    for (const part of division?.components || []) add(part, division?.id || 'MACHINE-SEAT-DIVISION-ASSEMBLY');
    for (const part of division?.mechanicalDetails || []) add(part, division?.id || 'MACHINE-SEAT-DIVISION-ASSEMBLY');
  }
  for (const part of Array.isArray(extras) ? extras : []) add(part, 'MACHINE-STRUCTURAL-EXTRA');

  return Object.freeze(descriptors);
}

const AUTHORED_ROLE_ALIASES = Object.freeze({
  'seat-shell': 'seatShell',
  'seat-inset': 'seatShellInset',
  'workspace-ring': 'workspaceRing',
});

const DIVISION_AUTHORED_ROLE_BY_SEMANTIC_ID = Object.freeze({
  SEAT_CONNECTION: 'divisionConnection',
  SEAT_BEHAVIOR: 'divisionBehavior',
  SEAT_TOOLKIT: 'divisionToolkit',
  SEAT_CAPABILITIES: 'divisionCapabilities',
  SEAT_AUTHORIZATION: 'divisionAuthorization',
  SEAT_WORKSPACE_SCOPE: 'divisionScope',
  SEAT_TASK_EVIDENCE: 'divisionEvidence',
});

const METALLIC_ROLE_LEVEL = Object.freeze({
  metal: 0.82,
  metal2: 0.70,
  glass: 0.04,
  energy: 0.18,
  trace: 0.36,
  conduit: 0.46,
  seatShell: 0.12,
  seatShellInset: 0.24,
  workspaceRing: 0.86,
});

function resolveStructuralThemeLighting() {
  const root = globalThis.document?.documentElement;
  return mapHeroThemeLighting({
    themeMode: root?.getAttribute?.('data-theme-mode') || 'light',
    themeSource: root?.getAttribute?.('data-theme-source') || 'default',
    density: root?.getAttribute?.('data-density') || 'default',
    atmosphere: 0.52,
    surface: 0.62,
    focus: 0.24,
    signal: 0,
    status: 0,
    reducedMotion: true,
  });
}

export function resolveThreeMaterialPresentation(role, authored = authoredHeroMaterialSet({})) {
  const roleName = String(role || 'metal2');
  const requestedRole = AUTHORED_ROLE_ALIASES[roleName] || roleName;
  const authoredRole = authored[requestedRole]
    ? requestedRole
    : authored.metal2
      ? 'metal2'
      : 'metal';
  const definition = authored[authoredRole] || authoredHeroMaterialSet({}).metal2;
  const metallicKey = authoredRole in METALLIC_ROLE_LEVEL
    ? authoredRole
    : 'metal2';
  const glass = authoredRole === 'glass';
  const conduit = authoredRole === 'conduit';
  return Object.freeze({
    authoredRole,
    color: Object.freeze([...definition.color]),
    roughness: Math.max(0, Math.min(1, Number(definition.rough) || 0)),
    metalness: METALLIC_ROLE_LEVEL[metallicKey],
    transparent: glass || conduit,
    opacity: glass ? 0.68 : conduit ? 0.50 : 1,
    emissive: Object.freeze([...definition.color]),
    emissiveIntensity: Math.max(0, Math.min(1, Number(definition.emit) || 0)),
    name: 'S24_AUTHORED:' + authoredRole,
  });
}

function makeAuthoredMaterial(THREE, role, authored) {
  const presentation = resolveThreeMaterialPresentation(role, authored);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(...presentation.color),
    metalness: presentation.metalness,
    roughness: presentation.roughness,
    transparent: presentation.transparent,
    opacity: presentation.opacity,
    emissive: new THREE.Color(...presentation.emissive),
    emissiveIntensity: presentation.emissiveIntensity,
  });
  material.name = presentation.name;
  if (presentation.transparent) material.depthWrite = false;
  return material;
}

function buildExtrudedPolygonGeometry(THREE, descriptor, outline) {
  const { x, y, z } = descriptor.dimensions;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const [px, pz] of outline) {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minZ = Math.min(minZ, pz);
    maxZ = Math.max(maxZ, pz);
  }
  const outlineCenterX = (minX + maxX) * 0.5;
  const outlineCenterZ = (minZ + maxZ) * 0.5;
  const outlineWidth = Math.max(0.001, maxX - minX);
  const outlineDepth = Math.max(0.001, maxZ - minZ);
  const scaleX = x / outlineWidth;
  const scaleZ = z / outlineDepth;
  const halfY = y * 0.5;
  const vertices = [];
  const point = ([px, pz], yy) => [
    (px - outlineCenterX) * scaleX,
    yy,
    (pz - outlineCenterZ) * scaleZ,
  ];
  const pushTri = (a, b, cc) => vertices.push(...a, ...b, ...cc);
  const bottomCenter = [0, -halfY, 0];
  const topCenter = [0, halfY, 0];
  for (let index = 1; index < outline.length - 1; index += 1) {
    pushTri(
      bottomCenter,
      point(outline[index], -halfY),
      point(outline[index + 1], -halfY),
    );
    pushTri(
      topCenter,
      point(outline[index + 1], halfY),
      point(outline[index], halfY),
    );
  }
  for (let index = 0; index < outline.length; index += 1) {
    const next = (index + 1) % outline.length;
    pushTri(
      point(outline[index], -halfY),
      point(outline[next], -halfY),
      point(outline[next], halfY),
    );
    pushTri(
      point(outline[index], -halfY),
      point(outline[next], halfY),
      point(outline[index], halfY),
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

const POD_SHELL_BEVEL_INSET = 0.82;
const POD_SHELL_BEVEL_HEIGHT_RATIO = 0.58;

function buildBeveledPodShellGeometry(THREE, descriptor, outline) {
  const { x, y, z } = descriptor.dimensions;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const [px, pz] of outline) {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minZ = Math.min(minZ, pz);
    maxZ = Math.max(maxZ, pz);
  }
  const outlineCenterX = (minX + maxX) * 0.5;
  const outlineCenterZ = (minZ + maxZ) * 0.5;
  const outlineWidth = Math.max(0.001, maxX - minX);
  const outlineDepth = Math.max(0.001, maxZ - minZ);
  const scaleX = x / outlineWidth;
  const scaleZ = z / outlineDepth;
  const halfY = y * 0.5;
  const bevelY = halfY * POD_SHELL_BEVEL_HEIGHT_RATIO;
  const vertices = [];
  const point = ([px, pz], yy, scale = 1) => [
    (px - outlineCenterX) * scaleX * scale,
    yy,
    (pz - outlineCenterZ) * scaleZ * scale,
  ];
  const pushTri = (a, b, cc) => vertices.push(...a, ...b, ...cc);
  const topInner = outline.map((value) => point(value, halfY, POD_SHELL_BEVEL_INSET));
  const topOuter = outline.map((value) => point(value, bevelY));
  const bottomOuter = outline.map((value) => point(value, -bevelY));
  const bottomInner = outline.map((value) => point(value, -halfY, POD_SHELL_BEVEL_INSET));
  const topCenter = [0, halfY, 0];
  const bottomCenter = [0, -halfY, 0];
  for (let index = 1; index < outline.length - 1; index += 1) {
    pushTri(topCenter, topInner[index + 1], topInner[index]);
    pushTri(bottomCenter, bottomInner[index], bottomInner[index + 1]);
  }
  for (let index = 0; index < outline.length; index += 1) {
    const next = (index + 1) % outline.length;
    pushTri(topInner[index], topOuter[index], topOuter[next]);
    pushTri(topInner[index], topOuter[next], topInner[next]);
    pushTri(topOuter[index], bottomOuter[index], bottomOuter[next]);
    pushTri(topOuter[index], bottomOuter[next], topOuter[next]);
    pushTri(bottomOuter[index], bottomInner[index], bottomInner[next]);
    pushTri(bottomOuter[index], bottomInner[next], bottomOuter[next]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function buildPodShellGeometry(THREE, descriptor) {
  return buildBeveledPodShellGeometry(THREE, descriptor, getMachinePodShellOutline());
}

function buildSeatAuthorizationShieldGeometry(THREE, descriptor) {
  return buildExtrudedPolygonGeometry(
    THREE,
    descriptor,
    getMachineSeatAuthorizationShieldOutline(),
  );
}

function appendBoxVertices(vertices, centerX, centerY, centerZ, dimensions, rotationY = 0) {
  const hx = dimensions.x * 0.5;
  const hy = dimensions.y * 0.5;
  const hz = dimensions.z * 0.5;
  const cosine = Math.cos(rotationY);
  const sine = Math.sin(rotationY);
  const point = (localX, localY, localZ) => [
    centerX + localX * cosine + localZ * sine,
    centerY + localY,
    centerZ - localX * sine + localZ * cosine,
  ];
  const corners = {
    lbf: point(-hx, -hy, hz),
    rbf: point(hx, -hy, hz),
    lbb: point(-hx, -hy, -hz),
    rbb: point(hx, -hy, -hz),
    ltf: point(-hx, hy, hz),
    rtf: point(hx, hy, hz),
    ltb: point(-hx, hy, -hz),
    rtb: point(hx, hy, -hz),
  };
  const pushTri = (a, b, cc) => vertices.push(...a, ...b, ...cc);
  const faces = [
    [corners.lbf, corners.rbf, corners.rtf], [corners.lbf, corners.rtf, corners.ltf],
    [corners.rbb, corners.lbb, corners.ltb], [corners.rbb, corners.ltb, corners.rtb],
    [corners.lbb, corners.lbf, corners.ltf], [corners.lbb, corners.ltf, corners.ltb],
    [corners.rbf, corners.rbb, corners.rtb], [corners.rbf, corners.rtb, corners.rtf],
    [corners.ltf, corners.rtf, corners.rtb], [corners.ltf, corners.rtb, corners.ltb],
    [corners.lbb, corners.rbb, corners.rbf], [corners.lbb, corners.rbf, corners.lbf],
  ];
  for (const [a, b, cc] of faces) pushTri(a, b, cc);
}

function buildConnectionCouplerGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  const vertices = [];
  for (const element of getMachineSeatConnectionCouplerRecipe()) {
    appendBoxVertices(
      vertices,
      element.center.x * x,
      0,
      element.center.z * z,
      {
        x: element.dimensions.x * x,
        y: resolveMachineSeatConnectionCouplerRailThickness({
          dimensions: descriptor.dimensions,
          element,
        }),
        z: element.dimensions.z * z,
      },
      element.rotationY,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function buildCapabilitiesLatticeGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  const vertices = [];
  for (const element of getMachineSeatCapabilitiesLatticeRecipe()) {
    appendBoxVertices(
      vertices,
      element.center.x * x,
      0,
      element.center.z * z,
      {
        x: element.dimensions.x * x,
        y: resolveMachineSeatCapabilitiesLatticeRailThickness({
          dimensions: descriptor.dimensions,
          element,
        }),
        z: element.dimensions.z * z,
      },
      element.rotationY,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function buildWorkspaceScopeFrameGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  const vertices = [];
  for (const rail of getMachineSeatWorkspaceScopeFrameRecipe()) {
    appendBoxVertices(
      vertices,
      rail.center.x * x,
      0,
      rail.center.z * z,
      {
        x: rail.dimensions.x * x,
        y: resolveMachineSeatWorkspaceScopeFrameRailThickness({
          dimensions: descriptor.dimensions,
          rail,
        }),
        z: rail.dimensions.z * z,
      },
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function buildToolkitRackGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  const vertices = [];
  for (const rail of getMachineSeatToolkitRackRecipe()) {
    appendBoxVertices(
      vertices,
      rail.center.x * x,
      0,
      rail.center.z * z,
      {
        x: rail.dimensions.x * x,
        y: resolveMachineSeatToolkitRackRailThickness({
          dimensions: descriptor.dimensions,
          rail,
        }),
        z: rail.dimensions.z * z,
      },
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(new Float32Array(vertices), 3),
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

export function buildThreeGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  if (Array.isArray(descriptor.outline) && descriptor.outline.length >= 3) {
    return buildExtrudedPolygonGeometry(THREE, descriptor, descriptor.outline);
  }
  if (descriptor.shape === 'POD_SHELL') {
    return buildPodShellGeometry(THREE, descriptor);
  }
  if (descriptor.shape === MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE) {
    return buildSeatAuthorizationShieldGeometry(THREE, descriptor);
  }
  if (descriptor.shape === MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE) {
    return buildExtrudedPolygonGeometry(
      THREE,
      descriptor,
      getMachineSeatBehaviorBaffleOutline(),
    );
  }
  if (descriptor.shape === MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE) {
    return buildCapabilitiesLatticeGeometry(THREE, descriptor);
  }
  if (descriptor.shape === MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE) {
    return buildConnectionCouplerGeometry(THREE, descriptor);
  }
  if (descriptor.shape === MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE) {
    return buildWorkspaceScopeFrameGeometry(THREE, descriptor);
  }
  if (descriptor.shape === MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE) {
    return buildToolkitRackGeometry(THREE, descriptor);
  }
  const radius = Math.max(0.01, Math.max(x, z) * 0.5);
  if (descriptor.shape === 'TORUS') {
    return new THREE.TorusGeometry(radius * 0.76, Math.max(0.015, radius * 0.12), 8, 24);
  }
  if (descriptor.shape === 'CYLINDER') {
    const segments = resolveThreePolygonSegments(descriptor);
    return new THREE.CylinderGeometry(radius, radius, y, segments);
  }
  if (descriptor.shape === 'SPHERE') {
    return new THREE.SphereGeometry(1, 16, 10);
  }
  return new THREE.BoxGeometry(x, y, z);
}

function clearGroup(group) {
  while (group.children?.length) {
    const child = group.children[group.children.length - 1];
    group.remove(child);
    child.geometry?.dispose?.();
  }
}

export function createMachineThreeSceneAdapter({ THREE, canvas } = {}) {
  if (!THREE) throw new Error('Three.js namespace is required');
  if (!canvas) throw new Error('Hero canvas is required');

  const webgl2 = canvas.getContext?.('webgl2', {
    alpha: true,
    antialias: true,
    depth: true,
    stencil: false,
  });
  if (!webgl2) throw new Error('WEBGL2_UNAVAILABLE');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: webgl2,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(2, globalThis.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;

  const themeLighting = resolveStructuralThemeLighting();
  const authoredMaterials = authoredHeroMaterialSet(themeLighting);
  canvas.dataset.threeMaterialModel = 'S24-authored-theme-family';

  const scene = new THREE.Scene();
  const machineRoot = new THREE.Group();
  machineRoot.name = 'TEAMAI_MACHINE_ROOT';
  scene.add(machineRoot);

  const localLightingRoot = new THREE.Group();
  localLightingRoot.name = 'TEAMAI_LOCAL_PRACTICAL_LIGHTS';
  scene.add(localLightingRoot);

  function addLocalPointLight({ point, color, intensity, distance, name }) {
    if (!point) return null;
    const light = new THREE.PointLight(
      new THREE.Color(...color),
      Math.max(0, Number(intensity) || 0),
      Math.max(0.5, Number(distance) || 2.5),
      2,
    );
    light.name = name;
    light.position.set(
      Number(point.x) || 0,
      Number(point.y) || 0,
      Number(point.z) || 0,
    );
    localLightingRoot.add(light);
    return light;
  }

  function buildLocalPracticalLighting({ core = null, pods = [], facilities = [] } = {}) {
    let count = 0;
    const energyColor = authoredMaterials.energy?.color || [0.08, 0.64, 1.00];
    const accentColor = authoredMaterials.accent?.color || [1.00, 0.48, 0.10];
    if (core?.components?.length) {
      const reactor = core.components.find((part) => part.role === 'reactor-chamber');
      if (reactor?.center) {
        addLocalPointLight({
          point: reactor.center,
          color: energyColor,
          intensity: 0.24,
          distance: Math.max(2.6, Number(core.radius || 0) * 1.8),
          name: 'CORE_REACTOR_PRACTICAL',
        });
        count += 1;
      }
    }

    const podIntensity = pods.length === 1 ? 0.34 : 0.11;
    for (const pod of Array.isArray(pods) ? pods : []) {
      const signal = pod?.ports?.find((port) => port.role === 'signal');
      const status = pod?.components?.find((part) => part.role === 'status-indicator');
      addLocalPointLight({
        point: signal?.point || status?.center || pod?.center,
        color: energyColor,
        intensity: podIntensity,
        distance: Math.max(2.2, Number(pod?.envelope?.radius || 0.8) * 2.4),
        name: 'POD_SIGNAL_PRACTICAL:' + String(pod.branchId || count),
      });
      count += 1;
      if (status?.center) {
        addLocalPointLight({
          point: status.center,
          color: accentColor,
          intensity: pods.length === 1 ? 0.12 : 0.035,
          distance: Math.max(1.6, Number(pod?.envelope?.radius || 0.8) * 1.6),
          name: 'POD_STATUS_PRACTICAL:' + String(pod.branchId || count),
        });
        count += 1;
      }
    }

    for (const facility of Array.isArray(facilities) ? facilities : []) {
      const signal = facility?.ports?.find((port) => port.role === 'machine-output')
        || facility?.ports?.find((port) => port.role === 'machine-core-input')
        || facility?.ports?.[0];
      if (!signal?.point) continue;
      addLocalPointLight({
        point: signal.point,
        color: energyColor,
        intensity: 0.12,
        distance: Math.max(2.4, Number(facility?.envelope?.radius || 1) * 1.7),
        name: 'FACILITY_SIGNAL_PRACTICAL:' + String(facility.branchId || count),
      });
      count += 1;
    }
    return count;
  }

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200);
  camera.name = 'Y1_RENDER_CAMERA_BRIDGE';
  camera.position.set(0, 6, 12);

  const fill = new THREE.HemisphereLight(0xffffff, 0x242a31, themeLighting.environmentalFillIntensity);
  const key = new THREE.DirectionalLight(0xffffff, themeLighting.keyLight.intensity);
  key.position.set(
    themeLighting.keyLight.direction[0] * 10,
    themeLighting.keyLight.direction[1] * 10,
    themeLighting.keyLight.direction[2] * 10,
  );
  const rim = new THREE.DirectionalLight(0xffffff, themeLighting.grazingRimStrength * 0.42);
  rim.position.set(-4, 6, -7);
  scene.add(fill, key, rim);

  const materialCache = new Map();
  const topologyColor = authoredMaterials.trace?.color || [0.28, 0.56, 0.72];
  const topologyMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(...topologyColor),
    transparent: true,
    opacity: 0.36,
  });
  topologyMaterial.name = 'S24_AUTHORED:topology-trace';
  const topologyRoot = new THREE.Group();
  topologyRoot.name = 'S8_TOPOLOGY_PROJECTION';
  scene.add(topologyRoot);

  function material(role) {
    const keyName = String(role || 'substrate-neutral');
    if (!materialCache.has(keyName)) {
      materialCache.set(keyName, makeAuthoredMaterial(THREE, keyName, authoredMaterials));
    }
    return materialCache.get(keyName);
  }

  function addDescriptor(descriptor) {
    const geometry = buildThreeGeometry(THREE, descriptor);
    const mesh = new THREE.Mesh(geometry, material(descriptor.materialRole));
    mesh.name = descriptor.id;
    if (descriptor.semanticId) mesh.userData.semanticId = descriptor.semanticId;
    mesh.userData.parentId = descriptor.parentId;
    mesh.userData.constructionSlice = descriptor.constructionSlice;
    mesh.userData.constructionOwner = descriptor.constructionOwner;
    mesh.position.set(descriptor.center.x, descriptor.center.y, descriptor.center.z);
    if (descriptor.shape === 'SPHERE') {
      mesh.scale.set(descriptor.dimensions.x * 0.5, descriptor.dimensions.y * 0.5, descriptor.dimensions.z * 0.5);
    }
    mesh.rotation.y = descriptor.rotationY;
    machineRoot.add(mesh);
    return mesh;
  }

  function setAssemblies(input = {}) {
    clearGroup(machineRoot);
    clearGroup(localLightingRoot);
    const descriptors = collectThreeDescriptors(input);
    for (const descriptor of descriptors) addDescriptor(descriptor);
    const localLightCount = buildLocalPracticalLighting(input);
    return Object.freeze({
      descriptorCount: descriptors.length,
      objectCount: machineRoot.children.length,
      descriptorIds: descriptors.map((descriptor) => descriptor.id),
      localLightCount,
    });
  }

  function setTopology(topology = null, {
    mode = 'WORLD_OVERVIEW',
    branchId = null,
    divisions = [],
  } = {}) {
    clearGroup(topologyRoot);
    const edges = Array.isArray(topology?.edges) ? topology.edges : [];
    const physicalKinds = new Set(['pod-division', 'pod-facility', 'facility-facility', 'workspace-contribution', 'adjacent-seat', 'inner-spoke', 'outer-spine', 'lattice-link']);
    let count = 0;
    let lineCount = 0;
    for (const edge of edges) {
      const route = Array.isArray(edge?.route) ? edge.route : [];
      if (route.length < 2 || !edge?.semanticEdgeId) continue;
      count += 1;
      if (physicalKinds.has(edge.kind)) continue;
      const positions = new Float32Array(route.flatMap((point) => [
        Number(point?.x) || 0,
        Number(point?.y) || 0,
        Number(point?.z) || 0,
      ]));
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const line = new THREE.Line(geometry, topologyMaterial);
      line.name = 'S8_EDGE:' + edge.semanticEdgeId;
      line.userData.semanticEdgeId = edge.semanticEdgeId;
      line.userData.edgeKind = edge.kind || '';
      line.userData.routeContinuous = edge.routeContinuous === true;
      topologyRoot.add(line);
      lineCount += 1;
    }


    const structuralConduitSegments = getRenderableMachineWorldStructuralConduitSegments(topology, {
      mode,
      branchId,
    });
    for (const segment of structuralConduitSegments) {
      const geometry = new THREE.CylinderGeometry(
        segment.radius,
        segment.radius,
        segment.length,
        8,
      );
      const mesh = new THREE.Mesh(geometry, material('metal2'));
      mesh.name = segment.id;
      mesh.userData.semanticEdgeId = segment.semanticEdgeId;
      mesh.userData.edgeKind = segment.edgeKind;
      mesh.userData.structuralConduit = true;
      mesh.userData.routeContinuous = segment.routeContinuous;
      mesh.userData.presentationOnly = segment.presentationOnly;
      mesh.position.set(segment.center.x, segment.center.y, segment.center.z);
      const direction = new THREE.Vector3(
        segment.end.x - segment.start.x,
        segment.end.y - segment.start.y,
        segment.end.z - segment.start.z,
      ).normalize();
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction,
      );
      topologyRoot.add(mesh);
    }

    const conduitSegments = getRenderableMachineWorldConduitSegments(topology, {
      mode,
      branchId,
      includeManifoldArcs: mode !== 'WORLD_OVERVIEW',
      includeManifoldFacilitySegments: mode !== 'WORLD_OVERVIEW',
    });
    for (const segment of conduitSegments) {
      const conduitShape = resolveThreeConduitRenderShape(segment);
      const geometry = conduitShape === 'TUBE'
        ? new THREE.CylinderGeometry(
            Math.max(0.01, segment.radius * 0.85),
            Math.max(0.01, segment.radius * 0.85),
            Math.max(0.01, (
              Math.max(segment.dimensions.x, segment.dimensions.y, segment.dimensions.z)
              - segment.radius * 0.30
            )),
            8,
          )
        : new THREE.BoxGeometry(
            segment.dimensions.x,
            segment.dimensions.y,
            segment.dimensions.z,
          );
      const mesh = new THREE.Mesh(geometry, material('conduit'));
      mesh.name = segment.id;
      mesh.userData.semanticEdgeId = segment.semanticEdgeId;
      mesh.userData.edgeKind = segment.edgeKind;
      mesh.userData.conduitSegment = segment.segmentIndex;
      mesh.userData.routeContinuous = segment.routeContinuous;
      mesh.position.set(segment.center.x, segment.center.y, segment.center.z);
      if (conduitShape === 'TUBE') {
        const direction = new THREE.Vector3(
          segment.end.x - segment.start.x,
          segment.end.y - segment.start.y,
          segment.end.z - segment.start.z,
        ).normalize();
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction,
        );
      } else {
        mesh.rotation.y = segment.rotationY;
      }
      mesh.userData.conduitShape = conduitShape;
      topologyRoot.add(mesh);
    }

    const dockingSockets = derivePodDivisionDockingSockets(conduitSegments);
    for (const socket of dockingSockets) {
      const geometry = new THREE.CylinderGeometry(
        socket.radius,
        socket.radius,
        socket.length,
        8,
      );
      const mesh = new THREE.Mesh(geometry, material('metal2'));
      mesh.name = socket.id;
      mesh.userData.semanticEdgeId = socket.semanticEdgeId;
      mesh.userData.edgeKind = socket.edgeKind;
      mesh.userData.dockingRole = socket.role;
      mesh.userData.dockingSegment = socket.segmentIndex;
      mesh.userData.routeContinuous = socket.routeContinuous;
      mesh.userData.presentationOnly = socket.presentationOnly;
      mesh.userData.dockingSocket = true;
      mesh.position.set(socket.center.x, socket.center.y, socket.center.z);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(socket.direction.x, socket.direction.y, socket.direction.z),
      );
      topologyRoot.add(mesh);
    }


    const dockingMounts = derivePodDivisionMountingFixtures(conduitSegments, divisions);
    for (const mount of dockingMounts) {
      const geometry = new THREE.CylinderGeometry(
        mount.radius,
        mount.radius,
        mount.length,
        8,
      );
      const mesh = new THREE.Mesh(geometry, material('metal2'));
      mesh.name = mount.id;
      mesh.userData.semanticEdgeId = mount.semanticEdgeId;
      mesh.userData.semanticId = mount.semanticId;
      mesh.userData.edgeKind = mount.edgeKind;
      mesh.userData.dockingRole = mount.role;
      mesh.userData.dockingSegment = mount.segmentIndex;
      mesh.userData.routeContinuous = mount.routeContinuous;
      mesh.userData.presentationOnly = mount.presentationOnly;
      mesh.userData.dockingMount = true;
      mesh.position.set(mount.center.x, mount.center.y, mount.center.z);
      topologyRoot.add(mesh);
    }


    const dockingCollars = derivePodDivisionDockingCollars(conduitSegments);
    for (const collar of dockingCollars) {
      const geometry = new THREE.CylinderGeometry(
        collar.radius,
        collar.radius,
        collar.length,
        8,
      );
      const mesh = new THREE.Mesh(geometry, material('metal2'));
      mesh.name = collar.id;
      mesh.userData.semanticEdgeId = collar.semanticEdgeId;
      mesh.userData.edgeKind = collar.edgeKind;
      mesh.userData.dockingRole = collar.role;
      mesh.userData.dockingSegment = collar.segmentIndex;
      mesh.userData.routeContinuous = collar.routeContinuous;
      mesh.userData.presentationOnly = collar.presentationOnly;
      mesh.position.set(collar.center.x, collar.center.y, collar.center.z);
      topologyRoot.add(mesh);
    }

    return Object.freeze({
      edgeCount: count,
      lineCount,
      structuralConduitSegmentCount: structuralConduitSegments.length,
      conduitSegmentCount: conduitSegments.length,
      conduitEdgeKinds: Object.freeze([...new Set(conduitSegments.map((segment) => segment.edgeKind))]),
      dockingCollarCount: dockingCollars.length,
      dockingSocketCount: dockingSockets.length,
      dockingMountCount: dockingMounts.length,
    });
  }

  function setCameraPose({ position = { x: 0, y: 6, z: 12 }, target = { x: 0, y: 1, z: 0 }, fov = 32 } = {}) {
    camera.position.set(Number(position.x) || 0, Number(position.y) || 0, Number(position.z) || 0);
    camera.fov = Number(fov) || 32;
    camera.updateProjectionMatrix();
    camera.lookAt(Number(target.x) || 0, Number(target.y) || 0, Number(target.z) || 0);
  }

  function resize(width = canvas.clientWidth || canvas.width || 1, height = canvas.clientHeight || canvas.height || 1) {
    const nextWidth = Math.max(1, Number(width) || 1);
    const nextHeight = Math.max(1, Number(height) || 1);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function dispose() {
    clearGroup(machineRoot);
    clearGroup(topologyRoot);
    topologyMaterial.dispose?.();
    for (const value of materialCache.values()) value.dispose?.();
    materialCache.clear();
    renderer.dispose();
  }

  return Object.freeze({
    id: MACHINE_THREE_ADAPTER_ID,
    version: MACHINE_THREE_ADAPTER_VERSION,
    requiredWebgl: MACHINE_THREE_REQUIRED_WEBGL,
    renderer,
    scene,
    camera,
    machineRoot,
    topologyRoot,
    setAssemblies,
    setTopology,
    setCameraPose,
    resize,
    render,
    dispose,
  });
}
