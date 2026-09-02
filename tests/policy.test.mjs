import test from 'node:test';
import assert from 'node:assert/strict';
import { canUseModel } from '../dist/src/billing/entitlements.js';
import { canInvokeTool } from '../dist/src/security/tool-policy.js';

test('model entitlement blocks unavailable model', () => {
  const result = canUseModel({ allowedModelIds: new Set(['gpt-luna']), modelId: 'claude-sonnet' });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'MODEL_NOT_ENTITLED');
});

test('tool policy denies write access when grant is read-only', () => {
  const result = canInvokeTool({
    grants: [{ tool: 'project.read_file', effect: 'allow' }],
    requestedTool: 'project.write_file'
  });
  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'TOOL_NOT_GRANTED');
});
