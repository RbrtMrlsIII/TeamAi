/**
 * #278 C — classic first paint must not show legacy Layer-A brand or far footer.
 * Presentation only · no 029-released claim.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('classic experience hides hero-copy and far-environment (no duplicate logo/footer)', async () => {
  const css = await readFile(join(root, 'public/experience-rebaseline.css'), 'utf8');
  assert.match(css, /data-experience="classic"\] \.hero-copy/);
  assert.match(css, /data-experience="classic"\] ~ \.far-environment/);
  // both use hard hide (same pattern as other classic world chrome)
  assert.match(css, /\.hero-copy \{\s*display:\s*none\s*!important/s);
  assert.match(css, /\.far-environment \{\s*display:\s*none\s*!important/s);
});

test('classic-entrance remains the sole first-paint brand surface in index.html', async () => {
  const html = await readFile(join(root, 'public/index.html'), 'utf8');
  assert.match(html, /class="classic-entrance"/);
  assert.match(html, /class="hero-copy"/); // retained in DOM for world/layer transitions
  assert.match(html, /class="far-environment"/);
  assert.match(html, /teamai_icon_2_5d\.png/);
});
