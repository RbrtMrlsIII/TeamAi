/**
 * Idempotent Cam-2+3+4 + depth + plate-scale + DOM soft-hide flex wire.
 * Prefer public/_flex_src parts; else pre-loader SHA; then patch.
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
      t = t.slice(0, end + 1) + "\nimport { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG } from './hero-cam2-tree-follow.js';" + t.slice(end + 1);
      changed = true;
    }
  }
  if (t.includes('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}')) {
    t = t.replace('HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39}', 'HERO_WIDE:{p:[0,d,d],t:[0,.78,0],f:39}');
    changed = true;
  }
  if (!t.includes('function followHierarchyTreeCamera')) {
    const marker = 'function returnFromSeatShell(){';
    if (t.includes(marker)) {
      t = t.replace(marker, `function followHierarchyTreeCamera(){\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  if (treeCam.cameraId && treeCam.cameraId !== cameraId) setCamera(treeCam.cameraId);\n  return treeCam;\n}\n` + marker);
      changed = true;
    }
  }
  if (t.includes("openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');")) {
    t = t.replace("openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  setCamera('SEAT_CLOSE');\n  syncHierarchyFromGlobals();", `openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });\n  syncHierarchyFromGlobals();\n  const treeCam = resolveTreeCamera(hierarchyRuntime, { ring: ringFocus.ring, setupFill: getSetupRingFillAmount(hierarchyRuntime) });\n  setCamera(treeCam.cameraId);`);
    changed = true;
  }
  if (t.includes('function updateLabels') && t.includes('followHierarchyTreeCamera') && !t.includes('if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera()')) {
    const m = t.match(/function updateLabels\s*\([^)]*\)\s*\{/);
    if (m) {
      const insert = t.indexOf(m[0]) + m[0].length;
      t = t.slice(0, insert) + '\n  if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera();' + t.slice(insert);
      changed = true;
    }
  }
  if (!t.includes("from './hero-cam3-tree-center-zoom.js'") && t.includes("from './hero-cam2-tree-follow.js';")) {
    t = t.replace("from './hero-cam2-tree-follow.js';", "from './hero-cam2-tree-follow.js';\nimport { poseAboutTreeCenter, shouldApplyTreeNav, baseDockForTree } from './hero-cam3-tree-center-zoom.js';");
    changed = true;
  }
  const oldNav = `function applyNavCamera() {\n  if (hierarchyRuntime.openParentId) return;\n  if (hierarchyRuntime.inputMode && hierarchyRuntime.inputMode !== HIERARCHY_INPUT.NAVIGATE) return;\n  const base = cameras().HERO_WIDE;\n  const dist = base.p[2] * navZoom;\n  const cy = base.p[1] + navOrbitPitch * 1.2;\n  const yaw = navOrbitYaw;\n  camera = { p: [Math.sin(yaw) * dist * 0.85, cy, Math.cos(yaw) * dist], t: base.t.slice(), f: base.f };\n  camAt = 1;\n}`;
  const newNav = `function applyNavCamera() {\n  if (!shouldApplyTreeNav(hierarchyRuntime)) return;\n  const table = cameras();\n  const base = hierarchyRuntime.openParentId ? baseDockForTree({ cameraId }, table) : (table.HERO_WIDE || table.SEAT_CLOSE);\n  camera = poseAboutTreeCenter(base, { navZoom, navOrbitYaw, navOrbitPitch });\n  camAt = 1;\n}`;
  if (t.includes(oldNav)) { t = t.replace(oldNav, newNav); changed = true; }
  if (t.includes('if (hierarchyRuntime.openParentId) return;\n  const delta = Math.sign(event.deltaY)')) {
    t = t.replace('if (hierarchyRuntime.openParentId) return;\n  const delta = Math.sign(event.deltaY)', 'const delta = Math.sign(event.deltaY)');
    changed = true;
  }
  if (t.includes("if (!touchState || touchState.id !== event.pointerId) return;\n  if (hierarchyRuntime.openParentId) return;")) {
    t = t.replace("if (!touchState || touchState.id !== event.pointerId) return;\n  if (hierarchyRuntime.openParentId) return;", "if (!touchState || touchState.id !== event.pointerId) return;");
    changed = true;
  }
  if (!t.includes("from './hero-cam4-edge-swipe.js'") && t.includes("from './hero-cam3-tree-center-zoom.js';")) {
    t = t.replace("from './hero-cam3-tree-center-zoom.js';", "from './hero-cam3-tree-center-zoom.js';\nimport { edgePressure, edgeDriftDelta, inverseSwipeDelta, clampPitch, pointerNorm } from './hero-cam4-edge-swipe.js';");
    changed = true;
  }
  if (!t.includes('edgePointerNorm') && t.includes('let navOrbitYaw = 0, navOrbitPitch = 0, navZoom = 1;')) {
    t = t.replace('let navOrbitYaw = 0, navOrbitPitch = 0, navZoom = 1;', 'let navOrbitYaw = 0, navOrbitPitch = 0, navZoom = 1;\nlet edgePointerNorm = null; // Cam-4');
    changed = true;
  }
  if (t.includes('navOrbitYaw += dx * Math.PI;') && !t.includes('inverseSwipeDelta(dx')) {
    t = t.replace(`  const dx = (event.clientX - touchState.x) / Math.max(1, canvas.clientWidth);\n  const dy = (event.clientY - touchState.y) / Math.max(1, canvas.clientHeight);\n  touchState.x = event.clientX; touchState.y = event.clientY;\n  navOrbitYaw += dx * Math.PI;\n  navOrbitPitch = clamp(navOrbitPitch + dy * 1.2, -0.45, 0.55);`, `  const rect = canvas.getBoundingClientRect();\n  edgePointerNorm = pointerNorm(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);\n  const dx = (event.clientX - touchState.x) / Math.max(1, canvas.clientWidth);\n  const dy = (event.clientY - touchState.y) / Math.max(1, canvas.clientHeight);\n  touchState.x = event.clientX; touchState.y = event.clientY;\n  const inv = inverseSwipeDelta(dx, dy);\n  navOrbitYaw += inv.dYaw;\n  navOrbitPitch = clampPitch(navOrbitPitch + inv.dPitch);`);
    changed = true;
  }
  if (!t.includes('edgeDriftDelta(press') && t.includes('function frame')) {
    const m = t.match(/function frame\s*\([^)]*\)\s*\{/);
    if (m) {
      const insert = t.indexOf(m[0]) + m[0].length;
      t = t.slice(0, insert) + `\n  if (edgePointerNorm && !reducedMotion && typeof shouldApplyTreeNav === 'function' && shouldApplyTreeNav(hierarchyRuntime)) {\n    const press = edgePressure(edgePointerNorm.nx, edgePointerNorm.ny);\n    if (press.px || press.py) {\n      const dt = Math.min(0.05, Math.max(0, ((typeof frame._last === 'number' ? now - frame._last : 16) / 1000)));\n      frame._last = now;\n      const drift = edgeDriftDelta(press, dt, { reducedMotion });\n      navOrbitYaw += drift.dYaw;\n      navOrbitPitch = clampPitch(navOrbitPitch + drift.dPitch);\n      applyNavCamera();\n    } else { frame._last = now; }\n  } else if (typeof now === 'number') { frame._last = now; }\n` + t.slice(insert);
      changed = true;
    }
  }
  if (!t.includes("from './hero-depth-readable-faces.js'") && t.includes("from './hero-cam4-edge-swipe.js';")) {
    t = t.replace("from './hero-cam4-edge-swipe.js';", "from './hero-cam4-edge-swipe.js';\nimport { depthReadableFovBoost, depthReadableFaceScale, facePlateScaleForChild } from './hero-depth-readable-faces.js';");
    changed = true;
  }
  if (t.includes("from './hero-depth-readable-faces.js'") && !t.includes('facePlateScaleForChild } from')) {
    t = t.replace("depthReadableFovBoost, depthReadableFaceScale } from './hero-depth-readable-faces.js';", "depthReadableFovBoost, depthReadableFaceScale, facePlateScaleForChild } from './hero-depth-readable-faces.js';");
    changed = true;
  }
  if (t.includes('return setupRingFovBoost(getSetupRingFillAmount(hierarchyRuntime), boost);') && !t.includes('depthReadableFovBoost(hierarchyRuntime, setupRingFovBoost')) {
    t = t.replace('return setupRingFovBoost(getSetupRingFillAmount(hierarchyRuntime), boost);', 'return depthReadableFovBoost(hierarchyRuntime, setupRingFovBoost(getSetupRingFillAmount(hierarchyRuntime), boost));');
    changed = true;
  }
  if (t.includes('const s = loc.scale * scale * (0.55 + 0.45 * amt);') && !t.includes('facePlateScaleForChild(hierarchyRuntime, childId)')) {
    t = t.replace('const s = loc.scale * scale * (0.55 + 0.45 * amt);', 'const s = loc.scale * scale * (0.55 + 0.45 * amt) * facePlateScaleForChild(hierarchyRuntime, childId);');
    changed = true;
  }
  if (!t.includes("from './hero-dom-chrome-absorption.js'") && t.includes("from './hero-depth-readable-faces.js';")) {
    t = t.replace("from './hero-depth-readable-faces.js';", "from './hero-depth-readable-faces.js';\nimport { applyMachineUiChrome } from './hero-dom-chrome-absorption.js';");
    changed = true;
  }
  if (t.includes('if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera();') && !t.includes('applyMachineUiChrome(shell')) {
    t = t.replace('if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera();', `if (hierarchyRuntime && hierarchyRuntime.openParentId) followHierarchyTreeCamera();\n  applyMachineUiChrome(shell, { hierarchyOpen: Boolean(hierarchyRuntime.openParentId) });`);
    changed = true;
  }
  return { t, changed };
}

async function loadBase() {
  const partsDir = join(root, 'public', '_flex_src');
  if (existsSync(join(partsDir, 'part00.txt')) || existsSync(join(partsDir, 'part00.b64'))) {
    let assembled = '';
    for (let i = 0; i < 32; i++) {
      const id = String(i).padStart(2, '0');
      const pTxt = join(partsDir, `part${id}.txt`);
      const pB64 = join(partsDir, `part${id}.b64`);
      if (existsSync(pTxt)) assembled += readFileSync(pTxt, 'utf8');
      else if (existsSync(pB64)) assembled += Buffer.from(readFileSync(pB64, 'utf8'), 'base64').toString('utf8');
      else break;
    }
    if (assembled.includes('function cameras()')) {
      console.log('Cam flex: assembled from public/_flex_src parts');
      return assembled;
    }
  }
  let t = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const isEmergency = t.includes('emergency loader') || t.includes('MAIN_URL') || t.length < 5000 || !t.includes('function cameras()');
  if (isEmergency) {
    const res = await fetch(MAIN_RAW);
    if (!res.ok) throw new Error(`Failed to fetch hero-flex base: ${res.status}`);
    t = await res.text();
    console.log('Cam flex: restored base from pre-loader SHA');
  }
  return t;
}

const t = await loadBase();
const { t: next, changed } = applyPatches(t);
writeFileSync(path, next);
console.log(changed ? 'Cam-2/3/4 flex applied' : 'Cam-2/3/4 flex already applied');
