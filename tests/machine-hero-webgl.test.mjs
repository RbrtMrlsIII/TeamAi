import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../public/machine-hero-webgl.js', import.meta.url), 'utf8');
const payload = await readFile(new URL('../public/machine-hero-payload.js', import.meta.url), 'utf8');
const graph = await readFile(new URL('../public/machine-hero-graph.js', import.meta.url), 'utf8');
const page = await readFile(new URL('../public/machine-core-preview.html', import.meta.url), 'utf8');
const fallback = await readFile(new URL('../public/machine-core-semantic-fallback.js', import.meta.url), 'utf8');
const magnificent = await readFile(new URL('../public/machine-hero-magnificent.js', import.meta.url), 'utf8');
const magnificentPage = await readFile(new URL('../public/machine-hero-magnificent.html', import.meta.url), 'utf8');

test('WebGL machine preview is opt-in and separate from production canvas', () => {
  assert.match(source, /get\('machine-preview'\)/);
  assert.match(source, /mountMachineWebGLPreview/);
  assert.match(source, /data-machine-hero-webgl/);
  assert.match(page, /mountMachineWebGLPreview/);
});

test('machine preview has a semantic fallback independent of WebGL availability', () => {
  assert.match(page, /machine-core-semantic-fallback\.js/);
  assert.match(fallback, /createBranchConnectionCore/);
  assert.match(fallback, /createMachineAnimation/);
  assert.match(fallback, /data-core-count/);
  assert.match(fallback, /data-core-camera/);
  assert.match(fallback, /reduced-motion/);
});

test('WebGL preview delegates rendering to the canonical world renderer while semantic graph modules remain independently tested', () => {
  assert.match(source, /\.\/machine-world-renderer\.js/);
  assert.match(source, /createMachineWorldRenderer/);
  assert.match(graph, /createMachineGraph/);
  assert.match(payload, /createMachineTransitionFromPayload/);
});

test('canonical renderer owns the multi-module and wiring draw path', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /scene\.parts/);
  assert.match(renderer, /scene\.connections/);
  assert.match(renderer, /gl\.LINE_STRIP/);
  assert.match(renderer, /machineWorldRenderer|machine-world renderer|machine-world/);
});

test('Seat-1 child render path is owned by the canonical frame and is not recursive', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const childStart = renderer.indexOf('function renderSeat1ConnectionChild(');
  const childBodyStart = renderer.indexOf('{', childStart) + 1;
  const childEnd = renderer.indexOf('\n  function renderSeat1AdjacentWiring', childStart);
  assert.ok(childStart >= 0 && childBodyStart > childStart && childEnd > childBodyStart);
  const childBody = renderer.slice(childBodyStart, childEnd);
  assert.doesNotMatch(childBody, /renderSeat1ConnectionChild\s*\(/);

  const renderStart = renderer.indexOf('function render(timestamp = performance.now(), state = {})');
  const renderEnd = renderer.indexOf('\n  return Object.freeze({', renderStart);
  assert.ok(renderStart >= 0 && renderEnd > renderStart);
  const renderBody = renderer.slice(renderStart, renderEnd);
  assert.equal((renderBody.match(/renderSeat1ConnectionChild\s*\(/g) || []).length, 1);
  assert.match(renderBody, /renderSeat1AdjacentWiring\(scene, effectiveCameraId, state, reducedMotion\)/);
  assert.match(renderBody, /renderSeat1ConnectionChild\(scene, finite\(state\.connectionBranchAmount, 0\), effectiveCameraId, reducedMotion, now\)/);
  assert.match(renderBody, /drawFocusedSeatDivision/);
  assert.match(renderBody, /state\.focusedChildId/);
  const partsLoopStart = renderBody.indexOf('for (const part of scene.parts) {');
  const framePassMarker = renderBody.indexOf(
    '\\n    }\\n\\n    // Seat-1 child and adjacent wiring are frame-level passes, not per-part draws.\\n    renderSeat1ConnectionChild'
  );
  assert.ok(partsLoopStart >= 0 && framePassMarker > partsLoopStart);
  assert.ok(framePassMarker < renderBody.indexOf('gl.useProgram(line);', framePassMarker));
});

test('canonical world renderer uses the shared stateful animation engine for expansion and interruption', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /\.\/machine-core-animation\.js/);
  assert.match(renderer, /createMachineAnimation/);
  assert.match(renderer, /animation\.sample/);
  assert.match(renderer, /animation\.setTarget/);
  assert.match(renderer, /reducedMotion/);
  assert.match(renderer, /wantedExpanded/);
  assert.match(renderer, /if \(wantedExpanded !== targetExpanded\)/);
});

test('canonical world renderer keeps branch camera identity separate from physical subject', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /resolveBranchCamera/);
  assert.match(renderer, /effectiveCameraId/);
  assert.match(renderer, /fitWorldCamera/);
  assert.match(renderer, /deriveMachineSubject/);
});

test('magnificent compatibility preview delegates to the canonical renderer', () => {
  assert.match(magnificent, /\.\/machine-world-renderer\.js/);
  assert.match(magnificent, /createMachineWorldRenderer/);
  assert.match(magnificent, /mountMagnificentMachine/);
  assert.match(magnificentPage, /data-machine-magnificent/);
  assert.match(magnificentPage, /prototype · not production/);
});

test('WebGL preview has no provider, auth, or durable-state authority', () => {
  assert.doesNotMatch(source, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
  assert.doesNotMatch(magnificent, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(magnificent, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
});
