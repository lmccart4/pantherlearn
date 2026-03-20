// seed-forces-practice-set.js
// Creates "Forces Practice Set" lesson (Unit 4: Forces, Lesson 9)
// Run: node scripts/seed-forces-practice-set.js
// Dense practice — same difficulty as unit test. No new content.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Forces Practice Set",
  questionOfTheDay: "The unit test is tomorrow. Which concept — FBDs, Newton's Second Law, friction, or action-reaction — feels least solid to you right now?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 9,
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
      subtitle: "~3 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** The unit test is tomorrow. Which concept — FBDs, Newton's Second Law, friction, or action-reaction — feels least solid to you right now?"
    },
    {
      id: "callout-practice-instructions",
      type: "callout",
      style: "insight",
      icon: "📋",
      content: "**Practice Set Instructions:** This is the same difficulty as the unit test. Try every problem without notes first. Then check your work. This is your opportunity to find gaps before the test.\n\n**Lab Reference:** Corresponds to *Forces Practice Set* from class (Jan 12, 2026)."
    },

    // ═══════════════════════════════════════════
    // SECTION 1: FBDs AND FORCE IDENTIFICATION
    // ═══════════════════════════════════════════
    {
      id: "section-fbd",
      type: "section_header",
      icon: "✏️",
      title: "Section 1: Free Body Diagrams",
      subtitle: ""
    },
    {
      id: "q-fbd-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 10 kg box is pushed to the right across a rough floor at constant speed with an applied force of 30 N. (a) List every force acting on the box (name, direction, magnitude if possible). (b) Draw/describe the FBD. (c) What is the net force? (d) What is the friction force?",
      placeholder: "(a) Forces: ... (b) FBD: ... (c) Net force: ... (d) Friction: ...",
      difficulty: "apply"
    },
    {
      id: "q-fbd-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 5 kg box hangs from two ropes attached to the ceiling. Each rope pulls at an angle. The box is stationary. What must be true about the forces?",
      options: [
        "Each rope pulls up with 5g N so the total upward force is 2 × 5g",
        "The vertical components of both rope tensions add up to equal the weight of the box",
        "The tension in each rope equals the full weight",
        "There is no gravity force because the box is hanging"
      ],
      correctIndex: 1,
      explanation: "For equilibrium (stationary), net force = 0. So the total upward force must equal the total downward force (weight = mg). Each rope only needs to provide part of that upward force — the vertical components must add to mg.",
      difficulty: "analyze"
    },
    {
      id: "q-fbd-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball is thrown upward and is at the highest point (momentarily stopped). Which forces act on it? (Ignore air resistance.)",
      options: [
        "No forces — it's momentarily at rest",
        "Only gravity (downward)",
        "Gravity downward and a 'launch force' upward",
        "The forces are balanced because it is momentarily stationary"
      ],
      correctIndex: 1,
      explanation: "Even at the top (v = 0 momentarily), the only force is gravity downward. There is no 'launch force' — once the ball leaves your hand, you're no longer touching it. Being momentarily at rest doesn't mean balanced forces. The ball is still accelerating at g = 9.8 m/s² downward at the top.",
      difficulty: "analyze"
    },
    {
      id: "q-fbd-4",
      type: "question",
      questionType: "short_answer",
      prompt: "A car accelerates forward. Draw/describe the FBD. Include: engine force (from friction between tires and road, forward), air resistance (backward), gravity, normal force. Is the car in equilibrium? What is the direction of net force?",
      placeholder: "Forces: ... Equilibrium? ... Net force direction: ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: NEWTON'S SECOND LAW
    // ═══════════════════════════════════════════
    {
      id: "section-fma",
      type: "section_header",
      icon: "🧮",
      title: "Section 2: Newton's Second Law (F = ma)",
      subtitle: ""
    },
    {
      id: "q-fma-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A net force of 48 N acts on a 6 kg box. (a) What is the acceleration? (b) If starting from rest, how fast is the box moving after 5 seconds?",
      placeholder: "(a) a = ... (b) v = ...",
      difficulty: "apply"
    },
    {
      id: "q-fma-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A rocket of mass 2000 kg accelerates at 15 m/s². (a) What net force acts on it? (b) If the engine provides 40,000 N of thrust, what is the air resistance force? (c) Is the rocket speeding up or slowing down?",
      placeholder: "(a) ΣF = ... (b) Air resistance = ... (c) ...",
      difficulty: "analyze"
    },
    {
      id: "q-fma-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two identical carts, A and B, are pushed with the same force. Cart A has mass m. Cart B has mass 3m. How does Cart B's acceleration compare to Cart A's?",
      options: [
        "Cart B accelerates 3× faster",
        "Cart B accelerates the same — same force",
        "Cart B accelerates 1/3 as fast",
        "Cart B doesn't accelerate at all"
      ],
      correctIndex: 2,
      explanation: "a = F/m. Same force, 3× the mass → acceleration is 1/3. Newton's Second Law: acceleration is inversely proportional to mass.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: FRICTION
    // ═══════════════════════════════════════════
    {
      id: "section-friction",
      type: "section_header",
      icon: "🧊",
      title: "Section 3: Friction",
      subtitle: ""
    },
    {
      id: "q-friction-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 15 kg box rests on a surface with μ_s = 0.4 and μ_k = 0.25 (use g = 10 m/s²). (a) What is the maximum static friction force? (b) If you push with 50 N, does the box move? (c) If you push with 70 N, does it move? If so, what is the acceleration?",
      placeholder: "(a) f_s,max = ... (b) 50 N: ... (c) 70 N: ... a = ...",
      difficulty: "analyze"
    },
    {
      id: "q-friction-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 20 kg block moves at constant velocity when pushed with 40 N. What is the coefficient of kinetic friction? (g = 10 m/s²)",
      options: [
        "0.10",
        "0.20",
        "0.40",
        "2.0"
      ],
      correctIndex: 1,
      explanation: "Constant velocity means net force = 0, so friction = applied force = 40 N. F_N = mg = 200 N. μ_k = f_k / F_N = 40 / 200 = 0.20.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 4: NEWTON'S THIRD LAW
    // ═══════════════════════════════════════════
    {
      id: "section-third-law",
      type: "section_header",
      icon: "⚖️",
      title: "Section 4: Newton's Third Law",
      subtitle: ""
    },
    {
      id: "q-third-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Two ice skaters push off each other: Skater A (mass 50 kg) and Skater B (mass 80 kg). They push with 100 N each. (a) What is the acceleration of Skater A? (b) What is the acceleration of Skater B? (c) Who accelerates more? Why?",
      placeholder: "(a) a_A = ... (b) a_B = ... (c) ...",
      difficulty: "analyze"
    },
    {
      id: "q-third-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Earth pulls a 1 kg ball downward with 9.8 N. Which is the Newton's Third Law reaction force?",
      options: [
        "The ground pushing the ball up with 9.8 N",
        "The ball's inertia resisting the pull",
        "The ball pulling Earth upward with 9.8 N",
        "Air resistance pushing the ball up with 9.8 N"
      ],
      correctIndex: 2,
      explanation: "The Third Law pair to 'Earth pulls ball down with 9.8 N' is 'ball pulls Earth up with 9.8 N.' Same type (gravity), opposite direction, different objects. The ball really does pull Earth upward — Earth just barely moves because it's so massive.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SECTION 5: FREE FALL
    // ═══════════════════════════════════════════
    {
      id: "section-freefall",
      type: "section_header",
      icon: "⬇️",
      title: "Section 5: Free Fall and Gravity",
      subtitle: ""
    },
    {
      id: "q-freefall-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 5 kg ball and a 50 kg rock are both dropped from the same height in a vacuum. (a) What is the gravitational force on each? (b) What is the acceleration of each? (c) Which one hits the ground first?",
      placeholder: "(a) Ball F_g = ... Rock F_g = ... (b) Ball a = ... Rock a = ... (c) ...",
      difficulty: "apply"
    },
    {
      id: "q-freefall-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A skydiver reaches terminal velocity at 55 m/s. At that moment: (a) What is the net force on the skydiver? (b) What is the acceleration? (c) If the skydiver weighs 700 N, what is the air resistance force?",
      placeholder: "(a) ΣF = ... (b) a = ... (c) F_air = ...",
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
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Self-assessment: After working through this practice set, which concept still feels the least clear? What specifically are you confused about?",
      placeholder: "The concept I'm least sure about is... specifically because...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Formulas Reference",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Newton's Second Law", definition: "ΣF = ma — net force equals mass times acceleration" },
        { term: "Friction", definition: "f = μF_N — friction equals coefficient of friction times normal force" },
        { term: "Gravitational Force", definition: "F_g = mg — weight equals mass times gravitational acceleration" },
        { term: "Equilibrium Condition", definition: "ΣF = 0 — net force is zero, object at rest or constant velocity" },
        { term: "Newton's Third Law", definition: "Every action force has an equal and opposite reaction force on the OTHER object" }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-practice-set")
      .set(lesson);
    console.log('✅ Lesson "Forces Practice Set" seeded successfully!');
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
