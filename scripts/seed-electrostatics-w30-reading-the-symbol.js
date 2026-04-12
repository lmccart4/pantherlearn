// seed-electrostatics-w30-reading-the-symbol.js
// Electrostatics — Week 30, Lesson 2 (Thursday single period, ~42 min)
// Discovery pedagogy: PhET Build an Atom — Symbol level
// Covers slide-deck Tasks 13-19 (element identity, proton count, neutron count).
// Run: node scripts/seed-electrostatics-w30-reading-the-symbol.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Reading the Atomic Symbol",
  questionOfTheDay: "If two atoms have the same number of protons but different numbers of neutrons, are they the same element? Are they the same atom?",
  course: "Physics",
  unit: "Electrostatics",
  order: 2,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // RECAP & HOOK
    // ═══════════════════════════════════════════
    {
      id: "section-recap",
      type: "section_header",
      icon: "🔁",
      title: "Where We Left Off",
      subtitle: "~3 min"
    },
    {
      id: "callout-recap",
      type: "callout",
      style: "insight",
      icon: "🧠",
      content: "On Tuesday you figured out two big rules from the *Atom* level of the sim:\n\n- An atom is **stable** based on its balance of protons and neutrons in the nucleus.\n- An atom is **+ion**, **−ion**, or **neutral** based on the balance of protons and electrons.\n\nToday we level up. Chemists don't carry around tiny diagrams of atoms — they carry **symbols**. We're going to crack the code on what those symbols mean."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If two atoms have the same number of protons but different numbers of neutrons, are they the same element? Are they the same atom?"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "What You'll Discover Today",
      items: [
        "What makes an atom one element vs. another",
        "How to read the **proton count** from a chemical symbol",
        "How to read the **neutron count** from a chemical symbol"
      ]
    },

    // ═══════════════════════════════════════════
    // TASK 13 — SWITCH TO SYMBOL MODE
    // ═══════════════════════════════════════════
    {
      id: "section-task13",
      type: "section_header",
      icon: "🔣",
      title: "Task 13 — Switch to Symbol Mode",
      subtitle: "~3 min"
    },
    {
      id: "link-phet-build-atom",
      type: "external_link",
      title: "Re-open: Build an Atom (PhET)",
      description: "Same sim as Tuesday. This time, click the **Symbol** tile at the bottom center of the screen.",
      url: "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html",
      buttonLabel: "Launch Build an Atom"
    },
    {
      id: "img-symbol-li",
      type: "image",
      url: `${IMG}/phet-symbol-li.png`,
      caption: "Symbol mode shows you a chemistry-style symbol like this one. Your job is to figure out what every number means.",
      alt: "Lithium symbol in PhET — Li with 7 in the upper-left, 1+ in the upper-right, 3 in the lower-left"
    },

    // ═══════════════════════════════════════════
    // TASK 14 — ELEMENT PATTERN
    // ═══════════════════════════════════════════
    {
      id: "section-task14",
      type: "section_header",
      icon: "🧪",
      title: "Task 14 — What Makes an Element?",
      subtitle: "~6 min"
    },
    {
      id: "callout-element-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Build different atoms and watch the letter symbol change (H, He, Li, Be...). Keep going until you can answer: **What determines which element an atom is?**"
    },
    {
      id: "q-task14-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "Explain the pattern you found. **What single thing** about an atom decides which element it is? Use specific examples from the sim.",
      placeholder: "An atom becomes a different element when... I figured this out by...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 15 — EVIDENCE
    // ═══════════════════════════════════════════
    {
      id: "section-task15",
      type: "section_header",
      icon: "📸",
      title: "Task 15 — Prove Your Rule",
      subtitle: "~4 min"
    },
    {
      id: "evidence-element",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 3 Screenshots — Element Rule",
      instructions: "Take **3 screenshots** of different atoms that follow your element rule. Try to choose three *different* elements.",
      reflectionPrompt: "For each screenshot, write one sentence: \"This is element ___ because it has ___ protons.\""
    },

    // ═══════════════════════════════════════════
    // TASK 16 — PROTONS FROM THE SYMBOL
    // ═══════════════════════════════════════════
    {
      id: "section-task16",
      type: "section_header",
      icon: "🔢",
      title: "Task 16 — Reading Protons from the Symbol",
      subtitle: "~6 min"
    },
    {
      id: "img-h-example",
      type: "image",
      url: `${IMG}/phet-h-example.png`,
      caption: "An example symbol the sim might show you. Four numbers around one letter — what does each one mean?",
      alt: "A hydrogen symbol H with multiple numbers around it: a 2 in the upper left, a 4- in the upper right, a 1 in the lower left"
    },
    {
      id: "callout-proton-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Look at the four numbers around the letter. One of them tells you the **proton count**. Which one? How can you tell?"
    },
    {
      id: "q-task16-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "Which number around the symbol tells you how many **protons** the atom has? Where is it (top-left, top-right, bottom-left, bottom-right)? How did you figure that out?",
      placeholder: "The proton number is the one in the ___. I know because when I added a proton in the sim, that number...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 17 — EVIDENCE
    // ═══════════════════════════════════════════
    {
      id: "section-task17",
      type: "section_header",
      icon: "📸",
      title: "Task 17 — Prove It",
      subtitle: "~3 min"
    },
    {
      id: "evidence-protons",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 2 Screenshots — Proton Rule",
      instructions: "Take **2 screenshots** of different atoms that follow your proton rule. Pick atoms with *different* proton counts to make the pattern obvious.",
      reflectionPrompt: "For each screenshot, write: \"This atom has ___ protons because the number in the ___ is ___.\""
    },

    // ═══════════════════════════════════════════
    // TASK 18 — NEUTRONS FROM THE SYMBOL
    // ═══════════════════════════════════════════
    {
      id: "section-task18",
      type: "section_header",
      icon: "⚪",
      title: "Task 18 — Reading Neutrons from the Symbol",
      subtitle: "~7 min"
    },
    {
      id: "callout-neutron-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Now do the same hunt for **neutrons**. None of the numbers shows the neutron count *directly* — but you can still find it. Hint: try changing only the neutrons and see which numbers respond."
    },
    {
      id: "q-task18-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "How can you figure out the **neutron** count of an atom by looking at its symbol? Walk through your reasoning. (You may need to combine two numbers, not just read one.)",
      placeholder: "Neutrons = ___ minus ___. I figured this out because when I added a neutron, only the ___ number went up.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 19 — EVIDENCE
    // ═══════════════════════════════════════════
    {
      id: "section-task19",
      type: "section_header",
      icon: "📸",
      title: "Task 19 — Prove It",
      subtitle: "~5 min"
    },
    {
      id: "evidence-neutrons",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 2 Screenshots — Neutron Rule",
      instructions: "Take **2 screenshots** of atoms that follow your neutron rule. Pick atoms where the math is easy to see — for example, one with very few neutrons and one with several.",
      reflectionPrompt: "For each screenshot, do the math out loud: \"This atom has ___ neutrons because ___ minus ___ equals ___.\""
    },

    // ═══════════════════════════════════════════
    // EXIT TICKET
    // ═══════════════════════════════════════════
    {
      id: "section-exit",
      type: "section_header",
      icon: "🚪",
      title: "Exit Ticket",
      subtitle: "~5 min"
    },
    {
      id: "q-exit-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An atom has the symbol **C** with a *6* in the lower-left and a *14* in the upper-left. How many neutrons does it have?",
      options: [
        "6 neutrons",
        "20 neutrons",
        "8 neutrons",
        "14 neutrons"
      ],
      correctIndex: 2,
      explanation: "The lower-left number (6) is the **proton count**. The upper-left number (14) is the **mass number** = protons + neutrons. So neutrons = 14 − 6 = **8**.",
      difficulty: "apply"
    },
    {
      id: "q-exit-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "In **one sentence**, what is the most important thing you learned today about atomic symbols?",
      placeholder: "The most important thing I learned is...",
      difficulty: "analyze"
    }

  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w30-reading-the-symbol", lesson);
    console.log("✅ Lesson 2 seeded: Reading the Atomic Symbol");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}
seed();
