/** Slice N.2 skill bodies — no 029-released claim */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const BODIES = [
  'skills/workspace/ws.contribution.flow/SKILL.md',
  'skills/seat/seat.work.coding/SKILL.md',
  'skills/workspace/ws.tools.github/SKILL.md',
];

test('N.2 skill body files exist with shape', () => {
  for (const p of BODIES) {
    assert.ok(existsSync(join(root, p)), p);
    const body = read(p);
    for (const s of ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']) {
      assert.match(body, new RegExp(s), `${p} ${s}`);
    }
  }
});

test('GitHub skill separates OAuth from provider API key', () => {
  const body = read('skills/workspace/ws.tools.github/SKILL.md');
  assert.match(body, /OAuth/i);
  assert.match(body, /provider API key/i);
});

test('coding skill references Firestore usage boundary', () => {
  const body = read('skills/seat/seat.work.coding/SKILL.md');
  assert.match(body, /Firestore/i);
});
