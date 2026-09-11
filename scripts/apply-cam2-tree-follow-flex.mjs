import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicPath = join(root, 'public/hero-flex.js');
const basePath = join(root, 'public/_flex_src/hero-flex.base.js');

// Always seed from the repository-owned source before invoking the patch engine.
// This makes the normal build/test path deterministic and network-independent.
writeFileSync(publicPath, readFileSync(basePath, 'utf8'));
await import('./apply-cam2-tree-follow-flex.engine.mjs');
