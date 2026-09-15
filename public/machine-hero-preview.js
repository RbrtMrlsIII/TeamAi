import { createMachineTransition, resolveMachineCamera, projectMachinePoint } from './machine-hero-scene.js';

const BASE_SOURCE = { id: 'seat-0-connection', semanticId: 'SEAT_CONNECTION', kind: 'division', center: { x: -1.15, y: 0.55, z: 0 }, dimensions: { x: 1.7, y: 0.7, z: 1.35 }, port: { x: -0.28, y: 0.7, z: 0 } };
const BASE_TARGET = { id: 'seat-0-behavior', semanticId: 'SEAT_BEHAVIOR', kind: 'division', center: { x: 1.05, y: 0.55, z: 0.15 }, dimensions: { x: 1.45, y: 0.7, z: 1.2 }, port: { x: 0.32, y: 0.7, z: 0.15 } };

function makeCanvas() { const canvas = document.createElement('canvas'); canvas.className = 'machine-hero-preview__canvas'; canvas.setAttribute('aria-label', 'Machine Hero semantic preview'); return canvas; }

function mount() {
  const host = document.querySelector('.hero-shell');
  if (!host || document.querySelector('[data-machine-hero-preview]')) return;

  const panel = document.createElement('aside');
  panel.className = 'machine-hero-preview';
  panel.dataset.machineHeroPreview = '1';
  panel.innerHTML = '<div class="machine-hero-preview__header"><strong>Machine prototype</strong><span>semantic camera</span></div><div class="machine-hero-preview__controls"><button type="button" data-machine-nudge>Move target geometry</button><output class="machine-hero-preview__readout" data-machine-state>subject follows geometry</output></div>';
  const canvas = makeCanvas();
  panel.append(canvas);
  host.append(panel);

  const context = canvas.getContext('2d');
  let offset = 0;
  const buildTransition = () => createMachineTransition({
    seatIndex: 0,
    source: BASE_SOURCE,
    target: { ...BASE_TARGET, center: { x: BASE_TARGET.center.x + offset, y: BASE_TARGET.center.y, z: BASE_TARGET.center.z + offset * 0.3 }, port: { ...BASE_TARGET.port, x: BASE_TARGET.port.x + offset, z: BASE_TARGET.port.z + offset * 0.3 } },
    expansion: { sourceAmount: 0.88, targetAmount: 0.66 },
    wiring: { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING' },
  });

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(context, rect.width, rect.height);
  };

  function draw(ctx, width, height) {
    const transition = buildTransition();
    const camera = resolveMachineCamera({ cameraId: 'SEAT_CLOSE', subject: transition.subject, viewport: { width, height } });
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f3efe7'; ctx.fillRect(0, 0, width, height);
    for (const part of [transition.sourceGeometry, transition.targetGeometry]) {
      const center = projectMachinePoint(part.center, camera, { width, height });
      const halfX = Math.max(24, part.dimensions.x * camera.scale);
      const halfY = Math.max(18, part.dimensions.z * camera.scale * 0.75);
      ctx.save(); ctx.translate(center.x, center.y); ctx.beginPath(); ctx.ellipse(0, 0, halfX, halfY, 0, 0, Math.PI * 2);
      ctx.fillStyle = part.active ? '#d8e9ff' : '#eee7da'; ctx.strokeStyle = '#7d7568'; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#37312a'; ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(part.semanticId.replace('SEAT_', ''), 0, 4); ctx.restore();
    }
    const subjectCenter = projectMachinePoint(transition.subject.center, camera, { width, height });
    const subjectMin = projectMachinePoint(transition.subject.min, camera, { width, height });
    const subjectMax = projectMachinePoint(transition.subject.max, camera, { width, height });
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = '#aa4e32';
    ctx.strokeRect(Math.min(subjectMin.x, subjectMax.x) - 8, Math.min(subjectMin.y, subjectMax.y) - 8, Math.abs(subjectMax.x - subjectMin.x) + 16, Math.abs(subjectMax.y - subjectMin.y) + 16);
    ctx.setLineDash([]); ctx.fillStyle = '#aa4e32'; ctx.beginPath(); ctx.arc(subjectCenter.x, subjectCenter.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.font = '11px system-ui, sans-serif'; ctx.fillText('semantic subject → camera target', subjectCenter.x + 10, subjectCenter.y - 8); ctx.restore();
  }

  panel.querySelector('[data-machine-nudge]').addEventListener('click', () => {
    offset = offset ? 0 : 1.05;
    panel.querySelector('[data-machine-state]').textContent = offset ? 'geometry moved · target moved' : 'subject returned to base geometry';
    resize();
  });
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  window.addEventListener('resize', resize, { passive: true }); resize();
}

if (new URLSearchParams(window.location.search).has('machine-preview')) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
}
