# TeamAi — Firestore Usage & Resilience Policy

**Status:** CANONICAL PRODUCT-LAW COMPANION
**Parent authority:** `PRODUCT_LAW.md`

This document defines how TeamAi should use Cloud Firestore without confusing its no-cost quota with the application's architectural authority. It does not replace Firestore as the canonical TeamAi durable domain/application state store.

## 1. Canonical role

Cloud Firestore `(default)` remains the authoritative durable TeamAi application/domain store for the current architecture.

The goal is therefore **not** to eliminate Firestore reads/writes. The goal is to make every read/write intentional, bounded, cache-aware, and resilient to quota exhaustion.

`canonical state → Firestore`

`derived/local/transient state → cache or local state where safe`

A cache, browser store, search index, analytics system, or alternate database must not silently become a second TeamAi domain-state authority.

## 2. Current Firebase Spark baseline

Firebase currently documents a no-cost Cloud Firestore Standard-edition allowance of:

- 50,000 document reads/day;
- 20,000 document writes/day;
- 20,000 document deletes/day;
- 1 GiB stored data;
- 10 GiB/month outbound data transfer.

Firebase states that Spark projects do not get pay-as-you-go usage for paid-tier products. Its current pricing-plan documentation also states that if a Spark project's no-cost quota for a product is exceeded in a calendar month, that product is shut off for the remainder of that month across the Firebase project; service resumes in the next billing cycle or after upgrading to Blaze. Quota/accounting details can differ by product, so Firestore-specific usage must be monitored from the Firestore usage dashboard.

The quotas are project-level, not per app.

## 3. What consumes Firestore usage

At a high level:

- Point reads and query result reads consume document-read usage.
- Realtime listeners consume reads when documents are added, updated, or removed from the listener's result set; reconnect behavior can cause another query/read cycle depending on offline-persistence state.
- Writes to documents consume write usage.
- Deletes consume delete usage.
- Batched writes are atomic, but each document operation in the batch counts separately toward usage.
- Transactions contain reads and writes and may retry under contention, so one logical transaction can exercise multiple backend operations.
- Large or complex queries can consume additional read resources through scanned documents/index entries where applicable.

The exact cost model must be evaluated for the specific Firestore edition/query pattern in use rather than assuming one UI request equals one read.

## 4. TeamAi read-minimization rules

UI and runtime code SHOULD:

1. Read only the documents needed for the current screen/action.
2. Prefer targeted document reads and bounded queries over broad collection scans.
3. Use `limit()` and cursor-based pagination for list surfaces.
4. Avoid offsets for pagination because skipped documents are still read/billed.
5. Avoid unnecessary realtime listeners; subscribe only where live updates materially improve the product experience.
6. Reuse safe local/cache state instead of refetching unchanged data.
7. Use aggregation queries or maintained summary/counter documents when they reduce the need to fetch large result sets.
8. Load detailed task/event histories on demand rather than eagerly loading complete histories into every page.
9. Keep UI state separate from canonical server state so navigation or component remounts do not automatically produce redundant reads.

Firestore offline persistence may be used where appropriate. It allows the web/mobile client to work from cached data and synchronize changes when connectivity returns. It is a performance/resilience mechanism, not a replacement for authoritative Firestore state.

## 5. TeamAi write-minimization rules

Trusted execution SHOULD:

1. Avoid writing unchanged values.
2. Avoid duplicate event documents and duplicate idempotency records.
3. Use deterministic IDs and create-if-absent semantics where the domain requires idempotency.
4. Prefer a single durable event/state transition over multiple redundant bookkeeping writes when the same invariant can be represented safely.
5. Use batched writes when atomic multi-document mutation is required, while remembering that each operation still counts separately.
6. Avoid high-frequency updates to a single document when the product does not need every intermediate state.
7. Aggregate counters/telemetry instead of writing a hot document for every low-value event.
8. Store large artifacts outside Firestore where a suitable authorized artifact store exists, keeping only canonical metadata/references in Firestore.

Index design also matters: unnecessary indexing increases write latency and storage footprint. Index exemptions should be considered for fields that never participate in queries.

## 6. What happens when Spark quota is exhausted

TeamAi MUST treat Firestore quota exhaustion as an expected service-resilience condition, not as permission to switch domain databases implicitly.

When the Firebase Spark Firestore no-cost allowance is exhausted, application operations that depend on the affected Firestore service can fail or become unavailable according to Firebase's quota/service enforcement. The current Firebase documentation says the affected product is shut off for the remainder of the applicable Spark period when the project's no-cost product quota is exceeded.

Therefore TeamAi MUST:

`detect → surface bounded failure → preserve local/recovery state → avoid destructive retries → resume/reconcile when service is available`

The UI must not report a successful durable mutation when Firestore has not accepted it.

## 7. What TeamAi must NOT do at quota pressure

Do not:

- silently migrate TeamAi domain state to Supabase Postgres;
- silently create a second Firestore database as a fallback;
- turn browser local storage into the authoritative database;
- treat Vercel, GitHub, Founder Pulse, or MCP as a persistence fallback;
- drop task/event/commerce history merely to reduce reads/writes;
- repeatedly retry failed writes in a tight loop;
- claim completion from an in-memory optimistic UI state without durable confirmation.

Any future alternate durable store would require an explicit Product Law / architecture change and a new authority contract.

## 8. Preferred resilience hierarchy

Use the least authoritative layer capable of safely satisfying the need:

`UI local state → client cache/offline persistence → derived/summary state → targeted Firestore read → trusted Firestore write`

For large artifacts or immutable/static content:

`artifact/file storage or CDN surface → Firestore metadata/reference`

For analytics/operations:

`derived analytics/observation system → Firestore remains domain authority`

These are optimization patterns, not parallel domain authorities.

## 9. Blaze is an economic option, not an architectural fix

Moving from Spark to Blaze removes the Spark shutoff behavior for additional Firestore usage and changes excess usage into pay-as-you-go billing, while preserving the no-cost Firestore allowance. It does **not** justify inefficient query patterns or unconstrained realtime listeners.

Budget alerts are useful on Blaze, but Firebase documents that budget alerts do not themselves hard-cap charges for most paid-tier services. Billing protection therefore must be designed together with application-level usage controls and monitoring.

## 10. Required TeamAi implementation posture

Before 029 UI implementation that touches Firestore, the team should identify for each screen/action:

`what is canonical → what is derived → what is cached → what is read → what is written → whether realtime is necessary → what happens on quota/unavailability → what evidence proves persistence`

This turns Firestore usage from an accidental UI side effect into an explicit part of the product/runtime contract.

## 11. Evidence boundary

Firebase usage dashboards and provider billing/quota telemetry are operational evidence. They do not replace Firestore as the domain authority and do not override Product Law.

A usage alert is an operational signal. A successful Firestore write/read is runtime evidence only for the operation actually exercised.
