/**
 * TEAM-EXPERIENCE-029 — Shell + Navigation + Deck + Workplace + Seats + F7 + Approvals presentation scripts
 * May: theme, density, nav, stage, seat highlight, Workplace project selection, Seats/Provider detail, F7 clusters, Approvals queue/detail.
 * Must not: Firestore, PayPal, scheduler actor, entitlements, execute approved actions.
 */

import {
  applyDocumentTheme,
  initializeTheme,
  persistTheme,
  readDensity,
  readMotion,
  readSource,
  readStoredMode,
  resolveMode,
  watchOsTheme,
} from "./theme-root.js";

const NAV_LABELS = {
  deck: "Deck",
  workplace: "Workplace",
  seats: "Seats",
  planning: "Planning",
  working: "Working",
  artifacts: "Artifacts",
  approvals: "Approvals",
  settings: "Settings",
};

const SEAT_DATA = {
  alpha: {
    name: "Alpha",
    role: "planning",
    provider: "Provider One",
    model: "Model A",
    connection: "ready",
    health: "ok",
    teamQuality: "Planning skill bundle · base TeamAi capabilities",
    toolQuality: "Tool gateway pack · MCP workstation scope",
    limits: "Budget 80% · rate normal · storage 62% · approval gate required",
    teamEntitlement: "allowed",
    providerEntitlement: "allowed",
    capability: "Planning + review",
    eligible: true,
  },
  beta: {
    name: "Beta",
    role: "worker",
    provider: "Provider Two",
    model: "Model B",
    connection: "ready",
    health: "ok",
    teamQuality: "Working skill bundle · base TeamAi capabilities",
    toolQuality: "Tool gateway pack · execution scope configured",
    limits: "Budget 54% · rate normal · storage 48% · approval gate required",
    teamEntitlement: "allowed",
    providerEntitlement: "allowed",
    capability: "Working + tool use",
    eligible: true,
  },
  gamma: {
    name: "Gamma",
    role: "reviewer",
    provider: "Provider Three",
    model: "Model C",
    connection: "degraded",
    health: "degraded",
    teamQuality: "Review skill bundle · base TeamAi capabilities",
    toolQuality: "Tool gateway pack · restricted while recovery is needed",
    limits: "Budget 72% · rate reduced · storage 35% · approval gate required",
    teamEntitlement: "allowed",
    providerEntitlement: "review",
    capability: "Review only",
    eligible: false,
  },
};

const APPROVAL_DATA = {
  "runtime-alpha": {
    request: "Provider runtime invocation",
    task: "TASK-042 · Working task",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    impact: "Invoke the already-bound provider runtime for the eligible task using the project's execution capability.",
    scope: "Northstar Workplace / Command Deck project",
    waiting: "2 min ago",
    status: "waiting approval",
    gate: "Approval pending · runtime gate not yet opened",
    runs: "Provider runtime invocation for TASK-042, after authoritative approval and runtime checks.",
    notRuns: "No browser-side provider call, Firestore write, scheduler selection, entitlement mutation, or PayPal activity.",
  },
  "workspace-write": {
    request: "Workspace artifact write",
    task: "TASK-044 · Artifact preparation",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    impact: "Write the prepared artifact into the project-scoped workspace through the authorized tool path.",
    scope: "Northstar Workplace / Command Deck project workspace",
    waiting: "6 min ago",
    status: "waiting approval",
    gate: "Approval pending · tool policy and task state remain backend-owned",
    runs: "A project-scoped workspace tool invocation, only after the authoritative approval path permits it.",
    notRuns: "No direct filesystem write from this browser, no provider-to-provider control, and no entitlement or PayPal mutation.",
  },
  "review-export": {
    request: "Export review package",
    task: "TASK-046 · Review handoff",
    seat: "Gamma · reviewer",
    provider: "Provider Three · Model C",
    impact: "Prepare a bounded review package for export after the reviewer connection is revalidated.",
    scope: "Northstar Workplace / Command Deck review scope",
    waiting: "11 min ago",
    status: "blocked",
    gate: "Blocked · Gamma connection is degraded and requires recovery before execution",
    runs: "Nothing yet; recovery and capability revalidation must precede any execution eligibility.",
    notRuns: "No export, no provider request, no task transition, and no browser-side recovery bypass.",
  },
};

let lastFocus = null;
let focusTrapHandler = null;
let activeCluster = "action";
let activeProject = "command-deck";
let workplaceBuilt = false;
let seatsBuilt = false;
let approvalsBuilt = false;
let activeSeat = "alpha";
let activeApproval = "runtime-alpha";

function refreshThemeControls() {
  const mode = resolveMode(readSource(), readStoredMode());
  const themeBtn = document.querySelector('[data-action="toggle-theme"]');
  if (themeBtn) {
    themeBtn.textContent = mode === "dark" ? "Theme: Dark" : "Theme: Light";
    themeBtn.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
  }
  const densityBtn = document.querySelector('[data-action="toggle-density"]');
  if (densityBtn) {
    const density = readDensity();
    densityBtn.textContent = density === "compact" ? "Density: Compact" : "Density: Default";
    densityBtn.setAttribute("aria-pressed", density === "compact" ? "true" : "false");
  }
}

function syncCompactNavigation(destination) {
  const menu = document.querySelector("[data-nav-menu]");
  if (menu && menu.value !== destination) menu.value = destination;
}

function buildWorkplace() {
  if (workplaceBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "ta-workplace";
  section.dataset.composition = "workplace";
  section.dataset.workplaceRoot = "";
  section.hidden = true;
  section.setAttribute("aria-labelledby", "workplace-title");
  section.innerHTML = `
    <div class="ta-workplace__list ta-panel" data-field="F3" aria-label="Workplace projects">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Current Workplace</p>
          <h1 id="workplace-title" class="ta-type-title">Northstar Workplace</h1>
        </div>
        <span class="ta-type-meta">3 projects</span>
      </div>
      <p class="ta-type-body">Choose the project you want to operate. Selecting a project changes the presentation target only.</p>
      <ul class="ta-workplace__project-list" role="list">
        <li><button type="button" class="ta-card ta-project-card" data-project="command-deck" aria-pressed="true">
          <span class="ta-type-title">Command Deck</span>
          <span class="ta-type-meta">12 tasks · healthy</span>
          <span class="ta-type-status">active</span>
        </button></li>
        <li><button type="button" class="ta-card ta-project-card" data-project="atlas" aria-pressed="false">
          <span class="ta-type-title">Atlas Migration</span>
          <span class="ta-type-meta">8 tasks · healthy</span>
          <span class="ta-type-status">ready</span>
        </button></li>
        <li><button type="button" class="ta-card ta-project-card" data-project="recovery" aria-pressed="false">
          <span class="ta-type-title">Recovery Lab</span>
          <span class="ta-type-meta">3 tasks · degraded</span>
          <span class="ta-type-status">review</span>
        </button></li>
      </ul>
    </div>

    <section class="ta-workplace__detail ta-panel" data-field="F3" data-elevation="e3" aria-labelledby="workplace-detail-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Selected Project</p>
          <h2 id="workplace-detail-title" class="ta-type-title" data-project-title>Command Deck</h2>
        </div>
        <span class="ta-type-status" data-project-health>healthy</span>
      </div>
      <dl class="ta-workplace__facts">
        <div><dt class="ta-type-meta">Owner</dt><dd class="ta-type-body">TeamAi Workspace</dd></div>
        <div><dt class="ta-type-meta">Scope</dt><dd class="ta-type-body">Current workstation + configured Web AI Team</dd></div>
        <div><dt class="ta-type-meta">Team</dt><dd class="ta-type-body">Alpha · Beta · Gamma (display)</dd></div>
      </dl>
      <div class="ta-workplace__detail-actions">
        <button type="button" class="ta-control" data-field="F5" data-kind="primary" data-action="enter-project">Enter Project</button>
        <p class="ta-type-meta" data-project-result role="status"></p>
      </div>
      <p class="ta-type-meta">Presentation only. Entering a project returns to Deck; backend ownership remains authoritative.</p>
    </section>
  `;
  main.insertBefore(section, main.querySelector("[data-offdeck-root]"));

  section.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => selectProject(card.getAttribute("data-project") ?? "command-deck"));
  });
  section.querySelector('[data-action="enter-project"]')?.addEventListener("click", enterProject);
  workplaceBuilt = true;
}

function selectProject(projectId) {
  const id = projectId === "atlas" || projectId === "recovery" ? projectId : "command-deck";
  activeProject = id;
  const projectData = {
    "command-deck": { title: "Command Deck", health: "healthy" },
    atlas: { title: "Atlas Migration", health: "healthy" },
    recovery: { title: "Recovery Lab", health: "degraded" },
  }[id];
  document.querySelectorAll("[data-project]").forEach((card) => {
    const selected = card.getAttribute("data-project") === id;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  const title = document.querySelector("[data-project-title]");
  const health = document.querySelector("[data-project-health]");
  const result = document.querySelector("[data-project-result]");
  if (title) title.textContent = projectData.title;
  if (health) health.textContent = projectData.health;
  if (result) result.textContent = `${projectData.title} selected in UI only.`;
}

function enterProject() {
  const label = document.querySelector("[data-project-title]")?.textContent ?? "Project";
  const result = document.querySelector("[data-project-result]");
  if (result) result.textContent = `${label} entered in UI only — returning to Deck.`;
  showComposition("deck");
}

function seatActivationAllowed(seat) {
  return seat.connection === "ready" && seat.teamEntitlement === "allowed" && seat.providerEntitlement === "allowed";
}

function buildSeats() {
  if (seatsBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "ta-seats-page";
  section.dataset.composition = "seats";
  section.dataset.seatsRoot = "";
  section.hidden = true;
  section.setAttribute("aria-labelledby", "seats-title");
  section.innerHTML = `
    <div class="ta-seats__list ta-panel" data-field="F3" aria-label="Configured seats">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Configured Web AI Team</p>
          <h1 id="seats-title" class="ta-type-title">Seats / Provider</h1>
        </div>
        <span class="ta-type-meta">3 seats</span>
      </div>
      <p class="ta-type-body">Select a seat to inspect its binding and capability truth. Selection changes presentation only; scheduler eligibility stays backend-owned.</p>
      <ul class="ta-seat-page-list" role="list">
        ${Object.entries(SEAT_DATA).map(([id, seat], index) => `
          <li><button type="button" class="ta-card ta-seat-page-card" data-seat-page="${id}" data-seat="${id}" aria-pressed="${index === 0 ? "true" : "false"}">
            <span class="ta-type-title">${seat.name}</span>
            <span class="ta-type-meta">${seat.role} · ${seat.provider} · ${seat.model}</span>
            <span class="ta-type-status">${seat.health}</span>
            <span class="ta-type-meta">connection: ${seat.connection}</span>
          </button></li>
        `).join("")}
      </ul>
    </div>

    <section class="ta-seats__detail ta-panel" data-field="F3" data-elevation="e3" aria-labelledby="seat-detail-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Seat Plate</p>
          <h2 id="seat-detail-title" class="ta-type-title" data-seat-detail-title>Alpha</h2>
          <p class="ta-type-meta" data-seat-detail-binding>planning · Provider One · Model A</p>
        </div>
        <span class="ta-type-status" data-seat-detail-health>ok</span>
      </div>

      <dl class="ta-seat-identity">
        <div><dt class="ta-type-meta">Identity</dt><dd class="ta-type-body" data-seat-detail-identity>Alpha · planning</dd></div>
        <div><dt class="ta-type-meta">Binding</dt><dd class="ta-type-body" data-seat-detail-provider>Provider One · Model A</dd></div>
        <div><dt class="ta-type-meta">Connection</dt><dd class="ta-type-status" data-seat-detail-connection>ready</dd></div>
      </dl>

      <div class="ta-seat-columns">
        <section class="ta-seat-column ta-card" data-field="F4" aria-labelledby="seat-team-title">
          <h3 id="seat-team-title" class="ta-type-label">Team Quality</h3>
          <p class="ta-type-body" data-seat-team-quality>Planning skill bundle · base TeamAi capabilities</p>
          <p class="ta-type-meta">Team = model/teamwork quality and capacity. It is distinct from tools.</p>
        </section>
        <section class="ta-seat-column ta-card" data-field="F4" aria-labelledby="seat-tools-title">
          <h3 id="seat-tools-title" class="ta-type-label">Tool Quality</h3>
          <p class="ta-type-body" data-seat-tool-quality>Tool gateway pack · MCP workstation scope</p>
          <p class="ta-type-meta">Tools = TeamAi capabilities plus separately subscribed tool/MCP packs.</p>
        </section>
      </div>

      <section class="ta-seat-limits ta-card" data-field="F4" aria-labelledby="seat-limits-title">
        <h3 id="seat-limits-title" class="ta-type-label">Limits</h3>
        <p class="ta-type-body" data-seat-limits>Budget 80% · rate normal · storage 62% · approval gate required</p>
      </section>

      <section class="ta-seat-entitlements ta-panel" data-field="F3" aria-labelledby="seat-entitlement-title">
        <h3 id="seat-entitlement-title" class="ta-type-label">Entitlement split</h3>
        <div class="ta-seat-entitlement-grid">
          <div><span class="ta-type-meta">TeamAi entitlement</span><span class="ta-type-status" data-seat-team-entitlement>allowed</span></div>
          <div><span class="ta-type-meta">Provider entitlement</span><span class="ta-type-status" data-seat-provider-entitlement>allowed</span></div>
        </div>
      </section>

      <div class="ta-seat-actions">
        <button type="button" class="ta-control" data-field="F5" data-action="test-seat-connection">Test Connection</button>
        <button type="button" class="ta-control" data-field="F5" data-kind="primary" data-action="activate-seat">Activate Seat</button>
      </div>
      <p class="ta-type-meta" data-seat-result role="status"></p>
      <button type="button" class="ta-control" data-field="F5" data-action="back-to-deck">Back to Deck</button>
      <p class="ta-type-meta">Presentation only. Test Connection updates display state; Activate opens the shared E4 action plate when the current displayed facts allow activation.</p>
    </section>
  `;
  main.insertBefore(section, main.querySelector("[data-offdeck-root]"));

  section.querySelectorAll("[data-seat-page]").forEach((card) => {
    card.addEventListener("click", () => selectSeat(card.getAttribute("data-seat-page") ?? "alpha"));
  });
  section.querySelector('[data-action="test-seat-connection"]')?.addEventListener("click", testSeatConnection);
  section.querySelector('[data-action="activate-seat"]')?.addEventListener("click", activateSeat);
  section.querySelector('[data-action="back-to-deck"]')?.addEventListener("click", () => showComposition("deck"));
  seatsBuilt = true;
  selectSeat(activeSeat);
}

function selectSeat(seatId) {
  const id = SEAT_DATA[seatId] ? seatId : "alpha";
  activeSeat = id;
  document.querySelectorAll("[data-seat]").forEach((card) => {
    const selected = card.getAttribute("data-seat") === id;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
    if (selected) card.setAttribute("data-state", "selected");
    else card.removeAttribute("data-state");
  });
  renderSeatDetail();
}

function renderSeatDetail() {
  const seat = SEAT_DATA[activeSeat];
  if (!seat) return;
  const title = document.querySelector("[data-seat-detail-title]");
  const binding = document.querySelector("[data-seat-detail-binding]");
  const health = document.querySelector("[data-seat-detail-health]");
  const identity = document.querySelector("[data-seat-detail-identity]");
  const provider = document.querySelector("[data-seat-detail-provider]");
  const connection = document.querySelector("[data-seat-detail-connection]");
  const team = document.querySelector("[data-seat-team-quality]");
  const tools = document.querySelector("[data-seat-tool-quality]");
  const limits = document.querySelector("[data-seat-limits]");
  const teamEntitlement = document.querySelector("[data-seat-team-entitlement]");
  const providerEntitlement = document.querySelector("[data-seat-provider-entitlement]");
  const activate = document.querySelector('[data-action="activate-seat"]');
  if (title) title.textContent = seat.name;
  if (binding) binding.textContent = `${seat.role} · ${seat.provider} · ${seat.model}`;
  if (health) health.textContent = seat.health;
  if (identity) identity.textContent = `${seat.name} · ${seat.role}`;
  if (provider) provider.textContent = `${seat.provider} · ${seat.model}`;
  if (connection) connection.textContent = seat.connection;
  if (team) team.textContent = seat.teamQuality;
  if (tools) tools.textContent = seat.toolQuality;
  if (limits) limits.textContent = seat.limits;
  if (teamEntitlement) teamEntitlement.textContent = seat.teamEntitlement;
  if (providerEntitlement) providerEntitlement.textContent = seat.providerEntitlement;
  if (activate) activate.disabled = !seatActivationAllowed(seat);
  if (activate) activate.setAttribute("aria-describedby", "seat-activation-state");
  let state = document.querySelector("#seat-activation-state");
  if (!state) {
    state = document.createElement("span");
    state.id = "seat-activation-state";
    state.className = "ta-type-meta";
    const actions = document.querySelector(".ta-seat-actions");
    actions?.appendChild(state);
  }
  state.textContent = seatActivationAllowed(seat) ? `${seat.name} activation eligible from displayed facts.` : `${seat.name} activation blocked until connection and both entitlements allow.`;
}

function testSeatConnection() {
  const seat = SEAT_DATA[activeSeat];
  if (!seat) return;
  const result = document.querySelector("[data-seat-result]");
  if (seat.connection === "ready") {
    if (result) result.textContent = `${seat.name} connection test passed in UI only; no provider request was made.`;
  } else {
    if (result) result.textContent = `${seat.name} connection remains degraded in UI; no provider request was made.`;
  }
}

function activateSeat() {
  const seat = SEAT_DATA[activeSeat];
  if (!seat || !seatActivationAllowed(seat)) return;
  openModal("action");
  const impact = document.querySelector("[data-modal-impact]");
  const title = document.querySelector("[data-modal-title]");
  if (title) title.textContent = `Activate ${seat.name}`;
  if (impact) impact.textContent = `${seat.name} activation is a presentation preview. No provider connection is changed, no entitlement is mutated, and no scheduler state is written.`;
}

function buildApprovals() {
  if (approvalsBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "ta-approvals-page";
  section.dataset.composition = "approvals";
  section.dataset.approvalsRoot = "";
  section.hidden = true;
  section.setAttribute("aria-labelledby", "approvals-title");
  section.innerHTML = `
    <div class="ta-approvals__queue ta-panel" data-field="F3" aria-label="Approval request queue">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Execution boundary</p>
          <h1 id="approvals-title" class="ta-type-title">Approvals</h1>
        </div>
        <span class="ta-type-meta">3 requests</span>
      </div>
      <p class="ta-type-body">Review action requests before any authoritative execution path is allowed. Selecting a request changes presentation only.</p>
      <ul class="ta-approval-list" role="list">
        ${Object.entries(APPROVAL_DATA).map(([id, approval], index) => `
          <li>
            <button type="button" class="ta-card ta-approval-card" data-approval="${id}" aria-pressed="${index === 0 ? "true" : "false"}">
              <span class="ta-type-title">${approval.request}</span>
              <span class="ta-type-meta">${approval.task}</span>
              <span class="ta-type-meta">${approval.seat} · ${approval.provider}</span>
              <span class="ta-type-status">${approval.status}</span>
              <span class="ta-type-meta">waiting: ${approval.waiting}</span>
            </button>
          </li>
        `).join("")}
      </ul>
    </div>

    <section class="ta-approvals__detail ta-panel" data-field="F3" data-elevation="e3" aria-labelledby="approval-detail-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Selected request</p>
          <h2 id="approval-detail-title" class="ta-type-title" data-approval-title>Provider runtime invocation</h2>
          <p class="ta-type-meta" data-approval-task>TASK-042 · Working task</p>
        </div>
        <span class="ta-type-status" data-approval-status>waiting approval</span>
      </div>

      <dl class="ta-approval-facts">
        <div><dt class="ta-type-meta">Seat</dt><dd class="ta-type-body" data-approval-seat>Beta · worker</dd></div>
        <div><dt class="ta-type-meta">Provider</dt><dd class="ta-type-body" data-approval-provider>Provider Two · Model B</dd></div>
        <div><dt class="ta-type-meta">Scope</dt><dd class="ta-type-body" data-approval-scope>Northstar Workplace / Command Deck project</dd></div>
        <div><dt class="ta-type-meta">Waiting</dt><dd class="ta-type-body" data-approval-waiting>2 min ago</dd></div>
        <div><dt class="ta-type-meta">Runtime gate</dt><dd class="ta-type-body" data-approval-gate>Approval pending · runtime gate not yet opened</dd></div>
      </dl>

      <div class="ta-approval-impact ta-card" data-field="F4">
        <p class="ta-type-label">Impact</p>
        <p class="ta-type-body" data-approval-impact>Invoke the already-bound provider runtime for the eligible task using the project's execution capability.</p>
      </div>

      <div class="ta-approval-boundary-grid">
        <section class="ta-card" data-field="F4" aria-labelledby="approval-runs-title">
          <h3 id="approval-runs-title" class="ta-type-label">What would run</h3>
          <p class="ta-type-body" data-approval-runs>Provider runtime invocation for TASK-042, after authoritative approval and runtime checks.</p>
        </section>
        <section class="ta-card" data-field="F4" aria-labelledby="approval-not-runs-title">
          <h3 id="approval-not-runs-title" class="ta-type-label">What will not run here</h3>
          <p class="ta-type-body" data-approval-not-runs>No browser-side provider call, Firestore write, scheduler selection, entitlement mutation, or PayPal activity.</p>
        </section>
      </div>

      <div class="ta-approval-actions">
        <button type="button" class="ta-control" data-field="F5" data-action="back-to-deck">Back to Deck</button>
        <button type="button" class="ta-control" data-field="F5" data-action="open-selected-approval" data-kind="primary">Open decision plate</button>
      </div>
      <p class="ta-type-meta" data-approval-result role="status">Presentation only. The approval decision is not a durable state transition in this slice.</p>
    </section>
  `;
  main.insertBefore(section, main.querySelector("[data-offdeck-root]"));

  section.querySelectorAll("[data-approval]").forEach((card) => {
    card.addEventListener("click", () => selectApproval(card.getAttribute("data-approval") ?? "runtime-alpha"));
  });
  section.querySelector('[data-action="open-selected-approval"]')?.addEventListener("click", openSelectedApproval);
  section.querySelector('[data-action="back-to-deck"]')?.addEventListener("click", () => showComposition("deck"));
  approvalsBuilt = true;
  selectApproval(activeApproval);
}

function selectApproval(approvalId) {
  const id = APPROVAL_DATA[approvalId] ? approvalId : "runtime-alpha";
  activeApproval = id;
  document.querySelectorAll("[data-approval]").forEach((card) => {
    const selected = card.getAttribute("data-approval") === id;
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  const approval = APPROVAL_DATA[id];
  if (!approval) return;
  const set = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  set("[data-approval-title]", approval.request);
  set("[data-approval-task]", approval.task);
  set("[data-approval-status]", approval.status);
  set("[data-approval-seat]", approval.seat);
  set("[data-approval-provider]", approval.provider);
  set("[data-approval-scope]", approval.scope);
  set("[data-approval-waiting]", approval.waiting);
  set("[data-approval-gate]", approval.gate);
  set("[data-approval-impact]", approval.impact);
  set("[data-approval-runs]", approval.runs);
  set("[data-approval-not-runs]", approval.notRuns);
  set("[data-approval-result]", "Presentation only. The approval decision is not a durable state transition in this slice.");
}

function openSelectedApproval() {
  const approval = APPROVAL_DATA[activeApproval];
  if (!approval) return;
  openModal("action");
  const title = document.querySelector("[data-modal-title]");
  const actor = document.querySelector("[data-modal-actor]");
  const impact = document.querySelector("[data-modal-impact]");
  if (title) title.textContent = approval.request;
  if (actor) actor.textContent = `${approval.seat} · ${approval.provider} · ${approval.task}`;
  if (impact) impact.textContent = `${approval.impact} ${approval.notRuns}`;
}

function showComposition(destination) {
  buildWorkplace();
  buildSeats();
  buildApprovals();
  const deck = document.querySelector("[data-deck-root]");
  const workplace = document.querySelector("[data-workplace-root]");
  const seats = document.querySelector("[data-seats-root]");
  const approvals = document.querySelector("[data-approvals-root]");
  const off = document.querySelector("[data-offdeck-root]");
  const isDeck = destination === "deck";
  const isWorkplace = destination === "workplace";
  const isSeats = destination === "seats";
  const isApprovals = destination === "approvals";
  if (deck) deck.hidden = !isDeck;
  if (workplace) workplace.hidden = !isWorkplace;
  if (seats) seats.hidden = !isSeats;
  if (approvals) approvals.hidden = !isApprovals;
  if (off) off.hidden = isDeck || isWorkplace || isSeats || isApprovals;

  document.querySelectorAll("[data-nav]").forEach((btn) => {
    const id = btn.getAttribute("data-nav") ?? "";
    if (id === destination) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  syncCompactNavigation(destination);

  if (!isDeck && !isWorkplace && !isSeats && !isApprovals) {
    const title = document.querySelector("[data-stage-title]");
    const copy = document.querySelector("[data-stage-copy]");
    const label = NAV_LABELS[destination] ?? destination;
    if (title) title.textContent = label;
    if (copy) copy.textContent = label + " composition is not implemented yet. Shell and Navigation persist; Deck, Workplace, Seats, and Approvals are the inhabited bodies. Presentation only — no domain writes.";
  }
}

function setStage(stage) {
  document.querySelectorAll("[data-stage]").forEach((btn) => {
    const id = btn.getAttribute("data-stage");
    btn.setAttribute("aria-pressed", id === stage ? "true" : "false");
  });
  document.querySelectorAll("[data-stage-panel]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-stage-panel") !== stage;
  });
}

function focusableIn(root) {
  return [...root.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
}

function applyCluster(cluster) {
  activeCluster = cluster === "handoff" ? "handoff" : "action";
  const modal = document.querySelector('[data-field="F7"]');
  if (modal) modal.setAttribute("data-modal-cluster", activeCluster);
  document.querySelectorAll("[data-cluster]").forEach((el) => {
    el.hidden = el.getAttribute("data-cluster") !== activeCluster;
  });
  const title = document.querySelector("[data-modal-title]");
  const impact = document.querySelector("[data-modal-impact]");
  if (activeCluster === "handoff") {
    if (title) title.textContent = "Planning handoff";
    if (impact) impact.textContent = "Review the planning packet. APPROVE is review only — not task execution. EDIT returns to the well; MORE keeps Planning running. Presentation only.";
  } else {
    if (title) title.textContent = "Action request";
    if (impact) impact.textContent = "Presentation preview only. Approving does not run tools, write Firestore, or charge PayPal.";
  }
}

function openModal(cluster) {
  const modal = document.querySelector('[data-field="F7"]');
  const plate = modal?.querySelector(".ta-modal__plate");
  if (!modal || !plate) return;
  applyCluster(cluster ?? "action");
  lastFocus = document.activeElement;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  const focusables = focusableIn(plate);
  const primary = plate.querySelector(`[data-cluster="${activeCluster}"] [data-modal-action="approve"]`) || focusables[0];
  (primary || plate).focus();
  focusTrapHandler = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (activeCluster === "handoff") onModalAction("more"); else closeModal();
      return;
    }
    if (event.key !== "Tab" || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  document.addEventListener("keydown", focusTrapHandler);
}

function closeModal() {
  const modal = document.querySelector('[data-field="F7"]');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (focusTrapHandler) { document.removeEventListener("keydown", focusTrapHandler); focusTrapHandler = null; }
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
}

function onModalAction(action) {
  const note = document.querySelector("[data-modal-result]");
  const approvalNote = document.querySelector("[data-approval-result]");
  const labels = {
    approve: "APPROVE recorded in UI only — no domain execution.",
    deny: "DENY recorded in UI only — no domain execution.",
    reject: "REJECT recorded in UI only — packet not accepted; no domain write.",
    edit: "EDIT recorded in UI only — would return to planning well (not wired).",
    more: "MORE recorded in UI only — plate dismissed; Planning continues (display).",
  };
  if (note) note.textContent = labels[action] ?? `${String(action).toUpperCase()} — UI only.`;
  if (approvalNote && (action === "approve" || action === "deny")) approvalNote.textContent = `${labels[action]} Authoritative approval state remains backend-owned.`;
  closeModal();
}

function toggleTheme() {
  const current = resolveMode(readSource(), readStoredMode());
  const next = current === "dark" ? "light" : "dark";
  persistTheme({ mode: next, source: "user" });
  applyDocumentTheme({ mode: next, source: "user", motion: readMotion(), density: readDensity() });
  refreshThemeControls();
}

function toggleDensity() {
  const next = readDensity() === "compact" ? "default" : "compact";
  persistTheme({ density: next });
  applyDocumentTheme({ mode: resolveMode(readSource(), readStoredMode()), source: readSource(), motion: readMotion(), density: next });
  refreshThemeControls();
}

function wire() {
  initializeTheme();
  refreshThemeControls();
  buildWorkplace();
  buildSeats();
  buildApprovals();
  showComposition("deck");
  setStage("planning");

  document.querySelector('[data-action="toggle-theme"]')?.addEventListener("click", toggleTheme);
  document.querySelector('[data-action="toggle-density"]')?.addEventListener("click", toggleDensity);
  document.querySelector('[data-action="open-approval"]')?.addEventListener("click", () => openModal("action"));
  document.querySelector('[data-action="open-handoff"]')?.addEventListener("click", () => openModal("handoff"));
  document.querySelector('[data-modal-action="dismiss"]')?.addEventListener("click", closeModal);
  document.querySelectorAll("[data-modal-action]").forEach((btn) => {
    const action = btn.getAttribute("data-modal-action");
    if (!action || action === "dismiss") return;
    btn.addEventListener("click", () => onModalAction(action));
  });
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");
      if (id) showComposition(id);
    });
  });
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    const destination = event.target.value;
    if (destination) showComposition(destination);
  });
  document.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = btn.getAttribute("data-stage");
      if (stage) setStage(stage);
    });
  });
  document.querySelectorAll("[data-seat]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-seat");
      if (id) selectSeat(id);
    });
  });
  watchOsTheme((mode) => {
    if (readSource() !== "os") return;
    applyDocumentTheme({ mode, source: "os", motion: readMotion(), density: readDensity() });
    refreshThemeControls();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
else wire();
