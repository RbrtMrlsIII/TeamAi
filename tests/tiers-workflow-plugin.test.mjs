import test from 'node:test';
import assert from 'node:assert/strict';
import { assertParticipantLimit, PluginRegistry, WorkspaceMcpServer } from '../dist/src/index.js';
import { transition } from '../dist/src/state-machine.js';

test('free tier permits one AI and rejects two', () => {
  assert.doesNotThrow(() => assertParticipantLimit('free', 1));
  assert.throws(() => assertParticipantLimit('free', 2), /at most 1 AI participants/);
});

test('starter is first multi-AI tier', () => {
  assert.doesNotThrow(() => assertParticipantLimit('starter', 2));
});

test('workflow and plugin primitives remain available', () => {
  let state = 'DISCUSSING';
  state = transition(state, 'DISCUSSION_COMPLETE');
  state = transition(state, 'START_SUMMARY');
  assert.equal(state, 'SUMMARIZING');
  const registry = new PluginRegistry();
  registry.publish({ id: 'demo', developerId: 'dev', name: 'Demo', version: '1.0.0', description: 'Demo', requiredConfig: [], capabilities: [], status: 'published' });
  assert.equal(registry.list().length, 1);
  const workspace = new WorkspaceMcpServer(new Map([['README.md', 'ok']]));
  assert.equal(workspace.id, 'workspace');
});
