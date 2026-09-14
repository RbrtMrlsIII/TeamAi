#!/usr/bin/env node
/**
 * 031 Seat-1 adjacent wiring renderer.
 * Consumes the governed semantic wiring contract from the canonical Seat render loop.
 * Presentation-only: no provider, authorization, scheduler, or durable-domain authority.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');
let text = readFileSync(path, 'utf8');

copyFileSync(wiringSource, wiringBrowser);

if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  const anchor = "import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';";
  if (!text.includes(anchor)) throw new Error('stable Hero import anchor missing');
  text = text.replace(
    anchor,
    `${anchor}\nimport { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from './seat-adjacent-division-wiring.js';`,
  );
}

if (!text.includes('function drawSeat1AdjacentDivisionWiring(')) {
  const anchor = 'function drawHierarchyChildren(seat, index, t, shellY, scale) {';
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('canonical Seat hierarchy render anchor missing');

  const fn = `function drawSeat1AdjacentDivisionWiring(seat, index, shellY, scale) {\n  if (index !== 0) return;\n  const targetAmount = Math.max(0, Math.min(1, Number(hierarchyRuntime.behaviorBranchAmount) || 0));\n  if (targetAmount <= 0.02) { canvas.dataset.seat1AdjacentWiring = 'closed'; return; }\n\n  const p = seatPos(seat);\n  const radial = profile(seatCount).seatRadius * 0.22;\n  const centerForChild = (ci) => {\n    const loc = childLocalPosition(seat.a, radial, ci, 1);\n    return {\n      x: p[0] + Math.cos(seat.a) * (0.15 + ci * 0.02) * scale + Math.cos(seat.a + Math.PI / 2) * (ci - 2.5) * 0.12 * scale,\n      y: shellY + 0.55 * scale + loc.y * scale,\n      z: p[2] + Math.sin(seat.a) * (0.15 + ci * 0.02) * scale + Math.sin(seat.a + Math.PI / 2) * (ci - 2.5) * 0.12 * scale,\n    };\n  };\n\n  const sourceCenter = centerForChild(0);\n  const targetCenter = centerForChild(1);\n  const sourceGeometry = buildSeatDivisionGeometry({\n    center: sourceCenter,\n    angle: seat.a,\n    radialDistance: radial,\n    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },\n    workspaceTarget: targetCenter,\n  });\n  const targetGeometry = buildSeatDivisionGeometry({\n    center: targetCenter,\n    angle: seat.a,\n    radialDistance: radial,\n    payload: { labels: ['Behavior'], controls: ['configure'] },\n    workspaceTarget: sourceCenter,\n  });\n  const wiring = buildAdjacentDivisionWiring({ sourceGeometry, targetGeometry, amount: 1 });\n  const endpoint = adjacentDivisionWiringPoint(wiring, targetAmount);\n  const start = wiring.from.projected;\n  const dx = endpoint.x - start.x;\n  const dz = endpoint.z - start.z;\n  const length = Math.max(0.02, Math.hypot(dx, dz));\n  const yaw = Math.atan2(dz, dx);\n  const mid = T(start.x + dx * 0.5, start.y + (endpoint.y - start.y) * 0.5, start.z + dz * 0.5);\n  draw(CUBE, mul(mul(mid, RY(yaw)), S(length * 0.5, wiring.corridor.radius, wiring.corridor.radius)), M.energy, {\n    rough: 0.2,\n    emit: 0.12 + 0.24 * targetAmount,\n    alpha: 0.28 + 0.52 * targetAmount,\n  });\n  canvas.dataset.seat1AdjacentWiring = targetAmount >= 0.85 ? 'active' : 'opening';\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const closeAnchor = '  }\n}\nfunction point(start, c1, c2, end, q) {';
if (!text.includes(closeAnchor)) throw new Error('canonical Seat hierarchy closing anchor missing');
if (!text.includes('drawSeat1AdjacentDivisionWiring(seat, index, shellY, scale);')) {
  text = text.replace(
    closeAnchor,
    '  }\n  drawSeat1AdjacentDivisionWiring(seat, index, shellY, scale);\n}\nfunction point(start, c1, c2, end, q) {',
  );
}

writeFileSync(path, text);
console.log('Seat-1 adjacent semantic wiring renderer applied');
