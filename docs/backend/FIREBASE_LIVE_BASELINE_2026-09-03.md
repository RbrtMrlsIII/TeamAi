# Firebase Live Baseline — 2026-09-03

## Purpose

Record the first human-observed live Firebase foundation state for `TEAM-BACKEND-001` after recreation of the Firebase project.

## Live project

- Firebase project ID: `team-ai-official`
- Firestore database: `(default)`
- Firebase Authentication providers enabled: Email/Password and Google
- Firestore Security Rules: deployed from the TeamAi Firebase deployment surface
- CLI authentication: completed successfully against the authorized Firebase account

## Firestore observation

The live `(default)` database is reachable from the Firebase CLI. A human-created test document exists outside the canonical TeamAi UID-rooted domain model and is not treated as production TeamAi domain state.

A test composite index was also created for collection `Posts`, indexing `Path1` descending, `Path2` ascending, and `__name__` ascending with collection scope and sparse-all density. At the time of observation it was still building. This index is treated as a live-project test artifact, not as a canonical TeamAi index requirement.

## Rules deployment evidence boundary

The deployed rules visibly match the TeamAi source baseline:

- ownership is rooted at authenticated Firebase UID under `accounts/{uid}`;
- Workplace → Project → Team → Seat paths require the same authenticated UID;
- durable `tasks` and `events` are readable only by the owning UID;
- clients cannot write durable `tasks` or `events`;
- an explicit deny-all fallback covers all other paths.

## What this evidence proves

This record establishes that:

1. the recreated Firebase project is reachable through the authenticated CLI;
2. the `(default)` Firestore database exists;
3. Email/Password and Google authentication providers are enabled;
4. the TeamAi Firestore rules have been deployed to the live project.

## What this evidence does NOT prove

It does not yet prove:

- emulator-based automated rules tests;
- application-level Firebase Auth sign-up/sign-in integration;
- TeamAi domain persistence adapters;
- Workplace → Project → Team/Solo → Seat persistence;
- trusted Supabase Edge execution;
- PayPal UID correlation, webhook verification, or entitlement projection;
- provider/runtime invocation;
- full security/failure/recovery E2E verification.

## Index handling rule

Do not overwrite or delete the live `Posts` test index merely to match the currently empty canonical `firestore.indexes.json`. Reconcile live indexes with the intended TeamAi query requirements before changing the canonical index file.
