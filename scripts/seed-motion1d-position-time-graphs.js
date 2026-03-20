// seed-motion1d-position-time-graphs.js
// Creates "Position-Time Graphs and Motion Mapper" lesson (Unit 2: Motion in 1D, Lesson 4)
// Run: node scripts/seed-motion1d-position-time-graphs.js
// Modeling/inquiry style — hook with Motion Mapper game, then extract patterns

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Position-Time Graphs and Motion Mapper",
  questionOfTheDay: "If you walked away from a wall, stopped, then walked back faster — what would your position-time graph look like?",
  course: "Physics",
  unit: "Motion in 1D",
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
      content: "**Question of the Day:** If you walked away from a wall, stopped, then walked back faster — what would your position-time graph look like? Sketch it in your mind before we dive in."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Without looking anything up: what do you think the slope of a position-time graph tells you? What about a flat (horizontal) section? A downward slope?",
      placeholder: "Slope tells me... A flat line means... A downward slope means...",
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
        "Read a position-time graph to describe an object's motion",
        "Calculate average velocity from a p-t graph using slope = rise/run",
        "Identify: positive slope (moving away), negative slope (moving back), zero slope (stationary)",
        "Connect steeper slope with faster speed",
        "Sketch a p-t graph for a described motion scenario"
      ]
    },

    // ═══════════════════════════════════════════
    // MOTION MAPPER
    // ═══════════════════════════════════════════
    {
      id: "section-motion-mapper",
      type: "section_header",
      icon: "🎮",
      title: "Motion Mapper: Play First",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-motion-mapper-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Class Reference:** Motion Mapper was used in class (Oct/Nov 2025) to explore position-time graphs. The game lets you 'walk' a character and see the graph in real time. Play it now — figure out how to make specific graph shapes."
    },
    {
      id: "embed-motion-mapper",
      type: "iframe_embed",
      src: "https://www.physicsclassroom.com/Physics-Interactives/1-D-Kinematics/Graph-That-Motion/Graph-That-Motion-Interactive",
      title: "Motion Mapper — Graph That Motion",
      height: 500
    },
    {
      id: "q-motion-mapper-explore",
      type: "question",
      questionType: "short_answer",
      prompt: "After playing Motion Mapper: (a) How do you make the graph go flat (horizontal)? (b) How do you make it slope upward steeply vs. gently? (c) How do you make it slope downward? Describe what the character does in each case.",
      placeholder: "(a) Flat line: character is... (b) Steep upward slope: ... gentle upward: ... (c) Downward slope: ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // READING P-T GRAPHS
    // ═══════════════════════════════════════════
    {
      id: "section-reading",
      type: "section_header",
      icon: "📈",
      title: "Reading Position-Time Graphs",
      subtitle: "~15 minutes"
    },
    {
      id: "b-reading-intro",
      type: "text",
      content: "### What a P-T Graph Shows\n\nA **position-time (p-t) graph** plots position (y-axis, in meters) vs. time (x-axis, in seconds). Each point tells you exactly where the object is at a specific moment.\n\n### The Key Rule: **Slope = Velocity**\n\n- **Positive slope** → moving in the positive direction (away from origin)\n- **Negative slope** → moving in the negative direction (toward origin or backward)\n- **Zero slope (flat line)** → stationary (v = 0)\n- **Steeper slope** → faster speed\n\n### Calculating Velocity from a Graph\n\nVelocity = slope = Δposition / Δtime = (y₂ - y₁) / (x₂ - x₁)\n\nUnits: meters per second (m/s). A negative velocity means moving in the negative direction."
    },
    {
      id: "b-segments-example",
      type: "text",
      content: "### Reading a Multi-Segment Graph\n\nConsider a p-t graph with 4 segments:\n\n```\nPosition (m)\n10 |         ___\n 8 |        /   \\\n 6 |   ____/     \\\n 4 |  /            \\_____\n 2 | /\n 0 +--+---+--+---+--→ Time (s)\n   0   2  4  6   8  10\n```\n\n**Segment A (0→2 s):** Slope > 0 → moving forward (away)\n**Segment B (2→4 s):** Flat → stationary\n**Segment C (4→6 s):** Steeper positive slope → moving forward, faster than A\n**Segment D (6→10 s):** Negative slope → moving backward"
    },
    {
      id: "q-reading-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "On a p-t graph, a straight line goes from position 2 m at t=0 to position 8 m at t=3 s. What is the average velocity?",
      options: [
        "2 m/s",
        "8 m/s",
        "3 m/s",
        "10 m/s"
      ],
      correctIndex: 0,
      explanation: "Velocity = slope = Δx/Δt = (8-2)/(3-0) = 6/3 = 2 m/s. The slope formula gives velocity directly from a p-t graph.",
      difficulty: "apply"
    },
    {
      id: "q-reading-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A p-t graph shows a horizontal line at 5 m for 4 seconds. What is the object doing?",
      options: [
        "Moving at 5 m/s",
        "Accelerating from 0 to 5 m/s",
        "Stationary at 5 m from the origin",
        "Moving backward at 5 m/s"
      ],
      correctIndex: 2,
      explanation: "A flat line means zero slope = zero velocity. The object isn't moving — it stays at 5 m from the origin for 4 seconds.",
      difficulty: "understand"
    },
    {
      id: "q-reading-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two lines on a p-t graph: Line A goes from 0 to 6 m in 3 s. Line B goes from 0 to 6 m in 1 s. Which object is faster?",
      options: [
        "Line A — it goes farther",
        "Line B — steeper slope means faster speed",
        "They're the same — both travel 6 m",
        "Cannot be determined from p-t graphs"
      ],
      correctIndex: 1,
      explanation: "Both go 6 m, but Line B does it in 1 s vs. Line A's 3 s. Steeper slope = greater velocity. v_A = 6/3 = 2 m/s. v_B = 6/1 = 6 m/s. Line B is 3× faster.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // PHET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "💻",
      title: "Simulation: Moving Man",
      subtitle: "~8 minutes"
    },
    {
      id: "embed-phet",
      type: "iframe_embed",
      src: "https://phet.colorado.edu/sims/html/moving-man/latest/moving-man_en.html",
      title: "PhET: Moving Man",
      height: 500
    },
    {
      id: "callout-phet-instructions",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Try this:** Watch the position-time graph as you drag the man. (a) Drag him fast to the right — what does the graph look like? (b) Slow him to a stop — what happens? (c) Move him backward — what's different on the graph? (d) Try to recreate: move right, stop, move right faster."
    },

    // ═══════════════════════════════════════════
    // STORY FROM GRAPH
    // ═══════════════════════════════════════════
    {
      id: "section-story",
      type: "section_header",
      icon: "📖",
      title: "Reading the Story",
      subtitle: "~8 minutes"
    },
    {
      id: "q-story-from-graph",
      type: "question",
      questionType: "short_answer",
      prompt: "A p-t graph shows: starts at 0 m, rises steadily to 10 m at t=5s, stays flat until t=8s, then drops sharply back to 0 m at t=10s.\n\nTell the story of this motion. Include: how fast the person moved in each phase, which direction, whether they stopped, and how fast they returned compared to how fast they left.",
      placeholder: "Phase 1 (0-5s): The person... at v = ... Phase 2 (5-8s): ... Phase 3 (8-10s): ... The return trip was [faster/slower] than the departure because...",
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
      content: "Today's key takeaways:\n\n- **Slope of p-t graph = velocity**\n- Positive slope → moving away (positive direction)\n- Negative slope → moving back\n- Zero slope (flat) → stationary\n- Steeper slope → faster speed\n- Velocity = Δx / Δt (rise over run on the graph)\n\n**Next up:** Velocity-Time Graphs — the slope of THAT graph tells you something different (acceleration)."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Sketch (describe) a p-t graph for: a student walks slowly to a water fountain (takes 8 seconds, 12 m away), stops for 10 seconds, then walks back quickly (takes 4 seconds). What is the velocity on each segment?",
      placeholder: "Segment 1 (walking to fountain): slope = ... velocity = ... Segment 2 (stopped): ... Segment 3 (returning): slope = ... velocity = ...",
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
        { term: "Position-Time Graph (p-t graph)", definition: "A graph plotting position (y-axis) vs. time (x-axis). Shows where an object is at every moment." },
        { term: "Slope", definition: "Rise over run: Δy/Δx. On a p-t graph, slope = velocity. Steeper slope = faster speed." },
        { term: "Average Velocity", definition: "Total displacement divided by total time. On a p-t graph: slope between two points = average velocity between them." },
        { term: "Stationary", definition: "Not moving. On a p-t graph: a flat horizontal line (slope = 0, velocity = 0)." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-position-time-graphs")
      .set(lesson);
    console.log('✅ Lesson "Position-Time Graphs and Motion Mapper" seeded successfully!');
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
