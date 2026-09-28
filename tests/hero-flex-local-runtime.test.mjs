import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const wrapper = readFileSync(new URL('../scripts/sync-hero-flex-runtime.mjs', import.meta.url), 'utf8');
const entry = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
const baseUrl = new URL('../public/_flex_src/hero-flex.base.js', import.meta.url);

test('Hero delivery is repository-owned and renderer/controller boundaries are explicit', () => {
  assert.doesNotMatch(wrapper, /raw\.githubusercontent\.com/);
  assert.match(wrapper, /_flex_src\/hero-flex\.base\.js/);
  assert.doesNotMatch(entry, /raw\.githubusercontent\.com|MAIN_URL|function patchSource|URL\.createObjectURL|new Blob|await fetch\(/);
  assert.match(entry, /createMachineWorldRenderer/);
  assert.match(entry, /machineWorldRenderer\.render/);
  assert.doesNotMatch(entry, /gl\.createShader|gl\.createProgram|gl\.drawArrays|function mesh\(|function torus\(|function sphere\(/);
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /createMachineExpansionMechanism/);
  assert.match(renderer, /createDeepSpaceField/);
  assert.match(renderer, /gl\.drawArrays/);
  assert.ok(statSync(baseUrl).size > 0);
  assert.ok(entry.length < 30000, 'Hero flex should remain a controller, not a renderer monolith');
});
test('Hero controller does not acquire its own WebGL context', () => {
  assert.equal(entry.includes("getContext('webgl'"), false);
  assert.equal(renderer.includes("providedGl || canvas?.getContext('webgl'"), true);
});
