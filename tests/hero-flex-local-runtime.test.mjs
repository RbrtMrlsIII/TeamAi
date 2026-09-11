import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const entry = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const baseUrl = new URL('../public/_flex_src/hero-flex.base.js', import.meta.url);

test('Hero flex entry stays repository-owned at runtime', () => {
  assert.doesNotMatch(entry, /raw\.githubusercontent\.com/);
  assert.match(entry, /_flex_src\/hero-flex\.base\.js/);
  assert.ok(statSync(baseUrl).size > 0);
});
