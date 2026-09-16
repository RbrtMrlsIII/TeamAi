# TeamAi — GitHub Issues as development memory

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW
**Date:** 2026-09-15

GitHub Issues are durable, scoped development definitions. They sit **under Product Law** and beside implementation/verification; they do not grant permission, amend authority by themselves, or replace Product Law, architecture, policy, Skills, or PR review.

See also: `Masterplan/MASTERPLAN.md`, `Masterplan/NEXT_SLICES.md`, `docs/SKILL_WIRING.md`, and `AI_ASSISTANT_READ_ME.md`.

## Authority and development order

```text
Product_Law/PRODUCT_LAW.md
    ↓
Masterplan/MASTERPLAN.md
    ↓
POLICY.md / ORUCAVEAM + applicable Skill(s)
    ↓
GitHub Issue
    ↓
Implementation
    ↓
Tests / CI / evidence
```

Use this distinction consistently:

- **Product Law** = what must remain true across the product.
- **Masterplan** = the complete executable checklist and current development order.
- **Policy / Skills** = how work is governed and procedurally executed.
- **Issue** = what one bounded piece of that product truth means for a development slice, including acceptance criteria and verification.
- **PR** = the proposed code/documentation change.
- **Tests / CI / evidence** = proof that the implementation satisfies the Issue without violating higher authority.

An Issue may make Product Law more concrete for one feature. It must **not silently create a new Product Law**.

When implementation reveals a genuinely new product invariant, stop and reconcile the higher-level authority first; update Product Law only through the repository's governed process, then continue the Issue.

## Issue body vs comments

| Surface | Role |
|---------|------|
| **Issue body** | Stable definition: objective, acceptance criteria, out of scope, verification. Edit the body when the **definition** of done changes. |
| **Comments** | Chronological evidence trail: gate open/closed, CI links, merge SHAs, limitations, next checkpoint. **Do not** treat comments as a second Product Law. |

Prefer one clear evidence comment when a PR lands or a gate clears, and one next-checkpoint comment when work pauses. Avoid chat-like noise and duplicate status posts.

Closing an Issue means its bounded acceptance criteria are met (or explicitly abandoned). It does not auto-endorse a whole Masterplan milestone.

## When to open an Issue

Open an Issue when future sessions benefit from a durable, scoped definition that should survive the current chat or PR, especially when work has non-trivial acceptance criteria, a decision boundary, a blocked dependency, or a verification gate.

Do **not** open an Issue for every small PR or for chat-only questions whose answer is already captured in canonical docs.

## Required Issue structure

A useful Issue should answer:

1. **Objective** — what bounded outcome is being pursued?
2. **Product Law / authority** — which existing rule(s) constrain it?
3. **User-visible behavior** — what should the product do or show?
4. **System / spatial behavior** — what mechanism or interaction changes, where relevant?
5. **Backend / authority boundary** — what remains authoritative elsewhere?
6. **Acceptance criteria** — what observable conditions mean this Issue is complete?
7. **Verification** — which tests, CI runs, screenshots, or evidence prove completion?
8. **Dependencies / blockers** — what must be true first?
9. **Out of scope** — what this Issue must not expand into.
10. **Next implementation checkpoint** — the smallest useful next action for a future session.

## Issue types

Prefer a small vocabulary:

- `feature` — bounded product capability or experience slice
- `adr` — architectural or product-shaping decision that should remain durable
- `bug` — observed incorrect behavior
- `verification` — evidence or validation gate that deserves durable tracking
- `boundary` — authority, CI, delivery, or integration boundary that must outlive a PR
- `chore` — bounded maintenance work

Use area labels such as `area:hero`, `area:web-ai`, `area:seat`, `area:orchestration`, `area:backend`, or `area:governance` when useful.

## Future-session startup protocol

A future development session should begin with:

```text
Read Product_Law/PRODUCT_LAW.md
→ identify the active Masterplan item / Issue
→ read Masterplan/NEXT_SLICES.md for the current slice
→ read the Issue's acceptance criteria and authority boundary
→ inspect the current implementation
→ make the smallest compliant change
→ run the Issue's verification
→ update the PR / Issue evidence
→ continue from the next implementation checkpoint
```

The Issue is therefore **development memory and a scoped executable definition**, not a second constitution.

## Linking

Link a PR to an Issue only when the PR actually advances or resolves that durable work. Prefer `Fixes #N` when the PR truly closes the Issue; do not manufacture Issues merely to create links.

## Authority reminder

```text
Product_Law → Masterplan → Policy / Skills → Issue → implementation → verification → evidence
```

The Issue can make higher-level rules specific. It cannot outrank them.
