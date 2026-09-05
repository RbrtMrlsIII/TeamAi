# TEAM-BACKEND-002 — Firebase Read/Write Economy

**Status:** IMPLEMENTED ENGINEERING SLICE  
**Purpose:** make Firebase usage predictable, economical, and easy for every TeamAi session to understand.

This document is a practical companion to Product Law, Masterplan, Policy/ORUCAVEAM, skills, and the current-state index. It does not replace any of them.

## 1. The simple rule

**EDIT is not SAVE.  STREAMING is not PERSISTENCE.  CACHE is not AUTHORITY.**

Most UI changes are temporary working state. We keep those changes local and write to Firestore only when a durable fact actually needs to change.

The goal is not “as few operations as possible at any cost.” The goal is **the fewest durable reads/writes that preserve authority, correctness, recovery, and auditability.**

## 2. Settings: many edits, one save

A user may change ten, fifty, or one hundred controls while configuring a Web AI Team. Those interactions should normally change a local draft only.

```text
OPEN SETTINGS
     │
     ▼
load authoritative baseline (once when needed)
     │
     ▼
LOCAL DRAFT
  │  │  │  │
  │  ├─ theme change
  │  ├─ seat change
  │  ├─ limit change
  │  └─ other edits
  │
  └──────────────► no Firestore write per edit
                     │
                     ▼
                 user presses SAVE
                     │
                     ▼
              one durable mutation
                     │
                     ▼
               new saved baseline
```

### What this means

- Typing, selecting, opening/closing panels, changing sliders, and previewing values are local unless a specific product contract says otherwise.
- `Save` is the durable configuration boundary.
- `Discard` throws away the draft and does not write.
- `Save` with no changes performs no durable write.
- A successful save becomes the new comparison baseline.
- Cache/draft state never overrides backend authority.

The reusable implementation boundary is `ConfigurationDraft<T>` in `src/backend/configuration-draft.ts`.

### Important exception

Some actions are intrinsically durable or security-sensitive and should not wait for a generic Settings Save. Examples include an explicit approval decision, a provider OAuth/connection operation, task leasing, execution state, and commerce events. Those actions use their own authoritative runtime contracts.

## 3. Web AI conversation: a turn is the durable unit

The conversation should **not** write a Firestore document for every keystroke or every streaming token.

A Web AI conversation has three different kinds of state:

```text
LOCAL DRAFT
  text being typed
  cursor / composer state
  partial streaming response
  visual selection
        │
        │ user submits / AI finishes
        ▼
DURABLE TURN
  one human or Web AI contribution
  conversationId + turnId + sequence
  author / seat / provider / model
  completed content + timestamp
        │
        ▼
TEAM CONTEXT
  scheduler / next eligible work / handoff
```

The current durable turn contract is `WebAiConversationTurn` in `src/backend/conversation-turn.ts`.

### Conversation write policy

**Human:** local draft → Submit → one durable turn write.

**Web AI:** streaming tokens stay local → final response complete → one durable turn write.

**System:** durable system messages are written only when they represent an actual durable event or team-state fact.

Do not write token-by-token transcript chunks unless a separate product requirement explicitly requires resumable live-stream recovery.

## 4. Conversation reads: reuse the working set

Repeatedly asking Firestore for the same transcript during one orchestrated run is wasteful.

The orchestrator now loads the transcript into a working in-memory set once at the start of a run, then appends newly completed messages to that local working set as the run proceeds.

```text
Firestore transcript
        │
        ▼
  one durable read
        │
        ▼
 local working set ──────► Web AI #1 context
        │
        ├──────────────────► Web AI #2 context
        │
        ├──────────────────► Web AI #3 context
        │
        └─ append completed turns locally
```

This does not remove the need to persist each completed durable turn. It removes repeated reads of the same historical context.

## 5. Firebase state classification

### Hot state — keep local/read-model first

Examples: current panel, current seat selection, draft settings, composer text, current visual mode, temporary streaming text, already-loaded context.

### Durable state — Firestore authority

Examples: task state, lease, approval, execution event, terminal result, entitlement projection, commerce correlation, committed conversation turn.

### Derived state — reconstruct when reasonable

Examples: dashboard counts, eligibility summaries, recent-result summaries, display-only aggregates.

A derived cache must never become a second authority.

## 6. Write economy

Prefer:

1. **Coalescing:** many logical edits become one durable configuration mutation.
2. **Create-only terminal results:** one durable result document per terminal event identity.
3. **Idempotency:** duplicate commands do not create duplicate durable effects.
4. **Batching:** combine related writes when atomicity or latency makes it useful.
5. **No speculative writes:** do not persist a visual state just because it changed on screen.

Do not batch unrelated authority changes merely to reduce request count if doing so makes recovery or audit semantics ambiguous.

## 7. Read economy

Prefer:

1. Read once and reuse the working set during one logical operation.
2. Ask for an exact durable document when its identity is known.
3. Do not perform a read only to decide whether a create-only write can occur; attempt the create-only write and handle the already-exists/conflict outcome.
4. Cache server authentication tokens in-process rather than exchanging a token for every Firestore operation.
5. Fetch derived views only when the user actually needs them or when they are stale.

That third rule is important. The terminal execution result path now writes create-only without first calling `hasResult()`. A duplicate is detected by the durable write constraint instead of a separate preflight read.

## 8. Durable execution result and restart recovery

Terminal result path:

`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/tasks/{taskId}/execution-results/{eventId}`

Identity is:

`taskId + TeamAi projectId + terminal eventId`

The Firebase infrastructure project ID is a separate value. Never confuse the Firebase project identifier with TeamAi's domain `projectId`.

The execution ordering is:

```text
START event
   │
   ▼
ProviderRuntime
   │
   ▼
durable terminal result
   │
   ▼
COMPLETE / FAIL event
   │
   ▼
terminal task state
```

The result is therefore present before the terminal event claims the outcome.

After a process restart, recovery uses the durable identity to read the stored result. It does not depend on the old process's memory cache.

## 9. Firestore lease contention

Task leasing uses a real Firestore transaction:

```text
READY task
   │
   ├────────────── Worker A ──┐
   │                          │
   └────────────── Worker B ──┤
                              ▼
                    transactional read
                              │
                     optimistic commit
                         ┌────┴────┐
                         │         │
                      winner     loser
                     LEASED      conflict /
                                 not-ready
```

The source boundary is:

`FirestoreLeaseTransaction → FirestoreAtomicTaskLeaseStore → TaskRuntimeBridge`

The required safety result is **exactly one winner for the same READY task**. The losing process may observe `CONFLICT` or, depending on timing, `NOT_READY`; the safety invariant is that it must not acquire a second lease.

## 10. Live verification

A manual GitHub Actions workflow is provided at:

`.github/workflows/firestore-live-recovery.yml`

It runs:

`scripts/firestore-live-contention-recovery.mjs`

The probe does four things:

1. Creates a unique READY test task in an explicitly scoped Firebase account/workplace/TeamAi project.
2. Starts two fresh worker processes concurrently and proves one lease winner only.
3. Persists a durable terminal result.
4. Starts a fresh recovery process and retrieves the result by `(taskId, projectId, eventId)`.

Required GitHub Actions secrets are referenced by name only:

- `TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON`
- `TEAMAI_FIREBASE_TEST_UID`
- `TEAMAI_FIREBASE_TEST_WORKPLACE_ID`
- `TEAMAI_FIREBASE_TEST_PROJECT_ID`

Do not put secret values in source, documentation, issues, PRs, screenshots, logs, or handover files.

**Important:** the workflow is prepared but live runtime proof is only earned by a successful workflow run against real Firebase. Source tests and GitHub build tests do not count as runtime proof.

## 11. What newer TeamAi sessions should remember

Think of TeamAi in five questions:

```text
WHAT IS TEMPORARY?
→ keep it local

WHAT MUST SURVIVE A RESTART?
→ make it durable

WHAT CAN BE REBUILT?
→ derive/cache it

CAN ONE OPERATION REPLACE MANY?
→ coalesce it

WOULD SAVING ONE OPERATION BREAK AUTHORITY OR RECOVERY?
→ do not optimize it away
```

And remember the workforce path:

`Human authority → Field / Responsibility Profile → Workspace rules + Skills → Capabilities → Authorization → Task state → Scheduler → Seat → trusted action → durable result/event → verification → handover`

## 12. Current implementation state

This slice is an engineering implementation of read/write economy and runtime verification preparation.

It does **not** mean TEAM-BACKEND-001 is complete.

TEAM-BACKEND-001 still needs successful live Firestore contention/restart/retrieval evidence, authenticated end-to-end runtime wiring, final governance evidence, and separate PayPal runtime evidence.
