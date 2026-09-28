/**
 * S22 Keyboard navigation contract.
 * Presentation only. Does not claim 029 released or live backend proof.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { nextMenuIndex } from '../public/hero-accessibility.js';

const a11y = () => readFile(new URL('../public/hero-accessibility.js', import.meta.url), 'utf8');
const flex = () => readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const heroCss = () => readFile(new URL('../public/hero.css', import.meta.url), 'utf8');


test('S22 menu index walks a disclosure list without inventing a second menu role', () => {
  assert.equal(nextMenuIndex(-1, 10, 'ArrowDown'), 0);
  assert.equal(nextMenuIndex(-1, 10, 'ArrowUp'), 9);
  assert.equal(nextMenuIndex(0, 10, 'ArrowDown'), 1);
  assert.equal(nextMenuIndex(9, 10, 'ArrowDown'), 0);
  assert.equal(nextMenuIndex(0, 10, 'ArrowUp'), 9);
  assert.equal(nextMenuIndex(4, 10, 'Home'), 0);
  assert.equal(nextMenuIndex(4, 10, 'End'), 9);
  assert.equal(nextMenuIndex(2, 0, 'ArrowDown'), 0);
});

test('S22 accessibility owner isolates spatial shortcuts from world chrome', async () => {
  const src = await a11y();
  assert.match(src, /shouldIsolateSpatialShortcuts/);
  assert.match(src, /handleMenuKeys/);
  assert.match(src, /data-world-menu-toggle/);
  assert.match(src, /stopPropagation\(\)/);
  assert.match(src, /event\.key !== 'Tab'/);
  assert.doesNotMatch(src, /role=["']menu["']/);
  assert.doesNotMatch(src, /Firebase|Firestore|Better Auth|Neon/);
});

test('Hero controller still keeps editable-target isolation as the spatial fallback', async () => {
  const src = await flex();
  assert.match(src, /function isEditableKeyTarget/);
  assert.match(src, /isEditableKeyTarget\(event\.target\) && key !== 'Escape'/);
});

test('S22 visible focus contract covers keyboard-operable public controls', async () => {
  const src = await heroCss();
  assert.match(src, /:where\(a, button, input, select, textarea, \[tabindex\]\):focus-visible/);
  assert.match(src, /outline: 3px solid currentColor/);
  assert.match(src, /outline-offset: 3px/);
});
