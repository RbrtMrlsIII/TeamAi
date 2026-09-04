# Minimalistic Tool / Resource Usage Skill

## WHEN TO USE
Use when deciding how many reads, writes, external calls, builds, deployments, browser runs, or context transfers are necessary.

## INPUT
Objective, canonical authority, required evidence, available tool/service, current resource constraints, and failure/retry characteristics.

## ACTION
1. Identify the authoritative operation that actually answers the question or changes state.
2. Prefer a targeted read/write over a broad scan when equivalent evidence can be obtained.
3. Reuse already verified state instead of repeating identical external calls.
4. Batch coherent changes when doing so preserves reviewability and does not hide independent risk.
5. Perform expensive hosted/browser/deployment verification only when it adds evidence unavailable from cheaper deterministic checks.
6. Avoid destructive retries and duplicate writes; use idempotency where supported.
7. Record why an external or expensive operation was necessary when it materially affects resources or deployment churn.

## DO NOT
- Replace authoritative verification with a cheaper non-authoritative shortcut.
- Skip a required check solely to minimize tool usage.
- Treat fewer tool calls as inherently better than trustworthy evidence.
- Use deployment suppression to conceal a failing or unexpected condition.

## PASS
The chosen operations are the minimum sufficient set that still provides trustworthy completion evidence.

## EVIDENCE
Record authoritative source, selected operations, important limitations, and verification result.

## SEE ALSO
- `POLICY.md`
- `skills/execution/orucaveam/SKILL.md`
- `docs/SKILL_WIRING.md`
