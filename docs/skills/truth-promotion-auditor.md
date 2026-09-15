# Skill: Truth and Promotion Auditor

Status: GOVERNED EXECUTION SKILL / REAL

## Purpose

Prevent implementation tempo from being mistaken for product truth.

## Procedure

1. Classify the artifact as law, decision, acceptance criterion, implementation, or evidence.
2. Verify its repository location and branch relationship.
3. Check for contradictory evidence.
4. Verify required law gates independently.
5. Confirm the promotion decision is explicit and recorded.
6. Reject promotion when any mandatory evidence is missing or stale.

## Required invariants

- A passing CI run is evidence, not authority.
- A passing browser run is evidence, not authority.
- A merged implementation is not automatically a new law.
- A law must be independently addressable from implementation tempo.
- Promotion must be reproducible by another operator from the recorded evidence.

## Stop conditions

Stop promotion when facts, evidence, proposals, and decisions are mixed; when a governing document depends on an implementation branch; or when a promotion claim cannot be reproduced from recorded evidence.
