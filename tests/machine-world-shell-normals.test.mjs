import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createExtrudedPolygonVertices,
  createFlatTriangleNormals,
  createMachineWorldNormalMatrix,
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
  assert.deepEqual(Array.from(normals.slice(9, 12)), [0, 1, 0]);
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
