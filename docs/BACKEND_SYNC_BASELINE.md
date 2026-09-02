# Backend Synchronization Baseline — 2026-09-03

## Canonical project baseline

The clean TeamAi package is the reconciliation baseline for the backend-first transition. Its local SHA-256 is recorded in `docs/BACKEND_REBASELINE_MANIFEST.json`.

## Canonical phase order

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Important status

TEAM-BACKEND-001 is planning-authorized and implementation is not complete. The active retired relational backend path has been removed from the clean product baseline. Final Git-history purge remains a separate destructive gate.

## GitHub synchronization rule

GitHub must match the clean package before production implementation advances. Exact byte-for-byte parity is a required verification result, not an assumption.

The connected GitHub interface used in this session cannot ingest a local binary archive as a complete repository snapshot, so this document records the reconciliation state without falsely certifying full byte parity.
