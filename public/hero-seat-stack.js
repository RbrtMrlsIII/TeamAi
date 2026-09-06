const LAYERS = [
  { id: 'connection', label: 'Connection', sub: 'external app account / integration', camera: 'SEAT_CLOSE' },
  { id: 'behavior', label: 'Behavior', sub: 'Do / Don’t', camera: 'SEAT_CLOSE' },
  { id: 'toolkit', label: 'Built-in Toolkit', sub: 'included skills', camera: 'SEAT_CLOSE' },
  { id: 'zipskills', label: 'ZipSkills', sub: 'optional skills', camera: 'DETAIL_ANCHOR' },
  { id: 'capabilities', label: 'Capabilities', sub: 'tools / MCP availability', camera: 'DETAIL_ANCHOR' },
  { id: 'authorization', label: 'Authorization', sub: 'scope / approvals', camera: 'DETAIL_ANCHOR' },
  { id: 'workspace', label: 'Workspace', sub: 'shared ref / state', camera: 'WORKSPACE_CLOSE' },
  { id: 'task', label: 'Task / Evidence', sub: 'state / verification', camera: 'DETAIL_ANCHOR' }
];

const stack = document.querySelector('.seat-stack');
if (!stack) throw new Error('Web AI Seat stack mount missing');

let activeLayer = null;

function inspect(layer, button) {
  activeLayer = activeLayer === layer.id ? null : layer.id;
  stack.querySelectorAll('[data-seat-layer]').forEach((el) => {
    const selected = activeLayer === el.dataset.seatLayer;
    el.setAttribute('aria-pressed', String(selected));
    el.classList.toggle('is-equipped-focus', selected);
  });

  if (activeLayer) {
    const target = document.querySelector(`[data-camera="${layer.camera}"]`);
    target?.click();
  }

  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-inspection', {
    detail: {
      layer: activeLayer,
      camera: activeLayer ? layer.camera : null,
      presentationOnly: true
    }
  }));
}

LAYERS.forEach((layer, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'seat-stack__module';
  button.dataset.seatLayer = layer.id;
  button.style.setProperty('--stack-depth', String(index));
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <span class="seat-stack__gear" aria-hidden="true"></span>
    <span class="seat-stack__copy"><b>${layer.label}</b><small>${layer.sub}</small></span>
    <span class="seat-stack__state" aria-hidden="true"></span>
  `;
  button.addEventListener('click', () => inspect(layer, button));
  stack.appendChild(button);
});

const handoff = document.createElement('button');
handoff.type = 'button';
handoff.className = 'seat-stack__handoff';
handoff.textContent = 'Configure Seat → normal UI';
handoff.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', {
    detail: {
      targetSection: activeLayer || 'connection',
      seatContext: 'current',
      presentationOnly: true
    }
  }));
});
stack.appendChild(handoff);

window.TeamAiHeroSeatStack = {
  layers: () => LAYERS.map((layer) => ({ ...layer })),
  getActiveLayer: () => activeLayer,
  inspect: (id) => {
    const layer = LAYERS.find((item) => item.id === id);
    const button = stack.querySelector(`[data-seat-layer="${id}"]`);
    if (layer && button) inspect(layer, button);
    return activeLayer;
  }
};
