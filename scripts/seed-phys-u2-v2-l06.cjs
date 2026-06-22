// seed-phys-u2-v2-l06.cjs
// U2 v2 — Arc 6: "Reading the Rift" MID-UNIT MASTERY (OpenSciEd-spine / Rober-engine).
// Repackages v1 L11 (Mid-Unit Mastery Check) into the v2 challenge-arc style.
// This is the SHORTER, assessment-heavy arc: the Status Check IS the assessment.
// Students explain the 2005 Afar rift by integrating the whole unit so far —
// forces (balanced/unbalanced, vectors/net force), energy transfer (radioactive
// decay heat -> mantle convection), and Earth's seismic-inferred interior structure.
// Through-line: "Crack the Earth" — today you show you can read the rift.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same
// platform blocks + composed Status Check as the other arcs. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc6.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses -> safeSeed creates it. visible:false (Luke
// controls go-live). gradesReleased:true. English-primary; ES via app translation layer.
// Mastery arc: light challenge_tracker ("show what you know"), no embed.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l06-mastery";

let _n = 0;
const id = (slug) => `v2u2l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🪨", title: "Reading the Rift: Mid-Unit Mastery",
    subtitle: "Unit 2 · Arc 6 — Plate Tectonics & Forces" },

  // ── CONNECT: recall the whole unit so far → today's job ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "We've spent five arcs building the inside of the story: Earth's layers read from <span style=\"font-weight:700\">seismic waves</span>, the heat engine of <span style=\"font-weight:700\">radioactive decay</span>, the slow churn of <span style=\"font-weight:700\">mantle convection</span>, the <span style=\"font-weight:700\">forces</span> at plate boundaries, and how <span style=\"font-weight:700\">vectors</span> show direction matters. Today you pull it ALL together to explain our anchor — the crack that opened in the Afar desert. This isn't a memory test. It's a <span style=\"font-weight:700\">show-what-you-know</span> day: prove you can read the rift." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "In September 2005, an 8-meter-wide, 60-km-long crack tore open in the Afar region of Ethiopia in just days. Back at the start of this unit you tried to explain it and you didn't have the words yet. Now you do. The driving question for the whole unit set is one sentence:\n\n<span style=\"font-weight:700\">How do forces INSIDE Earth shape what happens on the surface?</span>\n\nYour job today is to answer it — running your explanation from deep inside Earth all the way up to the crack in the desert." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall across the whole unit so far — quantity over polish. Pull these back into working memory before you show what you know.",
    sections: [ { id: "recall", kind: "prompts", title: "Get the whole model back in your head",
      prompts: [
        { id: "q1", label: "In one line each: what does SEISMIC evidence tell us, and what does RADIOACTIVE decay do inside Earth?", rows: 2 },
        { id: "q2", label: "What is the difference between a BALANCED and an UNBALANCED set of forces — and which one makes a plate move?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the mastery challenge framing ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Rift",
    content: "One target today: build a <span style=\"font-weight:700\">model-based explanation</span> of the Afar rift that connects <span style=\"font-weight:700\">structure → energy → forces → surface</span>. Start deep (seismic layers + decay heat), move out (convection + boundary forces as vectors), and finish at the crack. Make your reasoning visible — the goal is showing the chain, not naming a vocabulary word. The Status Check below IS the assessment, so take your time on the explanation." },

  { id: id("system"), type: "callout", icon: "📦", style: "info", title: "Define the system before you explain",
    content: "Be precise about what you're tracking. The <span style=\"font-weight:700\">system</span> is the Afar region: the crust, the upper mantle directly beneath it, and the convection currents that interact with it. The <span style=\"font-weight:700\">surroundings</span> are Earth's deeper interior, the neighboring plates, the atmosphere, and the surface. <span style=\"font-weight:700\">Energy</span> (heat from decay) and <span style=\"font-weight:700\">forces</span> (from convection and the neighboring plates) cross these boundaries throughout your explanation — call out where they cross." },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-mastery",
    title: "Show-What-You-Know Board — Read the Rift",
    intro: "No new build today — these are the pieces of the explanation. Check each one off as you can do it WITHOUT notes. This is your own progress board.",
    levels: [
      { n: 1, name: "Read the Structure", nameEs: "Lee la Estructura" },
      { n: 2, name: "Trace the Energy", nameEs: "Rastrea la Energía" },
      { n: 3, name: "Name the Forces", nameEs: "Nombra las Fuerzas" },
      { n: 4, name: "Add the Vectors", nameEs: "Agrega los Vectores" },
      { n: 5, name: "Explain the Whole Rift", nameEs: "Explica Toda la Grieta" },
    ] },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your rift explanation (before you write)",
    instructions: "Sketch a cross-section of the Afar region from deep inside Earth up to the surface crack. Mark WHERE in your drawing each idea lives: seismic-read layers, decay heat, a convection current, the force arrows on the plate, the net force, and the crack. This is your plan — you'll turn it into writing below.",
    canvasHeight: 360 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Rift Trace Log",
    intro: "Lay out your explanation chain one link at a time. <span style=\"font-weight:700\">Before you claim a step causes the next, write the evidence for it.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Structure → energy → forces → surface",
      columns: [
        { key: "scale", label: "Scale / layer", width: "120px", placeholder: "deep mantle, boundary…" },
        { key: "idea", label: "Physics idea here", placeholder: "decay heat, convection, net force…" },
        { key: "evidence", label: "Evidence it's real", placeholder: "seismic, decay rate, vectors…" },
        { key: "next", label: "How it causes the NEXT step", placeholder: "drives / pushes / pulls…" },
      ], minRows: 4, addRowLabel: "Add a link" } ] },

  { id: id("draw-rift"), type: "sketch", title: "Redraw — the full rift, labeled",
    instructions: "Redraw your cross-section now that you've laid out the chain. Show the decay-heated mantle, a convection loop as a curved arrow, force arrows on the Afar plate, the NET force arrow, and the crack opening at the surface. Add a little label at each arrow. Neat doesn't matter — showing the whole chain does.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → worked example → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sketching. Now we make sure the chain actually holds together. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — connecting the ideas is the whole point of a mastery day." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Make the chain hold together",
      prompts: [
        { id: "q1", label: "We can't see inside Earth. Explain how ONE piece of evidence we could NOT see directly (seismic waves OR radioactive decay) still gives reliable information about what's causing the rift.", rows: 3 },
        { id: "q2", label: "Where does the energy that drives the whole system come from, and how does it get from 'heat deep inside' to 'a plate that moves'? Name the transfers in order.", rows: 3 },
        { id: "q3", label: "At Afar the plates are moving APART (divergent). Use force-direction reasoning: what does the NET force on the Afar plate point toward, and why does that open a crack instead of building a mountain?", rows: 3 },
        { id: "q4", label: "Afar is a divergent boundary. Predict the DIFFERENT hazard at a convergent boundary (two plates pushing together). Use the direction of the forces and the net force to justify your prediction.", rows: 3 },
        { id: "q5", label: "Which single piece of the chain (structure, energy, or forces) do you feel LEAST sure about, and what would help you nail it down?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — net force decides the motion",
    content: "Forces are <span style=\"font-weight:700\">vectors</span>: size AND direction. To predict how a plate moves, add the forces tip-to-tail and find the <span style=\"font-weight:700\">net force</span>.\n\nSuppose two convection currents drag opposite edges of the Afar plate <span style=\"font-weight:700\">outward</span>, away from each other. Edge A is pulled west with force $F_A$ and edge B is pulled east with force $F_B$, and the pulls are roughly equal in size:\n\n$$\\vec{F}_{net} = \\vec{F}_A + \\vec{F}_B$$\n\nBecause the two pulls point in <span style=\"font-weight:700\">opposite</span> directions, they don't cancel the way a tug-of-war does — they stretch the plate. The result is <span style=\"font-weight:700\">tension</span>: the plate is being pulled apart, so the crust thins, fractures, and a rift opens. Same math, flipped, at a convergent boundary: when $\\vec{F}_A$ and $\\vec{F}_B$ point <span style=\"font-weight:700\">toward</span> each other, the net effect is compression — crust piles up into mountains or one plate dives under the other. Direction is everything." },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — the complete rift",
    intro: "Same model we've grown all unit. Today's tweak is the big one: make sure it runs the FULL chain — seismic-read structure, decay heat, convection, boundary forces as vectors, net force, and the crack. If a link is missing, add it. Copy the completed model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l6",
    title: "Class Question Board",
    intro: "Post one question you still have after pulling the whole model together — the spots that are still fuzzy. These tell Mr. McCarthy what to firm up before the back half of the unit.",
    starters: [
      "I can explain ___ but I still can't connect it to ___.",
      "How do we know the convection current actually ___?",
      "Why does the net force point ___ and not ___?",
      "What would the explanation change if the boundary were ___?",
    ] },

  // ── NAVIGATE: testable question + word tracker (earned vocab) ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "You've earned the words this unit. Lock them in, then aim one question at the back half of the unit.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE question heading into the second half",
        label: "Something the back half of the unit (why rifts succeed or fail, could one open in NJ) could actually answer.",
        placeholder: "If a rift ___, will it ___?",
        hint: "*A good one points at something we can investigate, not just look up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — these are EARNED now",
        instructions: "By now these should be sharp, not fuzzy: \"seismic,\" \"convection,\" \"radioactive decay,\" \"balanced/unbalanced force,\" \"net force,\" \"vector,\" \"divergent,\" \"convergent,\" \"tension,\" \"compression.\" Write the ones you can now define IN YOUR OWN WORDS. Star any that are still fuzzy — those are the ones to firm up." },
    ] },

  // ── PROCESS: Status Check IS the assessment ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "This one counts. Show what you've built across the whole unit so far." },

  { id: id("sc-scenario"), type: "callout", icon: "🌋", style: "default", title: "The scenario",
    content: "September 2005, Afar region, Ethiopia. Over a matter of days the ground splits open: an 8-meter-wide, 60-km-long crack appears in the desert, with earthquakes and fresh volcanic activity along it. You now have the full unit model. Use it to explain what's happening — from deep inside Earth to the crack at the surface." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here? — the big one (CER).</span> Write ONE integrated explanation answering: <span style=\"font-weight:700\">How do forces inside Earth shape what happens on the surface?</span> Use the Afar rift as your example, and connect all THREE scales.\n\n<span style=\"font-weight:700\">CLAIM:</span> State how forces inside Earth caused the Afar rift.\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite seismic evidence (structure), radioactive decay (energy source), mantle convection, and the boundary forces.\n<span style=\"font-weight:700\">REASONING:</span> Explain how energy transfer and an UNBALANCED net force lead to the crack at the surface. Tie the three scales — deep interior, the boundary, and the surface — into one chain." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "We can't dig to Earth's core, so how do scientists know it has distinct layers like a solid inner core and a liquid outer core?",
    options: [
      "Seismic waves change speed and bend as they pass through layers of material.",
      "Deep drilling projects have already reached down and directly sampled the inner and outer core.",
      "Satellites use radar to photograph the boundaries between the core and the mantle.",
      "The layers were assumed because every other rocky planet is known to be layered.",
    ], correctIndex: 0,
    explanation: "We infer Earth's interior structure from seismic waves: they speed up, slow down, bend, and even get blocked depending on the material they pass through. That indirect evidence reveals the crust, mantle, and the liquid-outer/solid-inner core." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "What is the original energy source that keeps Earth's mantle hot enough to drive plate motion?",
    options: [
      "Sunlight that is absorbed at the surface and slowly conducts down into the mantle.",
      "Friction from the plates grinding against one another at every boundary.",
      "Heat released by the decay of radioactive elements inside Earth's interior.",
      "Tidal pull from the Moon stirring the molten rock in the outer core.",
    ], correctIndex: 2,
    explanation: "Radioactive decay of elements like uranium, thorium, and potassium releases heat deep inside Earth. That heat keeps the mantle hot and drives the convection that moves the plates. Sunlight barely penetrates the surface." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "How does heat from radioactive decay actually get turned into the motion of tectonic plates?",
    options: [
      "The heat instantly vaporizes rock, and the escaping gas shoves the plates sideways.",
      "Hot mantle rock rises, cools, and sinks in a convection loop that drags the plates.",
      "The heat builds up as pressure until it explodes outward and cracks the crust apart.",
      "The heat magnetizes the rock, and magnetic forces then pull the plates into motion.",
    ], correctIndex: 1,
    explanation: "Heat drives convection: hotter, less-dense mantle rock rises, cools near the top, then sinks again. These slow convection currents exert force on the plates above and drag them along. It's a thermal → mechanical energy transfer." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A tectonic plate is sitting still. According to Newton's ideas about forces, what must be true of the forces acting on it?",
    options: [
      "There are no forces acting on the plate at all while it stays still.",
      "Only a single force is acting, and it is too weak to move the heavy plate.",
      "The forces are unbalanced, but the plate is simply too massive to respond.",
      "The forces acting on the plate are balanced, so the net force is zero.",
    ], correctIndex: 3,
    explanation: "An object at rest has a net force of zero, which means the forces on it are balanced. For a plate to start moving, the forces must become unbalanced so there is a nonzero net force." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Why do scientists treat the forces on a plate as VECTORS rather than just amounts of push?",
    options: [
      "Because the DIRECTION of each force matters for predicting motion.",
      "Because vectors happen to be a good deal easier to add together than numbers.",
      "Because a vector can store more force in the same small amount of space.",
      "Because only vectors are allowed to be drawn as arrows on a diagram.",
    ], correctIndex: 0,
    explanation: "A force has both size and direction. Two equal pushes in opposite directions do something completely different from two in the same direction, so you must track direction — that's why forces are vectors and why we add them to find the net force." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "At Afar, convection currents pull opposite edges of the plate in OPPOSITE directions with roughly equal force. What is the result at the surface?",
    options: [
      "The two pulls cancel out completely, so absolutely nothing happens at the surface above them.",
      "The plate is stretched under tension, the crust thins and fractures, and a rift opens.",
      "The plate is compressed, the crust piles up, and a tall mountain range forms.",
      "The plate spins in place because the two forces create a rotation instead.",
    ], correctIndex: 1,
    explanation: "Opposite pulls don't cancel like a tug-of-war on a rigid object — they stretch the plate. That tension thins and fractures the crust, opening a rift. This is exactly the divergent-boundary case at Afar." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Use force reasoning to predict the hazard where two plates push directly TOWARD each other (a convergent boundary).",
    options: [
      "The crust quietly stretches and thins until a brand-new ocean basin forms there over time.",
      "The plates slide smoothly past one another with no buildup of force at all.",
      "Compression piles the crust into mountains or forces one plate under the other.",
      "Nothing happens, because forces pointing toward each other always add up to zero.",
    ], correctIndex: 2,
    explanation: "When the net force points the plates toward each other, the crust is under compression. It crumples into mountains or one plate subducts beneath the other — the opposite outcome from the tension that opens a rift at Afar." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A student says: \"The rift proves there's no force holding the Afar plate still anymore.\" What's the BEST correction using the unit model?",
    options: [
      "They're right — once a rift opens, all of the forces on the plate completely switch off for good.",
      "They're right — the only force left is gravity pulling the crust straight down.",
      "They're wrong because plates are far too heavy for any force to ever move them.",
      "They're wrong — the forces became UNBALANCED, so the net force now pulls the plate apart.",
    ], correctIndex: 3,
    explanation: "The forces didn't switch off; they became unbalanced. Convection-driven pulls in opposite directions create a nonzero net force (tension) that opens the rift. Balanced → unbalanced is what changed, not the presence of forces." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw a simple cross-section of the Afar boundary. Show the decay-heated mantle below, two convection currents as curved arrows, the two force arrows pulling the plate edges in OPPOSITE directions, the net-force result, and the crack opening at the surface. Label each arrow. Your drawing should make the whole chain visible at a glance.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel about the whole rift model right now?</span> Tap your stars — this tells Mr. McCarthy which pieces to firm up before the second half of the unit." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "strongest", label: "The part of the rift model I can explain BEST right now:", rows: 1 },
        { id: "fuzziest", label: "The part that's still fuzziest, and why:", rows: 2 },
        { id: "word", label: "One earned word I can now define in my own words *(→ Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Look at what you just did: you ran an explanation from radioactive heat deep inside Earth, through convection and the forces it makes, out to a crack tearing open a desert. That's the whole front half of the unit in one chain. Back half: why some rifts grow into oceans and others quit — and whether one could ever open under New Jersey. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Reading the Rift: Mid-Unit Mastery",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2106,
  visible: false,
  gradesReleased: true,
  challengeId: "u2-mastery",
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
