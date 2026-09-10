# TeamAi Governance — Fail-Closed Active-Index Validation

**Status:** CANONICAL GOVERNANCE PROCEDURE

## Purpose

TeamAi treats current documentation state as an input to implementation validation. Tests alone do not establish that an agent's work is valid.

## Hard laws

> **LAW-A:** No implementation claim is valid unless the required active indexes are synchronized with the validating change.

> **LAW-B:** No active-index claim is valid unless its referenced implementation/evidence is present and resolvable.

> **LAW-C:** When governance state cannot be established, validation fails closed.

## Required validation chain

```text
PRODUCT_LAW.md
    ↓
MASTERPLAN.md
    ↓
.github/teamai/execution-state.yml
    ↓
TEAMAI_029_CURRENT_STATE_MAP.md
    ↓
TEAMAI_3D_HERO_NEXT_SLICES.md
    ↓
SKILL_WIRING.md
    ↓
implementation / evidence
    ↓
governance-drift + evidence-consistency
    ↓
AGENT-WORK-VALID
```

## State manifest

`.github/teamai/execution-state.yml` is the machine-readable mirror of the active frontier, bounded claim states, evidence references, canonical indexes, implementation coupling, and immutable historical prefixes.

Agents must not invent current state outside that chain.

## Claim IDs

Important active claims have stable identifiers in the manifest and may be embedded in active-index files with:

```html
<!-- teamai-claim: CLAIM-ID state=STATE -->
```

The validator rejects unknown claim IDs and state mismatches. Masterplan remains a long-form chronological pointer and is checked by exact current-state assertions rather than requiring structural comment markers.

## Implementation coupling

The governance validator maps implementation roots to required active-index updates:

| Changed root | Required active-index synchronization |
|---|---|
| `public/` or `skills/frontend/spatial/` | `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` |
| `backend/` or `supabase/` | `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `backend/BACKEND_LIVE_SERVICE_STATUS.md` |
| `skills/` | `docs/SKILL_WIRING.md` |

A code change without its required documentation reconciliation is `AGENT-WORK-UNVALIDATED` and fails the governance check.

## Historical evidence protection

Existing records under the configured historical prefixes are treated as audit strata. Modifying, deleting, or renaming an existing historical record fails validation. New evidence files may be added when the evidence workflow requires them.

Historical wording is not retroactively rewritten merely because a later active index supersedes it.

## Agent validation

`agent-validation` is generated only after `governance-drift` and `evidence-consistency` pass. The workflow creates `.validation/teamai-validation.json` in the runner and publishes it as an Actions artifact. It is not a hand-authored repository file.

The only valid verdict emitted by that workflow is:

```text
AGENT-WORK-VALID
```

Otherwise the agent work is not merge-valid under this governance model.

## Frontier lock

The current spatial frontier is machine-locked to `V3.3` / `SP-07` until a future change updates the manifest with a new authorized state and matching evidence.

This prevents documentation drift from silently promoting a later slice.

## GitHub enforcement

The repository ruleset must require these exact checks on `main`:

```text
TeamAi / governance-drift
TeamAi / evidence-consistency
TeamAi / agent-validation
```

The connected GitHub identity used for TeamAi currently has push/triage/pull access but not repository administration. Therefore the final required-check switch must be performed by a repository administrator. Until that switch is enabled, the workflow can detect and fail governance drift but GitHub merge enforcement is not complete.

Direct bypass of `main` remains separately controlled by the repository's existing merge-protection ruleset.
