import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createMachineGraph } from '../public/machine-hero-graph.js';
import { MACHINE_HERO_RUNTIME_CASE_IDS, resolveMachineRuntimeCase } from '../public/machine-hero-payload.js';

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

test('WebGL projector resolves its shared semantic payload and graph dependencies', () => {
  assert.match(source, /\.\/machine-hero-graph\.js/);
  assert.match(source, /\.\/machine-hero-payload\.js/);
  assert.match(graph, /\.\/machine-hero-scene\.js/);
  assert.match(payload, /createMachineTransitionFromPayload/);
  assert.match(graph, /createMachineGraph/);
});

test('shared runtime payload cases cover multiple semantic densities and remain topologically valid', () => {
  assert.deepEqual(MACHINE_HERO_RUNTIME_CASE_IDS, ['balanced', 'dense', 'sparse']);
  const observedWidths = [];
  for (const caseId of MACHINE_HERO_RUNTIME_CASE_IDS) {
    const runtimeCase = resolveMachineRuntimeCase(caseId);
    const runtimeGraph = createMachineGraph(runtimeCase);
    assert.ok(runtimeGraph.topology.valid, `${caseId}: ${runtimeGraph.topology.reasons.join(',')}`);
    assert.equal(runtimeGraph.transitions.length, runtimeCase.edges.length);
    for (const transition of runtimeGraph.transitions) {
      assert.equal(transition.wiring.route[0].x, transition.sourcePort.x);
      assert.equal(transition.wiring.route.at(-1).x, transition.targetPort.x);
      assert.ok(transition.topology.valid, `${caseId}:${transition.sourceDivisionId}->${transition.targetDivisionId}`);
    }
    const totalWidth = runtimeCase.divisions.reduce((sum, division) => sum + division.labels.length + division.controls + division.density, 0);
    observedWidths.push(totalWidth);
    assert.ok(runtimeGraph.subject);
    assert.ok(runtimeGraph.subject.max.x > runtimeGraph.subject.min.x);
  }
  assert.ok(new Set(observedWidths).size > 1, 'runtime cases must carry different payload loads');
});

test('WebGL projector renders semantic parts and wiring routes from the selected runtime case', () => {
  assert.match(source, /MACHINE_HERO_RUNTIME_CASE_IDS/);
  assert.match(source, /resolveMachineRuntimeCase/);
  assert.match(source, /graph\.transitions/);
  assert.match(source, /transition\.wiring\.route/);
  assert.match(source, /graph\.renderedParts/);
  assert.match(source, /gl\.LINE_STRIP/);
});

test('WebGL preview exposes semantic case switching and real expansion state transition', () => {
  assert.match(source, /data-machine-webgl-case/);
  assert.match(source, /caseIndex=\(caseIndex\+1\)%MACHINE_HERO_RUNTIME_CASE_IDS\.length/);
  assert.match(source, /data-machine-webgl-expand/);
  assert.match(source, /expanded=!expanded/);
  assert.match(source, /sourceAmount:1,targetAmount:1/);
});

test('WebGL projector keeps named camera identity separate from semantic subject', () => {
  assert.match(source, /resolveMachineCamera/);
  assert.match(source, /cameraId:'SEAT_CLOSE'/);
  assert.match(source, /graph\.subject/);
});

test('magnificent renderer is downstream of the shared 15-module machine core', () => {
  assert.match(magnificent, /\.\/machine-core-layout-runtime\.js/);
  assert.match(magnificent, /\.\/machine-core-animation\.js/);
  assert.match(magnificent, /createBranchConnectionCore/);
  assert.match(magnificent, /resolveBranchCamera/);
  assert.match(magnificent, /createMachineAnimation/);
  assert.match(magnificent, /scene\.parts/);
  assert.match(magnificent, /scene\.connections/);
  assert.match(magnificent, /requestAnimationFrame/);
  assert.match(magnificent, /createGradientRing/);
  assert.match(magnificentPage, /data-machine-magnificent/);
  assert.match(magnificentPage, /prototype · not production/);
});

test('WebGL preview has no provider, auth, or durable-state authority', () => {
  assert.doesNotMatch(source, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
  assert.doesNotMatch(magnificent, /firebase|supabase|paypal|oauth|authorization/i);
  assert.doesNotMatch(magnificent, /fetch\(|XMLHttpRequest|localStorage|indexedDB/);
});
