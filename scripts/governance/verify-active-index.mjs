import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const manifestRelative = ".github/teamai/execution-state.yml";
const canonicalIndexes = [
  "MASTERPLAN.md",
  "docs/TEAMAI_029_CURRENT_STATE_MAP.md",
  "docs/TEAMAI_3D_HERO_NEXT_SLICES.md",
  "docs/SKILL_WIRING.md",
];
const historicalPrefixes = ["docs/evidence/", "docs/project-guide/HandOver-", "docs/project-guide/Endorsement"];
const implementationPrefixes = ["public/", "backend/", "supabase/", "skills/frontend/"];

function git(args) { return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim(); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), "utf8"); }
function stop(message) { throw new Error(message); }

function parseClaims(manifest) {
  const block = manifest.match(/^claims:\s*\n([\s\S]*?)(?=^canonical_indexes:)/m)?.[1];
  if (!block) stop("manifest missing claims section");
  const claims = {};
  let current = null;
  let mode = null;
  for (const line of block.split("\n")) {
    const claim = line.match(/^  ([A-Z0-9-]+):$/);
    if (claim) { current = claim[1]; claims[current] = { evidence: [], indexes: [] }; mode = null; continue; }
    if (!current) continue;
    const state = line.match(/^    state:\s+([^\s]+)$/);
    if (state) { claims[current].state = state[1]; continue; }
    if (line.trim() === "evidence:") { mode = "evidence"; continue; }
    if (line.trim() === "indexes:") { mode = "indexes"; continue; }
    const item = line.match(/^      - (.+)$/);
    if (item && mode) claims[current][mode].push(item[1].trim());
  }
  for (const [id, claim] of Object.entries(claims)) {
    if (!claim.state || !claim.evidence.length || !claim.indexes.length) stop(`claim ${id} is incomplete in execution-state.yml`);
  }
  return claims;
}

function parseIndexMarkers() {
  const markers = new Map();
  const markerRe = /<!--\s*teamai-claim:\s*([A-Z0-9-]+)\s+state=([A-Z0-9_]+)\s*-->/g;
  for (const index of canonicalIndexes) {
    if (!exists(index)) stop(`required active index is missing: ${index}`);
    markers.set(index, [...read(index).matchAll(markerRe)].map((m) => ({ id: m[1], state: m[2] })));
  }
  return markers;
}

function assertManifestShape(manifest) {
  if (!/^schema:\s+1$/m.test(manifest)) stop("unsupported or missing manifest schema");
  if (!/^manifest_version:\s+2026-09-10\.1$/m.test(manifest)) stop("unexpected manifest version");
  if (!/^  spatial:\n(?:    .*\n)*    current:\s+V3\.3\n/m.test(manifest)) stop("spatial frontier is not V3.3");
  if (!/^    gate:\s+SP-07$/m.test(manifest)) stop("spatial gate is not SP-07");
  if (!/^    status:\s+NEXT_AUTHORIZED$/m.test(manifest)) stop("spatial frontier status is not NEXT_AUTHORIZED");
  if (!/^  fail_closed:\s+true$/m.test(manifest)) stop("manifest fail_closed must remain true");
}

function assertClaims(claims, markers) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const index of claim.indexes) {
      const found = markers.get(index) ?? [];
      const matches = found.filter((x) => x.id === id);
      if (matches.length !== 1 && index !== "MASTERPLAN.md") stop(`claim ${id} must appear exactly once in ${index}; found ${matches.length}`);
    }
  }
  for (const [index, found] of markers) {
    for (const marker of found) {
      if (!claims[marker.id]) stop(`unknown claim marker ${marker.id} in ${index}`);
      if (claims[marker.id].state !== marker.state) stop(`claim ${marker.id} state mismatch in ${index}`);
      if (index !== "MASTERPLAN.md" && !claims[marker.id].indexes.includes(index)) stop(`claim ${marker.id} appears in undeclared active index ${index}`);
    }
  }
  const masterplan = read("MASTERPLAN.md");
  if (!masterplan.includes("**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.")) stop("MASTERPLAN no longer records bounded TEAM-BACKEND-001 endorsement state");
  if (!masterplan.includes("Vision V3.3 / SP-07 next")) stop("MASTERPLAN no longer records the V3.3/SP-07 frontier");
}

function assertEvidence(claims) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const evidence of claim.evidence) if (!exists(evidence)) stop(`claim ${id} references missing evidence: ${evidence}`);
  }
  const checks = {
    "SPATIAL-V3.3": [["docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md", "V3.3 — Gentle Hero atmosphere"], ["docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md", "NEXT AUTHORIZED SPATIAL COMMAND"]],
    "BACKEND-001-ENDORSED": [["handover/TEAM-BACKEND-001_2026-09-07_PayPal-Aggregate-ReRead.md", "ENDORSED"]],
    "BACKEND-GATE4": [["docs/CHECKPOINT_TEAM-BACKEND-001_GATE4_PARKED_2026-09-03.md", "PARKED"]],
    "BACKEND-PROVIDER": [["docs/TEAM-BACKEND-001_TASK_EXECUTE_EDGE.md", "stub-edge-runtime"]],
    "CONN3": [["docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md", "POST"], ["docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md", "Not a Hero live bind"]],
  };
  for (const [id, expected] of Object.entries(checks)) for (const [file, snippet] of expected) if (!read(file).includes(snippet)) stop(`claim ${id} evidence/content check failed: ${file} missing ${snippet}`);
}

function changedRows(base) {
  if (!base) stop("base commit is required");
  const output = git(["diff", "--name-status", `${base}...HEAD"]);
  return output ? output.split("\n").filter(Boolean).map((row) => row.split("\t")) : [];
}

function assertHistoricalImmutability(rows) {
  for (const parts of rows) {
    const status = parts[0];
    const paths = status.startsWith("R") || status.startsWith("C") ? parts.slice(1) : [parts[1]];
    for (const rel of paths.filter(Boolean)) {
      if (!historicalPrefixes.some((prefix) => rel.startsWith(prefix))) continue;
      if (status.startsWith("A") && !status.startsWith("R") && !status.startsWith("C")) continue;
      stop(`historical existing evidence is immutable; changed path: ${rel}`);
    }
  }
  for (const parts of rows) if (parts[0].startsWith("R") && parts[1] && historicalPrefixes.some((p) => parts[1].startsWith(p))) stop(`historical evidence rename is forbidden: ${parts[1]} → ${parts[2]}`);
}

function assertCoupling(rows, manifest) {
  const changed = rows.map((parts) => parts[parts.length - 1]);
  const has = (prefixes) => changed.some((file) => prefixes.some((prefix) => file.startsWith(prefix)));
  const requireAll = (label, paths) => {
    const missing = paths.filter((p) => !changed.includes(p));
    if (missing.length) stop(`${label} implementation changed without active-index reconciliation: ${missing.join(", ")}`);
  };
  if (has(["public/", "skills/frontend/spatial/"])) requireAll("spatial", ["MASTERPLAN.md", "docs/TEAMAI_029_CURRENT_STATE_MAP.md", "docs/TEAMAI_3D_HERO_NEXT_SLICES.md"]);
  if (has(["backend/", "supabase/"])) requireAll("backend", ["MASTERPLAN.md", "docs/TEAMAI_029_CURRENT_STATE_MAP.md", "backend/BACKEND_LIVE_SERVICE_STATUS.md"]);
  if (has(["skills/"]) && !changed.includes("docs/SKILL_WIRING.md")) stop("skills changed without docs/SKILL_WIRING.md synchronization");
  if (!/coupling:\s*\n[\s\S]*- public\//.test(manifest)) stop("manifest coupling configuration missing spatial public root");
  if (!/coupling:\s*\n[\s\S]*- backend\//.test(manifest)) stop("manifest coupling configuration missing backend root");
}

function assertFreshness(rows) {
  const changed = rows.map((parts) => parts[parts.length - 1]);
  const implFiles = changed.filter((file) => implementationPrefixes.some((prefix) => file.startsWith(prefix)));
  if (!implFiles.length) return;
  const latestIndexTime = Number(git(["log", "-1", "--format=%ct", "HEAD", "--", ...canonicalIndexes]));
  for (const file of implFiles) {
    const implementationTime = Number(git(["log", "-1", "--format=%ct", "HEAD", "--", file]));
    if (!latestIndexTime || !implementationTime || latestIndexTime < implementationTime) stop(`active indexes are older than implementation change ${file}`);
  }
}

function baseSha() {
  return process.argv.find((arg) => arg.startsWith("--base="))?.slice(7) || process.env.GITHUB_BASE_SHA || process.env.BASE_SHA || null;
}
function requestedMode() { return process.argv.find((arg) => arg.startsWith("--mode="))?.slice(7) || "all"; }

try {
  if (!exists(manifestRelative)) stop("execution-state.yml is missing");
  const manifest = read(manifestRelative);
  const claims = parseClaims(manifest);
  assertManifestShape(manifest);
  const markers = parseIndexMarkers();
  assertClaims(claims, markers);
  const mode = requestedMode();
  const base = baseSha();
  if (mode === "all" || mode === "governance") {
    const rows = changedRows(base);
    assertHistoricalImmutability(rows);
    assertCoupling(rows, manifest);
    assertFreshness(rows);
  }
  if (mode === "all" || mode === "evidence") assertEvidence(claims);
  console.log(`governance validator: PASS (${mode})`);
} catch (error) {
  console.error(`GOVERNANCE-DRIFT: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
