/* TEAM-EXPERIENCE-029 — Working composition companion
 * Presentation only. Scheduler, tool gateway, Firestore, PayPal and providers remain authorities.
 */

let workingBuilt = false;

function buildWorking() {
  if (workingBuilt) return;
  const main = document.querySelector('#main');
  if (!main) return;

  const section = document.createElement('section');
  section.className = 'ta-working';
  section.dataset.composition = 'working';
  section.dataset.workingRoot = '';
  section.hidden = true;
  section.setAttribute('aria-labelledby', 'working-title');
  section.innerHTML = `
    <section class="ta-panel ta-working__handoff" data-field="F3" aria-labelledby="working-title">
      <div class="ta-region-heading"><div><p class="ta-type-label">Working Team</p><h1 id="working-title" class="ta-type-title">Execution workspace</h1></div><span class="ta-type-status">presentation</span></div>
      <p class="ta-type-body">Approved planning handoff carried into Working. The handoff is context, not a command issued by this visual.</p>
      <dl class="ta-working__facts">
        <div><dt class="ta-type-meta">Decisions</dt><dd class="ta-type-body">Preserve dependency order and one document-author path.</dd></div>
        <div><dt class="ta-type-meta">Rationale</dt><dd class="ta-type-body">Execution begins only after the reviewed planning context is accepted.</dd></div>
        <div><dt class="ta-type-meta">Unresolved</dt><dd class="ta-type-body">Provider capability evidence remains visible for the execution gate.</dd></div>
      </dl>
    </section>

    <section class="ta-panel ta-working__task" data-field="F3" data-elevation="e3" aria-labelledby="current-task-title">
      <div class="ta-region-heading"><div><p class="ta-type-label">Current task</p><h2 id="current-task-title" class="ta-type-title">Prepare implementation handoff artifact</h2></div><span class="ta-type-status">eligible</span></div>
      <p class="ta-type-body">Current task fixture: collect approved context and prepare the next bounded artifact. Execution itself is not performed here.</p>
      <ul class="ta-working__task-list" role="list">
        <li><span class="ta-type-meta">Dependency</span><span class="ta-type-body">Planning handoff approved</span></li>
        <li><span class="ta-type-meta">Assigned seat</span><span class="ta-type-body" data-working-seat>Beta · worker · Provider Two · Model B</span></li>
        <li><span class="ta-type-meta">Readiness</span><span class="ta-type-body" data-working-readiness>Connection ready · TeamAi entitlement allowed · Provider entitlement allowed</span></li>
        <li><span class="ta-type-meta">Capability gate</span><span class="ta-type-body">Working skill bundle present · action capability gated</span></li>
      </ul>
    </section>

    <aside class="ta-panel ta-working__why" data-field="F3" aria-label="Why this task is next">
      <div class="ta-region-heading"><div><p class="ta-type-label">Scheduler evidence</p><h2 class="ta-type-title">Why this task</h2></div><span class="ta-type-status">display</span></div>
      <dl class="ta-working__facts">
        <div><dt class="ta-type-meta">Event</dt><dd class="ta-type-body">planning.handoff.approved (fixture)</dd></div>
        <div><dt class="ta-type-meta">Dependency</dt><dd class="ta-type-body">No execution task before approved handoff</dd></div>
        <div><dt class="ta-type-meta">Scheduler</dt><dd class="ta-type-body">Scheduler owns task eligibility and next-actor selection</dd></div>
        <div><dt class="ta-type-meta">Next actor</dt><dd class="ta-type-body">Scheduler decides; not selected by this UI</dd></div>
      </dl>
    </aside>

    <section class="ta-panel ta-working__action" data-field="F3" aria-labelledby="action-title">
      <div class="ta-region-heading"><div><p class="ta-type-label">Action boundary</p><h2 id="action-title" class="ta-type-title">Proposed action</h2></div><span class="ta-type-status">approval required</span></div>
      <dl class="ta-working__facts">
        <div><dt class="ta-type-meta">Tool</dt><dd class="ta-type-body">Artifact writer (fixture)</dd></div>
        <div><dt class="ta-type-meta">Impact</dt><dd class="ta-type-body">Would create an external artifact; this preview performs no action.</dd></div>
        <div><dt class="ta-type-meta">Gateway</dt><dd class="ta-type-body">Tool gateway remains the execution authority.</dd></div>
      </dl>
      <div class="ta-working__actions"><button type="button" class="ta-control" data-field="F5" data-kind="primary" data-action="working-preview-approval">Preview approval plate</button><button type="button" class="ta-control" data-field="F5" data-action="working-back-to-deck">Back to Deck</button></div>
      <p class="ta-type-meta ta-working__status" data-working-status role="status">Presentation only. No tool invocation or domain mutation.</p>
    </section>

    <section class="ta-panel ta-working__result" data-field="F6" aria-label="Execution result and recovery">
      <div class="ta-region-heading"><div><p class="ta-type-label">Durable observation</p><h2 class="ta-type-title">Event / result / recovery</h2></div><span class="ta-type-status">display</span></div>
      <dl class="ta-working__event-list">
        <div><dt class="ta-type-meta">Last event</dt><dd class="ta-type-body">planning.handoff.approved · observed fixture</dd></div>
        <div><dt class="ta-type-meta">Result</dt><dd class="ta-type-body">Waiting for tool-gateway execution; no live result is fabricated.</dd></div>
        <div><dt class="ta-type-meta">Recovery</dt><dd class="ta-type-body">No recovery action pending. Recovery remains backend-owned.</dd></div>
      </dl>
    </section>
  `;
  main.insertBefore(section, main.querySelector('[data-offdeck-root]'));

  section.querySelector('[data-action="working-preview-approval"]')?.addEventListener('click', () => {
    const modal = document.querySelector('[data-field="F7"]');
    const actor = modal?.querySelector('[data-modal-actor]');
    const title = modal?.querySelector('[data-modal-title]');
    const impact = modal?.querySelector('[data-modal-impact]');
    if (title) title.textContent = 'Action request';
    if (actor) actor.textContent = 'Beta · worker · Provider Two · Model B (fixture)';
    if (impact) impact.textContent = 'Preview only. Approval does not invoke the tool, write Firestore, or charge PayPal.';
    document.querySelector('[data-action="open-approval"]')?.click();
  });

  section.querySelector('[data-action="working-back-to-deck"]')?.addEventListener('click', () => document.querySelector('[data-nav="deck"]')?.click());
  workingBuilt = true;
}

function showWorking() {
  buildWorking();
  document.querySelector('[data-working-root]')?.removeAttribute('hidden');
  document.querySelector('[data-deck-root]')?.setAttribute('hidden', '');
  document.querySelector('[data-workplace-root]')?.setAttribute('hidden', '');
  document.querySelector('[data-seats-root]')?.setAttribute('hidden', '');
  document.querySelector('[data-planning-root]')?.setAttribute('hidden', '');
  document.querySelector('[data-offdeck-root]')?.setAttribute('hidden', '');
  document.querySelectorAll('[data-nav]').forEach((btn) => btn.getAttribute('data-nav') === 'working' ? btn.setAttribute('aria-current', 'page') : btn.removeAttribute('aria-current'));
  const menu = document.querySelector('[data-nav-menu]');
  if (menu) menu.value = 'working';
}

function wireWorkingNavigation() {
  buildWorking();
  document.querySelectorAll('[data-nav="working"]').forEach((btn) => btn.addEventListener('click', showWorking));
  document.querySelector('[data-nav-menu]')?.addEventListener('change', (event) => { if (event.target.value === 'working') showWorking(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireWorkingNavigation);
else wireWorkingNavigation();
