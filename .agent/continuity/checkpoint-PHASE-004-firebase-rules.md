# PHASE-004 Checkpoint — Firebase Emulator / Security Rules

## Status
IN PROGRESS / VALIDATION BLOCKED

## Parent
TEAM-BACKEND-001

## Objective
Establish executable Auth/Firestore Security Rules behavior before advancing to canonical commerce.

## ORUCAVEA classification
BOUNDED

## Completed
- observed the Gate-4 execution gap;
- recorded the gap in `docs/findings/PHASE-004-firebase-rules.md`;
- restored Auth/Firestore emulator configuration in `firebase.json`;
- added `build-system/scripts/firebase-rules-gate-004.sh`;
- exposed the harness through `npm run firebase:rules:gate`;
- recorded validation boundary in `validation/evidence/PHASE-004-firebase-rules.md`.

## Validation boundary
The harness syntax validates locally, but full Firebase Emulator execution has not been evidenced in this environment because the Firebase CLI is unavailable and external package installation cannot run.

## Required next action
Run `npm run firebase:rules:gate` in an environment with Firebase CLI/package access. Capture successful same-UID, cross-UID, and server-owned task/event assertions.

## Advance rule
PHASE-005 canonical commerce remains locked until PHASE-004 executable evidence passes.
