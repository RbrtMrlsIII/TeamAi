import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = [
  ['machine-hero-scene.js', 'machine-hero-scene.js'],
  ['machine-hero-graph.js', 'machine-hero-graph.js'],
  ['machine-hero-payload.js', 'machine-hero-payload.js'],
  ['machine-hero-adaptive-geometry.js', 'machine-hero-adaptive-geometry.js'],
  ['machine-hero-topology.js', 'machine-hero-topology.js'],
  ['machine-core-layout.js', 'machine-core-layout-runtime.js'],
  ['machine-core-semantic-map.js', 'machine-core-semantic-map.js'],
  ['machine-core-seat-connection.js', 'machine-core-seat-connection.js'],
];

for (const [sourceFile, publicFile] of files) {
  const sourcePath = resolve(root, 'frontend/spatial', sourceFile);
  const publicPath = resolve(root, 'public', publicFile);
  const source = await readFile(sourcePath, 'utf8');
  const current = await readFile(publicPath, 'utf8').catch(() => null);
  if (current !== source) await writeFile(publicPath, source, 'utf8');
}

console.log(`Synchronized ${files.length} machine semantic modules from frontend/spatial to public`);
