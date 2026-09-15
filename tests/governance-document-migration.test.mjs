import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');
const retired = {
  productLaw: ['PRODUCT_LAW', '.md'].join(''),
  masterplan: ['MASTERPLAN', '.md'].join(''),
  nextSlices: ['NEXT_SLICES', '.md'].join(''),
  handover: ['Hand', 'Over.md'].join(''),
  endorsement: ['Endorse', 'ment.md'].join(''),
};

/**
 * Validation migration ledger
 *
 * OLD INVARIANT                         DISPOSITION       REPLACEMENT
 * root Product Law path                OBSOLETE          Product_Law/PRODUCT_LAW.md
 * root Masterplan path                 OBSOLETE          Masterplan/MASTERPLAN.md
 * root Next Slices path                OBSOLETE          Masterplan/NEXT_SLICES.md
 * live HandOver.md manual              OBSOLETE          AI_ASSISTANT_READ_ME.md + history
 * legacy Endorsement manual            OBSOLETE          session + evidence + PR record
 * docs/skills parallel procedures      OBSOLETE          single skills tree only
 * last-commit sync inference           OBSOLETE          full PR BASE...HEAD diff
 * green CI => merge readiness          OBSOLETE          Draft + evidence + reconciliation + review readiness
 * one slice => one merge               OBSOLETE          multi-commit/multi-slice PRs allowed
 * R1-R10 shared root assertion         OBSOLETE          R0-R3 ring-map ownership
 * historical V-series as current       OBSOLETE          Masterplan/NEXT_SLICES.md current frontier
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
    retired.productLaw,
    retired.masterplan,
    retired.nextSlices,
    join('docs', 'project-guide', retired.handover),
    join('docs', 'project-guide', retired.endorsement),
  ]) assert.equal(existsSync(join(root, p)), false, p);
});

test('authority manifest is machine-readable and names one owner per canonical role', () => {
  const manifest = JSON.parse(read('.github/teamai/authority-manifest.yml'));
  const owners = Object.entries(manifest.active_authorities || {});
  assert.equal(manifest.schema, 2);
  assert.equal(manifest.status, 'ACTIVE');
  assert.equal(new Set(owners.map(([, spec]) => spec.path)).size, owners.length);
  assert.equal(manifest.active_authorities.product_law.path, 'Product_Law/PRODUCT_LAW.md');
  assert.equal(manifest.active_authorities.masterplan.path, 'Masterplan/MASTERPLAN.md');
  assert.equal(manifest.active_authorities.current_slice.path, 'Masterplan/NEXT_SLICES.md');
  assert.equal(manifest.skill_model.canonical_glob, 'skills/**/SKILL.md');
  assert.equal(manifest.promotion_model.draft_first, true);
  assert.equal(manifest.promotion_model.auto_merge, false);
});

test('authority manifest records the validation migrations instead of deleting the old invariants silently', () => {
  const manifest = JSON.parse(read('.github/teamai/authority-manifest.yml'));
  const migrations = manifest.invariant_migrations || [];
  const disposition = new Map(migrations.map((item) => [item.old, item]));
  for (const [old, replacement] of [
    ['root Product Law path', 'Product_Law/PRODUCT_LAW.md'],
    ['root Masterplan path', 'Masterplan/MASTERPLAN.md'],
    ['root current-slice path', 'Masterplan/NEXT_SLICES.md'],
    ['R1-R10 shared root assertion', 'R0-R3 ring map owns current topology; Skills do not own ring constants'],
    ['historical V3.x document as current frontier', 'Masterplan/NEXT_SLICES.md owns current frontier'],
  ]) {
    assert.equal(disposition.get(old)?.disposition, 'OBSOLETE', old);
    assert.equal(disposition.get(old)?.new, replacement, old);
  }
});

test('blocker model separates one substantive blocker from validation-rewire debt', () => {
  const manifest = JSON.parse(read('.github/teamai/authority-manifest.yml'));
  const blockers = manifest.blocking_model;
  assert.ok(blockers.single_substantive_blocker);
  assert.equal(blockers.validation_rewire_is_non_blocking, true);
  assert.match(blockers.validation_rewire_definition, /underlying product\/runtime invariant remains valid/i);
  assert.match(blockers.single_substantive_blocker, /current-authority contradiction/i);
  assert.ok(Array.isArray(blockers.merge_blockers));
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
  const manifest = JSON.parse(read('.github/teamai/authority-manifest.yml'));
  assert.match(fieldWiring, /Development fields/);
  assert.match(fieldWiring, /Product & Governance/);
  assert.match(fieldWiring, /Backend & Runtime/);
  assert.match(fieldWiring, /Frontend & Experience/);
  assert.match(skillWiring, /skills\/governance\/machine-builder\/SKILL\.md/);
  assert.match(skillWiring, /## Forbidden active routing surfaces/);
  assert.match(skillWiring, /legacy `docs\/skills\/` namespace/);
  assert.match(skillWiring, /single skills tree/i);
  assert.equal(manifest.skill_model.canonical_glob, 'skills/**/SKILL.md');
  assert.equal(existsSync(join(root, 'docs/skills')), false);
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

test('promotion boundaries keep #344 and #346 separate', () => {
  const manifest = JSON.parse(read('.github/teamai/authority-manifest.yml'));
  const skillWiring = read('docs/SKILL_WIRING.md');
  const session = read('AI_ASSISTANT_READ_ME.md');
  assert.equal(manifest.promotion_model.governance_pr, 346);
  assert.equal(manifest.promotion_model.machine_hero_pr, 344);
  assert.match(skillWiring, /#344/);
  assert.match(skillWiring, /promotion/i);
  assert.match(session, /#344.*Draft and not promoted/i);
});
