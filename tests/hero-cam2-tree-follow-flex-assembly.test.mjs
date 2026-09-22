import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Cam-2 compatibility command delegates to canonical source synchronization', async () => {
  const apply = await readFile(new URL('../scripts/apply-cam2-tree-follow-flex.mjs', import.meta.url), 'utf8');
  assert.match(apply, /sync-hero-flex-runtime\.mjs/);
  assert.doesNotMatch(apply, /apply-cam2-tree-follow-flex\.engine/);
  assert.doesNotMatch(apply, /fetch\(/);
});
