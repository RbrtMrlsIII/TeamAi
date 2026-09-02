# PRE-029 GitHub Restoration Status

**Repository:** `RbrtMrlsIII/TeamAi`
**Restoration model:** `CANONICAL_PROJECT_ARCHIVE + ALIGNED_GITHUB_ENGINEERING_REPOSITORY`
**Implementation completion:** `OPEN`
**Recovery anchor:** `PRE-029 — PROJECT_RESTORED_BASELINE`

## Canonical restoration source

The authoritative PRE-029 project snapshot is preserved as the canonical TeamAi project archive:

`TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`

SHA-256:

`9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`

The archive is the preservation/recovery artifact for the complete project snapshot. GitHub is the durable engineering history and source-control anchor and must remain aligned with the project code and relevant text/configuration records.

## GitHub restoration point

The executable restoration core was carried into TeamAi Git history through PR #2 and merged to `main` as:

`e27c4168978a3777d453a758099500c32a2ebdf7`

PR #4 (`restore: stage PRE-029 full-baseline restoration gate`) is the active restoration gate for aligning the GitHub repository with the canonical archive without falsely treating large media assets as mandatory Git source files.

## Project archive versus Git repository

The two preservation surfaces have different responsibilities:

- **Canonical project ZIP:** complete recovery snapshot, including large planning/reference media and other files that are not required to live in Git.
- **GitHub TeamAi repository:** code, migrations, tests, contracts, operational documents, recovery records, and other text/configuration required for durable engineering history and executable development.

The project is considered restored only when the canonical archive is preserved and the GitHub repository is reconciled to the project code/record set expected to be version-controlled. A byte-for-byte copy of every archive member into Git is **not** required merely because the archive contains a PNG, rendered board, or other large media asset.

## Media and large-file rule

Large binary/media files are **archive-first by default**. Do not upload them to GitHub merely to make the Git tree resemble the ZIP.

Upload a large binary/media file to GitHub only when the file is genuinely required as a version-controlled engineering artifact, for example a source 3D asset, test fixture, required runtime asset, or other approved repository dependency.

Planning/reference imagery, generated visual boards, findings illustrations, and similar large media should remain in the canonical project archive or authorized project storage unless Product Law, a contract, implementation dependency, or QA requirement makes Git preservation necessary.

## Mandatory user-guided upload gate for exceptional binaries

When a Development AI determines that an important binary/media file **must** be uploaded to GitHub and the connected tooling cannot safely transfer the local bytes, the AI must stop before attempting an improvised upload and report:

1. the exact file path and purpose;
2. why GitHub preservation is required;
3. the target repository: `RbrtMrlsIII/TeamAi`;
4. the exact target folder/path to use;
5. the exact PR number/branch where the file belongs;
6. the exact user action required to upload the file; and
7. the verification step the AI will perform after upload.

The AI must not ask the user to paste a PAT into chat, source files, documentation, logs, commits, or handovers.

## Existing workflow rule

`.github/workflows/TeamAi.yml` is the single canonical TeamAi workflow. Before creating or importing any `.yml`/`.yaml` file, inspect existing workflows and reuse/update the existing canonical workflow when it owns the responsibility. Do not create duplicate CI workflows under alternate names.

## Restoration versus implementation

Restoration and implementation completion remain separate states.

Restoring the canonical project records does not make currently open product capabilities implemented. In particular, do not infer completion from the archive, this status record, Product Law, Masterplan, handovers, endorsements, screenshots, or a successful restoration PR alone.

Implementation frontiers remain governed by the Foundation Implementation Completion Matrix and its evidence protocol.

## AI operating rule

Before creating, importing, replacing, or claiming any artifact:

1. Identify the canonical source and the artifact's responsibility.
2. Inspect the TeamAi GitHub repository and existing overlapping artifacts.
3. Reuse/update rather than duplicate.
4. Preserve large media in the canonical archive unless Git preservation is specifically required.
5. For required binaries that the agent cannot upload safely, invoke the mandatory user-guided upload gate above.
6. Never infer implementation completion from existence of documentation or media.
7. When uncertain, use `REVIEW_REQUIRED` rather than inventing a file, path, workflow, or permission.
