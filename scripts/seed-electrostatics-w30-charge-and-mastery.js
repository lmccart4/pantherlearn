// seed-electrostatics-w30-charge-and-mastery.js
// Electrostatics — Week 30, combined lesson (~84 min / double period)
// Merges prior "Reading the Atomic Symbol" (Tasks 13-19) with
// "Charge, Mastery & Back to the Mystery" (Tasks 20-23 + synthesis + Week 31 bridge).
// Keeps lessonId + title stable so Google Classroom sync is preserved.
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
  order: 2,
  visible: true,
  dueDate: "2026-04-19",
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
      content: "On Tuesday you figured out two big rules from the *Atom* level of the sim:\n\n- An atom is **stable** based on its balance of protons and neutrons in the nucleus.\n- An atom is **+ion**, **−ion**, or **neutral** based on the balance of protons and electrons.\n\nToday we level up. Chemists don't carry around tiny diagrams of atoms — they carry **symbols**. We're going to crack the code on what every number around that symbol means, then use it to finally solve the Van de Graaff mystery."
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
      title: "What You'll Discover Today",
      items: [
        "What makes an atom one element vs. another",
        "How to read the **proton count** from a chemical symbol",
        "How to read the **neutron count** from a chemical symbol",
        "How to read the **charge** from a chemical symbol",
        "Earn **at least 12 stars** (65%) in Build an Atom's Game mode",
        "Use what you know to explain the Van de Graaff mystery",
        "Start observing static electricity in your own life for next week"
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
    // MID-LESSON CHECKPOINT (was exit ticket of Symbol lesson)
    // ═══════════════════════════════════════════
    {
      id: "section-checkpoint",
      type: "section_header",
      icon: "✅",
      title: "Checkpoint — Put It All Together",
      subtitle: "~3 min"
    },
    {
      id: "q-checkpoint-mc",
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
      id: "text-game-rubric",
      type: "text",
      content: "**Scoring rubric (out of 20 total stars):**\n\n- 10 stars = 55%\n- 12 stars = 65%\n- 14 stars = 85%\n- 16 stars = 100%\n- 20 stars = 150% (extra credit)"
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
    console.log("✅ Combined lesson seeded: Charge, Mastery & Back to the Mystery");
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
