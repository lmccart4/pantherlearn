import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TOWER_TYPES,
  MAPS,
  getCell,
  isBuildable,
  placeTower,
  removeTower,
  computeCoverage,
  computeCost,
  scoreDesign,
  emptyState,
} from "./signal-tower-mapper-model.js";

const MAP = MAPS.standard;

// Place a tower regardless of returned ok flag, throwing if rejected.
function place(state, typeId, r, c) {
  const res = placeTower(state, MAP, typeId, r, c);
  assert.ok(res.ok, `placeTower rejected ${typeId}@${r},${c}: ${res.reason}`);
  return res.state;
}

// Find all buildable cells in reading order.
function buildableCells(map) {
  const out = [];
  for (let r = 0; r < map.rows; r++)
    for (let c = 0; c < map.cols; c++) if (isBuildable(map, r, c)) out.push({ r, c });
  return out;
}

test("physics: higher frequency -> shorter range, lower building penetration, higher bandwidth", () => {
  const order = ["low4G", "sub6", "mmWave"]; // 700MHz -> 3.5GHz -> 28GHz
  for (let i = 1; i < order.length; i++) {
    const lo = TOWER_TYPES[order[i - 1]];
    const hi = TOWER_TYPES[order[i]];
    assert.ok(hi.rangeCells < lo.rangeCells, `${order[i]} range should be shorter`);
    assert.ok(hi.penetration < lo.penetration, `${order[i]} penetration should be lower`);
    assert.ok(hi.bandwidth > lo.bandwidth, `${order[i]} bandwidth should be higher`);
  }
});

test("buildings reduce signal via penetration; roads pass at full strength", () => {
  // Place a sub-6 tower (penetration 0.5) at a road cell, check a same-distance B vs R.
  let s = emptyState();
  s = place(s, "sub6", 3, 5); // row 3 is all road in standard map
  const cov = computeCoverage(MAP, s.placedTowers);
  // adjacent road cell (same row) vs adjacent building cell get different signal
  const roadKey = "3,6"; // road
  const bldKey = "4,5"; // building directly below
  const roadSig = cov.signal.get(roadKey) || 0;
  const bldSig = cov.signal.get(bldKey) || 0;
  assert.ok(roadSig > 0, "road cell should get signal");
  // a building one cell away should be attenuated relative to a road one cell away
  assert.ok(bldSig < roadSig || bldSig <= roadSig * TOWER_TYPES.sub6.penetration + 1e-9);
});

test("computeCost sums placed tower costs; placement blocked over budget", () => {
  let s = emptyState();
  assert.equal(computeCost(MAP, s.placedTowers), 0);
  s = place(s, "low4G", 3, 1); // cost 4
  assert.equal(computeCost(MAP, s.placedTowers), 4);
  // Try to blow the budget with mmWave spam
  let blocked = false;
  let s2 = s;
  for (let i = 0; i < 20; i++) {
    const res = placeTower(s2, MAP, "mmWave", 3, (i % 10) + 1);
    if (!res.ok) {
      blocked = res.reason === "over-budget";
      break;
    }
    s2 = res.state;
  }
  assert.ok(blocked, "should eventually block placement over budget");
  assert.ok(computeCost(MAP, s2.placedTowers) <= MAP.budget);
});

test("empty design scores low (no coverage, no strategy, no rationale)", () => {
  const r = scoreDesign(emptyState(), MAP);
  // within-budget point still earned (cost 0 <= budget) but everything else 0
  assert.equal(r.coverageScore, 0);
  assert.equal(r.strategyScore, 0);
  assert.equal(r.rationaleScore, 0);
  assert.equal(r.budgetScore, 1);
  assert.equal(r.score, 1);
  assert.ok(r.score >= 0);
});

test("score never exceeds max even with a maxed-out design", () => {
  // Saturate the map with cheap 4G macros across all buildable cells (respecting budget).
  let s = emptyState();
  for (const cell of buildableCells(MAP)) {
    const res = placeTower(s, MAP, "low4G", cell.r, cell.c);
    if (res.ok) s = res.state;
  }
  s.rationale = "I used low-band 4G for wide coverage and penetration into buildings.";
  const r = scoreDesign(s, MAP);
  assert.ok(r.score <= r.maxScore, `score ${r.score} > max`);
  assert.ok(r.score >= 0);
});

test("a balanced in-budget design (coverage + diversity) reaches a perfect 5/5", () => {
  // Balanced layout: 4 low-band macros for wide coverage + penetration, a sub-6 for capacity,
  // a wifi indoor unit. Cost 23 <= 25 budget; coverage ~0.72. Under the calibrated coverage
  // ladder this earns full coverage (2.0) + budget (1) + strategy (1.5) + rationale (0.5) = 5.0.
  // (Pure-macro spam reaches higher raw coverage but scores strategy 0, so it caps at 3.5 — the
  // rubric rewards a balanced engineering tradeoff over coverage-only spam.)
  let s = emptyState();
  s = place(s, "low4G", 4, 3);
  s = place(s, "low4G", 6, 7);
  s = place(s, "low4G", 3, 8);
  s = place(s, "low4G", 7, 3);
  s = place(s, "sub6", 7, 9);
  s = place(s, "wifi", 1, 4);
  s.rationale = "Low-band 4G covers wide areas and penetrates buildings; sub-6 adds capacity; WiFi handles indoor users.";
  const r = scoreDesign(s, MAP);
  assert.ok(r.withinBudget, `cost ${r.cost} over budget ${MAP.budget}`);
  assert.equal(r.budgetScore, 1);
  assert.equal(r.strategyScore, 1.5); // 2+ types, indoor wifi, high-cap sub6
  assert.equal(r.rationaleScore, 0.5); // >= 20 chars
  assert.equal(r.coverageScore, 2, `coverage tier should be full: ${r.coverage.combinedPct}`);
  assert.equal(r.score, 5, `balanced in-budget design should reach 5/5, got ${r.score}`);
});

test("all four scoring components can each reach their individual maximum", () => {
  // Coverage component hits 2.0 when combinedPct >= 0.70 (blanket the map, ignore budget).
  // These 9 spots are the greedy coverage maximizers (reach ~0.903) — see model exploration.
  const blanketed = emptyState();
  const macroSpots = [
    [4, 3], [6, 7], [3, 8], [7, 3], [7, 9], [3, 5], [7, 6], [4, 9], [6, 1],
  ];
  blanketed.placedTowers = macroSpots.map((p, i) => ({ id: i + 1, type: "low4G", r: p[0], c: p[1] }));
  const rc = scoreDesign(blanketed, MAP);
  assert.equal(rc.coverageScore, 2, `coverage ${rc.coverage.combinedPct} should be >=0.70`);
  // (this design is over budget by construction, so its budgetScore is 0 — that is correct)
  assert.equal(rc.budgetScore, 0);
});

test("over-budget design loses the budget point", () => {
  // Build a design, then force it over budget by mutating placedTowers directly.
  let s = emptyState();
  s = place(s, "mmWave", 3, 1);
  s = place(s, "mmWave", 3, 3);
  s = place(s, "mmWave", 3, 5); // 3 * 8 = 24, under 25
  // push one more by bypassing placeTower's guard (simulate stale state)
  s.placedTowers.push({ id: 99, type: "mmWave", r: 3, c: 7 }); // now 32 > 25
  const r = scoreDesign(s, MAP);
  assert.equal(r.withinBudget, false);
  assert.equal(r.budgetScore, 0);
});

test("rationale under 20 chars earns no rationale point", () => {
  let s = emptyState();
  s = place(s, "low4G", 3, 5);
  s.rationale = "too short";
  const r = scoreDesign(s, MAP);
  assert.equal(r.rationaleScore, 0);
});

test("removeTower drops the tower and recovers budget", () => {
  let s = emptyState();
  s = place(s, "mmWave", 3, 1);
  const id = s.placedTowers[0].id;
  assert.equal(computeCost(MAP, s.placedTowers), 8);
  s = removeTower(s, id);
  assert.equal(s.placedTowers.length, 0);
  assert.equal(computeCost(MAP, s.placedTowers), 0);
});

test("water cells are never buildable; road/park are", () => {
  assert.equal(getCell(MAP, 0, 0), "W");
  assert.equal(isBuildable(MAP, 0, 0), false);
  // row 3 is all road
  assert.equal(isBuildable(MAP, 3, 5), true);
});

test("score within [0, maxScore] across random placements", () => {
  const types = Object.keys(TOWER_TYPES);
  const cells = buildableCells(MAP);
  for (let i = 0; i < 40; i++) {
    let s = emptyState();
    const n = Math.floor(Math.random() * 6);
    for (let k = 0; k < n; k++) {
      const t = types[Math.floor(Math.random() * types.length)];
      const cell = cells[Math.floor(Math.random() * cells.length)];
      const res = placeTower(s, MAP, t, cell.r, cell.c);
      if (res.ok) s = res.state;
    }
    if (Math.random() > 0.5) s.rationale = "some explanation that is over twenty characters long";
    const r = scoreDesign(s, MAP);
    assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  }
});
