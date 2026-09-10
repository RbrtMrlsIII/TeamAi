# TeamAi Dictionary

**Audience:** every session (including new ones)  
**Purpose:** plain-language meanings for complex tabs, 3D Hero parts, and product terms  
**Authority:** Product Law remains higher than this dictionary  
**Date:** 2026-09-08

Jump to: [Command Deck & fields](#command-deck--fields-f0f7) · [3D Hero](#3d-hero--spatial-parts) · [Seats & connection](#seats--provider-connection) · [Backend](#backend--authority) · [Current 029 spatial recovery](#current-029-spatial-recovery) · [Chronology](./CHRONOLOGY.md)

---

## How to use this page

1. Open a **complex tab** or 3D control in the product/UI.
2. Find the same label here.
3. Read the **one-line meaning**, then the **do not confuse with** note.
4. Follow **See also** into deeper docs or the [chronology of decisions](./CHRONOLOGY.md).

---

## Command Deck & fields (F0–F7)

| Code | Name | One-line meaning | Do not confuse with |
|------|------|------------------|---------------------|
| **F0** | Identity / orientation | Who/what this surface is about | Firebase project id |
| **F1** | Shell | Outer frame of the app (chrome, layout) | 3D seat shell mesh |
| **F2** | Navigation | Moving between plates/pages | Scheduler choosing a seat |
| **F3** | Content / plate body | Main reading/working area of a plate | Durable Firestore document |
| **F4** | Status | Bound display of state (health, phase, gates) | Authorization decision |
| **F5** | Action | Buttons the user may press | Backend Activate / lease |
| **F6** | Modal | Overlay for confirmation or block reasons | Permanent settings authority |
| **F7** | Plate | A full work surface (Seats, Planning, …) | A Web AI provider |

**Status** and **Modal** are numbered fields so the UI can treat them with the same discipline as the original legal boxes, without inventing backend power.

**See also:** Product Law (legal boxes / fields), `docs/TEAM-EXPERIENCE-029_COMMAND_DECK_AND_TOKEN_FREEZE.md`

---

## 3D Hero — spatial parts

| Term | One-line meaning | Do not confuse with |
|------|------------------|---------------------|
| **Hero** | Presentation scene for the Living Web AI Shared Workspace | TeamAi the product / backend authority |
| **Shared workspace** | Center of the scene; seats contribute *through* it | Firestore, scheduler, or a single provider chat |
| **Web AI Seat (3D)** | Peripheral participant shell in the scene | The durable seat config document |
| **workspaceRing** | Authored mesh for the workspace signature ring | Entitlement ring / billing |
| **seatShell** | Authored mesh for a seat’s outer form | Provider account ownership |
| **Inspection spine** | Guided tour of semantic stages (orientation → normal UI) | Authorization sequence |
| **Semantic camera** | Camera intent by meaning (e.g. SEAT_CLOSE), not by raw XYZ only | Permission or “who may act” |
| **Turn lifecycle** | Visual cycle IDLE → … → HANDOFF | Actual provider invocation |
| **Contribution corridor** | Visual path seat → workspace | Real network call |
| **Normal-UI handoff** | Leave 3D for forms, settings, evidence | Ending the product session |
| **Light-skeuomorphic mode** | First visual direction: machined, lit instrument | Dark glass mode (paired later) |
| **Reduced motion** | Same meanings, less movement | Different product rules |

**Hero must not:** authorize, write Firestore, schedule work, call providers, or hold API keys.

**See also:** `docs/CHECKPOINT_TEAM-EXPERIENCE-029_HERO_SPATIAL_BASELINE_2026-09-07.md`, `docs/TEAMAI_3D_HERO_NEXT.md`, issues #83–#98

### Inspection spine (chronological visual stages)

```text
HERO_ORIENTATION → SURFACE → FOCUS → CONNECTION → BEHAVIOR → SKILLS
  → ZIPSKILLS → CAPABILITY → AUTHORIZATION → WORKSPACE → TASK
  → EVIDENCE → NORMAL_UI
```

Each stage is **presentation**. AUTHORIZATION on the spine does **not** grant permission.

---

## Seats & provider connection

| Term | One-line meaning | Do not confuse with |
|------|------------------|---------------------|
| **Seat (product)** | Configurable participation slot on a Workplace/Project | Consumer ChatGPT/Claude app login |
| **Provider** | External LLM company/runtime (OpenAI, Anthropic, …) | TeamAi Firebase user |
| **Model** | Specific model id under a provider | Seat role |
| **API key** | Server credential for API calls | TeamAi password |
| **TEAMAI_SEAT_SECRET_KEY** | Encrypts stored seat API keys | OpenAI/Anthropic key |
| **Test Connection** | Server probe of health (stub or HTTP) | Full multi-seat chat |
| **probeMode: stub** | Free smoke; no provider billing | Real models list call |
| **credentialSource** | `seat` / `platform` / `none` in probe response | Entitlement |
| **Activate Seat** | Backend-gated readiness (not browser self-grant) | Drawing the seat in 3D |
| **Connection health** | `unknown` / `offline` / `degraded` / `healthy` | Scheduler eligibility alone |

**Flow:** Firebase login → draft provider key → **Save** (Edge encrypts) → **Test Connection** (server) → Activate (backend).

**See also:** `docs/USER_MANUAL_DEPLOYMENT.md`, `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`, `docs/TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md`

---

## Backend & authority

| Term | One-line meaning | Do not confuse with |
|------|------------------|---------------------|
| **Firebase Auth** | Who the human is (UID) | Provider API key |
| **Firestore** | Canonical durable TeamAi state | Cache / UI draft |
| **Supabase Edge** | Trusted server execution | Domain source of truth |
| **Lease** | One worker wins a READY task | UI “busy” spinner |
| **Configuration draft** | Local edits until Save | Saved baseline |
| **Conversation turn** | One durable human/AI contribution | Streaming tokens |
| **ORUCAVEAM** | How a command may be executed safely | A second Product Law |
| **Field** | Dev responsibility area (Backend, Frontend, …) | Web AI Seat |

**See also:** `PRODUCT_LAW.md`, `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`

---

## Current 029 spatial recovery

The **3D Hero is a presentation surface, not a backend authority**. Its tree, camera, interaction and visual state may be developed and verified before backend runtime integration, provided the slice remains presentation-only. Backend work becomes relevant when a separately authorized contract requires a trusted/durable capability; it does not retroactively make a 3D mesh authoritative.

For current 029 spatial work, use these entry points in this order:

1. `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` — executable pre-backend / pre-coloring gates and stop conditions.
2. `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` — current Cam↔V chronology and frontier.
3. `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` — interaction/topology law.
4. `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` — living spatial numbers.
5. `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` — continuity pointer, not a second camera chronology.
6. `docs/VISION.md` — current experience intent.

Historical Cam/P-slice checkpoints preserve provenance. **Their `Next` section must not be treated as a current work queue.** Current work must be selected from the reconciled ledger and spatial execution basis.

Spatial completion order is:

`structure → camera → interaction → readability → browser evidence → spatial completion`

Only after that pass is accepted should 3D color/material art direction become the next visual layer. Backend runtime and commerce/auth integration remain separately gated by the Masterplan and must not be inferred from Hero presentation progress.

---

## Complex tabs → dictionary anchors

| UI / tab | Dictionary section |
|----------|---------------------|
| Seats plate | [Seats & provider connection](#seats--provider-connection) |
| Test Connection | [Seats & provider connection](#seats--provider-connection) |
| Provider API key panel | [Seats & provider connection](#seats--provider-connection) |
| Hero / spatial canvas | [3D Hero](#3d-hero--spatial-parts) |
| Inspection / camera labels | [Inspection spine](#inspection-spine-chronological-visual-stages) |
| Status strip / health dial | [F4 Status](#command-deck--fields-f0f7) |
| Deploy / secrets | [USER_MANUAL_DEPLOYMENT](./USER_MANUAL_DEPLOYMENT.md) |
| “What did we decide when?” | [CHRONOLOGY](./CHRONOLOGY.md) |

---

## Related entry points

| Doc | Role |
|------|------|
| [CHRONOLOGY.md](./CHRONOLOGY.md) | Ordered thoughts / gates / slices |
| [USER_MANUAL_DEPLOYMENT.md](./USER_MANUAL_DEPLOYMENT.md) | Canonical deployment guide |
| [AGENT_SLICE_EXECUTION.md](./AGENT_SLICE_EXECUTION.md) | How agents close a slice |
| `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` | Current pre-backend / pre-coloring spatial execution gates |
| `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` | Current camera/experience recovery ledger |
| `PRODUCT_LAW.md` | Highest product authority |
