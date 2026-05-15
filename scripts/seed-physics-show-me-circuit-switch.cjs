// seed-physics-show-me-circuit-switch.cjs
// Physics — Circuits Unit
// "Show Me: Always-On Bulb + Switched Bulb"
// One scored teacher_checkpoint. That's the entire grade.
// Run: node scripts/seed-physics-show-me-circuit-switch.cjs

const admin = require("firebase-admin");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const COURSE_ID = "physics";
const LESSON_ID = "show-me-2bulb-always-on-switched-2026-05-15";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Today's Show Me",
    subtitle: "Build it. Show me. Done.",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Design a circuit where one bulb is always on and one bulb is switch-controlled",
      "Use parallel branches so a switch controls only part of a circuit",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "🧰", style: "info",
    content: "**At your station:** 2 batteries (use both in series), 2 light bulbs in holders, 1 switch, wires.",
  },

  {
    id: uid(), type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Safety:** Never connect a battery's + terminal directly to its − terminal with just a wire — that's a short circuit. Wires get hot, batteries die in seconds. If anything feels warm, disconnect immediately.",
  },

  {
    id: uid(), type: "section_header",
    icon: "🎯",
    title: "The Challenge",
    subtitle: "Build a circuit with these two behaviors",
  },

  {
    id: uid(), type: "text",
    content: "Wire **2 bulbs and 1 switch** so that:\n\n1. **Bulb A is always on** — it stays lit no matter what the switch does.\n2. **Bulb B is controlled by the switch** — on when the switch is closed, off when the switch is open.\n\nNo diagram is provided. Figure out where the switch has to go.",
  },

  {
    id: uid(), type: "callout",
    icon: "💭", style: "tip",
    content: "**Hint:** If the switch is in the main line, it kills both bulbs. You need it somewhere else.",
  },

  {
    id: "show-me-rubric", type: "rubric",
    title: "How You'll Be Graded",
    intro: "Mr. McCarthy will verify your circuit against this rubric.",
    linkedBlockId: "show-me-checkpoint",
    totalPoints: 5,
    criteria: [
      {
        id: "circuit-behavior",
        name: "Circuit Behavior",
        weight: 5,
        levels: [
          { score: 5,    label: "Refining",   description: "Both bulbs light up AND the switch correctly operates **one** of the two bulbs (the other stays on no matter what the switch does)." },
          { score: 4.25, label: "Developing", description: "Both bulbs light up, but the switch controls **both** bulbs — OR — the switch is **reversed** (one bulb turns off when the switch is closed and on when it's open)." },
          { score: 3.25, label: "Approaching", description: "Bulbs light up, but the switch does **not** operate the bulbs correctly." },
          { score: 2.75, label: "Emerging",   description: "An attempt was made, but the bulbs **do not** turn on." },
          { score: 0,    label: "Missing",    description: "No attempt made." },
        ],
      },
    ],
  },

  {
    id: "show-me-checkpoint", type: "teacher_checkpoint",
    title: "Show Me",
    prompt: "When you can flip the switch and see Bulb A stay lit the whole time while Bulb B turns on and off, raise your hand. Mr. McCarthy will verify both states (switch open: A lit / B dark — switch closed: A lit / B lit) before approving.",
    weight: 5,
    scored: true,
    levels: [
      { score: 5,    label: "Refining",   description: "Both bulbs light + switch controls one bulb only" },
      { score: 4.25, label: "Developing", description: "Both bulbs light, but switch controls both OR switch logic is reversed" },
      { score: 3.25, label: "Approaching", description: "Bulbs light, switch does not operate them correctly" },
      { score: 2.75, label: "Emerging",   description: "Attempt made, bulbs do not turn on" },
      { score: 0,    label: "Missing",    description: "No attempt made" },
    ],
  },
];

async function main() {
  const dueDate = "2026-05-15"; // YYYY-MM-DD string — required by getWeekForDate()

  const data = {
    title: "Show Me: Always-On Bulb + Switched Bulb",
    questionOfTheDay: "How do you wire a switch so it controls just one bulb in a circuit and leaves the other one alone?",
    course: "Physics",
    unit: "Circuits",
    order: 56,
    visible: true,
    gradesReleased: true,
    dueDate,
    blocks,
  };

  const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Action: ${result.action} (preserved ${result.preserved} block IDs)`);
  console.log(`   Blocks: ${blocks.length}  |  Scored: 1 teacher_checkpoint (weight 5 = 100% of grade)`);
  console.log(`   Visible: true  |  Due: ${dueDate}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
