#!/usr/bin/env node
/**
 * Idempotent P-R2 R2 setup-ring camera-fill patch.
 * Presentation only · login/signup full-area dock + APP_UI_HANDOFF · not Firebase Auth
 * no entitlement · no 029-released claim
 *
 * This script is a Termux-friendly re-apply. The PR already contains the applied files.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const runtimePath = path.join(root, 'public/hero-hierarchy-runtime.js');
const flexPath = path.join(root, 'public/hero-flex.js');
const r2Path = path.join(root, 'public/hero-r2-setup-ring.js');

function must(p) {
  if (!fs.existsSync(p)) {
    console.error('missing ' + p);
    process.exit(1);
  }
  return fs.readFileSync(p, 'utf8');
}

const runtime = must(runtimePath);
const flex = must(flexPath);
const r2 = must(r2Path);

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

console.error('P-R2 source files are not fully applied. Restore from the PR branch (feat/029-p-r2-setup-ring-fill) rather than reconstructing from a truncated hero-flex.');
process.exit(1);
