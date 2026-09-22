# AI_ASSISTANT_READ_ME — current session boundary

## SESSION SNAPSHOT

- Last given prompt: continue Issue #396 / PR #398 until the 029 spatial machine feature set is genuinely complete and the branch can replace main; feature completion comes before polish.
- #346 governance foundation lineage remains the historical baseline for the current control-plane authority chain.
- #353 machine Hero candidate is merged on main as the non-production implementation baseline.

- main baseline: `d8b1e767898be9fe640f002d72cf7771842865b6` (current main / PR #395 merge)
- current main: `d8b1e767898be9fe640f002d72cf7771842865b6`
- current slice: TEAM-EXPERIENCE-029 spatial machine convergence (Issue #396 / Draft PR #398)
- replacement branch: frontend/029-machine-world-convergence
- open implementation vehicles: PR #398 / Issue #396 (active Draft)
- active implementation slices: #396, #278, #360, #392, #83, #284, #204, #400 frontend contract
- closure-pending governance lineage: #394 / #393, implemented in PR #395 and retained as historical control-plane evidence
- completed reconstruction: #391 / #389
- historical/superseded: #347, #368, #369, #387, #388, #386, #385, #379, #397
- do not execute: retired model-specific reviewer paths, 1→2→2 choreography, shared-key semantics, comment-driven advisory orchestration, or the retired current-state map
- next allowed work: continue the governed 029 cross-stack implementation on PR #398; implementation remains active while production Firestore Seat-shape verification, controlled task-executor deployment, real provider continuation proof, final spatial acceptance, and production delivery evidence remain open.
- handoff rule: chat is transient; start from this snapshot plus live GitHub branch/PR/Issue state, not PR archaeology
- validation state: the current branch head is authoritative and must be re-verified by fresh exact-head workflows after each implementation change. The previous fully green exact-head baseline was `5badf3723b9bcbf5bb6f98f7e4e7c04a14fb6f50`; subsequent work has added canonical active-connection authority, durable invalid-provider-termination handling, and the manual Firestore `execution-results` index readback workflow. Final spatial visual acceptance, production deployment, provider execution, and human acceptance remain open.
- live PR head: the GitHub PR head is the source of truth for the current verification commit; never infer current verification truth from an older recorded SHA.
- snapshot rule: recorded main baseline must be checked against the PR base before mutation; live GitHub branch/head state remains authoritative for current commit truth


### 2026-09-21 exact-head MCP proof

- Verified live branch/PR head: `2d75a8b2eabcbbcca533c008ef2ccb795c6fe842`.
- Commit `2d75a8b2eabcbbcca533c008ef2ccb795c6fe842` corrected the MCP E2E direct-`/hero/` route assumption and closes the MCP facility before auth handoff.
- Exact-head gates: Governance `35571627232` PASS; Full-System `35571627248` PASS; Security `35571627166` PASS; Browser `35571627174` PASS.
- Browser proof covers guest discovery, four-capability inventory, dynamic target-owned branch preview, auth handoff, MCP facility close, and auth-panel visibility.
- This is representative frontend/browser proof only. MCP provider credentials, authoritative lifecycle, entitlement, authorization, health, durable equip state, and execution remain external/backend-owned.
- Next representative contract: Workspace capability surface under Issue #400.


### 2026-09-21 exact-head Workspace proof
- Workspace HQ representative contract is implemented in workspace-capability.js with a WORKSPACE_CENTER semantic target, dynamic Workspace-owned branch identity, and presentation-only capability intent/readiness semantics.
- Live Hero Workspace facility is delivered through synchronized source/public modules and is reachable from the world menu without reviving /spatial/.
- Exact-head Browser verification on 026a0fcfd8ac41a43ffd8988dad5b160cf972edb passed the Workspace flow: guest discovery, capability inventory, dynamic project-scoped branch preview, workspace-center camera focus, guest action lock, and authentication handoff.
- Workspace proof remains representative frontend/browser evidence only. Firestore Workspace state, authorization, entitlement, scheduler eligibility, and execution remain authoritative outside the facility.
- Next representative #400 contract: Team / Agents role assignment and Seat assignment presentation.


### 2026-09-21 exact-head Team / Agents proof
- Team / Agents representative contract is implemented as a responsibility presentation boundary with Agent identity, role vocabulary, Seat assignment preview, dynamic branch identity, readiness dimensions, and presentation-only assignment intent.
- Exact-head Browser verification on `cd4a06a8a6706cf433e2f6a2c01c5456924af406` passed the Team / Agents flow. The preceding `0b182c4c...` failure was solely a regex-literal `+` matcher defect in the E2E test; production UI text was already correct.
- Team / Agents proof remains representative frontend/browser evidence only. Durable Agent state, assignment persistence, authorization, entitlement, scheduler eligibility, and execution remain backend/runtime-owned.
- Next representative #400 contract: Marketplace / Commerce entitlement-gated feature.

### 2026-09-22 R1/R2 browser regression repair

- The exact-head Browser artifact for `82a267306a81bc5c8072e553d7399e6defa47488` was inspected rather than inferred from timeout symptoms.
- The first renderer/runtime exception was `ReferenceError: articulation is not defined` in `hero-r1-backend-threads.js` during the canonical `drawBackendDisplayThreads()` path. That exception aborted the renderer frame before downstream browser-visible dataset writes, explaining the clustered contribution, material, Seat-1, and machine-preview failures.
- Commit `b2957c4430ac66d970ab0db695bc04b3f90eed4c` restores the missing local articulation value in the draw pass, synchronizes the canonical source/public pair, and adds an execution-level regression test that invokes the draw function rather than only checking source structure.
- Exact-head validation on `b2957c4430ac66d970ab0db695bc04b3f90eed4c`: Governance PASS, Full-System PASS, Security PASS, Canonical Browser PASS. Browser also passed the committed machine-spatial parity check before Playwright execution.
- This closes the observed R1/R2 render-loop regression. It does not close final visual acceptance, production Firebase deployment, production Firestore evidence, real-provider execution/continuation, human acceptance, or merge authorization.

### 2026-09-22 production Seat diagnostic gate hardening

- The live production Seat diagnostic remains workflow-dispatch-only and is not auto-triggered.
- Added `tests/firestore-seat-shape-diagnostic.test.mjs` to lock the workflow/script environment mapping, canonical Seat filtering, one-active-connection fail-closed rule, and metadata-only reporting posture.
- The first version of this guard failed because its test assertion contained malformed JavaScript quoting. That was corrected in `48c688f1ed033803002d5f6e594c51d3a255fc0c` without changing the production diagnostic or workflow.
- Exact-head validation on `48c688f1ed033803002d5f6e594c51d3a255fc0c`: Governance PASS, Full-System PASS, Security PASS, Canonical Browser PASS.
- Live Supabase remains unchanged: `teamai-task-execute` is v12 stub runtime, `teamai-task-continuation-request` is v2, `teamai-seat-budget-settings` is v1, and `teamai-seat-budget-runtime` is not deployed. The next authoritative gate is the real Firestore Seat diagnostic itself.

### 2026-09-22 normal task-execution connection authority closure

- Deep review of the repository-to-runtime contract found one authority split: the repository real-provider executor's normal path still read `task.connection` while continuation execution already resolved the active connection from canonical Firestore Seat scope.
- Commit `f3e1b9453cacb41bceaaf8084e6a21ef2e4e7546` removes that normal-path dependency. Task execution now resolves `firestoreFindSeatConnection({ uid, workplaceId, projectId, seatId })`, requires an active Seat-owned connection, requires provider agreement with the authorized Seat, and requires the `execute` capability before loading the Seat provider credential.
- `tests/edge-runtime-contract.test.mjs` now guards this authority boundary and explicitly rejects `task.connection` as the normal execution authority.
- This is repository-side hardening only. Live Supabase remains on `teamai-task-execute` v12 stub runtime until the controlled promotion gate is reached.

- The same review identified a second authority split and failure-state gap. Normal execution now resolves the canonical active Seat-owned connection, matching continuation execution. A provider result that omits normalized `termination` is now durably recorded as `PROVIDER_TERMINATION_INVALID`, the task is failed, and continuation requests are failed rather than left running.
- Firestore index review initially proposed a manual `connections(seatId,status)` index, but current Firebase documentation confirms compound equality queries can use index merging. That redundant index was removed. Only the `execution-results` `seatId ASC, recordedAt DESC` manual index remains required for the current ordered read model.
- The manual Firestore index workflow now performs deployment followed by `firebase firestore:indexes` readback and verifies required repository indexes without deleting unrelated historical/live indexes.

### 2026-09-22 R1/R2 runtime acceptance contract

- Added `tests/e2e/hero-r1-r2-articulation.spec.ts` to exercise the canonical `/hero/` renderer rather than only the pure articulation model.
- The browser contract verifies closed-state `STOWED` articulation, the fully opened 10-Seat `LINKED` state, R1/R2 articulation values, R1/R2 catalog counts, and strict R0 < R1 < R2 < R3 radial ordering.
- Reduced-motion opening is included so the semantic articulation contract is proven under the non-animated accessibility path as well.
- Exact-head validation on `e309f8e7ea61c60f241d1127c8ca606720fc2d3f`: Governance PASS, Full-System PASS, Security PASS, Canonical Browser PASS.
- This establishes runtime/browser evidence for the R1/R2 articulation interface. It does not constitute final visual acceptance or production delivery evidence.

### 2026-09-22 cross-stack convergence reconstruction

- Reconstructed #398 as the sole cross-stack execution vehicle for Issue #396, incorporating spatial renderer ownership, Firestore Seat identity/budget, trusted Edge execution, continuation, #400 frontend contracts, delivery, evidence, and promotion boundaries.
- Current structural fixes on this branch include a neutral `machine-subject.js` geometry owner, Node/Edge canonical Seat-discovery convergence, a maximum-density ring-separation regression contract, and explicit test coverage for the new ownership seam.
- `backend/BACKEND_LIVE_SERVICE_STATUS.md` is now reconciled to the post-2026-09-12 active Edge inventory instead of claiming eight active functions while listing continuation-request v2.
- The current blockers are production evidence and final acceptance boundaries, not permission to invent live state. Real Firestore/Edge/provider work remains gated on the protected diagnostic and governed deployment sequence.

## Canonical authority path

Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable Skill(s) → owning Issue → PR → implementation → verification/evidence

## Current truth

- Product_Law/PRODUCT_LAW.md is the single Product Law.
- Product_Law/WIRING.md owns development-field routing only.
- Masterplan/MASTERPLAN.md is the ordered checklist.
- Masterplan/NEXT_SLICES.md contains exactly one Current Slice.
- POLICY.md owns ORUCAVEAM and execution discipline.
- docs/SKILL_WIRING.md owns Skill routing.
- AI_ASSISTANT_READ_ME.md owns volatile session/recovery state.
- PRODUCT-KNOWLEDGE.md owns durable validated concepts.
- docs/archive/ is historical only.
- Active HandOver.md, active Endorsement.md, OBSOLETE_FILES.md, and docs/skills/ are forbidden.

### 2026-09-21 active 029 migration

PR #398 is the active Draft implementation PR for Issue #396 on `frontend/029-machine-world-convergence`. It is the exact-head lineage of retired PR #397, starting from head `23a83ae166f0983b598910d6168b1203ebf600096`. The spatial architecture now separates the Hero controller from `frontend/spatial/machine-world-renderer.js`, which owns production WebGL scene construction; `public/machine-world-renderer.js` is the synchronized browser copy. PR #397 is closed and must not become a parallel execution vehicle.

## Current replacement-branch control plane

- Issue #389 is completed; its reconstruction is merged into main.
- #394/#393 remain closure-pending governance lineage and historical control-plane evidence; they do not own the 029 product implementation.
- Automatic advisory review is five credential-isolated openrouter/free slots with a nominal 2-second launch stagger and an 8-second maximum spread.
- Advisory slot/credential identity is defined by `.github/teamai/authority-manifest.yml`; this session record does not duplicate secret aliases.
- Credential aliases identify only which secret a slot receives. They do not identify a reviewer, model, or provider.
- Actual model/provider is runtime evidence from OpenRouter.
- Earlier PR #395 advisory evidence (historical exact head c2a6f11a5a2bc31fa7212ab74e66454c0a4e3a06): retained as immutable historical evidence only.
- Structured terminal slot artifacts are orchestration state. PR comments are evidence/publication only. A terminal provider failure remains visible in the slot artifact and is not converted into a false provider-success claim.
- The automatic sequence is bound to the exact PR head. A later corrected head may establish a new sequence; the same exact head may not consume another provider sequence.
- Execution completion is not advisory approval, human acceptance, merge authorization, or release.

## Authority and delivery boundaries

- GitHub is engineering/source truth.
- Firebase Auth owns identity; Firestore (default) owns durable TeamAi application state; Supabase Edge is the trusted server execution/webhook boundary; PayPal is external payment-provider event authority.
- Firebase Hosting is current product delivery authority.
- GitHub Pages is the canonical public validation surface at https://RbrtMrlsIII.github.io/TeamAi/.
- Vercel remains non-authoritative and paused.

## Product boundary while reconstruction is active

- Preserve current machine candidate and semantic topology work already on main.
- PR #398 owns the current 029 spatial convergence implementation described by Issue #396.
- No Product Law, entitlement, authorization, scheduler, durable-state, acceptance, or merge authority is created by the advisory workflow or renderer.

## Validation lifecycle guide

| PR state | Active validation | Promotion/review gate |
|---|---|---|
| Draft | Governance Integrity, evidence consistency, agent validation, Full-System, Security, and applicable Browser/Runtime checks continue against the exact PR head. | review-readiness may be skipped by lifecycle design. A skipped job is not a pass. |
| Ready for review | Substantive exact-head validation remains current. | review-readiness evaluates review and authorization conditions and remains pending while independent approval is absent. |
| Merge candidate | Required checks and evidence remain current on the exact head. | Normal governed GitHub review/merge path only; no auto-merge. |

A downstream skipped job is never evidence that the underlying requirement passed. Recovery must inspect the controlling upstream job and the exact current head.

## Validation-change guide

Before modifying a test, validator, browser assertion, workflow gate, Skill, acceptance criterion, fixture, or evidence requirement because an authorized change conflicts with it, record:

```
VALIDATION CHANGE WARNING
Protected old invariant:
Authorized new rule:
Why the old invariant is obsolete/retained:
Replacement invariant:
Implementation impact:
Validation impact:
Evidence/browser impact:
Residual uncertainty:
```

Then:

`warning → authority reconciliation → implementation → replacement validation → verification → evidence → durable PR/Issue record → session update`

Never weaken validation merely to make CI green.

## Current validation-change record

PR #398 is replacing the retired monolithic Hero renderer with a canonical machine-world renderer while keeping the Hero controller as the semantic/input boundary. The migration preserves exact-head evidence rules and adapts validation toward owner-level behavioral contracts rather than stale source-shape assertions. The first exact-head Browser failure on the migrated renderer was a duplicate `branchAmounts` declaration in the canonical renderer. Follow-on exact-head evidence exposed invalid WebGL `uniform3f` calls against a `vec4` uniform and a line-render pass that continued using the solid program after a material draw. Those were repaired at the canonical renderer boundary. Controller trace persistence/zoom-baseline semantics and standalone machine-core Seat focus injection were also repaired without creating a second renderer. A source-owned feature registry and shared frontend state grammar are now part of the #400 foundation.

## Evidence rules

specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted

A passing test proves only the contract it exercises. Never weaken a validator to obtain green CI. Historical execution records remain immutable evidence for their original heads.

## Handover

There is no live `HandOver.md`. Future sessions start from this Session Snapshot, then verify live GitHub branch/PR/Issue state.

## Endorsement

There is no active `Endorsement.md`. Acceptance decisions remain scope-bound to the applicable Issue/PR/evidence and are never inferred from a green workflow.

## Machine boundary

The merged machine candidate remains non-production. Semantic identity, payload meaning, topology ownership, adaptive geometry, transition state, camera relationship, and rendering remain distinct concerns. Renderer output cannot become backend, identity, entitlement, scheduler, acceptance, or merge authority.

## CURRENT ISSUE OWNERSHIP

- #396 = active 029 spatial machine convergence execution guide
- #278 = 029 canonical product-experience execution ledger
- #360 = 029 machine-candidate/runtime/browser/provenance slice
- #392 = AI Seat budget, usage, handoff, shared context, and cooperation product feature
- #83 = frontend spatial visual/material track
- #284 = backend durable/runtime ledger
- #204 = Conn-3 GitHub OAuth/bind integration
- #133 = enduring validation/promotion governance contract
- #394/#393 = governance baseline/advisory normalization lineage, closure-pending in PR #395

Historical Issues are evidence, not active routing.


### 2026-09-21 #392 budget foundation

- src/backend/seat-turn-budget.ts is now the canonical server-side accounting engine for the #392 foundation. It keeps total turn budget, output allocation, reasoning allocation, context/input policy, protected handoff reserve, warning threshold, configured/effective values, usage, remaining capacity, and completion/handoff display state distinct.
- TaskExecutionService now accepts an optional backend-owned Seat budget, constrains the provider request maxOutputTokens, and returns server-computed budget accounting alongside the existing execution result.
- Runtime tests cover request capping, actual usage accounting, handoff prediction, and continuation-aware exhaustion display.
- This is foundation only, not #392 completion. The live teamai-task-execute Edge Function remains stub-edge-runtime; durable Seat budget config/usage authority, provider termination/completion evidence, durable handoff checkpoints, and live continuation enforcement remain open.
- Do not replace these gaps with client counters or a second Edge-specific budget authority.
### 2026-09-21 exact-head Storage item-inventory proof

- Storage is implemented as a presentation/read-model-only facility with explicit readiness dimensions for authentication, inventory knowledge, authorization, entitlement, and health.
- The facility reveals no inventory metadata until the read-model reaches `READY`, preventing guest or blocked contexts from rendering supplied item data.
- Storage item metadata is normalized without content/body payloads. Item branches are dynamic and item-owned: `BRANCH-STORAGE::item/<item>/workspace/<workspace>/project/<project>/inventory`.
- The browser surface contains no file input, upload endpoint, binary-transfer operation, or content-write method. It exposes only an inspection intent, which is presentation-only.
- Exact-head verification on `d25177ea3f7300b08245d6e1e3fe1cec749f3c23`: Node test suite reported 59 passing tests; Canonical Browser reported 58 passing Playwright tests with 4 historical skips. Governance, Full-System, Security, and Browser runs all passed.
- Independent live backend check: the connected Supabase project's `storage.buckets` query returned no buckets. No live content inventory was therefore fabricated or inferred from Firestore task/event/evidence data.
- The absence of a live Storage content bucket/read endpoint is an explicit backend seam for a future governed slice, not a defect to be hidden inside frontend presentation.


### 2026-09-21 exact-head Marketplace / Commerce proof

- Marketplace is implemented as a presentation/read-model facility exposing exactly two commercial modules: Team Quality (five paid tiers above the baseline) and Team Population (nine paid tiers mapping persistent Seat 2 through Seat 10).
- Team Population lower tiers remain locked during an active higher tier; higher-tier selection is permitted with an inline replacement warning that the lower tier effect disappears when the higher tier takes effect.
- TeamAi entitlement and provider entitlement remain separate read-model facts. Commerce success is backend-defined as completed aggregate plus active entitlement sourced from the verified commerce event.
- TeamAi does not collect or store card credentials. The facility exposes only an authorized external hosted billing link and keeps the card-entry boundary outside the browser.
- Exact-head verification on `7b61c3c725b242288749324ad73d2eb752ded3b1`: Governance, Full-System, Security, and Canonical Browser all passed. Browser ran 60 tests, with 3 Marketplace scenarios passing and 4 historical tests skipped by existing lifecycle rules.
- The earlier Marketplace browser failures were test-contract defects: stale world-entry setup, card-level text assertion targeting the button rather than its tier card, and dynamic billing-state assertion omitting the no-card-storage guarantee. Each was corrected without weakening product validation.
- The live Supabase commerce intent/webhook functions remain external runtime authorities. Product-tier binding into the live edge intent is intentionally deferred until a shared authoritative catalog seam can be introduced without duplicating product authority.


### 2026-09-22 audit hardening
- The last audited implementation head is `a887afb68b5449b13e6dbe54f51bffa7f3b4bcb5`. The live branch head is authoritative and must be re-read before relying on this snapshot. That audited head includes the hardened production Firestore Seat diagnostic, which fails closed on missing/inactive/unauthorized/unentitled/unbound Seats, invalid budget shape, ambiguous or incompatible active Seat connections, and missing execute capability.
- The diagnostic script is now syntax-checked by Full-System verification; the CodeQL-reported test URL matcher was tightened to exact hostname/path matching.

### 2026-09-22 #392 Seat runtime + durable continuation convergence
- Canonical team-nested Firestore Seat resolution remains the sole active Seat authority across task execution, durable Seat budget persistence, scheduler Seat enumeration, provider binding, provider credential lookup, and Seat connection-test persistence. Legacy project-level `/seats` records are ignored; ambiguous canonical Seat IDs fail closed.
- Provider binding and connection persistence do not create missing Seat documents implicitly. Provider-key clearing remains possible with `clear:true` without an API key.
- The repository now carries the next bounded continuation chain: incomplete provider result → durable handoff checkpoint → explicit continuation request → atomic task transition to `waiting_for_continuation` plus `CONTINUE_WAIT` durable event → trusted user-authenticated Edge continuation-request boundary.
- Continuation requests preserve task/project/checkpoint/request identity, are idempotent on exact retry, and conflict on relation/instruction changes. The continuation boundary does not invoke a provider and does not treat a request as implicit execution approval.
- The real Edge task-execute source now persists the handoff checkpoint before its durable `handoff_required` result and references that checkpoint in task/result evidence.
- Live Supabase currently reports `teamai-task-execute` v12, `teamai-seat-provider-bind` v8, `teamai-task-continuation-request` v2, and `teamai-seat-budget-settings` v1. The new `teamai-seat-budget-runtime` Edge source is repository-complete but held from deployment until its Firestore collection-group index is deployed.
- Live production Firestore Seat document shape remains unverified from the real dataset. Do not deploy the new runtime path until the real authorized Coder Seat shape and connection relationship are directly inspected.
- Remaining #392 execution gap: continuation request → authorized fresh-budgeted continuation turn → provider execution → truthful final completion. Gate 4 Firebase emulator proof remains parked/unproven.

### 2026-09-22 #392 Seat Budget capability expansion
- Seat Budget Settings is now an actual configurable product path: browser editor → authenticated runtime client → trusted `teamai-seat-budget-settings` Edge boundary → canonical Seat transaction → readback.
- The live `teamai-seat-budget-settings` function is v1 and was source-matched after deployment. An unauthenticated browser-origin smoke returns HTTP 401 with `missing_firebase_id_token`.
- Seat Budget durable runtime read model is repository-complete. `teamai-seat-budget-runtime` resolves the active/authorized canonical Seat, reads the latest Seat-owned durable `execution-results` record, and exposes usage/accounting provenance without returning provider output.
- Legacy v12 stub execution is handled truthfully: raw usage may be shown as durable evidence, while remaining/usable generation capacity stays unknown until server-side budget accounting exists.
- Firestore `execution-results` collection-group index `seatId ASC, recordedAt DESC` is now checked in and has an indexes-only manual deployment workflow. Live runtime-read-model promotion is blocked until that index exists in production.
- R0 workspace receiving choreography is implemented and independently verified as a renderer-owned presentation capability from the Seat connection route into WORKSPACE_CENTER.
