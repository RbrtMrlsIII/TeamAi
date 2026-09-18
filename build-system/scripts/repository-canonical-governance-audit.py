#!/usr/bin/env python3
"""Fail-closed audit of TeamAi's canonical governance graph and PR proof target."""
from __future__ import annotations

import csv
import json
import os
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AUTHORITY_MANIFEST = ".github/teamai/authority-manifest.yml"
CENSUS_FILES = (
    "docs/TEAMAI_3D_HERO_TREE_CENSUS.csv",
    "docs/TEAMAI_3D_HERO_TREE_CENSUS.json",
    "docs/TEAMAI_3D_HERO_TREE_CENSUS.md",
    "docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml",
)
SPATIAL_STRUCTURAL_RECORD = "docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml"
RETIRED_BASENAME_ALLOWLIST = {"PRODUCT_LAW.md", "MASTERPLAN.md", "NEXT_SLICES.md"}


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
    if manifest.get("schema") != 2 or manifest.get("status") != "ACTIVE":
        fail("authority manifest must declare schema 2 and ACTIVE status")
    return manifest


def manifest_sets(manifest: dict) -> tuple[set[str], set[str], set[str], tuple[tuple[str, str], ...]]:
    active = {
        spec.get("path")
        for spec in (manifest.get("active_authorities") or {}).values()
        if isinstance(spec, dict) and spec.get("path") and not str(spec["path"]).endswith("/")
    }
    forbidden = set(manifest.get("forbidden_active_surfaces") or [])
    forbidden_dirs = set(manifest.get("forbidden_parallel_namespaces") or [])
    historical_entries: list[tuple[str, str]] = []
    for name, spec in (manifest.get("historical_surfaces") or {}).items():
        if not isinstance(spec, dict):
            fail(f"historical surface must be an object: {name}")
        path = spec.get("path")
        prefix = spec.get("prefix")
        if bool(path) == bool(prefix):
            fail(f"historical surface must declare exactly one of path or prefix: {name}")
        if prefix:
            historical_entries.append(("prefix", str(prefix)))
        else:
            historical_entries.append(("path", str(path)))
    return active, forbidden, forbidden_dirs, tuple(historical_entries)


def pr_base_head(payload: dict) -> tuple[str | None, str | None]:
    pr = payload.get("pull_request") or {}
    return (
        ((pr.get("base") or {}).get("sha")) or os.getenv("BASE_SHA"),
        ((pr.get("head") or {}).get("sha")) or os.getenv("GITHUB_SHA"),
    )


def proof_target(payload: dict) -> str:
    pr = payload.get("pull_request") or {}
    body = ""
    number = pr.get("number")
    repository = os.getenv("GITHUB_REPOSITORY")
    token = os.getenv("GH_TOKEN") or os.getenv("GITHUB_TOKEN")
    if number and repository and token:
        try:
            body = run(
                "gh",
                "api",
                f"repos/{repository}/pulls/{number}",
                "--jq",
                ".body",
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            body = ""
    if not body:
        body = (pr.get("body") or "").strip()
    match = re.search(r"^###{1,2}\s+Draft proof target\s*$([\s\S]*?)(?=^###{1,2}\s|\Z)", body, re.MULTILINE)
    return match.group(1).strip() if match else ""
def changed_path_rows(base: str | None, head: str | None) -> list[list[str]]:
    if not base or not head:
        fail("PR base/head SHAs are required; governance cannot infer PR scope from a last commit")
    return [
        line.split("\t")
        for line in run("git", "diff", "--name-status", f"{base}...{head}").splitlines()
        if line.strip()
    ]


def changed_paths_from_rows(rows: list[list[str]]) -> set[str]:
    paths: set[str] = set()
    for parts in rows:
        status = parts[0] if parts else ""
        if status.startswith(("R", "C")):
            paths.update(parts[1:])
        elif len(parts) > 1:
            paths.add(parts[1])
    return {path for path in paths if path}


def changed_paths(base: str | None, head: str | None) -> set[str]:
    return changed_paths_from_rows(changed_path_rows(base, head))


def assert_spatial_authority(manifest: dict) -> None:
    spatial = manifest.get("spatial_authority") or {}
    required = {
        "structural_record",
        "interaction_contract",
        "implementation_entry",
        "census",
        "enforced_by",
        "authority_boundary",
        "change_policy",
    }
    missing = sorted(required - set(spatial))
    if missing:
        fail("authority manifest spatial_authority is missing: " + ", ".join(missing))
    if spatial["structural_record"] != SPATIAL_STRUCTURAL_RECORD:
        fail("spatial authority structural record does not point to the canonical Tree Authority XML")
    if tuple(spatial["census"]) != CENSUS_FILES:
        fail("spatial authority census representations are not the canonical four-file set")
    if spatial["enforced_by"] != "build-system/scripts/repository-canonical-governance-audit.py":
        fail("spatial authority is not enforced by the canonical governance audit")
    boundary = str(spatial["authority_boundary"]).lower()
    for token in ("subordinate", "cannot override product law", "backend", "scheduler", "merge"):
        if token not in boundary:
            fail("spatial authority boundary is missing explicit non-authority semantics")
    for rel in {
        SPATIAL_STRUCTURAL_RECORD,
        spatial["interaction_contract"],
        spatial["implementation_entry"],
        *CENSUS_FILES,
    }:
        if not exists(rel):
            fail(f"spatial authority references missing file: {rel}")

    try:
        root = ET.parse(SPATIAL_STRUCTURAL_RECORD).getroot()
    except (ET.ParseError, OSError) as exc:
        fail(f"3D Tree Authority XML is not parseable: {exc}")
    if root.tag != "teamaiHeroTreeAuthority":
        fail("3D Tree Authority XML has unexpected root")
    if root.findtext("./authority/productLaw") != "Product_Law/PRODUCT_LAW.md":
        fail("3D Tree Authority XML does not point to the single Product Law root")
    xml_boundary = (root.findtext("./authorityBoundary") or "").lower()
    if "subordinate" not in xml_boundary or "no product law" not in xml_boundary or "merge" not in xml_boundary:
        fail("3D Tree Authority XML does not declare its subordinate non-authority boundary")
    xml_representations = [node.text for node in root.findall("./maintenance/representations/file") if node.text]
    if xml_representations != list(CENSUS_FILES):
        fail("3D Tree Authority XML census representations are out of sync")

    try:
        census_json = json.loads(read("docs/TEAMAI_3D_HERO_TREE_CENSUS.json"))
    except (json.JSONDecodeError, OSError) as exc:
        fail(f"3D Tree Census JSON is not valid: {exc}")
    maintenance = census_json.get("censusMaintenance") or {}
    if maintenance.get("sameGovernedChange") is not True:
        fail("3D Tree Census JSON must require same governed change")
    if tuple(maintenance.get("representations") or []) != CENSUS_FILES:
        fail("3D Tree Census JSON census representations are out of sync")
    if "semantic identities" not in str(census_json.get("treeIdentityRule", "")):
        fail("3D Tree Census JSON must retain semantic identity wording")

    try:
        with open("docs/TEAMAI_3D_HERO_TREE_CENSUS.csv", newline="", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            csv_rows = list(reader)
            headers = tuple(reader.fieldnames or ())
    except (OSError, csv.Error) as exc:
        fail(f"3D Tree Census CSV is not valid: {exc}")
    required_headers = {
        "tree_id", "node_id", "node_type", "parent_id", "semantic_role",
        "status", "semantic_authority", "implementation_anchor", "ui_payload",
        "geometry_status", "expansion_status", "adjacency_status",
        "connection_status", "camera_status", "turn_loop_status", "notes",
    }
    if not required_headers.issubset(headers):
        fail("3D Tree Census CSV is missing required structural fields")
    csv_pairs = [(row["tree_id"], row["node_id"]) for row in csv_rows if row.get("tree_id") and row.get("node_id")]
    if len(csv_pairs) != len(set(csv_pairs)):
        fail("3D Tree Census CSV contains duplicate tree/node identities")
    csv_nodes = {node_id for _, node_id in csv_pairs}
    for row in csv_rows:
        parent = row.get("parent_id") or ""
        if row.get("node_type") != "tree" and parent not in csv_nodes:
            fail(f"3D Tree Census CSV references an unknown parent: {parent}")

    json_nodes = set()
    for tree in census_json.get("treeFamilies") or []:
        tree_id = tree.get("treeID")
        if not tree_id:
            fail("3D Tree Census JSON contains a tree without treeID")
        json_nodes.add(tree_id)
        json_nodes.update(tree.get("nodes") or [])

    xml_nodes = set()
    for tree in root.findall("./treeFamilies/tree"):
        tree_id = tree.get("id")
        if not tree_id:
            fail("3D Tree Authority XML contains a tree without id")
        xml_nodes.add(tree_id)
        for node in tree.findall("./node"):
            node_id = node.get("id")
            if not node_id:
                fail(f"3D Tree Authority XML contains a node without id under {tree_id}")
            xml_nodes.add(node_id)

    if json_nodes != csv_nodes or xml_nodes != csv_nodes:
        fail(
            "3D Tree Census identity drift: "
            f"csv={len(csv_nodes)} json={len(json_nodes)} xml={len(xml_nodes)}"
        )
    interaction = read(spatial["interaction_contract"]).lower()
    if "presentation-only" not in interaction and "presentation only" not in interaction:
        fail("3D interaction contract no longer states presentation-only authority")
    entry = read(spatial["implementation_entry"]).lower()
    if "no 029 release claim" not in entry:
        fail("3D implementation entry no longer carries the no-release boundary")


def assert_census_sync_contract(rows: list[list[str]]) -> None:
    import tempfile
    payload = json.dumps(rows)
    script = (
        "import fs from 'node:fs'; "
        "import { assertCensusSync } from './scripts/governance/census-sync-contract.mjs'; "
        "assertCensusSync(JSON.parse(fs.readFileSync(process.argv[1], 'utf8')));"
    )
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json", delete=False) as fh:
        fh.write(payload)
        temp_path = fh.name
    try:
        proc = subprocess.run(
            ["node", "--input-type=module", "-e", script, temp_path],
            cwd=ROOT,
            text=True,
            capture_output=True,
        )
    finally:
        Path(temp_path).unlink(missing_ok=True)
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout).strip()
        fail("3D census synchronization contract failed: " + detail)


def assert_manifest(manifest: dict) -> tuple[set[str], set[str], set[str], tuple[tuple[str, str], ...]]:
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
    blocking = manifest.get("blocking_model") or {}
    if blocking.get("validation_rewire_is_non_blocking") is not True:
        fail("authority manifest must explicitly classify validation rewiring as non-blocking")
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
    law = read("Product_Law/PRODUCT_LAW.md")
    wiring = read("Product_Law/WIRING.md")
    master = read("Masterplan/MASTERPLAN.md")
    policy = read("POLICY.md")
    skills = read("docs/SKILL_WIRING.md")
    session = read("AI_ASSISTANT_READ_ME.md")
    knowledge = read("PRODUCT-KNOWLEDGE.md")

    if not re.search(r"single Product Law|single Product Law authority|single.*Product Law|highest product authority|Canonical Front Door", law, re.IGNORECASE):
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


def is_historical_path(rel: str, historical: tuple[tuple[str, str], ...]) -> bool:
    for kind, value in historical:
        normalized = value.rstrip("/")
        if kind == "path" and (rel == normalized or rel.startswith(normalized + "/")):
            return True
        if kind == "prefix" and rel.startswith(value):
            return True
    return False


def retired_reference_is_active(body: str, target: str) -> bool:
    """Detect actual routing to a retired path, not a bare historical-name mention."""
    token = re.escape(target)
    patterns = (
        rf"\]\(\s*(?:\.\/)?{token}(?:[?#][^\s)]*)?\s*\)",
        rf"(?im)^\s*(?:path|file|source|target|href|route)\s*[:=]\s*[\"'`]?\./?{token}(?:[?#][^\s\"'`]*)?[\"'`]?\s*$",
        rf"(?im)(?:href|src)\s*=\s*[\"'](?:\.\/)?{token}(?:[?#][^\s\"']*)?[\"']",
    )
    return any(re.search(pattern, body) for pattern in patterns)


def assert_active_reference_policy(forbidden: set[str], historical: tuple[tuple[str, str], ...], manifest_path: str) -> None:
    for p in ROOT.rglob("*"):
        if not p.is_file() or "node_modules" in p.parts or ".git" in p.parts:
            continue
        rel = p.relative_to(ROOT).as_posix()
        if is_historical_path(rel, historical) or rel == manifest_path:
            continue
        try:
            body = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        for target in forbidden:
            if retired_reference_is_active(body, target):
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
    for path in ("docs/project-guide/HandOver.md", "docs/project-guide/Endorsement.md"):
        if path in paths and exists(path):
            fail(f"{path} must be retired, not modified")


def main() -> None:
    payload = event_payload()
    manifest = load_manifest()
    active, forbidden, forbidden_dirs, historical = assert_manifest(manifest)
    base, head = pr_base_head(payload)
    path_rows = changed_path_rows(base, head)
    paths = changed_paths_from_rows(path_rows)
    assert_spatial_authority(manifest)
    assert_roots(active, forbidden, forbidden_dirs)
    assert_current_slice()
    assert_roles()
    assert_active_reference_policy(forbidden, historical, AUTHORITY_MANIFEST)
    assert_skill_boundaries(manifest)
    assert_workspace_policy(manifest, payload)
    assert_historical_paths(paths)
    assert_census_sync_contract(path_rows)
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
    print("historical_surface_matching=path_and_prefix")
    print("skill_authority_boundary=enforced")
    print("workspace_branch_policy=enforced")
    print("3d_spatial_authority=machine-checked")
    print("3d_census_sync=machine-checked")
    print("3d_census_identity_coherence=machine-checked")


if __name__ == "__main__":
    main()
