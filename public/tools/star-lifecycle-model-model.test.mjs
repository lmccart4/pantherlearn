// Tests for the stellar life-cycle scoring model.
// Run: cd <repo> && node --test public/tools/star-lifecycle-model-model.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TRACKS,
  emptyState,
  isComplete,
  scoreState,
} from "./star-lifecycle-model-model.js";

// Build a fully-correct state from each track's correctOrder + an accepted final.
function perfectState() {
  const s = emptyState();
  for (const t of TRACKS) {
    const seq = t.correctOrder.map((stage, i) =>
      stage === null ? t.acceptedFinals[0] : stage
    );
    s[t.id] = {
      sequence: seq.slice(0, t.sequenceLength),
      finalStage: t.acceptedFinals[0],
    };
  }
  return s;
}

test("perfect sequences + fates → score equals max (5)", () => {
  const r = scoreState(perfectState());
  assert.equal(r.maxScore, 5);
  assert.equal(r.score, 5);
  assert.equal(r.sequenceScore, TRACKS.length); // 3 sequence points
  assert.equal(r.fateScore, 2); // low+med correct (1) + high correct (1)
});

test("empty state → score 0, never negative", () => {
  const r = scoreState(emptyState());
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong sequences and fates → score 0", () => {
  const s = emptyState();
  for (const t of TRACKS) {
    s[t.id] = {
      // fill with a single stage that breaks order
      sequence: Array(t.sequenceLength).fill("black-hole"),
      finalStage: "nebula", // never an accepted final
    };
  }
  const r = scoreState(s);
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] for mixed input", () => {
  const s = perfectState();
  // Corrupt one track's sequence only.
  s[TRACKS[0].id].sequence[0] = "supernova";
  const r = scoreState(s);
  assert.ok(r.score >= 0 && r.score <= r.maxScore);
  assert.ok(r.score < 5);
});

test("physics: low-mass fate is white dwarf, NOT supernova/neutron-star/black-hole", () => {
  const low = TRACKS.find((t) => t.id === "low");
  assert.deepEqual(low.acceptedFinals, ["white-dwarf"]);
  assert.ok(!low.acceptedFinals.includes("neutron-star"));
  assert.ok(!low.acceptedFinals.includes("black-hole"));
});

test("physics: high-mass fate is neutron star or black hole (via supernova), NOT white dwarf", () => {
  const high = TRACKS.find((t) => t.id === "high");
  assert.ok(high.acceptedFinals.includes("neutron-star"));
  assert.ok(high.acceptedFinals.includes("black-hole"));
  assert.ok(!high.acceptedFinals.includes("white-dwarf"));
  // High-mass correct order must pass through supernova.
  assert.ok(high.correctOrder.includes("supernova"));
});

test("physics: high-mass white-dwarf answer scores wrong on the fate dimension", () => {
  const s = perfectState();
  s.high.finalStage = "white-dwarf"; // physically wrong for high mass
  s.high.sequence[s.high.sequence.length - 1] = "white-dwarf";
  const r = scoreState(s);
  assert.ok(r.fateScore < 2, "white-dwarf fate for high-mass must lose the high-mass fate point");
});

test("isComplete true only when every track has a full sequence AND a final stage", () => {
  const s = emptyState();
  assert.equal(isComplete(s), false);
  const full = perfectState();
  assert.equal(isComplete(full), true);
  // Remove one final stage → incomplete.
  full[TRACKS[0].id].finalStage = null;
  assert.equal(isComplete(full), false);
});
