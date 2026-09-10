/**
 * V2.3 — Settings shell control beside machine chrome (Vision).
 * Owner: existing theme-root / settings surface — button + panel scaffold only.
 * Does not invent a second theme root. Presentation only · no 029-released claim · Issue #214
 */

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
  `;
  return panel;
}

function applyThemeMode(mode) {
  const root = document.documentElement;
  root.setAttribute('data-theme-mode', mode === 'light' ? 'light' : 'dark');
  root.dispatchEvent(
    new CustomEvent('teamai:theme-mode', {
      detail: { mode: root.getAttribute('data-theme-mode'), source: 'v2.3-settings-shell', presentationOnly: true },
      bubbles: true,
    }),
  );
}

function applyMotion(motion) {
  const root = document.documentElement;
  root.setAttribute('data-motion', motion === 'reduced' ? 'reduced' : 'full');
  root.dispatchEvent(
    new CustomEvent('teamai:motion-pref', {
      detail: { motion: root.getAttribute('data-motion'), source: 'v2.3-settings-shell', presentationOnly: true },
      bubbles: true,
    }),
  );
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
        detail: { open, source: 'v2.3-settings-shell', presentationOnly: true },
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

  return btn;
}

if (typeof document !== 'undefined') {
  const boot = () => mountSettingsShell(document);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(boot, 0);
    });
  } else {
    setTimeout(boot, 0);
  }
}
