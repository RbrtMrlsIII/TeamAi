# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX  
**Revision basis:** `main` @ Hero manufactured light rig ([PR #104](https://github.com/RbrtMrlsIII/TeamAi/pull/104), `d22927ac…`) plus authenticated `teamai-task-execute` live runtime proof (2026-09-06), live Firestore contention/recovery run #7, isolated PayPal Sandbox commerce runtime evidence, and final Firestore aggregate re-read (GitHub Actions run #1, attempt 2, 2026-09-07). The bounded task-execute, contention/recovery, PayPal delivery, and post-v13 aggregate verification gates are **RUNTIME-PROVEN**. `TEAM-BACKEND-001` is **ENDORSED for the bounded recorded implementation/validation scope**.

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **ENDORSED for bounded recorded scope**. Live two-worker lease contention + durable result restart/recovery, authenticated `teamai-task-execute`, isolated PayPal Sandbox delivery/HTTP 200, and direct post-v13 Firestore aggregate/event/entitlement re-read are RUNTIME-PROVEN. The final re-read passed on GitHub Actions run #1 (attempt 2), with aggregate `completed`, event count `1`, entitlement `active`, and source-event match. Broader authenticated product-path integration remains distinct.
- `TEAM-BACKEND-002`: **IMPLEMENTED** on `main`.
- `TEAM-EXPERIENCE-029`: **presentation inhabited**. Command Deck remains fixture-backed. Manufactured Hero light rig is on `main` as presentation-only. Seat Identity Inspection is no longer blocked by TEAM-BACKEND-001 endorsement, but remains subject to its own continuation/implementation gates.
- GitHub is the engineering/source authority.
- Firebase `(default)` Firestore is the durable application/domain-state authority.
- Firebase Auth owns identity / Firebase UID ownership.
- Supabase Edge Functions own trusted server execution and PayPal webhook handling.
- PayPal is external payment-provider event authority.
- Firebase Hosting is current TeamAi web delivery authority.
- GitHub Pages is validation-only static browser publication for the spatial UI.
- Vercel is **paused/cut off by current policy** and must not be resumed without explicit user approval.

## Read/write economy

**EDIT is not SAVE. STREAMING is not PERSISTENCE. CACHE is not AUTHORITY.**

Full operational detail is in `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`.

## Merged implementation frontier

The 029 spatial progression currently present on `main` remains Shell → Deck → F7 → Workplace → Seats → Planning → Working → Approvals → Artifacts → Settings, plus presentation-only Hero lighting that consumes `frontend/spatial/hero-theme-lighting-adapter.js`.

Hero uses the existing spatial skill family. There is no 3D Hero skill and no second theme root.

The backend execution progression currently present on `main` is:

`ProviderRuntime gate → task execution gate → authorization + durable domain state + scheduler eligibility → Firestore lease (live-proven) → durable execution-result store (live-proven) → authenticated teamai-task-execute (live-proven) → read/write economy controls`

These slices do not by themselves establish full 029 completion or broader authenticated product-path integration.

## Live PayPal commerce evidence

**Status:** bounded isolated runtime gate **RUNTIME-PROVEN** for real Sandbox capture → PayPal webhook delivery to v5c → HTTP 200, plus final post-v13 Firestore aggregate/event/entitlement re-read.

Canonical path:

`accounts/{uid}/commerce/{correlationId}`  
`.../events/{providerEventId}`  
`.../entitlements/{entitlementId}`  
`commerceCorrelationIndex/{correlationId}` (server-only)

Recorded identities from 2026-09-06:

- correlationId: `68b4ef3a-4132-46bf-8a01-43ebe97ba51e`
- provider event: `WH-71666988RB043112X-1WA30416DF8293903`

Live re-read probe:

- Script: `scripts/firestore-commerce-aggregate-read.mjs`
- Workflow: `.github/workflows/firestore-commerce-aggregate-read.yml` (`workflow_dispatch`)
- Required secret name only: `TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON`
- Successful execution: run #1 / attempt 2 / run ID `34089143256`

Final observed probe result:

```text
status=commerce-aggregate-read-pass
aggregateStatus=completed
eventCount=1
eventType=payment_completed
entitlementStatus=active
sourceMatches=true
```

Evidence record: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`

## TEAM-BACKEND-001 conclusion

1. ~~Live two-worker lease.~~ DONE (run #7).
2. ~~Restart/recovery.~~ DONE (run #7).
3. ~~Durable result retrieval.~~ DONE (run #7).
4. ~~Authenticated `teamai-task-execute`.~~ DONE (2026-09-06).
5. ~~Direct Firestore commerce aggregate re-read after v13.~~ DONE / RUNTIME-PROVEN (2026-09-07, Actions run #1 attempt 2).
6. ~~Final bounded gate audit / HandOver / Endorsement.~~ DONE for the recorded scope.
7. Broader authenticated product-path scheduler/approval integration — separate and remains open.
8. ~~PayPal Sandbox delivery / HTTP 200.~~ DONE (2026-09-06).

## Frontend reality

The spatial frontend remains fixture-backed except for local theme/Hero lighting presentation. With TEAM-BACKEND-001 endorsed, the explicit backend release hold is cleared; frontend work must still obey its own Product Law, Masterplan, skill, verification, and continuation gates. Do not turn fixture UI into claimed live domain behavior.

Allowed Hero slices remain presentation-only unless a later gate explicitly establishes live domain integration.

## Known brittle points

1. Canonical-state drift.
2. Branch accumulation.
3. Frontend/backend contract boundary.
4. Firestore write-authority boundary.
5. Broader product-path scheduler/approval integration remains open.
6. Dual API-server: `src/main.ts` launches `src/api/server.ts`; `src/server.ts` remains.
7. Firestore commit `name` format must be resource names, not HTTPS URLs.

## Rules for high-concurrency agents

1. `main` is the baseline.
2. Before reusing an old branch, compare it with current `main`.
3. Do not merge based on branch naming or stale screenshots.
4. A PR must identify governing Masterplan item, skill routing, verification, and limitations.
5. Do not turn fixture UI into claimed live domain behavior.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.
8. Do not add a 3D Hero skill.

## Immediate next gate

TEAM-BACKEND-001 is endorsed for the bounded recorded scope. The next work may proceed from the now-cleared backend release hold, beginning with the already-defined continuation gates rather than inventing a new authority track.

Out of scope unless explicitly approved:

`browser Firestore write authority, provider-to-provider orchestration, Vercel activation, Product Law rewrite, second frontend theme/root, Turso or alternate DB, a 3D Hero skill, broader authenticated product-path scheduler/approval integration.`

## Evidence language

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
