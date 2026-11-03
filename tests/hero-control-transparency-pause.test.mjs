import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = await readFile(new URL('../public/_flex_src/hero-flex.base.js', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

test('production Hero RAF pause exists only on the testMode route', () => {
  assert.equal(runtime, base);
  const gate = "if (query.get('testMode') === '1') {";
  const hook = "Object.defineProperty(window, '__TEAMAI_HERO_TEST_HOOKS__'";
  const gateAt = runtime.indexOf(gate);
  const hookAt = runtime.indexOf(hook);
  assert.ok(gateAt > 0 && hookAt > gateAt);
  assert.equal(runtime.indexOf(hook), runtime.lastIndexOf(hook));
  assert.match(runtime, /pauseFrame\(\)/);
  assert.match(runtime, /resumeFrame\(\)/);
  assert.match(runtime, /if \(heroFramePaused\)/);
  assert.doesNotMatch(runtime, /__TEAMAI_HERO_TEST_HOOKS__\s*=/);
  const ordinary = runtime.slice(0, gateAt);
  assert.equal(ordinary.includes('__TEAMAI_HERO_TEST_HOOKS__'), false);
});
