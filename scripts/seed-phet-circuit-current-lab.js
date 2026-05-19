// seed-phet-circuit-current-lab.js
// Physics — Circuits Unit, order 5.6
// "Circuit Current Lab (PhET)"
// Students discover (1) current is the same everywhere in a series loop and
// (2) the junction rule: ΣI_in = ΣI_out at any junction.
// Modeled on seed-phet-circuit-voltage-lab.js.
// Run: node scripts/seed-phet-circuit-current-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "phet-circuit-current-lab";

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
      "Build a progression of circuits in the PhET simulation and measure current at multiple points using the ammeter",
      "Discover that the current is the same at every point in a single series loop",
      "Discover the junction rule: the current flowing into a junction equals the total current flowing out",
      "Record current readings in organized tables and use them to justify both rules",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Your kitchen has four outlets on the same circuit. You plug in a toaster — the lights dim a little. You plug in a microwave too — they dim more. The wires haven't changed. So where is all that extra electricity *coming from*, and how does the circuit know to send more when you add more stuff?",
  },

  {
    id: "q-warmup-predict", type: "question",
    questionType: "short_answer",
    prompt: "Last lesson you measured **voltage** at many points in a circuit. Today you'll measure **current** — the flow of charge through the wires. **Before you build anything**, predict: in a simple loop with a battery and one bulb, do you think the current going *into* the bulb is bigger than, smaller than, or the same as the current coming *out* of the bulb? Take a shot — you'll test it with real measurements.",
    difficulty: "understand",
    gradingRubric: "LENIENT — this is an opening prediction made before any building. Award full credit for any genuine attempt that picks bigger/smaller/same and gives any reason. Do not penalize wrong guesses or imprecise wording.",
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
    content: "Today you build a progression of circuits in a simulation, where you can **measure** current at any point. You'll work through **5 experiments** in order. For each one:\n\n1. Build the circuit in the PhET sim below\n2. Use the **ammeter** to measure the current at each labeled point\n3. Record your current readings in that experiment's data table\n4. Answer the analysis question\n\nYour data tables auto-save as you type.",
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
    content: "**Using the ammeter:** Grab the **Non-Contact Ammeter** (the round meter with a cross-hair) from the toolbox on the right. Drag it so the cross-hair sits **on top of a wire**. The reading is the current in **amps (A)** flowing through that spot. To measure at a new spot, just slide the ammeter to a different piece of wire. If you get a negative number, the current is just flowing the other direction — record the size of the number.",
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
    content: "**Build it:** One battery, one light bulb, connected in a single complete loop.\n\n**Measure it:** Use the ammeter to measure the current at **two** different spots in the loop:\n\n- **Point A:** on the wire *between the battery and the bulb*\n- **Point B:** on the wire *coming out of the bulb*\n\nRecord both current readings. This is your **baseline** for the rest of the lab.",
  },

  {
    id: uid(), type: "image",
    url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/current-lab/exp1.png",
    alt: "Circuit diagram — one battery and one bulb in a single loop, with two measurement points labeled A and B around the loop.",
    caption: "Experiment 1: one-bulb loop with two ammeter points (A and B).",
  },

  {
    id: "data-exp1", type: "data_table",
    preset: "numeric",
    title: "Experiment 1 Data — One-Bulb Baseline",
    rowHeader: "Measurement Point",
    weight: 5,
    scored: true,
    columns: [
      { key: "current", label: "Current", unit: "A" },
    ],
    rows: [
      { key: "pointA", label: "Point A — before bulb" },
      { key: "pointB", label: "Point B — after bulb" },
    ],
  },

  {
    id: "q-exp1", type: "question",
    questionType: "short_answer",
    prompt: "How do your two current readings compare? Was more current going *into* the bulb than coming *out* of it, or were they the same? What does that tell you about whether the bulb 'uses up' the current?",
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
    content: "**Build it:** One battery and **three bulbs in series** — one continuous loop, each bulb one after the next.\n\n**Measure it:** Use the ammeter at **four** spots along the loop:\n\n- **Point A:** between the battery and Bulb 1\n- **Point B:** between Bulb 1 and Bulb 2\n- **Point C:** between Bulb 2 and Bulb 3\n- **Point D:** between Bulb 3 and the battery\n\nRecord each current reading. Compare your numbers to your Experiment 1 baseline.",
  },

  {
    id: uid(), type: "image",
    url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/current-lab/exp2.png",
    alt: "Circuit diagram — battery with three bulbs in series, four ammeter measurement points A, B, C, D between and after the bulbs.",
    caption: "Experiment 2: three bulbs in series with four ammeter points (A, B, C, D).",
  },

  {
    id: "data-exp2", type: "data_table",
    preset: "numeric",
    title: "Experiment 2 Data — Three Bulbs in Series",
    rowHeader: "Measurement Point",
    weight: 5,
    scored: true,
    columns: [
      { key: "current", label: "Current", unit: "A" },
    ],
    rows: [
      { key: "pointA", label: "Point A — before Bulb 1" },
      { key: "pointB", label: "Point B — between Bulb 1 and Bulb 2" },
      { key: "pointC", label: "Point C — between Bulb 2 and Bulb 3" },
      { key: "pointD", label: "Point D — after Bulb 3, returning to battery" },
    ],
  },

  {
    id: "q-exp2", type: "question",
    questionType: "short_answer",
    prompt: "Compare your four current readings in the series loop. Are they all about the same, or are some bigger than others? Also: is the current in this series circuit bigger, smaller, or the same as the current you measured in Experiment 1? Write a sentence describing the rule for current in a series loop.",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 3: TWO BULBS IN PARALLEL ────────────────

  {
    id: uid(), type: "section_header",
    icon: "3️⃣",
    title: "Experiment 3: Two Bulbs in Parallel",
    subtitle: "~7 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery and **two bulbs in parallel** — each bulb on its own branch, both branches connecting the same two points. The points where the wire **splits** into two branches and **rejoins** are called **junctions**.\n\n**Measure it:** Use the ammeter at **three** spots:\n\n- **Main:** on the main wire coming out of the battery (before the split)\n- **Branch 1:** on the wire going through Bulb 1\n- **Branch 2:** on the wire going through Bulb 2\n\nRecord all three current readings.",
  },

  {
    id: uid(), type: "image",
    url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/current-lab/exp3.png",
    alt: "Circuit diagram — battery with two bulbs in parallel. Ammeter points labeled Main on the wire from the battery and Branch 1, Branch 2 on each parallel branch.",
    caption: "Experiment 3: two bulbs in parallel with ammeter points Main, Branch 1, Branch 2.",
  },

  {
    id: "data-exp3", type: "data_table",
    preset: "numeric",
    title: "Experiment 3 Data — Two Bulbs in Parallel",
    rowHeader: "Measurement Point",
    weight: 5,
    scored: true,
    columns: [
      { key: "current", label: "Current", unit: "A" },
    ],
    rows: [
      { key: "main", label: "Main line — out of battery" },
      { key: "branch1", label: "Branch 1 — through Bulb 1" },
      { key: "branch2", label: "Branch 2 — through Bulb 2" },
    ],
  },

  {
    id: "q-exp3", type: "question",
    questionType: "short_answer",
    prompt: "Add Branch 1's current and Branch 2's current together. How does that sum compare to the **main line** current you measured? Use your numbers to write a sentence describing what happens to the current when the wire splits into two branches.",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 4: THREE BULBS IN PARALLEL ──────────────

  {
    id: uid(), type: "section_header",
    icon: "4️⃣",
    title: "Experiment 4: Three Bulbs in Parallel",
    subtitle: "~7 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "⏱️", style: "info",
    content: "**Running low on time?** Experiments 4 and 5 can be finished for homework — but try to at least build Experiment 4 in class so you can ask questions.",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** Add a **third branch with a third bulb** to your Experiment 3 circuit, so now you have **three bulbs in parallel** between the same two junctions.\n\n**Measure it:** Use the ammeter at **four** spots:\n\n- **Main:** on the main wire out of the battery\n- **Branch 1, 2, 3:** on each bulb's branch\n\nRecord all four current readings.",
  },

  {
    id: uid(), type: "image",
    url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/current-lab/exp4.png",
    alt: "Circuit diagram — battery with three bulbs in parallel. Ammeter points labeled Main on the wire from the battery and Branch 1, Branch 2, Branch 3 on each parallel branch.",
    caption: "Experiment 4: three bulbs in parallel with ammeter points Main, Branch 1, Branch 2, Branch 3.",
  },

  {
    id: "data-exp4", type: "data_table",
    preset: "numeric",
    title: "Experiment 4 Data — Three Bulbs in Parallel",
    rowHeader: "Measurement Point",
    weight: 5,
    scored: true,
    columns: [
      { key: "current", label: "Current", unit: "A" },
    ],
    rows: [
      { key: "main", label: "Main line — out of battery" },
      { key: "branch1", label: "Branch 1 — through Bulb 1" },
      { key: "branch2", label: "Branch 2 — through Bulb 2" },
      { key: "branch3", label: "Branch 3 — through Bulb 3" },
    ],
  },

  {
    id: "q-exp4", type: "question",
    questionType: "short_answer",
    prompt: "Add all three branch currents together. How does that sum compare to the main-line current? Compare your main-line current here (three parallel branches) to your main-line current in Experiment 3 (two parallel branches) — what changed, and what does that tell you about how the battery responds when you add more branches?",
    difficulty: "analyze",
  },

  // ─── EXPERIMENT 5: MIXED CIRCUIT — FIND THE JUNCTION ────

  {
    id: uid(), type: "section_header",
    icon: "5️⃣",
    title: "Experiment 5: Find the Junction",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Build it:** One battery → **one bulb in series** (call it Bulb S) → then the wire **splits into two parallel branches**, each with its own bulb (Bulb P1 and Bulb P2) → then the branches **rejoin** and return to the battery.\n\nThe point where the wire splits and the point where it rejoins are both **junctions**. Pick the *split* junction for this experiment.\n\n**Measure it:** Use the ammeter at **four** spots:\n\n- **Into junction:** on the wire just *after Bulb S* and *before the split*\n- **Branch P1:** on the wire through Bulb P1\n- **Branch P2:** on the wire through Bulb P2\n- **Out of junction (after rejoin):** on the wire just *after* the branches rejoin, heading back to the battery\n\nRecord all four current readings.",
  },

  {
    id: uid(), type: "image",
    url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/current-lab/exp5.png",
    alt: "Circuit diagram — mixed series-parallel circuit with Bulb S in series followed by Bulb P1 and Bulb P2 in parallel. Ammeter points labeled Into junction, Branch P1, Branch P2, Out of junction.",
    caption: "Experiment 5: mixed circuit with Bulb S in series, Bulb P1 and Bulb P2 in parallel. Ammeter points: Into junction, Branch P1, Branch P2, Out of junction.",
  },

  {
    id: "data-exp5", type: "data_table",
    preset: "numeric",
    title: "Experiment 5 Data — Mixed Series–Parallel Circuit",
    rowHeader: "Measurement Point",
    weight: 5,
    scored: true,
    columns: [
      { key: "current", label: "Current", unit: "A" },
    ],
    rows: [
      { key: "intoJunction", label: "Into junction (after Bulb S)" },
      { key: "branchP1", label: "Branch P1 — through Bulb P1" },
      { key: "branchP2", label: "Branch P2 — through Bulb P2" },
      { key: "outJunction", label: "Out of junction (after rejoin)" },
    ],
  },

  {
    id: "q-exp5", type: "question",
    questionType: "short_answer",
    prompt: "Look at the current going **into** the junction and the sum of the currents on the **two branches**. How do they compare? Now look at the current **after the branches rejoin** — how does it compare to the current going *into* the original split? Use your numbers to state the rule that connects current going into a junction with current coming out.",
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
    content: "**Screenshot your Experiment 5 build:** the series bulb, the two parallel branches, and your ammeter sitting on one of the four measurement points. Make sure your name is visible somewhere on screen (browser tab, sticky note, etc.).",
  },

  {
    id: "evidence-final-build", type: "evidence_upload",
    title: "Upload: Your Experiment 5 Circuit",
    instructions: "Take a screenshot of your completed Experiment 5 circuit in the PhET sim — one series bulb, two parallel bulbs, with the ammeter visible on one of the wires. Make sure your name is visible on screen.",
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
    prompt: "In a series loop with a battery and three bulbs, the ammeter reads $0.30\\text{ A}$ between Bulb 1 and Bulb 2. What does it read between Bulb 2 and Bulb 3?",
    difficulty: "apply",
    options: [
      "$0.10\\text{ A}$ — the current splits evenly among the three bulbs",
      "$0.30\\text{ A}$ — the current is the same at every point in a series loop",
      "$0.90\\text{ A}$ — the current adds up across the bulbs",
      "$0\\text{ A}$ — the second bulb uses it all up",
    ],
    correctIndex: 1,
    explanation: "In a single series loop, the current is **the same at every point**. Charge isn't 'used up' by a bulb — the same charge flows through every component in the loop.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "A wire carrying $0.60\\text{ A}$ splits into **two parallel branches**. Branch 1 carries $0.25\\text{ A}$. How much current is in Branch 2?",
    difficulty: "apply",
    options: [
      "$0.25\\text{ A}$ — both branches must be equal",
      "$0.60\\text{ A}$ — every branch sees the full current",
      "$0.35\\text{ A}$ — the branch currents must add up to the main current",
      "$0.85\\text{ A}$ — current builds up when wires split",
    ],
    correctIndex: 2,
    explanation: "The **junction rule**: the current going *into* a junction equals the total current coming *out*. $0.60\\text{ A}$ goes in, $0.25\\text{ A}$ goes through Branch 1, so Branch 2 must carry $0.60 - 0.25 = 0.35\\text{ A}$.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "Three wires meet at a junction. $0.40\\text{ A}$ flows *in* on one wire and $0.15\\text{ A}$ flows *in* on a second wire. How much current flows *out* on the third wire?",
    difficulty: "apply",
    options: [
      "$0.25\\text{ A}$ — subtract the smaller from the larger",
      "$0\\text{ A}$ — currents cancel at a junction",
      "It depends on the resistance of the third wire",
      "$0.55\\text{ A}$ — the total current in must equal the total current out",
    ],
    correctIndex: 3,
    explanation: "The junction rule applies to **any** number of wires. Total in $= 0.40 + 0.15 = 0.55\\text{ A}$, so $0.55\\text{ A}$ must flow out of the junction. Charge can't pile up or disappear.",
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
    content: "**Big ideas today:**\n\n- **Series rule:** The current is **the same at every point** in a single series loop. A bulb doesn't 'use up' current — the same charge that goes in comes out.\n- **Junction rule:** At any junction (a point where wires split or rejoin), $$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$ The total current flowing *into* the junction equals the total current flowing *out*. Charge can't pile up.\n- These two rules are really the same idea — **charge is conserved**. It just flows. Whatever goes into a region has to come back out.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** When you add a microwave to the same circuit as your toaster, you add a *new branch* — a new path for current. By the junction rule, the main wire from the breaker now has to carry **both** branch currents at the same time. The battery (or wall outlet) responds by pushing more total current out. The lights dim because the wires *do* have a tiny bit of resistance — and the extra current through that resistance steals a little voltage that would have gone to the bulbs.",
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
      { term: "Current", definition: "The flow of electric charge through a wire. Measured in amperes (A) with an ammeter." },
      { term: "Ammeter", definition: "A tool that measures the current flowing through a wire. In the PhET sim, the Non-Contact Ammeter is dragged on top of a wire." },
      { term: "Junction", definition: "A point in a circuit where three or more wires meet — typically where a wire splits into branches or where branches rejoin." },
      { term: "Junction Rule", definition: "At any junction, the total current flowing in equals the total current flowing out: $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$. A statement of charge conservation." },
      { term: "Series", definition: "Components connected one after another in a single loop. The current is the same at every point." },
      { term: "Parallel", definition: "Components on separate branches between the same two junctions. The branch currents add up to the main-line current." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lesson = {
    title: "Circuit Current Lab (PhET)",
    questionOfTheDay: "Your kitchen has four outlets on the same circuit. You plug in a toaster — the lights dim a little. You plug in a microwave too — they dim more. Where is all that extra electricity coming from, and how does the circuit know to send more when you add more stuff?",
    course: "Physics",
    unit: "Circuits",
    order: 5.6,
    visible: false,
    gradesReleased: true,
    dueDate: "2026-05-20",
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
