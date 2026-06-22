// seed-phys-u1-v2-l04.cjs
// U1 v2 PILOT — Arc 4: "Make It" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L06 (Making Electricity) into one challenge-arc: "Make Your Own
// Electricity." Physics: ELECTROMAGNETIC INDUCTION — a moving magnet (changing
// magnetic field through a coil) induces a current; a GENERATOR does this at scale
// (turbine spins a magnet inside a coil → electrical energy). Energy transformation:
// mechanical (spinning turbine) → electrical. Through-line: spin a magnet, induce
// current, hand-crank to light a building. Shorter single-source arc (~2 periods).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as Arc 2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source/arc4.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l04-make-it";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The induction-visualizer embed URL is from arc4.md.
const VISUALIZER = "https://paps-tools.web.app/induction-visualizer.html";

let _n = 0;
const id = (slug) => `v2l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🧲", title: "Make It",
    subtitle: "Unit 1 · Arc 4 — Energy & the Grid" },

  // ── CONNECT: recall Arc 3 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you <span style=\"font-weight:700\">controlled the flow</span> — you made buildings brighter and dimmer, and you pushed power across town with $P = IV$. But every chain we've traced started with electricity already there, coming out of a wall. Today we go back to the very first step and answer the question nobody's asked yet: where does the electricity get <span style=\"font-weight:700\">made</span> in the first place? And can you make some yourself? (Yes. With a magnet. It's great.)" },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Grab a refrigerator magnet and a small coil of wire. Wave the magnet past the coil and a meter twitches — you just made a tiny electric current with nothing but <span style=\"font-weight:700\">motion</span>. Not enough to charge your phone, but enough to prove a wild fact: <span style=\"font-weight:700\">moving a magnet makes electricity</span>. Every wind turbine, every power plant in New Jersey, every hand-crank flashlight runs on this one trick. The question for today: what exactly has to move, and why does moving it <span style=\"font-weight:700\">faster</span> make more?" },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 3 — quantity over polish. Then we go make some electricity.",
    sections: [ { id: "recall", kind: "prompts", title: "From the wall, backward",
      prompts: [
        { id: "q1", label: "Trace the energy backward: the lamp glows because electrical energy came down the wire. Where did that electrical energy come from — and where did *that* come from?", rows: 2 },
        { id: "q2", label: "We know electricity is moving charge. What do you think could *push* that charge to start moving in the first place — with no battery anywhere?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Make Your Own Electricity",
    content: "Your mission this arc: <span style=\"font-weight:700\">make electricity out of motion.</span> Start by inducing a current with a single magnet and a coil, then build up to spinning it like a real generator, and finish by hand-cranking enough current to light a model building. Your job isn't done until you can explain — out loud, with the word <span style=\"font-weight:700\">induction</span> — exactly why moving the magnet makes the meter move.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔌", style: "info", title: "What's actually happening",
    content: "A <span style=\"font-weight:700\">magnetic field</span> fills the space around a magnet. When a coil of wire sits in that field, the field \"threads\" through the loops. If the magnet <span style=\"font-weight:700\">moves</span> — or the coil moves — the amount of field threading the coil <span style=\"font-weight:700\">changes</span>, and that changing field pushes charge through the wire. That's <span style=\"font-weight:700\">electromagnetic induction</span>.\n\nDefine the <span style=\"font-weight:700\">system</span> as the magnet plus the coil. No energy is created from nothing: the mechanical energy you put in to move the magnet is transformed into electrical energy in the coil. A <span style=\"font-weight:700\">generator</span> does this at full scale — a turbine spins a magnet inside a coil and feeds current to the grid. Gas plant, wind farm, hydro dam: the final step is always the same — spinning magnet → changing field → induced current." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — how will you make current? (before the build)",
    instructions: "Before you touch the visualizer: sketch a magnet and a coil. Draw what you think you'd have to DO to the magnet to get the meter to move. Then predict — what would make MORE current? Wrong is fine; we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-make-electricity",
    title: "Class Challenge Board — Make Your Own Electricity",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's making power.",
    levels: [
      { n: 1, name: "Twitch the Meter", nameEs: "Mueve el Medidor" },
      { n: 2, name: "Spin for Current", nameEs: "Gira para Generar" },
      { n: 3, name: "Spin Faster, Glow Brighter", nameEs: "Gira Más Rápido, Brilla Más" },
      { n: 4, name: "Build a Generator", nameEs: "Construye un Generador" },
      { n: 5, name: "Hand-Crank the Building", nameEs: "Enciende el Edificio a Mano" },
    ] },

  { id: id("embed-visualizer"), type: "embed", url: VISUALIZER, scored: true, weight: 5 },

  { id: id("ml-induction"), type: "mission_log", title: "Mission Log — Induction Observations",
    intro: "As you work the visualizer: <span style=\"font-weight:700\">before you decide what made the current change, write what you saw on the meter.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "obs", kind: "table", title: "What the magnet did vs. what you got",
      columns: [
        { key: "action", label: "Magnet action", placeholder: "held still / slow spin / fast spin" },
        { key: "meter", label: "Meter reading", placeholder: "none / small / large" },
        { key: "bright", label: "Bulb brightness", placeholder: "off / dim / bright" },
        { key: "why", label: "Why? (field change)", placeholder: "how fast was the field changing?" },
      ], minRows: 3, addRowLabel: "Add a trial" } ] },

  { id: id("draw-gen"), type: "sketch", title: "Draw Your Generator",
    instructions: "Redraw your setup now that you've made current. Show the magnet, the coil, and an arrow for the spin. Add a label where the MECHANICAL energy goes in and an arrow where the ELECTRICAL energy comes out to the bulb. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — From Turbine to Home",
    intro: "Name the energy transformations in a real generator. One row per step — say the form before and the form after.",
    sections: [ { id: "trace", kind: "table", title: "Generator energy chain",
      columns: [
        { key: "step", label: "Step / device", placeholder: "wind, turbine, magnet, coil, wire…" },
        { key: "before", label: "Energy form BEFORE", placeholder: "mechanical / electrical" },
        { key: "after", label: "Energy form AFTER", placeholder: "mechanical / electrical" },
      ], minRows: 3, addRowLabel: "Add a step" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop spinning. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we wiggled a magnet\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened?",
      prompts: [
        { id: "q1", label: "In your own words, explain why moving a magnet near a coil creates a current. Your answer should mention the magnetic field and the coil.", rows: 3 },
        { id: "q2", label: "**Predict & explain (CER):** if you spin the magnet *twice as fast*, what happens to the brightness of the bulb? CLAIM — brighter, dimmer, or same? EVIDENCE — what did you see in the visualizer? REASONING — connect faster motion to a faster-changing field, more current, more energy to the bulb.", rows: 4 },
        { id: "q3", label: "A wind turbine spins a generator. Name the two main energy transformations between the wind and the electricity in your home. Use the words *mechanical* and *electrical*.", rows: 2 },
        { id: "q4", label: "A spinning magnet produces alternating current (AC). What about the spinning magnet keeps reversing, and how does that reverse the current in the wire?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why does spinning faster brighten the bulb?",
    content: "A student connects a coil to a small bulb and spins a bar magnet inside it.\n\n<span style=\"font-weight:700\">At 1 revolution per second:</span> the field threading the coil changes slowly. Only a small current is induced — the bulb glows dimly.\n\n<span style=\"font-weight:700\">At 4 revolutions per second:</span> the magnet does the same motion four times as fast, so the field changes four times faster. A larger current is induced and the bulb glows brightly.\n\n<span style=\"font-weight:700\">Why?</span> Induction depends on <span style=\"font-weight:700\">how fast the magnetic field changes</span>, not just on how strong the magnet is. Faster spin → faster field change → more current → more power delivered to the bulb. And it all traces back to the energy budget from Arc 2: the mechanical energy you put into spinning is what becomes the electrical energy in the wire — you don't get current for free." },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — add the generator",
    intro: "Same model we've grown since Arc 1. Today we tweak it: at the very start of the path, add the <span style=\"font-weight:700\">generator</span> — show a turbine spinning a magnet inside a coil, and label where mechanical energy becomes electrical energy. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about making electricity. These drive where the unit heads next.",
    starters: [
      "What spins the turbine when there's no ___?",
      "Could I make enough current to power a ___?",
      "Why does it have to be a magnet and not a ___?",
      "What happens to the generator when demand ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the current ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"induction,\" \"magnetic field,\" \"coil,\" \"generator,\" \"turbine,\" \"alternating current,\" \"mechanical\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "You build a hand-crank flashlight: turning the crank spins a small magnet inside a coil of wire, and the bulb lights up — no battery anywhere. The faster you crank, the brighter it shines. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain how cranking the flashlight lights the bulb with no battery. Name what's moving, what gets induced, and the energy transformation that happens. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Which action will induce the <span style=\"font-weight:700\">largest</span> current in a coil of wire connected to a meter?",
    options: [
      "Holding a strong magnet perfectly motionless inside the coil",
      "Quickly spinning a strong magnet inside the coil of wire",
      "Slowly pulling a weak magnet out of the coil one time",
      "Placing the coil far away from any magnet at all",
    ], correctIndex: 1,
    explanation: "Induction requires a changing magnetic field through the coil. A motionless magnet produces no current; a weak or slow magnet produces little current. Quickly spinning a strong magnet creates the fastest field change, inducing the largest current." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Inside the generator itself, the energy transformation is best described as —",
    options: [
      "mechanical energy is transformed into electrical energy.",
      "chemical, then thermal, then mechanical, then electrical energy.",
      "thermal energy is transformed directly into chemical energy.",
      "electrical energy is transformed back into mechanical energy.",
    ], correctIndex: 0,
    explanation: "The generator itself converts the mechanical energy of a spinning magnet into electrical energy. The full plant chain is chemical → thermal → mechanical → electrical, but the generator handles only the last step." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In a real power plant, what device spins the magnet inside the generator?",
    options: [
      "A transformer that steps the voltage up for the lines",
      "A battery that stores charge and releases it on demand",
      "A turbine spun by steam, wind, or moving water",
      "A solar panel that absorbs light from the sun",
    ], correctIndex: 2,
    explanation: "Steam, wind, or falling water spins the turbine blades, and the turbine spins the magnet inside the generator. A transformer changes voltage but doesn't spin the magnet." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A magnet spinning inside a coil produces alternating current (AC) because —",
    options: [
      "the coil keeps switching between being a conductor and an insulator.",
      "the electrons in the wire only ever move in one steady direction.",
      "the magnet's strength keeps growing and shrinking as it heats up.",
      "the direction of the magnetic field through the coil keeps reversing.",
    ], correctIndex: 3,
    explanation: "As the magnet spins, the field through the coil first points one way, then the other. That reversing field pushes charge back and forth in the wire, producing AC." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Electromagnetic induction is best defined as —",
    options: [
      "the creation of electric current by a changing magnetic field through a coil.",
      "the storage of charge inside a battery for later use.",
      "the heating of a wire when current passes through it.",
      "the loss of energy as low-grade heat at a substation.",
    ], correctIndex: 0,
    explanation: "Electromagnetic induction is the creation of an electric current by a changing magnetic field through a coil of wire. Moving the magnet (or the coil) changes the field and induces the current." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A student spins a magnet inside a coil and the bulb glows dimly. They then spin the <span style=\"font-weight:700\">same</span> magnet much faster. What happens, and why?",
    options: [
      "The bulb goes out, because spinning a magnet too fast cancels the current.",
      "The bulb glows brighter, because the field changes faster and induces more current.",
      "The bulb stays exactly the same, because the magnet's strength has not changed.",
      "The bulb glows dimmer, because faster motion gives the field less time to thread.",
    ], correctIndex: 1,
    explanation: "Induction depends on how fast the magnetic field changes. Spinning the same magnet faster makes the field change faster, which induces more current and delivers more power to the bulb — so it glows brighter." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a generator: a magnet inside a coil with an arrow showing it spinning, and a bulb wired to the coil. Add one arrow labeled \"mechanical energy in\" and one labeled \"electrical energy out.\" Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about making electricity that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You made electricity out of nothing but a moving magnet today — and you found the exact spot where motion becomes current: the generator. Spin faster, get more. Now you know where every joule on the grid is born. Next class we run the whole grid and find out what really failed during Sandy. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Make It",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1104,
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
