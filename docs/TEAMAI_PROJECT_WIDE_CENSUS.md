# TeamAi — Project-Wide Census

**Status:** Continuity census (evidence from `main` tree + Product Law)  
**Date:** 2026-09-08  
**Authority:** PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → this census  
**Companion:** `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`, Spatial Depth Model, Seat Configuration Map

## 1. Purpose

A single map of:

1. **Law families** (what must remain true)  
2. **Engines** (runtime / durable systems)  
3. **Hero machine hierarchy** (presentation parts under Family J)  
4. **Spatial Command Deck** (shell surfaces)  
5. **Questions each feature must answer** before it is “done”

This is a census, not an endorsement that 029 is complete.

---

## 2. Product Law families → owning questions

| Family | Name | Core question every related feature must answer |
|--------|------|--------------------------------------------------|
| **A** | Human authority, product identity, team boundary | Who is the human in control, and what is TeamAi vs not TeamAi? |
| **B** | Canonical service, infrastructure, delivery | Where does the service run, and who owns deploy/delivery truth? |
| **C** | Identity ownership, durable state, trusted execution | What is durable, who owns the write path, and what is trusted execution? |
| **D** | Development responsibility fields | What Field is this work in, and what responsibility does it carry? |
| **E** | Web AI Seats, responsibility profiles, population | What is a Seat, how is it populated, and what profile does it carry? |
| **F** | Whole-team knowledge continuity & orchestration | How does multi-Seat work stay continuous and orchestrated? |
| **G** | Workspace context & ruleset repositories | What workspace/ref/ruleset context applies? |
| **H** | Skills, capabilities, authorization, scheduler eligibility | What can run, under what auth, and is it scheduler-eligible? |
| **I** | Commerce, ZipSkills, provider entitlement | What is paid/entitled, and what is ZipSkill vs core? |
| **J** | Spatial experience, guides, dictionary | How is the workforce **presented** without becoming authority? |
| **K** | Branches, main, integration, verification, history | How does work enter `main` with evidence? |
| **L** | Learning, handover, endorsement, product growth | What was learned, endorsed, and carried forward? |

**Hard invariants 101–110** apply across all families (see PRODUCT_LAW.md §13).

---

## 3. Engine census (runtime / durable)

These are **not** Hero gears. They are server/domain engines Family J may *present*.

| Engine | Path (representative) | Family | Must answer |
|--------|----------------------|--------|-------------|
| API server | `src/api/server.ts` | B, C | What HTTP surface exists; how static Hero/spatial is served? |
| Authority contract | `src/backend/authority.ts` | C, H | What is authorized vs forbidden? |
| Domain state | `src/backend/domain-state.ts` | C, E, G | What durable workplace/project/seat shape exists? |
| Firestore runtime / paths / stores | `src/backend/firestore-*.ts` | C | Where is state written; what is the path contract? |
| Task state / lease / execution / bridge | `src/backend/task-*.ts` | C, H | How does a task become eligible, leased, executed, evidenced? |
| Scheduler | `src/backend/scheduler.ts` | H | Who/what becomes eligible to run, and in what order? |
| Provider runtime | `src/backend/provider-runtime.ts` + `src/providers/*` | H, I | How is an external model invoked after authorization? |
| Skill resolution | `src/backend/skill-resolution.ts` | H | How are skills resolved for a Seat/task? |
| Conversation turn | `src/backend/conversation-turn.ts` | F | How is multi-turn team discussion structured? |
| Configuration draft | `src/backend/configuration-draft.ts` | E, H | What is draft vs committed configuration? |
| Commerce | `src/backend/commerce.ts` | I | How do commercial events correlate to TeamAi identity? |
| Billing / tiers / entitlements / credits | `src/billing/*` | I | What tier allows how many Seats / what capabilities? |
| Plugins / MCP | `src/plugins/*`, `src/mcp/*` | H | What tools exist and under what policy? |
| Security tool policy | `src/security/tool-policy.ts` | H, C | What tools are allowed? |
| Supabase Edge (ops) | `supabase/`, backend skills | B, C, I | What edge functions own secrets and durable correlation? |
| Firebase project identity | `firebase.json`, rules, indexes | B, C | What project/database/rules govern live state? |

### Engine questions (template)

For every engine feature:

1. **Authority** — Which Product Law family owns the truth?  
2. **Write path** — Who may write, and is the browser forbidden?  
3. **Read model** — What may Family J present, and with what staleness/caveats?  
4. **Failure** — What happens on deny, timeout, replay, duplicate?  
5. **Evidence** — What verification proves the slice?  

---

## 4. Hero machine hierarchy (Family J presentation)

Per `TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`:

```text
ENVIRONMENT (far cameras only)
  └─ terms · privacy · about · contact · legal

HERO MACHINE (near)
  ├─ OUTER RING — Web AI Seats (1–N presentation slots)
  │    └─ Seat shell (parent)
  │         ├─ Connection / provider face
  │         ├─ Behavior (Do / Don’t)
  │         ├─ Built-in toolkit
  │         ├─ ZipSkills
  │         ├─ Capabilities / MCP
  │         ├─ Authorization / scope
  │         ├─ Workspace / ref scope
  │         └─ Task / Evidence
  │              └─ leaf: buttons · fields · toggles · short forms
  │
  ├─ CENTER — chosen / configured workspace surface
  │    ├─ Surface
  │    ├─ Focus
  │    ├─ Trace / artifacts
  │    └─ contribute → absorb → reflect → handoff (presentation lifecycle)
  │
  ├─ DOMAIN GEARS (whole-machine parents)
  │    ├─ Subscription gears → seat-slot unlock faces (never self-attest paid truth)
  │    ├─ Discussion gear → planning / discuss-first entry
  │    ├─ Coding gear → start-coding entry
  │    └─ General settings gear → turn management, density/motion faces, …
  │
  └─ MECHANICAL GRAMMAR
       parent open → children (may be parents) → leaf controls still inside
```

### Hero code modules (live `public/`)

| Module | Role in hierarchy |
|--------|-------------------|
| `index.html` | Host shell / canvas / controls |
| `hero-flex.js` | WebGL engine, seats, workspace, materials context, reduced-motion |
| `hero-authored-meshes.js` | Authored mesh buffers (ring, seat shell) |
| `hero-authored-materials.js` | Material families from lighting context |
| `hero-parts.js` | Spatial part focus / camera for Surface·Focus·Trace |
| `hero-semantic-camera.js` | Semantic camera intents |
| `hero-inspection-spine.js` | Inspection stage sequence (presentation IDs) |
| `hero-seat-stack.js` | DOM seat stack (**interim debt** vs in-machine leaves) |
| `hero-auth-handoff.js` | Auth handoff panel (presentation-only) |
| `hero-aura.js` | Aura / ambient presentation |
| `hero-theme-lighting-adapter.js` (spatial) | Canonical `mapHeroThemeLighting` (pure) |

### Hero feature questions

| Feature | Must answer |
|---------|-------------|
| Seat ring | Does outer ring mean Seats only? Click → dock + open? |
| Seat open | What child layers appear, in what Product Law order? |
| Workspace center | Does center show *chosen* workspace surface, not empty decor? |
| Subscription gear | Does it only *present* unlock paths; never claim paid entitlement? |
| Discussion / Coding gears | Do they enter the correct flow without starting durable execution alone? |
| Settings gear | Are turn management and preferences nested parts, not external chrome? |
| Leaf controls | Are they they inside the open parent and still accessible? |
| Environment tabs | Are legal/about/contact far cameras only? |
| Theme / motion | Single theme root? Reduced-motion preserves hierarchy meaning? |
| Materials / depth | Skeuomorphic light / glass dark without second theme authority? |

---

## 5. Spatial Command Deck census (`frontend/spatial/`)

| Surface | Files (representative) | Family | Must answer |
|---------|------------------------|--------|-------------|
| Theme root | `theme-root.css/js/ts` | J | One theme root; data-theme-mode / motion / density on `documentElement`? |
| Shell nav | `shell-nav.js/ts`, `shell-nav.css` | J | Navigation without domain writes? |
| Command deck / interior | `deck-interior.css`, composition docs | J | Shell vs panel vs card legal boxes? |
| Planning | `planning.js/css` | J, F | Planning presentation vs orchestration authority? |
| Working | `working.js/css` | J, F | Working surface semantics? |
| Settings | `settings.js/css` | J | Settings as presentation of preferences only? |
| Artifacts | `artifacts.js/css` | J, K | Artifact list vs durable evidence authority? |
| Seats plate / bind | `seats-plate-bind.js`, provider bind clients | J, E, I | Bind UI presentation vs server-owned key storage? |
| Seat connection test | `seat-connection-*.js` | J, H | Probe presentation vs live provider truth? |
| Seat / commerce read models | skills + clients | J, E, I | `presentationOnly`, non-durable? |
| Dictionary | `dictionary.html` | J | Terms map to Product Law vocabulary? |
| Backend validator UI | `backend-validator-contract.html` | J, C | Validator is diagnostic, not authority? |
| F7 modal | `f7-modal.css` | J | Field vocabulary only? |

### Deck vs Hero

| Concern | Deck | Hero machine |
|---------|------|--------------|
| Primary job | Navigate / compose plates | Mechanical map of workforce |
| Theme | Writer of `documentElement` attributes | Reader (subset) for materials/motion |
| Product config long-term | Absorb into machine gears per contract | Nested gears/parts |
| Today’s debt | Parallel surface | External seat-stack / control chrome |

---

## 6. Verification & packaging engines

| Unit | Path | Must answer |
|------|------|-------------|
| Unit tests | `tests/*.test.mjs` | Do contracts stay true? |
| E2E / Playwright | `tests/e2e/*` | Does browser smoke match presentation claims? |
| CI | `.github/workflows/TeamAi.yml` | Build, package, recovery integrity? |
| Pages deploy | `.github/workflows/github-pages.yml` | Root = spatial; `/hero/` = machine? |
| Project package | `build-system/`, packaging skill | Full ZIP recoverable? |

---

## 7. Universal feature checklist (use on every slice)

Before marking a feature done, answer **all** that apply:

### Law

1. Which **family** owns the truth?  
2. Does any browser path **write** durable state it must not?  
3. Does any visual state **imply** entitlement/auth it must not?

### Hierarchy (Hero / spatial)

4. Is this **environment**, **machine parent**, **child**, or **leaf**?  
5. If parent: what children open?  
6. If leaf: is it still **inside** the parent assembly?  
7. What **semantic camera / inspection ID** applies (if any)?

### Mechanics

8. What is the **rest pose** vs **open pose**?  
9. What happens under **reduced motion**?  
10. What is the **failure / empty / loading** face?

### Evidence

11. What **static** test locks the contract?  
12. What **browser** evidence exists?  
13. Is **HandOver / Endorsement** required for this gate?

### Continuity

14. Does this reduce dual-root / dual-track **noise**noise**?  
15. Is the Masterplan checklist item still **held** or legitimately advanced?

---

## 8. Census snapshot (2026-09-08)

| Area | State |
|------|--------|
| Backend engines | Substantial source + several gates evidenced; 029 still chronologically held for full experience release |
| Hero machine grammar | Depth 0 live; materials/motion contracts advanced; **nested gear open not implemented** |
| External DOM chrome | Seat-stack / controls = **debt** vs machine contract |
| Command Deck | Spatial shell + plates exist; not fully one system with Hero |
| Pages | Root Command Deck; `/hero/` prototype |
| Docs | Machine Interaction Contract + this census for continuity |

---

## 9. Design principle

**Engines own truth. The machine presents hierarchy. Every part answers a Product Law question. Leaves stay inside. Only the room is outside.**
