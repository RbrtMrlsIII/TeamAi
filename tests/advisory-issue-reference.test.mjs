import assert from "node:assert/strict";
import fs from "node:fs";
import testCase from "node:test";

import { resolveAdvisoryIssue } from "../scripts/governance/resolve-advisory-issue.mjs";

const read = (path) => fs.readFileSync(path, "utf8");

testCase("advisory issue resolver accepts explicit numbered owning/governing issue fields", () => {
  assert.deepEqual(resolveAdvisoryIssue("Owning Issue: #406"), {
    valid: true,
    kind: "ISSUE",
    issue_number: 406,
    message: "Explicit governing issue #406 accepted.",
  });
  assert.deepEqual(resolveAdvisoryIssue("- **Governing Issue: #393**"), {
    valid: true,
    kind: "ISSUE",
    issue_number: 393,
    message: "Explicit governing issue #393 accepted.",
  });
  assert.deepEqual(resolveAdvisoryIssue("Owning Issue: **#394**"), {
    valid: true,
    kind: "ISSUE",
    issue_number: 394,
    message: "Explicit governing issue #394 accepted.",
  });
});

testCase("advisory issue resolver treats none and n/a as explicit no-issue states", () => {
  for (const value of ["none", "NONE", "n/a", "N/A"]) {
    const result = resolveAdvisoryIssue(`Owning Issue: ${value}`);
    assert.equal(result.valid, true);
    assert.equal(result.kind, "NONE");
    assert.equal(result.issue_number, null);
  }
  const governing = resolveAdvisoryIssue("- **Governing Issue: none**");
  assert.equal(governing.valid, true);
  assert.equal(governing.kind, "NONE");
});

testCase("advisory issue resolver rejects missing or malformed declarations", () => {
  assert.equal(resolveAdvisoryIssue("Issue #402 is related to this PR.").valid, false);
  assert.equal(resolveAdvisoryIssue("Owning Issue: #0").valid, false);
  assert.equal(resolveAdvisoryIssue("Owning Issue: #abc").valid, false);
  assert.equal(resolveAdvisoryIssue("Owning Issue:").valid, false);
});

testCase("automatic advisory sequence validates the issue declaration once before provider fan-out", () => {
  const sequence = read(".github/workflows/ai-advisory-review-sequence.yml");
  assert.match(sequence, /advisory_issue_preflight:/);
  assert.match(sequence, /node scripts\/governance\/resolve-advisory-issue\.mjs/);
  assert.match(sequence, /needs: \[eligibility, advisory_issue_preflight, resolve_advisory_slots, validation_gate\]/);
});

testCase("manual all-free advisory routing uses the same one-time issue preflight", () => {
  const manual = read(".github/workflows/additional-ai-advisory-reviews.yml");
  assert.match(manual, /Validate advisory issue declaration once/);
  assert.match(manual, /node scripts\/governance\/resolve-advisory-issue\.mjs/);
});

testCase("reusable advisory runner consumes preflighted issue context and preserves no-issue context", () => {
  const runner = read(".github/workflows/ai-advisory-review-runner.yml");
  assert.match(runner, /governing_issue_kind:/);
  assert.match(runner, /governing_issue_number:/);
  assert.doesNotMatch(runner, /node scripts\/governance\/resolve-advisory-issue\.mjs \/tmp\/body/);
  assert.match(runner, /GOVERNING_ISSUE_KIND/);
  assert.match(runner, /GOVERNING_ISSUE_NUMBER/);
  assert.match(runner, /explicit PR field uses the accepted no-issue value/);
});
