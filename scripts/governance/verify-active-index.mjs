import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const MANIFEST = '.github/teamai/execution-state.yml';
const INDEXES = [
  'MASTERPLAN.md',
  'docs/TEAMAI_029_CURRENT_STATE_MAP.md',
  'docs/TEAMAI_3D_HERO_NEXT_SLICES.md',
  'docs/SKILL_WIRING.md',
];
const HISTORICAL = ['docs/evidence/', 'docs/project-guide/HandOver-', 'docs/project-guide/Endorsement'];
const IMPLEMENTATION = ['public/', 'backend/', 'supabase/', 'skills/frontend/'];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const stop = (m) => { throw new Error(m); };

function parseClaims(text) {
  const block = text.match(/^claims:\s*\n([\s\S]*?)(?=^canonical_indexes:)/m)?.[1];
  if (!block) stop('manifest missing claims section');
  const claims = {};
  let id = null;
  let mode = null;
  for (const line of block.split('\n')) {
    const m = line.match(/^  ([A-Z0-9-]+):$/);
    if (m) { id = m[1]; claims[id] = { evidence: [], indexes: [] }; mode = null; continue; }
    if (!id) continue;
    const s = line.match(/^    state:\s+(\S+)$/);
    if (s) { claims[id].state = s[1]; continue; }
    if (line.trim() === 'evidence:') { mode = 'evidence'; continue; }
    if (line.trim() === 'indexes:') { mode = 'indexes'; continue; }
    const item = line.match(/^      - (.+)$/);
    if (item && mode) claims[id][mode].push(item[1].trim());
  }
  for (const [claimId, claim] of Object.entries(claims)) {
    if (!claim.state || !claim.evidence.length || !claim.indexes.length) stop('claim ' + claimId + ' is incomplete');
  }
  return claims;
}

function assertManifest(text) {
  if (!/^schema:\s+1$/m.test(text)) stop('manifest schema must be 1');
  if (!/^manifest_version:\s+2026-09-10\.1$/m.test(text)) stop('manifest version is unexpected');
  if (!/^    current:\s+V3\.3$/m.test(text)) stop('spatial frontier must be V3.3');
  if (!/^    gate:\s+SP-07$/m.test(text)) stop('spatial gate must be SP-07');
  if (!/^    status:\s+NEXT_AUTHORIZED$/m.test(text)) stop('spatial status must be NEXT_AUTHORIZED');
  if (!/^  fail_closed:\s+true$/m.test(text)) stop('fail_closed must remain true');
}

function markerMap() {
  const re = /<!--\s*teamai-claim:\s*([A-Z0-9-]+)\s+state=([A-Z0-9_]+)\s*-->/g;
  const out = new Map();
  for (const file of INDEXES) {
    if (!exists(file)) stop('missing canonical active index: ' + file);
    out.set(file, [...read(file).matchAll(re)].map((m) => ({ id: m[1], state: m[2] })));
  }
  return out;
}

function assertClaims(claims, markers) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const index of claim.indexes) {
      const matches = (markers.get(index) || []).filter((m) => m.id === id);
      if (index !== 'MASTERPLAN.md' && matches.length !== 1) stop('claim ' + id + ' must appear exactly once in ' + index);
    }
  }
  for (const [file, list] of markers) {
    for (const marker of list) {
      const claim = claims[marker.id];
      if (!claim) stop('unknown claim marker ' + marker.id + ' in ' + file);
      if (claim.state !== marker.state) stop('claim ' + marker.id + ' has state mismatch in ' + file);
      if (file !== 'MASTERPLAN.md' && !claim.indexes.includes(file)) stop('claim ' + marker.id + ' is undeclared in ' + file);
    }
  }
  const masterplan = read('MASTERPLAN.md');
  if (!masterplan.includes('**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.')) stop('MASTERPLAN endorsement state is stale');
  if (!masterplan.includes('Vision V3.3 / SP-07 next')) stop('MASTERPLAN spatial frontier is stale');
}

function assertEvidence(claims) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const evidence of claim.evidence) if (!exists(evidence)) stop('claim ' + id + ' references missing evidence: ' + evidence);
  }
  const checks = [
    ['SPATIAL-V3.3', 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md', 'V3.3 — Gentle Hero atmosphere'],
    ['SPATIAL-V3.3', 'docs/TEAMAI_3D_HERO_SP07_FRONTIER_DECISION.md', 'NEXT AUTHORIZED SPATIAL COMMAND'],
    ['BACKEND-001-ENDORSED', 'handover/TEAM-BACKEND-001_2026-09-07_PayPal-Aggregate-ReRead.md', 'ENDORSED'],
    ['BACKEND-GATE4', 'docs/CHECKPOINT_TEAM-BACKEND-001_GATE4_PARKED_2026-09-03.md', 'PARKED'],
    ['BACKEND-PROVIDER', 'docs/TEAM-BACKEND-001_TASK_EXECUTE_EDGE.md', 'stub-edge-runtime'],
    ['CONN3', 'docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md', 'POST'],
    ['CONN3', 'docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md', 'Not a Hero live bind'],
  ];
  for (const [id, file, needle] of checks) if (!read(file).includes(needle)) stop('claim ' + id + ' evidence check failed in ' + file + ': missing ' + needle);
}

function changedRows(base) {
  if (!base) stop('base commit is required');
  const output = git(['diff', '--name-status', base + '...HEAD']);
  return output ? output.split('\n').filter(Boolean).map((row) => row.split('\t')) : [];
}

function currentBase() {
  if (process.env.GITHUB_EVENT_NAME === 'pull_request' || process.env.GITHUB_EVENT_NAME === 'pull_request_target') {
    try { return git(['rev-parse', 'origin/main']); } catch { return null; }
  }
  return process.env.BASE_SHA || process.env.GITHUB_BASE_SHA || null;
}

function assertHistorical(rows) {
  for (const parts of rows) {
    const status = parts[0];
    const paths = status.startsWith('R') || status.startsWith('C') ? parts.slice(1) : [parts[1]];
    for (const file of paths.filter(Boolean)) {
      if (!HISTORICAL.some((p) => file.startsWith(p))) continue;
      if (status.startsWith('A') && !status.startsWith('R') && !status.startsWith('C')) continue;
      stop('historical existing evidence is immutable: ' + file);
    }
  }
}

function assertCoupling(rows, manifest) {
  const changed = rows.map((r) => r[r.length - 1]);
  const hasAny = (prefixes) => changed.some((file) => prefixes.some((prefix) => file.startsWith(prefix)));
  const requireAll = (label, paths) => {
    const missing = paths.filter((file) => !changed.includes(file));
    if (missing.length) stop(label + ' implementation changed without required index updates: ' + missing.join(', '));
  };
  if (hasAny(['public/', 'skills/frontend/spatial/'])) requireAll('spatial', ['MASTERPLAN.md', 'docs/TEAMAI_029_CURRENT_STATE_MAP.md', 'docs/TEAMAI_3D_HERO_NEXT_SLICES.md']);
  if (hasAny(['backend/', 'supabase/'])) requireAll('backend', ['MASTERPLAN.md', 'docs/TEAMAI_029_CURRENT_STATE_MAP.md', 'backend/BACKEND_LIVE_SERVICE_STATUS.md']);
  if (hasAny(['skills/'])) requireAll('skills', ['docs/SKILL_WIRING.md', 'MASTERPLAN.md']);
  if (!manifest.includes('    - public/')) stop('manifest coupling missing public root');
  if (!manifest.includes('    - backend/')) stop('manifest coupling missing backend root');
  if (!manifest.includes('    - skills/frontend/spatial/')) stop('manifest coupling missing spatial skill root');
}

function assertFresh(rows) {
  const changed = rows.map((r) => r[r.length - 1]);
  const impl = changed.filter((file) => IMPLEMENTATION.some((prefix) => file.startsWith(prefix)));
  if (!impl.length) return;
  const indexStamp = Number(git(['log', '-1', '--format=%ct', 'HEAD', '--', ...INDEXES]));
  if (!indexStamp) stop('could not determine active-index freshness');
  for (const file of impl) {
    const codeStamp = Number(git(['log', '-1', '--format=%ct', 'HEAD', '--', file]));
    if (!codeStamp || indexStamp < codeStamp) stop('active indexes are older than implementation change: ' + file);
  }
}

const mode = process.argv.find((a) => a.startsWith('--mode='))?.slice(7) || 'all';

try {
  if (!exists(MANIFEST)) stop('execution-state.yml is missing');
  const manifest = read(MANIFEST);
  const claims = parseClaims(manifest);
  assertManifest(manifest);
  const markers = markerMap();
  assertClaims(claims, markers);
  if (mode === 'all' || mode === 'governance') {
    const base = currentBase();
    const rows = changedRows(base);
    assertHistorical(rows);
    assertCoupling(rows, manifest);
    assertFresh(rows);
  }
  if (mode === 'all' || mode === 'evidence') assertEvidence(claims);
  console.log('governance validator: PASS (' + mode + ')');
} catch (error) {
  console.error('GOVERNANCE-DRIFT: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
}
