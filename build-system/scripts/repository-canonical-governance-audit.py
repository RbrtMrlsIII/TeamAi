#!/usr/bin/env python3
"""Fail-closed audit of TeamAi's canonical governance graph and PR proof target."""
from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AUTHORITY_MANIFEST = ".github/teamai/authority-manifest.yml"
CANONICAL_ROOTS = {
    "Product_Law/PRODUCT_LAW.md",
    "Product_Law/WIRING.md",
    "Masterplan/MASTERPLAN.md",
    "Masterplan/NEXT_SLICES.md",
    "POLICY.md",
    "docs/SKILL_WIRING.md",
    "AI_ASSISTANT_READ_ME.md",
    "PRODUCT-KNOWLEDGE.md",
    AUTHORITY_MANIFEST,
}
FORBIDDEN_ACTIVE = {
    "PRODUCT_LAW.md",
    "MASTERPLAN.md",
    "NEXT_SLICES.md",
    "docs/project-guide/HandOver.md",
    "docs/project-guide/Endorsement.md",
    "docs/project-guide/AI_ASSISTANT_READ_ME.md",
    "docs/TEAMAI_3D_HERO_NEXT_SLICES.md",
    "docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md",
    "docs/TEAMAI_CURRENT_STATE.md",
    "docs/AGENT_CURRENT_STATE_AND_BRANCH_RULES.md",
    "docs/AGENT_SLICE_EXECUTION.md",
    "docs/GOVERNANCE_FAIL_CLOSED.md",
    "docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md",
}
FORBIDDEN_DIRS = {"docs/skills"}
HISTORICAL_PREFIXES = ("docs/archive/", "docs/evidence/", "handover/")
REQUIRED_MANIFEST_PATHS = {
    "Product_Law/PRODUCT_LAW.md",
    "Product_Law/WIRING.md",
    "Masterplan/MASTERPLAN.md",
    "Masterplan/NEXT_SLICES.md",
    "POLICY.md",
    "docs/SKILL_WIRING.md",
    "skills/",
    "AI_ASSISTANT_READ_ME.md",
    "PRODUCT-KNOWLEDGE.md",
    "docs/archive/",
    "handover/",
}


def fail(message: str) -> None:
    print("REPOSITORY_CANONICAL_GOVERNANCE_AUDIT=FAIL")
    print(message)
    raise SystemExit(1)


def run(*args: str) -> str:
    return subprocess.check_output(list(args), cwd=ROOT, text=True).strip()


def exists(rel: str) -> bool:
    return (ROOT / rel).is_file()


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def event_payload() -> dict:
    event_path = os.getenv("GITHUB_EVENT_PATH")
    if not event_path:
        return {}
    try:
        return json.loads(Path(event_path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def pr_base_head(payload: dict) -> tuple[str | None, str | None]:
    pr = payload.get("pull_request") or {}
    return (
        ((pr.get("base") or {}).get("sha")) or os.getenv("BASE_SHA"),
        ((pr.get("head") or {}).get("sha")) or os.getenv("GITHUB_SHA"),
    )


def proof_target(payload: dict) -> str:
    body = ((payload.get("pull_request") or {}).get("body") or "").strip()
    match = re.search(r"^##?\s+Draft proof target\s*$([\s\S]*?)(?=^##?\s|\Z)", body, re.MULTILINE)
    return match.group(1).strip() if match else ""


def changed_paths(base: str | None, head: str | None) -> set[str]:
    if not base or not head:
        fail("PR base/head SHAs are required; governance cannot infer PR scope from a last commit")
    return {p for p in run("git", "diff", "--name-only", f"{base}...{head}").splitlines() if p.strip()}


def assert_manifest() -> None:
    if not exists(AUTHORITY_MANIFEST):
        fail(f"missing canonical authority manifest: {AUTHORITY_MANIFEST}")
    text = read(AUTHORITY_MANIFEST)
    if "status: ACTIVE" not in text:
        fail("authority manifest must be ACTIVE")
    for required in REQUIRED_MANIFEST_PATHS:
        if required not in text:
            fail(f"authority manifest missing canonical path/namespace: {required}")
    if "docs/skills" not in text or "forbidden_parallel_namespaces:" not in text:
        fail("authority manifest must explicitly forbid docs/skills")
    if "draft_first: true" not in text or "auto_merge: false" not in text:
        fail("authority manifest must declare draft-first and no-auto-merge policy")
    if "pr_scope: BASE...HEAD" not in text:
        fail("authority manifest must declare BASE...HEAD governance scope")


def assert_roots() -> None:
    assert_manifest()
    for rel in CANONICAL_ROOTS:
        if not exists(rel):
            fail(f"missing canonical root: {rel}")
    for rel in FORBIDDEN_ACTIVE:
        if exists(rel):
            fail(f"forbidden active retired root still exists: {rel}")
    for rel in FORBIDDEN_DIRS:
        if (ROOT / rel).exists():
            fail(f"parallel procedure namespace exists: {rel}")
    for p in ROOT.rglob("OBSOLETE_FILES.md"):
        if "node_modules" not in p.parts and ".git" not in p.parts:
            fail(f"OBSOLETE_FILES.md is forbidden: {p.relative_to(ROOT)}")


def assert_current_slice() -> None:
    text = read("Masterplan/NEXT_SLICES.md")
    headers = ["## Current Slice", "## Status", "## Objective", "## Dependencies", "## Verification", "## Current blocker"]
    for header in headers:
        if not re.search(rf"^{re.escape(header)}$", text, re.MULTILINE):
            fail(f"Masterplan/NEXT_SLICES.md missing required section: {header}")
    if len(re.findall(r"^## Current Slice$", text, re.MULTILINE)) != 1:
        fail("Masterplan/NEXT_SLICES.md must contain exactly one current slice")
    if re.search(r"^##\s+(Immediate sequence|Queue)$", text, re.MULTILINE):
        fail("Masterplan/NEXT_SLICES.md contains a roadmap/queue section")
    if re.search(r"^\d+\.\s+", text, re.MULTILINE):
        fail("Masterplan/NEXT_SLICES.md contains numbered queue content")


def assert_roles() -> None:
    law = read("Product_Law/PRODUCT_LAW.md")
    wiring = read("Product_Law/WIRING.md")
    master = read("Masterplan/MASTERPLAN.md")
    policy = read("POLICY.md")
    skills = read("docs/SKILL_WIRING.md")
    session = read("AI_ASSISTANT_READ_ME.md")
    knowledge = read("PRODUCT-KNOWLEDGE.md")

    if not re.search(r"single Product Law|single Product Law authority|single.*Product Law", law, re.IGNORECASE):
        fail("Product_Law/PRODUCT_LAW.md does not declare the single Product Law authority")
    if "Development fields" not in wiring or "Product & Governance" not in wiring:
        fail("Product_Law/WIRING.md does not define development-field purposes")
    if "checklist" not in master.lower() or "Product_Law/PRODUCT_LAW.md" not in master:
        fail("Masterplan/MASTERPLAN.md is not wired as the checklist under Product Law")
    if "ORUCAVEAM" not in policy or "M — Minimalistic Efficiency / Resource Use" not in policy:
        fail("POLICY.md is missing the canonical ORUCAVEAM spine")
    if "skills/governance/repository-synchronization/SKILL.md" not in skills or "skills/governance/machine-builder/SKILL.md" not in skills:
        fail("Skill wiring is missing governance or machine-builder routes")
    if "Last given prompt:" not in session or "#346" not in session or "VALIDATION CHANGE WARNING" not in session:
        fail("AI_ASSISTANT_READ_ME.md is missing current-session or validation-change state")
    for pattern in (r"\bCurrent session\b", r"\bIssue\s+#\d+\b", r"\bPR\s+#\d+\b", r"\bHEAD\b", r"\b\d{4}-\d{2}-\d{2}\b"):
        if re.search(pattern, knowledge, re.IGNORECASE):
            fail(f"PRODUCT-KNOWLEDGE.md contains volatile session context: {pattern}")


def assert_active_reference_policy() -> None:
    for p in ROOT.rglob("*"):
        if not p.is_file() or "node_modules" in p.parts or ".git" in p.parts:
            continue
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith(HISTORICAL_PREFIXES) or rel == AUTHORITY_MANIFEST:
            continue
        try:
            body = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for target in FORBIDDEN_ACTIVE:
            if target in body:
                fail(f"active reference points to retired path {target}: {rel}")


def assert_proof_target(payload: dict, paths: set[str]) -> None:
    target = proof_target(payload)
    if not target:
        fail("Draft PR must contain a 'Draft proof target' section describing what the PR is trying to prove")
    target_lower = target.lower()
    required_terms = ("governance", "canonical", "reconciliation", "migration")
    if not any(word in target_lower for word in required_terms):
        fail("Draft proof target does not describe the governance/canonical migration being proven")
    if "Product_Law/" in target and not any(p.startswith("Product_Law/") for p in paths):
        fail("proof target names Product_Law but PR does not change Product_Law")

    governance_change = any(
        p.startswith(("Product_Law/", "Masterplan/", "docs/SKILL_WIRING.md", "POLICY.md", "AI_ASSISTANT_READ_ME.md", ".github/", "build-system/", "scripts/governance/", "skills/governance/"))
        for p in paths
    )
    if governance_change:
        required = {
            "Product_Law/WIRING.md",
            "Masterplan/MASTERPLAN.md",
            "Masterplan/NEXT_SLICES.md",
            "POLICY.md",
            "docs/SKILL_WIRING.md",
            "AI_ASSISTANT_READ_ME.md",
        }
        missing = sorted(required - paths)
        if missing:
            fail("governance PR target is missing canonical synchronization paths: " + ", ".join(missing))


def assert_historical_paths(paths: set[str]) -> None:
    if "docs/project-guide/HandOver.md" in paths:
        fail("HandOver.md must be retired, not modified")
    if "docs/project-guide/Endorsement.md" in paths:
        fail("Endorsement.md must be retired, not modified")


def main() -> None:
    payload = event_payload()
    base, head = pr_base_head(payload)
    paths = changed_paths(base, head)
    assert_roots()
    assert_current_slice()
    assert_roles()
    assert_active_reference_policy()
    assert_historical_paths(paths)
    if payload.get("pull_request"):
        assert_proof_target(payload, paths)
    print("REPOSITORY_CANONICAL_GOVERNANCE_AUDIT=PASS")
    print(f"pr_base={base}")
    print(f"pr_head={head}")
    print(f"changed_paths={len(paths)}")
    print("delta_source=git diff BASE...HEAD")
    print("proof_target_source=github.event.pull_request.body")
    print("authority_manifest=.github/teamai/authority-manifest.yml")
    print("active_vs_historical=explicit")


if __name__ == "__main__":
    main()
