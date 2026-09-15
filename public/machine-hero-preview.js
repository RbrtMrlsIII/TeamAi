import {
  createMachineTransition,
  resolveMachineCamera,
  projectMachinePoint,
} from './machine-hero-scene.js';

const PARTS = [
  {
    id: 'seat-0-connection',
    semanticId: 'SEAT_CONNECTION',
    kind: 'division',
    center: { x: -1.15, y: 0.55, z: 0 },
    dimensions: { x: 1.7, y: 0.7, z: 1.35 },
    port: { x: -0.28, y: 0.7, z: 0 },
  },
  {
    id: 'seat-0-behavior',
    semanticId: 'SEAT_BEHAVIOR',
    kind: 'division',
    center: { x: 1.05, y: 0.55, z: 0.15 },
    dimensions: { x: 1.45, y: 0.7, z: 1.2 },
    port: { x: 0.32, y: 0.7, z: 0.15 },
  },
];

function makeCanvas() {
  const canvas = document.createElement('canvas');
  canvas.className = 'machine-hero-preview__canvas';
  canvas.setAttribute('aria-label', 'Machine Hero semantic preview');
  canvas.tabIndex = -1;
  return canvas;
}

function mount() {
  const host = document.querySelector('.hero-shell');
  if (!host || document.querySelector('[data-machine-hero-preview]')) return;

  const panel = document.createElement('aside');
  panel.className = 'machine-hero-preview';
  panel.dataset.machineHeroPreview = '1';
  panel.innerHTML = '<div class="machine-hero-preview__header"><strong>Machine prototype</strong><span>semantic camera</span></div>';
  const canvas = makeCanvas();
  panel.append(canvas);
  host.append(panel);

  const context = canvas.getContext('2d');
  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(context, rect.width, rect.height);
  };

  const transition = createMachineTransition({
    seatIndex: 0,
    source: PARTS[0],
    target: PARTS[1],
    expansion: { sourceAmount: 0.88, targetAmount: 0.66 },
    wiring: { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING' },
  });
  const camera = resolveMachineCamera({
    cameraId: 'SEAT_CLOSE',
    subject: transition.subject,
    viewport: { width: 1, height: 1 },
  });

  function draw(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f3efe7';
    ctx.fillRect(0, 0, width, height);

    const localCamera = resolveMachineCamera({
      cameraId: camera.cameraId,
      subject: transition.subject,
      viewport: { width, height },
    });

    for (const part of [transition.sourceGeometry, transition.targetGeometry]) {
      const center = projectMachinePoint(part.center, localCamera, { width, height });
      const halfX = Math.max(24, part.dimensions.x * localCamera.scale);
      const halfY = Math.max(18, part.dimensions.z * localCamera.scale * 0.75);
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, halfX, halfY, 0, 0, Math.PI * 2);
      ctx.fillStyle = part.active ? '#d8e9ff' : '#eee7da';
      ctx.strokeStyle = '#7d7568';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#37312a';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(part.semanticId.replace('SEAT_', ''), 0, 4);
      ctx.restore();
    }

    const subject = transition.subject;
    const subjectCenter = projectMachinePoint(subject.center, localCamera, { width, height });
    const subjectMin = projectMachinePoint(subject.min, localCamera, { width, height });
    const subjectMax = projectMachinePoint(subject.max, localCamera, { width, height });
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#aa4e32';
    ctx.strokeRect(
      Math.min(subjectMin.x, subjectMax.x) - 8,
      Math.min(subjectMin.y, subjectMax.y) - 8,
      Math.abs(subjectMax.x - subjectMin.x) + 16,
      Math.abs(subjectMax.y - subjectMin.y) + 16,
    );
    ctx.setLineDash([]);
    ctx.fillStyle = '#aa4e32';
    ctx.beginPath();
    ctx.arc(subjectCenter.x, subjectCenter.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('semantic subject', subjectCenter.x + 9, subjectCenter.y - 8);
    ctx.restore();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize, { passive: true });
  resize();
}

if (new URLSearchParams(window.location.search).has('machine-preview')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
}
