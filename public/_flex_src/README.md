# Hero-flex static source parts

`part00.txt` … `partNN.txt` concatenate in order to form the full Cam-2+3+4 `public/hero-flex.js`.

Assembled by `scripts/apply-cam2-tree-follow-flex.mjs` (preferred over network fetch).

Regenerate after editing the live flex:

```bash
node scripts/apply-cam2-tree-follow-flex.mjs
python3 - <<'PY'
from pathlib import Path
src = Path('public/hero-flex.js').read_text()
outdir = Path('public/_flex_src')
for old in outdir.glob('part*.txt'):
    old.unlink()
size = 4000
for i in range(0, len(src), size):
    (outdir / f'part{i//size:02d}.txt').write_text(src[i:i+size])
print('parts', (len(src)+size-1)//size)
PY
```
