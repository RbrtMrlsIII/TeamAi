# TeamAi 029 — Hero Runtime Delivery Ownership

**Status:** active hardening record · no 029-released claim

## Current boundary

The Hero browser runtime must load its base source from the TeamAi repository/package being served to the user. Runtime source must not depend on `raw.githubusercontent.com`, a moving GitHub branch, or an unrelated remote commit for ordinary operation.

`public/hero-flex.js` is the runtime entry. `public/_flex_src/hero-flex.base.js` is the preserved repository-owned base source. The existing flex patch engine remains an implementation mechanism and must be deterministic from repository inputs.

## Why this matters

A remote source fetched at page load makes the product runtime depend on an external repository snapshot and can diverge from the commit being tested or deployed. Exact-string runtime patching is also fragile because an upstream formatting change can prevent a replacement from applying.

## Current migration

- Repository-owned base source is vendored from the exact historical pre-loader blob used by the existing Hero assembly.
- `public/hero-flex.js` now points to `./_flex_src/hero-flex.base.js` for runtime loading.
- The stable `scripts/apply-cam2-tree-follow-flex.mjs` command path now seeds from the local base before invoking the preserved patch engine.
- A static regression test forbids `raw.githubusercontent.com` in the runtime entry.
- The browser/build path must be validated from the repository-owned artifact, not from a remote source.

## Remaining cleanup

The preserved patch engine still contains an emergency remote fallback for historical recovery. That fallback is not a valid runtime/build authority and should be removed in a later narrow hardening change after the repository-owned source path has been fully validated.

## Product/governance boundary

This hardening changes source delivery ownership only. It does not change Firebase identity, Firestore authority, scheduler authority, entitlement, provider execution, or Product Law.

**Rule:** repository-owned source → deterministic assembly → tested artifact → deployed artifact. The browser must not source the live product from GitHub Raw.
