// seed-phys-u6-v2-l05.cjs
// U6 v2 — Arc 5: "Read the Starlight" — MID-UNIT MASTERY (OpenSciEd-spine / Rober-engine).
// Repackages v1 L09 (Mid-Unit Mastery Check) into the v2 challenge-arc. This arc is
// SUMMATIVE: the Status Check IS the assessment. Students pull together the whole first
// half of the unit — spectra (element fingerprints), the H-R diagram, fusion as the source
// of starlight ($E=mc^2$), the mass-decides-fate life cycle, and nucleosynthesis (where the
// elements come from). Through-line: "Read the Starlight" — the light is the message; today
// you prove you can read it.
//
// Source dump (drafts/.../_v1-source-u6/u6-arc5.md) is short by design — the assessment is
// fleshed from the whole first half of the unit (u6-arc1..4.md, already sourced/audited).
// No embed this arc (mastery). Light challenge_tracker (review-your-own-mastery, not a game).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using safeSeed.
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). gradesReleased:true (summative — students see the check same day).
// English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l05-mastery";

let _n = 0;
const id = (slug) => `v2u6l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⭐", title: "Mid-Unit Mastery: How Stars Work",
    subtitle: "Unit 6 · Arc 5 — Stars & the Cosmos" },

  // ── CONNECT: recall the first half → today's job ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "We're at the halfway point. A \"new star\" flared up, faded, and left a glowing cloud — and over the last few arcs you cracked the code on what stars actually are. You learned to <span style=\"font-weight:700\">read starlight</span>: spectra tell you what's in a star, the H-R diagram tells you its stage, fusion tells you why it shines, and supernovae tell you where the gold in your phone came from. Today you put it all in one place and show you can read the whole message. No new content — just proof you've got it." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Quick gut-check before we start: a star is trillions of miles away. We will never touch one. Yet you can now name what it's made of, how hot it is, what stage of life it's in, why it glows, and what it'll leave behind when it dies — <span style=\"font-weight:700\">all from its light</span>. That's wild, and it's exactly what today's mastery check asks you to show. This one counts, so slow down and reason it out — I'd rather see your thinking than a lucky guess." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Dump everything the first half of this unit taught you about reading starlight. Quantity over polish — this primes your brain for the check.",
    sections: [ { id: "recall", kind: "prompts", title: "What can starlight tell us?",
      prompts: [
        { id: "q1", label: "Name ONE thing a star's spectrum tells you, and ONE thing the H-R diagram tells you.", rows: 2 },
        { id: "q2", label: "In one sentence: why does a star shine? (Use the word fusion.)", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge (here = the mastery itself) ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Starlight",
    content: "This arc's challenge is the assessment itself. Your job: in one coherent explanation, answer the unit's driving question for everything we've studied so far — <span style=\"font-weight:700\">why do stars shine, how do they change over time, and where do the elements in our world come from?</span> Use the model you've been building. Cite real evidence: spectral fingerprints, the fusion reaction, the H-R diagram pattern, life-cycle stages, and nucleosynthesis. Make your thinking visible." },

  { id: id("setup"), type: "callout", icon: "🔭", style: "info", title: "The five ideas you're connecting",
    content: "Everything in the first half of this unit clips together. Before the check, get the chain straight in your head:\n\n<span style=\"font-weight:700\">1. Spectra</span> — each element absorbs light at its own wavelengths, leaving dark lines like a fingerprint, so we can read a star's composition from light alone.\n<span style=\"font-weight:700\">2. H-R diagram</span> — plotting temperature vs. luminosity sorts stars into main sequence, giants, and white dwarfs, revealing a star's stage of life.\n<span style=\"font-weight:700\">3. Fusion</span> — in the core, four hydrogen nuclei fuse into one helium nucleus; the tiny missing mass becomes huge energy via $E = mc^2$. That's why stars shine.\n<span style=\"font-weight:700\">4. Life cycle</span> — every star starts in a nebula, but <span style=\"font-weight:700\">mass decides its fate</span>: low- and medium-mass stars end as white dwarfs; high-mass stars explode as supernovae.\n<span style=\"font-weight:700\">5. Nucleosynthesis</span> — the Big Bang made hydrogen and helium; stars fuse up to iron; supernovae forge everything heavier. The atoms in your body were built in stars." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your map of the first half",
    instructions: "Before the check, sketch a single diagram that links all five ideas: starlight → spectrum (composition) + H-R position (stage) → fusion (why it shines) → mass-dependent life cycle → elements scattered back into space. Arrows and labels are enough. This is your study map — wrong is fine, we're organizing your thinking.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-mastery",
    title: "Mastery Board — Read the Starlight",
    intro: "This board is your self-check, not a game. As you finish the assessment, mark each idea you can now explain on your own. Be honest — the ones you can't mark are exactly what to review.",
    levels: [
      { n: 1, name: "Read a Spectrum", nameEs: "Leer un Espectro" },
      { n: 2, name: "Read the H-R Diagram", nameEs: "Leer el Diagrama H-R" },
      { n: 3, name: "Explain Why Stars Shine", nameEs: "Explicar Por Qué Brillan las Estrellas" },
      { n: 4, name: "Trace a Star's Life", nameEs: "Rastrear la Vida de una Estrella" },
      { n: 5, name: "Find Where Elements Came From", nameEs: "Encontrar el Origen de los Elementos" },
    ] },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Evidence Log",
    intro: "As you reason through the check, log the evidence you're leaning on. <span style=\"font-weight:700\">Documented reasoning = a scientist move = points.</span> One row per idea.",
    sections: [ { id: "tracelog", kind: "table", title: "My evidence for each idea",
      columns: [
        { key: "idea", label: "Big idea", placeholder: "spectra, H-R, fusion…" },
        { key: "evidence", label: "Evidence I'd cite", placeholder: "dark lines, position, mass difference…" },
        { key: "claim", label: "What it lets me conclude", placeholder: "composition, stage, why it shines…" },
      ], minRows: 5, addRowLabel: "Add an idea" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Star's Story",
    instructions: "Redraw your map now that you've worked through the ideas. Show one star's full story: nebula → main sequence (fusing hydrogen, shining via $E=mc^2$) → its mass-dependent end → elements blown back into space. Label each stage. Neat doesn't matter; complete thinking does.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — Connect Small to Large",
    intro: "The whole unit is one idea at two scales. Fill this in to connect the tiny (nuclei) to the huge (galaxies, and you).",
    sections: [ { id: "account", kind: "table", title: "Scale ladder",
      columns: [
        { key: "scale", label: "Scale", placeholder: "nucleus / star / galaxy / body" },
        { key: "what", label: "What's happening there", placeholder: "fusion, life cycle, recycling…" },
        { key: "link", label: "How it connects to the next scale up", placeholder: "energy out, elements out…" },
      ], minRows: 4, addRowLabel: "Add a scale" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Before the graded check, take a breath and organize. Write first, then we lock it in. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns five separate facts into one explanation you can defend." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Tie it together before the check",
      prompts: [
        { id: "q1", label: "A star's spectrum shows dark lines exactly where hydrogen absorbs light. What can you conclude — and what can you NOT conclude — from that?", rows: 3 },
        { id: "q2", label: "Two dying stars: one is a red giant (upper right of the H-R diagram), one is a white dwarf (lower left). What does each position tell you about that star's temperature and luminosity?", rows: 3 },
        { id: "q3", label: "Explain, in your own words, how fusing four hydrogen nuclei into one helium nucleus can release energy. Use mass and $E = mc^2$.", rows: 3 },
        { id: "q4", label: "The Sun is a low-to-medium-mass star. Predict its final state and explain why it will NOT become a black hole.", rows: 2 },
        { id: "q5", label: "Carl Sagan said \"we are made of star stuff.\" Name two elements in your body and where each was forged (Big Bang, fusion in a star, or supernova).", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why a tiny mass loss makes so much light",
    content: "Fusion's secret is $E = mc^2$ — mass itself is a form of energy. Because the speed of light is so large, $c^2 = 9 \\times 10^{16}\\,\\text{m}^2/\\text{s}^2$, even a microscopic mass loss releases enormous energy.\n\nSuppose one fusion event in the Sun converts a mass of just $m = 5 \\times 10^{-29}\\,\\text{kg}$ into energy. Then:\n\n$$E = mc^2 = (5 \\times 10^{-29}\\,\\text{kg})(9 \\times 10^{16}\\,\\text{m}^2/\\text{s}^2) \\approx 4.5 \\times 10^{-12}\\,\\text{J}$$\n\nThat's a tiny number for one event — but the Sun runs this reaction an unfathomable number of times every second, which is why it has shined for billions of years while losing only a small fraction of its mass. The net reaction: four hydrogen nuclei fuse into one helium nucleus, and the helium nucleus has slightly <span style=\"font-weight:700\">less</span> mass than the four hydrogens it came from. That missing mass is the light." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Tweak Our Class Model — the half-unit picture",
    intro: "Same model we've grown all unit. Today we lock in the half-unit version: a star reads out its composition (spectrum) and stage (H-R), shines by fusion, lives and dies by its mass, and seeds the universe with elements. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have heading into the second half of the unit. These drive where we go next (redshift, the expanding universe, the Big Bang).",
    starters: [
      "If light is a messenger, what else can it tell us about ___?",
      "How do we know how far away a star is, if ___?",
      "Where did the very first stars come from if ___?",
      "If supernovae make heavy elements, how did ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the second half. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE question for the second half",
        label: "Something starlight might still be able to answer that we haven't cracked yet.",
        placeholder: "Could light also tell us ___?",
        hint: "*A good one points at something we could actually investigate next.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this half-unit — \"spectrum,\" \"luminosity,\" \"main sequence,\" \"fusion,\" \"nebula,\" \"supernova,\" \"nucleosynthesis\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (THIS IS THE ASSESSMENT — mastery-heavy) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "This one counts. It's the summative check for the first half of Unit 6 — reason it out and show your thinking." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "An astronomer points a telescope at a star several light-years away. They split its light into a spectrum, plot it on an H-R diagram, and watch it over years. From that light alone, they figure out what it's made of, how hot it is, why it shines, and how it will eventually die. You've now learned to do the same thing. Use everything from the first half of the unit for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Write one explanation that answers the unit's driving question for everything we've studied so far: Why do stars shine, how do they change over time, and where do the elements in our world come from?</span>\n\n<span style=\"font-weight:700\">CLAIM:</span> In one or two sentences, state the big idea that connects all three questions.\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite evidence from this unit — spectral fingerprints, the fusion reaction, the H-R diagram pattern, stellar life-cycle stages, and the origin of elements.\n<span style=\"font-weight:700\">REASONING:</span> Explain how each piece of evidence supports your claim. Connect the small scale (nuclei fusing) to the large scale (stars, galaxies, and the atoms in our bodies)." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A star's spectrum shows dark lines at exactly the wavelengths where hydrogen absorbs light. What can you conclude?",
    options: [
      "The star contains hydrogen somewhere in its outer atmosphere.",
      "The star is made of nothing but pure hydrogen gas and helium.",
      "The dark lines were created entirely by Earth's own atmosphere.",
      "The star is far too cold for any fusion to be happening inside.",
    ], correctIndex: 0,
    explanation: "Matching absorption lines mean that element is present in the star's outer atmosphere. They don't prove the star is made of only that element, they aren't caused by Earth's atmosphere, and they say nothing about its temperature." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why can a spectrum tell us what elements are in a star that is several light-years away?",
    options: [
      "Because every known star turns out to have the same composition.",
      "Because telescopes can physically collect gas samples from stars.",
      "Because each element has a unique pattern of spectral lines.",
      "Because each element emits exactly one single color of light.",
    ], correctIndex: 2,
    explanation: "Every element absorbs or emits light at a unique set of wavelengths — a fingerprint we can match from Earth without ever visiting the star." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A star is plotted in the upper-left corner of the H-R diagram. Which description fits it best?",
    options: [
      "Cool, dim, and low in mass, like a faint red dwarf star.",
      "Cool, very bright, and large, like an evolved red giant star.",
      "Hot, dim, and small, like the cooling core of a dead star.",
      "Hot, very bright, and high in mass, like a massive main-sequence star.",
    ], correctIndex: 3,
    explanation: "On the H-R diagram, left means hot and up means luminous. The upper-left corner holds hot, bright, massive main-sequence stars." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "In the Sun's core, four hydrogen nuclei fuse into one helium nucleus. Why does this release energy?",
    options: [
      "The reaction builds brand-new elements that are heavier than iron.",
      "The helium nucleus has slightly less mass than the four hydrogens.",
      "The helium nucleus has slightly more mass than the four hydrogens.",
      "The number of hydrogen nuclei doubles during each fusion event.",
    ], correctIndex: 1,
    explanation: "Fusion releases energy because the product nucleus has slightly less mass than the reactants. That missing mass becomes energy via $E = mc^2$." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Which nuclear process is the main source of energy in an ordinary star like the Sun?",
    options: [
      "Radioactive decay of heavy iron nuclei deep inside the core.",
      "Chemical burning of hydrogen gas, the same as a normal flame.",
      "Nuclear fission, splitting uranium the way a power plant does.",
      "Nuclear fusion, joining hydrogen into helium in the core.",
    ], correctIndex: 3,
    explanation: "Ordinary stars shine by fusing hydrogen into helium in their cores. Chemical burning is far too weak, and the Sun runs on fusion, not fission or decay." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which factor has the biggest influence on how a star evolves and what remnant it leaves behind?",
    options: [
      "The star's color when we happen to look at it from Earth.",
      "The star's mass, set when it first formed from its nebula.",
      "The star's distance from Earth measured in light-years.",
      "The star's age counted in ordinary human calendar years.",
    ], correctIndex: 1,
    explanation: "Mass determines how long a star fuses, how hot it burns, and whether it ends as a white dwarf, neutron star, or black hole." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A \"new star\" suddenly appears, shines for weeks, then fades — leaving behind a glowing, expanding cloud of gas. Which life-cycle event best explains this?",
    options: [
      "A high-mass star exploding as a supernova at the end of its life.",
      "A low-mass star quietly settling down to become a white dwarf.",
      "A cool red giant slowly contracting back into a cold dark nebula.",
      "A young protostar joining the main sequence for the first time.",
    ], correctIndex: 0,
    explanation: "A sudden brightening followed by a fading remnant cloud is the signature of a supernova — the explosive death of a high-mass star." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Most of the calcium in your bones and the iron in your blood was most likely produced by —",
    options: [
      "the Big Bang, in the first few minutes, along with hydrogen and helium.",
      "fusion going on inside the Sun's core during its main-sequence life today.",
      "radioactive decay of uranium buried deep within the Earth's rocky crust.",
      "nuclear processes in the supernova explosions of massive stars.",
    ], correctIndex: 3,
    explanation: "Elements heavier than helium aren't made by the Big Bang. Calcium and iron are forged inside massive stars and scattered by supernovae, later becoming part of new solar systems like ours." },

  { id: id("sc-mc9"), type: "question", questionType: "multiple_choice",
    prompt: "Why can't a normal star build elements much heavier than iron by fusion?",
    options: [
      "Gravity becomes too weak to squeeze heavy nuclei close together.",
      "Iron fusion releases so much energy it would blow the star apart.",
      "Fusing nuclei heavier than iron takes energy instead of releasing it.",
      "Stars simply run out of protons before they ever reach iron.",
    ], correctIndex: 2,
    explanation: "Iron has the most stable nucleus. Fusing lighter elements releases energy, but building elements past iron requires energy input, so a star can no longer power itself that way — fusion stops at iron." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the life of one high-mass star from start to finish: nebula → protostar → main sequence (fusing hydrogen, shining) → red supergiant → supernova → remnant + elements blasted into space. Label each stage and note where the heavy elements get made. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel about the first half of this unit?</span> Tap your stars — there's no wrong answer. This tells Mr. McCarthy what to review before we head into the second half." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The idea I'm most confident I can now explain on my own:", rows: 1 },
        { id: "surprise", label: "The one idea I still want to review before the second half, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Halfway done — and look how far you've come. You can read a star's composition, its stage, why it shines, and how it'll die, all from a beam of old light. You even know why the atoms in your hand are older than the Earth. Next half, we use starlight to measure the whole universe. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Mid-Unit Mastery: How Stars Work",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6105,
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
