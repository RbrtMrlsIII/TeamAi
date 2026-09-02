# TeamAi GitHub Access & PR Protocol

**Status:** Canonical engineering operating rule
**Repository:** `RbrtMrlsIII/TeamAi`
**Scope:** TeamAi development and restoration only

## 1. GitHub access is already available

Development AI working on TeamAi must recognize that the TeamAi GitHub repository is an already-authorized engineering surface. Do **not** invent a new GitHub integration, create a duplicate repository, or ask to recreate access merely because a local workflow or toolkit does not mention it.

The repository is:

- `RbrtMrlsIII/TeamAi`
- `main` is the canonical Git branch for merged TeamAi engineering history.
- Feature/restoration work proceeds through branches and pull requests.

If the connected GitHub capability is unavailable in a particular runtime, report that limitation explicitly. Do not fabricate access or silently substitute another repository.

## 2. TeamAi repository boundary

Only TeamAi belongs in this repository.

**Never use `HomeFinder-Official` for TeamAi source, backup, mirror, restoration, CI, workflow, or historical preservation.**

A repository name that looks similar is not evidence that it is the TeamAi repository. Verify the exact owner/name before any write.

## 3. Existing GitHub Actions workflow

The canonical TeamAi workflow path is:

`.github/workflows/TeamAi.yml`

This file already exists and is the TeamAi CI/recovery workflow. Development AI must **inspect and update the existing workflow when a change is required**. It must never create a duplicate workflow under another filename merely because `TeamAi.yml` was not found in a stale local checkout or because a preferred filename differs.

Before creating any `.yml` or `.yaml` file under `.github/workflows/`:

1. Inspect the repository tree.
2. Search for existing workflow files serving the intended purpose.
3. Read the existing workflow before modifying it.
4. Reuse/extend the canonical workflow when its responsibility overlaps.
5. Create a new workflow only when a genuinely distinct workflow responsibility is established and documented.
6. If uncertain, stop and report `REVIEW_REQUIRED` rather than inventing a duplicate.

## 4. PAT / credential rule

A GitHub Personal Access Token may be authorized for the TeamAi project, but its **secret value is never project content**.

Never place a PAT or credential value in:

- chat messages
- source files
- YAML workflow files
- documentation
- handovers/checkpoints
- logs
- commits
- pull-request descriptions
- test fixtures

Use GitHub's secret/credential mechanism where appropriate. Do not request, expose, or reproduce the token value unless an authorized platform operation explicitly requires it.

## 5. Required change lifecycle

For meaningful TeamAi repository changes, prefer:

`inspect → classify → branch → edit existing canonical artifact → commit → PR → CI → review → merge → verify → checkpoint`

Never skip repository inspection merely because a requested filename or workflow is mentioned in a task description.

## 6. Commit and PR discipline

Development AI may use the authorized GitHub capability to:

- create a working branch;
- commit changes to that branch;
- open a pull request;
- inspect the diff and checks;
- provide or record a review;
- merge a validated pull request when authorized by the project governance and repository rules;
- verify the resulting `main` commit.

The presence of this capability does not grant Product Law authority. GitHub is the durable engineering/history surface; TeamAi Product Law and governance remain the product authority.

## 7. Do not duplicate canonical artifacts

Before creating any file, search for an existing artifact with the same or overlapping responsibility. This applies especially to:

- `.github/workflows/*.yml`
- `.github/workflows/*.yaml`
- README/AI entrypoint documents
- recovery manifests
- policies
- architecture specifications
- verification protocols
- checkpoint/handover records

If an existing canonical artifact already owns the responsibility, update it rather than creating a parallel copy.

## 8. Historical preservation

GitHub history is part of TeamAi's durable engineering record. Do not rewrite historical commits or documentation merely to make history look cleaner. Corrections should be additive and traceable unless an explicit repository/security operation requires otherwise.

Historical endorsement must never be inferred from GitHub access, a commit, a PR, a merge, or a workflow result. Endorsement evidence remains governed by TeamAi's documented authority model.

## 9. Recovery principle

The PRE-029 restored baseline is the current recovery anchor. GitHub records should preserve its identity and subsequent engineering deltas. Implementation completeness remains a separate question and must be demonstrated by source, build, test, and product-capability evidence.

## 10. AI stop condition

If an AI agent encounters a missing file, workflow, repository, credential, or integration and cannot establish whether it already exists:

**Do not invent it. Do not duplicate it. Search/inspect first. If still ambiguous, mark `REVIEW_REQUIRED` and report the exact uncertainty.**
