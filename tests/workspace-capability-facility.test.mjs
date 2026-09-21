import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('live Hero surface exposes Workspace HQ as a first-party capability facility', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/workspace-capability.css', 'utf8');

  assert.match(html, /data-workspace-open/);
  assert.match(html, /workspace-capability-facility\.js/);
  assert.match(html, /workspace-capability\.css/);
  assert.match(facility, /WORKSPACE_CENTER_ID/);
  assert.match(facility, /teamai:workspace-capability-intent/);
  assert.match(facility, /TeamAiWorkspaceFacility/);
  assert.match(css, /workspace-facility/);
});

test('Workspace facility source/public copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8'), readFileSync('public/workspace-capability-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/workspace-capability.css', 'utf8'), readFileSync('public/workspace-capability.css', 'utf8'));
});
