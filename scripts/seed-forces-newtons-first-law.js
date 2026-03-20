// seed-forces-newtons-first-law.js
// Creates "Newton's First Law: Inertia" lesson (Unit 4: Forces, Lesson 8)
// Run: node scripts/seed-forces-newtons-first-law.js
// Modeling/inquiry style — hook through everyday inertia experiences

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Newton's First Law: Inertia",
  questionOfTheDay: "Why do you lurch forward when a bus suddenly stops? No force is pushing you forward — so what's actually happening?",
  course: "Physics",
  unit: "Forces & Newton's Laws",
  order: 8,
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
      content: "**Question of the Day:** Why do you lurch forward when a bus suddenly stops? No force is pushing you forward — so what's actually happening?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of two situations where you felt 'thrown' forward or backward in a vehicle. Describe what was happening to the vehicle each time, and what you felt your body doing.",
      placeholder: "Situation 1: Vehicle was... I felt my body... Situation 2: ...",
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
        "State Newton's First Law (Law of Inertia)",
        "Define inertia and explain its relationship to mass",
        "Explain why 'no net force' means constant velocity (not necessarily zero velocity)",
        "Apply the First Law to explain everyday phenomena (seatbelts, tablecloth trick, car crashes)",
        "Distinguish between Aristotle's wrong view and Newton's correct view"
      ]
    },

    // ═══════════════════════════════════════════
    // THE ARISTOTLE VS NEWTON DEBATE
    // ═══════════════════════════════════════════
    {
      id: "section-history",
      type: "section_header",
      icon: "🏛️",
      title: "Aristotle vs. Newton: A 2000-Year Argument",
      subtitle: "~8 minutes"
    },
    {
      id: "b-aristotle",
      type: "text",
      content: "For almost 2,000 years, Aristotle's view of motion ruled science:\n\n**Aristotle's claim:** Objects need a continuous force to keep moving. If you stop pushing, the object stops moving.\n\n**Evidence Aristotle used:** Push a box across the floor. Let go — it slows and stops. Seems right.\n\n**The problem:** He was ignoring friction. The box stops because of friction, not because \"motion needs a force.\"\n\nNewton (1600s) flipped the script completely with a simple thought experiment: What if there were NO friction? A hockey puck on a perfectly frictionless surface — what would happen if you gave it a shove?"
    },
    {
      id: "q-hockey-puck",
      type: "question",
      questionType: "short_answer",
      prompt: "Aristotle vs. Newton prediction: A hockey puck slides on perfectly frictionless ice and no one is touching it. Aristotle says: ___. Newton says: ___. Which do you think is right? Why?",
      placeholder: "Aristotle would say... Newton would say... I think... because...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // NEWTON'S FIRST LAW
    // ═══════════════════════════════════════════
    {
      id: "section-first-law",
      type: "section_header",
      icon: "⚖️",
      title: "Newton's First Law: The Law of Inertia",
      subtitle: "~12 minutes"
    },
    {
      id: "b-first-law",
      type: "text",
      content: "**Newton's First Law (Law of Inertia):**\n\nAn object at rest stays at rest, and an object in motion stays in motion at constant velocity, **unless acted on by a net external force.**\n\n### Two Cases:\n1. **At rest (v = 0):** Stays at rest until something pushes or pulls it\n2. **In motion (v ≠ 0):** Keeps moving at the same speed and direction forever — unless a net force acts\n\n### What This Really Says\n\nObjects \"resist\" changes to their state of motion. This resistance is called **inertia**.\n\n- No net force → no change in velocity (stays at rest OR keeps moving at same speed/direction)\n- Net force → acceleration (change in velocity)\n\nThe First Law is actually a special case of the Second Law: if ΣF = 0, then a = 0, which means v = constant."
    },
    {
      id: "b-def-inertia",
      type: "definition",
      term: "Inertia",
      definition: "The tendency of an object to resist changes in its state of motion. An object at rest tends to stay at rest; an object in motion tends to stay in motion. Mass is a measure of inertia — more mass means more resistance to acceleration."
    },
    {
      id: "callout-bus-explanation",
      type: "callout",
      style: "scenario",
      icon: "🚌",
      content: "**Explaining the Bus:**\n\nWhen the bus suddenly stops, the floor decelerates under your feet. But your body wants to keep moving forward (inertia — it was moving forward with the bus). No force is pushing you forward. You \"lurch\" forward because the bus stops but you don't — until the seatbelt or seat applies a backward force on you.\n\n**Seatbelts exist because of Newton's First Law.** They apply the stopping force to your body. Without them, your body continues forward at the car's original speed when the car stops."
    },
    {
      id: "q-first-law-mc1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A satellite orbits Earth in a circle. It stays in orbit without any rocket thrust. According to Newton's laws, what keeps it moving forward at constant speed?",
      options: [
        "A continuous force pushes it forward",
        "Inertia — no force is needed to maintain forward motion, only to change it",
        "The atmosphere prevents it from slowing down",
        "Earth's gravity accelerates it forward"
      ],
      correctIndex: 1,
      explanation: "The satellite keeps moving forward because of inertia — no net forward force is needed to maintain constant velocity. Gravity acts toward Earth (sideways to the orbit), which curves the path into a circle — but doesn't accelerate it forward. This is Newton's First Law: object in motion stays in motion unless acted upon.",
      difficulty: "analyze"
    },
    {
      id: "q-first-law-mc2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball rolls at constant speed across a frictionless floor. A student says 'there must be a constant force keeping it moving.' Is the student right?",
      options: [
        "Yes — without a constant force, the ball would slow down",
        "Yes — motion requires a net force",
        "No — constant velocity means net force is zero, not that a force is needed",
        "No — the ball's internal energy keeps it moving"
      ],
      correctIndex: 2,
      explanation: "This is the Aristotle mistake. Constant velocity (no change in motion) means net force = zero, by Newton's First Law. The student is confusing 'force is needed to start motion' with 'force is needed to maintain motion.' No force is needed to maintain constant velocity.",
      difficulty: "analyze"
    },
    {
      id: "q-inertia-mass",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 100 kg person and a 10 kg person are both moving at 10 m/s. Which person has more inertia?",
      options: [
        "The 10 kg person — lighter means easier to stop",
        "The 100 kg person — more mass means more resistance to change",
        "They have equal inertia since they're moving at the same speed",
        "Inertia doesn't depend on mass"
      ],
      correctIndex: 1,
      explanation: "Inertia is measured by mass. The 100 kg person has 10× more inertia — it would take 10× more force to stop them in the same time. Both have the same speed, but the more massive person is much harder to decelerate.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // PHET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "💻",
      title: "Simulation: Forces and Inertia",
      subtitle: "~8 minutes"
    },
    {
      id: "embed-phet",
      type: "iframe_embed",
      src: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
      title: "PhET: Forces and Motion Basics",
      height: 500
    },
    {
      id: "callout-phet-instructions",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Try the 'Motion' tab:** Set friction to zero. Give the cart a push (applied force), then remove the force. What happens? Does the cart stop? Now set friction back to normal and repeat. What's different? This is the Aristotle vs. Newton experiment."
    },
    {
      id: "q-phet-inertia",
      type: "question",
      questionType: "short_answer",
      prompt: "Using the simulation with friction = 0: (a) What happens when you apply a force? (b) What happens when you REMOVE the force? (c) What would Aristotle say about what you observed? What does Newton's First Law say?",
      placeholder: "(a) Applied force: ... (b) Force removed: ... (c) Aristotle: ... Newton: ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD EXAMPLES
    // ═══════════════════════════════════════════
    {
      id: "section-examples",
      type: "section_header",
      icon: "🌎",
      title: "First Law in the Real World",
      subtitle: "~5 minutes"
    },
    {
      id: "b-examples",
      type: "text",
      content: "### Newton's First Law Everywhere\n\n**Seatbelts:** When a car stops suddenly, the seatbelt applies the stopping force to your body. Without it, your body keeps moving forward (inertia) while the car stops.\n\n**Tablecloth trick:** Pull the tablecloth fast → dishes have inertia and resist horizontal motion → they barely move while cloth slides out.\n\n**Car crashes:** During impact, the car decelerates rapidly. Unrestrained passengers keep moving forward at the original speed.\n\n**Satellites:** No thrust needed to maintain orbit — inertia keeps the satellite moving forward while gravity curves the path.\n\n**Kicking a heavy ball:** Your foot decelerates — the ball resists being set in motion (inertia) → your foot hurts. More massive ball = more inertia = more force on your foot."
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
      content: "Today's key takeaways:\n\n- **Newton's First Law:** Object at rest stays at rest; in motion stays in motion — unless net external force acts\n- **Inertia** = resistance to changes in motion; measured by mass\n- No net force → no acceleration → constant velocity (could be 0 or moving)\n- The bus lurch is NOT a force pushing you forward — it's your inertia maintaining your original state\n- Aristotle was wrong: force is NOT needed to maintain motion, only to CHANGE it\n\n**Next up:** Forces Practice Set — prepare for the unit assessment with full-unit review problems."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A ball rolls at constant speed across a level frictionless surface. A student says there must be a force keeping it moving. Are they right? Use Newton's First Law to explain your answer.",
      placeholder: "The student is... because Newton's First Law says...",
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
        { term: "Newton's First Law", definition: "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force. Also called the Law of Inertia." },
        { term: "Inertia", definition: "The tendency of an object to resist changes in its state of motion. Proportional to mass — more mass means more inertia." },
        { term: "Equilibrium", definition: "State where net force = 0. The object has zero acceleration — it may be at rest OR moving at constant velocity." },
        { term: "Constant Velocity", definition: "Motion with no change in speed or direction. Requires zero net force (Newton's First Law)." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("forces-newtons-first-law")
      .set(lesson);
    console.log('✅ Lesson "Newton\'s First Law: Inertia" seeded successfully!');
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
