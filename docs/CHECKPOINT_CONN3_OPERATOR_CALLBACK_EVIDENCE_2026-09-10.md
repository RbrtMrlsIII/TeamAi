# Checkpoint — Conn-3 operator callback evidence (2026-09-10)

**Slice:** Conn-3  
**Claim:** IMPLEMENTED · browser proof **pending** · **not a Hero live bind** · **no 029-released claim**

## Operator observation (mobile Chrome)

Host: Supabase Edge project surface (`*.supabase.co`).

| Field | Value |
|-------|--------|
| Page title | TeamAi — GitHub connection |
| Status copy | GitHub install received |
| Installation id | `160609752` |
| Setup action | `install` |
| Auth code | Received (bind deferred to signed-in POST + Firebase token) |
| Non-claims on page | Not a Hero live bind · no production-release claim for 029 · webhook may stay unbound until POST bind |
| Return link shown | `https://rbrtmrlsiii.github.io/TeamAi/hero` |

## Source vs live deploy

| Surface | GET behavior |
|---------|----------------|
| `main` source `supabase/functions/teamai-github-oauth-bind/index.ts` | **HTTP 303** → `https://rbrtmrlsiii.github.io/TeamAi/hero?github=installed&…` — does **not** mint UID |
| Live Edge (this screenshot) | Terminal **HTML** page (“GitHub install received”) — browser remains on worker host |

Conclusion: **source-contract 303 is on main; live deployment has not yet absorbed that revision.** Checklist item 9 (deploy revised Edge) remains open.

## What this evidence establishes

1. Real GitHub App install path reached the TeamAi callback with a concrete `installation_id`.
2. Product copy on the live page continues to refuse Hero live bind and 029 release.
3. Durable UID map was **not** written by this GET (correct boundary even on the HTML path).

## What this evidence does **not** establish

1. Clean browser return to TeamAi after install (item 10).
2. Signed-in POST bind + Firestore `firebaseUid ↔ installation_id` re-read (item 11).
3. Conn-3 product acceptance (item 12).
4. Webhook-bound health for that installation.

## Claim state (unchanged)

`CONN3 = IMPLEMENTED_BROWSER_PROOF_PENDING`

Do not upgrade until deploy + 303 return + POST bind + map verification are recorded.

## Next operator commands

1. Deploy `teamai-github-oauth-bind` from current `main` (GET → 303 only).
2. Re-run install (or re-hit callback) and confirm browser lands on TeamAi Hero with `github=installed`.
3. Signed-in POST with Firebase Bearer + `installationId` → verify Firestore index + account paths.
4. Only then Conn-3 acceptance decision.

## ORUCAVEAM

| Letter | Application |
|--------|-------------|
| **O** | Operator install reached callback with installation id |
| **R** | No UID write on GET; no Hero bind; no 029 release |
| **U** | Ongoing lead + Conn-3 checklist |
| **C** | `TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md` |
| **A** | This checkpoint only |
| **V** | Screenshot + source-vs-live comparison |
| **E / M** | Docs evidence; no runtime change in this slice |
