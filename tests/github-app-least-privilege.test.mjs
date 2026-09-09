/**
 * Conn-1 — GitHub App least-privilege matrix (planning, not live bind).
 * No 029-released claim.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const matrix = JSON.parse(
  readFileSync(new URL('../public/github-app-permission-matrix.json', import.meta.url), 'utf8'),
);
const skill = readFileSync(
  new URL('../skills/workspace/ws.github.app-least-privilege/SKILL.md', import.meta.url),
  'utf8',
);
const doc = readFileSync(
  new URL('../docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md', import.meta.url),
  'utf8',
);

test('v1 grants the engineering minimum and no more', () => {
  assert.equal(matrix.repositoryPermissions.grant.metadata, 'read');
  assert.equal(matrix.repositoryPermissions.grant.contents, 'write');
  assert.equal(matrix.repositoryPermissions.grant.pull_requests, 'write');
  assert.equal(matrix.repositoryPermissions.grant.issues, 'write');
  assert.equal(matrix.repositoryPermissions.grant.checks, 'read');
  assert.equal(matrix.repositoryPermissions.grant.statuses, 'read');
  assert.equal(matrix.repositoryPermissions.grant.actions, 'read');
});

test('v1 never-list blocks admin, secrets, org-adjacent, and workflow mutation', () => {
  const never = matrix.repositoryPermissions.never;
  for (const key of [
    'administration',
    'secrets',
    'variables',
    'environments',
    'codespaces',
    'dependabot_secrets',
    'workflows',
    'merge_queues',
    'copilot',
  ]) {
    assert.ok(never.includes(key), `missing never-grant: ${key}`);
  }
  assert.equal(matrix.organizationPermissions, 'none');
  assert.equal(matrix.accountPermissions, 'none');
  assert.equal(matrix.enterprisePermissions, 'none');
});

test('form requires OAuth-on-install, token expiry, and dark webhook until HTTPS', () => {
  assert.equal(matrix.form.requestUserAuthorizationOauth, true);
  assert.equal(matrix.form.expireUserAuthorizationTokens, true);
  assert.equal(matrix.form.webhookActiveUntilHttpsReady, false);
  assert.equal(matrix.form.enableDeviceFlow, false);
  assert.equal(matrix.form.whereCanBeInstalled, 'only_this_account_until_public');
});

test('product-law boundaries are explicit on the matrix', () => {
  assert.match(matrix.productLaw.githubRole, /engineering\/source/i);
  assert.match(matrix.productLaw.githubActionsRole, /never Web AI scheduler/i);
  assert.match(matrix.productLaw.durableDomain, /Firestore/i);
  assert.match(matrix.productLaw.supabasePostgres, /never TeamAi domain/i);
  assert.equal(matrix.safeguards.noDirectPushToDefaultBranch, true);
  assert.equal(matrix.safeguards.browserNeverSelfAttestsInstall, true);
  assert.equal(matrix.safeguards.noPatPasteIntoTeamChat, true);
});

test('skill and doc stay presentation-honest and point at the matrix', () => {
  assert.match(skill, /NOT PRODUCT LAW/);
  assert.match(skill, /Skills ≠ authorization|does not grant/i);
  assert.match(skill, /Firestore/);
  assert.match(doc, /no 029-released claim/);
  assert.match(doc, /Request user authorization \(OAuth\) during installation/);
  assert.match(doc, /Actions \*\*write\*\* is not required for v1/i);
  assert.match(doc, /ALTER TABLE users ADD github_installation_id/);
});
