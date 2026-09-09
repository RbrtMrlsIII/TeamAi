/**
 * P4.1 SEAT_CAPABILITIES visual flex — presentation-only source contracts
 * CAPABILITY ≠ AUTHORIZATION · no entitlement
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const flex = () => readFileSync(join(root, 'public/hero-flex.js'), 'utf8');

test('hero-flex imports capabilities branch APIs', () => {
  const src = flex();
  assert.match(src, /tickCapabilitiesBranch/);
  assert.match(src, /getCapabilitiesBranchAmount/);
  assert.match(src, /capabilitiesFaceAccessibleName/);
  assert.match(src, /requestCapabilitiesConfigureHandoff/);
  assert.match(src, /CAPABILITIES_BRANCH_MS/);
});

test('hero-flex frame ticks capabilities branch after hierarchy pose', () => {
  const src = flex();
  assert.match(src, /tickCapabilitiesBranch\s*\(\s*hierarchyRuntime/);
  const pose = src.indexOf('tickHierarchyPose');
  const caps = src.indexOf('tickCapabilitiesBranch');
  assert.ok(pose >= 0 && caps > pose);
});

test('hero-flex applies branchBoost for SEAT_CAPABILITIES child', () => {
  const src = flex();
  assert.match(src, /isCapabilities/);
  assert.match(src, /getCapabilitiesBranchAmount\s*\(\s*hierarchyRuntime\s*\)/);
  assert.match(src, /isToolkit \|\| isCapabilities/);
});

test('hero-flex keyboard K requests capabilities configure handoff', () => {
  const src = flex();
  assert.match(src, /key===['"]k['"]/);
  assert.match(src, /requestCapabilitiesConfigureHandoff/);
  assert.match(src, /targetSection:\s*['"]capabilities['"]/);
});

test('hero-flex labels use capabilitiesFaceAccessibleName', () => {
  const src = flex();
  assert.match(src, /capabilitiesFaceAccessibleName\s*\(\s*getCapabilitiesBranchAmount/);
});

test('TeamAiHero exposes capabilities inspection helpers', () => {
  const src = flex();
  assert.match(src, /getCapabilitiesBranchAmount:\s*\(\)\s*=>/);
  assert.match(src, /requestCapabilitiesConfigure:\s*\(\)\s*=>/);
  assert.match(src, /capabilitiesFaceAccessibleName/);
});
