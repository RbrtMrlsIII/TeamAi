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


def load_manifest() -> dict:
    if not exists(AUTHORITY_MANIFEST):
        fail(f"missing canonical authority manifest: {AUTHORITY_MANIFEST}")
    try:
        manifest = json.loads(read(AUTHORITY_MANIFEST))
    except json.JSONDecodeError as exc:
        fail(f"authority manifest must be JSON-compatible YAML: {exc}")
    if manifest.get("schema") != 1 or manifest.get("status") != "ACTIVE":
        fail("authority manifest must declare schema 1 and ACTIVE status")
    return manifest


def manifest_sets(manifest: dict) -> tuple[set[str], set[str], set[str], tuple[str, ...]]:
    active = {
        spec.get("path")
        for spec in (manifest.get("active_authorities") or {}).values()
        if isinstance(spec, dict) and spec.get("path") and not str(spec["path"]).endswith("/")
    }
    forbidden = set(manifest.get("forbidden_active_surfaces") or [])
    forbidden_dirs = set(manifest.get("forbidden_parallel_namespaces") or [])
    historical = tuple(
        spec.get("path")
        for spec in (manifest.get("historical_surfaces") or {}).values()
        if isinstance(spec, dict) and spec.get("path")
    )
    return active, forbidden, forbidden_dirs, historical


def pr_base_head(payload: dict) -> tuple[str | None, str | None]:
    pr = payload.get("pull_request") or {}
    return (
        ((pr.get("base") or {}).get("sha")) or os.getenv("BASE_SHA"),
        ((pr.get("head") or {}).get("sha")) or os.getenv("GITHUB_SHA"),
    )


def proof_target(payload: dict) -> str:
    body = ((payload.get("pull_request") or {}).get("body") or "").strip()
    match = re.search(r"^###\s+Draft proof target\s*$([\s\S]*?)(?=^###\s|\Z)", body, re.MULTILINE)
    return match.group(1).strip() if match else ""


def changed_paths(base: str | None, head: str | None) -> set[str]:
    if not base or not head:
        fail("PR base/head SHAs are required; governance cannot infer PR scope from a last commit")
    return {p for p in run("git", "diff", "--name-only", f"{base}...{head}").splitlines() if p.strip()}


def assert_manifest(manifest: dict) -> tuple[set[str], set[str], set[str], tuple[str, ...]]:
    active, forbidden, forbidden_dirs, historical = manifest_sets(manifest)
    if len(active) < 8:
        fail("authority manifest defines too few active file authorities")
    for required in {
        "Product_Law/PRODUCT_LAW.md",
        "Product_Law/WIRING.md",
        "Masterplan/MASTERPLAN.md",
        "Masterplan/NEXT_SLICES.md",
        "POLICY.md",
        "docs/SKILL_WIRING.md",
        "AI_ASSISTANT_READ_ME.md",
        "PRODUCT-KNOWLEDGE.md",
    }:
        if required not in active:
            fail(f"authority manifest missing active authority: {required}")
    if "docs/skills" not in forbidden_dirs:
        fail("authority manifest must forbid docs/skills")
    promotion = manifest.get("promotion_model") or {}
    if promotion.get("draft_first") is not True or promotion.get("auto_merge") is not False:
        fail("authority manifest must declare draft-first and no-auto-merge")
    validation = manifest.get("validation_model") or {}
    if validation.get("pr_scope") != "BASE...HEAD":
        fail("authority manifest must declare BASE...HEAD governance scope")
    return active, forbidden, forbidden_dirs, historical


def assert_roots(active: set[str], forbidden: set[str], forbidden_dirs: set[str]) -> None:
    for rel in active:
        if not exists(rel):
            fail(f"missing active authority path: {rel}")
    for rel in forbidden:
        if exists(rel):
            fail(f"forbidden active retired root still exists: {rel}")
    for rel in forbidden_dirs:
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
    wiring = read("Product_Law/WIRING.md")
    master = read("Masterplan/MASTERPLAN.md")
    policy = read("POLICY.md")
    skills = read("docs/SKILL_WIRING.md")
    session = read("AI_ASSISTANT_READ_ME.md")
    knowledge = read("PRODUCT-KNOWLEDGE.md")

    if not re.search(r"Product_Law/PRODUCT_LAW\.md", wiring, re.IGNORECASE):
        fail("Product_Law/WIRING.md does not point to the canonical Product Law")
    if not re.search(r"single Product Law|sole Product Law|only Product Law", wiring, re.IGNORECASE):
        fail("Product_Law/WIRING.md does not declare the single Product Law ownership")
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


def assert_active_reference_policy(forbidden: set[str], historical: tuple[str, ...], manifest_path: str) -> None:
    for p in ROOT.rglob("*"):
        if not p.is_file() or "node_modules" in p.parts or ".git" in p.parts:
            continue
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith(historical) or rel == manifest_path:
            continue
        try:
            body = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for target in forbidden:
            if target in body:
                fail(f"active reference points to retired path {target}: {rel}")


def assert_skill_boundaries(manifest: dict) -> None:
    skill_model = manifest.get("skill_model") or {}
    required = skill_model.get("required_shape") or []
    if required != ["WHEN TO USE", "AUTHORITY", "ACTION", "DO NOT", "PASS"]:
        fail("authority manifest skill_model.required_shape is not canonical")
    for rel in [
        "skills/governance/repository-synchronization/SKILL.md",
        "skills/governance/machine-builder/SKILL.md",
    ]:
        body = read(rel)
        for heading in required:
            if f"## {heading}" not in body:
                fail(f"{rel} is missing required Skill section: {heading}")
        authority = body.lower()
        if "procedural only" not in authority:
            fail(f"{rel} must declare itself procedural only")
        if "product law" not in authority or "permission" not in authority or "merge" not in authority:
            fail(f"{rel} must explicitly deny Product Law/permission/merge authority")


def assert_workspace_policy(manifest: dict, payload: dict) -> None:
    workspace = manifest.get("workspace_model") or {}
    prefixes = tuple(workspace.get("allowed_branch_prefixes") or [])
    protected = workspace.get("protected_branch")
    vague = set(workspace.get("vague_branch_names_forbidden") or [])
    pr = payload.get("pull_request") or {}
    branch = ((pr.get("head") or {}).get("ref")) or ""
    if pr and not branch:
        fail("pull request head branch is missing")
    if branch and branch in vague:
        fail(f"vague branch name is forbidden: {branch}")
    if branch and not any(branch.startswith(prefix) for prefix in prefixes):
        fail(f"PR branch does not use an allowed responsibility prefix: {branch}")
    if protected != "main":
        fail("workspace policy must protect main as the production branch")


def assert_pr_controls(payload: dict) -> None:
    pr = payload.get("pull_request") or {}
    if not pr:
        return
    if pr.get("auto_merge") is not None:
        fail("TeamAi policy forbids auto-merge on substantive pull requests")
    head = ((pr.get("head") or {}).get("sha"))
    body = (pr.get("body") or "")
    if not head:
        fail("pull request head SHA is missing")
    if "Draft proof target" not in body:
        fail("Draft PR proof target is mandatory")


def assert_proof_target(payload: dict, paths: set[str]) -> None:
    target = proof_target(payload)
    if not target:
        fail("Draft PR must contain a 'Draft proof target' section describing what the PR is trying to prove")
    target_lower = target.lower()
    if not any(word in target_lower for word in ("governance", "canonical", "reconciliation", "migration")):
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
    manifest = load_manifest()
    active, forbidden, forbidden_dirs, historical = assert_manifest(manifest)
    base, head = pr_base_head(payload)
    paths = changed_paths(base, head)
    assert_roots(active, forbidden, forbidden_dirs)
    assert_current_slice()
    assert_roles()
    assert_active_reference_policy(forbidden, historical, AUTHORITY_MANIFEST)
    assert_skill_boundaries(manifest)
    assert_workspace_policy(manifest, payload)
    assert_pr_controls(payload)
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
    print("skill_authority_boundary=enforced")
    print("workspace_branch_policy=enforced")
    print("auto_merge_policy=enforced")


if __name__ == "__main__":
    main()
