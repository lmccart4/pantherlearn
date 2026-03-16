// seed-ohms-law.js
// Physics — Circuits Unit, Lesson 3 (order: 3)
// "Ohm's Law"
// Run: node scripts/seed-ohms-law.js

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
      "Use Ohm's Law (V = IR) to solve for voltage, current, or resistance",
      "Predict how changing one variable affects the others",
      "Apply proportional reasoning to Ohm's Law problems",
      "Solve multi-step circuit problems involving Ohm's Law",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A hair dryer and a phone charger are both plugged into the same 120V outlet. The hair dryer draws 10A of current and the charger draws 0.5A. What's different about them that causes such a huge difference in current?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Last class you learned V = IR. Without calculating, predict: if you double the voltage in a circuit but keep the resistance the same, what happens to the current? What if you double the resistance but keep the voltage the same?",
    difficulty: "understand",
  },

  // ─── OHM'S LAW ──────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Ohm's Law: V = IR",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Georg Ohm discovered in 1827 that for most materials, the voltage across a component is directly proportional to the current through it:\n\n## V = IR\n\nThree forms of the same equation:\n\n| Solve for | Formula | When to use |\n|---|---|---|\n| **Voltage** | V = I × R | Know current and resistance, find voltage |\n| **Current** | I = V / R | Know voltage and resistance, find current |\n| **Resistance** | R = V / I | Know voltage and current, find resistance |\n\n**The VIR triangle trick:** Write V on top, I on the bottom-left, R on the bottom-right. Cover what you want to find — what's left is the formula.\n\n- Cover V → I × R (multiply)\n- Cover I → V / R (divide)\n- Cover R → V / I (divide)",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example 1:** A 9V battery is connected to a 3Ω resistor. Find the current.\n\nI = V/R = 9V ÷ 3Ω = **3 A**\n\n**Worked Example 2:** A current of 0.5A flows through a 20Ω resistor. Find the voltage.\n\nV = IR = 0.5A × 20Ω = **10 V**\n\n**Worked Example 3:** A 12V battery pushes 4A through a device. What is the device's resistance?\n\nR = V/I = 12V ÷ 4A = **3 Ω**",
  },

  {
    id: uid(), type: "calculator",
    title: "Ohm's Law Calculator — Solve for Current",
    description: "Find current when you know voltage and resistance.\n\nI = V / R",
    formula: "V / R",
    showFormula: true,
    inputs: [
      { name: "V", label: "Voltage", unit: "V" },
      { name: "R", label: "Resistance", unit: "Ω" },
    ],
    output: { label: "Current", unit: "A", decimals: 4 },
  },

  {
    id: uid(), type: "calculator",
    title: "Ohm's Law Calculator — Solve for Voltage",
    description: "Find voltage when you know current and resistance.\n\nV = I × R",
    formula: "I * R",
    showFormula: true,
    inputs: [
      { name: "I", label: "Current", unit: "A" },
      { name: "R", label: "Resistance", unit: "Ω" },
    ],
    output: { label: "Voltage", unit: "V", decimals: 4 },
  },

  {
    id: "q-practice1", type: "question",
    questionType: "short_answer",
    prompt: "Solve these using Ohm's Law. Show your work (write the formula, substitute, solve):\n\n1. V = 24V, R = 8Ω → find I\n2. I = 3A, R = 15Ω → find V\n3. V = 120V, I = 10A → find R\n4. V = 1.5V, R = 0.5Ω → find I\n5. I = 0.002A (2 mA), R = 5000Ω → find V",
    difficulty: "apply",
  },

  // ─── PROPORTIONAL REASONING ─────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📊",
    title: "How Variables Affect Each Other",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Ohm's Law has the same kind of proportional relationships you mastered in Coulomb's Law:\n\n**I = V / R** tells us:\n\n**1. Current ∝ Voltage (direct proportion, R constant)**\n- Double the voltage → current doubles\n- Triple the voltage → current triples\n- Halve the voltage → current halves\n\n**2. Current ∝ 1/R (inverse proportion, V constant)**\n- Double the resistance → current halves\n- Triple the resistance → current drops to ⅓\n- Halve the resistance → current doubles\n\nThis is just like Coulomb's Law: force was proportional to charge (direct) and inversely proportional to distance squared (inverse). Same reasoning skills, different equation.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Why this matters in real life:**\n\n- Power lines use very high voltage (500,000V) to send electricity long distances. Why? With high V, you can get the same current with less — which means thinner wires and less energy lost to heat.\n- Your phone charger steps voltage down to 5V because your phone's circuits have very low resistance — 5V is enough to push plenty of current through.",
  },

  {
    id: "q-prop1", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit has 6V and draws 2A of current. If the voltage is doubled to 12V (resistance unchanged), the new current is:",
    difficulty: "apply",
    options: [
      "1 A — current halves",
      "2 A — no change",
      "4 A — current doubles",
      "8 A — current quadruples",
    ],
    correctIndex: 2,
    explanation: "I ∝ V (direct proportion). Double the voltage → double the current. I = 12V ÷ R. Since R = V/I = 6/2 = 3Ω, new I = 12/3 = 4A.",
  },

  {
    id: "q-prop2", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit draws 4A. If the resistance is tripled (voltage unchanged), the new current is:",
    difficulty: "apply",
    options: [
      "12 A — current triples",
      "4 A — no change",
      "1.33 A — current drops to ⅓",
      "2 A — current halves",
    ],
    correctIndex: 2,
    explanation: "I ∝ 1/R (inverse proportion). Triple the resistance → current drops to ⅓. 4A ÷ 3 = 1.33A.",
  },

  {
    id: "q-prop3", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit has 10V, 5Ω, and draws 2A. If the voltage is doubled AND the resistance is doubled, the new current is:",
    difficulty: "analyze",
    options: [
      "2 A — the changes cancel out",
      "4 A — voltage wins",
      "1 A — resistance wins",
      "8 A — both changes multiply",
    ],
    correctIndex: 0,
    explanation: "Double V → current × 2. Double R → current ÷ 2. Net effect: × 2 ÷ 2 = × 1. Current stays at 2A. I = 20V ÷ 10Ω = 2A. Same pattern as when we doubled both charges and distance in Coulomb's Law!",
  },

  // ─── V-I GRAPHS ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📈",
    title: "Voltage-Current Graphs",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "If you plot voltage (y-axis) vs. current (x-axis) for a resistor, you get a **straight line through the origin**.\n\nWhy? V = IR means V is directly proportional to I (with R as the constant slope).\n\n**The slope of a V-I graph = resistance.**\n\n- Steep line → high resistance (lots of voltage needed per amp of current)\n- Shallow line → low resistance (small voltage drives lots of current)\n\n**Ohmic vs. non-ohmic materials:**\n- **Ohmic** (straight line): most metals, standard resistors — V and I are proportional\n- **Non-ohmic** (curved line): light bulbs (resistance changes with temperature), diodes, LEDs — the relationship isn't linear\n\nFor this class, we'll work with ohmic materials (straight-line graphs).",
  },

  {
    id: "q-graph", type: "question",
    questionType: "multiple_choice",
    prompt: "Two resistors are tested. Resistor A has a steeper V-I graph than Resistor B. Which statement is true?",
    difficulty: "analyze",
    options: [
      "Resistor A has less resistance",
      "Resistor A has more resistance",
      "Both have the same resistance — steepness doesn't matter",
      "Resistor A allows more current",
    ],
    correctIndex: 1,
    explanation: "The slope of a V-I graph equals resistance (R = V/I = rise/run). A steeper slope means more voltage is needed per amp of current → higher resistance.",
  },

  // ─── MULTI-STEP PROBLEMS ────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "Multi-Step Problems",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Some problems require combining Ohm's Law with other equations:\n\n**Example:** A circuit has a 9V battery and a 6Ω resistor.\n(a) Find the current.\n(b) How much charge flows in 30 seconds?\n(c) How much energy does the battery deliver in 30 seconds?\n\n**Solution:**\n(a) I = V/R = 9/6 = **1.5 A**\n(b) Q = It = 1.5 × 30 = **45 C** (rearranged I = Q/t)\n(c) W = qΔV = 45 × 9 = **405 J** (from the electrostatics equation!)\n\nNotice how the electrostatics equations (W = qΔV) connect directly to circuits. Everything you learned about voltage and energy per charge applies here.",
  },

  {
    id: "q-multistep", type: "question",
    questionType: "short_answer",
    prompt: "A 12V car battery is connected to headlights with a total resistance of 3Ω.\n\n(a) What current flows through the headlights?\n(b) How much charge flows in 1 minute (60 seconds)?\n(c) How much energy does the battery deliver in 1 minute?\n\nShow all work. Identify which equation you're using for each step.",
    difficulty: "apply",
  },

  // ─── CHECK YOUR UNDERSTANDING ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~5 minutes",
  },

  {
    id: "q-check1", type: "question",
    questionType: "multiple_choice",
    prompt: "A light bulb has a resistance of 240Ω and is connected to a 120V outlet. The current through the bulb is:",
    difficulty: "apply",
    options: [
      "28,800 A",
      "2 A",
      "0.5 A",
      "120 A",
    ],
    correctIndex: 2,
    explanation: "I = V/R = 120V ÷ 240Ω = 0.5A. This is a typical current for a light bulb — about half an amp.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "An electric heater draws 15A from a 120V outlet. Its resistance is:",
    difficulty: "apply",
    options: [
      "1800 Ω",
      "8 Ω",
      "0.125 Ω",
      "105 Ω",
    ],
    correctIndex: 1,
    explanation: "R = V/I = 120V ÷ 15A = 8Ω. Low resistance means high current — that's how heaters draw so much power.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A circuit draws 3A with a 12V battery.\n(a) What is the resistance?\n(b) If you replace the battery with a 6V battery, what is the new current?\n(c) What proportional reasoning rule did you use in part (b)? How is this similar to what you learned in Coulomb's Law?",
    difficulty: "analyze",
  },

  // ─── WRAP UP ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Ohm's Law: V = IR**\n\n- Three forms: V = IR, I = V/R, R = V/I\n- Current is directly proportional to voltage\n- Current is inversely proportional to resistance\n- The slope of a V-I graph = resistance\n- These proportional reasoning skills are the same ones you used for Coulomb's Law\n\n**Coming up next:** Series and parallel circuits — what happens when you connect multiple resistors and loads?",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** The hair dryer (10A) and phone charger (0.5A) are both plugged into 120V — same voltage. The difference is resistance. R = V/I: the hair dryer has R = 120/10 = 12Ω (low resistance → high current → lots of heat). The phone charger has R = 120/0.5 = 240Ω (high resistance → low current → just enough to charge). Same voltage, different resistance, wildly different current.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up predictions about doubling voltage and doubling resistance. Were you right? Now explain precisely WHY using the proportional reasoning you practiced today.",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Ohm's Law", definition: "V = IR. The voltage across a resistor equals the current through it times its resistance. The fundamental equation of circuit analysis." },
      { term: "Direct Proportion", definition: "When one variable increases, the other increases by the same factor. I ∝ V: double the voltage, double the current." },
      { term: "Inverse Proportion", definition: "When one variable increases, the other decreases by the same factor. I ∝ 1/R: double the resistance, halve the current." },
      { term: "Ohmic Material", definition: "A material where V and I are proportional (straight-line V-I graph). Most metals and standard resistors are ohmic." },
      { term: "Non-ohmic Material", definition: "A material where the V-I relationship is not linear (curved graph). Examples: light bulb filaments, diodes, LEDs." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("ohms-law");

  const data = {
    title: "Ohm's Law",
    questionOfTheDay: "A hair dryer and a phone charger are both plugged into the same 120V outlet. The hair dryer draws 10A of current and the charger draws 0.5A. What's different about them that causes such a huge difference in current?",
    course: "Physics",
    unit: "Circuits",
    order: 3,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/ohms-law`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
