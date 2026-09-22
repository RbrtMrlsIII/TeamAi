# Fresh production Firestore evidence

Scope: post-#398 production evidence vehicle.
Authority: Firestore (default) remains the TeamAi domain authority.

## Purpose

Create additive, run-scoped metadata evidence for the authorized Coder Seat. The probe reads the canonical Seat and active Seat connections, then writes one diagnostic document under the project.

## Write boundary

Each run writes only to:
accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/runtime-diagnostics/{runId}

It does not patch the Seat, Connection, task, lease, execution-result, commerce, entitlement, or secret documents.

## Safe evidence

The diagnostic records field names plus non-secret identity, status, authorization, entitlement, provider, budget, and connection capability metadata. Secret-bearing field names are rejected before persistence.

## Operating model

The workflow is workflow_dispatch only and uses the existing protected Firebase service-account/test-hierarchy secrets. Every run receives a fresh UUID-backed run ID, so evidence is additive and historical records are not overwritten.

## Next gates

After the first successful run, use the observed Seat field inventory to reconcile Firestore Rules. Then deploy/read back the checked-in execution-results index, validate the Seat budget runtime read surface, and proceed to controlled real-provider execution and continuation.


## Exact Seat read

The diagnostic now requires the Team ID as an explicit workflow input and performs a direct document read at the canonical team-nested Seat path. This intentionally avoids using a collection-group Seat query for a proof that already has an exact Team/Seat identity. Collection-group queries remain separately governed and indexed where they are needed by application behavior.

## Current execution boundary

The verified Gate 3 diagnostic selectors are:

- team: gate3-test-team
- seat: gate3-test-seat

These are historical test hierarchy identifiers and are safe to use as selectors for the fresh diagnostic.

The fresh production evidence workflow is implemented on the PR #402 branch, but its manual dispatch is currently blocked because GitHub requires the workflow_dispatch workflow file to exist on the repository default branch before it can be manually triggered.

Observed result:
- workflow: firestore-production-evidence.yml
- ref: backend/030-production-runtime-evidence
- API result: HTTP 404, workflow not found for dispatch

The existing default-branch Firestore production Seat diagnostic is not an equivalent substitute. It uses the older collection-group discovery path and its real run already failed at the Firestore HTTP 400 query boundary.

No production-secret PR trigger was introduced to bypass this limitation.

Therefore the fresh Firestore evidence gate remains blocked until a safe default-branch execution vehicle becomes available or the project makes an explicit merge decision. Historical Gate 3 evidence is not counted as fresh 2026-09-22 evidence.
