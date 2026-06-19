// Tests for the spectra / redshift scoring model.
// Run: cd <repo> && node --test public/tools/spectra-redshift-explorer-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateIdentifyStars,
  generateRedshiftGalaxies,
  scoreIdentify,
  scoreRedshift,
  scoreIdentifyState,
  scoreRedshiftState,
  SPEED_OF_LIGHT_KMS,
} from "./spectra-redshift-explorer-model.js";

// ---- Identify mode ----

test("identify: all correct selections → full score (max)", () => {
  const stars = generateIdentifyStars();
  const selections = {};
  for (const s of stars) selections[s.id] = s.elements.slice();
  const r = scoreIdentifyState(stars, selections);
  assert.equal(r.score, r.maxScore);
  assert.equal(r.score, stars.length);
});

test("identify: empty selections → score 0, never negative", () => {
  const stars = generateIdentifyStars();
  const r = scoreIdentifyState(stars, {});
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("identify: all-wrong selections → low score", () => {
  const stars = generateIdentifyStars();
  const selections = {};
  // Pick an element guaranteed wrong: if star has H, choose [Na, Ca, He] minus its set.
  for (const s of stars) {
    const wrong = ["H", "He", "Na", "Ca"].filter((e) => !s.elements.includes(e));
    // Use a single wrong element so set size differs from expected → guaranteed false.
    selections[s.id] = [wrong[0]];
  }
  const r = scoreIdentifyState(stars, selections);
  assert.equal(r.score, 0);
});

test("identify: score always within [0, maxScore]", () => {
  const stars = generateIdentifyStars();
  // Mixed: half correct, half partial.
  const selections = {};
  stars.forEach((s, i) => {
    selections[s.id] = i % 2 === 0 ? s.elements.slice() : s.elements.slice(0, 1);
  });
  const r = scoreIdentifyState(stars, selections);
  assert.ok(r.score >= 0 && r.score <= r.maxScore);
});

test("identify: partial subset is NOT counted correct (exact-set match required)", () => {
  // A star with 2+ elements; selecting only one must score false.
  const stars = generateIdentifyStars();
  const multi = stars.find((s) => s.elements.length >= 2);
  assert.ok(multi, "expected at least one multi-element star");
  assert.equal(scoreIdentify(multi, [multi.elements[0]]), false);
  assert.equal(scoreIdentify(multi, multi.elements.slice()), true);
});

// ---- Redshift mode ----

test("redshift: correct measured wavelength + velocity → full score (max)", () => {
  const galaxies = generateRedshiftGalaxies();
  const measurements = {};
  for (const g of galaxies) {
    measurements[g.id] = {
      measuredWavelength: g.restWavelength * (1 + g.z), // exact shifted line
      inferredZ: g.z,
      inferredVelocity: Math.round(g.z * SPEED_OF_LIGHT_KMS),
    };
  }
  const r = scoreRedshiftState(galaxies, measurements);
  assert.equal(r.score, r.maxScore);
  assert.equal(r.score, galaxies.length);
});

test("redshift: empty measurements → score 0, never negative", () => {
  const galaxies = generateRedshiftGalaxies();
  const r = scoreRedshiftState(galaxies, {});
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("redshift: rest-wavelength guess (no shift) → wrong, score 0", () => {
  const galaxies = generateRedshiftGalaxies();
  const measurements = {};
  for (const g of galaxies) {
    measurements[g.id] = {
      measuredWavelength: g.restWavelength, // no shift = z 0, velocity 0
      inferredZ: 0,
      inferredVelocity: 0,
    };
  }
  const r = scoreRedshiftState(galaxies, measurements);
  assert.equal(r.score, 0);
});

test("redshift: physics — redshift implies recession (positive velocity = moving away)", () => {
  const galaxies = generateRedshiftGalaxies();
  for (const g of galaxies) {
    // Observed wavelength is longer than rest (shifted toward red).
    assert.ok(g.observedWavelength > g.restWavelength, "observed must be redshifted (longer)");
    // z is positive → recession.
    assert.ok(g.z > 0);
    // v = c*z is positive (away from us).
    const r = scoreRedshift(g, g.observedWavelength, g.z, Math.round(g.z * SPEED_OF_LIGHT_KMS));
    assert.ok(r.correctV > 0);
    assert.equal(r.correctV, Math.round(g.z * SPEED_OF_LIGHT_KMS));
  }
});

test("redshift: score always within [0, maxScore]", () => {
  const galaxies = generateRedshiftGalaxies();
  const measurements = {};
  galaxies.forEach((g, i) => {
    measurements[g.id] = i % 2 === 0
      ? { measuredWavelength: g.restWavelength * (1 + g.z), inferredZ: g.z, inferredVelocity: Math.round(g.z * SPEED_OF_LIGHT_KMS) }
      : { measuredWavelength: g.restWavelength, inferredZ: 0, inferredVelocity: 0 };
  });
  const r = scoreRedshiftState(galaxies, measurements);
  assert.ok(r.score >= 0 && r.score <= r.maxScore);
});
