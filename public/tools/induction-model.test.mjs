import { test } from "node:test";
import assert from "node:assert/strict";
import { inducedPeak, currentAt, waveform } from "./induction-model.js";

test("inducedPeak rises with rpm and coils, zero when either is zero", () => {
  assert.equal(inducedPeak(0, 5), 0);
  assert.equal(inducedPeak(100, 0), 0);
  assert.ok(inducedPeak(200, 5) > inducedPeak(100, 5), "faster spin → more current");
  assert.ok(inducedPeak(100, 10) > inducedPeak(100, 5), "more coils → more current");
  assert.ok(inducedPeak(100, 5, 2) > inducedPeak(100, 5, 1), "stronger field → more current");
});

test("currentAt is peak at 0deg, ~0 at 90deg, negative at 180deg", () => {
  const peak = inducedPeak(120, 6);
  assert.ok(Math.abs(currentAt(0, 120, 6) - peak) < 1e-9);
  assert.ok(Math.abs(currentAt(90, 120, 6)) < 1e-9);
  assert.ok(currentAt(180, 120, 6) < 0);
});

test("waveform returns evenly spaced samples over a full rotation", () => {
  const w = waveform(120, 6, 1, 24);
  assert.equal(w.length, 24);
  assert.equal(w[0].angle, 0);
  assert.ok(w.every((p) => typeof p.current === "number"));
});
