import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  TEAMAI_FRONTEND_FEATURES,
  getFrontendFeature,
  getGuestPresentationState,
  listFrontendFeatures,
} from '../frontend/spatial/feature-registry.js';

test('Issue #400 feature registry has one stable entry per product facility', () => {
  const ids = TEAMAI_FRONTEND_FEATURES.map((feature) => feature.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(ids, [
    'workspace-hq',
    'projects-library',
    'artifacts-inventory',
    'storage',
    'seats',
    'team-agents',
    'mcp-capability',
    'skills-responsibility',
    'orchestration',
    'marketplace',
    'settings',
    'auth-gateway',
  ]);
  assert.deepEqual(listFrontendFeatures().map((feature) => feature.id), ids);
});

test('feature lookup and guest presentation stay presentation-only', () => {
  const storage = getFrontendFeature('storage');
  assert.equal(storage?.authority, 'backend/runtime');
  assert.equal(getFrontendFeature('not-a-feature'), null);
  assert.deepEqual(getGuestPresentationState(storage), {
    featureId: 'storage',
    presentation: 'DISCOVERABLE_LOCKED',
    presentationOnly: true,
  });
  assert.deepEqual(getGuestPresentationState('auth-gateway'), {
    featureId: 'auth-gateway',
    presentation: 'GUEST_ACTION',
    presentationOnly: true,
  });
});

test('source and public feature registry copies remain exact', () => {
  const source = readFileSync('frontend/spatial/feature-registry.js', 'utf8');
  const browser = readFileSync('public/feature-registry.js', 'utf8');
  assert.equal(browser, source);
});

test('feature ids are product ids, not semantic tree ids', () => {
  for (const feature of TEAMAI_FRONTEND_FEATURES) {
    assert.equal(feature.id.includes('TREE-'), false);
    assert.equal(feature.id.includes('SEAT_'), false);
  }
});
