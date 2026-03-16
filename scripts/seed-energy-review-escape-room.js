// seed-energy-review-escape-room.js
// Physics — Energy Unit, Review Lesson (order: 9)
// "Energy Review: Escape Room"
// Run from your pantherlearn directory: node scripts/seed-energy-review-escape-room.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── INTRO ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔐",
    title: "Energy Escape Room",
    subtitle: "Unit Review",
  },

  {
    id: "objectives", type: "objectives",
    title: "Review Objectives",
    items: [
      "Apply KE = ½mv² to calculate kinetic energy",
      "Apply GPE = mgh to calculate gravitational potential energy",
      "Use conservation of energy to connect GPE and KE",
      "Calculate work using W = Fd",
      "Calculate power using P = W/t",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Can you escape? Solve 5 energy puzzles — one from each topic in the unit — to crack the exit code.",
  },

  {
    id: uid(), type: "text",
    content: "This is your unit review. The Escape Room covers every major formula from the Energy unit:\n\n- **Room 1:** Kinetic Energy (KE = ½mv²)\n- **Room 2:** Gravitational PE (GPE = mgh)\n- **Room 3:** Conservation of Energy (v = √(2gh))\n- **Room 4:** Work (W = Fd)\n- **Room 5:** Power (P = W/t)\n\nSolve each room's puzzle to earn a code digit. All 5 digits unlock the exit. You can retry for a better score — only your highest is kept.\n\n**Scoring:** 20 points per room. Hints cost 5 points. Wrong answers cost 5 points.",
  },

  // ─── ESCAPE ROOM EMBED ─────────────────────────────────

  {
    id: "escape-room-embed", type: "embed",
    url: "https://energy-escape-room-paps.web.app",
    caption: "Energy Escape Room",
    height: 750,
    scored: true,
  },

  // ─── FORMULA REFERENCE ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📋",
    title: "Formula Reference",
    subtitle: "Use these while working through the escape room",
  },

  {
    id: uid(), type: "text",
    content: "| Formula | What it calculates | Variables |\n|---|---|---|\n| **KE = ½mv²** | Kinetic energy | m = mass (kg), v = velocity (m/s) |\n| **GPE = mgh** | Gravitational potential energy | m = mass (kg), g = 9.8 m/s², h = height (m) |\n| **v = √(2gh)** | Speed from height (no friction) | g = 9.8 m/s², h = height fallen (m) |\n| **W = Fd** | Work | F = force (N), d = distance (m) |\n| **P = W/t** | Power | W = work (J), t = time (s) |\n| **P = Fv** | Power (constant speed) | F = force (N), v = velocity (m/s) |",
  },

  // ─── REFLECTION ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "After the Escape Room",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "question",
    questionType: "short_answer",
    prompt: "Which room was hardest for you? What formula or concept do you need to review before the unit test? Be specific — 'I need to study energy' is not helpful. 'I keep mixing up when to use P = W/t vs P = Fv' is.",
    difficulty: "evaluate",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("energy-review-escape-room");

  const data = {
    title: "Energy Review: Escape Room",
    questionOfTheDay: "Can you escape? Solve 5 energy puzzles — one from each topic in the unit — to crack the exit code.",
    course: "Physics",
    unit: "Energy",
    order: 9,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded successfully!`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Path:  courses/${COURSE_ID}/lessons/energy-review-escape-room`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Order:  ${data.order}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/energy-review-escape-room`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
