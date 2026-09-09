/**
 * Cam-2 emergency loader — patches main hero-flex at runtime for tree camera follow.
 * Full static wire remains via scripts/apply-cam2-tree-follow-flex.mjs (CI + Pages).
 * Presentation only; no 029-released claim.
 */
import { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';

const MAIN_URL = 'https://raw.githubusercontent.com/RbrtMrlsIII/TeamAi/main/public/hero-flex.js';

function patchSource(src) {
  let patched = src;
  if (!patched.includes('hero-cam2-tree-follow')) {
    patched = patched.replace(
      "from './hero-hierarchy-runtime.js';",
      "from './hero-hierarchy-runtime.js';\nimport { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';"
    );
  }
  patched = patched.replace(
    'HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}',
    'HERO_WIDE:{p:[0,d,d],t:[0,.78,0],f:39}'
  );
  if (patched.includes("setCamera('SEAT_CLOSE')")) {
    patched = patched.replace(
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();",
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  syncHierarchyFromGlobals();\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  setCamera(treeCam.cameraId);"
    );
  }
  if (!patched.includes('function followHierarchyTreeCamera')) {
    patched = patched.replace(
      'function returnFromSeatShell(){',
      "function followHierarchyTreeCamera(){\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);\n  return treeCam;\n}\nfunction returnFromSeatShell(){"
    );
  }
  return patched;
}

const src = await fetch(MAIN_URL).then((r) => {
  if (!r.ok) throw new Error('Failed to load main hero-flex');
  return r.text();
});
const patched = patchSource(src);
const blob = new Blob([patched], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
await import(/* @vite-ignore */ url);

export { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG };
