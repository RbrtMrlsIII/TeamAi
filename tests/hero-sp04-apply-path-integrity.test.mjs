/**
 * SP-04 — canonical Hero source parity.
 *
 * The historical Cam-2 patch engine is retired. The compatibility command
 * must only synchronize the repository-owned controller source.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const apply = join(root, 'scripts/sync-hero-flex-runtime.mjs');

test('SP-04 compatibility sync is deterministic and network-independent', async () => {
  const result = spawnSync(process.execPath, [apply], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout || 'sync failed');
  const source = await readFile(join(root, 'public/_flex_src/hero-flex.base.js'), 'utf8');
  const entry = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.equal(entry, source);
});

test('SP-04 legacy mutation machinery is gone', async () => {
  const script = await readFile(apply, 'utf8');
  assert.doesNotMatch(script, /apply-cam2-tree-follow-flex\.engine|raw\.githubusercontent\.com/);
  assert.match(script, /hero-flex\.base\.js/);
});

test('SP-04 canonical spatial renderer is modular', async () => {
  const renderer = await readFile(join(root, 'public/machine-world-renderer.js'), 'utf8');
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /createMachineExpansionMechanism/);
  assert.match(renderer, /createDeepSpaceField/);
  assert.match(renderer, /scene\.connections/);
  assert.match(renderer, /canvas\.dataset\.machineWorldRenderer/);
});
