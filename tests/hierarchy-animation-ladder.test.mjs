/** Hierarchy animation ladder plan of record */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Validation migration: old invariant = ladder semantics and one current frontier. Disposition = RETAINED. Replacement = same semantic ladder checks, with the current frontier sourced only from Masterplan/NEXT_SLICES.md. */
test('animation ladder doc exists with camera-fill and P1', () => {
  const p = 'docs/TEAMAI_3D_HERO_HIERARCHY_ANIMATION_LADDER.md';
  assert.ok(existsSync(join(root, p)));
  const doc = read(p);
  assert.match(doc, /camera-fill|Camera-fill/i);
  assert.match(doc, /login|signup/i);
  assert.match(doc, /P1/);
  assert.match(doc, /SEAT_CONNECTION/);
  assert.match(doc, /no 029-released claim/i);
});

test('NEXT_SLICES exposes one current frontier while ladder retains history', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  const ladder = read('docs/TEAMAI_3D_HERO_HIERARCHY_ANIMATION_LADDER.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /Governance Foundation|machine replacement/i);
  assert.match(ladder, /depth-first/i);
  assert.match(ladder, /P1/);
  assert.match(ladder, /SEAT_CONNECTION/);
  assert.match(ladder, /NAVIGATE/);
  assert.match(ladder, /WORKSPACE_ZIPSKILLS/);
});
