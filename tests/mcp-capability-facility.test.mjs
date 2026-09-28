import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSpatialConstructionNode } from '../frontend/spatial/machine-spatial-root-contract.js';
import { MCP_FACILITY_SPATIAL_CONTEXT } from '../frontend/spatial/mcp-capability-facility.js';

test('MCP facility inherits the complete S0-S10 spatial root contract', () => {
  const validation = validateSpatialConstructionNode(MCP_FACILITY_SPATIAL_CONTEXT);
  assert.equal(validation.valid, true);
  assert.equal(MCP_FACILITY_SPATIAL_CONTEXT.constructionSlice, 'S15');
  assert.equal(MCP_FACILITY_SPATIAL_CONTEXT.semanticId, 'hero-mcp-facility');
  assert.deepEqual(MCP_FACILITY_SPATIAL_CONTEXT.inheritedStructuralRoots, [
    'S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10',
  ]);
});

test('MCP facility wires the runtime read-model boundary and avoids local runtime identities', () => {
  const facility = readFileSync('frontend/spatial/mcp-capability-facility.js', 'utf8');
  assert.match(facility, /normalizeMcpRuntimeReadModel/);
  assert.match(facility, /teamai:mcp-runtime-read-model/);
  assert.match(facility, /setMcpReadModel/);
  assert.doesNotMatch(facility, /seat-01/);
  assert.doesNotMatch(facility, /seat-02/);
  assert.doesNotMatch(facility, /workspace-main/);
  assert.doesNotMatch(facility, /configuration,authorization/);
});

test('MCP facility lifecycle intent remains separate from backend authority', () => {
  const facility = readFileSync('frontend/spatial/mcp-capability-facility.js', 'utf8');
  assert.match(facility, /createMcpLifecycleIntent/);
  assert.match(facility, /teamai:mcp-lifecycle-intent/);
  assert.match(facility, /authoritative runtime confirmation is still required/i);
});

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
  assert.equal(readFileSync('frontend/spatial/mcp-capability.js', 'utf8'), readFileSync('public/mcp-capability.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/mcp-capability-runtime-read-model.js', 'utf8'), readFileSync('public/mcp-capability-runtime-read-model.js', 'utf8'));
});
