# Governance Validation Semantics

This is a validation reference, not a project chronology or checklist.

`governance_drift` is PASS only when governance-mode validation succeeds.
`active_index_freshness` is PASS only when the same governance-mode run completes its freshness check.
`historical_integrity` is PASS only when the same governance-mode run completes its historical-integrity check.
`evidence_consistency` is PASS only when evidence-mode validation succeeds.

The generated agent-validation packet must copy these states from real validator output and must not assign PASS literals to unverified dimensions.
