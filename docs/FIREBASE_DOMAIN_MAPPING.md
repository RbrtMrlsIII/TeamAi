# Firebase Domain Mapping

## Status

`ACTIVE / RECONCILED TO CURRENT 029 ARCHITECTURE`

Firebase concepts remain subordinate to Product Law. Firestore `(default)` is the canonical durable TeamAi domain store, while privileged orchestration and provider execution remain behind the external TeamAi runtime boundary.

| Domain surface | Current repository implementation | Current Firebase/runtime interpretation |
|---|---|---|
| Account / Workplace / Project / Team / Seat | `src/backend/firestore-runtime.ts` + `supabase/functions/teamai-domain-bootstrap/index.ts` | UID-rooted Firestore hierarchy; canonical Seat path is team-nested |
| Seat identity | persisted `seatId` → domain `SeatState.id` in Firestore runtime mapping | One explicit persisted-to-domain identity boundary |
| Seat budget | `src/backend/seat-turn-budget.ts` + Edge `_shared/seat-turn-budget.ts` | Seat-owned configuration and execution accounting; no UI authority |
| Task state | `FirestoreRuntimeTaskStore` / Firestore task documents | Durable task state in UID/workplace/project scope |
| Scheduler | `src/backend/scheduler.ts` | Pure eligibility decision; no provider execution or durable mutation |
| Lease | `FirestoreAtomicTaskLeaseStore` | Firestore transaction-backed single-winner lease boundary |
| Approval | `FirestoreRuntimeApprovalStore` | Durable approval transition before execution |
| Trusted execution | `src/backend/task-execution.ts`, `src/backend/task-runtime-bridge.ts`, plus Supabase Edge task executor | External TeamAi runtime consumes authenticated Firestore state; browser never becomes execution authority |
| Execution events / results | Firestore runtime stores and `src/backend/firestore-result-store.ts` | Durable result/event/checkpoint evidence under task scope |
| Continuation | `src/backend/task-continuation.ts`, Firestore continuation stores, `teamai-task-continuation-request` | Checkpoint + explicit request + waiting state + fresh-turn semantics |
| Provider credentials | Seat-owned provider binding / credential helpers | Secret material is server-side only; never a browser authority |
| Conversations / legacy orchestrator | `src/orchestrator.ts` with `InMemoryConversationStore` | Legacy application runtime surface, not the canonical 029 Firestore execution authority |
| Provider catalog | catalog/service contracts | Capability/catalog authority remains separately governed; no new Firestore catalog authority is implied by this map |
| Billing / commerce | existing billing contracts + Supabase commerce/webhook runtime | Commerce/payment events remain downstream and distinct from Seat/provider authorization |

## Important implementation rule

Historical PostgreSQL/SQL implementation artifacts may preserve domain intent and provenance, but they are not a second active durable TeamAi domain store. Current 029 execution state is defined by the Firestore-backed runtime adapters and trusted external runtime boundaries.

Where a TeamAi invariant depends on the current state of one or more Firestore documents, use a Firestore transaction. Where a set of independent writes can be atomically committed without a read dependency, use a batched write. Transaction callbacks must remain side-effect free because Firestore may retry transactions under concurrency.

## Spark runtime constraints

The current TeamAi Firebase target uses Firestore `(default)`, Firebase Authentication, and Firebase Hosting. Firebase Cloud Storage and Firebase Cloud Functions are not required product dependencies for the current architecture. Privileged orchestration and scheduling remain behind the external TeamAi runtime boundary.

## TeamAi Storage product boundary

TeamAi Storage is a separate product facility from Firebase Cloud Storage. The current frontend/product scope is item-inventory/read-model presentation only. Image/file upload and binary object-transfer surfaces remain deferred pending explicit security and cost controls.

## Project artifact exchange boundary

TeamAi web does not upload project ZIPs. Artifact exchange must preserve authorization, provenance, checksum/version identity, and auditability through the approved external surfaces without introducing Firebase Storage authority.
