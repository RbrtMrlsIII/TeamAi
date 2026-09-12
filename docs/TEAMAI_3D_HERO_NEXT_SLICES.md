<!-- teamai-claim: SPATIAL-V3.5 state=COMPLETE -->
<!-- teamai-claim: CONN3 state=IMPLEMENTED_BROWSER_PROOF_PENDING -->
# TeamAi 3D Hero Next Slices

Status: living continuity for **TEAM-EXPERIENCE-029 presentation** work.  
Gated by `MASTERPLAN.md` · **no 029-released claim**.

**P1**–**P7.1** **merged** (#174–#187). **P-R2** **merged** (#188). **P-R0** **merged** (#189). **F** **merged** (#190). **Cam-1**–**Cam-4** **merged** (#191–#194). Depth-readable faces + DOM absorption **merged** (#196–#199).

**Vision #214 V0–V2** **merged** (#217–#229). **Vision V3.1–V3.5** **merged** (#230, #235, #247, #249, #252). **SP-02–SP-07** **closed**. **#258 residual / PR #259 MERGED**. **CAM-R1–R3** **merged** (#262–#264). **ENT-R4** **merged** (#265). **CHR-R3** **merged** (#266). **#267/#268** residual closeout + hierarchy continuity repair **merged**. **#270** experience rebase checklist **merged**. **#272** experience rebaseline **merged**. **No 029-released claim**.

**Current product-shape baseline:** owner-endorsed C0–C10 rebaseline. Development now proceeds as **classic website entrance → explicit 3D-world entry → coherent navigation/Settings → rationalized camera language → authenticated/authorized workspace → desktop + phone acceptance → ProMax refinement**.

**Governance #260** + archive/superseded. **Security inquiry:** `docs/security_inquiry.md` remains future/pre-production backlog, not the current experience driver.

**Conn-1** **merged** (#200). **Conn-2** **merged** (#202). **Conn-3** browser proof pending.

## Completed historical ladder

The earlier P/R/F/Cam/V/SP work remains valuable implementation lineage and recovery evidence. It is not automatically the current product acceptance baseline. See `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` for the current product shape and `docs/CHRONOLOGY.md` for ordered history.

| Slice | Historical continuity anchor |
|---|---|
| A | R1/R2 hit targets + focus + wheel/touch nav; **Merged (#150)** |
| B | `RING_R1_SCALE` / `RING_R2_SCALE`; **Merged (#151)** |
| C | Camera orbit polish — **NAVIGATE**-only; **Merged (#152)** |
| D/E | SEAT_TOOLKIT + WORKSPACE_ZIPSKILLS; **Merged (#153/#155)** |
| G | #89 **reduced-motion lighting**; **Merged (#156)** |
| H | Legacy `MECHANISM_ZIPSKILLS` reconciliation to `WORKSPACE_ZIPSKILLS`; **Merged (#157)** |
| I.1–I.3 | #95 cross-root skill wiring; **Merged (#158–#160)** |
| J | #88 material depth evidence; **Merged (#161)** |
| K | **Merged** (#167) — #96–#98 lighting close-out |
| L | **Merged** (#168) — satisfied-by map for #96–#98 |

**Continuity note:** the prior seat/workspace skill setups were **not required** platform capabilities; this remains historical knowledge and must not become entitlement or implementation authority.

## Hierarchy animation continuity

Depth-first ladder (historical plan of record): camera-fill → **P1** hierarchy motion → **SEAT_CONNECTION** and remaining parents → login/signup presentation handoff. **NAVIGATE** remains the free-orbit interaction mode. See `docs/TEAMAI_3D_HERO_HIERARCHY_ANIMATION_LADDER.md`.

## Current C0–C10 experience sequence

| Gate | Topic | State | Acceptance basis |
|---|---|---|---|
| C0 | Product-shape endorsement | **ENDORSED** | owner/source-of-truth decision |
| C1 | Canonical reconciliation | **MERGED / ACTIVE** | active maps and contracts agree |
| C2 | Classic website entrance | **MERGED / FOUNDATION** | canonical public root now targets `public/`; final acceptance still C9 |
| C3 | Explicit 3D-world entry + return | **MERGED / FOUNDATION** | browser transition proof, beginning from canonical root |
| C4 | Coherent nav/menu + Settings | **MERGED / FOUNDATION** | discoverable controls without scattered chrome |
| C5 | Camera vocabulary reduction | **MERGED / FOUNDATION** | reduced world controls; final visual acceptance under C9 |
| C6 | World-baseline zoom-out | **FOUNDATION / NEEDS PRODUCT PROOF** | tree/subject can reach normal world baseline |
| C7 | Proportional orbit | **MERGED / FOUNDATION** | natural input direction + regression proof |
| C8 | Authenticated full workspace | **PLANNED / BOUNDED** | server-verified identity + server authorization |
| C9 | Product acceptance | **BLOCKING** | fresh desktop + phone evidence from canonical public root + owner acceptance |
| C10 | ProMax refinement | **GATED** | only after C9 |

## Deployment / surface reconciliation — #278

The current product surface is now explicitly separated from the historical deployment topology.

```text
PUBLIC ROOT
  public/               → classic website entrance
       ↓
  explicit Enter 3D world
       ↓
  3D Hero

COMPATIBILITY
  /hero/                → same public/ source, preserved temporarily

WORKSPACE / TRANSITION
  /spatial/             → frontend/spatial Command Deck
```

The Command Deck is retained as a workspace/transition surface and is not the public front door. See `docs/TEAMAI_029_DEPLOYMENT_SURFACE_MAP.md` and Issue #278.

## Runtime delivery hardening

**#275 is MERGED.** Hero flex runtime delivery now uses repository-owned source as the ordinary runtime/build input. `public/_flex_src/hero-flex.base.js` is the preserved base source; `public/hero-flex.js` is the committed runtime entry.

The internal legacy patch engine is historical implementation machinery. It must not be reintroduced as browser runtime authority or used to define current product truth.

## Product rules that stay true

- Presentation does not grant entitlement or durable authorization.
- No 029-released claim until release gates + endorsement are actually evidenced.
- Repository-owned source/build artifacts are preferred over cross-origin runtime source mutation.
- Acceptance begins at the canonical public root, not a hidden compatibility route.

## Next authorized work

1. Complete #278 deployment validation: root/hero/spatial smoke checks and deployed browser proof.
2. C4/C5 visual cleanup only after the correct public surface is being exercised.
3. C6 browser verification of tree/subject zoom back to the normal world baseline.
4. C7 deployed-browser confirmation of proportional orbit and removal of stale inverse naming where safe.
5. C8 server authorization boundary only when the appropriate backend/security phase is explicitly promoted.
6. C9 owner desktop + phone acceptance.
7. C10 ProMax only after C9.

No security-inquiry item is promoted merely because it exists in `docs/security_inquiry.md`.

No 029-released claim.

## C5/D + C6/E implementation — #281

Item 3 above (C6 browser verification of tree/subject zoom back to the normal world baseline) now has implementation in place: `applyNavCamera()` falls back to `HERO_WIDE` once `navZoom` reaches `NAV_ZOOM_MAX`. The duplicate camera wall from item 2's scope is also removed (C5/D). Both are pending CI green and an actual browser pass before counting toward C9 acceptance.

C6 e2e must open a seat tree (`selectSeatShell` + `resetNav`) before reading `getBaseCameraId()`. `setCamera('SEAT_CLOSE')` does not set `openParentId`; the fallback is **not** unconditional — it is gated on `navZoom >= NAV_ZOOM_MAX` while a tree is open. Positive wheel `deltaY` is zoom-out. No 029-released claim.

## #282 (C2 / Phase C first-paint slice)

PR **#282** is the owner-authorized first-paint reconciliation slice under #278 Phase C. It hides the legacy `.hero-copy` brand in classic mode and hides the sibling `.far-environment` footer so the canonical classic entrance does not present duplicate logo/headline/footer chrome. The DOM/runtime surfaces remain available for world-mode behavior; this is presentation-only and is not a C5-style DOM removal.

Validation is scoped to the classic public entrance: unit coverage asserts the CSS hide contract and Playwright coverage checks desktop/phone classic first paint for the hidden legacy surfaces, one visible classic brand image, and absence of the duplicate h1. The slice does not claim `/hero/` auto-world resolution, remaining world-chrome removal, `TEAM_ORBIT` changes, continuous zoom/tree-to-tree travel, C8, C9, or C10.

#282 remains a Phase C implementation slice of #278. Its governance/index synchronization is required before the PR can pass the fail-closed `governance-drift` gate. No 029-released claim.
