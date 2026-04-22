// seed-electrostatics-w31-material-matters.js
// Electrostatics — Week 31, Lesson 4 (Tuesday 4/21 double period, ~84 min)
// P1: du Fay strength predictions (moved from Mon) + Is It Magnetism?
// P2: Material Matters — 4 rotation stations (trimmed from last year's 12)
// Models W31 slides Tasks 5-11 + selected Tasks 12-23
// Run: node scripts/seed-electrostatics-w31-material-matters.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Is It Magnetism? + Material Matters",
  questionOfTheDay: "Is what we're seeing just invisible magnetism — or something different?",
  course: "Physics",
  unit: "Electrostatics",
  order: 4,
  visible: false,
  dueDate: "2026-04-21",
  blocks: [
    {
      id: "w31mm-sec-welcome",
      type: "section_header",
      icon: "🧲",
      title: "Today: Two Big Questions (Double Period)",
      subtitle: "~2 min"
    },
    {
      id: "w31mm-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Is what we're seeing just invisible magnetism — or something different?"
    },
    {
      id: "w31mm-text-intro",
      type: "text",
      content: "Today we answer two questions that have been sitting in the back of your head since the Van de Graaff:\n\n1. **Is this magnetism?** A lot of people guess yes the first time they see charge — and it's a reasonable guess. We're going to rule it in or rule it out with actual experiments.\n2. **Does the material matter?** Last block you used balloons with fur, plastic, and hair. But what if we swap the balloon itself for something made of metal? What about tin foil? Wood? Vinyl? That's where today heads in the second half."
    },
    {
      id: "w31mm-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "Whether these charge interactions are magnetic (and how you know)",
        "That which material you use changes the result in predictable ways",
        "A first hint at why metals behave differently from plastic"
      ]
    },

    {
      id: "w31mm-sec-task5",
      type: "section_header",
      icon: "💪",
      title: "Task 5 — Strength Predictions",
      subtitle: "~6 min"
    },
    {
      id: "w31mm-text-strength",
      type: "text",
      content: "Before we pivot: yesterday you built a rule for **direction** (attract vs. repel). Today let's predict **strength**. If one pair of balloons has a tiny excess and the other pair has a huge excess, the forces should be different."
    },
    {
      id: "w31mm-img-strength",
      type: "image",
      url: `${IMG}/w31-strength-pairs.png`,
      caption: "Two scenarios. Both show repulsion — but one pair should feel a stronger push than the other.",
      alt: "Two panels. Panel A: two balloons each with a small excess of negative ions. Panel B: two balloons each with a large excess of negative ions"
    },
    {
      id: "w31mm-q-strength",
      type: "question",
      questionType: "short_answer",
      prompt: "Which pair would experience a **stronger repulsive force**, A or B? Defend with excess/deficit language.",
      placeholder: "Pair ___ has a stronger repulsion because...",
      difficulty: "analyze"
    },

    {
      id: "w31mm-sec-task7",
      type: "section_header",
      icon: "🧲",
      title: "Task 6 — Is It Magnetism? Station Experiment",
      subtitle: "~10 min"
    },
    {
      id: "w31mm-img-magnets",
      type: "image",
      url: `${IMG}/w31-magnet-poles.png`,
      caption: "A bar magnet has two poles: North (N) and South (S).",
      alt: "A red and blue bar magnet labeled N and S on its two ends"
    },
    {
      id: "w31mm-text-magnet-exp",
      type: "text",
      content: "Run all six trials at the magnet station. Record what you observe in a chart on your whiteboard.\n\n| Trial | Experiment |\n|---|---|\n| 1 | Bring N pole near N pole of a second magnet |\n| 2 | Bring N pole near S pole of a second magnet |\n| 3 | Bring S pole near S pole of a second magnet |\n| 4 | Bring N pole near a piece of metal (paper clip, nail) |\n| 5 | Bring S pole near the same piece of metal |\n| 6 | Bring both poles near a non-metal material (plastic, wood) |"
    },
    {
      id: "w31mm-q-magnet-patterns",
      type: "question",
      questionType: "short_answer",
      prompt: "What patterns did you find? Write rules for magnets in the form *\"Same poles ___, opposite poles ___, metals ___, non-metals ___.\"*",
      placeholder: "Same poles repel. Opposite poles... Metals are... Non-metals...",
      difficulty: "analyze"
    },

    {
      id: "w31mm-sec-task9",
      type: "section_header",
      icon: "🎈",
      title: "Task 7 — Test the Balloon Against Both Poles",
      subtitle: "~8 min"
    },
    {
      id: "w31mm-img-balloon-magnet",
      type: "image",
      url: `${IMG}/w31-balloon-magnet-test.png`,
      caption: "Rub a balloon with fur. Hold it away from everything else. Bring it near the N pole, then the S pole.",
      alt: "A student holds a rubbed balloon near first the north pole and then the south pole of a bar magnet"
    },
    {
      id: "w31mm-q-balloon-magnet",
      type: "question",
      questionType: "short_answer",
      prompt: "What happened when the charged balloon was brought near the **N pole**? The **S pole**? Write both observations.",
      placeholder: "N pole: The balloon...\nS pole: The balloon...",
      difficulty: "recall"
    },
    {
      id: "w31mm-sec-task11",
      type: "section_header",
      icon: "⚖️",
      title: "Task 8 — Rule In or Rule Out",
      subtitle: "~6 min"
    },
    {
      id: "w31mm-callout-ruleout",
      type: "callout",
      style: "question",
      icon: "🧠",
      content: "**Essential Question:** If this were really magnetism, what *should* have happened when you brought the charged balloon near the N and S poles? Does that match what you saw?"
    },
    {
      id: "w31mm-q-ruleout",
      type: "question",
      questionType: "short_answer",
      prompt: "Use the magnet rules from Task 6 and your observations from Task 7 to argue: **is this phenomenon magnetic, or is it something else?** Defend your answer.",
      placeholder: "If this were magnetism, the balloon should have... But instead it... Therefore...",
      difficulty: "evaluate"
    },

    {
      id: "w31mm-sec-transition",
      type: "section_header",
      icon: "⏸️",
      title: "Brain Break + Transition to Part 2",
      subtitle: "~4 min — stations reset"
    },
    {
      id: "w31mm-callout-transition",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "Good — we've ruled out magnetism. So this is something new. Now let's see if the *material* matters. What happens when we rub metal-coated PVC instead of regular PVC? What about when you bring a balloon near a wooden surface vs. a metal one?"
    },

    {
      id: "w31mm-sec-stations",
      type: "section_header",
      icon: "🔬",
      title: "Task 9 — Material Matters: 4 Rotation Stations",
      subtitle: "~28 min — rotate through all 4"
    },
    {
      id: "w31mm-text-stations",
      type: "text",
      content: "Each station takes ~6 minutes. Rotate as a group. Write each station's observation on your whiteboard."
    },
    {
      id: "w31mm-img-station-pvc",
      type: "image",
      url: `${IMG}/w31-station-pvc-rotating.png`,
      caption: "Station 1 — Rotating Stand: white PVC vs. metal-coated PVC.",
      alt: "A lab setup with a rotating stand holding a horizontal PVC pipe; a student approaches with fur to rub a second pipe nearby"
    },
    {
      id: "w31mm-text-station-pvc",
      type: "text",
      content: "**Station 1 — Rotating Stand.** Place the white PVC on the rotating stand. Rub the gray PVC with fur. Bring it near the white PVC. Observe. Now swap the white PVC for the **metal-coated PVC** and repeat. Does one respond more dramatically than the other?"
    },
    {
      id: "w31mm-img-station-foil",
      type: "image",
      url: `${IMG}/w31-station-foil-cup-vdg.png`,
      caption: "Station 2 — Tin-foil cup near the Van de Graaff.",
      alt: "A clear plastic cup coated in tin foil hangs from a string near a running Van de Graaff generator"
    },
    {
      id: "w31mm-text-station-foil",
      type: "text",
      content: "**Station 2 — Foil Cup + Mysterious Machine.** With the Van de Graaff running, bring a plain plastic cup hanging by a string near the sphere. Then replace it with a **tin-foil-coated** cup. Which one responds more strongly?"
    },
    {
      id: "w31mm-img-station-cross",
      type: "image",
      url: `${IMG}/w31-station-cross-balloons.png`,
      caption: "Station 3 — Cross-material balloon pairs.",
      alt: "Two colored balloons, one rubbed with a clear piece of plastic and one rubbed with a clear plastic bag, held near each other on strings"
    },
    {
      id: "w31mm-text-station-cross",
      type: "text",
      content: "**Station 3 — Cross-Material Balloons.** Rub the orange balloon with a clear piece of plastic. Rub the pink balloon with a clear plastic bag. Bring them near each other. Do they attract, repel, or do nothing?"
    },
    {
      id: "w31mm-img-station-whiteboards",
      type: "image",
      url: `${IMG}/w31-station-whiteboards.png`,
      caption: "Station 4 — Balloon vs. wooden vs. metal whiteboard.",
      alt: "A rubbed balloon is brought close to a wooden whiteboard and a metal-coated whiteboard side by side"
    },
    {
      id: "w31mm-text-station-wb",
      type: "text",
      content: "**Station 4 — Whiteboards.** Rub the balloon with fur. Bring it near the wooden whiteboard. Now bring it near the metal-coated whiteboard. Which surface attracts the balloon more strongly?"
    },
    {
      id: "w31mm-q-stations",
      type: "question",
      questionType: "short_answer",
      prompt: "Record one observation per station. Be specific — stronger/weaker, attract/repel/nothing, fast/slow.",
      placeholder: "Station 1: ...\nStation 2: ...\nStation 3: ...\nStation 4: ...",
      difficulty: "recall"
    },
    {
      id: "w31mm-evidence-stations",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard Photo — Station Observations",
      instructions: "One clear photo of your group's station chart — all 4 observations readable.",
      reflectionPrompt: "Which two stations felt the most similar? What did they have in common?"
    },

    {
      id: "w31mm-sec-synth",
      type: "section_header",
      icon: "🧩",
      title: "Task 10 — Pattern Synthesis",
      subtitle: "~7 min"
    },
    {
      id: "w31mm-callout-synth",
      type: "callout",
      style: "insight",
      icon: "🔍",
      content: "Look across all 4 stations. Two of them used something with **metal** involved (metal-coated PVC, tin-foil cup, metal whiteboard). Two of them did not. Is there a pattern in which responded **more strongly**?"
    },
    {
      id: "w31mm-q-synth",
      type: "question",
      questionType: "short_answer",
      prompt: "Write a rule in the form: *\"When one of the objects is made of ___, the charge interaction is ___.\"* Defend your rule with two specific station observations.",
      placeholder: "When one of the objects involves metal, the interaction seems to be ___ because at Station ___ we saw ___ and at Station ___ we saw ___.",
      difficulty: "create"
    },
    {
      id: "w31mm-callout-hook",
      type: "callout",
      style: "insight",
      icon: "🎯",
      content: "You just noticed that **metals behave differently from plastic and wood**. Tomorrow we'll give those two categories names — **conductor** and **dielectric** — and start drawing diagrams that explain *why*. Hold onto the pattern you just found."
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w31-material-matters", lesson);
    console.log("✅ Lesson 4 seeded: Is It Magnetism? + Material Matters");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
