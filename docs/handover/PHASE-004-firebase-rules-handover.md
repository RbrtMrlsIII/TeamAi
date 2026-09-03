# Handover — PHASE-004-firebase-rules

## Current state
PHASE-004 is the active bounded backend gate inside TEAM-BACKEND-001.

The repository now has a restored Firebase Auth/Firestore emulator configuration and a reproducible rules harness. Full emulator execution remains pending.

## Authority
- Product authority: `PRODUCT_LAW.md`
- Execution authority: `MASTERPLAN.md`
- Backend guide: `docs/backend/FIREBASE_BACKEND_GUIDE.md`
- ORUCAVEA discipline: `build-system/skills/_grok-high-level/agent-orucavea/SKILL.md`

## Guardrail
Do not start canonical commerce implementation while the PHASE-004 executable rules evidence is incomplete.

## Next executor
Run:
`npm run firebase:rules:gate`

Expected assertions:
- same-UID account read/write allowed;
- cross-UID account read/write denied;
- each UID can access only its own account root;
- client task write denied;
- client event write denied.

Record actual output in `validation/evidence/PHASE-004-firebase-rules.md`, then perform the ORUCAVEA Endorse/Advance steps only after successful execution.
