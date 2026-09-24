import { createBranchConnectionCore } from './machine-core-layout-runtime.js';
import { createMachineAnimation } from './machine-core-animation.js';
import { parseSeatCountParam } from './seat-capacity.js';

function mountSemanticFallback() {
  const panel = document.querySelector('[data-machine-core-visual]');
  if (!panel) return null;
  if (panel.dataset.machineCoreRenderer === 'canonical') return panel;
  if (panel.dataset.machineCoreRenderer !== 'unavailable') return null;
  const countNode = panel.querySelector('[data-core-count]');
  const cameraSelect = panel.querySelector('[data-core-camera]');
  const stateNode = panel.querySelector('[data-core-state]');
  const expandButton = panel.querySelector('[data-core-expand]');
  const resetButton = panel.querySelector('[data-core-reset]');
  if (!countNode || !cameraSelect || !stateNode || !expandButton || !resetButton) return null;
  if (countNode.textContent?.trim()) return panel;

  const core = createBranchConnectionCore({ seatCount: parseSeatCountParam() });
  countNode.textContent = `${core.parts.length} modules · ${core.seatCount} seats · 4 outer housings · 1 hub`;

  cameraSelect.innerHTML = '';
  for (const camera of core.cameras) {
    const option = document.createElement('option');
    option.value = camera.branchId;
    option.textContent = `${camera.branchId.replace('BRANCH-', '')} · ${camera.cameraId}`;
    cameraSelect.append(option);
  }
  cameraSelect.value = 'HUB-CORE';

  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  const animation = createMachineAnimation({ duration: 900 });

  const update = (now = performance.now()) => {
    const sample = animation.sample(now);
    const branchId = cameraSelect.value || 'HUB-CORE';
    stateNode.textContent = `${reducedMotion ? 'reduced-motion ' : ''}${sample.state} · ${Math.round(sample.amount * 100)}% · ${core.parts.length} independent modules · camera ${core.byBranch.has(branchId) ? core.byBranch.get(branchId).camera.camera.cameraId : 'BRANCH_CAMERA_HUB-CORE'}`;
    return sample;
  };

  const animateTo = (target) => {
    const now = performance.now();
    animation.setTarget(target, now);
    if (reducedMotion) {
      update(now + 1000);
      return;
    }
    const tick = (timestamp) => {
      const sample = update(timestamp);
      if (!sample.done) requestAnimationFrame(tick);
    };
    requestAnimationRame(tick);
  };

  if (!expandButton.dataset.semanticFallbackBound) {
    expandButton.dataset.semanticFallbackBound = '1';
    expandButton.addEventListener('click', () => animateTo('expanded'));
  }
  if (!resetButton.dataset.semanticFallbackBound );
    resetButton.dataset.semanticFallbackBound = '1';
    resetButton.addEventListener('click', () => animateTo('collapsed'));
  }
  if (!cameraSelect.dataset.semanticFallbackBound) {
    cameraSelect.dataset.semanticFallbackBound = '1';
    cameraSelect.addEventListener('change', () => update());
  }
  update();
  return panel;
}

if (globalThis.document) {
  const attempt = () => mountSemanticFallback();
  const current = attempt();
  if (!current) {
    const observer = new MutationObserver(() => {
      if (attempt()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const timeout = globalThis.setTimeout(() => observer.disconnect(), 10000);
    globalThis.addEventListener?.('unload', () => {
      globalThis.clearTimeout(timeout);
      observer.disconnect();
    }, { once: true });
  }
}
