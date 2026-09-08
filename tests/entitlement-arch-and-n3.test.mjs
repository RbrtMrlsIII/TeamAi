/** Entitlement architecture + N.3 skill bodies */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('entitlement architecture exists and sets no prices', () => {
  const p = 'docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md';
  assert.ok(existsSync(join(root, p)));
  const doc = read(p);
  assert.match(doc, /Team Quality/);
  assert.match(doc, /Tool Quality/);
  assert.match(doc, /team size/i);
  assert.match(doc, /TBD/);
  assert.match(doc, /no 029-released claim/i);
  assert.match(doc, /Ephemeral/);
  assert.match(doc, /Durable/);
  assert.doesNotMatch(doc, /\$\d+/);
  assert.match(doc, /Zip package/);
  assert.match(doc, /not commerce|Not commerce/i);
});

test('axes remain independent of skills packages', () => {
  const doc = read('docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md');
  assert.match(doc, /Team Quality\s+≠\s+Tool Quality/);
  assert.match(doc, /Browser must not self-attest entitlement/i);
});

const BODIES = [
  'skills/workspace/ws.turn.defaults/SKILL.md',
  'skills/workspace/ws.secrets.boundary/SKILL.md',
  'skills/seat/seat.field.verification/SKILL.md',
];

test('N.3 skill bodies exist with shape', () => {
  for (const p of BODIES) {
    assert.ok(existsSync(join(root, p)), p);
    const body = read(p);
    for (const s of ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']) {
      assert.match(body, new RegExp(s));
    }
  }
});
