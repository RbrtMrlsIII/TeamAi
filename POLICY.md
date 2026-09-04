# TeamAi — Execution Policy

**Status:** BASELINE POLICY / PENDING ENDORSEMENT  
**Purpose:** Define the execution discipline that turns Product Law and Masterplan intent into safe, permission-aware, skill-directed, efficiently verified work. This policy does not redefine product meaning; `PRODUCT_LAW.md` remains the product authority.

## 1. Authority stack

`PRODUCT_LAW.md` defines what TeamAi must mean and do.

`MASTERPLAN.md` defines what is being executed, in what sequence, and with what checklist/gates.

`POLICY.md` defines how execution is disciplined and how ORUCAVEAM is applied.

`skills/**/SKILL.md` provide direct operational procedures for bounded work classes. Skills do not grant authority.

`PRODUCT-KNOWLEDGE.md` retains validated, distilled lessons and anti-patterns.

`docs/project-guide/HandOver.md` preserves the durable continuation boundary.

`docs/project-guide/Endorsement.md` records authorized completion and learning acceptance.

`AI_ASSISTANT_READ_ME.md` carries practical agent memory and recovery guidance without becoming a second product law.

`docs/SKILL_WIRING.md` is the navigational map connecting canonical concepts, checklist items, ORUCAVEAM letters, field skills, tools, and verification. It is not a second authority.

## 2. ORUCAVEAM execution discipline

**ORUCAVEAM is the single execution-discipline framework.** It extends the existing ORUCAVEA execution discipline by adding one dimension only: **M — Minimalistic Efficiency / Resource Use**.

The letters are execution checkpoints, not competing authorities and not separate lifecycles:

- **O — Objective:** What exact outcome is being pursued?
- **R — Restrictions:** What must not be changed, bypassed, inferred, exposed, or allowed outside scope?
- **U — User Authority:** What user instruction, approval, or previously authorized bounded operation permits this action?
- **C — Canonical Authority:** Which Product Law concept, document, service, datastore, or external authority owns the meaning/state involved?
- **A — Action:** What is the smallest canonical operation that advances the objective within the authorized scope?
- **V — Verification:** What evidence will prove the claimed scope actually worked?
- **E — Efficiency:** What execution approach avoids unnecessary work while preserving correctness and required verification?
- **A — Audit:** What trace, state, paths, decisions, and evidence must remain so another agent can reproduce or review the action?
- **M — Minimalistic Efficiency / Resource Use:** What is the minimum sufficient set of authoritative tool/resource operations, reads, writes, builds, deployments, browser runs, external calls, and context transfers needed to complete and prove the action?

The second **A** is **Audit**. The final **M** is an addition to the existing ORUCAVEA discipline; it does not create a second ORUCAVEA framework.

Every ORUCAVEAM letter must resolve through `docs/SKILL_WIRING.md` to one or more direct operational skills. Those cross-cutting execution skills may be combined with field/domain skills such as backend, commerce, web, engineering, packaging, or verification skills.

The effective execution path is:

`canonical concept → Masterplan checklist → ORUCAVEAM execution skills + field/domain skills → tool/system → verification → evidence`

## 3. Permission to proceed

Permission to proceed is explicit in one of these forms:

1. The user directly authorizes the bounded action.
2. A previously approved Masterplan item explicitly covers the action and no new protected boundary is crossed.
3. A policy-defined routine operation is permitted and remains within its recorded scope.

A skill cannot create permission that does not otherwise exist.

When a proposed action would change Product Law, protected canonical roots, destructive history, security/authorization boundaries, entitlements, or other high-impact architecture, stop for the required approval/reconciliation gate.

Permission must be resolved before action. An unclear or conflicting authorization state is a stop condition, not an invitation to improvise.

## 4. Canonical-change reconciliation

Before editing an existing canonical document or protected concept:

`read existing document → locate related canonical idea → understand nearby logic → inspect dependencies/consumers → resolve applicable ORUCAVEAM skills → check field/domain skills → identify discrepancies → warn user when the change conflicts → make the smallest coherent edit → verify downstream wiring`

Do not append a duplicate rule merely because a new conversation repeated an existing idea.

When a user changes or adds a feature, the agent must first reconcile the request against existing Product Law rather than creating a parallel statement. A discrepancy that could affect an existing authority, contract, permission, entitlement, state model, or architecture boundary must be surfaced to the user before proceeding.

## 5. Checklist-to-skill rule

Every executable Masterplan checklist item must identify:

- the governing canonical Product Law concept;
- the applicable ORUCAVEAM letter(s);
- the applicable field/domain skill(s);
- the applicable tool/system skill(s), when needed; and
- the verification/evidence path.

These relationships are maintained through `docs/SKILL_WIRING.md`.

When a new checklist item is introduced:

`checklist item → canonical concept → field/domain → ORUCAVEAM letters → existing skill lookup → skill sufficient? → wire or update/create skill → verify skill → execute → record evidence`

A missing skill is a planning/execution gap, not permission to invent an undocumented ad-hoc procedure.

A checklist is not considered fully wired when it merely names a domain folder. It must resolve to a concrete skill path or explicitly state `No skill required` with the reason.

## 6. Skill design and growth

A TeamAi skill is a direct operational instruction for a bounded recurring work class. It should be concise, action-oriented, and traceable to its governing concept.

Minimum skill contract:

`WHEN TO USE → INPUT → AUTHORITY → ACTION → DO NOT → PASS → EVIDENCE → SEE ALSO`

`SEE ALSO` must point to real repository paths, governing Product Law/Masterplan sections, or deeper technical contracts.

Skills may be small and composable. A single checklist item may use multiple skills: general ORUCAVEAM execution skills plus one or more field/domain skills.

Create or expand a skill when a real recurring execution pattern needs direct reusable instructions. Do not create taxonomy-only or empty skills merely for naming completeness.

## 7. End-to-end wiring rule

Every executable canonical idea must be traceable end-to-end:

`Product Law concept → Masterplan item → Policy/ORUCAVEAM → skill path(s) → tool/system → verification method → evidence → handover/endorsement → Product Knowledge when learned`

A documentation reference such as `see more in ...` is a navigation aid and must point to the actual canonical path. Broken, stale, or ambiguous references are wiring defects.

## 8. Minimalistic efficiency and resource use

The **M** dimension applies to all tool/resource classes. Minimalistic use does not mean skipping necessary verification, reducing correctness, or replacing an authoritative system with a cheaper non-authoritative system.

Prefer:

- targeted authoritative reads instead of broad duplicate reads;
- the minimum fields/documents needed for a decision or verification;
- one coherent implementation change instead of fragmented churn;
- deterministic local/CI verification before expensive hosted/browser checks where appropriate;
- one deliberate deployment when deployment evidence is actually needed;
- bounded context packets instead of unnecessary transcript duplication;
- idempotent writes and safe retries rather than duplicate durable state;
- read-back confirmation for important authoritative writes;
- reuse of already established authoritative evidence when it still covers the same pinned scope.

Examples of M-aware behavior include targeted Firebase/Firestore reads and writes, bounded repository reads, deliberate Vercel/browser use, selective test execution, and avoiding repeated external calls when existing evidence already proves the required scope.

Never interpret M as a quota-gaming rule. Required reads, writes, tests, deployments, browser checks, evidence capture, and recovery actions remain mandatory when needed to establish trust.

## 9. Connected web/deployment boundary

Vercel is a controlled web development, preview, and browser-verification surface. It is not the TeamAi source authority, durable application-state authority, trusted backend authority, commerce authority, scheduler authority, or architecture acceptance authority.

The disciplined path is:

`coherent implementation → intended deployment → browser verification when useful → evidence`

Do not assume `1 PR = 1 deployment` or `1 merge = 1 deployment`. The actual trigger path depends on the configured Vercel project and deployment mechanism.

## 10. Browser verification boundary

Playwright is the deterministic browser-verification method when real browser behavior is required. A browser test proves only the routes, states, permissions, and flows actually exercised.

A browser screenshot is not proof of backend persistence, authorization, payment success, or durable completion.

Generated screenshots/capture images are not canonical Product Knowledge evidence.

## 11. Learning / teach-back rule

When an AI Development Team agent discovers a better, safer, clearer, more accurate, or more efficient method:

`agent discovery → execution evidence → HandOver learning note → Endorsement decision → update appropriate skill / AI_ASSISTANT_READ_ME / PRODUCT-KNOWLEDGE → ToolKit candidate if generalized`

An agent may teach a procedure, but the teaching is not automatically law. Endorsement confirms that the lesson is accepted for the intended scope.

A new or improved skill must retain its relationship to the governing canonical idea and applicable ORUCAVEAM letter(s).

## 12. Knowledge boundary

`planned ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ generalized`

`PRODUCT-KNOWLEDGE.md` contains validated, distilled lessons and evidence-backed anti-patterns, not raw logs, screenshots, or guesses.

ToolKit receives only lessons that TeamAi evidence shows can generalize beyond the TeamAi-specific context.

## 13. Handover / endorsement boundary

A completed execution does not end at the code change. It ends with:

`implementation → verification → learning capture → handover → endorsement → advance`

Handover preserves current state, evidence, learning, limitations, and next authorized action. Endorsement confirms the claimed completion/learning scope. Neither can substitute for missing implementation, permission, or evidence.

## 14. Conflict behavior

When two active sources conflict:

`STOP → identify authority levels → preserve the conflict → determine whether a canonical change is required → obtain approval → reconcile → re-verify`

Do not use recency, convenience, deployment success, or tool output alone as a reason to override Product Law.

## 15. Authority and wiring protection

The execution discipline is not a second Product Law. The skill library is not a second policy. `docs/SKILL_WIRING.md` is not a second authority. Handover and endorsement do not become product authority. ToolKit does not become TeamAi authority.

The purpose of the structure is to keep canonical documents clean while making execution instructions explicit, discoverable, composable, and recoverable by future agents.
