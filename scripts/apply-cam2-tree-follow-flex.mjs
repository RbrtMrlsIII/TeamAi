/**
 * Idempotent Cam-2 flex wire: tree camera follow + ~45° HERO_WIDE.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');

function applyPatches(t) {
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
      t = t.replace(marker, `function followHierarchyTreeCamera(){\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);\n  return treeCam;\n}\n` + marker);
      changed = true;
    }
  }
  if (t.includes("openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');")) {
    t = t.replace(
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();",
      `openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  syncHierarchyFromGlobals();\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  setCamera(treeCam.cameraId);`
    );
    changed = true;
  }
  return { t, changed };
}

let t = existsSync(path) ? readFileSync(path, 'utf8') : '';
const isEmergency = t.includes('emergency loader') || t.includes('MAIN_URL') || t.length < 5000;
const isMainShape = t.includes('function cameras()') && t.includes('openSeatShellParentState');

if (isEmergency || !isMainShape) {
  console.log('Cam-2 flex: non-main shape (emergency loader or short file); module tests still valid');
} else {
  const { t: next, changed } = applyPatches(t);
  if (changed) writeFileSync(path, next);
  console.log(changed ? 'Cam-2 flex applied' : 'Cam-2 flex already applied');
}
