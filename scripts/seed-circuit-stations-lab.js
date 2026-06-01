// seed-circuit-stations-lab.js
// Physics — Circuits Closeout: Digital Stations Lab (auto-graded PhET embed)
// Each student gets uid-seeded circuit values; the embed grades their PhET readings.
// Run: node scripts/seed-circuit-stations-lab.js
//
// Safe: brand-new lesson, no existing student scores. Uses safeLessonWrite (append-only,
// preserves block IDs). The embed block id is HARDCODED so re-runs never orphan scores.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "physics-circuits-station-lab";
const EMBED_URL = "https://pantherlearn.web.app/tools/circuit-stations-lab.html";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Circuit Stations — Digital Lab",
    subtitle: "Build each circuit in PhET, read the meter, enter what you measure",
  },
  {
    id: "objectives", type: "objectives",
    title: "What You'll Do",
    items: [
      "Build series, parallel, and combination circuits in the PhET simulator",
      "Use the ammeter and voltmeter to measure current and voltage",
      "Predict each reading from your own circuit values, then verify it",
      "Lock in all 6 stations to earn full credit",
    ],
  },
  {
    id: uid(), type: "callout",
    icon: "🧩", style: "info",
    content:
      "**Everyone has different numbers.** Your Circuit Kit (battery + 3 resistors) is unique to your login, " +
      "so a classmate's reading won't match yours — you have to build each circuit yourself. " +
      "Work through all six stations below. Your score saves automatically as you check each one, and your **best score is kept**.",
  },
  {
    id: uid(), type: "callout",
    icon: "🔧", style: "warning",
    content:
      "**How to work:** (1) Open the PhET simulator from the button in the activity. " +
      "(2) Drag out your battery and resistors and set them to *your* kit's values. " +
      "(3) Wire the circuit the station asks for, drop in the ammeter/voltmeter, and read it. " +
      "(4) Type your reading and press **Check**. Green = locked in.",
  },
  {
    // STABLE id — do not change; student scores key to this block id.
    id: "circuit-stations-embed",
    type: "embed",
    url: EMBED_URL,
    caption: "Circuit Stations Digital Lab — 6 auto-graded PhET builds (6 pts)",
    scored: true,
    weight: 6,
    height: 1180,
  },
];

const lesson = {
  title: "Circuit Stations — Digital Lab",
  description:
    "Auto-graded digital half of the circuits closeout. Each student builds 6 circuits in PhET " +
    "using login-specific values; the embed checks their readings against their own kit.",
  unit: "Circuits",
  course: COURSE_ID,
  visible: false,        // Luke flips visible:true morning-of (Mon 6/1)
  gradesReleased: true,  // same-day grades visible in MyGrades
  dueDate: "2026-06-02",
  order: 9000,           // park at end; reorder when scheduled
  blocks,
};

(async () => {
  const res = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
  console.log(`safeLessonWrite -> ${res.action} (preserved ${res.preserved} block IDs)`);
  console.log(`Lesson: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`Embed block id: circuit-stations-embed  |  url: ${EMBED_URL}`);
  console.log("visible:false — flip to true Monday morning before P1.");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
