/**
 * V2.5 — UI scale scaffold on settings shell (Vision).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readScale, applyUiScale } from '../frontend/spatial/theme-root.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V2.5 theme-root exposes readScale and applyUiScale', () => {
  assert.equal(typeof readScale, 'function');
  assert.equal(typeof applyUiScale, 'function');
});

test('V2.5 applyUiScale clamps and sets document attributes', () => {
  const attrs = {};
  const style = { props: {}, setProperty(k, v) { this.props[k] = v; } };
  globalThis.document = {
    documentElement: {
      setAttribute(k, v) { attrs[k] = v; },
      style,
    },
  };
  const out = applyUiScale(2);
  assert.equal(out, 1.35);
  assert.equal(attrs['data-ui-scale'], '1.35');
  assert.equal(style.props['--ui-scale'], '1.35');
  const low = applyUiScale(0.5);
  assert.equal(low, 0.85);
});

test('V2.5 settings shell includes scale control', async () => {
  const src = await readFile(join(root, 'public/hero-settings-shell.js'), 'utf8');
  assert.match(src, /data-settings-scale/);
  assert.match(src, /applyUiScale/);
  assert.match(src, /teamai:ui-scale/);
});

test('V2.5 chrome css defines --ui-scale consumption', async () => {
  const css = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(css, /--ui-scale/);
  assert.match(css, /hero-settings-panel__scale/);
});
