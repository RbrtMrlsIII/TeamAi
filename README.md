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

### Current backend-first gate

Read `docs/BACKEND_FIRST_REBASELINE_GUARD.md` before changing 029. The current sequence is:

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

`TEAM-BACKEND-001` is planning/architecture-first and must become the real backend foundation before 029 production frontend implementation is claimed.

Canonical backend authority:

- Firebase Auth = identity
- Firestore `default` = TeamAi durable domain/application state
- PayPal = payment-provider authority
- Supabase Edge Functions = trusted server runtime
- Vercel = future optional browser/deployment surface

Supabase Postgres is not the TeamAi domain store. PostgreSQL/WoWSQL is retired and scheduled for active-tree + Git-history purge; it is not a supported recovery implementation path.

### Repository boundary

Only the **TeamAi** project belongs here. `HomeFinder-Official` is unrelated and must never be used as a TeamAi backup, mirror, source, or restoration target.

### Engineering access

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
