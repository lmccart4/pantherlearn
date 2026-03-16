// seed-electrostatics-assessment.js
// Creates "Electrostatics Review & Assessment" lesson (Electrostatics Unit, Lesson 5)
// Run: node scripts/seed-electrostatics-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electrostatics Review & Assessment",
  questionOfTheDay: "How do charge, force, fields, and voltage all connect? Can you trace the thread from a single proton all the way to a working battery?",
  course: "Physics",
  unit: "Electrostatics",
  order: 5,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // INTRO
    // ═══════════════════════════════════════════
    {
      id: "section-intro",
      type: "section_header",
      icon: "📝",
      title: "Electrostatics Unit Assessment",
      subtitle: "~45 minutes · 19 questions + bonus"
    },
    {
      id: "b-objectives",
      type: "objectives",
      items: [
        "Demonstrate understanding of charge interactions, conservation, and charging methods",
        "Apply Coulomb's Law to calculate electric force and reason about proportional relationships",
        "Interpret electric field lines and describe field behavior",
        "Calculate voltage and work done on charges, and explain energy relationships",
        "Connect electrostatics concepts to prior physics units and real-world phenomena"
      ]
    },
    {
      id: "b-intro",
      type: "text",
      content: "This assessment covers the full Electrostatics unit:\n- Charge interactions & conservation\n- Coulomb's Law\n- Electric fields\n- Voltage & electrical potential energy\n\nRead each question carefully. For multiple choice, select the **best** answer. For written responses, use specific vocabulary and show your reasoning."
    },
    {
      id: "callout-instructions",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Tips:** Use vocabulary from the unit (charge, coulomb, field, potential, etc.). Show your work on calculations. If you're unsure, eliminate wrong answers first. There is a bonus question at the end."
    },

    // ═══════════════════════════════════════════
    // SECTION 1: CHARGE INTERACTIONS & CONSERVATION (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-1",
      type: "section_header",
      icon: "⚡",
      title: "Section 1: Charge Interactions & Conservation",
      subtitle: "4 questions · ~25%"
    },
    {
      id: "b-s1-intro",
      type: "text",
      content: "These questions test your understanding of how charged objects interact, the different methods of charging, and the law of conservation of charge."
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A positively charged rod is brought near a small, neutral pith ball hanging from a string. The pith ball is first attracted to the rod, touches it, then flies away. Why does the pith ball repel after touching the rod?",
      options: [
        "The pith ball became negatively charged by contact",
        "The pith ball gained positive charge by conduction and now repels the positive rod",
        "The rod lost all its charge when they touched",
        "Gravity pulled the pith ball away from the rod"
      ],
      correctIndex: 1,
      explanation: "Initially, the neutral pith ball is attracted by induction (charge separation). When it touches the positive rod, charge transfers by conduction — the pith ball gains positive charge. Now both are positive, so they repel (like charges repel).",
      difficulty: "understand"
    },
    {
      id: "q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student rubs a balloon on her hair. The balloon picks up electrons from her hair. Which statement is true?",
      options: [
        "Charge was created on the balloon",
        "The balloon is now negative, and her hair is now positive — total charge is conserved",
        "Both the balloon and her hair become negatively charged",
        "The balloon gained protons from her hair"
      ],
      correctIndex: 1,
      explanation: "Charging by friction transfers electrons from one material to another. The balloon gains electrons (becomes negative) and her hair loses electrons (becomes positive). No charge is created or destroyed — this is the law of conservation of charge.",
      difficulty: "understand"
    },
    {
      id: "q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which charging method does NOT require direct contact between objects?",
      options: [
        "Charging by friction",
        "Charging by conduction",
        "Charging by induction",
        "All charging methods require direct contact"
      ],
      correctIndex: 2,
      explanation: "Charging by induction uses a nearby charged object to redistribute charges in a conductor — without ever touching it. The conductor is then grounded to remove one type of charge, leaving it with a net charge. Friction and conduction both require direct contact.",
      difficulty: "remember"
    },
    {
      id: "q4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When a negatively charged rod is brought near a metal sphere (without touching), the electrons in the sphere move to the far side. This happens because:",
      options: [
        "Metal is an insulator and traps charge",
        "Electrons in the conductor are free to move and are repelled by the negative rod",
        "Protons in the metal move toward the rod",
        "The metal sphere gains extra electrons from the air"
      ],
      correctIndex: 1,
      explanation: "In conductors, electrons are free to move. The negative rod repels the sphere's electrons to the far side (like charges repel). This charge separation by a nearby object is called polarization. Protons are fixed in the nucleus and cannot move through the material.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: COULOMB'S LAW (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-2",
      type: "section_header",
      icon: "🔢",
      title: "Section 2: Coulomb's Law",
      subtitle: "5 questions · ~25%"
    },
    {
      id: "b-s2-intro",
      type: "text",
      content: "These questions test your ability to apply Coulomb's Law (F = kq₁q₂/r²) to calculate electric force and reason about how force changes when charge or distance change.\n\n**Reference:** k = 9.0 × 10⁹ N·m²/C²"
    },
    {
      id: "q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges of +3 μC and -5 μC are separated by 0.2 m. What is the magnitude of the electric force between them?\n\n(k = 9.0 × 10⁹ N·m²/C², 1 μC = 10⁻⁶ C)",
      options: [
        "3.38 N",
        "0.675 N",
        "33.75 N",
        "6.75 N"
      ],
      correctIndex: 0,
      explanation: "F = kq₁q₂/r² = (9.0 × 10⁹)(3 × 10⁻⁶)(5 × 10⁻⁶) / (0.2)² = (9.0 × 10⁹)(15 × 10⁻¹²) / 0.04 = 0.135 / 0.04 = 3.375 N ≈ 3.38 N. The force is attractive (opposite charges) but the magnitude is 3.38 N.",
      difficulty: "apply"
    },
    {
      id: "q6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges experience an electric force F. If you DOUBLE one of the charges AND halve the distance between them, what is the new force?",
      options: [
        "F (unchanged)",
        "2F",
        "4F",
        "8F"
      ],
      correctIndex: 3,
      explanation: "Start with F = kq₁q₂/r². Double one charge: force × 2. Halve the distance: since r is squared, (r/2)² = r²/4, so force × 4. Combined: 2 × 4 = 8F. Proportional reasoning is key — you don't need to plug in numbers.",
      difficulty: "apply"
    },
    {
      id: "q7",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How does the gravitational force between two protons compare to the electric force between them?",
      options: [
        "Gravitational force is much stronger",
        "They are approximately equal",
        "Electric force is much stronger — roughly 10³⁶ times larger",
        "It depends on the distance between them"
      ],
      correctIndex: 2,
      explanation: "The electric force between two protons is approximately 10³⁶ times stronger than the gravitational force between them. Both follow inverse-square laws (1/r²), so the ratio stays the same at any distance. Gravity is incredibly weak compared to the electromagnetic force at the particle level.",
      difficulty: "understand"
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "Two identical charges of +4 μC are separated by 0.5 m. Calculate the electric force between them. Show your work using F = kq₁q₂/r².\n\n(k = 9.0 × 10⁹ N·m²/C²)",
      placeholder: "F = kq₁q₂/r² = ...",
      difficulty: "apply"
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "**Challenge:** Three charges are arranged in a line: +2 μC at position 0 m, -3 μC at position 0.4 m, and +1 μC at position 1.0 m. What is the net force on the middle charge (-3 μC)? State the direction.\n\n(k = 9.0 × 10⁹ N·m²/C²)",
      placeholder: "Force from left charge: ... Force from right charge: ... Net force: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: ELECTRIC FIELDS (~20%)
    // ═══════════════════════════════════════════
    {
      id: "section-3",
      type: "section_header",
      icon: "🧭",
      title: "Section 3: Electric Fields",
      subtitle: "4 questions · ~20%"
    },
    {
      id: "b-s3-intro",
      type: "text",
      content: "These questions test your understanding of electric field lines, field direction, and field strength."
    },
    {
      id: "q10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Electric field lines around an isolated positive charge point:",
      options: [
        "Inward toward the charge",
        "Outward away from the charge",
        "In circles around the charge",
        "Parallel to each other"
      ],
      correctIndex: 1,
      explanation: "Electric field lines point in the direction a positive test charge would move. A positive test charge would be repelled by a positive source charge, so the field lines point outward (radially away). For a negative charge, field lines point inward.",
      difficulty: "remember"
    },
    {
      id: "q11",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In a diagram of electric field lines, the field is STRONGEST where:",
      options: [
        "Field lines are farthest apart",
        "Field lines are closest together",
        "Field lines curve the most",
        "There are no field lines"
      ],
      correctIndex: 1,
      explanation: "The density of field lines indicates field strength. Where lines are packed closely together, the field is stronger. Where they spread apart, the field is weaker. This is why the field is strongest near a point charge and gets weaker with distance.",
      difficulty: "understand"
    },
    {
      id: "q12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why can electric field lines never cross?",
      options: [
        "They would cancel each other out",
        "At any point in space, the field can only point in ONE direction — crossing would mean two directions at the same point",
        "They are always parallel",
        "Electric fields are too weak to intersect"
      ],
      correctIndex: 1,
      explanation: "The electric field at any point is a single vector — it has one magnitude and one direction. If field lines crossed, that point would have two different field directions, which is physically impossible. The field is the net result of all charges, and it produces one unique direction at every point.",
      difficulty: "understand"
    },
    {
      id: "q13",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Between two large, parallel, oppositely charged plates, the electric field is:",
      options: [
        "Zero everywhere between the plates",
        "Strongest near the edges and weakest in the middle",
        "Approximately uniform — same strength and direction everywhere between the plates",
        "Circular, looping from one plate to the other"
      ],
      correctIndex: 2,
      explanation: "Parallel plates with equal and opposite charges create a nearly uniform electric field between them. The field lines are straight, parallel, evenly spaced, and point from the positive plate to the negative plate. This is why parallel plates are used in many physics applications — they create a constant, predictable field.",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // SECTION 4: VOLTAGE & ENERGY (~20%)
    // ═══════════════════════════════════════════
    {
      id: "section-4",
      type: "section_header",
      icon: "🔋",
      title: "Section 4: Voltage & Energy",
      subtitle: "4 questions · ~20%"
    },
    {
      id: "b-s4-intro",
      type: "text",
      content: "These questions test your understanding of voltage (electric potential difference), electrical potential energy, and the work done on charges."
    },
    {
      id: "q14",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Voltage (electric potential difference) is defined as:",
      options: [
        "The total charge flowing through a wire",
        "The electric potential energy per unit charge (V = EPE/q)",
        "The force on a charged particle",
        "The number of electrons in a material"
      ],
      correctIndex: 1,
      explanation: "Voltage (V) = Electric Potential Energy / charge = EPE/q. It measures how much potential energy each coulomb of charge has. A 9V battery gives 9 joules of energy to every coulomb of charge that passes through it. Units: volts (V) = joules per coulomb (J/C).",
      difficulty: "remember"
    },
    {
      id: "q15",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A charge of 0.5 C moves through a potential difference of 12 V. How much work is done on the charge?",
      options: [
        "0.5 J",
        "6.0 J",
        "12 J",
        "24 J"
      ],
      correctIndex: 1,
      explanation: "W = qΔV = (0.5 C)(12 V) = 6.0 J. Work equals charge times voltage. This is the energy transferred to (or from) the charge as it moves through the potential difference.",
      difficulty: "apply"
    },
    {
      id: "q16",
      type: "question",
      questionType: "short_answer",
      prompt: "A positive charge is released from rest in a uniform electric field. Describe its motion: which direction does it move (toward higher or lower voltage), what happens to its speed, and what energy transformation occurs?",
      placeholder: "The positive charge moves toward... Its speed... Energy transforms from...",
      difficulty: "understand"
    },
    {
      id: "q17",
      type: "question",
      questionType: "short_answer",
      prompt: "A 9-volt battery is connected in a circuit. In terms of energy, explain what the \"9 volts\" actually means. Use the equation V = EPE/q in your answer.",
      placeholder: "9 volts means...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 5: CONNECTIONS & REASONING (~10%)
    // ═══════════════════════════════════════════
    {
      id: "section-5",
      type: "section_header",
      icon: "🧠",
      title: "Section 5: Connections & Reasoning",
      subtitle: "2 questions · ~10%"
    },
    {
      id: "b-s5-intro",
      type: "text",
      content: "These questions ask you to connect electrostatics to other physics concepts and to the real world."
    },
    {
      id: "q18",
      type: "question",
      questionType: "short_answer",
      prompt: "Coulomb's Law (F = kq₁q₂/r²) and Newton's Law of Universal Gravitation (F = Gm₁m₂/r²) have very similar structures. Identify TWO similarities and TWO differences between these laws.",
      placeholder: "Similarities: 1) ... 2) ... Differences: 1) ... 2) ...",
      difficulty: "analyze"
    },
    {
      id: "q19",
      type: "question",
      questionType: "short_answer",
      prompt: "**Bonus:** Explain how lightning works using at least THREE of the following vocabulary words: charge, induction, electric field, discharge, potential difference, conductor, insulator.",
      placeholder: "Lightning occurs when...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // CONFIDENCE CHECK
    // ═══════════════════════════════════════════
    {
      id: "section-confidence",
      type: "section_header",
      icon: "📊",
      title: "Confidence Check",
      subtitle: "Self-assessment"
    },
    {
      id: "q-confidence",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How prepared did you feel for this assessment?",
      options: [
        "Very prepared — I understood most of the material",
        "Somewhat prepared — I knew the basics but struggled with some topics",
        "Not very prepared — I need to review before the next unit",
        "I guessed on most questions"
      ],
      correctIndex: 0,
      allCorrect: true,
      explanation: "This is a self-assessment — all answers are accepted. Use your response to guide your review before the next unit.",
      difficulty: "reflect"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("electrostatics-assessment")
      .set(lesson);
    console.log('✅ Lesson "Electrostatics Review & Assessment" seeded successfully!');
    console.log("   Path: courses/physics/lessons/electrostatics-assessment");
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
