# WORKSPACE_SKILL — ws.evidence.handover

**Kind:** `WORKSPACE_SKILLS` · `ws.evidence.handover`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when closing a slice or PR that must leave **continuity** for the next session: evidence paths, limitations, and what is still open (including owner visual endorsement).

## INPUT

- What was actually changed and verified
- Required CI results
- Known environment limits (e.g. Hero hard to review on mobile Custom Tab; outer UI unfinished)

## AUTHORITY

Evidence and HandOver **record** work. They do not grant merge rights, release 029, or replace Product Law endorsement.

## ACTION

1. Prefer: checkpoint or evidence doc + PR body boundaries + tests that match claims.
2. Separate layers: unit green ≠ Playwright green ≠ Product Law pass ≠ owner visual endorsement.
3. State limitations honestly (hosting surface, mobile chrome, incomplete non-Hero UI).
4. Point NEXT_SLICES / HandOver at the **next single** slice.
5. Leave #88/#89-style visual acceptance to the **product owner** when the environment is fair to judge.

## DO NOT

- Do not invent live Firebase/PayPal proof from static tests.
- Do not close owner-endorsement issues without the owner.
- Do not claim the whole product is polished because the Hero hierarchy opens.

## PASS

Next session can continue from docs without reconstructing intent from chat alone.

## SEE ALSO

- `skills/governance/learning-handover/SKILL.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `skills/seat/seat.field.verification/SKILL.md`
