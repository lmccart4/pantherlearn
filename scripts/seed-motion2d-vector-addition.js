// seed-motion2d-vector-addition.js
// Creates "Vector Addition" lesson (Unit 3: Motion in 2D, Lesson 2)
// Run: node scripts/seed-motion2d-vector-addition.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Vector Addition",
  questionOfTheDay: "A boat aims straight across a river at 4 m/s, but the current pushes it downstream at 3 m/s. The boat ends up going diagonally — but at what speed and angle? How do you combine two velocities that aren't in the same direction?",
  course: "Physics",
  unit: "Motion in 2D",
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
      icon: "🚣",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A boat aims straight across a river at 4 m/s, but the current pushes it downstream at 3 m/s. The boat ends up going diagonally — but at what speed and angle? How do you combine two velocities that aren't in the same direction?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "From last lesson: you walk 6 m east, then 8 m north. Your distance traveled is 14 m, but your displacement is only 10 m. Today we'll learn WHY this works and how to calculate it for any combination of vectors.",
      placeholder: "I remember that vectors add differently from regular numbers because...",
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
        "Add vectors using the head-to-tail (tip-to-tail) method",
        "Calculate the resultant of two perpendicular vectors using the Pythagorean theorem",
        "Find the direction of the resultant using trigonometry (tan⁻¹)",
        "Solve vector addition problems with real-world context"
      ]
    },

    // ═══════════════════════════════════════════
    // SAME-DIRECTION VECTORS
    // ═══════════════════════════════════════════
    {
      id: "section-same-dir",
      type: "section_header",
      icon: "📚",
      title: "Adding Vectors in the Same (or Opposite) Direction",
      subtitle: "~5 minutes"
    },
    {
      id: "b-same-direction",
      type: "text",
      content: "The simplest case: vectors along the same line.\n\n**Same direction:** Just add the magnitudes.\n- 5 m east + 3 m east = **8 m east**\n- 10 m/s up + 4 m/s up = **14 m/s up**\n\n**Opposite directions:** Subtract the magnitudes. The resultant points in the direction of the larger vector.\n- 5 m east + 3 m west = **2 m east**\n- 10 m/s up + 15 m/s down = **5 m/s down**\n\nThis is what we've been doing in 1D. But what happens when vectors are at an angle?"
    },

    // ═══════════════════════════════════════════
    // HEAD-TO-TAIL METHOD
    // ═══════════════════════════════════════════
    {
      id: "section-head-to-tail",
      type: "section_header",
      icon: "🔗",
      title: "The Head-to-Tail Method",
      subtitle: "~10 minutes"
    },
    {
      id: "b-head-to-tail",
      type: "text",
      content: "To add vectors that aren't in the same direction, we use the **head-to-tail method:**\n\n**Step 1:** Draw the first vector as an arrow.\n**Step 2:** Place the tail of the second vector at the head (tip) of the first.\n**Step 3:** Draw the **resultant** — an arrow from the tail of the first vector to the head of the last vector.\n\nThe resultant is the \"net effect\" — it represents the single vector that would have the same result as both vectors combined.\n\n```\n  Vector A           Vector B         Resultant\n  ──────>          placed at tip      from start to end\n                    of A:              ╱\n  ──────>──────>     becomes    ──────╱──────>\n  tail A  head A/                    R\n          tail B   head B\n```"
    },
    {
      id: "callout-order",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Order doesn't matter!** A + B gives the same resultant as B + A. No matter which vector you draw first, you'll get the same resultant. This is called the **commutative property** of vector addition."
    },
    {
      id: "q-head-to-tail",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When adding two vectors using the head-to-tail method, where do you draw the resultant?",
      options: [
        "From the head of the first vector to the tail of the second",
        "From the tail of the first vector to the head of the second (last) vector",
        "From the midpoint of both vectors",
        "Along the longer vector"
      ],
      correctIndex: 1,
      explanation: "The resultant goes from the tail (start) of the first vector to the head (end) of the last vector. It represents the shortcut — the direct path from where you started to where you ended up.",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // PERPENDICULAR VECTORS
    // ═══════════════════════════════════════════
    {
      id: "section-perpendicular",
      type: "section_header",
      icon: "📐",
      title: "Perpendicular Vectors & the Pythagorean Theorem",
      subtitle: "~12 minutes"
    },
    {
      id: "b-perpendicular",
      type: "text",
      content: "When two vectors are at **right angles** (perpendicular), finding the resultant is straightforward — it's the Pythagorean theorem!\n\nIf vector A points east and vector B points north:\n\n```\n           B ↑\n             |  ╱ R (resultant)\n             | ╱\n             |╱ θ\n   ──────────>\n       A\n```\n\n**Magnitude:** R = √(A² + B²)\n\n**Direction:** θ = tan⁻¹(B / A) — the angle measured from A toward B"
    },
    {
      id: "b-worked-example-1",
      type: "text",
      content: "### Worked Example 1\n\nYou walk 6 m east, then 8 m north. Find the magnitude and direction of your displacement.\n\n**Step 1: Sketch it.** East = horizontal, North = vertical. These are perpendicular.\n\n**Step 2: Magnitude (Pythagorean theorem).**\nR = √(6² + 8²) = √(36 + 64) = √100 = **10 m**\n\n**Step 3: Direction.**\nθ = tan⁻¹(8/6) = tan⁻¹(1.333) = **53.1°**\n\nSo the displacement is **10 m at 53.1° north of east**.\n\nYou walked 14 m total (distance), but your displacement is only 10 m — the diagonal shortcut."
    },
    {
      id: "q-perp-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A drone flies 12 m east, then 5 m north. (a) Sketch the vectors head-to-tail. (b) Calculate the magnitude of the resultant. (c) Calculate the direction (angle from east).",
      placeholder: "(a) sketch... (b) R = √(12² + 5²) = ... (c) θ = tan⁻¹(5/12) = ...",
      difficulty: "apply"
    },
    {
      id: "b-worked-example-2",
      type: "text",
      content: "### Worked Example 2 — Boat in a River\n\nA boat crosses a river. The boat's motor pushes it at 4 m/s north (across the river), while the current pushes it 3 m/s east (downstream).\n\n**Step 1:** The two velocities are perpendicular (north and east).\n\n**Step 2: Resultant speed.**\nR = √(4² + 3²) = √(16 + 9) = √25 = **5 m/s**\n\n**Step 3: Direction.**\nθ = tan⁻¹(3/4) = tan⁻¹(0.75) = **36.9° east of north**\n\nThe boat actually moves at 5 m/s, angled downstream at 36.9° from its intended path."
    },
    {
      id: "q-perp-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two forces act on an object: 30 N east and 40 N north. What is the magnitude of the resultant force?",
      options: [
        "70 N",
        "50 N",
        "10 N",
        "35 N"
      ],
      correctIndex: 1,
      explanation: "The forces are perpendicular, so use the Pythagorean theorem: R = √(30² + 40²) = √(900 + 1600) = √2500 = 50 N. Notice it's NOT 70 N (that's what you'd get by just adding). Vectors at right angles always give a resultant less than the simple sum.",
      difficulty: "apply"
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
      prompt: "An airplane flies 200 km east, then 150 km north. (a) What is the total distance traveled? (b) What is the magnitude of the displacement? (c) What is the direction of the displacement?",
      placeholder: "(a) distance = ... (b) R = √(200² + 150²) = ... (c) θ = tan⁻¹(150/200) = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A swimmer swims at 2 m/s east while a current pushes her 1.5 m/s south. What is her actual speed and direction? (Find the magnitude and angle of the resultant velocity.)",
      placeholder: "R = √(2² + 1.5²) = ... θ = tan⁻¹(1.5/2) = ... south of east",
      difficulty: "apply"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two perpendicular vectors have magnitudes of 7 and 24. What is the magnitude of the resultant?",
      options: [
        "31",
        "25",
        "17",
        "√625"
      ],
      correctIndex: 1,
      explanation: "R = √(7² + 24²) = √(49 + 576) = √625 = 25. This is actually a Pythagorean triple (7-24-25), like the more common 3-4-5 and 5-12-13. If you recognize these, you can solve problems faster!",
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
      content: "Today's key takeaways:\n\n- **Head-to-tail method:** Place vectors tip-to-tail, draw the resultant from start to finish\n- **Same direction:** Add magnitudes. **Opposite:** Subtract magnitudes\n- **Perpendicular vectors:** R = √(A² + B²), direction: θ = tan⁻¹(opposite/adjacent)\n- Order doesn't matter: A + B = B + A\n- The resultant is always ≤ the sum of magnitudes and ≥ the difference\n\n**Next up:** Projectile motion — what happens when you throw something at an angle and gravity only pulls downward."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Why can't you just add the magnitudes of two perpendicular vectors to find the resultant? Use an example to explain.",
      placeholder: "You can't just add magnitudes because...",
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
        { term: "Resultant", definition: "The single vector that represents the combined effect of two or more vectors. Found by drawing the arrow from the start of the first vector to the end of the last." },
        { term: "Head-to-Tail Method", definition: "A graphical method for adding vectors: place each vector's tail at the previous vector's head, then draw the resultant from the first tail to the last head." },
        { term: "Perpendicular", definition: "At right angles (90°) to each other. When vectors are perpendicular, the Pythagorean theorem gives the resultant magnitude." },
        { term: "Pythagorean Theorem", definition: "For a right triangle: c² = a² + b², where c is the hypotenuse. Used to find the magnitude of the resultant of perpendicular vectors." },
        { term: "Tangent Inverse (tan⁻¹)", definition: "The inverse tangent function. Used to find the angle of the resultant: θ = tan⁻¹(opposite side / adjacent side)." },
        { term: "Component", definition: "The projection of a vector onto a coordinate axis. Any vector can be broken into horizontal (x) and vertical (y) components." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-vector-addition")
      .set(lesson);
    console.log('✅ Lesson "Vector Addition" seeded successfully!');
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
