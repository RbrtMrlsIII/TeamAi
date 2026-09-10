/**
 * V2.2 — Bind MACHINE_NAV_MAP to seat-stack chrome (Vision).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildMachineNavSelect, resolveMachineNavMount } from '../public/hero-machine-nav-bind.js';
import { MACHINE_NAV_MAP } from '../public/hero-machine-nav-map.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('V2.2 buildMachineNavSelect lists all map entries', () => {
  const options = [];
  globalThis.document = {
    createElement(tag) {
      if (tag === 'select') {
        return {
          className: '',
          dataset: {},
          children: options,
          appendChild(c) {
            options.push(c);
          },
          setAttribute() {},
        };
      }
      if (tag === 'option') {
        return { value: '', textContent: '', dataset: {} };
      }
      return { className: '', dataset: {}, appendChild() {}, setAttribute() {}, textContent: '' };
    },
  };
  const select = buildMachineNavSelect(MACHINE_NAV_MAP);
  assert.equal(options.length, MACHINE_NAV_MAP.length);
  assert.ok(options.some((o) => o.value === 'world-baseline'));
  assert.ok(select.dataset.machineNavSelect === '1');
});

test('V2.2 resolveMachineNavMount prefers data-machine-nav then seat-stack', () => {
  const explicit = { id: 'explicit' };
  const stack = { id: 'stack' };
  const rootDoc = {
    querySelector(sel) {
      if (sel === '[data-machine-nav]') return explicit;
      if (sel === '.seat-stack') return stack;
      return null;
    },
  };
  assert.equal(resolveMachineNavMount(rootDoc), explicit);
  const onlyStack = {
    querySelector(sel) {
      if (sel === '[data-machine-nav]') return null;
      if (sel === '.seat-stack') return stack;
      return null;
    },
  };
  assert.equal(resolveMachineNavMount(onlyStack), stack);
});

test('V2.2 index loads machine-nav-bind before seat-stack', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  const bind = html.indexOf('hero-machine-nav-bind.js');
  const stack = html.indexOf('hero-seat-stack.js');
  assert.ok(bind > 0 && stack > bind);
});

test('V2.2 chrome css includes machine-nav rules', async () => {
  const css = await readFile(join(root, 'public/hero-dom-chrome.css'), 'utf8');
  assert.match(css, /\.machine-nav__/);
  assert.match(css, /\.machine-nav__select/);
});
