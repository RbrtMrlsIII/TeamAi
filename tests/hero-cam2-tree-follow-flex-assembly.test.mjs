import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
test('Cam-2 assembler declares lastNavBaseCameraId when B/C6 camera patch is present', async () => {
  const source = await readFile(new URL('../scripts/apply-cam2-tree-follow-flex.engine.mjs', import.meta.url), 'utf8');
  assert.match(source, /lastNavBaseCameraId/);
  assert.match(source, /if \(!t\.includes\('lastNavBaseCameraId'\)\)/);
});