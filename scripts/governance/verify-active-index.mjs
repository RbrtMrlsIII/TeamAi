import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const manifestPath = path.join(root, ".github/teamai/execution-state.yml");
const canonicalIndexes = [
  "MASTERPLAN.md",
  "docs/TEAMAI_029_CURRENT_STATE_MAP.md",
  "docs/TEAMAI_3D_HERO_NEXT_SLICES.md",
  "docs/SKILL_WIRING.md",
];
const historicalPrefixes = [
  "docs/evidence/",
  "docs/project-guide/HandOver-",
  "docs/project-guide/Endorsement",
];

function fail(message) {
  console.error(`GOVERNANCE-DRIFT: ${message}`);
  process.exitCode = 1;
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function parseScalar(text, key) {
  const re = new RegExp(`^${key}:\\s+([^\\n]+)$`, "m");
  const match = text.match(re);
  return match?.[1]?.trim() ?? null;
}

function parseClaims(manifest) {
  const block = manifest.match(/^claims:\s*\n([\\s\\S]*?)(?=^canonical_indexes:)/m)?.[1];
  if (!block) throw new Error("manifest missing claims section");

  const lines = block.split("\\n");
  const claims = {};
  let current = null;
  let mode = null;
  for (const line of lines) {
    const claim = line.match(/^  ([A-Z0-9-]+):$/);
    if (claim) {
      current = claim[1];
      claims[current] = { evidence: [], indexes: [] };
      mode = null;
      continue;
    }
    if (!current) continue;
    const state = line.match(/^    state:\s+([^\\s]+)$/);
    if (state) {
      claims[current].state = state[1];
      continue;
    }
    if (line.trim() === "evidence:") {
      mode = "evidence";
      continue;
    }
    if (line.trim() === "indexes:") {
      mode = "indexes";
      continue;
    }
    const item = line.match(/^      - (.+)$/);
    if (item && mode) claims[current][mode].push(item[1].trim());
  }

  for (const [id, claim] of Object.entries(claims)) {
    if (!claim.state || !claim.evidence.length || !claim.indexes.length) {
      throw new Error(`claim ${id} is incomplete in execution-state.yml`);
    }
  }
  return claims;
}

function markerRegex() {
  return /<!--\\s*teamai-claim:\s*([A-Z0-9-]+)\\s+state=([A-Z0-9_]+)\\s*-->/g;
}

function parseIndexMarkers() {
  const markers = new Map();
  for (const index of canonicalIndexes) {
    if (!exists(index)) throw new Error(`required active index is missing: ${index}`);
    const text = read(index);
    const found = [...text.matchAll(markerRegex())].map((m) => ({ id: m[1], state: m[2] }));
    markers.set(index, found);
  }
  return markers;
}

function assertManifestShape(manifest) {
  if (parseScalar(manifest, "schema") !== "1") throw new Error("unsupported or missing manifest schema");
  if (parseScalar(manifest, "manifest_version") !== "2026-09-10.1") throw new Error("unexpected manifest version");
  if (parseScalar(manifest, "fail_closed") !== null && parseScalar(manifest, "fail_closed") !== "true") {
    throw new Error("manifest fail_closed must remain true");
  }
  const frontier = manifest.match(/active_frontier:\s*[\\s\\S]*?canonical_indexes:/m)?.[0] ?? "";
  if (!/current:\s+V3\.3/.test(frontier)) throw new Error("spatial frontier is not V3.3");
  if (!/gate:\s+SP-07/.test(frontier)) throw new Error("spatial gate is not SP-07");
}

function assertClaims(claims, markers) {
  const markerCounts = new Map();
  for (const [index, found] of markers) {
    for (const marker of found) {
      const key = `${index}:${marker.id}`;
      markerCounts.set(key, (markerCounts.get(key) ?? 0) + 1);
      if (!claims[marker.id]) throw new Error(`unknown claim marker ${marker.id} in ${index}`);
      if (claims[marker.id].state !== marker.state) {
        throw new Error(`claim ${marker.id} state mismatch in ${index}: marker=${marker.state} manifest=${claims[marker.id].state}`);
      }
    }
  }

  for (const [id, claim] of Object.entries(claims)) {
    for (const index of claim.indexes) {
      const found = markers.get(index) ?? [];
      const matches = found.filter((x) => x.id === id);
      if (matches.length !== 1) throw new Error(`claim ${id} must appear exactly once in ${index}; found ${matches.length}`);
    }
    for (const index of canonicalIndexes) {
      const found = markers.get(index) ?? [];
      for (const marker of found) {
        if (marker.id === id && !claim.indexes.includes(index)) {
          throw new Error(`claim ${id} appears in undeclared active index ${index}`);
        }
      }
    }
  }
}

function assertEvidence(claims) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const evidence of claim.evidence) {
      if (!exists(evidence)) throw new Error(`claim ${id} references missing evidence: ${evidence}`);
    }
  }

  const requiredSnippets = {
    "SPATIAL-V3.3": [
      ["docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md", "V3.3 — Gentle Hero atmosphere"],
      ["docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md", "NEXT AUTHORIZED SPATIAL COMMAND"],
    ],
    "BACKEND-001-ENDORSED": [["handover/TEAM-BACKEND-001_2026-09-07_PayPal-Aggregate-ReRead.md", "ENDORSED"]],
    "BACKEND-GATE4": [["docs/CHECKPOINT_TEAM-BACKEND-001_GATE4_PARKED_2026-09-03.md", "PARKED"]],
    "BACKEND-PROVIDER": [["docs/TEAM-BACKEND-001_TASK_EXECUTE_EDGE.md", "stub-edge-runtime"]],
    "CONN3": [
      ["docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md", "POST"],
      ["docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md", "Not a Hero live bind"],
    ],
  };

  for (const [id, checks] of Object.entries(requiredSnippets)) {
    for (const [file, snippet] of checks) {
      if (!read(file).includes(snippet)) throw new Error(`claim ${id} evidence/content check failed: ${file} missing ${snippet}`);
    }
  }
}

function assertHistoricalImmutability(base) {
  if (!base) throw new Error("base commit is required for historical integrity validation");
  const output = git(["diff", "--name-status", `${base}...HEAD"]);
  if (!output) return;
  for (const row of output.split("\\n")) {
    if (!row) continue;
    const parts = row.split("\\t");
    const status = parts[0];
    const paths = status.startsWith("R") || status.startsWith("C") ? parts.slice(1) : [parts[1]];
    for (const rel of paths.filter(Boolean)) {
      if (historicalPrefixes.some((prefix) => rel.startsWith(prefix))) {
        if (status.startsWith("A") && !status.startsWith("R") && !status.startsWith("C")) continue;
        throw new Error(`historical existing evidence is immutable; changed path: ${rel}`);
      }
    }
    if (status.startsWith("R") && historicalPrefixes.some((prefix) => parts[1].startsWith(prefix))) {
      throw new Error(`historical evidence rename is forbidden: ${parts[1]} → ${parts[2]}`);
    }
  }
}

function assertCoupling(base) {
  if (!base) throw new Error("base commit is required for coupling validation");
  const output = git(["diff", "--name-only", `${base}...HEAD"]);
  const changed = output ? output.split("\\n").filter(Boolean) : [];
  if (!changed.length) return;

  const has = (predicate) => changed.some(predicate);
  const requireAll = (label, paths) => {
    const missing = paths.filter((p) => !changed.includes(p));
    if (missing.length) throw new Error(`${label} implementation changed without active-index reconciliation: ${missing.join(", ")}`);
  };

  if (has((f) => f.startsWith("public/") || f.startsWith("skills/frontend/spatial/"))) {
    requireAll("spatial", [
      "MASTERPLAN.md",
      "docs/TEAMAI_029_CURRENT_STATE_MAP.md",
      "docs/TEAMAI_3D_HERO_NEXT_SLICES.md",
    ]);
  }

  if (has((f) => f.startsWith("backend/") || f.startsWith("supabase/"))) {
    requireAll("backend", ["MASTERPLAN.md", "docs/TEAMAI_029_CURRENT_STATE_MAP.md", "backend/BACKEND_LIVE_SERVICE_STATUS.md"]);
  }

  if (has((f) => f.startsWith("skills/"))) {
    requireAll("skill-wiring", ["docs/SKILL_WIRING.md", "MASTERPLAN.md"]);
  }
}

function assertFreshness(base) {
  if (!base) throw new Error("base commit is required for freshness validation");
  const output = git(["diff", "--name-only", `${base}...HEAD"]);
  const changed = output ? output.split("\\n").filter(Boolean) : [];
  const implementationChanged = changed.some(
    (f) => f.startsWith("public/") || f.startsWith("backend/") || f.startsWith("supabase/") || f.startsWith("skills/frontend/")
  );
  if (!implementationChanged) return;

  const indexTouch = Number(git(["log", "-1", "--format=%ct", "HEAD", "--", ...canonicalIndexes])) || 0;
  const implementationTimes = [];
  for (const file of changed.filter((f) => f.startsWith("public/") || f.startsWith("backend/") || f.startsWith("supabase/") || f.startsWith("skills/frontend/"))) {
    const stamp = Number(git(["log", "-1", "--format=%ct", "HEAD", "--", file])) || 0;
    implementationTimes.push(stamp);
  }
  const latestImplementation = Math.max(0, ...implementationTimes);
  if (indexTouch < latestImplementation) {
    throw new Error(`active indexes are older than an implementation change (index=${indexTouch}, implementation=${latestImplementation})`);
  }
}

function mode() {
  const args = new Map();
  for (let i = 2; i < process.argv.length; i += 1) {
    const key = process.argv[i];
    if (key.startsWith("--")) args.set(key.slice(2), process.argv[i + 1] ?? "true");
  }
  return args;
}

try {
  if (!fs.existsSync(manifestPath)) throw new Error("execution-state.yml is missing");
  const manifest = fs.readFileSync(manifestPath, "utf8");
  const claims = parseClaims(manifest);
  assertManifestShape(manifest);
  const markers = parseIndexMarkers();
  assertClaims(claims, markers);
  const args = mode();
  const base = args.get("base") || process.env.GITHUB_BASE_SHA || null;
  const requested = args.get("mode") || "all";

  if (requested === "all" || requested === "governance") {
    assertHistoricalImmutability(base);
    assertCoupling(base);
    assertFreshness(base);
  }
  if (requested === "all" || requested === "evidence") {
    assertEvidence(claims);
  }

  console.log(`governance validator: PASS (${requested})`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
