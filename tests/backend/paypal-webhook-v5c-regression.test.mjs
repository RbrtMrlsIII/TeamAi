import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../../supabase/functions/teamai-paypal-webhook-v5c/index.ts', import.meta.url), 'utf8');

test('v5c synchronizes the canonical commerce aggregate after a mapped successful event', () => {
  assert.match(source, /type EventMapping=\{type:string;entitlementStatus:string\|null;aggregateStatus:string\|null;warning:string\|null\}/);
  assert.match(source, /PAYMENT\.CAPTURE\.COMPLETED.*aggregateStatus:"completed"/);
  assert.match(source, /if\(mapped\.aggregateStatus\)\{await firestorePatch\(intentPath/);
});

test('v5c applies aggregate synchronization before duplicate-event early return', () => {
  const aggregatePatch = source.indexOf('if(mapped.aggregateStatus)');
  const duplicateReturn = source.indexOf('if(eventResult==="exists")');
  assert.ok(aggregatePatch >= 0, 'aggregate patch must exist');
  assert.ok(duplicateReturn > aggregatePatch, 'aggregate patch must precede duplicate return');
});
