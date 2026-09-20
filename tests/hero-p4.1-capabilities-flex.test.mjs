import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('CAPABILITIES controller state wiring is preserved',()=>{for(const x of ['tickCapabilitiesBranch','getCapabilitiesBranchAmount','capabilitiesFaceAccessibleName','requestCapabilitiesConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('CAPABILITIES transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickCapabilitiesBranch'));});
test('CAPABILITIES and AUTHORIZATION remain separate',()=>{assert.ok(runtime.includes('CAPABILITIES_BRANCH_MS'));assert.ok(runtime.includes('AUTHORIZATION_BRANCH_MS'));});
