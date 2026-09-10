/**
 * V3.4 — Get-started → machine baseline handoff (Layer A → Layer B).
 * Owners: .hero-shell data-hero-layer · existing HERO_WIDE camera control · auth engine-open event.
 * Presentation only · one Hero instance · no second WebGL · no 029-released claim.
 */

const WORLD_BASELINE = 'HERO_WIDE';

function shell() {
  return document.querySelector('.hero-shell');
}

function requestBaselineCamera() {
  const btn = document.querySelector(`[data-camera="${WORLD_BASELINE}"]`);
  if (btn && typeof btn.click === 'function') {
    btn.click();
    return { via: 'data-camera', id: WORLD_BASELINE };
  }
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
  el.dataset.heroMachineUi = '1';
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
  delete el.dataset.heroMachineUi;
  // Keep world baseline readable on return
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
  // Open engine / get-started: enter machine baseline first (auth panel may still open via existing handoff)
  window.addEventListener('teamai:web-ai-hero-engine-open', () => {
    enterMachineLayer({ source: 'hero-engine-open' });
  });

  // Demo turn loop also implies machine experience
  document.getElementById('demo-toggle')?.addEventListener('click', () => {
    if (getHeroLayer() !== 'machine') enterMachineLayer({ source: 'demo-toggle' });
  });

  // Inspection reset → restore entrance presentation (same Hero instance)
  document.querySelectorAll('[data-inspection-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      returnToEntranceLayer({ source: 'inspection-reset' });
    });
  });

  // Wide control while already on machine may stay machine; long-press not required —
  // explicit return is inspection-reset / returnToEntranceLayer API.
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
