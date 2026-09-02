#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SELF = Path(__file__).resolve()
SCAN_ROOTS = [ROOT / 'src', ROOT / 'tests', ROOT / 'package.json', ROOT / '.env.example', ROOT / 'supabase']
PATTERNS = [
    re.compile(r'from\s+["\']pg["\']'),
    re.compile(r'import\s*\(\s*["\']pg["\']'),
    re.compile(r'require\(\s*["\']pg["\']'),
    re.compile(r'\bDATABASE_URL\b'),
    re.compile(r'\bpostgres(?:ql)?://', re.I),
    re.compile(r'\bPool\s*\('),
]
BAD_PATHS = [ROOT / 'src' / 'db', ROOT / 'migrations']
violations = []

for bad in BAD_PATHS:
    if bad.exists():
        violations.append(f'{bad.relative_to(ROOT)}: retired backend path exists')

for base in SCAN_ROOTS:
    if not base.exists():
        continue
    files = [base] if base.is_file() else [p for p in base.rglob('*') if p.is_file()]
    for path in files:
        if path.resolve() == SELF:
            continue
        try:
            text = path.read_text(encoding='utf-8')
        except (UnicodeDecodeError, OSError):
            continue
        for line_no, line in enumerate(text.splitlines(), 1):
            if any(pattern.search(line) for pattern in PATTERNS):
                violations.append(f'{path.relative_to(ROOT)}:{line_no}: {line.strip()}')

if violations:
    print('BACKEND AUTHORITY AUDIT: FAIL')
    print('Retired backend markers found in active surfaces:')
    print('\n'.join(violations))
    sys.exit(1)

print('BACKEND AUTHORITY AUDIT: PASS')
print('No retired backend runtime markers found in active surfaces.')
