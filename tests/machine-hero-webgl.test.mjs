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
  const childEnd = renderer.indexOf('\n  function renderAdjacentDivisionWiring', childStart);
  assert.ok(childStart >= 0 && childBodyStart > childStart && childEnd > childBodyStart);
  const childBody = renderer.slice(childBodyStart, childEnd);
  assert.doesNotMatch(childBody, /renderSeat1ConnectionChild\s*\(/);

  const renderStart = renderer.indexOf('function render(timestamp = performance.now(), state = {})');
  const renderEnd = renderer.indexOf('\n  return Object.freeze({', renderStart);
  assert.ok(renderStart >= 0 && renderEnd > renderStart);
  const renderBody = renderer.slice(renderStart, renderEnd);
  assert.equal((renderBody.match(/renderSeat1ConnectionChild\s*\(/g) || []).length, 1);
  assert.match(renderBody, /renderAdjacentDivisionWiring\(scene, effectiveCameraId, state, reducedMotion\)/);
  assert.match(renderBody, /renderSeat1ConnectionChild\(scene, finite\(state\.connectionBranchAmount, 0\), effectiveCameraId, reducedMotion, now\)/);
  assert.match(renderBody, /drawFocusedSeatDivision/);
  assert.match(renderer, /SEAT_DIVISION_ORDER/);
  assert.match(renderer, /resolveSeatDivisionPayload/);
  assert.match(renderBody, /renderSemanticEdgeTrace/);
  assert.match(renderBody, /focusedDivision\?\.edge/);
  assert.match(renderBody, /state\.focusedChildId/);
  assert.match(renderBody, /state\.seatDivisionBranchAmounts/);
  assert.match(renderBody, /machineWorldFocusedDivisionCamera/);
  assert.match(renderBody, /hierarchyOpen && sample\.amount > 0\.02/);
  assert.match(renderBody, /kind === 'inner-pod' && Number\.isInteger\(part\.seatIndex\)/);
  const partsLoopStart = renderBody.indexOf('for (const part of scene.parts) {');
  const partsLoopOpen = renderBody.indexOf('{', partsLoopStart);
  const framePassMarker = renderBody.indexOf(
    '// Seat-1 child and adjacent wiring are frame-level passes, not per-part draws.',
  );
  assert.ok(partsLoopStart >= 0 && partsLoopOpen > partsLoopStart && framePassMarker > partsLoopOpen);

  let depth = 0;
  let loopEnd = -1;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = partsLoopOpen; index < framePassMarker; index += 1) {
    const char = renderBody[index];
    const next = renderBody[index + 1];
    if (lineComment) {
      if (char === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) loopEnd = index;
    }
  }
  assert.ok(loopEnd > partsLoopOpen && framePassMarker > loopEnd);
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


test('machine choreography is state-derived in the canonical renderer', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /deriveMachineTransformationChoreography\(/);
  assert.match(renderer, /shellAmount: finite\(state\.hierarchyOpenAmount, sample\.amount\)/);
  assert.match(renderer, /divisionAmount: finite\(state\.focusedChildAmount, 0\)/);
  assert.match(renderer, /connectionAmount: finite\(state\.connectionBranchAmount, 0\)/);
  assert.match(renderer, /choreography\.electrical/);
  assert.match(renderer, /choreography\.workspaceReception/);
  assert.match(renderer, /machineWorldChoreographyPhase/);
});


test('canonical renderer keeps canvas resize idempotent between frames', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /function resizeCanvasIfNeeded\(width, height, dpr\)/);
  assert.match(renderer, /canvas\.width !== pixelWidth \|\| canvas\.height !== pixelHeight/);
  assert.match(renderer, /if \(changed\) \{[\s\S]*canvas\.width = pixelWidth/);
  assert.doesNotMatch(renderer, /canvas\.width = Math\.max\(1, Math\.floor\(width\*dpr\)\)/);
});


test('compatibility previews keep context and RAF ownership inside the renderer', async () => {
  const coreVisual = await readFile(new URL('../public/machine-core-visual.js', import.meta.url), 'utf8');
  const preview = await readFile(new URL('../public/machine-hero-webgl.js', import.meta.url), 'utf8');
  const magnificent = await readFile(new URL('../public/machine-hero-magnificent.js', import.meta.url), 'utf8');

  for (const source of [coreVisual, preview, magnificent]) {
    assert.doesNotMatch(source, /getContext\(['"]webgl['"]/);
    assert.match(source, /createMachineWorldRenderer\(\{ canvas \}\)/);
  }
  assert.doesNotMatch(coreVisual, /new ResizeObserver\(\(\) => render\(\)\)/);
  assert.match(coreVisual, /raf = requestAnimationFrame\(render\)/);
  assert.match(preview, /rafId = requestAnimationFrame\(render\)/);
  assert.match(magnificent, /raf = requestAnimationFrame\(render\)/);
});
