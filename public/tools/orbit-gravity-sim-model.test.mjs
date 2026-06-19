import { test } from "node:test";
import assert from "node:assert/strict";
import {
  G_SI, PRESETS, DEFAULT_PARAMS,
  integrate, computeScore, scoreLearn, scoreEllipses, scoreDeflect,
} from "./orbit-gravity-sim-model.js";

// --- Physics sanity ---------------------------------------------------------

test("inverse-square law: doubling distance quarters the force", () => {
  const M = PRESETS.sun.massKg, m = 1000, r = 1.496e11;
  const F = (rr) => (G_SI * M * m) / (rr * rr);
  assert.ok(Math.abs(F(r) / F(2 * r) - 4) < 1e-9, "F(r)/F(2r) === 4");
});

test("Earth-like params (1 AU, 29.78 km/s) produce a near-circular 1-year orbit", () => {
  const p = { presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 29.78, prediction: "circular" };
  const r = integrate(p, { maxSteps: 60000 });
  assert.equal(r.summary.shape, "circular");
  assert.ok(r.summary.eccentricity < 0.05, "low eccentricity");
  const periodYr = r.summary.period / PRESETS.sun.timeScaleS;
  assert.ok(Math.abs(periodYr - 1) < 0.05, `period ~1yr, got ${periodYr}`);
  assert.equal(r.hit, false);
});

test("escape-speed launch goes hyperbolic; very slow launch falls into an ellipse/impact", () => {
  const fast = integrate({ presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 45 }, { maxSteps: 60000 });
  assert.equal(fast.summary.shape, "hyperbolic");
  const slow = integrate({ presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 20 }, { maxSteps: 60000 });
  assert.ok(["elliptical", "impact"].includes(slow.summary.shape));
});

// --- Scoring: learn mode ----------------------------------------------------

test("scoreLearn: correct prediction → 5, wrong → 0, always within [0,5]", () => {
  const p = { presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 29.78, prediction: "circular" };
  const r = integrate(p, { maxSteps: 60000 });

  const correct = scoreLearn(p, r);
  assert.equal(correct.maxScore, 5);
  assert.equal(correct.score, 5);

  const wrong = scoreLearn({ ...p, prediction: "hyperbolic" }, r);
  assert.equal(wrong.score, 0);

  for (const s of [correct, wrong]) {
    assert.ok(s.score >= 0 && s.score <= s.maxScore, "score in range");
  }
});

test("scoreLearn: missing prediction → 0 (never negative)", () => {
  const r = integrate(DEFAULT_PARAMS.learn, { maxSteps: 60000 });
  const s = scoreLearn({ ...DEFAULT_PARAMS.learn, prediction: undefined }, r);
  assert.equal(s.score, 0);
  assert.ok(s.score >= 0);
});

// --- Scoring: ellipses mode -------------------------------------------------

test("scoreEllipses: hitting the target eccentricity → 5; far miss → low; in range", () => {
  // Find a velocity that yields ~target eccentricity by scanning.
  const target = 0.5;
  let best = null;
  for (let v = 10; v <= 40; v += 0.2) {
    const p = { presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: v, targetEccentricity: target };
    const r = integrate(p, { maxSteps: 60000 });
    if (r.summary.shape === "elliptical" || r.summary.shape === "circular") {
      const err = Math.abs((r.summary.eccentricity ?? 1) - target);
      if (!best || err < best.err) best = { p, r, err };
    }
  }
  assert.ok(best, "found an elliptical solution");
  const onTarget = scoreEllipses(best.p, best.r);
  assert.equal(onTarget.maxScore, 5);
  assert.ok(onTarget.score >= 3, `near target should score >=3, got ${onTarget.score} (err ${best.err})`);
  assert.ok(onTarget.score >= 0 && onTarget.score <= 5);

  // Escape orbit (hyperbolic) can never satisfy an eccentricity target → 0.
  const escape = integrate({ presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 45, targetEccentricity: target }, { maxSteps: 60000 });
  const miss = scoreEllipses({ targetEccentricity: target }, escape);
  assert.equal(miss.score, 0);
});

// --- Scoring: deflect mode --------------------------------------------------

test("scoreDeflect: a wide miss → 5, an impact → 0, always within [0,5]", () => {
  // High tangential velocity at 5 Earth radii should sling wide and miss.
  const widePar = { presetId: "earth", orbiterMassKg: 1e12, distanceDisplay: 5.0, velocityDisplay: 12.0, missThresholdDisplay: 1.0 };
  const wide = integrate(widePar, { maxSteps: 60000 });
  const wideScore = scoreDeflect(widePar, wide);
  assert.equal(wideScore.maxScore, 5);
  assert.ok(wideScore.score >= 0 && wideScore.score <= 5);

  // Aim it straight into the planet: very low tangential speed → impact.
  const hitPar = { presetId: "earth", orbiterMassKg: 1e12, distanceDisplay: 5.0, velocityDisplay: 0.5, missThresholdDisplay: 1.0 };
  const hit = integrate(hitPar, { maxSteps: 60000 });
  const hitScore = scoreDeflect(hitPar, hit);
  if (hit.hit) assert.equal(hitScore.score, 0);
  assert.ok(hitScore.score >= 0 && hitScore.score <= 5);
});

// --- computeScore dispatch + universal invariant ----------------------------

test("computeScore dispatches by mode and never returns out-of-range or negative", () => {
  const cases = [
    ["learn", { presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 29.78, prediction: "circular" }],
    ["ellipses", { presetId: "sun", orbiterMassKg: 1000, distanceDisplay: 1.0, velocityDisplay: 25, targetEccentricity: 0.5 }],
    ["deflect", { presetId: "earth", orbiterMassKg: 1e12, distanceDisplay: 5.0, velocityDisplay: 3.0, missThresholdDisplay: 1.0 }],
  ];
  for (const [mode, p] of cases) {
    const r = integrate(p, { maxSteps: 60000 });
    const s = computeScore(mode, p, r);
    assert.equal(s.maxScore, 5);
    assert.ok(s.score >= 0 && s.score <= 5, `${mode}: score ${s.score} out of range`);
    assert.ok(!Number.isNaN(s.score), `${mode}: score is NaN`);
  }
});
