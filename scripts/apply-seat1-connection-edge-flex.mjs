#!/usr/bin/env node
/**
 * 029 Seat-1 connection edge presentation wire.
 * Uses the stable semantic edge module and existing renderer primitives.
 * Presentation only. No domain/provider writes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
let text = readFileSync(path, 'utf8');

if (!text.includes("from './hero-cam5-selected-tree-center.js';")) {
  throw new Error('hero import anchor missing');
}
if (!text.includes("from './seat-connection-edge.js';")) {
  text = text.replace(
    "import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';",
    "import { resolveSelectedSeatDock } from './hero-cam5-selected-tree-center.js';\nimport { seat1ConnectionEdge, connectionEdgePoint, SEAT1_CONNECTION_EDGE_ID } from './seat-connection-edge.js';",
  );
}

if (!text.includes('function drawSeat1ConnectionEdge(')) {
  const anchor = 'function drawHealthLeaf(';
  const at = text.indexOf(anchor);
  if (at < 0) throw new Error('health leaf anchor missing');
  const fn = `function drawSeat1ConnectionEdge(ctx) {\n  const { draw, CUBE, T, S, RY, M } = ctx;\n  const branch = getConnectionBranchAmount(hierarchyRuntime);\n  if (hierarchyRuntime.selectedSeatIndex !== 0 || hierarchyRuntime.focusedChildId !== HIERARCHY_PART.SEAT_CONNECTION || branch <= 0) return;\n  const edge = seat1ConnectionEdge({ x: ctx.cx, y: ctx.cy, z: ctx.cz });\n  const signal = connectionEdgePoint(edge, Math.max(0, Math.min(1, branch)));\n  const start = edge.source;\n  const end = edge.target;\n  const dx = end.x - start.x;\n  const dz = end.z - start.z;\n  const length = Math.max(0.02, Math.hypot(dx, dz));\n  const midX = start.x + dx * 0.5;\n  const midZ = start.z + dz * 0.5;\n  const yaw = Math.atan2(dz, dx);\n  draw(CUBE, mul(mul(T(midX, start.y, midZ), RY(yaw)), S(length * 0.5, 0.025, 0.025)), M.energy, { rough: 0.3, emit: 0.07 * branch, alpha: 0.28 + 0.42 * branch });\n  draw(CUBE, T(signal.x, signal.y, signal.z), M.energy, { rough: 0.2, emit: 0.18 * branch, alpha: 0.7 * branch, scale: 1 });\n  if (typeof window !== 'undefined' && window.TeamAiHero) window.TeamAiHero.SEAT1_CONNECTION_EDGE_ID = SEAT1_CONNECTION_EDGE_ID;\n}\n\n`;
  text = text.slice(0, at) + fn + text.slice(at);
}

const callAnchor = '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);\n    }';
if (!text.includes(callAnchor)) throw new Error('connection draw call anchor missing');
if (!text.includes('drawSeat1ConnectionEdge({ draw, CUBE, T, S, RY, M, cx, cy, cz });')) {
  text = text.replace(
    callAnchor,
    '      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);\n      if (index === 0) drawSeat1ConnectionEdge({ draw, CUBE, T, S, RY, M, cx, cy, cz });\n    }',
  );
}

writeFileSync(path, text);
console.log('Seat-1 connection edge wire applied');
