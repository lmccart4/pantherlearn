// seed-unit1-what-is-physics.js
// Creates "What Is Physics?" lesson (Unit 1, Lesson 1)
// Run: node scripts/seed-unit1-what-is-physics.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "What Is Physics?",
  course: "Physics",
  unit: "Introduction to Physics",
  order: 1,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🌌",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Everything around you — your phone, the lights, gravity holding you in your chair — follows the rules of physics. But what IS physics, and why should you care?\n\nToday we start the journey. By the end of this year, you'll see the world differently."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Everything around you — your phone, the lights, gravity holding you in your chair — follows the rules of physics. But what IS physics, and why should you care?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Name three things you interact with every day that involve physics. (Hint: the answer is everything — but be specific!)",
      placeholder: "List 3 everyday things that involve physics...",
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
        "Define physics and identify its major branches",
        "Distinguish physics from other sciences (chemistry, biology)",
        "Identify physics in everyday life",
        "Understand the role of models and approximations in physics"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "What Is Physics?",
      subtitle: "~20 minutes"
    },
    {
      id: "b-definition",
      type: "definition",
      term: "Physics",
      definition: "The study of matter, energy, and the fundamental forces of the universe. Physics describes the most basic rules that everything in nature follows."
    },
    {
      id: "b-branches",
      type: "text",
      content: "Physics has several major branches — and this year, we'll touch on most of them:\n\n- **Mechanics** — Motion and forces (the biggest chunk of this course)\n- **Thermodynamics** — Heat and energy transfer\n- **Electromagnetism** — Electricity and magnetism (they're connected!)\n- **Waves & Optics** — Sound, light, and wave behavior\n- **Modern Physics** — Relativity, quantum mechanics, nuclear physics\n\nEach branch builds on the one before it. That's why physics has a reputation for being sequential — if you miss a piece, the next piece is harder. But if you keep up, each new topic clicks into place like a puzzle."
    },
    {
      id: "q-branches",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which branch of physics deals with motion and forces?",
      options: [
        "Thermodynamics",
        "Mechanics",
        "Electromagnetism",
        "Modern Physics"
      ],
      correctIndex: 1,
      explanation: "Mechanics is the study of motion and forces — it's the foundation of classical physics and what we'll spend the most time on this year. Kinematics (describing motion) and dynamics (forces causing motion) are both part of mechanics.",
      difficulty: "remember"
    },
    {
      id: "b-vs-other",
      type: "text",
      content: "**Physics vs Chemistry vs Biology — What's the Difference?**\n\nAll three study nature, but at different scales:\n\n- **Physics** studies the most fundamental rules — forces, energy, fields, particles\n- **Chemistry** studies how atoms combine and react (built on physics rules)\n- **Biology** studies living systems (built on chemistry, which is built on physics)\n\nPhysics is the foundation. The laws of physics apply everywhere — from subatomic particles to galaxies. Chemistry and biology are special cases of physics applied to specific systems."
    },
    {
      id: "q-difference",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, explain why physics is considered the most \"fundamental\" science. How do chemistry and biology relate to it?",
      placeholder: "Explain the relationship between physics, chemistry, and biology...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // MODELS & APPROXIMATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-models",
      type: "section_header",
      icon: "🔬",
      title: "The Power of Models",
      subtitle: "~10 minutes"
    },
    {
      id: "b-models",
      type: "text",
      content: "Here's a secret about physics: **we simplify everything.**\n\nThe real world is incredibly complex — air resistance, friction, vibrations, imperfect surfaces, temperature changes. If we tried to account for every detail, we'd never solve a single problem.\n\nSo physicists use **models** — simplified versions of reality that capture the essential behavior while ignoring the noise:\n\n- **Frictionless surfaces** — not real, but lets us focus on forces and motion\n- **Point masses** — pretend an object's mass is concentrated at a single point\n- **Ideal gases** — molecules with no size, no attraction, perfect bouncing\n- **Massless ropes** — ropes that transmit force without having weight\n\nThese aren't lies — they're strategic simplifications. A map isn't the territory, but it helps you navigate. Physics models aren't reality, but they help us understand and predict."
    },
    {
      id: "callout-models",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**All models are wrong. Some models are useful.** — George Box\n\nThis is a mantra in physics. Our equations are approximations of reality — but they're incredibly powerful approximations that let us design bridges, launch rockets, and build smartphones."
    },
    {
      id: "q-models",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why do physicists use simplified models instead of trying to account for every real-world detail?",
      options: [
        "Because physicists are lazy",
        "Because the real world is too complex to model perfectly, and simplifications let us focus on the essential behavior",
        "Because the simplified version is always 100% accurate",
        "Because computers can't handle complex calculations"
      ],
      correctIndex: 1,
      explanation: "Models are strategic simplifications. They ignore minor details (like air resistance in a short throw) to focus on the key physics. This makes problems solvable and helps us see the core relationships between variables.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // PHYSICS IN EVERYDAY LIFE
    // ═══════════════════════════════════════════
    {
      id: "section-everyday",
      type: "section_header",
      icon: "📱",
      title: "Physics Is Everywhere",
      subtitle: "~5 minutes"
    },
    {
      id: "b-everyday",
      type: "text",
      content: "Physics isn't just formulas on a board. It's running in the background of everything you do:\n\n- **Sports:** A basketball's arc is projectile motion. A runner's acceleration follows Newton's Laws.\n- **Cars:** Friction keeps tires on the road. Airbags use impulse to reduce force. Engines convert chemical → thermal → mechanical energy.\n- **Phones:** Circuits (electromagnetism), touchscreens (capacitance), speakers (magnetic fields), Wi-Fi (electromagnetic waves), GPS (relativity!)\n- **Music:** Sound waves, frequency, resonance, harmonics\n- **Weather:** Thermodynamics, fluid dynamics, radiation\n- **Cooking:** Heat transfer, phase changes, pressure\n\nOnce you learn physics, you can't unsee it. The whole world becomes a physics problem — and that's kind of the point."
    },
    {
      id: "q-everyday",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE thing you use or experience every day. Describe what might be happening in terms of physics — forces, energy, waves, motion, or anything else you can think of. Don't worry about being 100% right — just think like a physicist!",
      placeholder: "Describe the physics behind something you use every day...",
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
      content: "Today's key takeaways:\n\n- **Physics** is the study of matter, energy, and fundamental forces — the most basic rules of nature\n- It has major branches: mechanics, thermodynamics, electromagnetism, waves, modern physics\n- Physics is the foundation that chemistry and biology are built on\n- Physicists use **models** — simplified versions of reality — to understand and predict\n- Physics is literally everywhere in your daily life\n\n**Next up:** How do physicists measure the world? Units, conversions, and the $125 million mistake."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Complete this sentence — \"Physics is important because...\" Give at least two reasons.",
      placeholder: "Physics is important because...",
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
        { term: "Physics", definition: "The study of matter, energy, and the fundamental forces governing the universe." },
        { term: "Mechanics", definition: "The branch of physics that studies motion and forces." },
        { term: "Thermodynamics", definition: "The branch of physics that studies heat, energy transfer, and temperature." },
        { term: "Electromagnetism", definition: "The branch of physics that studies electricity and magnetism and their relationship." },
        { term: "Model", definition: "A simplified representation of reality used to understand and predict physical behavior." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("what-is-physics")
      .set(lesson);
    console.log('✅ Lesson "What Is Physics?" seeded successfully!');
    console.log("   Path: courses/physics/lessons/what-is-physics");
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
