// seed-motion1d-free-fall.js
// Creates "Free Fall: The Motion of Falling Systems" lesson (Unit 2: Motion in 1D, Lesson 7)
// Run: node scripts/seed-motion1d-free-fall.js
// Modeling/inquiry — kinematics of free fall, Galileo story, calculations

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Free Fall: The Motion of Falling Systems",
  questionOfTheDay: "A marble and a bowling ball are dropped from the same height at the same moment. Which one hits the ground first? How do you know?",
  course: "Physics",
  unit: "Motion in 1D",
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
      content: "**Question of the Day:** A marble and a bowling ball are dropped from the same height at the same moment. Which one hits the ground first? How do you know — or do you just think you know?"
    },
    {
      id: "q-predict",
      type: "question",
      questionType: "short_answer",
      prompt: "Make your prediction before we see any evidence: A marble (0.01 kg) and a bowling ball (5 kg) are dropped from the same height. Which hits first? What is your reasoning?",
      placeholder: "I predict... because...",
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
        "Define free fall and state the value of g = 9.8 m/s² (≈ 10 m/s²)",
        "Explain why all objects in free fall have the same acceleration regardless of mass",
        "Use d = ½gt² to find distance fallen given time",
        "Use v = gt to find speed of a falling object at a given time",
        "Interpret the free fall equations using a v-t graph"
      ]
    },

    // ═══════════════════════════════════════════
    // GALILEO'S EXPERIMENT
    // ═══════════════════════════════════════════
    {
      id: "section-galileo",
      type: "section_header",
      icon: "🏛️",
      title: "Galileo vs. Aristotle: The Experiment",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-galileo",
      type: "callout",
      style: "scenario",
      icon: "⚗️",
      content: "**The Leaning Tower of Pisa (circa 1589):**\n\nFor 2,000 years, Aristotle's claim ruled unchallenged: heavier objects fall faster. It seemed obvious — a rock falls faster than a leaf.\n\nGalileo challenged this by dropping two objects of very different masses from the top of the Leaning Tower of Pisa. Both hit at essentially the same time.\n\nThe leaf comparison? That's air resistance — not gravity. In a vacuum, a feather and a hammer fall identically. (NASA proved this on the Moon in 1971.)"
    },
    {
      id: "b-why-same",
      type: "text",
      content: "### Why Do All Objects Fall the Same?\n\nGalileo's intuition (and Newton's proof):\n\n- More massive objects have MORE gravitational force pulling them down\n- BUT more massive objects also have MORE inertia (resistance to acceleration)\n- These two effects cancel EXACTLY\n\nMathematically: F_g = mg → a = F_g/m = mg/m = **g**\n\nThe mass cancels completely. Every object in free fall accelerates at g = 9.8 m/s² downward, regardless of mass.\n\n**The leaf? Air resistance is the reason leaves fall slowly — not less gravity.**"
    },
    {
      id: "q-why-same-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 10 kg rock and a 1 kg rock are dropped in a vacuum. The 10 kg rock has 10× more gravitational force. Why don't they fall at different rates?",
      options: [
        "The 10 kg rock's extra weight slows it down",
        "Gravity doesn't depend on mass in a vacuum",
        "The 10 kg rock also has 10× more mass (inertia), exactly offsetting the extra force",
        "They do fall at different rates — the 10 kg rock wins"
      ],
      correctIndex: 2,
      explanation: "F_g = mg. a = F_g/m = mg/m = g. The mass cancels. More gravitational force, but also more inertia to overcome — they cancel exactly. This is why a = g for ALL objects in free fall, regardless of mass.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // FREE FALL EQUATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-equations",
      type: "section_header",
      icon: "🧮",
      title: "The Kinematics of Free Fall",
      subtitle: "~15 minutes"
    },
    {
      id: "b-equations",
      type: "text",
      content: "In free fall (starting from rest, downward = positive):\n\n**Speed at any time:**\n**v = g × t**\n(where g = 9.8 m/s², or use 10 m/s² for estimation)\n\n**Distance fallen:**\n**d = ½ × g × t²**\n\n**Connection to v-t graph:**\n- The v-t graph is a straight line through the origin with slope = g\n- The area under the line = d = ½gt² (area of a triangle = ½ × base × height)\n\n### Data Table: Falling from Rest\n\n| Time (s) | Speed (m/s) | Distance fallen (m) |\n|---|---|---|\n| 0 | 0 | 0 |\n| 1 | 9.8 | 4.9 |\n| 2 | 19.6 | 19.6 |\n| 3 | 29.4 | 44.1 |\n| 4 | 39.2 | 78.4 |\n\nNotice: distance increases as t² — quadratic growth. Velocity increases linearly."
    },
    {
      id: "b-def-freefall",
      type: "definition",
      term: "Free Fall",
      definition: "Motion where gravity is the only force acting (no air resistance). All objects in free fall near Earth's surface accelerate at g = 9.8 m/s² downward, regardless of mass."
    },
    {
      id: "callout-crossref",
      type: "callout",
      style: "insight",
      icon: "🔗",
      content: "**Cross-Reference:** The FORCE side of free fall (why g = 9.8 m/s², weight vs. mass, terminal velocity, FBDs for falling objects) is covered in `forces-gravity-free-fall` (Unit 4, Lesson 7). This lesson covers the kinematics — the math of HOW the motion looks."
    },

    // ═══════════════════════════════════════════
    // PHET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "💻",
      title: "Simulation: Projectile Motion",
      subtitle: "~8 minutes"
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
      content: "**Try this:** Use 'Lab' mode. Set angle = 90° (straight up/down). Shoot a cannonball and a piano. Compare their fall times. Now add air resistance for each — does air resistance affect them equally? What does this show about free fall?"
    },
    {
      id: "q-phet-comparison",
      type: "question",
      questionType: "short_answer",
      prompt: "After using the simulation: (a) With air resistance = 0, do heavier objects fall faster or the same? (b) With air resistance turned on, which falls faster — the cannonball or the piano? What does this tell you about what air resistance depends on?",
      placeholder: "(a) No air resistance: ... (b) With air resistance: ... This tells me...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // CALCULATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-calculations",
      type: "section_header",
      icon: "📝",
      title: "Free Fall Calculations",
      subtitle: "~10 minutes"
    },
    {
      id: "callout-lab-ref",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Lab Reference:** This connects to *Lab Guide: The Motion of Falling Systems* (Oct 28) and *How Do We Fall? Parts 1 & 2* (Jan 8-9). You dropped objects and measured time — now here's the math behind those results."
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object falls from rest. After 3 seconds, how fast is it moving? (Use g = 10 m/s²)",
      options: [
        "3 m/s",
        "10 m/s",
        "30 m/s",
        "45 m/s"
      ],
      correctIndex: 2,
      explanation: "v = g × t = 10 × 3 = 30 m/s. After 3 seconds of free fall, the object is moving at 30 m/s downward.",
      difficulty: "apply"
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object is dropped and falls for 2 seconds. How far did it fall? (Use g = 10 m/s²)",
      options: [
        "5 m",
        "10 m",
        "20 m",
        "40 m"
      ],
      correctIndex: 2,
      explanation: "d = ½gt² = ½ × 10 × (2)² = ½ × 10 × 4 = 20 m. Distance grows as t squared — it falls 4× farther in the same time if t doubles.",
      difficulty: "apply"
    },
    {
      id: "q-calc-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A ball is dropped from a 20 m ledge. (Use g = 10 m/s²)\n\n(a) How long does it take to hit the ground? (Solve d = ½gt² for t)\n(b) How fast is it moving when it hits?\n(c) Describe the motion using a v-t graph (what shape? what does the slope equal?)",
      placeholder: "(a) t = ... (b) v = ... (c) The v-t graph shows...",
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
      content: "Today's key takeaways:\n\n- **Free fall** = only gravity acting, no air resistance\n- ALL objects in free fall accelerate at **g = 9.8 m/s²** (use 10 for estimation)\n- Why same acceleration? Mass cancels in F=ma when only gravity acts\n- **v = gt** — velocity increases linearly with time\n- **d = ½gt²** — distance increases as the square of time\n- The v-t graph is a straight line through origin with slope = g\n- Air resistance is why feathers fall slowly — not less gravity\n\n**Next up:** Unit 2 Assessment — time to test all your kinematics knowledge."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: An object drops from 20 m. (a) How long to fall? (b) What speed does it hit the ground? Show your work using d = ½gt² and v = gt with g = 10 m/s².",
      placeholder: "(a) t = ... work: ... (b) v = ... work: ...",
      difficulty: "apply"
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
        { term: "Free Fall", definition: "Motion under gravity only, with no air resistance. All objects in free fall near Earth accelerate at g = 9.8 m/s² downward." },
        { term: "g (gravitational acceleration)", definition: "The acceleration due to gravity near Earth's surface: g = 9.8 m/s² ≈ 10 m/s². All objects in free fall share this acceleration." },
        { term: "d = ½gt²", definition: "Distance fallen from rest in free fall. Distance grows as the square of time." },
        { term: "v = gt", definition: "Speed of a freely falling object starting from rest. Speed increases linearly with time." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion1d-free-fall")
      .set(lesson);
    console.log('✅ Lesson "Free Fall: The Motion of Falling Systems" seeded successfully!');
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
