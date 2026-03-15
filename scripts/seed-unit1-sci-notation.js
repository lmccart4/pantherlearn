// seed-unit1-sci-notation.js
// Creates "Scientific Notation & Problem-Solving" lesson (Unit 1, Lesson 5)
// Run: node scripts/seed-unit1-sci-notation.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Scientific Notation & Problem-Solving",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 5,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🚀",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Quick — write down these numbers:\n\n- The distance from Earth to the Sun: 149,600,000,000 meters\n- The mass of a proton: 0.00000000000000000000000000167 kg\n\nThat's painful. Scientists deal with numbers this extreme every day. There has to be a better way — and there is."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** The distance from Earth to the Sun is 149,600,000,000 meters. The mass of a proton is 0.00000000000000000000000000167 kg. How do scientists work with numbers this extreme without going insane?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Why would writing out all the zeros in very large or very small numbers be a problem for scientists? What could go wrong?",
      placeholder: "Explain the problems with writing out extreme numbers...",
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
        "Convert numbers to and from scientific notation",
        "Perform calculations with numbers in scientific notation",
        "Apply a structured problem-solving framework (GUESS method)",
        "Solve multi-step physics word problems using dimensional analysis and proper units"
      ]
    },

    // ═══════════════════════════════════════════
    // SCIENTIFIC NOTATION
    // ═══════════════════════════════════════════
    {
      id: "section-notation",
      type: "section_header",
      icon: "🔢",
      title: "Scientific Notation",
      subtitle: "~12 minutes"
    },
    {
      id: "b-notation-def",
      type: "definition",
      term: "Scientific notation",
      definition: "A way to express very large or very small numbers as a × 10ⁿ, where 1 ≤ a < 10 and n is an integer."
    },
    {
      id: "b-notation",
      type: "text",
      content: "**The format:** a × 10ⁿ\n- **a** = a number between 1 and 10 (the coefficient)\n- **n** = the power of 10 (the exponent)\n\n**Converting to scientific notation:**\n1. Move the decimal point until you have a number between 1 and 10\n2. Count how many places you moved the decimal\n3. If you moved left → positive exponent. If you moved right → negative exponent.\n\n**Examples:**\n- 149,600,000,000 = **1.496 × 10¹¹** (moved decimal 11 places left)\n- 0.00000000167 = **1.67 × 10⁻⁹** (moved decimal 9 places right)\n- 300,000,000 = **3.0 × 10⁸** (the speed of light in m/s)"
    },
    {
      id: "q-convert-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is 0.000045 in scientific notation?",
      options: [
        "45 × 10⁻⁶",
        "4.5 × 10⁵",
        "4.5 × 10⁻⁵",
        "0.45 × 10⁻⁴"
      ],
      correctIndex: 2,
      explanation: "Move the decimal 5 places to the right to get 4.5. Since we moved right, the exponent is negative: 4.5 × 10⁻⁵. Remember: the coefficient must be between 1 and 10, so 45 × 10⁻⁶ and 0.45 × 10⁻⁴ are NOT proper scientific notation.",
      difficulty: "apply"
    },
    {
      id: "q-convert-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Convert 6,370,000 meters (the radius of Earth) to scientific notation.",
      placeholder: "6,370,000 m = ... × 10... m",
      difficulty: "apply"
    },
    {
      id: "b-calc-rules",
      type: "text",
      content: "**Math with scientific notation:**\n\n**Multiplication:** Multiply coefficients, ADD exponents\n→ (3 × 10⁴) × (2 × 10³) = 6 × 10⁷\n\n**Division:** Divide coefficients, SUBTRACT exponents\n→ (8 × 10⁶) ÷ (4 × 10²) = 2 × 10⁴\n\n**Addition/Subtraction:** Make exponents the same first, then add/subtract coefficients\n→ 3.2 × 10⁴ + 1.5 × 10³ = 3.2 × 10⁴ + 0.15 × 10⁴ = 3.35 × 10⁴"
    },
    {
      id: "q-calc",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate (6.0 × 10⁸) × (3.0 × 10⁻²). Show your work.",
      placeholder: "Multiply coefficients, add exponents...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // GUESS METHOD
    // ═══════════════════════════════════════════
    {
      id: "section-guess",
      type: "section_header",
      icon: "🧩",
      title: "The GUESS Problem-Solving Method",
      subtitle: "~15 minutes"
    },
    {
      id: "b-guess",
      type: "text",
      content: "Physics problems can feel overwhelming — but they all follow the same structure. The **GUESS method** gives you a step-by-step framework:\n\n| Step | What to do |\n|---|---|\n| **G** — Given | List what information the problem gives you (with units!) |\n| **U** — Unknown | Identify what you're solving for |\n| **E** — Equation | Write the equation that connects the given and unknown |\n| **S** — Substitute | Plug in the numbers with their units |\n| **S** — Solve | Calculate the answer and include units |\n\n**Every physics problem this year uses GUESS.** Master it now and you'll have a clear path through even the hardest problems."
    },
    {
      id: "callout-guess",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Key habits for problem-solving:**\n1. Always write units in every step\n2. Check: does the answer make sense? (A car going 50,000 m/s? Probably wrong.)\n3. Circle your final answer with units\n4. Show your work — partial credit only counts if the teacher can see your thinking"
    },
    {
      id: "b-example",
      type: "text",
      content: "**Example:** A car travels 150 km in 2.0 hours. What is its average speed in m/s?\n\n**G:** distance = 150 km = 150,000 m; time = 2.0 h = 7,200 s\n\n**U:** speed = ?\n\n**E:** speed = distance / time\n\n**S:** speed = 150,000 m / 7,200 s\n\n**S:** speed = 20.8 m/s ≈ **21 m/s** (2 sig figs)\n\nNotice: we converted units FIRST (km → m, hours → s), then plugged in. Always convert to SI before calculating."
    },
    {
      id: "q-guess-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Use the GUESS method: A runner completes a 5.0 km race in 25 minutes. What is her average speed in m/s? Show all 5 steps.",
      placeholder: "G: ...\nU: ...\nE: ...\nS: ...\nS: ...",
      difficulty: "apply"
    },
    {
      id: "q-guess-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Use the GUESS method: A bus accelerates from rest at 2.5 m/s². How fast is it going after 8.0 seconds? (Use v = at) Show all 5 steps.",
      placeholder: "G: ...\nU: ...\nE: ...\nS: ...\nS: ...",
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
      subtitle: "~3 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Key takeaways:\n\n- **Scientific notation** (a × 10ⁿ) makes extreme numbers manageable\n- Multiply: multiply coefficients, add exponents. Divide: divide coefficients, subtract exponents\n- The **GUESS method** is your framework for every physics problem: Given, Unknown, Equation, Substitute, Solve\n- Always show work, always include units, always check if the answer makes sense\n\n**The GUESS method is your best friend this year.** Every physics problem — from kinematics to circuits to waves — follows this same structure.\n\n**Next up:** Proportional reasoning — the most important thinking skill in physics."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: The speed of light is 3.0 × 10⁸ m/s. How far does light travel in 1.0 minute? Use the GUESS method and give your answer in scientific notation.",
      placeholder: "G: ...\nU: ...\nE: ...\nS: ...\nS: ...",
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
        { term: "Scientific notation", definition: "A way to express very large or small numbers as a × 10ⁿ where 1 ≤ a < 10." },
        { term: "Coefficient", definition: "The number in front of × 10ⁿ in scientific notation. Must be between 1 and 10." },
        { term: "Exponent", definition: "The power of 10 in scientific notation. Positive for large numbers, negative for small numbers." },
        { term: "GUESS method", definition: "A structured problem-solving framework: Given, Unknown, Equation, Substitute, Solve." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("sci-notation-problem-solving")
      .set(lesson);
    console.log('✅ Lesson "Scientific Notation & Problem-Solving" seeded successfully!');
    console.log("   Path: courses/physics/lessons/sci-notation-problem-solving");
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
