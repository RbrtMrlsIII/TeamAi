# TeamAi — User-Directed Validation and Truth Model

**Status:** Governance contract proposal anchored by Issue #260.

## Core principle

Validation protects the current agreed truth; it does not independently define product intent.

The user can change desired product truth. Evidence determines whether the implementation actually reached that truth.

## Truth classes

- **Source Truth:** explicit current user/product-owner decision for the requested scope.
- **Contract Truth:** current authorized Product Law, Masterplan, contracts, and acceptance definitions.
- **Implementation Truth:** what the repository/deployed implementation actually does.
- **Validation Truth:** what tests, governance checks, CI gates, and browser checks assert or reject.
- **Evidence Truth:** what was actually observed, measured, exercised, or demonstrated.
- **Historical Truth:** what was previously true, including superseded and retired states.
- **Current Authoritative Truth:** the reconciled present state represented by current contracts and validated by implementation/evidence.

A user cannot turn unobserved evidence into observed evidence.

## Authority and ORUCAVEAM

Use the existing authority chain:

`Human/User Authority → PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → concrete skills → issue/slice → implementation → verification/evidence → HandOver → Endorsement`

ORUCAVEAM remains the single execution-discipline framework. It does not become a second authority.

For user-directed validation changes:

- **O — Objective:** state the exact requested outcome and intended change.
- **R — Restrictions:** preserve unrelated safeguards, history, security/authorization, and non-targeted contracts.
- **U — User Authority:** record the explicit user decision/approval permitting the action.
- **C — Canonical Authority:** identify the canonical owner of the old and new meaning/state.
- **A — Action:** make the smallest coherent contract/implementation/validation change.
- **V — Verification:** verify the new behavior and its evidence class; do not treat CI green as broader proof.
- **E — Efficiency:** avoid unnecessary work while preserving required proof.
- **A — Audit:** record decision, affected surfaces, cost, evidence, limitations, and next state.
- **M — Minimalistic Efficiency / Resource Use:** use the minimum sufficient authoritative resources; never skip required proof for efficiency.

## Validation-change protocol

`detect conflict → classify → warn user → cost/risk/output accounting → required authority → update canonical contract → update dependent validation → re-run strict validation → record evidence`

Never weaken validation merely to make CI green.

## Mandatory warning

Before changing validation, identify the validator/test/gate, old assumption, new rule, changed protection, replacement protection, implementation cost, validation cost, evidence/browser cost, operator/external cost, affected surfaces, expected output, and residual uncertainty.

High-impact validation changes follow the human/source-of-truth approval boundary established by the repository's existing governance precedent, including PR #132.

## Archive boundary

Retired/superseded ideas are preserved as historical, non-authoritative institutional memory. Active documentation should use compact redirects to archive records rather than repeated warning prose.

A dedicated `archive/superseded` branch may store snapshots, but the durable archive authority is the archive record/index plus recoverable commit provenance. The branch is not a development queue.

## PR #259 example

The user-directed experience is:

`WEBSITE ENTRANCE → deliberate handoff → 3D WORLD / MACHINE ENVIRONMENT`

`HERO_LOW_ORBIT` and `TURN_FOLLOW` are intentionally retired. New validation should prove their absence and the replacement camera/transition behavior.

The observed governance failure:

`GOVERNANCE-DRIFT: active indexes are older than implementation change: public/index.html`

is a valid synchronization/freshness signal, but is not evidence that the user-directed product decision is wrong. The proper response is to reconcile the new authorized contract and dependent validation, preserve unrelated governance knowledge, and rerun strict gates.
