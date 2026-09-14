#!/usr/bin/env node
/**
 * 029 adjacent-division expansion renderer integration.
 * Presentation/runtime wiring only. Consumes the bounded expansion contract
 * during the real interactive division-focus transition.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const expansionSource = join(root, 'frontend/spatial/seat-adjacent-division-expansion.js');
const expansionBrowser = join(root, 'public/seat-adjacent-division-expansion.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(expansionSource, expansionBrowser);
copyFileSync(wiringSource, wiringBrowser);

if (!text.includes("from './seat-adjacent-division-expansion.js';")) {
  const branchAnchor = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
  if (!text.includes(branchAnchor)) throw new Error('hero module import anchor missing');
  text = text.replace(branchAnchor, `${branchAnchor}\nimport { advanceAdjacentDivisionExpansion } from './seat-adjacent-division-expansion.js';`);
}

if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  const expansionImport = "import { advanceAdjacentDivisionExpansion } from './seat-adjacent-division-expansion.js';";
  if (!text.includes(expansionImport)) throw new Error('adjacent expansion import anchor missing');
  text = text.replace(expansionImport, `${expansionImport}\nimport { buildAdjacentDivisionWiring, buildAdjacentDivisionWiringFrame } from './seat-adjacent-division-wiring.js';`);
}

const expansionGuard = "if (hierarchyRuntime.selectedSeatIndex === 0 && hierarchyRuntime.phase === 'division_closing' && hierarchyRuntime.divisionClosingChildId === HIERARCHY_PART.SEAT_CONNECTION && hierarchyRuntime.divisionPendingChildId === HIERARCHY_PART.SEAT_BEHAVIOR) { const expansion = advanceAdjacentDivisionExpansion({ sourceAmount: hierarchyRuntime.connectionBranchAmount || 1, targetAmount: 0 }, now - (hierarchyRuntime.divisionCloseStartMs || now), 240); hierarchyRuntime.connectionBranchAmount = expansion.sourceAmount; hierarchyRuntime.behaviorBranchAmount = 0; }";
if (!text.includes(expansionGuard)) {
  const framePattern = /tickTaskEvidenceBranch\(hierarchyRuntime,now,reducedMotion\);(?:(?:tick[A-Za-z]+\([^;]+\);)*)syncHierarchyFromGlobals\(\);/;
  if (!framePattern.test(text)) throw new Error('canonical Hero frame seam missing');
  text = text.replace(framePattern, (frame) => frame.replace('syncHierarchyFromGlobals();', `${expansionGuard}syncHierarchyFromGlobals();`));
}

if (!text.includes('function drawSeat1AdjacentDivisionWiring(')) {
  const anchor = 'function drawHealthLeaf(';
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');
  const fn = `function drawSeat1AdjacentDivisionWiring(ctx) {\n  const { draw, CUBE, T, S, RY, M, sourceCenter, targetCenter, seatAngle, seatRadius, sourceAmount, targetAmount, phase } = ctx;\n  if (!sourceCenter || !targetCenter) return;\n  const sourceGeometry = {\n    id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION',\n    angle: seatAngle,\n    center: { ...sourceCenter },\n    port: { ...sourceCenter },\n    dimensions: { width: 0.55, depth: 0.38, height: 0.08 },\n  };\n  const targetGeometry = {\n    id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR',\n    angle: seatAngle,\n    center: { ...targetCenter },\n    port: { ...targetCenter },\n    dimensions: { width: 0.55, depth: 0.38, height: 0.08 },\n  };\n  const wiring = buildAdjacentDivisionWiring({ sourceGeometry, targetGeometry, amount: 1 });\n  const frame = buildAdjacentDivisionWiringFrame({ wiring, sourceAmount, targetAmount, phase });\n  if (!frame || frame.progress <= 0) return;\n  const dx = frame.to.x - frame.from.x;\n  const dy = frame.to.y - frame.from.y;\n  const dz = frame.to.z - frame.from.z;\n  const yaw = Math.atan2(dz, dx);\n  const length = Math.max(0.02, Math.hypot(dx, dz) * frame.progress);\n  const midX = frame.from.x + dx * frame.progress * 0.5;\n  const midY = frame.from.y + dy * frame.progress * 0.5;\n  const midZ = frame.from.z + dz * frame.progress * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(length * 0.5, frame.radius, frame.radius)), M.energy, { rough: 0.3, emit: 0, alpha: 0.2 + 0.28 * frame.progress });\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const loopAnchor = '  for (let ci = 0; ci < SEAT_SHELL_V1_CHILDREN.length; ci++) {';
if (!text.includes(loopAnchor)) throw new Error('Seat branch loop anchor missing');
if (!text.includes(`${loopAnchor}\n    let __seat1ConnectionCenter = null;`)) {
  text = text.replace(loopAnchor, `${loopAnchor}\n    let __seat1ConnectionCenter = null;`);
}

const centerAnchor = '    const cy = shellY + 0.55 * scale + loc.y * scale;';
if (!text.includes(centerAnchor)) throw new Error('Seat branch center anchor missing');
if (!text.includes(`${centerAnchor}\n    if (index === 0)`)) {
  text = text.replace(centerAnchor, `${centerAnchor}\n    if (ci === 0) __seat1ConnectionCenter = { x: cx, y: cy, z: cz };`);
}

const branchAnchor = '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);';
if (!text.includes(branchAnchor)) throw new Error('connection branch draw anchor missing');
if (!text.includes('if (ci === 1 && hierarchyRuntime.selectedSeatIndex === 0) drawSeat1AdjacentDivisionWiring')) {
  const insertion = `${branchAnchor}\n      if (ci === 1 && hierarchyRuntime.selectedSeatIndex === 0) { const phase = hierarchyRuntime.phase === 'division_closing' ? 'CLOSING_SOURCE' : (hierarchyRuntime.behaviorBranchAmount || 0) > 0 ? ((hierarchyRuntime.behaviorBranchAmount || 0) >= 1 ? 'ACTIVE' : 'OPENING_ADJACENT') : 'REST'; drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, sourceCenter: __seat1ConnectionCenter, targetCenter: { x: cx, y: cy, z: cz }, seatAngle: seat.a, seatRadius: profile(seatCount).seatRadius * 0.22, sourceAmount: hierarchyRuntime.connectionBranchAmount || 0, targetAmount: hierarchyRuntime.behaviorBranchAmount || 0, phase }); }`;
  text = text.replace(branchAnchor, insertion);
}

writeFileSync(heroPath, text);
console.log('Adjacent division expansion renderer integration applied');
