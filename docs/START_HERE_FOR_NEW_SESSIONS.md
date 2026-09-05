# Start here — new TeamAi sessions

Read this first if you are a new agent or human session joining the repo.

## Authority (short)

1. `PRODUCT_LAW.md`
2. `MASTERPLAN.md`
3. `POLICY.md` / ORUCAVEAM
4. `docs/TEAMAI_CURRENT_STATE.md` ← **operational index**
5. Skills under `skills/` and Grok `teamai` skill
6. Implementation + tests + live evidence

## What is proven on `main` (do not re-litigate)

| Item | Label |
|------|--------|
| Spatial F0–F7 presentation (Shell → Deck → F7 … Settings) | IMPLEMENTED (fixture-backed) |
| Firestore lease transaction + AtomicTaskLeaseStore | IMPLEMENTED + **RUNTIME-PROVEN** (live two-worker) |
| Durable execution result persist + restart retrieval | IMPLEMENTED + **RUNTIME-PROVEN** |
| Read/write economy (ConfigurationDraft, conversation turns, no hasResult preflight, token cache) | IMPLEMENTED |
| Live workflow `firestore-live-recovery.yml` | **RUNTIME-PROVEN** run #7 |

Live proof link: https://github.com/RbrtMrlsIII/TeamAi/actions/runs/33981670897

## Rules that stay hard

- **EDIT ≠ SAVE.** Settings draft is local until Save.
- **STREAMING ≠ PERSISTENCE.** One durable conversation turn per completed human/AI contribution.
- **CACHE ≠ AUTHORITY.** Firestore is durable domain authority.
- Browser must **not** become scheduler/execution write authority.
- Firebase project id `team-ai-official` ≠ TeamAi domain `projectId`.
- Commit write `name` = resource name `projects/.../documents/...` (not full https URL).
- Vercel is cut off unless the user explicitly re-approves.
- Do not migrate durable state to Turso/SQLite to “save quota.”

## Immediate open gate

**Authenticated end-to-end runtime wiring:**

`verified Firebase UID → task/domain read → scheduler → lease → approval → ProviderRuntime → durable result/event`

Not yet complete: full TEAM-BACKEND-001 HandOver/Endorsement, PayPal live evidence, frontend read-model integration.

## If you need to re-run the live probe

Actions → **Firestore live contention and recovery** → Run workflow on `main`.  
Requires the four repository secrets (names only in docs; values never in git).

## Evidence language

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade labels by implication.
