/* TEAM-EXPERIENCE-029 — Artifacts composition companion
 * Presentation only. Shows durable-result/event-shaped evidence without creating backend authority.
 * Must not: Firestore writes, provider calls, scheduler mutation, entitlement mutation, PayPal activity.
 */

const ARTIFACT_DATA = {
  "runtime-result": {
    name: "Provider runtime result",
    type: "execution result",
    task: "TASK-042 · Working task",
    event: "provider.runtime.completed (fixture)",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    scope: "Northstar Workplace / Command Deck project",
    status: "available",
    created: "2 min ago · fixture",
    provenance: "Task event → provider runtime → structured result packet",
    summary: "Structured provider output retained as a project-scoped result for later review and task evidence.",
    next: "Review the result before any downstream task claims it as usable evidence.",
  },
  "planning-handoff": {
    name: "Planning handoff packet",
    type: "planning handoff",
    task: "HANDOFF-017 · Planning review",
    event: "planning.handoff.ready (fixture)",
    seat: "Alpha · summarizer",
    provider: "Provider One · Model A",
    scope: "Northstar Workplace / Command Deck planning scope",
    status: "reviewed",
    created: "8 min ago · fixture",
    provenance: "Conversation contributions → selected summarizer → structured handoff packet",
    summary: "The planning packet preserves decisions, rationale, alternatives, dependencies, and unresolved items for review.",
    next: "Use the handoff as an input to the approved Working transition; it is not scheduler authority itself.",
  },
  "workspace-draft": {
    name: "Workspace draft artifact",
    type: "workspace artifact",
    task: "TASK-044 · Artifact preparation",
    event: "workspace.artifact.prepared (fixture)",
    seat: "Beta · worker",
    provider: "Provider Two · Model B",
    scope: "Northstar Workplace / Command Deck workspace",
    status: "pending review",
    created: "6 min ago · fixture",
    provenance: "Authorized tool proposal → artifact preparation event → workspace artifact",
    summary: "A prepared artifact is represented with its task, scope, and provenance before any final publication decision.",
    next: "Review the artifact and preserve the project-scoped provenance chain before publication.",
  },
  "recovery-evidence": {
    name: "Recovery evidence bundle",
    type: "recovery evidence",
    task: "TASK-046 · Review handoff",
    event: "provider.connection.degraded (fixture)",
    seat: "Gamma · reviewer",
    provider: "Provider Three · Model C",
    scope: "Northstar Workplace / Command Deck recovery scope",
    status: "blocked",
    created: "11 min ago · fixture",
    provenance: "Connection health event → recovery evidence → revalidation required",
    summary: "Evidence records why the reviewer path is currently blocked and what must be revalidated before eligibility returns.",
    next: "Recover and revalidate the connection before treating this path as execution-ready.",
  },
};

let artifactsBuilt = false;
let activeArtifact = "runtime-result";

function artifactMarkup() {
  return `
    <section class="ta-artifacts-page" data-composition="artifacts" data-artifacts-root hidden aria-labelledby="artifacts-title">
      <div class="ta-artifacts__list ta-panel" data-field="F3" aria-label="Artifact evidence queue">
        <div class="ta-region-heading">
          <div>
            <p class="ta-type-label">Durable evidence</p>
            <h1 id="artifacts-title" class="ta-type-title">Artifacts</h1>
          </div>
          <span class="ta-type-meta">4 records</span>
        </div>
        <p class="ta-type-body">Inspect result, handoff, workspace, and recovery evidence. These records are presentation fixtures for the canonical event/result chain.</p>
        <ul class="ta-artifact-list" role="list">
          ${Object.entries(ARTIFACT_DATA).map(([id, artifact], index) => `
            <li>
              <button type="button" class="ta-card ta-artifact-card" data-artifact="${id}" aria-pressed="${index === 0 ? "true" : "false"}">
                <span class="ta-type-title">${artifact.name}</span>
                <span class="ta-type-meta">${artifact.type} · ${artifact.task}</span>
                <span class="ta-type-status">${artifact.status}</span>
                <span class="ta-type-meta">${artifact.created}</span>
              </button>
            </li>
          `).join("")}
        </ul>
      </div>

      <section class="ta-artifacts__detail ta-panel" data-field="F3" data-elevation="e3" aria-labelledby="artifact-detail-title">
        <div class="ta-region-heading">
          <div>
            <p class="ta-type-label">Selected artifact</p>
            <h2 id="artifact-detail-title" class="ta-type-title" data-artifact-title>Provider runtime result</h2>
            <p class="ta-type-meta" data-artifact-task>TASK-042 · Working task</p>
          </div>
          <span class="ta-type-status" data-artifact-status>available</span>
        </div>

        <dl class="ta-artifact-facts">
          <div><dt class="ta-type-meta">Type</dt><dd class="ta-type-body" data-artifact-type>execution result</dd></div>
          <div><dt class="ta-type-meta">Event</dt><dd class="ta-type-body" data-artifact-event>provider.runtime.completed (fixture)</dd></div>
          <div><dt class="ta-type-meta">Seat</dt><dd class="ta-type-body" data-artifact-seat>Beta · worker</dd></div>
          <div><dt class="ta-type-meta">Provider</dt><dd class="ta-type-body" data-artifact-provider>Provider Two · Model B</dd></div>
          <div><dt class="ta-type-meta">Scope</dt><dd class="ta-type-body" data-artifact-scope>Northstar Workplace / Command Deck project</dd></div>
          <div><dt class="ta-type-meta">Created</dt><dd class="ta-type-body" data-artifact-created>2 min ago · fixture</dd></div>
        </dl>

        <section class="ta-artifact-summary ta-card" data-field="F4" aria-labelledby="artifact-summary-title">
          <p id="artifact-summary-title" class="ta-type-label">Summary</p>
          <p class="ta-type-body" data-artifact-summary>Structured provider output retained as a project-scoped result for later review and task evidence.</p>
        </section>

        <div class="ta-artifact-boundary-grid">
          <section class="ta-card" data-field="F4" aria-labelledby="artifact-provenance-title">
            <h3 id="artifact-provenance-title" class="ta-type-label">Provenance</h3>
            <p class="ta-type-body" data-artifact-provenance>Task event → provider runtime → structured result packet</p>
          </section>
          <section class="ta-card" data-field="F4" aria-labelledby="artifact-next-title">
            <h3 id="artifact-next-title" class="ta-type-label">Next handling</h3>
            <p class="ta-type-body" data-artifact-next>Review the result before any downstream task claims it as usable evidence.</p>
          </section>
        </div>

        <section class="ta-artifact-authority ta-panel" data-field="F3" aria-labelledby="artifact-authority-title">
          <h3 id="artifact-authority-title" class="ta-type-label">Authority boundary</h3>
          <div class="ta-artifact-authority-grid">
            <div>
              <span class="ta-type-meta">What this visual represents</span>
              <span class="ta-type-body">A durable result/event-shaped record that can be inspected, traced, and handed to later work.</span>
            </div>
            <div>
              <span class="ta-type-meta">What this visual does not do</span>
              <span class="ta-type-body">It does not write Firestore, execute a provider, choose the next task, alter entitlements, or publish the artifact.</span>
            </div>
          </div>
        </section>

        <div class="ta-artifact-actions">
          <button type="button" class="ta-control" data-field="F5" data-action="artifacts-back-to-deck">Back to Deck</button>
          <button type="button" class="ta-control" data-field="F5" data-kind="primary" data-action="preview-artifact">Preview record</button>
        </div>
        <p class="ta-type-meta" data-artifact-result role="status">Presentation only. Artifact inspection does not mutate the durable result or event.</p>
      </section>
    </section>
  `;
}

function buildArtifacts() {
  if (artifactsBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;
  main.insertAdjacentHTML("afterbegin", artifactMarkup());
  const root = document.querySelector("[data-artifacts-root]");
  if (!root) return;

  root.querySelectorAll("[data-artifact]").forEach((card) => {
    card.addEventListener("click", () => selectArtifact(card.getAttribute("data-artifact") ?? "runtime-result"));
  });
  root.querySelector('[data-action="artifacts-back-to-deck"]')?.addEventListener("click", () => {
    document.querySelector('[data-nav="deck"]')?.click();
  });
  root.querySelector('[data-action="preview-artifact"]')?.addEventListener("click", () => {
    const result = root.querySelector("[data-artifact-result]");
    const artifact = ARTIFACT_DATA[activeArtifact];
    if (result && artifact) result.textContent = `${artifact.name} preview opened in UI only; no durable record changed.`;
  });
  artifactsBuilt = true;
  selectArtifact(activeArtifact);
}

function selectArtifact(id) {
  const next = ARTIFACT_DATA[id] ? id : "runtime-result";
  activeArtifact = next;
  const artifact = ARTIFACT_DATA[next];
  if (!artifact) return;
  document.querySelectorAll("[data-artifact]").forEach((card) => {
    card.setAttribute("aria-pressed", card.getAttribute("data-artifact") === next ? "true" : "false");
  });
  const set = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  set("[data-artifact-title]", artifact.name);
  set("[data-artifact-type]", artifact.type);
  set("[data-artifact-task]", artifact.task);
  set("[data-artifact-status]", artifact.status);
  set("[data-artifact-event]", artifact.event);
  set("[data-artifact-seat]", artifact.seat);
  set("[data-artifact-provider]", artifact.provider);
  set("[data-artifact-scope]", artifact.scope);
  set("[data-artifact-created]", artifact.created);
  set("[data-artifact-summary]", artifact.summary);
  set("[data-artifact-provenance]", artifact.provenance);
  set("[data-artifact-next]", artifact.next);
  set("[data-artifact-result]", "Presentation only. Artifact inspection does not mutate the durable result or event.");
}

function showArtifacts() {
  buildArtifacts();
  const root = document.querySelector("[data-artifacts-root]");
  if (root) root.hidden = false;
  document.querySelectorAll("[data-artifacts-root]").forEach((node) => { node.hidden = false; });
  document.querySelectorAll("[data-composition]").forEach((node) => {
    if (!node.hasAttribute("data-artifacts-root")) node.hidden = true;
  });
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    if (btn.getAttribute("data-nav") === "artifacts") btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  const menu = document.querySelector("[data-nav-menu]");
  if (menu) menu.value = "artifacts";
  const off = document.querySelector("[data-offdeck-root]");
  if (off) off.hidden = true;
}

function hideArtifacts() {
  const root = document.querySelector("[data-artifacts-root]");
  if (root) root.hidden = true;
}

function wireArtifactsNavigation() {
  buildArtifacts();
  document.querySelectorAll('[data-nav="artifacts"]').forEach((btn) => btn.addEventListener("click", showArtifacts));
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    if (event.target.value === "artifacts") showArtifacts();
    else hideArtifacts();
  });
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    if (btn.getAttribute("data-nav") === "artifacts") return;
    btn.addEventListener("click", hideArtifacts);
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wireArtifactsNavigation);
else wireArtifactsNavigation();