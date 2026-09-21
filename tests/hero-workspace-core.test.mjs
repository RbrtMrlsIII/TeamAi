import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORKSPACE_CENTER_ID,
  WORKSPACE_CORE_GEOMETRY_ID,
  deriveWorkspaceCoreGeometry,
} from '../frontend/spatial/hero-workspace-core.js';

test('workspace core geometry is centered on the semantic workspace target', () => {
  const geometry = deriveWorkspaceCoreGeometry({ workspaceRadius: 5.95, expansionAmount: 0.7 });
  assert.equal(geometry.id, WORKSPACE_CORE_GEOMETRY_ID);
  assert.equal(geometry.target, WORKSPACE_CENTER_ID);
  assert.deepEqual(geometry.center, { x: 0, y: 0.5, z: 0 });
  assert.ok(geometry.radius > geometry.innerRadius);
});

test('workspace core radius is deterministic and payload-independent', () => {
  const a = deriveWorkspaceCoreGeometry({ workspaceRadius: 4.35, expansionAmount: 0.2 });
  const b = deriveWorkspaceCoreGeometry({ workspaceRadius: 4.35, expansionAmount: 0.2 });
  assert.deepEqual(a, b);
});
