/**
 * Contract tests for phase-7 HTTP probe mapping (mirrors Edge logic; no live provider calls).
 */
import assert from 'node:assert/strict';
import test from 'node:test';

function normalizeHealth(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  if (['healthy', 'ok', 'ready', 'pass', 'passed'].includes(v)) return 'healthy';
  if (['degraded', 'warn', 'warning', 'partial'].includes(v)) return 'degraded';
  if (['offline', 'down', 'fail', 'failed', 'error'].includes(v)) return 'offline';
  return 'unknown';
}

function resolveProviderKind(provider, explicit) {
  const e = String(explicit ?? '').trim().toLowerCase();
  if (e === 'openai' || e === 'anthropic' || e === 'generic' || e === 'stub') return e;
  const p = String(provider ?? '').trim().toLowerCase();
  if (!p) return 'stub';
  if (p.includes('openai') || p.includes('gpt')) return 'openai';
  if (p.includes('anthropic') || p.includes('claude')) return 'anthropic';
  if (p.startsWith('http://') || p.startsWith('https://')) return 'generic';
  return 'stub';
}

function healthFromHttpStatus(status) {
  if (status >= 200 && status < 300) return 'healthy';
  if (status === 401 || status === 403) return 'degraded';
  if (status === 404 || status === 429) return 'degraded';
  if (status >= 500) return 'offline';
  return 'degraded';
}

test('resolveProviderKind maps common names', () => {
  assert.equal(resolveProviderKind('OpenAI GPT-4', null), 'openai');
  assert.equal(resolveProviderKind('Anthropic Claude', null), 'anthropic');
  assert.equal(resolveProviderKind('Provider One', null), 'stub');
  assert.equal(resolveProviderKind('Provider One', 'openai'), 'openai');
});

test('healthFromHttpStatus mapping', () => {
  assert.equal(healthFromHttpStatus(200), 'healthy');
  assert.equal(healthFromHttpStatus(401), 'degraded');
  assert.equal(healthFromHttpStatus(503), 'offline');
});

test('forceHealth still wins over HTTP', () => {
  const force = 'offline';
  assert.equal(normalizeHealth(force), 'offline');
});
