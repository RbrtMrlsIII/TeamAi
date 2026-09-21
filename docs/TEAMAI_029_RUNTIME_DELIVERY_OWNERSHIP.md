# TeamAi 029 — Hero Runtime Delivery Ownership

**Status:** active hardening record · no 029-released claim

## Current boundary

The Hero browser runtime must load its base source from the TeamAi repository/package being served to the user. Runtime source must not depend on `raw.githubusercontent.com`, a moving GitHub branch, or an unrelated remote commit for ordinary operation.

`public/hero-flex.js` is the runtime entry artifact. `public/_flex_src/hero-flex.base.js` is the preserved repository-owned controller source used to assemble that artifact. The compatibility assembly script copies the base into the runtime entry and proves byte-for-byte parity. The former flex patch engine is retired from this path.

## Why this matters

A remote source fetched at page load makes the product runtime depend on an external repository snapshot and can diverge from the commit being tested or deployed. Exact-string runtime patching is also fragile because an upstream formatting change can prevent a replacement from applying.

## Current migration

- Repository-owned base source is vendored from the exact historical pre-loader blob used by the existing Hero assembly.
- `scripts/sync-hero-flex-runtime.mjs` now copies the repository-owned base into `public/hero-flex.js` and proves byte-for-byte parity.
- The stable assembly command is deterministic, network-free, and keeps the runtime artifact synchronized with the repository-owned base source.
- A static regression test forbids `raw.githubusercontent.com` in the runtime entry.
- The browser/build path must be validated from the repository-owned artifact, not from a remote source.

## Current implementation reconciliation

The previous wording described hero-flex.js as a runtime loader. That is no longer the implementation model.

The current model is:

repository-owned base controller source → deterministic local assembly → committed runtime artifact → browser execution.

The runtime artifact and preserved base are intentionally byte-identical today. The base remains the source-maintenance location, while hero-flex.js remains the delivery entry consumed by the page and by existing verification.

This keeps the runtime repository-owned without introducing a second live loader layer.

## Remaining cleanup

The former mutation scripts remain under their historical filenames for compatibility, but they are now verification-only wrappers and no longer rewrite hero-flex.js. Their non-mutating behavior is covered by a regression test.

## Product/governance boundary

This hardening changes source delivery ownership only. It does not change Firebase identity, Firestore authority, scheduler authority, entitlement, provider execution, or Product Law.

**Rule:** repository-owned source → deterministic assembly → tested artifact → deployed artifact. The browser must not source the live product from GitHub Raw.
