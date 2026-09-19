import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

/** Validation migration: old invariant = evidence-handover delays owner visual endorsement and current frontier remains singular. Disposition = RETAINED. Replacement = same behavioral checks, with current frontier sourced from Masterplan/NEXT_SLICES.md and acceptance recorded in the session/evidence model. */
test('evidence handover defers owner visual endorsement', () => {
  const body = read('skills/workspace/ws.evidence.handover/SKILL.md');
  assert.match(body, /owner/i);
  assert.match(body, /endorsement/i);
});

test('NEXT_SLICES stays singular and current', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /TEAM-EXPERIENCE-029|post-#346/i);
  assert.match(next, /non-production|Draft|CLOSURE PENDING/i);
});
