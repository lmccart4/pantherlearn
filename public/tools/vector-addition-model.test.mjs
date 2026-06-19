import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SCENARIOS,
  signedForce,
  netForce,
  correctAnswer,
  isScenarioCorrect,
  answersComplete,
  scoreScenarios,
} from "./vector-addition-model.js";

// Build a state where every scenario is answered with the correct answers.
function perfectState() {
  const answers = {};
  for (const s of SCENARIOS) {
    const c = correctAnswer(s);
    answers[s.id] = { directionChoice: c.direction, balanceChoice: c.balance };
  }
  return { answers };
}

test("signedForce: East positive, West negative", () => {
  assert.equal(signedForce({ magnitude: 6, dir: "east" }), 6);
  assert.equal(signedForce({ magnitude: 4, dir: "west" }), -4);
});

test("netForce: collinear sum is the signed sum", () => {
  // 6 East + 6 West = 0 -> balanced, no direction
  const balanced = netForce(SCENARIOS[0]);
  assert.equal(balanced.net, 0);
  assert.equal(balanced.balanced, true);
  assert.equal(balanced.direction, "none");

  // s2: 6E + 4E + 8W = +2 -> east, unbalanced
  const s2 = netForce(SCENARIOS[1]);
  assert.equal(s2.net, 2);
  assert.equal(s2.direction, "east");
  assert.equal(s2.balanced, false);

  // s4: 3W + 7W + 4E = -6 -> west, unbalanced
  const s4 = netForce(SCENARIOS[3]);
  assert.equal(s4.net, -6);
  assert.equal(s4.direction, "west");
  assert.equal(s4.balanced, false);
});

test("balanced iff net === 0", () => {
  for (const s of SCENARIOS) {
    const nf = netForce(s);
    assert.equal(nf.balanced, nf.net === 0);
  }
});

test("perfect answers score 5", () => {
  const r = scoreScenarios(perfectState());
  assert.equal(r.score, 5);
  assert.equal(r.correct, SCENARIOS.length);
  assert.equal(r.total, SCENARIOS.length);
});

test("empty state scores 0", () => {
  assert.equal(scoreScenarios({}).score, 0);
  assert.equal(scoreScenarios({ answers: {} }).score, 0);
});

test("score is always within [0, 5]", () => {
  // sweep many random answer combos
  const dirOpts = ["east", "west", "none"];
  const balOpts = ["balanced", "unbalanced"];
  for (let i = 0; i < 200; i++) {
    const answers = {};
    for (const s of SCENARIOS) {
      // sometimes leave unanswered
      if (Math.random() < 0.25) continue;
      answers[s.id] = {
        directionChoice: dirOpts[Math.floor(Math.random() * dirOpts.length)],
        balanceChoice: balOpts[Math.floor(Math.random() * balOpts.length)],
      };
    }
    const r = scoreScenarios({ answers });
    assert.ok(r.score >= 0 && r.score <= 5, `score out of range: ${r.score}`);
    assert.equal(r.maxScore, 5);
  }
});

test("partial credit: one correct of four = 1.25", () => {
  const c = correctAnswer(SCENARIOS[0]);
  const answers = { [SCENARIOS[0].id]: { directionChoice: c.direction, balanceChoice: c.balance } };
  const r = scoreScenarios({ answers });
  assert.equal(r.correct, 1);
  assert.equal(r.score, Math.round((1 / SCENARIOS.length) * 5 * 100) / 100);
});

test("scenario correct requires BOTH direction and balance to match", () => {
  const s = SCENARIOS[1]; // unbalanced, east
  const c = correctAnswer(s);
  // right direction, wrong balance
  assert.equal(isScenarioCorrect(s, { directionChoice: c.direction, balanceChoice: "balanced" }), false);
  // wrong direction, right balance
  assert.equal(isScenarioCorrect(s, { directionChoice: "west", balanceChoice: c.balance }), false);
  // both right
  assert.equal(isScenarioCorrect(s, { directionChoice: c.direction, balanceChoice: c.balance }), true);
});

test("answersComplete only when every scenario has both choices", () => {
  assert.equal(answersComplete({}), false);
  const partial = perfectState();
  delete partial.answers[SCENARIOS[0].id].balanceChoice;
  assert.equal(answersComplete(partial), false);
  assert.equal(answersComplete(perfectState()), true);
});
