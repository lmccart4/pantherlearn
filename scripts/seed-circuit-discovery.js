// seed-circuit-discovery.js
// Physics — Circuits Unit, Lesson 1 (order: 1)
// "Circuit Discovery"
// Run: node scripts/seed-circuit-discovery.js

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
      "Identify the components needed to build a complete circuit",
      "Explain what current is and what causes it to flow",
      "Distinguish between conductors and insulators using experimental evidence",
      "Describe the function of a switch, resistor, and fuse in a circuit",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Your phone has a battery, a screen, a speaker, and a processor — all connected by tiny wires. What has to be true about those connections for any of it to work?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You flip a light switch and the room lights up. What do you think is physically happening between the switch on the wall and the bulb on the ceiling? Describe the chain of events as best you can.",
    difficulty: "understand",
  },

  // ─── WHAT IS A CIRCUIT? ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔄",
    title: "What is a Circuit?",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "A **circuit** is a closed loop that allows electric charge to flow continuously. The word comes from the Latin *circuitus* — \"going around.\"\n\nFor a circuit to work, you need:\n\n1. **An energy source** — a battery or power supply that provides voltage (the \"push\")\n2. **A conducting path** — wires that connect everything (the \"road\")\n3. **A load** — something that uses the energy (a light bulb, motor, speaker, etc.)\n4. **A complete loop** — the path must go from the battery, through the load, and back to the battery with no breaks\n\nIf any part of the loop is broken — a wire disconnected, a switch open, a bulb burned out — current stops flowing everywhere. This is called an **open circuit**.\n\nWhen everything is connected and current flows, it's a **closed circuit**.",
  },

  {
    id: uid(), type: "definition",
    term: "Circuit",
    definition: "A closed loop of conducting material that allows electric charge to flow continuously from an energy source, through a load, and back. If the loop is broken at any point, current stops flowing.",
  },

  {
    id: uid(), type: "definition",
    term: "Open Circuit",
    definition: "A circuit with a break in the conducting path. No current flows. Examples: a switch in the OFF position, a disconnected wire, a burned-out bulb.",
  },

  {
    id: uid(), type: "definition",
    term: "Closed Circuit",
    definition: "A circuit with a complete, unbroken conducting path. Current flows continuously from the energy source through the load and back.",
  },

  {
    id: uid(), type: "text",
    content: "**Connection to electrostatics:** Remember voltage (potential difference)? A battery maintains a voltage between its terminals — positive terminal at high potential, negative at low potential. Charges \"fall\" from high to low potential through the wire, just like a ball rolls downhill. That flow of charge is **current**.\n\nThe battery is like a pump that lifts the charges back up to high potential so they can flow through the circuit again. It's a continuous cycle — that's why it's called a circuit.",
  },

  // ─── CURRENT ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Current: Charge in Motion",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Electric current** is the flow of electric charge through a conductor.\n\nIn metals (like copper wire), the charges that move are **electrons** — negative charges flowing from the negative terminal to the positive terminal. But by historical convention, we define current direction as the way **positive charges would flow**: from + to −. This is called **conventional current**.\n\nDon't worry about which way is \"right\" — both descriptions give the same results. Just know that when we say \"current flows from + to −,\" we're using the conventional direction.\n\nIn the PhET simulation, you'll actually see the charges moving — watch which direction they go!",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Current",
    definition: "The flow of electric charge through a conductor. Conventional current flows from positive to negative (high potential to low potential). Measured in amperes (A).",
  },

  // ─── PHET DISCOVERY LAB ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔬",
    title: "Discovery Lab: PhET Circuit Simulation",
    subtitle: "~20 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Time to explore! You'll use the PhET Circuit Construction Kit to discover how circuits work — before we ever touch real equipment.\n\nOpen the simulation and start building. The instructions below will guide you through key discoveries.",
  },

  {
    id: uid(), type: "embed",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
    caption: "PhET Circuit Construction Kit DC — click components to add them, drag wires to connect",
    height: 600,
    scored: false,
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Sim tips:** Click a component from the toolbox to add it. Drag wire endpoints to connect components. Right-click to delete. Use the voltmeter and ammeter from the toolbox to measure voltage and current.",
  },

  {
    id: "q-light-bulb", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 1:** Can you get a light bulb to light up? Describe what components you used and how you connected them. What was the minimum setup needed?",
    difficulty: "apply",
  },

  {
    id: "q-fire", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 2:** Can you create a circuit that causes a fire in the simulation? (Yes, really.) Describe what you did. Why do you think the fire happened? What does this tell you about what a wire without a load does?",
    difficulty: "apply",
  },

  {
    id: uid(), type: "callout",
    icon: "🔥", style: "warning",
    content: "**Short circuit:** When you connect a battery directly to itself with just a wire (no load), all the energy goes into heating the wire — that's a **short circuit**. In real life, this can cause fires, melt wires, or explode batteries. That's why fuses and circuit breakers exist.",
  },

  {
    id: uid(), type: "definition",
    term: "Short Circuit",
    definition: "A circuit where current flows through a path with very little resistance (like a wire with no load). All energy converts to heat. Extremely dangerous in real circuits — can cause fires and damage equipment.",
  },

  {
    id: "q-switch", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 3:** Add a switch to your circuit so you can turn the bulb on and off. What is the purpose of a switch? When the switch is open, is the circuit open or closed?",
    difficulty: "understand",
  },

  {
    id: "q-resistor", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 4:** Add a resistor to your working circuit (keep the bulb too). What happens to the brightness of the bulb? Why do you think this happened?",
    difficulty: "understand",
  },

  {
    id: "q-two-bulbs", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 5:** Replace the resistor with a second light bulb (so you have two bulbs in a line). What do you notice about the brightness of both bulbs compared to when there was only one? Why?",
    difficulty: "analyze",
  },

  // ─── MATERIALS TESTING ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧪",
    title: "Conductors vs. Insulators",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Now let's test which materials allow current to flow. In your circuit with one bulb, replace one section of wire with different objects from the sim's toolbox. Record whether the bulb lights up and how bright it is.\n\nTest these materials and fill in your observations:",
  },

  {
    id: "q-materials", type: "question",
    questionType: "short_answer",
    prompt: "Test each material in the simulation by placing it in your circuit. For each one, record: (1) Does the bulb light? (2) Brightness (bright / dim / off).\n\nMaterials to test:\n- Wire\n- Resistor\n- Open switch vs. closed switch\n- Fuse\n- Dollar bill\n- Paper clip\n- Coin\n- Eraser\n- Pencil\n\nAfter testing, answer: What do the objects that light the bulb have in common? What do the objects that DON'T light the bulb have in common?",
    difficulty: "analyze",
  },

  {
    id: uid(), type: "text",
    content: "**What you should have found:**\n\n- **Conductors** (wire, paper clip, coin, closed switch, pencil lead) — these are mostly **metals**. Metals have free electrons that can move through the material, carrying charge.\n- **Insulators** (dollar bill, eraser, open switch, rubber) — these materials hold their electrons tightly. Charge cannot flow through them.\n\n| Conductors | Insulators |\n|---|---|\n| Metals (copper, iron, aluminum) | Rubber |\n| Paper clip, coin | Paper, cloth |\n| Pencil (graphite core) | Plastic, glass |\n| Salt water | Pure water, air |\n\nThis connects back to electrostatics: conductors let charges move freely, insulators don't. Same concept, now applied to circuits.",
  },

  {
    id: uid(), type: "definition",
    term: "Conductor",
    definition: "A material that allows electric charge to flow through it easily. Metals are the best conductors because they have free electrons. Examples: copper, aluminum, iron, gold.",
  },

  {
    id: uid(), type: "definition",
    term: "Insulator",
    definition: "A material that resists the flow of electric charge. Electrons are tightly bound and cannot move freely. Examples: rubber, plastic, glass, paper, air.",
  },

  // ─── CIRCUIT COMPONENTS ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔧",
    title: "Circuit Components",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Here's a summary of the components you discovered today:\n\n| Component | Symbol | Function |\n|---|---|---|\n| **Battery** | −\\|\\|+ | Provides voltage (the \"push\" for charges) |\n| **Wire** | — | Conducts current from one component to the next |\n| **Light bulb** | ⊗ | Converts electrical energy to light and heat |\n| **Resistor** | ∿ | Limits current flow (reduces brightness) |\n| **Switch** | ⊜ | Opens/closes the circuit (ON/OFF control) |\n| **Fuse** | ⊸ | Breaks the circuit if current gets too high (safety device) |\n\nYou'll learn the official circuit diagram symbols next class when we start drawing schematics.",
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
    prompt: "Which of the following is NOT required for a working circuit?",
    difficulty: "remember",
    options: [
      "An energy source (battery)",
      "A complete conducting path",
      "A resistor",
      "A load (like a light bulb)",
    ],
    correctIndex: 2,
    explanation: "A circuit needs an energy source, a conducting path, and a load. A resistor is an optional component that limits current — it's not required for the circuit to function. You lit a bulb without a resistor in Challenge 1.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "You connect a battery directly to itself with a wire and no load. This is called a:",
    difficulty: "remember",
    options: [
      "Parallel circuit",
      "Open circuit",
      "Short circuit",
      "Series circuit",
    ],
    correctIndex: 2,
    explanation: "A short circuit is when current flows through a path with no load (very low resistance). All the battery's energy goes into heating the wire, which can cause fires. This is why fuses and circuit breakers exist.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "A paper clip completes a circuit and the bulb lights. A dollar bill does not. This is because:",
    difficulty: "understand",
    options: [
      "The paper clip is heavier",
      "The paper clip is a conductor — it has free electrons that carry charge",
      "The dollar bill is too thin",
      "The dollar bill blocks the magnetic field",
    ],
    correctIndex: 1,
    explanation: "The paper clip is metal — a conductor with free electrons that can move through it, carrying charge. The dollar bill is paper — an insulator whose electrons are tightly bound and can't flow.",
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
    content: "**What you discovered today:**\n\n- A circuit needs an **energy source**, a **conducting path**, and a **load** in a **complete loop**\n- **Current** is the flow of charge through a conductor — it needs voltage to push it\n- **Short circuits** happen when there's no load — all energy becomes heat\n- **Conductors** (metals) let charge flow; **insulators** (rubber, paper) don't\n- **Switches** open and close the circuit; **resistors** limit current; **fuses** protect against overload\n\n**Coming up next:** We'll put numbers on everything — defining current, voltage, and resistance with equations, and learning Ohm's Law.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** For your phone to work, every component must be connected in a complete circuit back to the battery. The wires must be conductors (copper traces on a circuit board), the path must be unbroken, and the battery must provide voltage to push current through each component. If any connection breaks — a cracked solder joint, a corroded contact — that part of the circuit stops working.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about what happens when you flip a light switch. Now explain it using the vocabulary you learned today: circuit, current, conductor, open/closed circuit.",
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
      { term: "Circuit", definition: "A closed loop that allows charge to flow continuously from an energy source, through a load, and back." },
      { term: "Current", definition: "The flow of electric charge through a conductor. Conventional current flows from + to −." },
      { term: "Open Circuit", definition: "A broken circuit — no current flows. Caused by a disconnected wire, open switch, or burned-out component." },
      { term: "Closed Circuit", definition: "A complete, unbroken circuit — current flows continuously." },
      { term: "Short Circuit", definition: "A circuit with no load where current flows through very low resistance. Converts all energy to heat. Dangerous." },
      { term: "Conductor", definition: "A material that allows charge to flow easily. Metals are the best conductors (free electrons)." },
      { term: "Insulator", definition: "A material that resists charge flow. Electrons are tightly bound. Examples: rubber, plastic, glass." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("circuit-discovery");

  const data = {
    title: "Circuit Discovery",
    questionOfTheDay: "Your phone has a battery, a screen, a speaker, and a processor — all connected by tiny wires. What has to be true about those connections for any of it to work?",
    course: "Physics",
    unit: "Circuits",
    order: 1,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/circuit-discovery`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
