/** Slice L — satisfied-by map for #96–#98 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Validation migration: old invariant = L evidence map remains authoritative evidence and the active frontier stays singular. Disposition = RETAINED. Replacement = same evidence assertions, with the current frontier sourced from Masterplan/NEXT_SLICES.md. */
test('L evidence map exists and forbids close/re-implement claims', () => {
  const p = 'docs/EVIDENCE_TEAM-EXPERIENCE-029_VERIFICATION_96_98_SATISFIED_BY.md';
  assert.ok(existsSync(join(root, p)));
  const doc = read(p);
  assert.match(doc, /#96/);
  assert.match(doc, /#97/);
  assert.match(doc, /#98/);
  assert.match(doc, /Do not re-implement/i);
  assert.match(doc, /no 029-released claim/i);
  assert.match(doc, /hero-theme-lighting-adapter/);
});

test('NEXT_SLICES stays singular and current', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /Governance Foundation|machine replacement/i);
  assert.match(next, /draft/i);
});

test('adapter and fixtures still on main tree', () => {
  assert.ok(existsSync(join(root, 'frontend/spatial/hero-theme-lighting-adapter.js')));
  assert.ok(existsSync(join(root, 'tests/hero-theme-lighting-adapter.test.mjs')));
});
