export const CENSUS_FILES = [
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.csv',
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.json',
  'docs/TEAMAI_3D_HERO_TREE_CENSUS.md',
  'docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml',
];

export const CENSUS_GOVERNED_PATHS = [
  'frontend/spatial/',
  'skills/frontend/spatial/',
  'public/hero-flex.js',
  'public/_flex_src/',
  'public/hero-hierarchy-runtime.js',
  'public/hero-seat-branch-walk.js',
  'public/hero-seat-stack.js',
];

export const CENSUS_PRESENTATION_ONLY_PATHS = new Set([
  'frontend/spatial/machine-hero-scene.js',
  'frontend/spatial/machine-hero-payload.js',
  'frontend/spatial/machine-hero-graph.js',
  'frontend/spatial/machine-core-animation.js',
  'frontend/spatial/machine-core-hit-testing.js',
  'public/machine-hero-scene.js',
  'public/machine-hero-payload.js',
  'public/machine-hero-graph.js',
  'public/machine-hero-preview.js',
  'public/machine-hero-preview.css',
  'public/machine-hero-preview.html',
  'public/machine-hero-webgl.js',
  'public/machine-hero-magnificent.js',
  'public/machine-hero-magnificent.html',
  'public/machine-core-layout.js',
  'public/machine-core-layout-runtime.js',
  'public/machine-core-interaction.js',
  'public/machine-core-visual.js',
  'public/machine-core.css',
  'public/machine-core-preview.html',
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
  if (missing.length) throw new Error('3D Hero implementation changed without synchronized census updates: ' + missing.join(', '));
}
