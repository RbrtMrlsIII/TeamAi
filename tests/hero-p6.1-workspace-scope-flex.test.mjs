import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const flex=readFileSync(new URL('../public/hero-flex.js',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../public/hero-hierarchy-runtime.js',import.meta.url),'utf8');
test('WORKSPACE_SCOPE controller state wiring is preserved',()=>{for(const x of ['tickWorkspaceScopeBranch','getWorkspaceScopeBranchAmount','workspaceScopeFaceAccessibleName','requestWorkspaceScopeConfigureHandoff']) assert.ok(flex.includes(x));assert.ok(flex.includes('machine-world-renderer.js'));});
test('WORKSPACE_SCOPE transition ticks after hierarchy pose',()=>{assert.ok(flex.indexOf('tickHierarchyPose')<flex.indexOf('tickWorkspaceScopeBranch'));});
test('WORKSPACE_SCOPE stays a presentation branch',()=>{assert.ok(runtime.includes('WORKSPACE_SCOPE_BRANCH_MS'));assert.ok(runtime.includes('workspace scope face'));});
