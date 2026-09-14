#!/usr/bin/env node
/**
 * 031 Seat-1 connection edge + adjacent wiring continuity.
 * Uses stable semantic edge/wiring modules plus payload-driven division geometry.
 * Presentation only. No domain/provider writes and no final electrical effect.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
const edgeSource = join(root, 'frontend/spatial/seat-connection-edge.js');
const edgeBrowser = join(root, 'public/seat-connection-edge.js');
const geometrySource = join(root, 'frontend/spatial/seat-division-geometry.js');
const geometryBrowser = join(root, 'public/seat-division-geometry.js');
const wiringSource = join(root, 'frontend/spatial/seat-adjacent-division-wiring.js');
const wiringBrowser = join(root, 'public/seat-adjacent-division-wiring.js');
let text = readFileSync(path, 'utf8');

if (!text.includes("from './hero-cam5-selected-tree-center.js';")) {
  throw new Error('hero import anchor missing');
}

// Mirror semantic presentation modules into public/ so the same Hero source
// works at both /TeamAi/hero-flex.js and the compatibility /TeamAi/hero/ route.
copyFileSync(edgeSource, edgeBrowser);
copyFileSync(geometrySource, geometryBrowser);
copyFileSync(wiringSource, wiringBrowser);

if (!text.includes("from './seat-connection-edge.js';")) {
  text = text.replace(
    "import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';",
    "import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';\nimport { seat1ConnectionEdge, connectionEdgePoint } from './seat-connection-edge.js';\nimport { buildSeatDivisionGeometry, connectionCorridorPoint } from './seat-division-geometry.js';\nimport { buildAdjacentDivisionWiring } from './seat-adjacent-division-wiring.js';",
  );
} else if (!text.includes("from './seat-adjacent-division-wiring.js';")) {
  text = text.replace(
    "import { buildSeatDivisionGeometry, connectionCorridorPoint } from './seat-division-geometry.js';",
    "import { buildSeatDivisionGeometry, connectionCorridorPoint } from './seat-division-geometry.js';\nimport { buildAdjacentDivisionWiring } from './seat-adjacent-division-wiring.js';",
  );
}

if (!text.includes('function drawSeat1ConnectionEdge(')) {
  const anchor = 'function drawHealthLeaf(';
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');
  const fn = `function drawSeat1ConnectionEdge(ctx) {\n  const { draw, CUBE, T, S, RY, M } = ctx;\n  const branch = getConnectionBranchAmount(hierarchyRuntime);\n  if (hierarchyRuntime.selectedSeatIndex !== 0 || hierarchyRuntime.focusedChildId !== HIERARCHY_PART.SEAT_CONNECTION || branch <= 0) return;\n  const payload = {\n    labels: ['Connection', 'Health'],\n    controls: ['configure'],\n    density: hierarchyRuntime.motionMode === 'reduced' ? 'compact' : 'default',\n  };\n  const geometry = buildSeatDivisionGeometry({\n    center: { x: ctx.cx, y: ctx.cy, z: ctx.cz },\n    angle: ctx.seatAngle ?? 0,\n    radialDistance: Math.hypot(ctx.cx, ctx.cz),\n    payload,\n    workspaceTarget: { x: 0, y: 0.5, z: 0 },\n  });\n  const edge = seat1ConnectionEdge(geometry.port, geometry.corridor.end);\n  const signal = connectionCorridorPoint(geometry, branch);\n  const start = geometry.corridor.start;\n  const end = geometry.corridor.end;\n  const dx = end.x - start.x;\n  const dz = end.z - start.z;\n  const yaw = Math.atan2(dz, dx);\n  const t = Math.max(0, Math.min(1, branch));\n  const length = Math.max(0.02, geometry.corridor.length * t);\n  const midX = start.x + (end.x - start.x) * t * 0.5;\n  const midY = start.y + (end.y - start.y) * t * 0.5;\n  const midZ = start.z + (end.z - start.z) * t * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(length * 0.5, geometry.corridor.radius, geometry.corridor.radius)), M.energy, { rough: 0.3, emit: 0.07 * branch, alpha: 0.28 + 0.42 * branch });\n  draw(CUBE, T(signal.x, signal.y, signal.z), M.energy, { rough: 0.2, emit: 0.18 * branch, alpha: 0.7 * branch });\n  void edge;\n}\n\nfunction drawSeat1AdjacentWiring(ctx) {\n  const { draw, CUBE, T, S, RY, M } = ctx;\n  const connectionAmount = getConnectionBranchAmount(hierarchyRuntime);\n  const behaviorAmount = getBehaviorBranchAmount(hierarchyRuntime);\n  const activeAmount = behaviorAmount > 0 ? behaviorAmount : connectionAmount;\n  if (hierarchyRuntime.selectedSeatIndex !== 0 || activeAmount <= 0) return;\n\n  const seat = ctx.seat;\n  const scale = ctx.scale;\n  const shellY = ctx.shellY;\n  const seatAngle = ctx.seatAngle ?? seat?.a ?? 0;\n  const radialDistance = Math.hypot(ctx.cx, ctx.cz);\n  const seatCenter = seatPos(seat);\n  const sourceGeometry = buildSeatDivisionGeometry({\n    center: { x: ctx.cx, y: ctx.cy, z: ctx.cz },\n    angle: seatAngle,\n    radialDistance,\n    payload: { labels: ['Connection', 'Health'], controls: ['configure'] },\n    workspaceTarget: { x: 0, y: 0.5, z: 0 },\n  });\n\n  const behaviorLoc = childLocalPosition(seatAngle, profile(seatCount).seatRadius * 0.22, 1, behaviorAmount || 0);\n  const behaviorCx = seatCenter[0] + Math.cos(seatAngle) * 0.17 * scale + Math.cos(seatAngle + Math.PI / 2) * -1.5 * 0.12 * scale;\n  const behaviorCz = seatCenter[2] + Math.sin(seatAngle) * 0.17 * scale + Math.sin(seatAngle + Math.PI / 2) * -1.5 * 0.12 * scale;\n  const behaviorCy = shellY + 0.55 * scale + behaviorLoc.y * scale;\n  const targetGeometry = buildSeatDivisionGeometry({\n    center: { x: behaviorCx, y: behaviorCy, z: behaviorCz },\n    angle: seatAngle + Math.PI,\n    radialDistance,\n    payload: { labels: ['Behavior'], controls: ['configure'] },\n    workspaceTarget: { x: 0, y: 0.5, z: 0 },\n    id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',\n  });\n  const wiring = buildAdjacentDivisionWiring({ sourceGeometry, targetGeometry, amount: 1 });\n  const start = wiring.from.port;\n  const end = wiring.to.port;\n  const t = Math.max(0, Math.min(1, activeAmount));\n  const dx = end.x - start.x;\n  const dz = end.z - start.z;\n  const yaw = Math.atan2(dz, dx);\n  const length = Math.max(0.02, wiring.corridor.length * Math.max(0.25, t));\n  const midX = start.x + (end.x - start.x) * t * 0.5;\n  const midY = start.y + (end.y - start.y) * t * 0.5;\n  const midZ = start.z + (end.z - start.z) * t * 0.5;\n  draw(CUBE, mul(mul(T(midX, midY, midZ), RY(yaw)), S(length * 0.5, wiring.corridor.radius, wiring.corridor.radius)), M.energy, { rough: 0.28, emit: 0.04 * t, alpha: 0.18 + 0.28 * t });\n  hierarchyRuntime.seat1AdjacentWiring = {\n    id: wiring.id,\n    from: wiring.from.divisionId,\n    to: wiring.to.divisionId,\n    sourcePort: { ...wiring.from.port },\n    targetPort: { ...wiring.to.port },\n    amount: t,\n    phase: behaviorAmount > 0 ? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE',\n    presentationOnly: true,\n  };\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const callAnchor = '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);\n    }';
if (!text.includes(callAnchor)) throw new Error('connection draw call anchor missing');
if (!text.includes('drawSeat1ConnectionEdge({ draw, CUBE, T, S, RY, M, cx, cy, cz, seatAngle: seat.a });')) {
  text = text.replace(
    callAnchor,
    '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);\n      if (index === 0) {\n        drawSeat1ConnectionEdge({ draw, CUBE, T, S, RY, M, cx, cy, cz, seatAngle: seat.a });\n        drawSeat1AdjacentWiring({ draw, CUBE, T, S, RY, M, cx, cy, cz, seat, shellY, scale, seatAngle: seat.a });\n      }\n    }',
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

writeFileSync(path, text);
console.log('Seat-1 connection edge and adjacent wiring continuity applied');
