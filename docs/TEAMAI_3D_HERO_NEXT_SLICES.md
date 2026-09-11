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
| C2 | Classic website entrance | **MERGED / FOUNDATION** | first paint + route boundary; final C9 still governs acceptance |
| C3 | Explicit 3D-world entry + return | **MERGED / FOUNDATION** | browser transition proof |
| C4 | Coherent nav/menu + Settings | **MERGED / FOUNDATION** | discoverable controls without scattered chrome |
| C5 | Camera vocabulary reduction | **MERGED / FOUNDATION** | reduced world controls; further visual acceptance under C9 |
| C6 | World-baseline zoom-out | **FOUNDATION / NEEDS PRODUCT PROOF** | tree/subject can reach normal world baseline |
| C7 | Proportional orbit | **MERGED / FOUNDATION** | natural input direction + regression proof |
| C8 | Authenticated full workspace | **PLANNED / BOUNDED** | server-verified identity + server authorization |
| C9 | Product acceptance | **BLOCKING** | fresh desktop + phone evidence + owner acceptance |
| C10 | ProMax refinement | **GATED** | only after C9 |

## Runtime delivery hardening

**#275:** Hero flex runtime delivery is being hardened so normal browser/build execution uses a repository-owned base source rather than a cross-origin GitHub Raw dependency. `public/_flex_src/hero-flex.base.js` is the preserved base source; `public/hero-flex.js` is the runtime entry. The standard `scripts/apply-cam2-tree-follow-flex.mjs` path now seeds from the local base before invoking the existing patch engine.

The internal legacy patch engine retains an emergency remote fallback as historical implementation machinery. It is **not a valid runtime/build authority** and is the subject of explicit follow-up cleanup. Do not reintroduce remote runtime loading.

## Product rules that stay true

- Presentation does not grant entitlement or durable authorization.
- No 029-released claim until release gates + endorsement are actually evidenced.
- Repository-owned source/build artifacts are preferred over cross-origin runtime source mutation.
