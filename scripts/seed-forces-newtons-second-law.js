// seed-forces-newtons-second-law.js
// Creates "Newton's Second Law: Testing Acceleration Patterns" lesson (Unit 4: Forces, Lesson 5)
// Run: node scripts/seed-forces-newtons-second-law.js
// Modeling/inquiry style — testing experiment: vary force or mass, observe acceleration

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Newton's Second Law: Testing Acceleration Patterns",
  questionOfTheDay: "If you push a shopping cart and a car with the same force, which one accelerates more? What does that tell you about the relationship between force, mass, and acceleration?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 5,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏃",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you push a shopping cart and a car with the same force, which one accelerates more? What does that tell you about the relationship between force, mass, and acceleration?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "You're trying to push two boxes — one weighs 5 kg, the other weighs 50 kg — with the same force. Predict: how does the acceleration of each compare? What would you expect to see?",
      placeholder: "The lighter box would... The heavier box would... Because...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "State Newton's Second Law: F = ma",
        "Identify how increasing force affects acceleration (with constant mass)",
        "Identify how increasing mass affects acceleration (with constant force)",
        "Use F = ma to solve for force, mass, or acceleration",
        "Recognize that 1 Newton = 1 kg·m/s²"
      ]
    },

    // ═══════════════════════════════════════════
    // TESTING EXPERIMENT SETUP
    // ═══════════════════════════════════════════
    {
      id: "section-experiment",
      type: "section_header",
      icon: "🔬",
      title: "Testing Experiment: What Determines Acceleration?",
      subtitle: "~15 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This section corresponds to *Testing Experiment: Acceleration Patterns* from class (Jan 6, 2026). A cart on a track was pulled with different forces and loaded with different masses. Sensors measured its acceleration."
    },
    {
      id: "b-experiment-setup",
      type: "text",
      content: "### The Setup\n\nYou have a cart on a frictionless track. A hanging mass pulls the cart through a pulley. A sensor measures the cart's acceleration.\n\n**Two variables to test (one at a time):**\n1. **Vary the pulling force** — keep cart mass constant, change how hard you pull\n2. **Vary the cart mass** — keep pulling force constant, add mass to the cart\n\nThis is a **testing experiment**: you're checking whether a pattern holds, not just describing what happens."
    },
    {
      id: "q-predict-force",
      type: "question",
      questionType: "short_answer",
      prompt: "Before seeing the data: If you double the pulling force on the cart (keeping mass constant), what do you predict happens to acceleration? Fill in the table:\n\n| Force | Predicted Acceleration |\n|---|---|\n| 1 N | a |\n| 2 N | ? |\n| 3 N | ? |\n\nExplain your reasoning.",
      placeholder: "2N → ... because ... 3N → ... because ...",
      difficulty: "analyze"
    },
    {
      id: "b-experiment-results",
      type: "text",
      content: "### What the Data Shows\n\n**Test 1: Varying force (constant mass = 1 kg)**\n\n| Force (N) | Acceleration (m/s²) |\n|---|---|\n| 1 | 1.0 |\n| 2 | 2.0 |\n| 4 | 4.0 |\n\n**Pattern:** Double the force → double the acceleration. Acceleration is **proportional to net force**.\n\n---\n\n**Test 2: Varying mass (constant force = 2 N)**\n\n| Mass (kg) | Acceleration (m/s²) |\n|---|---|\n| 1 | 2.0 |\n| 2 | 1.0 |\n| 4 | 0.5 |\n\n**Pattern:** Double the mass → half the acceleration. Acceleration is **inversely proportional to mass**.\n\nBoth patterns together: **a = F / m**, or rearranged: **F = ma**"
    },
    {
      id: "q-pattern-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Based on the testing experiment, if you triple the net force while keeping mass the same, what happens to acceleration?",
      options: [
        "Acceleration stays the same",
        "Acceleration doubles",
        "Acceleration triples",
        "Acceleration is cut in half"
      ],
      correctIndex: 2,
      explanation: "Acceleration is directly proportional to net force (when mass is constant). Triple the force → triple the acceleration. This is the core of Newton's Second Law: a = F/m.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // NEWTON'S SECOND LAW
    // ═══════════════════════════════════════════
    {
      id: "section-fma",
      type: "section_header",
      icon: "🧮",
      title: "Newton's Second Law: F = ma",
      subtitle: "~10 minutes"
    },
    {
      id: "b-fma-intro",
      type: "text",
      content: "The data from the testing experiment gives us Newton's Second Law:\n\n**ΣF = ma**\n\nWhere:\n- **ΣF** = net force (sum of all forces), in Newtons (N)\n- **m** = mass of the object, in kilograms (kg)\n- **a** = acceleration of the object, in m/s²\n\n### Units Check\n1 Newton is defined as the force that accelerates 1 kg at 1 m/s²:\n\n**1 N = 1 kg · m/s²**\n\n### Rearrangements (all three are the same equation):\n- Solving for acceleration: **a = F/m**\n- Solving for force: **F = ma**\n- Solving for mass: **m = F/a**"
    },
    {
      id: "b-def-second-law",
      type: "definition",
      term: "Newton's Second Law",
      definition: "The net force on an object equals its mass times its acceleration: ΣF = ma. The direction of acceleration is the same as the direction of net force."
    },

    // ═══════════════════════════════════════════
    // PHET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "💻",
      title: "Simulation: Forces and Motion",
      subtitle: "~10 minutes"
    },
    {
      id: "embed-phet",
      type: "iframe_embed",
      src: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
      title: "PhET: Forces and Motion Basics",
      height: 500
    },
    {
      id: "callout-phet-instructions",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Try this:** Go to the 'Acceleration' tab. Set a specific force and mass, then observe acceleration. Try doubling the force — does acceleration double? Then try doubling the mass — does acceleration halve? You're recreating the testing experiment."
    },
    {
      id: "q-phet-explore",
      type: "question",
      questionType: "short_answer",
      prompt: "Using the simulation: (a) Set mass = 10 kg and force = 20 N. What acceleration does the simulation show? (b) Now set force = 40 N (double). What is acceleration now? (c) Does this match F = ma? Show your calculation.",
      placeholder: "(a) a = ... (b) a = ... (c) Calculation: F/m = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // PRACTICE CALCULATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "📝",
      title: "Practice: F = ma Calculations",
      subtitle: "~10 minutes"
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A net force of 30 N acts on a 6 kg object. What is the acceleration?",
      options: [
        "0.2 m/s²",
        "5 m/s²",
        "24 m/s²",
        "180 m/s²"
      ],
      correctIndex: 1,
      explanation: "a = F/m = 30 N / 6 kg = 5 m/s². Make sure to use net force, not just any force.",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A 1200 kg car accelerates at 3 m/s². (a) What net force acts on it? (b) If friction is 400 N backward, how large is the engine force pushing it forward?",
      placeholder: "(a) ΣF = ... (b) F_engine = ...",
      difficulty: "apply"
    },
    {
      id: "q-calc-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 50 N force accelerates a box at 10 m/s². What is the mass of the box?",
      options: [
        "0.2 kg",
        "5 kg",
        "40 kg",
        "500 kg"
      ],
      correctIndex: 1,
      explanation: "m = F/a = 50 N / 10 m/s² = 5 kg. You can always rearrange F = ma to solve for any unknown.",
      difficulty: "apply"
    },
    {
      id: "q-calc-4",
      type: "question",
      questionType: "short_answer",
      prompt: "Challenge: A 2 kg cart has an applied force of 10 N to the right and friction of 3 N to the left. (a) Draw/describe the FBD. (b) Find the net force. (c) Find the acceleration (magnitude and direction).",
      placeholder: "(a) FBD: ... (b) ΣF = ... (c) a = ...",
      difficulty: "analyze"
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
      content: "Today's key takeaways:\n\n- **Newton's Second Law: ΣF = ma**\n- Net force and acceleration are **directly proportional** — double the force, double the acceleration\n- Acceleration and mass are **inversely proportional** — double the mass, half the acceleration\n- **1 Newton = 1 kg·m/s²** (always check units)\n- Acceleration direction = net force direction\n- Always use NET force (ΣF), not just one of the forces\n\n**Next up:** Force Pairs — what happens on the other side of every force interaction?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: What happens to acceleration when you triple the force on an object but keep mass the same? Show the math with numbers.",
      placeholder: "If original a = F/m = ..., then new a = 3F/m = ... This means...",
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
        { term: "Newton's Second Law", definition: "ΣF = ma. The net force on an object equals its mass times its acceleration. Acceleration is in the same direction as net force." },
        { term: "Net Force (ΣF)", definition: "The vector sum of all forces acting on an object. Determines acceleration." },
        { term: "Newton (N)", definition: "The SI unit of force. 1 N = 1 kg·m/s² — the force needed to accelerate 1 kg at 1 m/s²." },
        { term: "Direct Proportion", definition: "When one quantity increases, the other increases by the same factor. F and a are directly proportional (constant mass)." },
        { term: "Inverse Proportion", definition: "When one quantity increases, the other decreases by the same factor. m and a are inversely proportional (constant force)." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-newtons-second-law")
      .set(lesson);
    console.log('✅ Lesson "Newton\'s Second Law: Testing Acceleration Patterns" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
