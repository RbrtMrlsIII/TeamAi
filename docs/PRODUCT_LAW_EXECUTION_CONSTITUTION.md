# TeamAi Product Law Execution Constitution

Status: SUBORDINATE EXECUTION PROPOSAL / REAL WITHIN THIS PR ONLY

This constitution proposes execution rules for product-law, implementation, evidence, and promotion decisions in TeamAi. It is subordinate to `PRODUCT_LAW.md`, `MASTERPLAN.md`, `POLICY.md` / ORUCAVEAM, applicable governed decisions, and Issue #278 as the active 029 execution ledger. Nothing in this document amends, supersedes, reinterprets, or self-authorizes a change to those authorities. A conflict is a stop-promotion condition and must be resolved at the existing higher authority.

## 1. Truth hierarchy

1. Product law and explicit governed decisions are authoritative.
2. Acceptance criteria are binding proof requirements.
3. Repository implementation is tempo until promoted.
4. CI, browser runs, screenshots, and runtime observations are evidence, never authority by themselves.
5. Assistant judgment may propose or execute changes only inside the higher levels above.

## 2. Execution rules

- Never call tempo product truth.
- Never widen scope merely to make a failing gate disappear.
- Prefer one narrow causal change over a bundle of speculative fixes.
- Preserve historical behavior only when its contract is known and explicitly retained.
- When authority ownership is ambiguous, stop promotion and define the authority boundary before adding behavior.
- When a test fails, classify it as product-contract failure, implementation failure, harness failure, or infrastructure failure before changing code.
- Do not use CI green as permission to bypass an unmet law gate.
- Do not use a passing visual result as proof of semantic correctness.
- Any new machine behavior must expose a deterministic invariant that can be falsified.

## 3. Change discipline

Every implementation change must have exactly one primary reason:

- satisfy a law gate;
- repair a demonstrated regression;
- remove an authority collision;
- establish a missing deterministic contract;
- or reduce implementation debt that directly blocks a law gate.

If a change has no primary reason, it is deferred.

## 4. Promotion discipline

A component may move from TEMPO to ACCEPTED only when:

- the relevant law gate passes;
- evidence is reproducible;
- authority ownership is explicit;
- no unresolved contradictory evidence exists;
- and the promotion is recorded as a governed project decision at the existing higher authority.

These rules do not independently authorize promotion.

## 5. Machine-specific rule

For the Hero, semantic truth must flow through:

`payload → machine state → parts/ports/relationships → geometry → transition → subject → camera → rendering`

No downstream presentation layer may silently become the upstream owner of semantic identity.

## 6. Recovery rule

When a branch becomes confused, do not stack another patch on top of uncertainty. First recover the canonical base/head relationship, then continue from the corrected graph.

## 7. Reporting rule

Reports must distinguish facts, evidence, decisions, and proposals. Claims must cite the repository or workflow evidence supporting them.
