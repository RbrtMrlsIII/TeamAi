#!/usr/bin/env node
/**
 * 031 Seat-1 adjacency wiring compatibility sync.
 * The canonical machine-world renderer owns the draw path.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const [src, dst] of [
  ['frontend/spatial/seat-adjacent-division-wiring.js','public/seat-adjacent-division-wiring.js'],
  ['frontend/spatial/seat-division-geometry.js','public/seat-division-geometry.js'],
]) {
  const source = readFileSync(join(root, src), 'utf8');
  const target = join(root, dst);
  writeFileSync(target, source);
  if (readFileSync(target, 'utf8') !== source) throw new Error('source parity failed: '+dst);
}
const renderer = readFileSync(join(root, 'public/machine-world-renderer.js'), 'utf8');
if (!renderer.includes('buildAdjacentDivisionWiring')) throw new Error('canonical renderer missing adjacency wiring');
console.log('Seat-1 adjacent wiring sources synchronized; no Hero mutation performed');
