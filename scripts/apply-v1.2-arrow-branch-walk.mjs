/**
 * V1.2 — Arrow Left/Right → cycleSeatShellBranchFocus (Vision #214).
 * Run after apply-cam2-tree-follow-flex.mjs (idempotent).
 * presentation only · no 029-released claim.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
if (!existsSync(path)) {
  console.log('V1.2: no hero-flex.js — skip');
  process.exit(0);
}
let t = readFileSync(path, 'utf8');
let changed = false;

if (!t.includes('cycleSeatShellBranchFocus') && t.includes("from './hero-hierarchy-runtime.js';")) {
  t = t.replace(
    "from './hero-hierarchy-runtime.js';",
    "from './hero-hierarchy-runtime.js';\nimport { cycleSeatShellBranchFocus } from './hero-seat-branch-walk.js';",
  );
  changed = true;
}

const oldArrow =
  "if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){const list=SEAT_SHELL_V1_CHILDREN;const cur=Math.max(0,list.indexOf(hierarchyRuntime.focusedChildId));const next=event.key==='ArrowRight'?(cur+1)%list.length:(cur-1+list.length)%list.length;focusHierarchyChild(hierarchyRuntime,list[next],{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion});event.preventDefault()}";
const newArrow =
  "if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){/* V1.2 branch walk */cycleSeatShellBranchFocus(hierarchyRuntime,event.key==='ArrowRight'?1:-1,{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion});syncHierarchyFromGlobals();updateLabels();event.preventDefault()}";
if (t.includes(oldArrow)) {
  t = t.replace(oldArrow, newArrow);
  changed = true;
}

writeFileSync(path, t);
console.log(changed ? 'V1.2 arrow branch walk applied' : 'V1.2 arrow branch walk already applied');
