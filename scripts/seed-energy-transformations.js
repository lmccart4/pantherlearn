import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Systems & Energy Transformations",
  course: "Physics",
  unit: "Energy",
  order: 1,
  visible: false,
  dueDate: "2026-03-05",
  blocks: [
    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "☀️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define a system and identify its boundaries",
        "Identify the types of energy present in a system (kinetic, thermal, chemical, light, etc.)",
        "Describe how energy is transferred from one part of a system to another",
        "Use energy diagrams to track transformations within a system"
      ]
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When you rub your hands together and they get warm, where did that thermal energy come from? What *system* is involved?"
    },
    {
      id: "warmup-review",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Yesterday we learned about types of energy. Which of the following is NOT a form of energy?",
      difficulty: "remember",
      options: [
        "Kinetic energy",
        "Thermal energy",
        "Force energy",
        "Chemical energy"
      ],
      correctIndex: 2,
      explanation: "Force is NOT a form of energy — it's a push or pull that can *transfer* energy, but it's not energy itself. Kinetic, thermal, and chemical are all real forms of energy."
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 1: WHAT IS A SYSTEM?
    // ═══════════════════════════════════════════
    {
      id: "section-systems",
      type: "section_header",
      icon: "🔍",
      title: "Activity 1: What Is a System?",
      subtitle: "~10 minutes"
    },
    {
      id: "text-systems-intro",
      type: "text",
      content: "In physics, a **system** is the specific group of objects we choose to study. Everything outside the system is called the **surroundings**.\n\nFor example, if you're studying a ball rolling down a ramp:\n- **System:** the ball + the ramp\n- **Surroundings:** the air, the table, you, everything else\n\nWhy does this matter? Because energy doesn't just appear or disappear — it **transfers** between parts of the system or between the system and its surroundings."
    },
    {
      id: "def-system",
      type: "definition",
      term: "System",
      definition: "A defined group of objects that we are studying. We draw an imaginary boundary around the system to track energy within it."
    },
    {
      id: "def-surroundings",
      type: "definition",
      term: "Surroundings",
      definition: "Everything outside the system boundary. Energy can flow between the system and its surroundings."
    },
    {
      id: "q-system-id",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student is studying a hot cup of coffee cooling down on a table. If the system is the coffee + the cup, which of the following is part of the surroundings?",
      difficulty: "understand",
      options: [
        "The coffee",
        "The cup",
        "The table and air around the cup",
        "The thermal energy in the coffee"
      ],
      correctIndex: 2,
      explanation: "The table and air are outside the system boundary (coffee + cup), so they are part of the surroundings. The coffee and cup are inside the system, and thermal energy is a property of the system."
    },
    {
      id: "sort-energy-types",
      type: "sorting",
      icon: "🔀",
      title: "Sort the Energy!",
      instructions: "For each item below, decide: is it a form of **stored energy** (potential) or **energy of motion/action** (kinetic)? Swipe right for Stored, left for Motion.",
      leftLabel: "Motion (Kinetic)",
      rightLabel: "Stored (Potential)",
      items: [
        { text: "A moving car on the highway", correct: "left" },
        { text: "A stretched rubber band", correct: "right" },
        { text: "Food sitting on your plate (chemical energy)", correct: "right" },
        { text: "Sound waves from a speaker", correct: "left" },
        { text: "A book on a high shelf (gravitational PE)", correct: "right" },
        { text: "A vibrating guitar string", correct: "left" },
        { text: "A charged battery", correct: "right" },
        { text: "Light from a lamp", correct: "left" }
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 2: PhET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "🧪",
      title: "Activity 2: Energy Forms & Changes Simulation",
      subtitle: "~15 minutes"
    },
    {
      id: "text-phet-intro",
      type: "text",
      content: "Now you'll explore energy transformations using a PhET simulation. In this sim, you can heat and cool objects, connect energy sources to devices, and **watch the energy flow** as colored dots moving through the system.\n\nPay close attention to:\n- What **forms** of energy appear (thermal, electrical, light, mechanical, chemical)\n- How energy **transforms** from one form to another\n- How energy **transfers** from one object to another"
    },
    {
      id: "sim-energy",
      type: "simulation",
      icon: "🧪",
      title: "PhET: Energy Forms and Changes",
      url: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
      height: 550,
      observationPrompt: "Describe one energy transformation you observed in the simulation. What form did the energy start as, and what did it change into?"
    },
    {
      id: "phet-checklist",
      type: "checklist",
      title: "Simulation Exploration Checklist",
      items: [
        "Open the 'Intro' tab — place a brick on the burner and heat it up. What happens to the energy dots?",
        "Place the brick in cold water. Watch the thermal energy transfer. Which direction does it flow?",
        "Switch to the 'Systems' tab — connect the faucet to the water wheel to the light bulb",
        "Turn on the faucet and trace the energy: mechanical → electrical → light + thermal",
        "Try the sun → solar panel → light bulb chain. What forms of energy are involved?",
        "Try at least one more energy chain of your choice"
      ]
    },
    {
      id: "q-phet-transfer",
      type: "question",
      questionType: "short_answer",
      prompt: "In the simulation, when you placed a hot brick into cold water, describe what happened to the energy. Where did the thermal energy go? How do you know?",
      difficulty: "analyze"
    },
    {
      id: "q-phet-chain",
      type: "question",
      questionType: "short_answer",
      prompt: "Choose one energy chain you built in the 'Systems' tab. List every energy transformation that occurred from the source to the final output. Use arrows to show the chain (e.g., Chemical → Thermal → Mechanical → Electrical).",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 3: MAPPING ENERGY IN A SYSTEM
    // ═══════════════════════════════════════════
    {
      id: "section-mapping",
      type: "section_header",
      icon: "📊",
      title: "Activity 3: Mapping Energy in a System",
      subtitle: "~10 minutes"
    },
    {
      id: "text-diagrams",
      type: "text",
      content: "Scientists use **energy diagrams** to track how energy moves through a system. These diagrams show:\n1. The **system boundary** (what's inside vs. outside)\n2. The **types of energy** present at each stage\n3. **Arrows** showing energy transfers and transformations\n\nLet's practice creating one!"
    },
    {
      id: "callout-scenario",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Scenario:** A person drops a ball from a height. The ball falls, hits the ground, bounces back up (but not as high), and eventually stops bouncing."
    },
    {
      id: "q-ball-energies",
      type: "question",
      questionType: "multiple_choice",
      prompt: "At the moment the ball is at the TOP of its drop (before being released), what type(s) of energy does it have?",
      difficulty: "understand",
      options: [
        "Only kinetic energy",
        "Only gravitational potential energy",
        "Both kinetic and gravitational potential energy",
        "Only thermal energy"
      ],
      correctIndex: 1,
      explanation: "Before being released, the ball is not moving (no kinetic energy) and is at a height (gravitational potential energy). It has only gravitational PE at this point."
    },
    {
      id: "q-ball-ranking",
      type: "question",
      questionType: "ranking",
      prompt: "Put these moments in order from MOST gravitational potential energy to LEAST:",
      difficulty: "analyze",
      items: [
        "Ball at the top, before release",
        "Ball at the peak of its first bounce",
        "Ball at the peak of its second bounce",
        "Ball sitting still on the ground"
      ]
    },
    {
      id: "bar-ball-energy",
      type: "bar_chart",
      title: "Energy Bar Chart: Bouncing Ball",
      barCount: 4,
      initialLabel: "At the Top (before drop)",
      finalLabel: "Hitting the Ground (1st time)",
      deltaLabel: "Change"
    },
    {
      id: "sketch-energy-flow",
      type: "sketch",
      title: "Draw an Energy Flow Diagram",
      instructions: "Draw a diagram showing the bouncing ball system. Include:\n1. Draw a dotted line around the system (ball + ground)\n2. Label the types of energy at each stage: top → falling → impact → bounce up\n3. Use arrows to show energy transformations (e.g., GPE → KE → Thermal + Sound)\n4. Show where energy leaves the system (to surroundings)",
      canvasHeight: 450
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 4: ENERGY DETECTIVE CHATBOT
    // ═══════════════════════════════════════════
    {
      id: "section-detective",
      type: "section_header",
      icon: "🤖",
      title: "Activity 4: Energy Detective",
      subtitle: "~5 minutes"
    },
    {
      id: "text-detective-intro",
      type: "text",
      content: "Now it's your turn to analyze a real-world system! Describe any everyday situation to the Energy Detective, and it will help you identify the energy types and transformations happening in that system."
    },
    {
      id: "chat-energy",
      type: "chatbot",
      icon: "🔋",
      title: "Energy Detective",
      starterMessage: "Hey! I'm the Energy Detective 🔍⚡ Describe any everyday situation — like cooking food, riding a bike, or charging your phone — and I'll help you figure out what kinds of energy are involved and how the energy transforms from one form to another. What situation do you want to investigate?",
      systemPrompt: "You are the Energy Detective, a friendly and encouraging physics tutor helping high school physics students analyze energy in everyday systems. Your role:\n\n1. When the student describes a situation, help them:\n   - Define the SYSTEM (what objects are included)\n   - Identify ALL forms of energy present (kinetic, gravitational PE, elastic PE, thermal, chemical, electrical, light, sound, nuclear)\n   - Trace how energy TRANSFORMS from one form to another\n   - Identify any energy TRANSFERS between parts of the system or to the surroundings\n\n2. Use simple, clear language appropriate for 9th-10th grade students.\n3. Keep responses to 3-5 sentences. Use bullet points for lists.\n4. Ask follow-up questions to deepen their thinking (e.g., 'What happens to the energy that seems to disappear?' or 'Is any energy leaving the system?').\n5. Always connect back to conservation of energy — energy is never created or destroyed, just transformed or transferred.\n6. If the student goes off-topic, gently redirect to energy systems.\n7. Praise good thinking and correct any misconceptions kindly.\n8. Do NOT just give answers — guide the student to figure it out themselves by asking leading questions.",
      instructions: "Describe an everyday situation (cooking, sports, driving, using electronics, etc.) and the Energy Detective will help you identify all the energy types and transformations in that system. Try to have at least a 3-message conversation!",
      placeholder: "Describe a situation... (e.g., 'A car driving up a hill')"
    },

    // ═══════════════════════════════════════════
    // CHECK YOUR UNDERSTANDING
    // ═══════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      icon: "✅",
      title: "Check Your Understanding",
      subtitle: "~5 minutes"
    },
    {
      id: "q-check-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A toaster converts electrical energy into thermal energy to toast bread. Some energy also becomes light (the glowing coils). This is an example of:",
      difficulty: "understand",
      options: [
        "Energy being created inside the toaster",
        "Energy being destroyed as heat",
        "Energy being transformed from one form to multiple other forms",
        "Energy disappearing from the system"
      ],
      correctIndex: 2,
      explanation: "The toaster transforms electrical energy into thermal energy AND light energy. Energy is never created or destroyed — it's transformed from one form to others. The total energy is conserved."
    },
    {
      id: "q-check-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When a ball rolls along a flat surface and eventually stops, the kinetic energy of the ball was primarily transformed into:",
      difficulty: "apply",
      options: [
        "Gravitational potential energy",
        "Chemical energy",
        "Thermal energy (due to friction)",
        "Electrical energy"
      ],
      correctIndex: 2,
      explanation: "Friction between the ball and the surface converts kinetic energy into thermal energy. Both the ball and the surface get slightly warmer. This is why the ball slows down — its kinetic energy is being transformed into thermal energy."
    },
    {
      id: "q-check-3",
      type: "question",
      questionType: "ranking",
      prompt: "A roller coaster car goes through these stages. Rank them from MOST kinetic energy to LEAST kinetic energy:",
      difficulty: "analyze",
      items: [
        "At the bottom of the biggest hill (fastest speed)",
        "Halfway down the first drop",
        "Climbing a smaller hill after the first drop",
        "At the very top of the first hill (just starting)"
      ]
    },
    {
      id: "q-check-4",
      type: "question",
      questionType: "short_answer",
      prompt: "A student says: 'When I turn off a flashlight, the light energy is destroyed.' Explain why this statement is incorrect using what you learned today about energy transformations and conservation.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🏁",
      title: "Wrap Up",
      subtitle: "~2 minutes"
    },
    {
      id: "text-summary",
      type: "text",
      content: "**Today you learned:**\n- A **system** is the group of objects we choose to study, separated from the surroundings by an imaginary boundary\n- Energy exists in many forms within a system (kinetic, potential, thermal, chemical, electrical, light, sound)\n- Energy **transforms** from one form to another (e.g., chemical → thermal when burning fuel)\n- Energy **transfers** between parts of a system or from the system to its surroundings\n- Energy is **never created or destroyed** — only transformed or transferred (conservation of energy)"
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "System", definition: "A defined group of objects being studied; bounded by an imaginary boundary" },
        { term: "Surroundings", definition: "Everything outside the system boundary" },
        { term: "Energy Transformation", definition: "When energy changes from one form to another (e.g., kinetic → thermal)" },
        { term: "Energy Transfer", definition: "When energy moves from one object or part of a system to another" },
        { term: "Conservation of Energy", definition: "Energy cannot be created or destroyed — it can only be transformed or transferred" },
        { term: "Thermal Energy", definition: "Energy related to the temperature/motion of particles in a substance (often called heat)" },
        { term: "Kinetic Energy", definition: "Energy of motion — any moving object has kinetic energy" },
        { term: "Potential Energy", definition: "Stored energy due to position or configuration (gravitational, elastic, chemical)" }
      ]
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Go back to the Question of the Day — when you rub your hands together and they get warm, what system is involved, what energy transformation is happening, and where does the thermal energy come from?",
      difficulty: "apply"
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, 'physics', 'energy-transformations', lesson);
    console.log('✅ Lesson "Systems & Energy Transformations" seeded successfully!');
    console.log('   Path: courses/physics/lessons/energy-transformations');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order: 1 (after "What is Energy?" at order 0)');
    console.log('   Due Date:', lesson.dueDate);
    console.log('   Visible: false (publish via Lesson Editor when ready)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
