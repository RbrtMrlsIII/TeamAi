/**
 * Bridge seat-stack layer inspect → action map (avoid lock-only camera clicks).
 * Loaded after hero-seat-stack.js. Presentation only · no 029-released claim.
 */
import { applyResolvedCamera } from './hero-dom-action-map.js';

window.addEventListener('teamai:web-ai-seat-inspection', (event) => {
  const camera = event.detail?.layer?.camera;
  if (!camera) return;
  const hierarchyOpen = document.querySelector('.hero-shell')?.getAttribute('data-hero-machine-ui') === '1'
    || document.querySelector('.hero-shell')?.dataset?.hierarchyOpen === 'true';
  applyResolvedCamera(camera, { hierarchyOpen });
});
