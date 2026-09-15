import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('evidence handover defers owner visual endorsement', () => {
  const body = read('skills/workspace/ws.evidence.handover/SKILL.md');
  assert.match(body, /owner/i);
  assert.match(body, /endorsement/i);
});

test('NEXT_SLICES stays singular and current', () => {
  const next = read('NEXT_SLICES.md');
  assert.equal((next.match(/^## Current slice$/gm) || []).length, 1);
  assert.match(next, /Governance Foundation|machine replacement/i);
  assert.match(next, /draft/i);
});
