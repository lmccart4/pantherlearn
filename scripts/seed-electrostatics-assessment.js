// seed-electrostatics-assessment.js
// Physics — Electrostatics Unit Assessment
// Run from your pantherlearn directory: node scripts/seed-electrostatics-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── HEADER ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Electrostatics Unit Assessment",
    subtitle: "Complete all questions independently",
  },

  {
    id: "objectives", type: "objectives",
    title: "What This Assessment Covers",
    items: [
      "Electric charge: types, conservation, transfer methods",
      "Coulomb's Law: calculating electrostatic force",
      "Electric fields: direction, strength, field lines",
      "Electric potential and potential energy",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "📋", style: "warning",
    content: "**Assessment Rules:** This is an individual assessment. No collaboration. You may use a calculator but no notes or internet. Answer every question — partial credit is given on short answer questions.",
  },

  // ─── SECTION 1: ELECTRIC CHARGE (25%) ──────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔋",
    title: "Part 1: Electric Charge",
    subtitle: "5 questions — 25% of assessment",
  },

  {
    id: "q1", type: "question",
    questionType: "multiple_choice",
    prompt: "An atom has 11 protons and 10 electrons. What is the overall charge of this atom?",
    difficulty: "remember",
    options: [
      "Neutral (0)",
      "Positive (+1)",
      "Negative (-1)",
      "Positive (+11)",
    ],
    correctIndex: 1,
    explanation: "11 protons (+11) and 10 electrons (-10) = net charge of +1. This is a positive ion (cation) — it lost one electron.",
  },

  {
    id: "q2", type: "question",
    questionType: "multiple_choice",
    prompt: "When you rub a balloon on your hair, electrons transfer from your hair to the balloon. After rubbing, the balloon is:",
    difficulty: "understand",
    options: [
      "Positively charged, because it gained protons",
      "Negatively charged, because it gained electrons",
      "Neutral, because charge is conserved",
      "Positively charged, because it lost electrons",
    ],
    correctIndex: 1,
    explanation: "The balloon gained electrons (negative charges) from your hair, making it negatively charged. Protons never transfer — they're locked in the nucleus.",
  },

  {
    id: "q3", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of the following is TRUE about electric charge?",
    difficulty: "understand",
    options: [
      "Charge can be created by friction",
      "Charge is always conserved — it transfers but is never created or destroyed",
      "Only negative charges can move in solids",
      "Insulators cannot hold any electric charge",
    ],
    correctIndex: 1,
    explanation: "Conservation of charge is a fundamental law. Friction doesn't create charge — it transfers electrons from one object to another. The total charge of the system stays the same.",
  },

  {
    id: "q4", type: "question",
    questionType: "multiple_choice",
    prompt: "A negatively charged rod is brought near (but not touching) a neutral metal sphere. The side of the sphere nearest the rod becomes:",
    difficulty: "apply",
    options: [
      "Negatively charged — like charges attract",
      "Positively charged — electrons in the sphere are repelled away",
      "Neutral — metal doesn't respond to external charges",
      "Negatively charged — electrons in the sphere are attracted toward the rod",
    ],
    correctIndex: 1,
    explanation: "This is charging by induction. The negative rod repels the sphere's electrons to the far side, leaving the near side with a positive charge (deficit of electrons). The sphere is still neutral overall, but the charge is separated.",
  },

  {
    id: "q5", type: "question",
    questionType: "short_answer",
    prompt: "Explain the difference between conductors and insulators in terms of electron movement. Give one example of each and explain why a metal doorknob can shock you on a dry winter day.",
    difficulty: "understand",
  },

  // ─── SECTION 2: COULOMB'S LAW (30%) ───────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Part 2: Coulomb's Law",
    subtitle: "6 questions — 30% of assessment",
  },

  {
    id: uid(), type: "callout",
    icon: "📋", style: "info",
    content: "**Reference:** Coulomb's Law: F = k(q₁q₂)/r²\n\nWhere k = 8.99 × 10⁹ N·m²/C², q = charge in coulombs (C), r = distance in meters (m)",
  },

  {
    id: "q6", type: "question",
    questionType: "multiple_choice",
    prompt: "Two charges of +2 μC and +3 μC are separated by 0.5 m. What is the electrostatic force between them?\n\n(k = 9 × 10⁹ N·m²/C², 1 μC = 10⁻⁶ C)",
    difficulty: "apply",
    options: [
      "0.108 N",
      "0.216 N",
      "1.08 N",
      "0.054 N",
    ],
    correctIndex: 1,
    explanation: "F = kq₁q₂/r² = (9×10⁹)(2×10⁻⁶)(3×10⁻⁶)/(0.5²) = (9×10⁹)(6×10⁻¹²)/0.25 = 54×10⁻³/0.25 = 0.216 N",
  },

  {
    id: "q7", type: "question",
    questionType: "multiple_choice",
    prompt: "If you double the distance between two charged objects, what happens to the electrostatic force?",
    difficulty: "understand",
    options: [
      "It doubles",
      "It halves",
      "It becomes ¼ as strong",
      "It becomes 4× as strong",
    ],
    correctIndex: 2,
    explanation: "F ∝ 1/r². If r doubles, r² quadruples, so F drops to ¼. This is the inverse square law — the same relationship as gravity.",
  },

  {
    id: "q8", type: "question",
    questionType: "multiple_choice",
    prompt: "Two charges exert a force of 12 N on each other. If one charge is tripled, the new force is:",
    difficulty: "apply",
    options: [
      "4 N",
      "12 N",
      "36 N",
      "108 N",
    ],
    correctIndex: 2,
    explanation: "F ∝ q₁ × q₂. If one charge triples, the force triples: 12 N × 3 = 36 N. Coulomb's Law is directly proportional to each charge.",
  },

  {
    id: "q9", type: "question",
    questionType: "multiple_choice",
    prompt: "Charge A is +4 μC. Charge B is -2 μC. They are 0.3 m apart. The force between them is:",
    difficulty: "apply",
    options: [
      "0.8 N, attractive",
      "0.8 N, repulsive",
      "2.4 N, attractive",
      "0.24 N, repulsive",
    ],
    correctIndex: 0,
    explanation: "F = kq₁q₂/r² = (9×10⁹)(4×10⁻⁶)(2×10⁻⁶)/(0.3²) = (9×10⁹)(8×10⁻¹²)/0.09 = 72×10⁻³/0.09 = 0.8 N. Opposite charges → attractive.",
  },

  {
    id: "q10", type: "question",
    questionType: "short_answer",
    prompt: "Two identical metal spheres carry charges of +6 μC and -2 μC. They are touched together and then separated. What is the charge on each sphere after separation? Explain your reasoning using conservation of charge.",
    difficulty: "apply",
  },

  {
    id: "q11", type: "question",
    questionType: "short_answer",
    prompt: "Calculate the electrostatic force between a proton and an electron separated by 5.3 × 10⁻¹¹ m (the approximate radius of a hydrogen atom).\n\nGiven: proton charge = +1.6 × 10⁻¹⁹ C, electron charge = -1.6 × 10⁻¹⁹ C, k = 9 × 10⁹ N·m²/C²\n\nShow all work. Is this force attractive or repulsive?",
    difficulty: "apply",
  },

  // ─── SECTION 3: ELECTRIC FIELDS (25%) ──────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧲",
    title: "Part 3: Electric Fields",
    subtitle: "5 questions — 25% of assessment",
  },

  {
    id: "q12", type: "question",
    questionType: "multiple_choice",
    prompt: "Electric field lines around a single positive charge point:",
    difficulty: "remember",
    options: [
      "Inward, toward the charge",
      "Outward, away from the charge",
      "In circles around the charge",
      "In random directions",
    ],
    correctIndex: 1,
    explanation: "Electric field lines point away from positive charges and toward negative charges. Think of it from a positive test charge's perspective — it would be repelled away from a positive source charge.",
  },

  {
    id: "q13", type: "question",
    questionType: "multiple_choice",
    prompt: "The electric field is strongest where field lines are:",
    difficulty: "understand",
    options: [
      "Farthest apart",
      "Closest together",
      "Perfectly parallel",
      "Curved",
    ],
    correctIndex: 1,
    explanation: "Field line density represents field strength. Where lines are close together (packed tight), the field is strongest. Near a charge, lines are dense → strong field. Far away, lines spread out → weak field.",
  },

  {
    id: "q14", type: "question",
    questionType: "multiple_choice",
    prompt: "A positive test charge is placed in an electric field that points to the right. The force on the test charge is:",
    difficulty: "understand",
    options: [
      "To the left (opposite the field)",
      "To the right (same direction as the field)",
      "Upward (perpendicular to the field)",
      "Zero (test charges don't feel forces)",
    ],
    correctIndex: 1,
    explanation: "The electric field IS defined as the direction a positive test charge would be pushed. So a positive charge moves in the same direction as the field. A negative charge would move opposite to the field.",
  },

  {
    id: "q15", type: "question",
    questionType: "multiple_choice",
    prompt: "Between two parallel plates (one positive, one negative), the electric field is:",
    difficulty: "understand",
    options: [
      "Zero — the charges cancel out",
      "Curved, bending from one plate to the other",
      "Uniform — same strength and direction everywhere between the plates",
      "Only present at the surface of the plates",
    ],
    correctIndex: 2,
    explanation: "Between parallel plates, the field is uniform — straight lines from + plate to - plate with equal spacing. This is why parallel plates are used in so many physics experiments: the field is predictable and constant.",
  },

  {
    id: "q16", type: "question",
    questionType: "short_answer",
    prompt: "Draw or describe the electric field line pattern between a +Q charge and a -Q charge placed near each other (an electric dipole). Where is the field strongest? Where is it weakest? How would a positive test charge move if placed exactly halfway between them?",
    difficulty: "analyze",
  },

  // ─── SECTION 4: ELECTRIC POTENTIAL (20%) ───────────────

  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Part 4: Electric Potential & Energy",
    subtitle: "4 questions — 20% of assessment",
  },

  {
    id: "q17", type: "question",
    questionType: "multiple_choice",
    prompt: "Electric potential energy between two like charges (both positive or both negative) is:",
    difficulty: "understand",
    options: [
      "Positive — energy stored in repulsion",
      "Negative — they attract each other",
      "Zero — like charges have no PE",
      "It depends on the distance only",
    ],
    correctIndex: 0,
    explanation: "Like charges repel, and work was done to push them together. That work is stored as positive potential energy. Releasing them would convert PE to KE as they fly apart — like a compressed spring.",
  },

  {
    id: "q18", type: "question",
    questionType: "multiple_choice",
    prompt: "As a positive charge moves in the direction of an electric field (from high potential to low potential), its electric potential energy:",
    difficulty: "understand",
    options: [
      "Increases",
      "Decreases",
      "Stays the same",
      "Becomes negative",
    ],
    correctIndex: 1,
    explanation: "Moving with the field (high → low potential) decreases PE and increases KE — just like a ball rolling downhill converts GPE to KE. The charge 'falls' through the electric potential difference.",
  },

  {
    id: "q19", type: "question",
    questionType: "multiple_choice",
    prompt: "A charge of 3 μC moves through a potential difference of 500 V. How much work is done on the charge?\n\n(W = qΔV, 1 μC = 10⁻⁶ C)",
    difficulty: "apply",
    options: [
      "1,500 J",
      "0.0015 J",
      "1.5 × 10⁻³ J",
      "Both B and C are correct",
    ],
    correctIndex: 3,
    explanation: "W = qΔV = (3 × 10⁻⁶ C)(500 V) = 1.5 × 10⁻³ J = 0.0015 J. Options B and C are the same number in different notation.",
  },

  {
    id: "q20", type: "question",
    questionType: "short_answer",
    prompt: "Explain the analogy between gravitational potential energy and electric potential energy. In your explanation:\n\n1. What plays the role of mass? What plays the role of height?\n2. What is the equivalent of 'falling' in the electric case?\n3. Why is this analogy useful for understanding circuits (which you'll study next)?",
    difficulty: "analyze",
  },

  // ─── BONUS ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🌟",
    title: "Bonus Question",
    subtitle: "Extra credit — 5 points",
  },

  {
    id: "q-bonus", type: "question",
    questionType: "short_answer",
    prompt: "Lightning is a massive electrostatic discharge. A typical lightning bolt transfers about 5 coulombs of charge through a potential difference of about 300 million volts (3 × 10⁸ V) in about 0.001 seconds.\n\nCalculate: (a) the energy released (W = qΔV), (b) the power of the lightning bolt (P = W/t), and (c) compare this power to a typical household circuit breaker (2,400 W). How many times more powerful is lightning?\n\nShow all work.",
    difficulty: "evaluate",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("electrostatics-assessment");

  const data = {
    title: "Electrostatics Unit Assessment",
    questionOfTheDay: "How much energy does a single lightning bolt release — and how does it compare to your phone charger?",
    course: "Physics",
    unit: "Electrostatics",
    order: 0,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await safeLessonWrite(db, COURSE_ID, "electrostatics-assessment", data);
  console.log(`✅ Assessment seeded successfully!`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Path:  courses/${COURSE_ID}/lessons/electrostatics-assessment`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/electrostatics-assessment`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
