// Minimal Node test for the mantle-convection scoring model.
// Run: cd <repo> && node --test public/tools/mantle-convection-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { QUESTIONS, emptyAnswers, scoreAnswers } from "./mantle-convection-model.js";

function perfectAnswers() {
  const a = emptyAnswers();
  for (const q of QUESTIONS) a[q.id] = q.correct;
  return a;
}

test("perfect input scores the max (5)", () => {
  const r = scoreAnswers(perfectAnswers());
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
  assert.equal(QUESTIONS.length, 5, "5 questions => 1 point each");
});

test("empty input scores 0, never negative", () => {
  const r = scoreAnswers(emptyAnswers());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong input scores 0", () => {
  const a = emptyAnswers();
  for (const q of QUESTIONS) {
    const wrong = q.options.find((o) => o.id !== q.correct);
    a[q.id] = wrong.id;
  }
  const r = scoreAnswers(a);
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] for partial input", () => {
  const a = emptyAnswers();
  // Answer first two correctly, leave the rest null.
  a[QUESTIONS[0].id] = QUESTIONS[0].correct;
  a[QUESTIONS[1].id] = QUESTIONS[1].correct;
  const r = scoreAnswers(a);
  assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  assert.equal(r.score, 2);
});

test("each question has a valid correct option id", () => {
  for (const q of QUESTIONS) {
    assert.ok(q.options.some((o) => o.id === q.correct), `${q.id} correct id missing from options`);
  }
});
