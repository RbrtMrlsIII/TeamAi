import test from 'node:test'; import assert from 'node:assert/strict'; import {transition} from '../dist/src/state-machine.js';
test('discussion workflow reaches approval then execution review completion',()=>{let s='DISCUSSING';for(const e of ['DISCUSSION_COMPLETE','START_SUMMARY','SUMMARY_READY','APPROVE','START_EXECUTION','EXECUTION_DONE','REVIEW_DONE'])s=transition(s,e);assert.equal(s,'COMPLETED')});
test('invalid workflow transition is rejected',()=>assert.throws(()=>transition('DISCUSSING','APPROVE')));
