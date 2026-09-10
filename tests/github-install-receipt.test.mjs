/**
 * Conn-3.1 contract — post-install return receipt is presentation-only.
 * Not a Hero live bind. No 029 production-release claim.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("Conn-3 GET returns 303 to GitHub Pages /hero/ (trailing slash)", () => {
  const src = readFileSync(join(root, "supabase/functions/teamai-github-oauth-bind/index.ts"), "utf8");
  assert.match(src, /status: 303/);
  assert.match(src, /rbrtmrlsiii\.github\.io\/TeamAi\/hero\//);
  assert.match(src, /HERO_HOME = "https:\/\/rbrtmrlsiii\.github\.io\/TeamAi\/hero\/"/);
  assert.doesNotMatch(src, /HERO_HOME = "https:\/\/rbrtmrlsiii\.github\.io\/TeamAi\/hero";/);
  assert.match(src, /Does NOT mint UID|never writes Firestore/i);
});

test("Hero and Command Deck ship a presentation-only install receipt", () => {
  const heroJs = join(root, "public/hero-github-install-receipt.js");
  const spatialJs = join(root, "frontend/spatial/github-install-receipt.js");
  assert.ok(existsSync(heroJs));
  assert.ok(existsSync(spatialJs));
  for (const file of [heroJs, spatialJs]) {
    const src = readFileSync(file, "utf8");
    assert.match(src, /github=installed|github !== "installed"/);
    assert.match(src, /Not a Hero live bind/);
    assert.match(src, /presentation-only|presentationOnly/);
    assert.match(src, /Does NOT write Firestore/);
    assert.doesNotMatch(src, /getFirestore|firebase\/firestore|collection\(/);
    assert.doesNotMatch(src, /functions\/v1\/teamai-github-oauth-bind/);
    assert.doesNotMatch(src, /029-released|029 released/);
  }
  const heroHtml = readFileSync(join(root, "public/index.html"), "utf8");
  const spatialHtml = readFileSync(join(root, "frontend/spatial/index.html"), "utf8");
  assert.match(heroHtml, /hero-github-install-receipt\.js/);
  assert.match(heroHtml, /data-github-install-receipt/);
  assert.match(spatialHtml, /github-install-receipt\.js/);
  assert.match(spatialHtml, /data-github-install-receipt/);
});

test("operator manual flags Conn-3 Edge redeploy on the existing deployment file", () => {
  const manual = readFileSync(join(root, "docs/USER_MANUAL_DEPLOYMENT.md"), "utf8");
  assert.match(manual, /teamai-github-oauth-bind/);
  assert.match(manual, /HTTP 303/);
  assert.match(manual, /Human-only MASTERPLAN remainders/);
  assert.match(manual, /Gate 4/);
  assert.match(manual, /Do not create another deployment file/);
});
