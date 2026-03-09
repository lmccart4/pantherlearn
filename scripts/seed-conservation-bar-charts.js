// seed-conservation-bar-charts.js
// Creates the "Conservation of Energy & Bar Charts" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-conservation-bar-charts.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Conservation of Energy & Bar Charts",
  course: "Physics",
  unit: "Energy",
  order: 4,
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
      subtitle: "~8 minutes"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Last class you explored elastic potential energy — how springs and rubber bands store energy when stretched or compressed. Before that, you learned about kinetic energy, gravitational PE, and how energy transfers and transforms between forms.\n\nToday you're going to discover the **deeper principle** behind *all* of those energy changes — and learn a powerful visual tool physicists use to *see* it happening.\n\nThink about a skateboarder rolling down a halfpipe. At the top, they're nearly still. At the bottom, they're flying. The energy didn't come from nowhere — it just **changed form**."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "A pendulum is pulled to one side and released. Describe what happens to its energy as it swings from the highest point to the lowest point and back up. Use the words 'kinetic energy' and 'potential energy' in your answer.",
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
        "Create energy bar charts to represent how energy is distributed before and after an event",
        "Use energy bar charts to explain why the total height of bars must remain equal",
        "Analyze real-world scenarios using conservation principles"
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 1: CONSERVATION — A DEEPER LOOK
    // ═══════════════════════════════════════════
    {
      id: "section-conservation",
      type: "section_header",
      icon: "⚖️",
      title: "Activity 1: Conservation of Energy — Digging Deeper",
      subtitle: "~15 minutes"
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
      id: "callout-formulas-recall",
      type: "callout",
      style: "insight",
      icon: "🔁",
      content: "**Quick recall from earlier lessons:**\n- **KE = ½mv²** — kinetic energy depends on mass and speed\n- **GPE = mgh** — gravitational PE depends on mass, gravity, and height\n- **EPE = ½kx²** — elastic PE depends on spring constant and displacement\n\nAll measured in **joules (J)**. Today you'll see how these trade off while the total stays constant."
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
      prompt: "A 2 kg book is held at a height of 3 meters. It is dropped and falls to the floor. If GPE = mgh (g = 10 m/s²), how much gravitational potential energy does it have at the start? And assuming no air resistance, how much kinetic energy will it have just before it hits the floor?",
      difficulty: "apply",
      options: [
        "GPE = 30 J at start; KE = 15 J at bottom",
        "GPE = 60 J at start; KE = 60 J at bottom",
        "GPE = 60 J at start; KE = 30 J at bottom",
        "GPE = 30 J at start; KE = 30 J at bottom"
      ],
      correctIndex: 1,
      explanation: "GPE = mgh = 2 × 10 × 3 = 60 J. Since no air resistance, all GPE converts to KE. At the bottom the book has 0 GPE and 60 J KE. Energy is conserved: 60 J = 60 J."
    },
    {
      id: "q-cons-mc2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A pendulum has 80 J of gravitational potential energy at its highest point. It swings to its lowest point. At the lowest point, how much kinetic energy does it have (ignoring air resistance)?",
      difficulty: "understand",
      options: [
        "0 J — it used up energy getting there",
        "40 J — half the energy was converted",
        "80 J — all the potential energy became kinetic",
        "More than 80 J — it gained speed on the way down"
      ],
      correctIndex: 2,
      explanation: "Conservation of energy: E_initial = E_final. At the top, all energy is GPE = 80 J (KE = 0 since it's momentarily stopped). At the bottom, all energy is KE = 80 J (GPE = 0 since it's at the lowest point). Total stays at 80 J."
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
    // ACTIVITY 2: UNIVERSE & MORE
    // ═══════════════════════════════════════════
    {
      id: "section-univmore",
      type: "section_header",
      icon: "🌐",
      title: "Activity 2: Universe & More — Energy Exploration",
      subtitle: "~20 minutes"
    },
    {
      id: "b-univmore-intro",
      type: "text",
      content: "You're going to explore conservation of energy using an interactive physics website. **Universe & More** is a physics learning platform designed to make energy concepts visual and hands-on.\n\nAs you work through the energy activities on the site, pay close attention to:\n- How **kinetic energy** and **potential energy** trade off as objects move\n- What happens to the **total energy** throughout each scenario\n- Where **thermal energy** appears when the system isn't perfectly efficient\n\nWork through the site at your own pace. Complete the checklist below as you go."
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
      id: "checklist-univmore",
      type: "checklist",
      title: "Universe & More Exploration Checklist",
      items: [
        "Complete at least one activity about kinetic energy — observe how speed and mass affect KE",
        "Complete at least one activity about gravitational potential energy",
        "Find an activity that shows KE and GPE trading off (e.g., a ball falling, a pendulum, or a roller coaster)",
        "Look for any bar chart or graph that shows energy amounts — screenshot it or sketch it",
        "Find an example where energy 'seems' to disappear — identify where it actually went",
        "Try at least one challenge or quiz question on the site"
      ]
    },
    {
      id: "q-univmore-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe one scenario or activity from the Universe & More website. What was the system? What energy types were involved, and how did they change throughout the scenario?",
      difficulty: "analyze"
    },
    {
      id: "q-univmore-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Was there any point in your exploration where energy seemed to 'disappear' or get smaller? Explain what actually happened to that energy — where did it go?",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 3: ENERGY BAR CHARTS
    // ═══════════════════════════════════════════
    {
      id: "section-barcharts",
      type: "section_header",
      icon: "📊",
      title: "Activity 3: Energy Bar Charts",
      subtitle: "~20 minutes"
    },
    {
      id: "b-barchart-intro",
      type: "text",
      content: "Physicists use **energy bar charts** (sometimes called LOL diagrams) to visualize conservation of energy. Here's how they work:\n\n- Each bar represents a **type of energy** (KE, GPE, Elastic PE, Thermal)\n- The **left set of bars** shows energy at the **initial state**\n- The **right set of bars** shows energy at the **final state**\n- The **total height** of all bars must be the same on both sides — that's conservation!\n\nThe bars aren't about exact numbers — they're about **relative amounts**. A tall bar means MORE of that energy type; a short bar means LESS."
    },
    {
      id: "callout-barchart-rules",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The golden rule of bar charts:** The total height of ALL bars on the left MUST equal the total height of ALL bars on the right. If KE goes up, something else must go down by the same amount. Energy is conserved — no exceptions!"
    },
    {
      id: "b-barchart-example",
      type: "text",
      content: "**Example — A ball dropped from rest:**\n\n**Initial State** (ball at rest, held at height):\n- KE = 0 (not moving)\n- GPE = large (high up)\n- Thermal = 0\n\n**Final State** (ball just before hitting the ground):\n- KE = large (moving fast)\n- GPE = 0 (at reference height)\n- Thermal = 0 (no friction — it's falling through air)\n\n**Notice:** The bar for GPE on the left is the same height as the bar for KE on the right. Total energy is the same!"
    },

    {
      id: "b-scenario1",
      type: "text",
      content: "### Scenario 1: Roller Coaster\n\nA roller coaster car starts at **rest at the top of a tall hill** (initial state). It then rolls down and reaches **maximum speed at the bottom of the hill** (final state). There is no friction in this scenario.\n\nCreate a bar chart showing the energy at both states. Use the bars to represent **Kinetic Energy (KE)** and **Gravitational Potential Energy (GPE)**."
    },
    {
      id: "bar-rollercoaster",
      type: "bar_chart",
      title: "Bar Chart: Roller Coaster — Top of Hill → Bottom",
      barCount: 3,
      initialLabel: "Top of Hill (at rest)",
      finalLabel: "Bottom of Hill (max speed)",
      deltaLabel: "Change"
    },
    {
      id: "q-bar-rc",
      type: "question",
      questionType: "linked",
      prompt: "Look at the bar chart you just created. Explain: what happened to the GPE? Where did it go? How does your bar chart show that energy was conserved?",
      difficulty: "analyze",
      linkedBlockId: "bar-rollercoaster"
    },

    {
      id: "b-scenario2",
      type: "text",
      content: "### Scenario 2: Sliding Box with Friction\n\nA box slides across the floor with a lot of kinetic energy (initial state). It eventually comes to a complete stop (final state). This time, **friction IS present** — so thermal energy is created.\n\nCreate a bar chart for this scenario. You'll need bars for **KE** and **Thermal Energy (ΔEth)**."
    },
    {
      id: "bar-friction",
      type: "bar_chart",
      title: "Bar Chart: Sliding Box — Moving → Stopped",
      barCount: 3,
      initialLabel: "Box Moving (lots of KE)",
      finalLabel: "Box Stopped",
      deltaLabel: "Change"
    },
    {
      id: "q-bar-friction",
      type: "question",
      questionType: "linked",
      prompt: "In the friction scenario, the box stopped — but energy was still conserved. Explain this seeming contradiction: how can energy be conserved if the box is no longer moving?",
      difficulty: "evaluate",
      linkedBlockId: "bar-friction"
    },

    {
      id: "b-scenario3",
      type: "text",
      content: "### Scenario 3: Compressed Spring Launch\n\nRemember the elastic potential energy you calculated last class? Now put it to use. A spring is compressed and locked (initial state). It is released and launches a ball upward, which rises to a peak height (final state). Ignore air resistance.\n\nCreate a bar chart using **Elastic PE (EPE = ½kx²)**, **KE**, and **GPE**. Think carefully about what's happening at each state!"
    },
    {
      id: "bar-spring",
      type: "bar_chart",
      title: "Bar Chart: Spring Launch — Compressed → Ball at Peak Height",
      barCount: 4,
      initialLabel: "Spring Compressed (ball still)",
      finalLabel: "Ball at Peak Height",
      deltaLabel: "Change"
    },
    {
      id: "q-bar-spring",
      type: "question",
      questionType: "short_answer",
      prompt: "In the spring scenario, describe the full 'story' of the energy: what form did it start in, what form did it briefly become right after launch, and what form did it end in at the peak? Where did all the elastic PE go?",
      difficulty: "analyze"
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
      id: "q-check1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 1 kg ball is dropped from 5 meters high (g = 10 m/s²). It has 50 J of GPE at the top. Just before hitting the ground, what does a correct energy bar chart look like?",
      difficulty: "apply",
      options: [
        "Initial: GPE = 50 J, KE = 0 J → Final: GPE = 0 J, KE = 50 J",
        "Initial: GPE = 50 J, KE = 0 J → Final: GPE = 25 J, KE = 25 J",
        "Initial: GPE = 50 J, KE = 0 J → Final: GPE = 0 J, KE = 25 J",
        "Initial: GPE = 0 J, KE = 50 J → Final: GPE = 50 J, KE = 0 J"
      ],
      correctIndex: 0,
      explanation: "At the top, the ball is at rest (KE = 0) and at maximum height (GPE = 50 J). Just before impact, height = 0 (GPE = 0) and all energy is kinetic (KE = 50 J). Total is conserved at 50 J both ways."
    },
    {
      id: "q-check2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Look at this energy bar chart description: Initial state has GPE = tall bar, KE = zero bar. Final state has GPE = medium bar, KE = medium bar, Thermal = small bar. The total bar height is the same on both sides. This scenario BEST describes:",
      difficulty: "analyze",
      options: [
        "A ball falling in a vacuum with no friction",
        "A ball rolling partway down a ramp with some friction",
        "A compressed spring in a frictionless system",
        "A stationary object sitting on a table"
      ],
      correctIndex: 1,
      explanation: "The chart shows GPE decreasing (height going down), KE increasing (gaining speed), and a small amount of thermal energy appearing (friction). This matches a ball rolling down a ramp where some energy is lost to friction but total energy is conserved."
    },
    {
      id: "q-check3",
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
      id: "q-check4",
      type: "question",
      questionType: "short_answer",
      prompt: "A student looks at an energy bar chart for a bouncing ball. They notice the total bar height is SMALLER in the final state than the initial state. They say 'This proves energy was destroyed.' What is the student's error? How would you fix their bar chart?",
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
      content: "**Today you went deeper into conservation of energy:**\n\n- **E_initial = E_final** in any closed system — energy is never created or destroyed\n- When one energy type goes **up**, another must go **down** by the same amount\n- **Energy bar charts** let us visualize this trade-off — the total bar height must be equal on both sides\n- In real systems with friction, **thermal energy** appears — but the total still balances\n- You practiced reading and creating bar charts for falling objects, friction scenarios, and spring launches\n\n**Coming up next:** You'll watch energy bar charts update in **real time** as a skater rolls through a halfpipe in the PhET Energy Skate Park simulation."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** If a roller coaster only has 100 joules of energy at the start, how much total energy does it have at the end of the ride?\n\nAnswer: Still 100 joules — always. The form changes (from chemical to mechanical to thermal), but the total amount is conserved."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Without using a simulation or calculator, describe what an energy bar chart would look like for a pendulum at its highest point (initial) vs. its lowest point (final). Which bars are tall? Which are short or zero? Explain why.",
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
        { term: "Kinetic Energy (KE)", definition: "Energy of motion. KE = ½mv². Measured in joules. Greater when mass or speed is higher." },
        { term: "Gravitational Potential Energy (GPE)", definition: "Stored energy due to height. GPE = mgh. Greater when height or mass is greater." },
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
    await db.collection('courses').doc('physics')
      .collection('lessons').doc('conservation-bar-charts')
      .set(lesson);
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
