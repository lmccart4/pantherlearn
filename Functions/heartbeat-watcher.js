// Heartbeat watcher — classifies scheduled-task failures and posts alerts.
//
// Pure classification logic is exported separately (_internals) so it can be
// unit-tested without Firestore or network. The scheduled entrypoint is at
// the bottom (Firebase Functions v2 onSchedule, runs every 5 minutes).
//
// Failure modes:
//   silent  — grace window elapsed, no run record
//   partial — run record exists but at least one channel failed
//   error   — run record has errorMessage set
//
// Dedup: 4-hour window for same failure type, max 3 notifications per outage.
//
// ALERTS_LIVE flag gates real Discord posts. False = dry-run (writes to
// missionControl/alertsDryRun/entries instead).

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { CronExpressionParser } = require("cron-parser");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// Kill switch — flip to true to post real Discord alerts. Ship 4 ships false;
// Ship 5 flips it after the dry-run tuning window.
const ALERTS_LIVE = false;

// Discord webhook URL stored as a Firebase Functions secret. Set via:
// firebase functions:secrets:set DISCORD_ALERTS_WEBHOOK
const discordAlertsWebhook = defineSecret("DISCORD_ALERTS_WEBHOOK");

// Host hostId mapping — runsOn field in schedule docs maps to a hostId.
// (scutil --get LocalHostName values for each Mac.)
const HOST_ID_BY_RUNS_ON = {
  "mac-mini":    "Lukes-Mac-mini",
  "macbook-pro": "Lukes-Macbook-Pro-2",
};

const DEDUP_WINDOW_MS = 4 * 60 * 60 * 1000; // 4h
const MAX_NOTIFICATIONS = 3;
const HOST_GRACE_MIN = 15;

// ─── Pure classifier ─────────────────────────────────────────────────────

// Returns { type, ...info } where type is one of:
//   "ok"            — successful run within window
//   "too-early"     — within grace window, no need to alert yet
//   "host-offline"  — host hasn't reported in HOST_GRACE_MIN minutes
//   "silent"        — past grace, no run record found
//   "partial"       — run found but at least one channel failed
//   "error"         — run found with errorMessage
//
// schedule:        { cronExpression, graceWindowMinutes, timezone, runsOn }
// latestRun:       null | { startedAt: Date, overallOk: bool, errorMessage, deliveries }
// hostLastSeen:    null | Date
// now:             Date (injectable for tests)
function classifyTask({ schedule, latestRun, hostLastSeen, now, hostGracePeriodMin = HOST_GRACE_MIN }) {
  const tz = schedule.timezone || "America/New_York";
  const iter = CronExpressionParser.parse(schedule.cronExpression, { tz, currentDate: now });
  const lastExpectedFire = iter.prev().toDate();
  const graceMs = (schedule.graceWindowMinutes || 30) * 60 * 1000;
  const graceCutoff = new Date(lastExpectedFire.getTime() + graceMs);

  if (now < graceCutoff) {
    return { type: "too-early", lastExpectedFire };
  }

  if (hostLastSeen) {
    const hostAgeMs = now.getTime() - hostLastSeen.getTime();
    if (hostAgeMs > hostGracePeriodMin * 60 * 1000) {
      return { type: "host-offline", hostLastSeen, lastExpectedFire };
    }
  }

  if (!latestRun || latestRun.startedAt < new Date(lastExpectedFire.getTime() - 60 * 1000)) {
    return { type: "silent", lastExpectedFire };
  }

  if (latestRun.errorMessage) {
    return { type: "error", run: latestRun, lastExpectedFire };
  }

  if (latestRun.overallOk === false) {
    return { type: "partial", run: latestRun, lastExpectedFire };
  }

  return { type: "ok", run: latestRun, lastExpectedFire };
}

function shouldFire(currentType, existingAlert, now) {
  if (!existingAlert) return true;
  if (existingAlert.clearedAt) return true;
  if (existingAlert.lastFailureType !== currentType) return true;
  if ((existingAlert.alertCount || 0) >= MAX_NOTIFICATIONS) return false;
  const last = existingAlert.lastAlertedAt?.toDate?.() || existingAlert.lastAlertedAt;
  if (!last) return true;
  return (now.getTime() - last.getTime()) > DEDUP_WINDOW_MS;
}

// ─── Alert formatting ────────────────────────────────────────────────────

function formatAlert(taskId, classification, schedule) {
  const emoji = { silent: "🚨", partial: "⚠️", error: "❌" }[classification.type] || "❓";
  const header = `${emoji} ${classification.type.toUpperCase()} — ${taskId}`;
  const lines = [header];

  const fire = classification.lastExpectedFire?.toISOString?.() || "(unknown)";

  if (classification.type === "silent") {
    lines.push(`Expected fire: ${fire}`);
    lines.push(`Grace window: ${schedule.graceWindowMinutes} min`);
    lines.push(`Runs on: ${schedule.runsOn}`);
    lines.push(`Likely check: is Claude Desktop running on ${schedule.runsOn}? Did launchd fire?`);
  } else if (classification.type === "partial") {
    const r = classification.run;
    lines.push(`Ran at ${r.startedAt?.toISOString?.() || r.startedAt}`);
    for (const [ch, info] of Object.entries(r.deliveries || {})) {
      const sym = info.ok ? "✓" : "✗";
      const detail = info.ok
        ? (info.httpStatus ? `(${info.httpStatus})` : "(ok)")
        : `(${info.error || "unknown"})`;
      lines.push(`  ${ch}: ${sym} ${detail}`);
    }
    lines.push(`Content was generated — only delivery path failed.`);
  } else if (classification.type === "error") {
    const r = classification.run;
    lines.push(`Ran at ${r.startedAt?.toISOString?.() || r.startedAt}`);
    lines.push(`Error: ${r.errorMessage}`);
  }

  return lines.join("\n");
}

function formatRecovery(taskId, openSince, now) {
  const ms = now.getTime() - openSince.getTime();
  const min = Math.floor(ms / 60000);
  return `✅ RESOLVED — ${taskId}\nFresh successful run. Alert was open for ${min} minutes.`;
}

// ─── Firestore I/O ───────────────────────────────────────────────────────

async function latestRunFor(taskId) {
  const snap = await db.collection("missionControl/runs/entries")
    .where("taskId", "==", taskId)
    .orderBy("startedAt", "desc")
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  return {
    startedAt: d.startedAt?.toDate?.() || null,
    overallOk: d.overallOk === true,
    errorMessage: d.errorMessage || null,
    deliveries: d.deliveries || {},
  };
}

async function hostLastSeenFor(runsOn) {
  const hostId = HOST_ID_BY_RUNS_ON[runsOn];
  if (!hostId) return null;
  const snap = await db.doc(`missionControl/hosts/entries/${hostId}`).get();
  if (!snap.exists) return null;
  return snap.data().lastSeen?.toDate?.() || null;
}

async function loadAlert(taskId) {
  const snap = await db.doc(`missionControl/alerts/entries/${taskId}`).get();
  return snap.exists ? snap.data() : null;
}

async function upsertAlert(taskId, data) {
  await db.doc(`missionControl/alerts/entries/${taskId}`).set(data, { merge: true });
}

async function postAlert(message, webhookUrl) {
  if (!ALERTS_LIVE) {
    await db.collection("missionControl/alertsDryRun/entries").add({
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { dryRun: true };
  }
  if (!webhookUrl) throw new Error("DISCORD_ALERTS_WEBHOOK not set");
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  });
  return { status: res.status, dryRun: false };
}

// ─── Main loop ───────────────────────────────────────────────────────────

async function runWatcher(webhookUrl) {
  const now = new Date();

  // Self-test: if no runs in 24h, that's a system-wide failure.
  const recent24 = await db.collection("missionControl/runs/entries")
    .where("startedAt", ">=", admin.firestore.Timestamp.fromDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)))
    .limit(1).get();
  if (recent24.empty) {
    await postAlert("⚠️ WATCHMAN SEES NO RUNS IN 24H — telemetry pipeline appears systemically broken.", webhookUrl);
  }

  const schedules = await db.collection("missionControl/schedule/items")
    .where("active", "==", true)
    .where("heartbeatEnabled", "==", true)
    .get();

  for (const doc of schedules.docs) {
    const schedule = doc.data();
    if (!schedule.cronExpression) continue;
    const taskId = doc.id;

    let latestRun = null;
    let hostLastSeen = null;
    try {
      [latestRun, hostLastSeen] = await Promise.all([
        latestRunFor(taskId),
        hostLastSeenFor(schedule.runsOn),
      ]);
    } catch (e) {
      console.error(`Failed to load state for ${taskId}: ${e.message}`);
      continue;
    }

    let classification;
    try {
      classification = classifyTask({ schedule, latestRun, hostLastSeen, now });
    } catch (e) {
      console.error(`classifyTask failed for ${taskId}: ${e.message}`);
      continue;
    }

    if (classification.type === "ok") {
      const existing = await loadAlert(taskId);
      if (existing && !existing.clearedAt) {
        const openSince = existing.openSince?.toDate?.() || existing.openSince;
        await postAlert(formatRecovery(taskId, openSince, now), webhookUrl);
        await upsertAlert(taskId, {
          clearedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      continue;
    }

    if (classification.type === "too-early" || classification.type === "host-offline") {
      continue;
    }

    const existing = await loadAlert(taskId);
    if (!shouldFire(classification.type, existing, now)) continue;

    const message = formatAlert(taskId, classification, schedule);
    try {
      await postAlert(message, webhookUrl);
    } catch (e) {
      console.error(`Failed to post alert for ${taskId}: ${e.message}`);
      continue;
    }

    await upsertAlert(taskId, {
      taskId,
      lastAlertedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastFailureType: classification.type,
      lastAlertMessage: message,
      openSince: existing && !existing.clearedAt
        ? existing.openSince
        : admin.firestore.FieldValue.serverTimestamp(),
      alertCount: (existing && !existing.clearedAt ? (existing.alertCount || 0) : 0) + 1,
      clearedAt: null,
    });
  }
}

// ─── Cloud Function entrypoint ───────────────────────────────────────────

exports.heartbeatWatcher = onSchedule({
  schedule: "every 5 minutes",
  timeZone: "America/New_York",
  timeoutSeconds: 120,
  memory: "256MiB",
  secrets: [discordAlertsWebhook],
}, async () => {
  const webhookUrl = ALERTS_LIVE ? discordAlertsWebhook.value() : "";
  try {
    await runWatcher(webhookUrl);
  } catch (e) {
    console.error("heartbeat-watcher run failed:", e.stack || e.message);
    throw e;
  }
});

// Exported for unit tests.
exports._internals = { classifyTask, shouldFire, formatAlert, formatRecovery };
