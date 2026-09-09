#!/usr/bin/env node
/**
 * Idempotent P1.1 connection-flex patch for public/hero-flex.js
 * Presentation only · no 029-released claim
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
let text = readFileSync(path, 'utf8');
if (text.trim() === 'PLACEHOLDER' || text.length < 500) {
  console.error('hero-flex.js is placeholder or truncated; restore from main first');
  process.exit(1);
}
if (text.includes('tickConnectionBranch') && text.includes('branchBoost') && text.includes("event.key==='c'||event.key==='C'")) {
  console.log('P1.1 already applied');
  process.exit(0);
}

const oldImport = `  openSeatShellParent as openSeatShellParentState,
  tickHierarchyPose,
  seatAltitudeY,`;
const newImport = `  openSeatShellParent as openSeatShellParentState,
  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  CONNECTION_BRANCH_MS,
  seatAltitudeY,`;
if (!text.includes(oldImport)) { console.error('import anchor missing'); process.exit(1); }
text = text.replace(oldImport, newImport);

const oldFrame = 'tickHierarchyPose(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();';
const newFrame = 'tickHierarchyPose(hierarchyRuntime,now,reducedMotion);tickConnectionBranch(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();';
if (!text.includes(oldFrame)) { console.error('frame anchor missing'); process.exit(1); }
text = text.replace(oldFrame, newFrame);

const oldDraw = `    const focused = hierarchyRuntime.focusedChildId === childId;
    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;
    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;
    const col = isConnection ? M.energy : (isToolkit ? M.glass : (focused ? seat.accent : M.trace));
    const emit = focused || isConnection ? 0.14 * amt : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);
    draw(CUBE, mul(mul(T(cx, cy, cz), RY(seat.a + Math.PI / 2)), S(0.55 * s, 0.08 * s, 0.38 * s)), col, { rough: 0.35, spec: [0.8, 0.82, 0.78], emit, alpha: 0.35 + 0.55 * amt });
    if (isConnection) {
      draw(TORUS, mul(T(cx, cy + 0.06 * s, cz), S(0.22 * s, 1, 0.22 * s)), M.energy, { rough: 0.2, emit: 0.2 * amt, alpha: 0.5 + 0.4 * amt });
      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);
    }`;

const newDraw = `    const focused = hierarchyRuntime.focusedChildId === childId;
    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;
    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;
    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : 0;
    const branchBoost = 1 + 0.28 * branch;
    const col = isConnection ? M.energy : (isToolkit ? M.glass : (focused ? seat.accent : M.trace));
    const emit = focused || isConnection ? 0.14 * amt * (1 + 0.55 * branch) : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);
    const sx = 0.55 * s * (isConnection ? branchBoost : 1);
    const sy = 0.08 * s * (isConnection ? (1 + 0.35 * branch) : 1);
    const sz = 0.38 * s * (isConnection ? branchBoost : 1);
    draw(CUBE, mul(mul(T(cx, cy, cz), RY(seat.a + Math.PI / 2)), S(sx, sy, sz)), col, { rough: 0.35, spec: [0.8, 0.82, 0.78], emit, alpha: 0.35 + 0.55 * amt });
    if (isConnection) {
      const torusScale = 0.22 * s * branchBoost;
      draw(TORUS, mul(T(cx, cy + 0.06 * s * (1 + 0.2 * branch), cz), S(torusScale, 1, torusScale)), M.energy, { rough: 0.2, emit: 0.2 * amt * (1 + 0.7 * branch), alpha: 0.5 + 0.4 * amt });
      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);
    }`;
if (!text.includes(oldDraw)) { console.error('draw anchor missing'); process.exit(1); }
text = text.replace(oldDraw, newDraw);

const oldLabels = "if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedLeafId===HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE){seatText=healthLeafAccessibleName(hierarchyRuntime.healthStatus)}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitChildAccessibleName()}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId){seatText=`${seat.label} · ${hierarchyRuntime.focusedChildId}`}";
const newLabels = "if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedLeafId===HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE){seatText=healthLeafAccessibleName(hierarchyRuntime.healthStatus)}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){seatText=connectionFaceAccessibleName(getConnectionBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitChildAccessibleName()}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId){seatText=`${seat.label} · ${hierarchyRuntime.focusedChildId}`}";
if (!text.includes(oldLabels)) { console.error('labels anchor missing'); process.exit(1); }
text = text.replace(oldLabels, newLabels);

const oldKeys = "if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){const list=SEAT_SHELL_V1_CHILDREN;const cur=Math.max(0,list.indexOf(hierarchyRuntime.focusedChildId));const next=event.key==='ArrowRight'?(cur+1)%list.length:(cur-1+list.length)%list.length;focusHierarchyChild(hierarchyRuntime,list[next]);event.preventDefault()}updateLabels()});";
const newKeys = "if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){const list=SEAT_SHELL_V1_CHILDREN;const cur=Math.max(0,list.indexOf(hierarchyRuntime.focusedChildId));const next=event.key==='ArrowRight'?(cur+1)%list.length:(cur-1+list.length)%list.length;focusHierarchyChild(hierarchyRuntime,list[next],{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion});event.preventDefault()}if((event.key==='c'||event.key==='C')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){requestConnectionConfigureHandoff({targetSection:'connection'});event.preventDefault()}updateLabels()});";
if (!text.includes(oldKeys)) { console.error('keydown anchor missing'); process.exit(1); }
text = text.replace(oldKeys, newKeys);

const oldExport = 'getNavZoom:()=>navZoom,resetNav:()=>{navOrbitYaw=0;navOrbitPitch=0;navZoom=1;applyNavCamera();}};';
const newExport = "getNavZoom:()=>navZoom,resetNav:()=>{navOrbitYaw=0;navOrbitPitch=0;navZoom=1;applyNavCamera();},getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),requestConnectionConfigure:()=>requestConnectionConfigureHandoff({targetSection:'connection'}),CONNECTION_BRANCH_MS,connectionFaceAccessibleName};";
if (!text.includes(oldExport)) { console.error('export anchor missing'); process.exit(1); }
text = text.replace(oldExport, newExport);

writeFileSync(path, text);
console.log('P1.1 applied to public/hero-flex.js');
