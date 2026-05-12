// seed-reading-circuit-diagrams.js
// Physics — Circuits Unit, Lesson 3 (order: 3)
// "Reading Circuit Diagrams" — sub-day self-paced practice (2026-05-11)
// Builds directly on circuit-symbols-diagrams (5/8). Self-contained, no equipment.
// Run: node scripts/seed-reading-circuit-diagrams.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "reading-circuit-diagrams";

const DIAGRAMS_IMG =
  "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/reading-circuits-practice-diagrams.jpg";
const FOUR_SYMBOLS_IMG =
  "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/four-symbols-reference.jpg";
const DIAG_A = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-a-closed-switch.jpg";
const DIAG_B = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-b-open-switch.jpg";
const DIAG_C = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-c-two-bulbs-series.jpg";
const DIAG_D = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-d-three-bulbs-parallel.jpg";
const DIAG_E = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-e-parallel-with-open-switch.jpg";
const DIAG_F = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/diagram-f-parallel-bulb-and-resistor.jpg";
const BATTERY_SYM =
  "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/battery.png";
const BULB_SYM =
  "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/bulb.png";
const RESISTOR_SYM =
  "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-symbols/resistor.png";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── SUB-DAY INTRO ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📋",
    title: "Sub Day — Work Through This On Your Own",
    subtitle: "Mr. McCarthy is out today",
  },

  {
    id: uid(), type: "callout",
    icon: "👋", style: "info",
    content: "**Hi P1.** I'm out today. Here's the plan:\n\n- Work through this lesson **at your own pace** — read carefully, answer every question.\n- The whole thing fits in our 42-minute period if you stay focused.\n- If you get stuck on something, **make your best guess and keep moving**. I'll review your work tonight.\n- Ask the sub if you have a tech problem (not for the answers).\n- Submit before the bell. Grades come back tonight.\n\nThis builds on Friday's symbols lesson. No new equations — just reading and reasoning.",
  },

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
      "Identify standard schematic symbols at a glance: battery, bulb, switch, resistor",
      "Predict whether a bulb will light from a circuit diagram alone",
      "Tell the difference between a series circuit (one path) and a parallel circuit (multiple paths)",
      "Predict what happens to the rest of the circuit when one component is removed or a switch is opened",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A circuit diagram shows the same thing as a photograph of the circuit — but cleaner. Why do engineers prefer diagrams over photos?",
  },

  {
    id: "q-warmup-recall", type: "question",
    questionType: "short_answer",
    prompt: "**Warm-up:** Without looking back at Friday's notes, list **three** circuit symbols you remember and what each one does in a circuit. (One sentence per symbol is fine.)",
    weight: 3,
    scored: true,
    maxScore: 3,
  },

  // ─── QUICK SYMBOL RECAP ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔁",
    title: "Quick Symbol Recap",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Before we read full circuits, let's lock in the four symbols you'll see today. **Study this reference card** — every diagram on this page uses these four symbols and nothing else.",
  },

  {
    id: uid(), type: "image",
    url: FOUR_SYMBOLS_IMG,
    alt: "Circuit Symbol Recap reference card showing four standard schematic symbols: a battery (long and short parallel lines), a light bulb (circle with an X inside), a switch (hinged line with a gap), and a resistor (zigzag line). Each is labeled with its name and a one-line description.",
    caption: "The four symbols used in every diagram in this lesson.",
  },

  {
    id: "q-sym-battery", type: "question",
    questionType: "multiple_choice",
    prompt: `What component is this symbol?\n\n![Battery symbol — long and short parallel lines](${BATTERY_SYM})`,
    options: [
      "Switch",
      "Light bulb",
      "Battery",
      "Resistor",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: "q-sym-bulb", type: "question",
    questionType: "multiple_choice",
    prompt: `What component is this symbol?\n\n![Bulb symbol — circle with X inside](${BULB_SYM})`,
    options: [
      "Light bulb",
      "Voltmeter",
      "Fuse",
      "Battery",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  {
    id: "q-sym-resistor", type: "question",
    questionType: "multiple_choice",
    prompt: `What component is this symbol?\n\n![Resistor symbol — zigzag line](${RESISTOR_SYM})`,
    options: [
      "Battery",
      "Switch",
      "Wire",
      "Resistor",
    ],
    correctIndex: 3,
    weight: 1,
    scored: true,
  },

  // ─── PART 1: OPEN vs CLOSED ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔘",
    title: "Part 1 — Open vs. Closed Switches",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Compare **Diagram A** and **Diagram B** below. They're almost identical — same battery, same bulb, same wires. The only difference is the position of the switch.\n\nRemember: an **open** switch has a gap (a break in the loop). A **closed** switch is connected (the loop is complete).",
  },

  {
    id: uid(), type: "image",
    url: DIAG_A,
    alt: "Diagram A: a single rectangular loop containing a battery on the left, a CLOSED switch on top (a horizontal bar connecting two contact dots, labeled CLOSED), and a light bulb on the right.",
    caption: "Diagram A — switch is closed.",
  },

  {
    id: "q-diag-a-bulb", type: "question",
    questionType: "multiple_choice",
    prompt: "In **Diagram A** (the switch is **closed**), will the bulb light up?",
    options: [
      "Yes — the loop is complete, so current can flow.",
      "No — the bulb needs a resistor to work.",
      "No — the switch blocks current when it's closed.",
      "Maybe — it depends on the battery size.",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  {
    id: uid(), type: "image",
    url: DIAG_B,
    alt: "Diagram B: a single rectangular loop containing a battery on the left, an OPEN switch on top (a hinged line tilted up from one of two contact dots, labeled OPEN), and a light bulb on the right.",
    caption: "Diagram B — switch is open.",
  },

  {
    id: "q-diag-b-bulb", type: "question",
    questionType: "multiple_choice",
    prompt: "In **Diagram B** (the switch is **open**), will the bulb light up?",
    options: [
      "Yes — the battery still pushes charge around the loop.",
      "Yes, but only dimly.",
      "No — the loop is broken at the switch, so no current can flow.",
      "No — there is no battery in the circuit.",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: "q-diag-ab-explain", type: "question",
    questionType: "short_answer",
    prompt: "In your own words, explain **why** flipping a switch from closed to open turns a bulb off. (Hint: think about what has to be true for charge to keep flowing.)",
    weight: 2,
    scored: true,
    maxScore: 2,
  },

  // ─── PART 2: SERIES vs PARALLEL ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🛤️",
    title: "Part 2 — One Path vs. Many Paths",
  },

  {
    id: uid(), type: "text",
    content: "Some circuits have **one single path** for current to take. Others have **multiple branches** the current can split between.\n\n- **Series circuit:** Only one path. All components are in a single line. If you break the path anywhere, the whole loop stops.\n- **Parallel circuit:** Multiple paths (branches). Components share the same two endpoints but each sits on its own branch. Breaking one branch does NOT stop the others.",
  },

  {
    id: uid(), type: "image",
    url: DIAG_C,
    alt: "Diagram C: a single rectangular loop containing a battery on the left and two light bulbs in a row along the top wire — both bulbs are on the same single loop.",
    caption: "Diagram C — two bulbs in one loop.",
  },

  {
    id: "q-diag-c-type", type: "question",
    questionType: "multiple_choice",
    prompt: "**Diagram C** shows two bulbs connected to one battery. Looking at the wiring, this is a:",
    options: [
      "Parallel circuit — each bulb has its own branch.",
      "Broken circuit — neither bulb will light.",
      "It's impossible to tell from a diagram.",
      "Series circuit — both bulbs sit on the same single loop.",
    ],
    correctIndex: 3,
    weight: 1,
    scored: true,
  },

  {
    id: uid(), type: "image",
    url: DIAG_D,
    alt: "Diagram D: a parallel circuit with a battery on the left and three light bulbs on three separate horizontal branches between the same two vertical wires — each bulb sits on its own branch.",
    caption: "Diagram D — three bulbs on separate branches.",
  },

  {
    id: "q-diag-d-type", type: "question",
    questionType: "multiple_choice",
    prompt: "**Diagram D** shows three bulbs connected to one battery. This is a:",
    options: [
      "Series circuit — the bulbs are in a single line.",
      "Parallel circuit — each bulb is on its own branch between the same two wires.",
      "Both series and parallel at the same time.",
      "Open circuit — no current flows.",
    ],
    correctIndex: 1,
    weight: 1,
    scored: true,
  },

  // ─── PART 3: PREDICT WHAT HAPPENS ────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔮",
    title: "Part 3 — Predict What Happens",
  },

  {
    id: uid(), type: "text",
    content: "Reading a diagram isn't just naming parts — it's predicting how the circuit will behave. Use what you know about **paths** and **open switches** to answer the next questions.",
  },

  {
    id: uid(), type: "image",
    url: DIAG_E,
    alt: "Diagram E: a parallel circuit with a battery on the left. The left branch contains an open switch (hinged line tilted up, no bulb). The right branch contains a single light bulb.",
    caption: "Diagram E — parallel circuit with an open switch on one branch.",
  },

  {
    id: "q-diag-e-which-lights", type: "question",
    questionType: "multiple_choice",
    prompt: "**Diagram E** shows a parallel circuit. The **left** branch has an **open switch** (no bulb). The **right** branch has a **bulb**. When this circuit is connected to the battery, what happens?",
    options: [
      "Neither side works — the open switch breaks the whole circuit.",
      "The bulb on the right branch lights up — its branch is still complete.",
      "The bulb flickers because the switch is open.",
      "The battery shorts out and the wires catch fire.",
    ],
    correctIndex: 1,
    weight: 1,
    scored: true,
  },

  {
    id: uid(), type: "text",
    content: "**Look back at Diagram C** (two bulbs in series — one path).",
  },

  {
    id: "q-diag-c-burnout", type: "question",
    questionType: "multiple_choice",
    prompt: "In **Diagram C** (two bulbs in **series**), imagine the **left** bulb burns out and breaks. What happens to the **right** bulb?",
    options: [
      "It glows twice as bright — it gets all the energy.",
      "It glows the same — each bulb runs on its own.",
      "It goes out — there's only one path, and it's now broken.",
      "It flickers but stays mostly lit.",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: uid(), type: "text",
    content: "**Look back at Diagram D** (three bulbs in parallel — each on its own branch).",
  },

  {
    id: "q-diag-d-burnout", type: "question",
    questionType: "multiple_choice",
    prompt: "In **Diagram D** (three bulbs in **parallel**), imagine the **middle** bulb burns out and breaks. What happens to the **top and bottom** bulbs?",
    options: [
      "All three go out — burning out one bulb breaks the whole circuit.",
      "They stay lit — the other two branches still have complete paths.",
      "They glow dimmer because energy is wasted.",
      "They flicker and then go out.",
    ],
    correctIndex: 1,
    weight: 1,
    scored: true,
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**This is exactly why houses are wired in parallel.** If your kitchen light burns out, your bedroom light shouldn't go out too. Each room is on its own branch.",
  },

  {
    id: uid(), type: "image",
    url: DIAG_F,
    alt: "Diagram F: a parallel circuit with a battery on the left. The top branch contains a light bulb. The bottom branch contains a resistor drawn as a zigzag line.",
    caption: "Diagram F — bulb and resistor on separate parallel branches.",
  },

  {
    id: "q-diag-f-read", type: "question",
    questionType: "multiple_choice",
    prompt: "**Diagram F** shows a parallel circuit with a **bulb** on the top branch and a **resistor** (zigzag) on the bottom branch. Which of these is the BEST description of what this circuit does?",
    options: [
      "Both branches carry current — the bulb lights up; the resistor slows current in its branch but doesn't light anything.",
      "The bulb cannot light because the resistor blocks all the current.",
      "Only the resistor carries current — the bulb is bypassed.",
      "Nothing happens — there's no switch.",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  // ─── PART 4: TRANSFER QUESTION ───────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧠",
    title: "Part 4 — Apply It",
  },

  {
    id: "q-transfer-house", type: "question",
    questionType: "short_answer",
    prompt: "An apartment has 4 ceiling lights, each on its own light switch. One of the bulbs burns out, but the other 3 still work normally.\n\nBased on what you learned today, **are the bulbs wired in series or in parallel?** How can you tell from just that one fact? (2–3 sentences.)",
    weight: 2,
    scored: true,
    maxScore: 2,
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Today's three takeaways:**\n\n1. A circuit only works if the loop is **complete** — open switches break it; closed switches close it.\n2. **Series** = one path. Break it anywhere, the whole circuit dies.\n3. **Parallel** = multiple branches. Each branch is independent — one can fail without killing the others.\n\nNext class we'll start putting numbers on circuits — current, voltage, and resistance.",
  },

  {
    id: uid(), type: "callout",
    icon: "↩️", style: "question",
    content: "**Return to the Question of the Day:** Why do engineers prefer circuit diagrams over photographs? (Hint: think about how much faster you can read Diagram A vs. trying to identify components in a real cluttered photo.)",
  },

  {
    id: "q-reflection", type: "question",
    questionType: "reflection",
    prompt: "**Exit Reflection:** What's still confusing about reading circuit diagrams? Be specific — name a diagram letter or a concept (series, parallel, switch, etc.) so I know what to review on Tuesday. If nothing's confusing, tell me which diagram was easiest and why.",
    weight: 1,
    scored: true,
  },

  // ─── KEY VOCAB ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📚",
    title: "Key Vocabulary",
  },

  {
    id: uid(), type: "vocab_list",
    items: [
      { term: "Circuit diagram (schematic)", definition: "A standardized drawing using symbols to represent the components and wiring of a circuit." },
      { term: "Open circuit", definition: "A circuit with a break in the loop (e.g., an open switch). No current flows." },
      { term: "Closed circuit", definition: "A circuit whose loop is complete. Current can flow." },
      { term: "Series circuit", definition: "A circuit with only one path for current. Components share the same single loop." },
      { term: "Parallel circuit", definition: "A circuit with multiple branches. Each branch is an independent path between the same two endpoints." },
      { term: "Branch", definition: "A single path within a parallel circuit. Each branch can carry current independently of the others." },
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
    title: "Reading Circuit Diagrams (Sub Day)",
    questionOfTheDay:
      "A circuit diagram shows the same thing as a photograph of the circuit — but cleaner. Why do engineers prefer diagrams over photos?",
    course: "Physics",
    unit: "Circuits",
    order: 3,
    visible: true,
    dueDate: "2026-05-11",
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   visible: ${data.visible} | dueDate: ${data.dueDate} | gradesReleased: ${data.gradesReleased}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
