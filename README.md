# TeamAi

## Durable Recovery Anchor

This repository is the **GitHub-only engineering recovery anchor for TeamAi**.

### Current baseline

- Restored baseline: `PRE-029 — PROJECT_RESTORED_BASELINE`
- Canonical archive SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`
- Restored-tree inventory: 558 files
- Restoration status: `RESTORED_BASELINE`
- Full implementation completion: `OPEN`
- Foundation-006: `HISTORICAL_NUMBERING_GAP`; coordination migration evidence is retained under Foundation-001.

### Repository boundary

Only the **TeamAi** project belongs here. `HomeFinder-Official` is unrelated and must never be used as a TeamAi backup, mirror, source, or restoration target.

### Existing engineering access

TeamAi already has an authorized GitHub engineering path. Development AI must inspect and reuse the existing repository, branch, PR, and workflow capabilities before creating anything new.

Canonical CI workflow:

`.github/workflows/TeamAi.yml`

Canonical protocol:

`docs/recovery/GITHUB_ACCESS_AND_PR_PROTOCOL.md`

**Do not create duplicate GitHub workflows, especially duplicate `.yml`/`.yaml` files, when an existing workflow already owns the responsibility.** Inspect first; update the canonical artifact when appropriate.

### Evidence rule

Do not infer implementation, approval, or historical endorsement from this repository alone. Canonical authority remains in TeamAi's documented Product Law / governance system; GitHub provides durable engineering history and recovery evidence.

### Recovery inventory

See `docs/recovery/TeamAi_PRE_029_GITHUB_RECOVERY_MANIFEST.md` for the complete file-by-file SHA-256 inventory captured from the restored baseline.
