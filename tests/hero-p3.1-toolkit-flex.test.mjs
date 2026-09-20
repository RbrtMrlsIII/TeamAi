import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('TOOLKIT controller state wiring is preserved',()=>{for(const x of ['tickToolkitBranch','getToolkitBranchAmount','toolkitFaceAccessibleName','requestToolkitConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('TOOLKIT transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickToolkitBranch'));});
test('TOOLKIT handoff and optional semantics remain',()=>{assert.ok(runtime.includes('TOOLKIT_BRANCH_MS'));assert.ok(runtime.includes('requestToolkitConfigureHandoff'));});
