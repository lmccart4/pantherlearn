// seed-conservation-bar-charts.js
// Creates the "Conservation of Energy & Bar Charts" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-conservation-bar-charts.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Conservation of Energy & Bar Charts",
  course: "Physics",
  unit: "Energy",
  order: 3,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔥",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "You've been learning about different types of energy — kinetic energy, gravitational potential energy, and how energy transfers and transforms between forms.\n\nToday you're going to discover the **deeper principle** behind *all* of those energy changes — and learn a powerful visual tool physicists use to *see* it happening.\n\nPicture a pendulum — someone pulls it to one side and lets go. At the top of its swing it hangs still for just a moment, then it rushes down through the bottom and climbs back up the other side. The energy didn't come from nowhere — it just **changed form**."
    },
    {
      id: "img-pendulum",
      type: "image",
      url: "https://media.giphy.com/media/3o85xmXj0iqBmIfDeU/giphy.gif",
      alt: "Pendulum swinging back and forth",
      caption: "Watch how the pendulum speeds up at the bottom and slows down at the top — energy changing form in real time."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about that pendulum. Describe what happens to its energy as it swings from the highest point to the lowest point and back up again. Use the words 'kinetic energy' and 'potential energy' in your answer.",
      difficulty: "understand"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If a rollercoaster only had 100 joules of energy at the start, how much total energy does it have at the end of the ride — and how do you know?"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "State the Law of Conservation of Energy and apply it to predict outcomes",
        "Identify the initial and final states of a physical scenario",
        "Read and interpret energy bar charts to understand how energy is distributed before and after an event",
        "Use energy bar charts to explain why the total height of bars must remain equal",
        "Analyze real-world scenarios using conservation principles"
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 1: CONSERVATION — CORE CONCEPT
    // ═══════════════════════════════════════════
    {
      id: "section-conservation",
      type: "section_header",
      icon: "⚖️",
      title: "Activity 1: Conservation of Energy — The Big Idea",
      subtitle: "~10 minutes"
    },
    {
      id: "b-cons-text",
      type: "text",
      content: "You already know that **energy cannot be created or destroyed**. Now let's get precise about what that means.\n\nIn a **closed system** (one with no energy entering or leaving), the total energy is always the same. We write this as:\n\n**E_initial = E_final**\n\nThat means: **Kinetic Energy + Potential Energy (at the start) = Kinetic Energy + Potential Energy (at the end)**\n\nWhen one type of energy goes up, another must go down by the same amount. It's a perfect trade-off."
    },
    {
      id: "def-conservation",
      type: "definition",
      term: "Law of Conservation of Energy",
      definition: "In a closed system, the total mechanical energy remains constant. Energy may transform between kinetic and potential forms, but the total never changes. E_initial = E_final"
    },
    {
      id: "callout-real-world",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**What about real-world situations?** In real life, energy also transforms into **thermal energy** (heat from friction) and **sound**. These count too! A truly closed system means ALL energy forms are tracked — including the 'lost' ones. The total still doesn't change."
    },
    {
      id: "q-cons-mc1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A pendulum swings from its highest point to its lowest point. What happens to the energy? (Ignore air resistance.)",
      difficulty: "understand",
      options: [
        "Gravitational PE is destroyed and kinetic energy is created",
        "Gravitational PE transforms into kinetic energy — total energy stays the same",
        "Kinetic energy transforms into gravitational PE — total energy stays the same",
        "Both kinetic energy and gravitational PE increase"
      ],
      correctIndex: 1,
      explanation: "Energy is never created or destroyed. As the pendulum falls, gravitational PE decreases and kinetic energy increases by the same amount. The total energy is conserved."
    },
    {
      id: "sort-cons",
      type: "sorting",
      icon: "⚡",
      title: "Energy Going UP or DOWN?",
      instructions: "For each scenario, decide whether the described energy type is **increasing** or **decreasing** as the event happens. Swipe left for Increasing, right for Decreasing.",
      leftLabel: "Increasing ↑",
      rightLabel: "Decreasing ↓",
      items: [
        { text: "KE of a ball as it falls from a cliff", correct: "left" },
        { text: "GPE of a ball as it falls from a cliff", correct: "right" },
        { text: "KE of a rocket as it launches upward", correct: "right" },
        { text: "GPE of a rocket as it launches upward", correct: "left" },
        { text: "KE of a car braking to a stop", correct: "right" },
        { text: "Thermal energy when a car brakes to a stop", correct: "left" },
        { text: "GPE of a roller coaster going down the first hill", correct: "right" },
        { text: "KE of a roller coaster going down the first hill", correct: "left" }
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 2: UNIVERSE & MORE — MAIN EVENT
    // ═══════════════════════════════════════════
    {
      id: "section-univmore",
      type: "section_header",
      icon: "🌐",
      title: "Activity 2: Universe & More — Energy Bar Charts",
      subtitle: "~40 minutes"
    },
    {
      id: "b-univmore-intro",
      type: "text",
      content: "This is your main activity for today. You're going to spend the next **40 minutes** on the **Universe & More** website exploring energy bar charts — the visual tool physicists use to *see* conservation of energy in action.\n\nPhysicists use **energy bar charts** (sometimes called LOL diagrams) to show how energy is distributed before and after an event. Each bar represents a type of energy (KE, GPE, Elastic PE, Thermal). The key rule: **the total height of all bars must be the same on both sides** — because energy is conserved."
    },
    {
      id: "callout-barchart-rules",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The golden rule of bar charts:** The total height of ALL bars on the left MUST equal the total height of ALL bars on the right. If KE goes up, something else must go down by the same amount. Energy is conserved — no exceptions!"
    },
    {
      id: "link-univmore",
      type: "external_link",
      icon: "🚀",
      title: "Universe & More: Energy",
      url: "https://universeandmore.com/energy",
      description: "Interactive physics activities exploring conservation of energy, energy types, and energy bar charts.",
      buttonLabel: "Open Universe & More",
      openInNewTab: true
    },
    {
      id: "b-univmore-directions",
      type: "callout",
      style: "directions",
      icon: "🎯",
      content: "**Your goal:** Complete as many energy bar chart activities as you can in 40 minutes.\n\nAs you work through them, pay attention to:\n\n**1.** How **kinetic energy** and **potential energy** trade off as objects move\n**2.** What happens to the **total energy** throughout each scenario — does it ever change?\n**3.** Where **thermal energy** shows up when friction is involved\n**4.** How bar charts visually prove that energy is conserved\n\nDon't rush — actually think about each scenario. If you get stuck on one, move on and come back to it. The more bar charts you complete, the stronger your understanding will be for the check at the end."
    },

    // ═══════════════════════════════════════════
    // CHECK YOUR UNDERSTANDING
    // ═══════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      icon: "✅",
      title: "Check Your Understanding",
      subtitle: "~10-15 minutes"
    },
    {
      id: "b-check-intro",
      type: "text",
      content: "Welcome back from Universe & More! Now let's see how well you understood those bar charts. Answer the following questions based on what you learned — no calculations needed, just your understanding of how energy transforms and is conserved."
    },
    {
      id: "q-check1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball is dropped from rest at a high point. Just before it hits the ground, what does a correct energy bar chart look like?",
      difficulty: "understand",
      options: [
        "Initial: tall GPE bar, no KE bar → Final: no GPE bar, tall KE bar (same total height)",
        "Initial: tall GPE bar, no KE bar → Final: medium GPE bar, medium KE bar",
        "Initial: tall GPE bar, no KE bar → Final: no GPE bar, shorter KE bar (energy lost)",
        "Initial: no GPE bar, tall KE bar → Final: tall GPE bar, no KE bar"
      ],
      correctIndex: 0,
      explanation: "At the top, all energy is gravitational PE (tall GPE bar, no KE). At the bottom, all energy has transformed to kinetic (tall KE bar, no GPE). The total bar height stays the same — energy is conserved."
    },
    {
      id: "q-check2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An energy bar chart shows: Initial state has a tall GPE bar and no KE. Final state has a medium GPE bar, a medium KE bar, and a small thermal energy bar. The total bar height is the same on both sides. This scenario BEST describes:",
      difficulty: "analyze",
      options: [
        "A ball falling in a vacuum with no friction",
        "A ball rolling partway down a ramp with some friction",
        "A compressed spring launching a ball straight up",
        "A stationary object sitting on a table"
      ],
      correctIndex: 1,
      explanation: "GPE decreased (lost some height), KE increased (gained speed), and thermal energy appeared (friction). This matches a ball rolling partway down a ramp with friction. Total energy is still conserved."
    },
    {
      id: "q-check3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A box is sliding across a rough floor and eventually stops. What does the bar chart look like?",
      difficulty: "understand",
      options: [
        "Initial: tall KE bar → Final: tall thermal energy bar (same total height)",
        "Initial: tall KE bar → Final: nothing (energy was destroyed by friction)",
        "Initial: tall KE bar → Final: tall GPE bar",
        "Initial: tall thermal bar → Final: tall KE bar"
      ],
      correctIndex: 0,
      explanation: "The box's kinetic energy transforms entirely into thermal energy (heat from friction). The total bar height stays the same — energy is conserved even though the box stopped. The energy is now in the form of heat."
    },
    {
      id: "q-check4",
      type: "question",
      questionType: "ranking",
      prompt: "A ball is launched upward by a spring, rises to a peak, and falls back down (ignore air resistance). Rank these moments from MOST kinetic energy to LEAST kinetic energy:",
      difficulty: "analyze",
      items: [
        "The instant the spring fully releases (just left the spring at ground level)",
        "Halfway up to the peak height",
        "At the peak height (momentarily stopped)",
        "Back at ground level after falling (just about to land)"
      ]
    },
    {
      id: "q-check5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student draws an energy bar chart for a bouncing ball. They notice the total bar height is SMALLER in the final state than the initial state. What's the most likely explanation?",
      difficulty: "evaluate",
      options: [
        "Energy was destroyed during the bounce — conservation doesn't apply here",
        "The student forgot to include a thermal energy bar — some energy became heat during the bounce",
        "The ball gained energy during the bounce, so the bars should be taller on the right",
        "Bar charts don't work for bouncing scenarios"
      ],
      correctIndex: 1,
      explanation: "Energy is NEVER destroyed. When a ball bounces, some kinetic energy transforms into thermal energy and sound. If the total bars look smaller, it means the student didn't account for all forms of energy — especially thermal energy from the impact."
    },
    {
      id: "q-check6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A roller coaster starts at the top of the first hill and reaches a second hill that is LOWER than the first. At the top of the second hill, which statement is correct? (Ignore friction.)",
      difficulty: "analyze",
      options: [
        "All the energy is kinetic — there's no potential energy left",
        "All the energy is gravitational PE — the coaster is momentarily stopped",
        "The coaster has BOTH kinetic energy and gravitational PE — it's still moving AND still has some height",
        "The coaster has more total energy than it started with because it went faster on the way down"
      ],
      correctIndex: 2,
      explanation: "The second hill is lower than the first, so the coaster still has some height (GPE) but also still has speed (KE) because it didn't use all its GPE getting to this lower height. Total energy equals what it started with."
    },
    {
      id: "q-check7",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about all the bar chart activities you did on Universe & More. Pick your favorite scenario and describe: (1) What was the system? (2) What energy types were involved? (3) How did the bar chart show that energy was conserved?",
      difficulty: "analyze"
    },
    {
      id: "q-check8",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, explain what an energy bar chart IS and WHY physicists use them. How do they help us understand conservation of energy better than just saying 'energy is conserved'?",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎬",
      title: "Wrap Up",
      subtitle: "~2 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "**Today you went deeper into conservation of energy:**\n\n- **E_initial = E_final** in any closed system — energy is never created or destroyed\n- When one energy type goes **up**, another must go **down** by the same amount\n- **Energy bar charts** let us visualize this trade-off — the total bar height must be equal on both sides\n- In real systems with friction, **thermal energy** appears — but the total still balances\n\n**Coming up next:** You'll explore a new type of stored energy — **elastic potential energy** — by getting hands-on with springs, rubber bands, and Play-Doh."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** If a roller coaster only has 100 joules of energy at the start, how much total energy does it have at the end of the ride?\n\nAnswer: Still 100 joules — always. The form changes (from GPE to KE to thermal), but the total amount is conserved."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Describe what an energy bar chart would look like for a pendulum at its highest point (initial) vs. its lowest point (final). Which bars are tall? Which are short or zero? Explain why.",
      difficulty: "create"
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
        { term: "Conservation of Energy", definition: "The law stating that energy cannot be created or destroyed in a closed system — only transformed or transferred. E_initial = E_final." },
        { term: "Closed System", definition: "A system where no energy enters or leaves from the outside. Total energy inside stays constant." },
        { term: "Kinetic Energy (KE)", definition: "Energy of motion. Faster objects and heavier objects have more KE." },
        { term: "Gravitational Potential Energy (GPE)", definition: "Stored energy due to height. Higher objects and heavier objects have more GPE." },
        { term: "Thermal Energy", definition: "Energy associated with the random motion of particles; generated by friction. Represents energy 'lost' to heat in real systems." },
        { term: "Energy Bar Chart", definition: "A visual tool (also called a LOL diagram) showing the relative amounts of different energy types at the initial and final states of a scenario. Total bar height must be equal on both sides." },
        { term: "Initial State", definition: "The starting condition of a system — the moment before the event or process begins." },
        { term: "Final State", definition: "The ending condition of a system — the moment after the event or process is complete." },
        { term: "Mechanical Energy", definition: "The sum of kinetic energy and potential energy in a system. In a frictionless system, mechanical energy is conserved." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, 'physics', 'conservation-bar-charts', lesson);
    console.log('✅ Lesson "Conservation of Energy & Bar Charts" seeded successfully!');
    console.log('   Path: courses/physics/lessons/conservation-bar-charts');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order: 3 (after "Elastic Potential Energy" at order 2)');
    console.log('   Visible: false (publish via Lesson Editor when ready)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
