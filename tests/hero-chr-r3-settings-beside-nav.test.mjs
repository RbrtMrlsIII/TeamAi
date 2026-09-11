import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('CHR-R3 residual CSS places settings beside machine-nav on machine layer', async () => {
  const css = await readFile(join(root, 'public/hero-res-258-layer.css'), 'utf8');
  assert.match(css, /CHR-R3/);
  assert.match(css, /hero-settings-shell/);
  assert.match(css, /machine-nav/);
  assert.match(css, /data-hero-layer="machine"/);
  assert.match(css, /inline-flex/);
});

test('CHR-R3 does not introduce a second settings island class', async () => {
  const css = await readFile(join(root, 'public/hero-res-258-layer.css'), 'utf8');
  assert.doesNotMatch(css, /second-settings|settings-island-2/i);
});

test('settings shell mounts relative to machine-nav owner', async () => {
  const js = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.match(js, /machine-nav/);
  assert.match(js, /hero-settings-shell/);
});
