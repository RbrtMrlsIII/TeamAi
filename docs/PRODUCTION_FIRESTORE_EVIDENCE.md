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

The dedicated `firestore-production-evidence.yml` workflow remains on the PR #402 branch and still cannot be dispatched until that file exists on the repository default branch.

The existing default-branch vehicle `firestore-seat-shape-diagnostic.yml` is now the safe dispatch path for the same exact-path probe. GitHub already knows that workflow on `main`, so a manual run against `backend/030-production-runtime-evidence` executes the PR-branch workflow file. That file no longer uses the collection-group Seat query. It runs `scripts/run-production-firestore-evidence.mjs` with Team ID `gate3-test-team` and the dispatched Seat ID.

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

The protected test project currently has no `teams` documents, so Gate 3 selectors cannot inspect a Coder Seat until that hierarchy exists again or a different authorized path is supplied. Historical Gate 3 collection-group run `35726408785` remains immutable evidence of the HTTP 400 query boundary. None of these runs is Seat-shape verification or 029 completion.

## Index deployment execution boundary

The existing default-branch firestore-index-deploy.yml is the authorized production deployment vehicle for the repository checked-in Firestore indexes.

On 2026-09-22 it was dispatched as run 35734239293 against main commit 87f466fb0edac3784280128785a8fd2dc757e749.

The 2026-09-22 run above is historical evidence for the earlier Service Usage preflight failure and remains immutable. A fresh default-branch production run on 2026-09-25, run `36140968869`, deployed the checked-in index successfully but the repository verifier reported a false negative. Sanitized diagnostic run `36141481871` then exposed the live shape and confirmed the required `execution-results` index is present with Firestore's implicit trailing `__name__ DESCENDING` field.

Therefore the current production issue is verifier normalization, not missing index deployment. PR #413 is the bounded remediation vehicle. No IAM expansion, live index deletion, or `--force` reconciliation is indicated by the current evidence.

## Current production verification findings — 2026-09-25

### Firestore indexes

- Main head tested: `529fede864df0218947377e1d50e48f096c4a7c7`
- Workflow: `.github/workflows/firestore-index-deploy.yml`
- Run `36140968869`: deployment **PASS**, repository readback **FAIL**.
- Temporary sanitized diagnostic run `36141481871` exposed the deployed set. The required `execution-results` collection-group index is present with fields `seatId ASCENDING`, `recordedAt DESCENDING`, and Firestore's implicit trailing `__name__ DESCENDING`. An unrelated `Posts` index is also present.
- Root cause: the repository verifier compared authored fields literally against the deployed export and did not normalize the implicit `__name__` suffix. PR #413 fixes the comparison and adds a regression test. The production index definition itself is not being changed.

### Canonical Gate 3 Seat

- Main head tested: `529fede864df0218947377e1d50e48f096c4a7c7`
- Workflow: `.github/workflows/firestore-seat-shape-diagnostic.yml`
- Run `36141179411` using documented selector `gate3-test-team / gate3-test-seat`.
- Exact team-nested Seat GET returned **404**.
- `teamDocumentCount=0`, `teamListError=null`.
- Negative run-scoped evidence was written with run ID `run-2026-09-25T13-28-39-012Z-7f6a60cf-a26`.
- This does not prove every production Seat is absent. It proves the documented Gate 3 test Seat remains unverified and prevents live Seat authorization/entitlement/budget/execution claims.

### Authority boundary

These findings are production evidence, not release authorization. No live index deletion, `--force` reconciliation, Seat creation, Rules closure, provider execution promotion, or continuation claim is made here.
