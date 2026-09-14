#!/usr/bin/env node
/**
 * 029 interactive division-focus adapter.
 * Runs after the existing V1.2 Arrow branch-walk generator.
 * Only the real keyboard interaction path opts into animated division compaction.
 * Direct focusChild() callers remain deterministic and are not altered.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');
let text = readFileSync(path, 'utf8');

const withoutInteractive = "cycleSeatShellBranchFocus(hierarchyRuntime,event.key==='ArrowRight'?1:-1,{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion});";
const withInteractive = "cycleSeatShellBranchFocus(hierarchyRuntime,event.key==='ArrowRight'?1:-1,{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion,interactive:true});";
if (text.includes(withoutInteractive)) {
  text = text.replace(withoutInteractive, withInteractive);
  writeFileSync(path, text);
  console.log('029 interactive Arrow division focus enabled');
} else {
  console.log('029 interactive Arrow division focus already enabled');
}
