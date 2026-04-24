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
      content: "All week you've been describing charge moving between objects. Today you **prove** what actually moves — by running your own experiment in a simulation and watching it happen one particle at a time.\n\nYou'll also tackle a question that's been sitting under the surface: **why does a charged balloon stick to a neutral wall?** The wall has no extra charges. It shouldn't feel anything... right?"
    },
    {
      id: "w32we-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "Which particle inside an atom actually moves when two objects rub together",
        "Why — using mass — it has to be that particle and not the others",
        "How a charged object can attract a neutral object that has no excess charge at all"
      ]
    },

    {
      id: "w32we-sec-task1",
      type: "section_header",
      icon: "🧪",
      title: "Task 1 — Explore the Sim: Before Rubbing",
      subtitle: "~6 min"
    },
    {
      id: "w32we-link-phet",
      type: "external_link",
      icon: "🎈",
      title: "PhET — Balloons and Static Electricity",
      url: "https://phet.colorado.edu/sims/html/balloons-and-static-electricity/latest/balloons-and-static-electricity_en.html",
      description: "Use this simulation to run your own experiment for Tasks 1 and 2. Keep it open on your Chromebook — you'll come back to it.",
      buttonLabel: "Open the simulation",
      openInNewTab: true
    },
    {
      id: "w32we-text-task1",
      type: "text",
      content: "Open the simulation (button above). **Do not rub anything yet.** Look carefully at the sweater on the left and the yellow balloon on the right in their starting state.\n\nLook *inside* each one. You'll see small **+** and **−** symbols scattered across the sweater and across the balloon. These represent the charges inside their atoms.\n\nOn your whiteboard, draw a single labeled box for the sweater and a single labeled box for the balloon. Inside each box, draw exactly what you see inside the sim — the + and − charges, in the right proportion."
    },
    {
      id: "w32we-q-task1",
      type: "question",
      questionType: "short_answer",
      prompt: "Based only on what you see in the simulation **before any rubbing happens**: how many + charges and how many − charges are inside the sweater? Inside the balloon? What is the overall charge of each object, and how can you tell just by looking?",
      placeholder: "Sweater: ___ + charges and ___ − charges → overall charge ___. Balloon: ___ + charges and ___ − charges → overall charge ___. I can tell because...",
      difficulty: "analyze"
    },

    {
      id: "w32we-sec-task2",
      type: "section_header",
      icon: "🔄",
      title: "Task 2 — Explore the Sim: Rub the Balloon",
      subtitle: "~7 min"
    },
    {
      id: "w32we-text-task2",
      type: "text",
      content: "Go back to the simulation. Drag the yellow balloon onto the sweater and rub it back and forth several times. Then slowly pull the balloon away and watch carefully.\n\nLook at the balloon. Look at the sweater. **What changed? What stayed the same?** Something moved between them during the rubbing — pay close attention to which particles are now where.\n\nOn your whiteboard, re-draw your sweater box and your balloon box in their new states, matching what you see in the sim now."
    },
    {
      id: "w32we-q-task2",
      type: "question",
      questionType: "short_answer",
      prompt: "After rubbing in the sim: **which kind of particle (+ or −) actually moved**, and **from which object to which**? How do you know — what specifically did you see change on screen? (Don't just state the rule — describe the visual evidence from the sim.)",
      placeholder: "I saw that ___ moved from the ___ to the ___. I know because before rubbing the sweater had ___, and after rubbing the sweater had ___, while the balloon ...",
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
      id: "w32we-sec-conservation",
      type: "section_header",
      icon: "🔬",
      title: "Discover — Is There a Hidden Rule?",
      subtitle: "~14 min"
    },
    {
      id: "w32we-text-conserv-setup",
      type: "text",
      content: "Go back to the sim. You're going to run **three more experiments** and, as a scientist would, **record your data** as you go.\n\nFor each experiment, count the charges on **every object** in the scene, both BEFORE and AFTER rubbing:\n\n- How many + charges are on the sweater? How many −?\n- Same for the balloon (or balloons).\n- Compute each object's net charge (# of + minus # of −).\n- Compute the **system total** = sum of every object's net charge in the scene.\n\nYou're hunting for something that **stays the same** even when everything else changes. Don't skip the counts — the pattern only shows up if you write every number down."
    },
    {
      id: "w32we-q-conserv-exp1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Experiment 1** — Reset the sim. Rub the balloon on the sweater **lightly** (just a few strokes), then pull it away. Record:\n\nBEFORE — sweater (+, −, net); balloon (+, −, net); **system total**.\nAFTER — sweater (+, −, net); balloon (+, −, net); **system total**.",
      placeholder: "BEFORE — Sweater: __+, __−, net=___. Balloon: __+, __−, net=___. System total: ___.\nAFTER — Sweater: __+, __−, net=___. Balloon: __+, __−, net=___. System total: ___.",
      difficulty: "analyze"
    },
    {
      id: "w32we-q-conserv-exp2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Experiment 2** — Reset the sim. This time rub the balloon on the sweater **as many times as you can**, until the sweater runs out of electrons to give. Pull the balloon away. Record the same numbers.",
      placeholder: "BEFORE — Sweater: __+, __−, net=___. Balloon: __+, __−, net=___. System total: ___.\nAFTER — Sweater: __+, __−, net=___. Balloon: __+, __−, net=___. System total: ___.",
      difficulty: "analyze"
    },
    {
      id: "w32we-q-conserv-exp3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Experiment 3** — Reset the sim. Use the **\"Two Balloons\"** option (checkbox on the right). Rub **both balloons** on the sweater. Record the charges on the sweater and on **each** balloon. The system total now sums three objects: sweater + balloon 1 + balloon 2.",
      placeholder: "BEFORE — Sweater: net=___. Balloon 1: net=___. Balloon 2: net=___. System total: ___.\nAFTER — Sweater: net=___. Balloon 1: net=___. Balloon 2: net=___. System total: ___.",
      difficulty: "analyze"
    },
    {
      id: "w32we-q-conserv-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "**Look across all three experiments.** Compare each BEFORE and AFTER system total. What do you notice? State the pattern in your own words — and explain why it makes sense given what you learned in Tasks 1 and 2 (which particle moves, and what it's doing).",
      placeholder: "In every experiment, the system total before was ___ and after was ___. The pattern: ___. This makes sense because electrons only ___, so the total number of + and − charges in the whole scene...",
      difficulty: "analyze"
    },
    {
      id: "w32we-callout-conserv-law",
      type: "callout",
      style: "insight",
      icon: "⚡",
      content: "**Conservation of Charge — the rule you just discovered**\n\nIn an isolated system, the **total electric charge stays the same**. Charge can transfer between objects, but it can never be created or destroyed.\n\nIt doesn't matter how many objects are in play or how many electrons hop around — sum every charge in the system before, sum every charge after, and the two numbers match. Every time. At every scale, from two balloons to entire stars."
    },
    {
      id: "w32we-q-conserv-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A balloon and a sweater are both neutral. After rubbing, the balloon has a charge of −3. Using conservation of charge, what **must** be the charge of the sweater?",
      options: [
        "0 — the sweater didn't do anything",
        "+3 — so the system total stays at 0",
        "−3 — both objects end up with the same charge",
        "−6 — they both gain negative charge"
      ],
      correctIndex: 1,
      explanation: "Before rubbing, total charge = 0. For the system total to remain 0 after rubbing, the sweater must be +3 so that (+3) + (−3) = 0. Every electron the balloon gained had to come from somewhere — the sweater.",
      difficulty: "apply"
    },
    {
      id: "w32we-text-conserv-create",
      type: "text",
      content: "**Your turn — create your own conservation diagram.**\n\nPick any two objects you want (two balloons, a comb and a paper towel, a rod and a cloth — your choice). On your whiteboard:\n\n1. Draw a **BEFORE** panel. Both objects are neutral. Draw each as a box with the + and − charges inside (use the same style as the sim — matching numbers of + and −).\n2. Draw an **AFTER** panel. Move **exactly 5 electrons** from one object to the other. Redraw both boxes so the charge counts are accurate.\n3. Label the charge of each object in each panel (e.g. Object A: $0$ → $+5$).\n4. Write the **system total** under each panel.\n\nCheck: does your system total match before and after? If not, you've drawn it wrong — fix it until it matches."
    },
    {
      id: "w32we-q-conserv-describe",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the diagram you drew. What two objects did you pick? What is the charge of each **before** and **after**? What is the **system total** in each panel, and how does your diagram prove conservation of charge?",
      placeholder: "I chose ___ and ___. Before: Object A = ___, Object B = ___, system total = ___. After (moving 5 electrons from ___ to ___): Object A = ___, Object B = ___, system total = ___. This proves conservation because...",
      difficulty: "create"
    },
    {
      id: "w32we-evidence-conserv",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard — Conservation Diagram",
      instructions: "Photo of your BEFORE and AFTER charge diagrams with both objects labeled, charge counts visible, and the system total written under each panel.",
      reflectionPrompt: "In one sentence: what does the system total tell you, and why does it have to stay the same?"
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
