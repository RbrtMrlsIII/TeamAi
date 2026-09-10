# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living number home for hierarchy presentation constants.  
**Authority:** Product Law · Machine Interaction · Camera Follow · Vision V0.5  
**Claim:** presentation only · **no 029-released claim**

Numbers in this §9 table are the product home for hierarchy layout and nav clamps. Amend **table + code together**.

## §9 — Named constants (current)

| Name | Value | Note | Ring |
|------|-------|------|------|
| `SEAT_REST_Y` | `0.62` | measured | R2 |
| `NAV_ZOOM_MIN` | `0.72` | starting | R4 nav |
| `NAV_ZOOM_MAX` | `2.0` | V0.5 Vision ~200% | R4 nav |
| `NAV_ZOOM_REDUCED_MIN` | `0.9` | starting | R4/R5 |
| `NAV_ZOOM_REDUCED_MAX` | `1.2` | starting | R4/R5 |

> Full historical §9 rows remain in prior commits / package copies; this surface lists the nav zoom bounds updated for V0.5. Other hierarchy constants live in `public/hero-hierarchy-runtime.js`.

## V0.5

`NAV_ZOOM_MAX` raised from `1.55` to `2.0` so free zoom can approach ~200% of default while subject lock (Cam-6) still holds look-at.
