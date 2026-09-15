import assert from 'node:assert/strict';
import test from 'node:test';
import { createMachineGraph, findMachineGraphPart } from '../frontend/spatial/machine-hero-graph.js';

const divisions = [
  { id: 'connection', semanticId: 'SEAT_CONNECTION', center: { x: -1.4, y: 0.5, z: 0 }, dimensions: { x: 1.8, y: 0.8, z: 1.2 }, port: { x: -0.35, y: 0.7, z: 0 } },
  { id: 'behavior', semanticId: 'SEAT_BEHAVIOR', center: { x: 0.9, y: 0.5, z: 0 }, dimensions: { x: 1.5, y: 0.8, z: 1.1 }, port: { x: 0.2, y: 0.7, z: 0 } },
  { id: 'toolkit', semanticId: 'SEAT_TOOLKIT', center: { x: 2.7, y: 0.5, z: 0.1 }, dimensions: { x: 1.4, y: 0.8, z: 1 }, port: { x: 2.15, y: 0.7, z: 0.1 } },
];

test('multi-division graph preserves semantic parts and valid directed transitions', () => {
  const graph = createMachineGraph({
    seatIndex: 0,
    divisions,
    edges: [
      { id: 'connection-behavior', sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_BEHAVIOR' },
      { id: 'behavior-toolkit', sourceDivisionId: 'SEAT_BEHAVIOR', targetDivisionId: 'SEAT_TOOLKIT' },
      { id: 'missing', sourceDivisionId: 'SEAT_TOOLKIT', targetDivisionId: 'SEAT_MISSING' },
    ],
  });
  assert.equal(graph.parts.length, 3);
  assert.equal(graph.transitions.length, 2);
  assert.equal(graph.transitions[0].wiring.id, 'connection-behavior');
  assert.equal(graph.transitions[1].wiring.id, 'behavior-toolkit');
  assert.deepEqual(findMachineGraphPart(graph, 'SEAT_TOOLKIT').center, divisions[2].center);
  assert.equal(findMachineGraphPart(graph, 'SEAT_MISSING'), null);
  assert.ok(graph.subject.max.x > graph.subject.min.x);
});
