import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveMachineCorePorts } from '../frontend/spatial/machine-core-assembly.js';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { validateMachineCoreConnections } from '../frontend/spatial/machine-core-topology.js';

test('machine core edges have unique semantic identities, valid ports, and finite routes for 1-10 seats', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount });
    const validation = validateMachineCoreConnections(core);
    assert.equal(validation.valid, true, `${seatCount} seats: ${validation.reasons.join(', ')}`);
    assert.equal(validation.edgeCount, seatCount + 4 + Math.min(seatCount, 2) * 4);
    assert.equal(new Set(validation.semanticEdgeIds).size, validation.edgeCount);
    const ports = deriveMachineCorePorts({ hub: core.hub, expansionAmount: core.expansionAmount });
    const corePortIds = new Set(ports.map((port) => port.id));
    assert.ok(core.connections.filter((edge) => edge.sourceBranchId === 'HUB-CORE').every((edge) => corePortIds.has(edge.sourceCorePortId)));
  }
});

test('semantic edge identities do not depend on coordinates', () => {
  const base = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const expanded = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  assert.deepEqual(
    expanded.connections.map((edge) => edge.semanticEdgeId),
    base.connections.map((edge) => edge.semanticEdgeId),
  );
});

test('missing semantic edge identity fails closed', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const mutated = { ...core, connections: [{ ...core.connections[0], semanticEdgeId: null }] };
  const validation = validateMachineCoreConnections(mutated);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('MISSING_SEMANTIC_EDGE_ID'));
});


test('core topology uses S2 port positions rather than the legacy hub placeholder', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const ports = deriveMachineCorePorts({ hub: core.hub, expansionAmount: 1 });
  assert.ok(core.connections.some((edge) => edge.sourcePort.x !== core.hub.port.x || edge.sourcePort.z !== core.hub.port.z));
  for (const edge of core.connections.filter((candidate) => candidate.sourceBranchId === 'HUB-CORE')) {
    assert.ok(ports.some((port) =>
      port.id === edge.sourceCorePortId
      && Math.abs(port.point.x - edge.sourcePort.x) < 1e-9
      && Math.abs(port.point.z - edge.sourcePort.z) < 1e-9
    ));
  }
});
