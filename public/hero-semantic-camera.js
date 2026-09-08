const SEMANTIC_CAMERAS = Object.freeze({
  MECHANISM_IDENTITY: 'SEAT_CLOSE',
  MECHANISM_RESPONSIBILITY: 'SEAT_CLOSE',
  MECHANISM_CONNECTION: 'SEAT_CLOSE',
  MECHANISM_BEHAVIOR: 'SEAT_CLOSE',
  MECHANISM_SKILLS: 'SEAT_CLOSE',
  /** @deprecated Prefer WORKSPACE_ZIPSKILLS — same physical dock; kept for e2e / spine continuity */
  MECHANISM_ZIPSKILLS: 'DETAIL_ANCHOR',
  /** Canonical workspace-tree ZipSkills (R0). Alias of legacy MECHANISM_ZIPSKILLS. Optional; not required setup (LAW 109). */
  WORKSPACE_ZIPSKILLS: 'DETAIL_ANCHOR',
  MECHANISM_CAPABILITY: 'DETAIL_ANCHOR',
  MECHANISM_AUTHORIZATION: 'DETAIL_ANCHOR',
  MECHANISM_AUTHENTICATION: 'DETAIL_ANCHOR',
  MECHANISM_WORKSPACE: 'WORKSPACE_CLOSE',
  MECHANISM_TASK: 'DETAIL_ANCHOR',
  APP_UI_HANDOFF: null
});

/** Legacy → canonical name for ZipSkills presentation. */
const SEMANTIC_ALIASES = Object.freeze({
  MECHANISM_ZIPSKILLS: 'WORKSPACE_ZIPSKILLS'
});

function canonical(semanticCamera) {
  return SEMANTIC_ALIASES[semanticCamera] || semanticCamera;
}

function resolve(semanticCamera) {
  return Object.prototype.hasOwnProperty.call(SEMANTIC_CAMERAS, semanticCamera)
    ? SEMANTIC_CAMERAS[semanticCamera]
    : null;
}

function dispatchIntent(semanticCamera, detail = {}) {
  const physicalCamera = resolve(semanticCamera);
  const intent = {
    semanticCamera,
    canonicalSemanticCamera: canonical(semanticCamera),
    physicalCamera,
    presentationOnly: true,
    ...detail
  };

  document.documentElement.dataset.semanticCamera = semanticCamera;
  document.documentElement.dataset.canonicalSemanticCamera = canonical(semanticCamera);
  document.documentElement.dataset.physicalCamera = physicalCamera || '';
  window.dispatchEvent(new CustomEvent('teamai:web-ai-semantic-camera', { detail: intent }));

  if (physicalCamera) {
    document.querySelector(`[data-camera="${physicalCamera}"]`)?.click();
  }

  return intent;
}

window.addEventListener('teamai:web-ai-seat-inspection', (event) => {
  const semanticCamera = event.detail?.semanticCamera;
  if (semanticCamera) dispatchIntent(semanticCamera, { source: 'seat-inspection', layer: event.detail.layer || null });
});

window.addEventListener('teamai:web-ai-seat-configure-request', (event) => {
  dispatchIntent('APP_UI_HANDOFF', {
    source: 'seat-normal-ui-handoff',
    targetSection: event.detail?.targetSection || 'connection',
    normalUi: true
  });
});

window.TeamAiHeroSemanticCamera = {
  ids: () => Object.keys(SEMANTIC_CAMERAS),
  resolve,
  canonical,
  aliases: () => ({ ...SEMANTIC_ALIASES }),
  inspect: (semanticCamera, detail = {}) => {
    if (!Object.prototype.hasOwnProperty.call(SEMANTIC_CAMERAS, semanticCamera)) return null;
    return dispatchIntent(semanticCamera, { source: 'api', ...detail });
  }
};
