#!/usr/bin/env node
/**
 * 031 Seat-1 adjacent-division wiring renderer integration.
 * Presentation/runtime wiring only. Consumes the semantic adjacency contract
 * from the canonical Seat branch placement path.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(wiringSource, wiringBrowser);

if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  const anchor = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
  if (!text.includes(anchor)) throw new Error('Hero module import anchor missing');
  text = text.replace(
    anchor,
    `${anchor}\nimport { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from './seat-adjacent-division-wiring.js';`,
  );
}

if (!text.includes('function drawSeat1AdjacentDivisionWiring(')) {
  const anchor = 'function drawHealthLeaf(';
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');

  const fn = `function drawSeat1AdjacentDivisionWiring(ctx) {\n  const { draw, CUBE, T, S, RY, M, seat, seatCount, shellY, scale } = ctx;\n  if (!seat || hierarchyRuntime.selectedSeatIndex !== 0) return;\n  const sourceAmount = Math.max(0, Math.min(1, Number(hierarchyRuntime.connectionBranchAmount) || 0));\n  const targetAmount = Math.max(0, Math.min(1, Number(hierarchyRuntime.behaviorBranchAmount) || 0));\n  if (sourceAmount <= 0 || targetAmount <= 0) return;\n\n  const branchCenter = (index, amount) => {\n    const loc = childLocalPosition(seat.a, profile(seatCount).seatRadius * 0.22, index, amount);\n    return {\n      x: seatPos(seat)[0] + Math.cos(seat.a) * (0.15 + index * 0.02) * scale + Math.cos(seat.a + Math.PI / 2) * (index - 2.5) * 0.12 * scale,\n      y: shellY + 0.55 * scale + loc.y * scale,\n      z: seatPos(seat)[2] + Math.sin(seat.a) * (0.15 + index * 0.02) * scale + Math.sin(seat.a + Math.PI / 2) * (index - 2.5) * 0.12 * scale,\n    };\n  };\n\n  const sourceCenter = branchCenter(0, sourceAmount);\n  const targetCenter = branchCenter(1, targetAmount);\n  const sourceGeometry = {\n    id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION',\n    port: { ...sourceCenter },\n    corridor: { start: { ...sourceCenter }, end: { ...targetCenter } },\n  };\n  const targetGeometry = {\n    id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR',\n    port: { ...targetCenter },\n  };\n  const wiring = buildAdjacentDivisionWiring({ sourceGeometry, targetGeometry, amount: sourceAmount });\n  const activation = Math.min(sourceAmount, targetAmount);\n  const point = adjacentDivisionWiringPoint(wiring, activation);\n  const from = wiring.from.projected;\n  const to = wiring.to.port;\n  const dx = to.x - from.x;\n  const dz = to.z - from.z;\n  const yaw = Math.atan2(dz, dx);\n  const fullLength = Math.max(0.02, Math.hypot(dx, dz));\n  const length = fullLength * activation;\n  const midX = from.x + dx * activation * 0.5;\n  const midY = from.y + (to.y - from.y) * activation * 0.5;\n  const midZ = from.z + dz * activation * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(Math.max(0.01, length * 0.5), wiring.corridor.radius, wiring.corridor.radius)), M.energy, { rough: 0.28, emit: 0.12 * activation, alpha: 0.2 + 0.5 * activation });\n  draw(CUBE, T(point.x, point.y, point.z), M.energy, { rough: 0.22, emit: 0.16 * activation, alpha: 0.45 * activation });\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const callAnchor = "      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);";
if (!text.includes(callAnchor)) throw new Error('branch render anchor missing');

const call = "      if (index === 0 && hierarchyRuntime.behaviorBranchAmount > 0 && hierarchyRuntime.connectionBranchAmount > 0) drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, seat, seatCount, shellY, scale });";
if (!text.includes(call)) {
  text = text.replace(callAnchor, `${callAnchor}\n${call}`);
}

writeFileSync(heroPath, text);
console.log('Seat-1 adjacent division wiring renderer integration applied');
