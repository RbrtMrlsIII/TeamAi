#!/usr/bin/env node
/**
 * 031 Seat-1 adjacent-division wiring renderer integration.
 * Consumes the semantic source/target port contract in the canonical Hero renderer.
 * Presentation only. No provider, authorization, scheduler, or durable-domain authority.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');
const geometrySource = join(root, 'frontend/spatial/seat-division-geometry.js');
const geometryBrowser = join(root, 'public/seat-division-geometry.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(wiringSource, wiringBrowser);
copyFileSync(geometrySource, geometryBrowser);

const importAnchor = "import { drawSetupConfigRing } from './hero-r2-setup-ring.js';";
if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  if (!text.includes(importAnchor)) throw new Error('Hero module import anchor missing');
  text = text.replace(
    importAnchor,
    `${importAnchor}\nimport { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from './seat-adjacent-division-wiring.js';\nimport { buildSeatDivisionGeometry } from './seat-division-geometry.js';`,
  );
}

const varsAnchor = '  for (let ci = 0; ci < SEAT_SHELL_V1_CHILDREN.length; ci++) {';
if (!text.includes(varsAnchor)) throw new Error('Seat child loop anchor missing');
if (!text.includes('let adjacentConnectionGeometry = null;')) {
  text = text.replace(
    varsAnchor,
    `  let adjacentConnectionGeometry = null;\n  let adjacentBehaviorGeometry = null;\n${varsAnchor}`,
  );
}

const branchAnchor = `    const branchBoost = 1 + 0.28 * branch;`;
if (!text.includes(branchAnchor)) throw new Error('Seat branch calculation anchor missing');
if (!text.includes('adjacentConnectionGeometry = buildSeatDivisionGeometry')) {
  text = text.replace(
    branchAnchor,
    `${branchAnchor}\n    if (isConnection) adjacentConnectionGeometry = buildSeatDivisionGeometry({ center: { x: cx, y: cy, z: cz }, angle: seat.a, radialDistance: profile(seatCount).seatRadius, payload: { labels: ['Connection', 'Health'], controls: ['configure'], density: reducedMotion ? 'compact' : 'default' }, workspaceTarget: { x: 0, y: 0.5, z: 0 } });\n    if (isBehavior) adjacentBehaviorGeometry = buildSeatDivisionGeometry({ center: { x: cx, y: cy, z: cz }, angle: seat.a, radialDistance: profile(seatCount).seatRadius, payload: { labels: ['Behavior'], controls: ['defaults'], density: reducedMotion ? 'compact' : 'default' }, workspaceTarget: { x: 0, y: 0.5, z: 0 } });`,
  );
}

const loopEndAnchor = `    }\n  }\n}\nfunction drawWorkspaceZipskills`;
if (!text.includes(loopEndAnchor)) throw new Error('Seat child loop end anchor missing');
if (!text.includes('ADJACENT_DIVISION_WIRING')) {
  const wiringBlock = `    }\n  }\n  if (index === 0 && adjacentConnectionGeometry && adjacentBehaviorGeometry) {\n    const sourceAmount = getConnectionBranchAmount(hierarchyRuntime);\n    const targetAmount = getBehaviorBranchAmount(hierarchyRuntime);\n    if (sourceAmount > 0 && targetAmount > 0) {\n      const wiring = buildAdjacentDivisionWiring({ sourceGeometry: adjacentConnectionGeometry, targetGeometry: adjacentBehaviorGeometry, amount: sourceAmount });\n      const sourcePoint = adjacentDivisionWiringPoint(wiring, sourceAmount);\n      const targetPoint = adjacentDivisionWiringPoint(wiring, 1);\n      const factor = Math.min(sourceAmount, targetAmount);\n      const dx = targetPoint.x - sourcePoint.x;\n      const dy = targetPoint.y - sourcePoint.y;\n      const dz = targetPoint.z - sourcePoint.z;\n      const length = Math.max(0.02, Math.hypot(dx, dz) * factor);\n      const yaw = Math.atan2(dz, dx);\n      const midX = sourcePoint.x + dx * factor * 0.5;\n      const midY = sourcePoint.y + dy * factor * 0.5;\n      const midZ = sourcePoint.z + dz * factor * 0.5;\n      draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(length * 0.5, wiring.corridor.radius, wiring.corridor.radius)), M.energy, { rough: 0.26, emit: 0.08 * factor, alpha: 0.18 + 0.52 * factor });\n    }\n  }\n}\nfunction drawWorkspaceZipskills`;
  text = text.replace(loopEndAnchor, wiringBlock);
}

writeFileSync(heroPath, text);
console.log('Seat-1 adjacent-division wiring renderer integration applied');
