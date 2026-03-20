// seed-forces-gravity-free-fall.js
// Creates "Gravity and Free Fall: How Do We Fall?" lesson (Unit 4: Forces, Lesson 7)
// Run: node scripts/seed-forces-gravity-free-fall.js
// Modeling/inquiry style — force-side of free fall, weight vs. mass, terminal velocity

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Gravity and Free Fall: How Do We Fall?",
  questionOfTheDay: "A skydiver jumps from a plane. At three different moments — just after jumping, at terminal velocity, after parachute opens — what forces act on them and what is their acceleration?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 7,
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
      content: "**Question of the Day:** A skydiver jumps from a plane. At three moments — just after jumping, at terminal velocity, and after the parachute opens — what forces act on them and what is their acceleration at each stage?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Draw or describe the FBD of a skydiver at each of the three stages:\n1. Just jumped (low speed)\n2. Terminal velocity\n3. After parachute opens\n\nFor each: name the forces, their directions, and whether the skydiver is accelerating.",
      placeholder: "Stage 1: Forces: ... Accelerating? Stage 2: Forces: ... Accelerating? Stage 3: Forces: ... Accelerating?",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Calculate the gravitational force on an object using F_g = mg",
        "Distinguish between weight (a force, in Newtons) and mass (matter, in kilograms)",
        "Define free fall and explain why all objects fall with the same acceleration",
        "Draw FBDs for a falling object at different stages including terminal velocity",
        "Explain what terminal velocity means in terms of forces"
      ]
    },

    // ═══════════════════════════════════════════
    // GRAVITY AS A FORCE
    // ═══════════════════════════════════════════
    {
      id: "section-gravity",
      type: "section_header",
      icon: "🌍",
      title: "Gravity: The Universal Pull",
      subtitle: "~10 minutes"
    },
    {
      id: "b-gravity-intro",
      type: "text",
      content: "Gravity is the force that pulls objects with mass toward each other. Near Earth's surface, every object experiences a downward gravitational force.\n\nThe equation is simple:\n\n**F_g = mg**\n\nWhere:\n- **F_g** = gravitational force (weight), in Newtons\n- **m** = mass, in kilograms\n- **g** = 9.8 m/s² (acceleration due to gravity near Earth's surface)\n\nNote: g ≈ 10 m/s² is commonly used for estimation — it makes the math cleaner without sacrificing much accuracy."
    },
    {
      id: "b-def-weight",
      type: "definition",
      term: "Weight",
      definition: "The gravitational force acting on an object. Weight = mg. It is a force, measured in Newtons (N). Weight depends on where you are (gravity varies by location)."
    },
    {
      id: "b-def-mass",
      type: "definition",
      term: "Mass",
      definition: "The amount of matter in an object. Measured in kilograms (kg). Mass does not change based on location — it is the same on Earth, Moon, or in space."
    },
    {
      id: "b-weight-vs-mass",
      type: "text",
      content: "### Weight vs. Mass — The Critical Distinction\n\n| | Mass | Weight |\n|---|---|---|\n| **What it is** | Amount of matter | Gravitational force |\n| **Unit** | kg | N (Newtons) |\n| **Changes with location?** | No | Yes |\n| **On the Moon (g = 1.6 m/s²)** | Same | ~⅙ of Earth value |\n| **In deep space** | Same | ~0 (near weightless) |\n\n**Example:** A 60 kg person:\n- On Earth: Weight = 60 × 9.8 = 588 N\n- On Moon: Weight = 60 × 1.6 = 96 N\n- Mass: 60 kg everywhere"
    },
    {
      id: "q-weight-calc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 60 kg person is on the Moon where g = 1.6 m/s². What does the scale under them read?",
      options: [
        "60 N",
        "96 N",
        "588 N",
        "600 N"
      ],
      correctIndex: 1,
      explanation: "Weight = mg = 60 kg × 1.6 m/s² = 96 N. The person's mass is still 60 kg — that doesn't change. But weight (gravitational force) depends on g, which is much lower on the Moon.",
      difficulty: "apply"
    },
    {
      id: "q-weight-or-mass",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student says: \"I weigh 70 kilograms.\" What's wrong with this statement?",
      options: [
        "Nothing — kilograms is the correct unit for weight",
        "Weight is measured in Newtons, not kilograms. The student has a mass of 70 kg.",
        "You can't measure body weight in physics",
        "The student should say 70 N, not 70 kg"
      ],
      correctIndex: 1,
      explanation: "Weight is a force and must be measured in Newtons. The student has a MASS of 70 kg. Their WEIGHT (gravitational force) on Earth is approximately 70 × 9.8 = 686 N. In everyday speech we say 'weigh' but in physics weight has a specific technical meaning.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // FREE FALL
    // ═══════════════════════════════════════════
    {
      id: "section-freefall",
      type: "section_header",
      icon: "⬇️",
      title: "Free Fall: When Gravity is the Only Force",
      subtitle: "~10 minutes"
    },
    {
      id: "b-freefall-intro",
      type: "text",
      content: "**Free fall** is the special case where gravity is the only force acting on a falling object (no air resistance). In free fall:\n\nΣF = F_g = mg (downward only)\n\nApplying Newton's Second Law:\nΣF = ma → mg = ma → **g = a**\n\nThe acceleration of a falling object equals g = 9.8 m/s² downward — regardless of mass!\n\n**Why don't heavier objects fall faster?** More mass means more gravitational force, BUT more mass also means more resistance to acceleration. These effects cancel perfectly, and every object in free fall accelerates at g."
    },
    {
      id: "callout-galileo",
      type: "callout",
      style: "scenario",
      icon: "🏛️",
      content: "**Historical Note — Galileo and the Leaning Tower of Pisa:**\n\nAristotle (ancient Greece) claimed heavier objects fall faster. For ~2000 years, no one questioned it.\n\nGalileo (1589) challenged this by dropping objects of different masses from the Leaning Tower of Pisa. Both hit at the same time. He also showed mathematically why this must be true: more mass means more gravitational force AND more inertia to overcome — they cancel exactly.\n\nToday, astronauts on the Moon have dropped a feather and a hammer simultaneously — they land together. (No air resistance on the Moon.)"
    },
    {
      id: "b-def-freefall",
      type: "definition",
      term: "Free Fall",
      definition: "Motion where gravity is the only force acting on an object (no air resistance). All objects in free fall near Earth's surface accelerate downward at g = 9.8 m/s², regardless of mass."
    },
    {
      id: "callout-crossref",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Cross-Reference:** The kinematics of free fall (how position and velocity change over time) are covered in detail in `motion1d-free-fall`. This lesson focuses on the FORCE side — why all objects accelerate the same way. Both perspectives are essential for solving free fall problems."
    },

    // ═══════════════════════════════════════════
    // TERMINAL VELOCITY
    // ═══════════════════════════════════════════
    {
      id: "section-terminal",
      type: "section_header",
      icon: "🪂",
      title: "Terminal Velocity: When Air Resistance Matters",
      subtitle: "~10 minutes"
    },
    {
      id: "b-terminal-intro",
      type: "text",
      content: "In real life, air resistance acts upward on falling objects. As speed increases, air resistance increases. At some point, air resistance equals gravity — and the object stops accelerating.\n\n**Terminal velocity** = the maximum falling speed when air resistance = gravity (net force = 0).\n\n### Three Stages of a Skydiver\n\n**Stage 1 — Just jumped (slow speed):**\n- F_g = mg (large, downward)\n- F_air = small (upward) — slow speed means little air resistance\n- Net force = large, downward\n- Result: large downward acceleration\n\n**Stage 2 — Terminal velocity:**\n- F_g = mg (downward, unchanged)\n- F_air = mg (upward, now equal to gravity)\n- Net force = 0\n- Result: zero acceleration, constant speed (~55 m/s for a typical skydiver)\n\n**Stage 3 — Parachute opens:**\n- F_g = mg (downward, unchanged)\n- F_air = large (upward, parachute dramatically increases air resistance)\n- Net force = large, UPWARD\n- Result: large upward acceleration (skydiver slows rapidly)"
    },
    {
      id: "embed-phet",
      type: "iframe_embed",
      src: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
      title: "PhET: Projectile Motion",
      height: 500
    },
    {
      id: "callout-phet-instructions",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Try this:** Use the 'Lab' mode. Set a person as the projectile, shoot straight up with angle = 90°. Compare the motion with Air Resistance = None vs Air Resistance = Max. Watch the velocity graphs. Can you find terminal velocity on the graph?"
    },
    {
      id: "q-fbd-stages",
      type: "question",
      questionType: "short_answer",
      prompt: "For each of the three skydiver stages, describe the FBD: (a) What forces act, and in which direction? (b) Is the net force upward, downward, or zero? (c) Is the skydiver speeding up, slowing down, or at constant speed?",
      placeholder: "Stage 1 (just jumped): Forces: ... Net force: ... Motion: ... Stage 2 (terminal): ... Stage 3 (parachute): ...",
      difficulty: "analyze"
    },
    {
      id: "q-terminal-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "At terminal velocity, a skydiver's acceleration is:",
      options: [
        "9.8 m/s² downward",
        "9.8 m/s² upward",
        "0 m/s² — constant speed",
        "Decreasing toward zero"
      ],
      correctIndex: 2,
      explanation: "At terminal velocity, gravity = air resistance, so net force = 0. By Newton's Second Law (ΣF = ma), if ΣF = 0, then a = 0. The skydiver moves at constant speed — fast, but no longer accelerating.",
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
      content: "Today's key takeaways:\n\n- **F_g = mg** — weight is a force (Newtons), mass is matter (kilograms)\n- **Mass** stays the same everywhere; **weight** depends on g (location)\n- In free fall (no air), all objects accelerate at g = 9.8 m/s² — mass doesn't matter\n- This is because more mass = more gravity AND more inertia (they cancel)\n- **Terminal velocity**: when air resistance = gravity → net force = 0 → constant speed\n- The parachute adds massive air resistance → net force upward → skydiver decelerates\n\n**Next up:** Newton's First Law — what does it mean to have NO net force?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Is weight a force? Is mass a force? What's the difference, and why does it matter in physics?",
      placeholder: "Weight is... because... Mass is... because... The difference matters because...",
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
        { term: "Gravitational Force (F_g)", definition: "The force of gravity pulling an object toward Earth. F_g = mg. Also called weight." },
        { term: "Weight", definition: "The gravitational force on an object. Measured in Newtons. Changes with location (depends on g)." },
        { term: "Mass", definition: "The amount of matter in an object. Measured in kilograms. Does not change with location." },
        { term: "Free Fall", definition: "Motion where gravity is the only force. All objects in free fall near Earth accelerate at g = 9.8 m/s² regardless of mass." },
        { term: "Terminal Velocity", definition: "The maximum falling speed, reached when air resistance equals gravitational force. Net force = 0, acceleration = 0." },
        { term: "Air Resistance", definition: "A friction force from air that opposes motion. Increases with speed. Relevant for large or light objects at high speeds." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-gravity-free-fall")
      .set(lesson);
    console.log('✅ Lesson "Gravity and Free Fall: How Do We Fall?" seeded successfully!');
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
