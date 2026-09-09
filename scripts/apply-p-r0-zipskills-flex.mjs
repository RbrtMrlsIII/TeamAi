#!/usr/bin/env node
/**
 * Idempotent P-R0 flex wire for WORKSPACE_ZIPSKILLS crown.
 * Presentation only · not entitlement · not a seat child
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const flexPath = path.join(root, 'public/hero-flex.js');
let flex = fs.readFileSync(flexPath, 'utf8');

if (flex.includes("from './hero-p-r0-zipskills.js'") && flex.includes('tickZipskillsBranch(hierarchyRuntime')) {
  console.log('P-R0 flex already applied');
  process.exit(0);
}

if (!flex.includes("from './hero-p-r0-zipskills.js'")) {
  const marker = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
  if (!flex.includes(marker)) {
    console.error('missing r2 import marker');
    process.exit(1);
  }
  flex = flex.replace(
    marker,
    marker + "\nimport {\n  ZIPSKILLS_BRANCH_MS,\n  tickZipskillsBranch,\n  getZipskillsBranchAmount,\n  beginZipskillsBranch,\n  requestZipskillsConfigureHandoff,\n  zipskillsCrownAccessibleName,\n} from './hero-p-r0-zipskills.js';",
  );
}

if (!flex.includes('tickZipskillsBranch(hierarchyRuntime')) {
  const tick = 'tickSetupRingFill(hierarchyRuntime,ringFocus,now,reducedMotion);syncHierarchyFromGlobals();';
  const next = 'tickSetupRingFill(hierarchyRuntime,ringFocus,now,reducedMotion);tickZipskillsBranch(hierarchyRuntime,ringFocus,now,reducedMotion);syncHierarchyFromGlobals();';
  if (!flex.includes(tick)) {
    console.error('missing setup ring tick marker');
    process.exit(1);
  }
  flex = flex.replace(tick, next);
}

if (!flex.includes('function syncZipskillsCamera')) {
  const insertAt = 'function drawBackendDisplayRing(t) {';
  const helper = `function syncZipskillsCamera(){\n  if (hierarchyRuntime.openParentId) return;\n  if (ringFocus.ring !== 'r0') {\n    beginZipskillsBranch(hierarchyRuntime, ringFocus, { nowMs: performance.now(), snap: true });\n    return;\n  }\n  if (cameraId !== 'DETAIL_ANCHOR' && cameraId !== 'WORKSPACE_CLOSE') setCamera('DETAIL_ANCHOR');\n  hierarchyRuntime.cameraId = 'WORKSPACE_ZIPSKILLS';\n  beginZipskillsBranch(hierarchyRuntime, ringFocus, { nowMs: performance.now(), snap: HIERARCHY_REDUCED_SNAP && reducedMotion });\n}\n`;
  if (!flex.includes(insertAt)) {
    console.error('missing drawBackendDisplayRing');
    process.exit(1);
  }
  flex = flex.replace(insertAt, helper + insertAt);
}

if (!flex.includes("key==='g'") && !flex.includes('key===\"g\"')) {
  flex = flex.replace(
    "updateLabels()});",
    "if((event.key==='g'||event.key==='G')&&!hierarchyRuntime.openParentId&&ringFocus.ring==='r0'){const item=WORKSPACE_ZIPSKILLS_V1[ringFocus.index];requestZipskillsConfigureHandoff({item,targetSection:'workspace-zipskills'});event.preventDefault()}updateLabels()});",
    1,
  );
}

if (!flex.includes('syncZipskillsCamera()')) {
  flex = flex.replace(
    "if(event.key==='z'||event.key==='x'){if(!hierarchyRuntime.openParentId){cycleRingFocus(ringFocus,'r0',event.key==='z'?1:-1);event.preventDefault()}}",
    "if(event.key==='z'||event.key==='x'){if(!hierarchyRuntime.openParentId){cycleRingFocus(ringFocus,'r0',event.key==='z'?1:-1);syncZipskillsCamera();event.preventDefault()}}",
  );
}

fs.writeFileSync(flexPath, flex);
console.log('P-R0 flex applied', flexPath);
