import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('P1.1 apply script is idempotent and wires connection branch into hero-flex', () => {
  const script = path.join(process.cwd(), 'scripts/apply-p1.1-connection-flex.mjs');
  assert.ok(fs.existsSync(script));
  const first = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(first.status, 0, first.stderr || first.stdout);
  const second = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(second.status, 0);
  assert.match(second.stdout || '', /already applied/);

  const flex = fs.readFileSync(path.join(process.cwd(), 'public/hero-flex.js'), 'utf8');
  assert.match(flex, /tickConnectionBranch\(hierarchyRuntime/);
  assert.match(flex, /getConnectionBranchAmount/);
  assert.match(flex, /requestConnectionConfigureHandoff/);
  assert.match(flex, /CONNECTION_BRANCH_MS/);
  assert.match(flex, /branchBoost/);
  assert.match(flex, /event\.key==='c'/);
  assert.doesNotMatch(flex, /firestore|OPENAI_API_KEY/i);
});
