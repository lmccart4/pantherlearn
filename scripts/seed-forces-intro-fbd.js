// seed-forces-intro-fbd.js
// Creates "What is a Force? Free Body Diagrams" lesson (Unit 4: Forces, Lesson 1)
// Run: node scripts/seed-forces-intro-fbd.js
// Modeling/inquiry style — students discover patterns through investigation

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "What is a Force? Free Body Diagrams",
  questionOfTheDay: "A book is sitting on a table, perfectly still. Is anything pushing or pulling on it? If so, what — and how do you know?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 1,
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
      content: "**Question of the Day:** A book is sitting on a table, perfectly still. Is anything pushing or pulling on it? If so, what — and how do you know?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of three things you did today that involved a push or a pull. For each one, describe what was pushing/pulling and what was being pushed/pulled.",
      placeholder: "1. ... 2. ... 3. ...",
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
        "Define force as a push or pull interaction between objects",
        "Identify common force types: gravity, normal, friction, tension, applied",
        "Draw and label a free body diagram (FBD) for an object",
        "Use FBDs to identify all forces acting on a single object"
      ]
    },

    // ═══════════════════════════════════════════
    // WHAT IS A FORCE?
    // ═══════════════════════════════════════════
    {
      id: "section-forces-intro",
      type: "section_header",
      icon: "💪",
      title: "What is a Force?",
      subtitle: "~10 minutes"
    },
    {
      id: "b-force-intro",
      type: "text",
      content: "A **force** is an interaction between two objects — a push or a pull. Forces don't exist in isolation. Every force involves two things:\n\n1. **An agent** — the thing doing the pushing or pulling\n2. **An object** — the thing being pushed or pulled\n\nWhen you push a door open, your hand is the agent and the door is the object. When gravity pulls you toward Earth, Earth is the agent and you are the object.\n\nForces are measured in **Newtons (N)**. One Newton is roughly the weight of a small apple."
    },
    {
      id: "b-def-force",
      type: "definition",
      term: "Force",
      definition: "A push or pull interaction between two objects. Forces are vectors — they have both magnitude (size, measured in Newtons) and direction."
    },
    {
      id: "b-force-types",
      type: "text",
      content: "### Common Force Types\n\n| Force | Symbol | What it is | Example |\n|---|---|---|---|\n| **Gravity** | F_g | Pull toward Earth's center | A ball falling |\n| **Normal** | F_N | Surface pushes back perpendicular to contact | A book on a table |\n| **Friction** | F_f | Resists sliding between surfaces | Shoes gripping the floor |\n| **Tension** | F_T | Pull through a rope, string, or cable | A dog on a leash |\n| **Applied** | F_app | Any direct push or pull by a person or object | Pushing a shopping cart |\n| **Air Resistance** | F_air | Friction from air | A parachute slowing you down |\n\nEvery force in physics fits into one of these categories (or a close variation). When you analyze a problem, your job is to identify **which forces** are acting and **who is the agent** for each one."
    },
    {
      id: "q-force-types",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student is sitting in a chair. Which forces are acting ON the student?",
      options: [
        "Only gravity",
        "Gravity and normal force",
        "Gravity, normal force, and friction",
        "No forces — the student is at rest"
      ],
      correctIndex: 1,
      explanation: "Gravity pulls the student downward (agent: Earth). The chair pushes upward on the student with a normal force (agent: chair). Since the student isn't sliding, there's no significant friction. And being at rest doesn't mean no forces — it means the forces are balanced!",
      difficulty: "understand"
    },
    {
      id: "callout-common-mistake",
      type: "callout",
      style: "insight",
      icon: "⚠️",
      content: "**Common Mistake:** \"The object is at rest, so there are no forces on it.\"\n\nWrong! An object at rest has **balanced forces** — the forces cancel out to zero net force. A book on a table has gravity pulling it down and the normal force pushing it up. These are equal and opposite, so the book stays put. Forces are still there."
    },

    // ═══════════════════════════════════════════
    // FREE BODY DIAGRAMS
    // ═══════════════════════════════════════════
    {
      id: "section-fbd",
      type: "section_header",
      icon: "✏️",
      title: "Free Body Diagrams",
      subtitle: "~15 minutes"
    },
    {
      id: "b-fbd-intro",
      type: "text",
      content: "A **free body diagram** (FBD) is the single most important tool in all of forces/dynamics. It's a simple sketch that shows:\n\n1. The **object** (drawn as a dot or small box)\n2. **Every force** acting on that object (drawn as arrows)\n3. Each arrow is **labeled** with the force name/symbol\n4. Arrow **length** roughly represents force magnitude\n5. Arrow **direction** shows force direction\n\nThe key rule: **Only draw forces that act ON the object.** Not forces the object exerts on other things."
    },
    {
      id: "b-fbd-steps",
      type: "text",
      content: "### How to Draw an FBD — Step by Step\n\n**Step 1:** Identify the object you're analyzing. Draw it as a dot.\n\n**Step 2:** Ask: \"What is touching this object?\" Each contact point is a possible source of normal force and/or friction.\n\n**Step 3:** Ask: \"Is gravity acting on it?\" (Almost always yes — draw F_g pointing straight down.)\n\n**Step 4:** For each thing touching the object, determine what force it applies:\n- Surface → Normal force (perpendicular to surface) and maybe friction (parallel to surface)\n- Rope/string → Tension (along the rope, pulling away from object)\n- Person/machine → Applied force\n\n**Step 5:** Draw and label each force arrow starting from the dot.\n\n**Step 6:** Check: Did you include ONLY forces on this object? Did you miss any?"
    },
    {
      id: "b-fbd-example",
      type: "text",
      content: "### Example: Book on a Table\n\nThe book is sitting still on a flat table.\n\n```\n         F_N ↑\n              \n          [book]\n              \n         F_g ↓\n```\n\n**Forces identified:**\n- F_g (gravity, downward) — agent: Earth\n- F_N (normal force, upward) — agent: table surface\n\nSince the book is at rest: F_N = F_g (balanced forces).\n\n**What we did NOT include:**\n- The book pushing down on the table (that's a force ON the table, not on the book)\n- Air pressure (we typically ignore this for solid objects)"
    },
    {
      id: "q-fbd-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A box is being pushed to the right across a rough floor at constant speed. How many forces act on the box?",
      options: [
        "2 (gravity and normal)",
        "3 (gravity, normal, and applied)",
        "4 (gravity, normal, applied, and friction)",
        "5 or more"
      ],
      correctIndex: 2,
      explanation: "Four forces: (1) Gravity pulls down. (2) Normal force pushes up from the floor. (3) Applied force pushes right (from the person). (4) Friction pushes left (from the rough floor, opposing the motion). Since speed is constant, these four forces are balanced — the net force is zero.",
      difficulty: "apply"
    },
    {
      id: "q-fbd-draw",
      type: "question",
      questionType: "short_answer",
      prompt: "A lamp hangs from the ceiling by a single cord. Draw (or describe) the free body diagram for the lamp. List every force, its direction, and what object is the agent.",
      placeholder: "Forces on the lamp: 1. ... (direction: ..., agent: ...) 2. ...",
      difficulty: "apply"
    },
    {
      id: "q-fbd-tricky",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball is thrown upward and is currently on its way UP (after leaving your hand, before reaching the top). What forces act on the ball? (Ignore air resistance.)",
      options: [
        "An upward force from the throw and gravity downward",
        "Only an upward force from the throw",
        "Only gravity downward",
        "No forces — it's moving on its own"
      ],
      correctIndex: 2,
      explanation: "Once the ball leaves your hand, your hand is no longer touching it — so there's no applied force. The only force is gravity, pulling downward. The ball moves up because it still has upward velocity, not because something is pushing it up. This is one of the most common misconceptions in physics!",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // PRACTICE SET
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "📝",
      title: "Practice: Sum of the Forces",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-practice-ref",
      type: "callout",
      style: "insight",
      icon: "📋",
      content: "**Reference:** This section corresponds to the *Sum of the Forces Practice Set* from class (Dec 9). Use these problems to check your understanding before moving on."
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 5 kg box sits on a flat table. (a) What is the force of gravity on the box? (Use F_g = mg, where g = 9.8 m/s²) (b) What is the normal force? (c) What is the net force?",
      placeholder: "(a) F_g = ... (b) F_N = ... (c) ΣF = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Two people push a couch. Person A pushes right with 120 N. Person B pushes right with 80 N. Friction pushes left with 150 N. (a) Draw/describe the FBD. (b) What is the net horizontal force? (c) Which direction does the couch accelerate?",
      placeholder: "(a) Forces: ... (b) Net force = ... (c) Direction: ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Three forces act on an object: 10 N right, 6 N left, and 4 N left. What is the net force?",
      options: [
        "20 N right",
        "0 N (balanced)",
        "8 N right",
        "2 N left"
      ],
      correctIndex: 1,
      explanation: "Right forces: +10 N. Left forces: −6 N + (−4 N) = −10 N. Net force: 10 + (−10) = 0 N. The forces are balanced, so the object won't accelerate.",
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
      content: "Today's key takeaways:\n\n- A **force** is a push or pull interaction between two objects\n- Every force has an **agent** (what does the pushing) and an **object** (what gets pushed)\n- Common forces: gravity (F_g), normal (F_N), friction (F_f), tension (F_T), applied (F_app)\n- A **free body diagram** shows all forces acting ON a single object\n- Objects at rest have **balanced forces**, not zero forces\n- Once an object loses contact with something, that thing can no longer exert a force on it\n\n**Next up:** Net Force and Equilibrium — what happens when forces don't cancel out?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student pushes a heavy box across a rough floor at constant speed. List every force on the box and explain why constant speed means balanced forces.",
      placeholder: "Forces: ... Constant speed means balanced because...",
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
        { term: "Force", definition: "A push or pull interaction between two objects. Measured in Newtons (N). A vector quantity." },
        { term: "Free Body Diagram (FBD)", definition: "A diagram showing all forces acting on a single object, drawn as arrows from a dot representing the object." },
        { term: "Gravity (F_g)", definition: "The force pulling an object toward Earth's center. F_g = mg, where m is mass and g ≈ 9.8 m/s²." },
        { term: "Normal Force (F_N)", definition: "The force a surface exerts perpendicular to the contact surface, pushing an object away from the surface." },
        { term: "Friction (F_f)", definition: "A force that resists sliding motion between two surfaces in contact. Acts parallel to the surface." },
        { term: "Tension (F_T)", definition: "A pulling force transmitted through a rope, string, cable, or chain." },
        { term: "Applied Force (F_app)", definition: "A force applied directly to an object by a person or another object." },
        { term: "Net Force (ΣF)", definition: "The vector sum of all forces acting on an object. Determines whether the object accelerates." },
        { term: "Equilibrium", definition: "A state where all forces on an object are balanced (net force = 0). The object has zero acceleration." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-intro-fbd")
      .set(lesson);
    console.log('✅ Lesson "What is a Force? Free Body Diagrams" seeded successfully!');
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
