// seed-motion2d-assessment.js
// Creates "Unit 3 Assessment: Motion in 2D" lesson (Unit 3: Motion in 2D, Lesson 6)
// Run: node scripts/seed-motion2d-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Unit 3 Assessment: Motion in 2D",
  questionOfTheDay: "How well do you understand 2D motion? Let's find out.",
  course: "Physics",
  unit: "Motion in 2D",
  order: 6,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // INTRO
    // ═══════════════════════════════════════════
    {
      id: "section-intro",
      type: "section_header",
      icon: "📝",
      title: "Unit 3 Assessment: Motion in 2D",
      subtitle: "~45 minutes"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "What This Assessment Covers",
      items: [
        "Vectors vs. scalars — identification, components, and addition",
        "Projectile motion — horizontal launches and angled projectiles",
        "Relative motion — reference frames and relative velocity",
        "Multi-step 2D motion problem solving"
      ]
    },
    {
      id: "callout-instructions",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Tips:** Use g = 9.8 m/s² for all problems. Show your work on calculation questions — partial credit is possible. Always include units in your answers."
    },
    {
      id: "q-confidence",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Before you begin: how confident are you about 2D motion concepts?",
      options: [
        "Very confident — I've got this",
        "Somewhat confident — I know most of it",
        "A little shaky — I might struggle on some parts",
        "Not confident — I need to review after this"
      ],
      correctIndex: 0,
      allCorrect: true,
      explanation: "No wrong answer here. This is just a self-check. After the assessment, compare how you actually did with your prediction.",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // SECTION A: VECTORS & SCALARS (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-a",
      type: "section_header",
      icon: "🧭",
      title: "Section A: Vectors & Scalars",
      subtitle: "3 questions · ~25%"
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following lists contains ONLY vector quantities?",
      options: [
        "Speed, velocity, acceleration",
        "Displacement, velocity, force",
        "Distance, displacement, speed",
        "Mass, force, momentum"
      ],
      correctIndex: 1,
      explanation: "Displacement, velocity, and force all require both magnitude and direction — they are vectors. Speed and distance are scalar (magnitude only). Mass is also scalar.",
      difficulty: "remember"
    },
    {
      id: "q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A velocity vector has a magnitude of 20 m/s and points 30° above the positive x-axis. What is the approximate horizontal (x) component of this velocity?",
      options: [
        "20 sin(30°) = 10 m/s",
        "20 cos(30°) ≈ 17.3 m/s",
        "20 tan(30°) ≈ 11.5 m/s",
        "20 / cos(30°) ≈ 23.1 m/s"
      ],
      correctIndex: 1,
      explanation: "The horizontal component uses cosine: vₓ = v cos(θ) = 20 cos(30°) ≈ 17.3 m/s. The vertical component would use sine: vᵧ = v sin(θ) = 20 sin(30°) = 10 m/s. Remember: cosine is for the component adjacent to the angle.",
      difficulty: "apply"
    },
    {
      id: "q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two displacement vectors are added: 6 m east and 8 m north. What is the magnitude of the resultant displacement?",
      options: [
        "14 m",
        "2 m",
        "10 m",
        "48 m"
      ],
      correctIndex: 2,
      explanation: "These vectors are perpendicular, so use the Pythagorean theorem: R = √(6² + 8²) = √(36 + 64) = √100 = 10 m. You can NOT simply add 6 + 8 = 14 because vectors at right angles don't add like scalars.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION B: PROJECTILE MOTION (~35%)
    // ═══════════════════════════════════════════
    {
      id: "section-b",
      type: "section_header",
      icon: "🎯",
      title: "Section B: Projectile Motion",
      subtitle: "4 questions · ~35%"
    },
    {
      id: "q4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball is launched horizontally from the edge of a table. Ignoring air resistance, what happens to the ball's horizontal velocity as it falls?",
      options: [
        "It increases because gravity accelerates it",
        "It decreases because of the downward pull of gravity",
        "It remains constant because gravity only affects vertical motion",
        "It depends on the height of the table"
      ],
      correctIndex: 2,
      explanation: "This is the key principle of projectile motion: horizontal and vertical motions are independent. Gravity acts only in the vertical direction (downward), so it does not change the horizontal velocity. The ball maintains its original horizontal speed throughout the flight.",
      difficulty: "understand"
    },
    {
      id: "q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A bullet is fired horizontally from a rifle at the same instant an identical bullet is dropped from the same height. Ignoring air resistance, which bullet hits the ground first?",
      options: [
        "The fired bullet — it has more energy",
        "The dropped bullet — it falls straight down",
        "They hit at the same time — vertical acceleration is the same for both",
        "It depends on the speed of the fired bullet"
      ],
      correctIndex: 2,
      explanation: "Both bullets experience the same vertical acceleration (g = 9.8 m/s²) and start with zero vertical velocity. The horizontal velocity of the fired bullet has no effect on its vertical motion. Both fall the same height in the same time.",
      difficulty: "understand"
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "A ball is launched horizontally at 12 m/s from a cliff that is 45 m high. (a) How long does it take to hit the ground? Use h = ½gt². (b) How far from the base of the cliff does it land? Show your work.",
      placeholder: "(a) t = √(2h/g) = √(2 × 45 / 9.8) = ...\n(b) range = vₓ × t = ...",
      difficulty: "apply"
    },
    {
      id: "q7",
      type: "question",
      questionType: "short_answer",
      prompt: "A soccer ball is kicked at 18 m/s at an angle of 40° above the horizontal. (a) Find the horizontal and vertical components of the initial velocity. (b) Explain why the ball's vertical velocity is zero at the peak of its trajectory but its horizontal velocity is not.",
      placeholder: "(a) vₓ = 18 cos(40°) = ..., vᵧ = 18 sin(40°) = ...\n(b) At the peak...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SECTION C: RELATIVE MOTION (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-c",
      type: "section_header",
      icon: "🚤",
      title: "Section C: Relative Motion",
      subtitle: "3 questions · ~25%"
    },
    {
      id: "q8",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You are on a train moving east at 30 m/s. Another train passes you going west at 20 m/s. What is the velocity of the other train relative to you?",
      options: [
        "10 m/s west",
        "50 m/s west",
        "20 m/s west",
        "50 m/s east"
      ],
      correctIndex: 1,
      explanation: "Relative velocity = velocity of other train minus your velocity. Using east as positive: v_relative = (-20) - (+30) = -50 m/s. The negative sign means west. The other train appears to move at 50 m/s west from your perspective. Objects moving in opposite directions have their speeds ADD when finding relative velocity.",
      difficulty: "apply"
    },
    {
      id: "q9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A boat can travel at 5 m/s in still water. It needs to cross a river that flows east at 3 m/s. The boat points straight north. What is the magnitude of the boat's actual velocity relative to the ground?",
      options: [
        "2 m/s",
        "8 m/s",
        "√(34) ≈ 5.8 m/s",
        "√(16) = 4 m/s"
      ],
      correctIndex: 2,
      explanation: "The boat's velocity relative to the ground is the vector sum of its velocity in still water (5 m/s north) and the river current (3 m/s east). These are perpendicular, so: v = √(5² + 3²) = √(25 + 9) = √34 ≈ 5.8 m/s. The boat moves northeast, faster than it would in still water but not in a straight line across.",
      difficulty: "apply"
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "A swimmer can swim at 2.0 m/s in still water. She wants to cross a 100 m wide river that flows at 1.5 m/s. If she points straight across the river: (a) How long does it take to cross? (b) How far downstream does the current carry her? Show your work.",
      placeholder: "(a) time = width / swim speed = ...\n(b) downstream distance = current speed × time = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION D: APPLICATION (~15%)
    // ═══════════════════════════════════════════
    {
      id: "section-d",
      type: "section_header",
      icon: "🧩",
      title: "Section D: Application",
      subtitle: "2 questions · ~15%"
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "A rescue helicopter hovers at a height of 80 m above a river. It needs to drop a supply package to a raft moving downstream at 4 m/s. (a) How long does the package take to fall 80 m? Use h = ½gt². (b) How far ahead of the raft (horizontally) should the helicopter release the package? (c) What assumption are you making about the package's initial horizontal velocity?",
      placeholder: "(a) t = √(2 × 80 / 9.8) = ...\n(b) horizontal distance = ...\n(c) I'm assuming...",
      difficulty: "analyze"
    },
    {
      id: "q12",
      type: "question",
      questionType: "short_answer",
      prompt: "An airplane flies at 250 km/h heading due north, but a crosswind blows at 80 km/h from west to east. (a) Use the Pythagorean theorem to find the airplane's actual speed relative to the ground. (b) Will the pilot arrive directly north of the starting point? Explain. (c) What adjustment could the pilot make to actually travel due north?",
      placeholder: "(a) ground speed = √(250² + 80²) = ...\n(b) The pilot will/will not arrive directly north because...\n(c) To correct for the wind, the pilot should...",
      difficulty: "analyze"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-assessment")
      .set(lesson);
    console.log('✅ Lesson "Unit 3 Assessment: Motion in 2D" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    console.log("   👁️ Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
