import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const wrapper = readFileSync(new URL('../scripts/apply-cam2-tree-follow-flex.mjs', import.meta.url), 'utf8');
const entry = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const baseUrl = new URL('../public/_flex_src/hero-flex.base.js', import.meta.url);

test('Hero flex delivery stays repository-owned', () => {
  assert.doesNotMatch(wrapper, /raw\.githubusercontent\.com/);
  assert.match(wrapper, /_flex_src\/hero-flex\.base\.js/);
  assert.doesNotMatch(entry, /raw\.githubusercontent\.com/);
  assert.doesNotMatch(entry, /MAIN_URL/);
  assert.doesNotMatch(entry, /function patchSource/);
  assert.doesNotMatch(entry, /URL\.createObjectURL/);
  assert.doesNotMatch(entry, /new Blob/);
  assert.doesNotMatch(entry, /await fetch\(/);
  assert.match(entry, /function cameras\(\)/);
  assert.match(entry, /from '\.\/hero-cam4-edge-swipe\.js'/);
  assert.match(entry, /edgeDriftDelta/);
  assert.match(entry, /inverseSwipeDelta/);
  assert.ok(statSync(baseUrl).size > 0);
  assert.ok(entry.length > 10000, 'committed Hero flex must be the full assembled app, not a loader');
});
