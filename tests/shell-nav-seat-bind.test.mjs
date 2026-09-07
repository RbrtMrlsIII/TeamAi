import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('shell-nav binds seat-read-model projection', () => {
  const src = fs.readFileSync(path.join(process.cwd(), 'frontend/spatial/shell-nav.js'), 'utf8');
  assert.match(src, /from ["']\.\/seat-read-model\.js["']/);
  assert.match(src, /projectSeat/);
  assert.match(src, /applyProjectionToHeroSeatStack/);
  assert.match(src, /activationAllowedPresentation/);
  assert.match(src, /projectedSeat/);
  assert.doesNotMatch(src, /PLACEHOLDER/);
});
