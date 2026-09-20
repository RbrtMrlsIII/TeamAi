#!/usr/bin/env node
/**
 * 029 adjacent expansion compatibility sync.
 * Geometry/state is source-owned; no Hero renderer mutation is permitted.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'frontend/spatial/seat-adjacent-division-expansion.js');
const publicPath = join(root, 'public/seat-adjacent-division-expansion.js');
const source = readFileSync(srcPath, 'utf8');
writeFileSync(publicPath, source);
if (readFileSync(publicPath, 'utf8') !== source) throw new Error('adjacent expansion parity failed');
const renderer = readFileSync(join(root, 'public/machine-world-renderer.js'), 'utf8');
if (!renderer.includes('buildAdjacentDivisionWiring')) throw new Error('canonical renderer missing adjacency ownership');
console.log('Adjacent expansion source synchronized; no Hero mutation performed');
