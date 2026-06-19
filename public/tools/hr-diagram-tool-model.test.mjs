// Tests for the H-R diagram scoring model.
// Run: cd <repo> && node --test public/tools/hr-diagram-tool-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STAR_DATA,
  QUESTIONS,
  DIAGRAM,
  tempToX,
  emptyState,
  isComplete,
  scoreState,
} from "./hr-diagram-tool-model.js";

function perfectState() {
  const s = emptyState();
  for (const star of STAR_DATA) s.placements[star.id] = star.zone;
  for (const q of QUESTIONS) s.answers[q.id] = q.correctIndex;
  return s;
}

test("perfect placements + answers → score equals max (5)", () => {
  const r = scoreState(perfectState());
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
  assert.equal(r.starsCorrect, STAR_DATA.length);
  assert.equal(r.questionsCorrect, QUESTIONS.length);
});

test("empty state → score 0, never negative", () => {
  const r = scoreState(emptyState());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong placements + answers → score 0", () => {
  const s = emptyState();
  for (const star of STAR_DATA) {
    // assign a deliberately wrong zone
    s.placements[star.id] = star.zone === "main-sequence" ? "giant" : "main-sequence";
  }
  for (const q of QUESTIONS) {
    s.answers[q.id] = (q.correctIndex + 1) % q.options.length;
  }
  const r = scoreState(s);
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] for mixed input", () => {
  const s = emptyState();
  STAR_DATA.forEach((star, i) => {
    s.placements[star.id] = i % 2 === 0 ? star.zone : "white-dwarf";
  });
  s.answers[QUESTIONS[0].id] = QUESTIONS[0].correctIndex;
  const r = scoreState(s);
  assert.ok(r.score >= 0 && r.score <= r.maxScore);
});

test("isComplete true only when all stars placed AND all questions answered", () => {
  const s = emptyState();
  assert.equal(isComplete(s), false);
  for (const star of STAR_DATA) s.placements[star.id] = star.zone;
  assert.equal(isComplete(s), false); // questions not answered yet
  for (const q of QUESTIONS) s.answers[q.id] = q.correctIndex;
  assert.equal(isComplete(s), true);
});

test("physics: H-R x-axis runs hot→cool left→right (temperature DECREASES rightward)", () => {
  // Hotter star must map to a SMALLER x (further left) than a cooler star.
  const xHot = tempToX(DIAGRAM.maxTempK);
  const xCool = tempToX(DIAGRAM.minTempK);
  assert.ok(xHot < xCool, "hot star should be left of cool star");
  assert.ok(tempToX(20000) < tempToX(4000), "20000 K left of 4000 K");
});

test("data integrity: every star's answer-key zone is one of the three valid zones", () => {
  const valid = new Set(["main-sequence", "giant", "white-dwarf"]);
  for (const star of STAR_DATA) {
    assert.ok(valid.has(star.zone), `${star.id} has invalid zone ${star.zone}`);
  }
});
