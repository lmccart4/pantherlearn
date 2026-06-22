// seed-phys-u6-v2-l07.cjs
// U6 v2 — Arc 7: "Read the Starlight" (OpenSciEd-spine / Rober-engine).
// Merges v1 L12 (More Evidence for the Big Bang) + L13 (Communicating Cosmic
// History) into one challenge-arc: "Build the Case for the Big Bang." Three
// INDEPENDENT lines of evidence — galaxy redshift, the cosmic microwave
// background (CMB), and the abundance of light elements — all converge on a hot,
// dense, expanding early universe. Then communicate that whole cosmic history as
// a coherent 3-dimensional argument. Through-line: read the starlight, and let
// it tell you the story of where everything came from.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the
// same 5 platform blocks + composed Status Check as the U1 v2 pilot. Content
// repackaged verbatim from drafts/physics-content-review/u1-v2/_v1-source-u6/
// u6-arc7.md (already sourced/audited). No embed for this arc.
//
// Grade-safety: brand-new doc, 0 responses -> safeSeed creates it. visible:false
// (Luke controls go-live). English-primary; ES via app translation layer +
// challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l07-big-bang";
// No embed for this arc (consolidation map: U6 Arc 7 embed = "—").
// Status Check scenario is described in text; a CMB diagram can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u6l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌌", title: "Read the Starlight",
    subtitle: "Unit 6 · Arc 7 — Stars & the Cosmos" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, the starlight came back <span style=\"font-weight:700\">stretched</span> — redshifted — and you concluded the whole universe is expanding. Run that movie backwards: if everything is flying apart now, it used to be packed together, hot and dense. That's the Big Bang. But \"one stretched rainbow\" isn't enough to bet the universe on. Today's job: find the <span style=\"font-weight:700\">other</span> fingerprints the early universe left behind — then tell the whole story, start to finish." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Here's the move scientists trust: when totally different measurements — taken with different instruments, by different people, for different reasons — all point at the <span style=\"font-weight:700\">same</span> conclusion, the conclusion gets strong. One line of evidence is a hunch. Three independent lines that agree is a <span style=\"font-weight:700\">theory</span>. The redshift gave you one. We're about to hand you two more, and they don't even know about each other." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall before we build the case — quantity over polish.",
    sections: [ { id: "recall", kind: "prompts", title: "Run the movie backwards",
      prompts: [
        { id: "q1", label: "Last arc you found distant galaxies are redshifted. In one sentence: what does that tell us the universe is doing?", rows: 2 },
        { id: "q2", label: "If the universe is expanding NOW, what must it have been like a long time ago? Make a guess.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Build the Case for the Big Bang",
    content: "You're going to act like a detective stacking up evidence. There are three <span style=\"font-weight:700\">independent pillars</span> that all point to the same early universe — hot, dense, small, and expanding ever since. Your job: name each pillar, say what it observes, and explain how it connects to that story. The case isn't closed until you can argue it with more than one pillar.\n\nThere are levels. They get harder. The rule still holds — say what the evidence <span style=\"font-weight:700\">shows</span> before you say what it means." },

  { id: id("pillars"), type: "callout", icon: "🏛️", style: "info", title: "The three pillars",
    content: "<span style=\"font-weight:700\">1. Redshift of distant galaxies</span> — space itself is expanding (your evidence from last arc).\n\n<span style=\"font-weight:700\">2. Cosmic Microwave Background (CMB)</span> — relic radiation from the moment the universe first became transparent to light. The \"afterglow\" of the Big Bang.\n\n<span style=\"font-weight:700\">3. Abundance of light elements</span> — the observed ratios of hydrogen, helium, and a trace of lithium in the oldest gas match what the early hot universe should have fused.\n\nThe power move: these were discovered separately, measured with totally different tools, and they all agree." },

  { id: id("cmb"), type: "callout", icon: "📡", style: "default", title: "Pillar 2 — the afterglow you can still detect",
    content: "About <span style=\"font-weight:700\">380,000 years after the Big Bang</span>, the universe finally cooled enough for electrons to combine with nuclei into neutral atoms. The instant that happened, light could travel freely for the first time. That ancient light has been stretching along with space for nearly <span style=\"font-weight:700\">14 billion years</span> — so much that it's no longer visible light at all. Today we detect it as faint <span style=\"font-weight:700\">microwave</span> radiation arriving from every direction in the sky, at about <span style=\"font-weight:700\">2.7 K</span> (just 2.7 degrees above absolute zero).\n\nIt's almost perfectly uniform — but the tiny hot and cold spots in it are the <span style=\"font-weight:700\">seeds</span> of every galaxy and void we see today." },

  { id: id("light-elements"), type: "callout", icon: "⚛️", style: "default", title: "Pillar 3 — the recipe from the first few minutes",
    content: "The Big Bang model predicts that in the first few minutes — while the whole universe was a hot, dense furnace — protons and neutrons fused into a <span style=\"font-weight:700\">specific mix</span> of light elements: about 75% hydrogen, 25% helium by mass, and a trace of lithium. Then it cooled too far to fuse anything else.\n\nWhen astronomers find the oldest, most untouched gas clouds — gas that never got recycled through stars — they measure ratios that match that prediction remarkably well. Stars forged the heavier elements <span style=\"font-weight:700\">later</span>, but the starting recipe came straight from the Big Bang." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your evidence stack (before you commit)",
    instructions: "Draw three columns, one per pillar (Redshift / CMB / Light Elements). Under each, jot what it OBSERVES and an arrow to the same conclusion: \"hot, dense, expanding early universe.\" Rough is fine — we'll redraw after the table.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-big-bang",
    title: "Class Challenge Board — Build the Case for the Big Bang",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who has built which part of the case.",
    levels: [
      { n: 1, name: "Name the Three Pillars", nameEs: "Nombra los Tres Pilares" },
      { n: 2, name: "Match Prediction to Observation", nameEs: "Empareja Predicción con Observación" },
      { n: 3, name: "Read the CMB", nameEs: "Lee el Fondo de Microondas" },
      { n: 4, name: "Argue with Two Pillars", nameEs: "Argumenta con Dos Pilares" },
      { n: 5, name: "Tell the Whole Cosmic History", nameEs: "Cuenta Toda la Historia Cósmica" },
    ] },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Evidence Ledger",
    intro: "Fill in the case file. <span style=\"font-weight:700\">Before you write what a pillar means, write what it OBSERVES.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "ledger", kind: "table", title: "Big Bang predictions vs. observations",
      columns: [
        { key: "pillar", label: "Pillar", placeholder: "redshift / CMB / light elements" },
        { key: "predicts", label: "What the Big Bang PREDICTS", placeholder: "more distant = recede faster…" },
        { key: "observe", label: "What we OBSERVE", placeholder: "Hubble's law; ~2.7 K glow…" },
      ], minRows: 3, addRowLabel: "Add a pillar" } ] },

  { id: id("draw-stack"), type: "sketch", title: "Draw Your Evidence Stack",
    instructions: "Redraw your three pillars now that you've filled the ledger. Show each pillar as a labeled box with its observation, and three arrows converging on one conclusion box: \"hot, dense, expanding early universe.\" Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop collecting. Now we figure out why three agreeing measurements are so much stronger than one. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"facts about space\" into an argument." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Why does the case hold up?",
      prompts: [
        { id: "q1", label: "In your own words, what IS the cosmic microwave background, and where did it come from?", rows: 3 },
        { id: "q2", label: "Why does the measured ratio of hydrogen and helium in old gas clouds support the Big Bang model?", rows: 2 },
        { id: "q3", label: "Pick the pillar you find most convincing and explain why. Then name one thing each of the OTHER two pillars adds that your pick can't show on its own.", rows: 3 },
        { id: "q4", label: "Why is a model backed by three INDEPENDENT lines of evidence stronger than one backed by a single line — even a really good single line?", rows: 2 },
        { id: "q5", label: "**Predict:** suppose a brand-new telescope measured the helium ratio in the oldest gas and it came out wildly different from the prediction. What would that do to the Big Bang model? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why \"three pillars\" beats \"one pillar\"",
    content: "Think of it like a courtroom. Suppose each independent pillar, on its own, has a 1-in-10 chance of agreeing with the Big Bang model by sheer luck.\n\nFor ONE pillar to match by luck: about $\\frac{1}{10}$.\n\nFor all THREE independent pillars to match by luck at once, you multiply the chances:\n\n$$\\frac{1}{10} \\times \\frac{1}{10} \\times \\frac{1}{10} = \\frac{1}{1000}.$$\n\nA 1-in-1000 coincidence is wildly unlikely — so when redshift, the CMB, and the light-element ratios all line up, \"lucky accident\" stops being a believable explanation. (Round teaching numbers, not the real odds — but the logic is exactly why scientists trust converging evidence.) The same idea is why one witness is a story and three independent witnesses is a case." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Tweak Our Class Model — add the Big Bang evidence",
    intro: "Same model we've grown all unit. Today we tweak it: add the three pillars — redshift, the CMB \"afterglow,\" and the light-element recipe — and show all three arrows pointing back to one hot, dense, early universe. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the early universe. These drive where we head next.",
    starters: [
      "If the universe was hot and dense, what was ___?",
      "How do we know the CMB isn't just ___?",
      "What was happening before the ___?",
      "How could anything survive ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the next conversation. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE question about the early universe",
        label: "The kind we could chase down with evidence — not just \"what was before the Big Bang.\"",
        placeholder: "If the early universe was ___, then we should observe ___?",
        hint: "*A good one connects to something we could actually measure or model.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"cosmic microwave background,\" \"relic,\" \"nucleosynthesis,\" \"abundance,\" \"independent evidence,\" \"transparent,\" \"redshift\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Point a microwave radio dish at empty space — any direction, day or night — and you pick up a faint, almost perfectly even hiss at about 2.7 K. Astronomers measure the oldest gas clouds and find them about 75% hydrogen and 25% helium by mass. And every distant galaxy's light comes in stretched toward the red. Three measurements, three instruments, one story. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain how these three observations — the 2.7 K microwave glow, the hydrogen/helium ratio, and galaxy redshift — fit together to support the idea that the universe began hot, dense, and small. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "The cosmic microwave background is best described as —",
    options: [
      "the light given off by the very first stars that ever formed.",
      "relic radiation from when the universe first became transparent to light.",
      "microwaves from distant galaxies that got redshifted into the radio range.",
      "the leftover glow produced by supernova explosions in the early universe.",
    ], correctIndex: 1,
    explanation: "The CMB is light released about 380,000 years after the Big Bang, when electrons combined with nuclei and the universe became transparent. Cosmic expansion has since stretched that light into microwaves." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why does the observed abundance of hydrogen and helium support the Big Bang model?",
    options: [
      "Hydrogen and helium are the only two elements that can form inside black holes.",
      "No other scientific theory can explain why helium exists inside of stars at all.",
      "The measured ratios in old gas match Big Bang nucleosynthesis predictions closely.",
      "Hydrogen and helium are always produced in exactly equal amounts by supernovae.",
    ], correctIndex: 2,
    explanation: "The Big Bang model predicts a specific initial mix of light elements. Observations of the oldest, most unprocessed gas match those predictions — strong evidence the model is on the right track." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "About how long after the Big Bang did the universe become transparent, releasing the light we now see as the CMB?",
    options: [
      "About 380,000 years after the Big Bang, once neutral atoms formed.",
      "About 14 billion years after the Big Bang, when galaxies first formed.",
      "Almost instantly, in the first second after the Big Bang took place.",
      "About 4.6 billion years after, at the same time the Sun was forming.",
    ], correctIndex: 0,
    explanation: "Around 380,000 years after the Big Bang, the universe cooled enough for electrons to combine with nuclei into neutral atoms. Light could then travel freely — that released light is the CMB." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "What is the approximate temperature of the cosmic microwave background today?",
    options: [
      "About 5800 K, the same as the surface temperature of the Sun.",
      "About 0 K, exactly absolute zero, because space is completely empty.",
      "About 380,000 K, matching the age of the universe when it formed.",
      "About 2.7 K, only a few degrees above absolute zero everywhere.",
    ], correctIndex: 3,
    explanation: "Cosmic expansion has stretched the CMB's wavelength enormously, cooling it to about 2.7 K — only 2.7 degrees above absolute zero — and it reads nearly the same from every direction." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Scientists call the Big Bang a well-supported theory, not just a guess, mainly because —",
    options: [
      "three independent lines of evidence all point to the same early universe.",
      "a single very famous astronomer announced it and others chose to agree.",
      "it is the oldest idea about the universe and has never once been questioned.",
      "telescopes have directly recorded a video of the Big Bang as it happened.",
    ], correctIndex: 0,
    explanation: "Redshift, the CMB, and light-element abundance were each discovered separately, measured with different tools, and all converge on a hot, dense, expanding early universe. Independent agreement is what makes a theory strong." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which of these is NOT one of the three independent pillars of evidence for the Big Bang?",
    options: [
      "The redshift of distant galaxies, showing that space is expanding.",
      "The seasonal change in star brightness as Earth orbits the Sun.",
      "The cosmic microwave background, a faint uniform glow from all directions.",
      "The abundance of light elements matching nucleosynthesis predictions.",
    ], correctIndex: 1,
    explanation: "The three pillars are galaxy redshift, the CMB, and the light-element abundance. Seasonal brightness changes (stellar parallax/variation) measure distances to nearby stars — not evidence for the Big Bang." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "According to the Big Bang model, where did the heavier elements (like the carbon and iron in your body) come from?",
    options: [
      "They were all created in the first few minutes of the Big Bang itself.",
      "They have always existed and were never created at any point in time.",
      "They were forged later inside stars, after the Big Bang made the light elements.",
      "They formed inside the cosmic microwave background as it cooled and spread out.",
    ], correctIndex: 2,
    explanation: "The Big Bang produced mostly hydrogen, helium, and a trace of lithium. Heavier elements were fused later inside stars (and scattered by their deaths) — which is why the early gas clouds show only the light-element recipe." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "The CMB is almost perfectly uniform, but it has tiny hot and cold spots. What do those tiny variations represent?",
    options: [
      "Errors in the radio telescopes that astronomers have not yet corrected for.",
      "Distant galaxies whose light happens to be passing through the dish right now.",
      "Places where the Big Bang theory breaks down and cannot explain the data at all.",
      "The seeds of the large-scale structure — the galaxies and voids we see today.",
    ], correctIndex: 3,
    explanation: "The tiny temperature variations in the CMB map out slightly denser and emptier regions in the early universe. Those denser seeds grew under gravity into today's galaxies, clusters, and the voids between them." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch three labeled arrows — Redshift, CMB, and Light Elements — all pointing into one box that reads \"hot, dense, expanding early universe.\" Next to each arrow, write the one observation that pillar contributes. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the early universe that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read the starlight today — and it told you the whole story: a universe that began hot and dense, cooled until light broke free, fused the first light elements, and has been expanding ever since. Three separate fingerprints, one case. Next class you put that story into your own words. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Evidence for the Big Bang",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6107,
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
