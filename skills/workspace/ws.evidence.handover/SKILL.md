# WORKSPACE_SKILL — ws.evidence.handover

**Kind:** `WORKSPACE_SKILLS` · `ws.evidence.handover`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when closing a slice or PR that must leave continuity for the next session: evidence paths, limitations, current frontier, and what remains open, including owner review or visual endorsement when applicable.

## INPUT

- What was actually changed and verified
- Required CI results
- Known environment limits
- Current `Masterplan/NEXT_SLICES.md` frontier
- Current `AI_ASSISTANT_READ_ME.md` session state

## AUTHORITY

`AI_ASSISTANT_READ_ME.md` records live continuation/recovery state. Acceptance is recorded only against the exact owning Issue/PR/evidence scope. Neither session state nor evidence records grant merge rights, release authority, or Product Law authority.

## ACTION

1. Prefer: evidence record + PR body boundaries + tests that match claims.
2. Separate layers: unit green ≠ Playwright green ≠ Product Law pass ≠ owner review/visual endorsement.
3. State limitations honestly, including hosting surface, mobile chrome, and incomplete non-Hero UI.
4. Update `Masterplan/NEXT_SLICES.md` when the active frontier changes.
5. Update `AI_ASSISTANT_READ_ME.md` with the current handoff/recovery state.
6. Record acceptance only in the exact owning Issue/PR/evidence record when authorized; there is no active `Endorsement.md` document.
7. Preserve historical continuity records under `docs/archive/` or `handover/` rather than maintaining a second live handover manual.

## DO NOT

- Do not invent live Firebase/PayPal proof from static tests.
- Do not close owner-review issues without the owner.
- Do not claim the whole product is polished because the Hero hierarchy opens.
- Do not revive `HandOver.md` or `Endorsement.md` as active paths.
- Do not create another current-frontier or session-memory document.

## PASS

`Masterplan/NEXT_SLICES.md` has one frontier, `AI_ASSISTANT_READ_ME.md` has current continuation state, evidence identifies the exact scope and limitations, and historical material is preserved without becoming active instruction.

## SEE ALSO

- `skills/governance/learning-handover/SKILL.md`
- `AI_ASSISTANT_READ_ME.md`
- `Masterplan/NEXT_SLICES.md`
- `skills/seat/seat.field.verification/SKILL.md`
- `docs/archive/`
- `handover/`
