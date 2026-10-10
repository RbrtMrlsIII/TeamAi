/**
 * Cam-6 wire contracts on the Hero controller.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flex = () => readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const navigation = () => readFileSync(new URL('../public/hero-camera-navigation.js', import.meta.url), 'utf8');

test('Hero controller uses the canonical selected-seat subject resolver', () => {
  const src = flex();
  const owner = navigation();
  assert.match(owner, /resolveSelectedSeatDock/);
  assert.match(owner, /function getSubjectLockSnapshot/);
  assert.match(owner, /force: true/);
  assert.match(src, /getSubjectLockSnapshot/);
  assert.match(src, /SEAT_SHELL/);
});

test('navigation remains controller-owned while rendering remains modular', () => {
  const src = flex();
  assert.match(src, /function applyNavCamera/);
  assert.match(src, /machineWorldRenderer\.render/);
  assert.doesNotMatch(src, /gl\.createShader|gl\.drawArrays/);
});