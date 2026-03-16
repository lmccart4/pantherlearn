// seed-circuits-assessment.js
// Physics — Circuits Unit, Lesson 6 (order: 6)
// "Circuits Unit Assessment"
// Run: node scripts/seed-circuits-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── HEADER ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📝",
    title: "Circuits Unit Assessment",
    subtitle: "Take your time. Show your work on calculations.",
  },

  {
    id: "objectives", type: "objectives",
    title: "Topics Covered",
    items: [
      "Circuit basics: components, open/closed circuits, conductors/insulators",
      "Current, voltage, and resistance definitions and calculations",
      "Ohm's Law: V = IR and proportional reasoning",
      "Series and parallel circuits: rules, calculations, and analysis",
    ],
  },

  // ─── SECTION 1: CIRCUIT BASICS (20%) ────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Section 1: Circuit Basics",
    subtitle: "5 questions — 20% of grade",
  },

  {
    id: "q1", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of the following is required for current to flow in a circuit?",
    difficulty: "remember",
    options: [
      "A resistor",
      "A complete conducting path (closed loop)",
      "At least two batteries",
      "A switch in the ON position",
    ],
    correctIndex: 1,
    explanation: "A circuit needs a complete, closed conducting path for current to flow. Without a complete loop, charges have no way to return to the energy source.",
  },

  {
    id: "q2", type: "question",
    questionType: "multiple_choice",
    prompt: "A wire connected directly from the positive terminal to the negative terminal of a battery with no load is called a:",
    difficulty: "remember",
    options: [
      "Parallel circuit",
      "Open circuit",
      "Short circuit",
      "Series circuit",
    ],
    correctIndex: 2,
    explanation: "A short circuit is when current flows through a path with no load (very little resistance). All energy goes to heating the wire, which can cause fires and damage.",
  },

  {
    id: "q3", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of these materials would NOT complete a circuit and light a bulb?",
    difficulty: "understand",
    options: [
      "Copper wire",
      "Paper clip",
      "Rubber eraser",
      "Aluminum foil",
    ],
    correctIndex: 2,
    explanation: "Rubber is an insulator — its electrons are tightly bound and cannot flow. Copper wire, paper clips (metal), and aluminum foil are all conductors with free electrons.",
  },

  {
    id: "q4", type: "question",
    questionType: "multiple_choice",
    prompt: "The purpose of a fuse in a circuit is to:",
    difficulty: "understand",
    options: [
      "Increase the current",
      "Store electrical energy",
      "Break the circuit if current exceeds a safe level",
      "Convert electrical energy to light",
    ],
    correctIndex: 2,
    explanation: "A fuse is a safety device that melts and breaks the circuit when current gets too high, preventing overheating and fires.",
  },

  {
    id: "q5", type: "question",
    questionType: "multiple_choice",
    prompt: "When a switch is OPEN, the circuit is:",
    difficulty: "remember",
    options: [
      "Closed — current flows",
      "Open — no current flows",
      "Short-circuited",
      "Grounded",
    ],
    correctIndex: 1,
    explanation: "An open switch creates a break in the circuit (open circuit), so no current flows. A closed switch completes the path and allows current to flow.",
  },

  // ─── SECTION 2: CURRENT, VOLTAGE & RESISTANCE (20%) ────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Section 2: Current, Voltage & Resistance",
    subtitle: "5 questions — 20% of grade",
  },

  {
    id: "q6", type: "question",
    questionType: "multiple_choice",
    prompt: "Electric current is measured in:",
    difficulty: "remember",
    options: [
      "Volts (V)",
      "Ohms (Ω)",
      "Amperes (A)",
      "Watts (W)",
    ],
    correctIndex: 2,
    explanation: "Current is measured in amperes (A). Volts measure voltage, ohms measure resistance, and watts measure power.",
  },

  {
    id: "q7", type: "question",
    questionType: "multiple_choice",
    prompt: "8 coulombs of charge flow through a wire in 4 seconds. The current is:",
    difficulty: "apply",
    options: [
      "32 A",
      "2 A",
      "0.5 A",
      "12 A",
    ],
    correctIndex: 1,
    explanation: "I = Q/t = 8C ÷ 4s = 2A. Two coulombs of charge pass any point in the wire each second.",
  },

  {
    id: "q8", type: "question",
    questionType: "multiple_choice",
    prompt: "In the water pipe analogy, voltage is most like:",
    difficulty: "understand",
    options: [
      "The flow rate of water",
      "The width of the pipe",
      "The water pressure from the pump",
      "The amount of water in the system",
    ],
    correctIndex: 2,
    explanation: "Voltage is the 'push' that drives current, just like water pressure from a pump drives water flow. Flow rate = current, narrow pipe = resistance.",
  },

  {
    id: "q9", type: "question",
    questionType: "multiple_choice",
    prompt: "Which factor does NOT affect the resistance of a wire?",
    difficulty: "understand",
    options: [
      "The material of the wire",
      "The length of the wire",
      "The color of the wire's insulation",
      "The thickness of the wire",
    ],
    correctIndex: 2,
    explanation: "Resistance depends on material, length, thickness, and temperature. The color of the insulation is just a label — it has no effect on resistance.",
  },

  {
    id: "q10", type: "question",
    questionType: "multiple_choice",
    prompt: "A 9V battery means:",
    difficulty: "understand",
    options: [
      "It stores 9 coulombs of charge",
      "It delivers 9 amperes of current",
      "It maintains a 9-volt potential difference between its terminals",
      "It has a resistance of 9 ohms",
    ],
    correctIndex: 2,
    explanation: "A 9V battery maintains a 9-volt potential difference. This means every coulomb of charge that flows through it gains 9 joules of energy.",
  },

  // ─── SECTION 3: OHM'S LAW (30%) ────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Section 3: Ohm's Law",
    subtitle: "6 questions — 30% of grade",
  },

  {
    id: "q11", type: "question",
    questionType: "multiple_choice",
    prompt: "A 12V battery is connected to a 4Ω resistor. The current is:",
    difficulty: "apply",
    options: [
      "48 A",
      "3 A",
      "0.33 A",
      "16 A",
    ],
    correctIndex: 1,
    explanation: "I = V/R = 12V ÷ 4Ω = 3A.",
  },

  {
    id: "q12", type: "question",
    questionType: "multiple_choice",
    prompt: "A current of 0.5A flows through a 100Ω resistor. The voltage across the resistor is:",
    difficulty: "apply",
    options: [
      "200 V",
      "50 V",
      "0.005 V",
      "100.5 V",
    ],
    correctIndex: 1,
    explanation: "V = IR = 0.5A × 100Ω = 50V.",
  },

  {
    id: "q13", type: "question",
    questionType: "multiple_choice",
    prompt: "A device draws 5A when connected to a 120V outlet. Its resistance is:",
    difficulty: "apply",
    options: [
      "600 Ω",
      "24 Ω",
      "0.042 Ω",
      "125 Ω",
    ],
    correctIndex: 1,
    explanation: "R = V/I = 120V ÷ 5A = 24Ω.",
  },

  {
    id: "q14", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit draws 4A. If the voltage is tripled (resistance unchanged), the new current is:",
    difficulty: "apply",
    options: [
      "4 A",
      "12 A",
      "1.33 A",
      "64 A",
    ],
    correctIndex: 1,
    explanation: "I ∝ V (direct proportion). Triple the voltage → triple the current. 4A × 3 = 12A.",
  },

  {
    id: "q15", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit draws 6A. If the resistance is doubled (voltage unchanged), the new current is:",
    difficulty: "apply",
    options: [
      "12 A",
      "6 A",
      "3 A",
      "1.5 A",
    ],
    correctIndex: 2,
    explanation: "I ∝ 1/R (inverse proportion). Double the resistance → halve the current. 6A ÷ 2 = 3A.",
  },

  {
    id: "q16", type: "question",
    questionType: "short_answer",
    prompt: "A 24V battery is connected to an 8Ω resistor.\n\n(a) What is the current? (show work)\n(b) How much charge flows in 2 minutes (120 seconds)?\n(c) How much energy does the battery deliver in those 2 minutes? (Hint: W = qΔV)",
    difficulty: "apply",
  },

  // ─── SECTION 4: SERIES & PARALLEL (30%) ─────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔀",
    title: "Section 4: Series & Parallel Circuits",
    subtitle: "6 questions — 30% of grade",
  },

  {
    id: "q17", type: "question",
    questionType: "multiple_choice",
    prompt: "In a series circuit, current:",
    difficulty: "remember",
    options: [
      "Is different through each component",
      "Is the same through all components",
      "Only flows through the largest resistor",
      "Doubles at each component",
    ],
    correctIndex: 1,
    explanation: "In series, there's only one path — all charge must flow through every component. Current is the same everywhere.",
  },

  {
    id: "q18", type: "question",
    questionType: "multiple_choice",
    prompt: "Three resistors of 5Ω, 10Ω, and 15Ω are connected in series. The total resistance is:",
    difficulty: "apply",
    options: [
      "30 Ω",
      "2.73 Ω",
      "10 Ω",
      "15 Ω",
    ],
    correctIndex: 0,
    explanation: "Series: R_total = R₁ + R₂ + R₃ = 5 + 10 + 15 = 30Ω. Resistances simply add up.",
  },

  {
    id: "q19", type: "question",
    questionType: "multiple_choice",
    prompt: "In a parallel circuit, voltage:",
    difficulty: "remember",
    options: [
      "Splits across the branches",
      "Is zero in all branches",
      "Is the same across all branches",
      "Is highest in the branch with the most resistance",
    ],
    correctIndex: 2,
    explanation: "In parallel, every branch connects directly to the battery, so every branch gets the full battery voltage.",
  },

  {
    id: "q20", type: "question",
    questionType: "multiple_choice",
    prompt: "Two 10Ω resistors are connected in parallel. The total resistance is:",
    difficulty: "apply",
    options: [
      "20 Ω",
      "10 Ω",
      "5 Ω",
      "0.2 Ω",
    ],
    correctIndex: 2,
    explanation: "R_total = (R₁ × R₂)/(R₁ + R₂) = (10 × 10)/(10 + 10) = 100/20 = 5Ω. Two identical resistors in parallel give half the resistance of one.",
  },

  {
    id: "q21", type: "question",
    questionType: "multiple_choice",
    prompt: "Three identical bulbs are in parallel. One burns out. The other two:",
    difficulty: "understand",
    options: [
      "Go completely dark",
      "Get dimmer",
      "Stay at the same brightness",
      "Get brighter",
    ],
    correctIndex: 2,
    explanation: "Each parallel branch is independent. Removing one branch doesn't change the voltage or resistance of the others, so brightness stays the same.",
  },

  {
    id: "q22", type: "question",
    questionType: "short_answer",
    prompt: "A 24V battery is connected to a 6Ω and a 12Ω resistor in parallel.\n\n(a) Calculate the total resistance. (show work)\n(b) Calculate the total current from the battery.\n(c) Calculate the current through each resistor.\n(d) Verify that the branch currents add up to the total current.\n(e) Which resistor carries more current? Why does this make sense?",
    difficulty: "apply",
  },

  // ─── BONUS ──────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⭐",
    title: "Bonus",
    subtitle: "Extra credit",
  },

  {
    id: "q-bonus", type: "question",
    questionType: "short_answer",
    prompt: "Design challenge: You have a 12V battery, four identical 4Ω light bulbs, one master switch, and one independent switch. Draw or describe a circuit where:\n- The master switch turns off ALL 4 bulbs\n- The independent switch controls exactly 2 of the 4 bulbs (the other 2 stay on)\n- All 4 bulbs are as bright as possible\n\nExplain your wiring choices and calculate the total current when all switches are closed.",
    difficulty: "create",
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("circuits-assessment");

  const data = {
    title: "Circuits Unit Assessment",
    questionOfTheDay: "How well can you apply everything you learned about circuits — from Ohm's Law to series and parallel wiring?",
    course: "Physics",
    unit: "Circuits",
    order: 6,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/circuits-assessment`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
