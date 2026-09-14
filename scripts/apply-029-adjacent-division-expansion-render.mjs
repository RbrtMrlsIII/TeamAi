#!/usr/bin/env node
/**
 * 029 adjacent-division expansion renderer integration.
 * Presentation/runtime wiring only. Consumes the bounded expansion contract
 * during the real interactive division-focus transition.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const expansionSource = join(root, 'frontend/spatial/seat-adjacent-division-expansion.js');
const expansionBrowser = join(root, 'public/seat-adjacent-division-expansion.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(expansionSource, expansionBrowser);

if (!text.includes("from './seat-adjacent-division-expansion.js';")) {
  const branchAnchor = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
  if (!text.includes(branchAnchor)) throw new Error('hero module import anchor missing');
  text = text.replace(branchAnchor, `${branchAnchor}\nimport { advanceAdjacentDivisionExpansion } from './seat-adjacent-division-expansion.js';`);
}

const expansionGuard = "if (hierarchyRuntime.selectedSeatIndex === 0 && hierarchyRuntime.phase === 'division_closing' && hierarchyRuntime.divisionClosingChildId === HIERARCHY_PART.SEAT_CONNECTION && hierarchyRuntime.divisionPendingChildId === HIERARCHY_PART.SEAT_BEHAVIOR) { const expansion = advanceAdjacentDivisionExpansion({ sourceAmount: hierarchyRuntime.connectionBranchAmount || 1, targetAmount: 0 }, now - (hierarchyRuntime.divisionCloseStartMs || now), 240); hierarchyRuntime.connectionBranchAmount = expansion.sourceAmount; hierarchyRuntime.behaviorBranchAmount = 0; }";
if (!text.includes(expansionGuard)) {
  const framePattern = /tickTaskEvidenceBranch\(hierarchyRuntime,now,reducedMotion\);(?:(?:tick[A-Za-z]+\([^;]+\);)*)syncHierarchyFromGlobals\(\);/;
  if (!framePattern.test(text)) throw new Error('canonical Hero frame seam missing');
  text = text.replace(framePattern, (frame) => frame.replace('syncHierarchyFromGlobals();', `${expansionGuard}syncHierarchyFromGlobals();`));
}

writeFileSync(heroPath, text);
console.log('Adjacent division expansion renderer integration applied');
