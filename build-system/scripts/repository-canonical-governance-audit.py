#!/usr/bin/env python3
"""Fail-closed audit for TeamAi's small canonical document chain."""
from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REQUIRED = [
    "PRODUCT_LAW.md",
    "MASTERPLAN.md",
    "NEXT_SLICES.md",
    "POLICY.md",
    "PRODUCT-KNOWLEDGE.md",
    "AI_ASSISTANT_READ_ME.md",
    "docs/SKILL_WIRING.md",
    "docs/project-guide/Endorsement.md",
]
FORBIDDEN = [
    "docs/project-guide/HandOver.md",
    "docs/project-guide/AI_ASSISTANT_READ_ME.md",
    "docs/TEAMAI_3D_HERO_NEXT_SLICES.md",
    "docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md",
    "docs/TEAMAI_CURRENT_STATE.md",
    "docs/AGENT_CURRENT_STATE_AND_BRANCH_RULES.md",
    "docs/AGENT_SLICE_EXECUTION.md",
    "docs/GOVERNANCE_FAIL_CLOSED.md",
    "docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md",
]

def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")

def fail(msg: str) -> None:
    print(f"REPOSITORY_CANONICAL_GOVERNANCE_AUDIT=FAIL\n{msg}")
    raise SystemExit(1)

def changed_paths() -> set[str]:
    try:
        head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
        parents = subprocess.check_output(["git", "rev-list", "--parents", "-n", "1", head], cwd=ROOT, text=True).strip().split()
        if len(parents) >= 3:
            base, pr_head = parents[1], parents[2]
            out = subprocess.check_output(["git", "diff", "--name-only", base, pr_head], cwd=ROOT, text=True)
        else:
            parent = parents[1] if len(parents) == 2 else f"{head}^"
            out = subprocess.check_output(["git", "diff", "--name-only", parent, head], cwd=ROOT, text=True)
        return {p.strip() for p in out.splitlines() if p.strip()}
    except (subprocess.CalledProcessError, IndexError):
        return set()

for rel in REQUIRED:
    if not (ROOT / rel).is_file():
        fail(f"missing required active document: {rel}")
for rel in FORBIDDEN:
    if (ROOT / rel).exists():
        fail(f"forbidden duplicate/retired active document still exists: {rel}")

for path in ROOT.rglob("OBSOLETE_FILES.md"):
    if "node_modules" not in path.parts:
        fail("OBSOLETE_FILES.md is forbidden; use docs/archive/ instead")

master = read("MASTERPLAN.md")
next_slices = read("NEXT_SLICES.md")
policy = read("POLICY.md")
knowledge = read("PRODUCT-KNOWLEDGE.md")
assistant = read("AI_ASSISTANT_READ_ME.md")

if master.count("## ") > 8:
    fail("MASTERPLAN.md is no longer checklist-sized")
if "## Current slice" not in next_slices or next_slices.count("## Current slice") != 1:
    fail("NEXT_SLICES.md must contain exactly one current-slice section")
if "ORUCAVEAM" not in policy or "O — Objective" not in policy or "M — Minimalistic Efficiency" not in policy:
    fail("POLICY.md is missing the canonical ORUCAVEAM spine")
if "second Product Law" in policy:
    fail("POLICY.md must remain execution discipline, not a second constitution")

for pattern in (
    r"\bCurrent session\b",
    r"\bIssue\s+#\d+",
    r"\bPR\s+#\d+",
    r"\bHEAD\b",
    r"\b(?:current|latest|active)\s+(?:branch|deployment)(?:\s+(?:state|status|inventory|tip|head))?\b",
    r"\b\d{4}-\d{2}-\d{2}\b",
):
    if re.search(pattern, knowledge, flags=re.IGNORECASE):
        fail(f"PRODUCT-KNOWLEDGE.md contains live-session/current-state context matching {pattern!r}")

if "Last given prompt:" not in assistant or "Current governance PR:" not in assistant:
    fail("AI_ASSISTANT_READ_ME.md is missing the live-session anchor")
if "Draft-first merge discipline" not in assistant:
    fail("AI_ASSISTANT_READ_ME.md is missing the draft-first merge rule")

paths = changed_paths()
substantive_prefixes = ("public/", "frontend/", "backend/", "supabase/", "skills/", ".github/workflows/", "build-system/")
substantive = any(p.startswith(substantive_prefixes) for p in paths)
if substantive:
    required = {"AI_ASSISTANT_READ_ME.md"}
    if any(p.startswith(("skills/", ".github/workflows/")) for p in paths):
        required.add("docs/SKILL_WIRING.md")
    if any(p.startswith(("public/", "frontend/", "backend/", "supabase/")) for p in paths):
        required.add("MASTERPLAN.md")
        required.add("NEXT_SLICES.md")
    missing = sorted(required - paths)
    if missing:
        fail("substantive change missing same-PR canonical reconciliation: " + ", ".join(missing))

if os.getenv("TEAMAI_PR_DRAFT") == "false" and os.getenv("TEAMAI_PROMOTION_REVIEWED") != "true":
    fail("ready-for-review/merge state requires explicit promotion review marker")

print("REPOSITORY_CANONICAL_GOVERNANCE_AUDIT=PASS")
print(f"changed_paths={len(paths)}")
