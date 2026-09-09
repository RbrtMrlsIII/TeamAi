/** Hierarchy animation ladder plan of record */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

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

test('NEXT_SLICES records depth-first ladder and not required skills', () => {
  const next = read('docs/TEAMAI_3D_HERO_NEXT_SLICES.md');
  assert.match(next, /depth-first/i);
  assert.match(next, /P1/);
  assert.match(next, /SEAT_CONNECTION/);
  assert.match(next, /login\/signup|login/i);
  assert.match(next, /not required/i);
  assert.match(next, /NAVIGATE/);
  assert.match(next, /#150|#152/);
  assert.match(next, /WORKSPACE_ZIPSKILLS/);
});
