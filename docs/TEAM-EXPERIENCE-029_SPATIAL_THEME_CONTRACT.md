# TEAM-EXPERIENCE-029 — Spatial Theme Contract

This document is a detailed implementation companion to the Product Law visual requirement.

## Canonical visual rule

`one theme setting → Dark Spatial Glassmorphism OR Light Spatial Skeuomorphism`

Dark mode uses Dark Spatial Glassmorphism. Light mode uses Light Spatial Skeuomorphism. The setting is one bounded theme state and must not create duplicate product/business state.

## Root strategy

The visual system should be rooted in shared semantic tokens and reusable primitives rather than page-local styling. Candidate roots include theme state, surface/material tokens, elevation/depth, borders, typography, controls, motion, focus, status feedback, responsive layout, and accessibility adaptations.

The semantic behavior of a component must remain equivalent when the visual mode changes. Theme mode may change material treatment, depth language, contrast tuning, and visual affordances, but it must not change identity, permissions, scheduler decisions, durable Firestore state, commerce truth, approval policy, or provider capability state.

## Execution boundary

Implementation follows:

`Product Law → Masterplan → Policy/ORUCAVEAM → frontend spatial skill → existing UI roots/primitives → implementation → accessibility/responsive/browser verification → GitHub evidence → HandOver → Endorsement → Product Knowledge when validated`

## Evidence boundary

Screenshots and browser captures are verification evidence only. They remain separate from the canonical Full Project ZIP source package and should be retained on the relevant GitHub workflow/run when useful.
