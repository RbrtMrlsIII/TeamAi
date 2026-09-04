# ORUCAVEAM — Verification Skill

## WHEN TO USE
Use to define and run the smallest sufficient verification that proves the claimed execution scope.

## INPUT
Claimed result, changed paths/systems, applicable verification method, and required evidence boundary.

## AUTHORITY
The governing Masterplan gate and applicable verification contracts determine what must be proven.

## ACTION
Match the verification method to the actual scope: deterministic source/tests for source behavior, authoritative read-back for durable state, controlled browser verification for browser behavior, and explicit external-runtime evidence where required.

## DO NOT
Do not treat green tests, screenshots, deployment presence, or AI assertions as proof of untested scope.

## PASS
The selected evidence directly demonstrates the behavior or state claimed as complete, with limitations recorded.

## EVIDENCE
Record verification command/result, tested scope, relevant identifiers, and remaining limitations.

## SEE ALSO
- `POLICY.md`
- `MASTERPLAN.md`
- `skills/verification/browser-smoke/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
