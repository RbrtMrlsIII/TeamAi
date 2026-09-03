# TeamAi Project Guide — HandOver

**Status:** CANONICAL PROCEDURE

The handover is the durable continuation boundary between one execution and the next. It belongs to the TeamAi target project.

## 1. Handover must answer five things

### What is authoritative now?

Identify the current Product Law, Masterplan state, active phase, domain contracts, and authoritative service roots.

### What was actually changed?

List the source/document paths changed in the canonical tree. Distinguish changed code from documentation-only changes.

### What was actually proven?

Name the verification evidence, environment, test scope, and limitations. Never infer live/hosted proof from source presence or deployment presence alone.

### What remains open or blocked?

Record unresolved questions, parked gates, environment limitations, provider requirements, approval needs, and known contradictions that still need reconciliation.

### What is the next authorized action?

State the next phase/gate and its prerequisites. Planning ideas must not be turned into implementation authority merely by being included in a handover.

## 2. Required handover chain

`current state → authority map → changes → evidence → limitations → unresolved questions → next authorized command`

## 3. 029 planning handover

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
- proposed implementation/document targets.

The handover must preserve user intent. The latest AI contribution is not allowed to replace the accumulated discussion or the user's authority.

## 4. Working Team handover

A Working Team handover should include:

- approved plan/handoff ID or reference;
- task/dependency state;
- Scheduler decision context;
- AI Seat/connection/capability used;
- tool/plugin/MCP action records;
- approvals and authorization state;
- durable results/events/artifacts;
- failures, retries, cancellation, or recovery state;
- next eligible work.

## 5. External AI and tool handover

Where AI applications or MCP/tool systems are configured outside TeamAi, record the external dependency and the TeamAi activation boundary separately.

Never hand over an assumption such as “connected” when only a stored connection record exists. Preserve capability-test results, provider compatibility, scope, entitlement, authorization, and health state.

## 6. ZIP/package rule

A target-project ZIP is a handover artifact, not an authority replacement. Its manifest should state whether it is a full snapshot, scoped packet, reduced planning package, or another limited representation. Excluded images or generated artifacts must be explicit.

A ZIP that does not match the current canonical repository must not be described as the current full baseline.

## 7. ToolKit boundary

TeamAi owns TeamAi handover. ToolKit may receive a generalized lesson only after the consuming-project evidence establishes that the lesson generalizes. Team-specific provider choices, pricing, exact model catalogs, or implementation assumptions must not be promoted upstream merely because they appear in a handover.
