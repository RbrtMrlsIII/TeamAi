import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicPath = join(root, 'public/hero-flex.js');
const basePath = join(root, 'public/_flex_src/hero-flex.base.js');

/**
 * Canonical Hero compatibility sync.
 *
 * The old Cam-2/3/4 patch engine used to mutate hero-flex during builds.
 * Rendering authority has moved to machine-world-renderer.js. This command
 * now only copies the repository-owned compatibility controller source and
 * proves byte-for-byte parity. No network, patch engine, or runtime rewrite.
 */
const source = readFileSync(basePath, 'utf8');
writeFileSync(publicPath, source);
const generated = readFileSync(publicPath, 'utf8');
if (generated !== source) throw new Error('Canonical Hero compatibility source parity failed');

console.log('Canonical Hero compatibility source synchronized');
