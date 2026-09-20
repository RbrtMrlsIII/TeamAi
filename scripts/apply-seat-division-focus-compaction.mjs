#!/usr/bin/env node
/**
 * 029 Seat division focus-compaction source sync.
 *
 * The transition is now owned by public/hero-hierarchy-runtime.js and the
 * canonical Hero controller. This command only synchronizes the Hero source
 * copy and refuses to mutate runtime semantics.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = join(root, 'public/_flex_src/hero-flex.base.js');
const publicPath = join(root, 'public/hero-flex.js');
const source = readFileSync(sourcePath, 'utf8');
if (!source.includes('tickDivisionFocusTransition')) {
  throw new Error('canonical Hero source does not contain division focus transition');
}
writeFileSync(publicPath, source);
const mirrored = readFileSync(publicPath, 'utf8');
if (mirrored !== source) throw new Error('Hero source parity failed');
console.log('Seat division focus-compaction source synchronized');
