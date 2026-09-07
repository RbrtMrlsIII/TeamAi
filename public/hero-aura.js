import { mapHeroThemeLighting } from '../frontend/spatial/hero-theme-lighting-adapter.js';

const shell = document.querySelector('.hero-shell');
const root = document.documentElement;

if (shell) {
  const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));

  const sync = () => {
    const n = Math.max(1, Math.min(8, Number(window.TeamAiHero?.getSeatCount?.()) || 1));
    const density = (n - 1) / 7;
    const state = shell.dataset.state || 'IDLE';
    const themeMode = root.dataset.themeMode === 'dark' ? 'dark' : 'light';
    const themeSource = root.dataset.themeSource || 'default';
    const reducedMotion = root.dataset.motion === 'reduced'
      || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    const semantic = {
      themeMode,
      themeSource,
      atmosphere: clamp01(.48 + density * .28),
      surface: clamp01(.58 + density * .12),
      focus: clamp01(state === 'FOCUS' ? .72 : state === 'ACTIVE' || state === 'CONTRIBUTE' ? .9 : 0),
      signal: clamp01(state === 'CONTRIBUTE' ? 1 : state === 'ABSORB' || state === 'REFLECT' ? .78 : 0),
      status: clamp01(state === 'BLOCKED' ? .8 : state === 'UNAUTHORIZED' ? .55 : 0),
      reducedMotion,
    };
    const lighting = mapHeroThemeLighting(semantic);

    shell.dataset.seats = String(n);
    shell.style.setProperty('--hero-density', String(density));
    shell.style.setProperty('--hero-seat-glow', String(.10 + density * .13));
    shell.style.setProperty('--hero-light-fill', String(lighting.environmentalFillIntensity));
    shell.style.setProperty('--hero-light-key', String(lighting.keyLight.intensity));
    shell.style.setProperty('--hero-light-grazing', String(lighting.grazingRimStrength));
    shell.style.setProperty('--hero-light-contribution', String(lighting.contributionLightBaseIntensity));
    shell.style.setProperty('--hero-light-roughness', String(lighting.roughness));
    shell.style.setProperty('--hero-light-reflectance', String(lighting.reflectance));
    shell.style.setProperty('--hero-light-shadow', String(lighting.shadowSeparationStrength));
    shell.style.setProperty('--hero-light-emissive', String(lighting.emissiveCeilingFloor));
    shell.style.setProperty('--hero-light-dir-x', String(lighting.keyLight.direction[0]));
    shell.style.setProperty('--hero-light-dir-y', String(lighting.keyLight.direction[1]));
    shell.style.setProperty('--hero-light-dir-z', String(lighting.keyLight.direction[2]));
    shell.style.setProperty('--hero-light-motion', lighting.reducedMotionChoreography ? '1' : '0');
  };

  const onUnlock = () => sync();
  const onMotionOrTheme = () => sync();

  window.addEventListener('teamai:web-ai-seat-unlocked', onUnlock);
  window.addEventListener('teamai:hero-state-change', onMotionOrTheme);
  window.addEventListener('themechange', onMotionOrTheme);
  const motionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  motionMedia?.addEventListener?.('change', onMotionOrTheme);
  const observer = new MutationObserver(onMotionOrTheme);
  observer.observe(root, { attributes: true, attributeFilter: ['data-theme-mode', 'data-theme-source', 'data-motion'] });
  const timer = window.setInterval(sync, 240);

  window.addEventListener('beforeunload', () => {
    clearInterval(timer);
    observer.disconnect();
    motionMedia?.removeEventListener?.('change', onMotionOrTheme);
    window.removeEventListener('teamai:web-ai-seat-unlocked', onUnlock);
    window.removeEventListener('teamai:hero-state-change', onMotionOrTheme);
    window.removeEventListener('themechange', onMotionOrTheme);
  }, { once: true });

  sync();
}
