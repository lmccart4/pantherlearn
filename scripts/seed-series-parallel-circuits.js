// seed-series-parallel-circuits.js
// Physics — Circuits Unit, Lesson 4 (order: 4)
// "Series & Parallel Circuits"
// Run: node scripts/seed-series-parallel-circuits.js

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
    icon: "🔌",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Compare series and parallel circuits in terms of current, voltage, and resistance",
      "Calculate total resistance in series and parallel configurations",
      "Predict what happens when a component is removed from each type of circuit",
      "Apply Ohm's Law to analyze series and parallel circuits",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Old-fashioned Christmas lights used to go ALL dark when one bulb burned out. Modern ones stay lit even with a dead bulb. What's different about how the two types are wired?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Think about the outlets in your house. If you unplug your TV, does your refrigerator turn off? If you turn off the bathroom light, does the kitchen light go out? What does this tell you about how your house is wired?",
    difficulty: "understand",
  },

  // ─── SERIES CIRCUITS ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "➡️",
    title: "Series Circuits",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "In a **series circuit**, all components are connected in a single loop — one after another, like train cars on a track. There is only **one path** for current to flow.\n\n### Series Circuit Rules\n\n**1. Current is the SAME everywhere**\n\nI_total = I₁ = I₂ = I₃\n\nThere's only one path — every charge must flow through every component. If 2A enters the first resistor, 2A exits it and enters the second.\n\n**2. Voltage SPLITS across components**\n\nV_total = V₁ + V₂ + V₃\n\nThe battery's voltage is shared among all components. Each component gets a piece of the total voltage. More resistance → bigger share of voltage.\n\n**3. Resistance ADDS up**\n\nR_total = R₁ + R₂ + R₃\n\nEvery resistor adds to the total. More resistors = more total resistance = less current from the battery.\n\n**4. Remove one component → entire circuit breaks**\n\nSince there's only one path, a break anywhere stops current everywhere. This is why old Christmas lights all went dark when one bulb died.",
  },

  {
    id: uid(), type: "image",
    url: "https://drive.google.com/file/d/1nvbC9O6jmkyPtgSL2_RpspDM3WL9zqnz/view?usp=sharing",
    alt: "Series circuit diagram showing a battery, two light bulbs, and a switch connected in a single loop with blue arrows indicating current direction",
    caption: "A series circuit: one loop, one path for current. All components share the same current.",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example: Series Circuit**\n\nA 12V battery is connected to three resistors in series: R₁ = 2Ω, R₂ = 4Ω, R₃ = 6Ω.\n\n**Step 1: Total resistance**\nR_total = 2 + 4 + 6 = **12 Ω**\n\n**Step 2: Current (same everywhere)**\nI = V/R = 12V ÷ 12Ω = **1 A**\n\n**Step 3: Voltage across each resistor**\n- V₁ = IR₁ = 1 × 2 = 2V\n- V₂ = IR₂ = 1 × 4 = 4V\n- V₃ = IR₃ = 1 × 6 = 6V\n- Check: 2 + 4 + 6 = 12V ✓\n\nNotice: the biggest resistor (6Ω) gets the biggest share of voltage (6V). Voltage divides proportionally to resistance.",
  },

  {
    id: "q-series1", type: "question",
    questionType: "multiple_choice",
    prompt: "Three 10Ω resistors are connected in series to a 30V battery. The current through the circuit is:",
    difficulty: "apply",
    options: [
      "3 A",
      "1 A",
      "10 A",
      "0.33 A",
    ],
    correctIndex: 1,
    explanation: "R_total = 10 + 10 + 10 = 30Ω. I = V/R = 30V ÷ 30Ω = 1A. Each resistor gets 10V (30V split equally among equal resistors).",
  },

  {
    id: "q-series2", type: "question",
    questionType: "multiple_choice",
    prompt: "In a series circuit with a 9V battery, R₁ = 3Ω and R₂ = 6Ω. The voltage across R₂ is:",
    difficulty: "apply",
    options: [
      "3 V",
      "6 V",
      "9 V",
      "4.5 V",
    ],
    correctIndex: 1,
    explanation: "R_total = 3 + 6 = 9Ω. I = 9V ÷ 9Ω = 1A. V₂ = IR₂ = 1 × 6 = 6V. The bigger resistor gets the bigger share of voltage.",
  },

  // ─── PARALLEL CIRCUITS ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⬇️",
    title: "Parallel Circuits",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "In a **parallel circuit**, components are connected on separate branches — each branch provides its own path for current. Like multiple lanes on a highway.\n\n### Parallel Circuit Rules\n\n**1. Voltage is the SAME across all branches**\n\nV_total = V₁ = V₂ = V₃\n\nEvery branch connects directly to the battery, so every branch gets the full battery voltage.\n\n**2. Current SPLITS across branches**\n\nI_total = I₁ + I₂ + I₃\n\nCurrent divides among the branches. More current flows through the branch with less resistance (the easier path).\n\n**3. Total resistance DECREASES**\n\n1/R_total = 1/R₁ + 1/R₂ + 1/R₃\n\nThis is counterintuitive: adding more resistors in parallel actually **decreases** total resistance. Why? You're adding more paths for current to flow — like opening more checkout lanes at a store.\n\n**4. Remove one component → others keep working**\n\nEach branch is independent. If one bulb burns out, the others stay lit. This is how your house is wired.",
  },

  {
    id: uid(), type: "image",
    url: "https://drive.google.com/file/d/18gyqqcoBnrsY0VizEFe1g-xWPxjLF1-G/view?usp=sharing",
    alt: "Parallel circuit diagram showing a battery connected to two light bulbs on separate branches, with blue arrows showing current splitting at the junction",
    caption: "A parallel circuit: multiple branches, each getting the full battery voltage. Current splits at the junction.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Why does parallel resistance decrease?** Think of it like checkout lanes at a store. One lane (one resistor) → long wait (high resistance). Open a second lane → customers flow faster (lower total resistance). Even if each lane processes at the same speed, the overall flow increases because there are more paths.",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example: Parallel Circuit**\n\nA 12V battery is connected to two resistors in parallel: R₁ = 4Ω, R₂ = 12Ω.\n\n**Step 1: Total resistance**\n1/R_total = 1/4 + 1/12 = 3/12 + 1/12 = 4/12\nR_total = 12/4 = **3 Ω**\n\n(Total resistance is less than the smallest individual resistor — always true in parallel!)\n\n**Step 2: Total current**\nI_total = V/R_total = 12V ÷ 3Ω = **4 A**\n\n**Step 3: Current through each branch**\n- I₁ = V/R₁ = 12/4 = 3A\n- I₂ = V/R₂ = 12/12 = 1A\n- Check: 3 + 1 = 4A ✓\n\nNotice: more current flows through the smaller resistor (easier path). The 4Ω branch carries 3× the current of the 12Ω branch.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Shortcut for two resistors in parallel:**\n\nR_total = (R₁ × R₂) / (R₁ + R₂)\n\nExample: 4Ω and 12Ω in parallel → (4 × 12) / (4 + 12) = 48/16 = 3Ω\n\nThis \"product over sum\" formula only works for exactly two resistors. For three or more, use the 1/R method.",
  },

  {
    id: uid(), type: "calculator",
    title: "Parallel Resistance Calculator (2 resistors)",
    description: "Calculate total resistance for two resistors in parallel.\n\nR_total = (R₁ × R₂) / (R₁ + R₂)",
    formula: "(R1 * R2) / (R1 + R2)",
    showFormula: true,
    inputs: [
      { name: "R1", label: "Resistance 1", unit: "Ω" },
      { name: "R2", label: "Resistance 2", unit: "Ω" },
    ],
    output: { label: "Total Resistance", unit: "Ω", decimals: 4 },
  },

  {
    id: "q-parallel1", type: "question",
    questionType: "multiple_choice",
    prompt: "Two 6Ω resistors are connected in parallel. The total resistance is:",
    difficulty: "apply",
    options: [
      "12 Ω",
      "6 Ω",
      "3 Ω",
      "0.33 Ω",
    ],
    correctIndex: 2,
    explanation: "R_total = (6 × 6) / (6 + 6) = 36/12 = 3Ω. Two identical resistors in parallel always give half the resistance of one. Makes sense — two equal paths means half the total opposition.",
  },

  {
    id: "q-parallel2", type: "question",
    questionType: "multiple_choice",
    prompt: "A 24V battery connects to a 6Ω and a 12Ω resistor in parallel. The total current from the battery is:",
    difficulty: "apply",
    options: [
      "6 A",
      "4 A",
      "2 A",
      "1.33 A",
    ],
    correctIndex: 0,
    explanation: "R_total = (6 × 12)/(6 + 12) = 72/18 = 4Ω. I_total = V/R = 24/4 = 6A. Branch currents: I₁ = 24/6 = 4A, I₂ = 24/12 = 2A. Check: 4 + 2 = 6A ✓",
  },

  // ─── SIDE BY SIDE COMPARISON ────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚖️",
    title: "Series vs. Parallel — Summary",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "| Property | Series | Parallel |\n|---|---|---|\n| **Current** | Same through all components | Splits across branches |\n| **Voltage** | Splits across components | Same across all branches |\n| **Total Resistance** | R_total = R₁ + R₂ + ... (adds up) | 1/R_total = 1/R₁ + 1/R₂ + ... (decreases) |\n| **If one component breaks** | Entire circuit stops | Other branches keep working |\n| **Bulb brightness** | Dimmer (voltage shared) | Full brightness (full voltage each) |\n| **Real-world example** | Old Christmas lights | House wiring, modern Christmas lights |\n| **Adding more components** | Increases total R, decreases I | Decreases total R, increases I |",
  },

  {
    id: uid(), type: "sorting",
    icon: "⚖️",
    title: "Series or Parallel?",
    instructions: "Decide whether each statement describes a **series** circuit or a **parallel** circuit.",
    leftLabel: "Series",
    rightLabel: "Parallel",
    items: [
      { text: "Current is the same through all components", correct: "left" },
      { text: "Voltage is the same across all branches", correct: "right" },
      { text: "Removing one bulb turns off all bulbs", correct: "left" },
      { text: "Total resistance is less than the smallest resistor", correct: "right" },
      { text: "Adding more resistors increases total resistance", correct: "left" },
      { text: "Each branch gets the full battery voltage", correct: "right" },
      { text: "Your house outlets are wired this way", correct: "right" },
      { text: "Old Christmas lights were wired this way", correct: "left" },
    ],
  },

  // ─── CRACK THE CIRCUIT GAME ─────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎮",
    title: "Crack the Circuit Game",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Time to apply what you've learned! Play the Crack the Circuit game — a series of increasingly challenging circuit puzzles. Your goal is to complete as many levels as possible.\n\n**Grading:**\n- 0+ levels: F (0%)\n- 3+ levels: D (55%)\n- 7+ levels: C (65%)\n- 12+ levels: B (85%)\n- 15+ levels: A (100%)\n- 18 levels: A++ (bonus!)\n\nWhen you finish, take a screenshot of your results page showing your completed levels. Make sure your name is visible in a second tab.",
  },

  {
    id: uid(), type: "embed",
    url: "https://www.universeandmore.com/crack-the-circuit/",
    caption: "Crack the Circuit — complete levels by building working circuits",
    height: 650,
    scored: false,
  },

  {
    id: "q-game-results", type: "question",
    questionType: "short_answer",
    prompt: "How many levels did you complete? Which level was the hardest, and why? Describe the circuit concept that made it tricky (series, parallel, switches, etc.).",
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
    prompt: "A 6Ω and a 3Ω resistor are in series with a 9V battery. The current through the 3Ω resistor is:",
    difficulty: "apply",
    options: [
      "3 A",
      "1.5 A",
      "1 A",
      "0.33 A",
    ],
    correctIndex: 2,
    explanation: "R_total = 6 + 3 = 9Ω. I = V/R = 9/9 = 1A. In series, current is the same everywhere, so the 3Ω resistor also has 1A flowing through it.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Three identical light bulbs are connected in parallel to a battery. If one bulb burns out:",
    difficulty: "understand",
    options: [
      "All three bulbs go dark",
      "The remaining two stay lit at the same brightness",
      "The remaining two get dimmer",
      "The remaining two get brighter",
    ],
    correctIndex: 1,
    explanation: "In parallel, each branch is independent and gets the full battery voltage. Removing one branch doesn't affect the others. The remaining bulbs stay at the same brightness because their voltage and resistance haven't changed.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A 12V battery is connected to a 4Ω and 6Ω resistor in parallel.\n\n(a) Find the total resistance.\n(b) Find the total current from the battery.\n(c) Find the current through each resistor.\n(d) Verify that the branch currents add up to the total.\n\nShow all work.",
    difficulty: "apply",
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
    content: "**Series:** One path. Same current. Voltage splits. Resistance adds. Break one → break all.\n\n**Parallel:** Multiple paths. Same voltage. Current splits. Resistance decreases. Break one → others survive.\n\n**Key formulas:**\n- Series: R_total = R₁ + R₂ + R₃\n- Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃\n- Parallel shortcut (2 resistors): R_total = (R₁ × R₂) / (R₁ + R₂)\n\n**Coming up next:** You'll build real circuits with the circuit kits — including one that requires BOTH series and parallel wiring.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Old Christmas lights were wired in series — one path for current, so one dead bulb breaks the entire loop. Modern Christmas lights are wired in parallel — each bulb has its own path to the power source, so one dead bulb doesn't affect the others. Your house is wired the same way as modern Christmas lights — every outlet is on its own parallel branch.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about house wiring. Now explain precisely WHY unplugging your TV doesn't turn off your fridge, using the terms parallel circuit, independent branches, and voltage.",
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
      { term: "Series Circuit", definition: "Components connected in a single loop. Same current everywhere. Voltage splits. Total R = R₁ + R₂ + ..." },
      { term: "Parallel Circuit", definition: "Components connected on separate branches. Same voltage across branches. Current splits. 1/R_total = 1/R₁ + 1/R₂ + ..." },
      { term: "Branch", definition: "A separate path in a parallel circuit. Each branch carries its own current and has the full battery voltage." },
      { term: "Total Resistance (Series)", definition: "R_total = R₁ + R₂ + R₃. Adding resistors in series always increases total resistance." },
      { term: "Total Resistance (Parallel)", definition: "1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Adding resistors in parallel always decreases total resistance (more paths = less opposition)." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("series-parallel-circuits");

  const data = {
    title: "Series & Parallel Circuits",
    questionOfTheDay: "Old-fashioned Christmas lights used to go ALL dark when one bulb burned out. Modern ones stay lit even with a dead bulb. What's different about how the two types are wired?",
    course: "Physics",
    unit: "Circuits",
    order: 4,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/series-parallel-circuits`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
