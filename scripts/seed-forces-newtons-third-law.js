// seed-forces-newtons-third-law.js
// Creates "Newton's Third Law: Settling the Debate" lesson (Unit 4: Forces, Lesson 4)
// Run: node scripts/seed-forces-newtons-third-law.js
// Modeling/inquiry style — lab + pattern finding

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Newton's Third Law: Settling the Debate",
  questionOfTheDay: "When a big truck crashes into a small car, which one experiences a bigger force — the truck or the car? Are you sure?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 4,
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
      content: "**Question of the Day:** When a big truck crashes into a small car, which one experiences a bigger force — the truck or the car? Are you sure?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Before we investigate — your gut feeling: When a truck hits a car, which experiences a larger force?",
      options: [
        "The truck exerts a larger force on the car",
        "The car exerts a larger force on the truck",
        "They exert equal forces on each other",
        "It depends on how fast they're going"
      ],
      correctIndex: 2,
      explanation: "We'll prove this during the lesson — but the answer is that they exert EQUAL forces on each other. Surprised? Most people are. That's the whole point of Newton's Third Law.",
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
        "State Newton's Third Law in your own words",
        "Identify action-reaction force pairs in real situations",
        "Explain why action-reaction pairs never cancel out",
        "Apply the Third Law to analyze collisions and contact forces"
      ]
    },

    // ═══════════════════════════════════════════
    // THE LAB: SETTLING A DEBATE
    // ═══════════════════════════════════════════
    {
      id: "section-lab",
      type: "section_header",
      icon: "🔬",
      title: "Lab: Settling a Debate",
      subtitle: "~15 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This section corresponds to *Lab: Settling a Debate* (Dec 15) and *Find a Pattern: Force Pairs* (Jan 6). We're testing a bold claim: when two objects interact, the forces between them are always equal."
    },
    {
      id: "b-lab-setup",
      type: "text",
      content: "### The Experiment\n\n**Setup:** Two spring scales hooked together, facing opposite directions. Each person holds one scale and pulls.\n\n**The Debate:** Does the stronger person exert more force? Does the person who pulls first exert more force? Does it matter if one person is standing still?\n\n**What to look for:** Read both spring scales simultaneously during each scenario."
    },
    {
      id: "b-lab-scenarios",
      type: "text",
      content: "### Test Scenarios\n\n| Scenario | Scale A reads | Scale B reads |\n|---|---|---|\n| Both pull gently | ? | ? |\n| Both pull hard | ? | ? |\n| One pulls, one holds still | ? | ? |\n| Big person vs. small person | ? | ? |\n| One person lets go | ? | ? |\n\n### The Shocking Result\n\n**In every single scenario, both scales read the SAME number.**\n\nIt doesn't matter who's bigger, who pulls first, or who's standing still. The forces are always equal. Always."
    },
    {
      id: "q-lab-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Person A (50 kg) and Person B (90 kg) pull on spring scales hooked together. Person A's scale reads 30 N. What does Person B's scale read? Explain why.",
      placeholder: "Person B's scale reads: ... because ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // NEWTON'S THIRD LAW
    // ═══════════════════════════════════════════
    {
      id: "section-law",
      type: "section_header",
      icon: "⚖️",
      title: "Newton's Third Law",
      subtitle: "~10 minutes"
    },
    {
      id: "b-law-statement",
      type: "text",
      content: "The lab results reveal one of the most fundamental laws in physics:\n\n### Newton's Third Law\n**When object A exerts a force on object B, object B simultaneously exerts an equal and opposite force on object A.**\n\nOr more concisely: **Every action has an equal and opposite reaction.**\n\nThe two forces in a Third Law pair:\n- Are **equal** in magnitude\n- Are **opposite** in direction\n- Act on **different objects** (this is crucial)\n- Occur **simultaneously** (neither comes first)\n- Are the **same type** of force (if A pushes B with a normal force, B pushes A with a normal force)"
    },
    {
      id: "b-def-third-law",
      type: "definition",
      term: "Newton's Third Law",
      definition: "For every force that object A exerts on object B, object B exerts an equal and opposite force on object A. These paired forces act on different objects, are the same type, and occur simultaneously."
    },
    {
      id: "b-examples",
      type: "text",
      content: "### Action-Reaction Pairs\n\n| Action Force | Reaction Force |\n|---|---|\n| You push on the wall → | ← Wall pushes back on you |\n| Earth pulls you down (gravity) ↓ | You pull Earth up ↑ |\n| Your foot pushes backward on ground ← | Ground pushes forward on your foot → |\n| Rocket pushes exhaust gas down ↓ | Exhaust pushes rocket up ↑ |\n| Hammer hits nail → | Nail pushes back on hammer ← |\n\nNotice: each pair involves **two different objects** and **two different forces** of the **same type**."
    },
    {
      id: "callout-common-mistake",
      type: "callout",
      style: "insight",
      icon: "⚠️",
      content: "**The Biggest Third Law Mistake:**\n\n\"If the forces are equal and opposite, shouldn't they cancel out? How does anything ever move?\"\n\nThey DON'T cancel because they act on **different objects**. A force on object A and a force on object B can't cancel each other — they're on different FBDs!\n\nWhen you push off the ground to walk: the ground pushes YOU forward (that's on your FBD). You push the GROUND backward (that's on the ground's FBD). Your FBD has a net forward force, so you accelerate. The Earth barely moves because it's massive."
    },
    {
      id: "q-third-law-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A person stands on a scale in an elevator. The scale reads 700 N (the normal force on the person). What is the reaction force to this normal force?",
      options: [
        "Gravity pulling the person down (700 N)",
        "The person's feet pushing down on the scale (700 N)",
        "The cable pulling the elevator up",
        "The floor pushing up on the elevator"
      ],
      correctIndex: 1,
      explanation: "The scale pushes up on the person with 700 N (normal force). The Third Law reaction: the person pushes down on the scale with 700 N. Same type of force (contact/normal), same magnitude, opposite direction, different objects (person vs. scale). Gravity is NOT the reaction force here — it's a different type of force between different objects (person and Earth).",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // FIND A PATTERN: FORCE PAIRS
    // ═══════════════════════════════════════════
    {
      id: "section-patterns",
      type: "section_header",
      icon: "🔍",
      title: "Find a Pattern: Force Pairs",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-pattern-ref",
      type: "callout",
      style: "scenario",
      icon: "🧩",
      content: "**Activity Reference:** This section corresponds to *Find a Pattern: Force Pairs* (Jan 6). Practice identifying Third Law pairs in various situations."
    },
    {
      id: "q-pair-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A baseball bat hits a ball. Identify the action-reaction pair. Which object accelerates more — the bat or the ball? Why?",
      placeholder: "Action: ... Reaction: ... The ... accelerates more because ...",
      difficulty: "apply"
    },
    {
      id: "q-pair-2",
      type: "question",
      questionType: "short_answer",
      prompt: "You sit in a chair. Identify ALL the Third Law pairs involved (there are at least 3). For each, state the two objects and the type of force.",
      placeholder: "Pair 1: ... Pair 2: ... Pair 3: ...",
      difficulty: "apply"
    },
    {
      id: "q-pair-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A horse pulls a cart forward. The cart pulls the horse backward with an equal force (Third Law). So how does the horse-cart system ever move forward?",
      options: [
        "The horse actually pulls harder than the cart pulls back",
        "Newton's Third Law doesn't apply to this situation",
        "The horse pushes backward on the ground, and the ground pushes the horse forward — this external force is what makes the system move",
        "The cart's mass is less than the horse's mass, so the cart moves"
      ],
      correctIndex: 2,
      explanation: "The horse-cart forces are internal to the system. What makes the system accelerate is an EXTERNAL force: the horse's hooves push backward on the ground (friction), and the ground pushes the horse forward. This forward friction force on the horse is greater than any friction on the cart's wheels, so the whole system accelerates forward.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // BACK TO THE TRUCK VS CAR
    // ═══════════════════════════════════════════
    {
      id: "section-truck-car",
      type: "section_header",
      icon: "🚗",
      title: "The Truck vs. Car Crash — Resolved",
      subtitle: "~5 minutes"
    },
    {
      id: "b-truck-car",
      type: "text",
      content: "Let's revisit the question of the day.\n\n**The truck and the car exert EQUAL forces on each other.** Newton's Third Law guarantees this.\n\nBut wait — the car gets crushed and the truck barely dents. If the forces are equal, why the different damage?\n\nBecause **force isn't the whole story** — it's about **acceleration**.\n\nNewton's Second Law: a = F/m\n\nSame force, but the car has much less mass → much greater acceleration (and deceleration in a crash). The car's velocity changes dramatically. The truck barely slows down.\n\n**Equal forces. Unequal effects.** The Third Law tells you about forces. The Second Law tells you what those forces DO."
    },
    {
      id: "q-truck-car",
      type: "question",
      questionType: "short_answer",
      prompt: "A 2,000 kg truck and a 1,000 kg car crash head-on. The collision force is 30,000 N. Calculate the acceleration of each vehicle during the collision. Which one decelerates more? By what factor?",
      placeholder: "Truck: a = ... Car: a = ... The car decelerates ... times more because ...",
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
      content: "Today's key takeaways:\n\n- **Newton's Third Law:** Every action has an equal and opposite reaction\n- Action-reaction pairs are **equal in magnitude, opposite in direction**\n- They act on **different objects** — so they never cancel!\n- Same **type of force**, occur **simultaneously**\n- Equal forces ≠ equal effects — objects with less mass accelerate more (Second Law)\n- The horse-cart paradox is resolved by looking at **external forces** on the system\n\n**Next up:** Newton's Second Law — the quantitative relationship between force, mass, and acceleration."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student says, \"I pushed the wall, but the wall didn't push me back — I didn't feel anything.\" Explain why this student is wrong. What evidence would you show them?",
      placeholder: "The student is wrong because ... Evidence: ...",
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
        { term: "Newton's Third Law", definition: "For every force that object A exerts on object B, object B exerts an equal and opposite force on object A." },
        { term: "Action-Reaction Pair", definition: "Two forces that are equal in magnitude, opposite in direction, act on different objects, are the same type, and occur simultaneously." },
        { term: "Internal Forces", definition: "Forces between objects within a system. They cancel within the system and don't cause the system to accelerate." },
        { term: "External Forces", definition: "Forces from outside the system acting on objects within it. External forces can cause the system to accelerate." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-newtons-third-law")
      .set(lesson);
    console.log('✅ Lesson "Newton\'s Third Law: Settling the Debate" seeded successfully!');
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
