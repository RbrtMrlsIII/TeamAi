import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const wrapper = readFileSync(new URL('../scripts/apply-cam2-tree-follow-flex.mjs', import.meta.url), 'utf8');
const entry = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const baseUrl = new URL('../public/_flex_src/hero-flex.base.js', import.meta.url);

test('Hero flex delivery stays repository-owned', () => {
  assert.doesNotMatch(wrapper, /raw\.githubusercontent\.com/);
  assert.match(wrapper, /_flex_src\/hero-flex\.base\.js/);
  assert.match(entry, /_flex_src\/hero-flex\.base\.js/);
  assert.ok(statSync(baseUrl).size > 0);
});
