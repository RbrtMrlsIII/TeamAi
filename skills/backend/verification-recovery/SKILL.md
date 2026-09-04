# Backend — Verification / Recovery Skill

## WHEN TO USE
Use when proving backend behavior or locating the recovery path after an identity, state, runtime, or commerce failure.

## INPUT
Failed or unverified backend path, expected owner, and available evidence.

## AUTHORITY
Recovery location may be shown on F6 Status. F6 does not diagnose or repair backend authority.

## ACTION
Separate source-contract evidence, environment evidence, and live runtime evidence. Point recovery to the owning service, not to a UI field.

## DO NOT
Do not treat F6 Status as a debugger. Do not treat a browser screenshot as backend recovery proof.

## PASS
The failure owner and next recovery path are identified without transferring authority to presentation.

## EVIDENCE
Record owner, evidence class, limitation, and recovery location.

## SEE ALSO
- `skills/backend/authority-contract/SKILL.md`
- `skills/verification/browser-smoke/SKILL.md`
