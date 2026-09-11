# Overall User-Directed Validation Protocol

**Status:** CANONICAL governance contract (Issue **#260**)  
**Authority:** Product Law → this protocol → active indexes → validators → evidence  
**Precedents:** PR **#132** (human approval for validation-boundary change); PR **#259** (user-directed camera retirement / Layer A→B)  
**Companion:** `docs/GOVERNANCE_FAIL_CLOSED.md`, `docs/archive/superseded/INDEX.md`

## Core principle

> **Validation protects the current agreed truth. It does not define the truth by itself.**

Validation is a guardrail, not the steering wheel.

## Post-merge rule (new current truth)

Once a **user-authorized** change is **merged to `main`**, it becomes **current implementation truth** until deliberately superseded.

```text
merge → NEW CURRENT TRUTH
         ↓
future validation must agree with the merged state
         ↓
previous baseline is historical (archive + redirect), not authoritative
```

Do **not** keep treating the pre-merge baseline as the authority after merge. Do **not** resurrect retired concepts only to satisfy old assertions.

## Governing sequence

```text
User decision
   ↓
ORUCAVEAM (Observe → Reason → Update contracts → Coordinate → Act → Verify → Evidence → Audit/Move)
   ↓
conflict detected (A: drift vs B: intentional truth change)
   ↓
VALIDATION CHANGE WARNING (before changing any gate)
   ↓
cost / risk / expected output
   ↓
update contract / active indexes
   ↓
update implementation
   ↓
update validation (strict against NEW truth)
   ↓
verify evidence
   ↓
merge
   ↓
NEW CURRENT TRUTH
   ↓
future supersession → ARCHIVE + REDIRECT
```

## Conflict classification

| Case | Meaning | Correct response |
|------|---------|------------------|
| **A** | Implementation drifted from authorized truth | Fix implementation; keep gates |
| **B** | User intentionally changed authorized truth | Warn → update contract → update gates → strict on new truth |

## Mandatory validation-change warning

Before changing tests, Playwright, governance validators, CI gates, active-index rules, skills routing, acceptance criteria, or evidence requirements, emit the standard VALIDATION CHANGE WARNING (see Issue #260). Human approval required for high-impact boundaries (PR #132).

## Change the contract, not merely the gate

Do **not** rewrite a validator to accept new behavior while the authoritative product contract still states the old behavior. Do **not** weaken a failing gate merely to obtain green CI.

## Historical evidence remains immutable

Supersession creates a **new** authoritative state and archive record. Prior checkpoints, endorsements, and evidence are not rewritten.

## Archive + redirect

Retired means **preserved and closed**, not erased.

- Canonical index: `docs/archive/superseded/INDEX.md`
- Per-concept records under `docs/archive/superseded/`
- Active docs use **compact redirects**, not repeated warning spam
- Revival requires a **new** explicit user/source-of-truth decision

## Cooperation with fail-closed CI

This protocol **does not** authorize skipping `governance-drift` or `evidence-consistency`, truncating MASTERPLAN / active indexes to pass `assertFresh`, deleting unrelated safeguards, or falsifying evidence.

`scripts/governance/verify-active-index.mjs` remains the machine check for index coupling and evidence consistency.

## Example: PR #259 (merged baseline)

| Item | Status |
|------|--------|
| `HERO_LOW_ORBIT` | **RETIRED** → `docs/archive/superseded/HERO_LOW_ORBIT.md` |
| `TURN_FOLLOW` | **RETIRED** → `docs/archive/superseded/TURN_FOLLOW.md` |
| Entrance brand on machine layer | **gone** (ENT-T1), not blurred |
| Return to entrance | **present** |
| Replacement camera baseline | `HERO_WIDE`; future selected-seat subject-lock where authorized |
| Domain / backend | **unchanged** by #259 (presentation only) |

Post-merge: validators assert **absence** of retired cameras, not presence.

## Related

- Issue **#260** · PR **#259** / Issue **#258**
- `skills/governance/user-directed-validation/SKILL.md`
- `skills/governance/active-index-coupling/SKILL.md`
