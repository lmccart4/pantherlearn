// seed-intro-to-energy.js
// Creates the "What is Energy?" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-intro-to-energy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "What is Energy?",
  course: "Physics",
  unit: "Energy",
  order: 0,
  blocks: [
    // --- WARM UP ---
    { id: "section-warmup", type: "section_header", title: "Warm Up", subtitle: "~5 minutes", icon: "🔥" },
    {
      id: "b1", type: "text",
      content: "Think about everything you've done since waking up this morning. You turned off an alarm, got out of bed, maybe ate breakfast, walked or rode to school. Every single one of those actions involved **energy**.\n\nBut what *is* energy, really? And where does it come from?"
    },
    {
      id: "q-warmup", type: "question", questionType: "short_answer",
      prompt: "Without looking anything up, write your best definition of energy in your own words. What do you think energy IS?",
      difficulty: "remember"
    },
    {
      id: "callout-qotd", type: "callout", style: "question", icon: "❓",
      content: "**Question of the Day:** If energy can't be created or destroyed, where does it all go?"
    },

    // --- OBJECTIVES ---
    {
      id: "b-objectives", type: "objectives", title: "Learning Objectives",
      items: [
        "Define energy and distinguish between kinetic and potential energy",
        "Identify different forms of energy in everyday situations",
        "Describe how energy transfers and transforms from one form to another",
        "Apply the law of conservation of energy to real-world scenarios"
      ]
    },

    // --- ACTIVITY 1: TYPES OF ENERGY ---
    { id: "section-types", type: "section_header", title: "Activity: Types of Energy", subtitle: "~10 minutes", icon: "⚡" },
    {
      id: "b2", type: "text",
      content: "Scientists classify energy into two big categories:\n\n**Kinetic Energy** — the energy of motion. Anything that's moving has kinetic energy.\n\n**Potential Energy** — stored energy that has the *potential* to do something. It's waiting to be released."
    },
    { id: "def-kinetic", type: "definition", term: "Kinetic Energy", definition: "The energy an object has because of its motion. The faster it moves or the more mass it has, the more kinetic energy it carries. KE = ½mv²" },
    { id: "def-potential", type: "definition", term: "Potential Energy", definition: "Energy stored in an object due to its position, condition, or composition. Examples include gravitational PE (height), elastic PE (stretched spring), and chemical PE (food, batteries)." },
    {
      id: "sort-energy", type: "sorting",
      icon: "⚡",
      title: "Kinetic or Potential?",
      instructions: "Classify each example as **kinetic energy** (energy of motion) or **potential energy** (stored energy). Swipe left for kinetic, right for potential!",
      leftLabel: "Kinetic Energy",
      rightLabel: "Potential Energy",
      items: [
        { text: "A soccer ball flying through the air", correct: "left" },
        { text: "A book sitting on a high shelf", correct: "right" },
        { text: "A car driving down the highway", correct: "left" },
        { text: "A stretched rubber band", correct: "right" },
        { text: "Wind blowing through trees", correct: "left" },
        { text: "A battery in a drawer", correct: "right" },
        { text: "A roller coaster at the top of a hill", correct: "right" },
        { text: "A roller coaster speeding down the track", correct: "left" },
        { text: "Food sitting on your plate", correct: "right" },
        { text: "A person running a race", correct: "left" }
      ]
    },
    {
      id: "q-tricky", type: "question", questionType: "multiple_choice",
      prompt: "A ball is thrown straight up into the air. At the very TOP of its path (before it starts falling), what kind of energy does it have?",
      difficulty: "apply",
      options: [
        "Only kinetic energy",
        "Only potential energy",
        "Both kinetic and potential energy equally",
        "No energy at all"
      ],
      correctIndex: 1,
      explanation: "At the very top, the ball has momentarily stopped moving (no kinetic energy) but is at its highest point (maximum gravitational potential energy). All of its kinetic energy has been converted to potential energy."
    },

    // --- ACTIVITY 2: FORMS OF ENERGY ---
    { id: "section-forms", type: "section_header", title: "Activity: Forms of Energy", subtitle: "~10 minutes", icon: "🌡️" },
    {
      id: "b3", type: "text",
      content: "Energy comes in many specific forms. Here are the main ones you'll encounter:\n\n• **Thermal** — heat energy from particle motion\n• **Chemical** — stored in bonds between atoms (food, fuel, batteries)\n• **Electrical** — flowing electric charges\n• **Light (Radiant)** — energy carried by electromagnetic waves\n• **Sound** — energy carried by vibrations through a medium\n• **Nuclear** — stored in the nucleus of atoms\n• **Elastic** — stored in stretched or compressed objects\n• **Gravitational** — stored due to an object's height"
    },
    {
      id: "q-forms", type: "question", questionType: "multiple_choice",
      prompt: "When you eat a granola bar and then go for a run, what energy transformation is happening?",
      difficulty: "understand",
      options: [
        "Thermal → Kinetic",
        "Chemical → Kinetic (and Thermal)",
        "Electrical → Chemical",
        "Light → Chemical"
      ],
      correctIndex: 1,
      explanation: "Food stores chemical energy in its molecular bonds. When your body digests it, that chemical energy is converted into kinetic energy (movement) and thermal energy (body heat)."
    },
    {
      id: "sketch-energy", type: "sketch",
      title: "Energy Transfer Diagram",
      instructions: "Pick ONE of these scenarios and draw an energy transfer diagram showing what forms of energy are involved and how they transform:\n\n**A:** A phone charging on a wireless charger, then playing music\n**B:** The sun heating a solar panel that powers a fan\n**C:** A match being struck and lighting a candle\n\nLabel each form of energy and use arrows to show the transfers.",
      canvasHeight: 400
    },
    {
      id: "q-sketch-explain", type: "question", questionType: "linked",
      prompt: "Which scenario did you draw? Explain each energy transformation in your diagram, step by step.",
      difficulty: "analyze",
      linkedBlockId: "sketch-energy"
    },

    // --- ACTIVITY 3: CONSERVATION OF ENERGY ---
    { id: "section-conservation", type: "section_header", title: "The Big Rule: Conservation of Energy", subtitle: "~10 minutes", icon: "♻️" },
    {
      id: "b4", type: "text",
      content: "Here's one of the most important ideas in all of physics:\n\n**Energy cannot be created or destroyed — it can only be transferred or transformed from one form to another.**\n\nThis is the **Law of Conservation of Energy**. The total energy in a closed system always stays the same."
    },
    { id: "def-conservation", type: "definition", term: "Law of Conservation of Energy", definition: "Energy cannot be created or destroyed in an isolated system. It can only change forms or transfer between objects. The total energy remains constant." },
    {
      id: "callout-wait", type: "callout", style: "warning", icon: "🤔",
      content: "**Wait — if energy is conserved, why do things slow down and stop?** Great question! When a ball rolls across the floor and stops, its kinetic energy doesn't disappear. It transforms into **thermal energy** (heat from friction) and **sound energy**. The energy is still there — just in forms that are harder to notice."
    },
    {
      id: "rank-coaster", type: "question", questionType: "ranking",
      prompt: "A roller coaster starts at the top of a hill, goes down, up a smaller hill, and comes to a stop at the end. Rank these moments from MOST kinetic energy to LEAST kinetic energy.",
      difficulty: "analyze",
      items: [
        "Bottom of the first drop (fastest point)",
        "Top of the smaller second hill",
        "Halfway down the first drop",
        "Stopped at the end of the ride"
      ]
    },
    {
      id: "checklist-hunt", type: "checklist",
      title: "Energy Hunt — Find These in the Classroom!",
      items: [
        "Something with gravitational potential energy (above the ground)",
        "Something with chemical energy (stores energy in bonds)",
        "Something demonstrating thermal energy (warm or cold)",
        "Something with elastic potential energy (stretched or compressed)",
        "An energy transformation happening right now"
      ]
    },
    {
      id: "q-hunt", type: "question", questionType: "short_answer",
      prompt: "Pick your favorite item from the energy hunt. What forms of energy does it have? If you could release or transform that energy, what would happen?",
      difficulty: "apply"
    },

    // --- CHECK YOUR UNDERSTANDING ---
    { id: "section-check", type: "section_header", title: "Check Your Understanding", subtitle: "", icon: "✅" },
    {
      id: "q-check1", type: "question", questionType: "multiple_choice",
      prompt: "A student holds a basketball at shoulder height, then drops it. As the ball falls, what is happening to its energy?",
      difficulty: "understand",
      options: [
        "Potential energy is being created",
        "Gravitational potential energy is transforming into kinetic energy",
        "Kinetic energy is transforming into potential energy",
        "Energy is being destroyed by gravity"
      ],
      correctIndex: 1,
      explanation: "As the ball falls, it loses height (less gravitational PE) and gains speed (more KE). Energy is transforming from potential to kinetic — not being created or destroyed."
    },
    {
      id: "q-check2", type: "question", questionType: "multiple_choice",
      prompt: "A car runs out of gas and slowly coasts to a stop on a flat road. Where did the car's kinetic energy go?",
      difficulty: "analyze",
      options: [
        "It was destroyed when the car stopped",
        "It was converted back into chemical energy",
        "It was transformed into thermal energy (heat from friction) and sound",
        "It floated away into space"
      ],
      correctIndex: 2,
      explanation: "Friction between the tires and road, and within the car's moving parts, converts kinetic energy into thermal energy (heat). Some also becomes sound energy. No energy is destroyed — it just changes form."
    },
    {
      id: "q-check3", type: "question", questionType: "short_answer",
      prompt: "Imagine you're designing a new ride for an amusement park. Describe your ride and explain at least THREE energy transformations that happen during the ride. Use the terms kinetic energy, potential energy, and at least one specific form of energy (thermal, sound, chemical, etc.).",
      difficulty: "create"
    },

    // --- WRAP UP ---
    { id: "section-wrap", type: "section_header", title: "Wrap Up", subtitle: "~5 minutes", icon: "🎬" },
    {
      id: "b-summary", type: "text",
      content: "Today you learned that **energy** is the ability to do work or cause change. It comes in two main categories — **kinetic** (motion) and **potential** (stored) — and many specific forms like thermal, chemical, electrical, and more.\n\nThe **Law of Conservation of Energy** tells us energy is never created or destroyed, only transferred or transformed. Even when things seem to \"lose\" energy, it's just changing into less obvious forms like heat and sound."
    },
    {
      id: "callout-revisit", type: "callout", style: "question", icon: "❓",
      content: "**Return to the Question of the Day:** If energy can't be created or destroyed, where does it all go?\n\nThink about your answer — then share with your group."
    },
    {
      id: "q-exit", type: "question", questionType: "short_answer",
      prompt: "Exit Ticket: Look at your warm-up answer about what energy is. How would you update your definition now? What's one thing you'd add or change?",
      difficulty: "evaluate"
    },

    // --- VOCABULARY ---
    { id: "section-vocab", type: "section_header", title: "Key Vocabulary", subtitle: "", icon: "📖" },
    {
      id: "vocab", type: "vocab_list",
      terms: [
        { term: "Energy", definition: "The ability to do work or cause change. Measured in joules (J)." },
        { term: "Kinetic Energy", definition: "The energy of motion. KE = ½mv². Depends on mass and speed." },
        { term: "Potential Energy", definition: "Stored energy due to position, condition, or composition." },
        { term: "Gravitational Potential Energy", definition: "Energy stored due to an object's height above a reference point. GPE = mgh." },
        { term: "Chemical Energy", definition: "Energy stored in the bonds between atoms. Found in food, fuel, and batteries." },
        { term: "Thermal Energy", definition: "The total kinetic energy of all particles in a substance. Related to temperature." },
        { term: "Law of Conservation of Energy", definition: "Energy cannot be created or destroyed — only transferred or transformed. Total energy in a closed system remains constant." },
        { term: "Energy Transfer", definition: "When energy moves from one object to another (e.g., heat flowing from hot to cold)." },
        { term: "Energy Transformation", definition: "When energy changes from one form to another (e.g., chemical → kinetic)." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('physics')
      .collection('lessons').doc('intro-to-energy')
      .set(lesson);
    console.log('✅ Lesson "What is Energy?" seeded successfully!');
    console.log('   Path: courses/physics/lessons/intro-to-energy');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
