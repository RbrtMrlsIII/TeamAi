import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveHeroRootPresence } from '../frontend/spatial/hero-root-runtime.js';

const fakeRoot = {
  querySelector(selector) {
    const map = {
      '.hero-shell': {
        querySelector(inner) {
          return inner === '.classic-entrance' ? {} : null;
        },
      },
      '#hero-canvas': {},
      '#hero-auth-panel': null,
      '#hero-settings-shell': {},
      '#hero-settings-panel': null,
      '[data-hero-machine-proof]': null,
    };
    return Object.prototype.hasOwnProperty.call(map, selector) ? map[selector] : null;
  },
};

test('Hero root presence derives from existing DOM contracts without owning them', () => {
  assert.deepEqual(deriveHeroRootPresence(fakeRoot), {
    entrance: true,
    machine: true,
    auth: false,
    settings: true,
    mcp: false,
    diagnostics: false,
  });
});
