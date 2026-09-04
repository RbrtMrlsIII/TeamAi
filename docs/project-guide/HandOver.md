# TeamAi Project Guide — HandOver

**Status:** CANONICAL PROCEDURE / BASELINE

The handover is the durable continuation boundary between one execution and the next. It belongs to the TeamAi target project and carries both state and accepted learning.

## 1. Handover must answer five things

### What is authoritative now?

Identify the current Product Law, Masterplan state, active phase, Policy/ORUCAVEAM discipline, applicable ORUCAVEAM letter skills, field/domain skills, domain contracts, and authoritative service roots.

### What was actually changed?

List the source/document paths changed in the canonical tree. Distinguish changed code from documentation, skill, and governance changes. Identify the governing Masterplan checklist and skill paths where applicable.

### What was actually proven?

Name the verification evidence, environment, test scope, and limitations. Never infer live/hosted proof from source presence or deployment presence alone.

### What was learned or taught?

Record any evidence-backed improvement, correction, safer procedure, efficiency improvement, or newly clarified rule discovered by the AI Development Team. Identify the affected ORUCAVEAM letter skill, field/domain skill, operational memory, or Product Knowledge entry and whether the lesson is merely observed, accepted for TeamAi, or proposed for ToolKit generalization.

### What remains open and what is next?

Record unresolved questions, parked gates, environment limitations, provider requirements, approval needs, known contradictions, missing skill wiring, and the next authorized command.

## 2. Required handover chain

`current state → authority map → Masterplan item → ORUCAVEAM/skill routing → changes → evidence → learning → limitations → unresolved questions → next authorized command`

## 3. Planning Team handover

A Planning Team handover should include:

- original user objective;
- current user instruction;
- accumulated meaningful discussion;
- accepted decisions;
- alternatives/pros/cons and disagreements;
- unresolved questions;
- important artifacts/findings/events;
- selected summarizer result;
- user review status;
- proposed implementation/document targets;
- applicable Product Law concepts and prospective Masterplan/skill routing.

The handover must preserve user intent. The latest AI contribution is not allowed to replace the accumulated discussion or the user's authority.

## 4. Working Team handover

A Working Team handover should include:

- approved plan/handoff ID or reference;
- task/dependency state;
- Scheduler decision context;
- AI Seat/connection/capability used;
- applicable ORUCAVEAM letter skills and field/domain skills;
- tool/plugin/MCP action records;
- approvals and authorization state;
- durable results/events/artifacts;
- failures, retries, cancellation, or recovery state;
- verification evidence;
- next eligible work.

## 5. Learning / teach-back handover

When an agent teaches or discovers a better procedure:

`discovery → evidence → scope → affected ORUCAVEAM/field skill or document → endorsement state → next-use instruction`

Do not convert a single successful trick into a generalized rule without validation. TeamAi-specific lessons remain TeamAi knowledge unless later generalized and accepted upstream.

When the learning changes a reusable procedure, update the affected skill rather than burying the procedure in a broad canonical document. When it is practical recovery/agent memory, update `AI_ASSISTANT_READ_ME.md`. When it is an evidence-backed durable lesson, update `PRODUCT-KNOWLEDGE.md` after validation.

## 6. External AI and tool handover

Where AI applications or MCP/tool systems are configured outside TeamAi, record the external dependency and the TeamAi activation boundary separately.

Never hand over an assumption such as “connected” when only a stored connection record exists. Preserve capability-test results, provider compatibility, scope, entitlement, authorization, and health state.

Where tools were used, preserve the relevant M/minimalistic-resource-use decision when it materially explains why operations were limited, reused, or intentionally repeated.

## 7. Full Project ZIP handover gate

A declared **project handover** is incomplete without its required Full Project ZIP when the handover scope calls for the full project state.

The required full-project handover package MUST be produced from a pinned GitHub canonical commit/tree and verified before delivery:

`GitHub pinned tree → deterministic flattened Full Project ZIP → extraction → path equality → byte-for-byte file verification → supported user delivery`

The ZIP must contain the canonical tracked project tree at its pinned revision, with extracted paths exactly matching the tracked paths and extracted file bytes matching the pinned repository bytes. Archive-container metadata/compression bytes may differ; the project files may not.

The delivery record must identify the pinned commit SHA, package filename, package verification result, and the supported delivery target/reference. A handover claiming a full project package without a corresponding verified deliverable MUST fail the handover gate.

This rule applies to the **handover event**, not to every ordinary implementation run. CI may produce a verified ZIP as a derived artifact for engineering evidence; that artifact does not itself mean a user handover occurred.

Generated/runtime artifacts are never restored into the handover package. Screenshots, browser captures, visual-evidence images, temporary diagrams, preview output, build output, dependency trees, coverage/test output, logs, caches, emulator state, editor state, deployment caches, and local secrets are excluded or, when tracked in violation of policy, block packaging until reconciled.

## 8. ZIP/package verification rule

A full-project handover package is current only when it matches the pinned canonical repository tree by paths and file bytes/hashes.

Use the project-package skill and policy:

- `skills/packaging/project-package/SKILL.md`
- `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`

The ZIP remains a derived handover artifact and never becomes a second source authority.

## 9. ToolKit boundary

TeamAi owns TeamAi handover. ToolKit may receive a generalized lesson only after the consuming-project evidence establishes that the lesson generalizes. Team-specific provider choices, pricing, exact model catalogs, or implementation assumptions must not be promoted upstream merely because they appear in a handover.

## SEE ALSO

- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/project-guide/Endorsement.md`
- `skills/governance/learning-handover/SKILL.md`
- `skills/packaging/project-package/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
