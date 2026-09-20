#!/usr/bin/env node
/**
 * CAM-R1/R2 subject-lock compatibility check.
 * Subject-lock is now source-owned by the canonical Hero controller.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(new URL('..', import.meta.url)), '.');
const hero = readFileSync(join(root, 'public/hero-flex.js'), 'utf8');
for (const marker of ['function retargetSubjectLock', 'function setSelectedSeat', 'getSubjectLockSnapshot']) {
  if (!hero.includes(marker)) throw new Error('canonical Hero controller lacks ' + marker);
}
if (hero.includes("setCamera('TEAM_ORBIT')") || hero.includes("setCamera('TURN_FOLLOW')")) {
  throw new Error('retired camera transition remains in canonical controller');
}
console.log('CAM-R1/R2 subject-lock already source-owned; no patch performed');
