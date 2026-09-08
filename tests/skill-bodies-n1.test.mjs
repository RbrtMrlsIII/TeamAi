/**
 * Slice N.1 — first SEAT_SKILLS / WORKSPACE_SKILLS bodies
 * No 029-released claim. Skills ≠ authorization.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const BODIES = [
  'skills/workspace/ws.029.presentation/SKILL.md',
  'skills/seat/seat.planning.summarize/SKILL.md',
];

const SHAPE = ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS'];

test('N.1 skill body files exist', () => {
  for (const p of BODIES) assert.ok(existsSync(join(root, p)), p);
});

test('N.1 skill bodies have standard shape', () => {
  for (const p of BODIES) {
    const body = read(p);
    for (const section of SHAPE) {
      assert.match(body, new RegExp(section), `${p} missing ${section}`);
    }
  }
});

test('ws.029.presentation forbids 029-released claim', () => {
  const body = read('skills/workspace/ws.029.presentation/SKILL.md');
  assert.match(body, /WORKSPACE_SKILLS/);
  assert.match(body, /029-released/i);
  assert.match(body, /Do not claim/i);
});

test('seat.planning.summarize is not mutation authority', () => {
  const body = read('skills/seat/seat.planning.summarize/SKILL.md');
  assert.match(body, /SEAT_SKILLS/);
  assert.match(body, /not.*document-mutation authority/i);
  assert.match(body, /user review/i);
});

test('kinds contract still lists these kind ids', () => {
  const kinds = read('docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md');
  assert.match(kinds, /ws\.029\.presentation/);
  assert.match(kinds, /seat\.planning\.summarize/);
});
