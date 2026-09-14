#!/usr/bin/env node
/**
 * 031 Seat-1 adjacent-division wiring renderer integration.
 * The renderer fixture is intentionally Seat-1-specific, while the semantic
 * transition primitive it consumes is reusable across Seats and branch pairs.
 * Presentation only. No provider, authorization, scheduler, or durable-domain authority.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');
const expansionSource = join(root, 'frontend/spatial/seat-adjacent-division-expansion.js');
const expansionBrowser = join(root, 'public/seat-adjacent-division-expansion.js');
const transitionSource = join(root, 'frontend/spatial/seat-adjacent-transition.js');
const transitionBrowser = join(root, 'public/seat-adjacent-transition.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(wiringSource, wiringBrowser);
copyFileSync(expansionSource, expansionBrowser);
copyFileSync(transitionSource, transitionBrowser);

const importAnchor = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
if (!text.includes("from './seat-adjacent-transition.js';")) {
  if (!text.includes(importAnchor)) throw new Error('Hero module import anchor missing');
  text = text.replace(
    importAnchor,
    `${importAnchor}\nimport { buildAdjacentDivisionTransition, buildAdjacentDivisionGeometry } from './seat-adjacent-transition.js';`,
  );
}

if (!text.includes('function drawSeat1AdjacentDivisionWiring(')) {
  const anchor = 'function drawHealthLeaf('; 
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');

  const fn = `function drawSeat1AdjacentDivisionWiring(ctx) {\n  const { draw, CUBE, T, S, RY, M } = ctx;\n  const seatIndex = ctx.seatIndex ?? ctx.index ?? 0;\n  const sourceDivisionId = ctx.sourceDivisionId || 'SEAT_CONNECTION';\n  const targetDivisionId = ctx.targetDivisionId || 'SEAT_BEHAVIOR';\n  const sourceAmount = Math.max(0, Math.min(1, Number(ctx.sourceAmount) || 0));\n  const targetAmount = Math.max(0, Math.min(1, Number(ctx.targetAmount) || 0));\n  const sourceGeometry = ctx.sourceGeometry;\n  const targetGeometry = ctx.targetGeometry;\n  if (!sourceGeometry || !targetGeometry || (sourceAmount <= 0 && targetAmount <= 0)) {\n    hierarchyRuntime.seat1AdjacentWiring = null;\n    return;\n  }\n\n  const transition = buildAdjacentDivisionTransition({\n    seatIndex,\n    sourceDivisionId,\n    targetDivisionId,\n    sourceGeometry,\n    targetGeometry,\n    sourceAmount,\n    targetAmount,\n  });\n  const sourcePoint = transition.wiring.from.projected;\n  const targetPoint = transition.wiring.to.port;\n  const activeAmount = Math.max(sourceAmount, targetAmount);\n  const dx = targetPoint.x - sourcePoint.x;\n  const dy = targetPoint.y - sourcePoint.y;\n  const dz = targetPoint.z - sourcePoint.z;\n  const yaw = Math.atan2(dz, dx);\n  const fullLength = Math.max(0.02, Math.hypot(dx, dz));\n  const length = fullLength * activeAmount;\n  const midX = sourcePoint.x + dx * activeAmount * 0.5;\n  const midY = sourcePoint.y + dy * activeAmount * 0.5;\n  const midZ = sourcePoint.z + dz * activeAmount * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(Math.max(0.01, length * 0.5), transition.wiring.corridor.radius, transition.wiring.corridor.radius)), M.energy, { rough: 0.26, emit: 0.08 * activeAmount, alpha: 0.18 + 0.42 * activeAmount });\n\n  hierarchyRuntime.seat1AdjacentWiring = {\n    id: transition.wiring.id,\n    transitionId: transition.id,\n    seatIndex,\n    from: transition.wiring.from.divisionId,\n    to: transition.wiring.to.divisionId,\n    sourcePort: { ...transition.wiring.from.port },\n    targetPort: { ...transition.wiring.to.port },\n    amount: activeAmount,\n    phase: transition.phase,\n    presentationOnly: true,\n  };\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const callAnchor = '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);';
if (!text.includes(callAnchor)) throw new Error('branch render anchor missing');
if (!text.includes('drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, seat, seatIndex: index, shellY, scale, seatAngle: seat.a')) {
  text = text.replace(
    callAnchor,
    `${callAnchor}\n      if (index === 0) {\n        const sourceAmount = getConnectionBranchAmount(hierarchyRuntime);\n        const targetAmount = getBehaviorBranchAmount(hierarchyRuntime);\n        const seatCenter = seatPos(seat);\n        const behaviorLoc = childLocalPosition(seat.a, profile(seatCount).seatRadius * 0.22, 1, targetAmount);\n        const behaviorCx = seatCenter[0] + Math.cos(seat.a) * 0.17 * scale + Math.cos(seat.a + Math.PI / 2) * -1.5 * 0.12 * scale;\n        const behaviorCz = seatCenter[2] + Math.sin(seat.a) * 0.17 * scale + Math.sin(seat.a + Math.PI / 2) * -1.5 * 0.12 * scale;\n        const behaviorCy = shellY + 0.55 * scale + behaviorLoc.y * scale;\n        const sourceGeometry = buildAdjacentDivisionGeometry({ center: { x: cx, y: cy, z: cz }, angle: seat.a, radialDistance: Math.hypot(cx, cz), payload: { labels: ['Connection', 'Health'], controls: ['configure'] }, workspaceTarget: { x: 0, y: 0.5, z: 0 }, divisionId: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY' });\n        const targetGeometry = buildAdjacentDivisionGeometry({ center: { x: behaviorCx, y: behaviorCy, z: behaviorCz }, angle: seat.a + Math.PI, radialDistance: Math.hypot(cx, cz), payload: { labels: ['Behavior'], controls: ['configure'] }, workspaceTarget: { x: 0, y: 0.5, z: 0 }, divisionId: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY' });\n        drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, seat, seatIndex: index, shellY, scale, seatAngle: seat.a, sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_BEHAVIOR', sourceAmount, targetAmount, sourceGeometry, targetGeometry });\n      }`,
  );
}

const heroApiAnchor = 'getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),';
if (!text.includes(heroApiAnchor)) throw new Error('Hero API anchor missing');
if (!text.includes('getSeat1AdjacentWiring:()=>hierarchyRuntime.seat1AdjacentWiring || null,')) {
  text = text.replace(
    heroApiAnchor,
    heroApiAnchor + '\ngetSeat1AdjacentWiring:()=>hierarchyRuntime.seat1AdjacentWiring || null,',
  );
}

writeFileSync(heroPath, text);
console.log('Seat-1 adjacent division wiring renderer integration applied');
