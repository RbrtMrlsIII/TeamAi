import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicPath = resolve(root, 'public/hero-flex.js');
const basePath = resolve(root, 'public/_flex_src/hero-flex.base.js');

const source = readFileSync(basePath, 'utf8');
writeFileSync(publicPath, source, 'utf8');

const generated = readFileSync(publicPath, 'utf8');
if (generated !== source) {
  throw new Error('Hero runtime artifact parity failed');
}

console.log('Hero runtime artifact synchronized from repository-owned base');
