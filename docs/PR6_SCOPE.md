# PR #6 Scope

This branch establishes the backend-first rebaseline required before TEAM-EXPERIENCE-029 production frontend implementation.

## Canonical sequence

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Branch purpose

Remove the retired relational backend from the active application path, install the canonical authority guard, and record the backend-first foundation contracts required before 029.

## Explicitly not implemented

No Firestore production domain runtime, privileged Edge-to-Firestore bridge, PayPal subscription transaction, commercial button/plan flow, durable worker runtime, or end-to-end backend completion is claimed by this branch.

## Final retirement gate

After clean-baseline preservation and verification, the retired implementation will be removed from Git history through a separate controlled destructive operation with post-purge verification.

## Validation status

The clean local baseline passes the backend-authority structural audit. Full Node dependency installation/typecheck/test was not completed in the available runtime, so no broader completion claim is made.
