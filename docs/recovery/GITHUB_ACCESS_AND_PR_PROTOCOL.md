# TeamAi GitHub Access & PR Protocol

**Status:** Canonical engineering operating rule
**Repository:** `RbrtMrlsIII/TeamAi`
**Scope:** TeamAi development and restoration only

## GitHub access is already available
Development AI working on TeamAi must recognize that the TeamAi GitHub repository is an already-authorized engineering surface. Do not invent a new GitHub integration, create a duplicate repository, or ask to recreate access merely because a local workflow or toolkit does not mention it.

The repository is `RbrtMrlsIII/TeamAi`. `main` is the canonical Git branch for merged TeamAi engineering history. Feature/restoration work proceeds through branches and pull requests.

If the connected GitHub capability is unavailable in a particular runtime, report that limitation explicitly. Do not fabricate access or silently substitute another repository.

## Repository boundary
Only TeamAi belongs in this repository. **Never use `HomeFinder-Official` for TeamAi source, backup, mirror, restoration, CI, workflow, or historical preservation.** Verify the exact owner/name before any write.

## Existing GitHub Actions workflow
The canonical TeamAi workflow path is `.github/workflows/TeamAi.yml`.

This file already exists and is the TeamAi CI/recovery workflow. Development AI must inspect and update the existing workflow when a change is required. It must never create a duplicate workflow merely because a stale local checkout does not show it.

Before creating any `.yml` or `.yaml` file under `.github/workflows/`:
1. Inspect the repository tree.
2. Search for existing workflow files serving the intended purpose.
3. Read the existing workflow before modifying it.
4. Reuse/extend the canonical workflow when its responsibility overlaps.
5. Create a new workflow only when a genuinely distinct responsibility is established and documented.
6. If uncertain, stop and report `REVIEW_REQUIRED` rather than inventing a duplicate.

**Specific anti-duplication rule:** `TeamAi.yml` is not a template to copy. Do not create `teamai.yml`, `TeamAi.yaml`, `ci.yml`, `teamai-ci.yml`, or another equivalent workflow unless a distinct responsibility has first been established and documented.

## PAT / credential rule
A GitHub PAT may be authorized for TeamAi, but its secret value is never project content. Never place it in chat, source, YAML, documentation, handovers, logs, commits, PR descriptions, or test fixtures. Use GitHub's secret mechanism where appropriate.

## Required change lifecycle
`inspect → classify → branch → edit existing canonical artifact → commit → PR → CI → review → merge → verify → checkpoint`

## Commit and PR discipline
Development AI may use the authorized GitHub capability to create working branches, commit changes, open PRs, inspect diffs/checks, provide reviews, merge validated PRs when governance/repository rules authorize it, and verify the resulting `main` commit.

GitHub access does not grant Product Law authority. TeamAi Product Law and governance remain the product authority.

## Canonical artifact anti-duplication
Before creating any file, search for existing artifacts with the same or overlapping responsibility. Especially inspect workflows, README/AI entrypoints, recovery manifests, policies, architecture specs, verification protocols, and checkpoint/handover records. Update the canonical artifact instead of creating a parallel copy.

## Historical preservation
GitHub history is part of TeamAi's durable engineering record. Do not rewrite historical commits or documentation merely to make history cleaner. Corrections should be additive and traceable unless an explicit repository/security operation requires otherwise.

Historical endorsement must never be inferred from GitHub access, a commit, a PR, a merge, or a workflow result. Endorsement evidence remains governed by TeamAi's documented authority model.

## Recovery principle
The PRE-029 restored baseline is the current recovery anchor. GitHub records should preserve its identity and subsequent engineering deltas. Implementation completeness is separate and must be demonstrated by source, build, test, and product-capability evidence.

## AI stop condition
If an AI agent encounters a missing file, workflow, repository, credential, or integration and cannot establish whether it already exists: **Do not invent it. Do not duplicate it. Search/inspect first. If still ambiguous, mark `REVIEW_REQUIRED` and report the exact uncertainty.**
