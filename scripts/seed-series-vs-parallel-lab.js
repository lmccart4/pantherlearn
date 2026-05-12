// seed-series-vs-parallel-lab.js
// Physics — Circuits Unit
// "Series vs Parallel Construction Lab" — hands-on build day (2026-05-12)
// Students construct 8 circuits from diagrams. Each build verified by Luke (teacher_checkpoint).
// Run: node scripts/seed-series-vs-parallel-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";
const LESSON_ID = "series-parallel-construction-lab";

const BASE = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/circuits";
const LEGEND = `${BASE}/four-symbols-reference.jpg`;
const DIAG_S1 = `${BASE}/lab-diag-s1-one-bulb-baseline.jpg`;        // 1 battery + 1 bulb baseline
const DIAG_S2 = `${BASE}/diagram-c-two-bulbs-series.jpg`;          // 1 battery + 2 bulbs series (reused)
const DIAG_P2 = `${BASE}/lab-diag-p2-two-bulbs-parallel.jpg`;       // 1 battery + 2 bulbs parallel
const DIAG_P3 = `${BASE}/diagram-d-three-bulbs-parallel.jpg`;       // 1 battery + 3 bulbs parallel (reused)
const DIAG_B2 = `${BASE}/lab-diag-b2-two-batteries-one-bulb.jpg`;   // 2 batteries + 1 bulb (series-aiding)
const DIAG_B3 = `${BASE}/lab-diag-b3-three-batteries-one-bulb.jpg`; // 3 batteries + 1 bulb
const DIAG_REV = `${BASE}/lab-diag-rev-batteries-opposing.jpg`;     // 2 batteries opposing + 1 bulb
const DIAG_MSW = `${BASE}/lab-diag-msw-master-switch-parallel.jpg`; // master switch
const DIAG_SSW = `${BASE}/lab-diag-ssw-single-branch-switch.jpg`;   // single-branch switch

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: "sh-warmup", type: "section_header",
    icon: "🧪",
    title: "Warm Up",
    subtitle: "~3 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Construct a series circuit and a parallel circuit from a schematic diagram",
      "Predict and observe how bulb brightness changes when you add bulbs (series vs parallel)",
      "Predict and observe how bulb brightness changes when you add batteries — and what happens when one battery is reversed",
      "Wire a master switch that controls every bulb in a circuit, and a single-branch switch that controls only one bulb",
    ],
  },

  {
    id: "callout-qotd", type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** In your house, every light has its own switch — but when you flip the main breaker, EVERY light goes out. How do circuits make BOTH of those possible at the same time?",
  },

  {
    id: "callout-materials", type: "callout",
    icon: "🧰", style: "info",
    content: "**Materials per group of 3:**\n- 3 batteries (D-cell with holders)\n- 3 bulbs (with bulb holders)\n- 2 switches\n- ~8 alligator-clip wires\n\nKeep all components on your tray when you're not using them. **Never connect a battery directly to itself** — short circuits get hot.",
  },

  // ─── LEGEND ─────────────────────────────────────────────

  {
    id: "sh-legend", type: "section_header",
    icon: "🔑",
    title: "Symbol Legend",
  },

  {
    id: "text-legend", type: "text",
    content: "Same legend from Friday. Glance at it before every build — match each symbol in the diagram to a real component on your tray.",
  },

  {
    id: "img-legend", type: "image",
    url: LEGEND,
    alt: "Circuit Symbol Recap reference card showing four standard schematic symbols: battery, light bulb, switch, resistor.",
    caption: "Friday's reference legend.",
  },

  {
    id: "callout-how", type: "callout",
    icon: "📋", style: "info",
    content: "**How this lab works:**\n\n1. Read the diagram for each build.\n2. Build the circuit on your tray.\n3. Raise your hand — **Mr. McCarthy verifies your build before you collect the point**.\n4. Answer the observation question for that build.\n5. Take the circuit apart and move on to the next one.\n\nWork as a group of 3 — everyone touches the wires.",
  },

  // ═══════════════════════════════════════════════════════
  // PHASE 1 — ONE BATTERY, MORE BULBS
  // ═══════════════════════════════════════════════════════

  {
    id: "sh-phase-1", type: "section_header",
    icon: "💡",
    title: "Phase 1 — One Battery, More Bulbs",
    subtitle: "Builds S1, S2, P2, P3 · ~14 minutes",
  },

  // ─── S1 (BASELINE) ──────────────────────────────────────

  {
    id: "sh-s1", type: "section_header",
    icon: "🔹",
    title: "Build S1 — Baseline (1 Battery, 1 Bulb)",
  },

  {
    id: "img-s1", type: "image",
    url: DIAG_S1,
    alt: "Circuit diagram: one battery on the left and one light bulb on the right, connected by wires in a single closed rectangular loop.",
    caption: "Build S1 — the baseline. One battery, one bulb. Remember how bright this is — every other Phase 1 build will be compared to this.",
  },

  {
    id: "chk-s1", type: "teacher_checkpoint",
    title: "Show Me: Build S1",
    prompt: "Light one bulb using ONE battery and ONE bulb in a single closed loop. This is your baseline brightness — look at it carefully before raising your hand. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  // ─── S2 ─────────────────────────────────────────────────

  {
    id: "sh-s2", type: "section_header",
    icon: "🔹",
    title: "Build S2 — 2 Bulbs in Series",
  },

  {
    id: "img-s2", type: "image",
    url: DIAG_S2,
    alt: "Circuit diagram: one battery on the left, two light bulbs in a row along the top wire of a single rectangular loop. Both bulbs sit on the same single loop.",
    caption: "Build S2 — 2 bulbs in series, 1 battery.",
  },

  {
    id: "chk-s2", type: "teacher_checkpoint",
    title: "Show Me: Build S2",
    prompt: "Light both bulbs using ONE battery and TWO bulbs wired in series (one loop, both bulbs on the same path). Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-s2-observation", type: "question",
    questionType: "short_answer",
    prompt: "**Compare to a one-bulb circuit.** With 2 bulbs in series, are the bulbs **brighter, dimmer, or the same** as one bulb alone? In one sentence: why? (Hint: think about how much energy each bulb is getting.)",
    weight: 2,
    scored: true,
    maxScore: 2,
  },

  // ─── P2 ─────────────────────────────────────────────────

  {
    id: "sh-p2", type: "section_header",
    icon: "🔹",
    title: "Build P2 — 2 Bulbs in Parallel",
  },

  {
    id: "img-p2", type: "image",
    url: DIAG_P2,
    alt: "Circuit diagram: a +1.5V battery on the left, two light bulbs on two vertical parallel branches on the right, and a switch on the bottom wire that controls the whole circuit.",
    caption: "Build P2 — 2 bulbs in parallel, 1 battery. The switch on the bottom wire is your lab on/off — keep it closed once you have it verified.",
  },

  {
    id: "chk-p2", type: "teacher_checkpoint",
    title: "Show Me: Build P2",
    prompt: "Light both bulbs using ONE battery, ONE switch (on the bottom wire), and TWO bulbs wired in PARALLEL (each bulb on its own branch). Close the switch to power the circuit. Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-p2-observation", type: "question",
    questionType: "multiple_choice",
    prompt: "Compare P2 (2 bulbs in parallel) to S2 (2 bulbs in series). The bulbs in P2 are:",
    options: [
      "Dimmer than in S2 — parallel splits the energy more",
      "About the same brightness — number of bulbs is what matters",
      "Off — parallel circuits don't work with only one battery",
      "Brighter than in S2 — each bulb gets the full battery voltage",
    ],
    correctIndex: 3,
    weight: 1,
    scored: true,
  },

  // ─── P3 ─────────────────────────────────────────────────

  {
    id: "sh-p3", type: "section_header",
    icon: "🔹",
    title: "Build P3 — 3 Bulbs in Parallel",
  },

  {
    id: "img-p3", type: "image",
    url: DIAG_P3,
    alt: "Circuit diagram: one battery on the left, three light bulbs on three separate horizontal branches between the same two vertical wires.",
    caption: "Build P3 — 3 bulbs in parallel, 1 battery.",
  },

  {
    id: "chk-p3", type: "teacher_checkpoint",
    title: "Show Me: Build P3",
    prompt: "Light all three bulbs using ONE battery and THREE bulbs wired in parallel (each bulb on its own branch). Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-p3-unscrew", type: "question",
    questionType: "multiple_choice",
    prompt: "With Build P3 still lit, **unscrew the middle bulb** from its holder. What happens to the other two bulbs?",
    options: [
      "They all go out — breaking one bulb breaks the circuit",
      "They go dimmer because the other bulb is missing",
      "They stay lit — each branch is independent",
      "They get brighter than before",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  // ═══════════════════════════════════════════════════════
  // PHASE 2 — MORE BATTERIES
  // ═══════════════════════════════════════════════════════

  {
    id: "sh-phase-2", type: "section_header",
    icon: "🔋",
    title: "Phase 2 — More Batteries (One Bulb)",
    subtitle: "Builds B2, B3, REV · ~12 minutes",
  },

  {
    id: "callout-batt-warning", type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Heads up:** With more batteries pushing one bulb, the bulb gets brighter — but it can also **burn out** if left on too long. Light it briefly to observe, then disconnect. If you smell anything burning, disconnect immediately and call me over.",
  },

  // ─── B2 ─────────────────────────────────────────────────

  {
    id: "sh-b2", type: "section_header",
    icon: "🔹",
    title: "Build B2 — 2 Batteries, 1 Bulb",
  },

  {
    id: "img-b2", type: "image",
    url: DIAG_B2,
    alt: "Circuit diagram: two batteries connected end-to-end in series on the left, both oriented the same direction, connected to one light bulb on the right in a single rectangular loop.",
    caption: "Build B2 — 2 batteries in series (same direction), 1 bulb.",
  },

  {
    id: "chk-b2", type: "teacher_checkpoint",
    title: "Show Me: Build B2",
    prompt: "Light the bulb using TWO batteries wired in series (both oriented the same direction — long line of each on the same side) and ONE bulb. Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-b2-observation", type: "question",
    questionType: "multiple_choice",
    prompt: "Compared to ONE battery and ONE bulb, the bulb in B2 is:",
    options: [
      "Dimmer — the second battery cancels some of the first",
      "Brighter — two batteries push harder than one",
      "About the same — only the bulb matters for brightness",
      "Off — you can't put two batteries in a row",
    ],
    correctIndex: 1,
    weight: 1,
    scored: true,
  },

  // ─── B3 ─────────────────────────────────────────────────

  {
    id: "sh-b3", type: "section_header",
    icon: "🔹",
    title: "Build B3 — 3 Batteries, 1 Bulb",
  },

  {
    id: "img-b3", type: "image",
    url: DIAG_B3,
    alt: "Circuit diagram: three batteries connected end-to-end in series on the left, all oriented the same direction, connected to one light bulb on the right in a single rectangular loop.",
    caption: "Build B3 — 3 batteries in series (same direction), 1 bulb. Light briefly — do not leave on.",
  },

  {
    id: "chk-b3", type: "teacher_checkpoint",
    title: "Show Me: Build B3",
    prompt: "Light the bulb using THREE batteries in series (all same direction) and ONE bulb. Raise your hand for verification — light it **just long enough for me to see it**, then disconnect. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-b3-observation", type: "question",
    questionType: "short_answer",
    prompt: "What did you see when you connected the third battery? Compare the brightness in B3 to B2 (2 batteries) and to a single battery. One sentence is fine.",
    weight: 2,
    scored: true,
    maxScore: 2,
  },

  // ─── REV ────────────────────────────────────────────────

  {
    id: "sh-rev", type: "section_header",
    icon: "🔹",
    title: "Build REV — Reverse One Battery",
  },

  {
    id: "img-rev", type: "image",
    url: DIAG_REV,
    alt: "Circuit diagram: two batteries connected end-to-end on the left but oriented in OPPOSITE directions (one battery is flipped relative to the other), connected to one light bulb on the right in a single rectangular loop.",
    caption: "Build REV — 2 batteries with one FLIPPED (opposing each other), 1 bulb.",
  },

  {
    id: "chk-rev", type: "teacher_checkpoint",
    title: "Show Me: Build REV",
    prompt: "Start from Build B2 (two batteries, both same direction, one bulb lit). Now **flip ONE of the two batteries** so they face OPPOSITE directions. Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-rev-observation", type: "question",
    questionType: "multiple_choice",
    prompt: "When you flipped one of the two batteries in Build REV, what happened to the bulb?",
    options: [
      "It went out (or got very dim) — the two batteries push in opposite directions and cancel each other",
      "It got even brighter than B2",
      "It exploded",
      "It stayed the same brightness as B2",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  {
    id: "callout-rev-insight", type: "callout",
    icon: "💡", style: "insight",
    content: "**Why this matters:** Batteries push charge in one direction. Two batteries pointing the same way **add up** (B2 was brighter than 1 battery). Two batteries pointing OPPOSITE ways **fight each other** and cancel out. Watch the long/short lines on a real battery in real life — same idea, just smaller.",
  },

  // ═══════════════════════════════════════════════════════
  // PHASE 3 — SWITCHES
  // ═══════════════════════════════════════════════════════

  {
    id: "sh-phase-3", type: "section_header",
    icon: "🔘",
    title: "Phase 3 — Master Switch vs. Single-Branch Switch",
    subtitle: "Builds MSW, SSW · ~10 minutes",
  },

  {
    id: "text-switches-intro", type: "text",
    content: "Where you put a switch in a parallel circuit completely changes what the switch controls. Build both versions and feel the difference yourself.",
  },

  // ─── MSW ────────────────────────────────────────────────

  {
    id: "sh-msw", type: "section_header",
    icon: "🔹",
    title: "Build MSW — Master Switch (Controls Everything)",
  },

  {
    id: "img-msw", type: "image",
    url: DIAG_MSW,
    alt: "Circuit diagram: battery on the left, then a switch on the main wire BEFORE the parallel branches split, then two bulbs on two separate parallel branches.",
    caption: "Build MSW — switch on the main line, two bulbs on parallel branches.",
  },

  {
    id: "chk-msw", type: "teacher_checkpoint",
    title: "Show Me: Build MSW",
    prompt: "Wire ONE battery, ONE switch, and TWO bulbs so that the switch is on the MAIN line (before the parallel branches). Flip the switch on/off to show that BOTH bulbs go on and off together. Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-msw-observation", type: "question",
    questionType: "multiple_choice",
    prompt: "In Build MSW, when you OPEN the switch, what happens?",
    options: [
      "Both bulbs turn off — the switch breaks the only path back to the battery",
      "Only the bulb on the top branch turns off",
      "Only the bulb on the bottom branch turns off",
      "Nothing — switches don't work in parallel circuits",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  // ─── SSW ────────────────────────────────────────────────

  {
    id: "sh-ssw", type: "section_header",
    icon: "🔹",
    title: "Build SSW — Single-Branch Switch (Controls One Bulb)",
  },

  {
    id: "img-ssw", type: "image",
    url: DIAG_SSW,
    alt: "Circuit diagram: two 1.5V batteries stacked in series on the left, then two parallel branches on the right. Each branch contains a light bulb at the top and a switch at the bottom (in series with that bulb). Each switch only controls its own branch.",
    caption: "Build SSW — two parallel branches, each with its own switch. Open one switch → only that bulb goes out. Open the other → only the other goes out.",
  },

  {
    id: "chk-ssw", type: "teacher_checkpoint",
    title: "Show Me: Build SSW",
    prompt: "Wire TWO batteries in series + TWO bulbs in parallel + TWO switches (one in series with each bulb on its own branch). Demonstrate that you can turn each bulb on or off INDEPENDENTLY with its own switch. Raise your hand for verification. (2 points on approval.)",
    weight: 2,
    scored: true,
  },

  {
    id: "q-ssw-observation", type: "question",
    questionType: "multiple_choice",
    prompt: "In Build SSW, when you OPEN only the LEFT switch (and leave the right one closed), what happens?",
    options: [
      "Both bulbs turn off",
      "Both bulbs get dimmer",
      "Only the LEFT bulb turns off — the right bulb stays lit because its branch is still complete",
      "Only the RIGHT bulb turns off",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: "callout-ssw-insight", type: "callout",
    icon: "💡", style: "insight",
    content: "**This is how your house works.** The breaker box has MSW-style switches: flip one and a whole room goes dark. Each room also has its own SSW-style switches: the kitchen light switch only controls the kitchen light. Same circuit ideas, just bigger.",
  },

  // ═══════════════════════════════════════════════════════
  // WRAP UP
  // ═══════════════════════════════════════════════════════

  {
    id: "sh-wrap", type: "section_header",
    icon: "✅",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: "callout-qotd-return", type: "callout",
    icon: "↩️", style: "question",
    content: "**Return to the Question of the Day:** Every light in your house has its own switch, but the breaker controls them all. Now you know exactly how. Use the words **series, parallel, master switch, single-branch switch** in your answer.",
  },

  {
    id: "q-qotd-final", type: "question",
    questionType: "short_answer",
    prompt: "**Answer the Question of the Day in 2–3 sentences.** Why does flipping one room's switch only affect that room, but flipping the breaker shuts off everything? Use the terms **parallel, master switch, single-branch switch**.",
    weight: 3,
    scored: true,
    maxScore: 3,
  },

  {
    id: "q-reflection", type: "question",
    questionType: "reflection",
    prompt: "**Exit Reflection:** Which build was the hardest to get right, and what tipped you off to fix it? (If everything worked first try, tell me which build SURPRISED you most.)",
    weight: 1,
    scored: true,
  },

  {
    id: "callout-cleanup", type: "callout",
    icon: "🧹", style: "warning",
    content: "**Before you leave:** Disconnect every battery. Put bulbs back in holders. Wires coiled, not tangled. If your tray isn't reset, the next group is going to hate you.",
  },

  // ─── KEY VOCAB ───────────────────────────────────────────

  {
    id: "sh-vocab", type: "section_header",
    icon: "📚",
    title: "Key Vocabulary",
  },

  {
    id: "vocab", type: "vocab_list",
    items: [
      { term: "Series circuit", definition: "One single path for current. Adding bulbs makes each one dimmer; breaking the path anywhere kills the whole circuit." },
      { term: "Parallel circuit", definition: "Multiple branches between the same two points. Each bulb gets the full battery voltage; breaking one branch leaves the others lit." },
      { term: "Batteries in series (aiding)", definition: "Two or more batteries pointing the SAME way, end-to-end. Their voltages add — pushes harder, bulb gets brighter." },
      { term: "Batteries in series (opposing)", definition: "Two batteries pointing OPPOSITE ways. Their voltages cancel — bulb stays dim or off." },
      { term: "Master switch", definition: "A switch placed on the main line of a circuit, BEFORE the branches split. Controls every bulb at once." },
      { term: "Single-branch switch", definition: "A switch placed on ONE branch of a parallel circuit. Controls only the bulb(s) on that branch — other branches keep working." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const ref = db.collection("courses").doc(COURSE_ID).collection("lessons").doc(LESSON_ID);
  const data = {
    title: "Series vs Parallel — Construction Lab",
    questionOfTheDay:
      "In your house, every light has its own switch — but when you flip the main breaker, EVERY light goes out. How do circuits make BOTH of those possible at the same time?",
    course: "Physics",
    unit: "Circuits",
    order: 4,
    visible: true,
    dueDate: "2026-05-12",
    gradesReleased: true,
    blocks,
    updatedAt: new Date(),
  };
  await ref.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   visible: ${data.visible} | dueDate: ${data.dueDate} | gradesReleased: ${data.gradesReleased}`);

  // Quick scored-block tally
  const scored = blocks.filter(b => b.scored);
  console.log(`   Scored blocks: ${scored.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
