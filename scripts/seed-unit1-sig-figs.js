// seed-unit1-sig-figs.js
// Creates "Significant Figures & Precision" lesson (Unit 1, Lesson 3)
// Run: node scripts/seed-unit1-sig-figs.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Significant Figures & Precision",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 3,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔍",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "You measure a table with a ruler and get 1.2 meters. Your friend uses a laser measuring tool and gets 1.2347 meters. Your calculator says π is 3.14159265358979...\n\nShould you report 10 decimal places in your answer? Of course not — your ruler can't measure that precisely. But how do you know when to stop? That's what significant figures tell you."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Your calculator says 3.14159265... but you measured the radius with a ruler that only goes to millimeters. Should you really report 10 decimal places in your answer?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "If a student measures a desk as 1.2 m and another measures it as 1.23456 m, which measurement is \"better\"? Why?",
      placeholder: "Explain which measurement is better and why...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Count significant figures in a measurement",
        "Apply sig fig rules when multiplying/dividing and adding/subtracting",
        "Distinguish between accuracy and precision",
        "Explain why significant figures matter in science"
      ]
    },

    // ═══════════════════════════════════════════
    // ACCURACY VS PRECISION
    // ═══════════════════════════════════════════
    {
      id: "section-accuracy",
      type: "section_header",
      icon: "🎯",
      title: "Accuracy vs Precision",
      subtitle: "~8 minutes"
    },
    {
      id: "b-accuracy",
      type: "text",
      content: "These words sound similar but mean very different things:\n\n- **Accuracy** = How close your measurement is to the **true value**\n- **Precision** = How close your **repeated measurements** are to each other (how detailed/consistent)\n\nThink of a dartboard:\n- **Accurate AND precise:** All darts clustered near the bullseye\n- **Precise but NOT accurate:** All darts clustered together, but far from the bullseye\n- **Accurate but NOT precise:** Darts scattered around the bullseye (average is right, but individual shots are all over)\n- **Neither:** Darts scattered everywhere, far from center\n\nIn physics, we want BOTH — measurements that are close to the true value AND consistent."
    },
    {
      id: "q-accuracy",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student measures the length of a 10.0 cm pencil five times and gets: 8.2, 8.1, 8.3, 8.2, 8.2 cm. These measurements are:",
      options: [
        "Accurate and precise",
        "Accurate but not precise",
        "Precise but not accurate",
        "Neither accurate nor precise"
      ],
      correctIndex: 2,
      explanation: "The measurements are very consistent with each other (all near 8.2 cm) — that's precise. But they're all far from the true value of 10.0 cm — that's not accurate. Something is systematically wrong (maybe the ruler is broken or they're measuring from the wrong starting point).",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SIG FIG RULES
    // ═══════════════════════════════════════════
    {
      id: "section-rules",
      type: "section_header",
      icon: "📏",
      title: "Counting Significant Figures",
      subtitle: "~12 minutes"
    },
    {
      id: "b-sigfig-def",
      type: "definition",
      term: "Significant figures (sig figs)",
      definition: "The digits in a measurement that are known with certainty, plus one estimated (uncertain) digit. They tell you how precise a measurement is."
    },
    {
      id: "b-rules",
      type: "text",
      content: "**Rules for counting significant figures:**\n\n1. **Non-zero digits ALWAYS count.** → 247 has 3 sig figs, 1.35 has 3 sig figs\n\n2. **Zeros between non-zero digits count.** → 205 has 3 sig figs, 1.008 has 4 sig figs\n\n3. **Leading zeros DON'T count.** → 0.0042 has 2 sig figs (the 4 and 2)\n\n4. **Trailing zeros after a decimal point count.** → 2.50 has 3 sig figs, 100.0 has 4 sig figs\n\n5. **Trailing zeros without a decimal point are ambiguous.** → 300 could be 1, 2, or 3 sig figs (use scientific notation to clarify: 3.00 × 10² = 3 sig figs)"
    },
    {
      id: "q-count-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How many significant figures does 0.00340 have?",
      options: [
        "2",
        "3",
        "5",
        "6"
      ],
      correctIndex: 1,
      explanation: "Leading zeros don't count (they're just placeholders). The significant digits are 3, 4, and 0 (trailing zero after decimal counts). So 0.00340 has 3 sig figs.",
      difficulty: "apply"
    },
    {
      id: "q-count-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How many significant figures does 10,200 have?",
      options: [
        "3",
        "5",
        "It's ambiguous — could be 3, 4, or 5",
        "2"
      ],
      correctIndex: 2,
      explanation: "Trailing zeros without a decimal point are ambiguous. 10,200 could mean 3 sig figs (1.02 × 10⁴), 4 sig figs (1.020 × 10⁴), or 5 sig figs (1.0200 × 10⁴). Use scientific notation to make it clear.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // CALCULATION RULES
    // ═══════════════════════════════════════════
    {
      id: "section-calc",
      type: "section_header",
      icon: "🧮",
      title: "Sig Figs in Calculations",
      subtitle: "~10 minutes"
    },
    {
      id: "b-calc-rules",
      type: "text",
      content: "When you do math with measurements, the answer can't be more precise than the least precise input:\n\n**Multiplication & Division:** Your answer gets the **fewest sig figs** of any input.\n\n→ 4.56 × 1.4 = 6.384 → round to **6.4** (2 sig figs, because 1.4 has only 2)\n\n**Addition & Subtraction:** Your answer gets the **fewest decimal places** of any input.\n\n→ 12.52 + 1.1 = 13.62 → round to **13.6** (1 decimal place, because 1.1 has only 1)\n\n**Why?** You can't claim more precision than your weakest measurement. If one of your inputs only has 2 sig figs, your answer can't magically have 5."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate 3.24 × 7.1 and round to the correct number of significant figures. Show which input limits your answer.",
      placeholder: "3.24 × 7.1 = ... → rounded to ...",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate 45.823 + 0.2 and round to the correct number of decimal places. Show your reasoning.",
      placeholder: "45.823 + 0.2 = ... → rounded to ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Key takeaways:\n\n- **Accuracy** = close to the true value. **Precision** = consistent/detailed measurements\n- **Sig figs** = the meaningful digits in a measurement (known + one estimated)\n- **Multiplication/division** → use the fewest sig figs\n- **Addition/subtraction** → use the fewest decimal places\n- You can't claim more precision than your measuring tool provides\n\n**Next up:** How do graphs reveal hidden relationships in data?"
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** No — you should NOT report 10 decimal places when your ruler only measures to millimeters. If your radius measurement has 3 sig figs, your area calculation should also have 3 sig figs. Your calculator gives you more digits, but those extra digits are meaningless — they suggest a precision your measurement never had."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student calculates the area of a circle as 78.53981633 cm². Their radius measurement was 5.0 cm (measured with a ruler). What should they report as the area, and why?",
      placeholder: "The student should report...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Significant figures", definition: "The digits in a measurement that are known reliably plus one estimated digit." },
        { term: "Accuracy", definition: "How close a measurement is to the true value." },
        { term: "Precision", definition: "How close repeated measurements are to each other; the level of detail in a measurement." },
        { term: "Leading zeros", definition: "Zeros before the first non-zero digit (e.g., 0.0042). They don't count as significant figures." },
        { term: "Trailing zeros", definition: "Zeros at the end of a number. After a decimal point they count; without a decimal point they're ambiguous." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "sig-figs", lesson);
    console.log('✅ Lesson "Significant Figures & Precision" seeded successfully!');
    console.log("   Path: courses/physics/lessons/sig-figs");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
