# START HERE — New TeamAi sessions

Read this before inventing work from chat memory.

## 1. Authority

```text
PRODUCT_LAW.md
  → MASTERPLAN.md
  → POLICY.md / ORUCAVEAM
  → docs/SKILL_WIRING.md
  → skills/**
  → implementation
  → verification / evidence
  → HandOver / Endorsement
```

Repo: **RbrtMrlsIII/TeamAi** (case-sensitive). `main` is the baseline.

## 2. Three words that prevent most Firestore waste

| Temporary | Durable | Forbidden |
|-----------|---------|-----------|
| **EDIT** (local draft) | **SAVE** (one write) | Write on every keystroke |
| **STREAMING** (local tokens) | **TURN** (one completed message) | Token-by-token transcript docs |
| **CACHE** (acceleration) | **AUTHORITY** (Firestore) | Cache as truth |

Product Law: Firestore remains the sole durable domain store. Do **not** migrate to Turso/SQL for quota reasons without a Product Law change.

## 3. What is already built (source)

| Piece | Status |
|-------|--------|
| Spatial UI (Shell → Deck → F7 …) | Presentation on main |
| Lease transaction + adapter | IMPLEMENTED source (#57) |
| Durable execution results | IMPLEMENTED source (#58) |
| Read/write economy (draft/turns/probe) | IMPLEMENTED source (#59) |
| Live two-worker + restart proof | **Prepared, not RUNTIME-PROVEN** |
| PayPal live | Open |
| Vercel | Cut off |

`TEAM-BACKEND-001` = **IN IMPLEMENTATION** until live Firebase contention succeeds.

## 4. How settings work

User changes 20 controls → **zero** Firestore writes.  
User presses **Save** → **one** durable mutation (or **zero** if nothing changed).

Code: `ConfigurationDraft` in `src/backend/configuration-draft.ts`.

## 5. How Web AI conversation works

Typing / streaming stays in the browser.  
Submit or finished AI response → **one** durable turn document.  
Orchestrator loads transcript **once** per run and reuses it.

## 6. How task execution works

```text
READY task
  → two workers race a Firestore transaction
  → exactly one LEASE winner
  → approval → ProviderRuntime
  → write durable result (create-only)
  → then COMPLETE/FAIL event
  → new process can retrieve result by taskId + projectId + eventId
```

Live probe: `.github/workflows/firestore-live-recovery.yml` (manual; needs secrets).

## 7. Evidence language

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Green CI is not live Firebase proof.

## 8. Do not

- Revive closed PR #50 or other branches based on old `main`
- Give the browser scheduler/execution write authority
- Resume Vercel without explicit user approval
- Treat F6/F7 as legal boxes or domain authority

## 9. Next gate

Successful **live** run of two-worker lease + restart result retrieval, then authenticated end-to-end wiring and PayPal live evidence.
