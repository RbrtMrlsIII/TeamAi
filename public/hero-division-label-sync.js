/**
 * 029 Seat division visible-label synchronization.
 * Keeps the visible Hero label aligned with the already-published hierarchy runtime.
 * Presentation only. No domain/provider writes.
 */

const BEHAVIOR_LABEL = 'Seat behavior face (expanded). Do/Dont presentation only; not durable policy. Press B for normal UI.';

function syncSeatDivisionLabel() {
  const hero = window.TeamAiHero;
  const label = document.querySelector('#seat-label');
  if (!hero || !label || typeof hero.getHierarchyState !== 'function') return;

  const state = hero.getHierarchyState();
  if (state?.openParentId && state.focusedChildId === 'SEAT_BEHAVIOR' && Number(state.behaviorBranchAmount) >= 0.85) {
    label.textContent = BEHAVIOR_LABEL;
  }
}

function scheduleSync() {
  syncSeatDivisionLabel();
  let tries = 0;
  const timer = window.setInterval(() => {
    syncSeatDivisionLabel();
    tries += 1;
    if (tries >= 12) window.clearInterval(timer);
  }, 50);
}

window.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') scheduleSync();
});
window.addEventListener('teamai:hero-state-change', scheduleSync);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
} else {
  scheduleSync();
}
