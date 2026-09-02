# PRE-029 Full Restoration PR Manifest

Canonical source: `TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`
Archive SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`

Restored working-tree inventory: **556 files** / **3,696,424 bytes**.

Binary artifact:
`docs/spatial-exploration/TEAM-EXPERIENCE-027-SPATIAL-EXPLORATION-REFERENCE-BOARD.png`

Binary SHA-256:
`644ee387ad0801dd03c5e46d85805c0c35343382832861251e4d6dd8e75d1afd`

## Restoration invariant

The TeamAi Git tree is considered byte-complete only when every canonical archive path is present with identical bytes. The existing `.github/workflows/TeamAi.yml` remains the single canonical workflow. No HomeFinder content may be introduced.

## Current restoration status

The canonical PRE-029 baseline is preserved and locally verified. The connected GitHub write interface available to this run can create UTF-8 repository content, but it does not expose a local-file upload primitive for the canonical PNG, and no GitHub credential is exposed to the local shell. Therefore this PR deliberately does **not** claim byte-complete repository restoration.

This file is the control/verification gate for the full restoration. The canonical ZIP remains the authoritative recovery artifact until the Git tree can be reconciled byte-for-byte.

## Required sequence

1. Import the canonical PRE-029 tree into `RbrtMrlsIII/TeamAi` without creating duplicate workflows.
2. Verify the complete path inventory and SHA-256 values against the canonical archive.
3. Run the existing `TeamAi.yml` CI checks.
4. Review and merge through the normal protected `main` PR path.
5. Re-run the restoration audit from the merged tree and record the result.

## Important boundary

Restoration of the historical baseline and implementation completion are separate statuses. This PR must not mark currently missing product capabilities as implemented merely because the historical archive is restored.
