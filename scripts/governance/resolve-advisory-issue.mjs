#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const usage = "Usage: node scripts/governance/resolve-advisory-issue.mjs <pr-body-file>";

export function resolveAdvisoryIssue(body) {
  const text = String(body ?? "");
  const pattern = /^\s*(?:[-*]\s*)?(?:\*\*)?\s*(?:Owning|Governing)\s+Issue:\s*(?:\*\*)?\s*(#[0-9]+|none|n\/a)\s*(?:\*\*)?\s*$/im;
  const match = text.match(pattern);

  if (!match) {
    return {
      valid: false,
      kind: "INVALID",
      issue_number: null,
      message: "PR body must contain an explicit Owning Issue: #N, Governing Issue: #N, or an explicit no-issue value (none or n/a).",
    };
  }

  const raw = match[1].toLowerCase();
  if (raw === "none" || raw === "n/a") {
    return {
      valid: true,
      kind: "NONE",
      issue_number: null,
      message: "Explicit no-issue declaration accepted.",
    };
  }

  const issueNumber = Number.parseInt(raw.slice(1), 10);
  if (!Number.isSafeInteger(issueNumber) || issueNumber <= 0) {
    return {
      valid: false,
      kind: "INVALID",
      issue_number: null,
      message: "Owning/Governing Issue reference must contain a positive GitHub issue number.",
    };
  }

  return {
    valid: true,
    kind: "ISSUE",
    issue_number: issueNumber,
    message: `Explicit governing issue #${issueNumber} accepted.`,
  };
}

async function main() {
  const bodyPath = process.argv[2];
  if (!bodyPath) throw new Error(usage);

  const body = await readFile(bodyPath, "utf8");
  const result = resolveAdvisoryIssue(body);
  console.log(JSON.stringify(result, null, 2));

  if (!result.valid) process.exit(1);
}

if (import.meta.url === new URL(process.argv[1], "file:").href) {
  await main();
}
