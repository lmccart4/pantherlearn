// seed-unit1-assessment.js
// Creates "Unit 1 Assessment" lesson (Introduction to Physics, Lesson 7)
// Run: node scripts/seed-unit1-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Unit 1 Assessment: Introduction to Physics",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 7,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // INTRO
    // ═══════════════════════════════════════════
    {
      id: "section-intro",
      type: "section_header",
      icon: "📝",
      title: "Unit 1 Assessment",
      subtitle: "~40 minutes"
    },
    {
      id: "b-intro",
      type: "text",
      content: "This assessment covers the foundational skills from Unit 1:\n- Measurement & SI Units\n- Significant Figures & Precision\n- Graphing & Relationships\n- Scientific Notation\n- Problem Solving (GUESS Method)\n- Proportional Reasoning\n\nThese skills are used in **every single unit** for the rest of the year. Show your work on all calculation problems."
    },
    {
      id: "callout-instructions",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Tips:** Always include units. Show your work using the GUESS method where applicable. For proportional reasoning questions, explain your logic — don't just state the answer."
    },

    // ═══════════════════════════════════════════
    // SECTION 1: MEASUREMENT & UNITS (~20%)
    // ═══════════════════════════════════════════
    {
      id: "section-1",
      type: "section_header",
      icon: "📏",
      title: "Section 1: Measurement & Units",
      subtitle: "4 questions · ~20%"
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which set contains ONLY SI base units?",
      options: [
        "meter, gram, second",
        "meter, kilogram, second",
        "centimeter, kilogram, minute",
        "kilometer, kilogram, second"
      ],
      correctIndex: 1,
      explanation: "The SI base units are meter (m) for length, kilogram (kg) for mass, and second (s) for time. Gram, centimeter, kilometer, and minute are NOT base units — they're either derived or non-SI.",
      difficulty: "remember"
    },
    {
      id: "q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The prefix \"milli-\" means:",
      options: [
        "One thousand (10³)",
        "One hundredth (10⁻²)",
        "One thousandth (10⁻³)",
        "One millionth (10⁻⁶)"
      ],
      correctIndex: 2,
      explanation: "Milli- = 10⁻³ = 0.001. So 1 millimeter = 0.001 meters, or equivalently, 1 meter = 1,000 millimeters.",
      difficulty: "remember"
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "Convert 45 km/h to m/s using dimensional analysis. Show your conversion factors with units.",
      placeholder: "45 km/h × (...) × (...) = ... m/s",
      difficulty: "apply"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "The Mars Climate Orbiter crashed because of a unit mismatch between teams. Why is it so important to always use consistent units in physics? Give a specific reason.",
      placeholder: "Consistent units are important because...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: SIGNIFICANT FIGURES (~15%)
    // ═══════════════════════════════════════════
    {
      id: "section-2",
      type: "section_header",
      icon: "🔍",
      title: "Section 2: Significant Figures",
      subtitle: "3 questions · ~15%"
    },
    {
      id: "q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How many significant figures does 0.00820 have?",
      options: [
        "2",
        "3",
        "4",
        "5"
      ],
      correctIndex: 1,
      explanation: "Leading zeros don't count (they're placeholders). The significant digits are 8, 2, and the trailing 0 (trailing zeros after a decimal count). So 0.00820 has 3 sig figs.",
      difficulty: "apply"
    },
    {
      id: "q6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student measures two sides of a rectangle: 4.52 cm and 2.1 cm. They multiply to find the area. How many significant figures should the answer have?",
      options: [
        "2 — limited by 2.1",
        "3 — limited by 4.52",
        "5 — add them together",
        "It doesn't matter"
      ],
      correctIndex: 0,
      explanation: "For multiplication and division, the answer gets the fewest sig figs of any input. 4.52 has 3 sig figs; 2.1 has 2 sig figs. The answer should have 2 sig figs: 4.52 × 2.1 = 9.492 → 9.5 cm².",
      difficulty: "apply"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "A student calculates the speed of a ball as 12.4563 m/s. The distance was measured as 5.0 m and the time as 0.402 s. How many sig figs should the answer have? What should the student report?",
      placeholder: "The answer should have ... sig figs because... Report: ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: GRAPHING (~20%)
    // ═══════════════════════════════════════════
    {
      id: "section-3",
      type: "section_header",
      icon: "📊",
      title: "Section 3: Graphing",
      subtitle: "4 questions · ~20%"
    },
    {
      id: "q8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "On a graph labeled \"Position vs Time,\" which variable is on the y-axis?",
      options: [
        "Time — because time always goes on y",
        "Position — because in \"Y vs X\" format, the first variable is on the y-axis",
        "Neither — the graph title doesn't tell you which axis is which",
        "Both — they share an axis"
      ],
      correctIndex: 1,
      explanation: "In physics, graph titles follow the format \"Y vs X.\" So \"Position vs Time\" means position is on the y-axis (dependent variable) and time is on the x-axis (independent variable).",
      difficulty: "remember"
    },
    {
      id: "q9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A position vs time graph shows a straight line with a slope of 12 m/s. What does the slope represent?",
      options: [
        "The object's acceleration",
        "The object's mass",
        "The object's velocity (constant speed of 12 m/s)",
        "The object's position at time = 0"
      ],
      correctIndex: 2,
      explanation: "On a position vs time graph, slope = Δposition/Δtime = velocity. A constant slope of 12 m/s means the object moves at a constant speed of 12 m/s. The slope tells you the rate of change of the quantity on the y-axis.",
      difficulty: "understand"
    },
    {
      id: "q10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A graph of distance vs time² is a straight line. What type of relationship exists between distance and time?",
      options: [
        "Linear (d ∝ t)",
        "Quadratic (d ∝ t²)",
        "Inverse (d ∝ 1/t)",
        "No relationship"
      ],
      correctIndex: 1,
      explanation: "If plotting distance vs time² gives a straight line, that means distance is directly proportional to time² (d ∝ t²) — a quadratic relationship. This is exactly what happens with constant acceleration: d = ½at².",
      difficulty: "apply"
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "A velocity vs time graph shows a constant velocity of 5 m/s from t = 0 to t = 10 s. What is the displacement? Explain how you used the graph to find this.",
      placeholder: "Displacement = ... because...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 4: SCIENTIFIC NOTATION (~15%)
    // ═══════════════════════════════════════════
    {
      id: "section-4",
      type: "section_header",
      icon: "🔢",
      title: "Section 4: Scientific Notation",
      subtitle: "3 questions · ~15%"
    },
    {
      id: "q12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is 0.000072 in proper scientific notation?",
      options: [
        "72 × 10⁻⁶",
        "7.2 × 10⁻⁵",
        "7.2 × 10⁵",
        "0.72 × 10⁻⁴"
      ],
      correctIndex: 1,
      explanation: "Move the decimal 5 places right to get 7.2 (a number between 1 and 10). Since we moved right, the exponent is negative: 7.2 × 10⁻⁵. The coefficient must be between 1 and 10 for proper scientific notation.",
      difficulty: "apply"
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "Calculate (4.0 × 10⁵) × (3.0 × 10⁻²). Show your work (multiply coefficients, add exponents).",
      placeholder: "Coefficients: 4.0 × 3.0 = ... Exponents: 5 + (-2) = ... Answer: ...",
      difficulty: "apply"
    },
    {
      id: "q14",
      type: "question",
      questionType: "short_answer",
      prompt: "The speed of light is 3.0 × 10⁸ m/s. The distance from the Sun to Earth is 1.5 × 10¹¹ m. How many seconds does it take light to reach Earth? Show your work in scientific notation.",
      placeholder: "time = distance / speed = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 5: PROBLEM SOLVING & PROPORTIONAL REASONING (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-5",
      type: "section_header",
      icon: "🧩",
      title: "Section 5: Problem Solving & Proportional Reasoning",
      subtitle: "5 questions · ~25%"
    },
    {
      id: "q15",
      type: "question",
      questionType: "short_answer",
      prompt: "Use the GUESS method: A cyclist travels 36 km in 1.5 hours. What is her average speed in m/s? Show all 5 steps including unit conversions.",
      placeholder: "G: ...\nU: ...\nE: ...\nS: ...\nS: ...",
      difficulty: "apply"
    },
    {
      id: "q16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "F = ma. If you keep the mass constant and TRIPLE the force, what happens to the acceleration?",
      options: [
        "Acceleration is cut to one-third",
        "Acceleration stays the same",
        "Acceleration triples",
        "Acceleration increases by 9×"
      ],
      correctIndex: 2,
      explanation: "F = ma is a direct proportion between force and acceleration (when mass is constant). Triple F → triple a. Force and acceleration change by the same factor.",
      difficulty: "apply"
    },
    {
      id: "q17",
      type: "question",
      questionType: "multiple_choice",
      prompt: "KE = ½mv². If you triple the speed of an object (keeping mass the same), the kinetic energy:",
      options: [
        "Triples",
        "Increases 6×",
        "Increases 9×",
        "Stays the same"
      ],
      correctIndex: 2,
      explanation: "KE ∝ v² — kinetic energy depends on speed SQUARED. Triple the speed → 3² = 9× the kinetic energy. This is a squared proportion.",
      difficulty: "apply"
    },
    {
      id: "q18",
      type: "question",
      questionType: "short_answer",
      prompt: "The gravitational force between two objects is 200 N when they are 1 meter apart. Gravitational force follows an inverse square law (F ∝ 1/r²). What is the force when they are 4 meters apart? Show your proportional reasoning.",
      placeholder: "r changes by a factor of ..., so F changes by...",
      difficulty: "apply"
    },
    {
      id: "q19",
      type: "question",
      questionType: "short_answer",
      prompt: "Without plugging in numbers, explain: why is it that doubling your speed on the highway more than doubles your stopping distance? Which proportional relationship is at work?",
      placeholder: "Stopping distance depends on speed in this way: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // BONUS
    // ═══════════════════════════════════════════
    {
      id: "section-bonus",
      type: "section_header",
      icon: "⭐",
      title: "Bonus Question",
      subtitle: "+5%"
    },
    {
      id: "q-bonus",
      type: "question",
      questionType: "short_answer",
      prompt: "A student is told that a ball was launched horizontally at 15.0 m/s from a height of 20 m. They need to find how far the ball travels horizontally before hitting the ground. They'll need: t = √(2h/g) where g = 9.8 m/s², then d = v × t. Use the GUESS method, sig figs, and proper units to solve this multi-step problem completely.",
      placeholder: "Step 1: Find time using t = √(2h/g)...\nStep 2: Find distance using d = v × t...",
      difficulty: "create"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("unit1-assessment")
      .set(lesson);
    console.log('✅ Lesson "Unit 1 Assessment" seeded successfully!');
    console.log("   Path: courses/physics/lessons/unit1-assessment");
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
