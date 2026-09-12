import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const validator = join(process.cwd(), 'scripts/governance/verify-issue-comment.mjs');

function runValidator(body) {
  const dir = join(tmpdir(), `teamai-issue-comment-${process.pid}-${Date.now()}`);
  return (async () => {
    await mkdtemp(dir);
    const eventPath = join(dir, 'event.json');
    await writeFile(eventPath, JSON.stringify({
      action: 'created',
      issue: { number: 278, pull_request: null },
      comment: { user: { type: 'User' }, body },
    }));
    try {
      return spawnSync(process.execPath, [validator], {
        env: { ...process.env, GITHUB_EVENT_PATH: eventPath },
        encoding: 'utf8',
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  })();
}

test('accepts a strict evidence-only comment', async () => {
  const result = await runValidator(`DIAGNOSIS:\nThe observed implementation path was reviewed.\n\nREAL DATA:\nHEAD=example; workflow=governance.\n\nWARNINGS:\nNo proof claim is made here.\n\nEXECUTED:\nA bounded review slice was executed.`);
  assert.equal(result.status, 0, result.stderr);
});

test('rejects a comment that hides a planning directive inside evidence prose', async () => {
  const result = await runValidator(`DIAGNOSIS:\nObserved current behavior.\n\nREAL DATA:\nHEAD=example.\n\nWARNINGS:\nWe should refactor the camera before continuing.\n\nEXECUTED:\nReview slice executed.`);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /evidence-only/i);
});

test('rejects proof/completion claims in EXECUTED section', async () => {
  const result = await runValidator(`DIAGNOSIS:\nObserved the updated route.\n\nREAL DATA:\nBrowser check recorded.\n\nWARNINGS:\nFinal proof is pending.\n\nEXECUTED:\nSlice executed and PROVEN.`);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /EXECUTED section may record activity only/i);
});
