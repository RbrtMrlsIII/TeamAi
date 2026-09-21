import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  createStorageItemBranch,
  normalizeStorageInventoryReadModel,
  normalizeStorageItem,
  resolveStorageInventoryReadiness,
} from '../frontend/spatial/storage-inventory.js';

test('guest Storage is discoverable but locked', () => {
  assert.equal(resolveStorageInventoryReadiness(), 'DISCOVERABLE_LOCKED');
  assert.equal(
    resolveStorageInventoryReadiness({
      authenticated: false,
      inventoryKnown: true,
      authorized: true,
      entitled: true,
      healthy: true,
    }),
    'DISCOVERABLE_LOCKED',
  );
});

test('authenticated Storage does not invent inventory without a backend read model', () => {
  assert.equal(
    resolveStorageInventoryReadiness({
      authenticated: true,
      inventoryKnown: false,
    }),
    'AUTHENTICATED_READ_MODEL_REQUIRED',
  );
  assert.equal(
    resolveStorageInventoryReadiness({
      authenticated: true,
      inventoryKnown: true,
      authorized: false,
      entitled: false,
      healthy: true,
    }),
    'BLOCKED',
  );
});

test('authorized inventory read model is ready and preserves metadata-only items', () => {
  const model = normalizeStorageInventoryReadModel({
    inventoryKnown: true,
    authorized: true,
    entitled: true,
    healthy: true,
    source: 'test-read-model',
    items: [{
      id: 'item-1',
      label: 'Reference artifact',
      kind: 'reference',
      source: 'workspace-artifact',
      workspaceId: 'workspace-main',
      projectId: 'atlas',
      updatedAt: '2026-09-21T00:00:00.000Z',
      sizeLabel: '24 KB',
      status: 'AVAILABLE',
      provenance: 'backend-read-model',
      content: 'must not cross the read-model boundary',
    }],
  });

  assert.equal(model.items.length, 1);
  assert.equal(model.items[0].id, 'item-1');
  assert.equal(model.items[0].projectId, 'atlas');
  assert.equal('content' in model.items[0], false);
  assert.equal(resolveStorageInventoryReadiness({
    authenticated: true,
    ...model,
  }), 'READY');
});

test('Storage item branches are dynamic and item-owned', () => {
  const branch = createStorageItemBranch({
    itemId: 'item-1',
    workspaceId: 'workspace-main',
    projectId: 'atlas',
  });

  assert.equal(
    branch.id,
    'BRANCH-STORAGE::item/item-1/workspace/workspace-main/project/atlas/inventory',
  );
  assert.equal(branch.owner, 'item-1');
  assert.equal(branch.purpose, 'inventory');
  assert.equal(branch.presentationOnly, true);
  assert.throws(() => normalizeStorageItem({ label: 'missing id' }), /item\.id is required/);
});

test('Storage facility contains no upload or binary-transfer surface', () => {
  const facility = readFileSync('frontend/spatial/storage-inventory-facility.js', 'utf8');
  assert.doesNotMatch(facility, /type=["']file["']/i);
  assert.doesNotMatch(facility, /<input/i);
  assert.doesNotMatch(facility, /upload/i);
  assert.doesNotMatch(facility, /binary/i);
  assert.doesNotMatch(facility, /fetch\s*\(/i);
  assert.doesNotMatch(facility, /method\s*:\s*["']POST["']/i);
});

test('Storage source and public runtime copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/storage-inventory.js', 'utf8'),
    readFileSync('public/storage-inventory.js', 'utf8'),
  );
  assert.equal(
    readFileSync('frontend/spatial/storage-inventory-facility.js', 'utf8'),
    readFileSync('public/storage-inventory-facility.js', 'utf8'),
  );
  assert.equal(
    readFileSync('frontend/spatial/storage-inventory.css', 'utf8'),
    readFileSync('public/storage-inventory.css', 'utf8'),
  );
});
