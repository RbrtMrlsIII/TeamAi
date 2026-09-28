/**
 * V2.3 — Settings shell beside machine chrome (Vision).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  buildSettingsShellButton,
  buildSettingsShellPanel,
  resolveSettingsShellMount,
  SETTINGS_SHELL_ID,
} from '../public/hero-settings-shell.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V2.3 button and panel scaffold exist', () => {
  globalThis.document = {
    createElement(tag) {
      const el = {
        tagName: tag.toUpperCase(),
        type: '',
        className: '',
        id: '',
        hidden: false,
        textContent: '',
        innerHTML: '',
        dataset: {},
        attrs: {},
        setAttribute(k, v) {
          this.attrs[k] = v;
        },
        getAttribute(k) {
          return this.attrs[k];
        },
        appendChild() {},
      };
      return el;
    },
  };
  const btn = buildSettingsShellButton();
  assert.equal(btn.id, SETTINGS_SHELL_ID);
  assert.equal(btn.className, 'hero-settings-button');
  assert.equal(btn.attrs['aria-expanded'], 'false');
  const panel = buildSettingsShellPanel();
  assert.equal(panel.id, 'hero-settings-panel');
  assert.equal(panel.hidden, true);
  assert.match(panel.innerHTML, /data-settings-theme/);
  assert.match(panel.innerHTML, /data-settings-motion/);
});

test('V2.3 mount prefers explicit data-settings-shell then seat-stack', () => {
  const explicit = { id: 'exp' };
  const stack = { id: 'stack' };
  const rootDoc = {
    querySelector(sel) {
      if (sel === '[data-settings-shell]') return explicit;
      return null;
    },
  };
  assert.equal(resolveSettingsShellMount(rootDoc), explicit);
  const viaNav = {
    querySelector(sel) {
      if (sel === '[data-settings-shell]') return null;
      if (sel === '.seat-stack') return stack;
      return null;
    },
  };
  assert.equal(resolveSettingsShellMount(viaNav), stack);
});

test('V2.3 index keeps the dedicated settings shell and retires machine-nav boot', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.equal(html.includes('hero-machine-nav-bind.js'), false);
  assert.ok(html.includes('hero-settings-shell.js'));
  assert.ok(html.includes('data-settings-shell'));
});

test('V2.3 chrome css includes settings shell rules', async () => {
  const css = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(css, /\.hero-settings-shell/);
  assert.match(css, /\.hero-settings-button/);
  assert.doesNotMatch(css, /\.machine-nav__/);
});
