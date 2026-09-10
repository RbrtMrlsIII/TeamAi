/**
 * V3.4 — Get-started → machine baseline handoff (Layer A → Layer B).
 * Owners: .hero-shell data-hero-layer · existing HERO_WIDE camera path · auth engine-open event.
 * Presentation only · one Hero instance · no second WebGL · no 029-released claim.
 *
 * Does NOT set data-hero-machine-ui (that flag soft-hides controls via hero-dom-chrome.css
 * and remains owned by hierarchy machine-UI absorption).
 * data-inspection-reset remains inspection-spine owner.
 */

const WORLD_BASELINE = 'HERO_WIDE';

function shell() {
  return document.querySelector('.hero-shell');
}

function requestBaselineCamera() {
  if (typeof window.TeamAiHero?.setCamera === 'function') {
    window.TeamAiHero.setCamera(WORLD_BASELINE);
    return { via: 'TeamAiHero.setCamera', id: WORLD_BASELINE };
  }
  window.dispatchEvent(new CustomEvent('teamai:hero-camera-request', {
    detail: { cameraId: WORLD_BASELINE, source: 'v3.4-layer-handoff', presentationOnly: true },
  }));
  return { via: 'event', id: WORLD_BASELINE };
}

/** Enter Layer B — machine baseline. Does not destroy Hero or open a second runtime. */
export function enterMachineLayer(opts = {}) {
  const el = shell();
  if (!el) return { ok: false, reason: 'no-shell' };
  const source = opts.source || 'get-started';
  el.dataset.heroLayer = 'machine';
  // Do not set data-hero-machine-ui here — that flag hides control-row (DOM chrome absorption).
  const cam = requestBaselineCamera();
  window.dispatchEvent(new CustomEvent('teamai:hero-layer-change', {
    detail: {
      layer: 'machine',
      cameraId: WORLD_BASELINE,
      source,
      presentationOnly: true,
      notSecondRuntime: true,
    },
  }));
  return { ok: true, layer: 'machine', camera: cam, source };
}

/** Return to Layer A entrance presentation without destroying Hero instance. */
export function returnToEntranceLayer(opts = {}) {
  const el = shell();
  if (!el) return { ok: false, reason: 'no-shell' };
  const source = opts.source || 'return';
  el.dataset.heroLayer = 'entrance';
  const cam = requestBaselineCamera();
  window.dispatchEvent(new CustomEvent('teamai:hero-layer-change', {
    detail: {
      layer: 'entrance',
      cameraId: WORLD_BASELINE,
      source,
      presentationOnly: true,
      notSecondRuntime: true,
    },
  }));
  return { ok: true, layer: 'entrance', camera: cam, source };
}

export function getHeroLayer() {
  const el = shell();
  return el?.dataset.heroLayer || 'entrance';
}

function bind() {
  window.addEventListener('teamai:web-ai-hero-engine-open', () => {
    enterMachineLayer({ source: 'hero-engine-open' });
  });

  document.getElementById('demo-toggle')?.addEventListener('click', () => {
    if (getHeroLayer() !== 'machine') enterMachineLayer({ source: 'demo-toggle' });
  });

  document.querySelectorAll('[data-hero-layer-return]').forEach((btn) => {
    btn.addEventListener('click', () => {
      returnToEntranceLayer({ source: 'data-hero-layer-return' });
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
}

window.TeamAiHeroLayerHandoff = {
  enterMachineLayer,
  returnToEntranceLayer,
  getHeroLayer,
  WORLD_BASELINE,
};
