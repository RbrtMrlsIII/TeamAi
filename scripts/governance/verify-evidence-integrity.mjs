import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const fail = (m) => { console.error(`EVIDENCE_INTEGRITY=FAIL\n${m}`); process.exit(1); };
const manifest = read('.github/teamai/execution-state.yml');
if (!/^schema:\s+1$/m.test(manifest)) fail('manifest schema must be 1');
for (const p of ['Product_Law/PRODUCT_LAW.md','Product_Law/WIRING.md','Masterplan/MASTERPLAN.md','Masterplan/NEXT_SLICES.md','POLICY.md','docs/SKILL_WIRING.md','AI_ASSISTANT_READ_ME.md','PRODUCT-KNOWLEDGE.md']) if (!exists(p)) fail(`missing canonical root: ${p}`);
if (!/draft_before_merge:\s+true/.test(manifest)) fail('draft-first rule missing');
if (!/auto_merge:\s+false/.test(manifest)) fail('no-auto-merge policy missing');
if (exists('docs/project-guide/HandOver.md')) fail('active HandOver.md must be retired');
if (exists('docs/project-guide/Endorsement.md')) fail('active Endorsement.md must be retired');
if (exists('docs/skills')) fail('parallel docs/skills namespace must be retired');
const session = read('AI_ASSISTANT_READ_ME.md');
if (!/validation-change guide|Validation-change guide/i.test(session)) fail('validation-change guide missing from session boundary');
if (!/There is no live `HandOver\.md`/.test(session)) fail('live HandOver retirement is not recorded');
if (!/There is no active `Endorsement\.md`/.test(session)) fail('active Endorsement retirement is not recorded');
for (const line of manifest.split(/\r?\n/)) {
  const m = /^\s*-\s+(.+)$/.exec(line);
  if (!m) continue;
  const p = m[1].trim();
  if (p.endsWith('.md') && p.includes('/') && !exists(p)) fail(`manifest evidence path missing: ${p}`);
}
console.log('EVIDENCE_INTEGRITY=PASS');
