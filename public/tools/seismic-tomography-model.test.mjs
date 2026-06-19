// Minimal Node test for the seismic-tomography scoring model.
// Run: cd <repo> && node --test public/tools/seismic-tomography-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  REGIONS, REASONING_QUESTIONS, emptyState, scoreState,
  sampleWaveData,
} from "./seismic-tomography-model.js";

function perfectState() {
  const state = emptyState();
  for (const r of REGIONS) state.labels[r.id] = r.expectedLabel;
  for (const q of REASONING_QUESTIONS) state.reasoning[q.id] = q.correct;
  return state;
}

test("perfect input scores the max (5)", () => {
  const r = scoreState(perfectState());
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
});

test("empty input scores 0, never negative", () => {
  const r = scoreState(emptyState());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong input scores 0", () => {
  const state = emptyState();
  for (const r of REGIONS) {
    // pick any label that is not the expected one
    const wrong = REGIONS.find((x) => x.expectedLabel !== r.expectedLabel).expectedLabel;
    state.labels[r.id] = wrong;
  }
  for (const q of REASONING_QUESTIONS) {
    const wrong = q.options.find((o) => o.id !== q.correct);
    state.reasoning[q.id] = wrong.id;
  }
  const r = scoreState(state);
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] for partial input", () => {
  const state = emptyState();
  state.labels[REGIONS[0].id] = REGIONS[0].expectedLabel; // 1 correct label
  const r = scoreState(state);
  assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  assert.equal(r.score, 1);
});

test("4 layer labels (1 pt each) + 2 reasoning (0.5 pt each) = 5", () => {
  assert.equal(REGIONS.length, 4);
  assert.equal(REASONING_QUESTIONS.length, 2);
});

// --- Physics consistency guard (RESOLVED — key set to "mantle") ---
// The `fastestP` answer key is "mantle": the model's P-wave profile peaks at ~13.7 km/s at the
// base of the mantle (Gutenberg discontinuity), well above the inner core's ~11.3 km/s. The
// liquid outer core slows P-waves and the inner core only partially recovers — "the deepest
// layer is fastest" is a common student misconception. This test locks the scored key to the
// data so a future profile edit can't silently desync the answer from the graph students read.
test("P-wave profile peaks in the mantle band and the scored key agrees", () => {
  const data = sampleWaveData(2000);
  let gmaxP = -Infinity, atDepth = 0;
  for (const pt of data) if (pt.p > gmaxP) { gmaxP = pt.p; atDepth = pt.depth; }
  const mantle = REGIONS.find((r) => r.expectedLabel === "mantle");
  const innerCore = REGIONS.find((r) => r.expectedLabel === "innerCore");
  const peakInMantle = atDepth >= mantle.depthMin && atDepth <= mantle.depthMax;
  const peakInInnerCore = atDepth >= innerCore.depthMin && atDepth <= innerCore.depthMax;
  assert.ok(peakInMantle, `expected P-wave peak in mantle; got ${gmaxP.toFixed(2)} km/s @ ${Math.round(atDepth)} km`);
  assert.ok(!peakInInnerCore, "P-wave peak should NOT be in the inner core");
  const fastestP = REASONING_QUESTIONS.find((q) => q.id === "fastestP");
  assert.equal(fastestP.correct, "mantle", "fastestP key must match the graph peak (mantle)");
});
