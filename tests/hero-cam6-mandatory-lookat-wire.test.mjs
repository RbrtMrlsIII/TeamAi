/**
 * Cam-6 wire contracts on hero-flex loader — presentation only · Issue #212
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports resolveSelectedSeatDock', () => {
  assert.match(flex(), /resolveSelectedSeatDock/);
});

test('hero-flex setCamera path forces seat dock when shell open', () => {
  const src = flex();
  assert.match(src, /force:\s*true/);
  assert.match(src, /SEAT_SHELL/);
  assert.match(src, /seatDock/);
});

test('hero-flex applyNavCamera rebases with force while open', () => {
  const src = flex();
  assert.match(src, /resolveSelectedSeatDock\([\s\S]*force:\s*true/);
});
