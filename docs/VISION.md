# TeamAi Product Vision — Entrance, Mechanical 3D Hero, Semantic Machine, and Experience

**Status:** Product intent (living) · **single vision home**  
**Authority order:** `Product_Law/PRODUCT_LAW.md` → `Masterplan/MASTERPLAN.md` → **this document** → camera / hierarchy / DOM / theme / tree contracts → implementation slices  
**Claim:** presentation and experience intent only · **not** a Product Law rewrite · **no 029-released claim**

This is the **single product-experience vision** for the public entrance, the mechanical 3D Hero, the semantic tree/branch/division machine, camera subject and travel, machine chrome, unlock/accessibility language, and presentation behavior. New ideas are amended here rather than published as a second vision.

Related technical contracts (owners of detail, not competing visions):

- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_CAM6_MANDATORY_SELECTED_TREE_LOOKAT.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md`
- `Masterplan/NEXT_SLICES.md` (sole current execution frontier)
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`
- `docs/ENTRANCE_IA_LAYOUT_CONTRACT.md`
- `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md`

---

## 0. Governance execution (ORUCAVEAM-aligned)

TeamAi uses **one** execution discipline: ORUCAVEAM. There is no second lifecycle hidden inside the visual work. Every vision-driven change follows the same authority and evidence chain.

| Letter | Applied meaning for this vision |
|--------|----------------------------------|
| **O** Objective | State the human-facing outcome and the exact experience capability being changed. |
| **R** Restrictions | Presentation must not invent entitlement, scheduler choice, durable auth, Firestore truth, payment truth, or 029 release status. |
| **U** User Authority | Owner/user endorsement governs visual quality when the environment is fair; vision changes must not silently rewrite Product Law. |
| **C** Canonical Authority | Identify the existing product/contract/root that owns the behavior before coding. |
| **A** Action | Make the smallest justified adjustment; forbid parallel authorities, duplicate runtimes, and duplicate state stores. |
| **V** Verification | Use the proof appropriate to the change: structural/unit checks, browser smoke, Playwright, accessibility/responsive checks, and runtime evidence where applicable. Green CI is evidence, not endorsement. |
| **E** Efficiency | Prefer reconciliation, mapping, tuning, hiding, or extending the canonical owner over rewriting from zero. |
| **A** Audit | Reconcile the applicable Issue, PR, census, checkpoint, live session state, and product-knowledge record. |
| **M** Minimal tools | Preserve one Hero runtime, one hierarchy runtime, one primary camera apply path, one theme root, one semantic census. |

### 0.1 Starting from zero is forbidden

**Default:** locate the module or contract that already owns the behavior, then adjust it.

New code is allowed only when all of the following are established in the governed change:

1. No existing owner can honestly carry the behavior without violating Product Law, this vision, or an existing canonical contract.
2. The ownership gap is named.
3. The new module has one responsibility, is wired through existing entry points, and cannot become a second bootstrap or second authority.

“We could write it cleaner from scratch” is not permission to start from zero.

### 0.2 Change isolation

A slice may touch only its declared owner set. Changes must not silently cascade into other product domains.

| If you change… | You must not also… |
|----------------|--------------------|
| World / baseline camera | revive 1–15 camera authority or create a second camera table |
| Cam-3/4 orbit/zoom | fork `setCamera` or create a second navZoom store |
| Cam-5/6 selected-subject behavior | bypass semantic subject identity with coordinate-only camera logic |
| Tree/branch identity | use mesh index, ring position, or camera dock as identity |
| Expansion geometry | hard-code a universal branch size or global scale multiplier |
| Unlock flow | fabricate durable entitlement inside the renderer |
| Back / Next | create a second branch walker or duplicate Seat list |
| Settings / Smoke | create another settings island or navigate to another page to prove a feature |
| Theme / scale | create a second theme root or page-local theme authority |
| Entrance | stand up a second Hero/WebGL runtime |
| Connection effects | imply provider authorization from a decorative wire |

### 0.3 PR declaration

Every executable PR that changes vision-owned experience should state:

`Objective · Canonical owner(s) · Allowed files · Forbidden files · Create new? yes/no + reason · Authority clash test · Verification plan`

### 0.4 Evidence labels

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade by implication. Source presence, deployment presence, green tests, or a visual screenshot alone does not establish a stronger evidence state.

---

## 1. Current context and present product truth

This vision is being rewritten because the current project has crossed from isolated camera experimentation into a **mechanical spatial-machine construction problem**. The immediate camera bug revealed a structural issue: the product had **two camera authorities**. The legacy **1–15 inspection camera spine** and the newer **Cam-5/Cam-6 hierarchy-aware camera path** could both influence the same experience. The 1–15 spine is therefore retired. **Cam-5/Cam-6 plus the existing hierarchy runtime is the sole current spatial camera authority.**

The current repository is an intermediate implementation, not a complete 029 release. It already contains:

- the conventional public entrance and explicit entry toward the 3D world;
- a single mechanical Hero renderer capable of a flexible population across 1–10 Seat slots;
- a partially proven Seat hierarchy and Seat configuration vocabulary;
- semantic camera relationships, including selected-seat subject behavior;
- Settings / machine chrome and an emerging in-page Smoke diagnostic surface;
- planning and contract material for concentric spatial rings;
- backend contracts and durable state boundaries outside the renderer.

The current repository does **not** yet contain a complete multi-tree machine. The tree census records `TREE-DOMAIN`, `TREE-HERO-SEAT`, and `TREE-SKILL-RESPONSIBILITY` with incomplete/partial states where appropriate. Full tree/branch/division topology, final adaptive geometry, complete expansion choreography, final turn-loop electrical paths, and the full authenticated workspace experience remain future governed work.

The current execution reality must also remain visible:

- the public entrance, world entry, camera reconciliation, and presentation work are still presentation work, not proof of 029 release;
- the backend has separately bounded completion and explicit residual evidence boundaries;
- a green CI result is a validation event, not a release endorsement;
- historical checkpoints remain historical evidence even when newer current-state records supersede their active wording;
- Issues own durable problem/execution context while comments record evidence rather than creating a competing roadmap;
- PRs are implementation/review boundaries, not replacement Product Law;
- the structured tree census is an observation/semantic baseline and must stay synchronized as the machine evolves.

### 1.1 Current camera authority

The current spatial camera model is:

```text
LEGACY 1–15 inspection spine
        ↓
      RETIRED
        ↓
CURRENT AUTHORITATIVE PATH
Cam-5 / Cam-6 + hierarchy runtime
```

Cam-5/Cam-6 owns the selected-seat / selected-tree subject relationship. Physical docks are implementation mechanisms; the semantic tree/branch identity remains the subject authority. No new code may reintroduce the 1–15 spine as navigation, fallback, registry, traversal authority, or compatibility authority unless a separately governed migration boundary explicitly requires a historical adapter.

### 1.2 Current machine truth

The Hero is intended to be **mechanical**, not a flat 3D logo with conventional product settings permanently sitting beside it. It is a nested machine whose gears, rings, tree divisions, and workspace center reveal product meaning.

The current architecture is still partially transitional. Legacy side stacks and floating DOM controls may exist as absorption debt. They must not be mistaken for the final spatial architecture and must not be allowed to become a second product hierarchy.


### 1.3 User-endorsed visual reference: Hailuo mechanical machine

The repository now preserves a user-endorsed visual reference for the mechanical 3D Hero at `assets/3D_Vision/hailuo.mp4`. The durable interpretation of that reference is recorded in `docs/TEAMAI_3D_HERO_VISION_REFERENCE_HAILUO.md`.

The reference strengthens the intended spatial-machine direction already defined by this vision:

- a central working core with surrounding structures related to it;
- independent articulated modules rather than flat cards;
- visible connection paths that reinforce real semantic topology;
- transformation as part of interaction, including open/extend/rotate/retract-style state changes;
- camera travel as part of the transformation language;
- layered mechanical depth whose density can respond to semantic/UI payload.

This is a **visual-direction endorsement**, not an implementation specification. It does not define semantic identities, geometry constants, backend state, authorization, scheduler behavior, entitlement, or release completion. The canonical contracts and evidence chain remain authoritative for those concerns.


## 2. Product experience: two complementary layers

TeamAi presents two complementary layers. They must stay conceptually distinct so the user knows whether they are on the public website or inside the spatial machine.

### Layer A — Website entrance (public face)

The first impression is a **normal web product entrance**, not yet “inside the machine.”

The human should perceive:

- a calm, branded web page with TeamAi name, logo, short summary, social links, and a clear hero image communicating networked AI / team collaboration;
- a gently rotating 3D Hero may appear as background atmosphere, inviting but not demanding interaction;
- ordinary web actions such as Learn More, Sign In, and Get Started;
- no implication on this layer that API keys, Seats, GitHub, entitlement, scheduler state, or provider authorization have been configured.

This layer is not:

- Seat configuration;
- entitlement or commerce truth;
- durable auth authority;
- a second product authority outside Product Law.

Implementation stance: primarily additive layout on the existing shell (`public/index.html` / spatial shell), with one theme root and one Hero runtime. A passive background is allowed, but a second WebGL application is not.

### Layer B — 3D Hero machine

Once the user gets started, the Hero becomes the primary spatial instrument: a mechanical machine in which semantic trees and divisions carry product structure.

Its core spatial grammar is:

```text
machine wide
    ↓
open parent / tree
    ↓
open child division
    ↓
open leaf / control
    ↓
return to parent
    ↓
return to machine world
```

The machine is not a decorative shell around an ordinary side-panel application. Configuration, status, state, connection explanation, Seat surfaces, and later workspace interaction should progressively become machine-native where their product law permits it.
