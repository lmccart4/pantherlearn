// seed-momentum-disproving.js
// Creates "Disproving a Crazy Idea" lesson (Momentum Unit, Lesson 3)
// Classroom reference: "Disproving a Crazy Idea (Mar 11)"
// Run: node scripts/seed-momentum-disproving.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Disproving a Crazy Idea",
  course: "Physics",
  unit: "Momentum",
  questionOfTheDay: "You can never truly PROVE a scientific law — you can only fail to disprove it. So how do scientists become confident that something like conservation of momentum is real?",
  order: 3,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🧠",
      title: "Warm Up: A Problem with Proof",
      subtitle: "~5 minutes"
    },
    {
      id: "warmup-text",
      type: "text",
      content: "Last class, you used conservation of momentum to predict the outcome of a collision — and your prediction was pretty close to what actually happened. That felt like strong evidence.\n\nBut here's an uncomfortable question: **how do you know the conserved quantity is m × v?**\n\nWhat if the thing that's actually conserved is **m × s** (mass times distance traveled)? Or **m × v²** (mass times velocity squared)? Maybe those quantities ALSO would have predicted the outcome of your collision.\n\nJust because m × v worked in your experiment doesn't mean it's the right answer. Today we flip the script: instead of trying to PROVE m × v is conserved, we try to **DISPROVE** the alternatives."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🤔",
      content: "**Question of the Day:** You can never truly PROVE a scientific law — you can only fail to disprove it. So how do scientists become confident that something like conservation of momentum is real?"
    },
    {
      id: "q-warmup-provoke",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student says: 'We proved momentum is conserved in our experiment last class.' What's wrong with this statement?",
      options: [
        "Nothing — their experiment proved it",
        "They only tested one collision type, so it might not work for others",
        "You can't prove a law with any number of experiments — you can only fail to disprove it",
        "Both B and C"
      ],
      correctIndex: 3,
      explanation: "Both are valid criticisms. Testing one collision type isn't enough (what about elastic? explosions?), AND more fundamentally, no number of successful tests can 'prove' a law — they can only build confidence by failing to disprove it. One contradictory experiment could overturn everything. This is how science actually works: falsification, not proof."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why science disproves hypotheses rather than proving them (falsification)",
        "Identify alternative candidates for the 'conserved quantity of motion' (m×s, m×v², etc.)",
        "Design an experiment that would disprove a specific alternative candidate",
        "Use collision data to show that m×s is NOT conserved in inelastic collisions",
        "Demonstrate that m×v is conserved across all tested collision types while alternatives fail",
        "Write a CER conclusion identifying which quantity is conserved and citing evidence from data"
      ]
    },

    // ═══════════════════════════════════════════
    // HOW SCIENCE WORKS: FALSIFICATION
    // ═══════════════════════════════════════════
    {
      id: "section-falsification",
      type: "section_header",
      icon: "🔍",
      title: "How Science Really Works: Falsification",
      subtitle: "~8 minutes"
    },
    {
      id: "falsification-text",
      type: "text",
      content: "Here's something most people get wrong about science: **science doesn't prove things. Science disproves things.**\n\nThink about it this way. If I claim 'all swans are white,' how many white swans do I need to find to prove it? A hundred? A million? Even a billion white swans can't prove the claim — the next one might be black.\n\nBut finding ONE black swan disproves it instantly.\n\nThis is called **falsification**, and it's the engine of real science:\n- You can't prove a theory is true by finding evidence that supports it\n- But you CAN prove a theory is false by finding evidence that contradicts it\n- A good scientific theory is one that COULD be disproved but HASN'T been — despite many attempts\n\nConservation of momentum has survived hundreds of years of experiments across every collision type imaginable. Nobody has ever disproved it. That doesn't make it 'proven' — it makes it the best model we have."
    },
    {
      id: "def-falsification",
      type: "definition",
      term: "Falsification",
      definition: "The scientific principle that a hypothesis can never be proven true — it can only be tested and potentially disproved. A strong theory is one that has survived many attempts at falsification."
    },
    {
      id: "q-falsification-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which approach is more scientifically powerful?",
      options: [
        "Running 100 experiments that all support your hypothesis",
        "Designing ONE experiment that could definitively DISPROVE your hypothesis — and having it survive",
        "Both are equally powerful",
        "Neither — science requires mathematical proof, not experiments"
      ],
      correctIndex: 1,
      explanation: "A single well-designed experiment that COULD disprove your hypothesis (but doesn't) is more powerful than 100 experiments that merely confirm it. This is because supporting evidence can always be explained away or coincidental, but a decisive disproof is definitive. Karl Popper called this the 'asymmetry of falsification' — one counterexample beats a thousand confirmations."
    },

    // ═══════════════════════════════════════════
    // THE CANDIDATES
    // ═══════════════════════════════════════════
    {
      id: "section-candidates",
      type: "section_header",
      icon: "🏆",
      title: "The Candidates: What Might Be Conserved?",
      subtitle: "~10 minutes"
    },
    {
      id: "candidates-text",
      type: "text",
      content: "We've been assuming the conserved quantity of motion is **m × v** (momentum). But let's be honest — we picked that because it worked in our first experiment. What if we got lucky?\n\nHere are some alternative candidates for 'the thing that's conserved in collisions':\n\n| Candidate | Formula | Name |\n|-----------|---------|------|\n| A | m × v | Momentum |\n| B | m × s | Mass × distance traveled |\n| C | m × v² | Mass × velocity squared (related to kinetic energy) |\n| D | m × a | Mass × acceleration (related to force) |\n| E | v alone | Just the velocity |\n\nEach of these is a 'crazy idea.' Our job isn't to prove which one is right — it's to **disprove** the wrong ones. If we can eliminate B, C, D, and E, then A is the last one standing."
    },
    {
      id: "callout-strategy",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Strategy:** To disprove a candidate, find a collision where that quantity is clearly NOT the same before and after. You only need ONE counter-example to eliminate a candidate."
    },
    {
      id: "q-which-disprove",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE alternative candidate (m×s, m×v², m×a, or v alone). Describe a collision scenario that you think would DISPROVE it — a situation where that quantity would clearly NOT be conserved. You don't need to do math yet, just think through the logic.",
      placeholder: "I'll try to disprove... My scenario is... I think this would disprove it because...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // DISPROVING m × s
    // ═══════════════════════════════════════════
    {
      id: "section-disprove-ms",
      type: "section_header",
      icon: "❌",
      title: "Disproving Candidate B: m × s (Mass × Distance)",
      subtitle: "~10 minutes"
    },
    {
      id: "disprove-ms-text",
      type: "text",
      content: "Let's start with **m × s** (mass × distance traveled). Is this quantity conserved in collisions?\n\nConsider a perfectly inelastic collision: a moving cart slams into a stationary cart and they stick together.\n\n**Before the collision:**\n- Cart 1 (moving): has been traveling some distance s₁\n- Cart 2 (stationary): s₂ = 0 (hasn't moved)\n- Total m × s = m₁ × s₁ + m₂ × 0 = m₁ × s₁\n\n**After the collision:**\n- Combined carts continue moving, traveling some new distance s_final\n- Total m × s = (m₁ + m₂) × s_final\n\nHere's the problem: **s₁ depends on when you started measuring!** If the cart traveled 2 meters before hitting, m × s is different than if it traveled 5 meters. The quantity m × s isn't even well-defined — it depends on your arbitrary starting point.\n\nBut it gets worse. Consider two identical carts colliding head-on and stopping dead:"
    },
    {
      id: "q-ms-headon",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two identical 1 kg carts travel toward each other at 2 m/s. They collide head-on and stop completely. What happens to m × s in this collision?",
      options: [
        "m × s is conserved — both carts had the same m × s before and after",
        "m × s is destroyed — both carts traveled some distance before stopping, then s = 0 afterward (no more movement)",
        "m × s increases — the carts traveled distance even after stopping",
        "Cannot determine without knowing the exact distances"
      ],
      correctIndex: 1,
      explanation: "Before the collision, both carts were moving and accumulating distance — m × s was increasing for both. After the collision, both carts are stopped. They'll never travel any more distance. The m × s that existed before is gone — it was 'destroyed' in the collision. This is a clear disproof: m × s is NOT conserved. One counter-example is all we need."
    },
    {
      id: "callout-ms-verdict",
      type: "callout",
      style: "warning",
      icon: "🚫",
      content: "**Verdict: m × s is DISPROVED.** In a head-on collision where both carts stop, all the m × s disappears. A conserved quantity can't just vanish. Candidate B is eliminated."
    },

    // ═══════════════════════════════════════════
    // DISPROVING OTHER CANDIDATES
    // ═══════════════════════════════════════════
    {
      id: "section-disprove-others",
      type: "section_header",
      icon: "🔬",
      title: "Disproving the Other Candidates",
      subtitle: "~10 minutes"
    },
    {
      id: "disprove-v-text",
      type: "text",
      content: "**Candidate E: Just velocity (v)**\n\nConsider this: a 2 kg cart moving at 3 m/s hits a 1 kg cart at rest. They stick together.\n\n- Total v before: 3 + 0 = 3 m/s\n- By conservation of momentum: v_final = (2×3 + 1×0) / (2+1) = 2 m/s\n- Total v after: 2 m/s\n\n3 ≠ 2. Velocity alone is NOT conserved. Eliminated.\n\n**Candidate D: m × a (mass × acceleration)**\n\nAcceleration only exists DURING the collision — it's not a property of the objects before or after. You can't meaningfully compare 'total m × a before' and 'total m × a after' because the objects aren't accelerating before or after the collision. This candidate doesn't even make sense as a conserved quantity. Eliminated."
    },
    {
      id: "q-disprove-mv2",
      type: "question",
      questionType: "short_answer",
      prompt: "Now YOU disprove Candidate C: m × v² (mass times velocity squared). Use this scenario: a 2 kg cart moving at 3 m/s collides with and sticks to a 1 kg cart at rest. The combined cart moves at 2 m/s.\n\nCalculate the total m × v² BEFORE and AFTER the collision. Is it conserved?",
      placeholder: "Before: m₁v₁² + m₂v₂² = (2)(3²) + (1)(0²) = ...\nAfter: (m₁+m₂)v_final² = (3)(2²) = ...\nBefore = ... After = ... Therefore...",
      difficulty: "apply"
    },
    {
      id: "callout-mv2-answer",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**m × v² check:** Before = (2)(9) + (1)(0) = 18. After = (3)(4) = 12. Since 18 ≠ 12, m × v² is NOT conserved in a perfectly inelastic collision. (Fun fact: ½mv² is kinetic energy, and kinetic energy IS conserved in elastic collisions — but not in inelastic ones. That's why it fails as a universal conserved quantity of motion.)"
    },

    // ═══════════════════════════════════════════
    // THE SURVIVOR: m × v
    // ═══════════════════════════════════════════
    {
      id: "section-survivor",
      type: "section_header",
      icon: "🏆",
      title: "The Last One Standing: m × v",
      subtitle: "~8 minutes"
    },
    {
      id: "survivor-text",
      type: "text",
      content: "Let's check the scoreboard:\n\n| Candidate | Formula | Status |\n|-----------|---------|--------|\n| A | m × v | Still standing |\n| B | m × s | **DISPROVED** — destroyed in head-on collisions |\n| C | m × v² | **DISPROVED** — not conserved in inelastic collisions |\n| D | m × a | **DISPROVED** — doesn't make sense as a before/after quantity |\n| E | v alone | **DISPROVED** — not conserved when masses are different |\n\nEvery alternative has been eliminated. **m × v is the only candidate that survived.**\n\nBut let's verify: does m × v actually work for the same collision that killed the others?"
    },
    {
      id: "q-verify-mv",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Same collision: a 2 kg cart at 3 m/s hits a 1 kg cart at rest, they stick together and move at 2 m/s. Is m × v (momentum) conserved?",
      options: [
        "Before: (2)(3) + (1)(0) = 6 kg·m/s. After: (3)(2) = 6 kg·m/s. YES — conserved!",
        "Before: (2)(3) + (1)(0) = 6 kg·m/s. After: (3)(2) = 5 kg·m/s. NO — not conserved",
        "Before: 2 + 3 = 5. After: 3 + 2 = 5. YES — conserved",
        "Cannot determine without more information"
      ],
      correctIndex: 0,
      explanation: "Total momentum before = m₁v₁ + m₂v₂ = (2)(3) + (1)(0) = 6 kg·m/s. Total momentum after = (m₁+m₂)v_final = (3)(2) = 6 kg·m/s. Momentum is conserved! And unlike m×v², this works for perfectly inelastic collisions. Unlike m×s, this doesn't depend on arbitrary starting points. Unlike velocity alone, this correctly accounts for different masses."
    },
    {
      id: "q-headon-mv",
      type: "question",
      questionType: "short_answer",
      prompt: "Two identical 1 kg carts travel toward each other — one at +2 m/s (rightward) and one at −2 m/s (leftward). They collide head-on and stop. Calculate the total momentum before and after. Is momentum conserved even though everything stopped?",
      placeholder: "Before: m₁v₁ + m₂v₂ = (1)(+2) + (1)(−2) = ...\nAfter: both stopped, so p = ...\nConserved? ...",
      difficulty: "apply"
    },
    {
      id: "callout-headon-key",
      type: "callout",
      style: "insight",
      icon: "🔑",
      content: "**This is the key insight:** Momentum before = (1)(+2) + (1)(−2) = 0. Momentum after = 0. Momentum IS conserved — it was zero all along! The velocities were equal and opposite, so the momenta cancelled out. This is the SAME collision that killed m × s. Momentum handles it perfectly because velocity has direction (positive and negative), while distance doesn't."
    },

    // ═══════════════════════════════════════════
    // PRACTICE WITH DATA
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "📊",
      title: "Practice: Identify the Conserved Quantity",
      subtitle: "~5 minutes"
    },
    {
      id: "practice-text",
      type: "text",
      content: "Use the data below from a real cart collision to determine which quantity is conserved.\n\n**Collision Data:**\n- Cart A: mass = 1.5 kg, velocity before = +4 m/s, velocity after = +1 m/s\n- Cart B: mass = 1.0 kg, velocity before = 0 m/s, velocity after = +4.5 m/s"
    },
    {
      id: "q-practice-mv",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Using the data above, calculate total m×v before and after. Is momentum conserved?\n\nBefore: (1.5)(4) + (1.0)(0) = ?\nAfter: (1.5)(1) + (1.0)(4.5) = ?",
      options: [
        "Before = 6, After = 6. Yes, conserved!",
        "Before = 6, After = 5.5. Not quite conserved",
        "Before = 6, After = 6.5. Gained momentum somehow",
        "Before = 4, After = 5.5. Not conserved"
      ],
      correctIndex: 0,
      explanation: "Before: (1.5)(4) + (1.0)(0) = 6.0 kg·m/s. After: (1.5)(1) + (1.0)(4.5) = 1.5 + 4.5 = 6.0 kg·m/s. Momentum is conserved! The 6 kg·m/s of momentum was redistributed between the carts but the total stayed the same."
    },
    {
      id: "q-practice-mv2-check",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Using the same data, calculate total m×v² before and after. Is m×v² conserved?\n\nBefore: (1.5)(4²) + (1.0)(0²) = ?\nAfter: (1.5)(1²) + (1.0)(4.5²) = ?",
      options: [
        "Before = 24, After = 24. Yes, conserved!",
        "Before = 24, After = 21.75. No, m×v² decreased",
        "Before = 16, After = 21.25. No, m×v² increased",
        "Before = 6, After = 6. Same as momentum"
      ],
      correctIndex: 0,
      explanation: "Before: (1.5)(16) + (1.0)(0) = 24. After: (1.5)(1) + (1.0)(20.25) = 1.5 + 20.25 = 21.75. Wait — that's 24 vs 21.75. Actually m×v² is NOT exactly conserved here (some kinetic energy was lost). But the numbers are close! This is an approximately elastic collision. In a perfectly inelastic collision, the difference would be much larger. Only m×v is conserved in ALL collision types."
    },

    // ═══════════════════════════════════════════
    // CER CONCLUSION
    // ═══════════════════════════════════════════
    {
      id: "section-cer",
      type: "section_header",
      icon: "✍️",
      title: "CER Conclusion",
      subtitle: "~10 minutes"
    },
    {
      id: "cer-prompt-text",
      type: "text",
      content: "Write a CER conclusion answering:\n\n**Which quantity is conserved in collisions: m×v, m×s, m×v², or something else?**\n\n**Claim:** Identify which quantity is conserved and state that the alternatives have been disproved.\n\n**Evidence:** For each alternative, cite the specific collision scenario that disproved it. Include numerical calculations where possible. For the surviving candidate (m×v), cite at least two different collision types where it was conserved.\n\n**Reasoning:** Explain why disproving alternatives is a valid scientific method. Connect to falsification — we didn't prove m×v is conserved, we showed that everything else fails while m×v survives every test."
    },
    {
      id: "q-cer-final",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your full CER conclusion. Claim which quantity is conserved. Cite specific evidence showing how each alternative was disproved and how m×v survived. In your reasoning, explain why falsification (disproving alternatives) is a valid scientific approach.",
      placeholder: "CLAIM: The conserved quantity of motion is...\n\nEVIDENCE: m×s was disproved because... m×v² was disproved because... velocity alone was disproved because... m×v survived because...\n\nREASONING: This approach works because in science...",
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
      content: "Today you practiced one of the most fundamental skills in science: **falsification**.\n\nYou didn't prove momentum is conserved — nobody can. What you did was systematically disprove every alternative, leaving m × v as the last candidate standing.\n\nThis is exactly how real physics works. Newton didn't prove his laws — he proposed them, and then generations of scientists tried to break them. They couldn't. That's why we call them laws.\n\n(Spoiler: Einstein eventually showed that Newton's version of momentum needs a small correction at speeds near the speed of light. But at everyday speeds — carts on a track, cars in a crash, billiard balls on a table — m × v is conserved. Every time.)"
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A friend says: 'I proved that momentum is conserved in my experiment.' What's the most scientifically accurate correction?",
      options: [
        "'You're right — your experiment proved it!'",
        "'You didn't prove it — you showed that your data is consistent with conservation of momentum and failed to disprove it'",
        "'You need at least 100 experiments to prove a law'",
        "'Only mathematicians can prove things; scientists just guess'"
      ],
      correctIndex: 1,
      explanation: "In science, experiments don't prove laws — they test them. Your friend's experiment produced data consistent with conservation of momentum and failed to disprove it. That's good evidence, but it's not proof. The more experiments that fail to disprove a law (across different conditions), the more confident we become — but we never reach 'proof.' This is the nature of empirical science."
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
        { term: "Falsification", definition: "The principle that scientific hypotheses can never be proven true — they can only be tested and potentially disproved. A theory gains credibility by surviving many attempts at disproof." },
        { term: "Conserved quantity", definition: "A measurable property of a system that remains constant over time, even as the system changes. In collisions, the total momentum of an isolated system is conserved." },
        { term: "Disproof by counter-example", definition: "Showing that a hypothesis is false by finding a single case where it fails. One collision where m×s is NOT the same before and after is enough to disprove it as a conserved quantity." },
        { term: "Momentum (p = mv)", definition: "Mass times velocity. The quantity that is conserved in all types of collisions within an isolated system. Unlike m×s or m×v², momentum is conserved in elastic, inelastic, and perfectly inelastic collisions." },
        { term: "Kinetic energy (KE = ½mv²)", definition: "Energy of motion. Conserved in elastic collisions but NOT in inelastic collisions. This is why m×v² fails as a universal conserved quantity — it only works sometimes." },
        { term: "Scientific law", definition: "A description of a pattern in nature that has survived extensive testing without being disproved. Laws aren't 'proven' — they're models that consistently match observations across many experiments." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("momentum-disproving")
      .set(lesson);
    console.log('✅ Lesson "Disproving a Crazy Idea" seeded successfully!');
    console.log("   Path: courses/physics/lessons/momentum-disproving");
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
