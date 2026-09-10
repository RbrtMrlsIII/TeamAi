/**
 * Conn-3 contract tests — OAuth/install bind of firebaseUid ↔ installation_id.
 * No 029 production-release claim. Not a Hero live bind.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("backend bindGitHubInstallation helper exists and is server-mint oriented", () => {
  const src = readFileSync(join(root, "src/backend/github-installation.ts"), "utf8");
  assert.match(src, /export function bindGitHubInstallation/);
  assert.match(src, /githubInstallationIndex/);
  assert.match(src, /status: 'bound'/);
  assert.match(src, /Conn-3|trusted Edge/);
  assert.doesNotMatch(src, /029-released|029 released/);
});

test("Conn-3 Edge requires Firebase Bearer and installationId", () => {
  const edge = join(root, "supabase/functions/teamai-github-oauth-bind/index.ts");
  assert.ok(existsSync(edge), "teamai-github-oauth-bind Edge function must exist");
  const src = readFileSync(edge, "utf8");
  assert.match(src, /missing_firebase_id_token/);
  assert.match(src, /installation_id_required/);
  assert.match(src, /githubInstallationIndex/);
  assert.match(src, /githubInstallations/);
  assert.match(src, /installation_bound_to_other_uid/);
  assert.doesNotMatch(src, /029-released|029 released/);
  assert.doesNotMatch(src, /sender\.login/);
  assert.match(src, /teamai-devtools|conn3_oauth_bind/);
  assert.match(src, /method === "GET"|GitHub install received/);
});

test("skill and contract docs exist for Conn-3", () => {
  assert.ok(existsSync(join(root, "docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md")));
  assert.ok(existsSync(join(root, "skills/workspace/ws.github.oauth-uid-bind/SKILL.md")));
  const contract = readFileSync(join(root, "docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md"), "utf8");
  assert.doesNotMatch(contract, /029-released|029 released/);
  assert.match(contract, /Not a Hero live bind|not a Hero live bind/i);
  assert.match(contract, /teamai-github-oauth-bind/);
});

test("operator manual records App teamai-devtools and Supabase ref", () => {
  const manual = readFileSync(join(root, "docs/USER_MANUAL_DEPLOYMENT.md"), "utf8");
  assert.match(manual, /srpgzzretfyqdsfclnuo/);
  assert.match(manual, /teamai-devtools/);
});
