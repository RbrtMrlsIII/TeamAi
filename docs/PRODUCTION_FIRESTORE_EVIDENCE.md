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

After the first successful Seat-shape run, use the observed Seat field inventory to reconcile Firestore Rules. Index deploy/readback is already RUNTIME-PROVEN. Then validate the Seat budget runtime read surface, and proceed to controlled real-provider execution and continuation.


## Exact Seat read

The diagnostic requires both Team ID and Seat ID as explicit workflow inputs and performs a direct document read at the canonical team-nested Seat path. This intentionally avoids using a collection-group Seat query for a proof that already has an exact Team/Seat identity. Collection-group queries remain separately governed and indexed where they are needed by application behavior.

## Current execution boundary

The verified Gate 3 diagnostic selectors are:

- team: gate3-test-team
- seat: gate3-test-seat

These are historical test hierarchy identifiers and are safe to use as selectors for the fresh diagnostic.

The dedicated `firestore-production-evidence.yml` workflow exists on the default branch as a protected `workflow_dispatch` vehicle. The existing default-branch vehicle `firestore-seat-shape-diagnostic.yml` remains the current Gate 3 dispatch path for the exact-path probe. It now requires both Team ID and Seat ID at manual dispatch so an operator can select another authorized Team/Seat pair without changing the service-account, UID, workplace, project, or probe write boundary.

First exact-path dispatch after that rewiring:

- workflow run: `35762786313`
- head: `6ee82e0ca92c5bd8e7485fff3d6345eb8a955538`
- branch: `backend/030-production-runtime-evidence`
- selectors: team `gate3-test-team`, seat `gate3-test-seat`
- result: Firestore document GET returned 404; script exited `canonical Seat document not found`
- this is not a collection-group HTTP 400 and not a service-account token failure
- no Seat, Connection, or secret document was mutated
- the first exact-path attempt did not write `runtime-diagnostics` because it threw before the write

Durable negative evidence from the corrected probe:

- workflow run: `35763013851`
- head: `a7baf21bc752c3ecbdbfc2589f2c4e2a58c70f23`
- runId: `run-2026-09-22T17-48-26-734Z-edb51fd8-897`
- result: `canonical_seat_not_found`, `seatPresent: false`, `teamDocumentCount: 0`, `teamListError: null`
- exit code 2, as designed for a missing Seat
- additive `runtime-diagnostics` document written; canonical Seat/Connection documents were not patched

The protected test project currently has no `teams` documents, so Gate 3 selectors cannot inspect a Coder Seat until that hierarchy exists again or a different authorized path is supplied. The missing-Seat probe now classifies that condition as `operator_hierarchy_absent`. It writes only additive `runtime-diagnostics/{runId}` evidence and does not create Seat or Connection documents. Historical Gate 3 collection-group run `35726408785` remains immutable evidence of the HTTP 400 query boundary. None of these runs is Seat-shape verification or 029 completion.

## Historical continuity and scope caveat

The archived 2026-09-03 Gate 3 evidence proves that the named `gate3-test-workplace / gate3-test-project / gate3-test-team / gate3-test-seat` hierarchy was successfully exercised through `teamai-domain-bootstrap` and independently read from Firestore under a verified Firebase UID at that time. The archived record intentionally does not expose the UID value.

The current 030 diagnostic resolves its parent path from the protected `TEAMAI_FIREBASE_TEST_UID`, `TEAMAI_FIREBASE_TEST_WORKPLACE_ID`, and `TEAMAI_FIREBASE_TEST_PROJECT_ID` secrets. The repository can therefore prove the current empty-hierarchy condition only for that configured diagnostic scope. It cannot prove from repository-visible evidence alone that the September 3 UID is identical to today's diagnostic UID, nor can it prove that the hierarchy was deleted or reset rather than that the protected diagnostic scope changed.

**Operational consequence:** preserve both evidence records as valid observations. Do not rewrite the September 3 PASS, do not infer deletion/reset causality, and do not fabricate a replacement Seat. An operator-authorized hierarchy or a different authorized inspection path is required for the next Gate 3 read.

## Index deployment execution boundary

The existing default-branch firestore-index-deploy.yml is the authorized production deployment vehicle for the repository checked-in Firestore indexes.

On 2026-09-22 it was dispatched as run 35734239293 against main commit 87f466fb0edac3784280128785a8fd2dc757e749.

A fresh default-branch production run on 2026-09-25, run `36140968869`, deployed the checked-in index successfully but the repository verifier reported a false negative. Sanitized diagnostic run `36141481871` then exposed the live shape and confirmed the required `execution-results` index is present with Firestore's implicit trailing `__name__ DESCENDING` field.

PR #413 repaired that verifier comparison and merged at `ce1656b7190fa8657253385fd884837ff7d12653`. Post-merge default-branch run `36146692843` passed deploy and normalized readback (`requiredCount=1`, `deployedCount=2`, `missing=[]`). Index verification is therefore RUNTIME-PROVEN. No IAM expansion, live index deletion, or `--force` reconciliation is indicated.

## Current production verification findings — 2026-09-25

### Firestore indexes

- Main head tested: `529fede864df0218947377e1d50e48f096c4a7c7`
- Workflow: `.github/workflows/firestore-index-deploy.yml`
- Run `36140968869`: deployment **PASS**, repository readback **FAIL**.
- Temporary sanitized diagnostic run `36141481871` exposed the deployed set. The required `execution-results` collection-group index is present with fields `seatId ASCENDING`, `recordedAt DESCENDING`, and Firestore's implicit trailing `__name__ DESCENDING`. An unrelated `Posts` index is also present.
- Root cause of the earlier false negative: the repository verifier compared authored fields literally against the deployed export and did not normalize the implicit `__name__` suffix. PR #413 fixed the comparison and added a regression test. Post-merge run `36146692843` on exact main `ce1656b7190fa8657253385fd884837ff7d12653` is the RUNTIME-PROVEN readback.

### Canonical Gate 3 Seat

- Main head tested: `529fede864df0218947377e1d50e48f096c4a7c7`
- Workflow: `.github/workflows/firestore-seat-shape-diagnostic.yml`
- Run `36141179411` using documented selector `gate3-test-team / gate3-test-seat`.
- Exact team-nested Seat GET returned **404**.
- `teamDocumentCount=0`, `teamListError=null`.
- Negative run-scoped evidence was written with run ID `run-2026-09-25T13-28-39-012Z-7f6a60cf-a26`.
- This does not prove every production Seat is absent. It proves the documented Gate 3 test Seat remains unverified and is classified as `operator_hierarchy_absent`. The probe does not create Seat documents and therefore prevents live Seat authorization/entitlement/budget/execution claims until an operator-authorized hierarchy exists or a different authorized path is supplied.

### Authority boundary

These findings are production evidence, not release authorization. No live index deletion, `--force` reconciliation, Seat creation, Rules closure, provider execution promotion, or continuation claim is made here.
