/**
 * TEAM-EXPERIENCE-029 / Y1
 * Three.js scene/rendering adapter.
 *
 * This module consumes existing spatial descriptors and converts them into
 * Three.js scene objects. It does not decide semantic identity, topology,
 * geometry ownership, camera subject, authorization, or runtime truth.
 */

import { mapHeroThemeLighting } from './hero-theme-lighting-adapter.js';
import { authoredHeroMaterialSet } from './hero-authored-materials.js';

export const MACHINE_THREE_ADAPTER_ID = 'MACHINE-THREE-SCENE-ADAPTER';
export const MACHINE_THREE_ADAPTER_VERSION = 'Y1-V1';
export const MACHINE_THREE_REQUIRED_WEBGL = 'WEBGL2';

const SHAPE_BY_PROFILE = Object.freeze([
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

export function normalizeThreeShape({ shape = '', profile = '' } = {}) {
  const rawShape = String(shape || '').trim().toUpperCase();
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
  return Object.freeze({
    id: String(part.id),
    semanticId: part.semanticId == null ? null : String(part.semanticId),
    parentId: String(parentId),
    shape: normalizeThreeShape(part),
    profile: String(part.profile || part.role || ''),
    center: Object.freeze(center),
    dimensions: Object.freeze(dimensions),
    rotationY: Number.isFinite(Number(part.rotationY)) ? Number(part.rotationY) : 0,
    materialRole: String(part.materialRole || 'substrate-neutral'),
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
    for (const part of pod?.components || []) add(part, pod?.id || 'MACHINE-POD-ASSEMBLY');
    for (const part of pod?.mechanicalDetails || []) add(part, pod?.id || 'MACHINE-POD-ASSEMBLY');
  }
  for (const facility of Array.isArray(facilities) ? facilities : []) {
    for (const part of facility?.components || []) add(part, facility?.id || 'MACHINE-FACILITY-ASSEMBLY');
    for (const part of facility?.mechanicalDetails || []) add(part, facility?.id || 'MACHINE-FACILITY-ASSEMBLY');
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

const METALLIC_ROLE_LEVEL = Object.freeze({
  metal: 0.82,
  metal2: 0.70,
  glass: 0.04,
  energy: 0.18,
  trace: 0.36,
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
  return Object.freeze({
    authoredRole,
    color: Object.freeze([...definition.color]),
    roughness: Math.max(0, Math.min(1, Number(definition.rough) || 0)),
    metalness: METALLIC_ROLE_LEVEL[metallicKey],
    transparent: glass,
    opacity: glass ? 0.68 : 1,
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

function buildGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
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
    const geometry = buildGeometry(THREE, descriptor);
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
    const descriptors = collectThreeDescriptors(input);
    for (const descriptor of descriptors) addDescriptor(descriptor);
    return Object.freeze({
      descriptorCount: descriptors.length,
      objectCount: machineRoot.children.length,
      descriptorIds: descriptors.map((descriptor) => descriptor.id),
    });
  }

  function setTopology(topology = null) {
    clearGroup(topologyRoot);
    const edges = Array.isArray(topology?.edges) ? topology.edges : [];
    let count = 0;
    for (const edge of edges) {
      const route = Array.isArray(edge?.route) ? edge.route : [];
      if (route.length < 2 || !edge?.semanticEdgeId) continue;
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
      count += 1;
    }
    return Object.freeze({ edgeCount: count });
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
