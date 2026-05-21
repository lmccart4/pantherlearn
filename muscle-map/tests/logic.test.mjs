import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon } from '../js/logic.js';
import { shuffle, buildDeck } from '../js/logic.js';
import { judgeClick, polygonsOverlap } from '../js/logic.js';
import { createGame, applyResult, isTimeUp } from '../js/logic.js';

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
test('judgeClick: squarely inside a wrong muscle -> wrong', () => {
  const r = judgeClick({ x: 0.75, y: 0.75 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'wrong', hitId: 'quads' });
});
test('judgeClick: mis-click nearest the target -> correct (snap)', () => {
  // just outside biceps (x just past 0.4); biceps is far nearer than quads
  const r = judgeClick({ x: 0.45, y: 0.25 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'correct', hitId: 'biceps' });
});
test('judgeClick: mis-click nearest a wrong muscle -> wrong (snap)', () => {
  // just outside quads (x just shy of 0.6); quads nearest, biceps far, no overlap
  const r = judgeClick({ x: 0.55, y: 0.75 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'wrong', hitId: 'quads' });
});
test('judgeClick: target on other view -> empty (exploration, no commit)', () => {
  const r = judgeClick({ x: 0.25, y: 0.25 }, 'back', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'empty', hitId: null });
});

// Layering: a small correct target overlapping a larger wrong one.
const layerContent = {
  TIERS: { easy: ['big', 'small'] },
  MUSCLES: {
    big:   { name: 'Big',   view: 'front', polygon: [[0.10,0.50],[0.50,0.50],[0.50,0.90],[0.10,0.90]] },
    small: { name: 'Small', view: 'front', polygon: [[0.25,0.60],[0.45,0.60],[0.45,0.80],[0.25,0.80]] }
  }
};
const layerIds = ['big', 'small'];

test('judgeClick: mis-click nearest the wrong target, but correct overlaps it -> correct', () => {
  // click left of both; nearest is "big", but target "small" is layered inside "big"
  const r = judgeClick({ x: 0.05, y: 0.70 }, 'front', 'small', layerIds, layerContent);
  assert.deepEqual(r, { result: 'correct', hitId: 'small' });
});

test('polygonsOverlap: detects containment and separation', () => {
  assert.equal(polygonsOverlap(layerContent.MUSCLES.big.polygon, layerContent.MUSCLES.small.polygon), true);
  assert.equal(polygonsOverlap(jcContent.MUSCLES.biceps.polygon, jcContent.MUSCLES.quads.polygon), false);
});

const gsContent = {
  TIERS: { easy: ['a', 'b', 'c'] },
  MUSCLES: {
    a: { name: 'A', view: 'front', polygon: [] },
    b: { name: 'B', view: 'front', polygon: [] },
    c: { name: 'C', view: 'front', polygon: [] }
  }
};

test('createGame lives: 3 lives, playing, current set', () => {
  const s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  assert.equal(s.mode, 'lives');
  assert.equal(s.lives, 3);
  assert.equal(s.score, 0);
  assert.equal(s.status, 'playing');
  assert.equal(s.deck.length, 3);
  assert.equal(s.current, s.deck[0]);
  assert.equal(s.total, 3);
});

test('applyResult lives correct: score up, advance', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'correct', seqRng([0.5]));
  assert.equal(s.score, 1);
  assert.equal(s.lives, 3);
  assert.equal(s.current, s.deck[1]);
  assert.equal(s.status, 'playing');
});

test('applyResult lives empty: no change, no advance', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  const before = s.current;
  s = applyResult(s, 'empty', seqRng([0.5]));
  assert.equal(s.score, 0);
  assert.equal(s.lives, 3);
  assert.equal(s.current, before);
});

test('applyResult lives wrong: lose a life, track missed, advance', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  const missedId = s.current;
  s = applyResult(s, 'wrong', seqRng([0.5]));
  assert.equal(s.lives, 2);
  assert.deepEqual(s.missed, [missedId]);
  assert.equal(s.current, s.deck[1]);
});

test('lives end on 0 lives', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'wrong', seqRng([0.5]));
  s = applyResult(s, 'wrong', seqRng([0.5]));
  s = applyResult(s, 'wrong', seqRng([0.5]));
  assert.equal(s.lives, 0);
  assert.equal(s.status, 'over');
});

test('lives end when deck exhausted', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'correct', seqRng([0.5]));
  s = applyResult(s, 'correct', seqRng([0.5]));
  s = applyResult(s, 'correct', seqRng([0.5]));
  assert.equal(s.score, 3);
  assert.equal(s.status, 'over');
});

test('createGame timed: lives null, duration set, current drawn', () => {
  const s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0]), duration: 60 });
  assert.equal(s.lives, null);
  assert.equal(s.duration, 60);
  assert.equal(s.status, 'playing');
  assert.ok(gsContent.TIERS.easy.includes(s.current));
});

test('timed correct: score up, draws next, never over from result', () => {
  let s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0]), duration: 60 });
  s = applyResult(s, 'correct', seqRng([0.99]));
  assert.equal(s.score, 1);
  assert.equal(s.status, 'playing');
});

test('timed wrong: no score change, still playing', () => {
  let s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0]), duration: 60 });
  s = applyResult(s, 'wrong', seqRng([0]));
  assert.equal(s.score, 0);
  assert.equal(s.status, 'playing');
});

test('isTimeUp: true once elapsed >= duration', () => {
  const s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0]), duration: 60 });
  assert.equal(isTimeUp(s, 59000), false);
  assert.equal(isTimeUp(s, 60000), true);
  const lives = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0]) });
  assert.equal(isTimeUp(lives, 999999), false);
});

import { MUSCLES, TIERS } from '../js/content.js';

test('content: every tier id exists in MUSCLES and has a polygon', () => {
  for (const tier of Object.keys(TIERS)) {
    for (const id of TIERS[tier]) {
      assert.ok(MUSCLES[id], `missing muscle: ${id}`);
      assert.ok(Array.isArray(MUSCLES[id].polygon), `no polygon: ${id}`);
      assert.ok(['front', 'back'].includes(MUSCLES[id].view), `bad view: ${id}`);
    }
  }
});
test('content: tiers sized roughly as designed', () => {
  assert.equal(TIERS.easy.length, 12);
  assert.equal(TIERS.medium.length, 20);
  assert.ok(TIERS.hard.length >= 27);
});

test('judgeClick: bilateral mirror — click on opposite side still counts correct', () => {
  // biceps polygon lives on the left half (x 0.1-0.4); a click mirrored to the
  // right half (x 0.75 -> mirror 0.25) must still register as correct.
  const r = judgeClick({ x: 0.75, y: 0.25 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'correct', hitId: 'biceps' });
});
