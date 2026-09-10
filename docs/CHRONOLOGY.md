# TeamAi Chronology — ordered thoughts and gates

**Purpose:** one timeline of *what we decided and in what order*, so new sessions do not invent a parallel history.  
**Not** Product Law. Link out for detail.  
**Date:** 2026-09-08

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

## 4. 3D Hero path (baseline + gated next)

| Order | Thought | Status |
|-------|---------|--------|
| H1 | Hero is Living Web AI Shared Workspace **presentation** | Baseline captured |
| H2 | Mixed authored (`workspaceRing`, `seatShell`) + procedural | Baseline |
| H3 | 1–8 seats scale one topology | Baseline |
| H4 | Semantic cameras + inspection spine | Baseline |
| H5 | Turn lifecycle is visual only | Baseline |
| H6 | Light-skeuomorphic first; dark glass later | Planned (#83+) |
| H7 | Theme-lighting adapter pure/deterministic | Gated issues #84–#98 |
| H8 | Material refinement, task/evidence anchors | #93 open — PR #127 **conflicts with main after #92** |
| H9 | Seat Identity Inspection | Spec held behind Masterplan gate |
| H10 | Authorization / scope presentation (#92) | **IMPLEMENTED** on main PR #126 (`66b6c19`). Presentation-only. Not live auth authority. |

**Next complex 3D work** should stay **presentation-only** and prefer **one bounded issue**.

Checkpoint: `docs/CHECKPOINT_TEAM-EXPERIENCE-029_HERO_SPATIAL_BASELINE_2026-09-07.md`

---

## 5. Documentation & team continuity

| Order | Thought |
|-------|---------|
| D1 | Agent slice needs green CI + assumptions + reasons + next slice | `docs/AGENT_SLICE_EXECUTION.md` |
| D2 | User manual for deploy + seats | `docs/USER_MANUAL_DEPLOYMENT.md` |
| D3 | Dictionary for complex tabs / Hero parts | `docs/DICTIONARY.md` |
| D4 | This chronology | `docs/CHRONOLOGY.md` |

---

## 6. Suggested next execution (after this doc)

Pick **one**:

1. **Required next:** rebase/resolve PR #127 onto main so #93 keeps both `setAuthorizationPresentation` (#92) and `setWorkspaceTaskPresentation` (#93). Then merge if CI green.
2. **3D (bounded):** theme-lighting adapter **contract tests only** (issue #98 / PR #125) — no full lighting rewrite.
3. **3D (visual):** single material/depth pass on `workspaceRing` / `seatShell` under light mode (#88) — still presentation-only.
4. **Ops:** deploy Edge functions + secrets when ready for live seats (not required for stub/CI). Leave existing deploy docs; user-manual setups only.

Vercel remains cut off. Do not create a second deployment file.

---

## Quick links

- [Dictionary](./DICTIONARY.md)
- [Deploy manual](./USER_MANUAL_DEPLOYMENT.md)
- [Hero baseline](./CHECKPOINT_TEAM-EXPERIENCE-029_HERO_SPATIAL_BASELINE_2026-09-07.md)
- [Seat secret & free smoke](./TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md)
