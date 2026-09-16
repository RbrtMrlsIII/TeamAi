import { createMachineTransitionFromPayload } from './machine-hero-payload.js';
import { resolveMachineCamera } from './machine-hero-scene.js';

const PAYLOAD = {
  seatIndex: 0,
  source: { id: 'hero-proof-source', semanticId: 'SEAT_CONNECTION', center: { x: -1.15, y: 0.55, z: 0 }, port: { x: -0.28, y: 0.7, z: 0 }, labels: ['Connection'], controls: 2, density: 2 },
  target: { id: 'hero-proof-target', semanticId: 'SEAT_BEHAVIOR', center: { x: 1.05, y: 0.55, z: 0.15 }, port: { x: 0.32, y: 0.7, z: 0.15 }, labels: ['Behavior', 'Defaults'], controls: 3, density: 3 },
  expansion: { sourceAmount: 0.88, targetAmount: 0.66 },
  wiring: { id: 'MACHINE-BRANCH-SEAT-01:SEAT_CONNECTION:ADJACENCY_WIRING' },
};

export function mountHeroMachineProof(root = globalThis.document) {
  if (!root?.querySelector) return null;
  const hero = root.querySelector('.hero-shell');
  const productionCanvas = root.querySelector('#hero-canvas');
  if (!hero || !productionCanvas || root.querySelector('[data-hero-machine-proof]')) return null;

  const panel = root.createElement('aside');
  panel.dataset.heroMachineProof = '1';
  panel.setAttribute('aria-label', 'Machine Hero proof surface');
  panel.style.cssText = 'position:absolute;inset:12% 8%;z-index:30;pointer-events:none;border:1px dashed rgba(170,78,50,.55);border-radius:28px;padding:14px;box-sizing:border-box;';
  panel.innerHTML = '<div style="display:flex;justify-content:space-between;gap:12px;font:600 11px/1.4 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;"><span>M6 machine proof</span><output data-hero-machine-proof-state>semantic subject locked</output></div><button type="button" data-hero-machine-proof-nudge style="pointer-events:auto;margin-top:8px;padding:6px 10px;border:1px solid rgba(48,43,37,.2);border-radius:9px;background:rgba(255,255,255,.82);">Mutate geometry</button>';
  hero.append(panel);

  let offset = 0;
  const transition = () => createMachineTransitionFromPayload({
    ...PAYLOAD,
    target: {
      ...PAYLOAD.target,
      center: { x: PAYLOAD.target.center.x + offset, y: PAYLOAD.target.center.y, z: PAYLOAD.target.center.z + offset * 0.3 },
      port: { x: PAYLOAD.target.port.x + offset, y: PAYLOAD.target.port.y, z: PAYLOAD.target.port.z + offset * 0.3 },
    },
  });

  const state = panel.querySelector('[data-hero-machine-proof-state]');
  const update = () => {
    const t = transition();
    const camera = resolveMachineCamera({ cameraId: 'SEAT_CLOSE', subject: t.subject, viewport: { width: productionCanvas.clientWidth || 1, height: productionCanvas.clientHeight || 1 } });
    state.textContent = offset ? `subject moved · target ${camera.target.x.toFixed(2)},${camera.target.z.toFixed(2)}` : 'semantic subject locked';
    panel.dataset.cameraId = camera.cameraId;
    panel.dataset.targetX = String(camera.target.x);
    panel.dataset.targetZ = String(camera.target.z);
  };

  panel.querySelector('[data-hero-machine-proof-nudge]').addEventListener('click', () => { offset = offset ? 0 : 0.9; update(); });
  update();
  return panel;
}

async function mountHeroMachineCandidate(root = globalThis.document) {
  if (!root?.querySelector) return null;
  const params = new URLSearchParams(globalThis.location?.search || '');
  if (!params.has('machine-candidate')) return null;
  const hero = root.querySelector('.hero-shell');
  const productionCanvas = root.querySelector('#hero-canvas');
  if (!hero || !productionCanvas || root.querySelector('[data-hero-machine-candidate]')) return null;

  productionCanvas.hidden = true;
  productionCanvas.style.setProperty('display', 'none', 'important');
  hero.dataset.machineCandidate = '1';
  for (const selector of ['.classic-entrance','.hero-copy','.spatial-parts','.seat-stack','.hero-controls','.world-navigation','.hero-settings-mount']) {
    const node = root.querySelector(selector);
    if (node) node.hidden = true;
  }

  const style = root.createElement('link');
  style.rel = 'stylesheet';
  style.href = './machine-core.css';
  root.head?.append(style);

  const shell = root.createElement('section');
  shell.className = 'machine-core-shell';
  shell.dataset.heroMachineCandidate = '1';
  shell.setAttribute('aria-label', 'TeamAi modular machine Hero candidate');
  shell.style.cssText = 'position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:transparent;';
  hero.append(shell);

  await import('./machine-core-visual.js');
  await import('./machine-core-interaction.js');
  return shell;
}

if (globalThis.document) {
  const run = () => {
    const params = new URLSearchParams(globalThis.location?.search || '');
    if (params.has('machine-candidate')) void mountHeroMachineCandidate();
    if (params.has('machine-proof')) mountHeroMachineProof();
  };
  if (globalThis.document.readyState === 'loading') globalThis.document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
}
