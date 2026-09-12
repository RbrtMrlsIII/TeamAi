import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile('supabase/functions/teamai-task-execute/index.ts', 'utf8');

test('task lease preserves the complete Firestore field map', () => {
  assert.match(
    source,
    /const taskFields: Record<string, unknown> = \{\s*\.\.\.task\.fields,/,
  );
  assert.doesNotMatch(
    source,
    /Object\.fromEntries\(\s*Object\.entries\(current\)\.filter\(\(\[, v\]\) => typeof v === "string"\)/,
  );
});
