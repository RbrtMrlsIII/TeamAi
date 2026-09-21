/* 029 Experience Rebaseline controller: explicit classic entrance -> 3D world. */
import { getFrontendFeature, getGuestPresentationState, listFrontendFeatures } from './feature-registry.js';
import { resolveFeatureAccess } from './feature-access.js';
import { featureStateMetadata, featureStatePrecedence, normalizeFeatureState, resolveFeaturePresentationState } from './feature-state.js';

const shell = () => document.querySelector('.hero-shell');

function isWorldRoute() {
  const path = window.location?.pathname || '/';
  return /\/hero\/?$/.test(path);
}

function setExperience(mode, source) {
  const el = shell();
  if (!el) return;
  el.dataset.experience = mode;
  window.dispatchEvent(new CustomEvent('teamai:experience-change', {
    detail: { mode, source, presentationOnly: true },
  }));
}

function enterWorld(source = 'classic-enter') {
  const el = shell();
  if (!el) return { ok: false, reason: 'no-shell' };
  const handoff = window.TeamAiHeroLayerHandoff;
  if (typeof handoff?.enterMachineLayer === 'function') {
    handoff.enterMachineLayer({ source });
  } else {
    el.dataset.heroLayer = 'machine';
  }
  setExperience('world', source);
  return { ok: true, mode: 'world' };
}

function returnClassic(source = 'world-return') {
  const el = shell();
  if (!el) return { ok: false, reason: 'no-shell' };
  const handoff = window.TeamAiHeroLayerHandoff;
  if (typeof handoff?.returnToEntranceLayer === 'function') {
    handoff.returnToEntranceLayer({ source });
  } else {
    el.dataset.heroLayer = 'entrance';
  }
  setExperience('classic', source);
  return { ok: true, mode: 'classic' };
}

function toggleMenu(button, popover) {
  const open = !popover.classList.contains('is-open');
  popover.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
}

function openSettings() {
  const btn = document.getElementById('hero-settings-shell');
  if (btn instanceof HTMLButtonElement) {
    btn.click();
    return true;
  }
  document.dispatchEvent(new CustomEvent('teamai:settings-request', {
    detail: { source: '029-experience-nav', presentationOnly: true },
    bubbles: true,
  }));
  return false;
}

function publishFeatureRegistry() {
  window.TeamAiFeatureRegistry = Object.freeze({
    list: () => listFrontendFeatures(),
    get: (id) => getFrontendFeature(id),
    guestState: (id) => getGuestPresentationState(id),
  });
  window.TeamAiFeatureAccess = Object.freeze({
    guest: (id) => resolveFeatureAccess(id, { authenticated: false }),
    authenticated: (id) => resolveFeatureAccess(id, { authenticated: true }),
  });
  window.TeamAiFeatureState = Object.freeze({
    states: () => featureStatePrecedence(),
    normalize: (value, fallback) => normalizeFeatureState(value, fallback),
    resolve: (states) => resolveFeaturePresentationState(states),
    metadata: (state) => featureStateMetadata(state),
  });
}

function dispatchFeatureIntent(button, source) {
  const featureId = button?.dataset?.featureId;
  if (!featureId) return null;
  const feature = getFrontendFeature(featureId);
  if (!feature) return null;
  const guestState = getGuestPresentationState(feature);
  const detail = {
    featureId: feature.id,
    label: feature.label,
    source,
    featureState: normalizeFeatureState(button?.dataset?.featureState || 'INACTIVE'),
    guestState: guestState?.presentation || null,
    guestAccess: resolveFeatureAccess(feature.id, { authenticated: false }),
    presentationOnly: true,
  };
  window.dispatchEvent(new CustomEvent('teamai:feature-intent', { detail }));
  return detail;
}

function bindAuthButtons() {
  document.querySelectorAll('[data-auth-open]').forEach((button) => {
    button.addEventListener('click', () => {
      dispatchFeatureIntent(button, 'experience-auth');
      if (typeof window.TeamAiHeroAuthHandoff?.open === 'function') {
        window.TeamAiHeroAuthHandoff.open();
        return;
      }
      window.dispatchEvent(new CustomEvent('teamai:auth-open-request', {
        detail: { source: 'experience-rebaseline', presentationOnly: true },
      }));
    });
  });
  document.querySelectorAll('[data-auth-close]').forEach((button) => {
    button.addEventListener('click', () => {
      if (typeof window.TeamAiHeroAuthHandoff?.close === 'function') {
        window.TeamAiHeroAuthHandoff.close();
        return;
      }
      window.dispatchEvent(new CustomEvent('teamai:auth-close-request', {
        detail: { source: 'experience-rebaseline', presentationOnly: true },
      }));
    });
  });
}

function bind() {
  const el = shell();
  if (!el) return;
  publishFeatureRegistry();

  // /hero/ is the direct world surface. Establish both route and presentation
  // layer together so the world controls are usable on direct load.
  document.querySelectorAll('[data-feature-id]').forEach((button) => {
    if (!button.dataset.featureState) button.dataset.featureState = 'INACTIVE';
  });

  if (isWorldRoute()) {
    el.dataset.heroLayer = 'machine';
    el.dataset.experience = 'world';
  } else {
    el.dataset.heroLayer = 'entrance';
    el.dataset.experience = 'classic';
  }

  document.querySelectorAll('[data-world-entry]').forEach((button) => {
    button.addEventListener('click', () => enterWorld(button.dataset.worldEntry || 'classic-enter'));
  });

  document.querySelectorAll('[data-classic-return]').forEach((button) => {
    button.addEventListener('click', () => returnClassic(button.dataset.classicReturn || 'world-return'));
  });

  document.querySelectorAll('[data-world-menu-toggle]').forEach((button) => {
    const popoverId = button.getAttribute('aria-controls');
    const popover = popoverId ? document.getElementById(popoverId) : null;
    if (!popover) return;
    button.addEventListener('click', () => toggleMenu(button, popover));
  });

  document.querySelectorAll('[data-world-camera-request]').forEach((button) => {
    button.addEventListener('click', () => {
      dispatchFeatureIntent(button, 'experience-world-menu');
      const cameraId = button.dataset.worldCameraRequest;
      if (cameraId && typeof window.TeamAiHero?.setCamera === 'function') {
        window.TeamAiHero.setCamera(cameraId);
      }
    });
  });

  document.querySelectorAll('[data-settings-open]').forEach((button) => {
    button.addEventListener('click', openSettings);
  });

  bindAuthButtons();

  window.addEventListener('teamai:hero-layer-change', (event) => {
    const layer = event.detail?.layer;
    if (layer === 'machine') setExperience('world', 'hero-layer-change');
    if (layer === 'entrance') setExperience('classic', 'hero-layer-change');
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, { once: true });
  } else {
    bind();
  }
}

window.TeamAiExperience = {
  enterWorld,
  returnClassic,
  getMode: () => shell()?.dataset.experience || 'classic',
};
