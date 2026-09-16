import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');

test('current slice is singular while ladder retains historical execution detail', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  const ladder = read('docs/TEAMAI_3D_HERO_HIERARCHY_ANIMATION_LADDER.md');
  const wiring = read('docs/SKILL_WIRING.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  for (const heading of ['## Status', '## Objective', '## Dependencies', '## Verification', '## Current blocker']) {
    assert.match(next, new RegExp(`^${heading}$`, 'm'));
  }
  assert.match(ladder, /depth-first/i);
  assert.match(ladder, /P1/);
  assert.match(ladder, /SEAT_CONNECTION/);
  assert.match(ladder, /NAVIGATE/);
  assert.match(wiring, /skills\/frontend\/spatial\/workspace-zipskills\/SKILL\.md/);
  assert.match(ladder, /current execution frontier is owned only by `Masterplan\/NEXT_SLICES\.md`/i);
});
