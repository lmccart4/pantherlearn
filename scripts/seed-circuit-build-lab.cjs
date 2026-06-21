// seed-circuit-build-lab.cjs
// Physics — Circuit Construction Assessment (individual, in-person build, teacher-graded)
// Two Show-Me builds: Schematic 1 (parallel) and Schematic 2 (series).
// Each has a rubric block + teacher_checkpoint block (5-level Missing→Refining).
// Source: /Users/lukemccarthy/Desktop/circuit-build-lab.pdf
//
// Run: node scripts/seed-circuit-build-lab.cjs
// Safe: brand-new lesson, no existing student scores. Uses safeLessonWrite.

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

const SA_PATH = path.join(__dirname, "..", "serviceAccountKey.json");
if (!admin.apps.length) {
  if (fs.existsSync(SA_PATH)) {
    admin.initializeApp({ credential: admin.credential.cert(require(SA_PATH)) });
  } else {
    admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
  }
}
const db = admin.firestore();

const COURSE_ID = "physics";
const LESSON_ID = "physics-circuit-build-lab-2026-06-04";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Standard show-me 5-level scoring scale (matches recent Show Me lessons)
const LEVELS = (descs) => [
  { score: 5,    label: "Refining",    description: descs.refining },
  { score: 4.25, label: "Developing",  description: descs.developing },
  { score: 3.25, label: "Approaching", description: descs.approaching },
  { score: 2.75, label: "Emerging",    description: descs.emerging },
  { score: 0,    label: "Missing",     description: descs.missing },
];

const schematic1Levels = LEVELS({
  refining:    "All required components are present and correctly connected AND both bulbs light reliably AND Switch A and Switch B behave exactly as specified AND the build is neat enough that another student could verify the wiring without help.",
  developing:  "All required components are present AND both bulbs light correctly AND Switch A controls both bulbs AND Switch B controls only Bulb 2, BUT wires are excessively messy OR one connection is loose and requires adjustment.",
  approaching: "Most required components are present AND at least one bulb lights BUT Switch A does not control both bulbs, OR Switch B does not control only Bulb 2, OR one bulb never lights.",
  emerging:    "Some components are connected BUT the circuit does not light any bulbs, OR the circuit is wired in series instead of parallel, OR fewer than half of the required components are present.",
  missing:     "No circuit is built, OR the build creates a short circuit.",
});

const schematic2Levels = LEVELS({
  refining:    "All required components are present and correctly connected AND both bulbs light reliably AND Switch C behaves exactly as specified AND bulb brightness matches Schematic 1 AND the build is neat enough that another student could verify the wiring without help.",
  developing:  "All required components are present AND both bulbs light correctly AND Switch C controls both bulbs AND brightness approximately matches Schematic 1, BUT wires are excessively messy OR one connection is loose and requires adjustment.",
  approaching: "Most required components are present AND at least one bulb lights BUT Switch C does not control both bulbs, OR both bulbs are clearly dimmer than the bulbs in Schematic 1, OR only one battery is used.",
  emerging:    "Some components are connected BUT the circuit does not light any bulbs, OR the circuit is wired in parallel instead of series, OR fewer than half of the required components are present.",
  missing:     "No circuit is built, OR the build creates a short circuit.",
});

// Hardcoded IDs for the rubric/checkpoint pairs so re-runs never orphan scores.
const PARALLEL_CHECKPOINT_ID = "show-me-checkpoint-parallel";
const SERIES_CHECKPOINT_ID   = "show-me-checkpoint-series";

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Circuit Construction Assessment",
    subtitle: "Honors Physics — Schematic Build",
  },
  {
    id: uid(), type: "callout",
    icon: "📋",
    style: "info",
    content: "**Instructions:** Build two real circuits using wires, batteries, light bulbs, and switches. Your finished circuits must produce the behaviors described below. Mr. McCarthy will test each circuit before scoring.\n\nThis is an **individual assessment** — you build your own circuits, and you are graded on your own builds.",
  },

  // ──── Schematic 1 — Parallel ────
  {
    id: uid(), type: "section_header",
    icon: "🔀",
    title: "Schematic 1 — Parallel Circuit",
  },
  {
    id: uid(), type: "callout",
    icon: "🧰",
    style: "neutral",
    content: "**Components:**\n- 1 battery (1.5 V)\n- 2 light bulbs\n- 2 switches\n\n**Required Behavior:**\n- When **Switch A is open**, both bulbs are off.\n- When **Switch A is closed** and **Switch B is closed**, both bulbs light.\n- When **Switch A is closed** but **Switch B is open**, only **Bulb 1** lights.",
  },
  {
    id: "show-me-rubric-parallel",
    type: "rubric",
    title: "How You'll Be Graded — Schematic 1",
    intro: "Mr. McCarthy will verify your parallel circuit against this rubric.",
    linkedBlockId: PARALLEL_CHECKPOINT_ID,
    totalPoints: 5,
    criteria: [
      {
        id: "parallel-build",
        name: "I am able to construct a real circuit that matches a given schematic.",
        weight: 5,
        levels: schematic1Levels,
      },
    ],
  },
  {
    id: PARALLEL_CHECKPOINT_ID,
    type: "teacher_checkpoint",
    title: "Show Me — Schematic 1 (Parallel)",
    prompt: "When your parallel circuit is built and you can demonstrate all three required behaviors (Switch A open → both off; Switch A + B closed → both lit; Switch A closed + B open → only Bulb 1 lit), raise your hand. Mr. McCarthy will verify each state before scoring.",
    weight: 5,
    scored: true,
    levels: schematic1Levels,
  },

  // ──── Schematic 2 — Series ────
  {
    id: uid(), type: "section_header",
    icon: "➖",
    title: "Schematic 2 — Series Circuit",
  },
  {
    id: uid(), type: "callout",
    icon: "🧰",
    style: "neutral",
    content: "**Components:**\n- 2 batteries connected in series (3.0 V total)\n- 2 light bulbs (same type as in Schematic 1)\n- 1 switch\n\n**Required Behavior:**\n- When **Switch C is closed**, both bulbs light with approximately the **same brightness** as the bulbs in Schematic 1.\n- When **Switch C is open**, both bulbs turn off.",
  },
  {
    id: "show-me-rubric-series",
    type: "rubric",
    title: "How You'll Be Graded — Schematic 2",
    intro: "Mr. McCarthy will verify your series circuit against this rubric.",
    linkedBlockId: SERIES_CHECKPOINT_ID,
    totalPoints: 5,
    criteria: [
      {
        id: "series-build",
        name: "I am able to construct a real circuit that matches a given schematic.",
        weight: 5,
        levels: schematic2Levels,
      },
    ],
  },
  {
    id: SERIES_CHECKPOINT_ID,
    type: "teacher_checkpoint",
    title: "Show Me — Schematic 2 (Series)",
    prompt: "When your series circuit is built and you can demonstrate both required behaviors (Switch C closed → both bulbs lit at brightness matching Schematic 1; Switch C open → both bulbs off), raise your hand. Mr. McCarthy will verify before scoring.",
    weight: 5,
    scored: true,
    levels: schematic2Levels,
  },
];

const lesson = {
  title: "Circuit Construction Assessment",
  course: COURSE_ID,
  unit: "Circuits",
  order: 9001,
  visible: false,         // Luke flips morning-of
  gradesReleased: true,   // same-day grade visibility
  dueDate: "2026-06-04",
  gradeCategory: "assessment",
  blocks,
};

(async () => {
  const res = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
  console.log(`Seed result: ${JSON.stringify(res)}`);
  console.log(`Lesson: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`Blocks: ${blocks.length}`);
  console.log(`Live preview (after visible:true): https://pantherlearn.web.app/lesson/${COURSE_ID}/${LESSON_ID}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
