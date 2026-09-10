/**
 * V2.4 — Settings shell uses theme-root (Vision).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V2.4 settings shell imports theme-root', async () => {
  const src = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.match(src, /from '\.\.\/frontend\/spatial\/theme-root\.js'/);
  assert.match(src, /applyDocumentTheme/);
  assert.match(src, /persistTheme/);
  assert.match(src, /initializeTheme/);
  assert.match(src, /syncSettingsShellPressed/);
});

test('V2.4 does not invent a second theme attribute root', async () => {
  const src = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.match(src, /applyDocumentTheme\(/);
  assert.doesNotMatch(src, /data-theme-mode-local/);
});

test('V2.4 theme-root exports expected API', async () => {
  const {
    applyDocumentTheme,
    persistTheme,
    initializeTheme,
    readMotion,
  } = await import('../frontend/spatial/theme-root.js');
  assert.equal(typeof applyDocumentTheme, 'function');
  assert.equal(typeof persistTheme, 'function');
  assert.equal(typeof initializeTheme, 'function');
  assert.equal(typeof readMotion, 'function');
});
