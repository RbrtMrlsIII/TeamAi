import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../scripts/', import.meta.url);
const names = [
  'apply-p-r0-zipskills-flex.mjs',
  'apply-p1.1-connection-flex.mjs',
  'apply-p2.1-behavior-flex.mjs',
  'apply-p3.1-toolkit-flex.mjs',
  'apply-p4.1-capabilities-flex.mjs',
  'apply-p5.1-authorization-flex.mjs',
  'apply-p6.1-workspace-scope-flex.mjs',
  'apply-p7.1-task-evidence-flex.mjs',
];

test('historical apply-p scripts are compatibility checks, not source mutators', async () => {
  for (const name of names) {
    const source = await readFile(new URL(name, root), 'utf8');
    assert.match(source, /verifyHeroFlexFeature/);
    assert.doesNotMatch(source, /writeFile|writeFileSync|appendFile|readFileSync\([^)]*hero-flex\.js/);
    assert.doesNotMatch(source, /patchSource|\.replace\(|fetch\(|raw\.githubusercontent\.com/);
  }
});

test('all historical apply-p wrappers remain present under their stable command names', async () => {
  const entries = await readdir(root);
  for (const name of names) assert.ok(entries.includes(name), name);
});
