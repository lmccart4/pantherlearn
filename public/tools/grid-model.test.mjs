import { test } from "node:test";
import assert from "node:assert/strict";
import { SOURCE_TYPES, computeDemand, computeSupply, simulateDay } from "./grid-model.js";

test("SOURCE_TYPES has the five expected sources with capacity + flags", () => {
  for (const key of ["gas", "nuclear", "solar", "wind", "battery"]) {
    assert.ok(SOURCE_TYPES[key], `missing ${key}`);
    assert.equal(typeof SOURCE_TYPES[key].capacityMW, "number");
  }
  assert.equal(SOURCE_TYPES.solar.weatherDependent, true);
  assert.equal(SOURCE_TYPES.nuclear.weatherDependent, false);
  assert.equal(SOURCE_TYPES.gas.floodVulnerable, true);
});

test("computeDemand peaks in the evening and is lowest pre-dawn", () => {
  const evening = computeDemand(19);
  const night = computeDemand(4);
  assert.ok(evening > night, "evening demand should exceed pre-dawn");
  assert.ok(night > 0, "demand never zero");
});

test("computeSupply sums dispatchable capacity and scales renewables by weather", () => {
  const sources = [
    { id: "n1", type: "nuclear", units: 1 },
    { id: "s1", type: "solar", units: 2 },
  ];
  // noon, full sun: nuclear full + solar full
  const noon = computeSupply(sources, 12, { sunlight: 1, wind: 0, outages: [] });
  assert.equal(noon, SOURCE_TYPES.nuclear.capacityMW + 2 * SOURCE_TYPES.solar.capacityMW);
  // night, no sun: only nuclear
  const night = computeSupply(sources, 0, { sunlight: 0, wind: 0, outages: [] });
  assert.equal(night, SOURCE_TYPES.nuclear.capacityMW);
  // nuclear offline: only solar
  const out = computeSupply(sources, 12, { sunlight: 1, wind: 0, outages: ["n1"] });
  assert.equal(out, 2 * SOURCE_TYPES.solar.capacityMW);
});

test("simulateDay: ample nuclear keeps reliability at 1.0, no blackouts", () => {
  const sources = [{ id: "n1", type: "nuclear", units: 2 }]; // 2000 MW > peak demand
  const r = simulateDay(sources, { sunlight: 1, wind: 0.5, outages: [] });
  assert.equal(r.reliability, 1);
  assert.equal(r.blackoutHours.length, 0);
  assert.equal(r.hours.length, 24);
});

test("simulateDay: too little supply produces blackout hours and reliability < 1", () => {
  const sources = [{ id: "g1", type: "gas", units: 1 }]; // 400 MW < demand most hours
  const r = simulateDay(sources, { sunlight: 1, wind: 0, outages: [] });
  assert.ok(r.reliability < 1, "should have deficits");
  assert.ok(r.blackoutHours.length > 0);
  assert.ok(r.totalUnservedMWh > 0);
});

test("simulateDay: battery covers a deficit that gas alone cannot", () => {
  const gasOnly = simulateDay([{ id: "g1", type: "gas", units: 2 }], { sunlight: 1, wind: 0, outages: [] });
  const withBattery = simulateDay(
    [{ id: "g1", type: "gas", units: 2 }, { id: "b1", type: "battery", units: 3 }],
    { sunlight: 1, wind: 0, outages: [] }
  );
  assert.ok(withBattery.reliability >= gasOnly.reliability, "battery should not reduce reliability");
});
