# Production Firestore Seat diagnostic evidence — 2026-09-22

## Observed target

The authorized test hierarchy supplied for the 030 production evidence gate is:

```
accounts/{uid}/workplaces/gate3-test-workplace/
  projects/gate3-test-project/
    teams/gate3-test-team/
      seats/gate3-test-seat
```

The exact Seat ID is `gate3-test-seat`.

## First diagnostic attempt

After PR #398 merged, the existing `firestore-seat-shape-diagnostic.yml` workflow was manually dispatched against `main`.

- Workflow run: `35726408785`
- Main head: `87f466fb0edac3784280128785a8fd2dc757e749`
- Input Seat ID: `gate3-test-seat`
- Result: failed before Seat inspection
- Failure: Firestore REST `runQuery` returned HTTP 400 while resolving the Seat through the collection-group query in `scripts/diagnose-production-firestore-seat.mjs`.

This result is evidence of a diagnostic/query-boundary failure. It is **not** evidence that the production Seat document is malformed because the Seat document was never reached.

## Correction in PR #402

The successor diagnostic is intentionally narrower for this proof:

- Team ID is explicit.
- The canonical Seat is read directly at the exact team-nested document path.
- The returned document name is validated against all expected identity components.
- Active connections are inspected separately.
- Only non-secret metadata is persisted.
- Evidence is written additively under a fresh `runtime-diagnostics/{runId}` document.

This removes the unnecessary collection-group dependency from the Seat-shape proof. Collection-group queries remain a separate application/index concern where actually required.

## Default-branch dispatch vehicle

GitHub will not dispatch a `workflow_dispatch` workflow until that file exists on the default branch. The new `firestore-production-evidence.yml` file is still PR-branch-only, so it remains undispatchable.

The existing default-branch workflow `firestore-seat-shape-diagnostic.yml` is therefore reused as the execution vehicle. On this PR branch it keeps the same filename, trigger, secrets, and `seat_id` input so GitHub can run it against `backend/030-production-runtime-evidence`. The job now invokes `scripts/run-production-firestore-evidence.mjs` with Team ID `gate3-test-team`.

The old collection-group script remains in the repository as parked historical source. It is no longer the live dispatch path.

## Evidence boundary

A successful successor run will establish the observed production field inventory for this exact Seat and run. It will not, by itself, establish Firestore Rules closure, index deployment, provider execution, continuation, or release acceptance.


## Successor probe status

The first post-#398 production run demonstrated that the historical collection-group Seat resolver is not currently usable for this diagnostic because its Firestore REST query returned HTTP 400 before the Seat document was reached. The successor probe therefore uses the exact known team-nested Seat path as its authoritative diagnostic read boundary.
