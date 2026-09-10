# TEAM-EXPERIENCE-029 — Seat skills, workspace skills, Zip packages, commerce

**Status:** PLANNING CONTRACT / naming harden — **not** Product Law amendment  
**Authority:** `PRODUCT_LAW.md` Families E, F, G, H · MASTERPLAN context model · LAW 109 (skills ≠ authorization)  
**Purpose:** One vocabulary so Hero faces, settings presets, and future runtime do not invent competing meanings.

## 1. Hard naming decision (noise reduction)

| Canonical term | Meaning | Is it billable commerce? |
|----------------|---------|--------------------------|
| **SEAT_SKILLS** | Procedure/knowledge for a **Seat’s responsibilities** | **No** |
| **WORKSPACE_SKILLS** | Procedure/knowledge for **project / workplace governance** | **No** |
| **Zip package** (`ZIP` / handover package) | **Distribution format** that may carry skills, templates, startup configs | **No** — packaging only |
| **Team Quality** | Commercial axis: seats, orchestration capacity, model tier allocation | **Yes** (product commerce) |
| **Tool Quality** | Commercial axis: optional tools/plugins/MCP packs | **Yes** (product commerce) |
| **Entitlement / PayPal projection** | Whether the account may use a Team/Tool Quality capability | **Yes** (commerce runtime) |

### Rejected conflation

**Do not** rename commerce SKUs to `ZIP_SKILLS` or treat Zip packages as billing products.  
That collapses **knowledge distribution** with **commercial entitlement** and violates Product Law separation of skills vs authorization vs entitlement.

### Legacy presentation names (Hero — keep for continuity)

| Legacy / UI face | Canonical meaning |
|------------------|-------------------|
| `SEAT_TOOLKIT` | Presentation stub for optional **SEAT_SKILLS** equip on a seat |
| `WORKSPACE_ZIPSKILLS` | Presentation face for optional **WORKSPACE_SKILLS** equip on workspace tree (R0) |
| `MECHANISM_ZIPSKILLS` | Alias of `WORKSPACE_ZIPSKILLS` (same dock; e2e continuity) |

New docs and settings should prefer **SEAT_SKILLS** and **WORKSPACE_SKILLS**.  
Hero part IDs may keep legacy strings until a dedicated rename PR updates runtime + tests together.

## 2. Product Law position (already true — this doc does not rewrite law)

```text
Workspace rules + Skills define operating procedure/context
Capabilities define available mechanisms
Authorization defines permitted control
```

- Skills **do not** grant permission, GitHub write, or entitlement.  
- Packages **do not** override Product Law or user authority.  
- OAuth GitHub connection ≠ seat usable until equip + scope + health + policy.

## 3. SEAT_SKILLS — kinds (responsibility catalog)

Equip on a **Seat**. Answer: *“What is this participant’s job?”*

| Kind ID | Role focus | Typical operations | Typical prohibitions |
|---------|------------|--------------------|----------------------|
| `seat.planning.discuss` | Planning discussion | Analyze, challenge, pros/cons | Durable plan mutation without selection |
| `seat.planning.summarize` | Summarizer | Structured handoff from TeamChat | Silent approval / merge authority |
| `seat.field.backend` | Backend & runtime | Contracts, rules, recovery evidence | Invent visual authority |
| `seat.field.frontend` | Frontend & experience | Presentation, a11y, spatial | Invent backend truth |
| `seat.field.integration` | Integration / Team Lead | PR coordination, reconcile, escalate | Bypass review / Product Law |
| `seat.field.verification` | Verification | CI, tests, evidence | Green tests = product endorsement |
| `seat.field.docs` | Docs & handover | Checkpoints, HandOver packages | Rewrite law via docs alone |
| `seat.work.coding` | Working/coding | Scoped GitHub tools under policy | Out-of-scope paths; secret in chat |
| `seat.coord.leader` | Supervisory | Recommend coordination | Bypass scheduler / human approval |

**Preset examples (settings later):** Solo planner, 3-seat balanced (backend+frontend+integration), coding pair, verification specialist.

## 4. WORKSPACE_SKILLS — kinds (governance catalog)

Equip on **Workplace / Project**. Answer: *“What rules does this project run under?”*

| Kind ID | Governance focus | Content |
|---------|------------------|---------|
| `ws.authority.map` | Authority chain | Product Law → Masterplan → skills → tools |
| `ws.contribution.flow` | Source flow | Branch → commit → PR → verify → merge |
| `ws.029.presentation` | 029 boundary | Presentation only; **no 029-released claim** |
| `ws.secrets.boundary` | Secrets | Keys outside chat; server bind only |
| `ws.tools.github` | GitHub policy | Connection required; scopes; report-back |
| `ws.turn.defaults` | Turn policy | Turns per seat; planning vs coding defaults |
| `ws.evidence.handover` | Continuity | Checkpoint / evidence / HandOver expectations |

Workspace skills are **project-owned**. Changing them does not change Product Law.

## 5. Zip package (distribution only)

```text
Zip package may contain:
  - SEAT_SKILLS bundles
  - WORKSPACE_SKILLS bundles
  - templates / startup project stubs
  - handover / evidence layout helpers

Zip package must not:
  - create PayPal / entitlement truth
  - grant GitHub OAuth
  - become a second Product Law
  - imply mandatory bind in Hero UI
```

Commerce catalog (future Settings billing UI) labels: **Team Quality** / **Tool Quality** plans — never “ZipSkills tier.”

## 6. Equip chain (hardening)

```text
User prepares GitHub repo (outside)
  → User authorizes GitHub connection (inside TeamAi OAuth)
  → User equips WORKSPACE_SKILLS (governance)
  → User configures Seat + SEAT_SKILLS (responsibilities)
  → User attaches GitHub connection to Seat scope (optional)
  → Capability test + health
  → Authorization + scheduler eligibility
  → Usable turn: skills context → TeamChat packet → model key → tools → report
```

Reason-bearing states remain:

`available → configured → entitled → compatible → authorized → scoped → seat-allowed → healthy → usable`

## 7. Hero / presentation mapping (no runtime change in this doc PR)

| Hero face | Canonical |
|-----------|-----------|
| Seat toolkit leaf | Optional SEAT_SKILLS indicator |
| R0 ZipSkills crown | Optional WORKSPACE_SKILLS indicator |
| Labels | Must say optional / not required setup |

## 8. Implementation sequencing (less noise)

| Step | Work | Runtime? |
|------|------|----------|
| **This contract** | Taxonomy + kinds tables | No |
| Settings copy | Prefer SEAT_SKILLS / WORKSPACE_SKILLS language | Copy only |
| Hero rename | Optional later PR: part IDs + tests together | Yes (dedicated) |
| Skill bodies | Author actual SKILL.md bundles per kind | Yes, per kind PR |
| Commerce UI | Team Quality / Tool Quality only | Separate |

## 9. Boundaries

- Presentation / planning continuity only in this slice.  
- **No 029-released claim.**  
- Does not amend `PRODUCT_LAW.md` text; aligns vocabulary under existing Families E/G.  
- Merge gate #133 when landed via PR.

## Related structure

- `docs/WEB_AI_SEAT_RESPONSIBILITY_TREE.md` — responsibility units mapped to Hero faces and skill kinds (Issue #256 · H-T1).
- `docs/WEB_AI_SEAT_TOOLKIT_BOUNDARY.md` — ToolKit ↔ seat boundary.
