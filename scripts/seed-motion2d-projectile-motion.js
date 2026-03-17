// seed-motion2d-projectile-motion.js
// Creates "Projectile Motion" lesson (Unit 3: Motion in 2D, Lesson 3)
// Run: node scripts/seed-motion2d-projectile-motion.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Projectile Motion",
  questionOfTheDay: "If you drop a ball and throw another ball horizontally off a table at the same time, which one hits the ground first? Most people get this wrong.",
  course: "Physics",
  unit: "Motion in 2D",
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
      icon: "🏀",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you drop a ball and throw another ball horizontally off a table at the same time, which one hits the ground first? Most people get this wrong."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Make your prediction BEFORE we learn the answer: You drop a ball straight down from a cliff. At the exact same time, you throw another ball horizontally. Which hits the ground first?",
      options: [
        "The dropped ball hits first",
        "The thrown ball hits first",
        "They hit at the same time",
        "It depends on how hard you throw"
      ],
      correctIndex: 2,
      explanation: "They hit at the same time! This is the key insight of projectile motion — horizontal and vertical motion are independent. We'll explore why throughout this lesson.",
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
        "Explain that horizontal and vertical motion are independent",
        "Describe the path (trajectory) of a projectile",
        "Analyze a horizontal launch projectile problem",
        "Identify the role of gravity in projectile motion"
      ]
    },

    // ═══════════════════════════════════════════
    // THE BIG IDEA
    // ═══════════════════════════════════════════
    {
      id: "section-big-idea",
      type: "section_header",
      icon: "📚",
      title: "The Big Idea: Independence of Motion",
      subtitle: "~10 minutes"
    },
    {
      id: "b-def-projectile",
      type: "definition",
      term: "Projectile",
      definition: "Any object that is thrown, launched, or dropped and moves through the air under the influence of gravity alone (no engine, no thrust, no lift — just gravity). Air resistance is ignored in our model."
    },
    {
      id: "b-big-idea",
      type: "text",
      content: "Here's the most important idea in this entire unit — and it's counterintuitive:\n\n**Horizontal motion and vertical motion are completely independent.**\n\nThey don't affect each other. At all. Here's what that means:\n\n- **Horizontal:** No forces act horizontally (we ignore air resistance), so horizontal velocity stays constant. Whatever horizontal speed the object starts with, it keeps.\n\n- **Vertical:** Gravity pulls the object down at 9.8 m/s², exactly like free fall. The vertical motion is identical to dropping something straight down.\n\nThe object does both simultaneously — it moves sideways at a constant speed while falling faster and faster."
    },
    {
      id: "callout-key",
      type: "callout",
      style: "insight",
      icon: "🔑",
      content: "**The Key Insight:** A ball dropped from rest and a ball thrown horizontally from the same height fall at the **same rate**. They hit the ground at the **same time**. The horizontal velocity doesn't help or hurt the vertical fall.\n\nThis feels wrong — but it's been tested and confirmed countless times. Gravity doesn't care if you're also moving sideways."
    },
    {
      id: "q-independence-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A bullet is fired horizontally from the top of a cliff. Ignoring air resistance, what is the bullet's horizontal acceleration?",
      options: [
        "9.8 m/s²",
        "The initial speed of the bullet",
        "0 m/s² — there's no horizontal force",
        "It depends on the mass of the bullet"
      ],
      correctIndex: 2,
      explanation: "With no horizontal forces (we ignore air resistance), there's no horizontal acceleration. The bullet maintains its initial horizontal velocity the entire time. Gravity only acts vertically. This is the independence principle at work.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // THE TRAJECTORY
    // ═══════════════════════════════════════════
    {
      id: "section-trajectory",
      type: "section_header",
      icon: "📈",
      title: "The Parabolic Path",
      subtitle: "~8 minutes"
    },
    {
      id: "b-trajectory",
      type: "text",
      content: "When you combine constant horizontal velocity with accelerating vertical velocity, you get a curved path — specifically a **parabola**.\n\n```\nLaunch →  •\n              •\n                 •\n                    •\n                       •\n                          •\n                             •  ← hits ground\n```\n\nAs the object moves:\n- Horizontal: equal spacing (constant velocity)\n- Vertical: increasing spacing (accelerating downward)\n\nThe result is that graceful curved arc you see when you throw a ball, kick a soccer ball, or shoot a basketball."
    },
    {
      id: "b-components-table",
      type: "text",
      content: "### Horizontal vs. Vertical — Side by Side\n\n| Property | Horizontal (x) | Vertical (y) |\n|---|---|---|\n| **Acceleration** | 0 (no horizontal force) | g = 9.8 m/s² downward |\n| **Velocity** | Constant (v_x = v₀) | Changes (speeds up going down) |\n| **Motion type** | Constant velocity | Free fall (accelerating) |\n| **Equation for distance** | x = v₀ₓ × t | y = ½gt² (from rest) |\n| **Affected by gravity?** | No | Yes |\n\nTwo independent motions happening at the same time. Solve each direction separately, and time (t) connects them."
    },
    {
      id: "q-trajectory-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "As a horizontally launched projectile falls, what happens to its horizontal velocity (ignoring air resistance)?",
      options: [
        "It increases because gravity accelerates it",
        "It decreases because the object is falling",
        "It stays the same — gravity only affects vertical motion",
        "It depends on how high the object was launched from"
      ],
      correctIndex: 2,
      explanation: "Horizontal velocity stays constant throughout the entire flight. Gravity is a vertical force — it only changes the vertical velocity. The horizontal and vertical components are independent.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // HORIZONTAL LAUNCH PROBLEMS
    // ═══════════════════════════════════════════
    {
      id: "section-problems",
      type: "section_header",
      icon: "🧮",
      title: "Solving Horizontal Launch Problems",
      subtitle: "~12 minutes"
    },
    {
      id: "b-strategy",
      type: "text",
      content: "### Problem-Solving Strategy\n\n**Step 1:** Draw it. Label what you know.\n\n**Step 2:** Separate into horizontal and vertical.\n- Horizontal: v_x = constant, x = v_x × t\n- Vertical: v₀_y = 0 (horizontal launch), a_y = 9.8 m/s², y = ½gt²\n\n**Step 3:** Use the vertical to find time (usually).\n- Height gives you time: t = √(2y / g)\n\n**Step 4:** Use time in the horizontal equation.\n- Range: x = v_x × t\n\n**Key insight:** Time is the bridge between horizontal and vertical. The object is in the air for the same amount of time in both directions."
    },
    {
      id: "b-worked-example-1",
      type: "text",
      content: "### Worked Example 1\n\n**Problem:** A ball rolls off a 1.25 m high table at 3 m/s. How far from the base of the table does it land?\n\n**Step 1: What we know.**\n- Height: y = 1.25 m\n- Initial horizontal velocity: v_x = 3 m/s\n- Initial vertical velocity: v₀_y = 0 (horizontal launch)\n- g = 9.8 m/s²\n\n**Step 2: Find time using vertical motion.**\ny = ½gt²\n1.25 = ½(9.8)t²\n1.25 = 4.9t²\nt² = 0.255\nt = **0.505 s**\n\n**Step 3: Find horizontal distance.**\nx = v_x × t = 3 × 0.505 = **1.52 m**\n\nThe ball lands 1.52 meters from the base of the table."
    },
    {
      id: "b-worked-example-2",
      type: "text",
      content: "### Worked Example 2\n\n**Problem:** A stone is thrown horizontally at 15 m/s from a cliff 80 m high. (a) How long is it in the air? (b) How far from the cliff does it land? (c) What is its vertical velocity just before impact?\n\n**(a) Time in air (vertical):**\ny = ½gt²\n80 = ½(9.8)t²\n80 = 4.9t²\nt² = 16.33\nt = **4.04 s**\n\n**(b) Horizontal distance:**\nx = v_x × t = 15 × 4.04 = **60.6 m**\n\n**(c) Vertical velocity at impact:**\nv_y = g × t = 9.8 × 4.04 = **39.6 m/s downward**\n\nNotice: the stone covers 60.6 m horizontally while falling 80 m vertically. The horizontal and vertical distances are independent."
    },
    {
      id: "q-problem-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A cat knocks a cup off a 0.8 m high counter. The cup flies off horizontally at 1.5 m/s. (a) How long does it take to hit the floor? (b) How far from the counter does it land? Show your work.",
      placeholder: "(a) y = ½gt², solve for t... (b) x = v_x × t...",
      difficulty: "apply"
    },
    {
      id: "q-problem-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two identical balls are launched horizontally from the same height — one at 5 m/s and the other at 10 m/s. Compared to the slower ball, the faster ball:",
      options: [
        "Hits the ground sooner",
        "Hits the ground later",
        "Hits the ground at the same time but farther away",
        "Follows a straight-line path instead of a curve"
      ],
      correctIndex: 2,
      explanation: "Both balls fall the same height, so they're in the air for the same time (horizontal speed doesn't affect vertical fall). But the faster ball covers more horizontal distance during that time: x = v_x × t. Same time, double the speed = double the range.",
      difficulty: "understand"
    },
    {
      id: "q-problem-3",
      type: "question",
      questionType: "short_answer",
      prompt: "An airplane flying horizontally at 100 m/s drops a supply crate from a height of 500 m. (a) How long until the crate hits the ground? (b) How far ahead of the drop point does it land? (c) What is the crate's horizontal velocity just before impact?",
      placeholder: "(a) t = √(2y/g) = ... (b) x = v_x × t = ... (c) horizontal velocity = ...",
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
      content: "Today's key takeaways:\n\n- A **projectile** is any object moving under gravity alone (no engine, ignoring air resistance)\n- **Horizontal and vertical motion are independent** — they don't affect each other\n- Horizontal: constant velocity (no acceleration, no horizontal force)\n- Vertical: free fall (acceleration = g = 9.8 m/s² downward)\n- **Time connects the two:** find time from one direction, use it in the other\n- A dropped ball and a horizontally thrown ball hit the ground **at the same time** (same height)\n- The path is a **parabola**\n\n**Coming up:** Angled launches — what happens when you throw at an angle above the horizontal. Same principles, just more trig."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A marble rolls off a desk at 2 m/s. The desk is 0.75 m high. Where does the marble land? Show the two key equations you used and your answer.",
      placeholder: "Vertical: t = √(2y/g) = ... Horizontal: x = v_x × t = ...",
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
        { term: "Projectile", definition: "An object that moves through the air under the influence of gravity alone. No engine or thrust — just an initial velocity and gravity." },
        { term: "Trajectory", definition: "The curved path that a projectile follows through the air. For projectiles near Earth's surface, this is a parabola." },
        { term: "Horizontal Launch", definition: "A projectile launched with an initial velocity that is entirely horizontal. The initial vertical velocity is zero." },
        { term: "Independence of Motion", definition: "The principle that horizontal and vertical components of projectile motion do not affect each other. Gravity only acts vertically." },
        { term: "Range", definition: "The horizontal distance a projectile travels before landing. Depends on both horizontal speed and time in the air." },
        { term: "Free Fall", definition: "Motion under the influence of gravity alone. All objects in free fall accelerate at g = 9.8 m/s² downward, regardless of mass." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-projectile-motion")
      .set(lesson);
    console.log('✅ Lesson "Projectile Motion" seeded successfully!');
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
