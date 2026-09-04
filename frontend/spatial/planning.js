/* TEAM-EXPERIENCE-029 — Planning composition companion
 * Presentation only. Reuses shell/nav/theme-root/F7 contracts.
 * Must not: Firestore, provider calls, scheduler actor selection, entitlements, execution.
 */

const HUMAN_INSTRUCTION = "Prepare the next planning handoff for the current Web AI Team, preserving dependencies, rationale, alternatives, and unresolved items.";

let planningBuilt = false;

function buildPlanning() {
  if (planningBuilt) return;
  const main = document.querySelector("#main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "ta-planning";
  section.dataset.composition = "planning";
  section.dataset.planningRoot = "";
  section.hidden = true;
  section.setAttribute("aria-labelledby", "planning-title");
  section.innerHTML = `
    <section class="ta-panel ta-planning__transcript" data-field="F3" aria-labelledby="planning-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Planning Team</p>
          <h1 id="planning-title" class="ta-type-title">Deliberation</h1>
        </div>
        <span class="ta-type-status">presentation</span>
      </div>
      <p class="ta-type-body">Shared planning conversation. AI replies are contributions; the Scheduler owns the next turn.</p>
      <ol class="ta-planning__messages">
        <li class="ta-planning__message" data-actor="human">
          <span class="ta-type-label">Human instruction</span>
          <span class="ta-type-body" data-human-message>${HUMAN_INSTRUCTION}</span>
        </li>
        <li class="ta-planning__message" data-actor="ai" data-state="current">
          <span class="ta-type-label">Alpha · current speaker</span>
          <span class="ta-type-body">Contribution: preserve the dependency chain and surface the strongest candidate decisions before handoff.</span>
          <span class="ta-type-meta">Contribution only · not scheduler authority</span>
        </li>
        <li class="ta-planning__message" data-actor="ai">
          <span class="ta-type-label">Beta · prior contribution</span>
          <span class="ta-type-body">Contribution: identify implementation alternatives and the capability gate needed before Working can begin.</span>
          <span class="ta-type-meta">Prior reply · not authority</span>
        </li>
      </ol>
    </section>

    <section class="ta-panel ta-planning__instruction" data-field="F3" data-elevation="e3" aria-labelledby="planning-instruction-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Pinned instruction</p>
          <h2 id="planning-instruction-title" class="ta-type-title">Current user instruction</h2>
        </div>
        <span class="ta-type-status">pinned</span>
      </div>
      <form class="ta-planning__form" data-planning-form>
        <label class="ta-type-label" for="planning-instruction-input">Instruction</label>
        <textarea id="planning-instruction-input" class="ta-planning__input" data-planning-input>${HUMAN_INSTRUCTION}</textarea>
        <div class="ta-planning__actions">
          <button type="submit" class="ta-control" data-field="F5" data-kind="primary">Preview instruction</button>
          <span class="ta-type-meta ta-planning__status" data-planning-status role="status"></span>
        </div>
      </form>
      <p class="ta-type-meta">Preview only. No durable planning state is written from this visual.</p>
    </section>

    <section class="ta-panel ta-planning__plan" data-field="F3" aria-labelledby="turn-plan-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Scheduler evidence</p>
          <h2 id="turn-plan-title" class="ta-type-title">Turn plan</h2>
        </div>
        <span class="ta-type-status">display</span>
      </div>
      <dl class="ta-planning__turns">
        <div><dt class="ta-type-meta">Seat order</dt><dd class="ta-type-body">Alpha → Beta → Gamma (configured sequence)</dd></div>
        <div><dt class="ta-type-meta">Turns per AI</dt><dd class="ta-type-body">2 turns each · fixture</dd></div>
        <div><dt class="ta-type-meta">Current turn</dt><dd class="ta-type-body">Alpha · turn 2</dd></div>
        <div><dt class="ta-type-meta">Next turn</dt><dd class="ta-type-body">Scheduler decides</dd></div>
        <div><dt class="ta-type-meta">Designated summarizer</dt><dd class="ta-type-body">Alpha · summarizer path</dd></div>
        <div><dt class="ta-type-meta">Document-author path</dt><dd class="ta-type-body">One path only · Alpha</dd></div>
      </dl>
    </section>

    <section class="ta-panel ta-planning__handoff" data-field="F3" data-elevation="e3" aria-labelledby="handoff-title">
      <div class="ta-region-heading">
        <div>
          <p class="ta-type-label">Review gate</p>
          <h2 id="handoff-title" class="ta-type-title">Planning handoff</h2>
        </div>
        <span class="ta-type-status">pending</span>
      </div>
      <dl class="ta-planning__handoff-facts">
        <div><dt class="ta-type-meta">Decisions</dt><dd class="ta-type-body">Keep the dependency chain intact and preserve one summarizer path.</dd></div>
        <div><dt class="ta-type-meta">Rationale</dt><dd class="ta-type-body">The scheduler must see complete planning context before the Working stage.</dd></div>
        <div><dt class="ta-type-meta">Alternatives</dt><dd class="ta-type-body">Use a shorter turn plan or change the tool-capability gate.</dd></div>
        <div><dt class="ta-type-meta">Unresolved</dt><dd class="ta-type-body">Provider capability evidence remains a review item.</dd></div>
      </dl>
      <div class="ta-planning__handoff-actions">
        <button type="button" class="ta-control" data-field="F5" data-action="preview-planning-handoff">Review handoff</button>
        <button type="button" class="ta-control" data-field="F5" data-action="planning-back-to-deck">Back to Deck</button>
      </div>
      <p class="ta-type-meta">The review gate uses the existing shared F7 plate: REJECT · EDIT · MORE · APPROVE. No second modal system.</p>
    </section>
  `;
  main.insertBefore(section, main.querySelector("[data-offdeck-root]"));

  section.querySelector("[data-planning-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = section.querySelector("[data-planning-input]");
    const value = input?.value.trim() || HUMAN_INSTRUCTION;
    const humanMessage = section.querySelector("[data-human-message]");
    const status = section.querySelector("[data-planning-status]");
    if (humanMessage) humanMessage.textContent = value;
    if (status) status.textContent = "Instruction preview updated in UI only; Scheduler and backend state unchanged.";
  });

  section.querySelector('[data-action="preview-planning-handoff"]')?.addEventListener("click", () => {
    const actor = document.querySelector("[data-modal-actor]");
    if (actor) actor.textContent = "Alpha · summarizer · Provider One · Model A (fixture)";
    document.querySelector('[data-action="open-handoff"]')?.click();
  });

  section.querySelector('[data-action="planning-back-to-deck"]')?.addEventListener("click", () => {
    document.querySelector('[data-nav="deck"]')?.click();
  });

  planningBuilt = true;
}

function showPlanning() {
  buildPlanning();
  const planning = document.querySelector("[data-planning-root]");
  const deck = document.querySelector("[data-deck-root]");
  const workplace = document.querySelector("[data-workplace-root]");
  const seats = document.querySelector("[data-seats-root]");
  const off = document.querySelector("[data-offdeck-root]");
  if (planning) planning.hidden = false;
  if (deck) deck.hidden = true;
  if (workplace) workplace.hidden = true;
  if (seats) seats.hidden = true;
  if (off) off.hidden = true;
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    if (btn.getAttribute("data-nav") === "planning") btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  const menu = document.querySelector("[data-nav-menu]");
  if (menu) menu.value = "planning";
}

function wirePlanningNavigation() {
  buildPlanning();
  document.querySelectorAll('[data-nav="planning"]').forEach((btn) => btn.addEventListener("click", showPlanning));
  document.querySelector("[data-nav-menu]")?.addEventListener("change", (event) => {
    if (event.target.value === "planning") showPlanning();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wirePlanningNavigation);
else wirePlanningNavigation();
