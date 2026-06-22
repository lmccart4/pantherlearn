// seed-physics-show-me-surge-protector.cjs
// Physics — Circuits Unit
// "Show Me: Reverse-Engineer a Surge Protector"
// Students observe a REAL surge protector (wired to 2 batteries, NOT the wall) by watching how
// bulbs behave, then reconstruct the circuit in PhET from what they saw. Discovery — the lesson
// must NOT tell them how to wire it.
// One scored teacher_checkpoint (show Mr. McCarthy the PhET diagram). That's the entire grade.
// Run: node scripts/seed-physics-show-me-surge-protector.cjs

const admin = require("firebase-admin");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const COURSE_ID = "physics";
const LESSON_ID = "show-me-surge-protector-2026-05-22";

const PHET_URL = "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Today's Show Me",
    subtitle: "Figure out the wiring. Diagram it in PhET. Show me.",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Investigate how a real surge protector distributes power by watching how bulbs behave",
      "Use your observations to figure out how the outlets are wired to each other",
      "Recreate that wiring as a circuit diagram in PhET",
      "Defend your diagram by explaining how it produces the behavior you saw",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "🧰", style: "info",
    content: "**At your station:** the surge protector (wired to **2 batteries** — *not* the wall), some light bulbs, and your Chromebook.",
  },

  {
    id: uid(), type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Handle with care:** the bulbs and battery leads can get warm with use. Don't let a bare battery wire touch its other terminal directly (that's a short). If anything feels hot or you're unsure, hands off and call Mr. McCarthy over.",
  },

  {
    id: uid(), type: "section_header",
    icon: "🔎",
    title: "Investigate the Real Surge Protector",
    subtitle: "Run these tests and watch what the bulbs do",
  },

  {
    id: uid(), type: "text",
    content: "Work through these one at a time. **Don't guess the wiring yet** — just watch carefully and record what you see. The bulbs are giving you the clues.\n\n1. Plug **one** bulb into **one** outlet. Note how bright it is.\n2. Now plug a **second** bulb into a **different** outlet. Did the first bulb **dim**, or did both stay the **same** brightness?\n3. With both lit, **unplug one** bulb. What happens to the one you left in?\n4. Find the **switch** on the surge protector. Flip it off and on. Does it control **one** outlet, or **all** of them at once?\n5. Try a couple more outlets and look for the pattern.",
  },

  {
    id: uid(), type: "callout",
    icon: "💭", style: "question",
    content: "**What did the bulbs tell you?**\n\n- Did adding a second bulb steal brightness from the first, or did both run full?\n- When you unplugged one, why did the other behave the way it did?\n- What does the switch's behavior tell you about how it's connected to the outlets?\n\nThese answers point to **how the outlets must be wired**. Don't just describe it — you're about to prove it.",
  },

  {
    id: uid(), type: "section_header",
    icon: "✏️",
    title: "Diagram It in PhET",
    subtitle: "Prove your theory by building it",
  },

  {
    id: uid(), type: "text",
    content: "Open PhET and **build a circuit diagram of the surge protector** based on what you observed.\n\nYour diagram has to **reproduce the same behavior** the real one showed you: the bulbs should behave the same way when you add one, remove one, and flip the switch. Same number of outlets (bulbs), a power source, and the switch — wired however you figured out it must be.\n\nFiguring out the wiring is the whole point — so it's on you to work it out from your observations.",
  },

  {
    id: uid(), type: "external_link",
    title: "Open: Circuit Construction Kit — DC (PhET)",
    description: "Free interactive from PhET / University of Colorado. Runs in any modern browser. Drag parts out of the toolbox on the right to build your circuit.",
    url: PHET_URL,
    buttonLabel: "Launch the simulator",
  },

  {
    id: uid(), type: "callout",
    icon: "🛠️", style: "tip",
    content: "**Using PhET (tool basics — not answers):** drag parts out of the toolbox on the right. Tap any wire or part and hit the trash can to delete it. The **switch** is the part that looks like a little lever — tap it to open and close it. Turn on **Values** (right-side checkboxes) if you want to see the current in each wire.",
  },

  {
    id: "show-me-rubric", type: "rubric",
    title: "How You'll Be Graded",
    intro: "Mr. McCarthy will check your PhET diagram against this rubric. You're graded on whether it reproduces what the real surge protector did — not on copying a 'right answer.'",
    linkedBlockId: "show-me-checkpoint",
    totalPoints: 5,
    criteria: [
      {
        id: "phet-diagram",
        name: "Circuit Diagram in PhET",
        weight: 5,
        levels: [
          { score: 5,    label: "Refining",   description: "Your circuit reproduces **all** the behaviors you observed: every bulb lights at full brightness at the same time, removing one bulb leaves the others lit, and the switch turns **all** of them off together. You can explain how your wiring produces each behavior." },
          { score: 4.25, label: "Developing", description: "Your circuit reproduces **most** of the behaviors, but one is off — for example, the switch only controls one bulb instead of all of them, or one bulb dims the others." },
          { score: 3.25, label: "Approaching", description: "Bulbs light, but the circuit does **not** behave like the surge protector — e.g., removing one bulb kills the rest." },
          { score: 2.75, label: "Emerging",   description: "A circuit was attempted in PhET, but the bulbs don't light or the diagram is incomplete." },
          { score: 0,    label: "Missing",    description: "No attempt made." },
        ],
      },
    ],
  },

  {
    id: "show-me-checkpoint", type: "teacher_checkpoint",
    title: "Show Me",
    prompt: "When your PhET diagram behaves like the real surge protector — every bulb lights at once, removing one leaves the others lit, and the switch turns them all off together — raise your hand. Show Mr. McCarthy your screen and be ready to explain how your wiring produces what you observed.",
    weight: 5,
    scored: true,
    levels: [
      { score: 5,    label: "Refining",   description: "Diagram reproduces every observed behavior + student can explain why" },
      { score: 4.25, label: "Developing", description: "Reproduces most behaviors; switch or one bulb behaves wrong" },
      { score: 3.25, label: "Approaching", description: "Bulbs light but circuit doesn't behave like the surge protector" },
      { score: 2.75, label: "Emerging",   description: "Attempt made, bulbs don't light or diagram incomplete" },
      { score: 0,    label: "Missing",    description: "No attempt made" },
    ],
  },
];

async function main() {
  const dueDate = "2026-05-22"; // YYYY-MM-DD string — required by getWeekForDate()

  const data = {
    title: "Show Me: Reverse-Engineer a Surge Protector",
    questionOfTheDay: "A surge protector runs several devices off one source. How are its outlets wired to make that work — and can you prove it with a circuit diagram?",
    course: "Physics",
    unit: "Circuits",
    order: 60,
    visible: false,        // seeded hidden — Luke flips visible:true before class
    gradesReleased: true,  // same-day grading once live
    dueDate,
    blocks,
  };

  const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Action: ${result.action} (preserved ${result.preserved} block IDs)`);
  console.log(`   Blocks: ${blocks.length}  |  Scored: 1 teacher_checkpoint (weight 5 = 100% of grade)`);
  console.log(`   Visible: ${data.visible}  |  Due: ${dueDate}`);
  console.log(`   PhET: ${PHET_URL}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
