import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('CHR-R3 residual CSS keeps the dedicated settings shell on the machine layer', async () => {
  const css = await readFile(join(root, 'public/hero-res-258-layer.css'), 'utf8');
  assert.match(css, /CHR-R3/);
  assert.match(css, /hero-settings-shell/);
  assert.doesNotMatch(css, /machine-nav/);
  assert.match(css, /data-hero-layer="machine"/);
});

test('CHR-R3 does not introduce a second settings island class', async () => {
  const css = await readFile(join(root, 'public/hero-res-258-layer.css'), 'utf8');
  assert.doesNotMatch(css, /second-settings|settings-island-2/i);
});

test('settings shell mounts through the dedicated settings root, not machine-nav', async () => {
  const js = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.doesNotMatch(js, /machine-nav/);
  assert.match(js, /\[data-settings-shell\]/);
  assert.match(js, /hero-settings-shell/);
});
