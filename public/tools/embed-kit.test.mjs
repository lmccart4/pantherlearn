import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScorePayload } from "./embed-kit.js";

test("buildScorePayload produces the exact EmbedBlock contract shape", () => {
  const p = buildScorePayload(3.75, 5, true);
  assert.equal(p.type, "activityScore");
  assert.equal(p.score, 3.75);
  assert.equal(p.maxScore, 5);
  assert.equal(p.gameComplete, true);
  assert.equal(typeof p.completedAt, "string");
  assert.ok(!Number.isNaN(Date.parse(p.completedAt)), "completedAt is ISO-parseable");
});

test("buildScorePayload clamps negative scores to 0", () => {
  const p = buildScorePayload(-2, 5, false);
  assert.equal(p.score, 0);
  assert.equal(p.gameComplete, false);
});
