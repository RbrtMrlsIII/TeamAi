/**
 * SP-04 — canonical Hero source parity.
 *
 * The historical Cam-2 patch engine is retired. Validation commands must
 * never rewrite the repository-owned controller artifact.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sync = join(root, 'scripts/sync-hero-flex-runtime.mjs');
const apply = join(root, 'scripts/apply-cam2-tree-follow-flex.mjs');

test('SP-04 compatibility check is deterministic and network-independent', async () => {
  const result = spawnSync(process.execPath, [apply], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout || 'Hero parity check failed');
  const source = await readFile(join(root, 'public/_flex_src/hero-flex.base.js'), 'utf8');
  const entry = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.equal(entry, source);
});

test('SP-04 check mode fails closed without mutating a drifted artifact', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'teamai-hero-flex-'));
  const sandboxScript = join(sandbox, 'scripts', 'sync-hero-flex-runtime.mjs');
  const sandboxBase = join(sandbox, 'public', '_flex_src', 'hero-flex.base.js');
  const sandboxPublic = join(sandbox, 'public', 'hero-flex.js');

  try {
    await mkdir(join(sandbox, 'scripts'), { recursive: true });
    await mkdir(join(sandbox, 'public', '_flex_src'), { recursive: true });
    await writeFile(sandboxScript, await readFile(sync, 'utf8'));
    await writeFile(sandboxBase, 'canonical');
    await writeFile(sandboxPublic, 'drift');

    const failed = spawnSync(process.execPath, [sandboxScript, '--check'], {
      cwd: sandbox,
      encoding: 'utf8',
    });
    assert.notEqual(failed.status, 0);
    assert.equal(await readFile(sandboxPublic, 'utf8'), 'drift');

    await writeFile(sandboxPublic, 'canonical');
    const passed = spawnSync(process.execPath, [sandboxScript, '--check'], {
      cwd: sandbox,
      encoding: 'utf8',
    });
    assert.equal(passed.status, 0);

    await writeFile(sandboxPublic, 'drift');
    const repaired = spawnSync(process.execPath, [sandboxScript, '--write'], {
      cwd: sandbox,
      encoding: 'utf8',
    });
    assert.equal(repaired.status, 0);
    assert.equal(await readFile(sandboxPublic, 'utf8'), 'canonical');
  } finally {
    await rm(sandbox, { recursive: true, force: true });
  }
});

test('SP-04 legacy mutation machinery is gone', async () => {
  const script = await readFile(apply, 'utf8');
  assert.doesNotMatch(script, /apply-cam2-tree-follow-flex\.engine|raw\.githubusercontent\.com/);
  assert.match(script, /sync-hero-flex-runtime\.mjs/);
  assert.match(script, /--check/);
});

test('SP-04 canonical spatial renderer is modular', async () => {
  const renderer = await readFile(join(root, 'public/machine-world-renderer.js'), 'utf8');
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /createMachineExpansionMechanism/);
  assert.match(renderer, /createDeepSpaceField/);
  assert.match(renderer, /scene\.connections/);
  assert.match(renderer, /canvas\.dataset\.machineWorldRenderer/);
});
