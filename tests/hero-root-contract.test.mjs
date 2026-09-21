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
    ['entrance', 'machine', 'auth', 'settings', 'diagnostics'],
  );
  for (const root of Object.values(HERO_ROOTS)) {
    assert.ok(root.id);
    assert.ok(root.layer);
    assert.ok(root.owner);
  }
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
