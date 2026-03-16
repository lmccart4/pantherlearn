// seed-coulombs-law.js
// Physics — Electrostatics Unit, Lesson 2 (order: 2)
// "Coulomb's Law"
// Run: node scripts/seed-coulombs-law.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "State Coulomb's Law and identify each variable",
      "Calculate the electrostatic force between two charged objects",
      "Predict how changing charge or distance affects the force",
      "Compare Coulomb's Law to Newton's Law of Gravitation",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Coulomb's Law and Newton's Law of Gravitation have the same mathematical structure. If electricity and gravity follow the same pattern, why don't you feel an electric pull toward the Earth?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Last class you learned that like charges repel and opposite charges attract. But HOW STRONG is that force? What do you think would make the electric force between two charges stronger or weaker? List at least two factors.",
    difficulty: "understand",
  },

  // ─── COULOMB'S LAW ─────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Coulomb's Law",
    subtitle: "~12 minutes",
  },

  {
    id: uid(), type: "text",
    content: "In 1785, Charles-Augustin de Coulomb used a torsion balance to measure the force between charged objects. He discovered a beautifully simple pattern:\n\n## F = k × (q₁ × q₂) / r²\n\nWhere:\n- **F** = electrostatic force (newtons, N)\n- **k** = Coulomb's constant = 8.99 × 10⁹ N·m²/C² (often rounded to 9 × 10⁹)\n- **q₁** = charge of object 1 (coulombs, C)\n- **q₂** = charge of object 2 (coulombs, C)\n- **r** = distance between the centers of the charges (meters, m)\n\nThe force is **directly proportional** to each charge and **inversely proportional** to the square of the distance.",
  },

  {
    id: uid(), type: "definition",
    term: "Coulomb's Law",
    definition: "The electrostatic force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them. F = kq₁q₂/r².",
  },

  {
    id: uid(), type: "definition",
    term: "Coulomb's Constant (k)",
    definition: "k = 8.99 × 10⁹ N·m²/C². This enormous number reflects how strong the electric force is — much stronger than gravity at the atomic scale.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Coulomb's Law vs. Newton's Law of Gravitation — side by side:**\n\n| | Coulomb's Law | Newton's Gravity |\n|---|---|---|\n| Formula | F = kq₁q₂/r² | F = Gm₁m₂/r² |\n| Constant | k = 9 × 10⁹ | G = 6.67 × 10⁻¹¹ |\n| What creates it | Charge | Mass |\n| Can it repel? | **Yes** (like charges) | No (always attracts) |\n| Relative strength | ~10³⁶ times stronger | Very weak |\n\nSame mathematical structure. But k is about 10²⁰ times bigger than G — electric force is astronomically stronger than gravity.",
  },

  {
    id: uid(), type: "text",
    content: "**Important details:**\n\n- If F is **positive**, the force is **repulsive** (like charges)\n- If F is **negative**, the force is **attractive** (opposite charges)\n- For calculations, we usually use the **magnitude** (absolute value) and state attract/repel separately\n- Charges are often given in **microcoulombs (μC)**: 1 μC = 10⁻⁶ C\n- The force on q₁ from q₂ is **equal and opposite** to the force on q₂ from q₁ (Newton's Third Law still applies!)",
  },

  // ─── WORKED EXAMPLE ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✏️",
    title: "Worked Example",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Problem:** Two charges of +3 μC and −5 μC are 0.2 m apart. Find the force between them.\n\n**Step 1: Convert units**\n- q₁ = +3 μC = 3 × 10⁻⁶ C\n- q₂ = −5 μC = 5 × 10⁻⁶ C (use magnitude for calculation)\n- r = 0.2 m\n\n**Step 2: Plug into Coulomb's Law**\nF = kq₁q₂/r²\nF = (9 × 10⁹)(3 × 10⁻⁶)(5 × 10⁻⁶) / (0.2)²\nF = (9 × 10⁹)(15 × 10⁻¹²) / 0.04\nF = (135 × 10⁻³) / 0.04\nF = **3.375 N, attractive** (opposite charges)\n\nThat's roughly the weight of a small apple — from charges you can't even see!",
  },

  // ─── CALCULATOR ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "Coulomb's Law Calculator",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "calculator",
    title: "Electrostatic Force Calculator",
    description: "Enter two charges (in microcoulombs) and the distance between them. The calculator gives the magnitude of the force.\n\nF = k × q₁ × q₂ / r²",
    formula: "(9e9 * q1 * 1e-6 * q2 * 1e-6) / (r * r)",
    showFormula: true,
    inputs: [
      { name: "q1", label: "Charge 1 (q₁)", unit: "μC" },
      { name: "q2", label: "Charge 2 (q₂)", unit: "μC" },
      { name: "r", label: "Distance between charges", unit: "m" },
    ],
    output: { label: "Electrostatic Force", unit: "N", decimals: 4 },
  },

  {
    id: "q-calc-practice", type: "question",
    questionType: "short_answer",
    prompt: "Use the calculator above to solve these. Record your answers AND state whether the force is attractive or repulsive:\n\n1. q₁ = +2 μC, q₂ = +2 μC, r = 0.1 m\n2. q₁ = +4 μC, q₂ = −6 μC, r = 0.3 m\n3. q₁ = +1 μC, q₂ = +1 μC, r = 1.0 m\n4. Same as #3 but r = 0.5 m. What happened to the force when you halved the distance?",
    difficulty: "apply",
  },

  // ─── PROPORTIONAL REASONING ────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📊",
    title: "How the Force Changes",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Coulomb's Law has two key proportional relationships:\n\n**1. Force ∝ charge (direct)**\n- Double one charge → force doubles\n- Triple one charge → force triples\n- Double BOTH charges → force quadruples\n\n**2. Force ∝ 1/r² (inverse square)**\n- Double the distance → force drops to **¼**\n- Triple the distance → force drops to **1/9**\n- Halve the distance → force increases **4×**\n\nThe inverse square law is the same pattern as gravity. It means electric force drops off rapidly with distance — but at close range, it's incredibly strong.",
  },

  {
    id: "q-prop1", type: "question",
    questionType: "multiple_choice",
    prompt: "Two charges exert a force of 12 N on each other. If the distance between them is doubled, the new force is:",
    difficulty: "apply",
    options: [
      "6 N — force halves",
      "3 N — force drops to ¼",
      "24 N — force doubles",
      "48 N — force quadruples",
    ],
    correctIndex: 1,
    explanation: "F ∝ 1/r². Double r → r² quadruples → F drops to ¼. New force = 12/4 = 3 N. This is the inverse square law.",
  },

  {
    id: "q-prop2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two charges exert a force of 8 N. If one charge is tripled (everything else unchanged), the new force is:",
    difficulty: "apply",
    options: [
      "8 N — only distance changes the force",
      "24 N — force triples",
      "72 N — force increases by 9×",
      "2.67 N — force drops to ⅓",
    ],
    correctIndex: 1,
    explanation: "F ∝ q₁ × q₂. Triple one charge → force triples. 8 × 3 = 24 N. Coulomb's Law is directly proportional to each charge.",
  },

  {
    id: "q-prop3", type: "question",
    questionType: "multiple_choice",
    prompt: "The force between two charges is 20 N. If both charges are doubled AND the distance is doubled, the new force is:",
    difficulty: "analyze",
    options: [
      "20 N — the changes cancel out",
      "40 N — charges win",
      "80 N — both changes multiply",
      "5 N — distance wins",
    ],
    correctIndex: 0,
    explanation: "Double both charges: force × 4 (2 × 2). Double distance: force ÷ 4 (inverse square). Net: × 4 ÷ 4 = × 1. Force stays at 20 N. The changes exactly cancel!",
  },

  // ─── CHECK YOUR UNDERSTANDING ──────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~5 minutes",
  },

  {
    id: "q-check1", type: "question",
    questionType: "multiple_choice",
    prompt: "Two charges of +2 μC and +3 μC are 0.5 m apart. What is the electrostatic force? (k = 9 × 10⁹)",
    difficulty: "apply",
    options: [
      "0.108 N, repulsive",
      "0.216 N, repulsive",
      "0.216 N, attractive",
      "0.432 N, repulsive",
    ],
    correctIndex: 1,
    explanation: "F = kq₁q₂/r² = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/(0.5²) = (9×10⁹)(6×10⁻¹²)/0.25 = 54×10⁻³/0.25 = 0.216 N. Both charges are positive → repulsive.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "short_answer",
    prompt: "Calculate the electrostatic force between a proton (+1.6 × 10⁻¹⁹ C) and an electron (−1.6 × 10⁻¹⁹ C) separated by 1.0 × 10⁻¹⁰ m (about the size of an atom). Show your work. Is this force attractive or repulsive? Compare this force to gravity between the same particles (gravitational force ≈ 1 × 10⁻⁴⁷ N).",
    difficulty: "evaluate",
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Coulomb's Law: F = kq₁q₂/r²**\n\n- Directly proportional to each charge\n- Inversely proportional to the square of the distance\n- Same structure as Newton's gravity — but 10³⁶ times stronger\n- Positive result = repulsive. Negative result = attractive.\n\nNext class: you'll learn about **electric fields** — the invisible force field that every charge creates around itself.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Coulomb's Law and gravity have the same structure (F ∝ 1/r²). But you don't feel electric pull toward Earth because Earth is electrically neutral — roughly equal protons and electrons. The positive and negative forces cancel almost perfectly. Gravity, on the other hand, only attracts — it never cancels — so even though it's incredibly weak per particle, it adds up across 6 × 10²⁴ kg of Earth.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about what makes electric force stronger or weaker. Were your guesses correct? What would you add now?",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Coulomb's Law", definition: "F = kq₁q₂/r². The force between two point charges is proportional to their charges and inversely proportional to the square of the distance." },
      { term: "Coulomb's Constant (k)", definition: "8.99 × 10⁹ N·m²/C². Reflects the enormous strength of the electric force." },
      { term: "Inverse Square Law", definition: "A relationship where a quantity decreases with the square of the distance. Double the distance → ¼ the force. Applies to both electricity and gravity." },
      { term: "Microcoulomb (μC)", definition: "One millionth of a coulomb. 1 μC = 10⁻⁶ C. A common unit for everyday static electricity problems." },
      { term: "Electrostatic Force", definition: "The force between charged objects. Attractive if charges are opposite, repulsive if charges are alike." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("coulombs-law");

  const data = {
    title: "Coulomb's Law",
    questionOfTheDay: "Coulomb's Law and Newton's Law of Gravitation have the same mathematical structure. If electricity and gravity follow the same pattern, why don't you feel an electric pull toward the Earth?",
    course: "Physics",
    unit: "Electrostatics",
    order: 2,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/coulombs-law`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
