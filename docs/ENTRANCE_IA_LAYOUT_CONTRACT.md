# Entrance IA / layout contract (V3.1)

**Evidence class:** CONTRACT (docs) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §1 Layer A · §6 Phase V3 · Issue #214  
**Authority:** Product Law → MASTERPLAN → VISION → **this contract** → additive layout slices

## Objective

Define the **information architecture and layout regions** for Layer A (website entrance) so later slices (brand image, atmosphere, get-started handoff) extend **existing** shell owners without a second Hero runtime, second theme root, or second settings island.

## Two layers (must remain distinct)

| Layer | Human state | Primary surface |
|-------|-------------|-----------------|
| **A — Entrance** | Public product face; not “inside the machine” | Page chrome + optional gentle Hero backdrop |
| **B — Machine** | After get-started; spatial instrument | 3D Hero + hierarchy / seat chrome |

V3.1 only contracts **Layer A**. Layer B remains under existing camera / hierarchy / machine-nav owners.

## Layout regions (owners)

| Region id | DOM owner (today) | Purpose | Allowed changes |
|-----------|-------------------|---------|-----------------|
| `entrance-brand` | `.hero-copy` (eyebrow, h1, lede) | Product name + short summary | Copy, optional logo slot |
| `entrance-atmosphere` | `#hero-canvas` + `.hero-aura-*` | Gentle rotating Hero / auras as **backdrop** | Intensity, reduced-motion — **no second WebGL app** |
| `entrance-primary-actions` | `.hero-controls` primary buttons (Open engine / demo) + auth handoff | Ordinary web actions: learn / sign in / get started | Labels, order; not seat config |
| `entrance-far` | `aside.far-environment` | Legal / about / contact outside machine shell | Link set only |
| `machine-chrome` | `.seat-stack`, `.machine-nav`, settings shell | **Layer B** chrome — soft-absorbed when machine UI open | Not entrance primary |

### Forbidden (clash tests)

- Second `<canvas>` / second Three.js app for entrance
- Second `theme-root` or page-local theme attribute root
- Second settings island dedicated to entrance
- Treating far-environment as inside-machine chrome
- Putting API-key / seat-binding UI on Layer A

## Get-started handoff (contract only — implement in V3.4)

1. User is on Layer A (entrance regions visible; machine chrome may be present but not primary).
2. Primary action requests machine baseline (`HERO_WIDE` / world home) under existing Cam / hierarchy paths.
3. Product sets a single presentation flag (e.g. `data-hero-layer="machine"`) on the shell — **not** a second runtime.
4. Return path restores Layer A presentation without destroying Hero instance.

## Additive markers (V3.1 minimal)

Optional `data-entrance-region` attributes on existing nodes for tests and later CSS:

- `.hero-copy` → `data-entrance-region="brand"`
- `#hero-canvas` → `data-entrance-region="atmosphere"`
- `aside.far-environment` → `data-entrance-region="far"`

No new layout islands required in V3.1.

## Slice ladder (must stay ordered)

| ID | Intent | Class |
|----|--------|--------|
| **V3.1** | This contract + minimal region markers | Docs + tiny additive |
| V3.2 | Brand hero image region | Additive asset |
| V3.3 | Gentle Hero atmosphere | Adjust wiring |
| V3.4 | Get-started → machine baseline | Adjust handoff |
| V3.5 | Far-environment clarity | Keep / clarify |

## Verification

- Contract file exists and names owners above
- Index (or shell) carries the three region markers without removing `data-inspection-reset` or machine scripts
- Still one theme root, one hierarchy runtime, one apply-cam2 path

```bash
node --test tests/hero-v3.1-entrance-ia-contract.test.mjs
```
