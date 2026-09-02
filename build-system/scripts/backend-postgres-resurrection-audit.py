#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
ACTIVE_ROOTS = [ROOT / 'src', ROOT / 'package.json', ROOT / 'tsconfig.json', ROOT / 'migrations', ROOT / 'supabase']
PATTERNS = [
    re.compile(r"\bfrom\s+['\"]pg['\"]"),
    re.compile(r"\bimport\s*\(?\s*['\"]pg['\"]"),
    re.compile(r"\b(?:Pool|Client)\s*\("),
    re.compile(r"\bDATABASE_URL\b"),
    re.compile(r"\bpostgres(?:ql)?://", re.I),
]

violations = []
for root in ACTIVE_ROOTS:
    if not root.exists():
        continue
    files = [root] if root.is_file() else [p for p in root.rglob('*') if p.is_file()]
    for path in files:
        try:
            text = path.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        for line_no, line in enumerate(text.splitlines(), 1):
            if any(pattern.search(line) for pattern in PATTERNS):
                violations.append(f"{path.relative_to(ROOT)}:{line_no}: {line.strip()}")

if violations:
    print('BACKEND POSTGRES RESURRECTION AUDIT: FAIL')
    print('PostgreSQL markers found in active surfaces:')
    print('\n'.join(violations))
    sys.exit(1)

print('BACKEND POSTGRES RESURRECTION AUDIT: PASS')
print('No PostgreSQL runtime markers found in active surfaces.')
