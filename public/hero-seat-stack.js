const LAYERS = [
  { id: 'connection', label: 'Connection', sub: 'external app account / integration', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_CONNECTION', handoff: 'connection' },
  { id: 'behavior', label: 'Behavior', sub: 'Do / Don’t', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_BEHAVIOR', handoff: 'behavior' },
  { id: 'toolkit', label: 'Built-in Toolkit', sub: 'included skills', camera: 'SEAT_CLOSE', semanticCamera: 'MECHANISM_SKILLS', handoff: 'skills' },
  { id: 'zipskills', label: 'ZipSkills', sub: 'optional skills', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_ZIPSKILLS', handoff: 'zipskills' },
  { id: 'capabilities', label: 'Capabilities', sub: 'tools / MCP availability', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_CAPABILITY', handoff: 'capabilities' },
  { id: 'authorization', label: 'Authorization', sub: 'scope / approvals', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_AUTHORIZATION', handoff: 'authorization' },
  { id: 'workspace', label: 'Workspace', sub: 'shared ref / state', camera: 'WORKSPACE_CLOSE', semanticCamera: 'MECHANISM_WORKSPACE', handoff: 'workspace' },
  { id: 'task', label: 'Task / Evidence', sub: 'state / verification', camera: 'DETAIL_ANCHOR', semanticCamera: 'MECHANISM_TASK', handoff: 'task-evidence' }
];

const stack = document.querySelector('.seat-stack');
if (!stack) throw new Error('Web AI Seat stack mount missing');

let activeLayer = null;
const equipped = new Set();

function setVisualState() {
  stack.querySelectorAll('[data-seat-layer]').forEach((el) => {
    const id = el.dataset.seatLayer;
    const selected = activeLayer === id;
    const isEquipped = equipped.has(id);
    el.setAttribute('aria-pressed', String(selected));
    el.dataset.equipped = String(isEquipped);
    el.classList.toggle('is-equipped-focus', selected);
    el.classList.toggle('is-equipped', isEquipped);
    const state = el.querySelector('.seat-stack__state');
    if (state) state.textContent = isEquipped ? 'ON' : '·';
  });
  stack.dataset.activeLayer = activeLayer || '';
  stack.style.setProperty('--equipped-count', String(equipped.size));
}

function inspect(layer) {
  activeLayer = activeLayer === layer.id ? null : layer.id;
  setVisualState();
  if (activeLayer) document.querySelector(`[data-camera="${layer.camera}"]`)?.click();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-inspection', {
    detail: {
      layer: activeLayer,
      camera: activeLayer ? layer.camera : null,
      semanticCamera: activeLayer ? layer.semanticCamera : null,
      presentationOnly: true
    }
  }));
}

LAYERS.forEach((layer, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'seat-stack__module';
  button.dataset.seatLayer = layer.id;
  button.dataset.semanticCamera = layer.semanticCamera;
  button.style.setProperty('--stack-depth', String(index));
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `${layer.label}: inspect ${layer.semanticCamera}`);
  button.innerHTML = `
    <span class="seat-stack__gear" aria-hidden="true"></span>
    <span class="seat-stack__copy"><b>${layer.label}</b><small>${layer.sub}</small></span>
    <span class="seat-stack__state" aria-hidden="true">·</span>
  `;
  button.addEventListener('click', () => inspect(layer));
  stack.appendChild(button);
});

const note = document.createElement('p');
note.className = 'seat-stack__note';
note.textContent = 'Connect through the external app’s supported account/integration flow. No file upload is required.';
stack.appendChild(note);

const distinction = document.createElement('p');
distinction.className = 'seat-stack__distinction';
distinction.innerHTML = '<b>Capability ≠ Authorization</b><span>Availability is inspected separately from allowed scope.</span>';
stack.appendChild(distinction);

const handoff = document.createElement('button');
handoff.type = 'button';
handoff.className = 'seat-stack__handoff';
handoff.textContent = 'Configure Seat → normal UI';
handoff.addEventListener('click', () => {
  const layer = LAYERS.find((item) => item.id === activeLayer);
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', {
    detail: {
      targetSection: layer?.handoff || 'connection',
      seatContext: 'current',
      presentationOnly: true,
      normalUi: true,
      semanticCamera: 'APP_UI_HANDOFF'
    }
  }));
});
stack.appendChild(handoff);

function setEquipped(id, value = true) {
  const layer = LAYERS.find((item) => item.id === id);
  if (!layer) return false;
  if (value) equipped.add(id); else equipped.delete(id);
  setVisualState();
  window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-equipment-preview', {
    detail: { layer: id, equipped: value, semanticCamera: layer.semanticCamera, presentationOnly: true }
  }));
  return equipped.has(id);
}

window.TeamAiHeroSeatStack = {
  layers: () => LAYERS.map((layer) => ({ ...layer })),
  getActiveLayer: () => activeLayer,
  getEquippedLayers: () => Array.from(equipped),
  inspect: (id) => {
    const layer = LAYERS.find((item) => item.id === id);
    if (layer) inspect(layer);
    return activeLayer;
  },
  setEquipped,
  setConfiguration: (configuration = {}) => {
    Object.keys(configuration).forEach((id) => setEquipped(id, Boolean(configuration[id])));
    return Array.from(equipped);
  }
};

setVisualState();
