import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('R2 app UI handoff is received by the normal UI controller', async () => {
  const source = await readFile(new URL('../public/hero-auth-handoff.js', import.meta.url), 'utf8');
  assert.match(source, /teamai:app-ui-handoff/);
  assert.match(source, /detail\.appUiHandoff !== true/);
  assert.match(source, /detail\.presentationOnly !== true/);
  assert.match(source, /detail\.normalUi !== true/);
  assert.match(source, /detail\.notAuthority !== true/);
  assert.match(source, /endsWith\('#register'\)/);
  assert.match(source, /hero-settings-shell/);
});
