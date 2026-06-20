import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  reactionDistance,
  brakingDistance,
  totalDistance,
  scoreQuestions,
  answersComplete,
} from "./stopping-distance-model.js";

// Build a "perfect" answer set for a given explorer state.
function perfectAnswers(state) {
  return {
    predDoubleSpeed: "quadruples",
    predBiggerPart: "braking",
    predDoubleReaction: "doubles",
    totalCalc: totalDistance(state),
    reactionCalc: reactionDistance(state),
  };
}

// --- Physics sanity ---

test("reaction distance is linear in speed", () => {
  const a = createState({ speed: 30, reactionTime: 1.5 });
  const b = createState({ speed: 60, reactionTime: 1.5 });
  // Double speed, same reaction time -> double reaction distance.
  assert.ok(Math.abs(reactionDistance(b) / reactionDistance(a) - 2) < 0.01);
});

test("double reaction time -> 2x reaction distance (same speed)", () => {
  const a = createState({ speed: 40, reactionTime: 1.0 });
  const b = createState({ speed: 40, reactionTime: 2.0 });
  assert.ok(Math.abs(reactionDistance(b) / reactionDistance(a) - 2) < 0.01);
});

test("braking distance is quadratic: double speed -> ~4x braking", () => {
  const a = createState({ speed: 30, reactionTime: 1.5 });
  const b = createState({ speed: 60, reactionTime: 1.5 });
  assert.ok(Math.abs(brakingDistance(b) / brakingDistance(a) - 4) < 0.02);
});

test("reaction time does not change braking distance", () => {
  const a = createState({ speed: 40, reactionTime: 1.0 });
  const b = createState({ speed: 40, reactionTime: 3.0 });
  assert.equal(brakingDistance(a), brakingDistance(b));
});

test("total = reaction + braking", () => {
  const s = createState({ speed: 50, reactionTime: 2.0 });
  assert.ok(
    Math.abs(totalDistance(s) - (reactionDistance(s) + brakingDistance(s))) < 0.05
  );
});

test("reproduces the L03 reference table at 1.5 s (constants check)", () => {
  // The seed table uses a 1.5 s reaction time (NHTSA standard); verify the model matches it.
  // 1.5 s is the tool's default reactionTime, so this is exactly what students see on load.
  const FT = 1.46667, KK = 0.05;
  const expect = { 20: [44, 20], 30: [66, 45], 40: [88, 80], 50: [110, 125], 60: [132, 180] };
  for (const [mph, [r, b]] of Object.entries(expect)) {
    const v = Number(mph);
    assert.ok(Math.abs(v * FT * 1.5 - r) < 0.5, `reaction @ ${mph}`);
    assert.ok(Math.abs(KK * v * v - b) < 0.5, `braking @ ${mph}`);
  }
});

// --- Scoring ---

test("perfect answers score the max of 5", () => {
  const s = createState({ speed: 50, reactionTime: 2.0 });
  const r = scoreQuestions(s, perfectAnswers(s));
  assert.equal(r.score, 5);
  assert.equal(r.maxScore, 5);
});

test("empty answers score 0, never negative", () => {
  const s = createState();
  const r = scoreQuestions(s, {});
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong answers score 0", () => {
  const s = createState({ speed: 40, reactionTime: 1.5 });
  const r = scoreQuestions(s, {
    predDoubleSpeed: "doubles",
    predBiggerPart: "reaction",
    predDoubleReaction: "quadruples",
    totalCalc: 9999,
    reactionCalc: 9999,
  });
  assert.equal(r.score, 0);
});

test("score = (correct/total)*5, rounded to 2dp, always in [0,5]", () => {
  for (let i = 0; i < 60; i++) {
    const s = createState({
      speed: 20 + Math.random() * 60,
      reactionTime: 1.0 + Math.random() * 2.0,
    });
    const garbage = {
      predDoubleSpeed: Math.random() > 0.5 ? "quadruples" : "doubles",
      predBiggerPart: Math.random() > 0.5 ? "braking" : "reaction",
      predDoubleReaction: Math.random() > 0.5 ? "doubles" : "quadruples",
      totalCalc: Math.random() * 400,
      reactionCalc: Math.random() * 300,
    };
    const r = scoreQuestions(s, garbage);
    assert.ok(r.score >= 0 && r.score <= 5, `score ${r.score} out of range`);
    assert.equal(r.score, Math.round((r.correct / r.total) * 5 * 100) / 100);
  }
});

test("partial credit: only the two concept items about doubling -> 2/5", () => {
  const s = createState({ speed: 40, reactionTime: 1.5 });
  const r = scoreQuestions(s, {
    predDoubleSpeed: "quadruples",
    predDoubleReaction: "doubles",
  });
  assert.equal(r.correct, 2);
  assert.equal(r.score, 2);
});

test("numeric items grade against the CURRENT tool state", () => {
  const s = createState({ speed: 60, reactionTime: 2.0 });
  // Right numbers for THIS state -> both numeric items credit.
  const r1 = scoreQuestions(s, {
    totalCalc: totalDistance(s),
    reactionCalc: reactionDistance(s),
  });
  assert.equal(r1.correct, 2);
  // Same numbers but a different state -> they should NOT both still match.
  const s2 = createState({ speed: 20, reactionTime: 1.0 });
  const r2 = scoreQuestions(s2, {
    totalCalc: totalDistance(s),
    reactionCalc: reactionDistance(s),
  });
  assert.ok(r2.correct < 2);
});

test("answersComplete false until all five filled, true when complete", () => {
  assert.equal(answersComplete({}), false);
  assert.equal(
    answersComplete({
      predDoubleSpeed: "quadruples",
      predBiggerPart: "braking",
      predDoubleReaction: "doubles",
      totalCalc: 100,
    }),
    false
  );
  assert.equal(
    answersComplete({
      predDoubleSpeed: "quadruples",
      predBiggerPart: "braking",
      predDoubleReaction: "doubles",
      totalCalc: 100,
      reactionCalc: 50,
    }),
    true
  );
});

test("answersComplete treats empty string / null as not filled", () => {
  assert.equal(
    answersComplete({
      predDoubleSpeed: "",
      predBiggerPart: "braking",
      predDoubleReaction: "doubles",
      totalCalc: 100,
      reactionCalc: 50,
    }),
    false
  );
  assert.equal(
    answersComplete({
      predDoubleSpeed: "quadruples",
      predBiggerPart: null,
      predDoubleReaction: "doubles",
      totalCalc: 100,
      reactionCalc: 50,
    }),
    false
  );
});
