/**
 * V1.2 — Arrow Left/Right wired to cycleSeatShellBranchFocus (Vision).
 * Owner: apply-cam2 + hero-seat-branch-walk · presentation only · no 029-released claim
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], {
  cwd: root,
  stdio: 'inherit',
});

test('V1.2 flex imports cycleSeatShellBranchFocus', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /cycleSeatShellBranchFocus/);
  assert.match(src, /from '\.\/hero-seat-branch-walk\.js'/);
});

test('V1.2 Arrow path uses cycleSeatShellBranchFocus not inline list math', async () => {
  const src = await readFile(join(root, 'public/hero-flex.js'), 'utf8');
  assert.match(src, /\/\* V1\.2 branch walk \*\//);
  assert.match(
    src,
    /cycleSeatShellBranchFocus\(hierarchyRuntime,event\.key==='ArrowRight'\?1:-1/,
  );
  const arrowIdx = src.indexOf("event.key==='ArrowRight'");
  assert.ok(arrowIdx > 0);
  const snippet = src.slice(arrowIdx, arrowIdx + 350);
  assert.doesNotMatch(snippet, /const list=SEAT_SHELL_V1_CHILDREN/);
});

test('V1.2 apply script owns the Arrow wire', async () => {
  const apply = await readFile(join(root, 'scripts/apply-cam2-tree-follow-flex.mjs'), 'utf8');
  assert.match(apply, /V1\.2 Vision: Arrow/);
  assert.match(apply, /cycleSeatShellBranchFocus/);
});
