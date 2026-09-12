import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('SEC-S1 session recovery doc exists with revoke posture', () => {
  const p = 'docs/SECURITY_SESSION_ACCOUNT_RECOVERY.md';
  assert.ok(existsSync(join(root, p)));
  const doc = read(p);
  assert.match(doc, /SEC-S1/);
  assert.match(doc, /revok/i);
  assert.match(doc, /Q-008/);
  assert.match(doc, /Firebase|IdP|identity provider/i);
  assert.match(doc, /no 029-released claim/i);
});

test('security_inquiry includes Q-008 lost device / stale login', () => {
  const doc = read('docs/security_inquiry.md');
  assert.match(doc, /Q-008/);
  assert.match(doc, /6 months|months ago|lost control|device/i);
  assert.match(doc, /SECURITY_SESSION_ACCOUNT_RECOVERY/);
});
