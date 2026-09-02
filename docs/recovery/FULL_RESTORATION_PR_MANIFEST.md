# PRE-029 Full Restoration PR Manifest

Canonical source: `TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`
Archive SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`

Canonical archive inventory: **556 files** / **3,696,424 bytes**.

The ZIP is the complete project-preservation artifact. GitHub is the durable engineering/source-control surface for code, migrations, tests, contracts, operational records, recovery records, and explicitly approved repository dependencies.

## Restoration invariant

A full TeamAi restoration consists of:

1. preservation of the canonical project ZIP and its checksum;
2. reconciliation of the GitHub repository with the project code and records intended to be version-controlled; and
3. explicit preservation of any exceptional binaries that are proven to be required repository dependencies.

GitHub is **not required to contain every member of the ZIP**. Large planning/reference media and generated visual artifacts remain archive-first unless an authority or technical dependency requires them in Git.

The existing `.github/workflows/TeamAi.yml` remains the single canonical workflow. No HomeFinder content may be introduced.

## Exceptional binary/media gate

The PRE-029 archive currently contains an important visual reference binary:

`docs/spatial-exploration/TEAM-EXPERIENCE-027-SPATIAL-EXPLORATION-REFERENCE-BOARD.png`

This file remains preserved in the canonical ZIP and is **not** required to be uploaded to GitHub merely because it exists in the archive.

For any binary that is later proven necessary in Git, follow `docs/recovery/BINARY_AND_LARGE_FILE_UPLOAD_GUIDE.md`. The Development AI must provide the user the exact destination folder/path and exact PR number before requesting manual upload when the connected tooling cannot safely transfer the bytes.

## Current restoration status

The PRE-029 baseline is preserved and locally verified. The TeamAi GitHub restoration gate is open for alignment of the repository's version-controlled surface.

Do not claim byte-for-byte Git mirroring of the ZIP unless that exact property is intentionally performed and verified. Do not claim product implementation completion from restoration work.

## Required sequence

1. Preserve and identify the canonical PRE-029 archive by checksum.
2. Reconcile source/code/records with `RbrtMrlsIII/TeamAi` using the existing repository rather than creating a duplicate.
3. Keep unnecessary large media archive-first.
4. For required binaries that cannot be uploaded by the agent, stop and provide the user-guided upload report with the exact PR and destination path.
5. Run the existing `TeamAi.yml` CI checks after repository changes.
6. Review and merge through the normal protected `main` PR path.
7. Verify the resulting repository and record the restoration checkpoint.

## Important boundary

Restoration of the historical baseline and implementation completion are separate statuses. This PR must not mark currently missing product capabilities as implemented merely because the archive or GitHub recovery surface is restored.
