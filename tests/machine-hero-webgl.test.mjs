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

test('canonical renderer exposes lifecycle-driven R1/R2 articulation state', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /machine-ring-articulation\.js/);
  assert.match(renderer, /deriveMachineRingArticulation/);
  assert.match(renderer, /machineWorldR1Articulation/);
  assert.match(renderer, /machineWorldR2Articulation/);
  assert.match(renderer, /machineWorldR1Signal/);
  assert.match(renderer, /machineWorldR2Signal/);
});

test('S10 semantic camera owner is wired between controller and canonical renderer', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const controller = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  const camera = await readFile(new URL('../public/machine-camera.js', import.meta.url), 'utf8');
  assert.match(renderer, /machine-camera\.js/);
  assert.match(renderer, /deriveMachineCameraSpec/);
  assert.match(renderer, /resolveMachineCameraMode/);
  assert.match(renderer, /state\.cameraId/);
  assert.match(renderer, /coreSubject: coreAssembly\?\.subject/);
  const renderStart = controller.indexOf('machineWorldRenderer.render(now, {');
  const renderEnd = controller.indexOf('\n  });', renderStart);
  assert.ok(renderStart >= 0 && renderEnd > renderStart);
  assert.match(controller.slice(renderStart, renderEnd), /\bcameraId,/);
  assert.match(camera, /WORKSPACE_CLOSE/);
  assert.match(camera, /CORE_FOCUS/);
});

test('canonical renderer owns the R0 workspace receiving presentation pass', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /machine-r0-receiving\.js/);
  assert.match(renderer, /deriveWorkspaceReceivingPresentation/);
  assert.match(renderer, /function renderWorkspaceReceiving\(/);
  assert.match(renderer, /R0_RECEIVING_PHASE\.DORMANT/);
  assert.match(renderer, /machineWorldWorkspaceReceptionPhase/);
  assert.match(renderer, /state\.heroState/);
});

test('canonical renderer reaches focused Seat divisions through the authored S4 presentation owner', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const presentation = await readFile(new URL('../public/machine-seat-division-presentation.js', import.meta.url), 'utf8');
  assert.match(renderer, /machine-seat-division-presentation\.js/);
  assert.match(renderer, /drawFocusedSeatDivision/);
  assert.match(presentation, /machine-seat-division-assembly\.js/);
  assert.match(presentation, /deriveMachineSeatDivisionAssembly/);
  assert.match(presentation, /validateMachineSeatDivisionAssembly/);
  assert.match(presentation, /assembly\.components/);
});
test('canonical renderer renders the S2 authored core assembly through one central-core owner', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /machine-core-assembly\.js/);
  assert.match(renderer, /deriveMachineCoreAssembly/);
  assert.match(renderer, /validateMachineCoreAssembly/);
  assert.match(renderer, /drawMachineCoreAssembly/);
  assert.match(renderer, /assembly\.components/);
  assert.match(renderer, /machineWorldCoreAssembly/);
  assert.match(renderer, /machineWorldCoreValidation/);
});

test('canonical renderer does not self-reference the world topology during planning', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const initializerMatch = renderer.match(
    /machineWorldTopology\s*=\s*buildMachineWorldTopology\(\{([\s\S]*?)\n\s{6}\}\);/,
  );
  assert.ok(initializerMatch, 'canonical renderer must construct world topology from an explicit planning input object');
  const initializer = initializerMatch[1];
  assert.match(initializer, /\bscene,?/);
  assert.match(initializer, /facilityAssemblies,/);
  assert.match(initializer, /facilityMachinery,/);
  assert.match(initializer, /seatDivisionAmount:/);
  assert.match(initializer, /clearance: 0\.16/);
  assert.doesNotMatch(initializer, /\bmachineWorldTopology\s*,/);
  assert.match(renderer, /machineWorldSpatialCache\?\.key === spatialGeometryKey/);
  assert.match(renderer, /machineWorldTopologyValidation = validateMachineWorldTopology\(/);
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
  assert.match(renderBody, /renderAdjacentDivisionWiring\(\s*scene,\s*effectiveCameraId,\s*\{ \.\.\.state, focusedChildAmount \},\s*reducedMotion,\s*\)/s);
  assert.match(renderBody, /focusedChildAmount/);
  assert.match(renderBody, /const rawSeat1ConnectionAmount = clamp\([\s\S]*branchAmounts\.connectionBranchAmount \?\? state\.connectionBranchAmount[\s\S]*const seat1ConnectionAmount = state\.focusedChildId === 'SEAT_CONNECTION'/);
  assert.match(renderBody, /renderSeat1ConnectionChild\(scene, seat1ConnectionAmount, effectiveCameraId, reducedMotion, now\)/);
  assert.match(renderBody, /drawFocusedSeatDivision/);
  assert.match(renderer, /SEAT_DIVISION_ORDER/);
  assert.match(renderer, /resolveSeatDivisionPayload/);
  assert.match(renderBody, /renderSemanticEdgeTrace/);
  assert.match(renderBody, /focusedDivision\?\.edge/);
  assert.match(renderBody, /state\.focusedChildId/);
  assert.match(renderer, /state\.seatDivisionBranchAmounts/);
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

test('canonical world renderer uses the S5 stateful expansion mechanism for expansion and interruption', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.doesNotMatch(renderer, /import \{ createMachineAnimation \}/);
  assert.match(renderer, /createMachineExpansionMechanism\(\{ duration: 950 \}\)/);
  assert.match(renderer, /expansionMechanism\.sample/);
  assert.match(renderer, /expansionMechanism\.setTarget/);
  assert.match(renderer, /reducedMotion/);
  assert.match(renderer, /wantedExpanded/);
  assert.match(renderer, /if \(wantedExpanded !== targetExpanded\)/);
});

test('canonical world renderer keeps branch identity separate from semantic camera identity', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /effectiveCameraId/);
  assert.match(renderer, /navigationCameraId/);
  assert.match(renderer, /fitWorldCamera/);
  assert.match(renderer, /deriveMachineSubject/);
  assert.match(renderer, /machineWorldCameraId/);
  assert.match(renderer, /machineWorldCameraMode/);
  assert.doesNotMatch(renderer, /resolveBranchCamera/);
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


/**
 * VALIDATION CHANGE WARNING
 * Protected old invariant: choreography consumed state.connectionBranchAmount directly.
 * Authorized new rule: the canonical renderer consumes hierarchy-owned seatDivisionBranchAmounts first,
 * keeps the individual branch field as a compatibility fallback, and now receives Hero lifecycle state.
 * Replacement invariant: choreography input ownership is centralized in the hierarchy branch-state contract,
 * while lifecycle/contribution remains an explicit renderer input for R0 receiving behavior.
 * Implementation impact: update the source-shape contract to the current semantic owner instead of weakening it.
 * Validation impact: assert both canonical branch-state precedence and Hero lifecycle inputs.
 * Evidence/browser impact: this validates the interrupted lifecycle→choreography seam without claiming browser proof.
 * Residual uncertainty: exact-head runtime/browser execution still depends on downstream CI and deployed-page evidence.
 */
test('canonical renderer memoizes heavy S6-S8 world planning by authored geometry state', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /const SPATIAL_TOPOLOGY_RESOLUTION = 24/);
  assert.match(renderer, /let machineWorldSpatialCache = null/);
  assert.match(renderer, /const spatialGeometryKey = \[/);
  assert.match(renderer, /machineWorldSpatialCache\?\.key === spatialGeometryKey/);
  assert.match(renderer, /buildMachineWorldTopology\(/);
  assert.match(renderer, /machineWorldSpatialCache = Object\.freeze/);
});

test('machine choreography is state-derived and lifecycle-connected in the canonical renderer', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /deriveMachineTransformationChoreography\(/);
  assert.match(renderer, /const branchAmounts = state\.seatDivisionBranchAmounts \|\| \{\};/);
  assert.match(renderer, /import \{ drawFocusedSeatDivision, deriveFocusedSeatDivisionGeometry \}/);
  assert.match(renderer, /createMachineExpansionMechanism\(\{ duration: 950 \}\)/);
  assert.match(renderer, /renderAdjacentDivisionWiring\(/);
  assert.match(renderer, /resolveMachineFocusedExpansionPhase/);
  assert.match(renderer, /const seat1ConnectionAmount = state\.focusedChildId === 'SEAT_CONNECTION'/);
  assert.match(renderer, /const rawFocusedChildAmount = finite\(state\.focusedChildAmount, 0\);/);
  assert.match(renderer, /const focusedChildAmount = focusedExpansionPlan/);
  const focusedDeclaration = renderer.indexOf('const focusedChildAmount = focusedExpansionPlan');
  const choreographyCall = renderer.indexOf('const choreography = deriveMachineTransformationChoreography(');
  assert.ok(
    focusedDeclaration >= 0 && choreographyCall >= 0 && focusedDeclaration < choreographyCall,
    'focusedChildAmount must be resolved before choreography consumes it',
  );

  assert.match(renderer, /shellAmount: finite\(state\.hierarchyOpenAmount, expansionSample\.amount\)/);
  assert.match(renderer, /divisionAmount: focusedChildAmount/);
  assert.match(
    renderer,
    /const connectionAmount = finite\(\s*branchAmounts\.connectionBranchAmount \?\? state\.connectionBranchAmount,\s*0,\s*\)/s,
  );
  assert.match(renderer, /\n\s*connectionAmount,\n/);
  assert.match(renderer, /heroState: state\.heroState/);
  assert.match(renderer, /contributionAmount: finite\(state\.contributionAmount, 0\)/);
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


test('workspace profile is frame-scoped and reused for the R0 receiving core', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  assert.match(renderer, /const workspaceProfile = worldProfile\(seatCount\);/);
  assert.match(renderer, /workspaceRadius: workspaceProfile\.workspace/);
  assert.match(renderer, /expansionAmount: choreography\.transformation/);
});

test('canonical renderer computes topology-edge count before publishing it', async () => {
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const declaration = renderer.indexOf('const renderedWorldTopologyEdges = renderMachineWorldTopologyEdges(');
  const publication = renderer.indexOf('canvas.dataset.machineWorldTopologyRenderedEdges = String(renderedWorldTopologyEdges);');
  assert.ok(declaration >= 0);
  assert.ok(publication >= 0);
  assert.ok(declaration < publication);
});

test('machine-core preview reports boot errors truthfully', () => {
  const catchStart = page.indexOf('} catch (error) {');
  const throwIndex = page.indexOf('throw error;', catchStart);
  assert.ok(catchStart >= 0 && throwIndex > catchStart);
  const catchBlock = page.slice(catchStart, throwIndex);
  assert.match(catchBlock, /root\.dataset\.coreBoot = 'error'/);
  assert.doesNotMatch(catchBlock, /root\.dataset\.coreBoot = 'ready'/);
});
