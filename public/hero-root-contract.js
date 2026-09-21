/**
 * Provisional TeamAi Hero root lifecycle contract.
 * This is coordination metadata, not a renderer or state authority.
 * Roots may evolve until the spatial architecture is finalized.
 */

export const HERO_ROOTS = Object.freeze({
  entrance: Object.freeze({
    id: 'hero-entrance',
    layer: 'entrance',
    owner: 'experience-rebaseline',
  }),
  machine: Object.freeze({
    id: 'hero-machine',
    layer: 'machine',
    owner: 'hero-flex',
  }),
  auth: Object.freeze({
    id: 'hero-auth',
    layer: 'normal-ui',
    owner: 'hero-auth-handoff',
  }),
  settings: Object.freeze({
    id: 'hero-settings',
    layer: 'normal-ui',
    owner: 'hero-settings-shell',
  }),
  diagnostics: Object.freeze({
    id: 'hero-diagnostics',
    layer: 'diagnostic',
    owner: 'hero-machine-proof',
  }),
});

const READY_EVENT = 'teamai:hero-root-ready';
const registry = new Map();

export function registerHeroRoot(key, detail = {}) {
  const root = HERO_ROOTS[key];
  if (!root) return null;
  const state = Object.freeze({
    ...root,
    ...detail,
    registered: true,
  });
  registry.set(key, state);
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(READY_EVENT, { detail: state }));
  }
  return state;
}

export function getHeroRootState(key) {
  return registry.get(key) || null;
}

export function getHeroRootSnapshot() {
  return Object.freeze(Object.fromEntries(registry.entries()));
}
