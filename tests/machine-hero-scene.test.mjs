import assert from 'node:assert/strict';
import test from 'node:test';
import { createMachineTransition, deriveMachineSubject, resolveMachineCamera } from '../frontend/spatial/machine-hero-scene.js';

const source={id:'s0',semanticId:'SEAT_CONNECTION',center:{x:-1,y:.5,z:0},dimensions:{x:2,y:1,z:1.4},port:{x:0,y:.5,z:0}};
const target={id:'s1',semanticId:'SEAT_BEHAVIOR',center:{x:1,y:.5,z:0},dimensions:{x:1.6,y:1,z:1.2},port:{x:1,y:.5,z:0}};
const reverseSource={id:'r0',semanticId:'SEAT_BEHAVIOR',center:{x:1.4,y:.5,z:.8},dimensions:{x:1.6,y:1,z:1.2},port:{x:.9,y:.5,z:.8}};
const reverseTarget={id:'r1',semanticId:'SEAT_CONNECTION',center:{x:3.2,y:.5,z:1.1},dimensions:{x:2,y:1,z:1.4},port:{x:3,y:.5,z:1.1}};

test('canonical transition contains machine contract',()=>{const t=createMachineTransition({seatIndex:0,source,target,expansion:{sourceAmount:.25,targetAmount:.75},wiring:{id:'wire-1'}});assert.equal(t.sourceDivisionId,'SEAT_CONNECTION');assert.equal(t.targetDivisionId,'SEAT_BEHAVIOR');assert.deepEqual(t.sourcePort,source.port);assert.deepEqual(t.targetPort,target.port);assert.equal(t.wiring.id,'wire-1');assert.deepEqual(t.wiring.sourcePort,source.port);assert.deepEqual(t.wiring.targetPort,target.port);assert.ok(t.subject);});
test('subject follows geometry mutation',()=>{const a=deriveMachineSubject([source,target]);const b=deriveMachineSubject([source,{...target,center:{x:2.5,y:.5,z:.75}}]);assert.notDeepEqual(a.center,b.center);assert.ok(b.max.x>a.max.x);assert.ok(b.max.z>a.max.z);});
test('wiring follows moved semantic target port',()=>{const movedTarget={...target,port:{x:2.75,y:.5,z:1.2}};const t=createMachineTransition({source,target:movedTarget,wiring:{id:'wire-2'}});assert.deepEqual(t.wiring.sourcePort,source.port);assert.deepEqual(t.wiring.targetPort,movedTarget.port);});
test('missing semantic port fails closed for wiring',()=>{const t=createMachineTransition({source,target:{...target,port:null}});assert.equal(t.wiring,null);});
test('same camera algorithm works for a different semantic pair',()=>{const forward=createMachineTransition({source,target});const alternate=createMachineTransition({seatIndex:0,source:reverseSource,target:reverseTarget});const a=resolveMachineCamera({cameraId:'SEAT_CLOSE',subject:forward.subject});const b=resolveMachineCamera({cameraId:'SEAT_CLOSE',subject:alternate.subject});assert.equal(a.cameraId,b.cameraId);assert.notDeepEqual(a.target,b.target);});
test('camera identity stays named while target follows subject',()=>{const a=createMachineTransition({source,target});const b=createMachineTransition({source,target:{...target,center:{x:3.25,y:.5,z:1.5}}});const c=resolveMachineCamera({cameraId:'SEAT_CLOSE',subject:a.subject});const d=resolveMachineCamera({cameraId:c.cameraId,subject:b.subject});assert.equal(c.cameraId,'SEAT_CLOSE');assert.equal(d.cameraId,'SEAT_CLOSE');assert.notDeepEqual(c.target,d.target);});
test('invalid transition fails closed',()=>assert.throws(()=>createMachineTransition({source,target:{...target,semanticId:null}})));
