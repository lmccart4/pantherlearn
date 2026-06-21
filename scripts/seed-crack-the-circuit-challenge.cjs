// seed-crack-the-circuit-challenge.cjs
// Physics — Circuits Unit
// "Crack the Circuit Challenge"
// One scored teacher_checkpoint. Mr. McCarthy verifies level count against rubric.
// Run: node scripts/seed-crack-the-circuit-challenge.cjs

const admin = require("firebase-admin");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const COURSE_ID = "physics";
const LESSON_ID = "crack-the-circuit-challenge-2026-05-18";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [
  {
    id: uid(), type: "section_header",
    icon: "🧩",
    title: "Today's Challenge",
    subtitle: "Crack as many circuits as you can",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Apply what you know about complete circuits to solve puzzle-based challenges",
      "Reason about how components must be connected for current to flow",
      "Push yourself through increasingly difficult circuit layouts",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "🎮", style: "info",
    content: "**The Game:** *Crack the Circuit* is a level-based puzzle game. Each level gives you a partial circuit and a goal. Your job: figure out the wiring so the circuit works. Levels get harder as you go.",
  },

  {
    id: uid(), type: "external_link",
    title: "Crack the Circuit — Universe and More",
    url: "https://www.universeandmore.com/crack-the-circuit/",
    description: "Open the game in a new tab. Start at Level 1 and work your way up.",
  },

  {
    id: uid(), type: "section_header",
    icon: "🏆",
    title: "Grading",
    subtitle: "Your grade = how many levels you finish",
  },

  {
    id: uid(), type: "callout",
    icon: "📊", style: "tip",
    content: "**Level Tiers:**\n- **0–2 levels:** F (0%)\n- **3–6 levels:** D (~55%)\n- **7–11 levels:** C (~65%)\n- **12–14 levels:** B (~85%)\n- **15–17 levels:** A (100%)\n- **All 18 levels:** A++ (120% — bonus / extra credit)\n\nWhen you reach a tier you're happy with — or you hit a wall — raise your hand. Mr. McCarthy will come over, look at your screen, and record your level count.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "tip",
    content: "**Tips:**\n- Trace the path the current has to take from + back to −\n- If a bulb won't light, there's a break somewhere in the loop\n- Stuck? Back out, try a different level, come back to the hard one\n- Don't refresh the page — you'll lose your progress",
  },

  {
    id: "crack-progress", type: "level_progress",
    title: "Your Progress",
    intro: "Your bar fills as you crack more levels. Raise your hand to lock in your tier.",
    linkedBlockId: "crack-checkpoint",
    maxLevel: 18,
    tiers: [
      { minLevel: 18, score: 6,    label: "A++ — Bonus",    pct: 120, color: "#fbbf24" },
      { minLevel: 15, score: 5,    label: "A — Refining",   pct: 100, color: "#10b981" },
      { minLevel: 12, score: 4.25, label: "B — Developing", pct: 85,  color: "#06b6d4" },
      { minLevel: 7,  score: 3.25, label: "C — Approaching", pct: 65, color: "#eab308" },
      { minLevel: 3,  score: 2.75, label: "D — Emerging",   pct: 55,  color: "#f97316" },
      { minLevel: 0,  score: 0,    label: "F — Missing",    pct: 0,   color: "#ef4444" },
    ],
  },

  {
    id: "crack-checkpoint", type: "teacher_checkpoint",
    title: "Show Me",
    prompt: "When you're ready, raise your hand. Mr. McCarthy will look at your screen and verify the highest level you've completed.",
    weight: 5,
    scored: true,
    activityType: "crack_the_circuit",
    maxLevel: 18,
    // Level thresholds: minLevel -> tier score (out of weight=5). 18 = A++ bonus.
    tiers: [
      { minLevel: 18, score: 6,    label: "A++ — Bonus",    pct: 120, color: "#fbbf24" },
      { minLevel: 15, score: 5,    label: "A — Refining",   pct: 100, color: "#10b981" },
      { minLevel: 12, score: 4.25, label: "B — Developing", pct: 85,  color: "#06b6d4" },
      { minLevel: 7,  score: 3.25, label: "C — Approaching", pct: 65, color: "#eab308" },
      { minLevel: 3,  score: 2.75, label: "D — Emerging",   pct: 55,  color: "#f97316" },
      { minLevel: 0,  score: 0,    label: "F — Missing",    pct: 0,   color: "#ef4444" },
    ],
    levels: [
      { score: 6,    label: "A++ — Bonus",   description: "All 18 levels completed (120% bonus)" },
      { score: 5,    label: "A — Refining",   description: "15+ levels completed" },
      { score: 4.25, label: "B — Developing", description: "12–14 levels completed" },
      { score: 3.25, label: "C — Approaching", description: "7–11 levels completed" },
      { score: 2.75, label: "D — Emerging",   description: "3–6 levels completed" },
      { score: 0,    label: "F — Missing",    description: "0–2 levels completed or no attempt" },
    ],
  },
];

async function main() {
  const dueDate = "2026-05-18";

  const data = {
    title: "Crack the Circuit Challenge",
    questionOfTheDay: "Can you figure out how the wires have to connect to make the circuit work?",
    course: "Physics",
    unit: "Circuits",
    order: 4.5,
    visible: false,
    gradesReleased: true,
    dueDate,
    blocks,
  };

  const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, data);
  console.log(`✅ Lesson seeded: "${data.title}" (visible:false, dueDate:${dueDate})`);
  console.log(`   Blocks: ${result?.blockCount ?? blocks.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
