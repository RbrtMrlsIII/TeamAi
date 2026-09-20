/**
 * Cam-6 wire contracts on the Hero controller.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flex = () => readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

test('Hero controller uses the canonical selected-seat subject resolver', () => {
  const src = flex();
  assert.match(src, /resolveSelectedSeatDock/);
  assert.match(src, /function getSubjectLockSnapshot/);
  assert.match(src, /force: true/);
  assert.match(src, /SEAT_SHELL/);
});

test('navigation remains controller-owned while rendering remains modular', () => {
  const src = flex();
  assert.match(src, /function applyNavCamera/);
  assert.match(src, /machineWorldRenderer\.render/);
  assert.doesNotMatch(src, /gl\.createShader|gl\.drawArrays/);
});