// seed-phys-u2-v2-l04.cjs
// U2 v2 — Arc 4: "The Heat Engine" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (Radioactivity: The Heat Engine) + L08 (Convection in the Mantle)
// into one challenge-arc: "Crack the Earth — find the engine." Radioactive decay
// releases thermal energy (Earth's internal heat source); conservation of energy
// traces the source of crustal forces; convection cells in the mantle drag the plates;
// predict where plates move apart / together. Through-line: Crack the Earth.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as U1 v2 Arc 2. Content repackaged
// verbatim from drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc4.md
// (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l04-heat-engine";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The mantle-convection embed URL is from u2-arc4.md.
const CONVECTION = "https://paps-tools.web.app/mantle-convection.html";

let _n = 0;
const id = (slug) => `v2u2l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌋", title: "The Heat Engine",
    subtitle: "Unit 2 · Arc 4 — Plate Tectonics & Forces" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you read the inside of the Earth with seismic waves and built a first plate-motion model. Everybody agreed the plates <span style=\"font-weight:700\">move</span> — but we kept dodging the real question: what's <span style=\"font-weight:700\">pushing</span> them? Force needs a source. Today we find the engine that cracks continents apart. Spoiler: it's buried, it's nuclear, and it never quits." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Rub your hands together fast. Feel the warmth? That's motion turning into heat. Now run it backwards: heat can also drive motion — a pot of boiling water churns, a hot-air balloon rises. Heat moves stuff.\n\nThe Afar ground is splitting apart. Splitting takes a <span style=\"font-weight:700\">force</span>, and that force needs energy behind it. So where is Earth getting a constant supply of heat — enough to keep the whole planet geologically alive for <span style=\"font-weight:700\">billions</span> of years? That's the thread we pull on all arc." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 3 — quantity over polish. Then we go find the engine.",
    sections: [ { id: "recall", kind: "prompts", title: "Where's the push coming from?",
      prompts: [
        { id: "q1", label: "From last arc: name ONE piece of evidence that the plates actually move.", rows: 2 },
        { id: "q2", label: "Cracking the crust open takes a force. Take a guess — where could a force that big come from?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Trace the Engine",
    content: "Your mission: <span style=\"font-weight:700\">trace the energy</span> from its hidden source all the way to a crack opening at the surface in Afar. Find what makes the heat. Show how heat becomes <span style=\"font-weight:700\">motion</span>. Show how that motion becomes a <span style=\"font-weight:700\">force</span> that pulls the crust apart. Your job isn't done until you can point at the convection cell and predict — apart or together?\n\nThere are levels. They get harder. The rule from earlier arcs still holds: write down what you observe in the model <span style=\"font-weight:700\">before</span> you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "☢️", style: "info", title: "The chain you're tracing",
    content: "Deep inside Earth, unstable nuclei like <span style=\"font-weight:700\">uranium-238, thorium-232, and potassium-40</span> are slowly decaying — emitting particles and turning into other elements. Each decay releases a tiny bit of energy as the lost mass becomes heat. That's <span style=\"font-weight:700\">radioactive decay</span>, and along with leftover heat from Earth's formation it keeps the mantle hot.\n\nHot rock is less dense, so it rises; cool rock sinks. Those slow loops are <span style=\"font-weight:700\">convection cells</span>, and where they rise and spread, they drag the crust apart. Clue for later: the energy that opened Afar didn't come from the surface. It came from underneath, and it started with an atom." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your energy path (before the model)",
    instructions: "Sketch your best guess for the path: from an atom decaying deep in the Earth, all the way up to the crust cracking open at the surface. Label each step you think the energy passes through. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-heat-engine",
    title: "Class Challenge Board — Trace the Engine",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's traced the engine.",
    levels: [
      { n: 1, name: "Find the Heat Source", nameEs: "Encuentra la Fuente de Calor" },
      { n: 2, name: "Heat Becomes Motion", nameEs: "El Calor Se Vuelve Movimiento" },
      { n: 3, name: "Read the Convection Cell", nameEs: "Lee la Celda de Convección" },
      { n: 4, name: "Motion Becomes Force", nameEs: "El Movimiento Se Vuelve Fuerza" },
      { n: 5, name: "Predict Apart or Together", nameEs: "Predice Separar o Juntar" },
    ] },

  { id: id("embed-convection"), type: "embed", url: CONVECTION, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Engine Trace Log",
    intro: "As you work the convection model and the levels: <span style=\"font-weight:700\">before you decide what a step does, write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracing the engine",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "step", label: "Step in the chain", placeholder: "decay, mantle, cell, crust…" },
        { key: "form", label: "Energy FORM here", placeholder: "nuclear / thermal / mechanical" },
        { key: "effect", label: "What it does next", placeholder: "rises, drags, pulls apart…" },
      ], minRows: 3, addRowLabel: "Add a step" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw Your Engine Path",
    instructions: "Redraw your chain now that you've run the convection model. Show each energy form as a labeled box, an arrow for each transfer/transform, and at the top show the convection cell rising and spreading — with arrows for the force it puts on the crust above. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — Energy Accounting",
    intro: "Account for the energy in the engine. One row per form — say where it is and what it's doing.",
    sections: [ { id: "account", kind: "table", title: "Energy budget",
      columns: [
        { key: "form", label: "Energy form", placeholder: "nuclear, thermal, mechanical" },
        { key: "where", label: "Where it is", placeholder: "decaying nuclei / hot mantle / moving plate" },
        { key: "doing", label: "What it's doing there", placeholder: "heating rock / rising / dragging crust" },
      ], minRows: 3, addRowLabel: "Add a form" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running the model. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we watched some loops\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the energy?",
      prompts: [
        { id: "q1", label: "Trace the energy chain. Starting with radioactive decay, describe the path energy takes to become a force that can move a tectonic plate.", rows: 3 },
        { id: "q2", label: "Scale check: the heat from radioactive decay is released very slowly, yet Earth has stayed geologically active for billions of years. Why does a small rate of heating still matter over geologic time?", rows: 3 },
        { id: "q3", label: "Use conservation of energy to explain how nuclear processes deep inside Earth can lead to a crack forming at the surface in Afar. (CLAIM: state how energy from decay becomes a surface force. EVIDENCE: cite the energy transfers and transformations. REASONING: explain why energy conservation means the heat can't just disappear — it must do work somewhere.)", rows: 4 },
        { id: "q4", label: "Predict from the model: if a region of mantle starts to rise faster than its neighbors, what should happen to the plate above it? Use the words *force*, *unbalanced*, and *motion* in your answer.", rows: 3 },
        { id: "q5", label: "How does mantle convection help explain why the Afar rift opened? Connect rising hot mantle to an unbalanced force that stretches and cracks the crust.", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — following the energy through the engine",
    content: "Conservation of energy says the total never changes — it only moves and changes form. Watch it walk the chain:\n\nStep 1 — <span style=\"font-weight:700\">nuclear → thermal.</span> A nucleus decays; the tiny lost mass is released as energy: $E = \\Delta m \\, c^2$. That energy heats the surrounding rock.\n\nStep 2 — <span style=\"font-weight:700\">thermal → mechanical.</span> Hot rock is less dense, so it rises and spreads; cool rock sinks. That circulation is convection — thermal energy is now doing mechanical work.\n\nStep 3 — <span style=\"font-weight:700\">mechanical → force on the crust.</span> Where the cell rises and spreads outward, it drags the plate above. An unbalanced drag force stretches and cracks the crust.\n\nNothing was created or destroyed: $$E_\\text{nuclear} \\rightarrow E_\\text{thermal} \\rightarrow W_\\text{mechanical}$$ The heat couldn't just vanish — energy conservation means it had to do work somewhere, and that somewhere is Afar." },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — add the engine",
    intro: "Same rift model we've been building all unit. Today we tweak it: add the <span style=\"font-weight:700\">heat source</span> (radioactive decay) deep inside, draw the <span style=\"font-weight:700\">convection cell</span> rising and spreading in the mantle, and show the <span style=\"font-weight:700\">force</span> it puts on the crust to crack it. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the engine that drives the plates. These drive where the unit heads next.",
    starters: [
      "If decay heats the mantle, why doesn't the Earth ___?",
      "How fast does a convection cell actually ___?",
      "What decides where the hot rock ___?",
      "If the heat ever ran out, would the plates ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — modeling or measuring — not just looking it up.",
        placeholder: "If we ___, will the plate ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"decay,\" \"isotope,\" \"convection,\" \"density,\" \"mechanical,\" \"unbalanced,\" \"drag\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Deep beneath Afar, uranium and thorium nuclei are decaying, warming the rock around them. Hot mantle rock rises in a slow loop, spreads outward near the surface, and the ground above it is splitting open. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Trace the energy from a decaying atom deep in the Earth all the way to the crust cracking apart in Afar. Name the forms it passes through in order, and say where the energy does work. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement best describes the role of radioactive decay inside Earth?",
    options: [
      "Decay only happens in the crust and has no real effect on the deep mantle below.",
      "Decay releases thermal energy that powers mantle convection.",
      "Decay steadily removes heat from the mantle and slowly cools the core down.",
      "Decay creates brand-new tectonic plates at Earth's surface over time.",
    ], correctIndex: 1,
    explanation: "Radioactive decay releases energy that heats the mantle. This thermal energy drives convection, which exerts forces on the tectonic plates above." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "What is the *first* energy transformation in the chain that drives the plates?",
    options: [
      "Mechanical energy of the moving mantle is transformed into nuclear energy.",
      "Thermal energy of the crust is transformed back into nuclear energy in atoms.",
      "Nuclear energy from decay is transformed into thermal energy in the rock.",
      "Electrical energy in the core is transformed into thermal energy in the mantle.",
    ], correctIndex: 2,
    explanation: "When an unstable nucleus decays, the tiny lost mass is released as energy that heats the surrounding rock. Nuclear → thermal comes first." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why does hot mantle rock rise while cooler mantle rock sinks?",
    options: [
      "Hot rock is less dense than cooler rock, so it rises.",
      "Hot rock is heavier than cool rock, so gravity pulls it upward fast.",
      "Hot rock is magnetic and the core pulls it toward the surface.",
      "Hot rock is solid while cool rock is liquid, so it floats on top.",
    ], correctIndex: 0,
    explanation: "Heating makes rock expand and become less dense. Less-dense material rises; as it cools near the surface it becomes denser and sinks — that loop is a convection cell." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "At a divergent boundary like Afar, where a convection cell rises beneath the crust, where does the crust tend to be pulled apart?",
    options: [
      "Where cool, dense rock sinks back down near a deep ocean trench.",
      "Where the mantle is coldest and densest, far from any rising rock.",
      "Where the outer core meets the solid inner core, deep below.",
      "Where hot rock rises and spreads outward beneath the crust.",
    ], correctIndex: 3,
    explanation: "Hot mantle rock rises and spreads outward beneath the crust. That outward drag pulls the crust apart, creating divergent boundaries and rift zones like Afar." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Inside the mantle, the energy chain runs nuclear → thermal → mechanical. What does \"conservation of energy\" tell us about that chain?",
    options: [
      "The total energy stays the same; it is only transferred and transformed.",
      "Energy is created at each step, so the mantle gains energy as it goes.",
      "Energy is destroyed by the moving rock, so less reaches the surface.",
      "Energy only counts once it becomes the very last form in the chain.",
    ], correctIndex: 0,
    explanation: "Conservation of energy means total energy is never created or destroyed — only transferred and transformed. The heat from decay can't vanish; it must do work somewhere, like cracking the crust." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "The heat from radioactive decay is released very slowly. Why has it kept Earth geologically active for billions of years?",
    options: [
      "Because the decay rate suddenly spikes every few thousand years.",
      "Because Earth has no way to lose heat once it is deep inside.",
      "Because a slow rate of heating adds up enormously over geologic time.",
      "Because the heat is recycled back into new atoms after it is used.",
    ], correctIndex: 2,
    explanation: "Even a small rate of heating, sustained over billions of years, releases a huge total amount of energy. Geologic time is long enough for slow processes to reshape continents." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "How does mantle convection exert a force on the plate above it?",
    options: [
      "The plate is pushed up by hot air rising out of cracks in the crust.",
      "The flowing mantle drags the plate along in the direction it spreads.",
      "The plate is pulled by the magnetic field generated in the inner core.",
      "The plate floats freely and feels no force at all from the mantle.",
    ], correctIndex: 1,
    explanation: "Where the convecting mantle flows beneath a plate, friction-like drag pulls the plate along in the same direction. That drag is the force that moves and cracks the crust." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "If one region of mantle starts to rise faster than its neighbors, what should happen to the plate above it?",
    options: [
      "Nothing changes, because the forces on the plate stay perfectly balanced.",
      "The plate instantly stops moving because faster flow cancels itself out.",
      "The plate sinks straight down into the core as the hot rock pushes it.",
      "An unbalanced force acts on the plate, changing its motion.",
    ], correctIndex: 3,
    explanation: "Faster rising mantle in one spot creates a stronger drag there, so the forces on the plate are no longer balanced. An unbalanced force changes the plate's motion — stretching and cracking the crust." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a cross-section of the mantle beneath Afar. Show a convection cell: hot rock rising in the middle, spreading outward near the top, cool rock sinking at the sides. Add a label for the heat source at the bottom and arrows for the force pulling the crust apart at the surface. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about Earth's engine that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You found the engine today — traced it from an atom decaying in the dark, to heat, to a slow churning loop of rock, to a force big enough to crack a continent. Nothing was created or destroyed; the energy just changed form on its way to the surface. Next class we put forces at the boundaries and start predicting motion. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Heat Engine",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2104,
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
