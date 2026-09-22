import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSeatDivisionEdge, validateSeatDivisionEdges, validateSeatDivisionNetwork } from '../frontend/spatial/machine-seat-division-topology.js';
import { deriveFocusedSeatDivisionGeometry } from '../frontend/spatial/machine-seat-division-presentation.js';
import { seatDivisionFanDirection, SEAT_DIVISION_PORT_RADIUS } from '../frontend/spatial/seat-division-geometry.js';
import { buildAdjacentDivisionWiring } from '../frontend/spatial/seat-adjacent-division-wiring.js';

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


function boundsForDivision(geometry, padding = 0.08) {
  const halfX = geometry.dimensions.width / 2 + padding;
  const halfY = geometry.dimensions.height / 2 + padding;
  const halfZ = geometry.dimensions.depth / 2 + padding;
  return {
    min: {
      x: geometry.center.x - halfX,
      y: geometry.center.y - halfY,
      z: geometry.center.z - halfZ,
    },
    max: {
      x: geometry.center.x + halfX,
      y: geometry.center.y + halfY,
      z: geometry.center.z + halfZ,
    },
  };
}

function overlaps(a, b) {
  return a.min.x <= b.max.x
    && b.min.x <= a.max.x
    && a.min.y <= b.max.y
    && b.min.y <= a.max.y
    && a.min.z <= b.max.z
    && b.min.z <= a.max.z;
}

test('fan placement keeps all seven division volumes separated across supported seats and animation states', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (let seatIndex = 0; seatIndex < seatCount; seatIndex += 1) {
      const angle = (Math.PI * 2 * seatIndex) / Math.max(1, seatCount);
      const parentAtSeat = {
        ...parent,
        seatIndex,
        level: 0.60 + ((seatIndex * 0.17) % 0.31),
        center: {
          x: Math.cos(angle) * 4.2,
          y: 0.60 + ((seatIndex * 0.17) % 0.31),
          z: Math.sin(angle) * 4.2,
        },
      };
      for (const amount of [0, 0.5, 1]) {
        const divisions = children.map((childId, childIndex) =>
          deriveFocusedSeatDivisionGeometry({
            parent: parentAtSeat,
            childId,
            childIndex,
            amount,
          }),
        );
        const boxes = divisions.map((division) => boundsForDivision(division));
        for (let i = 0; i < boxes.length; i += 1) {
          for (let j = i + 1; j < boxes.length; j += 1) {
            assert.equal(
              overlaps(boxes[i], boxes[j]),
              false,
              `seat ${seatIndex + 1}/${seatCount} amount ${amount}: divisions ${i}/${j} overlap`,
            );
          }
        }
        const edges = divisions.map((geometry, childIndex) =>
          buildSeatDivisionEdge({
            parent: parentAtSeat,
            geometry,
            childId: children[childIndex],
            childIndex,
          }),
        );
        const validation = validateSeatDivisionNetwork({
          parent: { ...parentAtSeat, semanticId: 'SEAT_SHELL' },
          divisions,
          edges,
          clearance: 0.08,
        });
        assert.equal(validation.valid, true, validation.reasons.join(', '));
      }
    }
  }
});

test('fan target ports stay inside the canonical Seat shell bounds', () => {
  for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
    const edge = buildSeatDivisionEdge({
      parent,
      geometry: deriveFocusedSeatDivisionGeometry({
        parent,
        childId: children[childIndex],
        childIndex,
        amount: 1,
      }),
      childId: children[childIndex],
      childIndex,
    });
    const target = edge.targetPort;
    assert.ok(Math.abs(target.x - parent.center.x) <= parent.dimensions.x / 2);
    assert.ok(Math.abs(target.z - parent.center.z) <= parent.dimensions.z / 2);
    assert.equal(SEAT_DIVISION_PORT_RADIUS, 0.28);
  }
});

test('fan target ports share the same semantic direction as their division geometry', () => {
  for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent,
      childId: children[childIndex],
      childIndex,
      amount: 1,
    });
    const direction = seatDivisionFanDirection(parent, childIndex);
    const dx = geometry.center.x - parent.center.x;
    const dz = geometry.center.z - parent.center.z;
    const length = Math.hypot(dx, dz);
    assert.ok(length > 0);
    assert.ok(Math.abs(dx / length - direction.x) < 1e-9);
    assert.ok(Math.abs(dz / length - direction.z) < 1e-9);
  }
});

test('full Seat division network reuses shared AABB/port/route clearance authority', () => {
  const divisions = children.map((childId, childIndex) =>
    deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 }),
  );
  const edges = divisions.map((geometry, childIndex) =>
    buildSeatDivisionEdge({
      parent,
      geometry,
      childId: children[childIndex],
      childIndex,
    }),
  );
  const validation = validateSeatDivisionNetwork({
    parent: {
      ...parent,
      semanticId: 'SEAT_SHELL',
    },
    divisions,
    edges,
    clearance: 0.08,
  });
  assert.equal(validation.valid, true, validation.reasons.join(', '));
  assert.equal(validation.divisionCount, 7);
  assert.equal(validation.edgeCount, 7);
  assert.ok(edges.every((edge) => edge.route.length === 4));
});


test('Seat division route obstruction fails closed', () => {
  const divisions = children.map((childId, childIndex) =>
    deriveFocusedSeatDivisionGeometry({ parent, childId, childIndex, amount: 1 }),
  );
  const edge = buildSeatDivisionEdge({
    parent,
    geometry: divisions[0],
    childId: children[0],
    childIndex: 0,
  });
  const obstacle = {
    semantic: 'OBSTRUCTION',
    center: {
      ...edge.route[1],
    },
    dimensions: { width: 0.32, height: 0.32, depth: 0.32 },
  };
  const validation = validateSeatDivisionNetwork({
    parent: { ...parent, semanticId: 'SEAT_SHELL' },
    divisions,
    edges: [edge],
    obstacles: [obstacle],
    clearance: 0.08,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.some((reason) => reason.includes('ROUTE_CROSSES_OBSTACLE')));
});


test('ordered adjacent wiring preserves Connection→Behavior edge regardless of focused child', () => {
  const connection = deriveFocusedSeatDivisionGeometry({
    parent,
    childId: 'SEAT_CONNECTION',
    childIndex: 0,
    amount: 1,
  });
  const behavior = deriveFocusedSeatDivisionGeometry({
    parent,
    childId: 'SEAT_BEHAVIOR',
    childIndex: 1,
    amount: 1,
  });

  const fromConnection = buildAdjacentDivisionWiring({
    sourceGeometry: connection,
    targetGeometry: behavior,
    amount: 1,
  });
  assert.equal(
    fromConnection.id,
    'EDGE:ADJACENT-DIVISION:TREE-HERO-SEAT#2:SEAT_CONNECTION=>TREE-HERO-SEAT#2:SEAT_BEHAVIOR',
  );

  const fromPreviousToBehavior = buildAdjacentDivisionWiring({
    sourceGeometry: connection,
    targetGeometry: behavior,
    amount: 1,
  });
  assert.equal(fromPreviousToBehavior.from.divisionId, connection.id);
  assert.equal(fromPreviousToBehavior.to.divisionId, behavior.id);
  assert.equal(fromPreviousToBehavior.presentationOnly, true);
});
