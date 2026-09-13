import fs from 'node:fs';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) throw new Error('GITHUB_EVENT_PATH is required');

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const issue = event.issue ?? {};
const comment = event.comment ?? {};

// This governance rule applies to any issue explicitly opted in via the
// governance-comment-lock label, rather than a single hardcoded issue number.
const issueLabels = Array.isArray(issue.labels)
  ? issue.labels.map((label) => (typeof label === 'string' ? label : label.name))
  : [];
if (!issueLabels.includes('governance-comment-lock') || issue.pull_request) {
  console.log('issue-comment governance: SKIP (missing governance-comment-lock label)');
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

const body = String(comment.body ?? '').trim().replaceAll('\r\n', '\n');
const errors = [];

const SECTION_NAMES = ['DIAGNOSIS', 'REAL DATA', 'WARNINGS', 'EXECUTED'];
const sectionHeader = /^(DIAGNOSIS|REAL DATA|WARNINGS|EXECUTED):\s*$/;
const lines = body.split('\n');

if (!body) {
  errors.push('new comments on this issue must not be empty');
}

// New comments are deliberately schema-bound evidence records. This makes the
// rule stronger than a keyword filter: prose outside the four evidence fields
// is rejected instead of being interpreted by convention.
if (body) {
  if (!sectionHeader.test(lines[0])) {
    errors.push('new comments on this issue must begin with one of: DIAGNOSIS:, REAL DATA:, WARNINGS:, EXECUTED:');
  }

  const sections = [];
  let current = null;

  for (const line of lines) {
    const header = line.match(sectionHeader);
    if (header) {
      current = { name: header[1], lines: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      // Already reported above; retain a single deterministic structural error.
      continue;
    }

    if (/^\s*#{1,6}\s+/.test(line)) {
      errors.push('comments may not contain additional Markdown headings; use only the four evidence sections');
    }

    current.lines.push(line);
  }

  const seen = new Set();
  for (const section of sections) {
    if (seen.has(section.name)) errors.push(`duplicate ${section.name}: section`);
    seen.add(section.name);
    if (!SECTION_NAMES.includes(section.name)) errors.push(`unknown comment section: ${section.name}`);
  }

  const present = new Set(sections.map((section) => section.name));
  for (const name of SECTION_NAMES) {
    if (!present.has(name)) {
      errors.push(`missing required evidence section: ${name}:`);
    }
  }

  // Checklists and explicit planning/directive language are forbidden even
  // inside otherwise valid evidence sections.
  const forbiddenPatterns = [
    /(^|\n)\s*-\s*\[[ xX]\]\s+/,
    /\bchecklist\b/i,
    /\b(?:implementation|execution)\s+plan\b/i,
    /\b(?:next steps|next authorized action|recommended next|recommended next slice|what to do next|do this next)\b/i,
    /\b(?:acceptance checklist|implementation queue|next-slice queue)\b/i,
    /\b(?:we|agent|you)\s+should\b/i,
    /\b(?:please|must|need to|needs to|todo|to-do)\b/i,
    /\b(?:recommend|recommended)\b/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(body)) errors.push('comments are evidence-only and may not contain planning/directive language: ' + pattern);
  }

  // Executed is an activity fact only. Do not allow an EXECUTED section to
  // promote that activity into proof/completion/acceptance.
  const executedSection = sections.find((section) => section.name === 'EXECUTED');
  const executedText = executedSection?.lines.join('\n') ?? '';

  if (/\b(?:PROVEN|VERIFIED|RUNTIME-PROVEN|COMPLETED|COMPLETE|ACCEPTED|ENDORSED|DONE)\b/i.test(executedText)) {
    errors.push('EXECUTED section may record activity only; proof/completion/acceptance/endorsement belongs to the validation and evidence system');
  }

  // Allow negative evidence statements such as "not proven", but reject
  // positive proof claims anywhere in the comment.
  const withoutNegation = body.replace(/\b(?:not|never|un|without|pending)\s+(?:yet\s+)?(?:proven|verified|complete|accepted|endorsed|done)\b/gi, '');
  if (/\b(?:is|are|was|were|now|fully|already|has been|have been|has now been|have now been)\s+(?:runtime-)?(?:proven|verified|complete|accepted|endorsed|done)\b/i.test(withoutNegation)) {
    errors.push('new comments on this issue may not claim proof/completion/acceptance; record observation only and leave proof to validation/evidence state');
  }
}

if (errors.length) {
  console.error('ISSUE-COMMENT-GOVERNANCE: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('issue-comment governance: PASS (strict four-section evidence format)');
