import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BARRIER_PRESETS, INJURY_THRESHOLD_N, computeDeltaP, computeForceProfile,
  barrierById, evaluateCrash, emptyState, scoreExploration,
} from "./impulse-crumple-explorer-model.js";

// ---- Physics: impulse = FΔt = Δp ----

test("Δp = m·v for a car coming to rest", () => {
  assert.equal(computeDeltaP(1500, 13.4), 1500 * 13.4);
});

test("force profile area under curve equals Δp (impulse = Δp)", () => {
  const dp = computeDeltaP(1500, 13.4);
  for (const shape of ["triangle", "sine", "square"]) {
    const prof = computeForceProfile(dp, 0.15, shape, 2000);
    // numeric integral of f dt (trapezoid)
    let area = 0;
    for (let i = 1; i < prof.points.length; i++) {
      const dt = prof.points[i].t - prof.points[i - 1].t;
      area += 0.5 * (prof.points[i].f + prof.points[i - 1].f) * dt;
    }
    assert.ok(Math.abs(area - dp) / dp < 0.01, `${shape}: impulse(${area.toFixed(0)}) ~= Δp(${dp})`);
    assert.ok(Math.abs(prof.fAvg - dp / 0.15) < 1e-6, `${shape}: fAvg = Δp/Δt`);
    assert.ok(prof.fPeak >= prof.fAvg, `${shape}: peak >= avg`);
  }
});

test("longer Δt lowers average force for the same Δp (impulse-momentum)", () => {
  const dp = computeDeltaP(1500, 13.4);
  const short = computeForceProfile(dp, 0.05, "triangle");
  const long = computeForceProfile(dp, 0.30, "triangle");
  assert.ok(long.fAvg < short.fAvg, "longer Δt -> lower average force");
  assert.ok(long.fPeak < short.fPeak, "longer Δt -> lower peak force (same shape)");
});

test("peak force decreases monotonically across the 3 presets (stiff > moderate > heavy)", () => {
  const crashes = BARRIER_PRESETS.map((b) =>
    evaluateCrash({ mass: 1500, velocity: 13.4, barrierId: b.id })
  );
  // presets are ordered stiff, moderate, heavy
  assert.ok(crashes[0].fPeak > crashes[1].fPeak, "stiff > moderate");
  assert.ok(crashes[1].fPeak > crashes[2].fPeak, "moderate > heavy");
});

test("degenerate inputs -> empty profile, no NaN", () => {
  const p = computeForceProfile(0, 0, "triangle");
  assert.equal(p.fAvg, 0);
  assert.equal(p.fPeak, 0);
  assert.deepEqual(p.points, []);
  assert.equal(barrierById("nonexistent").id, BARRIER_PRESETS[0].id);
});

// ---- Scoring ----

function runTest(state, barrierId) {
  const c = evaluateCrash({ mass: state.mass, velocity: state.velocity, barrierId });
  state.testsRun = (state.testsRun || []).filter((t) => t.barrierId !== c.barrierId);
  state.testsRun.push({
    barrierId: c.barrierId, deltaT: c.deltaT, deltaP: c.deltaP,
    fAvg: c.fAvg, fPeak: c.fPeak, belowThreshold: c.belowThreshold,
  });
  return state;
}

test("full exploration -> score 5/5 (variety + relationship + insight + safe design)", () => {
  let s = emptyState();
  // light, slow car so a heavy crumple zone gets under the 40 kN threshold
  s.mass = 800;
  s.velocity = 5;
  for (const b of BARRIER_PRESETS) s = runTest(s, b.id);
  s.insightConfirmed = true;
  const out = scoreExploration(s);
  assert.equal(out.maxScore, 5);
  assert.equal(out.score, 5);
  assert.ok(out.relationshipHolds);
});

test("no tests, no insight -> score 0, never negative", () => {
  const out = scoreExploration(emptyState());
  assert.equal(out.score, 0);
  assert.ok(out.score >= 0);
});

test("score always within [0, 5] across random explorations", () => {
  for (let i = 0; i < 100; i++) {
    let s = emptyState();
    s.mass = 800 + Math.random() * 1700;
    s.velocity = 5 + Math.random() * 25;
    const n = Math.floor(Math.random() * BARRIER_PRESETS.length);
    for (let k = 0; k <= n; k++) s = runTest(s, BARRIER_PRESETS[k].id);
    s.insightConfirmed = Math.random() > 0.5;
    const out = scoreExploration(s);
    assert.ok(out.score >= 0 && out.score <= 5, `score in range, got ${out.score}`);
  }
});
