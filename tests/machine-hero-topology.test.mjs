import assert from 'node:assert/strict';
import test from 'node:test';
import { makeMachinePart, createMachineTransition } from '../frontend/spatial/machine-hero-scene.js';
import { validateMachineConnectionTopology, validateMachineGraphTopology } from '../frontend/spatial/machine-hero-topology.js';

function pair(payload, { left = -2.4, right = 2.4, clearance = 0.16 } = {}) {
  const source = makeMachinePart({
    id: 'source',
    semanticId: 'SEAT_CONNECTION',
    center: { x: left, y: 0.5, z: 0 },
    dimensions: { x: 1.7, y: 0.9, z: 1.2 },
    port: { x: left + 0.85, y: 0.5, z: 0 },
    payload,
  });
  const target = makeMachinePart({
    id: 'target',
    semanticId: 'WORKSPACE_CENTER',
    center: { x: right, y: 0.5, z: 0 },
    dimensions: { x: 1.9, y: 1.0, z: 1.4 },
    port: { x: right - 0.95, y: 0.5, z: 0 },
    payload: { labels: ['Workspace'], controls: 1, density: 1 },
  });
  const transition = createMachineTransition({
    seatIndex: 0,
    source,
    target,
    expansion: { sourceAmount: 1, targetAmount: 1 },
    clearance,
  });
  return { source, target, transition };
}

test('light and heavy payloads both retain physical AABB clearance in a separated Seat-1 pair', () => {
  for (const payload of [
    { labels: ['Connection'], controls: 1, density: 1 },
    { labels: ['Connection', 'OAuth', 'Runtime', 'Provider health', 'Diagnostics'], controls: 8, density: 10 },
  ]) {
    const { transition } = pair(payload);
    assert.equal(transition.topology.valid, true, transition.topology.reasons.join(', '));
    assert.ok(transition.topology.separation.maxGap >= 0.16);
  }
});

test('overlapping expanded divisions fail closed with an explicit clearance reason', () => {
  const { source, target, transition } = pair({ labels: ['Connection', 'OAuth'], controls: 4, density: 4 }, { left: -0.2, right: 0.2 });
  const validation = validateMachineConnectionTopology(transition.sourceGeometry, transition.targetGeometry, transition.wiring, { clearance: 0.16 });
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('AABB_CLEARANCE_UNPROVEN'));
  assert.equal(source.semanticId, 'SEAT_CONNECTION');
  assert.equal(target.semanticId, 'WORKSPACE_CENTER');
});

test('missing port fails closed instead of manufacturing connection proof', () => {
  const source = makeMachinePart({ id: 'source', semanticId: 'SEAT_CONNECTION', center: { x: -2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 } });
  const target = makeMachinePart({ id: 'target', semanticId: 'WORKSPACE_CENTER', center: { x: 2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: 1.5, y: 0, z: 0 } });
  const validation = validateMachineConnectionTopology(source, target, null);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('MISSING_SOURCE_PORT'));
  assert.ok(validation.reasons.includes('MISSING_WIRING_ROUTE'));
});

test('graph topology catches duplicate semantic identity and validates transition geometry', () => {
  const source = makeMachinePart({ id: 'source', semanticId: 'SEAT_CONNECTION', center: { x: -2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: -1.5, y: 0, z: 0 } });
  const target = makeMachinePart({ id: 'target', semanticId: 'WORKSPACE_CENTER', center: { x: 2, y: 0, z: 0 }, dimensions: { x: 1, y: 1, z: 1 }, port: { x: 1.5, y: 0, z: 0 } });
  const transition = createMachineTransition({ source, target, clearance: 0.16 });
  const graph = validateMachineGraphTopology({ parts: [source, target, { ...target, id: 'duplicate' }], transitions: [transition] }, { clearance: 0.16 });
  assert.equal(graph.valid, false);
  assert.ok(graph.reasons.includes('DUPLICATE_SEMANTIC_ID'));
});
