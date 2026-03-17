// seed-motion1d-acceleration.js
// Creates "Acceleration" lesson (Unit 2: Motion in 1D, Lesson 3)
// Run: node scripts/seed-motion1d-acceleration.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Acceleration",
  questionOfTheDay: "A car speeds up from 0 to 60 mph in 3 seconds. A truck speeds up from 0 to 60 mph in 10 seconds. They both reach the same speed — so what's different about their motion? How would you describe that difference?",
  course: "Physics",
  unit: "Motion in 1D",
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
      icon: "🚀",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A car speeds up from 0 to 60 mph in 3 seconds. A truck speeds up from 0 to 60 mph in 10 seconds. They both reach the same speed — so what's different about their motion? How would you describe that difference?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of three real-world examples where something speeds up, slows down, or changes direction. For each one, describe what's happening to its velocity.",
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
        "Define acceleration as the rate of change of velocity",
        "Calculate average acceleration using a = Δv / Δt",
        "Interpret positive, negative, and zero acceleration",
        "Distinguish between speeding up, slowing down, and constant velocity"
      ]
    },

    // ═══════════════════════════════════════════
    // WHAT IS ACCELERATION?
    // ═══════════════════════════════════════════
    {
      id: "section-what-is",
      type: "section_header",
      icon: "📚",
      title: "What Is Acceleration?",
      subtitle: "~10 minutes"
    },
    {
      id: "b-intro",
      type: "text",
      content: "Last lesson, we learned that velocity tells you how fast your **position** is changing. Acceleration takes it one step further — it tells you how fast your **velocity** is changing.\n\n- **Position** → how far from the origin\n- **Velocity** → how fast your position changes\n- **Acceleration** → how fast your velocity changes\n\nIt's a chain: acceleration changes velocity, and velocity changes position."
    },
    {
      id: "b-def-acceleration",
      type: "definition",
      term: "Acceleration",
      definition: "The rate at which velocity changes over time. A vector quantity. Acceleration = change in velocity / time. a = Δv / Δt. Units: m/s² (meters per second, per second)."
    },
    {
      id: "callout-formula",
      type: "callout",
      style: "insight",
      icon: "📐",
      content: "**Average Acceleration:**\n\n**a = Δv / Δt = (v_final − v_initial) / (t_final − t_initial)**\n\n- Units: **m/s²** — read as \"meters per second squared\" or \"meters per second per second\"\n- Positive a → velocity is increasing (becoming more positive)\n- Negative a → velocity is decreasing (becoming more negative)"
    },
    {
      id: "b-units-explained",
      type: "text",
      content: "### What Does m/s² Actually Mean?\n\nThe units **m/s²** might seem weird, but they make perfect sense:\n\nIf a = 5 m/s², that means velocity changes by **5 m/s every second**.\n\n| Time (s) | Velocity (m/s) |\n|---|---|\n| 0 | 0 |\n| 1 | 5 |\n| 2 | 10 |\n| 3 | 15 |\n| 4 | 20 |\n\nEvery second, the velocity increases by 5 m/s. That's what acceleration means — a steady, predictable change in velocity."
    },
    {
      id: "q-meaning",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object has an acceleration of 3 m/s². What does this mean?",
      options: [
        "The object is moving at 3 m/s",
        "The object's velocity increases by 3 m/s every second",
        "The object moves 3 meters every second",
        "The object's position increases by 3 m/s²"
      ],
      correctIndex: 1,
      explanation: "Acceleration of 3 m/s² means the velocity changes by 3 m/s each second. If the object starts at rest (0 m/s), after 1 s it's at 3 m/s, after 2 s it's at 6 m/s, after 3 s it's at 9 m/s. Acceleration tells you the rate of velocity change, not the velocity itself.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // CALCULATING ACCELERATION
    // ═══════════════════════════════════════════
    {
      id: "section-calculating",
      type: "section_header",
      icon: "🧮",
      title: "Calculating Acceleration",
      subtitle: "~10 minutes"
    },
    {
      id: "b-example-1",
      type: "text",
      content: "### Worked Example 1 — Speeding Up\n\nA car goes from 0 m/s to 25 m/s in 5 seconds.\n\na = Δv / Δt = (25 − 0) / 5 = 25/5 = **+5 m/s²**\n\nPositive acceleration + positive velocity = the car is **speeding up**.\n\n### Worked Example 2 — Slowing Down\n\nA bike going +12 m/s slows to +4 m/s in 4 seconds.\n\na = Δv / Δt = (4 − 12) / 4 = −8/4 = **−2 m/s²**\n\nNegative acceleration while moving in the positive direction = the bike is **slowing down**.\n\n### Worked Example 3 — Speeding Up in the Negative Direction\n\nA ball rolls from −2 m/s to −8 m/s in 3 seconds.\n\na = Δv / Δt = (−8 − (−2)) / 3 = −6/3 = **−2 m/s²**\n\nNegative acceleration + negative velocity = the ball is **speeding up** (in the negative direction). This one trips people up!"
    },
    {
      id: "callout-tricky",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Common Misconception:** Negative acceleration does NOT always mean slowing down!\n\n- Same sign (both + or both −) for velocity and acceleration → **speeding up**\n- Opposite signs (one +, one −) for velocity and acceleration → **slowing down**\n\nThe sign of acceleration tells you the direction of the velocity *change*, not whether the object is getting faster or slower."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A car traveling at +20 m/s brakes to +8 m/s in 4 seconds. What is its acceleration?",
      options: [
        "+7 m/s²",
        "+3 m/s²",
        "−3 m/s²",
        "−7 m/s²"
      ],
      correctIndex: 2,
      explanation: "a = Δv / Δt = (8 − 20) / 4 = −12/4 = −3 m/s². The acceleration is negative because the velocity decreased — the car slowed down. The negative sign tells you the acceleration is opposite to the direction of motion.",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A skateboarder starts from rest and reaches a velocity of +6 m/s in 3 seconds, then continues accelerating to +14 m/s over the next 4 seconds. (a) What is the acceleration during the first 3 seconds? (b) What is the acceleration during the next 4 seconds? (c) During which interval was the acceleration greater?",
      placeholder: "(a) a = Δv/Δt = ... (b) a = Δv/Δt = ... (c) ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SPEEDING UP vs SLOWING DOWN
    // ═══════════════════════════════════════════
    {
      id: "section-speeding",
      type: "section_header",
      icon: "🔄",
      title: "Speeding Up vs. Slowing Down",
      subtitle: "~8 minutes"
    },
    {
      id: "b-speeding-table",
      type: "text",
      content: "This is the part that confuses most people. Let's lay it out clearly:\n\n| Velocity | Acceleration | What's Happening? | Example |\n|---|---|---|---|\n| + | + | Speeding up (positive direction) | Car accelerating forward |\n| + | − | Slowing down | Car braking |\n| − | − | Speeding up (negative direction) | Ball rolling faster downhill |\n| − | + | Slowing down | Ball rolling uphill, slowing down |\n| any | 0 | Constant velocity | Cruise control on a highway |\n\n**The rule:** If velocity and acceleration have the **same sign**, the object speeds up. If they have **opposite signs**, the object slows down."
    },
    {
      id: "q-speeding-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object has a velocity of −5 m/s and an acceleration of −2 m/s². Is the object speeding up or slowing down?",
      options: [
        "Speeding up — both are negative, so they're in the same direction",
        "Slowing down — the acceleration is negative, which always means slowing down",
        "Neither — negative acceleration cancels out negative velocity",
        "Can't determine from the information given"
      ],
      correctIndex: 0,
      explanation: "Same sign (both negative) means speeding up. The object is moving in the negative direction and accelerating in the negative direction — it's getting faster. Remember: negative acceleration ≠ slowing down. It depends on the direction of the velocity too.",
      difficulty: "understand"
    },
    {
      id: "q-speeding-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A ball is thrown straight up. As it rises, is its acceleration positive or negative? As it falls back down, is its acceleration positive or negative? (Assume up = positive.) Does the acceleration change direction at the top?",
      placeholder: "Rising: acceleration is... Falling: acceleration is... At the top: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // PRACTICE PROBLEMS
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Practice Problems",
      subtitle: "~7 minutes"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A train accelerates from rest to 30 m/s in 60 seconds. What is its average acceleration? If it then brakes from 30 m/s to 0 m/s in 20 seconds, what is its acceleration while braking?",
      placeholder: "Accelerating: a = ... Braking: a = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object moves at a constant velocity of +15 m/s. What is its acceleration?",
      options: [
        "+15 m/s²",
        "+7.5 m/s²",
        "0 m/s²",
        "Cannot be determined"
      ],
      correctIndex: 2,
      explanation: "If velocity is constant (not changing), then Δv = 0, so acceleration = 0/Δt = 0 m/s². Acceleration is the rate of CHANGE of velocity. No change = no acceleration. Moving at a constant speed in a straight line requires zero acceleration.",
      difficulty: "understand"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A rocket starts at rest and has an acceleration of +9 m/s². What is its velocity after 1 second? After 3 seconds? After 10 seconds?",
      placeholder: "After 1 s: v = ... After 3 s: v = ... After 10 s: v = ...",
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
      content: "Today's key takeaways:\n\n- **Acceleration** = Δv / Δt = rate of velocity change. Units: m/s²\n- m/s² means \"velocity changes by this many m/s, every second\"\n- **Same sign** (velocity & acceleration) → speeding up\n- **Opposite signs** → slowing down\n- **Zero acceleration** → constant velocity (not necessarily at rest!)\n- Negative acceleration ≠ slowing down. It means accelerating in the negative direction.\n\n**Next up:** Graphing motion — position-time and velocity-time graphs. You'll see how position, velocity, and acceleration all connect visually."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Can an object have a velocity of zero and a nonzero acceleration at the same time? If yes, give a real-world example. If no, explain why not.",
      placeholder: "Yes/No, because...",
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
        { term: "Acceleration", definition: "The rate of change of velocity over time. A vector quantity. a = Δv / Δt. Units: m/s²." },
        { term: "Average Acceleration", definition: "The change in velocity divided by the change in time over an interval. a_avg = (v_f − v_i) / (t_f − t_i)." },
        { term: "Constant Acceleration", definition: "Acceleration that does not change over time. The velocity increases (or decreases) by the same amount each second." },
        { term: "Deceleration", definition: "Informal term for 'slowing down' — when acceleration is opposite in direction to velocity. Not a separate type of acceleration." },
        { term: "m/s² (meters per second squared)", definition: "The SI unit of acceleration. Means velocity changes by this many m/s each second." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-acceleration")
      .set(lesson);
    console.log('✅ Lesson "Acceleration" seeded successfully!');
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
