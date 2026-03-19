// seed-momentum-conservation.js
// Creates "Conservation of Momentum: Testing Experiment" lesson (Momentum Unit, Lesson 2)
// Classroom reference: "Testing Experiment: Momentum Conservation (Mar 11)"
// Run: node scripts/seed-momentum-conservation.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Conservation of Momentum: Testing Experiment",
  course: "Physics",
  unit: "Momentum",
  questionOfTheDay: "If you could perfectly predict the outcome of every collision before it happens, would that count as proof that momentum is conserved? Or is prediction not the same as proof?",
  order: 2,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔬",
      title: "Warm Up: What We Know So Far",
      subtitle: "~5 minutes"
    },
    {
      id: "warmup-text",
      type: "text",
      content: "In the Momentum Mystery Lab, you discovered that **p = mv** (mass times velocity) seemed to stay the same before and after a collision — at least in the one type of collision you tested.\n\nBut one experiment isn't enough. Scientists don't trust a single result. They ask: **does this hold up under different conditions?**\n\nToday you become the experimenter. You'll design a NEW collision, **predict** the outcome using conservation of momentum, then **test** whether your prediction matches reality. If it does — across multiple collision types — that's powerful evidence that momentum really is conserved."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🤔",
      content: "**Question of the Day:** If you could perfectly predict the outcome of every collision before it happens, would that count as proof that momentum is conserved? Or is prediction not the same as proof?"
    },
    {
      id: "q-warmup-recall",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In the Momentum Mystery Lab, what quantity did you find was (approximately) the same before and after the collision?",
      options: [
        "Total mass of the system",
        "Total speed of the system",
        "Total momentum (m × v) of the system",
        "Total kinetic energy of the system"
      ],
      correctIndex: 2,
      explanation: "You found that the total momentum (the sum of each object's mass times velocity) was approximately the same before and after the collision. Mass is always conserved (nothing disappeared), and total speed is NOT conserved in general. Kinetic energy is only conserved in elastic collisions."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Design a testing experiment to evaluate whether momentum is conserved across different collision types",
        "Use conservation of momentum (p_initial = p_final) to predict outcomes BEFORE measuring",
        "Distinguish between elastic, inelastic, perfectly inelastic, and explosion (push-off) collisions",
        "Compare predicted and measured values to evaluate conservation of momentum",
        "Calculate percent difference between predicted and measured results",
        "Write a CER (Claim-Evidence-Reasoning) conclusion about momentum conservation"
      ]
    },

    // ═══════════════════════════════════════════
    // COLLISION TYPES
    // ═══════════════════════════════════════════
    {
      id: "section-collision-types",
      type: "section_header",
      icon: "💥",
      title: "Four Types of Collisions",
      subtitle: "~10 minutes"
    },
    {
      id: "collision-types-text",
      type: "text",
      content: "If momentum is truly conserved, it should be conserved in ALL types of collisions — not just the one you happened to test first. Here are four fundamentally different collision types:\n\n**1. Elastic Collision** — Objects bounce off each other. Both momentum AND kinetic energy are conserved. Example: billiard balls clicking off each other.\n\n**2. Inelastic Collision** — Objects bounce, but some kinetic energy is lost to sound, heat, or deformation. Momentum is still conserved (if we're right). Example: a basketball bouncing off a wall — it doesn't come back at full speed.\n\n**3. Perfectly Inelastic Collision** — Objects stick together after impact. Maximum kinetic energy is lost. Momentum should still be conserved. Example: a ball of clay slamming into a wall and sticking.\n\n**4. Explosion (Push-Off)** — Objects start together and push apart. This is a collision in reverse. If momentum is conserved, the total momentum before (zero, since nothing was moving) should equal the total momentum after. Example: two ice skaters pushing off each other."
    },
    {
      id: "callout-key-insight",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Key Insight:** If conservation of momentum is a real law of nature, it doesn't get to pick and choose. It must work for bouncing, sticking, and pushing apart. Your job today is to test whether it actually does."
    },
    {
      id: "q-collision-type-id",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two carts collide on a track. After the collision, they stick together and move as one unit. What type of collision is this?",
      options: [
        "Elastic — they bounced off each other",
        "Inelastic — they bounced but lost energy",
        "Perfectly inelastic — they stuck together",
        "Explosion — they pushed apart"
      ],
      correctIndex: 2,
      explanation: "When objects stick together after collision, that's a perfectly inelastic collision. It's called 'perfectly' inelastic because it loses the maximum possible kinetic energy while still conserving momentum. The objects share a single final velocity."
    },
    {
      id: "q-explosion-predict",
      type: "question",
      questionType: "short_answer",
      prompt: "Two identical carts are at rest, touching each other. A spring between them fires and pushes them apart. If momentum is conserved, what should the total momentum of the system be AFTER the push? Explain your reasoning.",
      placeholder: "Before the push, the total momentum is... After the push, the total momentum should be... because...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // PREDICTION PHASE
    // ═══════════════════════════════════════════
    {
      id: "section-prediction",
      type: "section_header",
      icon: "🎯",
      title: "Phase 1: Predict Before You Measure",
      subtitle: "~15 minutes"
    },
    {
      id: "predict-intro-text",
      type: "text",
      content: "This is what separates a **testing experiment** from just messing around: you make a **quantitative prediction** before you collect data.\n\nThe logic is simple:\n1. **Assume** conservation of momentum is true: p_before = p_after\n2. **Measure** the masses and initial velocities\n3. **Calculate** what the final velocities SHOULD be\n4. **Then** run the experiment and see if reality agrees\n\nIf your prediction is close to the measurement, conservation of momentum passes the test. If it's way off, something is wrong — either momentum isn't conserved, or your assumptions about the system were flawed."
    },
    {
      id: "callout-testing-experiment",
      type: "callout",
      style: "insight",
      icon: "🔬",
      content: "**Testing Experiment Framework:**\n- **Predict:** Use the model (conservation of momentum) to calculate what SHOULD happen\n- **Test:** Run the experiment and measure what ACTUALLY happens\n- **Evaluate:** Compare predicted vs. measured values. Close match = model passes. Big mismatch = model may need revision."
    },
    {
      id: "q-predict-setup",
      type: "question",
      questionType: "short_answer",
      prompt: "Your group chooses a collision type to test. Describe: (a) What collision type are you testing? (b) What objects are colliding? (c) What will you measure before the collision? (d) What will you predict using p_initial = p_final?",
      placeholder: "We are testing a... collision between... We will measure... and predict...",
      difficulty: "apply"
    },
    {
      id: "predict-calculation-text",
      type: "text",
      content: "**Setting Up the Prediction:**\n\nFor a perfectly inelastic collision (objects stick together):\n- p_before = m₁v₁ + m₂v₂\n- p_after = (m₁ + m₂)v_final\n- Set equal: m₁v₁ + m₂v₂ = (m₁ + m₂)v_final\n- Solve: **v_final = (m₁v₁ + m₂v₂) / (m₁ + m₂)**\n\nFor an explosion (push-off from rest):\n- p_before = 0 (everything at rest)\n- p_after = m₁v₁ + m₂v₂\n- Set equal: 0 = m₁v₁ + m₂v₂\n- So: **m₁v₁ = −m₂v₂** (they move in opposite directions)\n\nRecord your masses and initial velocities, then calculate your predicted final velocity."
    },
    {
      id: "q-prediction-math",
      type: "question",
      questionType: "short_answer",
      prompt: "Show your prediction calculation step by step. Write the conservation of momentum equation, substitute your measured values for mass and initial velocity, and solve for the unknown final velocity. What do you predict will happen?",
      placeholder: "p_initial = p_final\n(...)(... ) + (...)(... ) = ...\nPredicted v_final = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // EXPERIMENT PHASE
    // ═══════════════════════════════════════════
    {
      id: "section-experiment",
      type: "section_header",
      icon: "🧪",
      title: "Phase 2: Run the Experiment",
      subtitle: "~15 minutes"
    },
    {
      id: "experiment-text",
      type: "text",
      content: "Now run the collision and measure the actual outcome. Record everything carefully — you'll compare these measurements to your prediction.\n\n**Procedure:**\n1. Set up your collision on the track with the motion detectors in position\n2. Record the masses of all objects involved\n3. Start the motion detectors\n4. Run the collision\n5. Record the measured final velocities from the motion detectors\n6. Run at least **2 trials** to check consistency\n\n**Important:** Don't look at the measured data until AFTER you've locked in your prediction. The whole point is to see if the model predicts reality — not to fit the model to data you've already seen."
    },
    {
      id: "data-table-text",
      type: "text",
      content: "**Data Table: Predicted vs. Measured**\n\n| Quantity | Trial 1 | Trial 2 |\n|----------|---------|---------|  \n| m₁ (kg) | | |\n| m₂ (kg) | | |\n| v₁ initial (m/s) | | |\n| v₂ initial (m/s) | | |\n| **v_final PREDICTED (m/s)** | | |\n| **v_final MEASURED (m/s)** | | |\n| Percent difference (%) | | |\n\nRecord your data in the table above. Calculate percent difference:\n**% diff = |predicted − measured| / predicted × 100%**"
    },
    {
      id: "q-data-entry",
      type: "question",
      questionType: "short_answer",
      prompt: "Record your experimental data here. For each trial, list: (a) the masses, (b) the initial velocities, (c) your predicted final velocity, (d) the measured final velocity, and (e) the percent difference.",
      placeholder: "Trial 1:\nm1 = ... kg, m2 = ... kg\nv1_initial = ... m/s, v2_initial = ... m/s\nPredicted v_final = ... m/s\nMeasured v_final = ... m/s\nPercent difference = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // ANALYSIS PHASE
    // ═══════════════════════════════════════════
    {
      id: "section-analysis",
      type: "section_header",
      icon: "📊",
      title: "Phase 3: Analyze & Evaluate",
      subtitle: "~10 minutes"
    },
    {
      id: "analysis-text",
      type: "text",
      content: "Time for the verdict. How close were your predictions to reality?\n\n**Guidelines for evaluation:**\n- **< 5% difference:** Excellent agreement. Strong evidence that momentum is conserved.\n- **5-15% difference:** Reasonable agreement. Conservation likely holds; differences probably come from friction, measurement error, or air resistance.\n- **> 15% difference:** Significant disagreement. Either the model is wrong, or something in your experimental setup violated the assumptions (e.g., external forces on the system).\n\nRemember: no experiment is perfect. The question isn't whether the numbers match EXACTLY — it's whether they're close enough that conservation of momentum is the best explanation."
    },
    {
      id: "q-evaluation-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Your predicted final velocity was 0.45 m/s and your measured final velocity was 0.42 m/s. The percent difference is about 6.7%. What does this tell you?",
      options: [
        "Momentum is definitely NOT conserved — the numbers don't match exactly",
        "This is reasonable agreement — small differences are expected due to friction and measurement error",
        "This proves momentum is conserved beyond any doubt",
        "The experiment was a failure because perfect accuracy wasn't achieved"
      ],
      correctIndex: 1,
      explanation: "A 6.7% difference falls in the 'reasonable agreement' range. Real experiments always have some error — friction on the track, air resistance, imperfect velocity measurements. The fact that conservation of momentum predicted the outcome within a few percent is strong evidence the model works. Science doesn't demand perfection; it demands consistent, close predictions."
    },
    {
      id: "q-error-sources",
      type: "question",
      questionType: "short_answer",
      prompt: "List at least THREE sources of error that could explain why your predicted and measured values weren't exactly the same. For each one, explain whether it would make the measured velocity higher or lower than predicted.",
      placeholder: "1. Friction on the track would... 2. Air resistance would... 3. ...",
      difficulty: "analyze"
    },
    {
      id: "q-class-data-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Different groups in your class tested different collision types (elastic, perfectly inelastic, explosion). If ALL groups found that their predicted and measured values were close, what would that tell us about conservation of momentum?",
      options: [
        "Nothing — each group only tested one type",
        "It works for those specific carts but maybe not for other objects",
        "Strong evidence that momentum is conserved across different collision types — the model is robust",
        "It proves that kinetic energy is also conserved in all collisions"
      ],
      correctIndex: 2,
      explanation: "When a model successfully predicts outcomes across many DIFFERENT situations, that's powerful evidence. One successful prediction could be a coincidence. Multiple successful predictions across elastic, inelastic, and explosion collisions — that's a pattern. This is how science builds confidence in a law of nature."
    },

    // ═══════════════════════════════════════════
    // CER CONCLUSION
    // ═══════════════════════════════════════════
    {
      id: "section-conclusion",
      type: "section_header",
      icon: "✍️",
      title: "CER Conclusion",
      subtitle: "~10 minutes"
    },
    {
      id: "cer-framework-text",
      type: "text",
      content: "Write a CER (Claim-Evidence-Reasoning) conclusion answering this question:\n\n**Is momentum (m × v) conserved in collisions?**\n\n**Claim:** State whether your testing experiment reinforced or challenged the idea that momentum is conserved. Be specific about which collision type you tested.\n\n**Evidence:** Cite your specific numerical data — predicted velocity, measured velocity, percent difference. Include data from at least one other group if available.\n\n**Reasoning:** Explain WHY the close agreement between prediction and measurement supports conservation of momentum. Address: What assumptions did you make? What could explain any differences? Why does testing multiple collision types strengthen the conclusion?"
    },
    {
      id: "q-cer-conclusion",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your full CER conclusion. Include a clear Claim, specific numerical Evidence from your experiment (and other groups if available), and Reasoning that explains why your evidence supports or challenges conservation of momentum.",
      placeholder: "CLAIM: Based on our testing experiment...\n\nEVIDENCE: Our group tested a... collision. We predicted v_final = ... and measured v_final = ... (% difference = ...). Group ___ tested a... collision and found...\n\nREASONING: The close agreement between predicted and measured values supports...",
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
      subtitle: ""
    },
    {
      id: "wrapup-text",
      type: "text",
      content: "Today you used conservation of momentum as a **predictive tool** — not just a formula to plug into after the fact, but a model that tells you what SHOULD happen before you even run the experiment.\n\nThe fact that your predictions were close to reality across different collision types is strong evidence. But there's a deeper question we haven't answered yet:\n\n**How do we know the conserved quantity is m × v and not something else?** What if it's m × s (mass times distance)? Or m × v² (mass times velocity squared)? Just because m × v worked doesn't mean it's the only possibility.\n\nNext class, we'll tackle that question head-on by trying to **disprove** alternative candidates."
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 2 kg cart moving at 3 m/s collides with and sticks to a 1 kg cart at rest. Using conservation of momentum, what is the final velocity of the combined carts?",
      options: [
        "1 m/s",
        "2 m/s",
        "3 m/s",
        "6 m/s"
      ],
      correctIndex: 1,
      explanation: "p_initial = m₁v₁ + m₂v₂ = (2)(3) + (1)(0) = 6 kg·m/s. After sticking together: p_final = (m₁ + m₂)v_final = (3)v_final. Setting equal: 6 = 3v_final → v_final = 2 m/s. The combined cart moves at 2 m/s — slower than the original cart because the same momentum is now spread across more mass."
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
      id: "vocab-list",
      type: "vocab_list",
      terms: [
        { term: "Conservation of momentum", definition: "The total momentum of an isolated system remains constant: p_initial = p_final. Holds for all collision types as long as no external forces act on the system." },
        { term: "Testing experiment", definition: "An experiment designed to evaluate a model by making a quantitative prediction BEFORE collecting data, then comparing the prediction to the measured result." },
        { term: "Elastic collision", definition: "A collision where objects bounce off each other and BOTH momentum and kinetic energy are conserved. Example: billiard balls." },
        { term: "Inelastic collision", definition: "A collision where objects bounce but some kinetic energy is lost to heat, sound, or deformation. Momentum is still conserved." },
        { term: "Perfectly inelastic collision", definition: "A collision where objects stick together after impact. Maximum kinetic energy is lost, but momentum is still conserved. v_final = (m₁v₁ + m₂v₂) / (m₁ + m₂)." },
        { term: "Explosion (push-off)", definition: "Objects start together at rest and push apart. Total initial momentum is zero, so total final momentum must also be zero: m₁v₁ = −m₂v₂." },
        { term: "Percent difference", definition: "A measure of how close a predicted value is to a measured value: % diff = |predicted − measured| / predicted × 100%. Used to evaluate whether a model's prediction matches reality." },
        { term: "Isolated system", definition: "A system where no external forces transfer momentum in or out. Conservation of momentum only applies to isolated (or approximately isolated) systems." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("momentum-conservation")
      .set(lesson);
    console.log('✅ Lesson "Conservation of Momentum: Testing Experiment" seeded successfully!');
    console.log("   Path: courses/physics/lessons/momentum-conservation");
    console.log(`   Blocks: ${lesson.blocks.length}`);
    console.log(`   Order: ${lesson.order}`);
    console.log("   Visible: false — publish via Lesson Editor when ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
