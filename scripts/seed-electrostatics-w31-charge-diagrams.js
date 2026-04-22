// seed-electrostatics-w31-charge-diagrams.js
// Electrostatics — Week 31, Lesson 5 (Wednesday 4/22, 42 min)
// Pattern synthesis → charge diagrams as formal notation + mass conservation
// Models W31 Task 24 + W32 Tasks 1-2, 6-7
// Run: node scripts/seed-electrostatics-w31-charge-diagrams.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Charge Diagrams — Drawing What You Can't See",
  questionOfTheDay: "How do scientists draw something they can't see?",
  course: "Physics",
  unit: "Electrostatics",
  order: 5,
  visible: false,
  dueDate: "2026-04-22",
  blocks: [
    {
      id: "w31cd-sec-welcome",
      type: "section_header",
      icon: "✏️",
      title: "Today: Charge Diagrams",
      subtitle: "~2 min"
    },
    {
      id: "w31cd-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** How do scientists draw something they can't see?"
    },
    {
      id: "w31cd-text-intro",
      type: "text",
      content: "Over the last two blocks you've built a mental list of patterns — rubbed objects attract, same-rubbed repel, metals respond more dramatically than plastic. Today we need a **tool** for keeping track of those rules without writing paragraphs.\n\nThat tool is the **charge diagram** — a simple picture that shows where atoms, +ions, and −ions live inside an object. Once you can draw one, you can predict *any* interaction between *any* two objects."
    },
    {
      id: "w31cd-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "How to read a charge diagram — atom, +ion, and −ion notation",
        "Why rubbing doesn't change an object's mass (even though it changes its charge)",
        "How to draw a charge diagram for any rubbed pair of objects"
      ]
    },

    {
      id: "w31cd-sec-task1",
      type: "section_header",
      icon: "📖",
      title: "Task 1 — Read a Charge Diagram",
      subtitle: "~6 min"
    },
    {
      id: "w31cd-img-legend",
      type: "image",
      url: `${IMG}/w31-cd-legend.png`,
      caption: "Charge diagram notation — three kinds of dots, nothing else.",
      alt: "Legend showing three symbols: a gray circle labeled atom, a blue circle labeled negative ion, and a red circle labeled positive ion"
    },
    {
      id: "w31cd-img-ab",
      type: "image",
      url: `${IMG}/w31-cd-system-ab.png`,
      caption: "Two systems that started neutral, then were rubbed against each other.",
      alt: "Two rectangular regions side by side. System A is filled with mostly atoms and some negative ions. System B is filled with mostly atoms and some positive ions"
    },
    {
      id: "w31cd-q-read",
      type: "question",
      questionType: "short_answer",
      prompt: "Looking at the two charge diagrams: **what is true about System A? What is true about System B?** List at least 3 facts for each system.",
      placeholder: "System A: ___ atoms, ___ negative ions, ___ positive ions. Overall charge is...\nSystem B: ...",
      difficulty: "analyze"
    },

    {
      id: "w31cd-sec-task2",
      type: "section_header",
      icon: "⚖️",
      title: "Task 2 — Did the Mass Change?",
      subtitle: "~5 min"
    },
    {
      id: "w31cd-text-mass",
      type: "text",
      content: "Three students disagree about what happened to System A and System B's **mass** when they were charged up by rubbing. Which one is right?"
    },
    {
      id: "w31cd-q-mass",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When System A and System B were rubbed together and charged up, what happened to their mass?",
      options: [
        "System A's mass stayed the same, and System B's mass stayed the same. The process of charging doesn't change mass.",
        "System A's mass increased because it gained −ions. System B's mass decreased because it lost them.",
        "System A's mass decreased because it lost atoms. System B's mass increased because it gained them.",
        "Both systems lost mass because rubbing generates heat, which reduces mass."
      ],
      correctIndex: 0,
      explanation: "Rubbing moves **electrons** from one system to the other, but electrons still exist — they just moved. Mass is conserved. The atom-that-lost-an-electron and the atom-that-gained-one are both counted somewhere; nothing disappeared.",
      difficulty: "analyze"
    },

    {
      id: "w31cd-sec-task3",
      type: "section_header",
      icon: "🔍",
      title: "Task 3 — Reading Each Symbol",
      subtitle: "~6 min"
    },
    {
      id: "w31cd-callout-locations",
      type: "callout",
      style: "insight",
      icon: "🧠",
      content: "Look carefully at the charge diagram. **Where** in the system are the atoms located? Where are the −ions? Where are the +ions? Is there a pattern to where each type ends up, or are they scattered randomly?"
    },
    {
      id: "w31cd-q-locations",
      type: "question",
      questionType: "short_answer",
      prompt: "For System A in the diagram: describe **where** atoms live, where −ions live, and where +ions live. Use words like *edge*, *interior*, *top*, *bottom*, or *scattered evenly*.",
      placeholder: "Atoms in System A are located... −ions in System A are located... +ions in System A are located...",
      difficulty: "analyze"
    },

    {
      id: "w31cd-sec-task4",
      type: "section_header",
      icon: "🧩",
      title: "Task 4 — Use the Diagram to Explain the Interaction",
      subtitle: "~9 min"
    },
    {
      id: "w31cd-img-prepost",
      type: "image",
      url: `${IMG}/w31-cd-prepost.png`,
      caption: "Initial state: both neutral. Final state: after rubbing, A has extra −ions, B has extra +ions.",
      alt: "Two charge diagrams side by side. Left panel labeled Initial State shows a sweater and balloon both with only atoms. Right panel labeled Final State shows the sweater with atoms and positive ions, and the balloon with atoms and negative ions"
    },
    {
      id: "w31cd-q-prepost",
      type: "question",
      questionType: "short_answer",
      prompt: "Use these two diagrams to **explain**: why don't the sweater and balloon interact *before* rubbing, but they **attract** after rubbing? Use the words *atoms*, *+ions*, *−ions*, *attract*, and *repel* in your answer.",
      placeholder: "Before rubbing, both systems contain only neutral atoms, so... After rubbing, the sweater contains ___ and the balloon contains ___. These opposite excesses...",
      difficulty: "analyze"
    },
    {
      id: "w31cd-evidence-diagram",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Your Pre/Post Charge Diagram",
      instructions: "Using the legend (atom, +ion, −ion), draw a charge diagram on your whiteboard for **any one of yesterday's station experiments** — initial state and final state. Take a clear photo.",
      reflectionPrompt: "What rule did you use to decide how many +ions to draw on one object vs. how many −ions on the other?"
    },

    {
      id: "w31cd-sec-wrap",
      type: "section_header",
      icon: "🔁",
      title: "Wrap Up",
      subtitle: "~2 min"
    },
    {
      id: "w31cd-callout-wrap",
      type: "callout",
      style: "insight",
      icon: "🔮",
      content: "Big question for tomorrow: **when you rub two objects, what actually moves between them?** Is it +ions? −ions? Atoms? All three? Some of them? Think on that tonight — you'll figure out the answer in ~15 minutes tomorrow."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w31-charge-diagrams", lesson);
    console.log("✅ Lesson 5 seeded: Charge Diagrams");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
