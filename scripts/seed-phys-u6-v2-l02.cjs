// seed-phys-u6-v2-l02.cjs
// U6 v2 — Arc 2: "Decoding Starlight" (OpenSciEd-spine / Rober-engine).
// Merges v1 L03 (What Starlight Tells Us) + L04 (How Do Stars Change?) into one
// challenge-arc. Physics: absorption/emission spectra = element fingerprints; match a
// star's spectrum to lab reference spectra to ID its elements; read a Hertzsprung-Russell
// (H-R) diagram (temperature vs luminosity); classify stars (main sequence / giant /
// white dwarf); connect H-R position to mass + temperature. Through-line: "Read the
// Starlight" — the light a star sends us is a coded message; decode it to learn what the
// star is made of and where it is in its life.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as Arc 1. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc2.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l02-starlight-decode";
// Two scored embeds from the tool dump, both from u6-arc2.md. The spectra explorer in
// identify mode (match lines → elements) and the H-R diagram tool (classify stars).
const SPECTRA = "https://paps-tools.web.app/spectra-redshift-explorer.html?mode=identify";
const HRDIAG = "https://paps-tools.web.app/hr-diagram-tool.html";

let _n = 0;
const id = (slug) => `v2u6l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌈", title: "Decoding Starlight",
    subtitle: "Unit 6 · Arc 2 — Stars & the Cosmos" },

  // ── CONNECT: recall Arc 1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, a <span style=\"font-weight:700\">\"new star\"</span> showed up where there wasn't one, and we decided the only thing reaching us from it is its <span style=\"font-weight:700\">light</span>. So light is the messenger. Today we crack the message open: a star is trillions of miles away and we will figure out <span style=\"font-weight:700\">what it's made of</span> and <span style=\"font-weight:700\">what kind of star it is</span> — without ever leaving this room. We read the starlight." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Hold up your phone flashlight. White, right? But run that white light through a prism and it splits into a rainbow — every color is hiding in there. Now here's the wild part: when starlight does the same thing, the rainbow has thin <span style=\"font-weight:700\">dark lines</span> missing from it. Specific colors, gone. Those gaps aren't random. They're a code. Each element steals its own exact set of colors on the way out, and that pattern is as unique as a fingerprint. Read the gaps, name the element." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go decode some starlight.",
    sections: [ { id: "recall", kind: "prompts", title: "What can light carry?",
      prompts: [
        { id: "q1", label: "Arc 1 idea: the ONLY thing reaching us from a far-off star is its light. Name one thing you think that light might be able to tell us about the star.", rows: 2 },
        { id: "q2", label: "If two stars look the same brightness from Earth but one is much farther away, what must be true about the far one? (Take a guess — we test it today.)", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Decode the Starlight",
    content: "You get a star's spectrum — its rainbow with dark lines cut out of it. Your job: <span style=\"font-weight:700\">match those lines to the lab reference spectra</span> to name the elements in the star, then place the star on the <span style=\"font-weight:700\">H-R diagram</span> to figure out what kind of star it is and where it sits in its life. You're not done until you can say what it's made of AND what stage it's in — all from the light.\n\nThere are levels. They get harder. Same rule as always — write down what you actually see in the lines before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "How the code works",
    content: "The system is the <span style=\"font-weight:700\">star plus its atmosphere</span>. Light from the star's hot interior pours outward and passes through the cooler gas on the outside. Atoms in that outer gas absorb light at their own specific wavelengths — so those exact colors go missing, leaving dark <span style=\"font-weight:700\">absorption lines</span> in the rainbow.\n\nIn 1814, Joseph Fraunhofer noticed the Sun's rainbow had thin dark lines missing from it. Turned out those lines were a code: every element — hydrogen, helium, sodium, calcium — absorbs its own unique pattern. Match the star's pattern to a known element's pattern in the lab, and you've identified what the star is made of, from light alone." },

  { id: id("ref-table"), type: "mission_log", title: "Mission Log — Reference Lines (keep this open)",
    intro: "Simplified lab reference patterns — use these to match the star's lines. Jot which element each star sample matches as you work the explorer.",
    sections: [ { id: "ref", kind: "table", title: "Element fingerprints",
      columns: [
        { key: "sample", label: "Star sample", width: "90px", placeholder: "A" },
        { key: "lines", label: "Lines you see (color/where)", placeholder: "dark line in blue/violet…" },
        { key: "match", label: "Element it matches", placeholder: "H / He / Na / Ca" },
      ], minRows: 3, addRowLabel: "Add a sample" } ] },

  { id: id("setup2"), type: "callout", icon: "📋", style: "default", title: "The four fingerprints you'll match",
    content: "<span style=\"font-weight:700\">Hydrogen (H):</span> strong lines in visible blue/violet — the famous Balmer series.\n<span style=\"font-weight:700\">Helium (He):</span> lines slightly different from hydrogen; common in hot stars.\n<span style=\"font-weight:700\">Sodium (Na):</span> a close double line in the yellow/orange.\n<span style=\"font-weight:700\">Calcium (Ca):</span> strong lines toward the violet/ultraviolet.\n\nReal spectra are messier than this, but these patterns are enough to name a star's main atmospheric elements." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the lines (before the tool)",
    instructions: "Draw a rainbow band. Now sketch where you THINK hydrogen's dark lines would fall, and where sodium's double line would fall. Wrong is fine — we sketch first so we can compare to the real reference spectra after.",
    canvasHeight: 340 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-starlight-decode",
    title: "Class Challenge Board — Decode the Starlight",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's decoded what.",
    levels: [
      { n: 1, name: "Read the Rainbow", nameEs: "Lee el Arcoíris" },
      { n: 2, name: "Match One Element", nameEs: "Empareja Un Elemento" },
      { n: 3, name: "ID the Whole Spectrum", nameEs: "Identifica el Espectro Completo" },
      { n: 4, name: "Place It on the H-R", nameEs: "Ubícala en el H-R" },
      { n: 5, name: "Name the Star's Stage", nameEs: "Nombra la Etapa de la Estrella" },
    ] },

  { id: id("embed-spectra"), type: "embed", url: SPECTRA, scored: true, weight: 5 },

  { id: id("ml-spectra"), type: "mission_log", title: "Mission Log — Spectrum Decode Log",
    intro: "As you work the explorer: <span style=\"font-weight:700\">before you name an element, write which lines you matched and where.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "decode", kind: "table", title: "Decoding each star",
      columns: [
        { key: "star", label: "Star", width: "70px", placeholder: "Star 1" },
        { key: "lines", label: "Lines I matched (where)", placeholder: "blue/violet pair…" },
        { key: "elements", label: "Element(s) present", placeholder: "H, He…" },
        { key: "how", label: "How I knew", placeholder: "matched the lab pattern" },
      ], minRows: 3, addRowLabel: "Add a star" } ] },

  { id: id("hr-bridge"), type: "callout", icon: "📈", style: "info", title: "Now: what KIND of star is it?",
    content: "Knowing what a star is made of is half the message. The other half is its <span style=\"font-weight:700\">temperature</span> and how much light it pumps out — its <span style=\"font-weight:700\">luminosity</span>. Plot temperature against luminosity for thousands of stars and a pattern jumps out: most of them line up along one diagonal band. That graph is the <span style=\"font-weight:700\">Hertzsprung-Russell (H-R) diagram</span>, and a star's spot on it tells you what stage of life it's in.\n\nOne weird thing up front: the temperature axis runs <span style=\"font-weight:700\">backwards</span> — hot on the LEFT, cool on the right. Don't let it trip you." },

  { id: id("hr-table"), type: "mission_log", title: "Mission Log — H-R Map (keep open while you plot)",
    intro: "Four regions of the H-R diagram and what each one means. Reference it as you place stars in the tool.",
    sections: [ { id: "hrref", kind: "table", title: "What position tells you",
      columns: [
        { key: "region", label: "Region", placeholder: "upper-left main sequence" },
        { key: "temp", label: "Temperature", width: "120px", placeholder: "hot / cool" },
        { key: "lum", label: "Luminosity", width: "120px", placeholder: "bright / dim" },
        { key: "stage", label: "Mass / stage hint", placeholder: "massive, short-lived…" },
      ], minRows: 4, addRowLabel: "Add a region" } ] },

  { id: id("embed-hr"), type: "embed", url: HRDIAG, scored: true, weight: 5 },

  { id: id("draw-hr"), type: "sketch", title: "Draw the H-R Diagram",
    instructions: "Sketch the H-R diagram from memory: temperature on the bottom (HOT on the left, cool on the right), luminosity up the side (dim to bright). Draw the diagonal main-sequence band. Mark where giants sit (cool but bright, upper right) and where white dwarfs sit (hot but dim, lower left). Show your current thinking — neat doesn't matter.",
    canvasHeight: 360 },

  { id: id("ml-classify"), type: "mission_log", title: "Mission Log — Classify Your Stars",
    intro: "For each star you placed, record where it landed and what that means about it. One row per star.",
    sections: [ { id: "classify", kind: "table", title: "Star classification",
      columns: [
        { key: "star", label: "Star", width: "70px", placeholder: "Star 1" },
        { key: "where", label: "Where on the H-R", placeholder: "main seq / giant / white dwarf" },
        { key: "props", label: "So it is…", placeholder: "hot + bright + massive…" },
      ], minRows: 3, addRowLabel: "Add a star" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause and Process — pencils up",
    content: "Stop decoding. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we matched some lines\" into astronomy." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the starlight just tell us?",
      prompts: [
        { id: "q1", label: "How do astronomers use a star's spectrum to figure out what the star is made of? Walk through it: dark lines → reference spectra → element.", rows: 3 },
        { id: "q2", label: "Why can a spectrum identify elements in a star that is several light-years away, when we can never collect a sample of it?", rows: 2 },
        { id: "q3", label: "A star's spectrum shows dark lines exactly where hydrogen absorbs light. What can you safely conclude — and what can you NOT conclude — from that?", rows: 3 },
        { id: "q4", label: "On the H-R diagram, why is the main band called a \"sequence\" instead of just a random scatter of dots? What relationship lines the stars up?", rows: 2 },
        { id: "q5", label: "A red giant and a white dwarf are both old, dying stars, but they sit in totally different corners of the H-R diagram. What does that tell you about how their temperature and luminosity differ?", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — reading one star's spot",
    content: "A star plots in the <span style=\"font-weight:700\">upper-left</span> corner of the H-R diagram. Decode it step by step.\n\nStep 1 — temperature: left side means HOT (remember, the temp axis runs backwards).\n\nStep 2 — luminosity: top means very bright — it pumps out a lot of light.\n\nStep 3 — what that implies: on the main sequence, the hot-and-bright stars are also the <span style=\"font-weight:700\">most massive</span>, and massive stars burn through their fuel fast — so they are short-lived.\n\nResult: upper-left = hot, bright, high-mass, short-lived main-sequence star. Compare: our Sun sits roughly in the middle of the main sequence — medium temperature, medium brightness, medium mass. Position on the diagram is a read-out of a star's whole story." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Tweak Our Class Model — what light tells us",
    intro: "Same model we started in Arc 1. Today we tweak it: show the star's light carrying a <span style=\"font-weight:700\">coded message</span> out to us, with the dark absorption lines naming the <span style=\"font-weight:700\">elements</span>, and add that a star's temperature and brightness pin it to a spot on the H-R diagram. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about reading starlight. These drive where the unit heads next.",
    starters: [
      "If the dark lines name the elements, what makes the star ___?",
      "Why does a hotter star also tend to be ___?",
      "What would the spectrum of the \"new star\" from Arc 1 look like if ___?",
      "How do we know the H-R pattern holds for stars we ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could chase down with data or a tool in here — not just look up.",
        placeholder: "If a star's spectrum showed ___, could we tell whether ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"spectrum,\" \"absorption,\" \"emission,\" \"luminosity,\" \"main sequence,\" \"giant,\" \"white dwarf\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "An astronomer points a telescope at a faint star. She splits its light into a rainbow and sees dark lines cut out of it. Then she plots the star by its temperature and brightness and finds it lands in the lower-left corner of the H-R diagram. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what the dark lines in the star's rainbow tell the astronomer, and what its lower-left spot on the H-R diagram tells her about the kind of star it is. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A star's spectrum shows dark lines at the exact wavelengths where hydrogen absorbs light. What can you conclude?",
    options: [
      "The star is actually made of liquid water in its outer layers.",
      "The dark lines come only from Earth's atmosphere, not the star.",
      "The star contains hydrogen in its outer atmosphere.",
      "The star contains hydrogen and nothing else at all.",
    ], correctIndex: 2,
    explanation: "Matching absorption lines mean the element is present in the star's outer atmosphere. They do not mean the star is made only of that element, and they are not caused by Earth's atmosphere alone." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why can spectra tell us what elements are in a star, even though the star is several light-years away?",
    options: [
      "Each element has a unique pattern of spectral lines.",
      "Telescopes can physically collect gas samples from stars.",
      "Each element emits only one single color of light.",
      "Every star in the sky has exactly the same composition.",
    ], correctIndex: 0,
    explanation: "Every element absorbs or emits light at a unique set of wavelengths. That pattern acts like a fingerprint we can match from Earth — no sample needed." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "What is the difference between an emission spectrum and an absorption spectrum?",
    options: [
      "Emission spectra are only blue while absorption spectra are only red.",
      "Emission shows bright lines from hot gas; absorption shows dark lines in a rainbow.",
      "Emission spectra come from Earth and absorption spectra come from space.",
      "There is no real difference; the two terms mean exactly the same thing.",
    ], correctIndex: 1,
    explanation: "A hot gas produces bright emission lines at specific wavelengths. A continuous rainbow with dark gaps, where cooler atoms absorbed those wavelengths, is an absorption spectrum." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "On the H-R diagram, what do the two axes show?",
    options: [
      "Distance from Earth on the bottom and age along the side.",
      "The order stars were born on the bottom and mass along the side.",
      "Speed across the sky on the bottom and size along the side.",
      "Temperature on the bottom and luminosity along the side.",
    ], correctIndex: 3,
    explanation: "The H-R diagram plots temperature horizontally (hot on the left, cool on the right) against luminosity vertically (dim to bright). It is a classification map, not a map of where stars sit in space." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A star is plotted in the upper-left corner of the H-R diagram. Which description fits best?",
    options: [
      "Hot, bright, and high-mass.",
      "Cool, dim, and low-mass.",
      "Hot, bright, and low-mass.",
      "Cool, bright, and high-mass.",
    ], correctIndex: 0,
    explanation: "Upper-left means hot (left side) and very luminous (top). On the main sequence, hot-and-bright stars are also the most massive." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Why is the main sequence called a \"sequence\" rather than just a random scatter of stars?",
    options: [
      "Because all the stars in it move along it at the same speed.",
      "Because the stars are simply lined up by their distance from Earth.",
      "Because stars follow a clear pattern linking temperature, luminosity, and mass.",
      "Because it lists the exact order in which the stars were born.",
    ], correctIndex: 2,
    explanation: "The main sequence shows an organized relationship: hotter stars are also more luminous and more massive. It is a pattern, not a random scatter." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A red giant sits in the upper right of the H-R diagram and a white dwarf sits in the lower left. What does that tell you about them?",
    options: [
      "They are identical in temperature but differ only in their distance.",
      "The red giant is cool but very bright; the white dwarf is hot but dim.",
      "The red giant is hot and dim; the white dwarf is cool and very bright.",
      "Both are equally hot and equally bright but made of different elements.",
    ], correctIndex: 1,
    explanation: "Upper right means cool (right) yet very luminous (top) — a red giant. Lower left means hot (left) yet dim (bottom) — a white dwarf. Their positions encode opposite temperature-and-brightness combinations." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Roughly where on the H-R diagram does our Sun sit?",
    options: [
      "Far in the upper-left corner, among the hottest, brightest stars.",
      "Down in the lower-left corner, with the hot but dim white dwarfs.",
      "Off in the upper-right corner, among the cool but luminous giants.",
      "About in the middle of the main sequence, medium in both ways.",
    ], correctIndex: 3,
    explanation: "The Sun sits roughly in the middle of the main-sequence band — medium temperature, medium luminosity, and medium mass." },

  { id: id("sc-draw"), type: "sketch", title: "Jot and Draw",
    instructions: "Sketch a rainbow with a few dark absorption lines, and next to it sketch a simple H-R diagram with one star plotted on it. Draw an arrow from the spectrum to the word 'elements' and an arrow from the H-R spot to the words 'kind of star.' Show how starlight tells us BOTH things. Neat doesn't matter — show your current thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing the starlight told us that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read the starlight today — pulled the elements right out of the dark lines, then placed stars on the H-R diagram to name what kind they are. All of it from light that left those stars years ago. Next class we ask the bigger question: what makes a star shine in the first place? See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Decoding Starlight",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6102,
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
