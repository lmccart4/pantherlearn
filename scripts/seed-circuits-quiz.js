// seed-circuits-quiz.js
// Physics — Circuits Unit. "Circuits Quiz" — 15-question MC, 3 versions (A/B/C), bilingual.
// In-class window 8:20–8:42 AM ET enforced by the tool itself; lesson visible flipped morning-of.
// Scored embed (weight 5). Block ID is HARDCODED so re-seeds never orphan student scores.
// Run: node scripts/seed-circuits-quiz.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "circuits-quiz";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Circuits Quiz",
    subtitle: "15 questions · 20 minutes · in-class",
  },
  {
    id: uid(), type: "callout",
    icon: "📝", style: "info",
    content: "**Before you start:**\n\n- You can switch between **English / Español** at any time using the toggle.\n- **15 multiple-choice questions, 20 minutes.** A timer starts when you press Begin.\n- The quiz opens at **8:20 AM** and closes at **8:42 AM**. If you're still working at 8:42, your answers are saved automatically — see Mr. McCarthy about finishing.\n- Covers **Crack the Circuit**, the **PhET Current lab**, and the **PhET Resistance lab**.",
  },
  {
    id: "circuits-quiz-embed",
    type: "embed",
    url: "https://pantherlearn.com/tools/circuits-quiz/",
    caption: "Choose your language and press Begin. 15 questions, 20 minutes.",
    height: 760,
    scored: true,
    weight: 5,
  },
  {
    id: uid(), type: "callout",
    icon: "✅", style: "insight",
    content: "When you reach the results screen, your score is submitted automatically. You'll see which questions you got right and the correct answers.",
  },
];

async function main() {
  const lesson = {
    title: "Circuits Quiz",
    questionOfTheDay: "Show what you know about complete circuits, current, resistance, Ohm's Law, and series vs. parallel.",
    course: "Physics",
    unit: "Circuits",
    order: 5.95,
    visible: false,
    gradesReleased: true,
    dueDate: "2026-05-21",
    blocks,
    updatedAt: new Date(),
  };

  // Preserve admin-managed fields if the doc already exists
  const existing = await db.collection("courses").doc(COURSE_ID)
    .collection("lessons").doc(LESSON_ID).get();
  if (existing.exists) {
    const d = existing.data();
    if (d.visible !== undefined) lesson.visible = d.visible;
    if (d.dueDate !== undefined) lesson.dueDate = d.dueDate;
    if (d.gradesReleased !== undefined) lesson.gradesReleased = d.gradesReleased;
  }

  const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
  console.log(`✅ Lesson seeded: "${lesson.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${lesson.blocks.length} | Order: ${lesson.order} | visible: ${lesson.visible} | gradesReleased: ${lesson.gradesReleased}`);
  console.log(`   safeLessonWrite: ${result.action} (preserved ${result.preserved} block IDs)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
