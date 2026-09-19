import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const assertFile = (path) => { assert.equal(existsSync(join(root, path)), true, `missing required file: ${path}`); return read(path); };

const aliases = [
  'OPENROUTER_API_KEY',
  'OPENROUTER_API_KEY_OPENAI',
  'OPENROUTER_API_KEY_POOLSIDE',
  'OPENROUTER_API_KEY_DEEPSEEK',
  'OPENROUTER_API_KEY_GWEN',
];
const routePhrase = 'OpenRouter Free Router → 5 parallel slots → no inter-slot interval; each slot uses a distinct credential alias; terminal slot outcome is explicit; actual routed model/provider recorded on successful review';

const sequence = assertFile('.github/workflows/ai-advisory-review-sequence.yml');
const runner = assertFile('.github/workflows/ai-advisory-review-runner.yml');
const manual = assertFile('.github/workflows/additional-ai-advisory-reviews.yml');
const governance = assertFile('.github/workflows/governance.yml');
const policy = assertFile('POLICY.md');
const productLaw = assertFile('Product_Law/WIRING.md');
const skillWiring = assertFile('docs/SKILL_WIRING.md');
const skill = assertFile('skills/governance/ai-advisory-review/SKILL.md');
const masterplan = assertFile('Masterplan/MASTERPLAN.md');
const nextSlices = assertFile('Masterplan/NEXT_SLICES.md');
const session = assertFile('AI_ASSISTANT_READ_ME.md');

assert.match(sequence, /fail-fast: false/);
assert.match(sequence, /matrix:\s*\n\s*include:/);
assert.match(sequence, /api_key: \$\{\{ secrets\[matrix\.credential_alias\] \}\}/);
assert.doesNotMatch(sequence, /model: openrouter\/free/);
assert.doesNotMatch(sequence, /secrets\.OPENROUTER_API_KEY \}\}/);
assert.doesNotMatch(sequence, /nvidia\/nemotron|openai\/gpt-oss|poolside\/laguna|deepseek\/|qwen\/qwen/);
assert.doesNotMatch(sequence, /REVIEW_INTERVAL_SECONDS|delay_to_second_stage|delay_to_third_stage|2 minutes 30 seconds|150-second/);
for (const alias of aliases) assert.match(sequence, new RegExp(`credential_alias: ${alias}`));

assert.match(runner, /credential_alias:/);
assert.match(runner, /MODEL: openrouter\/free/);
assert.doesNotMatch(runner, /inputs\.model/);
assert.doesNotMatch(runner, /approve:/);
assert.doesNotMatch(runner, /Optional model approval/);
const postReview = runner.match(/- name: Post advisory review[\s\S]*?(?=\n      - name:|$)/)?.[0] ?? '';
assert.match(postReview, /CREDENTIAL_ALIAS: \$\{\{ inputs\.credential_alias \}\}/);
assert.match(runner, /Credential alias: `%s/);
assert.match(runner, /actual_model = data\.get\('model'\)/);
assert.match(runner, /actual_provider/);

const safeSlug = /expected_slug='Reviewer slug: `openrouter-free-'\"\$slot\"'`'/;
const safeCredential = /expected_credential_line='Credential alias: `'\"\$expected_credential_alias\"'`'/;
assert.match(sequence, safeSlug);
assert.match(sequence, safeCredential);
assert.doesNotMatch(sequence, /grep -Fq \"Reviewer slug: `openrouter-free-\$slot`\"/);
assert.ok(sequence.includes('job_name="openrouter_free ($slot, $expected_credential_alias) / review"'));
assert.equal((sequence.match(/--arg marker "\$MARKER" --arg head "\$HEAD"/g) ?? []).length, 2);

for (let slot = 1; slot <= 5; slot += 1) {
  assert.match(manual, new RegExp(`OpenRouter Free Manual Slot ${slot}`));
  assert.match(manual, new RegExp(`reviewer_slug: openrouter-free-manual-${slot}`));
  assert.match(manual, new RegExp(`startsWith\\(github\\.event\\.comment\\.body, '/free-${slot}'\\)`));
}
for (const alias of aliases) assert.match(manual, new RegExp(`secrets\\.${alias}`));
assert.doesNotMatch(manual, /model: /);

for (const path of ['POLICY.md', 'Product_Law/WIRING.md', 'docs/SKILL_WIRING.md', 'skills/governance/ai-advisory-review/SKILL.md', 'Masterplan/MASTERPLAN.md', 'AI_ASSISTANT_READ_ME.md']) {
  const text = read(path);
  assert.match(text, new RegExp(routePhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
for (const path of ['POLICY.md', 'docs/SKILL_WIRING.md', 'skills/governance/ai-advisory-review/SKILL.md']) {
  const text = read(path);
  for (const alias of aliases) assert.match(text, new RegExp(alias));
}
for (const path of ['Masterplan/NEXT_SLICES.md', 'AI_ASSISTANT_READ_ME.md', 'Product_Law/WIRING.md', 'Masterplan/MASTERPLAN.md']) {
  const text = read(path);
  assert.match(text, /five distinct (?:OpenRouter API key credentials|OpenRouter credential aliases|credential aliases)/i);
}
assert.doesNotMatch(skillWiring, /nemotron-copilot-review/);
assert.doesNotMatch(masterplan, /Nemotron Copilot Review procedure remains registered/);
assert.doesNotMatch(nextSlices, /skills\/governance\/nemotron-copilot-review\/SKILL\.md/);
assert.equal(existsSync(join(root, '.github/workflows/nemotron-copilot-review.yml')), false);
assert.equal(existsSync(join(root, 'skills/governance/nemotron-copilot-review/SKILL.md')), false);
assert.equal(existsSync(join(root, 'docs/archive/nemotron-copilot-review-workflow_legacy_2026-09-19.yml')), true);
assert.equal(existsSync(join(root, 'docs/archive/nemotron-copilot-review-SKILL_legacy_2026-09-19.md')), true);

assert.match(governance, /verify-advisory-control-plane\.mjs/);
assert.match(policy, /quota boundary for the exact PR head/i);
assert.match(policy, /later corrected PR head may establish one (?:new )?sequence/i);
assert.doesNotMatch(policy, /even when the PR head later changes/);
assert.match(skill, /same exact head never restarts/i);
assert.doesNotMatch(governance, /one shared key/);

console.log('Advisory control plane contract: PASS');
console.log(`Route: openrouter/free | slots: 5 | distinct credential aliases: ${aliases.length}`);
console.log('No active 1→2→2 or model-specific reviewer execution path detected.');
