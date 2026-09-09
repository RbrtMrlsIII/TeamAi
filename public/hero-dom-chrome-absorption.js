/**
 * DOM chrome soft-absorption when hierarchy machine UI is open.
 * Authority: TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md
 * Presentation only · no 029-released claim.
 */

export const MACHINE_UI_ATTR = 'data-hero-machine-ui';

export const DOM_CHROME_SELECTORS = Object.freeze([
  '.seat-stack',
  '.hero-inspection',
  '.hero-controls .control-row',
  '.spatial-parts',
]);

export function applyMachineUiChrome(shell, opts = {}) {
  const open = Boolean(opts.hierarchyOpen);
  if (!shell || typeof shell.setAttribute !== 'function') {
    return { hierarchyOpen: open, hiddenCount: 0 };
  }
  shell.setAttribute(MACHINE_UI_ATTR, open ? '1' : '0');
  let hiddenCount = 0;
  for (const sel of DOM_CHROME_SELECTORS) {
    const nodes = shell.querySelectorAll(sel);
    for (const el of nodes) {
      el.classList.toggle('is-machine-absorbed', open);
      el.setAttribute('aria-hidden', open ? 'true' : 'false');
      if (open) {
        el.setAttribute('inert', '');
        hiddenCount += 1;
      } else {
        el.removeAttribute('inert');
      }
    }
  }
  return { hierarchyOpen: open, hiddenCount };
}

export function isMachineUiOpen(shell) {
  if (!shell || !shell.getAttribute) return false;
  return shell.getAttribute(MACHINE_UI_ATTR) === '1';
}
