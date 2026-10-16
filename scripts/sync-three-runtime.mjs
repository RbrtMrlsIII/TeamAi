import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const REQUIRED_VERSION = '0.186.1';
const require = createRequire(import.meta.url);
const entry = require.resolve('three');
const packageRoot = resolve(dirname(entry), '..');
const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));

if (packageJson.version !== REQUIRED_VERSION) {
  throw new Error(`Three.js version mismatch: expected ${REQUIRED_VERSION}, found ${packageJson.version}`);
}

const sourceDir = resolve(packageRoot, 'build');
const destination = resolve('public/vendor/three');
await mkdir(destination, { recursive: true });

for (const file of ['three.module.js', 'three.core.js']) {
  await cp(resolve(sourceDir, file), resolve(destination, file), { force: true });
}

const manifest = [
  'THREE_RUNTIME_VERSION=' + packageJson.version,
  'THREE_RUNTIME_SOURCE=three npm package build/',
  'THREE_RUNTIME_ENTRY=build/three.module.js',
  'THREE_RUNTIME_ROLE=Y1 WebGL2 scene substrate transition asset',
  'THREE_RUNTIME_SEMANTIC_AUTHORITY=outside renderer',
].join('\n') + '\n';

await writeFile(resolve(destination, 'THREE_RUNTIME_MANIFEST.txt'), manifest, 'utf8');
console.log(`Three.js runtime synced: ${packageJson.version} -> ${destination}`);
