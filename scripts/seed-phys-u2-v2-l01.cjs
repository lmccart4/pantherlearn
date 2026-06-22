// seed-phys-u2-v2-l01.cjs
// U2 v2 — Arc 1 (ANCHOR): "The Day the Earth Cracked Open" (OpenSciEd-spine / Rober-engine).
// Merges v1 L01 (Day the Earth Cracked Open) + L02 (A Crack, a Quake, and a Volcano)
// into one challenge-arc: "Crack the Earth." The 2005 Afar rift in Ethiopia — the ground
// split open, with earthquakes and a volcano — as RELATED surface evidence of something
// acting below. Students observe, build a first class model, and seed the Driving Question
// Board. Through-line: observe Afar's evidence and build/defend a first model of what
// cracked the ground. Earned vocabulary (rift / plate / force arise — never pre-defined).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1 v2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc1.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l01-earth-cracked";
// No embed in this arc (anchor lesson — observation + initial model only).

let _n = 0;
const id = (slug) => `v2u2l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌋", title: "The Day the Earth Cracked Open",
    subtitle: "Unit 2 · Arc 1 — Plate Tectonics & Forces" },

  // ── CONNECT: new unit, the anchoring phenomenon ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "New unit. Last unit we chased <span style=\"font-weight:700\">energy</span> through wires. This unit we go underground. In September 2005, in the Afar desert of Ethiopia, the ground tore open — a crack 60 kilometers long appeared in just a few days, with earthquakes shaking and a volcano erupting nearby. Nobody pushed it. So what did? Today you become the scientist who saw it first: you observe, you wonder, and you build the class's <span style=\"font-weight:700\">first guess</span> at what cracked the Earth." },

  { id: id("anchor"), type: "callout", icon: "🌍", style: "info", title: "What happened in Afar",
    content: "In <span style=\"font-weight:700\">September 2005</span>, the ground in the <span style=\"font-weight:700\">Afar desert of Ethiopia</span> split open almost without warning. Over just a few days, a crack formed that stretched about <span style=\"font-weight:700\">60 kilometers</span> (roughly 37 miles) and was up to <span style=\"font-weight:700\">8 meters</span> wide in places. The event came with <span style=\"font-weight:700\">earthquakes</span> and a <span style=\"font-weight:700\">volcanic eruption</span> that threw ash and lava into the air.\n\nThis isn't ancient history — scientists watched it happen with satellites. The landscape changed so fast that herders had to move their animals, and researchers rushed in to measure the new crack before erosion began filling it back in." },

  { id: id("dq"), type: "callout", icon: "❓", style: "warning", title: "Our Driving Question",
    content: "<span style=\"font-weight:700\">How do forces inside Earth shape what happens on the surface?</span>\n\nThis question stays with us the whole unit. Every arc, we add one more piece to our model — and by the end, <span style=\"font-weight:700\">you</span> will explain how a rift like Afar could form." },

  // ── EXPLORE: Notice & Wonder ──
  { id: id("nw-intro"), type: "callout", icon: "🔍", style: "default", title: "Notice & Wonder — observe before you explain",
    content: "Scientists don't start with answers. They start by noticing carefully and asking questions. Before we explain the rift, we <span style=\"font-weight:700\">observe it</span>. Look at the satellite images and read the description above, then log what you see and what you wonder. There are no wrong answers here — just careful observation." },

  { id: id("ml-noticewonder"), type: "mission_log", title: "Mission Log — Notice & Wonder",
    intro: "Quantity over polish. Get it all down — we'll sort it out together.",
    sections: [ { id: "nw", kind: "prompts", title: "What do you see? What do you wonder?",
      prompts: [
        { id: "notice", label: "What do you NOTICE? List everything you observe about the crack, the earthquakes, and the volcano. No wrong answers — just careful observations.", rows: 4 },
        { id: "wonder", label: "What are you WONDERING? Write at least THREE questions — about what caused the crack, where the forces came from, or why it happened so fast.", rows: 4 },
      ] } ] },

  // ── The challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Crack the Earth",
    content: "Your team's mission this arc: <span style=\"font-weight:700\">build and defend a first model</span> of what cracked the ground open in Afar. You'll work through levels — they get harder. The rule for the whole unit: <span style=\"font-weight:700\">write down what you see before you decide what's happening.</span>\n\nYou don't need the \"right\" vocabulary yet. If you find yourself reaching for a word you don't have, that's a clue — grab it in your Word Tracker and we'll earn the real definition together." },

  { id: id("system"), type: "callout", icon: "📦", style: "info", title: "What we're studying (the system)",
    content: "When physicists track a problem, they first draw a box around the part they care about. Here, the <span style=\"font-weight:700\">system</span> is the region of Earth's crust and upper interior beneath the Afar area. The <span style=\"font-weight:700\">surroundings</span> are the atmosphere, the neighboring rocks, and Earth's deeper inside. All unit, we'll track forces and energy moving across that boundary — from the surroundings, into the system, and back out." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your first guess (before the model)",
    instructions: "On your own first: sketch what you think is happening UNDER Afar to crack the ground, shake it, and make a volcano erupt — all at once. Draw the underground part you can't see. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-crack-the-earth",
    title: "Class Challenge Board — Crack the Earth",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracking the Earth.",
    levels: [
      { n: 1, name: "Notice It All", nameEs: "Obsérvalo Todo" },
      { n: 2, name: "Read the Surface", nameEs: "Lee la Superficie" },
      { n: 3, name: "Connect the Clues", nameEs: "Conecta las Pistas" },
      { n: 4, name: "Build the Model", nameEs: "Construye el Modelo" },
      { n: 5, name: "Defend the Model", nameEs: "Defiende el Modelo" },
    ] },

  // ── The evidence table: surface → subsurface inference ──
  { id: id("evidence-intro"), type: "callout", icon: "🧭", style: "default", title: "Reading the surface",
    content: "Yesterday's question: what if the crack, the earthquakes, and the volcano are <span style=\"font-weight:700\">not three separate events</span>, but three signs of the <span style=\"font-weight:700\">same</span> underlying cause? Geologists work backward — from evidence at the surface to what's happening underground. A crack means the ground was pulled apart. Earthquakes mean rocks suddenly slipped. A volcano means hot material rose. Fill the trace log below as you reason from each clue." },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Evidence Trace Log",
    intro: "For each surface observation, write what you can SEE and what it suggests is happening BELOW. <span style=\"font-weight:700\">Document your reasoning</span> — that's the scientist move, and it's worth points.",
    sections: [ { id: "tracelog", kind: "table", title: "Surface clue → underground inference",
      columns: [
        { key: "obs", label: "Observation", width: "120px", placeholder: "rift / quake / volcano" },
        { key: "see", label: "What we can SEE", placeholder: "a long crack opened…" },
        { key: "below", label: "What it suggests BELOW the surface", placeholder: "the ground was pulled apart…" },
      ], minRows: 3, addRowLabel: "Add an observation" } ] },

  { id: id("draw-model"), type: "sketch", title: "Draw Your Model",
    instructions: "Redraw your guess now that you've traced the three clues. Show the system box, the surface (crack + quake + volcano), and your best idea of the force(s) acting below that explain ALL THREE at once. Use arrows for any push or pull. Neat doesn't matter — show your current thinking.",
    canvasHeight: 360 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sketching. Now we figure out what it means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we listed some clues\" into a scientific argument." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Build the argument",
      prompts: [
        { id: "q1", label: "Which single observation, BY ITSELF, would be the *weakest* evidence of forces below the surface — and why do the three together make a stronger case? Use your trace log.", rows: 3 },
        { id: "q2", label: "We can't see the forces under Afar. So how can scientists make a claim about them at all? Explain how you reason from something you CAN see to something you CAN'T.", rows: 3 },
        { id: "q3", label: "<span style=\"font-weight:700\">CER —</span> What is causing the crack, the earthquakes, and the volcano in Afar?\n\n• CLAIM: state what you think is happening beneath Afar.\n• EVIDENCE: cite at least two observations from your trace log.\n• REASONING: explain why those observations point to forces INSIDE Earth rather than surface causes (sun, weather, weak rock).", rows: 5 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Build Our Class Model — what cracked the Earth?",
    intro: "We start the model that grows all unit. Today, round one: as a class we agree on a <span style=\"font-weight:700\">first picture</span> of what's happening beneath Afar to crack the ground, shake it, and erupt a volcano — all from one cause. It will be rough and probably wrong in places. That's the point: it's the \"before\" picture of our thinking. Copy the agreed model into your Mission Log." },

  { id: id("dqb-note"), type: "callout", icon: "📌", style: "info", title: "About the Driving Question Board",
    content: "Mr. McCarthy will post your questions on our class <span style=\"font-weight:700\">Driving Question Board</span>. As we work the unit, we'll come back and check off the ones we can answer. This first model is <span style=\"font-weight:700\">not graded for being correct</span> — it's graded for honest effort." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l1",
    title: "Class Driving Question Board",
    intro: "Post at least one question you still have about what cracked the Earth in Afar. These go on our board and drive where the unit heads next.",
    starters: [
      "What kind of force could pull the ground apart by ___?",
      "How fast / how deep does the ___ go?",
      "Why did the crack, quake, and volcano all happen ___?",
      "Could the same thing happen ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could chase down by DOING something in here — not just looking it up.",
        placeholder: "If forces pulled the ground apart, then ___ ?",
        hint: "*A good one can be answered by investigating, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc to talk about the crack, the forces, or the moving ground? Catch them here with what you THINK they mean right now. We sharpen the real definitions as we earn them across the unit." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Picture the Afar desert in September 2005. In a single week, the ground tears open into a long crack, the area is rattled by earthquakes, and a nearby volcano spits ash and lava. No bulldozer, no explosion you can see — and yet the surface of the Earth changed in days. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> In your own words, explain what you think happened beneath Afar to crack the ground, shake it, and erupt a volcano — all at once. Tie your answer to at least two surface observations. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What do earthquakes, a volcanic eruption, and a sudden rift in the crust all suggest about the Afar region?",
    options: [
      "The surface there has been heated only by sunlight for a very long time.",
      "Forces inside Earth are pushing or pulling on the crust from below.",
      "The desert rocks have grown far too brittle to hold up large structures.",
      "Seasonal wind and rain are slowly breaking apart the dry, cracked ground.",
    ], correctIndex: 1,
    explanation: "A rift, earthquakes, and volcanoes all point to forces acting inside Earth. Sunlight, weak rocks, or weather alone do not explain all three happening together." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A long crack opens in the ground at Afar. By itself, what does this surface observation most directly suggest is happening below?",
    options: [
      "The crust in that region has been pulled or stretched apart.",
      "Hot molten rock is currently erupting at that exact spot.",
      "The ground has been compressed and squeezed tightly together.",
      "Rainwater has dissolved the rock and washed the gap clean.",
    ], correctIndex: 0,
    explanation: "A crack means the crust separated — it was pulled or stretched apart. Squeezing would close a gap, not open one, and a crack alone doesn't require erupting rock." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why do scientists treat the crack, the earthquakes, and the volcano as STRONGER evidence together than any one of them alone?",
    options: [
      "A single observation is always completely useless to a scientist.",
      "The three events were definitely caused by three separate things.",
      "Three clues pointing to the same hidden cause make a more convincing case.",
      "Earthquakes are the only one of the three that can really be measured.",
    ], correctIndex: 2,
    explanation: "Each clue alone could have other explanations. When three independent observations all point to the same hidden cause — forces inside Earth — the argument is much harder to explain away." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Geologists could not directly see the forces beneath Afar. How did they still reach a claim about them?",
    options: [
      "They guessed randomly, since hidden causes can never be studied.",
      "They waited for the forces to rise to the surface and be photographed.",
      "They drilled all the way down to the forces and measured them directly.",
      "They worked backward from surface evidence to infer the unseen cause.",
    ], correctIndex: 3,
    explanation: "Scientists reason from what they can observe (the crack, quakes, volcano) to what they cannot see directly (forces below). Working backward from evidence is a core scientific move." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "What does a volcanic eruption at the surface most directly tell us about conditions below it?",
    options: [
      "Hot material from deeper inside Earth is rising toward the surface.",
      "The surface rock is unusually cold and frozen solid all the way down.",
      "Wind has carried ash and dust in from a faraway desert region.",
      "The crust above is being pulled apart into a long, wide crack.",
    ], correctIndex: 0,
    explanation: "A volcano erupts when hot material from deeper inside Earth rises and breaks through the surface. (The crack tells us about pulling apart; the volcano specifically signals rising hot material.)" },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which explanation does NOT account for all three Afar observations (crack + earthquakes + volcano) happening together?",
    options: [
      "Forces inside Earth pushed and pulled on the crust from below.",
      "Movement of material deep within Earth drove changes at the surface.",
      "Slow weathering by seasonal wind and rain wore down the dry ground.",
      "Energy and forces transferred from Earth's interior across the system boundary.",
    ], correctIndex: 2,
    explanation: "Wind and rain might crack dry ground over a long time, but they cannot cause earthquakes or a volcanic eruption. Only forces and energy from inside Earth explain all three at once." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a cross-section of Afar: draw the surface with the crack, a shaking zone, and the volcano. Then draw your best idea of what's happening BELOW — use arrows to show any push or pull. Add one arrow OFF the page for where you think hot material or energy comes from. Show your current thinking — neat doesn't matter.",
    canvasHeight: 340 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the Afar rift that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you did what real scientists did in 2005: you watched the Earth crack open, you noticed everything, and you built a first model of the forces you can't see. It's the \"before\" picture — and we'll keep sharpening it all unit until you can explain Afar yourself. See you next class. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Day the Earth Cracked Open",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2101,
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
