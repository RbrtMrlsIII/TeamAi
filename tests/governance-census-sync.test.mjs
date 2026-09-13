import test from 'node:test';
import assert from 'node:assert/strict';
import { CENSUS_FILES, assertCensusSync, requiresCensusSync } from '../scripts/governance/census-sync-contract.mjs';

const census = (extra = []) => CENSUS_FILES.map((file) => ['M', file]).concat(extra);

test('does not require census for unrelated files', () => {
  assert.equal(requiresCensusSync([['M', 'README.md']]), false);
  assert.doesNotThrow(() => assertCensusSync([['M', 'README.md']]));
});

test('requires all census representations for Hero implementation changes', () => {
  assert.equal(requiresCensusSync([['M', 'public/hero-flex.js']]), true);
  assert.throws(
    () => assertCensusSync([['M', 'public/hero-flex.js']]),
    /without synchronized census updates/,
  );
});

test('accepts a synchronized Hero implementation change', () => {
  assert.doesNotThrow(() => assertCensusSync(census([['M', 'public/hero-flex.js']])));
});

test('recognizes recursive spatial and spatial-skill paths', () => {
  assert.equal(requiresCensusSync([['M', 'frontend/spatial/shell-nav.js']]), true);
  assert.equal(requiresCensusSync([['M', 'skills/frontend/spatial/hierarchy-runtime/SKILL.md']]), true);
});
