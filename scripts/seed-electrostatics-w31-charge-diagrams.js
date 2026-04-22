// seed-electrostatics-w31-charge-diagrams.js
// Electrostatics — Week 31, Lesson 5 (Wednesday 4/22, 42 min)
// ISLE: Applying the Atomic Model — Transfer + Charge Diagrams
// Mirrors the "Electrostatics This Week" deck (S1–S9): Bridge → Warm-up →
// Which particle transfers → Electrons reveal → Charge Diagrams → Sweater+Balloon
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
  title: "Charge Diagrams — Applying the Atomic Model",
  questionOfTheDay: "When we rub two things together, what actually moves between them?",
  course: "Physics",
  unit: "Electrostatics",
  order: 5,
  visible: false,
  dueDate: "2026-04-22",
  gradesReleased: true,
  blocks: [
    {
      id: "w31cd-sec-welcome",
      type: "section_header",
      icon: "⚡",
      title: "Today: Applying the Atomic Model",
      subtitle: "~2 min · Slides 1–2"
    },
    {
      id: "w31cd-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When we rub two things together, what actually moves between them?"
    },
    {
      id: "w31cd-embed-deck",
      type: "embed",
      url: "https://pantherlearn.com/tools/electrostatics-applying-atomic-model.html",
      caption: "Slide deck for today — advance alongside each section below (arrow keys or on-screen arrows).",
      height: 680,
      scored: false
    },
    {
      id: "w31cd-text-bridge",
      type: "text",
      content: "Over the last two blocks you built two things:\n\n- An **atomic model** — nucleus with protons and neutrons; electrons outside.\n- A **pattern** — rubbed objects attract and repel in predictable ways.\n\nToday we **test the model** against what you saw. By the end of class you'll have a new tool — the *charge diagram* — that can explain the sweater-and-balloon trick from the inside out."
    },
    {
      id: "w31cd-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "How to tell an atom, a +ion, and a −ion apart — and find the mass number of each",
        "Which particle actually transfers when two objects are rubbed (and why it has to be that one)",
        "How to draw a charge diagram for a whole system — before and after rubbing"
      ]
    },

    {
      id: "w31cd-sec-warmup",
      type: "section_header",
      icon: "🔍",
      title: "Warm-Up — Atom, +Ion, or −Ion?",
      subtitle: "~7 min · Slides 3–4"
    },
    {
      id: "w31cd-text-warmup",
      type: "text",
      content: "Four atomic models are on the board (A, B, C, D). Red = proton, gray = neutron, small blue = electron. For each one, decide: **atom, +ion, or −ion** — and find its **mass number**.\n\nWrite your group's answers on your whiteboard. Defend each call to the group next to you before we reveal."
    },
    {
      id: "w31cd-q-warmup-a",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Model A** has 3 protons, 4 neutrons, and 3 electrons. What is it, and what is its mass number?",
      options: [
        "+Ion, mass number 7",
        "Atom, mass number 7",
        "−Ion, mass number 7",
        "Atom, mass number 10"
      ],
      correctIndex: 1,
      explanation: "Equal protons (3) and electrons (3) → **neutral atom**. Mass number = protons + neutrons = 3 + 4 = **7**.",
      difficulty: "apply"
    },
    {
      id: "w31cd-q-warmup-b",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Model B** has 3 protons, 2 neutrons, and 1 electron. What is it, and what is its mass number?",
      options: [
        "−Ion, mass number 5",
        "Atom, mass number 5",
        "+Ion, mass number 5",
        "+Ion, mass number 6"
      ],
      correctIndex: 2,
      explanation: "More protons (3) than electrons (1) → **+ion** (missing 2 electrons). Mass number = 3 + 2 = **5**. Notice: protons never changed — only the electron count did.",
      difficulty: "apply"
    },
    {
      id: "w31cd-q-warmup-c",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Model C** has 1 proton, 2 neutrons, and 2 electrons. What is it, and what is its mass number?",
      options: [
        "+Ion, mass number 3",
        "Atom, mass number 3",
        "−Ion, mass number 2",
        "−Ion, mass number 3"
      ],
      correctIndex: 3,
      explanation: "More electrons (2) than protons (1) → **−ion**. Mass number = 1 + 2 = **3**.",
      difficulty: "apply"
    },
    {
      id: "w31cd-q-warmup-d",
      type: "question",
      questionType: "multiple_choice",
      prompt: "**Model D** has 5 protons, 7 neutrons, and 7 electrons. What is it, and what is its mass number?",
      options: [
        "Atom, mass number 12",
        "−Ion, mass number 12",
        "+Ion, mass number 12",
        "−Ion, mass number 14"
      ],
      correctIndex: 1,
      explanation: "More electrons (7) than protons (5) → **−ion** (gained 2 electrons). Mass number = protons + neutrons = 5 + 7 = **12**. Electrons don't count toward mass number.",
      difficulty: "apply"
    },
    {
      id: "w31cd-callout-reflect-ion",
      type: "callout",
      style: "insight",
      icon: "🧠",
      content: "An ion isn't a broken atom — it's an atom with an **imbalance**. The **protons never changed**. The only thing that can change to make an ion is the **electron count**."
    },

    {
      id: "w31cd-sec-transfer",
      type: "section_header",
      icon: "🎯",
      title: "Commit — Which Particle Transfers?",
      subtitle: "~4 min · Slides 5–6"
    },
    {
      id: "w31cd-text-transfer",
      type: "text",
      content: "When we rub two materials together and one becomes **positive** while the other becomes **negative**, *something* has to move between them.\n\nThree candidates: **proton**, **neutron**, **electron**. Before I reveal the answer — which one is it, and *why*?"
    },
    {
      id: "w31cd-q-transfer",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which particle transfers between two objects when they are rubbed together?",
      options: [
        "Protons — they're the positive charge, so they must be what moves.",
        "Neutrons — they're neutral and easy to knock loose.",
        "Electrons — they live outside the nucleus and aren't locked down.",
        "All three transfer in roughly equal numbers."
      ],
      correctIndex: 2,
      explanation: "Protons and neutrons are **locked in the nucleus**. Electrons live *outside* — the only particles that can be knocked loose by rubbing. If protons could transfer, rubbing would turn carbon into nitrogen (transmute elements) — we've never seen that. If neutrons could transfer, rubbing would make objects radioactive — nobody observes that either. **Electrons are the only mobile piece.**",
      difficulty: "analyze"
    },
    {
      id: "w31cd-callout-counterfactual",
      type: "callout",
      style: "warning",
      icon: "🚫",
      content: "**If protons could transfer:** rubbing pencil lead on your sleeve would turn carbon into nitrogen. Elements would shift on the periodic table. **If neutrons could transfer:** coins would become radioactive from handling. Neither happens. Electrons are the only particle whose transfer doesn't rewrite the periodic table — that's not a guess, it's what the evidence *forces* on us."
    },

    {
      id: "w31cd-sec-cd",
      type: "section_header",
      icon: "📊",
      title: "Charge Diagrams — Zoom Out",
      subtitle: "~6 min · Slide 7"
    },
    {
      id: "w31cd-text-cd-intro",
      type: "text",
      content: "So far you've drawn **single atoms**. A **charge diagram** zooms out to show a whole *system*. Draw a box for the object. Inside, draw a *sample* of its atoms and ions.\n\nThree symbols, nothing else:\n\n- **A** = neutral atom\n- **+** = +ion (atom that lost an electron)\n- **−** = −ion (atom that gained an electron)\n\nA **neutral system** has only atoms (or equal + and −). A **charged system** has an excess of one kind of ion."
    },
    {
      id: "w31cd-img-legend",
      type: "image",
      url: `${IMG}/w31-cd-legend.png`,
      caption: "Charge diagram notation — three symbols, nothing else.",
      alt: "Legend showing three symbols: a gray circle labeled atom, a blue circle labeled negative ion, and a red circle labeled positive ion"
    },
    {
      id: "w31cd-img-ab",
      type: "image",
      url: `${IMG}/w31-cd-system-ab.png`,
      caption: "Two systems after being rubbed against each other. System A has extra −ions; System B has extra +ions.",
      alt: "Two rectangular regions side by side. System A contains mostly atoms with some negative ions. System B contains mostly atoms with some positive ions"
    },
    {
      id: "w31cd-q-read-system",
      type: "question",
      questionType: "short_answer",
      prompt: "Looking at the two charge diagrams above: what is true about System A? What is true about System B? List at least **3 facts for each** (count atoms / +ions / −ions, and state the overall charge).",
      placeholder: "System A: ___ atoms, ___ negative ions, ___ positive ions. Overall charge is...\nSystem B: ...",
      difficulty: "analyze"
    },
    {
      id: "w31cd-q-mass",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When System A and System B were rubbed together and charged up, what happened to their **mass**?",
      options: [
        "Both systems' masses stayed the same. Rubbing moves electrons between them, but the electrons still exist — mass is conserved.",
        "System A's mass increased because it gained −ions. System B's mass decreased because it lost them.",
        "System A's mass decreased because it lost atoms. System B's mass increased because it gained them.",
        "Both systems lost mass because rubbing generates heat, which reduces mass."
      ],
      correctIndex: 0,
      explanation: "Rubbing moves **electrons** from one system to the other, but electrons still exist — they just moved. Mass is conserved. The atom-that-lost-an-electron and the atom-that-gained-one are both still counted; nothing disappeared.",
      difficulty: "analyze"
    },

    {
      id: "w31cd-sec-sweater",
      type: "section_header",
      icon: "🎈",
      title: "Whiteboard Task — Sweater & Balloon",
      subtitle: "~10 min · Slides 8–9"
    },
    {
      id: "w31cd-text-sweater-prompt",
      type: "text",
      content: "On your group's 2×4 ft whiteboard, draw **four charge diagrams** — one box each:\n\n1. **Sweater before** rubbing\n2. **Sweater after** rubbing\n3. **Balloon before** rubbing\n4. **Balloon after** rubbing\n\nThen use your diagrams to **explain the attraction** between sweater and balloon after rubbing. You have 5 minutes. Every group diagram gets photographed at the end."
    },
    {
      id: "w31cd-evidence-diagram",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Sweater & Balloon (Before/After)",
      instructions: "Photograph your group's four charge diagrams (sweater before/after, balloon before/after). Upload a clear photo.",
      reflectionPrompt: "How many +ions did you draw on the sweater? How many −ions on the balloon? What rule did you use to decide?"
    },
    {
      id: "w31cd-q-sweater-explain",
      type: "question",
      questionType: "short_answer",
      prompt: "Use your diagrams to **explain**: why don't the sweater and balloon interact *before* rubbing, but they **attract** *after* rubbing? Use the words *atoms*, *+ions*, *−ions*, *attract*, and *electrons* in your answer.",
      placeholder: "Before rubbing, both objects contain only neutral atoms, so... After rubbing, electrons moved from ___ to ___. The sweater now has extra ___ and the balloon has extra ___. These opposite excesses...",
      difficulty: "analyze"
    },
    {
      id: "w31cd-callout-reveal",
      type: "callout",
      style: "insight",
      icon: "🔍",
      content: "**The reveal:** electrons moved from the sweater to the balloon. The sweater's proton count never changed — it just lost some electrons, so it's now net **+**. The balloon gained those same electrons, so it's now net **−**. *Opposite charges attract* — and the only thing that moved was a handful of electrons."
    },

    {
      id: "w31cd-sec-wrap",
      type: "section_header",
      icon: "🔮",
      title: "Wrap Up — A Puzzle for Tomorrow",
      subtitle: "~2 min · Slide 10"
    },
    {
      id: "w31cd-callout-wrap",
      type: "callout",
      style: "insight",
      icon: "🧩",
      content: "A charged balloon **attracts** a piece of *unrubbed* paper. The paper hasn't gained or lost any electrons. It's *neutral*. **So why does it move?** Think on that tonight — your current model (electrons transferring between objects) isn't going to cut it. Tomorrow we'll find the tool that does."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w31-charge-diagrams", lesson);
    console.log("✅ Lesson 5 seeded: Charge Diagrams — Applying the Atomic Model");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
