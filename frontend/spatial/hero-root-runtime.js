import {
  HERO_ROOTS,
  getHeroRootSnapshot,
  registerHeroRoot,
} from './hero-root-contract.js';

export function deriveHeroRootPresence(root = globalThis.document) {
  const shell = root?.querySelector?.('.hero-shell');
  const presence = {
    entrance: Boolean(shell?.querySelector?.('.classic-entrance')),
    machine: Boolean(root?.querySelector?.('#hero-canvas') || globalThis.window?.TeamAiHero),
    auth: Boolean(root?.querySelector?.('#hero-auth-panel') || globalThis.window?.TeamAiHeroAuthHandoff),
    settings: Boolean(root?.querySelector?.('#hero-settings-shell') || root?.querySelector?.('#hero-settings-panel')),
    diagnostics: Boolean(root?.querySelector?.('[data-hero-machine-proof]')),
  };
  return Object.freeze(presence);
}

export function bootstrapHeroRoot(root = globalThis.document) {
  const presence = deriveHeroRootPresence(root);
  for (const [key, present] of Object.entries(presence)) {
    registerHeroRoot(key, {
      status: present ? 'present' : 'absent',
      observedAt: Date.now(),
    });
  }
  return Object.freeze({
    presence,
    registered: getHeroRootSnapshot(),
    provisional: true,
  });
}

function bind() {
  if (!globalThis.document) return;
  queueMicrotask(() => bootstrapHeroRoot(globalThis.document));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
}

window.TeamAiHeroRoots = Object.freeze({
  definitions: HERO_ROOTS,
  observe: () => bootstrapHeroRoot(document),
  snapshot: getHeroRootSnapshot,
});
