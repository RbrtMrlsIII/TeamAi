/**
 * V2.3–V2.6 settings shell (Vision).
 * Owner: theme-root via documentElement only (theme, motion, scale, language scaffold).
 * Presentation only · no 029-released claim · Issue #214
 */
import {
  applyDocumentTheme,
  persistTheme,
  readMotion,
  readDensity,
  readSource,
  readStoredMode,
  resolveMode,
  initializeTheme,
  readScale,
  applyUiScale,
  readLang,
  applyUiLang,
  SUPPORTED_UI_LANGS,
} from '../frontend/spatial/theme-root.js';

export const SETTINGS_SHELL_ID = 'hero-settings-shell';

export function resolveSettingsShellMount(root = document) {
  const explicit = root.querySelector('[data-settings-shell]');
  if (explicit) return explicit;
  const nav = root.querySelector('.machine-nav');
  if (nav && nav.parentElement) return nav.parentElement;
  return root.querySelector('.seat-stack');
}

export function buildSettingsShellButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'machine-nav__settings';
  btn.id = SETTINGS_SHELL_ID;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'hero-settings-panel');
  btn.textContent = 'Settings';
  return btn;
}

export function buildSettingsShellPanel() {
  const panel = document.createElement('div');
  panel.id = 'hero-settings-panel';
  panel.className = 'hero-settings-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'General settings');
  panel.innerHTML = `
    <p class="hero-settings-panel__kicker">General (presentation)</p>
    <p class="hero-settings-panel__note">Theme, language, and UI scale use the single document theme root. Full settings remain on the application settings surface.</p>
    <div class="hero-settings-panel__row">
      <button type="button" data-settings-theme="dark">Dark</button>
      <button type="button" data-settings-theme="light">Light</button>
    </div>
    <div class="hero-settings-panel__row">
      <button type="button" data-settings-motion="full">Motion full</button>
      <button type="button" data-settings-motion="reduced">Motion reduced</button>
    </div>
    <div class="hero-settings-panel__row hero-settings-panel__scale">
      <label for="hero-ui-scale">UI scale
        <input id="hero-ui-scale" type="range" min="0.85" max="1.35" step="0.05" data-settings-scale />
      </label>
      <span data-settings-scale-value aria-live="polite">100%</span>
    </div>
    <div class="hero-settings-panel__row hero-settings-panel__lang">
      <label for="hero-ui-lang">Language
        <select id="hero-ui-lang" data-settings-lang>
          <option value="en">English</option>
        </select>
      </label>
      <span class="hero-settings-panel__lang-note">Scaffold — copy catalog pending</span>
    </div>
  `;
  return panel;
}

function applyThemeMode(mode) {
  const next = mode === 'light' ? 'light' : 'dark';
  applyDocumentTheme({
    mode: next,
    source: 'user',
    motion: readMotion(),
    density: readDensity(),
  });
  persistTheme({ mode: next, source: 'user' });
  document.dispatchEvent(
    new CustomEvent('teamai:theme-mode', {
      detail: { mode: next, source: 'v2.4-settings-shell', presentationOnly: true },
      bubbles: true,
    }),
  );
  syncSettingsShellPressed();
}

function applyMotion(motion) {
  const next = motion === 'reduced' ? 'reduced' : 'full';
  const source = readSource();
  applyDocumentTheme({
    mode: resolveMode(source, readStoredMode()),
    source,
    motion: next,
    density: readDensity(),
  });
  persistTheme({ motion: next });
  document.dispatchEvent(
    new CustomEvent('teamai:motion-pref', {
      detail: { motion: next, source: 'v2.4-settings-shell', presentationOnly: true },
      bubbles: true,
    }),
  );
  syncSettingsShellPressed();
}

export function syncSettingsShellPressed(root = document) {
  const panel = root.getElementById?.('hero-settings-panel') || root.querySelector?.('#hero-settings-panel');
  if (!panel) return;
  const mode = document.documentElement.getAttribute('data-theme-mode') || 'dark';
  const motion = document.documentElement.getAttribute('data-motion') || 'full';
  for (const btn of panel.querySelectorAll('[data-settings-theme]')) {
    btn.setAttribute('aria-pressed', btn.getAttribute('data-settings-theme') === mode ? 'true' : 'false');
  }
  for (const btn of panel.querySelectorAll('[data-settings-motion]')) {
    btn.setAttribute('aria-pressed', btn.getAttribute('data-settings-motion') === motion ? 'true' : 'false');
  }
  const scale = readScale();
  const input = panel.querySelector('[data-settings-scale]');
  if (input) input.value = String(scale);
  const label = panel.querySelector('[data-settings-scale-value]');
  if (label) label.textContent = Math.round(scale * 100) + '%';
  const langSel = panel.querySelector('[data-settings-lang]');
  if (langSel) langSel.value = readLang();
}

export function mountSettingsShell(root = document) {
  const mount = resolveSettingsShellMount(root);
  if (!mount) return null;
  if (root.getElementById?.(SETTINGS_SHELL_ID) || mount.querySelector?.('#' + SETTINGS_SHELL_ID)) {
    return mount.querySelector('#' + SETTINGS_SHELL_ID);
  }

  const btn = buildSettingsShellButton();
  const panel = buildSettingsShellPanel();
  const wrap = document.createElement('div');
  wrap.className = 'hero-settings-shell';
  wrap.dataset.settingsShellChrome = '1';
  wrap.appendChild(btn);
  wrap.appendChild(panel);

  const machineNav = mount.querySelector('.machine-nav');
  if (machineNav && machineNav.nextSibling) {
    mount.insertBefore(wrap, machineNav.nextSibling);
  } else if (machineNav) {
    machineNav.after(wrap);
  } else {
    mount.insertBefore(wrap, mount.firstChild);
  }

  btn.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    root.documentElement?.setAttribute?.('data-settings-open', open ? '1' : '0');
    root.dispatchEvent(
      new CustomEvent('teamai:settings-shell', {
        detail: { open, source: 'v2.6-settings-shell', presentationOnly: true },
        bubbles: true,
      }),
    );
  });

  panel.addEventListener('click', (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    const theme = t.getAttribute('data-settings-theme');
    const motion = t.getAttribute('data-settings-motion');
    if (theme) applyThemeMode(theme);
    if (motion) applyMotion(motion);
  });

  panel.addEventListener('input', (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    if (!t.hasAttribute('data-settings-scale')) return;
    const next = applyUiScale(t.value);
    persistTheme({ scale: next });
    const label = panel.querySelector('[data-settings-scale-value]');
    if (label) label.textContent = Math.round(next * 100) + '%';
    document.dispatchEvent(
      new CustomEvent('teamai:ui-scale', {
        detail: { scale: next, source: 'v2.5-settings-shell', presentationOnly: true },
        bubbles: true,
      }),
    );
  });

  panel.addEventListener('change', (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    if (!t.hasAttribute('data-settings-lang')) return;
    const next = applyUiLang(t.value);
    persistTheme({ lang: next });
    document.dispatchEvent(
      new CustomEvent('teamai:ui-lang', {
        detail: { lang: next, supported: [...SUPPORTED_UI_LANGS], source: 'v2.6-settings-shell', presentationOnly: true },
        bubbles: true,
      }),
    );
  });

  return btn;
}

if (typeof document !== 'undefined') {
  const boot = () => {
    try { initializeTheme(); } catch (_) {}
    mountSettingsShell(document);
    syncSettingsShellPressed(document);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(boot, 0);
    });
  } else {
    setTimeout(boot, 0);
  }
}
