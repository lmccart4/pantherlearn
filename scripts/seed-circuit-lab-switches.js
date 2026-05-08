// seed-circuit-lab-switches.js
// Physics — Circuits Unit
// "Wire It Up: Switches and Bulbs Lab"
// 3 show-me challenges, no other graded items.
// Run: node scripts/seed-circuit-lab-switches.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "circuit-lab-switches-bulbs";

const IMG = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuit-lab-switches";

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
      "Read a circuit schematic and translate it into a working physical circuit",
      "Wire a switch in series with a single bulb to control it",
      "Use parallel branches so one switch controls one bulb without affecting another",
      "Place a single switch in the main line so it controls multiple bulbs at once",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A lamp in your bedroom has its own switch. The hallway light has its own switch. But the breaker can kill the power to BOTH. Where does each switch sit in the circuit so that's possible?",
  },

  // ─── MATERIALS ───────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "📦",
    title: "Your Materials",
    subtitle: "",
  },

  {
    id: uid(), type: "text",
    content: "Each lab station has exactly:\n\n- **2 batteries** (use both in series for enough voltage)\n- **2 light bulbs** in holders\n- **1 switch**\n- **Wires** (as many as you need)\n\nYou will use the **same kit for all 3 challenges** — just rewire it between each. Don't take anything apart until Mr. McCarthy has verified the challenge.",
  },

  {
    id: uid(), type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Safety:** Never connect the battery's + terminal directly to the − terminal with just a wire. That's a short circuit — wires get hot, batteries drain in seconds. If a wire feels warm, disconnect it immediately.",
  },

  // ─── LEGEND ──────────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🗺️",
    title: "Circuit Diagram Legend",
    subtitle: "",
  },

  {
    id: uid(), type: "text",
    content: "Use this legend to read the schematics for each challenge. The switch is shown in its **open** position (with a gap) — when the switch is **closed**, the gap closes and current can flow across both dots.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/lab-legend.jpg`,
    alt: "Circuit diagram legend showing battery (long thin + line over short thick − line), wire (straight line), light bulb (circle with X), and switch in the open position (line with gap between two dots).",
    caption: "Standard schematic symbols used in today's diagrams.",
  },

  // ─── CHALLENGE 1 ─────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🟢",
    title: "Challenge 1 — One Switch, One Bulb",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Goal:** Build a single-loop circuit where the switch turns the bulb on and off.\n\n- Closed switch → bulb lights\n- Open switch → bulb goes dark\n\nOnly 1 of your 2 bulbs is used here. Set the other bulb aside.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/lab-challenge-1.jpg`,
    alt: "Schematic for Challenge 1: a single rectangular loop with a battery on the left, a switch on the right, and one light bulb on the bottom edge of the loop.",
    caption: "Challenge 1 schematic — battery, switch, and one bulb in a single series loop.",
  },

  {
    id: "checkpoint-c1", type: "teacher_checkpoint",
    title: "Show Me: Challenge 1",
    prompt: "When you can flip the switch and watch the bulb turn on and off, raise your hand. Mr. McCarthy will verify both states (open = dark, closed = lit) before you move on. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── CHALLENGE 2 ─────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🟡",
    title: "Challenge 2 — Switch Controls Just One Bulb",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Goal:** Add the second bulb so that:\n\n- **Bulb A** stays lit the whole time, no matter what\n- **Bulb B** turns on and off with the switch\n\nThink about where the switch needs to sit — it can only break one bulb's path, not both. That means the bulbs need to be on **separate branches**, and the switch goes on **just one** of those branches.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/lab-challenge-2.jpg`,
    alt: "Schematic for Challenge 2: battery on the left feeding two parallel branches. Top branch has Bulb A only and is labeled 'always on'. Bottom branch has the switch in series with Bulb B. Both branches reconnect on the right.",
    caption: "Challenge 2 schematic — Bulb A on its own branch (always on); switch + Bulb B share the second branch.",
  },

  {
    id: "checkpoint-c2", type: "teacher_checkpoint",
    title: "Show Me: Challenge 2",
    prompt: "When Bulb A stays lit while you flip the switch, and Bulb B turns on/off with the switch, raise your hand. Mr. McCarthy will check both states. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── CHALLENGE 3 ─────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🔴",
    title: "Challenge 3 — One Switch Controls Both Bulbs",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Goal:** Rewire the circuit so the **single switch** controls **both bulbs** at once.\n\n- Closed switch → both bulbs light\n- Open switch → both bulbs go dark\n\nThe trick: the switch has to sit in a spot where **all** the current passes through it. That means the switch goes in the **main line** — before the circuit splits into the two bulb branches.",
  },

  {
    id: uid(), type: "image",
    url: `${IMG}/lab-challenge-3.jpg`,
    alt: "Schematic for Challenge 3: battery on the left, switch in the main line at the top, then the circuit splits into two parallel branches — Bulb A on the top branch, Bulb B on the bottom branch — and reconnects on the right back to the battery.",
    caption: "Challenge 3 schematic — switch in the main line, two bulbs on parallel branches behind it.",
  },

  {
    id: "checkpoint-c3", type: "teacher_checkpoint",
    title: "Show Me: Challenge 3",
    prompt: "When flipping your single switch turns BOTH bulbs on and off together, raise your hand. Mr. McCarthy will verify both states. (5 points on approval)",
    weight: 5,
    scored: true,
  },

  // ─── WRAP UP ─────────────────────────────────────────────
  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**The pattern:** Where you put a switch decides what it controls.\n\n- Switch on **one branch** → controls just that branch's bulb (Challenge 2)\n- Switch in the **main line** → controls everything downstream (Challenge 3)\n\nThis is the same logic as your bedroom lamp switch (one branch) versus the breaker (main line).",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Each room's switch lives on its own parallel branch — flipping it only kills its room. The breaker sits in the main line before the branches split, so flipping it cuts power to everything. You just built both setups by hand.",
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
    title: "Wire It Up: Switches and Bulbs Lab",
    questionOfTheDay: "A lamp in your bedroom has its own switch. The hallway light has its own switch. But the breaker can kill the power to BOTH. Where does each switch sit in the circuit so that's possible?",
    course: "Physics",
    unit: "Circuits",
    order: 55,
    visible: false,
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Scored items: 3 teacher_checkpoint blocks (weight 5 each, 15 pts total)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
