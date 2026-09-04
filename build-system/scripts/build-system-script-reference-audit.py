#!/usr/bin/env python3
"""Verify that package.json does not reference missing build-system scripts."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PACKAGE_JSON = ROOT / "package.json"


def main() -> int:
    package = json.loads(PACKAGE_JSON.read_text(encoding="utf-8"))
    scripts = package.get("scripts", {})
    missing: list[str] = []

    for name, command in scripts.items():
        if not isinstance(command, str):
            continue
        for match in re.finditer(r"(?:python3|python|bash|sh)\\s+(build-system/scripts/[^\\s]+)", command):
            path = ROOT / match.group(1)
            if not path.is_file():
                missing.append(f"{name}: {match.group(1)}")

    if missing:
        print("BUILD_SYSTEM_SCRIPT_REFERENCE_AUDIT=FAIL")
        for item in missing:
            print(item)
        return 1

    print("BUILD_SYSTEM_SCRIPT_REFERENCE_AUDIT=PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
