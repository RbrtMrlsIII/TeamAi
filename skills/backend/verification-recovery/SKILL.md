# Backend — Verification / Recovery Skill

## WHEN TO USE
Use when proving backend changes, recording environment-limited evidence, or validating failure, timeout, cancellation, retry, and recovery behavior.

## INPUT
Changed backend scope, required contract, environment availability, verification method, evidence requirements, and recovery state.

## AUTHORITY
The governing Masterplan gate and canonical backend contracts define what must be proven. Environment limits affect evidence scope but do not rewrite source status.

## ACTION
Run the smallest sufficient deterministic checks first. Use authoritative runtime verification when required. Distinguish source verification, available-environment verification, live external-runtime proof, and completion/endorsement. Record blocked or unavailable evidence without converting it into a false pass or false architecture failure.

## DO NOT
Do not infer production, hosted, emulator, or live-provider proof from source tests. Do not reopen a completed implementation boundary merely because an external evidence item remains outstanding.

## PASS
The claimed scope has evidence at the appropriate proof level and any remaining limitations are explicit.

## EVIDENCE
Record commands/tests, runtime identifiers where applicable, observed result, limitations, and next authorized evidence action.

## SEE ALSO
- `MASTERPLAN.md`
- `skills/execution/orucaveam/verification/SKILL.md`
- `skills/execution/orucaveam/audit/SKILL.md`
- `skills/governance/learning-handover/SKILL.md`
