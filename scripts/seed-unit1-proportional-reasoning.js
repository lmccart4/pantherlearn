// seed-unit1-proportional-reasoning.js
// Creates "Proportional Reasoning" lesson (Unit 1, Lesson 6)
// Run: node scripts/seed-unit1-proportional-reasoning.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Proportional Reasoning",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 6,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "⚡",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "You're driving at 30 mph and you slam the brakes. It takes about 45 feet to stop. Now you're driving at 60 mph — exactly double the speed. How much further does it take to stop?\n\nMost people guess 90 feet (double). The actual answer? About **180 feet** — four times as far. Why? Because stopping distance depends on **speed squared**, not speed. This is proportional reasoning in action."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you double the speed of a car, does the stopping distance double too? (Spoiler: it quadruples. Why? Proportional reasoning.)"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "If you earn $15/hour and work twice as many hours, how much more do you earn? What about if you earn $15/hour and your hourly rate doubles — how much more do you earn? Are these the same thing?",
      placeholder: "Explain the difference...",
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
        "Identify direct, inverse, and squared proportional relationships",
        "Predict how changing one variable affects another using proportionality",
        "Apply proportional reasoning without plugging in numbers",
        "Connect proportional reasoning to graph shapes"
      ]
    },

    // ═══════════════════════════════════════════
    // DIRECT PROPORTION
    // ═══════════════════════════════════════════
    {
      id: "section-direct",
      type: "section_header",
      icon: "📈",
      title: "Direct Proportion",
      subtitle: "~8 minutes"
    },
    {
      id: "b-direct",
      type: "text",
      content: "**Direct proportion: y ∝ x**\n\nTwo quantities are **directly proportional** when one increases, the other increases by the same factor.\n\n- Double x → double y\n- Triple x → triple y\n- Halve x → halve y\n\n**Graph shape:** Straight line through the origin\n\n**Physics example:** F = ma (force is directly proportional to acceleration, when mass is constant)\n→ Double the acceleration → double the force\n→ Triple the acceleration → triple the force\n\nDirect proportion is the most intuitive type — it's what most people expect by default."
    },
    {
      id: "q-direct",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Ohm's Law says V = IR (voltage = current × resistance). If resistance stays the same and you triple the current, what happens to the voltage?",
      options: [
        "Voltage stays the same",
        "Voltage doubles",
        "Voltage triples",
        "Voltage is cut to one-third"
      ],
      correctIndex: 2,
      explanation: "V = IR is a direct proportion between voltage and current (when R is constant). Triple I → triple V. This is a linear relationship — the graph of V vs I is a straight line with slope = R.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // INVERSE PROPORTION
    // ═══════════════════════════════════════════
    {
      id: "section-inverse",
      type: "section_header",
      icon: "📉",
      title: "Inverse Proportion",
      subtitle: "~8 minutes"
    },
    {
      id: "b-inverse",
      type: "text",
      content: "**Inverse proportion: y ∝ 1/x**\n\nTwo quantities are **inversely proportional** when one increases, the other decreases by the same factor.\n\n- Double x → halve y\n- Triple x → y becomes one-third\n- Halve x → double y\n\n**Graph shape:** Hyperbola (curves down, approaches but never reaches the axes)\n\n**Physics example:** F = ma rearranged as a = F/m (acceleration is inversely proportional to mass, when force is constant)\n→ Double the mass → halve the acceleration\n→ Triple the mass → acceleration drops to one-third\n\nThis is why a truck accelerates slower than a sports car with the same engine force — more mass means less acceleration."
    },
    {
      id: "q-inverse",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You push a shopping cart with a constant force. If you load the cart until it's 4 times heavier, what happens to its acceleration?",
      options: [
        "Acceleration quadruples",
        "Acceleration doubles",
        "Acceleration drops to 1/4",
        "Acceleration stays the same"
      ],
      correctIndex: 2,
      explanation: "a = F/m — acceleration is inversely proportional to mass. If mass is multiplied by 4, acceleration is divided by 4. More mass = harder to accelerate.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SQUARED PROPORTIONS
    // ═══════════════════════════════════════════
    {
      id: "section-squared",
      type: "section_header",
      icon: "📊",
      title: "Squared & Inverse Square",
      subtitle: "~10 minutes"
    },
    {
      id: "b-squared",
      type: "text",
      content: "**Squared proportion: y ∝ x²**\n\nWhen y depends on x squared, changes get amplified:\n\n- Double x → **quadruple** y (2² = 4)\n- Triple x → y increases **9×** (3² = 9)\n- Halve x → y drops to **one-quarter** (½² = ¼)\n\n**Graph shape:** Parabola\n\n**Physics examples:**\n- KE = ½mv² → double speed, **4× the kinetic energy**\n- d = ½at² → double time, **4× the distance**\n- Stopping distance ∝ v² → that's why doubling speed quadruples stopping distance"
    },
    {
      id: "b-inverse-squared",
      type: "text",
      content: "**Inverse square proportion: y ∝ 1/x²**\n\nThe steepest drop-off:\n\n- Double x → y drops to **one-quarter** (1/2² = 1/4)\n- Triple x → y drops to **one-ninth** (1/3² = 1/9)\n\n**Graph shape:** Steep decay curve\n\n**Physics examples:**\n- Coulomb's Law: F = kq₁q₂/r² → double the distance between charges, force drops to **1/4**\n- Gravitational force: F = Gm₁m₂/r² → same pattern"
    },
    {
      id: "q-squared-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A car is moving at 20 m/s and has kinetic energy of 40,000 J. If the car speeds up to 40 m/s (doubles its speed), what is the new kinetic energy?",
      options: [
        "80,000 J (doubled)",
        "120,000 J (tripled)",
        "160,000 J (quadrupled)",
        "40,000 J (unchanged)"
      ],
      correctIndex: 2,
      explanation: "KE ∝ v² — kinetic energy depends on the square of speed. Double the speed → 2² = 4× the kinetic energy. 40,000 × 4 = 160,000 J. This is why highway crashes are so much more destructive than low-speed fender benders.",
      difficulty: "apply"
    },
    {
      id: "q-squared-2",
      type: "question",
      questionType: "short_answer",
      prompt: "The gravitational force between two objects is 100 N when they are 2 meters apart. If you move them to 6 meters apart (3× the distance), what is the new force? Show your proportional reasoning.",
      placeholder: "Force ∝ 1/r², so tripling r means...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SUMMARY TABLE
    // ═══════════════════════════════════════════
    {
      id: "section-summary-table",
      type: "section_header",
      icon: "📋",
      title: "Proportionality Summary",
      subtitle: ""
    },
    {
      id: "b-table",
      type: "text",
      content: "| Type | Notation | Double x → y becomes | Graph Shape | Physics Example |\n|---|---|---|---|---|\n| Direct | y ∝ x | 2× (doubles) | Straight line | F = ma |\n| Inverse | y ∝ 1/x | ½ (halves) | Hyperbola | a = F/m |\n| Squared | y ∝ x² | 4× (quadruples) | Parabola | KE = ½mv² |\n| Inverse square | y ∝ 1/x² | ¼ (quarters) | Steep decay | F = kq₁q₂/r² |"
    },
    {
      id: "callout-master",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Proportional reasoning is the most important thinking skill in physics.** You'll use it with kinematics (v ∝ t), forces (F = ma), energy (KE ∝ v²), Coulomb's Law (F ∝ 1/r²), Ohm's Law (V = IR), and waves (v = fλ). Master it now and the rest of the year clicks into place."
    },

    // ═══════════════════════════════════════════
    // SORTING ACTIVITY
    // ═══════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      icon: "🎮",
      title: "Practice: Identify the Proportion",
      subtitle: "~5 minutes"
    },
    {
      id: "sorting-proportions",
      type: "sorting",
      title: "Sort each relationship: Direct (→) or Inverse (←)?",
      leftLabel: "Direct (y ∝ x)",
      rightLabel: "Inverse (y ∝ 1/x)",
      items: [
        { text: "F = ma → force vs acceleration (constant mass)", correct: "left" },
        { text: "a = F/m → acceleration vs mass (constant force)", correct: "right" },
        { text: "v = d/t → speed vs distance (constant time)", correct: "left" },
        { text: "t = d/v → time vs speed (constant distance)", correct: "right" },
        { text: "V = IR → voltage vs current (constant resistance)", correct: "left" },
        { text: "R = V/I → resistance vs current (constant voltage)", correct: "right" }
      ]
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
      content: "Key takeaways:\n\n- **Direct proportion** (y ∝ x): double x → double y → straight line\n- **Inverse proportion** (y ∝ 1/x): double x → halve y → hyperbola\n- **Squared proportion** (y ∝ x²): double x → quadruple y → parabola\n- **Inverse square** (y ∝ 1/x²): double x → quarter y → steep decay\n- Proportional reasoning lets you predict outcomes WITHOUT a calculator\n\nThis skill shows up in **every single unit** for the rest of the year. If you get good at this, physics becomes a lot more intuitive."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** Stopping distance depends on speed squared (d ∝ v²). So doubling speed from 30 to 60 mph means 2² = 4× the stopping distance: 45 ft → 180 ft. This is why speeding is exponentially more dangerous — a small increase in speed causes a disproportionately large increase in stopping distance."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Without doing any math, predict — if you triple the speed of an object, what happens to its kinetic energy (KE = ½mv²)? Explain your proportional reasoning.",
      placeholder: "If speed triples, KE becomes...",
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
        { term: "Direct proportion", definition: "y ∝ x — when x doubles, y doubles (linear relationship)." },
        { term: "Inverse proportion", definition: "y ∝ 1/x — when x doubles, y halves (hyperbolic relationship)." },
        { term: "Squared proportion", definition: "y ∝ x² — when x doubles, y quadruples (quadratic relationship)." },
        { term: "Inverse square", definition: "y ∝ 1/x² — when x doubles, y drops to one-quarter. Common in force laws (gravity, electrostatics)." },
        { term: "Proportional reasoning", definition: "Predicting how changing one variable affects another without plugging in numbers — using the mathematical relationship." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("proportional-reasoning")
      .set(lesson);
    console.log('✅ Lesson "Proportional Reasoning" seeded successfully!');
    console.log("   Path: courses/physics/lessons/proportional-reasoning");
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
