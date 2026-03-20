// seed-forces-net-force-equilibrium.js
// Creates "Net Force and Equilibrium" lesson (Unit 4: Forces, Lesson 2)
// Run: node scripts/seed-forces-net-force-equilibrium.js
// Modeling/inquiry style — lab practical on sum of forces

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Net Force and Equilibrium",
  questionOfTheDay: "If two people push on opposite sides of a door with the same force, does the door move? What if one person pushes harder?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 2,
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
      content: "**Question of the Day:** If two people push on opposite sides of a door with the same force, does the door move? What if one person pushes harder?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Review: A book is on a table. List every force on the book and state whether the forces are balanced or unbalanced.",
      placeholder: "Forces: ... Balanced/unbalanced because...",
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
        "Calculate net force by adding force vectors along one dimension",
        "Distinguish between balanced forces (equilibrium) and unbalanced forces",
        "Predict whether an object will accelerate based on its net force",
        "Apply the sum of forces concept to lab practical scenarios"
      ]
    },

    // ═══════════════════════════════════════════
    // NET FORCE CONCEPT
    // ═══════════════════════════════════════════
    {
      id: "section-net-force",
      type: "section_header",
      icon: "⚖️",
      title: "The Net Force",
      subtitle: "~10 minutes"
    },
    {
      id: "b-net-force-intro",
      type: "text",
      content: "In the real world, objects usually have **multiple forces** acting on them at the same time. What determines how the object moves isn't any single force — it's the **combined effect** of all forces.\n\nThe **net force** (also written **ΣF**, read as \"sigma F\" or \"sum of forces\") is the vector sum of every force on an object.\n\n**ΣF = F₁ + F₂ + F₃ + ...**\n\nIn one dimension, forces pointing right are **positive** and forces pointing left are **negative** (or you can choose up = positive and down = negative). Just add them up with signs."
    },
    {
      id: "b-def-net-force",
      type: "definition",
      term: "Net Force (ΣF)",
      definition: "The vector sum of all forces acting on an object. It determines the object's acceleration. If ΣF = 0, the object is in equilibrium (no acceleration). If ΣF ≠ 0, the object accelerates in the direction of the net force."
    },
    {
      id: "b-examples",
      type: "text",
      content: "### Quick Examples (1D)\n\n**Example 1:** Two forces on a box: 20 N right, 8 N left.\nΣF = (+20) + (−8) = **+12 N** → Net force is 12 N to the right → box accelerates right.\n\n**Example 2:** Three forces: 15 N up, 10 N down, 5 N down.\nΣF = (+15) + (−10) + (−5) = **0 N** → Balanced → no acceleration.\n\n**Example 3:** Tug of war — Team A pulls left with 500 N, Team B pulls right with 520 N.\nΣF = (−500) + (+520) = **+20 N right** → Rope accelerates toward Team B."
    },
    {
      id: "q-net-force-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Forces on an object: 25 N east, 10 N west, 5 N east. What is the net force?",
      options: [
        "40 N east",
        "20 N east",
        "30 N east",
        "10 N west"
      ],
      correctIndex: 1,
      explanation: "East forces: 25 + 5 = 30 N. West forces: 10 N. Net: 30 − 10 = 20 N east. The object accelerates eastward.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // EQUILIBRIUM
    // ═══════════════════════════════════════════
    {
      id: "section-equilibrium",
      type: "section_header",
      icon: "⚖️",
      title: "Equilibrium: When Forces Balance",
      subtitle: "~10 minutes"
    },
    {
      id: "b-equilibrium",
      type: "text",
      content: "When the net force on an object equals zero, we say the object is in **equilibrium**.\n\n**ΣF = 0 → Equilibrium → Zero acceleration**\n\nThis does NOT mean the object is at rest. It means the object's velocity isn't changing. An object in equilibrium can be:\n\n- **Static equilibrium** — at rest and staying at rest (a book on a table)\n- **Dynamic equilibrium** — moving at constant velocity (a car cruising at 60 mph on a flat road)\n\nBoth have ΣF = 0. Both have zero acceleration."
    },
    {
      id: "b-def-equilibrium",
      type: "definition",
      term: "Equilibrium",
      definition: "A state where the net force on an object is zero (ΣF = 0). The object has zero acceleration — it's either at rest or moving at constant velocity."
    },
    {
      id: "callout-misconception",
      type: "callout",
      style: "insight",
      icon: "⚠️",
      content: "**Big Misconception Alert:** \"If something is moving, there must be a net force on it.\"\n\nNope! An object can move at constant velocity with zero net force. Forces are needed to **change** motion (accelerate), not to **maintain** motion. A hockey puck sliding on frictionless ice keeps moving forever with no force at all."
    },
    {
      id: "q-equilibrium-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A skydiver falls at a constant 120 mph (terminal velocity). What is the net force on the skydiver?",
      options: [
        "Their weight (about 800 N downward)",
        "Zero",
        "800 N upward (from air resistance)",
        "Impossible to determine"
      ],
      correctIndex: 1,
      explanation: "Constant velocity means zero acceleration, which means ΣF = 0. Gravity still pulls down and air resistance pushes up, but they're exactly equal and opposite. The skydiver is in dynamic equilibrium.",
      difficulty: "analyze"
    },
    {
      id: "q-equilibrium-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A 3 kg lamp hangs from two cables. Cable A pulls up-left with a vertical component of 15 N. Cable B pulls up-right with a vertical component of 15 N. (a) What is the weight of the lamp? (Use g = 10 m/s²) (b) Is the lamp in equilibrium? Explain.",
      placeholder: "(a) Weight = ... (b) ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // LAB PRACTICAL
    // ═══════════════════════════════════════════
    {
      id: "section-lab",
      type: "section_header",
      icon: "🔬",
      title: "Lab Practical: Sum of the Forces",
      subtitle: "~15 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This section corresponds to the *Sum of the Forces Lab Practical* from class (Dec 12). Work through these scenarios as if you were setting up the experiment."
    },
    {
      id: "b-lab-intro",
      type: "text",
      content: "### The Setup\n\nImagine you have a force table — a circular platform with pulleys around the edge. You hang masses from strings that run over the pulleys. The strings all connect to a central ring.\n\n**Your goal:** Find the combination of forces (masses and angles) that puts the central ring in equilibrium — perfectly balanced, not moving.\n\n### Key Idea\nIf the ring is in equilibrium, then the vector sum of all the tension forces equals zero. You can test this by predicting what force is needed to balance the others, then checking if the ring stays centered."
    },
    {
      id: "q-lab-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Lab Scenario 1: Two forces act on the ring — 2.0 N pointing East and 2.0 N pointing North. You need to add a third force to put the ring in equilibrium. What magnitude and direction should the third force be? (Hint: the third force must be equal and opposite to the resultant of the first two.)",
      placeholder: "Magnitude: ... Direction: ...",
      difficulty: "apply"
    },
    {
      id: "q-lab-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Lab Scenario 2: Three forces act on the ring — 3.0 N East, 1.5 N West, and 2.0 N North. (a) What is the net force in the East-West direction? (b) What is the net force in the North-South direction? (c) Describe the fourth force needed for equilibrium.",
      placeholder: "(a) E-W net: ... (b) N-S net: ... (c) Fourth force: ...",
      difficulty: "apply"
    },
    {
      id: "q-lab-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "During the lab, the ring is slightly off-center even though your calculations say it should be balanced. What is the most likely cause?",
      options: [
        "Physics doesn't work in real life",
        "Friction in the pulleys and strings not being perfectly aligned",
        "Gravity is pulling the ring down",
        "The forces are too small to measure"
      ],
      correctIndex: 1,
      explanation: "In real experiments, friction in the pulleys, slight misalignment of strings, and measurement uncertainty all contribute to small errors. This doesn't mean the physics is wrong — it means real experiments have sources of error that we need to account for.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // PROBLEM SOLVING
    // ═══════════════════════════════════════════
    {
      id: "section-problems",
      type: "section_header",
      icon: "📝",
      title: "Problem Solving",
      subtitle: "~8 minutes"
    },
    {
      id: "q-problem-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 10 kg box is pushed to the right with 50 N. Friction pushes left with 30 N. (a) Draw/describe the FBD (include vertical forces). (b) Calculate the net horizontal force. (c) Will the box accelerate? In which direction?",
      placeholder: "(a) FBD: ... (b) ΣF_x = ... (c) ...",
      difficulty: "apply"
    },
    {
      id: "q-problem-2",
      type: "question",
      questionType: "short_answer",
      prompt: "An elevator moves upward at constant velocity. The cable pulls up with 8,000 N. (a) What is the weight of the elevator? (b) What is the net force? (c) Explain how you know.",
      placeholder: "(a) Weight = ... (b) ΣF = ... (c) ...",
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
      content: "Today's key takeaways:\n\n- **Net force (ΣF)** is the vector sum of all forces on an object\n- **ΣF = 0** → equilibrium → zero acceleration (can be at rest OR constant velocity)\n- **ΣF ≠ 0** → unbalanced → object accelerates in the direction of the net force\n- **Static equilibrium:** at rest with balanced forces\n- **Dynamic equilibrium:** constant velocity with balanced forces\n- Moving does NOT mean there's a net force — only **changing** motion requires a net force\n\n**Next up:** Friction — investigating the surface force."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A car drives on a straight highway at exactly 65 mph, no speeding up, no slowing down. Is there a net force on the car? Explain your reasoning using the concept of equilibrium.",
      placeholder: "Net force: ... Explanation: ...",
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
        { term: "Net Force (ΣF)", definition: "The vector sum of all forces acting on an object. Determines whether and how the object accelerates." },
        { term: "Equilibrium", definition: "A state where the net force on an object is zero. The object has zero acceleration." },
        { term: "Static Equilibrium", definition: "An object at rest with balanced forces (ΣF = 0, v = 0)." },
        { term: "Dynamic Equilibrium", definition: "An object moving at constant velocity with balanced forces (ΣF = 0, v = constant)." },
        { term: "Balanced Forces", definition: "Forces that sum to zero net force. The object does not accelerate." },
        { term: "Unbalanced Forces", definition: "Forces that sum to a nonzero net force. The object accelerates in the direction of the net force." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-net-force-equilibrium")
      .set(lesson);
    console.log('✅ Lesson "Net Force and Equilibrium" seeded successfully!');
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
