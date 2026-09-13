# Governance Validation Semantics

This is a validation reference, not a project chronology or checklist.

## Agent-validation dimensions

`governance_drift` is PASS only when the active-index governance validator completes governance mode successfully.

`active_index_freshness` is PASS only after that governance-mode execution completes its `assertFresh` check successfully.

`historical_integrity` is PASS only after that governance-mode execution completes its `assertHistorical` check successfully.

`evidence_consistency` is PASS only after evidence-mode validation completes successfully.

The generated `.validation/teamai-validation.json` packet must copy these states from real validator output. It must never assign PASS literals to dimensions that were not produced by the validator.
