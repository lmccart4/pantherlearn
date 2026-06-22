// seed-phys-u2-v2-l03.cjs
// U2 v2 — Arc 3: "Inside the Earth" (OpenSciEd-spine / Rober-engine).
// Merges v1 L05 (A First Model of Plate Motion) + L06 (Inside Earth: What We Can't See)
// into one challenge-arc: a FIRST plate-motion model (pushes/pulls that move plates —
// mantle drag, ridge push, slab pull) + using SEISMIC-WAVE data to infer Earth's layered
// interior (crust / mantle / outer core / inner core). Through-line: "Crack the Earth" —
// what moves the plate that split Afar, and what's underneath doing the moving?
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1 v2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc3.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l03-inside-earth";
// Seismic-tomography embed URL is from u2-arc3.md (exact).
const TOMO = "https://paps-tools.web.app/seismic-tomography.html";

let _n = 0;
const id = (slug) => `v2u2l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌍", title: "Inside the Earth",
    subtitle: "Unit 2 · Arc 3 — Plate Tectonics & Forces" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you called the ground splitting a battle of <span style=\"font-weight:700\">pushes and pulls</span> — unbalanced forces tearing Afar open. Fair. But that just moves the question down a level: what's actually <span style=\"font-weight:700\">pushing</span>? And here's the wild part — the thing doing the shoving is buried thousands of kilometers under your feet, and nobody has ever seen it. Today we figure out how to look inside a planet we can't open." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Quick gut check. The deepest hole humans have ever drilled goes down about <span style=\"font-weight:700\">12 kilometers</span>. The center of the Earth is about <span style=\"font-weight:700\">6,400 kilometers</span> down. So we've scratched roughly the first 0.2% of the way and stopped.\n\nWe can't drill there. We can't dig there. Yet scientists will tell you the exact layers, which ones are solid, which one is liquid — with confidence. How? That's the mystery we crack today: you can learn what's inside something without ever cutting it open, if you watch how <span style=\"font-weight:700\">energy moves through it</span>." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 2 — quantity over polish. Then we go inside the planet.",
    sections: [ { id: "recall", kind: "prompts", title: "From pushes to plates",
      prompts: [
        { id: "q1", label: "Last arc you decided unbalanced forces split Afar. In your own words: where do you think those forces come FROM?", rows: 2 },
        { id: "q2", label: "If you couldn't cut something open, what's one trick you'd use to figure out what's inside it? (Knocking? X-rays? Something else?)", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: X-ray the planet",
    content: "You're going to build the first real <span style=\"font-weight:700\">model of plate motion</span> — name the forces that could move a plate — and then you're going to figure out what's underneath driving them by reading <span style=\"font-weight:700\">seismic waves</span>. Earthquakes send waves all the way through the planet; the way those waves speed up, slow down, and get blocked is a map of the inside. Your job isn't done until your model says WHAT moves the plate AND your layers are backed by wave evidence, not guesses.\n\nThere are levels. They get harder. Same rule as always — write down what you see before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "🧭", style: "info", title: "What you're working with",
    content: "A <span style=\"font-weight:700\">tectonic plate</span> is a big slab of Earth's crust and upper mantle that slides slowly over the hotter, softer rock below. Afar sits on a <span style=\"font-weight:700\">divergent boundary</span> — two plates pulling apart — so the crack is the surface showing us a much bigger motion.\n\nScientists put three main forces on the table for what moves a plate: <span style=\"font-weight:700\">mantle drag</span> (convection currents in the mantle drag the plate along), <span style=\"font-weight:700\">ridge push</span> (raised mid-ocean ridges shove plates away from the boundary), and <span style=\"font-weight:700\">slab pull</span> (a cold, dense edge of plate sinking into the mantle hauls the rest behind it). When these are unbalanced, the plate speeds up, slows down, or turns — very, very slowly." },

  { id: id("system"), type: "callout", icon: "📦", style: "warning", title: "Define the system before you argue about forces",
    content: "For the model: the <span style=\"font-weight:700\">system</span> is ONE tectonic plate plus the mantle directly beneath it. The <span style=\"font-weight:700\">surroundings</span> are the neighboring plates, the hot core below, and the cold ocean/atmosphere above. Forces and energy cross that boundary — that's how the surroundings move the plate. If you don't draw the boundary, you can't say whether a force is internal or external." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your first model of plate motion (before the evidence)",
    instructions: "Draw one plate. Add arrows for the forces you think move it (mantle drag, ridge push, slab pull — pick the ones you believe). Show which way the plate moves and what happens at the surface at Afar. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-inside-earth",
    title: "Class Challenge Board — X-ray the Planet",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading the waves.",
    levels: [
      { n: 1, name: "Name the Driving Forces", nameEs: "Nombra las Fuerzas Motrices" },
      { n: 2, name: "Read One Wave Clue", nameEs: "Lee una Pista de Onda" },
      { n: 3, name: "Find the Liquid Layer", nameEs: "Encuentra la Capa Líquida" },
      { n: 4, name: "Map All Four Layers", nameEs: "Mapea las Cuatro Capas" },
      { n: 5, name: "Connect Layers to the Crack", nameEs: "Conecta las Capas con la Grieta" },
    ] },

  { id: id("embed-tomo"), type: "embed", url: TOMO, scored: true, weight: 5 },

  { id: id("how-it-works"), type: "callout", icon: "🩻", style: "info", title: "How a CT scan for a planet works",
    content: "Seismic tomography is basically a CT scan of the Earth. When an earthquake fires, energy travels out as <span style=\"font-weight:700\">seismic waves</span>. Two facts do all the work:\n\n• Waves <span style=\"font-weight:700\">change speed</span> with the material — <span style=\"font-weight:700\">slow</span> usually means hot, soft rock; <span style=\"font-weight:700\">fast</span> usually means cold, rigid rock.\n• One type of wave, the <span style=\"font-weight:700\">S-wave</span> (a shear wave), <span style=\"font-weight:700\">cannot travel through liquid</span> at all — it just stops.\n\nDetectors all over the surface record when each wave arrives. From where waves speed up, slow down, bend, or vanish, scientists rebuild a 3-D picture of the inside. Sudden jumps in wave speed mark the <span style=\"font-weight:700\">boundaries between layers</span>." },

  { id: id("ml-tomo"), type: "mission_log", title: "Mission Log — Seismic Trace Log",
    intro: "As you work the tomography explorer and the levels: <span style=\"font-weight:700\">before you decide what a layer is, write what the waves did.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Reading the waves",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "depth", label: "Depth / region", placeholder: "shallow, ~2900 km, center…" },
        { key: "wave", label: "What the waves did", placeholder: "sped up / slowed / S-wave stopped" },
        { key: "infer", label: "What you infer about the material", placeholder: "solid? liquid? hot? cold?" },
      ], minRows: 4, addRowLabel: "Add a reading" } ] },

  { id: id("draw-layers"), type: "sketch", title: "Draw the Inside of the Earth",
    instructions: "Redraw a cross-section of Earth now that you've read the waves. Label the four layers from outside in. For each one, write the wave clue that tells you its state (solid/liquid) — especially the layer where S-waves stop. Don't worry about neat — show your current thinking.",
    canvasHeight: 360 },

  { id: id("layers-table"), type: "callout", icon: "🧅", style: "default", title: "Earth's four layers — what the waves reveal",
    content: "<span style=\"font-weight:700\">Crust</span> — solid. Slower waves in thin, brittle rock; speed jumps sharply at its base (the Moho). It's the thin shell we live on.\n\n<span style=\"font-weight:700\">Mantle</span> — solid, but slow-flowing. Wave speed varies with temperature; its convection is what drives plate motion.\n\n<span style=\"font-weight:700\">Outer core</span> — liquid. <span style=\"font-weight:700\">S-waves do not pass through it</span> — that's the giveaway. Its churning liquid iron makes Earth's magnetic field.\n\n<span style=\"font-weight:700\">Inner core</span> — solid. Very fast waves; hot, dense, mostly iron, held solid by crushing pressure.\n\nEvery boundary between these layers was found by a sudden change in wave speed and direction." },

  { id: id("ml-claim"), type: "mission_log", title: "Mission Log — Make the Claim",
    intro: "Pull it together. One row per layer — name it, give its state, and the wave evidence that proves it.",
    sections: [ { id: "claim", kind: "table", title: "Evidence for each layer",
      columns: [
        { key: "layer", label: "Layer", placeholder: "crust / mantle / outer core / inner core" },
        { key: "state", label: "Solid or liquid?", placeholder: "solid / liquid" },
        { key: "evidence", label: "Wave evidence", placeholder: "S-waves stop / speed jumps / very fast" },
      ], minRows: 4, addRowLabel: "Add a layer" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop scanning. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we watched some waves\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the waves actually tell us?",
      prompts: [
        { id: "q1", label: "A region deep in the Earth blocks S-waves completely but lets P-waves through. What state is it in, and how do you know?", rows: 2 },
        { id: "q2", label: "How do we know Earth has layers if we have never directly sampled most of them? Walk through the logic.", rows: 3 },
        { id: "q3", label: "Tomography shows hot mantle rock RISING beneath Afar and cooler rock SINKING nearby. Connect that to the forces that cracked the surface.", rows: 3 },
        { id: "q4", label: "Of mantle drag, ridge push, and slab pull — which do you now think matters most for Afar, and why? Did your answer change after seeing the waves?", rows: 2 },
        { id: "q5", label: "**CER.** CLAIM: state what seismic-wave data reveal about Earth's interior. EVIDENCE: use one observation from the explorer or the layer table. REASONING: explain why wave speed and wave type let scientists infer the material and its state.", rows: 4 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — add the inside of the Earth",
    intro: "Same model we started for Afar. Today we tweak it: under the plate, add the <span style=\"font-weight:700\">layers</span> the waves revealed, and label the force (mantle drag / ridge push / slab pull) you think moves the plate. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about what's inside the Earth or what moves the plates. These drive where the unit heads next.",
    starters: [
      "If the outer core is liquid, why doesn't ___?",
      "What makes the mantle ___ if it's solid?",
      "How fast do seismic waves actually ___?",
      "What heats the inside of the Earth enough to ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could chase down with evidence in here — not just look up.",
        placeholder: "If the mantle ___, then the plate would ___?",
        hint: "*A good one can be answered by doing something or checking evidence, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"tectonic plate,\" \"divergent,\" \"mantle drag,\" \"ridge push,\" \"slab pull,\" \"seismic wave,\" \"S-wave,\" \"tomography,\" \"crust,\" \"mantle,\" \"outer core,\" \"inner core\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "An earthquake fires off near Afar. Seismometers all over the planet record the waves. Some waves race through; one type stops cold partway down and never reaches the far side. From just those arrival patterns, scientists hand you a labeled cross-section of the Earth's inside. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain how scientists can map the inside of the Earth from earthquake waves alone — without ever drilling there. Name at least one layer and the wave clue that reveals it. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What is the best initial explanation for why Earth's tectonic plates move?",
    options: [
      "Ocean water gradually pushes the heavy continents apart as the planet slowly spins.",
      "Plates only move during earthquakes that shake them from side to side.",
      "Forces from the mantle below, like drag and slab pull, push or pull the plates.",
      "The plates float on a completely still mantle and drift on their own.",
    ], correctIndex: 2,
    explanation: "Plates move because forces from the mantle and plate boundaries — mantle drag, ridge push, slab pull — push or pull them. Earthquakes are a result of that motion, not the cause of it." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A region deep inside Earth blocks S-waves completely but allows P-waves to pass through. What can scientists conclude about it?",
    options: [
      "The region is liquid, because S-waves cannot travel through a liquid.",
      "The region is solid iron at an extremely high temperature and pressure.",
      "The region is the crust, where seismic waves always move the slowest.",
      "The region has no mass at all and so does not affect seismic waves.",
    ], correctIndex: 0,
    explanation: "S-waves are shear waves and cannot travel through liquids. A region that blocks S-waves but transmits P-waves must be liquid — this is how scientists identified Earth's liquid outer core." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "On a seismic-tomography map, a region shows up as unusually SLOW waves. What does that most likely mean about the rock there?",
    options: [
      "The rock is empty space, so the waves have nothing to travel through.",
      "The rock is being shaken by a separate earthquake at that moment.",
      "The rock is colder and more rigid than the rock around it.",
      "The rock is hotter and softer than the rock around it.",
    ], correctIndex: 3,
    explanation: "Slow waves usually mean hot, soft material; fast waves usually mean cold, rigid material. That speed difference is exactly what tomography uses to image the inside of the planet." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which layer of the Earth is liquid, and what is it most responsible for?",
    options: [
      "The inner core, which is liquid iron that drives all plate motion.",
      "The crust, which is liquid rock that we live on top of every day.",
      "The mantle, which is fully liquid and flows freely beneath the plates.",
      "The outer core, which is liquid and generates Earth's magnetic field.",
    ], correctIndex: 3,
    explanation: "The outer core is the liquid layer (S-waves stop there). Its churning liquid iron generates Earth's magnetic field. The inner core is solid; the mantle is solid but slow-flowing." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Which force describes a cold, dense edge of a plate sinking into the mantle and dragging the rest of the plate behind it?",
    options: [
      "Mantle drag, where convection currents pull the plate sideways.",
      "Slab pull, where a sinking plate edge hauls the rest along behind it.",
      "Ridge push, where a raised mid-ocean ridge shoves the plate away.",
      "Tidal force, where the Moon's gravity tugs the plate toward the sea.",
    ], correctIndex: 1,
    explanation: "Slab pull is the sinking, dense plate edge pulling the rest of the plate behind it. Mantle drag is convection dragging the plate; ridge push is the elevated ridge shoving it away." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Why do scientists rely on seismic waves to study Earth's deep interior instead of drilling?",
    options: [
      "Drilling would release the magnetic field stored inside the core.",
      "Seismic waves are the only thing that can physically reach the core.",
      "Drilling can only reach about 12 km, a tiny scratch on the surface.",
      "Seismic waves are cheaper to make than the steel a drill needs.",
    ], correctIndex: 2,
    explanation: "The deepest hole ever drilled is only about 12 km, while Earth's center is about 6,400 km down. We can't drill there, so seismic waves passing through the planet are how we read its interior." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "On a tomography map beneath Afar, hot rock rises and nearby cooler rock sinks. How does this best connect to the surface crack?",
    options: [
      "The rising and sinking rock is mantle convection, which can drag the plates apart.",
      "The hot rock melts the crust directly, so no forces are needed to crack it.",
      "The cooler sinking rock freezes the plate in place so it can never move again.",
      "The temperature difference deep below has no real effect at all on the plates above it.",
    ], correctIndex: 0,
    explanation: "Rising hot rock and sinking cooler rock is mantle convection — the same motion behind mantle drag. That circulation can pull plates apart at a divergent boundary like Afar." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "How do scientists detect the BOUNDARY between two of Earth's layers, such as the crust and the mantle?",
    options: [
      "They lower a thermometer down a deep mine until the rock changes color.",
      "They wait for the magnetic field to flip, which marks each new layer.",
      "They measure how much the whole planet weighs from orbiting satellites.",
      "They look for a sudden change in seismic-wave speed and direction.",
    ], correctIndex: 3,
    explanation: "Layer boundaries are found by sudden changes in wave speed and direction — for example, the sharp speed jump at the base of the crust (the Moho)." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a seismic wave starting at an earthquake near the surface and traveling down through the Earth. Mark the depth where S-waves stop, and label the liquid layer that stops them. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the inside of the Earth that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You X-rayed a planet today — no drill, just waves. You named the forces that could move a plate and used earthquakes to map four layers you'll never touch: crust, mantle, liquid outer core, solid inner core. Next class we find out what keeps that inside hot enough to move the whole show. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Inside the Earth",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2103,
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
