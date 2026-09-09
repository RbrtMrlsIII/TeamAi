#!/usr/bin/env node
/**
 * P1.1 — apply CONNECTION branch wiring to public/hero-flex.js
 * Idempotent. Presentation only.
 */
import fs from "node:fs";
import path from "node:path";

const target = path.join(process.cwd(), "public/hero-flex.js");
let text = fs.readFileSync(target, "utf8");

if (text.includes("tickConnectionBranch(hierarchyRuntime")) {
  console.log("P1.1 connection flex already applied");
  process.exit(0);
}

const oldImp = `  tickHierarchyPose,
  seatAltitudeY,`;
const newImp = `  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  CONNECTION_BRANCH_MS,
  seatAltitudeY,`;
if (!text.includes(oldImp)) throw new Error("import marker missing");
text = text.replace(oldImp, newImp, 1);

const oldFrame =
  "tickHierarchyPose(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();";
const newFrame =
  "tickHierarchyPose(hierarchyRuntime,now,reducedMotion);tickConnectionBranch(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();";
if (!text.includes(oldFrame)) throw new Error("frame marker missing");
text = text.replace(oldFrame, newFrame, 1);

const oldConn = `    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;
    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;
    const col = isConnection ? M.energy : (isToolkit ? M.glass : (focused ? seat.accent : M.trace));
    const emit = focused || isConnection ? 0.14 * amt : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);
    draw(CUBE, mul(mul(T(cx, cy, cz), RY(seat.a + Math.PI / 2)), S(0.55 * s, 0.08 * s, 0.38 * s)), col, { rough: 0.35, spec: [0.8, 0.82, 0.78], emit, alpha: 0.35 + 0.55 * amt });
    if (isConnection) {
      draw(TORUS, mul(T(cx, cy + 0.06 * s, cz), S(0.22 * s, 1, 0.22 * s)), M.energy, { rough: 0.2, emit: 0.2 * amt, alpha: 0.5 + 0.4 * amt });
      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);
    }`;

const newConn = `    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;
    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;
    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : 0;
    const branchBoost = 1 + 0.35 * branch;
    const col = isConnection ? M.energy : (isToolkit ? M.glass : (focused ? seat.accent : M.trace));
    const emit = focused || isConnection ? (0.14 + 0.16 * branch) * amt : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);
    draw(CUBE, mul(mul(T(cx, cy, cz), RY(seat.a + Math.PI / 2)), S(0.55 * s * branchBoost, 0.08 * s * (1 + 0.2 * branch), 0.38 * s * branchBoost)), col, { rough: 0.35, spec: [0.8, 0.82, 0.78], emit, alpha: 0.35 + 0.55 * amt });
    if (isConnection) {
      const ts = 0.22 * s * (1 + 0.45 * branch);
      draw(TORUS, mul(T(cx, cy + 0.06 * s, cz), S(ts, 1, ts)), M.energy, { rough: 0.2, emit: (0.2 + 0.22 * branch) * amt, alpha: 0.5 + 0.4 * amt });
      if (branch > 0.15) {
        draw(TORUS, mul(T(cx, cy + 0.1 * s, cz), S(ts * 1.25, 1, ts * 1.25)), M.energy, { rough: 0.18, emit: 0.12 * branch * amt, alpha: 0.25 + 0.35 * branch });
      }
      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);
    }`;

if (!text.includes(oldConn)) throw new Error("connection draw marker missing");
text = text.replace(oldConn, newConn, 1);

const marker =
  "if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){";
const cHandler =
  "if((event.key==='c'||event.key==='C')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){requestConnectionConfigureHandoff({seatIndex:hierarchyRuntime.selectedSeatIndex});event.preventDefault()}";
if (!text.includes("requestConnectionConfigureHandoff({seatIndex")) {
  if (!text.includes(marker)) throw new Error("keydown marker missing");
  text = text.replace(marker, cHandler + marker, 1);
}

const oldApi =
  "getNavZoom:()=>navZoom,resetNav:()=>{navOrbitYaw=0;navOrbitPitch=0;navZoom=1;applyNavCamera();}};";
const newApi =
  "getNavZoom:()=>navZoom,resetNav:()=>{navOrbitYaw=0;navOrbitPitch=0;navZoom=1;applyNavCamera();},getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),requestConnectionConfigure:()=>requestConnectionConfigureHandoff({seatIndex:hierarchyRuntime.selectedSeatIndex}),CONNECTION_BRANCH_MS,connectionFaceAccessibleName};";
if (text.includes(oldApi)) text = text.replace(oldApi, newApi, 1);

fs.writeFileSync(target, text);
console.log("applied P1.1 connection flex to", target);
