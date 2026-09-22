import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('live Hero surface wires the MCP facility to the existing capability contract', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/mcp-capability-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/mcp-capability.css', 'utf8');

  assert.match(html, /data-mcp-open/);
  assert.match(html, /mcp-capability-facility\.js/);
  assert.match(html, /mcp-capability\.css/);
  assert.match(facility, /createMcpCapabilityBranch/);
  assert.match(facility, /createMcpLifecycleIntent/);
  assert.match(facility, /teamai:app-ui-handoff/);
  assert.match(facility, /TeamAiMcpFacility/);
  assert.match(css, /mcp-facility/);
});

test('MCP facility source and browser delivery copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/mcp-capability-facility.js', 'utf8'), readFileSync('public/mcp-capability-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/mcp-capability.css', 'utf8'), readFileSync('public/mcp-capability.css', 'utf8'));
});
