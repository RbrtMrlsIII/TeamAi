import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Hero frame refreshes presentation labels after hierarchy globals synchronize', () => {
  const source = readFileSync('public/_flex_src/hero-flex.base.js', 'utf8');
  assert.match(
    source,
    /tickDivisionFocusTransition\(hierarchyRuntime, now, reducedMotion\);\n\s*tickSeatDivisionBranches\(hierarchyRuntime, now, reducedMotion\);\n\s*tickSetupRingFill\(hierarchyRuntime, ringFocus, now, reducedMotion\);\n\s*syncHierarchyFromGlobals\(\);\n\s*updateLabels\(\);/
  );
});

test('assembled Hero runtime remains byte-identical to its repository-owned base', () => {
  assert.equal(
    readFileSync('public/_flex_src/hero-flex.base.js', 'utf8'),
    readFileSync('public/hero-flex.js', 'utf8'),
  );
});
