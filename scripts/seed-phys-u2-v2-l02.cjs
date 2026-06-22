// seed-phys-u2-v2-l02.cjs
// U2 v2 — Arc 2: "Forces & Energy Drive Change" (OpenSciEd-spine / Rober-engine).
// Merges v1 L03 (Forces Can Change Shape) + L04 (Energy Transfer Drives Change) into
// one challenge-arc: teams apply pushes/pulls to model materials and connect
// unbalanced force + energy transfer to the rifting. Force = a push or pull;
// balanced ($F_{net}=0$) vs unbalanced ($F_{net}\neq0$); unbalanced force changes
// shape (stretch/compress/bend); energy transfer accompanies forces — thermal energy
// from Earth's interior drives convection, which does mechanical work ($W=Fd$) on the
// crust. Through-line: "Crack the Earth" — find the force AND the energy behind it.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as U1 Arc 2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc2.md (sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.
// No embed for this arc (per consolidation map U2 Arc 2).

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l02-forces-energy";
// No embed asset for this arc — hands-on with model materials. Status Check scenario
// is described in text; a generated diagram can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u2l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🪨", title: "Forces & Energy Drive Change",
    subtitle: "Unit 2 · Arc 2 — Plate Tectonics & Forces" },

  // ── CONNECT: recall Arc 1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, the ground in Afar <span style=\"font-weight:700\">split open</span> — and you kept saying something \"moved\" or \"broke\" the crust. Today we hunt down what actually did it: the <span style=\"font-weight:700\">force</span> behind the crack, and the <span style=\"font-weight:700\">energy</span> that powers that force. Spoiler — rock didn't crack itself. Something pushed or pulled it. Fun is still allowed in this room." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Grab a rubber band. Stretch it. You just applied a <span style=\"font-weight:700\">force</span> — a push or a pull — and the band changed <span style=\"font-weight:700\">shape</span>. Let it go and your hand warms a little: the energy went somewhere. That's the whole thread this arc. Afar's crust changed shape the same way a rubber band does — it just needed an enormous force, applied over millions of years, and that force had to be <span style=\"font-weight:700\">powered</span> by energy transfer deep inside the Earth." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go find the force.",
    sections: [ { id: "recall", kind: "prompts", title: "What moved the crust?",
      prompts: [
        { id: "q1", label: "From Arc 1: name ONE piece of evidence that the ground in Afar actually changed (cracked, dropped, shifted).", rows: 2 },
        { id: "q2", label: "If rock had to *break*, what do you think had to act on it — and where might that come from?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Crack the Earth",
    content: "Your team gets model materials — clay, foam, a flexible strip. <span style=\"font-weight:700\">Apply pushes and pulls</span> and figure out exactly what kinds of force change a material's shape. Then connect it back to Afar: name the unbalanced force that cracked the crust AND trace the energy that powered it. Your job isn't done until you can say what force, what direction, and where the energy came from.\n\nThere are levels. They get harder. The rule from last arc still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "What you're working with",
    content: "A <span style=\"font-weight:700\">force</span> is any push or pull. Forces don't only change *motion* — they can change *shape*. When forces on an object add to zero they are <span style=\"font-weight:700\">balanced</span> ($F_{net} = 0$) and nothing changes. When they don't add to zero they are <span style=\"font-weight:700\">unbalanced</span> ($F_{net} \\neq 0$) — and an unbalanced force can stretch, squash, or bend a material.\n\n<span style=\"font-weight:700\">Defining the system:</span> the system is the object you stretch, compress, or bend (the clay, foam, or strip). The surroundings are your hands, the table, and Earth. Forces cross the boundary whenever you push or pull on the object." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the shape change (before the build)",
    instructions: "Pick ONE of your materials. Sketch what you think happens to its shape when you (1) pull its ends apart, (2) squeeze it together, and (3) bend it. Draw arrows for the forces you'd apply. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-forces-energy",
    title: "Class Challenge Board — Crack the Earth",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracked what.",
    levels: [
      { n: 1, name: "Make a Shape Change", nameEs: "Provoca un Cambio de Forma" },
      { n: 2, name: "Balanced or Unbalanced?", nameEs: "¿Equilibradas o Desequilibradas?" },
      { n: 3, name: "Name the Force", nameEs: "Nombra la Fuerza" },
      { n: 4, name: "Trace the Energy", nameEs: "Rastrea la Energía" },
      { n: 5, name: "Explain the Rift", nameEs: "Explica la Grieta" },
    ] },

  { id: id("ml-buildfail"), type: "mission_log", title: "Mission Log — Force & Shape Log",
    intro: "As you test the materials: <span style=\"font-weight:700\">before you decide what a force \"did,\" write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Testing the materials",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "test", label: "Test (pull / squeeze / bend)", placeholder: "pulled clay apart" },
        { key: "shape", label: "Shape change you saw", placeholder: "stretched, got longer…" },
        { key: "force", label: "Balanced or unbalanced? Easy or hard?", placeholder: "unbalanced — needed a hard pull" },
      ], minRows: 3, addRowLabel: "Add a test" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Force on the Crust",
    instructions: "Redraw the Afar region now that you've tested your materials. Show the crust as a strip, draw arrows for the unbalanced force(s) acting on it, and show where it cracks. Add a labeled arrow for the energy source feeding that force. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — From Energy to Force",
    intro: "Trace the chain that ends in a crack. One row per step — name the energy or force at each stage.",
    sections: [ { id: "account", kind: "table", title: "Energy-to-force trace",
      columns: [
        { key: "step", label: "Step in Earth's interior", placeholder: "core / mantle / crust" },
        { key: "energy", label: "Energy or force here", placeholder: "thermal / convection / drag…" },
        { key: "effect", label: "What it does to the crust", placeholder: "warms it / pulls it apart" },
      ], minRows: 3, addRowLabel: "Add a step" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop testing. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we bent some foam\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the force and the energy?",
      prompts: [
        { id: "q1", label: "Explain the difference between *balanced* and *unbalanced* forces. Which one changes an object's shape, and why?", rows: 3 },
        { id: "q2", label: "Describe your hands-on results: what happened when you stretched, compressed, and bent the material? Which change was easiest to produce, and which needed the most force?", rows: 3 },
        { id: "q3", label: "Trace the energy: describe the path from radioactive heat in Earth's interior to a force that can crack the crust. Use the words *thermal energy*, *convection*, and *mechanical work*.", rows: 3 },
        { id: "q4", label: "Mechanical work is $W = Fd$. In Afar, where did the *force* come from, and over what kind of *distance* did it act to open a rift?", rows: 2 },
        { id: "q5", label: "**Everyday example:** describe something you've seen where a force changed an object's shape. Identify the system, the force, and the change in shape.", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — where does the rift's energy come from?",
    content: "Earth's interior is hot — partly from the planet's formation, partly from <span style=\"font-weight:700\">radioactive decay</span>. That heat drives <span style=\"font-weight:700\">convection</span>: hot mantle rock rises, cooler rock sinks, and the whole layer circulates.\n\nThis moving mantle drags on the crust above it. Mechanical work is a force acting over a distance:\n\n$$W = F \\cdot d$$\n\nWhere the mantle rises and spreads in Afar, it pulls the crust apart. The drag force $F$ acts over a distance $d$ of many kilometers, over millions of years. That work is what stretched and finally cracked the crust.\n\nThe accounting: <span style=\"font-weight:700\">thermal</span> energy (interior heat) → <span style=\"font-weight:700\">convection</span> (moving mantle) → <span style=\"font-weight:700\">mechanical work</span> on the crust → a rift. Energy changed form at every step; it was never created or destroyed." },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — add the force and the energy",
    intro: "Same model we started in Arc 1. Today we tweak it: draw the <span style=\"font-weight:700\">unbalanced force</span> pulling the crust apart, and add the <span style=\"font-weight:700\">energy</span> source that powers it (interior heat → convection → work on the crust). Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the force or the energy behind the rift. These drive where the unit heads next.",
    starters: [
      "What decides whether a force is strong enough to ___?",
      "Where exactly does the heat in the mantle come from to ___?",
      "How long does it take for convection to ___?",
      "If the force is a pull, why does the crust ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the material ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"force,\" \"balanced,\" \"unbalanced,\" \"net force,\" \"convection,\" \"thermal,\" \"mechanical work,\" \"compression,\" \"tension\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Deep under Afar, hot mantle rock rises and spreads sideways, dragging on the crust above it. Over millions of years that drag pulls the crust apart until it finally cracks into a rift. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Use energy transfer and forces to explain why the Afar rift opened. Connect radioactive heat, mantle convection, the force on the crust, and the crack itself. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In physics, what is a force?",
    options: [
      "Any push or any pull that one object exerts on another.",
      "The total amount of energy stored inside a moving object.",
      "The speed at which an object travels from one place to another.",
      "A material's resistance to ever changing its shape under stress.",
    ], correctIndex: 0,
    explanation: "A force is simply a push or a pull. Afar's crust didn't crack on its own — a force had to push or pull on it until it broke." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement about forces and shape is true?",
    options: [
      "Balanced forces always make an object move faster and faster over time.",
      "An unbalanced force can stretch, compress, or bend an object.",
      "A force only changes an object if it is larger than Earth's gravity is.",
      "When all the forces on an object cancel out, it must change its shape.",
    ], correctIndex: 1,
    explanation: "An unbalanced force ($F_{net} \\neq 0$) can change an object's shape by stretching, compressing, or bending it. Balanced forces ($F_{net} = 0$) do not cause change." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Forces on a rock add up to exactly zero. We call these forces —",
    options: [
      "unbalanced, so the rock is being actively stretched out of shape.",
      "thermal, because zero net force means the rock must be heating up.",
      "balanced, so the rock keeps doing whatever it was already doing.",
      "mechanical, which always means the rock is speeding up over time.",
    ], correctIndex: 2,
    explanation: "When forces add to zero ($F_{net} = 0$), they are balanced and the object keeps doing what it was doing — no change in motion or shape." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Where does the thermal energy inside Earth's interior originally come from?",
    options: [
      "Sunlight that soaks down through the crust and warms the deep mantle.",
      "Friction between the spinning Earth and the atmosphere above its surface.",
      "Electrical energy generated by the planet's churning liquid metal core.",
      "The planet's original formation plus ongoing radioactive decay inside it.",
    ], correctIndex: 3,
    explanation: "Earth's interior heat comes partly from energy left over from the planet's formation and partly from radioactive decay deep inside the planet." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Hot mantle rock rises while cooler rock sinks, creating a circulation pattern. This pattern is called —",
    options: [
      "convection, the circulation driven by hot material rising and cool sinking.",
      "tension, which is the stretching force pulling the crust apart sideways and thinning it.",
      "compression, the squeezing force that pushes layers of rock together.",
      "radiation, the way energy from the core travels in straight-line rays.",
    ], correctIndex: 0,
    explanation: "Convection is circulation driven by hot material rising and cool material sinking — exactly what happens in the mantle as interior heat moves outward." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement correctly links energy transfer and forces in Earth's interior?",
    options: [
      "The crust cools the mantle by absorbing all of its kinetic energy directly.",
      "Earth's interior energy disappears before it can ever reach the surface.",
      "Thermal energy from the mantle can create forces that move the crust.",
      "Rocks store energy forever because no force can ever move them at all.",
    ], correctIndex: 2,
    explanation: "Thermal energy drives mantle convection. The moving mantle exerts forces on the crust, which can open rifts, build mountains, or drive plate motion." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Mechanical work is described by $W = Fd$. In the Afar rift, what does this relationship represent?",
    options: [
      "The temperature of the mantle multiplied by the depth of the crust above.",
      "The electrical charge stored in the rock multiplied by the rift's width.",
      "The total heat lost by the core divided by the age of the planet Earth.",
      "A drag force from the mantle acting over a distance to deform the crust.",
    ], correctIndex: 3,
    explanation: "Work is a force acting over a distance ($W = Fd$). In Afar, the force from the stretching mantle did work over many kilometers, cracking the crust open." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Where do the forces that move and crack Earth's crust ultimately get their energy?",
    options: [
      "From thermal energy in Earth's interior, transferred by mantle convection.",
      "From the gravitational pull of the Moon tugging on the solid continents.",
      "From sunlight that is absorbed by the planet's surface and conducted straight down.",
      "From the kinetic energy of earthquakes shaking loose the surrounding rock.",
    ], correctIndex: 0,
    explanation: "The chain is thermal energy (interior heat) → convection (moving mantle) → mechanical work on the crust. Interior thermal energy ultimately powers the forces that crack the crust." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch Earth's interior: the hot core at the bottom, convection arrows in the mantle (hot rising, cool sinking), and the crust on top. Add an arrow showing the unbalanced force pulling the crust apart, and label where the rift cracks open. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about force or energy that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You found the force today — a push or a pull big enough to bend rock — and you traced the energy that powers it all the way from Earth's hot interior. Heat becomes motion becomes work becomes a crack in the crust. Next class we figure out how that crack becomes whole plates on the move. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Forces & Energy Drive Change",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2102,
  visible: false,
  gradesReleased: true,
  challengeId: "u2-forces-energy",
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
