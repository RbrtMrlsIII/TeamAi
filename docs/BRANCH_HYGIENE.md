# TeamAi Branch Hygiene

**Status:** OPERATIONAL RECONCILIATION RULE

Historical branches are not current architecture.

Before reusing any non-`main` branch, compare it with current `main` and classify it as merged, superseded, behind, ahead, or divergent.

Branches that are substantially behind or divergent should not be merged as-is. Their useful work must be selectively reconciled against the current canonical tree.

A branch should remain open only when it has a current execution purpose, a traceable Masterplan/maintenance objective, and an identifiable next verification step.

This is a process guard only. It does not delete historical branches or rewrite Git history.
