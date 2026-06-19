import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BANDS,
  TECHNOLOGIES,
  INTERACTIONS,
  emptyState,
  scoreState,
  isComplete,
  bandPosition,
} from "./em-spectrum-explorer-model.js";

// Build a fully-correct placement state from the answer key in TECHNOLOGIES.
function perfectState() {
  const state = emptyState();
  for (const t of TECHNOLOGIES) {
    state.techs[t.id] = { bandId: t.correctBand, interactionId: t.correctInteraction };
  }
  return state;
}

test("bands are ordered radio -> gamma by ascending frequency", () => {
  const order = BANDS.map((b) => b.id);
  assert.deepEqual(order, [
    "radio",
    "microwave",
    "infrared",
    "visible",
    "ultraviolet",
    "xray",
    "gamma",
  ]);
  for (let i = 1; i < BANDS.length; i++) {
    assert.ok(BANDS[i].minHz >= BANDS[i - 1].minHz, "minHz must be non-decreasing");
    assert.ok(BANDS[i].maxHz > BANDS[i].minHz, "each band maxHz > minHz");
  }
});

test("bands are contiguous (each band starts where previous ends)", () => {
  for (let i = 1; i < BANDS.length; i++) {
    assert.equal(BANDS[i].minHz, BANDS[i - 1].maxHz, `gap/overlap before ${BANDS[i].id}`);
  }
});

test("answer-key bands and interactions reference real ids", () => {
  const bandIds = new Set(BANDS.map((b) => b.id));
  const interactionIds = new Set(INTERACTIONS.map((i) => i.id));
  for (const t of TECHNOLOGIES) {
    assert.ok(bandIds.has(t.correctBand), `${t.id} bad band ${t.correctBand}`);
    assert.ok(interactionIds.has(t.correctInteraction), `${t.id} bad interaction`);
  }
});

test("physics: ionizing tech (X-ray) maps to ionization; non-ionizing comms map to transmission/absorption", () => {
  const byId = Object.fromEntries(TECHNOLOGIES.map((t) => [t.id, t]));
  assert.equal(byId["xray"].correctInteraction, "ionization");
  assert.equal(byId["xray"].correctBand, "xray");
  // microwave-band comms should NOT be ionizing
  for (const id of ["wifi", "5g", "microwave-oven", "fm-radio"]) {
    assert.notEqual(byId[id].correctInteraction, "ionization");
    assert.notEqual(byId[id].correctBand, "xray");
    assert.notEqual(byId[id].correctBand, "gamma");
  }
});

test("perfect placement scores the max of 5", () => {
  const r = scoreState(perfectState());
  assert.equal(r.score, 5);
  assert.equal(r.maxScore, 5);
});

test("empty placement scores 0, never negative", () => {
  const r = scoreState(emptyState());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong placement scores 0", () => {
  const state = emptyState();
  for (const t of TECHNOLOGIES) {
    // pick a deliberately wrong band + interaction
    const wrongBand = BANDS.find((b) => b.id !== t.correctBand).id;
    const wrongInteraction = INTERACTIONS.find((i) => i.id !== t.correctInteraction).id;
    state.techs[t.id] = { bandId: wrongBand, interactionId: wrongInteraction };
  }
  const r = scoreState(state);
  assert.equal(r.score, 0);
});

test("partial credit: correct band only earns half per tech", () => {
  const state = emptyState();
  const t0 = TECHNOLOGIES[0];
  state.techs[t0.id] = { bandId: t0.correctBand, interactionId: null };
  const r = scoreState(state);
  // raw 0.5 of maxRaw=7 -> 0.5/7*5
  assert.equal(r.raw, 0.5);
  assert.ok(r.score > 0 && r.score < 5);
});

test("isComplete only true when every tech has band + interaction", () => {
  assert.equal(isComplete(emptyState()), false);
  assert.equal(isComplete(perfectState()), true);
  const partial = emptyState();
  partial.techs[TECHNOLOGIES[0].id] = { bandId: "radio", interactionId: "transmission" };
  assert.equal(isComplete(partial), false);
});

test("bandPosition returns left/width within [0,100] and ascending lefts", () => {
  let prevLeft = -1;
  for (const b of BANDS) {
    const pos = bandPosition(b);
    assert.ok(pos.left >= 0 && pos.left <= 100, `left ${pos.left}`);
    assert.ok(pos.width > 0 && pos.left + pos.width <= 100.01, `width ${pos.width}`);
    assert.ok(pos.left >= prevLeft, "lefts should ascend with frequency");
    prevLeft = pos.left;
  }
});

test("score always within [0, maxScore] for random states", () => {
  for (let i = 0; i < 50; i++) {
    const state = emptyState();
    for (const t of TECHNOLOGIES) {
      const rb = Math.random() > 0.5 ? BANDS[Math.floor(Math.random() * BANDS.length)].id : null;
      const ri =
        Math.random() > 0.5 ? INTERACTIONS[Math.floor(Math.random() * INTERACTIONS.length)].id : null;
      state.techs[t.id] = { bandId: rb, interactionId: ri };
    }
    const r = scoreState(state);
    assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  }
});
