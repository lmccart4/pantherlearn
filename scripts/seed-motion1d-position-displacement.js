// seed-motion1d-position-displacement.js
// Creates "Position, Distance & Displacement" lesson (Unit 2: Motion in 1D, Lesson 1)
// Run: node scripts/seed-motion1d-position-displacement.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Position, Distance & Displacement",
  questionOfTheDay: "If you walk 3 blocks north, then 3 blocks south, back to where you started — how far did you walk? How far are you from where you started? Why are these different?",
  course: "Physics",
  unit: "Motion in 1D",
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
      content: "**Question of the Day:** If you walk 3 blocks north, then 3 blocks south, back to where you started — how far did you walk? How far are you from where you started? Why are these different?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine you walk from your house to school (1 mile), then from school to the store (0.5 miles in the same direction), then back home (1.5 miles). What's the total distance you walked? How far are you from where you started?",
      placeholder: "Total distance walked: ... Final distance from start: ...",
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
        "Define position, distance, and displacement",
        "Distinguish between distance (scalar) and displacement (vector)",
        "Calculate displacement given position values",
        "Understand that displacement depends on start and end points, not the path taken"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION — POSITION
    // ═══════════════════════════════════════════
    {
      id: "section-position",
      type: "section_header",
      icon: "📚",
      title: "Position & Reference Points",
      subtitle: "~8 minutes"
    },
    {
      id: "b-position-intro",
      type: "text",
      content: "Before we can describe motion, we need to describe **where something is**. That's position.\n\nBut here's the thing — position is always relative to something. When you say \"the store is 2 miles away,\" you mean 2 miles **from you**. If someone else is standing somewhere different, the store might be 5 miles from them.\n\nIn physics, we pick a **reference point** (also called the origin) and measure everything from there. On a number line, this is usually x = 0."
    },
    {
      id: "b-def-position",
      type: "definition",
      term: "Position",
      definition: "The location of an object relative to a chosen reference point (origin). In 1D, it's described by a single number on a number line — positive means one direction, negative means the other."
    },
    {
      id: "b-number-line",
      type: "text",
      content: "### The Physics Number Line\n\nImagine a straight road. We put a marker at one spot and call it **x = 0** (our origin).\n\n```\n  -30  -20  -10   0   +10  +20  +30   (meters)\n   ←────────────┼────────────→\n              origin\n```\n\n- Moving right = **positive** direction (+)\n- Moving left = **negative** direction (−)\n- The sign tells you the **direction** from the origin\n\nA car at position x = +15 m is 15 meters to the right of the origin. A car at x = −8 m is 8 meters to the left."
    },
    {
      id: "q-position-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student starts at x = 0 and walks to x = +12 m. Another student starts at x = 0 and walks to x = −12 m. Which statement is true?",
      options: [
        "Both students are at the same position",
        "Both students are the same distance from the origin, but in opposite directions",
        "The first student walked farther",
        "Position can't be negative"
      ],
      correctIndex: 1,
      explanation: "Both students are 12 meters from the origin, but in opposite directions. The sign of the position tells you direction, not distance. Positive and negative are just conventions for left/right (or north/south, etc.).",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // DISTANCE vs DISPLACEMENT
    // ═══════════════════════════════════════════
    {
      id: "section-dist-disp",
      type: "section_header",
      icon: "📏",
      title: "Distance vs. Displacement",
      subtitle: "~12 minutes"
    },
    {
      id: "b-distance",
      type: "text",
      content: "Now here's where it gets interesting. There are two ways to describe \"how much\" something moved:\n\n**Distance** — the total length of the path traveled. It doesn't care about direction. It's always positive. If you walk 5 m right and then 5 m left, your distance is 10 m.\n\n**Displacement** — how far you ended up from where you started, **including direction**. It only cares about your starting point and ending point, not the path. If you walk 5 m right and then 5 m left, your displacement is 0 m — you're back where you started."
    },
    {
      id: "b-def-distance",
      type: "definition",
      term: "Distance",
      definition: "The total length of the path traveled. A scalar quantity — it has magnitude only (always positive or zero). Symbol: d."
    },
    {
      id: "b-def-displacement",
      type: "definition",
      term: "Displacement",
      definition: "The change in position from start to finish. A vector quantity — it has both magnitude and direction. Calculated as Δx = x_final − x_initial. Can be positive, negative, or zero."
    },
    {
      id: "callout-delta",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Δ (delta) symbol** means \"change in.\" So **Δx** means \"change in position\" — which is displacement.\n\n**Δx = x_final − x_initial**\n\nYou'll see Δ everywhere in physics. It always means \"final minus initial.\""
    },
    {
      id: "b-example-table",
      type: "text",
      content: "### Side-by-Side Comparison\n\n| Scenario | Distance | Displacement |\n|---|---|---|\n| Walk 6 m right | 6 m | +6 m |\n| Walk 6 m right, then 6 m left | 12 m | 0 m |\n| Walk 3 m right, then 8 m left | 11 m | −5 m |\n| Walk 10 m left | 10 m | −10 m |\n| Run a full lap around a 400 m track | 400 m | 0 m |\n\nNotice: distance is always ≥ the magnitude of displacement. They're only equal when you move in a straight line without changing direction."
    },
    {
      id: "q-dist-vs-disp-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A runner completes one full lap around a 400 m track and stops at the starting line. What is the runner's displacement?",
      options: [
        "400 m",
        "200 m",
        "0 m",
        "−400 m"
      ],
      correctIndex: 2,
      explanation: "Displacement is the change in position from start to finish. Since the runner ended exactly where they started, Δx = x_final − x_initial = 0. The distance was 400 m (they ran the whole track), but displacement only cares about start and end points.",
      difficulty: "understand"
    },
    {
      id: "q-dist-vs-disp-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A student walks 4 m east, then 7 m west. Calculate: (a) the total distance traveled, and (b) the displacement. Show your work.",
      placeholder: "Distance = ... Displacement = ...",
      difficulty: "apply"
    },
    {
      id: "callout-scalar-vector",
      type: "callout",
      style: "insight",
      icon: "📌",
      content: "**Scalar vs. Vector — Your First Big Distinction**\n\n- **Scalar:** magnitude only (distance, speed, time, mass)\n- **Vector:** magnitude AND direction (displacement, velocity, force)\n\nThis distinction will follow you through the entire course. When a quantity is a vector, direction matters. When it's a scalar, only the size matters."
    },

    // ═══════════════════════════════════════════
    // CALCULATING DISPLACEMENT
    // ═══════════════════════════════════════════
    {
      id: "section-calc",
      type: "section_header",
      icon: "🧮",
      title: "Calculating Displacement",
      subtitle: "~8 minutes"
    },
    {
      id: "b-calc-method",
      type: "text",
      content: "Calculating displacement is straightforward — it's just subtraction:\n\n**Δx = x_final − x_initial**\n\n### Worked Example 1\nA car starts at x = +5 m and moves to x = +20 m.\n\nΔx = 20 − 5 = **+15 m**\n\nThe car displaced 15 meters in the positive direction.\n\n### Worked Example 2\nA ball starts at x = +8 m and rolls to x = −3 m.\n\nΔx = (−3) − (+8) = **−11 m**\n\nThe ball displaced 11 meters in the negative direction.\n\n### Worked Example 3\nA person starts at x = −4 m and walks to x = −10 m.\n\nΔx = (−10) − (−4) = −10 + 4 = **−6 m**\n\nThey moved 6 meters in the negative direction. The negative signs can be tricky — just stick to the formula."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object moves from x = +3 m to x = −7 m. What is its displacement?",
      options: [
        "+10 m",
        "−10 m",
        "+4 m",
        "−4 m"
      ],
      correctIndex: 1,
      explanation: "Δx = x_final − x_initial = (−7) − (+3) = −10 m. The object moved 10 meters in the negative direction. Be careful with signs — always do final minus initial.",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "short_answer",
      prompt: "An ant starts at x = −2 m, walks to x = +6 m, then walks back to x = +1 m. Find: (a) the total distance traveled, and (b) the displacement from start to finish.",
      placeholder: "Distance = ... Displacement = Δx = x_final − x_initial = ...",
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
      content: "Today's key takeaways:\n\n- **Position** is where you are relative to a reference point (origin)\n- **Distance** is total path length traveled — always positive (scalar)\n- **Displacement** (Δx) is the change in position — can be positive, negative, or zero (vector)\n- **Δx = x_final − x_initial** — direction matters!\n- Distance ≥ |displacement| — they're only equal when you move in a straight line without turning around\n\n**Next up:** Speed vs. Velocity — the same scalar/vector distinction, but now applied to *how fast* something moves."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student walks 100 m north and then 60 m south. What is their distance? What is their displacement? Explain in your own words why these are different.",
      placeholder: "Distance = ... Displacement = ... They're different because...",
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
        { term: "Position", definition: "The location of an object relative to a chosen reference point (origin), described by a value on a number line." },
        { term: "Reference Point (Origin)", definition: "The fixed point from which position is measured. In 1D, it's where x = 0." },
        { term: "Distance", definition: "The total length of the path traveled. A scalar quantity — always positive or zero." },
        { term: "Displacement (Δx)", definition: "The change in position from start to finish. A vector quantity — has magnitude and direction. Δx = x_final − x_initial." },
        { term: "Scalar", definition: "A physical quantity that has magnitude (size) only. Examples: distance, speed, mass, time." },
        { term: "Vector", definition: "A physical quantity that has both magnitude and direction. Examples: displacement, velocity, force." },
        { term: "Delta (Δ)", definition: "A Greek letter meaning 'change in.' Δx = x_final − x_initial." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-position-displacement")
      .set(lesson);
    console.log('✅ Lesson "Position, Distance & Displacement" seeded successfully!');
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
