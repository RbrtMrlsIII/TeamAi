import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('BEHAVIOR controller state wiring is preserved',()=>{for(const x of ['tickBehaviorBranch','getBehaviorBranchAmount','behaviorFaceAccessibleName','requestBehaviorConfigureHandoff']) assert.ok(flex.includes(x)); assert.ok(flex.includes('machine-world-renderer.js'));});
test('BEHAVIOR transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickBehaviorBranch'));});
test('BEHAVIOR handoff and labels remain controller-owned',()=>{assert.ok(flex.includes('requestBehaviorConfigureHandoff'));assert.ok(flex.includes('behaviorFaceAccessibleName'));});
test('BEHAVIOR runtime implementation remains source-owned',()=>{assert.ok(runtime.includes('tickBehaviorBranch'));assert.ok(runtime.includes('behaviorFaceAccessibleName'));});
