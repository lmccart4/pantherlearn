// seed-forces-assessment.js
// Creates "Unit 4 Assessment: Forces & Newton's Laws" lesson (Unit 4: Forces, Lesson 10)
// Run: node scripts/seed-forces-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Unit 4 Assessment: Forces & Newton's Laws",
  questionOfTheDay: "Looking back at this unit — what was the most surprising thing you learned about forces that changed how you see the world?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 10,
  isAssessment: true,
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
      content: "**Question of the Day:** Looking back at this unit — what was the most surprising thing you learned about forces that changed how you see the world?"
    },

    // ═══════════════════════════════════════════
    // REVIEW SECTION
    // ═══════════════════════════════════════════
    {
      id: "section-review",
      type: "section_header",
      icon: "📚",
      title: "Review Section",
      subtitle: "Open notes — use this to check your understanding"
    },
    {
      id: "callout-review-instructions",
      type: "callout",
      style: "insight",
      icon: "📋",
      content: "**Review Section:** You may use your notes here. This is a chance to identify any gaps before the assessment section. Review each major concept before moving on."
    },
    {
      id: "b-review-summary",
      type: "text",
      content: "### Unit 4 — Key Concepts to Review\n\n**1. Forces and FBDs**\n- Force = push or pull between two objects (agent + object)\n- FBD shows all forces on ONE object as arrows from a dot\n- Common forces: gravity (F_g = mg), normal (F_N), friction (f = μF_N), tension, applied\n\n**2. Net Force and Newton's Second Law**\n- ΣF = ma\n- Net force = vector sum of all forces\n- Constant velocity → ΣF = 0 (equilibrium)\n\n**3. Friction**\n- Static friction: prevents motion, adjusts up to f_s,max = μ_s × F_N\n- Kinetic friction: during sliding, f_k = μ_k × F_N; always less than max static\n- μ_k < μ_s always\n\n**4. Newton's Third Law**\n- Every force has an equal, opposite force on the OTHER object\n- Force pairs: same magnitude, opposite direction, different objects, same type\n- Force pairs don't cancel — they're on different FBDs\n\n**5. Gravity and Free Fall**\n- F_g = mg (weight in Newtons, mass in kg)\n- In free fall, all objects accelerate at g = 9.8 m/s² regardless of mass\n- Terminal velocity: F_air = F_g, net force = 0\n\n**6. Newton's First Law**\n- Objects resist changes to motion (inertia)\n- No net force → constant velocity (not necessarily zero)"
    },
    {
      id: "q-review-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Quick Check: A 12 kg crate slides across the floor (μ_k = 0.25, g = 10 m/s²) with no applied force. (a) What forces act on it? (b) What is the friction force? (c) What is the net force? (d) What is the acceleration?",
      placeholder: "(a) Forces: ... (b) f_k = ... (c) ΣF = ... (d) a = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // ASSESSMENT SECTION
    // ═══════════════════════════════════════════
    {
      id: "section-assessment",
      type: "section_header",
      icon: "📝",
      title: "Assessment Section",
      subtitle: "Try without notes — test your understanding"
    },
    {
      id: "callout-assessment-instructions",
      type: "callout",
      style: "warning",
      icon: "🚨",
      content: "**Assessment Section:** Challenge yourself to complete these without looking at notes. This is the same format as the unit test."
    },
    {
      id: "q-mc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A box is on a rough floor. You push it to the right with 30 N but it doesn't move. What is the static friction force?",
      options: [
        "0 N — friction only acts on moving objects",
        "Greater than 30 N — friction prevents motion",
        "30 N — friction matches the applied force to keep the box still",
        "Cannot be determined without the coefficient of friction"
      ],
      correctIndex: 2,
      explanation: "Since the box is in equilibrium (not moving), ΣF = 0. So static friction must exactly equal the applied force: 30 N to the left. Static friction adjusts to match, up to its maximum — we didn't exceed the maximum here.",
      difficulty: "apply"
    },
    {
      id: "q-mc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An astronaut (mass 80 kg) is in deep space, far from any planet. What is their weight?",
      options: [
        "80 N",
        "784 N",
        "0 N — no gravity in space",
        "Infinite — no gravity to hold them down"
      ],
      correctIndex: 2,
      explanation: "Weight = F_g = mg. In deep space, g ≈ 0 (far from any massive object), so weight ≈ 0 N. The astronaut is essentially weightless. But their mass is still 80 kg — it would still take force to accelerate them.",
      difficulty: "apply"
    },
    {
      id: "q-mc-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A car hits the brakes and skids to a stop. The friction force from the road on the car is:",
      options: [
        "In the direction of motion (forward)",
        "Opposite to the direction of motion (backward)",
        "Zero during skidding",
        "Equal to the car's weight"
      ],
      correctIndex: 1,
      explanation: "Kinetic friction always opposes the direction of sliding. The car slides forward, so friction acts backward — decelerating it. This is why ABS brakes help: they prevent full skids so maximum friction can act.",
      difficulty: "understand"
    },
    {
      id: "q-mc-4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 5 kg ball and a 25 kg ball are dropped simultaneously from the same height in a vacuum. Which statement is true?",
      options: [
        "The 25 kg ball hits first — it has more gravity",
        "The 5 kg ball hits first — it is lighter",
        "Both hit at the same time — all objects have the same acceleration in free fall",
        "The result depends on the height of the drop"
      ],
      correctIndex: 2,
      explanation: "In free fall (no air resistance), all objects accelerate at g = 9.8 m/s² regardless of mass. The 25 kg ball has 5× more gravitational force, but also 5× more mass — the effects cancel exactly, giving the same acceleration.",
      difficulty: "understand"
    },
    {
      id: "q-mc-5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "According to Newton's Third Law, when you push a wall with 50 N, the wall pushes you back with:",
      options: [
        "Less than 50 N — walls can't push",
        "50 N",
        "More than 50 N — the wall is rigid",
        "0 N if the wall doesn't move"
      ],
      correctIndex: 1,
      explanation: "Newton's Third Law: the reaction force is exactly equal to the action force — 50 N. It doesn't matter that the wall doesn't move. Inanimate objects exert forces too. The wall's rigidity is why it pushes back hard enough to stop you.",
      difficulty: "understand"
    },
    {
      id: "q-multipart-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A 10 kg crate sits on a rough floor (μ_s = 0.5, μ_k = 0.35, g = 10 m/s²). A person pushes it with F_app = 60 N to the right.\n\n(a) Draw and describe the FBD.\n(b) Is 60 N enough to start the crate moving? Show your work.\n(c) If the crate is moving, what is the net force on it?\n(d) What is the acceleration?",
      placeholder: "(a) FBD: ... (b) f_s,max = ... 60N vs. max static: ... (c) ΣF = ... (d) a = ...",
      difficulty: "analyze"
    },
    {
      id: "q-multipart-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A 50 kg student stands on a scale in an elevator.\n\n(a) If the elevator is at rest, what does the scale read?\n(b) If the elevator accelerates upward at 2 m/s², what does the scale read? (Hint: use ΣF = ma with upward as positive)\n(c) If the elevator accelerates downward at 2 m/s², what does the scale read?\n(d) If the elevator is in free fall (cable snaps), what does the scale read? What does this tell you about weightlessness?",
      placeholder: "(a) Scale = ... (b) ΣF = ma: ... scale = ... (c) scale = ... (d) scale = ... weightlessness means...",
      difficulty: "analyze"
    },
    {
      id: "q-synthesis",
      type: "question",
      questionType: "short_answer",
      prompt: "Design an experiment to find the coefficient of static friction between a wooden block and a tile floor. Include: (a) What equipment you need, (b) What you would measure, (c) How you would calculate μ_s from your measurements, (d) What you would keep constant and what you would vary.",
      placeholder: "(a) Equipment: ... (b) Measurements: ... (c) Calculation: μ_s = ... (d) Constants: ... Variables: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // WRAP UP / REFLECTION
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Reflection",
      subtitle: "~3 minutes"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Unit Reflection: Which concept from Unit 4 was hardest for you at first? What finally made it click?",
      placeholder: "The hardest concept was... What made it click was...",
      difficulty: "recall"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-assessment")
      .set(lesson);
    console.log('✅ Lesson "Unit 4 Assessment: Forces & Newton\'s Laws" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    console.log(`   📊 isAssessment: ${lesson.isAssessment}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
