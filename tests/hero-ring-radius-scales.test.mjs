import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RING_R0_ZIP_SCALE, RING_R1_SCALE, RING_R2_SCALE } from '../public/hero-hierarchy-runtime.js';

const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const r2 = await readFile(new URL('../public/hero-r2-setup-ring.js', import.meta.url), 'utf8');

test('RING scales match §9 documentation', () => {
  assert.equal(RING_R0_ZIP_SCALE, 0.22);
  assert.equal(RING_R1_SCALE, 1.18);
  assert.equal(RING_R2_SCALE, 1.42);
  assert.match(baseline, /`RING_R0_ZIP_SCALE`\s*\|\s*`0\.22`/);
  assert.match(baseline, /`RING_R1_SCALE`\s*\|\s*`1\.18`/);
  assert.match(baseline, /`RING_R2_SCALE`\s*\|\s*`1\.42`/);
});

test('draw paths use named scales not magic numbers', () => {
  assert.match(hero, /workspace \* RING_R0_ZIP_SCALE/);
  assert.doesNotMatch(hero, /workspace \* 0\.22/);
  assert.match(hero, /workspace \* RING_R1_SCALE/);
  assert.doesNotMatch(hero, /workspace \* 1\.18/);
  assert.match(r2, /workspace \* RING_R2_SCALE/);
  assert.doesNotMatch(r2, /workspace \* 1\.42/);
});

test('scales ordered R0 zip < R1 < R2 < typical seat outer', () => {
  assert.ok(RING_R0_ZIP_SCALE < RING_R1_SCALE);
  assert.ok(RING_R1_SCALE < RING_R2_SCALE);
  assert.ok(RING_R2_SCALE < 1.8);
});
