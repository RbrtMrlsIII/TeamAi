import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = [
  'seat-capacity.js',
  'machine-core-seat-connection.js',
  'machine-hero-scene.js',
  'machine-hero-graph.js',
  'machine-hero-payload.js',
  'machine-hero-adaptive-geometry.js',
  'machine-hero-topology.js',
];

for (const file of files) {
  const sourcePath = resolve(root, 'frontend/spatial', file);
  const publicPath = resolve(root, 'public', file);
  const source = await readFile(sourcePath, 'utf8');
  const current = await readFile(publicPath, 'utf8').catch(() => null);
  if (current !== source) await writeFile(publicPath, source, 'utf8');
}

console.log(`Synchronized ${files.length} machine semantic modules from frontend/spatial to public`);
