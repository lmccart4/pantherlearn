import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MASS_OPTIONS, VELOCITY_OPTIONS, SCENARIOS,
  computeImpact, getEnergyCategory, getCraterCategory, emptyState, scoreScenarios,
} from "./impact-crater-sim-model.js";

// --- Physics sanity ---------------------------------------------------------

test("computeImpact uses KE = 1/2 m v^2", () => {
  const m = 1.1e7, v = 19000; // Chelyabinsk-scale
  const imp = computeImpact(m, v, "atmosphere");
  assert.ok(Math.abs(imp.joules - 0.5 * m * v * v) < 1, "joules === 1/2 m v^2");
  assert.ok(imp.joules > 0);
});

test("energy scales with v^2: doubling velocity quadruples KE", () => {
  const a = computeImpact(1000, 10000, "rocky");
  const b = computeImpact(1000, 20000, "rocky");
  assert.ok(Math.abs(b.joules / a.joules - 4) < 1e-9, "KE ratio === 4");
});

test("atmosphere target is an airburst: no crater", () => {
  const imp = computeImpact(1.1e7, 19000, "atmosphere");
  assert.equal(imp.diameterM, 0);
  assert.equal(imp.craterCategory, "none");
});

test("crater diameter grows with mass and velocity on solid ground", () => {
  const small = computeImpact(1000, 13000, "rocky");
  const bigMass = computeImpact(1e9, 13000, "rocky");
  const bigVel = computeImpact(1000, 50000, "rocky");
  assert.ok(bigMass.diameterM > small.diameterM, "more mass → bigger crater");
  assert.ok(bigVel.diameterM > small.diameterM, "more velocity → bigger crater");
});

test("category thresholds are monotonic and bounded", () => {
  assert.equal(getEnergyCategory(0), "tiny");
  assert.equal(getEnergyCategory(1e20), "cataclysmic");
  assert.equal(getCraterCategory(0), "none");
  assert.equal(getCraterCategory(1e6), "cataclysmic");
});

// --- Scenario answer-key integrity (scored content must be correct) ---------

test("every SCENARIO's expected energy/crater matches computeImpact", () => {
  for (const sc of SCENARIOS) {
    const m = MASS_OPTIONS.find((x) => x.id === sc.massId).kg;
    const v = VELOCITY_OPTIONS.find((x) => x.id === sc.velocityId).mps;
    const imp = computeImpact(m, v, sc.targetId);
    assert.equal(imp.energyCategory, sc.expectedEnergy, `${sc.id} energy`);
    assert.equal(imp.craterCategory, sc.expectedCrater, `${sc.id} crater`);
  }
});

// --- Scoring ----------------------------------------------------------------

test("scoreScenarios: all-correct predictions → 5/5", () => {
  const st = emptyState();
  for (const sc of SCENARIOS) {
    const m = MASS_OPTIONS.find((x) => x.id === sc.massId).kg;
    const v = VELOCITY_OPTIONS.find((x) => x.id === sc.velocityId).mps;
    const imp = computeImpact(m, v, sc.targetId);
    st.scenarios[sc.id].energyPred = imp.energyCategory;
    st.scenarios[sc.id].craterPred = imp.craterCategory;
  }
  const r = scoreScenarios(st);
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
  assert.equal(r.correct, 6);
});

test("scoreScenarios: empty/no predictions → 0, never negative", () => {
  const r = scoreScenarios(emptyState());
  assert.equal(r.score, 0);
  assert.equal(r.correct, 0);
  assert.ok(r.score >= 0);
});

test("scoreScenarios: all-wrong predictions → 0", () => {
  const st = emptyState();
  for (const sc of SCENARIOS) {
    // pick categories deliberately wrong vs the answer key
    st.scenarios[sc.id].energyPred = sc.expectedEnergy === "tiny" ? "cataclysmic" : "tiny";
    st.scenarios[sc.id].craterPred = sc.expectedCrater === "none" ? "cataclysmic" : "none";
  }
  const r = scoreScenarios(st);
  assert.equal(r.score, 0);
});

test("scoreScenarios: half-right partial score stays within [0,5]", () => {
  const st = emptyState();
  let i = 0;
  for (const sc of SCENARIOS) {
    const m = MASS_OPTIONS.find((x) => x.id === sc.massId).kg;
    const v = VELOCITY_OPTIONS.find((x) => x.id === sc.velocityId).mps;
    const imp = computeImpact(m, v, sc.targetId);
    // get energy right, leave crater unanswered for every other scenario
    st.scenarios[sc.id].energyPred = imp.energyCategory;
    if (i % 2 === 0) st.scenarios[sc.id].craterPred = imp.craterCategory;
    i += 1;
  }
  const r = scoreScenarios(st);
  assert.ok(r.score > 0 && r.score < 5, `partial, got ${r.score}`);
  assert.ok(r.score >= 0 && r.score <= r.maxScore);
});
