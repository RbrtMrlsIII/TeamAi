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
  assert.equal(btn.attrs['aria-expanded'], 'false');
  const panel = buildSettingsShellPanel();
  assert.equal(panel.id, 'hero-settings-panel');
  assert.equal(panel.hidden, true);
  assert.match(panel.innerHTML, /data-settings-theme/);
  assert.match(panel.innerHTML, /data-settings-motion/);
});

test('V2.3 mount prefers data-settings-shell then machine-nav parent', () => {
  const explicit = { id: 'exp' };
  const parent = { id: 'parent' };
  const nav = { parentElement: parent };
  const rootDoc = {
    querySelector(sel) {
      if (sel === '[data-settings-shell]') return explicit;
      if (sel === '.machine-nav') return nav;
      return null;
    },
  };
  assert.equal(resolveSettingsShellMount(rootDoc), explicit);
  const viaNav = {
    querySelector(sel) {
      if (sel === '[data-settings-shell]') return null;
      if (sel === '.machine-nav') return nav;
      if (sel === '.seat-stack') return { id: 'stack' };
      return null;
    },
  };
  assert.equal(resolveSettingsShellMount(viaNav), parent);
});

test('V2.3 index loads settings-shell after machine-nav-bind', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  const nav = html.indexOf('hero-machine-nav-bind.js');
  const settings = html.indexOf('hero-settings-shell.js');
  assert.ok(nav > 0 && settings > nav);
});

test('V2.3 chrome css includes settings shell rules', async () => {
  const css = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(css, /\.hero-settings-shell/);
  assert.match(css, /\.machine-nav__settings/);
});
