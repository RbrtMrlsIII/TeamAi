# Checkpoint — Conn-3.1 post-install return receipt (2026-09-11)

**Slice:** Conn-3.1 (Issue #244)  
**Claim:** `CONN3 = IMPLEMENTED_BROWSER_PROOF_PENDING`  
**Not a Hero live bind.** **No 029-released claim.**

## What changed

1. Canonical GET 303 destination is now `https://rbrtmrlsiii.github.io/TeamAi/hero/` (trailing slash matching GitHub Pages `dist/hero/`).
2. Hero and Command Deck consume `github=installed` as a **presentation-only receipt**.
3. Receipt does not write Firestore, does not mint UID, and does not POST to Edge.
4. Human-only remainders (Edge redeploy, webhook Active, Gate 4 emulator, provider keys) stay empty on MASTERPLAN and are flagged on the existing `docs/USER_MANUAL_DEPLOYMENT.md`. No second deploy file.

## What this does not prove

- Live Edge still serving HTML vs 303 (operator redeploy).
- Browser proof of install → 303 → TeamAi return on the deployed function.
- Signed-in POST bind + Firestore `firebaseUid ↔ installation_id` re-read.
- Conn-3 product acceptance.

## Next authorized command

Operator redeploys `teamai-github-oauth-bind` from `main` (GET → 303 only), then records browser landing on `/hero/?github=installed` with the receipt visible. That remains a user-manual step.

## ORUCAVEAM

| Letter | Application |
|--------|-------------|
| **O** | Canonical post-install destination + visible receipt |
| **R** | No UID write, no Hero live bind, no 029 release, no second deploy file |
| **U** | Ongoing lead + Issue #244 |
| **C** | `TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md` |
| **A** | Source 303 path + presentation receipt |
| **V** | Contract tests |
| **E / M** | Existing USER_MANUAL only for human steps |
