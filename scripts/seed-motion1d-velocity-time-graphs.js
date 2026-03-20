// seed-motion1d-velocity-time-graphs.js
// Creates "Velocity-Time Graphs" lesson (Unit 2: Motion in 1D, Lesson 5)
// Run: node scripts/seed-motion1d-velocity-time-graphs.js
// Modeling/inquiry style — connect p-t and v-t, extract slope and area rules

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Velocity-Time Graphs",
  questionOfTheDay: "A car accelerates from 0 to 60 mph in 5 seconds, then cruises at constant speed for 10 seconds, then brakes to a stop in 3 seconds. What would this look like on a velocity-time graph?",
  course: "Physics",
  unit: "Motion in 1D",
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
      content: "**Question of the Day:** A car accelerates from 0 to 60 mph in 5 seconds, then cruises at constant speed for 10 seconds, then brakes to a stop in 3 seconds. What would this look like on a velocity-time graph?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Recall: On a position-time graph, slope = velocity. Make a prediction: On a velocity-time graph, what does the slope tell you? What does a flat line mean?",
      placeholder: "On a v-t graph, slope tells me... A flat line means...",
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
        "Read a velocity-time graph to describe motion (constant v, speeding up, slowing down)",
        "Calculate acceleration from the slope of a v-t graph",
        "Calculate displacement from the area under a v-t graph",
        "Compare and connect p-t and v-t graphs for the same motion",
        "Recognize that negative velocity on a v-t graph means moving backward"
      ]
    },

    // ═══════════════════════════════════════════
    // PHET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "💻",
      title: "Simulation: Moving Man",
      subtitle: "~10 minutes"
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
      content: "**Try this:** Watch BOTH graphs (position and velocity) at the same time. (a) Move the man slowly to the right — what do both graphs show? (b) Accelerate him (move faster over time) — how does the v-t graph change vs. the p-t graph? (c) Make him move backward — what happens to the velocity graph?"
    },
    {
      id: "q-phet-compare",
      type: "question",
      questionType: "short_answer",
      prompt: "Using the simulation: Describe the p-t and v-t graphs for a man who (a) moves right at constant speed, (b) accelerates while moving right. For each: what shape is the p-t graph? What shape is the v-t graph?",
      placeholder: "(a) Constant speed: p-t graph looks... v-t graph looks... (b) Accelerating: p-t graph looks... v-t graph looks...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // V-T GRAPH RULES
    // ═══════════════════════════════════════════
    {
      id: "section-rules",
      type: "section_header",
      icon: "📈",
      title: "V-T Graphs: Two Key Rules",
      subtitle: "~15 minutes"
    },
    {
      id: "b-vt-intro",
      type: "text",
      content: "A **velocity-time (v-t) graph** plots velocity (y-axis, in m/s) vs. time (x-axis, in seconds).\n\nThere are two things you can extract from a v-t graph:\n\n### Rule 1: Slope = Acceleration\n\nacceleration = Δvelocity / Δtime = (v₂ - v₁) / (t₂ - t₁)\n\n- **Positive slope** → speeding up (in positive direction)\n- **Negative slope** → slowing down OR speeding up in negative direction\n- **Zero slope (flat line)** → constant velocity (zero acceleration)\n\n### Rule 2: Area = Displacement\n\nThe area under a v-t curve (between the graph line and the x-axis) = displacement.\n\n- Positive area (above x-axis) → displacement in positive direction\n- Negative area (below x-axis) → displacement in negative direction"
    },
    {
      id: "b-comparison-table",
      type: "text",
      content: "### P-T vs. V-T Graph Comparison\n\n| Feature | Position-Time Graph | Velocity-Time Graph |\n|---|---|---|\n| **Y-axis** | Position (m) | Velocity (m/s) |\n| **Flat line means** | Stationary (v = 0) | Constant velocity (a = 0) |\n| **Slope means** | Velocity | Acceleration |\n| **Curved line means** | Changing velocity | Changing acceleration |\n| **Area under** | N/A | Displacement |\n\nSame motion can look totally different on each graph. A straight diagonal line on a p-t graph appears as a flat line on a v-t graph (constant velocity)."
    },
    {
      id: "q-vt-slope",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A v-t graph shows velocity going from 0 m/s to 20 m/s over 5 seconds (straight line). What is the acceleration?",
      options: [
        "100 m/s²",
        "5 m/s²",
        "4 m/s²",
        "0.25 m/s²"
      ],
      correctIndex: 2,
      explanation: "Acceleration = slope = Δv/Δt = (20-0)/(5-0) = 20/5 = 4 m/s². The slope formula works the same as for p-t graphs — just with velocity instead of position.",
      difficulty: "apply"
    },
    {
      id: "q-vt-flat",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A v-t graph shows a flat horizontal line at v = 5 m/s for 10 seconds. What is the displacement during this time?",
      options: [
        "5 m",
        "10 m",
        "50 m",
        "2 m"
      ],
      correctIndex: 2,
      explanation: "Displacement = area under the v-t graph = v × Δt = 5 m/s × 10 s = 50 m. The rectangle under a flat v-t line has area = height × width = velocity × time = displacement.",
      difficulty: "apply"
    },
    {
      id: "q-vt-describe",
      type: "question",
      questionType: "short_answer",
      prompt: "A v-t graph shows: starts at 0, rises linearly to 10 m/s at t=5s, stays flat at 10 m/s until t=15s, then drops linearly to 0 at t=18s.\n\n(a) What is the acceleration in each phase?\n(b) What is the displacement in each phase? (area = ½bh for triangles, bh for rectangles)\n(c) What is total displacement?",
      placeholder: "(a) Phase 1 a = ... Phase 2 a = ... Phase 3 a = ... (b) Phase 1 Δx = ... Phase 2 Δx = ... Phase 3 Δx = ... (c) Total = ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // FREE FALL V-T DESCRIPTION
    // ═══════════════════════════════════════════
    {
      id: "section-freefall-vt",
      type: "section_header",
      icon: "⬇️",
      title: "V-T Graph in Context: Free Fall",
      subtitle: "~5 minutes"
    },
    {
      id: "b-freefall-vt",
      type: "text",
      content: "### Skydiver's V-T Graph\n\nA skydiver jumps and falls toward the ground. Ignore air resistance for now.\n\n- **v-t graph:** Straight line sloping downward (if we define down as negative) OR upward (if we define down as positive)\n- Slope = -g = -9.8 m/s² OR +g depending on sign convention\n- The line is perfectly straight: constant acceleration\n\nWith air resistance included:\n- The line curves and becomes flatter over time\n- Eventually it becomes horizontal at terminal velocity (a = 0)\n- The slope starts steep (large acceleration) and approaches 0 (terminal velocity)"
    },
    {
      id: "q-freefall-vt",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the v-t graph for a skydiver from jump to landing (with air resistance). What does the shape of the graph look like, and what does each part of the shape mean physically?",
      placeholder: "At the start, the graph... because... Over time, the graph... because... At terminal velocity, the graph... because...",
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
      content: "Today's key takeaways:\n\n- **Slope of v-t graph = acceleration**\n- Flat v-t line → constant velocity (zero acceleration)\n- Sloping line → object is accelerating or decelerating\n- **Area under v-t graph = displacement**\n- P-t and v-t graphs describe the same motion differently — connect both\n\n**Next up:** Motion Diagrams — a third way to represent motion using dots and arrows."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Describe the v-t graph for a car that: starts at rest, accelerates for 5 seconds reaching 20 m/s, drives at constant speed for 10 seconds, then brakes to a stop in 3 seconds. What is the acceleration in each phase?",
      placeholder: "Phase 1 (0-5s): graph shows... a = ... Phase 2 (5-15s): graph shows... a = ... Phase 3 (15-18s): graph shows... a = ...",
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
        { term: "Velocity-Time Graph (v-t graph)", definition: "A graph plotting velocity (y-axis) vs. time (x-axis). Shows how fast an object is moving and in what direction at every moment." },
        { term: "Slope of V-T Graph", definition: "Δv/Δt = acceleration. A steeper slope means greater acceleration." },
        { term: "Area Under V-T Graph", definition: "The area between the v-t curve and the time axis equals displacement. Positive area = positive displacement." },
        { term: "Constant Velocity", definition: "On a v-t graph: a flat horizontal line. Slope = 0 means zero acceleration." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-velocity-time-graphs")
      .set(lesson);
    console.log('✅ Lesson "Velocity-Time Graphs" seeded successfully!');
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
