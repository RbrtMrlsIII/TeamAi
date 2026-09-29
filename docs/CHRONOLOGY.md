# TeamAi Chronology — ordered thoughts and gates

**Purpose:** one timeline of *what we decided and in what order*, so new sessions do not invent a parallel history.  
**Not** Product Law. Link out for detail.  
**Date:** 2026-09-13 (decision order)

Full term definitions: [DICTIONARY.md](./DICTIONARY.md)

---

## How to read this

```text
earlier gate / thought
        ↓
later work must not contradict it without explicit reconciliation
```

When in doubt: **Product Law → Masterplan gate → ORUCAVEAM slice → evidence → merge.**

## 2026-09-29 current continuation order

This is the current decision-order overlay for the 029 spatial continuation. Earlier sections are historical decision lineage and remain useful provenance, but they do not override this current sequence.

### Current repository truth

- Canonical main: 13356cae7e6ef8179f7e2e552211bb4d187f37fb
- Active 029 spatial vehicle: PR #424 / frontend/029-spatial-world-continuation
- Exact #424 head: 208c5570a8325bda10e2b427b97a30c3f439f111
- #424 relation to main: 92 ahead / 0 behind
- #424 state: OPEN / DRAFT / mergeable
- Global current slice remains Issue #401 in Masterplan/NEXT_SLICES.md; #424 is a bounded spatial sub-frontier and not a second global current slice.

### Current spatial order

Y0 feature/leaf coverage closure
→ Y1 renderer-substrate readiness / Three.js + WebGL2 adapter path
→ S2–S10 structural visual embodiment acceptance
→ S24 materials + lighting
→ S25 holograms / payload presentation
→ S26 ambient environment
→ VC1 / AB1 integrated visual coherence checkpoint
→ S27 performance
→ S28 cross-feature choreography
→ S29 final interaction choreography
→ S30 exact-head repository proof
→ S31 runtime/deployment reconciliation
→ S32 human acceptance
→ S33 final ProMax polish

Y0 exists to prevent discovering missing product leaves after spatial geometry has been treated as final. Y1 is a rendering-substrate migration gate, not a new semantic hierarchy. Structural misses still return to their S2–S10 owner; effects never close missing structure.

### Current verification boundary

The latest exact-head repository gates are Governance PASS (36539522170), Full-System PASS (36539522147), Deep Security PASS (36539522181), Security/CodeQL PASS (36539522165), and Canonical Browser FAIL (36539522142, 87 passed / 4 skipped / 1 failed). The Browser failure is the isolated legacy machine-core-preview transition assertion: selecting a branch currently starts the preview's expansion path before the test clicks Expand, so a deterministic transition boundary is required. This is not current evidence of an S4 geometry regression or production Hero failure.

### Durable decision rule

Chat is a working surface, not project authority. A material decision, discrepancy, geometry calculation, evidence result, accepted/rejected alternative, or next-slice recommendation is not durable until it is recorded in the appropriate authoritative project surface. Use #409 for newcomer current-state transfer, the 029 evidence registry for verified findings/evidence, the Masterplan/checklist for ordered gates, Masterplan/NEXT_SLICES.md for the one global current slice, Product Law/WIRING for routing and authority rules, and the owning Issue/PR for bounded implementation context. Historical entries must remain explicitly historical rather than being rewritten into current truth.


---

## 1. Product foundation (standing)

| Thought | Meaning |
|---------|---------|
| Product Law is highest authority | UI, skills, providers cannot override it |
| Human user authority | AI output is not authority by novelty |
| Firebase = identity + durable domain | Supabase Edge = trusted execution only |
| Browser is presentation | No durable secret/lease/health authority in the browser |
| Web AI Seat ≠ provider account | TeamAi connects; provider still owns the external app |
| Direct provider-to-provider orchestration forbidden | Coordination goes through durable events + scheduler |

---

## 2. Backend path (proven / endorsed themes)

| Order | Thought | Pointer |
|-------|---------|---------|
| B1 | Read/write economy: edit ≠ save; turn = durable unit | `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md` |
| B2 | Lease contention: one winner for READY task | live recovery workflow |
| B3 | Durable result before terminal claim; restart recovers by id | same |
| B4 | Edge verifies **Firebase** ID token (`--no-verify-jwt`) | task-execute, seat functions |
| B5 | PayPal / commerce stays out of seats path unless gate opens | Product Law commerce boundary |

---

## 3. Seats plate live path (029 — implemented in slices)

| Order | Slice | Thought |
|-------|-------|---------|
| S1 | Seat read model | Project server facts to presentation (`health` enum shared with Hero) |
| S2 | Shell-nav bind | Plate shows projection; fixtures until domain configured |
| S3–S5 | Connection client + wire | Test Connection → Edge; fixture if no base URL |
| S6 | Durable health write | Server-only event + seat upsert |
| S7 | HTTP probe | Optional real models-list GET; stub stays free |
| S8 | Per-seat API key bind | Draft → Save → AES encrypt; never full key in response |
| S9 | Plate bind UI | Save / Clear / Discard on Seats detail |
| S10 | Probe prefers seat key | `credentialSource`: seat → platform → none |

**Standing rule:** smoke without $$ uses `probeMode: "stub"`.

---

## 4. 3D Hero path (baseline + historical Vision lineage)

| Order | Thought | Status |
|-------|---------|--------|
| H1 | Hero is Living Web AI Shared Workspace **presentation** | Baseline captured |
| H2 | Mixed authored (`workspaceRing`, `seatShell`) + procedural | Baseline |
| H3 | 1–8 seats scale one topology | Baseline |
| H4 | Semantic cameras + inspection spine | Historical Vision baseline |
| H5 | Turn lifecycle is visual only | Historical Vision baseline |
| H6 | Light-skeuomorphic first; dark glass later | Historical baseline / planned refinements |
| H7 | Theme-lighting adapter pure/deterministic | Historical/gated work |
| H8 | Material refinement, task/evidence anchors | Historical baseline |
| H9 | Seat Identity Inspection | Historical/spec baseline |
| H10 | Authorization / scope presentation | Implemented presentation-only; not live auth authority |

Recent V0–V3/V3.5, #259, CAM-R1–R3, ENT-R4 and CHR-R3 work remains implementation lineage and evidence. It is **not** by itself the final product-experience acceptance state.

### H11 — 029 Product Experience Rebaseline

The current owner-directed rebaseline is canonical planning data for the next experience shape:

`docs/TEAMAI_029_EXPERIENCE_REBASELINE.md`

The product shape moves from a one-shell entrance model toward:

`classic website entrance → explicit 3D-world entry → authenticated/authorized full workspace`

The rebaseline governs C0–C10: product-shape endorsement, canonical reconciliation, classic entrance, explicit 3D entry, coherent navigation/settings, camera-dock rationalization, world-baseline zoom-out, proportional orbit, server authorization, desktop/phone acceptance, then ProMax visual refinement.

The owner-visible acceptance gap is historical evidence from the recent Vision era: mobile/desktop composition, scattered/blurred controls, camera density, zoom ceiling, inverse orbit, and undiscoverable Settings. These are not resolved merely by prior green technical slices.

---

## 5. Documentation & team continuity

| Order | Thought |
|-------|---------|
| D1 | Current execution procedure is governed by Policy/ORUCAVEAM and applicable Skills; evidence is recorded on the owning Issue/PR | `POLICY.md`, `docs/SKILL_WIRING.md`, owning Issue/PR |
| D2 | User manual for deploy + seats | `docs/USER_MANUAL_DEPLOYMENT.md` |
| D3 | Dictionary for complex tabs / Hero parts | `docs/DICTIONARY.md` |
| D4 | This chronology (decision order) | `docs/CHRONOLOGY.md` |
| D5 | Product experience rebaseline | `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` |
| D6 | Current canonical execution state | `Masterplan/MASTERPLAN.md` + Issue #278 |

---

## 6. Current execution priority

The global current program frontier remains TEAM-BACKEND-030 / Issue #401. The spatial continuation is concurrently bounded inside PR #424 without creating a second global current-slice authority.

The next spatial implementation order is Y0 → Y1 → structural visual embodiment → S24 → S25 → S26 → VC1/AB1 → S27 → S28 → S29 → S30 → S31 → S32 → S33. The currently known Browser failure is owned by the isolated machine-core preview timing contract and should be hardened without weakening assertions or using arbitrary sleeps.

Do not advance to broad decorative work merely because renderer/material capabilities exist. Physical machine completeness, topology attachment, and camera participation remain upstream acceptance boundaries.

The current successor-session source is Issue #409. The current evidence ledger is Masterplan/TEAMAI_3D_WORLD_404_EVIDENCE.md. The detailed execution checklist is Masterplan/TEAMAI_3D_WORLD_404_CHECKLIST.md. The authority-routing rule is Product_Law/WIRING.md.

## Quick links

- Dictionary: docs/DICTIONARY.md
- Deploy manual: docs/USER_MANUAL_DEPLOYMENT.md
- Hero baseline: docs/CHECKPOINT_TEAM-EXPERIENCE-029_HERO_SPATIAL_BASELINE_2026-09-07.md
- Experience rebaseline: docs/TEAMAI_029_EXPERIENCE_REBASELINE.md
- Evidence registry: Masterplan/TEAMAI_3D_WORLD_404_EVIDENCE.md
- Master execution checklist: Masterplan/TEAMAI_3D_WORLD_404_CHECKLIST.md
- Canonical successor handoff, Issue #409: https://github.com/RbrtMrlsIII/TeamAi/issues/409
