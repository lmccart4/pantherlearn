import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon } from '../js/logic.js';
import { shuffle, buildDeck } from '../js/logic.js';
import { judgeClick } from '../js/logic.js';

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

// Deterministic RNG: cycles through a fixed list of values in [0,1).
function seqRng(values) {
  let i = 0;
  return () => values[i++ % values.length];
}

test('shuffle: returns a permutation, same members, new array', () => {
  const input = ['a', 'b', 'c', 'd'];
  const out = shuffle(input, seqRng([0.9, 0.1, 0.5, 0.3]));
  assert.notEqual(out, input);
  assert.deepEqual([...out].sort(), [...input].sort());
  assert.deepEqual(input, ['a', 'b', 'c', 'd']);
});

test('buildDeck: returns shuffled tier ids from content', () => {
  const content = { TIERS: { easy: ['x', 'y', 'z'] }, MUSCLES: {} };
  const deck = buildDeck('easy', content, seqRng([0.5, 0.5, 0.5]));
  assert.equal(deck.length, 3);
  assert.deepEqual([...deck].sort(), ['x', 'y', 'z']);
});

const jcContent = {
  TIERS: { easy: ['biceps', 'quads'] },
  MUSCLES: {
    biceps: { name: 'Biceps', view: 'front', polygon: [[0.1,0.1],[0.4,0.1],[0.4,0.4],[0.1,0.4]] },
    quads:  { name: 'Quads',  view: 'front', polygon: [[0.6,0.6],[0.9,0.6],[0.9,0.9],[0.6,0.9]] },
    hams:   { name: 'Hams',   view: 'back',  polygon: [[0.1,0.1],[0.4,0.1],[0.4,0.4],[0.1,0.4]] }
  }
};
const tierIds = ['biceps', 'quads'];

test('judgeClick: correct region on correct view', () => {
  const r = judgeClick({ x: 0.25, y: 0.25 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'correct', hitId: 'biceps' });
});
test('judgeClick: wrong muscle hit', () => {
  const r = judgeClick({ x: 0.75, y: 0.75 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'wrong', hitId: 'quads' });
});
test('judgeClick: empty space', () => {
  const r = judgeClick({ x: 0.5, y: 0.5 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'empty', hitId: null });
});
test('judgeClick: target on other view, click hits nothing here', () => {
  const r = judgeClick({ x: 0.25, y: 0.25 }, 'back', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'empty', hitId: null });
});
