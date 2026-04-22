// seed-electrostatics-w32-why-electrons.js
// Electrostatics — Week 32, Lesson 6 (Thursday 4/23, 42 min)
// Microscopic atomic model: why electrons move (not protons) + polarization of neutral objects
// Models W32 Tasks 3-5 + 10-11 (skipping Honors cloud model 8-9)
// Run: node scripts/seed-electrostatics-w32-why-electrons.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Why Electrons? (And Why Neutral Stuff Still Attracts)",
  questionOfTheDay: "When you rub two objects together, what actually moves between them — and why only that?",
  course: "Physics",
  unit: "Electrostatics",
  order: 6,
  visible: false,
  dueDate: "2026-04-23",
  blocks: [
    {
      id: "w32we-sec-welcome",
      type: "section_header",
      icon: "🔬",
      title: "Today: Zoom Into the Atom",
      subtitle: "~2 min"
    },
    {
      id: "w32we-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When you rub two objects together, what actually moves between them — and why only that?"
    },
    {
      id: "w32we-text-intro",
      type: "text",
      content: "You've been saying \"electrons move from one system to another\" since Monday. Today you prove it — with physics, not with a textbook telling you so.\n\nYou also answer a question that's been sitting under the surface: **why does a charged balloon stick to a neutral wall?** The wall has no extra charges. It shouldn't feel anything... right?"
    },
    {
      id: "w32we-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "That electrons are the particles that move during rubbing (protons and neutrons stay put)",
        "Why — using mass — this has to be the case",
        "How a charged object can attract a neutral object that has no excess charge at all"
      ]
    },

    {
      id: "w32we-sec-task1",
      type: "section_header",
      icon: "✏️",
      title: "Task 1 — Sketch Before Rubbing",
      subtitle: "~5 min"
    },
    {
      id: "w32we-img-h-prerub",
      type: "image",
      url: `${IMG}/w32-h-atoms-prerub.png`,
      caption: "Before rubbing: both sweater and balloon are neutral. Each atom has a balanced number of protons and electrons.",
      alt: "Two hydrogen-like atom models labeled Sweater Atom and Balloon Atom. Each shows a single proton at center (plus neutron) and one electron orbiting"
    },
    {
      id: "w32we-text-task1",
      type: "text",
      content: "On your whiteboard, sketch a **sweater atom** and a **balloon atom** side by side, before they've touched. Use the simple hydrogen model: one proton (+), one neutron (neutral), one electron (−). Label every particle."
    },
    {
      id: "w32we-q-task1",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe what you drew. How many protons, neutrons, and electrons are in each atom? What is the overall charge of each atom?",
      placeholder: "Each atom has ___ proton(s), ___ neutron(s), and ___ electron(s). Overall charge: ___",
      difficulty: "recall"
    },

    {
      id: "w32we-sec-task2",
      type: "section_header",
      icon: "🔄",
      title: "Task 2 — Sketch After Rubbing",
      subtitle: "~6 min"
    },
    {
      id: "w32we-img-h-postrub",
      type: "image",
      url: `${IMG}/w32-h-atoms-postrub.png`,
      caption: "After rubbing, the sweater atom is now a +ion, and the balloon atom is now a −ion. One particle moved between them.",
      alt: "Two atom models after rubbing. Left atom labeled Sweater +Ion has one proton and no electron. Right atom labeled Balloon -Ion has one proton and two electrons. An arrow shows an electron moving from sweater to balloon"
    },
    {
      id: "w32we-text-task2",
      type: "text",
      content: "After rubbing, the sweater is a **+ion** and the balloon is a **−ion**. On your whiteboard, re-draw both atoms in their new states. Then answer: **which particle had to move, and in which direction?**"
    },
    {
      id: "w32we-q-task2",
      type: "question",
      questionType: "short_answer",
      prompt: "Which particle moved from one atom to the other? In which direction (sweater → balloon, or balloon → sweater)? How do you know?",
      placeholder: "A ___ moved from ___ to ___. I know because after rubbing, the sweater has ___ and the balloon has ___.",
      difficulty: "analyze"
    },

    {
      id: "w32we-sec-task3",
      type: "section_header",
      icon: "⚖️",
      title: "Task 3 — Why Electrons, Not Protons?",
      subtitle: "~6 min"
    },
    {
      id: "w32we-img-mass",
      type: "image",
      url: `${IMG}/w32-mass-ratio.png`,
      caption: "The electron is about 1,836 times lighter than a proton or neutron. Moving one is like sliding a paperclip; moving the other is like shoving a minivan.",
      alt: "A scale comparison showing a small dot labeled electron with mass 9.11 x 10^-31 kg next to a much larger dot labeled proton with mass 1.67 x 10^-27 kg"
    },
    {
      id: "w32we-callout-masses",
      type: "callout",
      style: "insight",
      icon: "📊",
      content: "**Particle masses:**\n- proton:  $1.673 \\times 10^{-27}$ kg\n- neutron: $1.674 \\times 10^{-27}$ kg\n- electron: $9.109 \\times 10^{-31}$ kg\n\nThe proton is roughly **1,836 times heavier** than the electron. The neutron is even heavier."
    },
    {
      id: "w32we-q-why-electrons",
      type: "question",
      questionType: "short_answer",
      prompt: "Given those masses, why does it make sense that **electrons** are what moves between objects during rubbing — not protons or neutrons? Make a physics argument.",
      placeholder: "Rubbing is a gentle mechanical process. Moving a particle away from its atom takes energy. An electron is ___ times lighter than a proton, so...",
      difficulty: "analyze"
    },

    {
      id: "w32we-sec-task4",
      type: "section_header",
      icon: "🌲",
      title: "Task 4 — Polarization: The Mystery of the Wall",
      subtitle: "~8 min"
    },
    {
      id: "w32we-text-polar-intro",
      type: "text",
      content: "Rub a balloon on your hair and stick it to the wall. The wall is **neutral** — same number of +ions and −ions, overall charge zero. It has nothing to attract with. So why does the balloon stick?"
    },
    {
      id: "w32we-img-wood-initial",
      type: "image",
      url: `${IMG}/w32-wood-polarization-initial.png`,
      caption: "Initial state: a neutral wooden block, far from anything else.",
      alt: "A rectangular wooden block drawn as a charge diagram with atoms scattered evenly throughout, no net charge"
    },
    {
      id: "w32we-img-wood-final",
      type: "image",
      url: `${IMG}/w32-wood-polarization-final.png`,
      caption: "Final state: a negatively charged balloon is held near the block (not touching). Inside each atom, the electron cloud shifts slightly away from the balloon.",
      alt: "The same wooden block, now with a balloon covered in negative ions held nearby. Inside the wooden block, the atoms have shifted slightly so negative charges are on the far side and positive charges are on the near side"
    },
    {
      id: "w32we-callout-polar-rule",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "Atoms are not rigid. When a charged object comes near, the electrons inside every atom **shift slightly** — toward + charges, away from − charges. The atom stays overall neutral, but the **near side** of the object becomes *slightly* opposite to the charged object. This is called **polarization**."
    },
    {
      id: "w32we-q-polar-draw",
      type: "question",
      questionType: "short_answer",
      prompt: "On your whiteboard, re-draw the wooden block's charge diagram when the negatively charged balloon is brought near it (but not touching). Show where the \"slight +\" and \"slight −\" regions end up. Describe what you drew.",
      placeholder: "Inside the wooden block, I drew the slight + region on the ___ side (closest to the balloon) and the slight − region on the ___ side (farthest from the balloon), because electrons are repelled by the balloon's extra negatives.",
      difficulty: "create"
    },

    {
      id: "w32we-sec-task5",
      type: "section_header",
      icon: "🎯",
      title: "Task 5 — So... Attract, Repel, or Nothing?",
      subtitle: "~5 min"
    },
    {
      id: "w32we-q-attract",
      type: "question",
      questionType: "short_answer",
      prompt: "Using your polarization diagram: would the **negatively charged balloon** and the **neutral wooden block** attract, repel, or do nothing? Defend your answer with the diagram.",
      placeholder: "They will ___ because the balloon's −ions are closest to the block's slight + region, and opposite charges...",
      difficulty: "analyze"
    },
    {
      id: "w32we-evidence-polar",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Polarization Diagram",
      instructions: "Photo of your polarized-wood charge diagram with the slight + and slight − regions clearly labeled, and the charged balloon drawn nearby.",
      reflectionPrompt: "One sentence: in your own words, why does a charged balloon stick to a neutral wall?"
    },

    {
      id: "w32we-sec-wrap",
      type: "section_header",
      icon: "🔮",
      title: "Looking Ahead",
      subtitle: "~2 min"
    },
    {
      id: "w32we-callout-wrap",
      type: "callout",
      style: "insight",
      icon: "🎯",
      content: "Tomorrow's prediction: polarization works for any neutral material — wood, plastic, metal, rubber. But **not all of them polarize the same amount**. Which do you think polarizes *more* — wood or metal? Hold that thought. We'll find out with an actual experiment."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w32-why-electrons", lesson);
    console.log("✅ Lesson 6 seeded: Why Electrons + Polarization");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
