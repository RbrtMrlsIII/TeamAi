import fs from 'node:fs';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error('GITHUB_EVENT_PATH is required');

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const issue = event.issue ?? {};
const comment = event.comment ?? {};

// This governance rule is intentionally scoped to the active 029 issue.
if (issue.number !== 278 || issue.pull_request) {
  console.log('issue-comment governance: SKIP (not Issue #278)');
  process.exit(0);
}

if (comment.user?.type === 'Bot') {
  console.log('issue-comment governance: SKIP (bot comment)');
  process.exit(0);
}

if (!['created', 'edited'].includes(event.action)) {
  console.log('issue-comment governance: SKIP (action ' + event.action + ')');
  process.exit(0);
}

const body = String(comment.body ?? '').trim();
const errors = [];

const allowedEvidenceSignals = /\b(?:diagnosis|real data|observed data|observed|warning|warnings|discrepancy|discrepancies|evidence record|executed)\b/i;
if (!allowedEvidenceSignals.test(body)) {
  errors.push('new Issue #278 comments must contain diagnosis, real observed data, a warning/discrepancy, an evidence-record marker, or an EXECUTED slice record');
}

const forbiddenPatterns = [
  /(^|\n)\s*-\s*\[[ xX]\]\s+/,
  /^\s*#{1,6}\s+.*checklist\b/im,
  /\b(?:implementation|execution)\s+plan\b/i,
  /\b(?:next steps|next authorized action|recommended next|recommended next slice|what to do next|do this next)\b/i,
  /\bacceptance checklist\b/i,
  /\bplan of record\b/i,
];
for (const pattern of forbiddenPatterns) {
  if (pattern.test(body)) errors.push('comments may not contain checklists, plans, or next-step guidance: ' + pattern);
}

const withoutExplicitNegativeProof = body.replace(/\b(?:not|never|un|without)\s+(?:yet\s+)?proven\b/gi, '');
if (/\b(?:is|are|was|were|now|fully|already|has been|have been)\s+proven\b/i.test(withoutExplicitNegativeProof)) {
  errors.push('an executed slice must not be marked PROVEN in a comment');
}
if (/\bEXECUTED\b[\s\S]{0,80}\b(?:PROVEN|COMPLETE|ACCEPTED|DONE)\b/i.test(body)) {
  errors.push('EXECUTED in a comment records activity only; proof/completion/acceptance belongs to the evidence system');
}

if (errors.length) {
  console.error('ISSUE-COMMENT-GOVERNANCE: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('issue-comment governance: PASS (evidence-only format)');
