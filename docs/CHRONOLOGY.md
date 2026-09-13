# TeamAi Chronology — ordered thoughts and gates

**Purpose:** one timeline of *what we decided and in what order*, so new sessions do not invent a parallel history.  
**Not** Product Law. Link out for detail.  
**Date:** 2026-09-13 (decision order; current main-vs-plan-vs-Issues map is [`TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md`](./TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md))

Full term definitions: [DICTIONARY.md](./DICTIONARY.md)

---

## How to read this

```text
earlier gate / thought
        ↓
later work must not contradict it without explicit reconciliation
```

When in doubt: **Product Law → Masterplan gate → ORUCAVEAM slice → evidence → merge.**

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
| D1 | Agent slice needs green CI + assumptions + reasons + next slice | `docs/AGENT_SLICE_EXECUTION.md` |
| D2 | User manual for deploy + seats | `docs/USER_MANUAL_DEPLOYMENT.md` |
| D3 | Dictionary for complex tabs / Hero parts | `docs/DICTIONARY.md` |
| D4 | This chronology (decision order) | `docs/CHRONOLOGY.md` |
| D5 | Product experience rebaseline | `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md` |
| D6 | Current main vs plan vs Issues | `docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md` |

---

## 6. Current execution priority

Do not re-open C0 as if it were unendorsed. Current `main` already has C0–C5 foundations, repository-owned Hero runtime, and classic Pages root. Remaining work is owned by live Issues, not by this historical chronology.

1. Reconstruct current HEAD against [`TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md`](./TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md).
2. 029 remaining machine/camera/auth/C9 work: Issue **#278** (comments are evidence-only).
3. Backend remaining gaps (provider stub, Gate 4, verification): Issue **#284**.
4. Conn-3 browser continuation: Issue **#204**.
5. **Only after C9 acceptance:** C10 ProMax. Issue **#83** is the later visual track, not a shortcut around #278.

Conn-3 live/browser proof and future security inquiries remain independent tracks. Vercel remains cut off. Command Deck is retired as an active product surface. ToolKit/Echo learning candidates come only from validated, generalized lessons.

---

## Quick links

- [Chronological execution guide (main vs plan vs Issues)](./TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md)
- [Dictionary](./DICTIONARY.md)
- [Deploy manual](./USER_MANUAL_DEPLOYMENT.md)
- [Hero baseline](./CHECKPOINT_TEAM-EXPERIENCE-029_HERO_SPATIAL_BASELINE_2026-09-07.md)
- [Experience rebaseline](./TEAMAI_029_EXPERIENCE_REBASELINE.md)
- [Experience rebase checklist](./TEAMAI_029_EXPERIENCE_REBASE_CHECKLIST.md)
- [Seat secret & free smoke](./TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md)
