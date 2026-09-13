# Governance Validation Semantics

This document records the semantics of the repository's existing governance validator. It is a validation reference, not a project chronology or checklist.

## Agent-validation dimensions

`governance_drift` is PASS only when the active-index governance validator completes its governance mode successfully.

`active_index_freshness` is PASS only after the same governance-mode execution completes `assertFresh` successfully. It is not an independent claim that a new check ran unless the validator explicitly performs that check.

`historical_integrity` is PASS only after the same governance-mode execution completes `assertHistorical` successfully. Historical evidence is protected from mutation according to the validator's configured historical roots.

`evidence_consistency` is PASS only after evidence-mode validation completes successfully.

The generated `.validation/teamai-validation.json` packet must copy these states from the validator output. It must never assign PASS literals to dimensions that were not produced by the validator.

This document intentionally does not define a new project chronology, acceptance gate, or parallel checklist.
