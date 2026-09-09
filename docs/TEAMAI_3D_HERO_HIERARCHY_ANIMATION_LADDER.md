# TEAM-EXPERIENCE-029 — Hierarchy animation ladder (depth-first)

**Status:** PLAN OF RECORD / presentation  
**Authority:** Product Law Family J · Hierarchy Runtime Baseline · Seat Shell v1 · motion/transition/responsive skills  
**No 029-released claim.**

## 1. Intent

The Hero should feel like a **growing machine**, not only a list of labels:

1. Open **one** parent hierarchy at a time.
2. Validate **motion, transition, camera/FOV, theme, a11y** for that node before the next.
3. Each **child** may branch with its own short mechanical animation and denser UI.
4. When content is **full-area** (login, signup, large config), the **camera zooms/docks until the whole contents can be seen** (within §9 clamps), then normal-UI handoff if the form cannot live in WebGL.

## 2. Camera-fill (full-area content)

| Step | Behavior |
|------|----------|
| Select content | INSPECT; free orbit paused |
| Dock | Semantic camera for that node (e.g. `DETAIL_ANCHOR` for auth-class faces, `SEAT_CLOSE` for seat faces) |
| Frame | Increase zoom / adjust framing until content bounds are readable or max dock reached |
| Narrow viewports | Apply `FOV_BOOST_NARROW` as needed |
| Reduced motion | Snap dock; no continuous travel choreography |
| Overflow | `APP_UI_HANDOFF` / normal UI for real forms (auth remains Firebase-owned) |

Login/signup **presentation** in the machine does not replace Firebase Auth or invent entitlement.

## 3. Slice order

See `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` — start **P1 `SEAT_CONNECTION`**.

## 4. Per-slice checklist

- [ ] Open/close or branch uses named §9 durations (or snap if reduced)
- [ ] Semantic camera dock documented
- [ ] Full-area content: camera-fill rule applied or explicit handoff
- [ ] Theme still documentElement-only
- [ ] Keyboard / non-color status preserved
- [ ] Tests or browser note for the node
- [ ] No 029-released / no entitlement implication

## 5. Boundaries

Presentation only · one open parent · skills optional · merge gate #133
