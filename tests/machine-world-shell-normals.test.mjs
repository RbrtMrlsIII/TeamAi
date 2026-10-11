import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  createExtrudedPolygonVertices,
  createFlatTriangleNormals,
  createMachineWorldNormalMatrix,
  MACHINE_WORLD_S7_FOCUS_SURFACE_RESPONSE,
} from '../public/machine-world-renderer.js';

const near = (actual, expected, epsilon = 1e-6) => {
  assert.ok(Math.abs(actual - expected) <= epsilon, `expected ${actual} ≈ ${expected}`);
};
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const transformVector = (matrix, v) => [
  matrix[0] * v[0] + matrix[4] * v[1] + matrix[8] * v[2],
  matrix[1] * v[0] + matrix[5] * v[1] + matrix[9] * v[2],
  matrix[2] * v[0] + matrix[6] * v[1] + matrix[10] * v[2],
];
const transformNormal = (matrix, v) => [
  matrix[0] * v[0] + matrix[3] * v[1] + matrix[6] * v[2],
  matrix[1] * v[0] + matrix[4] * v[1] + matrix[7] * v[2],
  matrix[2] * v[0] + matrix[5] * v[1] + matrix[8] * v[2],
];

test('face normals are normalized and flat across each triangle', () => {
  const vertices = new Float32Array([
    0, 0, 0,  0, 1, 0,  0, 0, 1,
    0, 0, 0,  1, 0, 0,  0, 0, -1,
  ]);
  const normals = createFlatTriangleNormals(vertices);
  assert.equal(normals.length, vertices.length);
  for (let offset = 0; offset < normals.length; offset += 9) {
    const normal = [normals[offset], normals[offset + 1], normals[offset + 2]];
    near(Math.hypot(...normal), 1);
    for (let vertex = 1; vertex < 3; vertex += 1) {
      near(normals[offset + vertex * 3], normal[0]);
      near(normals[offset + vertex * 3 + 1], normal[1]);
      near(normals[offset + vertex * 3 + 2], normal[2]);
    }
  }
  assert.deepEqual(Array.from(normals.slice(0, 3)), [1, 0, 0]);
  near(normals[9], 0);
  near(normals[10], 1);
  near(normals[11], 0);
});

test('degenerate or incomplete triangle streams fail closed', () => {
  assert.throws(
    () => createFlatTriangleNormals(new Float32Array([0, 0, 0, 1, 1, 1, 2, 2, 2])),
    /MACHINE_WORLD_SURFACE_TRIANGLE_DEGENERATE/,
  );
  assert.throws(
    () => createFlatTriangleNormals(new Float32Array([0, 0, 0, 1, 0])),
    /MACHINE_WORLD_SURFACE_VERTEX_STREAM_INVALID/,
  );
});

test('authored extruded S7 shell winding yields outward horizontal side normals', () => {
  const outline = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const vertices = createExtrudedPolygonVertices(outline, 2);
  const normals = createFlatTriangleNormals(vertices);
  assert.equal(normals.length, vertices.length);
  const capTriangleCount = 4;
  const sideStart = capTriangleCount * 9;
  assert.equal(vertices.length % 9, 0);
  for (let offset = sideStart; offset < vertices.length; offset += 9) {
    const normal = [normals[offset], normals[offset + 1], normals[offset + 2]];
    const cx = (vertices[offset] + vertices[offset + 3] + vertices[offset + 6]) / 3;
    const cz = (vertices[offset + 2] + vertices[offset + 5] + vertices[offset + 8]) / 3;
    near(normal[1], 0);
    assert.ok(normal[0] * cx + normal[2] * cz > 0, 'side normal must point away from shell center');
  }
});

test('normal matrix is inverse-transpose for non-uniform scale', () => {
  const model = new Float32Array([
    2, 0, 0, 0,
    0, 4, 0, 0,
    0, 0, 5, 0,
    3, 7, 9, 1,
  ]);
  const actual = createMachineWorldNormalMatrix(model);
  const expected = [0.5, 0, 0, 0, 0.25, 0, 0, 0, 0.2];
  actual.forEach((value, index) => near(value, expected[index]));
});

test('normal transform remains perpendicular to transformed tangents under rotation and non-uniform scale', () => {
  const angle = 0.47;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const sx = 2;
  const sy = 3;
  const sz = 5;
  const model = new Float32Array([
    c * sx, 0, -s * sx, 0,
    0, sy, 0, 0,
    s * sz, 0, c * sz, 0,
    11, 13, 17, 1,
  ]);
  const normalMatrix = createMachineWorldNormalMatrix(model);
  const localTangentA = [1, 0, -1];
  const localTangentB = [0, 1, 0];
  const localNormal = [1, 0, 1];
  near(dot(localNormal, localTangentA), 0);
  near(dot(localNormal, localTangentB), 0);
  const tangentA = transformVector(model, localTangentA);
  const tangentB = transformVector(model, localTangentB);
  const worldNormal = transformNormal(normalMatrix, localNormal);
  near(dot(worldNormal, tangentA), 0, 1e-5);
  near(dot(worldNormal, tangentB), 0, 1e-5);
  assert.ok(Math.hypot(...cross(tangentA, tangentB)) > 0);
});


test('focused S7 surface response raises specular and grazing-rim gain without changing geometry', () => {
  assert.deepEqual(MACHINE_WORLD_S7_FOCUS_SURFACE_RESPONSE, {
    profile: 's7-face-normal-v3',
    viewVectorProfile: 'camera-position-v1',
    surfaceRoughnessProfile: 'focused-broad-highlight-v1',
    selectedPlateRoughness: 0.64,
    specularGain: 0.48,
    grazingRimGain: 0.24,
  });
  assert.ok(MACHINE_WORLD_S7_FOCUS_SURFACE_RESPONSE.specularGain > 0.18);
  assert.ok(MACHINE_WORLD_S7_FOCUS_SURFACE_RESPONSE.grazingRimGain > 0.10);
});

test('focused shell specular view vector uses the active camera and world fragment position', async () => {
  const source = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const shaderStart = source.indexOf('const shellSurface = program');
  const shaderEnd = source.indexOf('const line = program', shaderStart);
  assert.ok(shaderStart >= 0 && shaderEnd > shaderStart, 'shell shader owner must exist');
  const shader = source.slice(shaderStart, shaderEnd);
  assert.ok(shader.includes('uniform vec3 cameraPosition'));
  assert.ok(shader.includes('varying vec3 Pw'));
  assert.ok(shader.includes('Pw=wp.xyz'));
  assert.ok(shader.includes('vec3 v=normalize(cameraPosition-Pw)'));
  assert.ok(!shader.includes('vec3 v=normalize(vec3(.15,.85,.50))'));
  assert.ok(source.includes('gl.uniform3f(shellSurfaceCameraPosition, Number(eye[0]), Number(eye[1]), Number(eye[2]))'));
  assert.ok(source.includes('cameraPosition: useSurfaceNormals ? cameraPose.p : null'));
});

test('focused roughness broadens only the selected main and shoulder shell specular lobe', async () => {
  const source = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.ok(source.includes("surfaceRoughnessProfile: 'focused-broad-highlight-v1'"));
  assert.ok(source.includes('selectedPlateRoughness: 0.64'));
  assert.ok(source.includes("rough: facilityFocused && selected && ['main-shell', 'shoulder-plate'].includes(shell.layer)"));
  assert.ok(source.includes('MACHINE_WORLD_S7_FOCUS_SURFACE_RESPONSE.selectedPlateRoughness'));
  assert.ok(source.includes('canvas.dataset.machineWorldFacilityFocusMainShellRoughness = activeFocusedPlateRoughness'));
  assert.ok(source.includes('canvas.dataset.machineWorldFacilityFocusShoulderPlateRoughness = activeFocusedPlateRoughness'));
  const defaultMetal2Roughness = 0.384352;
  const oldSpecularPower = 8 + 56 * (1 - defaultMetal2Roughness);
  const focusedSpecularPower = 8 + 56 * (1 - 0.64);
  assert.ok(oldSpecularPower > 42 && oldSpecularPower < 43);
  assert.ok(Math.abs(focusedSpecularPower - 28.16) < 1e-9);
  assert.ok(focusedSpecularPower < oldSpecularPower, 'focused highlight exponent should be broader');
});
