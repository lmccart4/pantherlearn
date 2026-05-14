// seed-phet-circuit-voltage-lab.js
// Physics — Circuits Unit, order 5.5
// "Circuit Voltage Lab (PhET)"
// Students build a circuit progression in the PhET CCK-DC sim,
// measuring voltage drops and recording brightness in numeric data tables.
// Run: node scripts/seed-phet-circuit-voltage-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "phet-circuit-voltage-lab";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const BRIGHTNESS = ["Off", "Dim", "Bright"];

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
      "Build a progression of circuits in the PhET simulation, from one bulb to a switched series-parallel circuit",
      "Measure the voltage drop across each circuit element with the PhET voltmeter",
      "Record voltage and brightness data in an organized data table for each experiment",
      "Explain how voltage splits in series, stays full in parallel, and where it goes when a switch is opened",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Flip one switch and every light in the room goes dark. Flip a different switch and only *one* light goes out. What has to be different about *where* those two switches sit in the circuit?",
  },

  {
    id: "q-warmup-predict", type: "question",
    questionType: "short_answer",
    prompt: "Today you'll build circuits with two kinds of switches: a **master switch** that controls all the bulbs at once, and an **independent switch** that controls only one bulb. **Before you build anything**, make a prediction: where in the circuit would each switch have to be placed to behave that way? Take your best shot — you'll test it with real measurements today.",
    difficulty: "understand",
    gradingRubric: "LENIENT — this is an opening prediction made before any building. Award full credit for any genuine attempt that proposes a placement for each switch. Bonus-worthy but not required: master switch in the main line / in series with everything, independent switch on one branch / in series with one bulb. Do not penalize wrong guesses or imprecise wording.",
  },

  // ─── THE VIRTUAL LAB ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔬",
    title: "The Virtual Lab",
    subtitle: "~2 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Today you build a progression of circuits in a simulation, where you can **measure** what's happening. You'll work through **5 experiments** in order. For each one:\n\n1. Build the circuit in the PhET sim below\n2. Use the **voltmeter** to measure the voltage drop across each element\n3. Record your readings and the bulb brightness in that experiment's data table\n4. Answer the analysis question\n\nYour data tables auto-save as you type.",
  },

  {
    id: uid(), type: "embed",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html",
    caption: "PhET Circuit Construction Kit — Virtual Lab. Drag components from the right panel onto the workspace. Drag wire endpoints to connect them.",
    height: 600,
    scored: false,
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Using the voltmeter:** Grab the **voltmeter** from the toolbox on the right. To measure the voltage *across* a component, touch the **red lead to one side** and the **black lead to the other side** of that component. The reading is the **voltage drop** across it. Measure across the battery the same way. If you get a negative number, your leads are reversed — just swap them or record the size of the number.",
  },

  // ─── EXPERIMENT 1: ONE-BULB BASELINE ────────────────────

  {
    id: uid(), type: "section_header",
    icon: "1️⃣",
    title: "Experiment 1: One-Bulb Baseline",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery, one light bulb, connected in a single complete loop.\n\n**Measure it:** Use the voltmeter to measure the voltage drop across the **battery** and across the **bulb**. Record both readings and the bulb's brightness in the table below.\n\nThis is your **baseline** — every other experiment gets compared back to this single, full-brightness bulb.",
  },

  {
    id: "data-exp1", type: "data_table",
    preset: "numeric",
    title: "Experiment 1 Data — One-Bulb Baseline",
    rowHeader: "Circuit Element",
    weight: 5,
    scored: true,
    columns: [
      { key: "voltage", label: "Voltage Drop", unit: "V" },
      { key: "brightness", label: "Brightness", type: "select", options: BRIGHTNESS },
    ],
    rows: [
      { key: "battery", label: "Battery" },
      { key: "bulb", label: "Bulb" },
    ],
  },

  {
    id: "q-exp1", type: "question",
    questionType: "short_answer",
    prompt: "How does the voltage drop across the bulb compare to the voltage drop across the battery? What does that tell you about where the battery's energy goes in a single-bulb loop?",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 2: THREE BULBS IN SERIES ────────────────

  {
    id: uid(), type: "section_header",
    icon: "2️⃣",
    title: "Experiment 2: Three Bulbs in Series",
    subtitle: "~7 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery and **three bulbs in series** — one continuous loop, each bulb one after the next.\n\n**Measure it:** Measure the voltage drop across the battery and across **each** of the three bulbs. Record every reading and each bulb's brightness.\n\nCompare the brightness to your Experiment 1 baseline as you go.",
  },

  {
    id: "data-exp2", type: "data_table",
    preset: "numeric",
    title: "Experiment 2 Data — Three Bulbs in Series",
    rowHeader: "Circuit Element",
    weight: 5,
    scored: true,
    columns: [
      { key: "voltage", label: "Voltage Drop", unit: "V" },
      { key: "brightness", label: "Brightness", type: "select", options: BRIGHTNESS },
    ],
    rows: [
      { key: "battery", label: "Battery" },
      { key: "bulb1", label: "Bulb 1" },
      { key: "bulb2", label: "Bulb 2" },
      { key: "bulb3", label: "Bulb 3" },
    ],
  },

  {
    id: "q-exp2", type: "question",
    questionType: "short_answer",
    prompt: "Add up the three bulb voltage drops. How does that total compare to the battery's voltage? And how does each bulb's brightness compare to your Experiment 1 baseline? Explain what is happening to the voltage in a series circuit.",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 3: THREE BULBS IN PARALLEL ──────────────

  {
    id: uid(), type: "section_header",
    icon: "3️⃣",
    title: "Experiment 3: Three Bulbs in Parallel",
    subtitle: "~7 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery and **three bulbs in parallel** — each bulb on its own branch, all three branches connecting the same two points.\n\n**Measure it:** Measure the voltage drop across the battery and across **each** of the three bulbs. Record every reading and each bulb's brightness.",
  },

  {
    id: "data-exp3", type: "data_table",
    preset: "numeric",
    title: "Experiment 3 Data — Three Bulbs in Parallel",
    rowHeader: "Circuit Element",
    weight: 5,
    scored: true,
    columns: [
      { key: "voltage", label: "Voltage Drop", unit: "V" },
      { key: "brightness", label: "Brightness", type: "select", options: BRIGHTNESS },
    ],
    rows: [
      { key: "battery", label: "Battery" },
      { key: "bulb1", label: "Bulb 1" },
      { key: "bulb2", label: "Bulb 2" },
      { key: "bulb3", label: "Bulb 3" },
    ],
  },

  {
    id: "q-exp3", type: "question",
    questionType: "short_answer",
    prompt: "How does the voltage drop across each bulb compare to the battery's voltage in this parallel circuit? How is that different from the series circuit in Experiment 2? Why are the bulbs brighter here?",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 4: MASTER SWITCH ────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "4️⃣",
    title: "Experiment 4: Master Switch",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "⏱️", style: "info",
    content: "**Running low on time?** Experiments 4 and 5 can be finished for homework — but try to at least build Experiment 4 in class so you can ask questions.",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** Keep your three bulbs in **parallel**. Now add a **switch in the main line** — between the battery and the point where the circuit splits into branches. This is the **master switch**.\n\n**Measure it twice:**\n\n- **Switch closed:** measure the voltage drop across the battery, the switch, and each bulb. Record in the *Closed* columns.\n- **Switch open:** measure the same elements again. Record in the *Open* columns.\n\nPay attention to what the voltmeter reads across the **open switch**.",
  },

  {
    id: "data-exp4", type: "data_table",
    preset: "numeric",
    title: "Experiment 4 Data — Master Switch (Closed vs. Open)",
    rowHeader: "Circuit Element",
    weight: 5,
    scored: true,
    columns: [
      { key: "v_closed", label: "Voltage — Closed", unit: "V" },
      { key: "b_closed", label: "Brightness — Closed", type: "select", options: BRIGHTNESS },
      { key: "v_open", label: "Voltage — Open", unit: "V" },
      { key: "b_open", label: "Brightness — Open", type: "select", options: BRIGHTNESS },
    ],
    rows: [
      { key: "battery", label: "Battery" },
      { key: "switch", label: "Master Switch" },
      { key: "bulb1", label: "Bulb 1" },
      { key: "bulb2", label: "Bulb 2" },
      { key: "bulb3", label: "Bulb 3" },
    ],
  },

  {
    id: "q-exp4", type: "question",
    questionType: "short_answer",
    prompt: "When you opened the master switch, what happened to all three bulbs? And what did the voltmeter read across the **open switch** itself? Use your data to explain where the battery's voltage 'goes' when the master switch is open.",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 5: INDEPENDENT SWITCH ───────────────────

  {
    id: uid(), type: "section_header",
    icon: "5️⃣",
    title: "Experiment 5: Independent Switch",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** Keep the circuit from Experiment 4 (three parallel bulbs + master switch). Now add a **second switch in series with just Bulb 3** — on Bulb 3's branch only. This is the **independent switch**.\n\nKeep the **master switch closed** for this whole experiment.\n\n**Measure it twice:**\n\n- **Independent switch closed:** measure the voltage drop across the battery, the independent switch, and each bulb. Record in the *Closed* columns.\n- **Independent switch open:** measure the same elements again. Record in the *Open* columns.",
  },

  {
    id: "data-exp5", type: "data_table",
    preset: "numeric",
    title: "Experiment 5 Data — Independent Switch (Closed vs. Open)",
    rowHeader: "Circuit Element",
    weight: 5,
    scored: true,
    columns: [
      { key: "v_closed", label: "Voltage — Closed", unit: "V" },
      { key: "b_closed", label: "Brightness — Closed", type: "select", options: BRIGHTNESS },
      { key: "v_open", label: "Voltage — Open", unit: "V" },
      { key: "b_open", label: "Brightness — Open", type: "select", options: BRIGHTNESS },
    ],
    rows: [
      { key: "battery", label: "Battery" },
      { key: "switch", label: "Independent Switch" },
      { key: "bulb1", label: "Bulb 1" },
      { key: "bulb2", label: "Bulb 2" },
      { key: "bulb3", label: "Bulb 3 (switched branch)" },
    ],
  },

  {
    id: "q-exp5", type: "question",
    questionType: "short_answer",
    prompt: "When you opened the independent switch, which bulbs were affected and which were not? What did the voltmeter read across the open independent switch, and across Bulb 3? Explain why this switch behaves differently from the master switch in Experiment 4.",
    difficulty: "evaluate",
  },

  // ─── PROOF OF WORK ──────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📸",
    title: "Proof of Work",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "📸", style: "info",
    content: "**Screenshot your Experiment 5 build:** the three parallel bulbs, the master switch, and the independent switch on Bulb 3's branch. Make sure your name is visible somewhere on screen (browser tab, sticky note, etc.).",
  },

  {
    id: "evidence-final-build", type: "evidence_upload",
    title: "Upload: Your Experiment 5 Circuit",
    instructions: "Take a screenshot of your completed Experiment 5 circuit in the PhET sim — three parallel bulbs, master switch in the main line, independent switch on Bulb 3's branch. Make sure your name is visible on screen.",
    weight: 5,
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
    prompt: "In a series circuit with three identical bulbs and a $9\\text{ V}$ battery, what is the approximate voltage drop across **each** bulb?",
    difficulty: "apply",
    options: [
      "$9\\text{ V}$ — each bulb gets the full battery voltage",
      "$3\\text{ V}$ — the battery voltage splits evenly across the three bulbs",
      "$27\\text{ V}$ — the voltages add up across the bulbs",
      "$0\\text{ V}$ — no voltage drops across a bulb",
    ],
    correctIndex: 1,
    explanation: "In series, the battery's voltage **splits** across the components. Three identical bulbs each take about one-third: $9\\text{ V} \\div 3 = 3\\text{ V}$. Add the drops back up and you get the battery voltage.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "In a parallel circuit with three bulbs and a $9\\text{ V}$ battery, what is the voltage drop across **each** bulb?",
    difficulty: "apply",
    options: [
      "$3\\text{ V}$ — the voltage splits across the three branches",
      "$0\\text{ V}$ — parallel branches have no voltage drop",
      "$9\\text{ V}$ — every branch sees the full battery voltage",
      "It depends on which branch you measure",
    ],
    correctIndex: 2,
    explanation: "In parallel, **every branch sees the full battery voltage**. That's why parallel bulbs stay at full brightness — each one gets the complete $9\\text{ V}$.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "You open the master switch and all the bulbs go dark. If you measure the voltage drop across the **open switch**, what do you find?",
    difficulty: "understand",
    options: [
      "$0\\text{ V}$ — an open switch has no voltage across it",
      "A small voltage, the same as one bulb",
      "A negative voltage",
      "Roughly the full battery voltage — the whole voltage drop is now across the gap",
    ],
    correctIndex: 3,
    explanation: "When the switch is open, no current flows, so the bulbs drop $0\\text{ V}$. The full battery voltage now appears **across the open switch** — that's where it 'goes.'",
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
    icon: "💡", style: "insight",
    content: "**Big idea today:**\n\n- **Series:** voltage **splits** across components — the drops add up to the battery voltage.\n- **Parallel:** every branch sees the **full** battery voltage.\n- **Open switch:** no current flows, the bulbs drop $0\\text{ V}$, and the **full battery voltage appears across the open gap**.\n- A **master switch** sits in the main line, so opening it drops all the voltage across one gap and kills every bulb. An **independent switch** sits on one branch, so opening it only kills that branch — the other branches still see full voltage.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** A switch that kills *every* bulb sits in the **main line** — in series with the whole circuit — so opening it drops the full battery voltage across one gap and stops all current. A switch that kills only *one* bulb sits on a **single branch**, in series with just that bulb. Your Experiment 4 and 5 data showed exactly this: the open switch reads the full battery voltage, and where it sits decides how many bulbs go dark.",
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
      { term: "Voltage Drop", definition: "The amount of voltage 'used up' across a component as current passes through it. Measured by touching a voltmeter's two leads to the two sides of the component." },
      { term: "Series Circuit", definition: "Components connected one after another in a single loop. Voltage splits across them; the drops add up to the source voltage." },
      { term: "Parallel Circuit", definition: "Components on separate branches between the same two points. Every branch sees the full source voltage." },
      { term: "Master Switch", definition: "A switch in the main line of a circuit, in series with everything. Opening it stops all current — every load turns off." },
      { term: "Independent Switch", definition: "A switch on a single branch, in series with just one load. Opening it only affects that branch; other branches keep full voltage." },
      { term: "Open Circuit", definition: "A break in the loop so no current flows. The full source voltage appears across the break (e.g. across an open switch)." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lesson = {
    title: "Circuit Voltage Lab (PhET)",
    questionOfTheDay: "Flip one switch and every light in the room goes dark. Flip a different switch and only one light goes out. What has to be different about where those two switches sit in the circuit?",
    course: "Physics",
    unit: "Circuits",
    order: 5.5,
    visible: false,
    gradesReleased: true,
    dueDate: "2026-05-14",
    blocks,
    updatedAt: new Date(),
  };

  // Preserve admin-managed fields (visible, dueDate, gradesReleased) from existing doc
  const existing = await db.collection("courses").doc(COURSE_ID)
    .collection("lessons").doc(LESSON_ID).get();
  if (existing.exists) {
    const d = existing.data();
    if (d.visible !== undefined) lesson.visible = d.visible;
    if (d.dueDate !== undefined) lesson.dueDate = d.dueDate;
    if (d.gradesReleased !== undefined) lesson.gradesReleased = d.gradesReleased;
  }

  const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
  console.log(`✅ Lesson seeded: "${lesson.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${lesson.blocks.length} | Order: ${lesson.order} | visible: ${lesson.visible}`);
  console.log(`   safeLessonWrite: ${result.action} (preserved ${result.preserved} block IDs)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
