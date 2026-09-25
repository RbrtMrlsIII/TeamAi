import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  MACHINE_SPATIAL_RUNTIME_FILES,
  resolveMachineSpatialRuntimePublicFile,
} from './machine-spatial-runtime-manifest.mjs';

const root = resolve(import.meta.dirname, '..');

const checkOnly = process.argv.includes('--check');
const drifted = [];

for (const file of MACHINE_SPATIAL_RUNTIME_FILES) {
  const sourcePath = resolve(root, 'frontend/spatial', file);
  const publicPath = resolve(root, 'public', resolveMachineSpatialRuntimePublicFile(file));
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
  console.log(`Machine spatial runtime parity verified for ${MACHINE_SPATIAL_RUNTIME_FILES.length} modules`);
} else {
  console.log(`Synchronized ${MACHINE_SPATIAL_RUNTIME_FILES.length} machine semantic modules from frontend/spatial to public`);
}
