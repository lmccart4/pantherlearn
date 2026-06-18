import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_STAGES, traceFlow } from "./energy-flow-model.js";

test("traceFlow conserves energy: delivered + losses == input", () => {
  const r = traceFlow(1000);
  assert.ok(Math.abs(r.delivered + r.totalLoss - 1000) < 1e-6, "energy conserved");
  assert.equal(r.steps.length, DEFAULT_STAGES.length);
  assert.ok(r.delivered > 0 && r.delivered < 1000, "some energy lost on the way");
});

test("traceFlow: each step's energyOut = energyIn * efficiency, loss is the remainder", () => {
  const r = traceFlow(1000);
  for (const s of r.steps) {
    assert.ok(Math.abs(s.energyOut - s.energyIn * stageEff(s.name)) < 1e-6);
    assert.ok(Math.abs(s.loss - (s.energyIn - s.energyOut)) < 1e-6);
  }
  function stageEff(name) { return DEFAULT_STAGES.find((x) => x.name === name).efficiency; }
});

test("a perfectly efficient chain delivers all input with zero loss", () => {
  const r = traceFlow(500, [{ name: "ideal", efficiency: 1 }]);
  assert.equal(r.delivered, 500);
  assert.equal(r.totalLoss, 0);
});
