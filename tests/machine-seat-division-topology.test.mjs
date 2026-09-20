import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSeatDivisionEdge, validateSeatDivisionEdges } from '../frontend/spatial/machine-seat-division-topology.js';
import { deriveFocusedSeatDivisionGeometry } from '../frontend/spatial/machine-seat-division-presentation.js';

const children = [
  'SEAT_CONNECTION',
  'SEAT_BEHAVIOR',
  'SEAT_TOOLKIT',
  'SEAT_CAPABILITIES',
  'SEAT_AUTHORIZATION',
  'SEAT_WORKSPACE_SCOPE',
  'SEAT_TASK_EVIDENCE',
];

const parent = {
  branchId: 'BRANCH-SEAT-03',
  seatIndex: 2,
  semanticKey: 'TREE-HERO-SEAT#2:SEAT_SHELL',
  center: { x: 4.1, y: 0.72, z: 0.1 },
  level: 0.72,
  dimensions: { x: 1.34, y: 0.62, z: 1.08 },
  seam: 0.18,
};

test('all seat divisions have stable child-to-shell semantic edges', () => {
  const edges = children.map((childId, childIndex) => {
    const geometry = deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 });
    return buildSeatDivisionEdge({ parent, geometry, childId, childIndex });
  });
  const validation = validateSeatDivisionEdges(edges, { expectedCount: children.length });
  assert.equal(validation.valid, true, validation.reasons.join(', '));
  assert.equal(new Set(edges.map((edge) => edge.semanticEdgeId)).size, children.length);
  for (const edge of edges) {
    assert.match(edge.semanticEdgeId, /^EDGE:SEAT-DIVISION:TREE-HERO-SEAT#2:SEAT_/);
    assert.equal(edge.route[0].id, edge.sourcePort.id);
    assert.equal(edge.route.at(-1).id, edge.targetPort.id);
  }
});

test('seat division edge identity remains stable while coordinates change', () => {
  const baseParent = { ...parent, dimensions: { ...parent.dimensions, x: 1.1 } };
  const expandedParent = { ...parent, dimensions: { ...parent.dimensions, x: 1.7 } };
  const a = buildSeatDivisionEdge({
    parent: baseParent,
    geometry: deriveFocusedSeatDivisionGeometry({ parent: baseParent, childId: 'SEAT_BEHAVIOR', childIndex: 1, amount: 1 }),
    childId: 'SEAT_BEHAVIOR',
    childIndex: 1,
  });
  const b = buildSeatDivisionEdge({
    parent: expandedParent,
    geometry: deriveFocusedSeatDivisionGeometry({ parent: expandedParent, childId: 'SEAT_BEHAVIOR', childIndex: 1, amount: 1 }),
    childId: 'SEAT_BEHAVIOR',
    childIndex: 1,
  });
  assert.equal(a.semanticEdgeId, b.semanticEdgeId);
  assert.notDeepEqual(a.route, b.route);
});

test('malformed child edge fails closed', () => {
  assert.equal(validateSeatDivisionEdges([{ semanticEdgeId: 'x', route: [] }]).valid, false);
});
