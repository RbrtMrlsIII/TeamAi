export const CENSUS_FILES = [
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.csv',
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.json',
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.md',
  'docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml',
];

// These are the repository-owned Hero implementation surfaces whose changes can
// alter tree/branch/division semantics, payload, expansion, interaction, or
// spatial wiring. A governed change touching them must reconcile all census
// representations in the same PR.
export const CENSUS_GOVERNED_PATHS = [
  'frontend/spatial/',
  'skills/frontend/spatial/',
  'public/hero-flex.js',
  'public/_flex_src/',
  'public/hero-hierarchy-runtime.js',
  'public/hero-seat-branch-walk.js',
  'public/hero-seat-stack.js',
];

// Renderer-neutral machine proof modules do not add or alter census tree
// semantics. Their machine-scene evidence is carried by the owning evidence
// record and machine proof matrix; structural census edits remain mandatory
// whenever a tree/branch/division identity or payload actually changes.
export const CENSUS_PRESENTATION_ONLY_PATHS = new Set([
  'frontend/spatial/machine-hero-scene.js',
  'frontend/spatial/machine-hero-payload.js',
  'frontend/spatial/machine-hero-graph.js',
  'public/machine-hero-scene.js',
  'public/machine-hero-payload.js',
  'public/machine-hero-graph.js',
  'public/machine-hero-preview.js',
  'public/machine-hero-preview.css',
  'public/machine-hero-preview.html',
  'public/machine-hero-webgl.js',
]);

export function changedPaths(rows) {
  return rows.flatMap((parts) => {
    const status = parts[0] ?? '';
    if (status.startsWith('R') || status.startsWith('C')) return parts.slice(1);
    return parts[1] ? [parts[1]] : [];
  }).filter(Boolean);
}

export function requiresCensusSync(rows) {
  const paths = changedPaths(rows).filter((file) => !CENSUS_PRESENTATION_ONLY_PATHS.has(file));
  return paths.some((file) => CENSUS_GOVERNED_PATHS.some((prefix) => file === prefix || file.startsWith(prefix)));
}

export function assertCensusSync(rows) {
  if (!requiresCensusSync(rows)) return;

  const paths = new Set(changedPaths(rows));
  const missing = CENSUS_FILES.filter((file) => !paths.has(file));
  if (missing.length) {
    throw new Error(
      '3D Hero implementation changed without synchronized census updates: ' + missing.join(', '),
    );
  }
}
