import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const stackSrc = fs.readFileSync(path.join(process.cwd(), 'public/hero-seat-stack.js'), 'utf8');
const cssSrc = fs.readFileSync(path.join(process.cwd(), 'public/hero-seat-stack.css'), 'utf8');

test('seat stack exposes identity → responsibility → connection ladder', () => {
  for (const id of ['identity', 'responsibility', 'connection', 'behavior', 'capabilities', 'authorization', 'workspace', 'task']) {
    assert.match(stackSrc, new RegExp(`id: '${id}'`));
  }
  const identityAt = stackSrc.indexOf("id: 'identity'");
  const responsibilityAt = stackSrc.indexOf("id: 'responsibility'");
  const connectionAt = stackSrc.indexOf("id: 'connection'");
  assert.ok(identityAt >= 0 && responsibilityAt > identityAt && connectionAt > responsibilityAt);
});

test('connection health is presentation-only API surface', () => {
  assert.match(stackSrc, /setConnectionHealth/);
  assert.match(stackSrc, /getConnectionHealth/);
  assert.match(stackSrc, /teamai:web-ai-seat-connection-health/);
  assert.match(stackSrc, /presentationOnly: true/);
  assert.match(stackSrc, /durable: false/);
  for (const h of ['unknown', 'offline', 'degraded', 'healthy']) {
    assert.match(stackSrc, new RegExp(h));
  }
  assert.doesNotMatch(stackSrc, /getFirestore|writeBatch|scheduler\.pick|paypal/i);
});

test('responsibility dial is presentation-only', () => {
  assert.match(stackSrc, /setResponsibilityDial/);
  assert.match(stackSrc, /teamai:web-ai-seat-responsibility-dial/);
  assert.match(cssSrc, /seat-stack__dial/);
  assert.match(cssSrc, /data-health=healthy/);
});

test('workspace task evidence anchors are presentation-only', () => {
  assert.match(stackSrc, /setWorkspaceTaskPresentation/);
  assert.match(stackSrc, /getWorkspaceTaskPresentation/);
  assert.match(stackSrc, /teamai:web-ai-seat-workspace-task-preview/);
  assert.match(stackSrc, /systemOfRecord: false/);
  for (const state of ['idle', 'queued', 'running', 'blocked', 'complete', 'failed']) {
    assert.match(stackSrc, new RegExp(`${state}:`));
  }
  for (const ev of ['pending', 'recorded', 'disputed']) {
    assert.match(stackSrc, new RegExp(ev));
  }
  assert.match(cssSrc, /data-task-state=running/);
  assert.match(cssSrc, /data-workspace-ready=true/);
  assert.match(cssSrc, /data-evidence-state=disputed/);
  assert.match(stackSrc, /Workspace ≠ Firestore/);
});
