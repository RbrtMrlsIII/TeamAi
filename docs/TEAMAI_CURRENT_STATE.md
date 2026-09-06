# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX  
**Revision basis:** `main` @ authenticated `teamai-task-execute` live runtime proof (2026-09-06), plus live Firestore contention/recovery run #7 (`d50f6ab5…`), plus isolated PayPal Sandbox commerce runtime evidence recorded in `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`. The bounded task-execute and contention/recovery gates are RUNTIME-PROVEN; the isolated PayPal v5c delivery/HTTP-200 gate is RUNTIME-PROVEN while the post-fix Firestore aggregate transition remains a separate verification step.

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION** with **RUNTIME-PROVEN** bounded sub-gates for (a) live two-worker lease contention + durable result restart/recovery (GitHub Actions run #7), (b) authenticated `teamai-task-execute` Edge execution, and (c) isolated PayPal Sandbox delivery to `teamai-paypal-webhook-v5c` with real `PAYMENT.CAPTURE.COMPLETED` evidence and v13 HTTP 200 redelivery. Still open: final audit/traceability, HandOver/Endorsement, definitive post-fix Firestore aggregate verification, and remaining authenticated product-path integration beyond these bounded slices.
- `TEAM-BACKEND-002`: **IMPLEMENTED** on `main` (settings draft/Save boundary, conversation-turn durability, transcript working-set read reduction, result retrieval, token-cache / read-write economy). Live probe secrets and workflow are operational; economy rules are source-tested and used by the live probe path.
- `TEAM-EXPERIENCE-029`: **presentation implementation materially inhabited; backend/live-domain integration and full completion frontier remain open**.
- GitHub is the engineering/source authority.
- Firebase `(default)` Firestore is the durable application/domain-state authority.
- Firebase Auth owns identity / Firebase UID ownership.
- Supabase Edge Functions own trusted server execution and PayPal webhook handling.
- PayPal is external payment-provider event authority.
- Firebase Hosting is current TeamAi web delivery authority.
- GitHub Pages is validation-only static browser publication for the spatial UI.
- Vercel is **paused/cut off by current policy** and must not be resumed without explicit user approval.

## Live PayPal commerce evidence

**Status:** bounded isolated runtime gate **RUNTIME-PROVEN** for real Sandbox capture → PayPal webhook delivery to v5c → HTTP 200. The post-fix Firestore state transition remains separately open until directly re-read after the v13 redelivery.

Canonical hierarchy:

`accounts/{uid}/commerce/{correlationId}`  
`accounts/{uid}/commerce/{correlationId}/events/{providerEventId}`  
`accounts/{uid}/commerce/{correlationId}/entitlements/{entitlementId}`  
`commerceCorrelationIndex/{correlationId}`

Runtime evidence already established: server-owned TeamAi `correlationId` matched PayPal `custom_id`; Sandbox OAuth succeeded; a real Sandbox order was created and approved; capture completed; real `PAYMENT.CAPTURE.COMPLETED` event `WH-71666988RB043112X-1WA30416DF8293903` exposed the same correlation; v12 returned HTTP 200 and produced the previously observed pending-aggregate/active-entitlement state; after the aggregate-state correction, v13 was deployed and the same event was resent, producing a new PayPal-originated POST invocation on deployment/version 13 with HTTP 200.

Evidence record: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`

## Remaining TEAM-BACKEND-001 frontier

1. Final audit/traceability, HandOver, and Endorsement evidence.
2. Full authenticated product-path integration beyond the bounded Edge slice, including any required scheduler/approval contract integration not exercised by this operator call.
3. **Post-fix Firestore verification:** directly re-read the existing aggregate/event/entitlement after the v13 redelivery and prove the expected aggregate transition to `completed` without duplicate event creation.

## Frontend reality

The spatial frontend remains fixture-backed presentation. Fixtures are presentation content, not durable domain authority. Backend-owned read-model integration is still a separate controlled slice.

The next frontend gate should therefore begin from the canonical commerce contract, not from PayPal-specific event payloads: aggregate status is the primary commerce UI authority; events are durable history/evidence; entitlements are the access projection.

## Evidence language

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
