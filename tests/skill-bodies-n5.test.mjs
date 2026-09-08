/** Slice N.5 remaining SEAT_SKILLS */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const BODIES = [
  'skills/seat/seat.planning.discuss/SKILL.md',
  'skills/seat/seat.field.backend/SKILL.md',
  'skills/seat/seat.field.frontend/SKILL.md',
  'skills/seat/seat.field.integration/SKILL.md',
  'skills/seat/seat.field.docs/SKILL.md',
  'skills/seat/seat.coord.leader/SKILL.md',
];

test('N.5 skill bodies exist with shape', () => {
  for (const p of BODIES) {
    assert.ok(existsSync(join(root, p)), p);
    const body = read(p);
    for (const s of ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']) {
      assert.match(body, new RegExp(s), `${p} ${s}`);
    }
  }
});

test('frontend skill allows later machinery animation polish', () => {
  const body = read('skills/seat/seat.field.frontend/SKILL.md');
  assert.match(body, /later/i);
  assert.match(body, /animation/i);
});
