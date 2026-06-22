// seed-phys-u6-v2-l03.cjs
// U6 v2 — Arc 3: "The Source of Starlight" (OpenSciEd-spine / Rober-engine).
// Merges v1 L05 (Consensus Check) + L06 (The Source of Starlight) into one
// challenge-arc. Beat: synthesize spectra + H-R evidence into a REVISED consensus,
// then answer the driving question — stars shine because of nuclear FUSION in their
// cores. Contrast fusion with fission and radioactive decay. Use E = mc^2 to relate a
// tiny mass difference to a huge energy release. Through-line: "Read the Starlight."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// platform blocks + composed Status Check as the U1 pilot. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc3.md (sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l03-fusion";
// No embed for this arc (per overrides). Status Check scenario is described in text;
// a generated diagram can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u6l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "✨", title: "The Source of Starlight",
    subtitle: "Unit 6 · Arc 3 — Stars & the Cosmos" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you learned to <span style=\"font-weight:700\">read the starlight</span>: a star's spectrum is an element fingerprint, and the H-R diagram sorts stars by temperature, brightness, and life stage. Powerful stuff. But we've been dodging the biggest question the whole unit. Today we corner it: <span style=\"font-weight:700\">why does a star shine at all?</span> A star is just a giant ball of gas in space — so where does all that light actually come from?" },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Think about a campfire. It glows because fuel is burning — a chemical reaction. Easy. Now think about the Sun: it has been pouring out light for about <span style=\"font-weight:700\">4.6 billion years</span> and shows no sign of running low. No campfire could do that. No chemical fire we know of could do that. So whatever powers a star, it is <span style=\"font-weight:700\">not</span> ordinary burning. That's the thread we pull today — and the answer rewrites what we thought \"making energy\" even means." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the last arc — quantity over polish. Then we hunt down the source of starlight.",
    sections: [ { id: "recall", kind: "prompts", title: "What can starlight tell us?",
      prompts: [
        { id: "q1", label: "Name ONE thing a star's spectrum tells you, and ONE thing the H-R diagram tells you.", rows: 2 },
        { id: "q2", label: "A campfire glows by burning fuel. Why can't that be how the Sun has shone for billions of years?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Revise the Consensus, then Crack the Source",
    content: "Two jobs today. First, <span style=\"font-weight:700\">pull every clue you've gathered into one revised class model</span> of the 'new star' phenomenon — what we KNOW vs. what's still unanswered. Then chase down the one giant unanswered question: <span style=\"font-weight:700\">what is the source of a star's energy?</span> You'll work the evidence until you can defend it with conservation of energy and a little math.\n\nThere are levels. They get harder. Same rule as always — write what the evidence says before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "Where we stand",
    content: "Here's the consensus so far, in plain terms:\n• Stars emit light across the electromagnetic spectrum.\n• A star's spectrum reveals which <span style=\"font-weight:700\">elements</span> are in it.\n• The H-R diagram links a star's <span style=\"font-weight:700\">temperature, luminosity, and life stage</span>.\n• Still unanswered: <span style=\"font-weight:700\">what makes stars shine</span>, and why they eventually fade or explode.\n\nA good scientific model connects observations to explanations. Be specific: an <span style=\"font-weight:700\">observation</span> is data we collected (dark lines in a spectrum, a star's spot on the H-R diagram); an <span style=\"font-weight:700\">inference</span> is the explanation we build from it. Today's mission lives squarely in that last bullet." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your best guess at the source (before the evidence)",
    instructions: "Before we dig in: sketch what you think is happening INSIDE a star to make it shine. What's the 'fuel'? What's the process? Label your guess. Wrong is completely fine — we sketch first so we can compare after the evidence lands.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-fusion",
    title: "Class Challenge Board — The Source of Starlight",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracked which part of the mystery.",
    levels: [
      { n: 1, name: "Sort Observation vs. Inference", nameEs: "Separa Observación de Inferencia" },
      { n: 2, name: "Rule Out the Campfire", nameEs: "Descarta la Fogata" },
      { n: 3, name: "Find the Missing Mass", nameEs: "Encuentra la Masa Faltante" },
      { n: 4, name: "Do the E = mc² Math", nameEs: "Haz la Cuenta de E = mc²" },
      { n: 5, name: "Defend the Whole Model", nameEs: "Defiende Todo el Modelo" },
    ] },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Fusion Evidence Log",
    intro: "As you work the levels: <span style=\"font-weight:700\">before you decide what a clue means, write what the clue actually says.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "evidencelog", kind: "table", title: "Tracking the source of starlight",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "clue", label: "Clue / evidence", placeholder: "Sun has shone 4.6 Gyr; He weighs less…" },
        { key: "obsinf", label: "Observation or Inference?", placeholder: "obs / inf" },
        { key: "meaning", label: "What it tells us about the source", placeholder: "rules out chemical burning…" },
      ], minRows: 3, addRowLabel: "Add a clue" } ] },

  { id: id("fusion-explain"), type: "callout", icon: "⚛️", style: "info", title: "The answer: nuclear fusion",
    content: "Inside a star, gravity squeezes hydrogen nuclei together at crushing pressure and temperature. When the nuclei get close enough, the <span style=\"font-weight:700\">strong nuclear force</span> snaps them together — this is <span style=\"font-weight:700\">nuclear fusion</span>. In the Sun's core, four hydrogen nuclei fuse into one helium nucleus:\n\n$$4\\,^{1}\\text{H} \\rightarrow \\,^{4}\\text{He} + 2e^{+} + 2\\nu_e + \\text{energy}$$\n\nHere's the twist: the helium nucleus has <span style=\"font-weight:700\">slightly less mass</span> than the four hydrogens you started with. That 'missing' mass didn't vanish — it became energy. The <span style=\"font-weight:700\">system</span> is the star's core (hydrogen nuclei + the strong force + the released energy). Energy stays conserved across the whole star-plus-surroundings system; a tiny bit of mass is simply converted into energy, which works its way outward as photons and finally escapes as the starlight you see." },

  { id: id("draw-path"), type: "sketch", title: "Draw the Fusion Reaction",
    instructions: "Redraw what's happening in a star's core now that you've seen the evidence. Show four hydrogen nuclei going IN and one helium nucleus coming OUT, an arrow for the energy released, and a note that the helium weighs a little less than the four hydrogens. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-compare"), type: "mission_log", title: "Mission Log — Three Nuclear Processes",
    intro: "All three of these release energy because of mass-energy equivalence. Fill in what happens and where each one matters, then mark which one powers an ordinary star.",
    sections: [ { id: "compare", kind: "table", title: "Fusion vs. fission vs. radioactive decay",
      columns: [
        { key: "process", label: "Process", placeholder: "fusion / fission / decay" },
        { key: "what", label: "What happens to the nucleus", placeholder: "light nuclei combine…" },
        { key: "where", label: "Where it matters", placeholder: "star cores / power plants…" },
      ], minRows: 3, addRowLabel: "Add a process" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop working the levels. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we read about fusion\" into physics you can defend." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Why does a star shine?",
      prompts: [
        { id: "q1", label: "What is the difference between an *observation* and an *inference*? Give one example of each from this unit so far.", rows: 3 },
        { id: "q2", label: "In the Sun's core, four hydrogen nuclei fuse into one helium nucleus. The helium has *less* mass than the four hydrogens. Where did the missing mass go? Defend it with $E = mc^2$.", rows: 3 },
        { id: "q3", label: "Why can even a TINY mass loss produce a HUGE amount of energy? (Hint: look at the size of $c^2$.)", rows: 2 },
        { id: "q4", label: "Contrast fusion in the Sun with fission in a nuclear power plant. Name one similarity and one difference.", rows: 3 },
        { id: "q5", label: "Trace the energy: it's released in the core, but you see it at the surface as light. Explain why this is a *transfer of energy within the star system*.", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how much energy from a tiny mass?",
    content: "Suppose one fusion event converts a mass of $m = 4.0 \\times 10^{-29}\\,\\text{kg}$ into energy (a made-up, round teaching number — real per-reaction values are even smaller). How much energy is that?\n\nStep 1 — the equation. Einstein's mass-energy equivalence: $E = mc^2$, where $c = 3.0 \\times 10^{8}\\,\\text{m/s}$ is the speed of light.\n\nStep 2 — square the speed of light: $c^2 = (3.0 \\times 10^{8})^2 = 9.0 \\times 10^{16}\\,\\text{m}^2/\\text{s}^2$. That number is <span style=\"font-weight:700\">enormous</span> — that's the whole secret.\n\nStep 3 — multiply: $E = (4.0 \\times 10^{-29}\\,\\text{kg})(9.0 \\times 10^{16}\\,\\text{m}^2/\\text{s}^2) = 3.6 \\times 10^{-12}\\,\\text{J}$.\n\nThat looks tiny — but a single gram of hydrogen holds about $10^{23}$ nuclei, and the Sun fuses roughly 600 million tons of hydrogen every second. Multiply that tiny per-event energy by that many events and you get a star. Because $c^2$ is so large, a <span style=\"font-weight:700\">minuscule</span> mass loss yields a colossal energy release — which is why the Sun can shine for billions of years while losing only a sliver of its mass." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Revise Our Class Model — the source of starlight",
    intro: "Same model we've been building all unit. Today is the big revision: add the <span style=\"font-weight:700\">source</span>. Show fusion in the core converting a little mass into energy, the energy traveling outward as photons, and finally escaping as starlight. Mark what's now KNOWN and what's still uncertain (like why a star eventually dies). Copy the revised model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about how stars shine or what happens next. These drive where the unit heads.",
    starters: [
      "If fusion makes helium, what happens when the star runs out of ___?",
      "How do we actually know the helium weighs less than ___?",
      "If a tiny mass makes that much energy, why can't we ___?",
      "What decides whether a star fuses for a long time or ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could investigate with evidence — spectra, data, a model — not just look up a fact.",
        placeholder: "If a star ___, will its ___ change?",
        hint: "*A good one can be answered by working with evidence, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"fusion,\" \"fission,\" \"radioactive decay,\" \"mass-energy equivalence,\" \"nucleus,\" \"consensus,\" \"observation,\" \"inference\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A friend says, \"The Sun is basically a giant campfire — it's burning hydrogen gas like a fuel.\" You know that's not quite right. Deep in the Sun's core, hydrogen nuclei are being fused into helium, and a tiny bit of mass is turning into a huge amount of energy. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why your friend is wrong. Say what process really powers the Sun, what happens to the mass, and why this lets a star shine for billions of years. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What is the main source of energy in an ordinary star like the Sun?",
    options: [
      "The radioactive decay of iron atoms collected in the star's core.",
      "Nuclear fusion, in which hydrogen nuclei combine to form helium.",
      "The chemical burning of hydrogen gas, much like a campfire burns wood.",
      "The nuclear fission of uranium, the same reaction used in power plants.",
    ], correctIndex: 1,
    explanation: "Ordinary stars like the Sun produce energy by fusing hydrogen into helium in their cores. Chemical burning is far too weak to power a star, and fission and decay are not the main process." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "In the Sun's core, four hydrogen nuclei fuse into one helium nucleus. Why does this release energy?",
    options: [
      "The helium nucleus has slightly less mass than the four hydrogens.",
      "The helium nucleus has slightly more mass than the four hydrogens.",
      "The number of hydrogen nuclei doubles during the fusion reaction.",
      "The reaction builds new elements that are heavier than solid iron.",
    ], correctIndex: 0,
    explanation: "Fusion releases energy because the product (helium) has slightly less mass than the reactants (four hydrogens). That lost mass is converted to energy via $E = mc^2$." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Einstein's equation $E = mc^2$ tells us that even a tiny mass can release a huge amount of energy. Why?",
    options: [
      "Because mass is measured in kilograms, which are very large units.",
      "Because energy is always larger than mass for any object in motion.",
      "Because the speed of light squared, $c^2$, is an enormous number.",
      "Because the helium produced spreads out and fills the whole star.",
    ], correctIndex: 2,
    explanation: "In $E = mc^2$, the mass is multiplied by $c^2 = 9 \\times 10^{16}\\,\\text{m}^2/\\text{s}^2$, an enormous number. So even a minuscule mass loss produces a colossal energy release." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement correctly contrasts nuclear fusion with nuclear fission?",
    options: [
      "Fusion splits a heavy nucleus apart, while fission joins light nuclei into one.",
      "Fusion happens only on Earth, while fission happens only inside distant stars.",
      "Fusion releases no energy at all, while only fission can ever release energy.",
      "Fusion combines light nuclei into a heavier one; fission splits a heavy nucleus.",
    ], correctIndex: 3,
    explanation: "Fusion combines light nuclei (like hydrogen) into a heavier one (helium); fission splits a heavy nucleus (like uranium) into smaller pieces. Stars run on fusion; power plants run on fission." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "In this unit, what is the difference between an *observation* and an *inference*?",
    options: [
      "An observation is the data we collect; an inference is an explanation built from that data.",
      "An observation is just a guess about a star, while an inference is a proven scientific fact.",
      "An observation always needs a telescope, while an inference can be made without any tools.",
      "There is no real difference; in astronomy the two words mean exactly the same thing.",
    ], correctIndex: 0,
    explanation: "Observations are the data (dark lines in a spectrum, a star's spot on the H-R diagram). Inferences are the explanations we build from that data." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "After fusion releases energy in a star's core, how does that energy reach the surface and become starlight?",
    options: [
      "The core spins faster and faster until it flings light off the surface.",
      "The energy travels outward as photons, transferring through the star.",
      "The helium nuclei float up and burn again in the cooler outer layers.",
      "The energy is created fresh at the surface and never moves at all.",
    ], correctIndex: 1,
    explanation: "Energy released by fusion in the core works its way outward as photons — a transfer of energy within the star system — until it finally escapes from the surface as starlight." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which of these is the most important *unanswered* question that the class model still needs to address?",
    options: [
      "Whether the average star is physically closer to Earth than the Moon is.",
      "What color the walls of the classroom happen to be painted this year.",
      "What makes stars shine, and what happens when they eventually stop.",
      "How modern research telescopes are designed, built, and paid for.",
    ], correctIndex: 2,
    explanation: "The driving question of the unit is why stars shine and what happens when they stop. The other options are not part of the model we're building." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why can the Sun keep shining for billions of years without running out of fuel quickly?",
    options: [
      "It constantly pulls in fresh hydrogen from the empty space surrounding it.",
      "It loses only a tiny fraction of its mass, yet that mass yields huge energy.",
      "Its light is recycled back into the core and then re-emitted over and over.",
      "It actually stopped shining long ago, and we only see very old leftover light.",
    ], correctIndex: 1,
    explanation: "Because $c^2$ is so large, even a tiny mass loss produces an enormous amount of energy. The Sun converts only a small fraction of its mass over billions of years, so it can shine for a very long time." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a star with its core labeled. Show four hydrogen nuclei fusing into one helium nucleus in the core, a note that the helium weighs slightly less, an energy arrow, and photons traveling outward to escape as starlight. Label the parts. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about how stars shine that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You cracked the biggest question in the unit today: stars don't burn — they <span style=\"font-weight:700\">fuse</span>, turning a whisper of mass into oceans of light. The starlight you've been reading all along is mass becoming energy, billions of years and trillions of miles away. Next class we follow that fusion forward to find out how a star lives and dies. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Source of Starlight",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6103,
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
