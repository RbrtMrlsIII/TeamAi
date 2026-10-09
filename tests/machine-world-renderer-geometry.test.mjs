import assert from 'node:assert/strict';
import test from 'node:test';
import { segmentTubeTransform } from '../frontend/spatial/machine-world-renderer.js';

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
