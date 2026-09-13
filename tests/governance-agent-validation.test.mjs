import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('agent-validation derives freshness and historical dimensions from validator output', async () => {
  const workflow = await readFile('.github/workflows/governance.yml', 'utf8');
  assert.match(workflow, /verify-active-index\.mjs --mode=governance --base=\"\$BASE_SHA\" --json/);
  assert.match(workflow, /active_index_freshness: governance\.active_index_freshness/);
  assert.match(workflow, /historical_integrity: governance\.historical_integrity/);
  assert.doesNotMatch(workflow, /active_index_freshness:\s*'PASS'/);
  assert.doesNotMatch(workflow, /historical_integrity:\s*'PASS'/);
});
