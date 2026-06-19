import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyState, signedVelocity, momentum, totalMomentum,
  kineticEnergy, totalKineticEnergy, solveCollision, scorePrediction,
} from "./collision-sim-1d-model.js";

// ---- Physics: momentum conservation ----

test("inelastic collision conserves momentum (p before == p after)", () => {
  const s = { ...emptyState(), collisionType: "inelastic" };
  const r = solveCollision(s);
  const pAfter = s.v1.mass * r.v1Final + s.v2.mass * r.v2Final;
  assert.ok(Math.abs(r.pTotal - pAfter) < 1e-6, "p conserved");
  assert.equal(r.v1Final, r.v2Final, "stuck together: equal final velocity");
  assert.ok(r.keAfter < r.keBefore, "inelastic loses kinetic energy");
});

test("elastic collision conserves momentum AND kinetic energy", () => {
  const s = { ...emptyState(), collisionType: "elastic" };
  const r = solveCollision(s);
  const pAfter = s.v1.mass * r.v1Final + s.v2.mass * r.v2Final;
  assert.ok(Math.abs(r.pTotal - pAfter) < 1e-6, "p conserved");
  assert.ok(Math.abs(r.keBefore - r.keAfter) < 1e-6, "KE conserved in elastic");
});

test("equal-mass elastic head-on swaps velocities", () => {
  const s = {
    v1: { mass: 1000, velocity: 5, direction: "right" },
    v2: { mass: 1000, velocity: 5, direction: "left" },
    collisionType: "elastic",
    predictions: {}, reasoning: "", ran: false,
  };
  const r = solveCollision(s);
  assert.ok(Math.abs(r.v1Final - -5) < 1e-9, "v1 -> -5");
  assert.ok(Math.abs(r.v2Final - 5) < 1e-9, "v2 -> +5");
});

test("signedVelocity / momentum / KE helpers are correct", () => {
  assert.equal(signedVelocity({ velocity: 10, direction: "right" }), 10);
  assert.equal(signedVelocity({ velocity: 10, direction: "left" }), -10);
  assert.equal(momentum(1500, -8), -12000);
  assert.equal(kineticEnergy(1000, 4), 8000);
  const s = emptyState();
  assert.equal(totalMomentum(s), 1500 * 10 + 2000 * -8);
  assert.equal(totalKineticEnergy(s), 0.5 * 1500 * 100 + 0.5 * 2000 * 64);
});

// ---- Scoring ----

test("perfect predictions -> full score 5/5", () => {
  const base = { ...emptyState(), collisionType: "inelastic" };
  const truth = solveCollision(base);
  const s = {
    ...base,
    predictions: {
      v1Final: truth.v1Final,
      v2Final: truth.v2Final,
      pTotalFinal: truth.pTotal,
    },
  };
  const out = scorePrediction(s);
  assert.equal(out.maxScore, 5);
  assert.equal(out.score, 5);
  assert.ok(out.v1Ok && out.v2Ok && out.pOk);
});

test("empty predictions -> score 0, never negative", () => {
  const s = { ...emptyState(), predictions: { v1Final: "", v2Final: "", pTotalFinal: "" } };
  const out = scorePrediction(s);
  assert.equal(out.score, 0);
  assert.ok(out.score >= 0);
});

test("all-wrong predictions -> score 0", () => {
  const s = {
    ...emptyState(),
    predictions: { v1Final: 999, v2Final: -999, pTotalFinal: 999999 },
  };
  const out = scorePrediction(s);
  assert.equal(out.score, 0);
});

test("score always within [0, maxScore] across random configs", () => {
  const dirs = ["left", "right"];
  const types = ["elastic", "inelastic"];
  for (let i = 0; i < 200; i++) {
    const s = {
      v1: { mass: 100 + Math.random() * 9000, velocity: Math.random() * 50, direction: dirs[i % 2] },
      v2: { mass: 100 + Math.random() * 9000, velocity: Math.random() * 50, direction: dirs[(i + 1) % 2] },
      collisionType: types[i % 2],
      predictions: { v1Final: Math.random() * 40 - 20, v2Final: Math.random() * 40 - 20, pTotalFinal: Math.random() * 1e5 - 5e4 },
      reasoning: "", ran: true,
    };
    const out = scorePrediction(s);
    assert.ok(out.score >= 0 && out.score <= out.maxScore, `score in range, got ${out.score}`);
  }
});
