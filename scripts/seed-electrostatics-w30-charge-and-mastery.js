// seed-electrostatics-w30-charge-and-mastery.js
// Electrostatics — Week 30, Lesson 3 (Friday single period, ~42 min)
// Discovery pedagogy: PhET Build an Atom — Symbol charge + Game level
// Covers slide-deck Tasks 20-23 + synthesis back to the Van de Graaff
// + lightweight Week 31 observation bridge.
// Run: node scripts/seed-electrostatics-w30-charge-and-mastery.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const IMG = "/images/physics/electrostatics";

const lesson = {
  title: "Charge, Mastery & Back to the Mystery",
  questionOfTheDay: "If you remove an electron from a neutral atom, what happens to its charge — and why?",
  course: "Physics",
  unit: "Electrostatics",
  order: 3,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // RECAP
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
      content: "Quick check of what you already know:\n\n- **Protons** are the number in the lower-left corner of the symbol — they decide which element you have.\n- **Neutrons** = *mass number* − *proton number*.\n- An atom is **stable** based on its proton/neutron balance.\n\nThere's one more number around the symbol we haven't cracked yet. Today we finish the code."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you remove an electron from a neutral atom, what happens to its charge — and why?"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Today's Targets",
      items: [
        "Discover how the symbol encodes an atom's **charge**",
        "Earn **at least 12 stars** (65%) in Build an Atom's Game mode",
        "Use what you know to explain the Van de Graaff mystery",
        "Start observing static electricity in your own life for next week"
      ]
    },

    // ═══════════════════════════════════════════
    // TASK 20 — CHARGE PATTERN
    // ═══════════════════════════════════════════
    {
      id: "section-task20",
      type: "section_header",
      icon: "⚡",
      title: "Task 20 — Reading Charge from the Symbol",
      subtitle: "~6 min"
    },
    {
      id: "link-phet-build-atom",
      type: "external_link",
      title: "Re-open: Build an Atom — Symbol mode",
      description: "Return to the PhET sim and click back into the **Symbol** tile.",
      url: "https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html",
      buttonLabel: "Launch Build an Atom"
    },
    {
      id: "img-h-example",
      type: "image",
      url: `${IMG}/phet-h-example.png`,
      caption: "Same example from yesterday. One of these numbers is the charge. Which one?",
      alt: "A hydrogen symbol H with numbers around it including a 4- in the upper right"
    },
    {
      id: "callout-charge-q",
      type: "callout",
      style: "question",
      icon: "🔍",
      content: "**Investigation:** Only change the *electrons* in the sim, and watch every number around the symbol. One of them will move. That's the **charge** number. Figure out the rule."
    },
    {
      id: "q-task20-pattern",
      type: "question",
      questionType: "short_answer",
      prompt: "How can you tell the **charge** of an atom from its symbol? Where does the charge number sit, and how do you interpret the `+` or `−` sign?",
      placeholder: "The charge is shown in the ___. If the number is ___, then the atom has more ___ than ___.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // TASK 21 — EVIDENCE
    // ═══════════════════════════════════════════
    {
      id: "section-task21",
      type: "section_header",
      icon: "📸",
      title: "Task 21 — Prove It",
      subtitle: "~4 min"
    },
    {
      id: "evidence-charge-symbol",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload 2 Screenshots — Charge Rule",
      instructions: "Take **2 screenshots** of atoms that follow your charge rule. Choose atoms with **different** charges — ideally one **+ion** and one **−ion**.",
      reflectionPrompt: "For each screenshot, write: \"This atom has a charge of ___ because the number in the ___ is ___.\""
    },

    // ═══════════════════════════════════════════
    // TASK 22 — GAME MODE
    // ═══════════════════════════════════════════
    {
      id: "section-task22",
      type: "section_header",
      icon: "🎮",
      title: "Task 22 — Game Time",
      subtitle: "~12 min"
    },
    {
      id: "text-game-intro",
      type: "text",
      content: "You just discovered the rules. Now we see how well they stuck.\n\nNavigate to the **bottom center** of the sim and click the **Game** tile. You'll see **4 levels**, each worth up to 5 stars. Play through all four."
    },
    {
      id: "img-game-rubric",
      type: "image",
      url: `${IMG}/phet-game-rubric.png`,
      caption: "The four game levels and how stars translate to a grade.",
      alt: "Four game level icons (Find element, Net charge, Symbol, ?) and a scoring rubric: 10 stars = 55%, 12 = 65%, 14 = 85%, 16 = 100%, 20 = 150%"
    },

    // ═══════════════════════════════════════════
    // TASK 23 — SCORE UPLOAD
    // ═══════════════════════════════════════════
    {
      id: "section-task23",
      type: "section_header",
      icon: "⭐",
      title: "Task 23 — Submit Your Score",
      subtitle: "~3 min"
    },
    {
      id: "evidence-stars",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Your Stars Screen",
      instructions: "Once you're done, come back to the screen that shows how many stars you've earned across all 4 levels and **take a screenshot of the full game-select screen**. Upload it here.",
      reflectionPrompt: "How many total stars did you earn (out of 20)? Which level was hardest, and why?"
    },

    // ═══════════════════════════════════════════
    // SYNTHESIS — BACK TO THE MYSTERIOUS MACHINE
    // ═══════════════════════════════════════════
    {
      id: "section-synthesis",
      type: "section_header",
      icon: "🔁",
      title: "Synthesis — Solving the Mystery",
      subtitle: "~8 min"
    },
    {
      id: "text-synthesis",
      type: "text",
      content: "Look back at Tuesday's lesson — the **Van de Graaff machine** that made the volunteer's hair stand up. On Tuesday you wrote a *first-draft hypothesis*. Now you know more.\n\nHere's what we've added to your toolbox this week:\n\n- Atoms are made of **protons** (positive, locked in the nucleus), **neutrons** (neutral, in the nucleus), and **electrons** (negative, outside the nucleus).\n- Neutral atoms have **equal** protons and electrons.\n- **Only electrons move** easily between objects. Protons don't travel.\n- Losing electrons → **positive ion**. Gaining electrons → **negative ion**."
    },
    {
      id: "callout-hair-hint",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Physics fact to add:** Two objects with the *same* kind of charge **repel** each other. Two objects with *opposite* charges **attract**."
    },
    {
      id: "q-synthesis",
      type: "question",
      questionType: "short_answer",
      prompt: "Re-write your hypothesis from Tuesday — **but better**. Explain the Van de Graaff phenomenon using protons, neutrons, electrons, and the repel/attract rule. Why did the volunteer's hair stand *up* instead of falling *down*?",
      placeholder: "The machine pushes electrons onto the person. Every hair on their head now has... Since all the hairs now have... they...",
      difficulty: "create"
    },
    {
      id: "q-synthesis-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You rub a balloon on your hair and the balloon sticks to the wall. What most likely moved, and in which direction?",
      options: [
        "Protons moved from the balloon to the wall",
        "Electrons moved from your hair onto the balloon",
        "Neutrons moved from the wall onto the balloon",
        "Nothing moved — the balloon just got magnetic"
      ],
      correctIndex: 1,
      explanation: "Protons are locked inside the nucleus — they don't travel between objects. Electrons are the only subatomic particle that moves easily between everyday objects, which is why friction transfers **electrons**, not protons or neutrons.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WEEK 31 BRIDGE — AT-HOME OBSERVATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-week31",
      type: "section_header",
      icon: "🔭",
      title: "Looking Ahead — Your Weekend Mission",
      subtitle: "~3 min"
    },
    {
      id: "text-week31",
      type: "text",
      content: "Next week we start designing **real experiments** to test what the Van de Graaff is really doing. To do that, we need **data** — and the best data comes from *your own* observations of static electricity in the wild.\n\nOver the weekend, **hunt for static electricity in your everyday life.** Doorknobs, clothes, socks on carpet, hair and a plastic comb, a balloon and a wall. Any time you feel a zap or see something cling, write it down."
    },
    {
      id: "q-week31-observations",
      type: "question",
      questionType: "short_answer",
      prompt: "Write down **at least 2 predictions** for where you expect to find static electricity this weekend. Be specific: what materials, what weather, what activity? Bring a third real observation to class on Monday.",
      placeholder: "Prediction 1: When I ___, I think I will feel ___ because...\nPrediction 2: ...",
      difficulty: "create"
    }

  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", "electrostatics-w30-charge-and-mastery", lesson);
    console.log("✅ Lesson 3 seeded: Charge, Mastery & Back to the Mystery");
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
