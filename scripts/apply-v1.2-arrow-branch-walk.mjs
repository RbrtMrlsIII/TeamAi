#!/usr/bin/env node
/**
 * V1.2 branch-walk compatibility check.
 * The arrow interaction is now owned directly by the canonical Hero controller.
 * This command is retained only for legacy callers and performs no mutation.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(new URL('..', import.meta.url)), '.');
const hero = readFileSync(join(root, 'public/hero-flex.js'), 'utf8');
if (!hero.includes('cycleSeatShellBranchFocus')) throw new Error('canonical Hero controller lacks branch-walk ownership');
console.log('V1.2 branch-walk already source-owned; no patch performed');
