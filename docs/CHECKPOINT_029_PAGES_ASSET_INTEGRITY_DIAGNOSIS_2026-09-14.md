# CHECKPOINT — 029 PAGES ASSET INTEGRITY DIAGNOSIS

**Date:** 2026-09-14
**Ledger:** Issue #278
**Diagnostic record:** Issue #314
**Status:** DIAGNOSIS / DEPLOYMENT-INTEGRITY SLICE
**No 029-release claim.**

## Finding

The public GitHub Pages Hero requested repository-owned ESM modules at:

- `/frontend/spatial/theme-root.js`
- `/frontend/spatial/hero-theme-lighting-adapter.js`

The files exist in `frontend/spatial/`, and the local application server already serves `/frontend/*` from that repository root. The GitHub Pages deployment workflow previously copied only `public/` into `dist/`, so the requested top-level `/frontend/spatial/*` paths were absent from the published artifact and returned 404 in browser smoke.

This is a deployment-artifact omission, not proof that the modules themselves are missing from repository source.

## Reconciliation

The deployment workflow now copies `frontend/spatial/.` into `dist/frontend/spatial/` and fails closed if the two known browser ESM entries are absent.

The browser suite adds direct HTTP checks for both paths and a Hero-page response audit for `/frontend/spatial/*` responses with status >= 400.

## Boundary

The former Command Deck remains retired. Publishing these modules does **not** republish `frontend/spatial/index.html` as a product surface; only the repository-owned browser ESM dependency path required by the current Hero runtime is carried into the Pages artifact.

This checkpoint records diagnosis and verification scope. It does not replace `Masterplan/MASTERPLAN.md`, Issue #278, Product_Law/PRODUCT_LAW.md, Vision, or spatial contracts. Historical references in this checkpoint are informational and do not grant authority.
