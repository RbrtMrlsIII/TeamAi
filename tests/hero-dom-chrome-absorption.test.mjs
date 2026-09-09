/**
 * DOM chrome soft-absorption tests (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MACHINE_UI_ATTR,
  DOM_CHROME_SELECTORS,
  applyMachineUiChrome,
  isMachineUiOpen,
} from '../public/hero-dom-chrome-absorption.js';

function mockShell() {
  const attrs = new Map();
  const nodes = new Map();
  for (const sel of DOM_CHROME_SELECTORS) {
    const el = {
      classList: {
        _s: new Set(),
        toggle(c, on) { if (on) this._s.add(c); else this._s.delete(c); },
        contains(c) { return this._s.has(c); },
      },
      attrs: new Map(),
      setAttribute(k, v) { this.attrs.set(k, v); },
      getAttribute(k) { return this.attrs.get(k); },
      removeAttribute(k) { this.attrs.delete(k); },
    };
    nodes.set(sel, el);
  }
  return {
    attrs,
    setAttribute(k, v) { attrs.set(k, v); },
    getAttribute(k) { return attrs.get(k); },
    querySelectorAll(sel) {
      const el = nodes.get(sel);
      return el ? [el] : [];
    },
    _nodes: nodes,
  };
}

test('MACHINE_UI_ATTR and selectors are defined', () => {
  assert.equal(MACHINE_UI_ATTR, 'data-hero-machine-ui');
  assert.ok(DOM_CHROME_SELECTORS.includes('.seat-stack'));
  assert.ok(DOM_CHROME_SELECTORS.includes('.hero-inspection'));
});

test('applyMachineUiChrome opens and closes without throwing', () => {
  const shell = mockShell();
  const open = applyMachineUiChrome(shell, { hierarchyOpen: true });
  assert.equal(open.hierarchyOpen, true);
  assert.equal(shell.getAttribute(MACHINE_UI_ATTR), '1');
  assert.equal(isMachineUiOpen(shell), true);
  assert.ok(open.hiddenCount >= 1);
  const seat = shell._nodes.get('.seat-stack');
  assert.equal(seat.getAttribute('aria-hidden'), 'true');
  assert.ok(seat.classList.contains('is-machine-absorbed'));

  const closed = applyMachineUiChrome(shell, { hierarchyOpen: false });
  assert.equal(closed.hierarchyOpen, false);
  assert.equal(shell.getAttribute(MACHINE_UI_ATTR), '0');
  assert.equal(seat.getAttribute('aria-hidden'), 'false');
  assert.ok(!seat.classList.contains('is-machine-absorbed'));
});

test('module and absorption plan stay presentation-only', async () => {
  const src = await readFile(new URL('../public/hero-dom-chrome-absorption.js', import.meta.url), 'utf8');
  assert.match(src, /DOM chrome|machine-ui|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth/i);
  const plan = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md', import.meta.url),
    'utf8'
  );
  assert.match(plan, /Hide-or-gate DOM|seat-stack/i);
});

test('CSS defines machine-ui soft-hide rules', async () => {
  let css = '';
  try {
    css = await readFile(new URL('../public/hero-dom-chrome.css', import.meta.url), 'utf8');
  } catch {
    css = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');
  }
  assert.match(css, /data-hero-machine-ui/);
  assert.match(css, /seat-stack/);
});

test('hero-flex wires DOM soft-hide after apply', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });
  const flex = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(flex, /hero-dom-chrome-absorption|applyMachineUiChrome/);
});
