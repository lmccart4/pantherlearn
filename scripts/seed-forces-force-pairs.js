// seed-forces-force-pairs.js
// Creates "Force Pairs: Testing Newton's Third Law" lesson (Unit 4: Forces, Lesson 6)
// Run: node scripts/seed-forces-force-pairs.js
// Modeling/inquiry style — quantitative testing of action-reaction pairs

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Force Pairs: Testing Newton's Third Law",
  questionOfTheDay: "If a horse pulls a cart forward with 500 N, the cart pulls the horse backward with 500 N. Then why does anything move at all?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 6,
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
      content: "**Question of the Day:** If a horse pulls a cart forward with 500 N, the cart pulls the horse backward with 500 N. Then why does anything move at all?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "When you push against a wall with 50 N, does the wall push back on you? If so, with how much force? What's your evidence?",
      placeholder: "The wall... because...",
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
        "Identify action-reaction force pairs (same magnitude, opposite direction, different objects, same type)",
        "Explain why equal-and-opposite force pairs don't cancel each other",
        "Draw two separate FBDs showing an action-reaction pair",
        "Apply Newton's Third Law to real-world scenarios (rockets, swimming, walking)"
      ]
    },

    // ═══════════════════════════════════════════
    // TESTING EXPERIMENT
    // ═══════════════════════════════════════════
    {
      id: "section-experiment",
      type: "section_header",
      icon: "🔬",
      title: "Testing Experiment: Force Pairs",
      subtitle: "~15 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This section corresponds to *Testing Experiment: Force Pairs* and *Find a Pattern: Force Pairs* from class (Jan 6-7, 2026). Two force probes were attached face-to-face and pulled against each other while measuring both forces simultaneously."
    },
    {
      id: "b-experiment-setup",
      type: "text",
      content: "### The Experiment\n\nTwo students each hold a force probe. They push the probes against each other (or pull them apart with a rubber band). A data logger records both probes at the same time.\n\n**What we measured:**\n- Probe A reads the force that Probe B exerts on it\n- Probe B reads the force that Probe A exerts on it\n\nRun 1: Gentle push. Run 2: Harder push. Run 3: One student pushes harder than the other tries to."
    },
    {
      id: "q-predict-pairs",
      type: "question",
      questionType: "short_answer",
      prompt: "Before seeing the data: In Run 3, if Student A pushes harder than Student B, what will each probe read? Will they be equal or different? Make a prediction with specific numbers.",
      placeholder: "Probe A will read... Probe B will read... because...",
      difficulty: "analyze"
    },
    {
      id: "b-experiment-results",
      type: "text",
      content: "### What the Data Shows\n\n| Run | Probe A reads | Probe B reads |\n|---|---|---|\n| Gentle push | 5 N | 5 N |\n| Hard push | 22 N | 22 N |\n| A pushes harder | 15 N | 15 N |\n\n**The pattern:** No matter what, both probes always read the same magnitude. Even when one student \"tries harder,\" the interaction force is the same on both sides.\n\n**Newton's Third Law:** For every force, there is an equal and opposite force on the *other* object."
    },

    // ═══════════════════════════════════════════
    // NEWTON'S THIRD LAW
    // ═══════════════════════════════════════════
    {
      id: "section-third-law",
      type: "section_header",
      icon: "⚖️",
      title: "Newton's Third Law: Action-Reaction Pairs",
      subtitle: "~15 minutes"
    },
    {
      id: "b-third-law",
      type: "text",
      content: "**Newton's Third Law:** For every action force, there is a reaction force that is:\n- Equal in **magnitude**\n- Opposite in **direction**\n- Acts on a **different object**\n- The **same type** of force (both contact, or both gravitational, etc.)\n\n### Identifying a Force Pair\n\nA force pair always has this structure:\n> \"Object A exerts a [type] force on Object B\"\n> \"Object B exerts a [type] force on Object A\"\n\nNotice: you swap the objects. The force type is the same. The directions are opposite.\n\n**Example:**\n- Earth pulls you down with gravity (20 N)\n- You pull Earth up with gravity (20 N) — yes, really!"
    },
    {
      id: "b-def-action-reaction",
      type: "definition",
      term: "Action-Reaction Pair",
      definition: "Two forces that are always equal in magnitude, opposite in direction, act on different objects, and are the same type of force. They are always created together and always have the same strength."
    },
    {
      id: "callout-big-misconception",
      type: "callout",
      style: "insight",
      icon: "⚠️",
      content: "**The Most Commonly Misunderstood Law in Physics:**\n\nStudents say: \"If the forces are equal and opposite, they cancel out, so nothing should move.\"\n\nThe error: force pairs act on **different objects**. They cannot cancel each other because you only cancel forces on the **same object**.\n\nA FBD shows forces on ONE object. Force pairs will never appear on the same FBD. They live on separate FBDs."
    },
    {
      id: "b-horse-cart",
      type: "text",
      content: "### The Horse-Cart Problem (Explained)\n\nHorse pulls cart → 500 N forward on cart\nCart pulls horse → 500 N backward on horse\n\nWhy does the system move?\n\nBecause there's a third force: **the ground pushes the horse forward** (friction from hooves). The horse's net force is: 500 N backward (from cart) + ground friction forward. If ground friction > 500 N → horse accelerates forward, dragging the cart.\n\n**The force pair is real. The system still moves because other forces are also acting.**\n\n```\nFBD of horse:                    FBD of cart:\n  Ground → [horse] ← Cart        Horse → [cart]\n  friction      tension           tension\n```"
    },
    {
      id: "q-horse-cart",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A horse pulls a cart with 500 N. The cart pulls the horse back with 500 N. Why does the horse-cart system still move forward?",
      options: [
        "The horse is stronger, so its 500 N beats the cart's 500 N",
        "The forces cancel so there is no motion — this is a trick question",
        "The ground exerts additional friction on the horse's hooves that is not part of the force pair",
        "Newton's Third Law only applies when objects are not moving"
      ],
      correctIndex: 2,
      explanation: "The force pair (horse↔cart) acts on different objects and doesn't determine system motion alone. The ground pushes the horse forward via friction. If ground friction > backward pull from cart, the horse accelerates. The net force on each object determines its acceleration.",
      difficulty: "analyze"
    },
    {
      id: "q-fbd-pairs",
      type: "question",
      questionType: "short_answer",
      prompt: "A person stands on a skateboard and pushes backward on a wall with 80 N. (a) What force does the wall exert on the person? (b) Draw/describe the FBD for the person only. (c) What happens to the person?",
      placeholder: "(a) Wall force on person: ... (b) FBD: ... (c) Person...",
      difficulty: "apply"
    },
    {
      id: "q-pairs-identify",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A book sits on a table. Gravity pulls the book down (F1). The table pushes the book up (F2). Are F1 and F2 a Newton's Third Law force pair?",
      options: [
        "Yes — they are equal, opposite, and on the same object",
        "No — they are on the same object; force pairs must be on different objects",
        "Yes — they act at the same location",
        "No — they are different magnitudes"
      ],
      correctIndex: 1,
      explanation: "F1 and F2 are NOT a Third Law pair — they both act on the book. They happen to be equal (book is in equilibrium), but that's Newton's First Law, not Third. The Third Law pair for F2 (table pushes book up) is: book pushes table down with equal force.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-applications",
      type: "section_header",
      icon: "🚀",
      title: "Newton's Third Law in Action",
      subtitle: "~5 minutes"
    },
    {
      id: "b-applications",
      type: "text",
      content: "### Newton's Third Law Everywhere\n\n**Rockets:** Rocket pushes exhaust gas backward → exhaust pushes rocket forward. No air needed — works in space.\n\n**Swimming:** Swimmer pushes water backward with hands → water pushes swimmer forward.\n\n**Walking:** Your foot pushes Earth backward → Earth pushes your foot forward (friction). You move because Earth is so massive it barely accelerates.\n\n**Guns:** Bullet pushed forward → gun (and shooter) pushed backward (recoil). Same force, but shooter has much more mass → much less acceleration.\n\n**Key insight:** The forces are always equal. The accelerations are NOT equal if the masses are different."
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
      content: "Today's key takeaways:\n\n- **Newton's Third Law:** Every action force has an equal, opposite reaction force on the OTHER object\n- Force pairs: same magnitude, opposite direction, different objects, same force type\n- Force pairs do NOT cancel — they live on different FBDs\n- Equal forces ≠ zero motion — the system moves because of forces BEYOND the pair\n- The horse-cart system moves because of ground friction, not because the horse's force is bigger\n\n**Next up:** Gravity and Free Fall — what is weight, really, and why do all objects fall the same?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: List the action-reaction pair when a swimmer pushes off a wall. Which object accelerates more after the push? Why?",
      placeholder: "Swimmer exerts... on the wall. Wall exerts... on the swimmer. The swimmer accelerates more because...",
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
        { term: "Newton's Third Law", definition: "For every action force, there is a reaction force: equal in magnitude, opposite in direction, acting on a different object." },
        { term: "Action-Reaction Pair", definition: "Two forces that are always equal in magnitude, opposite in direction, act on different objects, and are the same type." },
        { term: "Force Pair", definition: "Another name for an action-reaction pair. Always involves exactly two objects interacting." },
        { term: "Recoil", definition: "The backward motion of an object when it exerts a forward force. Examples: gun kickback, rocket propulsion, swimming push-off." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-force-pairs")
      .set(lesson);
    console.log('✅ Lesson "Force Pairs: Testing Newton\'s Third Law" seeded successfully!');
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
