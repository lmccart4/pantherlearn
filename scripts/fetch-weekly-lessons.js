#!/usr/bin/env node
// fetch-weekly-lessons.js
// Reads lessons from Firestore for all courses, filters by due date for the
// target week (Mon-Fri) + early next week (Mon-Tue), outputs JSON to stdout.
//
// Usage:
//   node scripts/fetch-weekly-lessons.js                  # current week
//   node scripts/fetch-weekly-lessons.js --week 2026-W10  # specific week

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

// ── Week helpers (inlined from src/lib/weekHelpers.js) ──────────────────────

function getISOWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d - yearStart) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getWeekMonday(weekKey) {
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Course definitions ──────────────────────────────────────────────────────

// Course IDs — AI Literacy uses Period 4 section as the reference
const COURSES = [
  { id: "physics", name: "Physics" },
  { id: "digital-literacy", name: "Digital Literacy" },
  { id: "Y9Gdhw5MTY8wMFt6Tlvj", name: "AI Literacy" },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Parse --week arg
  const args = process.argv.slice(2);
  const weekIdx = args.indexOf("--week");
  const weekKey = weekIdx !== -1 && args[weekIdx + 1]
    ? args[weekIdx + 1]
    : getISOWeekKey();

  // Calculate date ranges
  const monday = getWeekMonday(weekKey);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const nextTuesday = new Date(monday);
  nextTuesday.setDate(monday.getDate() + 8);

  const mondayISO = toISO(monday);
  const fridayISO = toISO(friday);
  const nextMondayISO = toISO(nextMonday);
  const nextTuesdayISO = toISO(nextTuesday);

  // Build day lookup for the week
  const weekDays = {};
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDays[toISO(d)] = DAY_NAMES[d.getDay()];
  }

  const result = {
    weekKey,
    weekRange: {
      monday: mondayISO,
      friday: fridayISO,
      mondayFormatted: formatDate(monday),
      fridayFormatted: formatDate(friday),
    },
    nextWeekRange: {
      monday: nextMondayISO,
      tuesday: nextTuesdayISO,
    },
    weekDays,
    courses: {},
  };

  for (const course of COURSES) {
    const snap = await db
      .collection("courses")
      .doc(course.id)
      .collection("lessons")
      .orderBy("order", "asc")
      .get();

    const thisWeek = [];
    const nextWeekPreview = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      const dd = data.dueDate;
      if (!dd) continue;

      const lesson = {
        id: doc.id,
        title: data.title || "(Untitled)",
        unit: data.unit || "",
        dueDate: dd,
        dayOfWeek: null,
        order: data.order ?? 999,
        visible: data.visible !== false,
        blocks: data.blocks || [],
      };

      // This week (Mon-Fri)
      if (dd >= mondayISO && dd <= fridayISO) {
        lesson.dayOfWeek = weekDays[dd] || null;
        thisWeek.push(lesson);
      }
      // Early next week (Mon-Tue)
      else if (dd >= nextMondayISO && dd <= nextTuesdayISO) {
        const nd = new Date(dd + "T00:00:00");
        lesson.dayOfWeek = DAY_NAMES[nd.getDay()];
        nextWeekPreview.push(lesson);
      }
    }

    // Sort by dueDate then order
    const sortFn = (a, b) =>
      a.dueDate.localeCompare(b.dueDate) || a.order - b.order;
    thisWeek.sort(sortFn);
    nextWeekPreview.sort(sortFn);

    result.courses[course.id] = {
      name: course.name,
      lessons: thisWeek,
      nextWeekPreview,
    };
  }

  console.log(JSON.stringify(result, null, 2));
}

main().then(() => process.exit(0)).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
