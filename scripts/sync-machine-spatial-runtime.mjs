import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = [
  'seat-capacity.js',
  'seat-division-geometry.js',
  'seat-connection-edge.js',
  'seat-adjacent-division-wiring.js',
  'machine-core-seat-connection.js',
  'machine-hero-scene.js',
  'machine-hero-graph.js',
  'machine-hero-payload.js',
  'machine-hero-adaptive-geometry.js',
  'machine-geometry-primitives.js',
  'machine-hero-topology.js',
  'machine-core-topology.js',
  'hero-environment.js',
  'hero-theme-lighting-adapter.js',
  'hero-authored-materials.js',
  'feature-registry.js',
  'feature-state.js',
  'feature-access.js',
  'seat-runtime-presentation.js',
  'hero-world-contract.js',
  'hero-world-profile.js',
  'theme-root.js',
  'hero-root-runtime.js',
  'hero-ring-envelope.js',
  'hero-workspace-core.js',
  'hero-r1-backend-display.js',
  'hero-r1-backend-threads.js',
  'hero-r2-setup-ring.js',
  'machine-world-renderer.js',
  'machine-seat-division-presentation.js',
  'machine-seat-division-topology.js',
  'machine-seat-division-payload.js',
  'machine-energy-flow.js',
  'machine-choreography.js',
  'mcp-capability.js',
  'mcp-capability-facility.js',
  'mcp-capability.css',
  'workspace-capability.js',
  'workspace-capability-facility.js',
  'workspace-capability.css',
  'team-agents.js',
  'team-agents-facility.js',
  'team-agents-facility.css',
  'marketplace-commerce.js',
  'marketplace-commerce-facility.js',
  'marketplace-commerce.css',
];

const checkOnly = process.argv.includes('--check');
const drifted = [];

for (const file of files) {
  const sourcePath = resolve(root, 'frontend/spatial', file);
  const publicPath = resolve(root, 'public', file);
  const source = await readFile(sourcePath, 'utf8');
  const current = await readFile(publicPath, 'utf8').catch(() => null);

  if (current !== source) {
    if (checkOnly) {
      drifted.push(file);
    } else {
      await writeFile(publicPath, source, 'utf8');
    }
  }
}

if (checkOnly) {
  if (drifted.length) {
    console.error(`Machine spatial runtime parity failed for ${drifted.length} module(s):`);
    for (const file of drifted) console.error(` - ${file}`);
    process.exit(1);
  }
  console.log(`Machine spatial runtime parity verified for ${files.length} modules`);
} else {
  console.log(`Synchronized ${files.length} machine semantic modules from frontend/spatial to public`);
}
