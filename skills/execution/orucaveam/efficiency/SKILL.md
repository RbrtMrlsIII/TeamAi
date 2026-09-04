# ORUCAVEAM — Efficiency Skill

## WHEN TO USE
Use when choosing an execution approach that avoids unnecessary work while preserving correctness and required evidence.

## INPUT
Task scope, required evidence, available skills/tools, likely cost or churn, and current state.

## AUTHORITY
Policy defines the efficiency discipline; canonical authorities and required verification cannot be weakened for convenience.

## ACTION
Prefer targeted reads, coherent changes, deterministic checks before hosted checks, reuse of valid evidence, bounded context, and idempotent operations. When the efficiency decision concerns the number or sequence of tool/resource operations, compose `skills/tools/minimal-tool-usage/SKILL.md` for the ORUCAVEAM M dimension.

## DO NOT
Do not skip mandatory verification, weaken a canonical boundary, or replace authoritative infrastructure merely to reduce effort.

## PASS
The chosen execution approach is materially leaner without reducing correctness, authorization, or evidence quality.

## EVIDENCE
Record material efficiency decisions when they affect scope, resource use, or verification ordering.

## SEE ALSO
- `POLICY.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/tools/minimal-tool-usage/SKILL.md`
