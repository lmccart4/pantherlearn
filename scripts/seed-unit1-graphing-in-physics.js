// seed-unit1-graphing-in-physics.js
// Creates "Graphing in Physics" lesson (Unit 1, Lesson 4)
// Run: node scripts/seed-unit1-graphing-in-physics.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Graphing in Physics",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 4,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "📊",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "A data table with 100 rows of numbers is hard to read. But put that same data on a graph and the pattern jumps out instantly — is it linear? Curved? Does it level off? Graphs let you *see* physics."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A picture is worth a thousand words. In physics, a graph is worth a thousand data points. How do physicists use graphs to discover relationships that aren't obvious from raw numbers?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about graphs you've made in math class. What information does a graph show that a table of numbers doesn't?",
      placeholder: "What can you see in a graph that you can't see in a table?",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Create properly labeled graphs from data (title, axes, units, scale)",
        "Identify linear, quadratic, and inverse relationships from graph shapes",
        "Determine the slope and y-intercept of a linear graph",
        "Interpret the physical meaning of slope and area under a curve"
      ]
    },

    // ═══════════════════════════════════════════
    // GRAPHING FUNDAMENTALS
    // ═══════════════════════════════════════════
    {
      id: "section-fundamentals",
      type: "section_header",
      icon: "📐",
      title: "Graphing Fundamentals",
      subtitle: "~10 minutes"
    },
    {
      id: "b-fundamentals",
      type: "text",
      content: "Every physics graph needs these elements:\n\n1. **Title** — what's being graphed (e.g., \"Position vs Time\")\n2. **X-axis** — the **independent variable** (what you control or the input)\n3. **Y-axis** — the **dependent variable** (what you measure or the output)\n4. **Axis labels with units** — always include the unit (e.g., \"Time (s)\", \"Distance (m)\")\n5. **Consistent scale** — evenly spaced tick marks\n6. **Best-fit line or curve** — don't connect the dots; draw the trend\n\n**Convention in physics:** The graph title is \"Y vs X\" — the dependent variable comes first. So \"Position vs Time\" means position is on the y-axis and time is on the x-axis."
    },
    {
      id: "callout-tip",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**DRY MIX** — a memory trick for graphing:\n- **D**ependent, **R**esponding, **Y**-axis\n- **M**anipulated, **I**ndependent, **X**-axis\n\nThe thing you CHANGE goes on X. The thing you MEASURE goes on Y."
    },
    {
      id: "q-axes",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're testing how the mass of a cart affects its acceleration when pulled by a constant force. Which variable goes on the x-axis?",
      options: [
        "Acceleration — because it's what you're measuring",
        "Mass — because it's what you're changing",
        "Force — because it's constant",
        "Time — because time always goes on the x-axis"
      ],
      correctIndex: 1,
      explanation: "Mass is the independent variable — it's what you're controlling/changing in the experiment. It goes on the x-axis. Acceleration is the dependent variable (it responds to changes in mass) and goes on the y-axis.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // RELATIONSHIP TYPES
    // ═══════════════════════════════════════════
    {
      id: "section-relationships",
      type: "section_header",
      icon: "📈",
      title: "Types of Relationships",
      subtitle: "~15 minutes"
    },
    {
      id: "b-linear",
      type: "text",
      content: "**Linear Relationship: y = mx + b**\n\nThe graph is a **straight line**. This means y changes at a constant rate as x changes.\n\n- **Slope (m)** = rise/run = Δy/Δx — the rate of change\n- **Y-intercept (b)** = where the line crosses the y-axis (the starting value when x = 0)\n\n**In physics, slope has units and physical meaning.** For example:\n- On a position vs time graph, slope = Δposition/Δtime = **velocity**\n- On a velocity vs time graph, slope = Δvelocity/Δtime = **acceleration**\n- On a force vs acceleration graph, slope = F/a = **mass**\n\nSlope isn't just a number — it tells you something real about the physics."
    },
    {
      id: "q-slope",
      type: "question",
      questionType: "short_answer",
      prompt: "A position vs time graph shows a straight line with a slope of 5 m/s. What does this slope physically represent? What is the object doing?",
      placeholder: "The slope represents...",
      difficulty: "understand"
    },
    {
      id: "b-nonlinear",
      type: "text",
      content: "**Quadratic Relationship: y = ax²**\n\nThe graph is a **parabola** — starts slow, then curves upward (or downward) rapidly. If you double x, y quadruples.\n\nPhysics example: distance traveled by an accelerating object (d = ½at²). Double the time → 4× the distance.\n\n**Inverse Relationship: y = k/x**\n\nThe graph is a **hyperbola** — starts high and decreases, approaching but never reaching zero. If you double x, y halves.\n\nPhysics example: Coulomb's Law (F ∝ 1/r²) — double the distance between charges, force drops to ¼."
    },
    {
      id: "q-shape",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A graph of kinetic energy vs speed shows a curve that starts at the origin and gets steeper as speed increases. What type of relationship is this?",
      options: [
        "Linear (KE = mv)",
        "Quadratic (KE = ½mv²)",
        "Inverse (KE = k/v)",
        "Constant (KE doesn't change)"
      ],
      correctIndex: 1,
      explanation: "Kinetic energy depends on the SQUARE of speed (KE = ½mv²). This creates a parabolic curve — double the speed and kinetic energy quadruples. That's why car crashes at 60 mph are 4× more destructive than at 30 mph.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // AREA UNDER A CURVE
    // ═══════════════════════════════════════════
    {
      id: "section-area",
      type: "section_header",
      icon: "📐",
      title: "Area Under the Curve",
      subtitle: "~5 minutes"
    },
    {
      id: "b-area",
      type: "text",
      content: "In physics, the **area under a graph** often has physical meaning too:\n\n- Area under a **velocity vs time** graph = **displacement** (how far the object moved)\n- Area under a **force vs time** graph = **impulse** (change in momentum)\n- Area under a **force vs distance** graph = **work** (energy transferred)\n\nYou'll use this concept repeatedly throughout the year. For now, just remember: in physics, both the **slope** and the **area** of a graph tell you something real."
    },
    {
      id: "callout-insight",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Graphs are not just pictures — they're problem-solving tools.** A single graph can tell you the slope (rate of change), the y-intercept (starting condition), the area (accumulated quantity), and the shape (type of relationship). Master graph reading and you'll master physics."
    },

    // ═══════════════════════════════════════════
    // PRACTICE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Practice",
      subtitle: "~5 minutes"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A straight line on a velocity vs time graph with a positive slope means the object is:",
      options: [
        "Moving at constant speed",
        "Speeding up at a constant rate (constant acceleration)",
        "Slowing down",
        "Not moving"
      ],
      correctIndex: 1,
      explanation: "On a velocity vs time graph, the slope represents acceleration. A positive slope means velocity is increasing at a constant rate — the object is accelerating uniformly.",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A velocity vs time graph shows a horizontal line at v = 8 m/s from t = 0 to t = 5 s. What is the displacement? (Hint: calculate the area under the line.)",
      placeholder: "Area = ... = displacement of ... m",
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
      content: "Key takeaways:\n\n- Every graph needs a title, labeled axes with units, and a consistent scale\n- **Independent variable** on x-axis, **dependent variable** on y-axis\n- **Linear** (straight line), **quadratic** (parabola), **inverse** (hyperbola) — each shape tells you the relationship\n- **Slope = rate of change** and has physical meaning (velocity, acceleration, mass, etc.)\n- **Area under the curve** also has physical meaning (displacement, impulse, work)\n\n**Every single unit this year uses graphs.** The skill you build today is the skill you'll use every day.\n\n**Next up:** Scientific notation — how to handle numbers from the speed of light to the mass of a proton."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Explain what the slope of a position vs time graph represents, including its units. Then explain what the slope of a velocity vs time graph represents.",
      placeholder: "Slope of position vs time = ... Slope of velocity vs time = ...",
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
        { term: "Independent variable", definition: "The variable the experimenter controls; plotted on the x-axis." },
        { term: "Dependent variable", definition: "The variable that responds to changes in the independent variable; plotted on the y-axis." },
        { term: "Slope", definition: "Rise over run (Δy/Δx); in physics, slope has units and represents a physical quantity like velocity or acceleration." },
        { term: "Linear relationship", definition: "A relationship where y changes at a constant rate with x, producing a straight-line graph (y = mx + b)." },
        { term: "Quadratic relationship", definition: "A relationship where y depends on x², producing a parabolic curve. Doubling x quadruples y." },
        { term: "Inverse relationship", definition: "A relationship where y decreases as x increases (y = k/x), producing a hyperbolic curve." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("graphing-in-physics")
      .set(lesson);
    console.log('✅ Lesson "Graphing in Physics" seeded successfully!');
    console.log("   Path: courses/physics/lessons/graphing-in-physics");
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
