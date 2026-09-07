const root = document.documentElement;
const openButton = document.querySelector('[data-hero-engine-open]');
const panel = document.querySelector('#hero-auth-panel');
const closeButton = document.querySelector('[data-auth-close]');
const modeButtons = [...document.querySelectorAll('[data-auth-mode]')];
const forms = [...document.querySelectorAll('[data-auth-form]')];
const status = document.querySelector('#auth-status');
const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
let reducedMotion = Boolean(reducedQuery?.matches);

function setMode(mode) {
  for (const button of modeButtons) {
    const active = button.dataset.authMode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  }
  for (const form of forms) form.hidden = form.dataset.authForm !== mode;
  const title = panel?.querySelector('[data-auth-title]');
  if (title) title.textContent = mode === 'signup' ? 'Create your TeamAi account' : 'Sign in to TeamAi';
  if (status) status.textContent = 'Firebase Authentication connection is not enabled in this build yet.';
}

function openAuth() {
  root.dataset.heroOpening = 'open';
  const semantic = window.TeamAiHeroSemanticCamera?.inspect('MECHANISM_AUTHENTICATION', {
    source: 'hero-engine-opening',
    layer: 'authentication'
  });
  window.dispatchEvent(new CustomEvent('teamai:web-ai-hero-engine-open', {
    detail: { presentationOnly: true, semanticCamera: semantic?.semanticCamera || 'MECHANISM_AUTHENTICATION' }
  }));
  if (!panel) return;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  root.dataset.authHandoff = 'open';
  if (reducedMotion) panel.classList.add('is-open');
  else requestAnimationFrame(() => panel.classList.add('is-open'));
  modeButtons[0]?.focus();
}

function closeAuth() {
  if (!panel) return;
  panel.classList.remove('is-open');
  root.dataset.authHandoff = 'closed';
  const finish = () => {
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    root.dataset.heroOpening = 'closed';
  };
  if (reducedMotion) finish(); else window.setTimeout(finish, 220);
}

openButton?.addEventListener('click', openAuth);
closeButton?.addEventListener('click', closeAuth);
modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.authMode)));
forms.forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const mode = form.dataset.authForm;
  if (status) status.textContent = `Authentication is not connected yet; ${mode === 'signup' ? 'account creation' : 'sign-in'} is presented here without sending credentials.`;
  window.dispatchEvent(new CustomEvent('teamai:web-ai-auth-intent', {
    detail: { mode, presentationOnly: true, source: 'hero-auth-form' }
  }));
}));

reducedQuery?.addEventListener?.('change', event => { reducedMotion = event.matches; });

setMode('login');
window.TeamAiHeroAuthHandoff = {
  open: openAuth,
  close: closeAuth,
  setMode,
  getState: () => ({
    open: root.dataset.authHandoff === 'open',
    mode: modeButtons.find(button => button.classList.contains('is-active'))?.dataset.authMode || 'login',
    reducedMotion
  })
};
