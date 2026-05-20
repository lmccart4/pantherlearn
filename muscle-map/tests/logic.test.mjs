import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon } from '../js/logic.js';

const square = [[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]];

test('pointInPolygon: inside square', () => {
  assert.equal(pointInPolygon({ x: 0.5, y: 0.5 }, square), true);
});
test('pointInPolygon: outside square', () => {
  assert.equal(pointInPolygon({ x: 0.05, y: 0.05 }, square), false);
});
test('pointInPolygon: inside triangle', () => {
  const tri = [[0.1, 0.1], [0.9, 0.1], [0.5, 0.9]];
  assert.equal(pointInPolygon({ x: 0.5, y: 0.3 }, tri), true);
  assert.equal(pointInPolygon({ x: 0.1, y: 0.8 }, tri), false);
});
