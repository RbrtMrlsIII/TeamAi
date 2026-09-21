import test from 'node:test';
import assert from 'node:assert/strict';

import {
  terminationFromAnthropic,
  terminationFromGemini,
  terminationFromMistral,
  terminationFromOpenAI,
  requiresContinuation,
} from '../dist/src/providers/termination.js';

test('OpenAI incomplete max_tokens is not completion', () => {
  const termination = terminationFromOpenAI('incomplete', 'max_tokens');
  assert.equal(termination.state, 'incomplete');
  assert.equal(termination.reason, 'length');
  assert.equal(termination.providerReason, 'max_tokens');
  assert.equal(requiresContinuation(termination), true);
});

test('OpenAI completed response is completion evidence', () => {
  const termination = terminationFromOpenAI('completed');
  assert.equal(termination.state, 'completed');
  assert.equal(termination.reason, 'stop');
  assert.equal(requiresContinuation(termination), false);
});

test('Anthropic max_tokens/tool_use remain incomplete', () => {
  assert.equal(terminationFromAnthropic('max_tokens').reason, 'length');
  assert.equal(requiresContinuation(terminationFromAnthropic('max_tokens')), true);
  assert.equal(terminationFromAnthropic('tool_use').reason, 'tool_use');
  assert.equal(requiresContinuation(terminationFromAnthropic('tool_use')), true);
  assert.equal(terminationFromAnthropic('end_turn').state, 'completed');
});

test('Mistral finish_reason length is continuation-worthy', () => {
  const termination = terminationFromMistral('length');
  assert.equal(termination.state, 'incomplete');
  assert.equal(termination.reason, 'length');
  assert.equal(requiresContinuation(termination), true);
  assert.equal(terminationFromMistral('stop').state, 'completed');
});

test('Gemini MAX_TOKENS is mapped into product-neutral length semantics', () => {
  const termination = terminationFromGemini('MAX_TOKENS');
  assert.equal(termination.state, 'incomplete');
  assert.equal(termination.reason, 'length');
  assert.equal(requiresContinuation(termination), true);
});
