// seed-electrostatics-coulombs-law.js
// Creates "Coulomb's Law" lesson (Electrostatics Unit, Lesson 2)
// Run: node scripts/seed-electrostatics-coulombs-law.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Coulomb's Law",
  questionOfTheDay: "Two charged particles are 1 meter apart and feel a force of 36 N. You move them to 2 meters apart. Without calculating — what do you think happens to the force? What if you move them to 3 meters apart?",
  course: "Physics",
  unit: "Electrostatics",
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
      icon: "⚡",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Two charged particles are 1 meter apart and feel a force of 36 N. You move them to 2 meters apart. Without calculating — what do you think happens to the force? What if you move them to 3 meters apart?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Make a prediction: when you double the distance between two charged objects, what happens to the electric force between them? Does it get cut in half? Drop to a quarter? Something else? Explain your reasoning.",
      placeholder: "I think the force will...",
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
        "State Coulomb's Law and identify each variable",
        "Calculate the electrostatic force between two charged objects",
        "Use proportional reasoning to predict how changes in charge or distance affect force",
        "Compare Coulomb's Law to Newton's Law of Gravitation"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION — COULOMB'S LAW
    // ═══════════════════════════════════════════
    {
      id: "section-law",
      type: "section_header",
      icon: "📚",
      title: "Coulomb's Law",
      subtitle: "~12 minutes"
    },
    {
      id: "b-history",
      type: "text",
      content: "In 1785, French physicist Charles-Augustin de Coulomb figured out exactly how to calculate the force between two charged objects. He used a device called a **torsion balance** — essentially a very sensitive scale that could measure tiny twisting forces — to determine how the electric force depends on charge and distance.\n\nWhat he found was elegant and powerful:"
    },
    {
      id: "callout-formula",
      type: "callout",
      style: "insight",
      icon: "📐",
      content: "**Coulomb's Law:**\n\n**F = k × |q₁ × q₂| / r²**\n\n- **F** = electrostatic force (in Newtons)\n- **k** = Coulomb's constant = **8.99 × 10⁹ N·m²/C²**\n- **q₁** and **q₂** = the two charges (in Coulombs)\n- **r** = distance between the centers of the charges (in meters)\n- The absolute value bars mean we use the magnitudes of the charges — the formula gives us the *strength* of the force. The sign of the charges tells us the *direction* (attract or repel)."
    },
    {
      id: "b-units",
      type: "text",
      content: "### Units of Charge\n\nCharge is measured in **Coulombs (C)**, named after the same Charles Coulomb.\n\n- A single electron carries a charge of **1.6 × 10⁻¹⁹ C** — incredibly tiny\n- A single proton carries the same magnitude: **+1.6 × 10⁻¹⁹ C**\n- A typical static shock involves about **1 microcoulomb (1 μC = 10⁻⁶ C)** — that's about 6 trillion electrons\n- A lightning bolt transfers roughly **5 C** — an enormous amount of charge\n\nIn most problems, you'll work with charges in the **microcoulomb (μC)** or **nanocoulomb (nC)** range. Always convert to Coulombs before plugging into Coulomb's Law!"
    },
    {
      id: "callout-units-warning",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Common Mistake:** Forgetting to convert microcoulombs to coulombs before calculating. Remember: 1 μC = 1 × 10⁻⁶ C. If a problem says q = 3 μC, you must use q = 3 × 10⁻⁶ C in the equation."
    },
    {
      id: "q-identify-variables",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Coulomb's Law (F = kq₁q₂/r²), what does the variable 'r' represent?",
      options: [
        "The radius of each charged object",
        "The distance between the centers of the two charges",
        "The resistance of the material between them",
        "The rate at which charge flows"
      ],
      correctIndex: 1,
      explanation: "In Coulomb's Law, r is the distance between the centers of the two charged objects. It's measured in meters and appears squared in the denominator, which is what makes this an inverse square law.",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // INVERSE SQUARE LAW
    // ═══════════════════════════════════════════
    {
      id: "section-inverse-square",
      type: "section_header",
      icon: "📉",
      title: "The Inverse Square Relationship",
      subtitle: "~10 minutes"
    },
    {
      id: "b-inverse-square",
      type: "text",
      content: "The most important feature of Coulomb's Law is that distance is **squared** in the denominator. This makes the force drop off very quickly as you move charges apart.\n\nHere's the pattern:\n\n| Distance change | Force change |\n|---|---|\n| **2× the distance** | Force drops to **1/4** (1/2² = 1/4) |\n| **3× the distance** | Force drops to **1/9** (1/3² = 1/9) |\n| **4× the distance** | Force drops to **1/16** (1/4² = 1/16) |\n| **½ the distance** | Force increases to **4×** (1/(1/2)² = 4) |\n| **⅓ the distance** | Force increases to **9×** (1/(1/3)² = 9) |\n\nThis is called an **inverse square law** — the force is inversely proportional to the *square* of the distance."
    },
    {
      id: "callout-proportional",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Proportional Reasoning Shortcut:** You don't need to recalculate from scratch every time. If you know the force at one distance, you can find the force at any other distance just by using ratios. This is faster than plugging into the full equation and a skill that shows up constantly in physics."
    },
    {
      id: "q-inverse-square-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges exert a force of 100 N on each other. If the distance between them is doubled, what is the new force?",
      options: [
        "200 N",
        "50 N",
        "25 N",
        "400 N"
      ],
      correctIndex: 2,
      explanation: "When distance is doubled, force drops by 1/2² = 1/4. So the new force is 100 N × 1/4 = 25 N. This is the inverse square law in action — doubling distance doesn't halve the force, it quarters it.",
      difficulty: "apply"
    },
    {
      id: "q-inverse-square-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charged objects exert 12 N of force on each other. If you move them to one-third of their original distance, what is the new force?",
      options: [
        "4 N",
        "36 N",
        "108 N",
        "144 N"
      ],
      correctIndex: 2,
      explanation: "When distance is reduced to 1/3, force increases by (1/(1/3))² = 3² = 9 times. So the new force is 12 N × 9 = 108 N. Bringing charges closer together dramatically increases the force between them.",
      difficulty: "apply"
    },
    {
      id: "b-charge-proportionality",
      type: "text",
      content: "The force is also **directly proportional** to each charge:\n\n- Double one charge → double the force\n- Triple one charge → triple the force\n- Double *both* charges → **quadruple** the force (2 × 2 = 4)\n\nSo the full picture: force depends on both charges (linearly) and on distance (inversely squared)."
    },
    {
      id: "q-charge-change",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges exert 20 N on each other. If you triple one of the charges AND double the distance, what is the new force?",
      options: [
        "60 N",
        "30 N",
        "15 N",
        "7.5 N"
      ],
      correctIndex: 2,
      explanation: "Triple one charge → force × 3 = 60 N. Double the distance → force × 1/4 = 60/4 = 15 N. When you combine changes, multiply the effects together: 20 × 3 × (1/4) = 15 N.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // GRAVITY COMPARISON
    // ═══════════════════════════════════════════
    {
      id: "section-gravity",
      type: "section_header",
      icon: "🌍",
      title: "Coulomb's Law vs. Gravity",
      subtitle: "~5 minutes"
    },
    {
      id: "b-gravity-comparison",
      type: "text",
      content: "Coulomb's Law should look familiar — it has the exact same mathematical structure as Newton's Law of Gravitation:\n\n| Feature | Coulomb's Law | Newton's Gravitation |\n|---|---|---|\n| **Formula** | F = kq₁q₂/r² | F = Gm₁m₂/r² |\n| **Constant** | k = 8.99 × 10⁹ | G = 6.67 × 10⁻¹¹ |\n| **What interacts** | Charges (q) | Masses (m) |\n| **Direction** | Attract OR repel | Attract only |\n| **Relative strength** | Much stronger | Much weaker |\n| **Distance dependence** | Inverse square | Inverse square |\n\nBoth are inverse square laws. Both depend on two properties of the objects and the distance between them. But there are two huge differences:"
    },
    {
      id: "b-gravity-diff",
      type: "text",
      content: "**Difference 1: Electric force can repel.** Gravity only pulls — masses always attract. Electric force can push (like charges) or pull (opposite charges).\n\n**Difference 2: Electric force is VASTLY stronger.** Compare the constants: k ≈ 10⁹ vs G ≈ 10⁻¹¹. That's a factor of about 10²⁰ — the electric force between a proton and electron is about **10³⁶ times stronger** than the gravitational force between them.\n\nSo why don't we notice electric forces more than gravity in daily life? Because most objects are electrically neutral — their positive and negative charges cancel out. Gravity doesn't cancel because there's no \"negative mass.\""
    },
    {
      id: "q-comparison",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is a key difference between Coulomb's Law and Newton's Law of Gravitation?",
      options: [
        "Coulomb's Law is an inverse square law, but gravity is not",
        "Gravity depends on distance, but Coulomb's Law does not",
        "Gravitational force can only attract, while electric force can attract or repel",
        "Coulomb's Law only works at very short distances"
      ],
      correctIndex: 2,
      explanation: "Both laws are inverse square laws and both depend on distance. The key difference is that gravity only attracts (there's no negative mass), while the electric force can attract (opposite charges) or repel (like charges). Coulomb's Law works at all distances, though it's most noticeable with small charged objects.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // GUIDED PRACTICE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Guided Practice",
      subtitle: "~10 minutes"
    },
    {
      id: "b-worked-example-1",
      type: "text",
      content: "### Worked Example 1\n\n**Problem:** Two charges of +3 μC and −5 μC are separated by 0.2 m. What is the magnitude of the electrostatic force between them?\n\n**Step 1: Convert units.**\n- q₁ = 3 μC = 3 × 10⁻⁶ C\n- q₂ = 5 μC = 5 × 10⁻⁶ C (we use the magnitude)\n- r = 0.2 m\n\n**Step 2: Plug into Coulomb's Law.**\n\nF = k × |q₁ × q₂| / r²\n\nF = (8.99 × 10⁹) × (3 × 10⁻⁶) × (5 × 10⁻⁶) / (0.2)²\n\n**Step 3: Calculate.**\n\nNumerator: 8.99 × 10⁹ × 15 × 10⁻¹² = 8.99 × 15 × 10⁻³ = 134.85 × 10⁻³ = 0.13485\n\nDenominator: 0.04\n\nF = 0.13485 / 0.04 = **3.37 N**\n\nSince the charges are opposite signs, this force is **attractive**."
    },
    {
      id: "b-worked-example-2",
      type: "text",
      content: "### Worked Example 2 (Proportional Reasoning)\n\n**Problem:** Two charges exert 48 N on each other at a distance of 0.5 m. What force do they exert if the distance increases to 1.5 m?\n\n**Step 1: Find the factor of distance change.**\n\nNew distance / old distance = 1.5 / 0.5 = 3\n\nThe distance tripled.\n\n**Step 2: Apply the inverse square relationship.**\n\nForce changes by 1/(3²) = 1/9\n\n**Step 3: Calculate.**\n\nNew force = 48 N × (1/9) = **5.33 N**\n\nNo need for Coulomb's constant, no need for charge values. Proportional reasoning is a powerful shortcut!"
    },

    // ═══════════════════════════════════════════
    // PRACTICE PROBLEMS
    // ═══════════════════════════════════════════
    {
      id: "section-problems",
      type: "section_header",
      icon: "🧮",
      title: "Practice Problems",
      subtitle: "Try these on your own"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Two charges of +2 μC and +8 μC are 0.3 m apart. Calculate the electrostatic force between them. Show your work.",
      placeholder: "F = k × q₁ × q₂ / r² = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Two charges exert 200 N of force at a distance of 0.1 m. What is the force if the distance is changed to 0.4 m? Use proportional reasoning (no need for the full equation).",
      placeholder: "Distance changed by a factor of... so force changes by...",
      difficulty: "apply"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges each of magnitude q exert a force F on each other. If both charges are doubled to 2q, what is the new force?",
      options: [
        "F",
        "2F",
        "4F",
        "8F"
      ],
      correctIndex: 2,
      explanation: "Force is proportional to q₁ × q₂. If both charges double: (2q)(2q) = 4q². The force increases by a factor of 4. So the new force is 4F.",
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
      id: "b-wrapup",
      type: "text",
      content: "Let's return to the Question of the Day:\n\n> *Two charged particles are 1 meter apart and feel a force of 36 N. What happens at 2 meters? At 3 meters?*\n\n**At 2 meters:** Distance doubled → force drops to 1/4 → **36 × 1/4 = 9 N**\n\n**At 3 meters:** Distance tripled → force drops to 1/9 → **36 × 1/9 = 4 N**\n\nThe force doesn't just decrease — it plummets. That's the power of the inverse square law. Double the distance and you lose 75% of the force. Triple it and you lose nearly 89%.\n\nThis same pattern — the inverse square law — shows up everywhere in physics: gravity, light intensity, sound intensity, and now electric force."
    },

    // ═══════════════════════════════════════════
    // EXIT TICKET
    // ═══════════════════════════════════════════
    {
      id: "section-exit",
      type: "section_header",
      icon: "🎟️",
      title: "Exit Ticket",
      subtitle: "Check your understanding"
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two charges exert a force of 80 N on each other. If the distance between them is doubled, what is the new force?",
      options: [
        "160 N",
        "40 N",
        "20 N",
        "10 N"
      ],
      correctIndex: 2,
      explanation: "Doubling the distance means the force changes by 1/2² = 1/4. So the new force is 80 N × 1/4 = 20 N. Remember: it's not half — it's one quarter, because distance is squared in the denominator.",
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
      subtitle: "Terms to know"
    },
    {
      id: "b-vocab",
      type: "vocab_list",
      terms: [
        { term: "Coulomb's Law", definition: "The equation F = kq₁q₂/r² that calculates the electrostatic force between two charged objects. Force depends directly on both charges and inversely on the square of the distance." },
        { term: "Electrostatic Force", definition: "The force of attraction or repulsion between charged objects. It acts at a distance without the objects needing to touch." },
        { term: "Coulomb (C)", definition: "The SI unit of electric charge. One coulomb equals the charge of about 6.24 × 10¹⁸ electrons." },
        { term: "Coulomb's Constant (k)", definition: "The proportionality constant in Coulomb's Law, equal to 8.99 × 10⁹ N·m²/C². Its large value reflects how strong the electric force is." },
        { term: "Inverse Square Law", definition: "A mathematical relationship where a quantity decreases proportionally to the square of the distance. Double the distance → one-quarter the effect." },
        { term: "Proportional Reasoning", definition: "A problem-solving strategy where you use ratios to determine how a change in one variable affects another, without plugging into the full equation." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("electrostatics-coulombs-law")
      .set(lesson);
    console.log('✅ Lesson "Coulomb\'s Law" seeded successfully!');
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
