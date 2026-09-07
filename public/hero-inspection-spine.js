const STAGES = Object.freeze([
  { id: 'HERO_ORIENTATION', label: 'Hero orientation', semanticCamera: 'HERO_WIDE' },
  { id: 'SURFACE', label: 'Shared surface', semanticCamera: 'WORKSPACE_CLOSE' },
  { id: 'FOCUS', label: 'Active Seat', semanticCamera: 'SEAT_CLOSE' },
  { id: 'CONNECTION', label: 'Connection', semanticCamera: 'MECHANISM_CONNECTION' },
  { id: 'BEHAVIOR', label: 'Behavior', semanticCamera: 'MECHANISM_BEHAVIOR' },
  { id: 'SKILLS', label: 'Skills', semanticCamera: 'MECHANISM_SKILLS' },
  { id: 'ZIPSKILLS', label: 'ZipSkills', semanticCamera: 'MECHANISM_ZIPSKILLS' },
  { id: 'CAPABILITY', label: 'Capabilities', semanticCamera: 'MECHANISM_CAPABILITY' },
  { id: 'AUTHORIZATION', label: 'Authorization / scope', semanticCamera: 'MECHANISM_AUTHORIZATION' },
  { id: 'WORKSPACE', label: 'Workspace', semanticCamera: 'MECHANISM_WORKSPACE' },
  { id: 'TASK', label: 'Task', semanticCamera: 'MECHANISM_TASK' },
  { id: 'EVIDENCE', label: 'Evidence', semanticCamera: 'MECHANISM_TASK' },
  { id: 'NORMAL_UI', label: 'Normal application UI', semanticCamera: 'APP_UI_HANDOFF' }
]);

const root = document.documentElement;
const label = document.querySelector('[data-inspection-stage]');
const previous = document.querySelector('[data-inspection-prev]');
const next = document.querySelector('[data-inspection-next]');
const reset = document.querySelector('[data-inspection-reset]');
const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
let reducedMotion = Boolean(reducedQuery?.matches);
let index = 0;

function stage() {
  return STAGES[index];
}

function publish(source = 'api') {
  const current = stage();
  root.dataset.heroInspectionStage = current.id;
  if (label) label.textContent = `${current.label} (${index + 1}/${STAGES.length})`;

  const semantic = window.TeamAiHeroSemanticCamera?.inspect(current.semanticCamera, {
    source: `inspection-spine:${source}`,
    stage: current.id,
    layer: current.id === 'NORMAL_UI' ? 'normal-ui' : 'spatial'
  });

  window.dispatchEvent(new CustomEvent('teamai:web-ai-hero-inspection-stage', {
    detail: {
      stage: current.id,
      label: current.label,
      semanticCamera: semantic?.semanticCamera || current.semanticCamera,
      physicalCamera: semantic?.physicalCamera || null,
      presentationOnly: true,
      reducedMotion
    }
  }));
}

function move(delta, source) {
  index = Math.min(STAGES.length - 1, Math.max(0, index + delta));
  publish(source);
}

function resetSpine() {
  index = 0;
  publish('reset');
}

previous?.addEventListener('click', () => move(-1, 'previous'));
next?.addEventListener('click', () => move(1, 'next'));
reset?.addEventListener('click', resetSpine);
reducedQuery?.addEventListener?.('change', event => {
  reducedMotion = event.matches;
  publish('motion-preference');
});

window.TeamAiHeroInspectionSpine = Object.freeze({
  stages: () => STAGES.map(({ id, label, semanticCamera }) => ({ id, label, semanticCamera })),
  current: () => ({ ...stage(), index, reducedMotion }),
  next: () => move(1, 'api-next'),
  previous: () => move(-1, 'api-previous'),
  reset: resetSpine,
  inspect: (stageId) => {
    const requested = STAGES.findIndex(item => item.id === stageId);
    if (requested < 0) return null;
    index = requested;
    publish('api-inspect');
    return { ...stage(), index, reducedMotion };
  }
});

publish('initial');
