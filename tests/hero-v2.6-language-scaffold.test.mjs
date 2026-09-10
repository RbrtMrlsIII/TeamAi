/**
 * V2.6 — Language scaffold (Vision: until copy catalog exists).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readLang, applyUiLang, SUPPORTED_UI_LANGS } from '../frontend/spatial/theme-root.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V2.6 supported langs starts with en only', () => {
  assert.deepEqual([...SUPPORTED_UI_LANGS], ['en']);
});

test('V2.6 applyUiLang sets document lang attrs', () => {
  const attrs = {};
  globalThis.document = {
    documentElement: {
      setAttribute(k, v) { attrs[k] = v; },
    },
  };
  assert.equal(applyUiLang('en'), 'en');
  assert.equal(attrs['data-ui-lang'], 'en');
  assert.equal(attrs.lang, 'en');
  assert.equal(applyUiLang('xx'), 'en');
});

test('V2.6 settings shell includes language select', async () => {
  const src = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.match(src, /data-settings-lang/);
  assert.match(src, /applyUiLang/);
  assert.match(src, /teamai:ui-lang/);
  assert.match(src, /Scaffold/);
});

test('V2.6 theme-root initializes language', async () => {
  const src = await readFile(join(root, 'frontend/spatial/theme-root.js'), 'utf8');
  assert.match(src, /applyUiLang\(readLang\(\)\)/);
  assert.match(src, /LANG_KEY/);
});
