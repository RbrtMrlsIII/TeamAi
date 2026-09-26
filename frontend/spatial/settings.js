/* TEAM-EXPERIENCE-029 — Settings composition companion
 * Presentation only. Exposes unified visual preferences and backend-owned configuration boundaries.
 * Must not: Firestore, provider calls, scheduler selection, entitlements, PayPal, account mutation, durable config writes.
 */

const SETTINGS_SECTIONS = {
  appearance: {
    title: "Appearance",
    summary: "The single theme root controls visual mode, source, density, and motion.",
    status: "local preview",
  },
  team: {
    title: "Web AI Team",
    summary: "Seat and provider bindings are inspected here; authoritative connection and entitlement state remains system-owned.",
    status: "system-owned",
  },
  execution: {
    title: "Execution boundaries",
    summary: "Scheduler, task state, approval gates, provider runtime, and tools remain authoritative outside this visual.",
    status: "backend-owned",
  },
};

let settingsBuilt = false;
let activeSettingsSection = "appearance";

function currentVisualFacts() {
  const root = document.documentElement;
  return {
    mode: root.getAttribute("data-theme-mode") || "dark",
    source: root.getAttribute("data-theme-source") || "user",
    density: root.getAttribute("data-density") || "default",
    motion: root.getAttribute("data-motion") || "full",
  };
}

function buildSettings() {
  if (settingsBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "ta-settings-page";
  section.dataset.composition = "settings";
  section.dataset.settingsRoot = "";
  section.hidden = true;
  section.setAttribute("aria-labelledby", "settings-title");
  section.innerHTML = `
    <div class="ta-settings__nav ta-panel" data-field="F3" aria-label="Settings sections">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Configuration boundary</p>
          <h1 id="settings-title" class="ta-type-title">Settings</h1>
        </div>
        <span class="ta-type-meta">3 sections</span>
      </div>
      <p class="ta-type-body">Inspect TeamAi presentation preferences and the boundaries of system-owned configuration. Selecting a section changes presentation only.</p>
      <ul class="ta-settings-list" role="list">
        ${Object.entries(SETTINGS_SECTIONS).map(([id, item], index) => `
          <li>
            <button type="button" class="ta-card ta-settings-card" data-settings-section="${id}" aria-pressed="${index === 0 ? "true" : "false"}">
              <span class="ta-type-title">${item.title}</span>
              <span class="ta-type-meta">${item.status}</span>
              <span class="ta-type-body">${item.summary}</span>
            </button>
          </li>
        `).join("")}
      </ul>
    </div>

    <section class="ta-settings__detail ta-panel" data-field="F3" data-elevation="e3" aria-labelledby="settings-detail-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Selected settings area</p>
          <h2 id="settings-detail-title" class="ta-type-title" data-settings-title>Appearance</h2>
        </div>
        <span class="ta-type-status" data-settings-status>local preview</span>
      </div>

      <dl class="ta-settings__facts">
        <div><dt class="ta-type-meta">Theme mode</dt><dd class="ta-type-body" data-setting-mode>dark</dd></div>
        <div><dt class="ta-type-meta">Theme source</dt><dd class="ta-type-body" data-setting-source>user</dd></div>
        <div><dt class="ta-type-meta">Density</dt><dd class="ta-type-body" data-setting-density>default</dd></div>
        <div><dt class="ta-type-meta">Motion</dt><dd class="ta-type-body" data-setting-motion>full</dd></div>
        <div><dt class="ta-type-meta">Configuration authority</dt><dd class="ta-type-body" data-setting-authority>Theme root for visual preference; backend/system services for team, provider, scheduler, entitlement, and billing facts.</dd></div>
      </dl>

      <div class="ta-settings__preview-grid">
        <section class="ta-card ta-settings__preview-card" data-field="F4" aria-labelledby="settings-preview-title">
          <h3 id="settings-preview-title" class="ta-type-label">Preview behavior</h3>
          <p class="ta-type-body" data-settings-preview>Visual preference previews are reflected in the unified theme root only.</p>
        </section>
        <section class="ta-card ta-settings__preview-card" data-field="F4" aria-labelledby="settings-boundary-title">
          <h3 id="settings-boundary-title" class="ta-type-label">What this visual does not do</h3>
          <p class="ta-type-body">It does not write Firestore, change a provider connection, select a scheduler actor, alter entitlements, charge PayPal, or mutate account configuration.</p>
        </section>
      </div>

      <div class="ta-settings__controls">
        <button type="button" class="ta-control" data-field="F5" data-action="settings-refresh">Refresh displayed facts</button>
        <button type="button" class="ta-control" data-field="F5" data-action="settings-preview" data-kind="primary">Preview current settings</button>
        <button type="button" class="ta-control" data-field="F5" data-action="settings-back-to-deck">Back to Deck</button>
      </div>
      <p class="ta-type-meta ta-settings__result" data-settings-result role="status">Presentation only. No durable configuration was changed.</p>
    </section>
  `;

  main.insertAdjacentElement("afterbegin", section);

  section.querySelectorAll("[data-settings-section]").forEach((card) => {
    card.addEventListener("click", () => selectSettingsSection(card.getAttribute("data-settings-section") || "appearance"));
  });
  section.querySelector('[data-action="settings-refresh"]')?.addEventListener("click", refreshSettingsFacts);
  section.querySelector('[data-action="settings-preview"]')?.addEventListener("click", () => {
    const facts = currentVisualFacts();
    const result = section.querySelector("[data-settings-result]");
    if (result) result.textContent = `Preview refreshed: ${facts.mode} mode · ${facts.source} source · ${facts.density} density · ${facts.motion} motion. No durable configuration was changed.`;
  });
  section.querySelector('[data-action="settings-back-to-deck"]')?.addEventListener("click", () => {
    document.querySelector('[data-nav="deck"]')?.click();
  });

  settingsBuilt = true;
  refreshSettingsFacts();
}

function refreshSettingsFacts() {
  const facts = currentVisualFacts();
  const set = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  set("[data-setting-mode]", facts.mode);
  set("[data-setting-source]", facts.source);
  set("[data-setting-density]", facts.density);
  set("[data-setting-motion]", facts.motion);
}

function selectSettingsSection(sectionId) {
  const id = SETTINGS_SECTIONS[sectionId] ? sectionId : "appearance";
  activeSettingsSection = id;
  const item = SETTINGS_SECTIONS[id];
  document.querySelectorAll("[data-settings-section]").forEach((card) => {
    card.setAttribute("aria-pressed", card.getAttribute("data-settings-section") === id ? "true" : "false");
  });
  const title = document.querySelector("[data-settings-title]");
  const status = document.querySelector("[data-settings-status]");
  const preview = document.querySelector("[data-settings-preview]");
  if (title) title.textContent = item.title;
  if (status) status.textContent = item.status;
  if (preview) preview.textContent = item.summary;
  refreshSettingsFacts();
}

function showSettings() {
  buildSettings();
  document.querySelectorAll("[data-composition]").forEach((node) => {
    if (node.hasAttribute("data-settings-root")) node.hidden = false;
    else node.hidden = true;
  });
  document.querySelector('[data-offdeck-root]')?.setAttribute("hidden", "");
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    if (btn.getAttribute("data-nav") === "settings") btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  const menu = document.querySelector("[data-nav-menu]");
  if (menu) menu.value = "settings";
  selectSettingsSection(activeSettingsSection);
}

function hideSettings() {
  document.querySelector("[data-settings-root]")?.setAttribute("hidden", "");
}

function wireSettingsNavigation() {
  buildSettings();
  document.querySelectorAll('[data-nav="settings"]').forEach((btn) => btn.addEventListener("click", showSettings));
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    if (event.target.value === "settings") showSettings();
    else hideSettings();
  });
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    if (btn.getAttribute("data-nav") !== "settings") btn.addEventListener("click", hideSettings);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireSettingsNavigation);
else wireSettingsNavigation();
