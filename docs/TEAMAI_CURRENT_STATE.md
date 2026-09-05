# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX
**Revision basis:** `main` at `4364b7977fb6feef3bcbe29533b4c8d33afe0b70`

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, or Endorsement.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION / intentionally slowed while 029 frontend catches up**.
- `TEAM-EXPERIENCE-029`: **presentation implementation materially inhabited; backend/live-domain integration and full completion frontier remain open**.
- GitHub is the engineering/source authority.
- Firebase `(default)` Firestore is the durable application/domain-state authority.
- Firebase Auth owns identity / Firebase UID ownership.
- Supabase Edge Functions own trusted server execution and PayPal webhook handling.
- PayPal is external payment-provider event authority.
- Firebase Hosting is current TeamAi web delivery authority.
- GitHub Pages is validation-only static browser publication for the spatial UI.
- Vercel is **paused/cut off by current policy** and must not be resumed without explicit user approval.

## Merged implementation frontier

The 029 spatial progression currently present on `main` is:

`PR #24 Shell + Navigation → #25 Command Deck interior → #26 shared F7 plate/skill hygiene → #28 F7 handoff + smoke → #29 Command Deck skeleton → #30 Workplace → #31 Seats/Provider → #32 Planning → #33 Working → #34 F7 hidden-cluster correction → #36 Approvals → #37 Artifacts → #38 Settings`

The backend execution progression currently present on `main` includes:

`PR #35 ProviderRuntime gate → PR #39 task execution gate`

These merged slices are presentation/contracts or bounded execution slices; they do **not** by themselves establish full 029 completion or TEAM-BACKEND-001 completion.

## Frontend reality

The spatial frontend is an inhabited presentation shell with:

- shared theme root and F0–F7 field vocabulary;
- Shell, Navigation, Deck, Workplace, Seats, Planning, Working, Approvals, Artifacts, and Settings compositions;
- one shared F7 E4 modal surface with action/handoff clusters;
- deterministic Playwright coverage;
- responsive/compact and reduced-motion handling.

The current spatial data is still deliberately fixture-backed. Examples include the displayed Workplace/project, Alpha/Beta/Gamma seats, approval records, and several status/evidence strings. These fixtures are presentation content, not durable domain state.

The next frontend objective is **reconciliation + polish + canonical integration design**, not a frontend rebuild.

## Backend reality

The backend foundation contains Firebase UID-rooted Firestore paths, durable task/event state contracts, ProviderRuntime authorization gates, server-owned PayPal correlation, and the merged task execution gate.

The remaining TEAM-BACKEND-001 frontier includes final live PayPal transaction/webhook runtime evidence plus the remaining security/integration/recovery/traceability/completion evidence required by the Masterplan.

## Known brittle points

### 1. Canonical-state drift

The implementation has advanced through multiple merged slices while portions of the Masterplan and adjacent recovery text still describe the 029 visual system as merely planned. Reconcile documentation to the actual implemented frontier without promoting implementation into completion.

### 2. Branch accumulation

Numerous historical or superseded branches remain. A branch must not be treated as current merely because its name looks recent. Before reusing any non-main branch, compare it with current `main` and establish whether it is ahead, behind, or divergent.

### 3. Command Deck presentation debt

The Command Deck is structurally inhabited but remains fixture-heavy and has visual hierarchy/polish debt. Improve the existing surface without creating a second theme root, state authority, or modal system.

### 4. Frontend/backend contract boundary

Do not inject browser Firebase/domain behavior ad hoc. First establish the canonical read model and identity/session contract for the spatial UI, then implement the smallest authorized integration slice.

### 5. Firestore write-authority review

Current rules allow authenticated users to write their own account/workplace/project/team/seat documents while task/event documents are browser read-only. Before changing browser persistence, explicitly classify which fields are user-owned configuration versus TeamAi-managed authoritative state.

### 6. Dual API-server ambiguity

`src/main.ts` launches `src/api/server.ts`. `src/server.ts` remains present as a legacy-looking alternate server. Do not delete it blindly; first prove no supported build/test/runtime/recovery path depends on it, then retire it through an explicit bounded reconciliation.

### 7. Vercel documentation drift

Current operating policy pauses Vercel, while some older documents still describe it as an available controlled surface. Reconcile wording to one current state without changing the user's explicit Vercel pause boundary.

### 8. PayPal evidence frontier

Gate 5C implementation/available-environment verification is not the same as final live transaction/webhook runtime evidence. Do not reopen completed implementation merely because the external runtime test remains outstanding.

## Rules for high-concurrency agents

1. `main` is the baseline for current work.
2. Before reusing an old branch, compare it against current `main`.
3. Do not merge based on branch naming, stale PR descriptions, or old screenshots.
4. A PR must identify its governing Masterplan item, concrete skill routing, verification scope, and limitations.
5. Do not turn fixture UI into claimed live domain behavior without an explicit integration contract and runtime evidence.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.
8. Keep TEAM-BACKEND-001 slowed where the remaining work is externally dependent while 029 frontend reconciliation proceeds.

## Immediate next slice

**TEAM-EXPERIENCE-029 — Command Deck reconciliation and polish.**

Scope:

`existing Command Deck → visual/interaction reconciliation → fixture truth-labeling → responsive/accessibility verification → Masterplan/evidence synchronization`

Out of scope:

`Firebase integration, direct Firestore writes, scheduler authority, provider invocation, PayPal activity, entitlement mutation, Vercel activation, or Product Law rewrite.`

## Evidence language

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
