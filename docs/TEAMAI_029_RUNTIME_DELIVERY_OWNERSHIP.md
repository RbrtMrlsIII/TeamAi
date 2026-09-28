# TeamAi 029 — Hero Runtime Delivery Ownership

**Status:** active hardening record · no 029-released claim

## Current boundary

The Hero browser runtime must load its base source from the TeamAi repository/package being served to the user. Runtime source must not depend on `raw.githubusercontent.com`, a moving GitHub branch, or an unrelated remote commit for ordinary operation.

`public/hero-flex.js` is the runtime entry artifact. `public/_flex_src/hero-flex.base.js` is the repository-owned controller source used to produce that artifact.

There are now two explicit operations:

- **verification:** `node scripts/sync-hero-flex-runtime.mjs --check` reads the committed base and runtime artifact and fails closed on drift; it never writes.
- **assembly:** `node scripts/sync-hero-flex-runtime.mjs --write` intentionally refreshes the runtime artifact from the repository-owned base for build/deploy preparation.

The historical `apply-cam2-tree-follow-flex.mjs` compatibility command is verification-only and delegates to `--check`.

## Why this matters

A remote source fetched at page load makes the product runtime depend on an external repository snapshot and can diverge from the commit being tested or deployed. Exact-string runtime patching is also fragile because an upstream formatting change can prevent a replacement from applying.

A second failure mode is equally important: a **validation-time writer can erase a committed artifact diff before tests observe it**. That produces a green test result against a file state different from the exact commit under review.

The repository previously demonstrated the same class of failure with the Hero Flex assembly path: changes made only to the generated `public/hero-flex.js` were overwritten from `public/_flex_src/hero-flex.base.js` before verification. The canonical fix there was to change the real source. The current hardening closes the remaining verification-time overwrite path.

## Current model

```text
repository-owned base controller source
        │
        ├── --check → compare only → verification
        │
        └── --write → deterministic assembly → committed/deployed artifact → browser
```

The runtime artifact and preserved base are intentionally byte-identical today. The base remains the source-maintenance location, while `hero-flex.js` remains the delivery entry consumed by the page and existing verification.

## Validation invariant

**No verification step may mutate the committed Hero runtime artifact before the behavior under test is observed.**

This means:

- Canonical Browser Verification uses `--check`.
- Historical Hero Flex compatibility tests use the verification-only `apply-cam2-tree-follow-flex.mjs`.
- Full-System tests therefore fail on artifact drift instead of silently repairing it.
- GitHub Pages may use `--write` because that is an explicit build/deploy assembly step, not verification.

## Remaining cleanup

The former mutation engine is retired. Compatibility filenames remain only where historical tests/docs still reference them, and their active behavior is non-mutating.

## Product/governance boundary

This hardening changes source-delivery verification only. It does not change Firebase identity, Firestore authority, scheduler authority, entitlement, provider execution, or Product Law.

**Rule:** repository-owned source → explicit check → explicit assembly when needed → tested/deployed artifact. The browser must not source the live product from GitHub Raw.
