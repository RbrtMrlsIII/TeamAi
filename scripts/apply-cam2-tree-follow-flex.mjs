/**
 * Idempotent Cam-2 + Cam-3 flex wire.
 * If emergency loader / short file, restore from pre-loader SHA then patch.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
const MAIN_RAW = 'https://raw.githubusercontent.com/RbrtMrlsIII/TeamAi/a2f8a3e162ff2a19acc496bff07dd6b6d7ffcdec/public/hero-flex.js';

function applyPatches(t) {
  let changed = false;
  if (!t.includes("from './hero-cam2-tree-follow.js'")) {
    const anchor = "from './hero-hierarchy-runtime.js';";
    const idx = t.indexOf(anchor);
    if (idx >= 0) {
      const end = t.indexOf(';', idx);
      t =
        t.slice(0, end + 1) +
        "\nimport { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';" +
        t.slice(end + 1);
      changed = true;
    }
  }
  if (t.includes('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}')) {
    t = t.replace(
      'HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}',
      'HERO_WIDE:{p:[0,d,d],t:[0,.78,0],f:39}'
    );
    changed = true;
  }
  if (!t.includes('function followHierarchyTreeCamera')) {
    const marker = 'function returnFromSeatShell(){';
    if (t.includes(marker)) {
      t = t.replace(
        marker,
        `function followHierarchyTreeCamera(){\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);\n  return treeCam;\n}\n` + marker
      );
      changed = true;
    }
  }
  if (
    t.includes(
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');"
    )
  ) {
    t = t.replace(
      "openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();",
      `openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  syncHierarchyFromGlobals();\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  setCamera(treeCam.cameraId);`
    );
    changed = true;
  }
  if (
    t.includes('function updateLabels') &&
    t.includes('followHierarchyTreeCamera') &&
    !t.includes('if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera()')
  ) {
    const m = t.match(/function updateLabels\s*\([^)]*\)\s*\{/);
    if (m) {
      const insert = t.indexOf(m[0]) + m[0].length;
      t =
        t.slice(0, insert) +
        '\n  if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera();' +
        t.slice(insert);
      changed = true;
    }
  }
  // Cam-3: tree-center free zoom while parent open
  if (!t.includes("from './hero-cam3-tree-center-zoom.js'")) {
    if (t.includes("from './hero-cam2-tree-follow.js';")) {
      t = t.replace(
        "from './hero-cam2-tree-follow.js';",
        "from './hero-cam2-tree-follow.js';\nimport { poseAboutTreeCenter, shouldApplyTreeNav, baseDockForTree } from './hero-cam3-tree-center-zoom.js';"
      );
      changed = true;
    }
  }
  const oldNav = `function applyNavCamera() {\n  if (hierarchyRuntime.openParentId) return;\n  if (hierarchyRuntime.inputMode && hierarchyRuntime.inputMode !== HIERARCHY_INPUT.NAVIGATE) return;\n  const base = cameras().HERO_WIDE;\n  const dist = base.p[2] * navZoom;\n  const cy = base.p[1] + navOrbitPitch * 1.2;\n  const yaw = navOrbitYaw;\n  camera = { p: [Math.sin(yaw) * dist * 0.85, cy, Math.cos(yaw) * dist], t: base.t.slice(), f: base.f };\n  camAt = 1;\n}`;
  const newNav = `function applyNavCamera() {\n  // Cam-3: free zoom/orbit about current tree center even when parent open\n  if (!shouldApplyTreeNav(hierarchyRuntime)) return;\n  const table = cameras();\n  const base = hierarchyRuntime.openParentId\n    ? baseDockForTree({ cameraId }, table)\n    : (table.HERO_WIDE || table.SEAT_CLOSE);\n  camera = poseAboutTreeCenter(base, { navZoom, navOrbitYaw, navOrbitPitch });\n  camAt = 1;\n}`;
  if (t.includes(oldNav)) {
    t = t.replace(oldNav, newNav);
    changed = true;
  }
  if (t.includes('if (hierarchyRuntime.openParentId) return;\n  const delta = Math.sign(event.deltaY)')) {
    t = t.replace(
      'if (hierarchyRuntime.openParentId) return;\n  const delta = Math.sign(event.deltaY)',
      'const delta = Math.sign(event.deltaY)'
    );
    changed = true;
  }
  if (t.includes("if (!touchState || touchState.id !== event.pointerId) return;\n  if (hierarchyRuntime.openParentId) return;")) {
    t = t.replace(
      "if (!touchState || touchState.id !== event.pointerId) return;\n  if (hierarchyRuntime.openParentId) return;",
      "if (!touchState || touchState.id !== event.pointerId) return;"
    );
    changed = true;
  }
  return { t, changed };
}

async function loadBase() {
  let t = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const isEmergency =
    t.includes('emergency loader') ||
    t.includes('MAIN_URL') ||
    t.length < 5000 ||
    !t.includes('function cameras()');
  if (isEmergency) {
    const res = await fetch(MAIN_RAW);
    if (!res.ok) throw new Error(`Failed to fetch hero-flex base: ${res.status}`);
    t = await res.text();
    console.log('Cam-2/3 flex: restored base from pre-loader SHA');
  }
  return t;
}

const t = await loadBase();
const { t: next, changed } = applyPatches(t);
writeFileSync(path, next);
console.log(changed ? 'Cam-2/3 flex applied' : 'Cam-2/3 flex already applied');
