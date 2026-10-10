import assert from 'node:assert/strict';
import test from 'node:test';
import { segmentTubeTransform, centeredPrismBaseY, createAnnularPrismVertices, createBeveledPodShellVertices } from '../frontend/spatial/machine-world-renderer.js';
import { MACHINE_POD_SHELL_BEVEL_INSET, MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO, MACHINE_POD_SHELL_OUTLINE_BOUNDS } from '../frontend/spatial/machine-pod-profile.js';
import { readFileSync } from 'node:fs';

const close = (actual, expected, tolerance = 1e-6) =>
  Math.abs(actual - expected) <= tolerance;

function transformedAxisEndpoints(matrix) {
  const start = [matrix[12], matrix[13], matrix[14]];
  const axis = [matrix[4], matrix[5], matrix[6]];
  return {
    start,
    end: start.map((value, index) => value + axis[index]),
    axisLength: Math.hypot(...axis),
  };
}

test('raw WebGL tube transform spans exact authored endpoints after scaling', () => {
  const cases = [
    { start: { x: 1, y: 2, z: 3 }, end: { x: 1, y: 2.14, z: 3 }, radius: 0.04 },
    { start: { x: -2, y: 1.25, z: 4 }, end: { x: -1.91, y: 1.31, z: 4.22 }, radius: 0.035 },
    { start: { x: 0.2, y: -0.4, z: 1.1 }, end: { x: 0.2, y: 0.8, z: 1.1 }, radius: 0.07 },
    { start: { x: -3, y: 0.5, z: 2 }, end: { x: -1.6, y: 0.5, z: 0.3 }, radius: 0.05 },
  ];

  for (const segment of cases) {
    const transform = segmentTubeTransform(segment);
    assert.ok(transform, 'non-degenerate tube should produce a transform');

    const projected = transformedAxisEndpoints(transform);
    const actualLength = Math.hypot(
      segment.end.x - segment.start.x,
      segment.end.y - segment.start.y,
      segment.end.z - segment.start.z,
    );

    assert.ok(close(projected.start[0], segment.start.x), 'start X');
    assert.ok(close(projected.start[1], segment.start.y), 'start Y');
    assert.ok(close(projected.start[2], segment.start.z), 'start Z');
    assert.ok(close(projected.end[0], segment.end.x), 'end X');
    assert.ok(close(projected.end[1], segment.end.y), 'end Y');
    assert.ok(close(projected.end[2], segment.end.z), 'end Z');
    assert.ok(close(projected.axisLength, actualLength), 'rendered tube length');
  }
});

test('raw WebGL tube transform rejects degenerate segments instead of inventing geometry', () => {
  assert.equal(segmentTubeTransform({
    start: { x: 1, y: 1, z: 1 },
    end: { x: 1, y: 1, z: 1 },
    radius: 0.04,
  }), null);
});


test('center-based authored primitives render from their true lower Y boundary', () => {
  const cases = [
    { center: 0, height: 0.14 },
    { center: 0.42, height: 0.78 },
    { center: 1.04, height: 1.386 },
    { center: 4.25, height: 0.06 },
    { center: -2.4, height: 2.75 },
  ];

  for (const { center, height } of cases) {
    const base = centeredPrismBaseY(center, height);
    assert.ok(close(base + height * 0.5, center), 'center restored from base and height');
    assert.ok(close(base + height, center + height * 0.5), 'top bound stays symmetric');
  }
});

test('production S7 mechanism and carrier paths preserve the centered descriptor contract', () => {
  const source = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const browser = readFileSync('public/machine-world-renderer.js', 'utf8');
  assert.equal(browser, source);

  for (const marker of [
    'centeredPrismBaseY(\n                component.center.y',
    'centeredPrismBaseY(detail.center.y, renderedHeight)',
    'centeredPrismBaseY(dy, renderedHeight)',
    'centeredPrismBaseY(entry.center.y, renderedHeight)',
    'centeredPrismBaseY(entry.connectorEnd.y, collarHeight)',
  ]) {
    assert.ok(source.includes(marker), 'missing centered transform use: ' + marker);
  }
});


test('raw WebGL TORUS is a closed annular collar with an open center', () => {
  const vertices = createAnnularPrismVertices();
  const positions = Array.from({ length: vertices.length / 3 }, (_, index) => [
    vertices[index * 3],
    vertices[index * 3 + 1],
    vertices[index * 3 + 2],
  ]);

  assert.equal(positions.length, 24 * 24, '24-segment washer has 8 triangles per segment');
  assert.ok(positions.every((point) => point.every(Number.isFinite)));

  const radii = positions.map(([x, , z]) => Math.hypot(x, z));
  assert.ok(Math.min(...radii) >= 0.72 - 1e-6, 'no vertex bridges across the central opening');
  assert.ok(Math.max(...radii) <= 1 + 1e-6, 'outer profile remains normalized');
  assert.ok(radii.some((radius) => close(radius, 0.72)), 'inner wall is represented');
  assert.ok(radii.some((radius) => close(radius, 1)), 'outer wall is represented');

  const heights = positions.map(([, y]) => y);
  assert.ok(close(Math.min(...heights), 0));
  assert.ok(close(Math.max(...heights), 1));
});

test('annular collar mesh honors bounded segment, inner-radius, and height inputs', () => {
  const vertices = createAnnularPrismVertices({
    segments: 12,
    innerRadius: 0.68,
    height: 0.5,
  });
  const positions = Array.from({ length: vertices.length / 3 }, (_, index) => [
    vertices[index * 3],
    vertices[index * 3 + 1],
    vertices[index * 3 + 2],
  ]);
  assert.equal(positions.length, 12 * 24);
  const radii = positions.map(([x, , z]) => Math.hypot(x, z));
  assert.ok(Math.min(...radii) >= 0.68 - 1e-6);
  assert.ok(Math.max(...radii) <= 1 + 1e-6);
  const heights = positions.map(([, y]) => y);
  assert.ok(close(Math.min(...heights), 0));
  assert.ok(close(Math.max(...heights), 0.5));
});

test('production primitive cache routes TORUS to annular mesh and keeps source/public identical', () => {
  const source = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const browser = readFileSync('public/machine-world-renderer.js', 'utf8');
  assert.equal(browser, source);
  assert.match(source, /key === 'TORUS'[\s\S]*?createAnnularPrismVertices\(\)/);
  assert.doesNotMatch(source, /TORUS:\s*regularPolygon/);
});


test('annular collar mesh winds each surface toward its physical outward normal', () => {
  const segments = 24;
  const vertices = createAnnularPrismVertices({ segments, innerRadius: 0.72, height: 1 });
  const point = (index) => [
    vertices[index * 3],
    vertices[index * 3 + 1],
    vertices[index * 3 + 2],
  ];
  const normal = (a, b, c) => {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    return [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
  };

  for (let segment = 0; segment < segments; segment += 1) {
    const segmentVertexOffset = segment * 24;
    const triangle = (triangleIndex) => {
      const start = segmentVertexOffset + triangleIndex * 3;
      return normal(point(start), point(start + 1), point(start + 2));
    };
    const midAngle = ((segment + 0.5) / segments) * Math.PI * 2;
    const radial = [Math.cos(midAngle), 0, Math.sin(midAngle)];

    for (const triangleIndex of [0, 1]) {
      assert.ok(triangle(triangleIndex)[1] > 0, 'top annulus must face +Y');
    }
    for (const triangleIndex of [2, 3]) {
      assert.ok(triangle(triangleIndex)[1] < 0, 'bottom annulus must face -Y');
    }
    for (const triangleIndex of [4, 5]) {
      const n = triangle(triangleIndex);
      assert.ok(n[0] * radial[0] + n[2] * radial[2] > 0, 'outer wall must face radially outward');
    }
    for (const triangleIndex of [6, 7]) {
      const n = triangle(triangleIndex);
      assert.ok(n[0] * radial[0] + n[2] * radial[2] < 0, 'inner wall must face into the open bore');
    }
  }
});


test('raw WebGL Pod shell uses the authored 3D envelope and shared bevel profile', () => {
  const vertices = createBeveledPodShellVertices();
  const positions = Array.from({ length: vertices.length / 3 }, (_, index) => [
    vertices[index * 3],
    vertices[index * 3 + 1],
    vertices[index * 3 + 2],
  ]);

  assert.equal(positions.length, 92 * 3, '12-point shell has 92 beveled-prism triangles');
  assert.ok(positions.every((point) => point.every(Number.isFinite)));

  const xs = positions.map(([x]) => x);
  const ys = positions.map(([, y]) => y);
  const zs = positions.map(([, , z]) => z);
  assert.ok(close(Math.min(...xs), -1));
  assert.ok(close(Math.max(...xs), 1));
  assert.ok(close(Math.min(...zs), -1));
  assert.ok(close(Math.max(...zs), 1));
  assert.ok(close(Math.min(...ys), 0));
  assert.ok(close(Math.max(...ys), 1));

  const topFace = positions.filter(([, y]) => close(y, 1));
  assert.ok(topFace.length > 0);
  assert.ok(
    Math.max(...topFace.map(([x, , z]) => Math.max(Math.abs(x), Math.abs(z))))
      <= MACHINE_POD_SHELL_BEVEL_INSET + 1e-6,
    'top face must be inset by the shared bevel contract',
  );

  const bevelLevels = new Set(ys.map((value) => Math.round(value * 1000) / 1000));
  assert.ok(bevelLevels.has(Math.round(((1 - MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO) / 2) * 1000) / 1000));
  assert.ok(bevelLevels.has(Math.round(((1 + MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO) / 2) * 1000) / 1000));

  const expectedRatio = MACHINE_POD_SHELL_OUTLINE_BOUNDS.width / MACHINE_POD_SHELL_OUTLINE_BOUNDS.depth;
  assert.ok(close(expectedRatio, 1.5), 'authored outline keeps its 1.80 × 1.20 profile ratio');

  const source = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const browser = readFileSync('public/machine-world-renderer.js', 'utf8');
  const adapter = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  assert.equal(browser, source);
  assert.match(source, /key === 'POD_SHELL'[\s\S]*?createBeveledPodShellVertices\(\)/);
  assert.match(source, /machineWorldPodShellGeometry = 'beveled-authored-envelope-v1'/);
  assert.match(adapter, /MACHINE_POD_SHELL_BEVEL_INSET/);
  assert.match(adapter, /MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO/);
  assert.doesNotMatch(adapter, /const POD_SHELL_BEVEL_(?:INSET|HEIGHT_RATIO) =/);
});
