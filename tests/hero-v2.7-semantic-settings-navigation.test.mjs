/**
 * V2.7 — live Hero Settings semantic navigation.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const src = await readFile(new URL('../public/hero-settings-shell.js', import.meta.url), 'utf8');
const cssSrc = await readFile(new URL('../public/hero-dom-chrome.css', import.meta.url), 'utf8');

test('V2.7 Settings exposes governed semantic tree references', async () => {
  for (const id of [
    'TREE-SETTINGS',
    'TREE-WORLD',
    'TREE-SEAT',
    'TREE-CAPABILITY',
    'TREE-AUTHORIZATION',
    'TREE-WORKSPACE',
    'TREE-ORCHESTRATION',
    'TREE-EVIDENCE',
    'TREE-COMMERCE',
  ]) {
    assert.ok(src.includes(id), id);
  }
  assert.ok(src.includes('SEMANTIC_SETTINGS_REFERENCES'));
  assert.ok(src.includes('renderSemanticSettingsReference'));
  assert.ok(src.includes('data-settings-semantic-ref'));
});

test('V2.7 semantic navigation is explicitly presentation-only', async () => {
  assert.ok(src.includes('Presentation crosswalk only.'));
  assert.ok(src.includes('References do not grant authorization, entitlement, execution, or durable-state authority.'));
});

test('V2.7 semantic navigation has responsive presentation rules', async () => {
  assert.ok(cssSrc.includes('.hero-settings-panel__semantic-grid'));
  assert.ok(cssSrc.includes('@media(max-width:520px)'));
});
