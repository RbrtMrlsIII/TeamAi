# Product Law Amendment — Command Deck Retirement

**Status:** NORMATIVE PRODUCT-LAW AMENDMENT / OWNER-DECIDED (2026-09-12)
**Parent authority:** `PRODUCT_LAW.md` → Law Family J (Spatial Experience, Guides, Dictionary, and Human-Facing Control)
**Trigger:** #278 evidence review identified that the issue body's prior wording ("The Command Deck remains a real workspace/transition surface, not something to delete") directly contradicted the owner's decided direction, and that this is a product-surface-hierarchy change, not a wording tweak.

## Decision

The canonical product-surface hierarchy is:

```text
PUBLIC ENTRANCE
    ↓
3D WORLD
    ↓
authenticated machine
    ↓
WORKSPACE CENTER
```

This replaces the prior shape:

```text
PUBLIC ENTRANCE
    ↓
3D WORLD
    ↓
Command Deck
    ↓
WORKSPACE
```

The **Command Deck is retired** as a product concept, product authority, and product destination effective 2026-09-12.

## What retirement means (and does not mean)

Retirement means:
- No new implementation may target the Command Deck as a live/active surface.
- `/spatial/` is downgraded from "real workspace/transition surface" to a **historical compatibility route** — kept only so existing external links do not dead-end, pending an explicit removal/redirect slice.
- Any Command Deck functionality that is still genuinely useful (e.g. fixture-backed workforce visualization concepts) must be **re-owned by the spatial/3D-world machine** itself, not preserved as a separate screen.
- Historical Command Deck references, evidence, and screenshots remain preserved as historical record; they are not rewritten or deleted.

Retirement does **not** mean:
- Immediate deletion of all Command Deck UI/components in one slice — that is a separate, smaller, explicitly-scoped implementation task.
- A claim that the authenticated Workspace Center is implemented today. It is not. This amendment changes *authority and target architecture*, not *current implementation status*.

## Why this is Product Law level, not just Issue wording

Product-surface hierarchy determines what "the product" is and where authority for each surface lives. Law Family J already establishes that the spatial UI is a human-facing map, not a second authority layer, and that presentation must not self-attest durable backend truth. Changing which surface is the authoritative post-authentication destination is a product-shape decision, so it is recorded here rather than only in a single tracking issue, which can be superseded, reworded, or have its history compacted.

## Downstream reconciliation required

- `#278` (029 canonical product-experience ledger) — updated 2026-09-12 to reflect this decision in its route table and Section 1 flow diagram.
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md` and related 029 docs — must stop describing `/spatial/` as an active target surface in any future edit.
- Any future `/spatial/` removal/redirect implementation slice must cite this amendment as its authority, not re-litigate the decision.

## Non-claims

This amendment does not claim:
- That the authenticated Workspace Center exists yet.
- That `/spatial/` has been removed or redirected yet (that is future implementation work).
- Completion of any 029 acceptance gate (C9/C10).
