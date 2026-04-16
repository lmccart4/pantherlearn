// Unit tests for the pure classifier and dedup logic.
// Run: node --test heartbeat-watcher.test.js
//
// No Firestore, no network. All inputs are plain objects.

const test = require("node:test");
const assert = require("node:assert");
const { _internals } = require("./heartbeat-watcher");
const { classifyTask, shouldFire } = _internals;

const baseSchedule = {
  cronExpression: "0 6 * * *",
  graceWindowMinutes: 30,
  timezone: "America/New_York",
  runsOn: "mac-mini",
};

// ─── Classification ──────────────────────────────────────────────────────

test("too-early — within grace window", () => {
  // 6:15 AM ET = 10:15 UTC (EDT). Grace is 30 min from 6:00, so we're 15 in.
  const now = new Date("2026-04-16T10:15:00Z");
  const r = classifyTask({ schedule: baseSchedule, latestRun: null, hostLastSeen: null, now });
  assert.strictEqual(r.type, "too-early");
});

test("silent — past grace, no run record", () => {
  const now = new Date("2026-04-16T10:35:00Z"); // 06:35 ET, past 30-min grace
  const r = classifyTask({ schedule: baseSchedule, latestRun: null, hostLastSeen: null, now });
  assert.strictEqual(r.type, "silent");
});

test("ok — past grace, successful run", () => {
  const now = new Date("2026-04-16T10:35:00Z");
  const latestRun = {
    startedAt: new Date("2026-04-16T10:01:00Z"),
    overallOk: true,
    deliveries: { discord: { ok: true }, outlook: { ok: true } },
  };
  const r = classifyTask({ schedule: baseSchedule, latestRun, hostLastSeen: null, now });
  assert.strictEqual(r.type, "ok");
});

test("partial — overallOk false, mixed delivery results", () => {
  const now = new Date("2026-04-16T10:35:00Z");
  const latestRun = {
    startedAt: new Date("2026-04-16T10:01:00Z"),
    overallOk: false,
    deliveries: { discord: { ok: true }, outlook: { ok: false, error: "Outlook not running" } },
  };
  const r = classifyTask({ schedule: baseSchedule, latestRun, hostLastSeen: null, now });
  assert.strictEqual(r.type, "partial");
});

test("error — run has errorMessage", () => {
  const now = new Date("2026-04-16T10:35:00Z");
  const latestRun = {
    startedAt: new Date("2026-04-16T10:01:00Z"),
    overallOk: false,
    errorMessage: "deliver.sh crashed: ENOENT",
    deliveries: {},
  };
  const r = classifyTask({ schedule: baseSchedule, latestRun, hostLastSeen: null, now });
  assert.strictEqual(r.type, "error");
});

test("host-offline — host lastSeen > 15 min ago", () => {
  const now = new Date("2026-04-16T10:35:00Z");
  const hostLastSeen = new Date("2026-04-16T10:00:00Z"); // 35 min ago
  const r = classifyTask({ schedule: baseSchedule, latestRun: null, hostLastSeen, now });
  assert.strictEqual(r.type, "host-offline");
});

test("host-online — lastSeen within 15 min, still classifies silent", () => {
  const now = new Date("2026-04-16T10:35:00Z");
  const hostLastSeen = new Date("2026-04-16T10:30:00Z"); // 5 min ago
  const r = classifyTask({ schedule: baseSchedule, latestRun: null, hostLastSeen, now });
  assert.strictEqual(r.type, "silent");
});

test("stale run — predates last fire, treated as silent for current cycle", () => {
  // Yesterday's run was successful; today there's no run yet.
  const now = new Date("2026-04-16T10:35:00Z");
  const latestRun = {
    startedAt: new Date("2026-04-15T10:01:00Z"), // yesterday
    overallOk: true,
    deliveries: {},
  };
  const r = classifyTask({ schedule: baseSchedule, latestRun, hostLastSeen: null, now });
  assert.strictEqual(r.type, "silent");
});

test("weekday-only schedule — Saturday is too-early or silent depending on grace", () => {
  // standup is "30 8 * * 1-5" (weekdays only). Saturday morning should
  // resolve previous fire to Friday 8:30 AM, well past grace.
  const sched = { ...baseSchedule, cronExpression: "30 8 * * 1-5", graceWindowMinutes: 30 };
  // Saturday Apr 18 2026, 12:00 UTC = 8:00 AM ET (Saturday)
  const now = new Date("2026-04-18T12:00:00Z");
  const r = classifyTask({ schedule: sched, latestRun: null, hostLastSeen: null, now });
  // No run since Friday 8:30 AM ET → silent
  assert.strictEqual(r.type, "silent");
});

// ─── Dedup ───────────────────────────────────────────────────────────────

test("shouldFire — no prior alert", () => {
  assert.strictEqual(shouldFire("silent", null, new Date()), true);
});

test("shouldFire — same type within 4h window, suppressed", () => {
  const now = new Date("2026-04-16T12:00:00Z");
  const existing = {
    lastFailureType: "silent",
    lastAlertedAt: new Date("2026-04-16T11:30:00Z"), // 30 min ago
    alertCount: 1,
    clearedAt: null,
  };
  assert.strictEqual(shouldFire("silent", existing, now), false);
});

test("shouldFire — same type after 4h, escalates", () => {
  const now = new Date("2026-04-16T12:00:00Z");
  const existing = {
    lastFailureType: "silent",
    lastAlertedAt: new Date("2026-04-16T07:00:00Z"), // 5h ago
    alertCount: 1,
    clearedAt: null,
  };
  assert.strictEqual(shouldFire("silent", existing, now), true);
});

test("shouldFire — failure type changed, fires immediately", () => {
  const now = new Date();
  const existing = {
    lastFailureType: "silent",
    lastAlertedAt: new Date(now.getTime() - 60 * 1000),
    alertCount: 1,
    clearedAt: null,
  };
  assert.strictEqual(shouldFire("partial", existing, now), true);
});

test("shouldFire — at notification cap, suppressed until cleared", () => {
  const now = new Date("2026-04-16T23:59:59Z");
  const existing = {
    lastFailureType: "silent",
    lastAlertedAt: new Date("2026-04-16T05:00:00Z"),
    alertCount: 3,
    clearedAt: null,
  };
  assert.strictEqual(shouldFire("silent", existing, now), false);
});

test("shouldFire — previously cleared alert can re-fire", () => {
  const now = new Date();
  const existing = {
    lastFailureType: "silent",
    lastAlertedAt: new Date(now.getTime() - 60 * 1000),
    alertCount: 3,
    clearedAt: new Date(now.getTime() - 30 * 1000),
  };
  assert.strictEqual(shouldFire("silent", existing, now), true);
});
