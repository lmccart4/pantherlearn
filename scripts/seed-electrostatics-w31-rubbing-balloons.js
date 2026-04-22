// seed-electrostatics-w31-rubbing-balloons.js
// Electrostatics — Week 31, Lesson 3 (Monday 4/20, 42 min)
// Phenomenon-first rubbing-balloons investigation → du Fay two-fluid idea
// Models last year's Week 31 slides Tasks 1-4 (Tasks 5-6 moved to Tuesday opener)
// Run: node scripts/seed-electrostatics-w31-rubbing-balloons.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Rubbing Balloons — What Are the Rules?",
  questionOfTheDay: "When you rub two objects together, what decides if they'll attract or repel afterwards?",
  course: "Physics",
  unit: "Electrostatics",
  order: 3,
  visible: false,
  dueDate: "2026-04-20",
  blocks: [
    {
      id: "w31rb-sec-welcome",
      type: "section_header",
      icon: "🎈",
      title: "Today: Rubbing Balloons",
      subtitle: "~2 min"
    },
    {
      id: "w31rb-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When you rub two objects together, what decides if they'll attract or repel afterwards?"
    },
    {
      id: "w31rb-text-intro",
      type: "text",
      content: "Last block you used a simulation to discover the rules of atoms. Today we leave the sim behind and put the phenomenon back in your hands. **Balloons. Fur. Plastic. Hair.** Rub them. Watch. Record.\n\nYour job is not to remember a textbook — it's to hunt for patterns. By the end of class you should be able to **predict** what any new pair of rubbed objects will do before you test them."
    },
    {
      id: "w31rb-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "The rule that predicts attraction vs. repulsion between rubbed objects",
        "Why two 'fluids' were enough for scientists in the 1700s to explain what you're seeing",
        "How your new atomic-model vocabulary (+ion, −ion, neutral) maps onto that old idea"
      ]
    },

    {
      id: "w31rb-sec-task1",
      type: "section_header",
      icon: "🧪",
      title: "Task 1 — Run the 6 Experiments",
      subtitle: "~12 min"
    },
    {
      id: "w31rb-img-stations",
      type: "image",
      url: `${IMG}/w31-rub-stations.png`,
      caption: "Your group's setup has everything you need. Run all 6 experiments in order.",
      alt: "Six rubbing-balloon experiments: balloon with plastic bag, balloon with a clear piece of plastic, balloon with fur, balloon with human hair, two balloons both rubbed with fur, and two balloons rubbed with different materials"
    },
    {
      id: "w31rb-text-stations",
      type: "text",
      content: "**Run each of the 6 experiments in order at your setup, and record what you observe.** Focus on: *Does the balloon attract toward the other object? Repel away? Do nothing?* Don't try to explain *why* yet — just describe what you see.\n\n| # | Experiment |\n|---|---|\n| 1 | Rub a balloon with a plastic bag. Bring the balloon near the bag. |\n| 2 | Rub a balloon with a clear piece of plastic. Bring the balloon near the plastic. |\n| 3 | Rub a balloon with fur. Bring the balloon near the fur. |\n| 4 | Rub a balloon with human hair. Bring the balloon near the hair. |\n| 5 | Rub **two** balloons with fur. Bring the two balloons near each other. |\n| 6 | Rub **one** balloon with fur and **another** balloon with a clear piece of plastic. Bring them near each other. |"
    },
    {
      id: "w31rb-q-task1",
      type: "question",
      questionType: "short_answer",
      prompt: "Record your group's observations for all six experiments in a single chart on your whiteboard, then type them here. Use one row per experiment.",
      placeholder: "Experiment 1: Balloon attracted to plastic bag.\nExperiment 2: ...",
      difficulty: "recall"
    },

    {
      id: "w31rb-sec-task2",
      type: "section_header",
      icon: "🔍",
      title: "Task 2 — Hunt for Patterns",
      subtitle: "~6 min"
    },
    {
      id: "w31rb-callout-patterns",
      type: "callout",
      style: "insight",
      icon: "🧠",
      content: "A **pattern** is a rule that holds for more than one experiment. If Experiment 1 and Experiment 3 both show attraction, what do they have in common? If Experiment 5 and Experiment 6 both show repulsion, what makes them different from the others?"
    },
    {
      id: "w31rb-q-patterns",
      type: "question",
      questionType: "short_answer",
      prompt: "Write down **at least 3 patterns** you found across the six experiments. A good pattern sounds like: *\"Whenever we ___, the balloons ___.\"*",
      placeholder: "1. When two objects are rubbed together, they tend to...\n2. When two balloons are both rubbed with the same material...\n3. ...",
      difficulty: "analyze"
    },
    {
      id: "w31rb-evidence-whiteboard",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Whiteboard Photo — Observations + Patterns",
      instructions: "Take one clear photo of your group's whiteboard with all six experiment observations and your list of patterns. Make sure the writing is readable.",
      reflectionPrompt: "Which experiment's result surprised your group the most? Why?"
    },

    {
      id: "w31rb-sec-task3",
      type: "section_header",
      icon: "💡",
      title: "Task 3 — A Crazy Idea from 1733",
      subtitle: "~8 min"
    },
    {
      id: "w31rb-text-dufay",
      type: "text",
      content: "Almost 300 years ago, a French scientist named **Charles du Fay** proposed a crazy idea. He couldn't see atoms. He had never heard the word *electron*. But he had balloons, fur, and plastic — and he noticed the exact same patterns you just did.\n\nHis idea:"
    },
    {
      id: "w31rb-callout-dufay",
      type: "callout",
      style: "insight",
      icon: "🧪",
      content: "**du Fay's Two-Fluid Idea (1733):** There exist **two different kinds of invisible fluids** inside matter. Rubbing two objects together **transfers one fluid from one object to the other**. An object with an **excess** of one fluid attracts an object with an **excess** of the other — but repels objects with an excess of the same fluid."
    },
    {
      id: "w31rb-img-dufay",
      type: "image",
      url: `${IMG}/w31-dufay-fluids.png`,
      caption: "du Fay's picture: every object has both fluids in balance. Rubbing moves some from one object to the other, leaving one in excess and one in deficit.",
      alt: "Diagram showing two balloons before rubbing (each with equal amounts of red and blue fluid) and after rubbing (one balloon with excess red fluid, the other with excess blue fluid)"
    },
    {
      id: "w31rb-q-dufay-rules",
      type: "question",
      questionType: "short_answer",
      prompt: "Use du Fay's two-fluid idea to **explain** the three most important patterns you found in Task 2. Be specific: which fluid moves, and why does that cause attraction or repulsion?",
      placeholder: "When fur is rubbed on a balloon, one fluid moves from ___ to ___. That leaves the balloon with excess ___ and the fur with excess ___. Opposite excesses attract because...",
      difficulty: "analyze"
    },

    {
      id: "w31rb-sec-task4",
      type: "section_header",
      icon: "🧠",
      title: "Task 4 — Explain",
      subtitle: "~5 min"
    },
    {
      id: "w31rb-img-prediction",
      type: "image",
      url: `${IMG}/w31-balloon-pair-ac.png`,
      caption: "Four scenarios. You've seen three of them today. Explain **why** each one behaves the way it does using du Fay's idea and your observations.",
      alt: "Four panels labeled A, B, C, D. Each panel shows two balloons that have been rubbed in different ways — A: both with plastic, B: one with plastic one with fur, C: both with fur, D: one untouched and one rubbed with fur"
    },
    {
      id: "w31rb-q-predict",
      type: "question",
      questionType: "short_answer",
      prompt: "For each scenario (A, B, C, D) — you already know what happens from the experiments. Now **explain why**. Use (1) what you observed during today's experiments and (2) du Fay's two-fluid model — excess and deficit.",
      placeholder: "A (both with plastic): We saw this in Experiment 2 / we can reason it from Experiment 5. It happens because rubbing with plastic gives both balloons an excess of the same fluid, and...\nB (plastic + fur): We saw this in Experiment 6. It happens because the plastic and the fur pull fluid in opposite directions, so...\nC (both with fur): Experiment 5 showed... It happens because...\nD (untouched + fur): We didn't test this, but using du Fay's model, the untouched balloon has balanced fluids while the rubbed one has excess of one fluid, so...",
      difficulty: "analyze"
    },

    {
      id: "w31rb-sec-wrap",
      type: "section_header",
      icon: "🔁",
      title: "Wrap Up — Bridge to Your Atomic Model",
      subtitle: "~3 min"
    },
    {
      id: "w31rb-callout-bridge",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "You already know atoms are made of protons, neutrons, and **electrons**. You already know an atom with too many electrons is a **−ion**, and one with too few is a **+ion**. du Fay's \"two fluids\" are actually just **extra electrons** and **missing electrons**. His picture was right — he was just 200 years early on the vocabulary."
    },
    {
      id: "w31rb-q-bridge",
      type: "question",
      questionType: "short_answer",
      prompt: "In one sentence each: which of du Fay's \"fluids\" maps onto **extra electrons**, and which maps onto **missing electrons**? How do you know?",
      placeholder: "The fluid that causes... is actually extra electrons, because...",
      difficulty: "analyze"
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w31-rubbing-balloons", lesson);
    console.log("✅ Lesson 3 seeded: Rubbing Balloons");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
