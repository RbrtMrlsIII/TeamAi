import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = await readFile(new URL('../public/_flex_src/hero-flex.base.js', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const pause = await readFile(new URL('../public/hero-test-frame-pause.js', import.meta.url), 'utf8');

test('production Hero RAF pause exists only on the testMode route', () => {
  assert.equal(runtime, base);
  assert.ok(runtime.length < 30000, 'Hero flex should remain a controller, not a renderer monolith');
  assert.equal(runtime.includes('__TEAMAI_HERO_TEST_HOOKS__'), false);
  assert.equal(runtime.includes('gl.drawArrays'), false);
  const call = "clock(frame, query.get('testMode') === '1', canvas)";
  assert.equal(runtime.includes(call), true);
  assert.equal(runtime.indexOf(call), runtime.lastIndexOf(call));
  const gate = 'if (testMode) {';
  const hook = "Object.defineProperty(window, '__TEAMAI_HERO_TEST_HOOKS__'";
  const gateAt = pause.indexOf(gate);
  const hookAt = pause.indexOf(hook);
  assert.ok(gateAt > 0 && hookAt > gateAt);
  assert.equal(pause.indexOf(hook), pause.lastIndexOf(hook));
  assert.match(pause, /export function bindHeroFrameClock/);
  assert.match(pause, /pauseFrame\(\)/);
  assert.match(pause, /resumeFrame\(\)/);
  assert.equal(pause.slice(0, gateAt).includes('__TEAMAI_HERO_TEST_HOOKS__'), false);
  assert.match(runtime, /bindHeroFrameClock as clock/);
});
