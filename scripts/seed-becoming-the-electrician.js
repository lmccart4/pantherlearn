// seed-becoming-the-electrician.js
// Physics — Circuits Unit, Lesson 5 (order: 5)
// "Becoming the Electrician — Circuit Lab Practical"
// Run: node scripts/seed-becoming-the-electrician.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔧",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Construct a real circuit that matches a given schematic",
      "Apply series and parallel wiring to control multiple loads independently",
      "Draw an accurate circuit diagram using standard symbols",
      "Explain how current flows through a combined series-parallel circuit",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** In your house, one breaker switch can turn off all the lights in a room, but each room also has its own light switch. How is this possible with one set of wires?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You need to wire 4 light bulbs so that: (1) a master switch can turn ALL 4 off at once, and (2) one specific bulb can be turned on and off independently without affecting the others. Sketch or describe how you would wire this. Which parts need series wiring? Which need parallel?",
    difficulty: "analyze",
  },

  // ─── THE CHALLENGE ──────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🏗️",
    title: "The Challenge",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Today you become the electrician. Your job is to build a **real, working circuit** using the circuit kits on your desk.\n\n## Your Circuit Must Have:\n\n1. **4 light bulbs** — all must light up\n2. **1 master switch (fuse box)** — when opened, ALL 4 bulbs turn off\n3. **1 independent switch** — controls exactly ONE bulb, without affecting the other 3\n\n## Think Before You Build:\n\n- The **master switch** must be in a position where ALL current passes through it — that means it goes in **series** with the entire circuit\n- The **independent switch** must only control one bulb — that means it goes in **series** with just that one bulb, on its own **parallel branch**\n- The 4 bulbs need to be wired in **parallel** so that each gets full voltage and they work independently\n\nThis requires **both series AND parallel** wiring in one circuit.",
  },

  {
    id: uid(), type: "image",
    url: "https://drive.google.com/file/d/1bROY_rITHAdkI0KeeoqpVTb6V6bgIRTx/view?usp=sharing",
    alt: "Circuit schematic for the Becoming the Electrician lab: battery connected to a master switch in series, then 4 light bulbs in parallel branches, with an independent switch on the fourth bulb's branch",
    caption: "Target schematic — your circuit must match this design",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**This is how real buildings are wired:**\n\n- The **main breaker** (master switch) is in series with everything — flip it, and the whole building loses power\n- Individual **room switches** are in series with just their room's lights — on a parallel branch\n- All rooms are on **parallel branches** from the main line — so one room's lights don't affect another's\n\nYou're building a miniature version of real electrical wiring.",
  },

  // ─── YOUR EQUIPMENT ─────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📦",
    title: "Your Equipment",
    subtitle: "~2 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Each lab station has:\n\n- **1 battery holder** (green block, holds 1 AA battery — 1.5V)\n- **4 light bulb holders** (green blocks with screw-in bulbs)\n- **2 switch blocks** (green blocks with orange toggle caps)\n- **6+ connecting wires** (black and red)\n- **1 whiteboard + markers** (for drawing your circuit diagram)\n\n**Safety reminders:**\n- Do NOT short-circuit the battery (don't connect + directly to − with just a wire)\n- If a wire gets hot, disconnect immediately — you have a short circuit\n- Handle bulbs gently — they're glass\n- Keep wires organized as you build — messy wires make troubleshooting impossible",
  },

  // ─── STEP-BY-STEP GUIDE ─────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📋",
    title: "Build Guide",
    subtitle: "~20 minutes",
  },

  {
    id: uid(), type: "text",
    content: "### Phase 1: Plan (5 min)\n\nBefore touching any equipment, sketch your circuit on the whiteboard. Think about:\n- Where does the master switch go? (Hint: it must be in the main line, before the circuit splits into branches)\n- How do the 4 bulbs connect? (Hint: parallel, so each gets full voltage)\n- Where does the independent switch go? (Hint: in series with one specific bulb, on its branch)\n\n### Phase 2: Build (10 min)\n\n1. Start with the battery and master switch — connect them in series\n2. From the master switch, split into parallel branches\n3. Connect 3 bulbs on their own branches (no extra switch)\n4. Connect the 4th bulb in series with the independent switch on its branch\n5. Connect all branches back to the battery's other terminal\n\n### Phase 3: Test (5 min)\n\n- Close both switches — do all 4 bulbs light?\n- Open the master switch — do ALL 4 bulbs go dark?\n- Close the master switch again — do all 4 come back?\n- Open the independent switch — does only ONE bulb go dark while the other 3 stay lit?\n- If something doesn't work, trace the circuit from + to − and find the break",
  },

  {
    id: uid(), type: "callout",
    icon: "🔥", style: "warning",
    content: "**Troubleshooting tips:**\n\n- **No bulbs light:** Check that the master switch is closed. Check that the battery is inserted correctly (+ and − oriented right). Trace the circuit for any breaks.\n- **Only some bulbs light:** You may have a series connection where you need parallel. Check that each bulb's branch connects back to the battery.\n- **Master switch doesn't turn off all bulbs:** The switch isn't in the main line. It needs to be before the circuit branches.\n- **Independent switch turns off more than one bulb:** The switch is in the main line or in a shared branch. It should only be in series with its one bulb.",
  },

  // ─── DELIVERABLES ───────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📝",
    title: "What to Submit",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You have three deliverables for this lab:\n\n### 1. Working Circuit\nDemonstrate to Mr. McCarthy that your circuit works:\n- All 4 bulbs light when both switches are closed\n- Master switch turns off all 4\n- Independent switch controls only 1 bulb\n\n### 2. Circuit Diagram\nOn your whiteboard, draw a proper circuit diagram of your built circuit using standard symbols:\n- Battery (long/short parallel lines)\n- Switches (gap with dots)\n- Bulbs (circle with X)\n- Wires (straight lines)\n- Label the master switch and independent switch\n\n### 3. Written Explanation\nIn 3-4 sentences, explain how your circuit works. Use these vocabulary terms:\n- Current\n- Series\n- Parallel\n- Voltage\n\nExplain WHY the master switch controls everything and WHY the independent switch only controls one bulb.",
  },

  {
    id: "q-photo", type: "question",
    questionType: "short_answer",
    prompt: "Take a photo of your completed circuit with all 4 bulbs lit. Upload or describe it here. Make sure the wires are visible so the circuit path can be traced.",
    difficulty: "apply",
  },

  {
    id: "q-diagram", type: "question",
    questionType: "short_answer",
    prompt: "Take a photo of your circuit diagram (whiteboard drawing) and upload or describe it here. Your diagram should use proper symbols and accurately represent your built circuit.",
    difficulty: "apply",
  },

  {
    id: "q-explanation", type: "question",
    questionType: "short_answer",
    prompt: "Explain how your circuit works in 3-4 sentences. Include these terms: current, series, parallel, voltage. Specifically explain: (1) Why does the master switch control all 4 bulbs? (2) Why does the independent switch only control 1 bulb?",
    difficulty: "analyze",
  },

  // ─── RUBRIC ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📊",
    title: "Grading Rubric",
    subtitle: "",
  },

  {
    id: uid(), type: "text",
    content: "You are graded on **3 skills**, each scored 0–100%:\n\n### Skill 1: Circuit Construction\n| Level | Description |\n|---|---|\n| **Refining (100%)** | Circuit works perfectly AND you can explain electron flow through it |\n| **Developing (85%)** | Circuit works — all 4 bulbs light, master switch works, independent switch works |\n| **Approaching (65%)** | Circuit partially works — some bulbs light but switches don't work as required |\n| **Emerging (55%)** | Attempted but circuit doesn't function |\n| **Missing (0%)** | No attempt |\n\n### Skill 2: Circuit Diagram\n| Level | Description |\n|---|---|\n| **Refining (100%)** | Neat diagram with correct symbols that perfectly matches your circuit |\n| **Developing (85%)** | Accurate diagram with proper symbols, minor errors |\n| **Approaching (65%)** | Some proper symbols, but doesn't fully match the circuit |\n| **Emerging (55%)** | Attempted but doesn't use proper symbols or doesn't match |\n| **Missing (0%)** | No attempt |\n\n### Skill 3: Organization & Neatness\n| Level | Description |\n|---|---|\n| **Refining (100%)** | Wires neat, organized, and labeled — easy to trace the circuit |\n| **Developing (85%)** | Well-organized wires, easy to follow |\n| **Approaching (65%)** | Circuit built as required, but wires are messy |\n| **Emerging (55%)** | Poorly constructed, wires tangled and hard to follow |\n| **Missing (0%)** | No attempt |",
  },

  // ─── REFLECTION ─────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up & Reflection",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**What you just did:**\n- Built a real circuit combining series AND parallel wiring\n- Used a master switch (series with everything) and an independent switch (series with one branch)\n- Drew a formal circuit diagram from a physical circuit\n- This is the same logic electricians use when wiring buildings\n\n**Key takeaway:** Series and parallel aren't separate things — real circuits use BOTH. The master switch is in series with the whole circuit. The bulbs are in parallel with each other. The independent switch is in series with its one bulb.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Your house breaker is a master switch wired in **series** with all the lights on that floor — flip it, everything goes dark. Each room's light switch is in **series** with just that room's lights, which are on a **parallel branch** from the main line. Same principle you just built: series for control, parallel for independence.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up sketch of how to wire 4 bulbs with a master switch and independent switch. How did your plan compare to what you actually built? What did you get right? What did you have to change?",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  {
    id: "q-reflection", type: "question",
    questionType: "short_answer",
    prompt: "What was the hardest part of this lab? If you were to do it again, what would you do differently? What advice would you give to someone attempting this for the first time?",
    difficulty: "evaluate",
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
      { term: "Series Connection", definition: "Components connected one after another in a single path. Same current flows through all. Used for master switches that control everything downstream." },
      { term: "Parallel Connection", definition: "Components connected on separate branches. Same voltage across each. Each branch operates independently." },
      { term: "Master Switch", definition: "A switch in series with the entire circuit. Controls all components — open it, and everything turns off." },
      { term: "Branch", definition: "A separate current path in a parallel circuit. Each branch can have its own switch and load." },
      { term: "Circuit Diagram", definition: "A standardized drawing of a circuit using symbols for each component. Used by engineers and electricians worldwide." },
      { term: "Schematic", definition: "Another term for circuit diagram. A blueprint showing how components are connected." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("becoming-the-electrician");

  const data = {
    title: "Becoming the Electrician",
    questionOfTheDay: "In your house, one breaker switch can turn off all the lights in a room, but each room also has its own light switch. How is this possible with one set of wires?",
    course: "Physics",
    unit: "Circuits",
    order: 5,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/becoming-the-electrician`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
