# Validation Evidence — PHASE-004-firebase-rules

## Validation status
**INCOMPLETE — harness prepared; full emulator execution not yet evidenced**

## Executed in this environment
- `bash -n build-system/scripts/firebase-rules-gate-004.sh` — PASS (syntax validation of the committed harness design).
- Required local primitives `bash`, `curl`, `node`, and `npx` are present.
- Firebase CLI is not installed in the available execution environment.
- External package/network access is unavailable in this environment, so `npx --yes firebase-tools@15.28.2` could not be exercised here.

## Repository evidence
- `firebase.json` contains Auth emulator port `9099`, Firestore emulator port `8080`, and emulator UI port `4000`.
- `package.json` exposes `npm run firebase:rules:gate`.
- `firestore.rules` defines UID-scoped account/workplace/project/team/seat access, read-only task/event client visibility, and deny-all fallback.
- `build-system/scripts/firebase-rules-gate-004.sh` creates two emulator users and asserts same-UID allow, cross-UID deny, and client task/event write denial.

## Required remaining execution
Run `npm run firebase:rules:gate` in an environment with the Firebase CLI/network available and capture the resulting successful assertions. Do not mark PHASE-004 complete from source inspection or shell syntax alone.

## Gate disposition
**BLOCKED on executable emulator evidence.** Do not advance to PHASE-005 canonical commerce implementation until this evidence exists.
