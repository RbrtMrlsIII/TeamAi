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
} from './theme-root.js';

export const SETTINGS_SHELL_ID = 'hero-settings-shell';

const SEMANTIC_SETTINGS_REFERENCES = Object.freeze([
  Object.freeze({ id: 'TREE-SETTINGS', label: 'Settings', responsibility: 'Cross-cutting presentation/account controls', branches: Object.freeze(['appearance', 'account', 'controls']) }),
  Object.freeze({ id: 'TREE-WORLD', label: 'World', responsibility: 'Spatial machine overview and Seat population', branches: Object.freeze(['workspace', 'seats', 'camera']) }),
  Object.freeze({ id: 'TREE-SEAT', label: 'Seat', responsibility: 'Web AI Seat operational machine', branches: Object.freeze(['SEAT_SHELL', 'SEAT_CONNECTION', 'SEAT_BEHAVIOR', 'SEAT_TOOLKIT']) }),
  Object.freeze({ id: 'TREE-CAPABILITY', label: 'Capability', responsibility: 'Available mechanisms and capability state', branches: Object.freeze(['discover', 'inspect', 'configure', 'equip']) }),
  Object.freeze({ id: 'TREE-AUTHORIZATION', label: 'Authorization', responsibility: 'Permitted control and reason-bearing readiness', branches: Object.freeze(['authorized', 'entitled', 'allowed']) }),
  Object.freeze({ id: 'TREE-WORKSPACE', label: 'Workspace', responsibility: 'Workplace/project/repository/runtime scope', branches: Object.freeze(['workplace', 'project', 'repository', 'scope']) }),
  Object.freeze({ id: 'TREE-ORCHESTRATION', label: 'Orchestration', responsibility: 'Active turn and next-eligible Seat', branches: Object.freeze(['turn', 'next-seat', 'scheduler']) }),
  Object.freeze({ id: 'TREE-EVIDENCE', label: 'Evidence', responsibility: 'Results, artifacts, and history', branches: Object.freeze(['results', 'artifacts', 'history']) }),
  Object.freeze({ id: 'TREE-COMMERCE', label: 'Commerce', responsibility: 'Billing and entitlement projection', branches: Object.freeze(['billing', 'entitlement']) }),
]);


export function resolveSettingsShellMount(root = document) {
  const explicit = root.querySelector('[data-settings-shell]');
  if (explicit) return explicit;
  return root.querySelector('.seat-stack');
}

export function buildSettingsShellButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'hero-settings-button';
  btn.id = SETTINGS_SHELL_ID;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'hero-settings-panel');
  btn.textContent = 'Settings';
  return btn;
}


function wireSmoke(root = document) {
  const panel = root.getElementById?.('hero-settings-panel') || root.querySelector?.('#hero-settings-panel');
  if (!panel || panel.dataset.smokeWired === '1') return;
  panel.dataset.smokeWired = '1';
  const apply = panel.querySelector('[data-smoke-camera-apply]');
  const select = panel.querySelector('[data-smoke-camera]');
  const status = panel.querySelector('[data-smoke-camera-status]');
  apply?.addEventListener('click', () => {
    const id = select?.value || 'HERO_WIDE';
    const hero = window.TeamAiHero;
    if (hero && typeof hero.setCamera === 'function') hero.setCamera(id);
    if (status) status.textContent = 'looking at ' + id;
  });
}

function renderSemanticSettingsReference(panel, referenceId = 'TREE-SETTINGS') {
  const reference = SEMANTIC_SETTINGS_REFERENCES.find((item) => item.id === referenceId) || SEMANTIC_SETTINGS_REFERENCES[0];
  panel.querySelectorAll('[data-settings-semantic-ref]').forEach((button) => {
    button.setAttribute('aria-pressed', button.getAttribute('data-settings-semantic-ref') === reference.id ? 'true' : 'false');
  });
  const title = panel.querySelector('[data-settings-semantic-title]');
  const responsibility = panel.querySelector('[data-settings-semantic-responsibility]');
  const branches = panel.querySelector('[data-settings-semantic-branches]');
  if (title) title.textContent = reference.id + ' · ' + reference.label;
  if (responsibility) responsibility.textContent = reference.responsibility;
  if (branches) {
    branches.replaceChildren();
    reference.branches.forEach((branch) => {
      const item = document.createElement('li');
      item.textContent = branch;
      branches.append(item);
    });
  }
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
    <section class="hero-settings-panel__semantic" aria-labelledby="hero-settings-semantic-title">
      <div class="hero-settings-panel__kicker">Semantic navigation</div>
      <p id="hero-settings-semantic-title" class="hero-settings-panel__note">Existing Product Law tree references. Presentation crosswalk only.</p>
      <div class="hero-settings-panel__semantic-grid">
        <nav aria-label="Semantic tree references">
          <div class="hero-settings-panel__semantic-list">
            ${SEMANTIC_SETTINGS_REFERENCES.map((item, index) => '<button type="button" data-settings-semantic-ref="' + item.id + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' + item.id + '</button>').join('')}
          </div>
        </nav>
        <div class="hero-settings-panel__semantic-detail" aria-live="polite">
          <strong data-settings-semantic-title>TREE-SETTINGS · Settings</strong>
          <span data-settings-semantic-responsibility>Cross-cutting presentation/account controls</span>
          <ul data-settings-semantic-branches>
            <li>appearance</li>
            <li>account</li>
            <li>controls</li>
          </ul>
          <small>References do not grant authorization, entitlement, execution, or durable-state authority.</small>
        </div>
      </div>
    </section>

    <div class="hero-settings-panel__row hero-settings-panel__lang">
      <label for="hero-ui-lang">Language
        <select id="hero-ui-lang" data-settings-lang>
          <option value="en">English</option>
        </select>
      </label>
      <span class="hero-settings-panel__lang-note">Scaffold — copy catalog pending</span>
    </div>
    <div class="hero-settings-panel__row hero-settings-panel__smoke" data-smoke-panel>
      <p class="hero-settings-panel__kicker">Smoke (presentation)</p>
      <p class="hero-settings-panel__note">Display-only. Does not walk product stages. Camera uses exact dock id. Animation uses motion on/off.</p>
      <label for="hero-smoke-camera">Camera
        <select id="hero-smoke-camera" data-smoke-camera>
          <option value="HERO_WIDE">HERO_WIDE</option>
          <option value="SEAT_CLOSE">SEAT_CLOSE</option>
          <option value="WORKSPACE_CLOSE">WORKSPACE_CLOSE</option>
          <option value="DETAIL_ANCHOR">DETAIL_ANCHOR</option>
        </select>
      </label>
      <button type="button" data-smoke-camera-apply>Look at id</button>
      <span data-smoke-camera-status aria-live="polite"></span>
    </div>

  `;
  queueMicrotask(() => wireSmoke(document));
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

  mount.insertBefore(wrap, mount.firstChild);
  
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
    const semanticRef = t.closest?.('[data-settings-semantic-ref]')?.getAttribute('data-settings-semantic-ref');
    if (semanticRef) {
      renderSemanticSettingsReference(panel, semanticRef);
      return;
    }
    const theme = t.getAttribute('data-settings-theme');
    const motion = t.getAttribute('data-settings-motion');
    if (theme) applyThemeMode(theme);
    if (motion) applyMotion(motion);
  });
  renderSemanticSettingsReference(panel);

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
