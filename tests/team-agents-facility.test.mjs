import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Hero exposes Team / Agents as a discoverable product facility', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/team-agents-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/team-agents-facility.css', 'utf8');
  assert.match(html, /data-team-agents-open/);
  assert.match(html, /team-agents-facility\.js/);
  assert.match(html, /team-agents-facility\.css/);
  assert.match(facility, /teamai:agent-assignment-intent/);
  assert.match(facility, /TeamAiTeamAgentsFacility/);
  assert.match(css, /team-agents-facility/);
});

test('Team / Agents facility source/public copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/team-agents-facility.js', 'utf8'), readFileSync('public/team-agents-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/team-agents-facility.css', 'utf8'), readFileSync('public/team-agents-facility.css', 'utf8'));
});
