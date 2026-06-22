// seed-phys-u5-v2-l02.cjs
// U5 v2 — Arc 2: "Send the Signal" (OpenSciEd-spine / Rober-engine).
// Merges v1 L03 (Wavelength, Frequency & Speed) + L04 (What's Moving?) into one
// challenge-arc: "Read the Wave." The wave equation v = f·λ; at a fixed speed,
// frequency and wavelength trade off inversely; apply to sound/water/light; and the
// deeper idea — a wave moves the DISTURBANCE, not the medium: waves transfer ENERGY,
// not matter. Through-line: "Send the Signal" — every signal is a wave you can measure.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as U1's arcs. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc2.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l02-wave-equation";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The wave-properties-explorer URL is from u5-arc2.md.
const EXPLORER = "https://paps-tools.web.app/wave-properties-explorer.html";

let _n = 0;
const id = (slug) => `v2u5l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Wavelength, Frequency & Speed",
    subtitle: "Unit 5 · Arc 2 — Send the Signal" },

  // ── CONNECT: recall L1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, you named the parts of a wave — <span style=\"font-weight:700\">amplitude</span>, <span style=\"font-weight:700\">wavelength</span>, <span style=\"font-weight:700\">frequency</span>. Today we make those parts <span style=\"font-weight:700\">talk to each other</span> with one equation, and then we ask a sneakier question: when a wave crosses a pool, what's actually moving — the water, or just the message? Send the signal. Let's measure it." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture the slinky demo from last arc. You wiggled one end and a pulse raced to your partner's hand. But did any single coil travel the length of the slinky? No — each coil just jiggled in place and handed the disturbance along. Hold that thought. Today we put numbers on the wave (speed, frequency, wavelength) AND we settle what really travels: the <span style=\"font-weight:700\">energy</span>, not the stuff." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go measure waves.",
    sections: [ { id: "recall", kind: "prompts", title: "From parts to numbers",
      prompts: [
        { id: "q1", label: "In your own words: what does the *frequency* of a wave count?", rows: 2 },
        { id: "q2", label: "If two waves move at the same speed but one has a longer wavelength — guess which one has the higher frequency, and why.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Wave",
    content: "Pick any wave — a sound, a water ripple, a beam of red light — and <span style=\"font-weight:700\">read it</span>: find its speed, its frequency, and its wavelength, and show that the three numbers agree. Then prove the trade-off: at a fixed speed, crank the frequency up and watch the wavelength shrink. Your job isn't done until you can predict one number from the other two.\n\nThere are levels. They get harder. The rule from last arc still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🌊", style: "info", title: "The one equation you need",
    content: "Wave speed depends on the <span style=\"font-weight:700\">medium</span> the wave travels through. But once the medium is fixed, the speed is locked in — and frequency and wavelength have to trade off to keep it true:\n\n$$v = f\\lambda$$\n\n$v$ = wave speed (m/s) · $f$ = frequency (Hz, waves per second) · $\\lambda$ = wavelength (m).\n\nIf $v$ stays the same, a higher-frequency wave <span style=\"font-weight:700\">must</span> have a shorter wavelength. (Amplitude is its own thing — making a wave taller does not change its wavelength.) The <span style=\"font-weight:700\">system</span> we analyze is the wave plus the medium it moves through." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the trade-off (before the explorer)",
    instructions: "Draw a wave. Then draw a second wave with TWICE the frequency, same speed. Predict what happens to its wavelength and sketch it. Wrong is fine — we sketch first so we can compare to the explorer later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-wave-equation",
    title: "Class Challenge Board — Read the Wave",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading which wave.",
    levels: [
      { n: 1, name: "Find the Speed", nameEs: "Encuentra la Rapidez" },
      { n: 2, name: "Prove the Trade-Off", nameEs: "Demuestra el Intercambio" },
      { n: 3, name: "Read Sound, Water, Light", nameEs: "Lee Sonido, Agua, Luz" },
      { n: 4, name: "Predict the Missing Number", nameEs: "Predice el Número Faltante" },
      { n: 5, name: "Track What's Really Moving", nameEs: "Rastrea Qué Se Mueve de Verdad" },
    ] },

  { id: id("embed-explorer"), type: "embed", url: EXPLORER, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Wave Reading Log",
    intro: "As you work the explorer and the levels: <span style=\"font-weight:700\">before you decide a wave \"sped up\" or \"shrank,\" write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Reading the waves",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "wave", label: "Wave / source", placeholder: "sound, water, red light…" },
        { key: "fl", label: "Frequency and wavelength", placeholder: "f = ?,  λ = ?" },
        { key: "v", label: "Speed (f × λ) — does it hold?", placeholder: "v = f × λ" },
      ], minRows: 3, addRowLabel: "Add a wave" } ] },

  { id: id("draw-tradeoff"), type: "sketch", title: "Draw the Trade-Off",
    instructions: "Redraw your two waves now that you've used the explorer. Same speed, but the second has double the frequency. Show clearly that the higher-frequency wave has the SHORTER wavelength, and label both. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-measure"), type: "mission_log", title: "Mission Log — Reference & Compare",
    intro: "Use these audited reference values to check your work. Notice how light leaves mechanical waves in the dust — much faster, much shorter wavelengths. One row per wave you read.",
    sections: [ { id: "compare", kind: "table", title: "Reference values (check against your numbers)",
      columns: [
        { key: "wave", label: "Wave type", placeholder: "sound in air / water / red light" },
        { key: "f", label: "Typical frequency", placeholder: "≈ 1,000 Hz / 0.5 Hz / 4.3×10^14 Hz" },
        { key: "lam", label: "Typical wavelength", placeholder: "≈ 0.34 m / 2 m / 700 nm" },
        { key: "speed", label: "Speed", placeholder: "≈ 340 / 1 / 3×10^8 m/s" },
      ], minRows: 3, addRowLabel: "Add a wave" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop measuring. Now we figure out what it all means — including the sneaky part: what actually <span style=\"font-weight:700\">travels</span> when a wave moves? Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we measured some waves\" into physics." },

  { id: id("core"), type: "callout", icon: "💡", style: "info", title: "The core idea — what's moving?",
    content: "When a wave rolls across a pool, the water does <span style=\"font-weight:700\">not</span> travel with it. If it did, all the water would pile up at one end of the pool. A <span style=\"font-weight:700\">wave</span> is a disturbance that transfers <span style=\"font-weight:700\">energy</span> from one place to another — it does <span style=\"font-weight:700\">not</span> carry the matter of the medium with it. The particles of the medium oscillate around their rest positions and stay put; only the disturbance (and its energy) moves forward. A cork on the surface just bobs up and down and returns to about the same place — exactly like a single slinky coil." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the numbers — and the cork — tell us?",
      prompts: [
        { id: "q1", label: "In the Wave Properties Explorer you keep the medium (and the speed) the same. What happens to the wavelength when you increase the frequency? Explain *why* using $v = f\\lambda$.", rows: 3 },
        { id: "q2", label: "A sound wave in air has $f = 250\\,\\text{Hz}$ and $\\lambda = 1.36\\,\\text{m}$. A light wave has $f = 5.0 \\times 10^{14}\\,\\text{Hz}$ and $\\lambda = 6.0 \\times 10^{-7}\\,\\text{m}$. Calculate the speed of each and explain why the numbers are so different.", rows: 3 },
        { id: "q3", label: "Describe what a cork does in the ripple tank as a wave passes. What does that tell you about whether the water itself travels with the wave?", rows: 2 },
        { id: "q4", label: "A friend argues ocean waves carry water from the middle of the ocean all the way to the beach — that's why the sand gets wet. Use evidence from the ripple tank or slinky to respond. (Claim → Evidence → Reasoning.)", rows: 3 },
        { id: "q5", label: "**Predict:** you double a wave's frequency but keep the medium the same. What happens to its speed, and what happens to its wavelength? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — read the wave",
    content: "A wave has frequency <span style=\"font-weight:700\">2 Hz</span> and wavelength <span style=\"font-weight:700\">3 m</span>. Find its speed.\n\nStep 1 — pick the equation: $v = f\\lambda$.\n\nStep 2 — substitute: $v = (2\\,\\text{Hz})(3\\,\\text{m})$.\n\nStep 3 — solve: $v = 6\\,\\text{m/s}$.\n\nNow flip it: if you knew the speed and the frequency, you could solve for wavelength as $\\lambda = \\dfrac{v}{f}$. Same equation, rearranged. That's the whole trick — know any two, find the third. And notice: at a fixed $v$, pushing $f$ up forces $\\lambda$ down, because their product can't change." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Model — add the equation",
    intro: "Same wave model we started in Arc 1. Today we tweak it: label $v$, $f$, and $\\lambda$ on the wave, write $v = f\\lambda$ on it, and add an arrow showing the energy moving forward while a particle of the medium just bobs in place. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about wave speed, the trade-off, or what travels. These drive where the unit heads next.",
    starters: [
      "If the speed is fixed, why does ___ change the wavelength?",
      "What sets the speed of a wave in ___?",
      "If only energy moves, how does ___ carry information?",
      "Why is light so much faster than ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the wave's ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"frequency,\" \"wavelength,\" \"medium,\" \"oscillate,\" \"disturbance,\" \"transfer,\" \"inverse\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "You drop a pebble in a still pond. Ripples spread outward in rings, and a leaf floating nearby starts to bob. The rings keep moving toward the shore, but the leaf mostly stays put. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what is actually traveling outward from the pebble, and why the leaf bobs in place instead of riding the ripple to shore. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A wave has a frequency of 2 Hz and a wavelength of 3 m. What is its speed?",
    options: [
      "The wave speed is 1.5 m/s, found by dividing the wavelength by the frequency.",
      "The wave speed is 6 m/s, found by multiplying the frequency by the wavelength.",
      "The wave speed is 5 m/s, found by adding the frequency and the wavelength.",
      "The wave speed is 0.67 m/s, found by dividing the frequency by the wavelength.",
    ], correctIndex: 1,
    explanation: "Use $v = f\\lambda$. Substitute $f = 2\\,\\text{Hz}$ and $\\lambda = 3\\,\\text{m}$: $v = 2 \\times 3 = 6\\,\\text{m/s}$." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "In a medium where the wave speed stays constant, you increase the frequency. What happens to the wavelength?",
    options: [
      "The wavelength gets shorter, because $v = f\\lambda$ must stay constant.",
      "The wavelength gets longer, because higher frequency stretches the wave.",
      "The wavelength stays exactly the same, since speed did not change.",
      "The wavelength first grows and then shrinks back to its original value.",
    ], correctIndex: 0,
    explanation: "Since $v = f\\lambda$ and $v$ is fixed, the product $f\\lambda$ is constant. If $f$ goes up, $\\lambda$ must go down — they are inversely related." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A cork floats on a pond as a wave passes by. Which statement best describes its motion?",
    options: [
      "It travels along with the wave all the way toward the distant shore.",
      "It sinks beneath the surface the moment the crest of the wave reaches it.",
      "It speeds up steadily because it keeps gaining energy from the wave.",
      "It bobs up and down but returns to about the same place after the wave.",
    ], correctIndex: 3,
    explanation: "The water (and anything floating on it) moves in small orbits around its rest position. The wave carries energy across the surface, but it does not carry the cork along with it." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement correctly describes what a wave transfers?",
    options: [
      "A wave transfers the matter of the medium from one place to another.",
      "A wave transfers both energy and a large amount of the medium together.",
      "A wave transfers energy, while the matter of the medium stays in place.",
      "A wave transfers neither energy nor matter; it is only an optical illusion.",
    ], correctIndex: 2,
    explanation: "A wave is a disturbance that transfers energy from one place to another. The particles of the medium oscillate around their rest positions but do not travel with the wave." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Red light has a frequency of about $4.3 \\times 10^{14}\\,\\text{Hz}$ and a wavelength of about 700 nm. Why is its speed so much greater than a sound wave's?",
    options: [
      "Because light has a far larger amplitude than any ordinary sound wave.",
      "Because light's very high frequency and tiny wavelength multiply to a huge speed.",
      "Because sound waves slow down a lot every time they pass a solid object.",
      "Because red light is colored and color always increases a wave's speed.",
    ], correctIndex: 1,
    explanation: "Speed is $v = f\\lambda$. Light's enormous frequency far outweighs its tiny wavelength, giving $v \\approx 3 \\times 10^8\\,\\text{m/s}$ — about a million times faster than sound's $\\approx 340\\,\\text{m/s}$." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "If you make a wave taller (larger amplitude) without changing the source's rate, what happens to its wavelength?",
    options: [
      "The wavelength shrinks in proportion to how much taller the wave becomes.",
      "The wavelength grows, because a taller wave needs more room to fit.",
      "The wavelength stays the same; amplitude and wavelength are independent.",
      "The wavelength becomes impossible to define once the wave is too tall.",
    ], correctIndex: 2,
    explanation: "Amplitude (height) is independent of wavelength. Changing how tall a wave is does not change how long it is — only the frequency or the medium does that." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A friend says ocean waves prove that water travels from the middle of the ocean to the beach. What is the best physics response?",
    options: [
      "Agree — the moving water is exactly what eventually splashes onto the sand.",
      "Agree — the wave drags a thin layer of surface water all the way to shore.",
      "Disagree — ocean waves carry no energy at all, so nothing reaches the beach.",
      "Disagree — the water bobs in place while the wave's energy moves to shore.",
    ], correctIndex: 3,
    explanation: "The water moves in small loops and returns near its start (like the cork). The wave transfers energy toward shore; it does not carry the bulk of the water across the ocean." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Which quantities do you need to know to calculate a wave's speed directly from the wave equation?",
    options: [
      "Its frequency and its wavelength, multiplied together using $v = f\\lambda$.",
      "Its amplitude and its frequency, multiplied together using $v = f\\lambda$.",
      "Its amplitude and its wavelength, multiplied together using $v = f\\lambda$.",
      "Its color and its loudness, combined together using the wave equation.",
    ], correctIndex: 0,
    explanation: "The wave equation is $v = f\\lambda$ — multiply frequency by wavelength. Amplitude does not appear in it." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch two waves moving at the same speed: one low-frequency and one high-frequency. Label which has the longer wavelength. Then add a dot on the medium and an arrow showing it bobs in place while a separate arrow shows the energy moving forward. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about waves that *surprised* you today, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read the wave today — found its speed, proved the frequency-wavelength trade-off, and caught the big secret: a wave moves the energy, not the water. Same trick will let us send real signals soon. See you next class. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Wavelength, Frequency & Speed",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5102,
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
