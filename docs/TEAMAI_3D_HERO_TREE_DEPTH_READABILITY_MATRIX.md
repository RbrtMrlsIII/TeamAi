# TeamAi 3D Hero — Tree depth / readability matrix (SP-05)

**Status:** Structural + unit-verified matrix · Gate S6  
**Date:** 2026-09-10  
**Authority:** Spatial execution basis SP-05 → hierarchy runtime · Cam-2 · depth-readable faces  
**Claim:** presentation structure only · **no 029-released claim** · does not claim color/material polish

This matrix separates **structural completion** (node exists, dock resolves, depth helpers apply) from later **visual polish** (materials, art direction).

Evidence labels use: `unit` (deterministic tests) · `browser` (Playwright / live) · `starting` (number not yet measured in browser).

---

## 1. Canonical seat grammar (v1)

```text
Seat Shell
  → Connection (+ health leaf)
  → Behavior
  → Toolkit
  → Capabilities
  → Authorization
  → Workspace Scope
  → Task / Evidence
```

Owner order: `SEAT_SHELL_V1_CHILDREN` in `public/hero-hierarchy-runtime.js`.

---

## 2. Depth levels

| Depth | Meaning | Typical camera |
|-------|---------|----------------|
| 0 | Closed world / machine baseline | `HERO_WIDE` |
| 1 | Seat shell open (parent) | `SEAT_CLOSE` + Cam-6 look-at |
| 2 | Seat child focused | near or detail dock |
| 3 | Leaf / health face | `DETAIL_ANCHOR` + leaf FOV boost |

---

## 3. Seat-child matrix

| node | depth | dock (Cam-2) | treeCenter target | expected readable output | evidence |
|------|-------|--------------|-------------------|--------------------------|----------|
| `SEAT_SHELL` (open parent) | 1 | `SEAT_CLOSE` | openParentId | Whole seat shell identifiable; subject look-at on seat | unit SP-02/SP-05 |
| `SEAT_CONNECTION` | 2 | `SEAT_CLOSE` (near) | `SEAT_CONNECTION` | Connection face identifiable; plate scale boost when focused | unit |
| `SEAT_CONNECTION_HEALTH_FACE` | 3 | `DETAIL_ANCHOR` | health leaf id | Health leaf readable; leaf FOV boost | unit |
| `SEAT_BEHAVIOR` | 2 | `SEAT_CLOSE` (near) | `SEAT_BEHAVIOR` | Behavior face identifiable | unit |
| `SEAT_TOOLKIT` | 2 | `DETAIL_ANCHOR` | `SEAT_TOOLKIT` | Toolkit optional equip face; detail dock | unit |
| `SEAT_CAPABILITIES` | 2 | `DETAIL_ANCHOR` | `SEAT_CAPABILITIES` | Capabilities face; detail dock | unit |
| `SEAT_AUTHORIZATION` | 2 | `DETAIL_ANCHOR` | `SEAT_AUTHORIZATION` | Authorization face; detail dock | unit |
| `SEAT_WORKSPACE_SCOPE` | 2 | `DETAIL_ANCHOR` | `SEAT_WORKSPACE_SCOPE` | Workspace scope face; detail dock | unit |
| `SEAT_TASK_EVIDENCE` | 2 | `DETAIL_ANCHOR` | `SEAT_TASK_EVIDENCE` | Task/evidence face; detail dock | unit |

### Dock rule (Cam-2)

- Detail children (`SEAT_TOOLKIT`, `SEAT_CAPABILITIES`, `SEAT_AUTHORIZATION`, `SEAT_WORKSPACE_SCOPE`, `SEAT_TASK_EVIDENCE`, `SEAT_CONNECTION_HEALTH_FACE`) → `DETAIL_ANCHOR`.
- Other focused children (e.g. Connection, Behavior) → `SEAT_CLOSE` near dock.
- Open parent, no child focus → `SEAT_CLOSE` seat shell.

### Depth-readable rule

| Focus | FOV boost (additive) | Face scale |
|-------|----------------------|------------|
| Closed | 0 | 1 |
| Open parent only | `TREE_FACE_FOV_BOOST * 0.5` | 1 |
| Focused child | `TREE_FACE_FOV_BOOST` | ≥ 1.04 |
| Focused leaf | `TREE_LEAF_FOV_BOOST` | ≥ 1.08 |
| Unfocused sibling plate | — | 1 |

---

## 4. Closed / return rows

| node | depth | dock | target | readable output | evidence |
|------|-------|------|--------|-----------------|----------|
| Closed machine | 0 | `HERO_WIDE` | world | Wide baseline legible | unit V0.1 / SP-02 |
| After Back/close | 0 | `HERO_WIDE` | world | Return baseline (V0.2) | unit |

---

## 5. Explicit non-claims

- Browser interaction depth per child face is **not** claimed completed here (unit structural only).
- Material / color language remains Phase V4 / out of SP-05.
- R1/R2 topology classification is **SP-06**, not this matrix.
- No 029 product release.

---

## 6. Test owner

`tests/hero-sp05-tree-depth-readability.test.mjs`

---

## SEE ALSO

- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` SP-05 / Gate S6  
- `public/hero-cam2-tree-follow.js` · `public/hero-depth-readable-faces.js`  
- `public/hero-hierarchy-runtime.js` (`SEAT_SHELL_V1_CHILDREN`)  
