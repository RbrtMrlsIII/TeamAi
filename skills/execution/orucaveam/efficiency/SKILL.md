# ORUCAVEAM — Efficiency Skill

## WHEN TO USE
Use when choosing an execution approach that avoids unnecessary work while preserving correctness and required evidence.

## INPUT
Task scope, required evidence, available skills/tools, likely cost or churn, and current state.

## AUTHORITY
Policy defines the efficiency discipline; canonical authorities and required verification cannot be weakened for convenience.

## ACTION
Prefer targeted reads, coherent changes, deterministic checks before hosted checks, reuse of valid evidence, bounded context, and idempotent operations. Stop unnecessary work that does not improve completion confidence.

## DO NOT
Do not skip mandatory verification, weaken a canonical boundary, or replace authoritative infrastructure merely to reduce effort.

## PASS
The chosen execution approach is materially leaner without reducing correctness, authorization, or evidence quality.

## EVIDENCE
Record material efficiency decisions when they affect scope, resource use, or verification ordering.

## SEE ALSO
- `POLICY.md`
- `skills/execution/orucaveam/minimalistic-resource-use/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
