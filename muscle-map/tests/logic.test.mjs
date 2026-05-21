import test from 'node:test';
import assert from 'node:assert/strict';
import { pointInPolygon } from '../js/logic.js';
import { shuffle, buildDeck } from '../js/logic.js';
import { judgeClick, polygonsOverlap } from '../js/logic.js';
import { createGame, applyResult, roundPoints } from '../js/logic.js';

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

test('roundPoints: 1000 instant, 750 at half, 500 at the buzzer', () => {
  assert.equal(roundPoints(0, 15000), 1000);
  assert.equal(roundPoints(7500, 15000), 750);
  assert.equal(roundPoints(15000, 15000), 500);
  assert.equal(roundPoints(99999, 15000), 500); // clamped floor
});

test('createGame lives: 3 lives, full deck, streak/score 0, 15s round', () => {
  const s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  assert.equal(s.mode, 'lives');
  assert.equal(s.lives, 3);
  assert.equal(s.score, 0);
  assert.equal(s.streak, 0);
  assert.equal(s.status, 'playing');
  assert.equal(s.deck.length, 3);
  assert.equal(s.current, s.deck[0]);
  assert.equal(s.total, 3);
  assert.equal(s.roundMs, 15000);
});

test('createGame timed: lives null, full deck', () => {
  const s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  assert.equal(s.lives, null);
  assert.equal(s.deck.length, 3);
  assert.equal(s.current, s.deck[0]);
  assert.equal(s.status, 'playing');
});

test('applyResult correct: adds points, bumps streak/correct, advances', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'correct', 800);
  assert.equal(s.score, 800);
  assert.equal(s.streak, 1);
  assert.equal(s.correct, 1);
  assert.equal(s.lives, 3);
  assert.equal(s.current, s.deck[1]);
});

test('applyResult empty: no change, no advance', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  const before = s.current;
  s = applyResult(s, 'empty', 500);
  assert.equal(s.score, 0);
  assert.equal(s.lives, 3);
  assert.equal(s.current, before);
});

test('applyResult wrong (lives): resets streak, costs a life, tracks missed', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'correct', 900);
  const missedId = s.current;
  s = applyResult(s, 'wrong', 0);
  assert.equal(s.streak, 0);
  assert.equal(s.lives, 2);
  assert.equal(s.wrong, 1);
  assert.deepEqual(s.missed, [missedId]);
});

test('applyResult timeout behaves like wrong', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'timeout', 0);
  assert.equal(s.lives, 2);
  assert.equal(s.wrong, 1);
  assert.equal(s.missed.length, 1);
});

test('lives end on 0 lives', () => {
  let s = createGame({ mode: 'lives', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'wrong', 0);
  s = applyResult(s, 'wrong', 0);
  s = applyResult(s, 'wrong', 0);
  assert.equal(s.lives, 0);
  assert.equal(s.status, 'over');
});

test('both modes end when deck exhausted; timed has no lives', () => {
  let s = createGame({ mode: 'timed', tier: 'easy', content: gsContent, rng: seqRng([0.5]) });
  s = applyResult(s, 'correct', 1000);
  s = applyResult(s, 'wrong', 0);   // no life loss in timed
  assert.equal(s.lives, null);
  assert.equal(s.status, 'playing');
  s = applyResult(s, 'correct', 600);
  assert.equal(s.score, 1600);
  assert.equal(s.status, 'over');   // deck of 3 exhausted
});

import { regionsOf } from '../js/logic.js';
import { MUSCLES, TIERS } from '../js/content.js';

// A muscle with two explicit regions (e.g. left + right boxes for asymmetry).
const twoBox = {
  TIERS: { easy: ['m'] },
  MUSCLES: {
    m: { name: 'M', view: 'front', regions: [
      [[0.10,0.10],[0.30,0.10],[0.30,0.30],[0.10,0.30]],
      [[0.70,0.10],[0.90,0.10],[0.90,0.30],[0.70,0.30]]
    ] }
  }
};

test('regionsOf: normalizes to {view, poly}; wraps single polygon', () => {
  const regs = regionsOf(twoBox.MUSCLES.m);
  assert.equal(regs.length, 2);
  assert.equal(regs[0].view, 'front');
  assert.ok(Array.isArray(regs[0].poly));
  assert.equal(regionsOf({ view: 'back', polygon: [[0,0],[1,0],[1,1]] })[0].view, 'back');
});

test('judgeClick: two-region muscle — a click in EITHER box is correct', () => {
  assert.equal(judgeClick({ x: 0.20, y: 0.20 }, 'front', 'm', ['m'], twoBox).result, 'correct');
  assert.equal(judgeClick({ x: 0.80, y: 0.20 }, 'front', 'm', ['m'], twoBox).result, 'correct');
});

// A muscle with regions on BOTH views (e.g. deltoids, visible front and back).
const bothViews = {
  TIERS: { easy: ['delt', 'pec'] },
  MUSCLES: {
    delt: { name: 'Delt', regions: [
      { view: 'front', poly: [[0.30,0.20],[0.42,0.20],[0.42,0.30],[0.30,0.30]] },
      { view: 'back',  poly: [[0.30,0.20],[0.42,0.20],[0.42,0.30],[0.30,0.30]] }
    ] },
    pec: { name: 'Pec', regions: [
      { view: 'front', poly: [[0.42,0.22],[0.52,0.22],[0.52,0.30],[0.42,0.30]] }
    ] }
  }
};

test('judgeClick: muscle on both views — answerable on either view', () => {
  assert.equal(judgeClick({ x: 0.36, y: 0.25 }, 'front', 'delt', ['delt', 'pec'], bothViews).result, 'correct');
  assert.equal(judgeClick({ x: 0.36, y: 0.25 }, 'back',  'delt', ['delt', 'pec'], bothViews).result, 'correct');
});

test('judgeClick: front-only muscle clicked on back view -> empty (exploration)', () => {
  // pec exists only on front; clicking it on the back view is not a commit
  assert.equal(judgeClick({ x: 0.47, y: 0.26 }, 'back', 'pec', ['delt', 'pec'], bothViews).result, 'empty');
});

test('content: every tier id exists in MUSCLES and has at least one region', () => {
  for (const tier of Object.keys(TIERS)) {
    for (const id of TIERS[tier]) {
      assert.ok(MUSCLES[id], `missing muscle: ${id}`);
      const regs = regionsOf(MUSCLES[id]);
      assert.ok(regs.length >= 1 && Array.isArray(regs[0].poly), `no region: ${id}`);
      for (const r of regs) assert.ok(['front', 'back'].includes(r.view), `bad region view: ${id}`);
    }
  }
});
test('content: tiers sized as designed (count-based)', () => {
  assert.equal(TIERS.easy.length, 12);
  assert.equal(TIERS.medium.length, 16);
  assert.equal(TIERS.hard.length, 20);
  // every tier muscle is calibrated with real region(s)
  for (const id of TIERS.hard) assert.ok(regionsOf(MUSCLES[id]).length >= 1, id);
});

test('judgeClick: bilateral mirror — click on opposite side still counts correct', () => {
  // biceps polygon lives on the left half (x 0.1-0.4); a click mirrored to the
  // right half (x 0.75 -> mirror 0.25) must still register as correct.
  const r = judgeClick({ x: 0.75, y: 0.25 }, 'front', 'biceps', tierIds, jcContent);
  assert.deepEqual(r, { result: 'correct', hitId: 'biceps' });
});
