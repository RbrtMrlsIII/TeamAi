#!/usr/bin/env node
/**
 * Idempotent P-R2 R2 setup-ring camera-fill check.
 * Presentation only · login/signup full-area dock + APP_UI_HANDOFF · not Firebase Auth
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const runtime = fs.readFileSync(path.join(root, 'public/hero-hierarchy-runtime.js'), 'utf8');
const flex = fs.readFileSync(path.join(root, 'public/hero-flex.js'), 'utf8');
const r2 = fs.readFileSync(path.join(root, 'public/hero-r2-setup-ring.js'), 'utf8');

const ready =
  runtime.includes('tickSetupRingFill') &&
  runtime.includes('SETUP_RING_FILL_MS') &&
  runtime.includes('requestSetupRingHandoff') &&
  flex.includes('tickSetupRingFill(hierarchyRuntime') &&
  flex.includes("key==='l'") &&
  flex.includes('syncSetupRingCamera') &&
  r2.includes('fillAmount');

if (ready) {
  console.log('P-R2 already applied');
  process.exit(0);
}
console.error('P-R2 source files are not fully applied.');
process.exit(1);
