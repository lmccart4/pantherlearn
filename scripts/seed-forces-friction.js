// seed-forces-friction.js
// Creates "Friction: Investigating the Surface Force" lesson (Unit 4: Forces, Lesson 3)
// Run: node scripts/seed-forces-friction.js
// Modeling/inquiry style — lab investigation of friction

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Friction: Investigating the Surface Force",
  questionOfTheDay: "Why is it easier to slide a box across a tile floor than across carpet? What determines how strong friction is?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 3,
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
      content: "**Question of the Day:** Why is it easier to slide a box across a tile floor than across carpet? What determines how strong friction is?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of two situations where friction is helpful and two where it's a problem. What would happen if friction suddenly disappeared?",
      placeholder: "Helpful: 1. ... 2. ... Problematic: 1. ... 2. ... If friction vanished: ...",
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
        "Distinguish between static friction and kinetic friction",
        "Identify what factors affect the strength of friction",
        "Use the friction equation: F_f = μF_N",
        "Design and analyze a lab investigation of friction"
      ]
    },

    // ═══════════════════════════════════════════
    // TYPES OF FRICTION
    // ═══════════════════════════════════════════
    {
      id: "section-types",
      type: "section_header",
      icon: "🧊",
      title: "Two Types of Friction",
      subtitle: "~10 minutes"
    },
    {
      id: "b-friction-intro",
      type: "text",
      content: "Friction is a force that resists the sliding of two surfaces against each other. It always acts **parallel** to the surface and **opposite** to the direction of motion (or attempted motion).\n\nThere are two types that matter for this course:"
    },
    {
      id: "b-def-static",
      type: "definition",
      term: "Static Friction (f_s)",
      definition: "The friction force that prevents an object from starting to move. It matches the applied force up to a maximum value. Static friction adjusts — push harder, and static friction pushes back harder... until you exceed its limit."
    },
    {
      id: "b-def-kinetic",
      type: "definition",
      term: "Kinetic Friction (f_k)",
      definition: "The friction force on an object that is already sliding. It has a constant value for a given pair of surfaces. Kinetic friction is always less than the maximum static friction — that's why it's harder to START moving something than to KEEP it moving."
    },
    {
      id: "b-comparison",
      type: "text",
      content: "### Static vs. Kinetic — The Key Difference\n\nImagine pushing a heavy dresser across the floor:\n\n1. You push gently — nothing happens. Static friction matches your push. (f_s = F_push)\n2. You push harder — still nothing. Static friction increases to match. (f_s = F_push)\n3. You push REALLY hard — the dresser starts to slide! You exceeded maximum static friction.\n4. Once sliding, it feels easier to keep it moving. That's because kinetic friction < maximum static friction.\n\n**Important:** Static friction is variable (up to a maximum). Kinetic friction is approximately constant."
    },
    {
      id: "q-types-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You push on a heavy table with 40 N but it doesn't move. The static friction force is:",
      options: [
        "0 N — there's no friction if nothing moves",
        "40 N — matching your push exactly",
        "More than 40 N — friction is always stronger",
        "Impossible to determine"
      ],
      correctIndex: 1,
      explanation: "Since the table doesn't move, it's in equilibrium. The net force must be zero. That means static friction exactly equals your 40 N push (but in the opposite direction). Static friction adjusts to match the applied force, up to its maximum.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // WHAT AFFECTS FRICTION?
    // ═══════════════════════════════════════════
    {
      id: "section-factors",
      type: "section_header",
      icon: "🔬",
      title: "Lab Investigation: What Affects Friction?",
      subtitle: "~15 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This section corresponds to *Lab: Investigating the 'Surface Force'* from class (Dec 15). Think like a scientist — before reading the answers, predict what you think affects friction."
    },
    {
      id: "b-lab-setup",
      type: "text",
      content: "### The Experiment\n\nYou have a block, a spring scale, different surfaces, and extra masses to stack on top of the block.\n\n**Procedure:** Pull the block at constant speed across the surface using the spring scale. The reading on the scale equals the kinetic friction force (since constant speed means ΣF = 0, so F_pull = f_k).\n\n**Variables to test:**\n1. What happens when you change the **mass** of the block (add weights on top)?\n2. What happens when you change the **surface** (smooth table vs. sandpaper vs. rubber mat)?\n3. What happens when you change the **surface area** in contact (block on its big face vs. small face)?"
    },
    {
      id: "q-predict",
      type: "question",
      questionType: "short_answer",
      prompt: "Before seeing the results — predict: (a) Will adding mass increase, decrease, or not change friction? (b) Will changing the surface type matter? (c) Will the contact area matter? Explain your reasoning for each.",
      placeholder: "(a) Mass: ... because ... (b) Surface: ... because ... (c) Area: ... because ...",
      difficulty: "analyze"
    },
    {
      id: "b-lab-results",
      type: "text",
      content: "### What the Data Shows\n\n**Finding 1: More mass = more friction.** Doubling the mass roughly doubles the friction force. The relationship is linear — friction is **proportional to the normal force**.\n\n**Finding 2: Different surfaces = different friction.** Sandpaper gives way more friction than a smooth table. Each surface pair has its own friction \"personality.\"\n\n**Finding 3: Contact area does NOT significantly affect friction.** Whether the block sits on its big face or small face, friction is about the same. This surprises most people!\n\nSo friction depends on:\n- ✅ How hard the surfaces are pressed together (normal force)\n- ✅ What the surfaces are made of (coefficient of friction)\n- ❌ NOT the contact area"
    },

    // ═══════════════════════════════════════════
    // THE FRICTION EQUATION
    // ═══════════════════════════════════════════
    {
      id: "section-equation",
      type: "section_header",
      icon: "🧮",
      title: "The Friction Equation",
      subtitle: "~10 minutes"
    },
    {
      id: "b-equation",
      type: "text",
      content: "The lab findings lead to this equation:\n\n**f = μ × F_N**\n\nWhere:\n- **f** = friction force (in Newtons)\n- **μ** (mu) = coefficient of friction (no units — it's a ratio)\n- **F_N** = normal force (in Newtons)\n\nThe **coefficient of friction (μ)** is a number that describes how \"grippy\" two surfaces are together. It depends on both materials.\n\n| Surface pair | μ_s (static) | μ_k (kinetic) |\n|---|---|---|\n| Rubber on concrete | 1.0 | 0.8 |\n| Wood on wood | 0.5 | 0.3 |\n| Steel on steel | 0.6 | 0.4 |\n| Ice on ice | 0.1 | 0.03 |\n| Teflon on Teflon | 0.04 | 0.04 |\n\nNotice: μ_s > μ_k always. Starting is harder than keeping going."
    },
    {
      id: "b-def-mu",
      type: "definition",
      term: "Coefficient of Friction (μ)",
      definition: "A dimensionless number that quantifies how much friction exists between two specific surfaces. Higher μ means more friction. μ_s (static) is always greater than μ_k (kinetic) for the same surfaces."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 5 kg box sits on a floor where μ_k = 0.3. (a) What is the normal force? (Use g = 10 m/s²) (b) What is the kinetic friction force? (c) What applied force is needed to push the box at constant speed?",
      placeholder: "(a) F_N = ... (b) f_k = ... (c) F_app = ...",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student measures 12 N of kinetic friction on a 4 kg block (g = 10 m/s²). What is the coefficient of kinetic friction?",
      options: [
        "0.12",
        "0.30",
        "0.48",
        "3.33"
      ],
      correctIndex: 1,
      explanation: "F_N = mg = 4 × 10 = 40 N. Then μ_k = f_k / F_N = 12 / 40 = 0.30. The coefficient is a ratio — no units.",
      difficulty: "apply"
    },
    {
      id: "q-calc-3",
      type: "question",
      questionType: "short_answer",
      prompt: "Challenge: A 20 kg box on a surface with μ_s = 0.5. (a) What is the maximum static friction? (b) If you push with 80 N, does the box move? (c) If you push with 120 N, does it move? What is the acceleration if μ_k = 0.3?",
      placeholder: "(a) f_s,max = ... (b) 80 N push: ... (c) 120 N push: ...",
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
      content: "Today's key takeaways:\n\n- **Friction** resists sliding between surfaces — acts parallel to surface, opposite to motion\n- **Static friction** prevents motion, adjusts up to a maximum: f_s ≤ μ_s × F_N\n- **Kinetic friction** acts during sliding, roughly constant: f_k = μ_k × F_N\n- μ_s > μ_k (harder to start than to keep going)\n- Friction depends on **normal force** and **surface type**, NOT contact area\n- The **coefficient of friction (μ)** quantifies the \"grippiness\" of two surfaces\n\n**Next up:** Newton's Third Law — what happens when you push on something? Does it push back?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student says, \"I'll reduce friction by using a block with a smaller surface area.\" Based on the lab data, is this student correct? Explain.",
      placeholder: "The student is ... because ...",
      difficulty: "analyze"
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
        { term: "Friction", definition: "A force that resists the sliding of two surfaces against each other. Acts parallel to the surface, opposite to the direction of motion." },
        { term: "Static Friction (f_s)", definition: "Friction that prevents an object from starting to move. Variable, up to a maximum of μ_s × F_N." },
        { term: "Kinetic Friction (f_k)", definition: "Friction on an object that is already sliding. Approximately constant: f_k = μ_k × F_N." },
        { term: "Coefficient of Friction (μ)", definition: "A dimensionless number describing how much friction exists between two surfaces. Depends on both materials." },
        { term: "Normal Force (F_N)", definition: "The perpendicular contact force a surface exerts on an object. On a flat surface with no other vertical forces: F_N = mg." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-friction")
      .set(lesson);
    console.log('✅ Lesson "Friction: Investigating the Surface Force" seeded successfully!');
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
