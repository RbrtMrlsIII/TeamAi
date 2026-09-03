# TeamAi — AI Assistant Read Me

This is the operational recovery entry point for AI participants working on TeamAi.

## Authority order
1. `PRODUCT_LAW.md` — product authority.
2. `MASTERPLAN.md` — chronological execution/planning authority.
3. `POLICY.md` — operating constraints where present.
4. `AI_ASSISTANT_READ_ME.md` — operational recovery and entry point.
5. `docs/` domain contracts and implementation/evidence records.
6. `docs/project-guide/` — project continuation, endorsement, and handover procedures.
7. Applicable skills/guards, implementation, verification, evidence, Product Knowledge, and continuity records.

See `docs/DOCUMENTATION_AND_EXECUTION_DISCIPLINE.md` for document routing and execution discipline.

## Backend-first execution rule
Before implementation begins, the target project's backend authority must be clarified and reconciled with Product Law. ToolKit provides process/knowledge upstream only; it does not define or replace TeamAi backend authority.

## Execution discipline
Use this sequence before a meaningful change:

`inspect authority → inspect applicable skill/guard → inspect existing roots/implementation → classify proposal vs decision vs required change → reconcile conflicts → obtain required approval → implement smallest canonical change → verify → record evidence → update handover/endorsement`

Do not treat ordinary discussion as implementation approval. Do not smuggle canonical/destructive/high-impact changes in as cleanup.

## Gate handover rule
A completed TeamAi gate is not surrendered until the target project produces its handover packet/ZIP in the same execution. The packet belongs to TeamAi. ToolKit is never the owner or handover surface for TeamAi.

## Current gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

The Firebase persistence gate is evidence-backed. Available source/configuration checks must not be converted into an inferred emulator pass, hosted pass, or production pass beyond the environment actually exercised. Record any exercised checks precisely and keep the environment limitation explicit.

`TEAM-EXPERIENCE-029` remains the next product-experience frontier and must not be treated as implemented merely because its planning contracts exist.

## Canonical backend authority
- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current web delivery surface.
- Vercel = non-authoritative browser-integrity verification surface used only for UI development/verification; it is not a TeamAi hosting authority, backend authority, deployment target, or completion authority.
- Supabase Postgres = platform infrastructure only, never TeamAi domain/application state.

## UI Browser Integrity Verification Policy

The canonical policy is `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`.

Vercel browser verification is **opt-in and phase-bound to UI development/verification**. Do not invoke it merely because a commit, pull request, backend change, documentation change, recovery change, or repository event exists.

Allowed uses include browser rendering, interaction/navigation smoke tests, UI integration checks, responsive behavior, and controlled preview/browser verification of the UI surface.

It must not be used as proof of Firestore persistence/rules, Supabase execution, PayPal transaction/webhook behavior, identity, entitlement, permission, scheduler correctness outside the exercised UI, deployment authority, backend-gate completion, or final architecture acceptance.

Routing rule:

`UI-only → Vercel browser verification may run`
`UI + backend → browser evidence may run, but backend evidence remains separate`
`backend-only / Firestore / commerce / docs / recovery → do not invoke Vercel`

Anti-churn rule: never create or refresh Vercel previews simply because GitHub receives a commit. Browser verification should be deliberately invoked at the UI-development/verification boundary. Vercel availability or throttling must not be reframed as TeamAi architecture failure.

A Vercel project, deployment target, domain, or environment must never be inferred from stale comments, historical bot output, screenshots, naming, or memory. Use only a currently authorized and identifiable control surface.

Evidence distinction:

`GitHub/source/tests/backend validation → authoritative engineering evidence`
`Vercel browser integrity → non-authoritative UI verification evidence`

The full boundary is defined in `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`.

## Founder Pulse operating boundary

**Founder Pulse is a read-only product-operations observation layer over GitHub/GitLab Issue flow. It is not an execution authority.**

Founder Pulse is useful after engineering work exists in GitHub because it can inspect the flow of Issues that changed from open to closed and Issues still open at period end, including creation-age buckets, labels, and visible delivery relationships. Its installed skill requires complete Issue populations, explicit transition handling, delivery-link classification, disclosure of inaccessible data, and no repository mutation. fileciteturn46file0

For TeamAi, use Founder Pulse to answer operational questions such as:

`What moved? → What remains? → How old is the remaining work? → What delivery links are visible? → Where is process friction accumulating?`

Treat the result as **management/continuity evidence**, not as Product Law, architecture authority, implementation proof, scheduler authority, deployment control, or authorization to change code.

Founder Pulse must observe the canonical engineering state rather than create a parallel project-state system. A Pulse report may identify a stale issue, bottleneck, missing linkage, or repeated churn pattern; the TeamAi Development Team must still reconcile that observation against Product Law, Masterplan, active contracts, implementation, and verification evidence before changing anything.

Do not use Founder Pulse to rank individuals by productivity. Delivery attribution is evidence about a linked Issue/commit/PR relationship, not a performance score. The Founder Pulse skill explicitly forbids individual productivity ranking and requires read-only operation. fileciteturn46file0

GitLab remains deferred for TeamAi architecture and control-plane work. Founder Pulse may technically support GitLab, but that capability does not change the current TeamAi decision to keep GitLab out of the active architecture until the GitLab basics and intended use are deliberately introduced.

## Frozen Firebase project identity
**The authoritative TeamAi Firebase project is `team-ai-official`.** Never infer or substitute a Firebase project from product naming, screenshots, historical artifacts, remembered context, or a similarly named project. If project identity is ambiguous or conflicting, STOP the affected deployment/verification.

## Current evidence
- Gate 3B/3C/3D: Firebase UID-derived persistence, independent Firestore confirmation, and repeat-call idempotency are evidenced.
- Gate 5B: server-owned PayPal correlation contract is implemented in `src/backend/commerce.ts` and direct source-contract validation passed.
- Gate 5C: implementation and available-environment verification are PASS/CLOSED. The remaining item is authenticated live PayPal transaction/webhook runtime evidence; this is not an unfinished 5C implementation.

Detailed Gate-5B evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

## PayPal boundary for the active gate
The canonical `paypal-webhook` function is the TeamAi production webhook boundary. The previously isolated `teamai-paypal-webhook-v5c` function remains a historical validation artifact and must not become a second production authority. The canonical webhook correlates only authenticated PayPal events to server-owned TeamAi commerce intent and persists durable commerce/entitlement state in Firestore. Browser-provided Firebase UID or payment-success claims are never authoritative.

The live PayPal transaction/webhook test is the remaining external runtime evidence needed for final TEAM-BACKEND-001 completion endorsement. Do not reopen completed Gate-5C implementation work merely because that live test remains unavailable.

## Pre-029 commercial/capability planning boundary
The current 029 planning model distinguishes **Team Quality** from **Tool Quality**. Team Quality concerns future Solo/Team operating mode, persistent AI-seat capacity, basic/advanced model allocation, and team/orchestration capacity. Tool Quality concerns Base TeamAi capabilities plus separately entitled additional tools, plugins, MCP servers, and specialist integrations.

These are planning concepts, not current live subscription entitlements. Exact plan names, prices, model catalogs, seat counts, limits, and tool packs remain open until explicitly approved.

TeamAi subscription authority is separate from external provider entitlement. Do not infer that a TeamAi plan grants a provider subscription, API entitlement, agent runtime, model access, or external tool access that the user does not actually possess.

## AI connection / Seat / capability lifecycle
Do not collapse:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ Seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

A **Connection** is the externally authorized relationship. An **AI Seat** is the configured TeamAi participation identity inside a Workplace/Project. A Seat may reference a Connection; they remain separate concepts.

Use the planning lifecycle:

`Discover → External Setup → Import/Authorize → Capability Test → Bind → Equip → Activate → Run → Observe → Degrade/Suspend → Recover/Revalidate → Rebind/Retire`

Capability state must be reason-bearing:

`available → configured → TeamAi-entitled → provider-compatible → authorized → project-scoped → seat-allowed → healthy → usable`

A remembered connection or a stale green UI state is never sufficient evidence of current usability. Entitlement, authorization, compatibility, scope, workstation, and health changes must block the affected execution path and preserve recovery information.

### Seat capability profile
The Seat-level configuration should distinguish at least:

`provider/application + service/runtime + model/variant + Team role + Team Quality + skills + Base TeamAi capabilities + Tool Quality + workstation/scope + permissions + approvals + limits + compliance + health`

The same external capability may support multiple Seats when permitted because Seat identity is a configured TeamAi runtime/policy instance, not merely a model name.

### External setup versus TeamAi activation
Provider-owned setup remains provider-owned:

`provider account → provider authentication → external application/runtime setup → provider-side terms/scopes`

TeamAi owns its coordination boundary:

`authorized connection → capability test → Workplace/Project binding → Seat configuration → entitlement/policy evaluation → activation`

Never report provider-side setup as complete merely because TeamAi has stored a connection record.

### Equip and Activate
Equip attaches allowed skills, Base TeamAi capabilities, Tool Quality, tools/plugins/MCP, workstation/scope, context visibility, permissions, approvals, and limits.

Activation requires all mandatory conditions for the configured role to pass. Activation is a state transition, not a browser toggle.

### Planning Team versus Working Team
Planning Team = user-controlled deliberation, configured turns, selected participants, selected summarizer, structured handoff, user review.

Working Team = approved plan, task/dependency eligibility, Scheduler selection, AI/tool/human execution, durable results/events, downstream eligibility, review/recovery.

The most recent AI contribution is evidence/input, not authoritative user intent.

## Tool execution boundary

`AI Seat → authorized tool intent → TeamAi policy/authorization → scoped connection/plugin/MCP → invocation → result/artifact → durable event`

Never put provider credentials into ordinary AI conversation content. Tool execution must remain attributable to the requesting Seat and Project.

## User-intent preservation
Every Planning Team turn is grounded in:

`current user instruction + accumulated relevant team discussion + approved project context + current turn instruction`

The immediately previous AI response is only one contribution. It must never override, replace, or silently narrow the user's intent.

Context may be compressed with summaries, references, retrieval, or artifacts, but the compression must preserve materially relevant meaning. The selected final summarizer must be able to synthesize the complete relevant discussion before returning control to the user.

## Detailed planning records
- `docs/DOCUMENTATION_AND_EXECUTION_DISCIPLINE.md`
- `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_CONTEXT_AND_ORCHESTRATION_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `docs/project-guide/AI_ASSISTANT_READ_ME.md`
- `docs/project-guide/Endorsement.md`
- `docs/project-guide/HandOver.md`

## Hard implementation rule
Implementation claims must trace:
`Product Law → Masterplan item → contract/skill → actual implementation → verification evidence → completion/endorsement`.

Documentation, deployment, green unit tests, or endorsement alone never proves implementation completion.

## Recovery rule
Never reconstruct current authority from chat history when the repository provides a canonical document. Read the authority chain first, then the active checkpoint and execution contract. Preserve historical gaps as gaps; do not manufacture evidence.
