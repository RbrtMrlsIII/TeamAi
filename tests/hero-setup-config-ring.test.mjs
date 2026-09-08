import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SETUP_CONFIG_V1, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const r2mod = await readFile(new URL('../public/hero-r2-setup-ring.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');

test('R2 part IDs and SETUP_CONFIG_V1 catalog', () => {
  assert.equal(HIERARCHY_PART.WORKSPACE_SETUP_ENGINE, 'WORKSPACE_SETUP_ENGINE');
  assert.equal(HIERARCHY_PART.WORKSPACE_AUTH_MECHANISM, 'WORKSPACE_AUTH_MECHANISM');
  assert.equal(HIERARCHY_PART.WORKSPACE_CONFIG_BRANCH, 'WORKSPACE_CONFIG_BRANCH');
  assert.ok(SETUP_CONFIG_V1.length >= 4);
  assert.ok(SETUP_CONFIG_V1.some((x) => x.id.includes('login')));
  assert.ok(SETUP_CONFIG_V1.some((x) => x.id.includes('register')));
});

test('hero-flex draws setup/config ring outside R1', () => {
  assert.match(hero + r2mod, /drawSetupConfigRing/);
  assert.match(hero, /SETUP_CONFIG_V1/);
  assert.match(r2mod, /workspace \* 1\.42|workspace\*1\.42/);
});

test('ring map places setup/config on R2', () => {
  assert.match(map, /R2/);
  assert.match(map, /SETUP|CONFIG/i);
  assert.match(map, /login|register/i);
});

test('presentation-only: no credential capture in R2 draw', () => {
  const src = hero + r2mod;
  assert.doesNotMatch(src, /password|client_secret|Bearer |oauth\.|firestore/i);
  assert.match(r2mod, /presentation only|rough:/i);
});
