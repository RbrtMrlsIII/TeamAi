import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Seat-1 adjacent wiring renderer is generated from the semantic wiring contract', () => {
  const hero = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(hero, /function drawSeat1AdjacentDivisionWiring\(/);
  assert.match(hero, /buildAdjacentDivisionWiring\(/);
  assert.match(hero, /adjacentDivisionWiringPoint\(/);
  assert.match(hero, /Math\.min\(sourceAmount, targetAmount\)/);
});

test('Seat-1 adjacent wiring renderer remains gated until both divisions are active', () => {
  const hero = readFileSync(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(hero, /sourceAmount <= 0 \|\| targetAmount <= 0/);
});
