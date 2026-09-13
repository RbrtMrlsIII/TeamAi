/* 029 Experience Rebaseline controller: explicit classic entrance -> 3D world. */

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

function bindAuthButtons() {
  document.querySelectorAll('[data-auth-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById('hero-auth-panel');
      if (!panel) return;
      panel.hidden = false;
      panel.classList.add('is-open');
      panel.querySelector('input')?.focus();
    });
  });
  document.querySelectorAll('[data-auth-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById('hero-auth-panel');
      if (!panel) return;
      panel.classList.remove('is-open');
      panel.hidden = true;
    });
  });
}

function bind() {
  const el = shell();
  if (!el) return;

  // /hero/ is the direct world surface. Establish both route and presentation
  // layer together so the world controls are usable on direct load.
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
