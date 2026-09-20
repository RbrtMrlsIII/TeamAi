#!/usr/bin/env node
/**
 * 031 Seat-1 adjacent-division wiring renderer integration.
 * Consumes the semantic source/target port contract in the canonical Hero renderer.
 * Presentation only. No provider, authorization, scheduler, or durable-domain authority.
 *
 * Current bounded truth:
 * - source division may reveal a short wiring lead while it is opening;
 * - when focus moves, source compacts fully before target expands;
 * - after source reaches zero, target expansion may reveal the same semantic path;
 * - final electrical choreography is explicitly outside this slice.
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

const importAnchors = [
  "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';",
  "import { drawSetupConfigRing as drawSetupConfigRingModule } from './hero-r2-setup-ring.js';",
];
if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  const importAnchor = importAnchors.find((anchor) => text.includes(anchor));
  if (!importAnchor) throw new Error('Hero module import anchor missing');
  text = text.replace(
    importAnchor,
    importAnchor + "\nimport { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from './seat-adjacent-division-wiring.js';",
  );
}

if (!text.includes('function drawSeat1AdjacentDivisionWiring(')) {
  const anchor = 'function drawHealthLeaf('; 
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');

  const fn = `function drawSeat1AdjacentDivisionWiring(ctx) {\n  const { draw, CUBE, T, S, RY, M } = ctx;\n  if (hierarchyRuntime.selectedSeatIndex !== 0) return;\n\n  const sourceAmount = Math.max(0, Math.min(1, Number(hierarchyRuntime.connectionBranchAmount) || 0));\n  const targetAmount = Math.max(0, Math.min(1, Number(hierarchyRuntime.behaviorBranchAmount) || 0));\n  const activeAmount = targetAmount > 0 ? targetAmount : sourceAmount;\n  if (activeAmount <= 0) {\n    hierarchyRuntime.seat1AdjacentWiring = null;\n    return;\n  }\n\n  const seat = ctx.seat;\n  const scale = ctx.scale;\n  const shellY = ctx.shellY;\n  const seatAngle = ctx.seatAngle ?? seat?.a ?? 0;\n  const radialDistance = Math.hypot(ctx.cx, ctx.cz);\n  const seatCenter = seatPos(seat);\n\n  const sourceGeometry = buildSeatDivisionGeometry({\n    center: { x: ctx.cx, y: ctx.cy, z: ctx.cz },\n    angle: seatAngle,\n    radialDistance,\n    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },\n    workspaceTarget: { x: 0, y: 0.5, z: 0 },\n    id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',\n  });\n\n  const behaviorLoc = childLocalPosition(seatAngle, profile(seatCount).seatRadius * 0.22, 1, targetAmount);\n  const behaviorCx = seatCenter[0] + Math.cos(seatAngle) * 0.17 * scale + Math.cos(seatAngle + Math.PI / 2) * -1.5 * 0.12 * scale;\n  const behaviorCz = seatCenter[2] + Math.sin(seatAngle) * 0.17 * scale + Math.sin(seatAngle + Math.PI / 2) * -1.5 * 0.12 * scale;\n  const behaviorCy = shellY + 0.55 * scale + behaviorLoc.y * scale;\n  const targetGeometry = buildSeatDivisionGeometry({\n    center: { x: behaviorCx, y: behaviorCy, z: behaviorCz },\n    angle: seatAngle + Math.PI,\n    radialDistance,\n    payload: { labels: ['Behavior'], controls: ['configure'] },\n    workspaceTarget: { x: 0, y: 0.5, z: 0 },\n    id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',\n  });\n\n  const wiring = buildAdjacentDivisionWiring({\n    sourceGeometry,\n    targetGeometry,\n    amount: sourceAmount || 0,\n  });\n  const sourcePoint = wiring.from.projected;\n  const targetPoint = wiring.to.port;\n  const dx = targetPoint.x - sourcePoint.x;\n  const dy = targetPoint.y - sourcePoint.y;\n  const dz = targetPoint.z - sourcePoint.z;\n  const yaw = Math.atan2(dz, dx);\n  const fullLength = Math.max(0.02, Math.hypot(dx, dz));\n  const length = fullLength * activeAmount;\n  const midX = sourcePoint.x + dx * activeAmount * 0.5;\n  const midY = sourcePoint.y + dy * activeAmount * 0.5;\n  const midZ = sourcePoint.z + dz * activeAmount * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(Math.max(0.01, length * 0.5), wiring.corridor.radius, wiring.corridor.radius)), M.energy, { rough: 0.26, emit: 0.08 * activeAmount, alpha: 0.18 + 0.42 * activeAmount });\n\n  const point = adjacentDivisionWiringPoint(wiring, activeAmount);\n  draw(CUBE, T(point.x, point.y, point.z), M.energy, { rough: 0.22, emit: 0.12 * activeAmount, alpha: 0.42 * activeAmount });\n\n  hierarchyRuntime.seat1AdjacentWiring = {\n    id: wiring.id,\n    from: wiring.from.divisionId,\n    to: wiring.to.divisionId,\n    sourcePort: { ...wiring.from.port },\n    targetPort: { ...wiring.to.port },\n    amount: activeAmount,\n    phase: targetAmount > 0 ? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE',\n    presentationOnly: true,\n  };\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const callAnchors = [
  '      drawHealthLeaf(seat, index, shellY, scale, healthCenter?.x ?? cx, healthCenter?.y ?? cy, healthCenter?.z ?? cz);',
  '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);',
];
const callAnchor = callAnchors.find((anchor) => text.includes(anchor));
const alreadyIntegrated = text.includes('drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, cx, cy, cz, seat, shellY, scale, seatAngle: seat.a });');
if (!callAnchor && !alreadyIntegrated) throw new Error('branch render anchor missing');
if (!alreadyIntegrated) {
  text = text.replace(
    callAnchor,
    callAnchor + '\n      if (index === 0) drawSeat1AdjacentDivisionWiring({ draw, CUBE, T, S, RY, M, cx, cy, cz, seat, shellY, scale, seatAngle: seat.a });',
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
