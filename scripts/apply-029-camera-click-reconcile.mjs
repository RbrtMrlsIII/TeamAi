#!/usr/bin/env node
/**
 * 029 camera/input reconciliation compatibility check.
 * Input behavior is now source-owned by the canonical Hero controller.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(new URL('..', import.meta.url)), '.');
const hero = readFileSync(join(root, 'public/hero-flex.js'), 'utf8');
if (hero.includes("setCamera('TURN_FOLLOW')") || hero.includes("setCamera('HERO_WIDE');setState('CONTRIBUTE'")) {
  throw new Error('retired camera mutation remains in canonical controller');
}
if (!hero.includes("event.preventDefault();")) throw new Error('canonical controller input path missing');
console.log('029 camera/input reconciliation already source-owned; no patch performed');
