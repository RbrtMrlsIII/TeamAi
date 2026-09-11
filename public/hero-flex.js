/**
 * Hero flex loader — Cam-2…Cam-6 + prior wires applied at runtime to the
 * repository-owned base source. Full static assembly: node scripts/apply-cam2-tree-follow-flex.mjs
 * Presentation only · no 029-released claim.
 */
import { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';
import { resolveSelectedSeatDock, isSeatShellOpen } from './hero-cam5-selected-tree-center.js';

const MAIN_URL = './_flex_src/hero-flex.base.js';

function patchSource(src) {
  let t = src;

  if (!t.includes("from './hero-cam2-tree-follow.js'")) {
    t = t.replace(
      "from './hero-hierarchy-runtime.js';",
      "from './hero-hierarchy-runtime.js';\nimport { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';\nimport { poseAboutTreeCenter, baseDockForTree, shouldApplyTreeNav } from './hero-cam3-tree-center-zoom.js';\nimport { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';",
    );
  } else if (!t.includes("from './hero-cam5-selected-tree-center.js'")) {
    t = t.replace(
      "from './hero-cam2-tree-follow.js';",
      "from './hero-cam2-tree-follow.js';\nimport { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';",
    );
  }

  if (t.includes('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}')) {
    t = t.replace(
      'HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}',
      'HERO_WIDE:{p:[0,d,d],t:[0,.78,0],f:39}',
    );
  }

  if (t.includes("openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');")) {
    t = t.replace(
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();",
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  syncHierarchyFromGlobals();\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  setCamera(treeCam.cameraId);",
    );
  }

  if (!t.includes('function followHierarchyTreeCamera')) {
    t = t.replace(
      'function returnFromSeatShell(){',
      "function followHierarchyTreeCamera(){\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);\n  return treeCam;\n}\nfunction returnFromSeatShell(){",
    );
  }

  if (t.includes("function setCamera(id){const next=cameras()[id]||cameras().HERO_WIDE;cameraId=id;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=id;}}")) {
    t = t.replace(
      "function setCamera(id){const next=cameras()[id]||cameras().HERO_WIDE;cameraId=id;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=id;}}",
      "function setCamera(id){let next=cameras()[id]||cameras().HERO_WIDE;const seatOpen=typeof hierarchyRuntime!=='undefined'&&hierarchyRuntime.openParentId&&String(hierarchyRuntime.openParentId).includes('SEAT_SHELL');const seatDock=typeof resolveSelectedSeatDock==='function'?resolveSelectedSeatDock(id,typeof selectedSeat==='number'?selectedSeat:0,seatCount,profile(seatCount),seatOpen?{force:true}:{}):null;if(seatDock)next=seatDock;cameraId=id;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=id;}}",
    );
  }

  const oldNav = `function applyNavCamera() {\n  if (hierarchyRuntime.openParentId) return;\n  if (hierarchyRuntime.inputMode && hierarchyRuntime.inputMode !== HIERARCHY_INPUT.NAVIGATE) return;\n  const base = cameras().HERO_WIDE;\n  const dist = base.p[2] * navZoom;\n  const cy = base.p[1] + navOrbitPitch * 1.2;\n  const yaw = navOrbitYaw;\n  camera = { p: [Math.sin(yaw) * dist * 0.85, cy, Math.cos(yaw) * dist], t: base.t.slice(), f: base.f };\n  camAt = 1;\n}`;
  const newNav = `function applyNavCamera() {\n  if (!shouldApplyTreeNav(hierarchyRuntime)) return;\n  const table = cameras();\n  let base = hierarchyRuntime.openParentId ? baseDockForTree({ cameraId }, table) : (table.HERO_WIDE || table.SEAT_CLOSE);\n  if (hierarchyRuntime.openParentId && typeof resolveSelectedSeatDock === 'function') {\n    const seatDock = resolveSelectedSeatDock(cameraId || 'SEAT_CLOSE', typeof selectedSeat === 'number' ? selectedSeat : 0, seatCount, profile(seatCount), { force: true });\n    if (seatDock) base = seatDock;\n  }\n  camera = poseAboutTreeCenter(base, { navZoom, navOrbitYaw, navOrbitPitch });\n  camAt = 1;\n}`;
  if (t.includes(oldNav)) t = t.replace(oldNav, newNav);

  t = t.replace(
    "canvas.addEventListener('wheel', (event) => {\n  event.preventDefault();\n  if (hierarchyRuntime.openParentId) return;",
    "canvas.addEventListener('wheel', (event) => {\n  event.preventDefault();\n  if (!shouldApplyTreeNav(hierarchyRuntime)) return;",
  );

  if (t.includes('HERO_LOW_ORBIT:{p:[d*.74,d*.23,d*.78],t:[0,.78,0],f:40},')) {
    t = t.replace('HERO_LOW_ORBIT:{p:[d*.74,d*.23,d*.78],t:[0,.78,0],f:40},', '');
  }
  if (t.includes('TURN_FOLLOW:{p:[4.6,2.05,5.15],t:[0,.72,0],f:35},')) {
    t = t.replace('TURN_FOLLOW:{p:[4.6,2.05,5.15],t:[0,.72,0],f:35},', '');
  }
  if (t.includes("setCamera('TURN_FOLLOW')")) {
    t = t.replaceAll("setCamera('TURN_FOLLOW')", "setCamera('HERO_WIDE')");
  }
  if (t.includes('setCamera("TURN_FOLLOW")')) {
    t = t.replaceAll('setCamera("TURN_FOLLOW")', 'setCamera("HERO_WIDE")');
  }
  if (t.includes("setCamera('HERO_LOW_ORBIT')")) {
    t = t.replaceAll("setCamera('HERO_LOW_ORBIT')", "setCamera('HERO_WIDE')");
  }

  return t;
}

const src = await fetch(MAIN_URL).then((r) => {
  if (!r.ok) throw new Error('Failed to load repository-owned hero-flex base');
  return r.text();
});
const patched = patchSource(src);
const blob = new Blob([patched], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
await import(/* @vite-ignore */ url);

export { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG, resolveSelectedSeatDock };
