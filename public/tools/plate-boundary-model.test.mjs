// Minimal Node test for the plate-boundary scoring model.
// Run: cd <repo> && node --test public/tools/plate-boundary-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { SCENARIOS, emptyState, scoreScenarios } from "./plate-boundary-model.js";

function perfectState() {
  const state = emptyState();
  for (const sc of SCENARIOS) {
    state[sc.id] = { ...sc.expected };
  }
  return state;
}

test("perfect input scores the max (5)", () => {
  const r = scoreScenarios(perfectState());
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
});

test("empty input scores 0, never negative", () => {
  const r = scoreScenarios(emptyState());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong input scores 0", () => {
  const state = emptyState();
  // Fill every field with a deliberately wrong, non-null value.
  for (const sc of SCENARIOS) {
    state[sc.id] = {
      leftForce: sc.expected.leftForce === "left" ? "right" : "left",
      rightForce: sc.expected.rightForce === "left" ? "right" : "left",
      boundaryType: sc.expected.boundaryType === "divergent" ? "convergent" : "divergent",
      netForce: "balanced", // expected is always "unbalanced"
      hazard: "nothing",     // never an expected hazard id
    };
  }
  const r = scoreScenarios(state);
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] for mixed/partial input", () => {
  // Only the first scenario correct.
  const state = emptyState();
  state[SCENARIOS[0].id] = { ...SCENARIOS[0].expected };
  const r = scoreScenarios(state);
  assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  // One correct vector pair = 1 point; aggregate (type/net/hazard) bonuses require ALL correct.
  assert.equal(r.score, 1);
});

test("net force is unbalanced for all three boundaries (HS-ESS2-1 pedagogy)", () => {
  for (const sc of SCENARIOS) {
    assert.equal(sc.expected.netForce, "unbalanced", `${sc.id} should be unbalanced`);
  }
});

test("partial: all vectors + types but wrong net/hazard caps below max", () => {
  const state = emptyState();
  for (const sc of SCENARIOS) {
    state[sc.id] = {
      leftForce: sc.expected.leftForce,
      rightForce: sc.expected.rightForce,
      boundaryType: sc.expected.boundaryType,
      netForce: "balanced", // wrong
      hazard: "nothing",     // wrong
    };
  }
  const r = scoreScenarios(state);
  // 3 vector points + 1 type-aggregate point = 4; net (0.5) + hazard (0.5) withheld.
  assert.equal(r.score, 4);
  assert.ok(r.score < r.maxScore);
});
