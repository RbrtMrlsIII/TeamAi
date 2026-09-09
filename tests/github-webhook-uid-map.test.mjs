import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadModule() {
  return import(join(root, 'dist/src/backend/github-installation.js'));
}

describe('Conn-2 GitHub webhook UID map', () => {
  it('Firestore paths are UID-rooted plus a server-only index', async () => {
    const m = await loadModule();
    assert.equal(m.githubInstallationIndexPath('42'), 'githubInstallationIndex/42');
    assert.equal(
      m.githubInstallationPath('uid-abc', '42'),
      'accounts/uid-abc/githubInstallations/42',
    );
    assert.throws(() => m.githubInstallationIndexPath(''));
    assert.throws(() => m.githubInstallationPath('', '1'));
  });

  it('HMAC accepts a matching X-Hub-Signature-256 and rejects mismatch', async () => {
    const m = await loadModule();
    const secret = 'test-webhook-secret';
    const body = '{"installation":{"id":99}}';
    const good = 'sha256=' + createHmac('sha256', secret).update(body, 'utf8').digest('hex');
    assert.deepEqual(
      m.verifyGitHubWebhookSignature({ secret, rawBody: body, signatureHeader: good }),
      { ok: true },
    );
    assert.equal(
      m.verifyGitHubWebhookSignature({
        secret,
        rawBody: body,
        signatureHeader: 'sha256=deadbeef',
      }).ok,
      false,
    );
  });

  it('missing webhook secret is 503, missing signature is 401', async () => {
    const m = await loadModule();
    const missingSecret = m.verifyGitHubWebhookSignature({
      secret: null,
      rawBody: '{}',
      signatureHeader: 'sha256=ab',
    });
    assert.equal(missingSecret.reason, 'missing_secret');
    assert.equal(m.httpStatusForGitHubWebhookSignature(missingSecret), 503);

    const missingSig = m.verifyGitHubWebhookSignature({
      secret: 's',
      rawBody: '{}',
      signatureHeader: null,
    });
    assert.equal(missingSig.reason, 'missing_signature');
    assert.equal(m.httpStatusForGitHubWebhookSignature(missingSig), 401);
  });

  it('extracts installation id from GitHub payload shapes', async () => {
    const m = await loadModule();
    assert.equal(m.extractGitHubInstallationId({ installation: { id: 7 } }), '7');
    assert.equal(m.extractGitHubInstallationId({ installation_id: '88' }), '88');
    assert.equal(m.extractGitHubInstallationId({}), null);
  });

  it('bind is server-owned; webhook ack does not mint a UID', async () => {
    const m = await loadModule();
    const bound = m.bindGitHubInstallation({
      firebaseUid: 'uid-1',
      installationId: '55',
      createdAt: '2026-09-10T00:00:00.000Z',
    });
    assert.equal(bound.status, 'bound');
    assert.equal(bound.installationPath, 'accounts/uid-1/githubInstallations/55');

    const unbound = m.githubWebhookAck({ installationId: '55', mapped: false });
    assert.equal(unbound.mapping, 'unbound');
    assert.equal(unbound.accepted, true);
  });

  it('Edge webhook enforces HMAC, 503, unbound ack, and does not invent a URL or UID', () => {
    const edge = readFileSync(join(root, 'supabase/functions/teamai-github-webhook/index.ts'), 'utf8');
    assert.match(edge, /webhook_secret_not_configured/);
    assert.match(edge, /github_signature_mismatch/);
    assert.match(edge, /mapping: "unbound"/);
    assert.match(edge, /githubInstallationIndex/);
    assert.match(edge, /githubInstallations/);
    assert.doesNotMatch(edge, /029[- ]released/i);
    assert.doesNotMatch(edge, /sender\.login/);
    assert.doesNotMatch(edge, /https:\/\/.*supabase\.co\/functions\/v1\/teamai-github-webhook/);
    assert.match(edge, /Does not mint firebaseUid/);
  });

  it('skill and contract docs stay presentation-honest', () => {
    const skill = readFileSync(join(root, 'skills/workspace/ws.github.webhook-uid-map/SKILL.md'), 'utf8');
    const contract = readFileSync(
      join(root, 'docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md'),
      'utf8',
    );
    for (const text of [skill, contract]) {
      assert.doesNotMatch(text, /029[- ]released/i);
      assert.match(text, /not a Hero live bind/i);
      assert.match(text, /Conn-3/);
    }
  });

  it('firestore rules deny client writes on installation paths', () => {
    const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
    assert.match(rules, /githubInstallations\/\{installationId\}/);
    assert.match(rules, /githubInstallationIndex\/\{installationId\}/);
    assert.match(rules, /allow write: if false/);
  });
});
