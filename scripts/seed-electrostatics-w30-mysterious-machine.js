// seed-electrostatics-w30-mysterious-machine.js
// Electrostatics — Week 30, Lesson 1 (Tuesday double period, ~84 min)
// Discovery pedagogy: Van de Graaff phenomenon → PhET Build an Atom (Atom level)
// Covers slide-deck Tasks 1-12.
// Run: node scripts/seed-electrostatics-w30-mysterious-machine.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "The Mysterious Machine",
  questionOfTheDay: "Can something push or pull on you without ever touching you?",
  course: "Physics",
  unit: "Electrostatics",
  order: 1,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // HOOK — THE PHENOMENON
    // ═══════════════════════════════════════════
    {
      id: "section-welcome",
      type: "section_header",
      icon: "⚡",
      title: "Welcome Back",
      subtitle: "Start here — ~3 min"
    },
    {
      id: "img-vdg-hero",
      type: "image",
      url: `${IMG}/vandegraaff.png`,
      caption: "The mysterious machine you just saw in action.",
      alt: "Van de Graaff generator — a tall metal sphere on an insulated column with a grounded discharge wand"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Can something push or pull on you without ever touching you?"
    },
    {
      id: "text-mystery-framing",
      type: "text",
      content: "You just witnessed something that **shouldn't be possible** if you only think about the world you can see.\n\nA sphere sat still. A person touched it. Hair moved. No wind. No strings. No magnets.\n\nToday we are not going to be told the answer. We are going to do what every scientist from Franklin to Faraday did: **observe**, **ask questions**, and **hunt for patterns**. By the end of the block we will have enough evidence to start explaining this machine ourselves."
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "What You Will Figure Out Today",
      items: [
        "Describe the Van de Graaff phenomenon in your own words",
        "Ask investigable questions about what you observed",
        "Use the PhET Build an Atom simulation to discover what makes an atom stable",
        "Discover the rule that determines whether an atom is a positive ion, negative ion, or neutral"
      ]
    },

    // ═══════════════════════════════════════════
    // TASK 1 — OBSERVE
    // ═══════════════════════════════════════════
    {
      id: "section-task1",
      type: "section_header",
      icon: "👀",
      title: "Task 1 — Observe",
      subtitle: "~5 min"
    },
    {
      id: "text-task1-intro",
      type: "text",
      content: "Before we try to explain anything, we need to **describe what we saw**. Scientists separate observation from explanation on purpose — because your first explanation is almost always wrong, but your observations are real data."
    },
    {
      id: "q-task1-observations",
      type: "question",
      questionType: "short_answer",
      prompt: "Write down **anything interesting** you observed during the Van de Graaff demonstration. Do not try to explain *why* it happened — just describe what your eyes and skin told you. Aim for at least 4 specific observations.",
      placeholder: "I saw... I heard... I felt... The volunteer's hair...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // TASK 2 — QUESTION
    // ═══════════════════════════════════════════
    {
      id: "section-task2",
      type: "section_header",
      icon: "❔",
      title: "Task 2 — Ask",
      subtitle: "~5 min"
    },
    {
      id: "callout-questions",
      type: "callout",
      style: "insight",
      icon: "💭",
      content: "Good questions are the steering wheel of science. A question you can actually test is worth more than an answer you guessed."
    },
    {
      id: "q-task2-questions",
      type: "question",
      questionType: "short_answer",
      prompt: "What **questions** do you have about the phenomenon you just witnessed? Write at least **3**. Try to make them answerable by experimenting, not just by googling.",
      placeholder: "1. Why did...\n2. What would happen if...\n3. Does it matter if...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // TASK 3 — CAUSE / EFFECT PATTERNS
    // ═══════════════════════════════════════════
    {
      id: "section-task3",
      type: "section_header",
      icon: "🔗",
      title: "Task 3 — Hunt for Patterns",
      subtitle: "~5 min"
    },
    {
      id: "text-task3-intro",
      type: "text",
      content: "Look back at your observations from **Task 1**. Are there any **cause-and-effect** pairs hiding in them? A cause-and-effect pattern sounds like this: *\"When X happened, Y happened right after.\"*\n\nPatterns like this are how we turn observations into the first draft of a theory."
    },
    {
      id: "q-task3-patterns",
      type: "question",
      questionType: "short_answer",
      prompt: "Write at least **2 cause-and-effect patterns** you noticed. A good answer looks like: *\"When the volunteer touched the ball, the hair on their head began to stand up and stay up.\"*",
      placeholder: "Pattern 1: When... then...\nPattern 2: When... then...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // TASK 4 — PERSONAL CONNECTIONS
    // ═══════════════════════════════════════════
    {
      id: "section-task4",
      type: "section_header",
      icon: "🧠",
      title: "Task 4 — Have You Felt This Before?",
      subtitle: "~5 min"
    },
    {
      id: "text-task4-intro",
      type: "text",
      content: "The Van de Graaff is a **mysterious machine** — we're not completely sure what's happening inside it. But you've felt something like this before, even if you didn't have words for it.\n\nMaybe a shock from a doorknob in winter. Clothes fresh out of the dryer sticking together. Hair following a balloon. A zap when you got out of a car.\n\nConnecting new phenomena to experiences you already trust is one of the most powerful moves in science."
    },
    {
      id: "q-task4-connection",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe a time in your own life when you felt or saw something **similar** to the Van de Graaff phenomenon. Walk through the **process** — what were you doing, what happened, and what did it feel like?",
      placeholder: "Once, in winter, I was walking across the carpet and...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // TASK 5 — OPEN THE INTERACTIVE
    // ═══════════════════════════════════════════
    {
      id: "section-task5",
      type: "section_header",
      icon: "🔬",
      title: "Task 5 — Zoom In on Something Too Small to See",
      subtitle: "~8 min"
    },
    {
      id: "text-zoom-in",
      type: "text",
      content: "To understand the mysterious machine, we have to look at systems **too small for our eyes** — the building blocks of everything: **atoms**.\n\nWe'll use a free interactive from PhET (University of Colorado) called **Build an Atom**. You will start at the easiest mode: *Atom*."
    },
    {
      id: "link-phet-build-atom",
      type: "external_link",
      title: "Open: Build an Atom (PhET)",
      description: "Free interactive from PhET / University of Colorado. Runs in any modern browser. Select the **Atom** level when it loads.",
      url: "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html",
      buttonLabel: "Launch Build an Atom"
    },
    {
      id: "text-task5-instruction",
      type: "text",
      content: "**Step 1.** When the sim loads, you'll see four mode tiles at the bottom: **Atom**, **Symbol**, **Game**. Click **Atom**."
    },

    // ═══════════════════════════════════════════
    // TASK 6 — MATCH THE SETTINGS
    // ═══════════════════════════════════════════
    {
      id: "section-task6",
      type: "section_header",
      icon: "⚙️",
      title: "Task 6 — Match the Settings",
      subtitle: "~3 min"
    },
    {
      id: "text-task6-intro",
      type: "text",
      content: "Adjust the right-hand panels so yours matches the image below. Expand **Element**, **Net Charge**, and **Mass Number**, and under **Show**, check *Element*, *Neutral/Ion*, and *Stable/Unstable*."
    },
    {
      id: "img-settings",
      type: "image",
      url: `${IMG}/phet-atom-settings.png?v=2`,
      width: 646,
      height: 972,
      caption: "Your right-hand panel should look like this before you start experimenting.",
      alt: "PhET Build an Atom settings panel showing Element, Net Charge, Mass Number, and Show options"
    },

    // ═══════════════════════════════════════════
    // TASK 7 — PLAY AND OBSERVE
    // ═══════════════════════════════════════════
    {
      id: "section-task7",
      type: "section_header",
      icon: "🎮",
      title: "Task 7 — Play Around",
      subtitle: "~5 min"
    },
    {
      id: "text-task7-intro",
      type: "text",
      content: "Drag protons, neutrons, and electrons into the atom. Take them back out. Build something weird. This is **exploratory play** — you are not trying to be right, you are trying to notice what changes when you change something. This is real science."
    },
    {
      id: "q-task7-observations",
      type: "question",
      questionType: "short_answer",
      prompt: "Write down at least **4 things you noticed** while playing with the sim. Did anything surprise you? Did a panel change color? Did the name of the element change? Did anything refuse to happen?",
      placeholder: "I noticed... I noticed... I was surprised when...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // TASK 8 — WHAT SITS AT THE CENTER?
    // ═══════════════════════════════════════════
    {
      id: "section-task8",
      type: "section_header",
      icon: "🎯",
      title: "Task 8 — The Center",
      subtitle: "~5 min"
    },
    {
      id: "callout-center-q",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question:** What kinds of particle(s) go into the center of the atom — the spot marked with the orange *X*?"
    },
    {
      id: "q-task8-particles",
      type: "question",
      questionType: "short_answer",
      prompt: "Which particles are allowed in the center of the atom? How do you know — what did the sim do when you tried to put the wrong one there?",
      placeholder: "The center holds... I know because when I dragged...",
      difficulty: "apply"
    },
    {
      id: "q-task8-nucleus",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The center of the atom has a proper scientific name. Do a quick search if you don't know it — the sim won't tell you. What is it called?",
      options: [
        "The shell",
        "The nucleus",
        "The orbit",
        "The core"
      ],
      correctIndex: 1,
      explanation: "The **nucleus** is the dense center of every atom. It holds protons and neutrons. Electrons live in orbits *around* the nucleus — not inside it.",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // TASK 9 — STABLE vs UNSTABLE PATTERN
    // ═══════════════════════════════════════════
    {
      id: "section-task9",
      type: "section_header",
      icon: "⚖️",
      title: "Task 9 — Stable vs Unstable",
      subtitle: "~10 min"
    },
    {
      id: "img-stable-unstable",
      type: "image",
      url: `${IMG}/stable-unstable-labels.png?v=2`,
      caption: "The sim will label your atom as Stable or Unstable. Your job: figure out the rule.",
      alt: "Two labels reading 'Stable' and 'Unstable'"
    },
    {
      id: "callout-stable-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Build lots of different atoms. Watch the *Stable / Unstable* indicator change. Keep experimenting until you can answer: **What causes an atom to be stable or unstable?**"
    },
    {
      id: "q-task9-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, **explain the pattern you found** for when an atom is stable vs. unstable. Use specific examples from the sim to back up your rule.",
      placeholder: "An atom is stable when... I figured this out because when I tried...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 10 — EVIDENCE UPLOAD
    // ═══════════════════════════════════════════
    {
      id: "section-task10",
      type: "section_header",
      icon: "📸",
      title: "Task 10 — Prove Your Rule",
      subtitle: "~5 min"
    },
    {
      id: "evidence-stability",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 3 Screenshots — Stability Rule",
      instructions: "Take **3 screenshots** from the sim that follow the rule you wrote in Task 9. At least one should be *stable* and at least one should be *unstable*. Label each screenshot in your reflection below.",
      reflectionPrompt: "For each screenshot, write one sentence that explains how the atom either proves or challenges your rule."
    },

    // ═══════════════════════════════════════════
    // TASK 11 — CHARGE PATTERN
    // ═══════════════════════════════════════════
    {
      id: "section-task11",
      type: "section_header",
      icon: "➕",
      title: "Task 11 — +Ion, −Ion, or Neutral?",
      subtitle: "~10 min"
    },
    {
      id: "img-ions",
      type: "image",
      url: `${IMG}/ion-labels.png?v=2`,
      caption: "Three possible charge labels the sim can give your atom.",
      alt: "Three labels reading +Ion, -Ion, and Neutral Atom"
    },
    {
      id: "callout-charge-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Keep building. Watch the *Net Charge* meter and the *Neutral / Ion* label. Keep going until you can answer: **What causes an atom to be a positive ion, a negative ion, or a neutral atom?**"
    },
    {
      id: "q-task11-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "Explain the pattern you found. How do you know — just by looking at the particles — whether an atom will be **+ion**, **−ion**, or **neutral**?",
      placeholder: "An atom becomes a positive ion when... It is neutral when... It is a negative ion when...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 12 — EVIDENCE UPLOAD
    // ═══════════════════════════════════════════
    {
      id: "section-task12",
      type: "section_header",
      icon: "📸",
      title: "Task 12 — Prove Your Rule",
      subtitle: "~5 min"
    },
    {
      id: "evidence-charge",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 3 Screenshots — Charge Rule",
      instructions: "Take **3 screenshots** from the sim that follow your charge rule. Show at least one **+ion**, one **−ion**, and one **neutral** atom.",
      reflectionPrompt: "For each of the three screenshots, write one sentence explaining how the numbers of protons and electrons created that label."
    },

    // ═══════════════════════════════════════════
    // WRAP UP — BACK TO THE MYSTERIOUS MACHINE
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🔁",
      title: "Wrap Up — Back to the Mysterious Machine",
      subtitle: "~3 min"
    },
    {
      id: "callout-closing",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "You started the block watching hair stand on end. You now know that atoms are made of protons, neutrons, and electrons — and that **moving electrons around** changes whether an atom is neutral, positive, or negative."
    },
    {
      id: "q-wrapup",
      type: "question",
      questionType: "short_answer",
      prompt: "Based on what you discovered with the sim, write a **first-draft hypothesis** about what the Van de Graaff machine might be doing to a volunteer's hair. You don't have to be right — you have to be specific.",
      placeholder: "I think the Van de Graaff is moving... from... to... and that causes...",
      difficulty: "create"
    }

  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w30-mysterious-machine", lesson);
    console.log("✅ Lesson 1 seeded: The Mysterious Machine");
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
