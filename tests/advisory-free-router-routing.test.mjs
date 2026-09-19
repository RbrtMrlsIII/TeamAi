import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const sequence = read('.github/workflows/ai-advisory-review-sequence.yml');
const runner = read('.github/workflows/ai-advisory-review-runner.yml');
const manual = read('.github/workflows/additional-ai-advisory-reviews.yml');

const aliases = [
  'OPENROUTER_API_KEY',
  'OPENROUTER_API_KEY_OPENAI',
  'OPENROUTER_API_KEY_POOLSIDE',
  'OPENROUTER_API_KEY_DEEPSEEK',
  'OPENROUTER_API_KEY_GWEN',
];

test('automatic advisory routing is five parallel general Free Router slots with distinct credentials', () => {
  assert.match(sequence, /strategy:\s*\n\s*fail-fast: false\s*\n\s*matrix:\s*\n\s*include:/);
  assert.equal((sequence.match(/model: openrouter\/free/g) || []).length, 1);
  assert.match(sequence, /reviewer: OpenRouter Free Slot \$\{\{ matrix\.slot \}\}/);
  assert.match(sequence, /reviewer_slug: openrouter-free-\$\{\{ matrix\.slot \}\}/);
  assert.match(sequence, /credential_alias: \$\{\{ matrix\.credential_alias \}\}/);
  assert.match(sequence, /api_key: \$\{\{ secrets\[matrix\.credential_alias\] \}\}/);
  for (const alias of aliases) assert.match(sequence, new RegExp('credential_alias: ' + alias));
  assert.doesNotMatch(sequence, /secrets\.OPENROUTER_API_KEY \}\}/);
  assert.doesNotMatch(sequence, /nvidia\/nemotron|openai\/gpt-oss|poolside\/laguna|deepseek\/|qwen\/qwen/);
  assert.doesNotMatch(sequence, /REVIEW_INTERVAL_SECONDS|delay_to_second_stage|delay_to_third_stage|2 minutes 30 seconds|150-second/);
});

test('automatic sequence completion is terminal-outcome based and shell-safe', () => {
  assert.match(sequence, /SUCCEEDED\|PROVIDER_FAILED\|REVIEW_POST_FAILED\|PRE_PROVIDER_FAILURE/);
  assert.match(sequence, /Five parallel OpenRouter Free Router slots reached terminal execution outcomes/);
  assert.match(sequence, /expected_slug='Reviewer slug: `openrouter-free-'\"\$slot\"'`'/);
  assert.match(sequence, /expected_credential_line='Credential alias: `'\"\$expected_credential_alias\"'`'/);
  assert.match(sequence, /grep -Fq "\$expected_slug"/);
  assert.match(sequence, /grep -Fq "\$expected_credential_line"/);
  assert.doesNotMatch(sequence, /grep -Fq "Reviewer slug: `openrouter-free-\$slot`"/);
});

test('reusable runner is route-locked and receives one credential alias', () => {
  assert.match(runner, /credential_alias:/);
  assert.match(runner, /MODEL: openrouter\/free/);
  assert.doesNotMatch(runner, /inputs\.model/);
  assert.doesNotMatch(runner, /approve:/);
  assert.doesNotMatch(runner, /Optional model approval/);
  assert.match(runner, /Credential alias: `%s/);
  assert.match(runner, /actual_model = data\.get\('model'\)/);
  assert.match(runner, /actual_provider/);
});

test('manual reviewer commands map to distinct credential slots on the same route', () => {
  for (let slot = 1; slot <= 5; slot += 1) {
    assert.match(manual, new RegExp('OpenRouter Free Manual Slot ' + slot));
    assert.match(manual, new RegExp('reviewer_slug: openrouter-free-manual-' + slot));
    assert.match(manual, new RegExp('startsWith\\(github\\.event\\.comment\\.body, \'/free-' + slot + '\\)'));
  }
  for (const alias of aliases) assert.match(manual, new RegExp('secrets\\.' + alias));
  assert.doesNotMatch(manual, /model: /);
  assert.doesNotMatch(manual, /Nemotron|OpenAI|Poolside|DeepSeek|Qwen/);
});

test('former Nemotron compatibility surface is historical, not active', () => {
  assert.equal(existsSync('.github/workflows/nemotron-copilot-review.yml'), false);
  assert.equal(existsSync('skills/governance/nemotron-copilot-review/SKILL.md'), false);
  assert.equal(existsSync('docs/archive/nemotron-copilot-review-workflow_legacy_2026-09-19.yml'), true);
  assert.equal(existsSync('docs/archive/nemotron-copilot-review-SKILL_legacy_2026-09-19.md'), true);
});

test('active advisory wiring names only the generalized Skill', () => {
  const wiring = read('docs/SKILL_WIRING.md');
  assert.match(wiring, /skills\/governance\/ai-advisory-review\/SKILL\.md/);
  assert.doesNotMatch(wiring, /nemotron-copilot-review/);
});
