#!/usr/bin/env python3
"""Build and verify the TeamAi Full Project ZIP from the canonical Git tree.

The package is intentionally based on `git ls-files` so untracked runtime/generated
artifacts are excluded automatically. Tracked packaging blockers fail the command
instead of being silently omitted.
"""

from __future__ import annotations

import argparse
import hashlib
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[2]

BLOCKED_DIRS = {
    ".git", ".next", ".vercel", ".firebase", ".turbo", ".cache",
    "node_modules", "dist", "out", "coverage", "playwright-report",
    "test-results", "artifacts", "screenshots", "captures", "tmp", "temp",
}
BLOCKED_FILE_NAMES = {
    ".env", ".env.local", ".env.development.local",
    ".env.test.local", ".env.production.local",
}
ARTIFACT_IMAGE_MARKERS = (
    "screenshot", "screen-shot", "capture", "evidence-image",
    "browser-capture", "playwright", "visual-test", "vercel-preview",
)
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"}


def tracked_paths() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return [Path(part.decode("utf-8")) for part in result.stdout.split(b"\0") if part]


def blocker(path: Path) -> str | None:
    if set(path.parts) & BLOCKED_DIRS:
        return "generated/runtime directory"
    if path.name in BLOCKED_FILE_NAMES:
        return "local secret/environment file"
    lowered = path.as_posix().lower()
    if path.suffix.lower() in IMAGE_EXTENSIONS and any(marker in lowered for marker in ARTIFACT_IMAGE_MARKERS):
        return "generated/artifact image"
    return None


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate_tracked(paths: list[Path]) -> None:
    blockers = [f"{path.as_posix()}: {blocker(path)}" for path in paths if blocker(path)]
    if blockers:
        raise SystemExit("Packaging blocked by tracked artifact/secrets:\n" + "\n".join(blockers))


def build(paths: list[Path], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        output.unlink()
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for relative in sorted(paths, key=lambda item: item.as_posix()):
            info = zipfile.ZipInfo(PurePosixPath(relative.as_posix()).as_posix())
            info.date_time = (1980, 1, 1, 0, 0, 0)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100644 & 0xFFFF) << 16
            archive.writestr(info, (ROOT / relative).read_bytes())


def verify(paths: list[Path], archive_path: Path) -> None:
    expected = {path.as_posix(): sha256(ROOT / path) for path in paths}
    with tempfile.TemporaryDirectory(prefix="teamai-package-") as temporary:
        extraction = Path(temporary)
        with zipfile.ZipFile(archive_path) as archive:
            names = [name for name in archive.namelist() if not name.endswith("/")]
            if len(names) != len(set(names)):
                raise SystemExit("Package contains duplicate paths.")
            archive.extractall(extraction)

        if sorted(names) != sorted(expected):
            raise SystemExit(
                "Package tree mismatch.\n"
                f"Missing: {sorted(set(expected) - set(names))}\n"
                f"Extra: {sorted(set(names) - set(expected))}"
            )

        mismatches = []
        for name, expected_hash in expected.items():
            actual_hash = sha256(extraction / Path(name))
            if actual_hash != expected_hash:
                mismatches.append(f"{name}: expected {expected_hash}, got {actual_hash}")
        if mismatches:
            raise SystemExit("Byte-for-byte verification failed:\n" + "\n".join(mismatches))

    print(f"PACKAGE_VERIFY=PASS files={len(paths)} archive={archive_path}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("create", "verify", "create-and-verify"))
    parser.add_argument("--output", default="TeamAi-Full-Project.zip")
    args = parser.parse_args()

    paths = tracked_paths()
    validate_tracked(paths)
    output = ROOT / args.output

    if args.command in {"create", "create-and-verify"}:
        build(paths, output)
        print(f"PACKAGE_CREATE=PASS files={len(paths)} archive={output}")
    if args.command in {"verify", "create-and-verify"}:
        if not output.exists():
            raise SystemExit(f"Archive not found: {output}")
        verify(paths, output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
