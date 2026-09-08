# SEAT_SKILL — seat.field.verification

**Kind:** `SEAT_SKILLS` · `seat.field.verification`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when a Seat’s responsibility is **verification**: tests, CI interpretation, evidence packages, recovery checks.

## INPUT

- PR / commit under test
- Required check suite results
- Product Law / Masterplan gates relevant to the change

## AUTHORITY

Verification proves **what was exercised**. It does not alone grant merge, release, or Product Law endorsement.

## ACTION

1. Prefer real commands and CI conclusions over screenshots-as-proof.
2. Separate: unit green ≠ Playwright green ≠ Product Law pass ≠ 029-released.
3. Record limitations (environment, skipped live provider tests).
4. On failure: minimal fix or explicit block — no silent scope expansion.
5. HandOver may attach evidence; endorsement remains a distinct step.

## DO NOT

- Do not merge solely because checks are green when law gates fail.
- Do not claim live PayPal/Firestore proof from unit tests alone.
- Do not invent database writes to “prove” persistence.

## PASS

Evidence matches the claims; failures are explicit; endorsement not forged from CI alone.

## SEE ALSO

- `PRODUCT_LAW.md` Family D (Verification field)
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`
