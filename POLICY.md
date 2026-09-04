# TeamAi — Execution Policy

**Status:** BASELINE POLICY / PENDING ENDORSEMENT
**Purpose:** Define the execution discipline that turns Product Law and Masterplan intent into safe, permission-aware, skill-directed, efficiently verified work. This policy does not redefine product meaning; `PRODUCT_LAW.md` remains the product authority.

## 1. Authority stack

`PRODUCT_LAW.md` defines what TeamAi must mean and do.

`MASTERPLAN.md` defines what is being executed, in what sequence, and with what checklist/gates.

`POLICY.md` defines how the work is governed.

`skills/**/SKILL.md` provide direct operational procedures for bounded work classes. Skills do not grant authority.

`PRODUCT-KNOWLEDGE.md` retains validated, distilled lessons and anti-patterns.

`docs/project-guide/HandOver.md` preserves the durable continuation boundary.

`docs/project-guide/Endorsement.md` records authorized completion and learning acceptance.

`AI_ASSISTANT_READ_ME.md` carries practical agent memory and recovery guidance without becoming a second product law.

`docs/SKILL_WIRING.md` is the navigational map connecting canonical concepts, checklist items, skills, tools, and verification. It is not a second authority.

## 2. O-R-U-C-A-V-E-A lifecycle

The existing lifecycle remains the outer work-state discipline:

`Observe → Record → Understand → Classify → Align → Validate → Endorse → Advance`

Do not replace this lifecycle with another acronym. It answers **where the work is in its disciplined progression**.

## 3. ORUCAVEAM action lens

ORUCAVEAM is the inner execution lens applied while carrying out a task:

- **O — Objective:** What exact outcome is being pursued?
- **R — Restrictions:** What must not be changed, bypassed, inferred, or exposed?
- **U — User Authority:** What user instruction/approval authorizes the action?
- **C — Canonical Authority:** Which existing product/service/document root owns the meaning or state?
- **A — Action:** What is the smallest canonical operation that advances the objective?
- **V — Verification:** What evidence will prove the claimed scope actually worked?
- **E — Efficiency:** What is the smallest sufficient execution that still produces trustworthy evidence?
- **A — Audit:** What trace must be preserved so another agent can reproduce or review the decision?
- **M — Minimalistic Tool/Resource Use:** Use the minimum necessary authoritative tool calls, reads, writes, builds, deployments, browser runs, external requests, and context transfers required to complete and prove the action.

ORUCAVEAM is a governance/execution lens, not a source of product authority.

## 4. Permission to proceed

Permission to proceed is explicit in one of these forms:

1. The user directly authorizes the bounded action.
2. A previously approved Masterplan item explicitly covers the action and no new protected boundary is crossed.
3. A policy-defined routine operation is permitted and remains within its recorded scope.

A skill cannot create permission that does not otherwise exist.

When a proposed action would change Product Law, protected canonical roots, destructive history, security/authorization boundaries, entitlements, or other high-impact architecture, stop for the required approval/reconciliation gate.

## 5. Change reconciliation rule

Before editing an existing canonical document:

`read existing document → locate related canonical idea → understand nearby logic → inspect dependencies/consumers → check applicable skills/anti-patterns → identify discrepancies → warn user when the change conflicts → make the smallest coherent edit`

Do not append a duplicate rule merely because a new conversation repeated an existing idea.

## 6. Checklist-to-skill rule

Every executable Masterplan checklist item must identify its applicable skill path in `docs/SKILL_WIRING.md`, or explicitly record `No skill required` with the reason.

When a new checklist item is introduced:

`checklist item → field/domain → existing skill lookup → skill sufficient? → wire or propose skill change → verify → record`

A missing skill is a planning/execution gap, not permission to improvise a new operating convention silently.

## 7. End-to-end wiring rule

A canonical idea must be traceable end-to-end:

`Product Law concept → Masterplan item → Policy/ORUCAVEAM → skill path → tool/system → verification method → evidence → handover/endorsement → Product Knowledge when learned`

A documentation reference such as `see more in ...` is a navigation aid and must point to the actual canonical path. Broken or ambiguous references are wiring defects.

## 8. Tool and service efficiency

Minimalistic use does not mean skipping necessary verification.

Prefer:

- targeted authoritative reads instead of broad duplicate reads;
- one coherent implementation change instead of fragmented churn;
- deterministic automated verification before expensive hosted/browser checks;
- one deliberate deployment when deployment evidence is actually needed;
- bounded context packets instead of unnecessary transcript duplication;
- idempotent writes and retries that do not create duplicate durable state.

Do not replace an authoritative system with a cheaper but non-authoritative system merely to reduce usage.

## 9. Vercel / deployment boundary

Vercel is a controlled web development, preview, and browser-verification surface. It is not the TeamAi source authority, durable application-state authority, trusted backend authority, commerce authority, scheduler authority, or architecture acceptance authority.

The operating discipline is:

`coherent commit → intended deployment → browser verification when useful → evidence`

Do not add ignored-build rules solely to hide failures or churn. Deployment controls must remain consistent with the active release discipline.

## 10. Browser verification boundary

Playwright is the deterministic browser-verification method when real browser behavior is required. A browser test proves only the routes, states, permissions, and flows actually exercised.

A browser screenshot is not proof of backend persistence, authorization, payment success, or durable completion.

Generated screenshots/capture images are not canonical Product Knowledge evidence.

## 11. Learning / teach-back rule

When an AI agent discovers a better, safer, clearer, more accurate, or more efficient method:

`agent discovery → execution evidence → HandOver learning note → Endorsement decision → update the appropriate skill/AI_ASSISTANT_READ_ME/PRODUCT-KNOWLEDGE → ToolKit candidate if generalized`

An AI may teach a procedure, but the teaching is not automatically law. Endorsement confirms that the lesson is accepted for the intended scope.

## 12. Knowledge boundary

`planned ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ generalized`

Product Knowledge contains validated distilled lessons, not raw logs or guesses.

ToolKit receives only lessons that TeamAi evidence shows can generalize beyond the TeamAi-specific context.

## 13. Handover / endorsement boundary

A completed execution does not end at the code change. It ends with:

`implementation → verification → learning capture → handover → endorsement → advance`

Handover preserves current state and next authorized action. Endorsement confirms the claimed completion/learning scope. Neither can substitute for missing implementation or evidence.

## 14. Conflict behavior

When two active sources conflict:

`STOP → identify authority levels → preserve the conflict → determine whether a canonical change is required → obtain approval → reconcile → re-verify`

Do not use recency, convenience, deployment success, or tool output alone as a reason to override Product Law.
