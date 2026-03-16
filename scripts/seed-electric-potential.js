// seed-electric-potential.js
// Physics — Electrostatics Unit, Lesson 4 (order: 4)
// "Electric Potential & Voltage"
// Run: node scripts/seed-electric-potential.js

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
      "Define electric potential and electric potential energy",
      "Explain voltage as a potential difference between two points",
      "Calculate work done on a charge moving through a potential difference (W = qΔV)",
      "Connect electric potential to gravitational potential energy by analogy",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A 9V battery and a 1.5V battery both push electrons. What does the '9V' actually mean, and why does it matter for the device you're powering?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You've heard the word 'voltage' your whole life — batteries, outlets, lightning warnings. But what do you think voltage actually measures? Take your best guess.",
    difficulty: "remember",
  },

  // ─── THE GRAVITY ANALOGY ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🏔️",
    title: "The Gravity Analogy",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Before we define electric potential, let's revisit something familiar: **gravitational potential energy** (GPE = mgh).\n\n| Gravity | Electricity |\n|---|---|\n| Mass creates gravitational field | Charge creates electric field |\n| Objects \"fall\" from high to low altitude | Positive charges \"fall\" from high to low potential |\n| GPE = mgh | EPE = qV |\n| Height (h) = position in the gravitational field | Potential (V) = position in the electric field |\n| Falling converts GPE → KE | Charges moving through potential difference convert EPE → KE |\n\nJust like a ball on a hill has gravitational PE because of its **height**, a charge in an electric field has electric PE because of its **potential**.\n\n**Potential is to electricity what height is to gravity.**",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**The hill analogy:** Imagine a hill with positive charge at the top. A positive test charge at the top has high potential energy — just like a ball at the top of a hill. Let it go, and it \"rolls downhill\" from high potential to low potential, gaining kinetic energy as it goes. That's current flow in a wire.",
  },

  // ─── ELECTRIC POTENTIAL ────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "Electric Potential (V)",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Electric potential** at a point is the electric potential energy per unit charge:\n\n## V = EPE / q\n\nWhere:\n- **V** = electric potential (volts, V)\n- **EPE** = electric potential energy (joules, J)\n- **q** = charge (coulombs, C)\n\n**1 volt = 1 joule per coulomb.** A point with potential of 9V means every coulomb of charge at that point has 9 joules of potential energy.\n\nThe unit is named after Alessandro Volta, who invented the first battery in 1800.",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Potential (V)",
    definition: "The electric potential energy per unit charge at a point in space. V = EPE/q. Measured in volts (V). 1 volt = 1 joule per coulomb. High potential = high energy per charge.",
  },

  {
    id: uid(), type: "definition",
    term: "Volt (V)",
    definition: "The SI unit of electric potential. 1 V = 1 J/C. Named after Alessandro Volta. Common values: AA battery (1.5 V), car battery (12 V), US outlet (120 V), lightning (~300,000,000 V).",
  },

  {
    id: uid(), type: "text",
    content: "**What matters is the DIFFERENCE:**\n\nA single point's potential is less useful than the **potential difference** between two points. We call this **voltage**:\n\n## ΔV = V_high − V_low\n\nVoltage is what drives current in a circuit. A 9V battery maintains a 9-volt difference between its terminals — positive terminal at higher potential, negative terminal at lower potential.\n\nWhen a charge moves through a potential difference, work is done:\n\n## W = qΔV\n\nWhere:\n- **W** = work done on the charge (joules, J)\n- **q** = charge (coulombs, C)\n- **ΔV** = potential difference (volts, V)",
  },

  {
    id: uid(), type: "definition",
    term: "Voltage (Potential Difference)",
    definition: "The difference in electric potential between two points. ΔV = V_high − V_low. Measured in volts. Voltage drives current flow — charges move from high potential to low potential.",
  },

  {
    id: "q-voltage", type: "question",
    questionType: "multiple_choice",
    prompt: "A 12V car battery means:",
    difficulty: "understand",
    options: [
      "It stores 12 coulombs of charge",
      "It maintains a 12-volt potential difference between its terminals",
      "It can deliver 12 joules of energy total",
      "It pushes electrons at 12 m/s",
    ],
    correctIndex: 1,
    explanation: "A 12V battery maintains a 12-volt potential difference. This means every coulomb of charge that flows through the battery gains 12 joules of energy (W = qΔV = 1 × 12 = 12 J per coulomb).",
  },

  // ─── CALCULATING WORK ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "Work and Potential Difference",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**W = qΔV** connects everything:\n\n- A battery provides the ΔV (potential difference)\n- Charge q flows through the circuit\n- The battery does work W on each charge\n- That work becomes kinetic energy, light, heat, or whatever the device does\n\n**Example:** How much energy does a 9V battery give to 0.5 C of charge?\n\nW = qΔV = 0.5 C × 9 V = **4.5 J**\n\nEvery half-coulomb of charge picks up 4.5 joules of energy as it passes through the battery.",
  },

  {
    id: uid(), type: "calculator",
    title: "Work from Voltage Calculator",
    description: "Calculate the work done on a charge moving through a potential difference.\n\nW = q × ΔV",
    formula: "q * dV",
    showFormula: true,
    inputs: [
      { name: "q", label: "Charge", unit: "C" },
      { name: "dV", label: "Potential difference", unit: "V" },
    ],
    output: { label: "Work done", unit: "J", decimals: 4 },
  },

  {
    id: "q-calc-practice", type: "question",
    questionType: "short_answer",
    prompt: "Use the calculator to solve:\n\n1. A charge of 2 C moves through a potential difference of 120 V (like a US outlet). How much work is done?\n2. A charge of 5 μC (5 × 10⁻⁶ C) moves through 500 V. How much work is done?\n3. A lightning bolt transfers about 5 C through 300,000,000 V. How much energy is released?\n\nShow your work for #3 without the calculator.",
    difficulty: "apply",
  },

  // ─── POTENTIAL ENERGY ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Electric Potential Energy",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Electric potential energy (EPE)** between two charges:\n\n- **Like charges close together** → **positive EPE** (energy stored in repulsion, like a compressed spring)\n- **Opposite charges close together** → **negative EPE** (energy stored in attraction, like a ball at the bottom of a hill)\n- **Charges infinitely far apart** → **zero EPE** (no interaction)\n\nWhen charges are released:\n- Like charges fly apart (EPE → KE)\n- Opposite charges crash together (EPE → KE)\n\nIt's the same principle as gravitational PE: things \"fall\" from high energy to low energy, releasing KE along the way.",
  },

  {
    id: "q-epe", type: "question",
    questionType: "multiple_choice",
    prompt: "Two positive charges are held close together and then released. As they fly apart, their electric potential energy:",
    difficulty: "understand",
    options: [
      "Increases — they're gaining speed",
      "Decreases — it converts to kinetic energy",
      "Stays the same — energy is conserved",
      "Becomes negative — they're moving apart",
    ],
    correctIndex: 1,
    explanation: "As the like charges repel and fly apart, EPE decreases and KE increases. Total energy is conserved (EPE + KE = constant), but the split changes. Just like a ball rolling downhill converts GPE to KE.",
  },

  // ─── EVERYDAY VOLTAGES ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔋",
    title: "Voltages in the Real World",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "| Source | Voltage | What it means |\n|---|---|---|\n| Nerve impulse | ~0.07 V | Tiny signal, but enough for neurons |\n| AAA/AA battery | 1.5 V | 1.5 J per coulomb |\n| USB charger | 5 V | Enough to charge a phone |\n| 9V battery | 9 V | Powers smoke detectors |\n| Car battery | 12 V | Starts the engine |\n| US wall outlet | 120 V | Powers your house |\n| European outlet | 230 V | Higher voltage = more energy per charge |\n| Power lines | 500,000 V | High voltage for efficient long-distance transmission |\n| Lightning | ~300,000,000 V | Enough to breach 5 km of insulating air |\n\n**Higher voltage ≠ more charge.** It means more **energy per charge**. A Van de Graaff generator can produce 200,000 V — but the actual charge is tiny, so the total energy is small (that's why it only shocks you, not kills you).",
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
    prompt: "A charge of 3 μC moves through a potential difference of 500 V. The work done on the charge is:",
    difficulty: "apply",
    options: [
      "1,500 J",
      "0.0015 J",
      "150 J",
      "0.006 J",
    ],
    correctIndex: 1,
    explanation: "W = qΔV = (3 × 10⁻⁶ C)(500 V) = 1.5 × 10⁻³ J = 0.0015 J. Remember to convert μC to C first!",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "As a positive charge moves from high potential to low potential (\"downhill\" in the electric field), its:",
    difficulty: "understand",
    options: [
      "KE increases, EPE increases",
      "KE decreases, EPE decreases",
      "KE increases, EPE decreases",
      "KE stays the same, EPE decreases",
    ],
    correctIndex: 2,
    explanation: "Just like a ball rolling downhill: PE decreases and KE increases. The charge speeds up as it \"falls\" through the potential difference. Total energy stays constant (conservation of energy).",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "Explain the analogy between gravitational PE and electric PE in your own words. Specifically: (a) What is the electric equivalent of 'height'? (b) What is the electric equivalent of 'mass'? (c) What is the electric equivalent of 'falling'? Use at least three vocabulary terms from this lesson.",
    difficulty: "analyze",
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
    content: "**Key equations:**\n\n- **V = EPE / q** — electric potential is energy per charge\n- **W = qΔV** — work done = charge × voltage\n- **1 volt = 1 joule per coulomb**\n\n**Key ideas:**\n- Potential is to electricity what height is to gravity\n- Voltage (potential difference) drives current — charges flow from high to low potential\n- Higher voltage = more energy transferred per charge, not more charge\n- EPE between like charges is positive (repulsion). Between opposite charges, negative (attraction).\n\n**Coming up next: Circuits.** Voltage, current, and resistance — Ohm's Law and how everything you've learned about charge, fields, and potential comes together in the wires that power your life.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** The '9V' on a battery means it maintains a 9-volt potential difference between its terminals. Every coulomb of charge that flows through it gains 9 joules of energy (W = qΔV = 1 × 9 = 9 J). A 1.5V battery only gives 1.5 J per coulomb — less energy per charge. A 9V battery doesn't hold more charge; it pushes each charge harder. That's why your TV remote works fine on 1.5V AAs, but a smoke detector needs the higher push of a 9V.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up guess about what voltage means. Now define it precisely using physics vocabulary. Were you close?",
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
      { term: "Electric Potential (V)", definition: "Energy per unit charge at a point. V = EPE/q. Measured in volts. High potential = lots of energy per charge." },
      { term: "Volt (V)", definition: "SI unit of electric potential. 1 V = 1 J/C. Named after Alessandro Volta." },
      { term: "Voltage (Potential Difference)", definition: "The difference in electric potential between two points. ΔV = V_high − V_low. What drives current in circuits." },
      { term: "Electric Potential Energy (EPE)", definition: "Energy stored due to the position of charges. Positive for like charges (repulsion), negative for opposite charges (attraction)." },
      { term: "Work (W = qΔV)", definition: "Energy transferred when a charge moves through a potential difference. W = charge × voltage." },
      { term: "Electron-volt (eV)", definition: "A tiny unit of energy. 1 eV = energy gained by one electron moving through 1 V = 1.6 × 10⁻¹⁹ J. Used in atomic/nuclear physics." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("electric-potential");

  const data = {
    title: "Electric Potential & Voltage",
    questionOfTheDay: "A 9V battery and a 1.5V battery both push electrons. What does the '9V' actually mean, and why does it matter for the device you're powering?",
    course: "Physics",
    unit: "Electrostatics",
    order: 4,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/electric-potential`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
