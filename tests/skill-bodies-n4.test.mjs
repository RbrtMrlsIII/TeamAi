/** Slice N.4 WORKSPACE_SKILLS bodies */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const BODIES = [
  'skills/workspace/ws.authority.map/SKILL.md',
  'skills/workspace/ws.evidence.handover/SKILL.md',
];

test('N.4 skill bodies exist with shape', () => {
  for (const p of BODIES) {
    assert.ok(existsSync(join(root, p)), p);
    const body = read(p);
    for (const s of ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']) {
      assert.match(body, new RegExp(s), `${p} ${s}`);
    }
  }
});

test('authority map forbids Hero-as-orchestration', () => {
  const body = read('skills/workspace/ws.authority.map/SKILL.md');
  assert.match(body, /presentation/i);
  assert.match(body, /029-released/i);
});

test('evidence handover defers owner visual endorsement', () => {
  const body = read('skills/workspace/ws.evidence.handover/SKILL.md');
  assert.match(body, /owner/i);
  assert.match(body, /endorsement/i);
});

test('NEXT_SLICES marks L merged and N.4 in progress language ok', () => {
  const next = read('docs/TEAMAI_3D_HERO_NEXT_SLICES.md');
  assert.match(next, /L .*\*\*Merged\*\* \(#168\)/);
  assert.match(next, /#150/);
  assert.match(next, /NAVIGATE/);
  assert.match(next, /WORKSPACE_ZIPSKILLS/);
});
