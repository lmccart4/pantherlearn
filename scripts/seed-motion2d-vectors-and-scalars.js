// seed-motion2d-vectors-and-scalars.js
// Creates "Vectors & Scalars" lesson (Unit 3: Motion in 2D, Lesson 1)
// Run: node scripts/seed-motion2d-vectors-and-scalars.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Vectors & Scalars",
  questionOfTheDay: "If I tell you 'the store is 5 miles away,' do you have enough information to find it? What else do you need? What does that tell us about the limitations of numbers alone?",
  course: "Physics",
  unit: "Motion in 2D",
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
      icon: "🧭",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If I tell you 'the store is 5 miles away,' do you have enough information to find it? What else do you need? What does that tell us about the limitations of numbers alone?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Give directions from this classroom to the main office. Notice how your directions include both amounts AND directions — 'go 20 steps north, turn right, go 10 steps east.' Why do we need both pieces of information?",
      placeholder: "Directions need both amounts and directions because...",
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
        "Distinguish between scalar and vector quantities",
        "Represent vectors using arrows (magnitude = length, direction = arrow direction)",
        "Describe vectors using magnitude and angle",
        "Identify common physics quantities as scalar or vector"
      ]
    },

    // ═══════════════════════════════════════════
    // SCALARS
    // ═══════════════════════════════════════════
    {
      id: "section-scalars",
      type: "section_header",
      icon: "📚",
      title: "Scalar Quantities",
      subtitle: "~5 minutes"
    },
    {
      id: "b-def-scalar",
      type: "definition",
      term: "Scalar",
      definition: "A physical quantity that is fully described by its magnitude (size/amount) alone. Scalars have no direction. Examples: mass, temperature, speed, distance, time, energy."
    },
    {
      id: "b-scalars-text",
      type: "text",
      content: "Scalars are simple — they're just numbers with units.\n\n- \"The temperature is 72°F\" — complete information\n- \"The mass is 5 kg\" — complete information\n- \"The trip took 3 hours\" — complete information\n- \"The car went 60 mph\" — speed is a scalar (no direction)\n\nYou can add, subtract, multiply, and divide scalars using regular math. 3 kg + 5 kg = 8 kg. No surprises."
    },

    // ═══════════════════════════════════════════
    // VECTORS
    // ═══════════════════════════════════════════
    {
      id: "section-vectors",
      type: "section_header",
      icon: "➡️",
      title: "Vector Quantities",
      subtitle: "~12 minutes"
    },
    {
      id: "b-def-vector",
      type: "definition",
      term: "Vector",
      definition: "A physical quantity that has both magnitude (size) and direction. Vectors require both pieces of information to be fully described. Examples: displacement, velocity, acceleration, force."
    },
    {
      id: "b-vectors-text",
      type: "text",
      content: "Vectors need direction to be meaningful:\n\n- \"Walk 100 meters\" → where? That's just a distance (scalar)\n- \"Walk 100 meters north\" → now you know where to go! That's displacement (vector)\n- \"The car is going 60 mph\" → speed (scalar)\n- \"The car is going 60 mph east\" → velocity (vector)\n\nThe moment you add a direction, you've upgraded from a scalar to a vector."
    },
    {
      id: "b-arrow-representation",
      type: "text",
      content: "### Representing Vectors with Arrows\n\nWe draw vectors as arrows:\n\n- **Length** of the arrow = magnitude (bigger magnitude = longer arrow)\n- **Direction** of the arrow = direction of the vector\n- The **tail** is where the vector starts\n- The **tip** (arrowhead) is where it points\n\n```\n  Tail ──────────────> Tip\n       (magnitude)\n```\n\nTwo vectors are equal if they have the same length AND direction — it doesn't matter where on the page you draw them."
    },
    {
      id: "q-vector-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is a vector quantity?",
      options: [
        "Mass (5 kg)",
        "Temperature (98.6°F)",
        "Velocity (25 m/s north)",
        "Speed (100 km/h)"
      ],
      correctIndex: 2,
      explanation: "Velocity includes both magnitude (25 m/s) and direction (north), making it a vector. Mass, temperature, and speed are all scalars — they're fully described by a number and unit alone, with no direction.",
      difficulty: "remember"
    },
    {
      id: "b-describing-vectors",
      type: "text",
      content: "### How to Describe a Vector\n\nThere are two main ways:\n\n**1. Magnitude + Compass Direction:**\n- 50 m/s, 30° north of east\n- 100 N, straight down\n- 25 m, due west\n\n**2. Magnitude + Angle from Reference:**\n- 50 m/s at 30° above the horizontal\n- 100 N at 270° (measured counterclockwise from east)\n\nIn this course, we'll mostly use compass directions and angles from the horizontal. Both work — just be consistent."
    },
    {
      id: "q-vector-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Classify each quantity as scalar or vector: (a) 55 mph, (b) 55 mph northwest, (c) 10 kg, (d) 9.8 m/s² downward, (e) 100 meters, (f) 100 meters east",
      placeholder: "(a) ... (b) ... (c) ... (d) ... (e) ... (f) ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // WHY VECTORS MATTER
    // ═══════════════════════════════════════════
    {
      id: "section-why",
      type: "section_header",
      icon: "🎯",
      title: "Why Vectors Matter",
      subtitle: "~8 minutes"
    },
    {
      id: "b-why-vectors",
      type: "text",
      content: "Here's why the scalar/vector distinction matters so much — **vectors don't add like regular numbers.**\n\nWith scalars: 3 + 4 = 7. Always.\n\nWith vectors: 3 + 4 could equal anything from 1 to 7, depending on direction!\n\n**Example:** You walk 3 meters, then 4 meters.\n- If both are in the same direction: displacement = 7 m\n- If they're in opposite directions: displacement = 1 m\n- If they're perpendicular (at right angles): displacement = 5 m (Pythagorean theorem!)\n\nDirection changes everything. That's why we can't treat vectors like ordinary numbers."
    },
    {
      id: "callout-pythagorean",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Sneak preview:** When two vectors are at right angles, you find the total using the Pythagorean theorem: 3² + 4² = 9 + 16 = 25, and √25 = 5. We'll practice this a lot in the next lesson on vector addition."
    },
    {
      id: "q-why-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You walk 5 meters north, then 5 meters south. What is your total displacement?",
      options: [
        "10 m north",
        "10 m",
        "0 m",
        "5 m south"
      ],
      correctIndex: 2,
      explanation: "You ended up right where you started, so displacement = 0 m. The distance traveled was 10 m, but displacement (a vector) accounts for direction. The 5 m north and 5 m south cancel each other out. This is why you can't just add vector magnitudes like scalars.",
      difficulty: "understand"
    },
    {
      id: "q-why-2",
      type: "question",
      questionType: "short_answer",
      prompt: "You walk 6 meters east, then 8 meters north. (a) What is the total distance you walked? (b) Use the Pythagorean theorem to find the magnitude of your displacement. (c) Why are these different?",
      placeholder: "(a) distance = ... (b) displacement = √(6² + 8²) = ... (c) they're different because...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // REFERENCE TABLE
    // ═══════════════════════════════════════════
    {
      id: "section-reference",
      type: "section_header",
      icon: "📋",
      title: "Quick Reference: Scalar vs. Vector",
      subtitle: ""
    },
    {
      id: "b-reference-table",
      type: "text",
      content: "### Physics Quantities — Scalar or Vector?\n\n| Quantity | Type | Has Direction? |\n|---|---|---|\n| Distance | Scalar | No |\n| Displacement | Vector | Yes |\n| Speed | Scalar | No |\n| Velocity | Vector | Yes |\n| Acceleration | Vector | Yes |\n| Force | Vector | Yes |\n| Mass | Scalar | No |\n| Time | Scalar | No |\n| Energy | Scalar | No |\n| Temperature | Scalar | No |\n| Momentum | Vector | Yes |\n| Work | Scalar | No |\n\n**Pattern:** Quantities that have a direction component are vectors. Quantities that are just amounts are scalars. Notice the pairs: distance/displacement, speed/velocity."
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
      content: "Today's key takeaways:\n\n- **Scalars** have magnitude only (distance, speed, mass, time)\n- **Vectors** have magnitude AND direction (displacement, velocity, acceleration, force)\n- Vectors are drawn as arrows: length = magnitude, arrow direction = vector direction\n- Vectors don't add like regular numbers — direction matters!\n- Walk 3 m + 4 m could give displacement anywhere from 1 m to 7 m, depending on directions\n\n**Next up:** Vector addition — how to properly combine vectors using the head-to-tail method and components."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A pilot says 'we're flying at 500 mph.' A passenger asks 'which direction?' Why does the passenger's question matter? What changes when you add direction to this quantity?",
      placeholder: "The direction matters because...",
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
        { term: "Scalar", definition: "A quantity fully described by magnitude alone. No direction. Examples: mass, time, speed, distance, energy." },
        { term: "Vector", definition: "A quantity that requires both magnitude and direction to be fully described. Examples: displacement, velocity, acceleration, force." },
        { term: "Magnitude", definition: "The size or amount of a quantity. For vectors, it's the length of the arrow. Always positive." },
        { term: "Direction", definition: "The orientation of a vector — described using compass directions (north, east), angles, or positive/negative signs." },
        { term: "Resultant", definition: "The single vector that has the same effect as two or more vectors combined. The 'net' result of adding vectors." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-vectors-and-scalars")
      .set(lesson);
    console.log('✅ Lesson "Vectors & Scalars" seeded successfully!');
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
