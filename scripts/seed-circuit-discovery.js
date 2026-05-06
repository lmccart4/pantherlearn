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
      "Build a setup that lights a bulb",
      "Discover what causes electricity to flow (and what stops it)",
      "Test everyday materials to see which let electricity through",
      "Identify the role of switches, resistors, and fuses in a working setup",
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
    prompt: "You flip a light switch and the room lights up. What do you think is physically happening between the switch on the wall and the bulb on the ceiling? Describe the chain of events as best you can — there's no wrong answer here, just take your best guess.",
    difficulty: "understand",
    gradingRubric: "EXTREMELY LENIENT — this is an opening hypothesis. Students have no formal knowledge of circuits yet. Award full credit for any genuine attempt that describes a chain of events, even if the physics is wrong or incomplete. Only deduct for clearly blank, one-word, or 'idk' responses.",
  },

  // ─── PHET DISCOVERY LAB ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔬",
    title: "Discovery Lab: PhET Simulation",
    subtitle: "~30 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Time to explore. You'll use a virtual lab to figure out — by trial and error — how electricity actually works. No notes today, no formulas. Build, try things, and pay attention to what happens.\n\nWork through the challenges below in order. After each one, **call Mr. McCarthy over** to verify your setup before moving on.",
  },

  {
    id: uid(), type: "embed",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html",
    caption: "PhET Circuit Construction Kit — Virtual Lab. Drag components from the right panel to the workspace. Drag wire endpoints to connect components.",
    height: 600,
    scored: false,
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Sim tips:** Click a component from the right toolbox to add it. Drag wire endpoints to connect components. Right-click (or long-press) a component to delete it. Use the voltmeter and ammeter from the toolbox if you want to measure things.",
  },

  // ─── CHALLENGE 1: LIGHT THE BULB ─────────────────────────

  {
    id: "q-light-bulb", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 1:** Get a light bulb to light up. Describe what components you used and how you connected them. What was the minimum setup needed?",
    difficulty: "apply",
  },

  {
    id: "checkpoint-bulb", type: "teacher_checkpoint",
    title: "Show Me: Light Bulb Lit",
    prompt: "Once your bulb is lit, raise your hand and have Mr. McCarthy verify it. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── CHALLENGE 2: FIRE ───────────────────────────────────

  {
    id: "q-fire", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 2:** Try to create a setup that causes a fire in the simulation. (Yes, really.) Describe what you did. Why do you think the fire happened? What does this tell you about what a wire does when there's nothing slowing the electricity down?",
    difficulty: "apply",
  },

  {
    id: "checkpoint-fire", type: "teacher_checkpoint",
    title: "Show Me: Fire in the Circuit",
    prompt: "Once you've made a circuit catch fire, raise your hand and have Mr. McCarthy verify it. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  {
    id: uid(), type: "callout",
    icon: "🔥", style: "warning",
    content: "**What just happened:** When a battery is connected straight back to itself with nothing slowing the electricity down, all of the energy turns into heat in the wire. In real life, this is dangerous — it can cause fires, melt wires, and destroy batteries. That's why we use components like fuses and circuit breakers. We'll get into the proper name for this next class.",
  },

  // ─── CHALLENGE 3: SWITCH ─────────────────────────────────

  {
    id: "q-switch", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 3:** Add a switch to your setup so you can turn the bulb on and off. What is the purpose of a switch? What's different about how the electricity flows when the switch is open vs. closed?",
    difficulty: "understand",
  },

  {
    id: "checkpoint-switch", type: "teacher_checkpoint",
    title: "Show Me: Switch Working",
    prompt: "Demonstrate that you can turn the bulb on and off by flipping the switch. Have Mr. McCarthy verify. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── CHALLENGE 4: RESISTOR ───────────────────────────────

  {
    id: "q-resistor", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 4:** Add a resistor to your working setup (keep the bulb too). What happens to the brightness of the bulb? Why do you think this happened?",
    difficulty: "understand",
  },

  {
    id: "checkpoint-resistor", type: "teacher_checkpoint",
    title: "Show Me: Resistor Added",
    prompt: "Show Mr. McCarthy your circuit with a resistor in it. Bulb should be visibly dimmer than before. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── CHALLENGE 5: TWO BULBS ──────────────────────────────

  {
    id: "q-two-bulbs", type: "question",
    questionType: "short_answer",
    prompt: "**Challenge 5:** Replace the resistor with a second light bulb (so you have two bulbs in a line with the battery). What do you notice about the brightness of both bulbs compared to when there was only one? Why?",
    difficulty: "analyze",
  },

  {
    id: "checkpoint-two-bulbs", type: "teacher_checkpoint",
    title: "Show Me: Two Bulbs in Series",
    prompt: "Show Mr. McCarthy your circuit with two bulbs in a single loop. Both should be lit but dimmer than one alone. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── MATERIALS TEST (DATA TABLE) ─────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧪",
    title: "Materials Test",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Now let's see which everyday objects let electricity through. Build a simple setup with **one battery and one bulb**. Then replace one section of wire with each item below and see what happens.\n\nFill in the data table — for each material, pick the option that best describes what the bulb does. Use the same scale for every row:\n\n- **Off** — bulb doesn't light at all\n- **Dim** — bulb lights faintly\n- **Bright** — bulb lights at normal brightness\n- **Very bright (overcurrent)** — bulb is dangerously bright / circuit catches fire",
  },

  {
    id: "data-table-materials", type: "data_table",
    preset: "dropdown",
    title: "Materials Test — what does the bulb do?",
    weight: 13,
    scored: true,
    columns: [
      { key: "object", label: "Object" },
      { key: "result", label: "What does the bulb do?", input: "dropdown",
        options: ["Off", "Dim", "Bright", "Very bright (overcurrent)"] },
    ],
    rows: [
      { object: "Wire", result: "Bright" },
      { object: "Battery (added in series, same direction)", result: "Very bright (overcurrent)" },
      { object: "Battery, flipped (opposite direction)", result: "Off" },
      { object: "Resistor", result: "Dim" },
      { object: "Open switch", result: "Off" },
      { object: "Closed switch", result: "Bright" },
      { object: "Fuse", result: "Bright" },
      { object: "Dangerous battery (high voltage)", result: "Very bright (overcurrent)" },
      { object: "Dollar bill", result: "Off" },
      { object: "Paper clip", result: "Bright" },
      { object: "Coin", result: "Bright" },
      { object: "Eraser", result: "Off" },
      { object: "Pencil (graphite)", result: "Dim" },
    ],
  },

  {
    id: "q-mat-categorize", type: "question",
    questionType: "short_answer",
    prompt: "Look at your data above. **What do the objects that lit the bulb have in common? What about the objects that did NOT light the bulb?** Use your own words — no need for fancy terms.",
    difficulty: "analyze",
  },

  // ─── PROOF OF WORK ──────────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "📸", style: "info",
    content: "**Proof of work:** Take **one** screenshot of your final working circuit (with at least one bulb lit) and upload it below. Make sure your name is visible somewhere on screen (browser tab, sticky note, etc.).",
  },

  {
    id: "evidence-final-circuit", type: "evidence_upload",
    title: "Upload: Your Final Circuit",
    instructions: "Take a screenshot of your working circuit in the PhET sim with at least one bulb lit. Make sure your name is visible on screen.",
    weight: 5,
  },

  // ─── NAME WHAT YOU DISCOVERED ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🏷️",
    title: "Name What You Discovered",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You spent the last 30 minutes figuring out how electricity flows through stuff. Here's what those things are actually called:\n\n- A complete loop that lets electricity flow is a **circuit**.\n- The flow itself is called **current** — it's just charge moving through a wire.\n- Materials that let electricity through (wire, paper clip, coin) are **conductors**. Most of them are metals.\n- Materials that block electricity (eraser, dollar bill) are **insulators**. They keep charges locked in place.\n- A switch opens or closes the loop — that's all it does.\n- A resistor makes it harder for current to flow, which dims the bulb.\n- A fuse is a safety device. If too much current tries to flow, it melts and breaks the circuit on purpose.\n\nNext class we'll put numbers on all of this — voltage, current, and resistance — and learn the equation that ties them together.",
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
    prompt: "Which of the following is NOT required to get a bulb to light up?",
    difficulty: "remember",
    options: [
      "An energy source (battery)",
      "A complete loop of conducting material",
      "A resistor",
      "Something to use the energy (like a bulb)",
    ],
    correctIndex: 2,
    explanation: "You only need an energy source, a complete loop, and a load (the bulb). A resistor is optional — it just slows current down. You lit a bulb without one in Challenge 1.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "You connect a battery directly to itself with a wire and nothing else. What happens?",
    difficulty: "understand",
    options: [
      "Nothing — the circuit is open",
      "The bulb lights at normal brightness",
      "The wire heats up and may catch fire",
      "The battery turns off",
    ],
    correctIndex: 2,
    explanation: "With nothing to slow the current down, all the battery's energy goes into heating the wire. This is what caused the fire in Challenge 2.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "A paper clip lights the bulb. A dollar bill does not. The most likely reason is:",
    difficulty: "understand",
    options: [
      "The paper clip is heavier",
      "The paper clip is metal — electricity can flow through it",
      "The dollar bill is too thin",
      "The dollar bill blocks the magnetic field",
    ],
    correctIndex: 1,
    explanation: "Metal is a conductor — charges can move through it freely. Paper is an insulator — charges can't flow through it.",
  },

  // ─── WRAP UP ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** For your phone to work, every component must be connected in a complete loop back to the battery. The wires must be conductors (the tiny copper traces you see on a circuit board), the loop must be unbroken, and the battery has to provide the push. If any connection breaks — a cracked solder joint, a corroded contact — that part stops working.",
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
      { term: "Circuit", definition: "A closed loop of conducting material that allows charge to flow from a battery, through a load, and back. If the loop is broken, current stops." },
      { term: "Current", definition: "The flow of electric charge through a conductor. Measured in amperes (A)." },
      { term: "Conductor", definition: "A material that lets charge flow through it easily. Most metals are good conductors (copper, aluminum, iron)." },
      { term: "Insulator", definition: "A material that resists charge flow. Examples: rubber, plastic, glass, paper." },
      { term: "Switch", definition: "A component that opens or closes a circuit, controlling whether current can flow." },
      { term: "Resistor", definition: "A component that slows the flow of current. Reduces brightness/output of devices in the circuit." },
      { term: "Fuse", definition: "A safety device that breaks a circuit if too much current flows through it." },
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
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/circuit-discovery`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
