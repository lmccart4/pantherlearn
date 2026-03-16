// seed-current-voltage-resistance.js
// Physics — Circuits Unit, Lesson 2 (order: 2)
// "Current, Voltage & Resistance"
// Run: node scripts/seed-current-voltage-resistance.js

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
      "Define current, voltage, and resistance with units",
      "Calculate current using I = Q/t",
      "Explain how voltage, current, and resistance are related (Ohm's Law preview)",
      "Read and interpret circuit diagrams using standard symbols",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A US wall outlet provides 120 volts. A car battery provides 12 volts. A phone charger provides 5 volts. If they all push charge through wires, why do some things need more voltage than others?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "In yesterday's simulation, adding a resistor made the bulb dimmer. Adding a second bulb also made both bulbs dimmer. Why do you think adding more 'stuff' to a circuit reduces the brightness of the bulbs?",
    difficulty: "understand",
  },

  // ─── THE WATER PIPE MODEL ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "💧",
    title: "The Water Pipe Analogy",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Before we define anything, let's build a mental model. Imagine water flowing through pipes:\n\n| Water System | Electric Circuit |\n|---|---|\n| Water pump | Battery |\n| Water pressure | **Voltage** (V) |\n| Flow rate (liters/sec) | **Current** (I) |\n| Narrow pipe or filter | **Resistance** (R) |\n| Water wheel (does work) | Light bulb (load) |\n\n- **Higher pressure** (voltage) → water flows faster (more current)\n- **Narrower pipe** (more resistance) → water flows slower (less current)\n- **Pump** (battery) creates the pressure difference that drives the flow\n\nThis isn't a perfect analogy, but it captures the key relationships:\n- **Voltage pushes.** Current flows. Resistance opposes.",
  },

  {
    id: uid(), type: "image",
    url: "https://drive.google.com/file/d/1llJJrmwWfakVWYai-51BIjZH55yWOYts/view?usp=sharing",
    alt: "Side-by-side comparison of a water pipe system and an electric circuit, showing how pump equals battery, pressure equals voltage, flow rate equals current, and narrow pipe equals resistance",
    caption: "The water pipe analogy: voltage is pressure, current is flow, resistance is a narrow pipe",
  },

  // ─── CURRENT ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🌊",
    title: "Current (I)",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Electric current** is the rate of charge flow — how much charge passes a point per second.\n\n## I = Q / t\n\nWhere:\n- **I** = current (amperes, A)\n- **Q** = charge (coulombs, C)\n- **t** = time (seconds, s)\n\n**1 ampere = 1 coulomb per second.** If 1 coulomb of charge flows past a point every second, the current is 1 A.\n\nThe unit is named after André-Marie Ampère, a French physicist who studied electromagnetism in the 1820s.",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Current (I)",
    definition: "The rate of flow of electric charge through a conductor. I = Q/t. Measured in amperes (A). 1 A = 1 C/s. Current flows from high potential (+) to low potential (−) by convention.",
  },

  {
    id: uid(), type: "definition",
    term: "Ampere (A)",
    definition: "The SI unit of electric current. 1 ampere = 1 coulomb of charge flowing past a point per second. Named after André-Marie Ampère.",
  },

  {
    id: uid(), type: "text",
    content: "**Typical currents in everyday devices:**\n\n| Device | Current |\n|---|---|\n| LED light | ~0.02 A (20 mA) |\n| Phone charging | ~1–2 A |\n| Laptop charging | ~2–3 A |\n| Toaster | ~7 A |\n| Hair dryer | ~10 A |\n| Electric car charger | ~30–50 A |\n| Lightning bolt | ~20,000 A |\n\n**Safety note:** As little as **0.1 A (100 mA)** through the human body can be fatal. That's less current than your phone charger delivers. It's not the voltage that kills — it's the current through your body.",
  },

  {
    id: "q-current-calc", type: "question",
    questionType: "short_answer",
    prompt: "A phone charger delivers 2 coulombs of charge every second. What is the current? If the charger runs for 1 hour (3600 s), how much total charge flows through the cable?",
    difficulty: "apply",
  },

  {
    id: uid(), type: "calculator",
    title: "Current Calculator",
    description: "Calculate current from charge and time.\n\nI = Q / t",
    formula: "Q / t",
    showFormula: true,
    inputs: [
      { name: "Q", label: "Charge", unit: "C" },
      { name: "t", label: "Time", unit: "s" },
    ],
    output: { label: "Current", unit: "A", decimals: 4 },
  },

  // ─── VOLTAGE ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔋",
    title: "Voltage (V)",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You already know this one from electrostatics! **Voltage** is the potential difference between two points — the energy per unit charge.\n\n## V = W / q\n\nWhere:\n- **V** = voltage (volts, V)\n- **W** = energy or work (joules, J)\n- **q** = charge (coulombs, C)\n\nIn a circuit, the battery provides the voltage. It does work on each charge, giving it energy to flow through the circuit. The load (light bulb, motor, etc.) uses that energy.\n\n**The battery is the pump. Voltage is the pressure. Current is the flow.**\n\nA 9V battery gives every coulomb of charge 9 joules of energy. A 1.5V AA battery gives only 1.5 joules per coulomb — same concept, less push.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Voltage vs. current — what's the difference?**\n\n- **Voltage** = how hard the charges are pushed (energy per charge)\n- **Current** = how many charges flow per second\n\nYou can have high voltage with low current (static shock — lots of push, tiny amount of charge) or low voltage with high current (car battery starting an engine — moderate push, enormous flow).",
  },

  // ─── RESISTANCE ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🚧",
    title: "Resistance (R)",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Resistance** is how much a material opposes the flow of current. More resistance = less current for the same voltage.\n\n## R = V / I\n\nWhere:\n- **R** = resistance (ohms, Ω)\n- **V** = voltage (volts, V)\n- **I** = current (amperes, A)\n\n**1 ohm** means: if you apply 1 volt, you get 1 amp of current.\n\nThe unit is named after Georg Ohm, who discovered the relationship between voltage, current, and resistance in 1827.",
  },

  {
    id: uid(), type: "definition",
    term: "Resistance (R)",
    definition: "A measure of how much a material opposes the flow of electric current. R = V/I. Measured in ohms (Ω). Higher resistance = less current for the same voltage.",
  },

  {
    id: uid(), type: "definition",
    term: "Ohm (Ω)",
    definition: "The SI unit of resistance. 1 Ω = 1 V/A. Named after Georg Ohm. A 1-ohm resistor allows 1 amp of current when 1 volt is applied.",
  },

  {
    id: uid(), type: "text",
    content: "**What affects resistance?**\n\n| Factor | Effect on Resistance |\n|---|---|\n| **Material** | Copper has low R (good conductor). Rubber has very high R (insulator). |\n| **Length** | Longer wire → more resistance (more material to push through) |\n| **Thickness** | Thicker wire → less resistance (wider path for current) |\n| **Temperature** | Hotter → more resistance in most metals (atoms vibrate more, blocking flow) |\n\n**Why this matters:** This is why power lines are made of thick copper or aluminum — low resistance means less energy wasted as heat. And why a thin tungsten filament in an old-fashioned light bulb has high resistance — it gets so hot it glows.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**That explains yesterday's simulation!** When you added a resistor, the bulb got dimmer because the resistor increased the total resistance → less current flowed → less energy delivered to the bulb. A second bulb did the same thing — each bulb acts as a resistor too!",
  },

  // ─── CIRCUIT SYMBOLS ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Circuit Diagram Symbols",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Circuit diagrams use standardized symbols so engineers worldwide can read them. Here are the ones you need to know:\n\n| Component | Symbol Description |\n|---|---|\n| **Battery** | Two parallel lines: long thin line (+) and short thick line (−) |\n| **Wire** | Straight line |\n| **Light bulb** | Circle with an X inside |\n| **Resistor** | Zigzag line (US) or rectangle (international) |\n| **Switch (open)** | Gap with a dot on each end |\n| **Switch (closed)** | Line connecting two dots |\n| **Fuse** | Small rectangle or S-curve |\n| **Ammeter** | Circle with \"A\" inside (measures current — connected in series) |\n| **Voltmeter** | Circle with \"V\" inside (measures voltage — connected in parallel) |\n\n**Rules for drawing circuit diagrams:**\n1. Use straight lines (no curves or artistic flair)\n2. Components sit on the lines, not floating\n3. The circuit must form a complete loop\n4. Label components and values (e.g., \"R = 10 Ω\")",
  },

  {
    id: uid(), type: "image",
    url: "https://drive.google.com/file/d/18piN9F_YxOYJ0Vh-zbpCJYK07bM-UwDo/view?usp=sharing",
    alt: "Reference chart showing standard circuit diagram symbols: battery, wire, light bulb, resistor, open switch, closed switch, fuse, ammeter, and voltmeter",
    caption: "Standard circuit diagram symbols — memorize these for drawing schematics",
  },

  // ─── OHM'S LAW PREVIEW ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔗",
    title: "Putting It Together: Ohm's Law",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Voltage, current, and resistance are connected by one elegant equation:\n\n## V = IR\n\nThis is **Ohm's Law** — the single most important equation in circuits.\n\n- **V = IR** → Voltage = Current × Resistance\n- **I = V/R** → Current = Voltage ÷ Resistance\n- **R = V/I** → Resistance = Voltage ÷ Current\n\n**What it means in plain English:**\n- More voltage → more current (turn up the push, more flow)\n- More resistance → less current (block the path, less flow)\n- To get the same current through a higher resistance, you need more voltage\n\nWe'll practice calculations with Ohm's Law next class. For now, just understand the relationship.",
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
    prompt: "5 coulombs of charge flow through a wire in 10 seconds. The current is:",
    difficulty: "apply",
    options: [
      "50 A",
      "2 A",
      "0.5 A",
      "15 A",
    ],
    correctIndex: 2,
    explanation: "I = Q/t = 5 C ÷ 10 s = 0.5 A. Half a coulomb per second flows through the wire.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "In the water pipe analogy, resistance is most like:",
    difficulty: "understand",
    options: [
      "The water pump",
      "The flow rate of water",
      "A narrow section of pipe",
      "The water pressure",
    ],
    correctIndex: 2,
    explanation: "Resistance opposes current flow, just like a narrow pipe opposes water flow. The pump is the battery (provides voltage/pressure), flow rate is current, and water pressure is voltage.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "A circuit has a 12V battery and a resistance of 6 Ω. Using V = IR, the current is:",
    difficulty: "apply",
    options: [
      "72 A",
      "2 A",
      "0.5 A",
      "18 A",
    ],
    correctIndex: 1,
    explanation: "I = V/R = 12V ÷ 6Ω = 2 A. This is Ohm's Law — you'll practice many more of these next class.",
  },

  {
    id: "q-check4", type: "question",
    questionType: "short_answer",
    prompt: "Explain in your own words: why does increasing resistance decrease current? Use the water pipe analogy to support your explanation.",
    difficulty: "understand",
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
    content: "**The three pillars of circuits:**\n\n- **Voltage (V)** = energy per charge = the push (volts, V)\n- **Current (I)** = charge flow per second = the flow (amperes, A)\n- **Resistance (R)** = opposition to current = the restriction (ohms, Ω)\n\n**Key equations:**\n- I = Q/t (current = charge ÷ time)\n- V = W/q (voltage = energy ÷ charge)\n- V = IR (Ohm's Law — ties all three together)\n\n**Coming up next:** Ohm's Law calculations — you'll solve for V, I, or R and master proportional reasoning (double the voltage → what happens to current?).",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Different devices need different voltages because they have different resistances and require different amounts of current. A wall outlet (120V) powers high-resistance, high-power devices like toasters and hair dryers. A phone charger (5V) powers a low-resistance phone circuit. V = IR — more resistance and more required current means you need more voltage to push it through.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about why adding resistors and bulbs made things dimmer. Now explain it precisely using the terms current, resistance, and Ohm's Law.",
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
      { term: "Current (I)", definition: "Rate of charge flow. I = Q/t. Measured in amperes (A). 1 A = 1 C/s." },
      { term: "Voltage (V)", definition: "Energy per unit charge (potential difference). V = W/q. Measured in volts (V). The 'push' that drives current." },
      { term: "Resistance (R)", definition: "Opposition to current flow. R = V/I. Measured in ohms (Ω). Depends on material, length, thickness, temperature." },
      { term: "Ampere (A)", definition: "Unit of current. 1 A = 1 coulomb of charge per second." },
      { term: "Ohm (Ω)", definition: "Unit of resistance. 1 Ω means 1 V produces 1 A of current." },
      { term: "Ohm's Law", definition: "V = IR. Voltage equals current times resistance. The fundamental relationship in circuit analysis." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("current-voltage-resistance");

  const data = {
    title: "Current, Voltage & Resistance",
    questionOfTheDay: "A US wall outlet provides 120 volts. A car battery provides 12 volts. A phone charger provides 5 volts. If they all push charge through wires, why do some things need more voltage than others?",
    course: "Physics",
    unit: "Circuits",
    order: 2,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/current-voltage-resistance`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
