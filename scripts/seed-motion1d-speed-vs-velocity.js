// seed-motion1d-speed-vs-velocity.js
// Creates "Speed vs. Velocity" lesson (Unit 2: Motion in 1D, Lesson 2)
// Run: node scripts/seed-motion1d-speed-vs-velocity.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Speed vs. Velocity",
  questionOfTheDay: "A race car drives around a circular track at a constant 200 km/h. Is the car's velocity constant? Is its speed constant? How can speed stay the same while velocity changes?",
  course: "Physics",
  unit: "Motion in 1D",
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
      icon: "🏎️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A race car drives around a circular track at a constant 200 km/h. Is the car's velocity constant? Is its speed constant? How can speed stay the same while velocity changes?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "In everyday language, people use \"speed\" and \"velocity\" interchangeably. Do you think they mean the same thing in physics? What might be different about them?",
      placeholder: "I think speed and velocity are...",
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
        "Define speed and velocity and explain the difference",
        "Calculate average speed and average velocity",
        "Distinguish between instantaneous and average values",
        "Interpret positive and negative velocity"
      ]
    },

    // ═══════════════════════════════════════════
    // SPEED
    // ═══════════════════════════════════════════
    {
      id: "section-speed",
      type: "section_header",
      icon: "📚",
      title: "Speed",
      subtitle: "~8 minutes"
    },
    {
      id: "b-speed-intro",
      type: "text",
      content: "Speed tells you how fast something is moving — how much distance it covers per unit of time. It's a **scalar** (no direction).\n\nSpeed is always positive or zero. You can't have a negative speed — that would just be speed in the opposite direction, which is still speed."
    },
    {
      id: "b-def-avg-speed",
      type: "definition",
      term: "Average Speed",
      definition: "The total distance traveled divided by the total time elapsed. Average speed = distance / time. Units: m/s, km/h, mph, etc. Always positive."
    },
    {
      id: "b-speed-example",
      type: "text",
      content: "### Worked Example\n\nYou drive 120 km in 2 hours. What's your average speed?\n\nAverage speed = distance / time = 120 km / 2 h = **60 km/h**\n\nThis doesn't mean you were going 60 km/h the whole time — you probably sped up, slowed down, maybe stopped at a light. Average speed smooths out all that variation into a single number."
    },
    {
      id: "q-speed-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student walks 500 m to school in 10 minutes. What is their average speed?",
      options: [
        "5 m/min",
        "50 m/min",
        "500 m/min",
        "0.5 m/min"
      ],
      correctIndex: 1,
      explanation: "Average speed = distance / time = 500 m / 10 min = 50 m/min. If you want this in m/s: 50 m/min ÷ 60 = 0.83 m/s. Either unit is correct as long as you're consistent.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VELOCITY
    // ═══════════════════════════════════════════
    {
      id: "section-velocity",
      type: "section_header",
      icon: "➡️",
      title: "Velocity",
      subtitle: "~10 minutes"
    },
    {
      id: "b-velocity-intro",
      type: "text",
      content: "Velocity is speed with a direction. It tells you not just *how fast* something is moving, but **which way**.\n\nVelocity is a **vector** — it has both magnitude (how fast) and direction (which way). This is the key difference from speed."
    },
    {
      id: "b-def-avg-velocity",
      type: "definition",
      term: "Average Velocity",
      definition: "The displacement divided by the time elapsed. v_avg = Δx / Δt. A vector quantity — can be positive, negative, or zero. Units: m/s."
    },
    {
      id: "callout-formula",
      type: "callout",
      style: "insight",
      icon: "📐",
      content: "**Average Velocity:**\n\n**v_avg = Δx / Δt = (x_final − x_initial) / (t_final − t_initial)**\n\n- Positive v → moving in the positive direction\n- Negative v → moving in the negative direction\n- Zero v → ended where you started (doesn't mean you didn't move!)"
    },
    {
      id: "b-comparison",
      type: "text",
      content: "### Speed vs. Velocity — The Key Differences\n\n| Feature | Speed | Velocity |\n|---|---|---|\n| **Type** | Scalar | Vector |\n| **Uses** | Distance | Displacement |\n| **Direction?** | No | Yes |\n| **Can be negative?** | No | Yes |\n| **Can be zero?** | Yes (at rest) | Yes (back to start) |\n| **Formula** | distance / time | Δx / Δt |"
    },
    {
      id: "b-velocity-example",
      type: "text",
      content: "### Worked Example\n\nA car starts at position x = +10 m and ends at x = +70 m in 12 seconds.\n\n**Average velocity:** v = Δx / Δt = (70 − 10) / 12 = 60/12 = **+5 m/s**\n\nThe positive sign tells us the car moved in the positive direction.\n\n### Another Example\n\nA ball starts at x = +8 m and rolls to x = −4 m in 3 seconds.\n\n**Average velocity:** v = Δx / Δt = (−4 − 8) / 3 = −12/3 = **−4 m/s**\n\nThe negative sign means the ball moved in the negative direction."
    },
    {
      id: "q-velocity-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A jogger runs 400 m around a track and returns to the starting point in 80 seconds. What is the jogger's average velocity?",
      options: [
        "5 m/s",
        "0 m/s",
        "−5 m/s",
        "400 m/s"
      ],
      correctIndex: 1,
      explanation: "The jogger ended where they started, so displacement = 0 m. Average velocity = 0 m / 80 s = 0 m/s. The average speed was 400/80 = 5 m/s, but velocity uses displacement, not distance. This is a classic example of why they're different!",
      difficulty: "understand"
    },
    {
      id: "q-velocity-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A car travels 60 km east in 1 hour, then 40 km west in 0.5 hours. Calculate: (a) the average speed for the entire trip, and (b) the average velocity for the entire trip.",
      placeholder: "Average speed = total distance / total time = ... Average velocity = displacement / total time = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // INSTANTANEOUS vs AVERAGE
    // ═══════════════════════════════════════════
    {
      id: "section-instantaneous",
      type: "section_header",
      icon: "⏱️",
      title: "Instantaneous vs. Average",
      subtitle: "~7 minutes"
    },
    {
      id: "b-instantaneous",
      type: "text",
      content: "There's one more important distinction: **instantaneous** vs. **average**.\n\n- **Average speed/velocity** — calculated over a time interval. Smooths out everything that happened during that time.\n- **Instantaneous speed/velocity** — the speed or velocity at a single moment in time. What the speedometer reads right now.\n\nWhen you drive, your speedometer shows your **instantaneous speed**. But if you calculate total distance / total time for your whole trip, that's your **average speed** — and it's usually different."
    },
    {
      id: "callout-speedometer",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Your car's speedometer reads instantaneous speed.** It tells you how fast you're going right now, not how fast you've been going on average. A GPS navigation app that says \"you'll arrive in 20 minutes\" is estimating based on a mix of instantaneous and average speed."
    },
    {
      id: "q-instantaneous",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A driver travels 100 km in 2 hours but is going 80 km/h when she looks at her speedometer. Which statement is correct?",
      options: [
        "Her average speed is 80 km/h",
        "Her instantaneous speed is 50 km/h and her average speed is 80 km/h",
        "Her instantaneous speed is 80 km/h and her average speed is 50 km/h",
        "There's no way to determine either value"
      ],
      correctIndex: 2,
      explanation: "The speedometer gives instantaneous speed = 80 km/h (right now). Average speed = total distance / total time = 100 km / 2 h = 50 km/h. At this moment, she's going faster than her average for the trip.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // PRACTICE PROBLEMS
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Practice Problems",
      subtitle: "~8 minutes"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A cyclist rides 15 km north in 30 minutes, stops for 10 minutes, then rides 5 km south in 20 minutes. Calculate the average speed and average velocity for the entire trip (in km/h).",
      placeholder: "Total distance = ... Total displacement = ... Total time = ... Average speed = ... Average velocity = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object has an average velocity of −3 m/s over a 10-second interval. What does the negative sign tell you?",
      options: [
        "The object is slowing down",
        "The object moved in the negative direction",
        "The object is moving backwards in time",
        "The object's speed is less than 3 m/s"
      ],
      correctIndex: 1,
      explanation: "The negative sign on velocity indicates direction, not that the object is slowing down. The object displaced in the negative direction (left, south, etc., depending on how you set up your coordinate system). Its speed is still 3 m/s — speed is always positive.",
      difficulty: "understand"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A car starts at x = +20 m and moves to x = −10 m in 6 seconds. Then it moves to x = +5 m in 4 seconds. Find: (a) total distance, (b) total displacement, (c) average speed, (d) average velocity.",
      placeholder: "Show your work for each part...",
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
      content: "Today's key takeaways:\n\n- **Speed** = distance / time — scalar (no direction, always positive)\n- **Velocity** = displacement / time — vector (has direction, can be negative)\n- **Average** = calculated over a time interval\n- **Instantaneous** = at a single moment in time\n- Average speed ≥ |average velocity| — they're only equal for straight-line motion in one direction\n- A negative velocity means motion in the negative direction, NOT slowing down\n\n**Next up:** Acceleration — what happens when velocity changes."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Can an object have a high speed but zero velocity? Explain with an example.",
      placeholder: "Yes/No, because...",
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
        { term: "Speed", definition: "How fast an object is moving — the rate at which distance is covered. A scalar quantity. Always positive." },
        { term: "Velocity", definition: "The rate at which an object's position changes. A vector quantity with magnitude (speed) and direction. v = Δx / Δt." },
        { term: "Average Speed", definition: "Total distance traveled divided by total time elapsed. Smooths out variations over the interval." },
        { term: "Average Velocity", definition: "Total displacement divided by total time elapsed. Can be zero even if the object moved." },
        { term: "Instantaneous Speed", definition: "The speed at a specific moment in time. What a speedometer reads." },
        { term: "Instantaneous Velocity", definition: "The velocity at a specific moment in time — speed plus direction at that instant." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-speed-vs-velocity")
      .set(lesson);
    console.log('✅ Lesson "Speed vs. Velocity" seeded successfully!');
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
