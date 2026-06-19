import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CAR_PARAMS, MATERIALS, PATTERNS, DEFAULT_CRITERIA,
  kineticEnergyJ, averageForceN, peakForceN, designCost, designWeight,
  collisionTimeS, evaluateDesign, scoreDesign, emptyDesign,
} from "./crumple-zone-designer-model.js";

// ---- Physics: longer crumple length -> lower force, longer time ----

test("kinetic energy = 1/2 m v^2", () => {
  assert.equal(kineticEnergyJ(CAR_PARAMS), 0.5 * 1200 * 8 * 8);
});

test("average force = KE / length (work-energy)", () => {
  const ke = kineticEnergyJ(CAR_PARAMS);
  assert.ok(Math.abs(averageForceN({ materialId: "aluminum", lengthM: 0.4 }) - ke / 0.4) < 1e-6);
});

test("longer crumple length -> lower peak force AND longer collision time", () => {
  const shortD = { materialId: "aluminum", patternId: "straight", lengthM: 0.2 };
  const longD = { materialId: "aluminum", patternId: "straight", lengthM: 0.8 };
  assert.ok(peakForceN(longD) < peakForceN(shortD), "longer L -> lower peak force");
  assert.ok(collisionTimeS(longD) > collisionTimeS(shortD), "longer L -> longer Δt");
  // Δt = 2L/v
  assert.ok(Math.abs(collisionTimeS(longD) - (2 * 0.8) / CAR_PARAMS.speedMs) < 1e-9);
});

test("softer pattern / lower force-factor material -> lower peak force at same length", () => {
  const base = { materialId: "aluminum", patternId: "straight", lengthM: 0.5 };
  const softerPattern = { ...base, patternId: "accordion" }; // 0.75 multiplier
  const softerMaterial = { ...base, materialId: "carbon" };  // 0.75 force factor
  assert.ok(peakForceN(softerPattern) < peakForceN(base));
  assert.ok(peakForceN(softerMaterial) < peakForceN(base));
});

test("cost and weight scale with length and material rates", () => {
  assert.equal(designCost({ materialId: "steel", lengthM: 0.5 }), Math.round(200 * 0.5));
  assert.equal(designWeight({ materialId: "steel", lengthM: 0.5 }), Math.round(30 * 0.5 * 10) / 10);
});

// ---- Scoring ----

test("a fully passing design (force + cost + weight) -> score 5/5", () => {
  // foam/accordion/0.53m is a known winner (peak < 60kN, cheap, light)
  const ev = evaluateDesign({ materialId: "foam", patternId: "accordion", lengthM: 0.53 });
  assert.ok(ev.passesAll, "design passes all criteria");
  const out = scoreDesign(ev);
  assert.equal(out.maxScore, 5);
  assert.equal(out.score, 5);
});

test("safe but over-budget design -> partial 3/5", () => {
  // carbon ($800/m) long zone: passes force, blows the $500 budget
  const ev = evaluateDesign({ materialId: "carbon", patternId: "accordion", lengthM: 0.8 });
  assert.ok(ev.passesForce, "force OK");
  assert.ok(!ev.withinCost, "over cost budget");
  const out = scoreDesign(ev);
  assert.equal(out.score, 3);
});

test("worst design -> minimum score 1, never 0 or negative", () => {
  // shortest, stiffest: huge peak force
  const ev = evaluateDesign({ materialId: "steel", patternId: "reinforced", lengthM: 0.1 });
  assert.ok(!ev.passesForce);
  const out = scoreDesign(ev);
  assert.equal(out.score, 1, "attempted floor");
  assert.ok(out.score >= 0);
});

test("score always within [0, 5] across the full design space", () => {
  for (const materialId of Object.keys(MATERIALS)) {
    for (const patternId of Object.keys(PATTERNS)) {
      for (let cm = 10; cm <= 80; cm += 5) {
        const ev = evaluateDesign({ materialId, patternId, lengthM: cm / 100 });
        const out = scoreDesign(ev);
        assert.ok(out.score >= 0 && out.score <= 5, `score in range for ${materialId}/${patternId}/${cm}cm: ${out.score}`);
      }
    }
  }
});

test("emptyDesign is a valid scorable default", () => {
  const ev = evaluateDesign(emptyDesign());
  const out = scoreDesign(ev);
  assert.ok(out.score >= 1 && out.score <= 5);
});
