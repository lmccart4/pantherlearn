// seed-measuring-voltage-series-parallel.js
// Physics — Circuits Unit, Lesson 5 (order: 5)
// "Measuring Voltage: Series vs Parallel" — Wed 2026-05-13
// Tasks 9–14 from Week 35 slides: voltmeter use, conventional current,
// voltage patterns across series and parallel circuits.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "measuring-voltage-series-parallel";

const BASE = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits/voltage-series-parallel";
const TASK_9_CORRECT = `${BASE}/task-9-voltmeter-correct.png`;
const TASK_9_TIPS    = `${BASE}/task-9-voltmeter-tips.png`;
const TASK_10        = `${BASE}/task-10-voltmeter-reversed.png`;
const TASK_11        = `${BASE}/task-11-series-circuits.png`;
const TASK_13        = `${BASE}/task-13-parallel-circuits.png`;
const CONV_CURRENT   = `${BASE}/conventional-current.png`;
const VOLT_CONV      = `${BASE}/voltmeter-conventions.png`;
const TASK_11_TABLE  = `${BASE}/task-11-example-data-table.png`;
const TASK_13_TABLE  = `${BASE}/task-13-example-data-table.png`;

let _id = 0;
const uid = () => `b${++_id}`;

const blocks = [
  // ─── QUESTION OF THE DAY ────────────────────────────────
  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Why is it dangerous to use a hair dryer while taking a bath?",
  },

  // ─── WARM UP ────────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔥",
    title: "Warm Up",
    subtitle: "~3 minutes",
  },
  {
    id: "q-warmup-recall", type: "question",
    questionType: "short_answer",
    prompt: "Yesterday you built series and parallel circuits with bulbs. In **one sentence each**: (a) what is a series circuit, and (b) what is a parallel circuit?",
    difficulty: "remember",
  },

  // ─── OBJECTIVES ─────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🎯",
    title: "Learning Objectives",
  },
  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Use a voltmeter correctly: red lead to **+**, black lead to **−**.",
      "Explain why a reversed voltmeter reads a negative number (conventional current).",
      "Measure voltage across the battery and across bulbs in a **series** circuit.",
      "Measure voltage across the battery and across bulbs in a **parallel** circuit.",
      "Describe the pattern: in series, voltage **splits** across components; in parallel, voltage **stays the same** across each branch.",
    ],
  },

  // ─── MATERIALS ──────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🧰",
    title: "Your Materials",
  },
  {
    id: uid(), type: "callout",
    icon: "🧰", style: "info",
    content: "**Per group:**\n- Snap circuit kit (batteries, bulbs, wires, switch)\n- Multimeter (set to V—)\n- Your phone for circuit photos\n- Group whiteboard for jotting readings",
  },

  // ─── MINI-LESSON: HOW TO USE A VOLTMETER ────────────────
  {
    id: uid(), type: "section_header",
    icon: "📏",
    title: "Mini-Lesson — How to Use a Voltmeter",
    subtitle: "~3 minutes",
  },
  {
    id: uid(), type: "text",
    content: "A **voltmeter** measures the voltage *across* a component — that means the two leads touch the **two sides** of whatever you're measuring (a battery, a bulb, etc.).\n\nFor your multimeter today:",
  },
  {
    id: uid(), type: "image",
    url: TASK_9_TIPS,
    alt: "Voltmeter tips: set dial to V—, red lead to positive, black lead to negative",
    caption: "Set the dial to **V—** (DC volts). Red lead → **+** terminal. Black lead → **−** terminal.",
  },

  // ─── TASK 9 ─────────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🧪",
    title: "Task 9 — Build & Measure",
    subtitle: "~5 minutes",
  },
  {
    id: uid(), type: "text",
    content: "Build the circuit below. Then put the voltmeter leads on the battery: **red on +**, **black on −**. Record the reading.",
  },
  {
    id: uid(), type: "image",
    url: TASK_9_CORRECT,
    alt: "Circuit with battery, bulb, switch, and voltmeter connected red-to-positive, black-to-negative",
    caption: "Task 9 circuit. Voltmeter connected with red lead on +, black lead on −.",
  },
  {
    id: "evidence-task-9", type: "evidence_upload",
    title: "Task 9 — Photo + Voltmeter Reading",
    instructions: "Build the circuit shown above. Then in the reflection box, write what the voltmeter reads (include the **sign** and the **units**, e.g. \"+1.48 V\"). Attach **one photo** of your built circuit with the voltmeter leads in place.",
    weight: 5,
  },

  // ─── TASK 10 ────────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔄",
    title: "Task 10 — Swap the Leads",
    subtitle: "~3 minutes",
  },
  {
    id: uid(), type: "text",
    content: "Now swap the leads: put the **black lead on +** and the **red lead on −**. What does the voltmeter read now?",
  },
  {
    id: uid(), type: "image",
    url: TASK_10,
    alt: "Same circuit but with voltmeter leads reversed: black on positive, red on negative",
    caption: "Task 10 — leads reversed. Black on +, red on −.",
  },
  {
    id: "q-task-10", type: "question",
    questionType: "short_answer",
    prompt: "What does the voltmeter read now (include sign and units)? How does it compare to your Task 9 reading?",
    difficulty: "understand",
  },

  // ─── MINI-LESSON: CONVENTIONAL CURRENT ──────────────────
  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Why the Negative Sign? — Conventional Current",
    subtitle: "~4 minutes",
  },
  {
    id: uid(), type: "text",
    content: "You probably noticed the reading flipped sign in Task 10. The reason goes back to **Ben Franklin** — and a guess he made before anyone knew electrons existed.\n\nFranklin had to pick a direction to call \"current.\" He chose: **the direction that positive charges would move** (from **+** toward **−**). We now know that electrons (which are *negative*) are the things actually moving, and they go the **opposite** way. But Franklin's definition stuck, and we still use it today. That definition is called **conventional current**.",
  },
  {
    id: uid(), type: "image",
    url: CONV_CURRENT,
    alt: "Two PhET circuit views side-by-side: left shows blue electrons flowing one direction, right shows red arrows for conventional current flowing the opposite direction",
    caption: "Same circuit, two views. **Left:** what's actually moving (electrons, blue). **Right:** how we draw it (conventional current, red arrows). They point opposite ways.",
  },
  {
    id: uid(), type: "text",
    content: "When you hook up the **voltmeter**, the **positive** values it reports match the **conventional current** definition. You *can* analyze circuits by tracking electrons, but it's not the standard convention — every textbook, diagram, and meter assumes Franklin's choice.",
  },
  {
    id: uid(), type: "image",
    url: VOLT_CONV,
    alt: "PhET circuit showing a 9.0 V battery with a 10 ohm bulb. A voltmeter probe reads +9.00 V because the red lead is on the positive terminal.",
    caption: "Red on **+**, black on **−** → voltmeter reads **+9.00 V**. That's why Task 9 was positive and Task 10 was negative — same voltage, leads reversed.",
  },
  {
    id: uid(), type: "callout",
    icon: "💡", style: "info",
    content: "**Rule of thumb:** From now on, when we draw charge diagrams or measure with a voltmeter, **conventional current** is the standard. Red on **+**, black on **−**, and your reading will always be positive when the battery is doing its job.",
  },

  // ─── TASK 11 — SERIES CIRCUIT READINGS ──────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔗",
    title: "Task 11 — Voltage in a Series Circuit",
    subtitle: "~8 minutes",
  },
  {
    id: uid(), type: "text",
    content: "Build the series circuit shown below. For each of the **four voltmeter positions** (A, B, C, D), measure and record the reading. The position of the **voltmeter** changes — the rest of the circuit stays the same.",
  },
  {
    id: uid(), type: "image",
    url: TASK_11,
    alt: "Four diagrams of the same series circuit with voltmeter placed in four different positions: A across battery, B across first bulb, C across second bulb, D across the full circuit",
    caption: "Task 11 — same series circuit, voltmeter in 4 different positions (A, B, C, D).",
  },
  {
    id: uid(), type: "image",
    url: TASK_11_TABLE,
    alt: "Example data table with four rows (Circuits A, B, C, D) and example voltmeter readings near 0.75 V and 1.49 V",
    caption: "**Example data table** — your readings will be different. Sketch a table like this in your notebook (or on the group whiteboard) and fill in your four readings.",
  },
  {
    id: "evidence-task-11", type: "evidence_upload",
    title: "Task 11 — Photo + Data Table",
    instructions: "In the reflection box, list your **four voltmeter readings** in the same format as the example table above. Include the **sign** and the **units** for each (e.g. `+0.74 V`).\n\nAttach **one photo** of your built circuit (any of the four positions is fine).",
    weight: 5,
  },

  // ─── TASK 12 — PATTERNS FROM SERIES ─────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔍",
    title: "Task 12 — What Patterns Do You See?",
    subtitle: "~3 minutes",
  },
  {
    id: "q-task-12", type: "question",
    questionType: "short_answer",
    prompt: "Look at your **Task 11** readings. What patterns do you notice? Specifically:\n\n1. How does the voltage across the battery (A) compare to the voltage across each bulb (B and C)?\n2. If you add up the bulb voltages (B + C), what do you get?\n3. What does this tell you about how voltage is **distributed** in a series circuit?",
    difficulty: "analyze",
  },

  // ─── TASK 13 — PARALLEL CIRCUIT READINGS ────────────────
  {
    id: uid(), type: "section_header",
    icon: "🪢",
    title: "Task 13 — Voltage in a Parallel Circuit",
    subtitle: "~8 minutes",
  },
  {
    id: uid(), type: "text",
    content: "Now build the **parallel** circuit shown below. Again, measure the voltmeter reading at each of the four positions (A, B, C, D).",
  },
  {
    id: uid(), type: "image",
    url: TASK_13,
    alt: "Four diagrams of a parallel circuit with voltmeter placed in four different positions across different components",
    caption: "Task 13 — parallel circuit, voltmeter in 4 different positions (A, B, C, D).",
  },
  {
    id: uid(), type: "image",
    url: TASK_13_TABLE,
    alt: "Example data table with four rows (Circuits A, B, C, D) showing voltmeter readings all near 1.49 V",
    caption: "**Example data table** — your readings will be different. Notice how the four readings stay close to one another. Sketch a table like this and fill in your own.",
  },
  {
    id: "evidence-task-13", type: "evidence_upload",
    title: "Task 13 — Photo + Data Table",
    instructions: "In the reflection box, list your **four voltmeter readings** in the same format as the example table above. Include the **sign** and **units** (e.g. `+1.49 V`).\n\nAttach **one photo** of your built parallel circuit (any of the four positions is fine).",
    weight: 5,
  },

  // ─── TASK 14 — PATTERNS FROM PARALLEL ───────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔍",
    title: "Task 14 — What Patterns Do You See?",
    subtitle: "~3 minutes",
  },
  {
    id: "q-task-14", type: "question",
    questionType: "short_answer",
    prompt: "Look at your **Task 13** readings. What patterns do you notice? Specifically:\n\n1. How do the voltmeter readings compare across the four positions?\n2. How is this different from what you saw in the series circuit (Task 11)?\n3. What does this tell you about how voltage behaves in a **parallel** circuit?",
    difficulty: "analyze",
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
    icon: "📌", style: "success",
    content: "**Big idea today:**\n\n- **Series:** voltage **splits** across components. Add the drops, and you get the battery's voltage.\n- **Parallel:** every branch sees the **full battery voltage**.\n\nThat's why holiday lights wired in series go dark when one bulb burns out (the splits don't work anymore), but the lights in your house — wired in parallel — keep working.",
  },
  {
    id: "q-essential-question", type: "question",
    questionType: "short_answer",
    prompt: "Back to the Question of the Day: **Why is it dangerous to use a hair dryer while taking a bath?** Use what you learned today about voltage to write a 2–3 sentence answer.",
    difficulty: "evaluate",
  },
];

async function main() {
  // 1) Write the new lesson at order 5
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc(LESSON_ID);

  const data = {
    title: "Measuring Voltage: Series vs Parallel",
    questionOfTheDay: "Why is it dangerous to use a hair dryer while taking a bath?",
    course: "Physics",
    unit: "Circuits",
    order: 5,
    visible: false,
    dueDate: "2026-05-13",
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   visible: ${data.visible} | dueDate: ${data.dueDate} | gradesReleased: ${data.gradesReleased}`);

  // 2) Demote becoming-the-electrician to order 7 (assessment stays at 6).
  //    Safe: lesson is visible:false with no submissions.
  const electricianRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("becoming-the-electrician");
  await electricianRef.update({ order: 7, updatedAt: new Date() });
  console.log(`✅ becoming-the-electrician → order 7`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
