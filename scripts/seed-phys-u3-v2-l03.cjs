// seed-phys-u3-v2-l03.cjs
// U3 v2 — Arc 3: "Crashes Are Force Interactions" (OpenSciEd-spine / Rober-engine).
// Merges v1 L05 (Crashes Are Force Interactions) + L06 (Modeling a Car Crash) into one
// challenge-arc: model the crash with FORCE PAIRS. Newton's 3rd law — every collision force
// comes in an equal-and-opposite pair acting on DIFFERENT objects; damage still differs because
// the same force gives a smaller mass a bigger acceleration ($a = F_{net}/m$). Define the system:
// A-on-B / B-on-A are external if one car is the system, internal (cancel) if both cars are.
// Through-line: "Survive the Crash" — to survive it you first have to model it honestly.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new platform
// blocks + composed Status Check as the U1 v2 pilot. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc3.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke controls
// go-live). English-primary; ES via the app translation layer + challenge nameEs. No embed this arc.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l03-force-pairs";
// No embed for this arc (per consolidation map U3 Arc 3 row + task override). Status Check scenario
// is described in text; a generated crash before/during/after diagram can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u3l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "💥", title: "Crashes Are Force Interactions",
    subtitle: "Unit 3 · Arc 3 — Survive the Crash" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you used $F = ma$ to explain how a bigger speed means a longer, harder stop. Today we point that same idea at the moment of impact and answer a question that trips up almost everybody: when a tiny car and a huge SUV crash, <span style=\"font-weight:700\">which one pushes harder?</span> The answer is going to feel wrong. Stick with me — it's how you survive the crash." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture it: a compact car and a full-size SUV slam head-on. The car gets wrecked; the SUV barely looks dented. Almost everyone says the SUV \"hit harder.\"\n\nHere's the twist you'll prove today — they push on each other with <span style=\"font-weight:700\">exactly equal</span> forces. Every push comes with an equal push back, on a <span style=\"font-weight:700\">different object</span>. The damage isn't different because the forces are different. It's different because the same force does more to a smaller mass. That's Newton's third law meeting his second — and it's the whole arc." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from last arc — quantity over polish. Then we go model a crash.",
    sections: [ { id: "recall", kind: "prompts", title: "Before the impact",
      prompts: [
        { id: "q1", label: "From last arc: write Newton's 2nd law as an equation, and say in words what it tells you about a small mass and a large mass feeling the *same* force.", rows: 2 },
        { id: "q2", label: "In a head-on crash you've seen (movie, real life, a video), which vehicle do you THINK pushed harder, and why do you think that?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Model the Crash with Force Pairs",
    content: "Take one collision — your pick, but keep one object smaller than the other — and <span style=\"font-weight:700\">model it honestly</span>. Find the force pair (A pushes B, B pushes A). Show the forces are equal and opposite. Then explain the damage using $a = F_{net}/m$, not by claiming one car \"hit harder.\" Your model isn't done until it shows <span style=\"font-weight:700\">equal forces, unequal accelerations</span>.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🚗", style: "info", title: "What's actually happening at impact",
    content: "When two cars collide, each one pushes on the other. Car A pushes on Car B, and Car B pushes back on Car A with a force that is <span style=\"font-weight:700\">equal in size and opposite in direction</span>. That's Newton's third law — and it holds whether the cars are the same size or wildly different.\n\nThe forces are equal, but they act on <span style=\"font-weight:700\">different objects</span>. So the effect each force has depends on the mass it lands on. Same force, smaller mass → bigger acceleration → more violent change in motion → more deformation. The SUV doesn't push harder. It just *survives* the equal push better." },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Newton's Third Law — the force pair",
    content: "$$\\vec{F}_{A\\text{ on }B} = -\\vec{F}_{B\\text{ on }A}$$\n\nWhenever object A exerts a force on object B, object B exerts an equal and opposite force on object A. The forces are the <span style=\"font-weight:700\">same strength</span>, but they act on <span style=\"font-weight:700\">different objects</span> — so you never add them together on one object.\n\nWhy the damage differs: from $a = \\dfrac{F_{net}}{m}$, that same-size force produces a <span style=\"font-weight:700\">larger acceleration on the smaller mass</span>. Bigger acceleration means a bigger change in velocity in the same instant — and that's what crumples metal and hurts people." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — the force pair (before you model)",
    instructions: "Draw two vehicles about to collide — one small, one large. Draw the force Car A puts on Car B, and the force Car B puts on Car A, as two arrows. Make your arrows show what you THINK is true about their sizes. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-force-pairs",
    title: "Class Challenge Board — Model the Crash with Force Pairs",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's modeling what.",
    levels: [
      { n: 1, name: "Find the Force Pair", nameEs: "Encuentra el Par de Fuerzas" },
      { n: 2, name: "Show Equal and Opposite", nameEs: "Muestra Igual y Opuesto" },
      { n: 3, name: "Explain Unequal Damage", nameEs: "Explica el Daño Desigual" },
      { n: 4, name: "Define the System", nameEs: "Define el Sistema" },
      { n: 5, name: "Model Before / During / After", nameEs: "Modela Antes / Durante / Después" },
    ] },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Crash Model Log",
    intro: "As you work the levels: <span style=\"font-weight:700\">before you decide who pushes harder, write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracing the force pair",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "object", label: "Object the force acts ON", placeholder: "small car / SUV" },
        { key: "force", label: "Force on it (who pushes, how big)", placeholder: "SUV on car, equal" },
        { key: "effect", label: "Effect ($a = F/m$, change in motion)", placeholder: "small mass and large a" },
      ], minRows: 3, addRowLabel: "Add a row" } ] },

  { id: id("draw-model"), type: "sketch", title: "Draw Your Crash Model",
    instructions: "Redraw your collision now that you've traced the force pair. Show each vehicle, an arrow for the force ON each one (make them equal length and opposite), and a note under each showing its mass and how big its acceleration is. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-system"), type: "mission_log", title: "Mission Log — Define the System",
    intro: "Choosing the system carefully changes what counts as external and what doesn't. Model the SAME crash two ways — one row per choice of system.",
    sections: [ { id: "system", kind: "table", title: "System boundary vs. forces",
      columns: [
        { key: "system", label: "System I chose", placeholder: "just the small car / both vehicles" },
        { key: "external", label: "What's an EXTERNAL force here?", placeholder: "force from the other car / none" },
        { key: "internal", label: "What's INTERNAL (cancels)?", placeholder: "the A-on-B + B-on-A pair" },
      ], minRows: 2, addRowLabel: "Add a system" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop modeling. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we drew some arrows\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened in the crash?",
      prompts: [
        { id: "q1", label: "Explain how the same collision can exert equal forces on two vehicles but cause very different damage. CLAIM: are the forces equal? are the effects equal? EVIDENCE: use the force pair and $a = F_{net}/m$. REASONING: why do equal forces give unequal accelerations when masses differ?", rows: 4 },
        { id: "q2", label: "**Pick your system.** Describe the same crash twice: first with just the small car as the system, then with both vehicles as the system. What counts as an external force in each case?", rows: 3 },
        { id: "q3", label: "Use your before/during/after model to explain why the small car is pushed forward after being rear-ended, even though the forces between the two vehicles are equal.", rows: 3 },
        { id: "q4", label: "Someone says \"the SUV obviously hit harder — look at the damage.\" Using Newton's third law, write one sentence that corrects them.", rows: 2 },
        { id: "q5", label: "**Predict:** if the small car were loaded with heavy cargo so its mass doubled, how would its acceleration in the *same* crash change? Why?", rows: 2 },
      ] } ] },

  { id: id("checklist"), type: "callout", icon: "✅", style: "info", title: "Model Checklist — every strong crash model has all four",
    content: "<span style=\"font-weight:700\">System boundary</span> — what objects are inside the system?\n<span style=\"font-weight:700\">Forces</span> — label external forces on the system with arrows.\n<span style=\"font-weight:700\">Motion</span> — show velocity before, during, and after.\n<span style=\"font-weight:700\">Changes</span> — what changed because of the forces?\n\nUse the before / during / after layout: in each panel, label the system boundary, the forces, and the velocity." },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Model — add the force pairs",
    intro: "Same crash model we've been building. Today we tweak it: add the <span style=\"font-weight:700\">equal-and-opposite force pair</span> at impact, mark the system boundary, and show why the smaller mass accelerates more. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the forces in a crash. These drive where the unit heads next.",
    starters: [
      "If the forces are equal, why does ___?",
      "What happens to the force pair when ___?",
      "How does choosing the system change ___?",
      "Does Newton's third law still hold if ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the force ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"force pair,\" \"equal and opposite,\" \"third law,\" \"system,\" \"external,\" \"internal,\" \"acceleration\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A small car is stopped at a red light. A large SUV rear-ends it. Both vehicles crumple, and then they move forward together. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Describe the force pair at the moment of impact, say how the two forces compare, and explain why the small car ends up more damaged. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A small car and a large SUV collide head-on. According to Newton's third law, how do the forces they exert on each other compare?",
    options: [
      "The SUV exerts a larger force on the car because it is heavier.",
      "The car exerts a larger force on the SUV because it is faster.",
      "They exert equal-and-opposite forces on each other.",
      "No forces act on either one because the collision is so brief.",
    ], correctIndex: 2,
    explanation: "Newton's third law says the forces are equal in magnitude and opposite in direction, regardless of the masses. The SUV does not push harder just because it is bigger." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "If the forces are equal, why is the small car usually more damaged than the SUV?",
    options: [
      "The same force causes a larger acceleration in the less-massive car.",
      "The SUV's force on the car actually lasts a much longer time.",
      "The small car hits the SUV while carrying much less momentum.",
      "Newton's third law simply does not apply to vehicle collisions.",
    ], correctIndex: 0,
    explanation: "From $a = F_{net}/m$, the same force produces a larger acceleration on the smaller mass. Larger acceleration means a larger change in velocity and more deformation." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In the force pair from a crash, what is true about the two forces?",
    options: [
      "They both push on the same object and add together there.",
      "They are equal in size but act on two different objects.",
      "The larger object always feels the bigger of the two forces.",
      "They only exist if both objects have exactly the same mass.",
    ], correctIndex: 1,
    explanation: "A Newton's-third-law force pair is equal in magnitude and opposite in direction, and the two forces act on different objects — never the same one. So you never add them together on one object." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "You choose the two vehicles together as your system. What happens to the forces the two vehicles exert on each other?",
    options: [
      "They add together and double the system's acceleration.",
      "They disappear completely because the vehicles stick together.",
      "They become the only external forces left acting on the system.",
      "They become internal forces that cancel in the system model.",
    ], correctIndex: 3,
    explanation: "Inside a two-vehicle system, the A-on-B and B-on-A forces are equal and opposite, so they sum to zero for the system as a whole. They do not change the total momentum of the system." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "You choose ONLY the small car as your system. The force from the SUV is now —",
    options: [
      "an external force that changes the small car's motion.",
      "an internal force that cancels out inside the system.",
      "equal to the small car's own weight pressing downward.",
      "zero, since the SUV is outside of the chosen system.",
    ], correctIndex: 0,
    explanation: "If the system is just the small car, the SUV's push is an external force — it comes from outside the system boundary and changes the car's motion. Choosing the system decides what counts as external." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which of these belongs in a strong before/during/after crash model?",
    options: [
      "Only the final dollar cost of repairing both of the vehicles.",
      "Only the name and color of each of the vehicles in the crash.",
      "The system boundary, the forces, and the velocity in each panel.",
      "Just a single arrow showing which vehicle the witnesses blamed.",
    ], correctIndex: 2,
    explanation: "A strong model shows the system boundary, the external forces on the system, the velocity before/during/after, and the changes that the forces caused — not the cost or the blame." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "After being rear-ended, the stopped small car is pushed forward. Why does its motion change so much?",
    options: [
      "Because Newton's third law does not apply to a parked car.",
      "Because the small car secretly pushes back with a larger force.",
      "Because the equal force lands on a small mass, giving a large acceleration.",
      "Because the SUV transfers all of its color and shape into the car.",
    ], correctIndex: 2,
    explanation: "The SUV's force on the car equals the car's force on the SUV, but that force acts on the car's smaller mass. From $a = F_{net}/m$, a smaller mass gets a larger acceleration, so its motion changes a lot." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Newton's third law is best summarized as —",
    options: [
      "a heavier object always wins by exerting the stronger force.",
      "for every force, there is an equal and opposite force on another object.",
      "force pairs only appear when two objects are the exact same size.",
      "the force on an object is always equal to its mass times its weight.",
    ], correctIndex: 1,
    explanation: "Newton's third law: whenever object A exerts a force on object B, object B exerts an equal and opposite force on object A. The two forces act on different objects, regardless of their masses." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the small car and the SUV at the instant of impact. Draw the force ON the car and the force ON the SUV as two arrows — equal length, opposite directions. Then write one short line under each vehicle explaining its acceleration using its mass. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the force pair that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you proved the thing that feels wrong: in a crash, the little car and the big SUV push on each other with exactly equal force. The damage is unequal because the same force does more to a smaller mass. Next class we put a number on the motion itself — momentum. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Crashes Are Force Interactions",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3103,
  visible: false,
  gradesReleased: true,
  blocks,
};

(async () => {
  // MC distribution + length report (rule: always report)
  const mc = blocks.filter((b) => b.questionType === "multiple_choice");
  const dist = [0, 0, 0, 0];
  mc.forEach((q) => { dist[q.correctIndex]++; });
  console.log(`MC items: ${mc.length} | correct positions A/B/C/D = ${dist.join("/")}`);
  let longest = 0;
  mc.forEach((q) => {
    const lens = q.options.map((o) => o.length);
    const correctLen = lens[q.correctIndex];
    const wrongAvg = (lens.reduce((a, b) => a + b, 0) - correctLen) / (lens.length - 1);
    if (correctLen === Math.max(...lens)) longest++;
    console.log(`  "${q.prompt.slice(0, 40)}…" correct/wrongAvg len = ${(correctLen / wrongAvg).toFixed(2)}`);
  });
  console.log(`Correct = longest option in ${longest}/${mc.length} items (random baseline ≈ 25%).`);

  const res = await safeSeed(db, COURSE, LESSON, lessonData);
  console.log("safeSeed:", JSON.stringify(res));

  // verify read-back
  const snap = await db.collection("courses").doc(COURSE).collection("lessons").doc(LESSON).get();
  const d = snap.data();
  const types = (d.blocks || []).map((b) => b.type);
  const newTypes = ["mission_log", "confidence_check", "challenge_tracker", "question_board", "consensus_model"];
  console.log(`\nRead-back: ${d.blocks.length} blocks, visible=${d.visible}, gradesReleased=${d.gradesReleased}`);
  newTypes.forEach((t) => console.log(`  ${t}: ${types.filter((x) => x === t).length}`));
  process.exit(0);
})().catch((e) => { console.error("ERR", e); process.exit(1); });
