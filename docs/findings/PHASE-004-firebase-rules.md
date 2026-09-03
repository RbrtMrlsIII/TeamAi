# Finding — PHASE-004-firebase-rules

## Observe
The canonical backend sequence places Firebase Emulator / Security Rules execution before PayPal commerce, auth extension, runtime, and 029 release. The Firebase backend guide requires local Auth/Firestore emulator development and rules validation.

The TEAM-BACKEND-001 PR previously removed the `emulators` block from `firebase.json`, creating an execution-path gap for Gate 4.

## Record
Phase: `PHASE-004-firebase-rules`
Parent phase: `TEAM-BACKEND-001`
Classification: **BOUNDED**
Status: **IN PROGRESS — execution path restored; evidence run pending**

## Understand
The modeled rules currently establish:
- authenticated UID may read/write its own account → workplace → project → team → seat hierarchy;
- authenticated UID may read, but not write, modeled task documents;
- authenticated UID may read, but not write, modeled event documents;
- all other paths are denied by the fallback rule.

Gate 4 must verify these behaviors through the Firebase Auth + Firestore emulators rather than relying only on source inspection or production deployment evidence.

## Align
Smallest bounded change:
1. restore Auth/Firestore emulator configuration in `firebase.json`;
2. add one reproducible Gate-4 shell harness using the Firebase CLI and emulator REST endpoints;
3. add ORUCAVEA finding/evidence/checkpoint records without changing commerce or production authority.

## Validate
Repository-local shell syntax can be checked without external services. Full emulator execution still requires the Firebase CLI/runtime environment and must be run before this phase can be marked complete.

Required executable assertions:
- UID A can write/read its own account path;
- UID B cannot read/write UID A's account path;
- UID B can write/read its own account path;
- UID A cannot client-write authoritative task state;
- UID A cannot client-write authoritative event state.

## Advance condition
Do not advance to PHASE-005 / canonical commerce until the executable emulator/rules evidence is captured and recorded.
