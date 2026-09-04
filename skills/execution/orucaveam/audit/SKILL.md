# ORUCAVEAM — Audit Skill

## WHEN TO USE
Use when preserving the trace needed for another agent or reviewer to understand and reproduce the execution decision.

## INPUT
Action record, authority sources, affected paths/systems, verification results, limitations, and next state.

## AUTHORITY
Policy defines the audit obligation; canonical evidence and repository history remain the authoritative trace sources.

## ACTION
Capture enough durable context to reconstruct what was authorized, what changed, what was verified, what remained limited, and what should happen next.

## DO NOT
Do not create audit records that contradict canonical source state or turn chat narrative into unverified product fact.

## PASS
Another agent can follow the recorded trace without needing to reconstruct the decision from private conversation memory.

## EVIDENCE
Link the relevant commit/paths, verification results, handover, endorsement, and applicable knowledge record.

## SEE ALSO
- `POLICY.md`
- `docs/project-guide/HandOver.md`
- `docs/project-guide/Endorsement.md`
- `skills/execution/orucaveam/SKILL.md`
