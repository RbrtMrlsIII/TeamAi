import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HERO_ROOTS,
  getHeroRootSnapshot,
  validateHeroRootDefinitions,
  getHeroRootState,
  registerHeroRoot,
} from '../frontend/spatial/hero-root-contract.js';

test('provisional Hero roots have explicit owners without freezing spatial implementation', () => {
  assert.deepEqual(
    Object.keys(HERO_ROOTS),
    ['entrance', 'machine', 'auth', 'settings', 'mcp', 'diagnostics'],
  );
  for (const root of Object.values(HERO_ROOTS)) {
    assert.ok(root.id);
    assert.ok(root.layer);
    assert.ok(root.owner);
  }
});

test('S20 Settings root remains cross-cutting and inherits the canonical structural machine without becoming a Seat child', () => {
  const settings = HERO_ROOTS.settings;
  assert.equal(settings.layer, 'normal-ui');
  assert.equal(settings.owner, 'hero-settings-shell');
  assert.equal(settings.spatialContract.constructionSlice, 'S20');
  assert.deepEqual(settings.spatialContract.inheritedStructuralRoots, Array.from({ length: 11 }, (_, i) => `S${i}`));
  assert.equal(settings.spatialContract.semanticBoundary, 'presentation-only');
});

test('Hero root registration is idempotent and observable', () => {
  const first = registerHeroRoot('machine', { status: 'ready' });
  const second = registerHeroRoot('machine', { status: 'ready' });
  assert.equal(first.id, second.id);
  assert.equal(getHeroRootState('machine').status, 'ready');
  assert.equal(getHeroRootSnapshot().machine.owner, 'hero-flex');
});

test('unknown roots fail closed', () => {
  assert.equal(registerHeroRoot('unknown'), null);
  assert.equal(getHeroRootState('unknown'), null);
});


test('root definitions validate without duplicate identities or owners', () => {
  const validation = validateHeroRootDefinitions();
  assert.equal(validation.valid, true, validation.issues.join(', '));
  assert.deepEqual(validateHeroRootDefinitions({
    a: { id: 'same', owner: 'owner' },
    b: { id: 'same', owner: 'owner' },
  }).issues, ['ROOT_DUPLICATE_ID:same', 'ROOT_DUPLICATE_OWNER:owner']);
});
