// seed-unit1-measurement-and-units.js
// Creates "Measurement & Units" lesson (Unit 1, Lesson 2)
// Run: node scripts/seed-unit1-measurement-and-units.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Measurement & Units",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 2,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "📏",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "In 1999, NASA's Mars Climate Orbiter approached Mars after a 9-month journey. One engineering team had calculated thrust in **pound-force seconds** (imperial). Another team expected the data in **newton-seconds** (metric). Nobody caught the mismatch.\n\nThe spacecraft entered the atmosphere at the wrong angle and burned up. **$125 million — gone — because of a unit conversion error.**"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A NASA spacecraft crashed into Mars in 1999 because one team used metric units and another used imperial. How can units — just labels on numbers — cause a $125 million disaster?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, why would using two different unit systems cause a spacecraft to crash? What went wrong?",
      placeholder: "Explain why the unit mismatch caused the crash...",
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
        "Identify SI base units for length (meter), mass (kilogram), and time (second)",
        "Convert between metric prefixes (kilo, centi, milli, micro)",
        "Use dimensional analysis (factor-label method) to convert units",
        "Explain why consistent units are essential in physics"
      ]
    },

    // ═══════════════════════════════════════════
    // SI SYSTEM
    // ═══════════════════════════════════════════
    {
      id: "section-si",
      type: "section_header",
      icon: "📐",
      title: "The SI System",
      subtitle: "~10 minutes"
    },
    {
      id: "b-si-text",
      type: "text",
      content: "In physics, we use the **SI system** (Système International) — the universal language of science. Three base units you'll use constantly:\n\n| Quantity | SI Unit | Symbol |\n|---|---|---|\n| Length | meter | m |\n| Mass | kilogram | kg |\n| Time | second | s |\n\nEvery other unit in physics is built from these. Speed? meters per second (m/s). Force? kg·m/s² (we call it a Newton). Energy? kg·m²/s² (we call it a Joule).\n\n**Rule #1 in physics: always use SI units in calculations.** If a problem gives you kilometers, convert to meters first. If it gives you grams, convert to kilograms. If it gives you minutes, convert to seconds."
    },
    {
      id: "q-si",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which set of units are the SI base units for length, mass, and time?",
      options: [
        "feet, pounds, minutes",
        "centimeters, grams, hours",
        "meters, kilograms, seconds",
        "kilometers, metric tons, milliseconds"
      ],
      correctIndex: 2,
      explanation: "The SI base units are meters (m) for length, kilograms (kg) for mass, and seconds (s) for time. All other physics units are derived from these three. Always convert to SI before calculating.",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // METRIC PREFIXES
    // ═══════════════════════════════════════════
    {
      id: "section-prefixes",
      type: "section_header",
      icon: "🔢",
      title: "Metric Prefixes",
      subtitle: "~10 minutes"
    },
    {
      id: "b-prefixes",
      type: "text",
      content: "Metric prefixes scale units by powers of 10. Here are the ones you need to know:\n\n| Prefix | Symbol | Factor | Example |\n|---|---|---|---|\n| kilo- | k | 10³ = 1,000 | 1 km = 1,000 m |\n| centi- | c | 10⁻² = 0.01 | 1 cm = 0.01 m |\n| milli- | m | 10⁻³ = 0.001 | 1 mm = 0.001 m |\n| micro- | μ | 10⁻⁶ = 0.000001 | 1 μm = 0.000001 m |\n| nano- | n | 10⁻⁹ | 1 nm = 0.000000001 m |\n\nThe beauty of metric: everything is powers of 10. No 12 inches in a foot, no 5,280 feet in a mile. Just move the decimal point."
    },
    {
      id: "q-prefix-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How many meters is 2.5 kilometers?",
      options: [
        "25 m",
        "250 m",
        "2,500 m",
        "25,000 m"
      ],
      correctIndex: 2,
      explanation: "Kilo means 1,000. So 2.5 km × 1,000 m/km = 2,500 m. Moving from a larger unit to a smaller unit means multiplying — the number gets bigger.",
      difficulty: "apply"
    },
    {
      id: "q-prefix-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A strand of human hair is about 75 μm (micrometers) thick. How many meters is that?",
      options: [
        "0.075 m",
        "0.0075 m",
        "0.000075 m",
        "0.00000075 m"
      ],
      correctIndex: 2,
      explanation: "Micro (μ) means 10⁻⁶ = 0.000001. So 75 μm × 0.000001 m/μm = 0.000075 m. That's incredibly thin — about 7.5 hundredths of a millimeter.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // DIMENSIONAL ANALYSIS
    // ═══════════════════════════════════════════
    {
      id: "section-dimensional",
      type: "section_header",
      icon: "🔄",
      title: "Dimensional Analysis",
      subtitle: "~15 minutes"
    },
    {
      id: "b-dimensional",
      type: "text",
      content: "**Dimensional analysis** (also called the **factor-label method**) is a foolproof way to convert units. The idea: multiply by fractions that equal 1, and let the units cancel.\n\n**Example:** Convert 72 km/h to m/s.\n\n```\n72 km/h × (1,000 m / 1 km) × (1 h / 3,600 s) = 20 m/s\n```\n\nNotice how km cancels with km, and h cancels with h, leaving you with m/s.\n\n**Steps:**\n1. Write the starting value with its units\n2. Multiply by conversion factors written as fractions\n3. Arrange each fraction so the unit you want to cancel is in the opposite position (top/bottom)\n4. Cancel units and compute the number"
    },
    {
      id: "callout-tip",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Pro tip:** If you set up your conversion factors correctly, the units TELL you whether your math is right. If the units cancel and you end up with what you wanted, you did it right. If the units don't cancel — something's wrong. This is why units are your best friend in physics."
    },
    {
      id: "q-conversion-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Convert 5.2 km to meters using dimensional analysis. Show your work with units.",
      placeholder: "5.2 km × (...) = ... m",
      difficulty: "apply"
    },
    {
      id: "q-conversion-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Convert 90 km/h to m/s using dimensional analysis. Show your work with units.",
      placeholder: "90 km/h × (...) × (...) = ... m/s",
      difficulty: "apply"
    },
    {
      id: "q-conversion-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A sprinter runs 100 meters in 9.8 seconds. Convert this speed to km/h. Show your work.",
      placeholder: "100 m / 9.8 s = ... m/s → ... km/h",
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
      content: "Key takeaways:\n\n- **SI units** (meter, kilogram, second) are the standard in physics — always convert before calculating\n- **Metric prefixes** scale units by powers of 10 (kilo = 10³, milli = 10⁻³, micro = 10⁻⁶)\n- **Dimensional analysis** uses conversion factors as fractions to systematically convert units\n- Units are not just labels — they carry physical meaning and must be consistent\n\n**A number without units is meaningless in physics.**\n\n**Next up:** How precise should your answer be? Significant figures and the difference between accuracy and precision."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** The Mars Climate Orbiter crashed because one team used imperial units (pound-force seconds) and another expected metric (newton-seconds). The navigation software received incorrect thrust values, causing the spacecraft to fly too close to Mars and disintegrate. Units matter — they're not just labels, they define what the numbers mean."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Why is it so important to always include units in every physics calculation? Give a real-world example of what could go wrong if you don't.",
      placeholder: "Explain why units are essential...",
      difficulty: "understand"
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
        { term: "SI units", definition: "The International System of Units — the standard measurement system used in science (meter, kilogram, second)." },
        { term: "Metric prefix", definition: "Prefixes that scale SI units by powers of 10 (kilo = 10³, milli = 10⁻³, micro = 10⁻⁶, etc.)." },
        { term: "Dimensional analysis", definition: "A method of converting units by multiplying by conversion factors that equal 1, allowing units to cancel systematically." },
        { term: "Conversion factor", definition: "A fraction equal to 1 used to convert between units (e.g., 1000 m / 1 km)." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "measurement-and-units", lesson);
    console.log('✅ Lesson "Measurement & Units" seeded successfully!');
    console.log("   Path: courses/physics/lessons/measurement-and-units");
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
