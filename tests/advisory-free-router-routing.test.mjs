import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const sequence = read('.github/workflows/ai-advisory-review-sequence.yml');
const runner = read('.github/workflows/ai-advisory-review-runner.yml');
const manual = read('.github/workflows/additional-ai-advisory-reviews.yml');
const legacy = read('.github/workflows/nemotron-copilot-review.yml');

test('automatic advisory routing uses five parallel OpenRouter Free Router slots', () => {
  assert.match(sequence, /strategy:\s*\n\s*fail-fast: false\s*\n\s*matrix:\s*\n\s*slot: \[1, 2, 3, 4, 5\]/);
  assert.equal((sequence.match(/model: openrouter\/free/g) || []).length, 1);
  assert.match(sequence, /reviewer: OpenRouter Free Slot \$\{\{ matrix\.slot \}\}/);
  assert.match(sequence, /reviewer_slug: openrouter-free-\$\{\{ matrix\.slot \}\}/);
  assert.match(sequence, /api_key: \$\{\{ secrets\.OPENROUTER_API_KEY \}\}/);
  assert.match(sequence, /automatic_outcome_marker: '<!-- teamai-openrouter-free-slot-\$\{\{ matrix\.slot \}\}-outcome -->/);
  assert.doesNotMatch(sequence, /automatic_start_marker|REVIEW_INTERVAL_SECONDS|delay_to_second_stage|delay_to_third_stage|2 minutes 30 seconds|150-second/);
});

test('automatic sequence remains one-shot and completion accepts terminal success/failure slot outcomes', () => {
  assert.match(sequence, /An automatic sequence claim already exists for PR #\$PR/);
  assert.match(sequence, /SEQUENCE_COMPLETE_MARKER/);
  assert.match(sequence, /repos\/\$REPO\/actions\/runs\/\$GITHUB_RUN_ID\/jobs/);
  assert.match(sequence, /conclusion.*success.*failure/);
  assert.match(sequence, /Five parallel OpenRouter Free Router slots reached terminal execution outcomes/);
  assert.match(sequence, /outcome_marker/);
  assert.match(sequence, /Slot outcome: SUCCEEDED/);
  assert.match(sequence, /github-actions\[bot\]/);
  assert.equal((sequence.match(/for slot in 1 2 3 4 5/g) || []).length, 1);
});

test('runner records the actual routed model and provider instead of requested router identity', () => {
  assert.match(runner, /X-OpenRouter-Metadata/);
  assert.match(runner, /actual_model = data\.get\('model'\)/);
  assert.match(runner, /openrouter_metadata/);
  assert.match(runner, /actual_provider/);
  assert.match(runner, /Actual model/);
  assert.match(runner, /Actual provider/);
  assert.match(runner, /MAX_REVIEW_CHARS/);
  assert.match(runner, /max_tokens': 2200/);
  assert.match(runner, /Return only the following compact review structure/);
  assert.match(runner, /hidden reasoning, internal deliberation/);
  assert.match(runner, /Publish durable automatic slot outcome/);
  assert.match(runner, /PROVIDER_RESPONSE_FAILURE|PROVIDER_HTTP_FAILURE|PROVIDER_TRANSPORT_FAILURE/);
  assert.doesNotMatch(runner, /Reserve automatic provider invocation slot|automatic_start_marker/);
});

test('manual reviewer paths use OpenRouter Free Router without model-specific approval', () => {
  assert.equal((manual.match(/model: openrouter\/free/g) || []).length, 1);
  assert.equal((legacy.match(/model: openrouter\/free/g) || []).length, 1);
  assert.doesNotMatch(legacy, /nvidia\/nemotron|approve:.*true/);
});
