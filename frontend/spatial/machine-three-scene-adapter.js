/**
 * TEAM-EXPERIENCE-029 / Y1
 * Three.js scene/rendering adapter.
 *
 * This module consumes existing spatial descriptors and converts them into
 * Three.js scene objects. It does not decide semantic identity, topology,
 * geometry ownership, camera subject, authorization, or runtime truth.
 */

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
    center: Object.freeze(center),
    dimensions: Object.freeze(dimensions),
    rotationY: Number.isFinite(Number(part.rotationY)) ? Number(part.rotationY) : 0,
    materialRole: String(part.materialRole || 'substrate-neutral'),
    constructionSlice: String(part.constructionSlice || ''),
    constructionOwner: String(part.constructionOwner || ''),
  });
}

export function collectThreeDescriptors({ core = null, pods = [], facilities = [] } = {}) {
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
  }

  return Object.freeze(descriptors);
}

function makeSubstrateMaterial(THREE, role) {
  const roleName = String(role || 'substrate-neutral');
  const material = new THREE.MeshStandardMaterial({
    color: 0xc8cdd4,
    metalness: roleName.includes('metal') ? 0.68 : 0.34,
    roughness: roleName.includes('glass') ? 0.28 : 0.52,
    transparent: roleName.includes('glass'),
    opacity: roleName.includes('glass') ? 0.56 : 1,
  });
  material.name = 'Y1_SUBSTRATE:' + roleName;
  return material;
}

function buildGeometry(THREE, descriptor) {
  const { x, y, z } = descriptor.dimensions;
  const radius = Math.max(0.01, Math.max(x, z) * 0.5);
  if (descriptor.shape === 'TORUS') {
    return new THREE.TorusGeometry(radius * 0.76, Math.max(0.015, radius * 0.12), 8, 24);
  }
  if (descriptor.shape === 'CYLINDER') {
    const segments = descriptor.semanticId.includes('CORE') ? 8 : 10;
    return new THREE.CylinderGeometry(radius, radius, y, segments);
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

  const scene = new THREE.Scene();
  const machineRoot = new THREE.Group();
  machineRoot.name = 'TEAMAI_MACHINE_ROOT';
  scene.add(machineRoot);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200);
  camera.name = 'Y1_RENDER_CAMERA_BRIDGE';
  camera.position.set(0, 6, 12);

  const key = new THREE.HemisphereLight(0xffffff, 0x20242b, 1.15);
  const fill = new THREE.DirectionalLight(0xffffff, 1.25);
  fill.position.set(5, 8, 7);
  scene.add(key, fill);

  const materialCache = new Map();

  function material(role) {
    const keyName = String(role || 'substrate-neutral');
    if (!materialCache.has(keyName)) {
      materialCache.set(keyName, makeSubstrateMaterial(THREE, keyName));
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
    setAssemblies,
    setCameraPose,
    resize,
    render,
    dispose,
  });
}
