#!/usr/bin/env node
/**
 * 029 Seat-1 connection source synchronization.
 *
 * The canonical renderer now owns the WebGL Seat-1 connection draw path.
 * This command no longer mutates hero-flex.js. It only mirrors the reusable
 * semantic frontend modules into public/ and verifies byte parity.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pairs = [
  ['frontend/spatial/seat-connection-edge.js', 'public/seat-connection-edge.js'],
  ['frontend/spatial/seat-division-geometry.js', 'public/seat-division-geometry.js'],
  ['frontend/spatial/machine-core-seat-connection.js', 'public/machine-core-seat-connection.js'],
];

for (const [sourcePath, publicPath] of pairs) {
  const source = readFileSync(join(root, sourcePath), 'utf8');
  writeFileSync(join(root, publicPath), source);
  const mirrored = readFileSync(join(root, publicPath), 'utf8');
  if (mirrored !== source) throw new Error(`Seat-1 source parity failed: ${publicPath}`);
}

const hero = readFileSync(join(root, 'public/hero-flex.js'), 'utf8');
if (!hero.includes("machine-world-renderer.js")) {
  throw new Error('canonical machine-world renderer is not wired into Hero');
}
if (hero.includes('drawSeat1ConnectionEdge(')) {
  throw new Error('retired monolithic Seat-1 injector still embedded in hero-flex.js');
}

console.log('Seat-1 semantic modules synchronized; canonical renderer owns WebGL path');
