import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  acceleration,
  stateAcceleration,
  scoreQuestions,
  answersComplete,
  QUESTIONS,
} from "./force-and-motion-basics-model.js";

function perfectAnswers() {
  return {
    doubleForce: "doubles",
    doubleMass: "halves",
    cartVsTruck: "cart",
    numericA: 4,
    massRelation: "inverse",
  };
}

test("acceleration implements a = F / m", () => {
  assert.equal(acceleration(12, 3), 4);   // 12 / 3
  assert.equal(acceleration(20, 10), 2);  // 20 / 10
  assert.equal(acceleration(0, 5), 0);    // no force -> no acceleration
});

test("doubling force (same mass) doubles acceleration", () => {
  const a1 = acceleration(6, 3);
  const a2 = acceleration(12, 3);
  assert.equal(a2, 2 * a1);
});

test("doubling mass (same force) halves acceleration", () => {
  const a1 = acceleration(12, 3);
  const a2 = acceleration(12, 6);
  assert.equal(a2, a1 / 2);
});

test("mass guard: m <= 0 or non-finite returns 0, never divides by zero", () => {
  assert.equal(acceleration(10, 0), 0);
  assert.equal(acceleration(10, -2), 0);
  assert.equal(acceleration(10, NaN), 0);
  assert.equal(acceleration("foo", 5), 0);
});

test("stateAcceleration reads force/mass from clamped state", () => {
  const s = createState({ force: 12, mass: 3 });
  assert.equal(stateAcceleration(s), 4);
});

test("createState clamps out-of-range force/mass into bounds", () => {
  const s = createState({ force: 999, mass: 0 });
  assert.equal(s.force, 20); // clamped to max
  assert.equal(s.mass, 1);   // clamped to min (never 0)
});

test("perfect answers score the max of 5", () => {
  const s = createState();
  const r = scoreQuestions(s, perfectAnswers());
  assert.equal(r.score, 5);
  assert.equal(r.maxScore, 5);
  assert.equal(r.correct, 5);
});

test("empty answers score 0, never negative", () => {
  const s = createState();
  const r = scoreQuestions(s, {});
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong answers score 0", () => {
  const s = createState();
  const r = scoreQuestions(s, {
    doubleForce: "halves",
    doubleMass: "doubles",
    cartVsTruck: "truck",
    numericA: 99,
    massRelation: "direct",
  });
  assert.equal(r.score, 0);
});

test("numeric question tolerates small rounding (3.95-4.05) but rejects far misses", () => {
  const s = createState();
  assert.equal(scoreQuestions(s, { numericA: 4.05 }).correct, 1);
  assert.equal(scoreQuestions(s, { numericA: 3.95 }).correct, 1);
  assert.equal(scoreQuestions(s, { numericA: 5 }).correct, 0);
});

test("score always within [0, maxScore] across random answers", () => {
  const ids = QUESTIONS.map((q) => q.id);
  for (let i = 0; i < 50; i++) {
    const s = createState({ force: Math.random() * 20, mass: 1 + Math.random() * 9 });
    const garbage = {};
    for (const id of ids) {
      garbage[id] = Math.random() > 0.5 ? "doubles" : Math.random() * 10;
    }
    const r = scoreQuestions(s, garbage);
    assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  }
});

test("partial credit: only the numeric answer correct -> 1 of 5 = 1.0", () => {
  const s = createState();
  const r = scoreQuestions(s, { numericA: 4 });
  assert.equal(r.correct, 1);
  assert.equal(r.score, 1); // (1/5)*5
});

test("partial credit: three of five correct -> 3.0", () => {
  const s = createState();
  const r = scoreQuestions(s, {
    doubleForce: "doubles",
    doubleMass: "halves",
    cartVsTruck: "cart",
    numericA: 99,
    massRelation: "direct",
  });
  assert.equal(r.correct, 3);
  assert.equal(r.score, 3); // (3/5)*5
});

test("answersComplete false until all five filled, true when complete", () => {
  assert.equal(answersComplete({}), false);
  assert.equal(
    answersComplete({ doubleForce: "doubles", doubleMass: "halves", cartVsTruck: "cart", numericA: 4 }),
    false
  );
  assert.equal(answersComplete(perfectAnswers()), true);
});

test("answersComplete treats empty string / null as not filled", () => {
  const a = perfectAnswers();
  assert.equal(answersComplete({ ...a, numericA: "" }), false);
  assert.equal(answersComplete({ ...a, cartVsTruck: null }), false);
});
