// seed-circuit-symbols.js
// Physics — Circuits Unit, Lesson 2 (order: 2)
// "Circuit Symbols & Diagrams"
// Built from Week 34 Slides (Discovery: Circuit Symbols / Circuit Diagrams).
// Run: node scripts/seed-circuit-symbols.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "circuit-symbols-diagrams";

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
      "Light a real bulb with a battery, holder, and wires — then with just one wire",
      "Read and sketch the standard circuit diagram symbols for bulb, resistor, switch, fuse, and voltmeter",
      "Explain the purpose of each component using evidence from the simulator",
      "Predict whether a given circuit diagram will light a bulb",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Essential Question:** Why is it dangerous to use a hair dryer while taking a bath?",
  },

  // ─── HANDS-ON: LIGHT THE BULB ─────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "💡",
    title: "Hands-On: Light a Real Bulb",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Before we draw circuits on paper, let's build one. Your group will get a battery, a bulb, a bulb holder, and some wire. Two challenges:",
  },

  {
    id: uid(), type: "callout",
    icon: "1️⃣", style: "info",
    content: "**Task 1 — The easy way.** Use **one bulb holder, one battery, and two wires** to light the bulb. When you've got it, raise your hand for verification.",
  },

  {
    id: "checkpoint-bulb-easy", type: "teacher_checkpoint",
    title: "Show Me: Bulb Lit (Holder + 2 Wires)",
    prompt: "Once your bulb is glowing using a holder, a battery, and two wires, raise your hand and have Mr. McCarthy verify it. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  {
    id: uid(), type: "callout",
    icon: "2️⃣", style: "warning",
    content: "**Task 2 — The hard way.** Now ditch the bulb holder. Light the bulb using **only one battery and one wire** (and the bulb itself). It IS possible — most MIT graduates couldn't do it on the first try. Take a picture when you crack it.",
  },

  {
    id: "checkpoint-bulb-hard", type: "teacher_checkpoint",
    title: "Show Me: Bulb Lit (1 Battery, 1 Wire)",
    prompt: "Once your bulb is lit with only a single wire and a battery (no holder), raise your hand and have Mr. McCarthy verify it. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  {
    id: uid(), type: "callout",
    icon: "🎓", style: "insight",
    content: "**The MIT moment:** On graduation day at MIT, Harvard professor Philip Sadler asked physics graduates to light a bulb using a battery, a bulb, and one wire. Most of them couldn't do it. Knowing the equations isn't the same as understanding what's actually happening — see if your group can figure out what they missed.",
  },

  {
    id: "evidence-bulb-photo", type: "evidence_upload",
    title: "Upload: Your Lit Bulb",
    instructions: "Take a photo of your group's working circuit (Task 1 OR Task 2). Make sure at least one group member's hand or name is visible.",
    weight: 5,
  },

  // ─── PHET DISCOVERY ─────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔬",
    title: "Discovery: Symbol View in PhET",
    subtitle: "~20 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Drawing every bulb, battery, and wire as a realistic picture is slow. Engineers use **circuit diagram symbols** instead — quick shorthand that anyone in the world can read.\n\nIn the PhET sim below, click the **schematic toggle** (the icon that looks like `—| |—`) in the bottom-right to switch from realistic view to symbol view.\n\nWork through the tasks below in order. Sketch each symbol on your whiteboard or paper as you find it.",
  },

  {
    id: uid(), type: "embed",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html",
    caption: "PhET Circuit Construction Kit — Virtual Lab. Use the schematic toggle (bottom-right) to switch between realistic view and circuit diagram symbols.",
    height: 600,
    scored: false,
  },

  // ─── LIGHT BULB SYMBOL ─────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "💡", style: "info",
    content: "**Light Bulb.** Drag a bulb into the workspace. Toggle to symbol view and sketch what you see.",
  },

  {
    id: "q-bulb-purpose", type: "question",
    questionType: "short_answer",
    prompt: "What is the purpose of the **light bulb** in a circuit? (Hint: it's not just to light up — what is it doing with the electrical energy?)",
    difficulty: "understand",
  },

  {
    id: "q-bulb-brightness", type: "question",
    questionType: "short_answer",
    prompt: "Change something about the bulb (or the circuit) so it shines more brightly or more dimly. What did you change, and what pattern did you observe?",
    difficulty: "analyze",
  },

  {
    id: "q-bulb-other-symbols", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of these is the standard circuit diagram symbol for a light bulb?",
    difficulty: "remember",
    options: [
      "![Light bulb symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/bulb.png)",
      "![Diode symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/diode.png)",
      "![Battery symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/battery.png)",
      "![Resistor symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/resistor.png)",
    ],
    correctIndex: 0,
    explanation: "A circle with an X (or a circle with a loop inside) is the international standard symbol for a lamp/bulb. The zigzag is a resistor; two unequal parallel lines are a battery; a triangle is a diode.",
  },

  // ─── RESISTOR SYMBOL ─────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "🟫", style: "info",
    content: "**Resistor.** Drag a resistor into the workspace. Toggle to symbol view. The American symbol is a zigzag; the European symbol is a rectangle. Sketch one.",
  },

  {
    id: "q-resistor-purpose", type: "question",
    questionType: "short_answer",
    prompt: "Hook up the resistor in a loop with a battery and a light bulb. Increase and decrease the resistance value. **What is the purpose of a resistor?** What pattern did you observe?",
    difficulty: "analyze",
  },

  // ─── SWITCH SYMBOL ─────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "🔘", style: "info",
    content: "**Switch.** Drag a switch into the workspace. Toggle to symbol view. The symbol looks like a wire with a small gap and a hinged line above it.",
  },

  {
    id: "q-switch-purpose", type: "question",
    questionType: "short_answer",
    prompt: "What is the purpose of a switch in a circuit? Describe what happens when you open it vs. close it.",
    difficulty: "understand",
  },

  // ─── FUSE SYMBOL ─────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "🧯", style: "warning",
    content: "**Fuse.** Drag a fuse into the workspace. Toggle to symbol view and sketch it. Now wire up a **single loop** — battery, fuse, and bulb all connected end-to-end (no branches, no extras). Confirm the **bulb is on** before going further. Once it's lit, try lowering the fuse's current rating to **0.7 A** and watch what happens.",
  },

  {
    id: "q-fuse-purpose", type: "question",
    questionType: "short_answer",
    prompt: "What happened when you lowered the fuse rating to 0.7 A? **What is the purpose of a fuse?** Why is it important in real-world wiring (think about the hair dryer in the bathtub)?",
    difficulty: "analyze",
  },

  // ─── VOLTMETER SYMBOL ─────────────────────────────────

  {
    id: uid(), type: "callout",
    icon: "📟", style: "info",
    content: "**Voltmeter.** This one isn't on the schematic toggle button. Conduct a quick web search: what does a voltmeter symbol look like in a circuit diagram?",
  },

  {
    id: "q-voltmeter-symbol", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of these is the standard circuit diagram symbol for a voltmeter?",
    difficulty: "remember",
    options: [
      "![Circle with A](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/ammeter.png)",
      "![Rectangle with V](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/rect-v.png)",
      "![Zigzag with V](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/zigzag-v.png)",
      "![Circle with V](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/voltmeter.png)",
    ],
    correctIndex: 3,
    explanation: "A voltmeter is drawn as a circle with a 'V' inside. An ammeter (which measures current) is the same circle with an 'A' inside.",
  },

  {
    id: "q-voltmeter-purpose", type: "question",
    questionType: "short_answer",
    prompt: "What is the purpose of a voltmeter? What does it measure, and where in a circuit would you place it?",
    difficulty: "understand",
  },

  // ─── SUMMARY DATA TABLE ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📋",
    title: "Symbol Reference Table",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Now you've seen all five symbols. Match each component to what it does in a circuit. Use what you observed in the sim — not what you think the answer 'should' be.",
  },

  {
    id: "data-table-symbols", type: "data_table",
    preset: "dropdown",
    title: "Component → Purpose",
    weight: 10,
    scored: true,
    columns: [
      { key: "component", label: "Component" },
      { key: "purpose", label: "Main purpose in a circuit", input: "dropdown",
        options: [
          "Converts electrical energy to light and heat",
          "Slows the flow of current",
          "Opens or closes the loop on demand",
          "Breaks the circuit if too much current flows",
          "Measures the voltage across a component",
        ] },
    ],
    rows: [
      { component: "Light bulb", purpose: "Converts electrical energy to light and heat" },
      { component: "Resistor", purpose: "Slows the flow of current" },
      { component: "Switch", purpose: "Opens or closes the loop on demand" },
      { component: "Fuse", purpose: "Breaks the circuit if too much current flows" },
      { component: "Voltmeter", purpose: "Measures the voltage across a component" },
    ],
  },

  // ─── APPLICATION ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧠",
    title: "Application: Read a Diagram",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Take a careful look at this circuit diagram. There's a **+9V battery** on the left, a **switch** drawn in the open position on the right, a **bulb** on the bottom, and a wire running down the middle.\n\n![Task 18 circuit diagram](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/task18-diagram.png)",
  },

  {
    id: "q-application-bulb-on", type: "question",
    questionType: "multiple_choice",
    prompt: "Will the bulb in the diagram above turn on?",
    difficulty: "apply",
    options: [
      "No — the switch is open, so no current can flow anywhere",
      "Yes — the middle wire creates a complete loop from the battery, through the bulb, and back, so the open switch doesn't matter",
      "No — 9V isn't enough voltage to light a bulb",
      "Yes — but only very dimly because half the current is blocked by the open switch",
    ],
    correctIndex: 1,
    explanation: "Trace the wires carefully. The middle vertical wire connects the top of the circuit straight to the bottom-middle junction, then through the bulb back to the battery. That's a complete loop — current can flow through it whether the switch on the right is open or closed. The open switch only breaks the outer-right path; the bulb still lights.",
  },

  {
    id: "q-application-explain", type: "question",
    questionType: "short_answer",
    prompt: "Explain in your own words **how you knew** whether the bulb would turn on. What feature of the diagram gave it away?",
    difficulty: "apply",
  },

  // ─── HAIR DRYER REVISITED ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🛁",
    title: "Back to the Hair Dryer",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Essential Question:** Why is using a hair dryer in the bath dangerous? Tap water is a (weak) conductor. If a plugged-in hair dryer falls in, the bathwater becomes part of the circuit — and so does anything else in the water. Current would flow from the hot wire, through the water, through your body, and back to ground. That's why bathroom outlets in the US are required to have a **GFCI** (a fast-acting fuse-like device) that cuts the circuit in milliseconds when current starts flowing where it shouldn't.",
  },

  // ─── CHECK YOUR UNDERSTANDING ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~5 minutes",
  },

  {
    id: "q-check-zigzag", type: "question",
    questionType: "multiple_choice",
    prompt: "You see this symbol in a circuit diagram:\n\n![Zigzag symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/resistor.png)\n\nWhat component is it?",
    difficulty: "remember",
    options: [
      "A battery",
      "A switch",
      "A resistor",
      "A fuse",
    ],
    correctIndex: 2,
    explanation: "The American zigzag (and the European rectangle) both represent a resistor — a component that slows current flow.",
  },

  {
    id: "q-check-battery-symbol", type: "question",
    questionType: "multiple_choice",
    prompt: "A battery symbol looks like this:\n\n![Battery symbol](https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/battery.png)\n\nWhat does the **longer** line represent?",
    difficulty: "understand",
    options: [
      "The negative terminal",
      "The ground",
      "The fuse",
      "The positive terminal",
    ],
    correctIndex: 3,
    explanation: "The longer line is the positive (+) terminal; the shorter line is negative (−). Multiple cells stacked make a battery.",
  },

  {
    id: "q-check-why-symbols", type: "question",
    questionType: "multiple_choice",
    prompt: "Why do engineers use circuit diagram symbols instead of drawing realistic pictures of every component?",
    difficulty: "understand",
    options: [
      "Symbols are required by law",
      "Symbols are faster to draw and universally understood, regardless of language",
      "Realistic drawings don't work in pencil",
      "Symbols carry more current than drawings",
    ],
    correctIndex: 1,
    explanation: "Circuit symbols are an international visual language. An engineer in Tokyo and an engineer in New Jersey can read the same diagram without translating a single word.",
  },

  // ─── WRAP UP ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~2 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You can now read and sketch the five most common circuit diagram symbols: **bulb, resistor, switch, fuse, voltmeter** — plus the battery. Next class, we'll put numbers on these circuits: how much voltage is the battery pushing, how much current is flowing, and how the resistor controls both.",
  },

  // ─── VOCABULARY ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Circuit diagram", definition: "A simplified drawing of a circuit that uses standard symbols instead of realistic pictures." },
      { term: "Schematic symbol", definition: "A standardized shape representing a circuit component (e.g., a zigzag for a resistor)." },
      { term: "Light bulb (lamp) symbol", definition: "A circle with an X (or a loop) inside. Converts electrical energy to light and heat." },
      { term: "Resistor symbol", definition: "A zigzag line (American) or rectangle (European). Slows the flow of current." },
      { term: "Switch symbol", definition: "A wire with a small gap and a hinged line. Opens or closes the loop." },
      { term: "Fuse symbol", definition: "A rectangle with a wavy line inside (or a small oval). Breaks the circuit if too much current flows." },
      { term: "Voltmeter symbol", definition: "A circle with the letter V inside. Measures voltage across a component." },
      { term: "Battery symbol", definition: "Two parallel lines of unequal length: longer = positive terminal, shorter = negative." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc(LESSON_ID);

  const data = {
    title: "Circuit Symbols & Diagrams",
    questionOfTheDay: "Why is it dangerous to use a hair dryer while taking a bath?",
    course: "Physics",
    unit: "Circuits",
    order: 2,
    visible: false,
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
