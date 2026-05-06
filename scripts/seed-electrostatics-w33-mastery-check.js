// seed-electrostatics-w33-mastery-check.js
// Electrostatics — Week 33, Wed 5/6 (42 min, P1)
// Single-question mastery check: design an experiment to determine
// the unknown sign of a charged electroscope using charge diagrams.
// Run: node scripts/seed-electrostatics-w33-mastery-check.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electrostatics Mastery Check",
  questionOfTheDay: "An electroscope holds an unknown charge. With only a balloon, fur, and plastic, can you design an experiment that reveals its sign?",
  course: "Physics",
  unit: "Electrostatics",
  order: 10,
  visible: false,
  dueDate: "2026-05-06",
  gradesReleased: true,
  blocks: [
    {
      id: "w33mc-sec-welcome",
      type: "section_header",
      icon: "🎯",
      title: "Today: Show What You Know",
      subtitle: "Single-question mastery assessment"
    },
    {
      id: "w33mc-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** An electroscope holds an unknown charge. With only a balloon, fur, and plastic, can you design an experiment that reveals its sign?"
    },
    {
      id: "w33mc-text-intro",
      type: "text",
      content: "This is the close-out of the electrostatics unit. One assessment question — but a meaty one. You'll use the diagramming tool below to design your experiment, draw the charge diagrams, and write your defense.\n\n**The challenge:** an electroscope sits in front of you with some unknown charge. You have three tools: a balloon, a piece of fur, and a plastic (PVC) rod. Design an experiment that will tell you whether the electroscope is positively or negatively charged. Use **charge diagrams** (atoms, +ions, −ions) and a **written explanation** to defend your design."
    },
    {
      id: "w33mc-objectives",
      type: "objectives",
      title: "What You're Showing Today",
      items: [
        "Designing an experiment that produces a sign-revealing observation (attraction vs. repulsion, leaf collapse vs. spread)",
        "Drawing accurate Initial-State and Final-State charge diagrams using atoms, +ions, and −ions",
        "Naming the charging mechanism behind your experiment (friction, conduction, induction, polarization)",
        "Writing a clear atomic-model explanation of why your design proves the sign"
      ]
    },
    {
      id: "w33mc-callout-rules",
      type: "callout",
      style: "warning",
      icon: "⏱️",
      content: "**Rules:**\n\n1. **Whiteboards only** — no notes, no Internet, no neighbor.\n2. **Diagram every state.** Initial State (before the test) and Final State (after) for both the *positive* and *negative* possibilities — that's 4 panels total.\n3. **Track every charge.** Use atoms (neutral), +ions (lost an electron), and −ions (gained an electron). Account for everything.\n4. **Pick a mechanism.** Friction, conduction, induction, or polarization — defend your choice in your written explanation.\n5. **When you're done**, click **Submit My Answer** at the bottom of the explanation panel."
    },
    {
      id: "w33mc-sec-assessment",
      type: "section_header",
      icon: "📝",
      title: "The Assessment",
      subtitle: "Diagram + written explanation"
    },
    {
      id: "w33mc-embed-assessment",
      type: "embed",
      url: "https://pantherlearn.com/tools/electrostatics-mastery-assessment.html",
      caption: "Drag atoms, +ions, and −ions into the four electroscope panels. Type your written explanation in the panel on the right. Click Submit My Answer when finished.",
      height: 900,
      scored: true,
      weight: 5
    },
    {
      id: "w33mc-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🧲",
      content: "**Coming up:** Magnetism. Same atomic model — but a brand new force, with a twist that has nothing to do with charge transfer."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w33-mastery-check", lesson);
    console.log("✅ Lesson seeded: Electrostatics Mastery Check (Wed 5/6)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
