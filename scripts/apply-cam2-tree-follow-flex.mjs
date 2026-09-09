/**
 * Idempotent Cam-2 flex wire: tree camera follow + ~45° HERO_WIDE.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
let t = readFileSync(path, 'utf8');
let changed = false;

if (!t.includes('hero-cam2-tree-follow')) {
  const anchor = "from './hero-hierarchy-runtime.js';";
  const idx = t.indexOf(anchor);
  if (idx >= 0) {
    const end = t.indexOf(';', idx);
    t = t.slice(0, end + 1) + "\nimport { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';" + t.slice(end + 1);
    changed = true;
  }
}
if (t.includes('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}')) {
  t = t.replace('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}', 'HERO_WIDE:{p:[0,d,d],t:[0,.78,0],f:39}');
  changed = true;
}
if (!t.includes('followHierarchyTreeCamera')) {
  const marker = 'function returnFromSeatShell(){';
  if (t.includes(marker)) {
    t = t.replace(marker, `function followHierarchyTreeCamera(){
  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });
  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);
  return treeCam;
}
` + marker);
    changed = true;
  }
}
if (t.includes("openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');")) {
  t = t.replace(
    "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();",
    `openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });
  syncHierarchyFromGlobals();
  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });
  setCamera(treeCam.cameraId);`
  );
  changed = true;
}
if (changed) writeFileSync(path, t);
console.log(changed ? 'Cam-2 flex applied' : 'Cam-2 flex already applied');
