# AI Advisory Review Sequence Runtime-Proof Vehicle

**Status:** EXECUTION VEHICLE — runtime proof intentionally not claimed by this file alone

## Scope

This file exists only to provide a clean, current-head verification vehicle for the automatic advisory review sequence landed by PR #368.

Governing execution Issue: #369  
Active product frontier: Issue #278 / TEAM-EXPERIENCE-029  
Sequence implementation: PR #368  
Vehicle base: `main` merge commit `f35f31221b232076506ad9f67f8f23f5c9c77725`

## Runtime-proof target

The fresh eligible non-draft lifecycle event must exercise the landed state machine exactly as configured:

```text
Nemotron
    ↓ 150 seconds after Nemotron reaches terminal success/failure
OpenAI + Poolside   (concurrent)
    ↓ 150 seconds after both reach terminal success/failure
DeepSeek + Qwen     (concurrent)
```

The first reviewer has no preceding interval. Skipped or cancelled reviewer turns must not advance a barrier. Each stage must preserve the original triggering PR head and non-draft state. A durable one-sequence claim must exist before the first automatic model call. The sequence must not restart on `synchronize`.

## Reviewer bindings

| Stage | Reviewer | Model route | Secret alias |
|---|---|---|---|
| 1 | Nemotron | `nvidia/nemotron-3-ultra-550b-a55b:free` | `OPENROUTER_API_KEY` |
| 2 | OpenAI | `openai/gpt-oss-120b:free` | `OPENROUTER_API_KEY_OPENAI` |
| 2 | Poolside | `poolside/laguna-s-2.1:free` | `OPENROUTER_API_KEY_POOLSIDE` |
| 3 | DeepSeek | `deepseek/deepseek-v4-flash:free` | `OPENROUTER_API_KEY_DEEPSEEK` |
| 3 | Qwen | `qwen/qwen3-coder:free` | `OPENROUTER_API_KEY_GWEN` |

The Qwen secret alias is intentionally `OPENROUTER_API_KEY_GWEN` as recorded by the merged #368 configuration. It is not a typo discovered during this verification review.

## Evidence rule

This vehicle does not by itself establish runtime proof. The authoritative result must come from the fresh GitHub Actions run, exact-head workflow evidence, reviewer comments/markers, and the evidence record attached to Issue #369.

Do not infer provider success from configuration text, a green non-review validator, a PR description, or historical #368 execution. The historical Qwen provider failure on #368 remains immutable evidence for the old sequence only.

## Safety boundary

No product/runtime feature is being changed. No paid model route is intentionally invoked. No reviewer is manually replayed on PR #368. No validator is weakened. No automatic sequence restart is permitted on later `synchronize` events.

**Validation vehicle correction:** the PR body uses the repository's literal `### Draft proof target` contract and explicitly states the governance/canonical migration being proven before eligibility.
