// seed-phys-u6-v2-l01.cjs
// U6 v2 — Arc 1 (ANCHOR): "A Star Where There Wasn't One" (OpenSciEd-spine / Rober-engine).
// Merges v1 L01 (A Star Where There Wasn't One) + L02 (Light as a Messenger) into one
// challenge-arc. Anchor: historical records of "new stars" (Tycho 1572; SN 1006 seen in
// daylight) that flared and faded, leaving expanding gas clouds. Big idea: light is the
// messenger — it carries information across space AND time; the EM spectrum (c = λf) sorts
// that light by wavelength/frequency, and each slice tells us something. Build the initial
// model + Driving Question Board. Through-line: "Read the Starlight."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc1.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via app translation layer + challenge nameEs.
// No embed in this arc.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l01-new-star";

let _n = 0;
const id = (slug) => `v2u6l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌟", title: "A Star Where There Wasn't One",
    subtitle: "Unit 6 · Arc 1 — Stars & the Cosmos" },

  // ── CONNECT: launch the anchor → today's question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "New unit, new mystery. One night, a star appears in the sky where there was <span style=\"font-weight:700\">no star before</span> — bright enough that people in the year 1006 could read by it. Months later it fades. Where did it come from? Where did it go? And how could we possibly know, when we can't fly out there to check? Today we start the only way we can: we <span style=\"font-weight:700\">read the starlight</span>." },

  { id: id("anchor"), type: "callout", icon: "🔭", style: "default", title: "",
    content: "For centuries, astronomers recorded <span style=\"font-weight:700\">\"new stars\"</span> — bright points of light that showed up where none had been, then slowly faded. In 1572, Tycho Brahe watched one stay visible for months. About five centuries earlier, Chinese and Japanese astronomers recorded another so bright it could be seen in <span style=\"font-weight:700\">daylight</span>.\n\nThey had no idea what they were looking at. Today we call these events <span style=\"font-weight:700\">supernovae</span> — and where a \"new star\" once sat, modern telescopes find a glowing cloud of gas, still expanding. Something dramatic happened there. This arc, we figure out how to investigate it without ever leaving the room." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Notice & Wonder",
    intro: "Look at the evidence: old drawings show a single bright point; modern images of the same spot show a glowing, expanding cloud. Quantity over polish.",
    sections: [ { id: "nw", kind: "ntw", title: "Notice / Wonder",
      minPerColumn: 2 } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Starlight",
    content: "We can't visit a star. We can't scoop up a sample. <span style=\"font-weight:700\">Almost everything we know about stars arrives as light.</span> So your unit-long job starts here: learn to treat starlight as a <span style=\"font-weight:700\">message</span> and pull information out of it.\n\nThere are levels, and they get harder. Same rule all unit: write down what you actually observe before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "🌈", style: "info", title: "Light is the messenger",
    content: "In Unit 5 you learned light is an <span style=\"font-weight:700\">electromagnetic wave</span>. The <span style=\"font-weight:700\">electromagnetic spectrum</span> sorts light by wavelength and frequency — from long-wavelength radio waves to short-wavelength gamma rays. Visible light (the rainbow) is just a thin slice in the middle.\n\nKey relationship: for any wave, speed = wavelength × frequency. All light in empty space travels at the same speed $c$, so $c = \\lambda f$. A shorter wavelength means a higher frequency; a longer wavelength means a lower frequency. Hotter objects shine more strongly at <span style=\"font-weight:700\">shorter</span> wavelengths — a clue we'll use all unit." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your initial model (before we read the answer)",
    instructions: "Before we read what scientists eventually figured out: what could make a star suddenly brighten and then fade away over months? Sketch your best guess. Use the evidence you see — the bright point in the old drawing, the expanding gas cloud today. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-new-star",
    title: "Class Challenge Board — Read the Starlight",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading what out of the light.",
    levels: [
      { n: 1, name: "Spot the New Star", nameEs: "Detecta la Estrella Nueva" },
      { n: 2, name: "Past vs. Present", nameEs: "Pasado contra Presente" },
      { n: 3, name: "Sort the Spectrum", nameEs: "Ordena el Espectro" },
      { n: 4, name: "Decode the Light", nameEs: "Decodifica la Luz" },
      { n: 5, name: "Light Across Time", nameEs: "Luz a Través del Tiempo" },
    ] },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Spectrum Log",
    intro: "Work the EM spectrum from longest wavelength to shortest. For each band, write a real source and what that light could tell us about a star. <span style=\"font-weight:700\">Write what the evidence shows before you decide what it means.</span>",
    sections: [ { id: "spectrum", kind: "table", title: "What each kind of light carries",
      columns: [
        { key: "band", label: "Band", width: "110px", placeholder: "radio, infrared…" },
        { key: "wave", label: "Wavelength (long/short)", placeholder: "longest → shortest" },
        { key: "source", label: "Example source", placeholder: "gas clouds, hot stars…" },
        { key: "tells", label: "What it can tell us", placeholder: "temperature, structure…" },
      ], minRows: 3, addRowLabel: "Add a band" } ] },

  { id: id("draw-model"), type: "sketch", title: "Draw Your Model",
    instructions: "Redraw your model of the 'new star' now that you've thought about light as a messenger. Show the star, the light leaving it, and the long trip that light takes to reach Earth. Add a note for what the light might be telling us. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sketching. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we looked at some light\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What is the starlight telling us?",
      prompts: [
        { id: "q1", label: "Why do historical drawings and modern images of the SAME 'new star' event help us more together than either alone?", rows: 3 },
        { id: "q2", label: "A 'new star' fades over months. What does that gradual fade tell you about the kind of event it was?", rows: 2 },
        { id: "q3", label: "Astronomers look at the same star in visible AND infrared light. Why bother comparing two wavelengths instead of just one?", rows: 2 },
        { id: "q4", label: "Light takes time to cross space. So when you look at a distant star, are you seeing it as it is *now*? Explain what you're actually seeing.", rows: 3 },
        { id: "q5", label: "**Predict:** a star glows mostly in ultraviolet (short wavelength). Using $c = \\lambda f$ and the 'hotter = shorter wavelength' clue, is that star hot or cold? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — reading wavelength and frequency",
    content: "All light in empty space travels at the same speed, $c \\approx 3.0 \\times 10^{8}\\,\\text{m/s}$, and obeys $c = \\lambda f$.\n\nSay a radio telescope picks up light with wavelength $\\lambda = 3.0\\,\\text{m}$. Its frequency is\n\n$$f = \\frac{c}{\\lambda} = \\frac{3.0 \\times 10^{8}\\,\\text{m/s}}{3.0\\,\\text{m}} = 1.0 \\times 10^{8}\\,\\text{Hz}.$$\n\nNow a different telescope catches visible light, $\\lambda = 5.0 \\times 10^{-7}\\,\\text{m}$. Because $\\lambda$ is far smaller, $f$ must be far larger — about $6 \\times 10^{14}\\,\\text{Hz}$. Same speed, but a <span style=\"font-weight:700\">shorter wavelength means a higher frequency.</span> That's the whole logic of the spectrum: pick a wavelength, and you've picked a frequency — and a story about the source." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Build Our Class Model — the 'new star'",
    intro: "We start the model we'll tweak all unit. Show the 'new star,' the light it sends out, and the long trip that light takes to reach us. Mark what we think the light could be telling us. Copy the class model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l1",
    title: "Driving Question Board",
    intro: "Our unit question is \"Why do stars shine and will they shine forever?\" Post at least one question about 'new stars' or starlight that could help us answer it. These drive where the unit heads next.",
    starters: [
      "If we can't visit a star, how do we know ___?",
      "What makes a star suddenly ___?",
      "How long ago did the light we see actually ___?",
      "What can a star's light tell us about ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE question for next time",
        label: "The kind we could chase down with evidence — light, spectra, records — not just an opinion.",
        placeholder: "How can the light from a 'new star' tell us ___?",
        hint: "*A good one points at evidence we could actually go gather.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"supernova,\" \"spectrum,\" \"wavelength,\" \"frequency,\" \"messenger,\" \"remnant,\" \"emit\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Tonight you spot a bright point of light in a patch of sky that was empty last week. Over the next two months it slowly dims and disappears. You can't fly there — all you'll ever get from it is its light. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Give your current best explanation for why a 'new star' appears and then fades — CLAIM what's happening, point to EVIDENCE from the records and images, and explain your REASONING. Then say how light could let us investigate it without ever going there." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Why are historical drawings and modern images of the same \"new star\" event useful together?",
    options: [
      "Because they show how that same patch of sky looked long ago and how it looks now.",
      "Because they prove the original star is still shining brightly in the sky today.",
      "Because they tell us the exact cause of the explosion with no other evidence.",
      "Because they make any other kind of observation completely unnecessary now.",
    ], correctIndex: 0,
    explanation: "Historical records snapshot the event when it happened; modern images show the long-term aftermath (the expanding gas cloud). Together they let us compare past and present views of the same location." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A \"new star\" gradually fades over a few months. What does that observation most strongly suggest?",
    options: [
      "The star is slowly shrinking and becoming physically smaller each night.",
      "The event is a temporary process, not a permanent change in the sky.",
      "The telescope being used to view it is slowly breaking down over time.",
      "The star is steadily moving farther away from Earth every single night.",
    ], correctIndex: 1,
    explanation: "A gradual fade means the brightening is a temporary process. A permanent change wouldn't disappear over a few months." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Astronomers observe the same star in both visible light and infrared light. What is the main reason they compare the two?",
    options: [
      "To make the star appear far more colorful in the final published photos.",
      "To prove that the star is definitely moving toward Earth right now.",
      "To see different temperatures and structures within the star.",
      "To directly measure how much the star weighs in kilograms.",
    ], correctIndex: 2,
    explanation: "Different wavelengths come from different temperatures and physical conditions. Comparing visible and infrared light reveals different layers and features of the star." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A star emits mostly ultraviolet light (a short wavelength). What can you reasonably conclude about it?",
    options: [
      "It must be a very cold star, since cold objects glow in short wavelengths.",
      "It must be extremely far away from Earth compared to other stars.",
      "It must be physically very small, smaller than most other stars nearby.",
      "It must be very hot, since hotter objects shine at shorter wavelengths.",
    ], correctIndex: 3,
    explanation: "Hotter objects emit more short-wavelength light. A star shining mostly in ultraviolet must be very hot." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "For any wave of light traveling through empty space, which relationship is correct?",
    options: [
      "Speed equals wavelength times frequency, written as $c = \\lambda f$.",
      "Speed equals wavelength divided by frequency for all light waves.",
      "Speed equals frequency divided by wavelength for all light waves.",
      "Speed equals wavelength plus frequency added together for light.",
    ], correctIndex: 0,
    explanation: "For any wave, speed = wavelength × frequency. For light in empty space, $c = \\lambda f$, where $c$ is the same for all light." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Two beams of light travel through empty space. Beam X has a longer wavelength than Beam Y. What is true about their frequencies?",
    options: [
      "Beam X has the higher frequency because its wavelength is longer.",
      "Beam Y has the higher frequency because its wavelength is shorter.",
      "Both beams must have exactly the same frequency in empty space.",
      "Neither beam has a frequency, since only matter waves have frequency.",
    ], correctIndex: 1,
    explanation: "Both travel at the same speed $c$, so $c = \\lambda f$ forces a trade-off: the shorter wavelength (Beam Y) must have the higher frequency." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which best explains what astronomers mean by calling starlight a \"messenger\"?",
    options: [
      "The light is sent on purpose by the star to communicate with Earth.",
      "The light must be decoded by radio operators before anyone can use it.",
      "The light carries information about the star across space and time.",
      "The light arrives instantly, showing the star exactly as it is right now.",
    ], correctIndex: 2,
    explanation: "Starlight is a data stream: its wavelengths carry information about the star's temperature, structure, and more — and it travels across vast distances to reach us." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Because light takes time to cross space, what are you actually seeing when you look at a very distant star?",
    options: [
      "The star exactly as it appears at this present moment in real time.",
      "An image created only inside the telescope, not real light from the star.",
      "Nothing real — distant starlight is too old to carry any information.",
      "Light that left the star long ago, so you see it as it was in the past.",
    ], correctIndex: 3,
    explanation: "Light travels at a finite speed, so light from a distant star left it long ago. You see the star as it was when that light departed — a look into the past." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a star on the left and Earth on the right, with light leaving the star and traveling the long distance between them. Label the trip with a note like 'this light is old by the time it arrives.' Add a quick label for one thing the light could tell us about the star. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about 'new stars' or starlight that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "A thousand years ago, people stared up at a star that shouldn't exist and had no way to explain it. We do — and the whole secret is hidden in the light it sent us. This unit, we learn to read it. See you next class. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "A Star Where There Wasn't One",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6101,
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
