import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');

/**
 * Validation migration ledger
 *
 * OLD INVARIANT                         DISPOSITION       REPLACEMENT
 * root Product Law path                OBSOLETE          Product_Law/PRODUCT_LAW.md
 * root Masterplan path                 OBSOLETE          Masterplan/MASTERPLAN.md
 * root Next Slices path                OBSOLETE          Masterplan/NEXT_SLICES.md
 * live HandOver.md manual              OBSOLETE          AI_ASSISTANT_READ_ME.md + history
 * live Endorsement.md                 OBSOLETE          session + evidence + PR record
 * docs/skills parallel procedures      OBSOLETE          skills/**/SKILL.md only
 * last-commit sync inference           OBSOLETE          full PR BASE...HEAD diff
 * green CI => merge readiness          OBSOLETE          Draft + evidence + reconciliation + review readiness
 * one slice => one merge               OBSOLETE          multi-commit/multi-slice PRs allowed
 * semantic machine checks              RETAINED          current machine invariants remain explicit
 */

test('canonical governance roots replace retired root files', () => {
  for (const p of [
    'Product_Law/PRODUCT_LAW.md',
    'Product_Law/WIRING.md',
    'Masterplan/MASTERPLAN.md',
    'Masterplan/NEXT_SLICES.md',
    'POLICY.md',
    'docs/SKILL_WIRING.md',
    'AI_ASSISTANT_READ_ME.md',
    'PRODUCT-KNOWLEDGE.md',
    'skills/governance/machine-builder/SKILL.md',
  ]) assert.equal(existsSync(join(root, p)), true, p);

  for (const p of [
    'PRODUCT_LAW.md',
    'MASTERPLAN.md',
    'NEXT_SLICES.md',
    'docs/project-guide/HandOver.md',
    'docs/project-guide/Endorsement.md',
  ]) assert.equal(existsSync(join(root, p)), false, p);
});

test('current slice uses the required six-section contract', () => {
  const text = read('Masterplan/NEXT_SLICES.md');
  for (const h of ['## Current Slice', '## Status', '## Objective', '## Dependencies', '## Verification', '## Current blocker']) {
    assert.match(text, new RegExp(`^${h.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}$`, 'm'));
  }
  assert.equal((text.match(/^## Current Slice$/gm) || []).length, 1);
  assert.doesNotMatch(text, /^## (?:Immediate sequence|Queue)$/m);
});

test('field wiring and Skill wiring remain separate responsibilities', () => {
  const fieldWiring = read('Product_Law/WIRING.md');
  const skillWiring = read('docs/SKILL_WIRING.md');
  assert.match(fieldWiring, /Development fields/);
  assert.match(fieldWiring, /Product & Governance/);
  assert.match(fieldWiring, /Backend & Runtime/);
  assert.match(fieldWiring, /Frontend & Experience/);
  assert.match(skillWiring, /skills\/governance\/machine-builder\/SKILL\.md/);
  assert.doesNotMatch(skillWiring, /docs\/skills\//);
});

test('validation changes preserve an explicit old-invariant to replacement record', () => {
  const policy = read('POLICY.md');
  const session = read('AI_ASSISTANT_READ_ME.md');
  assert.match(policy, /Validation-change protocol/);
  assert.match(policy, /Protected old invariant/);
  assert.match(policy, /Why the old invariant is obsolete\/retained/);
  assert.match(policy, /Replacement invariant/);
  assert.match(session, /VALIDATION CHANGE WARNING/);
});
