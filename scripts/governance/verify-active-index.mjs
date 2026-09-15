import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { assertCensusSync } from './census-sync-contract.mjs';

const ROOT = process.cwd();
const MANIFEST = '.github/teamai/execution-state.yml';
const INDEXES = [
  'MASTERPLAN.md',
  'NEXT_SLICES.md',
  'POLICY.md',
  'docs/SKILL_WIRING.md',
  'AI_ASSISTANT_READ_ME.md',
  'PRODUCT-KNOWLEDGE.md',
  'docs/project-guide/Endorsement.md',
];
const HISTORICAL = ['docs/archive/', 'docs/evidence/', 'handover/'];
const IMPLEMENTATION = ['public/', 'frontend/', 'backend/', 'supabase/', 'skills/'];

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
  const version = text.match(/^manifest_version:\s+(\d{4}-\d{2}-\d{2}\.\d+)$/m)?.[1];
  if (!version) stop('manifest version is missing or malformed');
  if (!/^  repository:\s*$/m.test(text) || !/^    current:\s+CANONICAL_FOUNDATION$/m.test(text)) stop('repository foundation frontier is stale');
  if (!/^  auto_merge:\s+false$/m.test(text)) stop('auto_merge must remain false');
  if (!/^  draft_before_merge:\s+true$/m.test(text)) stop('draft_before_merge must remain true');
  if (!/^  no_one_slice_one_merge:\s+true$/m.test(text)) stop('one-slice/one-merge rule must remain disabled');
  if (!/^  no_obsolete_files_registry:\s+true$/m.test(text)) stop('obsolete-files registry rule must remain enabled');
  if (!/^workspace:\s*$/m.test(text) || !/^  workflow_naming:\s+responsibility_specific$/m.test(text)) stop('workspace naming contract is stale');
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
      if (index === 'MASTERPLAN.md') continue;
      if (index === 'NEXT_SLICES.md' && !matches.length) continue;
      if (matches.length !== 1) stop('claim ' + id + ' must appear exactly once in ' + index);
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
  if (!masterplan.includes('## Merge discipline')) stop('MASTERPLAN merge discipline is missing');
  if (!masterplan.includes('Substantive work starts as **draft PRs**.')) stop('MASTERPLAN draft-first rule is stale');
  const next = read('NEXT_SLICES.md');
  if (!next.includes('## Current slice')) stop('NEXT_SLICES current frontier is missing');
  if ((next.match(/^## Current slice$/gm) || []).length !== 1) stop('NEXT_SLICES must contain exactly one current frontier');
}

function assertEvidence(claims) {
  for (const [id, claim] of Object.entries(claims)) {
    for (const evidence of claim.evidence) if (!exists(evidence)) stop('claim ' + id + ' references missing evidence: ' + evidence);
  }
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
      if (status.startsWith('A') || status.startsWith('C')) continue;
      stop('historical existing evidence is immutable: ' + file);
    }
  }
}

function assertCoupling(rows, manifest) {
  const changed = rows.map((r) => r[r.length - 1]);
  const hasAny = (prefixes) => changed.some((file) => prefixes.some((prefix) => file.startsWith(prefix)));
  const requireAll = (label, paths) => {
    const missing = paths.filter((file) => !changed.includes(file));
    if (missing.length) stop(label + ' implementation changed without required canonical updates: ' + missing.join(', '));
  };
  if (hasAny(['public/', 'frontend/'])) requireAll('frontend', ['MASTERPLAN.md', 'NEXT_SLICES.md', 'AI_ASSISTANT_READ_ME.md']);
  if (hasAny(['backend/', 'supabase/'])) requireAll('backend', ['MASTERPLAN.md', 'NEXT_SLICES.md', 'AI_ASSISTANT_READ_ME.md']);
  if (hasAny(['skills/'])) requireAll('skills', ['docs/SKILL_WIRING.md', 'MASTERPLAN.md', 'AI_ASSISTANT_READ_ME.md']);
  if (hasAny(['.github/workflows/', 'build-system/'])) requireAll('governance', ['docs/SKILL_WIRING.md', 'AI_ASSISTANT_READ_ME.md']);
  if (!manifest.includes('    - public/')) stop('manifest coupling missing public root');
  if (!manifest.includes('    - backend/')) stop('manifest coupling missing backend root');
  if (!manifest.includes('    - skills/')) stop('manifest coupling missing skills root');
  assertCensusSync(rows);
}

function assertFresh(rows) {
  const changed = rows.map((r) => r[r.length - 1]);
  const impl = changed.filter((file) => IMPLEMENTATION.some((prefix) => file.startsWith(prefix)));
  if (!impl.length) return;
  const indexPaths = INDEXES.filter(exists);
  const indexStamp = Number(git(['log', '-1', '--format=%ct', 'HEAD', '--', ...indexPaths]));
  if (!indexStamp) stop('could not determine active-index freshness');
  for (const file of impl) {
    const codeStamp = Number(git(['log', '-1', '--format=%ct', 'HEAD', '--', file]));
    if (!codeStamp || indexStamp < codeStamp) stop('active canonical documents are older than implementation change: ' + file);
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
