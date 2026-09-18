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
  assert.doesNotMatch(sequence, /REVIEW_INTERVAL_SECONDS|delay_to_second_stage|delay_to_third_stage|2 minutes 30 seconds|150-second/);
});

test('automatic sequence remains one-shot and completion waits for all five slot outputs', () => {
  assert.match(sequence, /An automatic sequence claim already exists for PR #\$PR/);
  assert.match(sequence, /needs: \[claim, openrouter_free\]/);
  assert.match(sequence, /if: always\(\) && needs\.claim\.result == 'success'/);
  assert.equal((sequence.match(/for slot in 1 2 3 4 5/g) || []).length, 2);
});

test('runner records the actual routed model and provider instead of requested router identity', () => {
  assert.match(runner, /X-OpenRouter-Metadata/);
  assert.match(runner, /actual_model = data\.get\('model'\)/);
  assert.match(runner, /openrouter_metadata/);
  assert.match(runner, /actual_provider/);
  assert.match(runner, /Actual model/);
  assert.match(runner, /Actual provider/);
});

test('manual reviewer paths use OpenRouter Free Router without model-specific approval', () => {
  assert.equal((manual.match(/model: openrouter\/free/g) || []).length, 1);
  assert.equal((legacy.match(/model: openrouter\/free/g) || []).length, 1);
  assert.doesNotMatch(legacy, /nvidia\/nemotron|approve:.*true/);
});
