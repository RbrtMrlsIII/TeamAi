import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicPath = resolve(root, 'public/hero-flex.js');
const basePath = resolve(root, 'public/_flex_src/hero-flex.base.js');
const checkOnly = process.argv.includes('--check');
const writeMode = process.argv.includes('--write');

if (checkOnly && writeMode) {
  throw new Error('Hero runtime sync accepts either --check or --write, not both');
}

const source = readFileSync(basePath, 'utf8');
const generated = readFileSync(publicPath, 'utf8');

if (generated === source) {
  console.log(checkOnly
    ? 'Hero runtime artifact parity verified'
    : 'Hero runtime artifact already synchronized from repository-owned base');
  process.exit(0);
}

if (checkOnly) {
  throw new Error(
    'Hero runtime artifact drift detected: public/hero-flex.js differs from '
      + 'public/_flex_src/hero-flex.base.js. Run node scripts/sync-hero-flex-runtime.mjs --write',
  );
}

writeFileSync(publicPath, source, 'utf8');

const synchronized = readFileSync(publicPath, 'utf8');
if (synchronized !== source) {
  throw new Error('Hero runtime artifact parity failed after write');
}

console.log(writeMode
  ? 'Hero runtime artifact synchronized from repository-owned base'
  : 'Hero runtime artifact synchronized from repository-owned base (legacy write mode)');
