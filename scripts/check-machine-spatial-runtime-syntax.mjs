import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import {
  MACHINE_SPATIAL_RUNTIME_FILES,
  resolveMachineSpatialRuntimePublicFile,
} from './machine-spatial-runtime-manifest.mjs';

const root = resolve(import.meta.dirname, '..');
const jsFiles = MACHINE_SPATIAL_RUNTIME_FILES.filter((file) => /\.(?:m?js)$/.test(file));
const failures = [];

for (const surface of ['frontend/spatial', 'public']) {
  for (const file of jsFiles) {
    const target = surface === 'public' ? resolveMachineSpatialRuntimePublicFile(file) : file;
    const path = resolve(root, surface, target);
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (result.status !== 0) {
      failures.push({ surface, file: surface === 'public' ? resolveMachineSpatialRuntimePublicFile(file) : file, stderr: result.stderr.trim() });
    }
  }
}

if (failures.length) {
  console.error('Machine spatial runtime syntax check failed:');
  for (const failure of failures) {
    console.error(' - ' + failure.surface + '/' + failure.file);
    if (failure.stderr) console.error('   ' + failure.stderr.replace(/\n/g, '\n   '));
  }
  process.exit(1);
}

console.log('Machine spatial runtime syntax verified for ' + jsFiles.length + ' JS modules across frontend/spatial and public');
