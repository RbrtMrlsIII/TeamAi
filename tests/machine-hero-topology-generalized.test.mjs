import assert from 'node:assert/strict';
import test from 'node:test';
import { makeMachinePart, createMachineTransition } from '../frontend/spatial/machine-hero-scene.js';
import { validateMachineConnectionTopology, validateMachineGraphTopology } from '../frontend/spatial/machine-hero-topology.js';

const clearance = 0.16;

function makePair({ sourceId, targetId, sourceX, targetX, sourceDimensions, targetDimensions, payload, targetPayload, expansion = { sourceAmount: 1, targetAmount: 1 } }) {
  const source = makeMachinePart({
    id: `${sourceId}-part`,
    semanticId: sourceId,
    center: { x: sourceX, y: 0.5, z: 0 },
    dimensions: sourceDimensions,
    port: { x: sourceX + sourceDimensions.x / 2, y: 0.5, z: 0 },
    payload,
  });
  const target = makeMachinePart({
    id: `${targetId}-part`,
    semanticId: targetId,
    center: { x: targetX, y: 0.5, z: 0 },
    dimensions: targetDimensions,
    port: { x: targetX - targetDimensions.x / 2, y: 0.5, z: 0 },
    payload: targetPayload,
  });
  const transition = createMachineTransition({
    seatIndex: 0,
    source,
    target,
    expansion,
    clearance,
  });
  return { source, target, transition };
}

test('topology validation is semantic rather than Seat-1-specific', () => {
  const cases = [
    {
      sourceId: 'SEAT_CONNECTION',
      targetId: 'SEAT_BEHAVIOR',
      sourceX: -3.2,
      targetX: 3.2,
      sourceDimensions: { x: 1.7, y: 0.9, z: 1.2 },
      targetDimensions: { x: 1.6, y: 0.9, z: 1.1 },
      payload: { labels: ['Connection', 'Provider health'], controls: 2, density: 2 },
      targetPayload: { labels: ['Behavior'], controls: 2, density: 2 },
    },
    {
      sourceId: 'SEAT_TOOLKIT',
      targetId: 'SEAT_CAPABILITIES',
      sourceX: -4.4,
      targetX: 4.4,
      sourceDimensions: { x: 2.1, y: 1.0, z: 1.5 },
      targetDimensions: { x: 2.3, y: 1.1, z: 1.6 },
      payload: { labels: ['Toolkit', 'Skills', 'Tools'], controls: 5, density: 7 },
      targetPayload: { labels: ['Capabilities', 'MCP', 'Runtime'], controls: 7, density: 9 },
      expansion: { sourceAmount: 0.4, targetAmount: 0.85 },
    },
    {
      sourceId: 'TREE-HERO-SEAT#1:SEAT_AUTHORIZATION',
      targetId: 'TREE-HERO-SEAT#1:SEAT_TASK_EVIDENCE',
      sourceX: -5.5,
      targetX: 5.5,
      sourceDimensions: { x: 1.5, y: 0.9, z: 1.1 },
      targetDimensions: { x: 1.8, y: 1.2, z: 1.4 },
      payload: { labels: ['Authorization'], controls: 3, density: 4 },
      targetPayload: { labels: ['Task', 'Evidence', 'Result'], controls: 4, density: 6 },
      expansion: { sourceAmount: 1, targetAmount: 0.6 },
    },
  ];

  for (const testCase of cases) {
    const { transition } = makePair(testCase);
    assert.equal(transition.topology.valid, true, `${testCase.sourceId}->${testCase.targetId}: ${transition.topology.reasons.join(', ')}`);
    assert.equal(transition.wiring.sourceDivisionId, testCase.sourceId);
    assert.equal(transition.wiring.targetDivisionId, testCase.targetId);
    assert.ok(transition.topology.separation.maxGap >= clearance);
  }
});

test('multi-division graph validates all semantic edges', () => {
  const divisions = [
    { id: 'a', semanticId: 'BRANCH_A', center: { x: -6, y: 0.5, z: 0 }, dimensions: { x: 1.6, y: 0.8, z: 1 }, port: { x: -5.2, y: 0.5, z: 0 } },
    { id: 'b', semanticId: 'BRANCH_B', center: { x: -2, y: 0.5, z: 0 }, dimensions: { x: 1.8, y: 0.9, z: 1.1 }, port: { x: -1.1, y: 0.5, z: 0 } },
    { id: 'c', semanticId: 'BRANCH_C', center: { x: 2, y: 0.5, z: 0 }, dimensions: { x: 2.2, y: 1, z: 1.4 }, port: { x: 0.9, y: 0.5, z: 0 } },
    { id: 'd', semanticId: 'WORKSPACE_CENTER', center: { x: 7, y: 0.5, z: 0 }, dimensions: { x: 2.4, y: 1.2, z: 1.6 }, port: { x: 5.8, y: 0.5, z: 0 } },
  ];
  const transitions = [
    createMachineTransition({ source: divisions[0], target: divisions[1], clearance }),
    createMachineTransition({ source: divisions[1], target: divisions[2], expansion: { sourceAmount: 0.5, targetAmount: 1 }, clearance }),
    createMachineTransition({ source: divisions[2], target: divisions[3], expansion: { sourceAmount: 1, targetAmount: 0.75 }, clearance }),
  ];
  const graph = validateMachineGraphTopology({ parts: divisions, transitions });
  assert.equal(graph.valid, true, graph.reasons.join(', '));
  assert.equal(graph.partCount, 4);
  assert.equal(graph.transitionCount, 3);
});

test('overlap, missing port, route mismatch, self connection, and invalid port all fail closed', () => {
  const overlap = makePair({
    sourceId: 'BRANCH_A',
    targetId: 'BRANCH_B',
    sourceX: -0.2,
    targetX: 0.2,
    sourceDimensions: { x: 2, y: 1, z: 1 },
    targetDimensions: { x: 2, y: 1, z: 1 },
    payload: { labels: ['A'], controls: 2, density: 3 },
    targetPayload: { labels: ['B'], controls: 2, density: 3 },
  });
  assert.equal(overlap.transition.topology.valid, false);
  assert.ok(overlap.transition.topology.reasons.includes('AABB_CLEARANCE_UNPROVEN'));

  const source = makeMachinePart({ id: 'source', semanticId: 'BRANCH_SOURCE', center: { x: -2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 } });
  const target = makeMachinePart({ id: 'target', semanticId: 'BRANCH_TARGET', center: { x: 2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: 1.5, y: 0, z: 0 } });
  const missingPort = validateMachineConnectionTopology(source, target, null);
  assert.equal(missingPort.valid, false);
  assert.ok(missingPort.reasons.includes('MISSING_SOURCE_PORT'));
  assert.ok(missingPort.reasons.includes('MISSING_WIRING_ROUTE'));

  const validPair = makePair({
    sourceId: 'BRANCH_SOURCE',
    targetId: 'BRANCH_TARGET',
    sourceX: -3,
    targetX: 3,
    sourceDimensions: { x: 1.4, y: 0.8, z: 1 },
    targetDimensions: { x: 1.6, y: 1, z: 1.2 },
    payload: { labels: ['Source'], controls: 1, density: 1 },
    targetPayload: { labels: ['Target'], controls: 1, density: 1 },
  });
  const routeMismatch = validateMachineConnectionTopology(validPair.transition.sourceGeometry, validPair.transition.targetGeometry, {
    ...validPair.transition.wiring,
    route: [validPair.transition.sourcePort, { x: 0, y: 4, z: 0 }, { x: 99, y: 99, z: 99 }],
  });
  assert.equal(routeMismatch.valid, false);
  assert.ok(routeMismatch.reasons.includes('ROUTE_TARGET_MISMATCH'));

  const selfConnection = validateMachineConnectionTopology(validPair.source, { ...validPair.target, semanticId: validPair.source.semanticId }, validPair.transition.wiring);
  assert.equal(selfConnection.valid, false);
  assert.ok(selfConnection.reasons.includes('SELF_CONNECTION'));

  const invalidPort = validateMachineConnectionTopology(validPair.source, { ...validPair.target, port: { x: 100, y: 100, z: 100 } }, validPair.transition.wiring);
  assert.equal(invalidPort.valid, false);
  assert.ok(invalidPort.reasons.includes('TARGET_PORT_OUTSIDE_BOUNDS'));
});

test('duplicate semantic identity is rejected independently of geometry', () => {
  const source = makeMachinePart({ id: 'source', semanticId: 'BRANCH_SOURCE', center: { x: -4, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: -3.5, y: 0, z: 0 } });
  const target = makeMachinePart({ id: 'target', semanticId: 'BRANCH_TARGET', center: { x: 0, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: -0.5, y: 0, z: 0 } });
  const transition = createMachineTransition({ source, target, clearance });
  const graph = validateMachineGraphTopology({ parts: [source, target, { ...target, id: 'target-duplicate' }], transitions: [transition] }, { clearance });
  assert.equal(graph.valid, false);
  assert.ok(graph.reasons.includes('DUPLICATE_SEMANTIC_ID'));
});
