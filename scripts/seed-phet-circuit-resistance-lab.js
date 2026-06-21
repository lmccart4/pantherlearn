// seed-phet-circuit-resistance-lab.js
// Physics — Circuits Unit, order 5.7
// "Circuit Resistance Lab (PhET)"
// Sibling to seed-phet-circuit-current-lab.js. Students introduce Ohm's law
// (V = IR), practice solving for each of the three variables once, then
// discover how resistance CHANGES as bulbs are added in series vs parallel.
// They can't measure R directly, so they measure voltage drop (voltmeter) and
// current (ammeter) and compute R = V / I.
// Diagrams: label-less, X-symbol bulbs — ~/Lachlan/tools/circuit-diagrams/resistance-lab-diagrams.py
// Run: node scripts/seed-phet-circuit-resistance-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "phet-circuit-resistance-lab";
const IMG = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/resistance-lab";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Reusable resistance data table — for EACH bulb: V measured, I measured, R calculated,
// brightness observed; plus a whole-circuit total row. Pass the rows per experiment.
function resistanceTable(id, title, rows) {
  return {
    id, type: "data_table",
    preset: "numeric",
    title,
    rowHeader: "What you're measuring",
    weight: 5,
    scored: true,
    columns: [
      { key: "voltage", label: "Voltage drop", unit: "V", sublabel: "measure" },
      { key: "current", label: "Current", unit: "A", sublabel: "measure" },
      { key: "resistance", label: "Resistance R = V ÷ I", unit: "Ω", sublabel: "calculate" },
      { key: "brightness", label: "Brightness", type: "select",
        options: ["—", "Off", "Dim", "Medium", "Bright", "Very bright"], sublabel: "observe" },
    ],
    rows,
  };
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
      "State Ohm's law ($V = IR$) and rearrange it to solve for voltage, current, or resistance",
      "Find a circuit element's resistance by measuring its voltage drop and current and computing $R = V \\div I$",
      "Discover that each bulb's own resistance stays about the same, while the whole circuit's total resistance goes up in series and down in parallel",
      "Connect resistance back to brightness and to the current and voltage rules from the last two labs",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** One flashlight bulb on a battery glows nice and bright. Add a second *identical* bulb **in a line** behind it and *both* go dim. But wire that same second bulb on its **own separate path** and both stay bright — while the battery drains faster. Same battery, same two bulbs. So what is actually *changing* about the circuit when you rearrange the bulbs?",
  },

  {
    id: "q-warmup-predict", type: "question",
    questionType: "short_answer",
    prompt: "**Before you build or calculate anything**, make a prediction: when you add more light bulbs to a circuit, do you think the circuit gets *harder* or *easier* for the electricity to flow through? Does it matter whether the bulbs are added in a line (series) or on separate paths (parallel)? Take your best shot — you'll test it with real measurements today.",
    difficulty: "understand",
    gradingRubric: "LENIENT — opening prediction made before any instruction. Full credit for any genuine attempt that commits to harder/easier and mentions series vs parallel in any way. Do not penalize wrong guesses or imprecise wording.",
  },

  // ─── A NEW TOOL: OHM'S LAW ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "A New Tool: Ohm's Law",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "There's a problem we need to solve first. **Resistance** is how hard a component fights the flow of charge — but our sim has no \"resistance meter.\" We can only measure two things: **voltage** (with a voltmeter) and **current** (with an ammeter).\n\nLuckily, those three quantities are locked together by one of the most useful equations in all of physics — **Ohm's law**:\n\n$$V = I \\times R$$\n\nwhere $V$ is voltage in **volts (V)**, $I$ is current in **amps (A)**, and $R$ is resistance in **ohms (Ω)**. If we know any two, we can find the third.",
  },

  {
    id: uid(), type: "callout",
    icon: "💧", style: "insight",
    content: "**A way to picture it — water in a pipe:**\n\n- **Voltage** $V$ is the *push* — like water pressure behind the pipe.\n- **Current** $I$ is the *flow* — how much water actually moves per second.\n- **Resistance** $R$ is how *narrow or clogged* the pipe is.\n\nFor the same push, a **narrower** pipe (more resistance) lets **less** water through. That's exactly what Ohm's law says: for a fixed voltage, more resistance means less current.",
  },

  {
    id: uid(), type: "callout",
    icon: "🔧", style: "info",
    content: "**One equation, three forms.** Rearrange $V = IR$ depending on what you're solving for:\n\n- Solve for voltage: $V = I \\times R$\n- Solve for current: $I = \\dfrac{V}{R}$\n- Solve for resistance: $R = \\dfrac{V}{I}$\n\nThat last one — $R = \\dfrac{V}{I}$ — is the one you'll use all lab. Measure the voltage drop, measure the current, divide.",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example 1 — solve for voltage $V$.**\n\nA resistor carries a current of $I = 2\\text{ A}$ and has a resistance of $R = 5\\ \\Omega$. What is the voltage across it?\n\n$$V = I \\times R = (2\\text{ A})(5\\ \\Omega) = 10\\text{ V}$$\n\nYou have $I$ and $R$, so you use the equation as-is. **Answer: 10 V.**",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example 2 — solve for current $I$.**\n\nA device with resistance $R = 4\\ \\Omega$ is connected across a voltage of $V = 12\\text{ V}$. How much current flows through it?\n\nRearrange to get $I$ by itself:\n\n$$I = \\frac{V}{R} = \\frac{12\\text{ V}}{4\\ \\Omega} = 3\\text{ A}$$\n\n**Answer: 3 A.**",
  },

  {
    id: uid(), type: "text",
    content: "**Worked Example 3 — solve for resistance $R$ (the lab move).**\n\nYou measure a voltage drop of $V = 9\\text{ V}$ across a bulb and a current of $I = 3\\text{ A}$ through it. What is the bulb's resistance?\n\nRearrange to get $R$ by itself:\n\n$$R = \\frac{V}{I} = \\frac{9\\text{ V}}{3\\text{ A}} = 3\\ \\Omega$$\n\n**Answer: 3 Ω.** This is exactly what you'll do for every circuit today — measure $V$, measure $I$, divide.",
  },

  {
    id: "q-ohm-v", type: "question",
    questionType: "multiple_choice",
    prompt: "**Your turn — solve for $V$.** A bulb has resistance $R = 6\\ \\Omega$ and carries a current of $I = 2\\text{ A}$. What is the voltage drop across it?",
    difficulty: "apply",
    options: [
      "$12\\text{ V}$ — use $V = I \\times R = 2 \\times 6$",
      "$3\\text{ V}$ — divide $6 \\div 2$",
      "$8\\text{ V}$ — add $2 + 6$",
      "$0.33\\text{ V}$ — divide $2 \\div 6$",
    ],
    correctIndex: 0,
    explanation: "Solving for voltage uses the equation as-is: $V = I \\times R = (2\\text{ A})(6\\ \\Omega) = 12\\text{ V}$.",
  },

  {
    id: "q-ohm-i", type: "question",
    questionType: "multiple_choice",
    prompt: "**Your turn — solve for $I$.** A resistor of $R = 3\\ \\Omega$ is connected across $V = 12\\text{ V}$. How much current flows?",
    difficulty: "apply",
    options: [
      "$36\\text{ A}$ — multiply $12 \\times 3$",
      "$0.25\\text{ A}$ — divide $3 \\div 12$",
      "$9\\text{ A}$ — subtract $12 - 3$",
      "$4\\text{ A}$ — use $I = \\dfrac{V}{R} = \\dfrac{12}{3}$",
    ],
    correctIndex: 3,
    explanation: "Solving for current: $I = \\dfrac{V}{R} = \\dfrac{12\\text{ V}}{3\\ \\Omega} = 4\\text{ A}$.",
  },

  {
    id: "q-ohm-r", type: "question",
    questionType: "multiple_choice",
    prompt: "**Your turn — solve for $R$ (the one you'll use all lab).** You measure $V = 8\\text{ V}$ across a bulb and $I = 2\\text{ A}$ through it. What is its resistance?",
    difficulty: "apply",
    options: [
      "$16\\ \\Omega$ — multiply $8 \\times 2$",
      "$4\\ \\Omega$ — use $R = \\dfrac{V}{I} = \\dfrac{8}{2}$",
      "$10\\ \\Omega$ — add $8 + 2$",
      "$0.25\\ \\Omega$ — divide $2 \\div 8$",
    ],
    correctIndex: 1,
    explanation: "Solving for resistance: $R = \\dfrac{V}{I} = \\dfrac{8\\text{ V}}{2\\text{ A}} = 4\\ \\Omega$. This is the calculation you'll run for every experiment today.",
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
    content: "Now you'll build a progression of circuits and find the **resistance** — even though you can't measure resistance directly. The key move today: you'll measure **each bulb on its own** *and* figure out the **whole circuit's total**. For each experiment:\n\n1. Build the circuit in the PhET sim below\n2. **For each bulb:** measure the **voltage drop across that one bulb** (voltmeter) and the **current through that same bulb** (spot ammeter), then calculate that bulb's $R = V \\div I$\n3. **For the whole circuit:** find the total voltage and total current (each experiment tells you how), then calculate the total $R = V \\div I$\n4. Record everything in the data table and note how **bright** the bulbs are\n5. Answer the analysis question\n\nYour data tables auto-save as you type.",
  },

  {
    id: uid(), type: "embed",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html",
    caption: "PhET Circuit Construction Kit: DC. Drag components from the right panel onto the workspace. Drag wire endpoints to connect them.",
    height: 600,
    scored: false,
  },

  {
    id: uid(), type: "callout",
    icon: "📍", style: "insight",
    content: "**Use the spot ammeter to measure one bulb's current.** In the toolbox on the right is the **Non-Contact Ammeter** — the round meter with a cross-hair (shown below). Drag it so the cross-hair sits **right on top of a wire**, and it reads the current at that exact spot in **amps (A)**. To get the current through *one particular bulb*, place it on the wire **right next to that bulb** (in that bulb's own branch).",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/spot-ammeter.png`,
    alt: "The PhET Non-Contact Ammeter — a round probe with a cross-hair connected to an orange meter labeled Current.",
    caption: "The spot (Non-Contact) Ammeter. Drop the cross-hair onto any wire to read the current at that exact spot.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Measuring one bulb at a time:**\n\n- **Voltmeter** (red & black probes): touch the **red** probe to one side of a single bulb and the **black** probe to the other side → the **voltage drop across that one bulb** in volts (V).\n- **Spot ammeter** (cross-hair): rest it on the wire **right at that same bulb** → the **current through that bulb** in amps (A).\n\nKeep your **battery voltage the same** for every experiment (don't change the battery) so your comparisons are fair. If a reading comes out negative, just record its size.",
  },

  // ─── EXPERIMENT 1: ONE BULB (BASELINE) ──────────────────

  {
    id: uid(), type: "section_header",
    icon: "1️⃣",
    title: "Experiment 1: One Bulb (Baseline)",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery, one light bulb, in a single complete loop.\n\n**Measure it:**\n\n- **Voltmeter** probes across the bulb → the **voltage drop**.\n- **Spot ammeter** on the loop wire → the **current** through the bulb.\n\n**Calculate it:** $R = V \\div I$. With only one bulb, this is **both** the bulb's own resistance **and** the whole circuit's total resistance — they're the same thing here. This is your **baseline**: every other circuit gets compared to it.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/r1.png`,
    alt: "Circuit diagram — one battery connected to one light bulb (circle-with-X symbol) in a single loop.",
    caption: "Experiment 1: one bulb. Measure the voltage drop across the bulb and the current through it.",
  },

  resistanceTable("data-exp1", "Experiment 1 Data — One Bulb (Baseline)", [
    { key: "bulb", label: "The bulb (= the whole circuit)" },
  ]),

  {
    id: "q-exp1", type: "question",
    questionType: "short_answer",
    prompt: "Show your work: write your measured voltage drop, your measured current, and the resistance you got from $R = V \\div I$. Roughly how bright was the bulb? This single number is your **baseline** — keep it handy, because you'll compare every other bulb and circuit to it.",
    difficulty: "apply",
  },

  // ─── EXPERIMENT 2: TWO BULBS IN SERIES ──────────────────

  {
    id: uid(), type: "section_header",
    icon: "2️⃣",
    title: "Experiment 2: Two Bulbs in Series",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery and **two bulbs in series** — one continuous loop, the two bulbs one after the other.\n\n**Measure each bulb:**\n\n- **Voltmeter** across **Bulb 1 only**, then across **Bulb 2 only** → each bulb's own voltage drop.\n- **Spot ammeter** on the loop wire → the current. In a series loop the current is the *same everywhere* (from the current lab), so one reading is the current through *both* bulbs.\n- Calculate **each bulb's** $R = V \\div I$.\n\n**Now the whole circuit:**\n\n- **Total voltage** $=$ Bulb 1's drop $+$ Bulb 2's drop.\n- **Total current** $=$ the loop current (same as each bulb).\n- **Total** $R = \\dfrac{V_{\\text{total}}}{I}$. Compare this total to your one-bulb baseline.\n\n*(The bulbs are identical, so it doesn't matter which one you call Bulb 1.)*",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/r2.png`,
    alt: "Circuit diagram — one battery with two light bulbs (circle-with-X symbols) connected one after another in series.",
    caption: "Experiment 2: two bulbs in series. Measure each bulb's voltage drop and the loop current.",
  },

  resistanceTable("data-exp2", "Experiment 2 Data — Two Bulbs in Series", [
    { key: "bulb1", label: "Bulb 1 (this bulb only)" },
    { key: "bulb2", label: "Bulb 2 (this bulb only)" },
    { key: "total", label: "Whole circuit (both bulbs)", skip: ["brightness"] },
  ]),

  {
    id: "q-exp2", type: "question",
    questionType: "short_answer",
    prompt: "Two comparisons. **(1)** How does each individual bulb's resistance compare to your one-bulb baseline — about the same, or different? **(2)** How does the *whole circuit's* total resistance compare to the baseline? Then connect it to brightness: are the bulbs brighter or dimmer than the single bulb, and what does that tell you about how much current is flowing now?",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 3: THREE BULBS IN SERIES ────────────────

  {
    id: uid(), type: "section_header",
    icon: "3️⃣",
    title: "Experiment 3: Three Bulbs in Series",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** Add a **third bulb in series**, so now three bulbs sit one after another in a single loop.\n\n**Measure each bulb:** Voltmeter across each bulb on its own (Bulb 1, then 2, then 3); spot ammeter on the loop wire for the current (same through all three). Calculate each bulb's $R = V \\div I$.\n\n**Now the whole circuit:** Total voltage $=$ the three drops added together; total current $=$ the loop current; total $R = \\dfrac{V_{\\text{total}}}{I}$.\n\nYou now have the series pattern for one, two, and three bulbs. Look at how the **total** resistance moves.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/r3.png`,
    alt: "Circuit diagram — one battery with three light bulbs (circle-with-X symbols) connected one after another in series.",
    caption: "Experiment 3: three bulbs in series. Measure each bulb's voltage drop and the loop current.",
  },

  resistanceTable("data-exp3", "Experiment 3 Data — Three Bulbs in Series", [
    { key: "bulb1", label: "Bulb 1 (this bulb only)" },
    { key: "bulb2", label: "Bulb 2 (this bulb only)" },
    { key: "bulb3", label: "Bulb 3 (this bulb only)" },
    { key: "total", label: "Whole circuit (all three bulbs)", skip: ["brightness"] },
  ]),

  {
    id: "q-exp3", type: "question",
    questionType: "short_answer",
    prompt: "Line up your **total** resistances for series: 1 bulb, 2 bulbs, 3 bulbs. What happens to the total each time you add another bulb in series? Meanwhile, did each *individual* bulb's resistance change much? If one bulb is about $R$, write a rule for what two and three bulbs in series should total.",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 4: TWO BULBS IN PARALLEL ────────────────

  {
    id: uid(), type: "section_header",
    icon: "4️⃣",
    title: "Experiment 4: Two Bulbs in Parallel",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "⏱️", style: "info",
    content: "**No need to rush.** Get as far as you can during the period — this lab is **due tomorrow**, so you'll have time to finish any experiments you don't reach in class. Try to at least *build* Experiment 4 today so you can ask questions while you're here.",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery and **two bulbs in parallel** — each bulb on its own branch between the same two junctions.\n\n**Measure each bulb:**\n\n- **Voltmeter** across **Bulb 1**, then across **Bulb 2** → each bulb's own voltage drop. (The two branches share the same junctions, so these should come out about equal.)\n- **Spot ammeter** on **Bulb 1's branch**, then on **Bulb 2's branch** → the current through *each* bulb.\n- Calculate **each bulb's** $R = V \\div I$.\n\n**Now the whole circuit:**\n\n- **Total voltage** $=$ the bulb voltage (it's the same across each branch — just use it).\n- **Total current** $=$ Branch 1's current $+$ Branch 2's current. *(Junction rule from the current lab: the branch currents add up to what the battery delivers.)*\n- **Total** $R = \\dfrac{V}{I_{\\text{total}}}$. Compare this total to your one-bulb baseline.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/r4.png`,
    alt: "Circuit diagram — one battery with two light bulbs (circle-with-X symbols) on separate parallel branches between two junctions.",
    caption: "Experiment 4: two bulbs in parallel. Measure each bulb's voltage drop and the current through its own branch.",
  },

  resistanceTable("data-exp4", "Experiment 4 Data — Two Bulbs in Parallel", [
    { key: "bulb1", label: "Bulb 1 (this bulb only)" },
    { key: "bulb2", label: "Bulb 2 (this bulb only)" },
    { key: "total", label: "Whole circuit (total current = both branches)", skip: ["brightness"] },
  ]),

  {
    id: "q-exp4", type: "question",
    questionType: "short_answer",
    prompt: "Two comparisons again. **(1)** How does each individual bulb's resistance compare to your baseline? **(2)** How does the *whole circuit's* total resistance ($R = V \\div I_{\\text{total}}$) compare to the baseline — and to the two-bulb *series* result from Experiment 2? Here's the surprise: adding a bulb in parallel made the total go **which way** — up or down? And how bright are these bulbs compared to the single-bulb case?",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 5: THREE BULBS IN PARALLEL ──────────────

  {
    id: uid(), type: "section_header",
    icon: "5️⃣",
    title: "Experiment 5: Three Bulbs in Parallel",
    subtitle: "~6 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** Add a **third bulb on its own parallel branch**, so now three bulbs sit in parallel between the same two junctions.\n\n**Measure each bulb:** Voltmeter across each bulb; spot ammeter on **each branch** for that bulb's current. Calculate each bulb's $R = V \\div I$.\n\n**Now the whole circuit:** Total voltage $=$ the bulb voltage; total current $=$ Branch 1 $+$ Branch 2 $+$ Branch 3; total $R = \\dfrac{V}{I_{\\text{total}}}$.\n\nYou now have the parallel pattern for one, two, and three bulbs. Put it side-by-side with your series pattern.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/r5.png`,
    alt: "Circuit diagram — one battery with three light bulbs (circle-with-X symbols) on separate parallel branches between two junctions.",
    caption: "Experiment 5: three bulbs in parallel. Measure each bulb's voltage drop and the current through its own branch.",
  },

  resistanceTable("data-exp5", "Experiment 5 Data — Three Bulbs in Parallel", [
    { key: "bulb1", label: "Bulb 1 (this bulb only)" },
    { key: "bulb2", label: "Bulb 2 (this bulb only)" },
    { key: "bulb3", label: "Bulb 3 (this bulb only)" },
    { key: "total", label: "Whole circuit (total current = all three branches)", skip: ["brightness"] },
  ]),

  {
    id: "q-exp5", type: "question",
    questionType: "short_answer",
    prompt: "Line up your **total** parallel resistances (1, 2, 3 bulbs). What happens to the total each time you add a bulb in parallel? Each individual bulb still measured about the baseline $R$ — so why does giving the current *more separate paths* make the whole circuit easier to push through? Use your numbers to back up your explanation.",
    difficulty: "evaluate",
  },

  // ─── SYNTHESIS ──────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧩",
    title: "Put It Together",
    subtitle: "~4 minutes",
  },

  {
    id: "q-synth", type: "question",
    questionType: "short_answer",
    prompt: "Pull it all together in a few sentences. **(1)** What did you notice about each *individual* bulb's resistance, no matter how it was wired? **(2)** What happens to the *whole circuit's* total resistance when you add bulbs in **series**, versus in **parallel**? **(3)** Connect it to brightness: in which arrangement did adding bulbs make each one dimmer, and how does resistance explain that?",
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
    content: "**Screenshot one of your parallel builds** (Experiment 4 or 5) with the **voltmeter** reading the voltage across a bulb and the **spot ammeter** sitting on one of the **branches**. Make sure your name is visible somewhere on screen (browser tab, sticky note, etc.).",
  },

  {
    id: "evidence-final-build", type: "evidence_upload",
    title: "Upload: Your Parallel Circuit with Both Meters",
    instructions: "Take a screenshot of your parallel circuit (Experiment 4 or 5) in the PhET sim — the bulbs on their branches, the voltmeter reading a bulb's voltage drop, and the spot ammeter on one of the branches. Make sure your name is visible on screen.",
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
    prompt: "An ammeter reads $0.5\\text{ A}$ through a bulb and a voltmeter reads $6\\text{ V}$ across it. What is the bulb's resistance?",
    difficulty: "apply",
    options: [
      "$3\\ \\Omega$ — multiply $6 \\times 0.5$",
      "$6.5\\ \\Omega$ — add $6 + 0.5$",
      "$12\\ \\Omega$ — use $R = \\dfrac{V}{I} = \\dfrac{6}{0.5}$",
      "$0.08\\ \\Omega$ — divide $0.5 \\div 6$",
    ],
    correctIndex: 2,
    explanation: "$R = \\dfrac{V}{I} = \\dfrac{6\\text{ V}}{0.5\\text{ A}} = 12\\ \\Omega$. Dividing by a number less than 1 makes the answer bigger — a common spot to slip up.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two identical $10\\ \\Omega$ bulbs are wired **in series**. What total resistance does the battery see?",
    difficulty: "apply",
    options: [
      "$10\\ \\Omega$ — adding a second bulb doesn't change it",
      "$5\\ \\Omega$ — a second bulb cuts the resistance in half",
      "$100\\ \\Omega$ — resistances multiply",
      "$20\\ \\Omega$ — resistances in series add together",
    ],
    correctIndex: 3,
    explanation: "In series, resistances **add**: $10\\ \\Omega + 10\\ \\Omega = 20\\ \\Omega$. The charge has to fight its way through both bulbs in a row, so the total opposition goes up.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "You add a second identical bulb **in parallel** with the first. What happens to the total resistance the battery sees?",
    difficulty: "understand",
    options: [
      "It goes **down** — a second branch gives the current another path to flow through",
      "It goes **up** — more bulbs always means more resistance",
      "It stays exactly the same — the bulbs are identical",
      "It doubles — two bulbs means twice the resistance",
    ],
    correctIndex: 0,
    explanation: "Adding a parallel branch opens a **new path** for current, so the circuit overall is *easier* to push through — total resistance drops below even a single bulb. More paths = less resistance.",
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
    content: "**Big ideas today:**\n\n- **Ohm's law** ties the three quantities together: $V = IR$, so $R = \\dfrac{V}{I}$. You can find a resistance you can't measure directly, as long as you can measure voltage and current.\n- **Each bulb's own resistance barely changed.** No matter how you wired it, one bulb measured about the same $R$ every time — resistance is a *property of the bulb itself*. What changed was the **whole circuit's total**.\n- **Series adds resistance.** Each bulb you add in a line makes the total bigger, so less current flows and every bulb gets dimmer.\n- **Parallel lowers resistance.** Each bulb you add on its own branch gives current a new path, so the total drops *below* a single bulb and the battery has to push out more total current.\n- It comes back to **paths**: series = one harder road; parallel = more lanes on the highway.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Wiring the second bulb **in series** doubled the resistance — so the current dropped and *both* bulbs went dim. Wiring it **in parallel** gave the current a second path, *lowering* the total resistance — each bulb still got the full battery voltage and stayed bright, while the battery drained faster because it was pushing out more total current. Same battery, same bulbs — the arrangement changed the **resistance**, and resistance is what controls the flow.",
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
      { term: "Resistance", definition: "How strongly a component opposes the flow of charge. Measured in ohms (Ω). Can't be measured directly with our meters — we calculate it." },
      { term: "Ohm (Ω)", definition: "The unit of resistance. One ohm is one volt per amp: $1\\ \\Omega = 1\\text{ V} / 1\\text{ A}$." },
      { term: "Ohm's Law", definition: "The relationship $V = IR$ between voltage, current, and resistance. Rearranges to $I = V/R$ and $R = V/I$." },
      { term: "Voltage drop", definition: "The amount of voltage \"used up\" across a component, measured with a voltmeter placed across it." },
      { term: "Equivalent (total) resistance", definition: "The single resistance value that the battery effectively \"sees\" for a whole network of components." },
      { term: "Series", definition: "Components in a single line, one after another. Resistances add, so total resistance increases." },
      { term: "Parallel", definition: "Components on separate branches between the same two junctions. Adding branches lowers the total resistance." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lesson = {
    title: "Circuit Resistance Lab (PhET)",
    questionOfTheDay: "One flashlight bulb glows bright. Add an identical bulb in a line and both go dim — but put it on its own separate path and both stay bright while the battery drains faster. Same battery, same bulbs. What is actually changing about the circuit?",
    course: "Physics",
    unit: "Circuits",
    order: 5.7,
    visible: false,
    gradesReleased: true,
    dueDate: "2026-05-22",
    blocks,
    updatedAt: new Date(),
  };

  // Preserve admin-managed fields from existing doc if present
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
