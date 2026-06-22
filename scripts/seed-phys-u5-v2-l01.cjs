// seed-phys-u5-v2-l01.cjs
// U5 v2 — Arc 1: "The Microwave Mystery" (OpenSciEd-spine / Rober-engine).
// Merges v1 L01 (Microwave Mystery anchor) + L02 (Waves on a String) into one
// challenge-arc. Anchor: a Bluetooth speaker drops signal inside a closed-but-OFF
// microwave. Build a wave model (amplitude, wavelength, frequency, period) and see
// how wave properties relate to the ENERGY a wave carries. Through-line: "Send the
// Signal" — start the unit-long Driving Question Board.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// platform blocks + composed Status Check as the U1 v2 pilot. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc1.md (sourced/audited v1).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l01-microwave-mystery";
// Wave Properties Explorer embed URL is taken verbatim from u5-arc1.md (v1 L02).
const EXPLORER = "https://paps-tools.web.app/wave-properties-explorer.html";

let _n = 0;
const id = (slug) => `v2u5l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "The Microwave Mystery",
    subtitle: "Unit 5 · Arc 1 — Waves and Electromagnetic Radiation" },

  // ── CONNECT: hook → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "New unit, new mystery. I'm going to play music on a little Bluetooth speaker, then put that speaker inside a microwave and <span style=\"font-weight:700\">close the door</span> — with the microwave <span style=\"font-weight:700\">OFF</span>. No heat, no fan, no power. And the music will glitch out anyway. Your job all unit: figure out how we <span style=\"font-weight:700\">send signals</span> through the air, and whether the radiation that carries them is safe. Fun is mandatory in this room." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Think about how much you trust the invisible. Right now a Wi-Fi signal, a cell signal, FM radio, and the heat off your skin are all passing through you — and you feel none of it. They're all the <span style=\"font-weight:700\">same kind of thing</span> moving at different speeds of wiggle. That \"thing\" is a <span style=\"font-weight:700\">wave</span>, and before we explain a metal box eating a signal, we have to build a clean model of what a wave even is. So we start with something you CAN see: a wave on a string." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Notice and Wonder",
    intro: "Before any explaining, we observe. Scientists notice carefully first. Quantity over polish.",
    sections: [ { id: "nw", kind: "prompts", title: "The microwave demo",
      prompts: [
        { id: "q1", label: "What do you NOTICE? List everything about the speaker, the microwave, and what changed when the speaker went inside. No wrong answers — careful observations only.", rows: 3 },
        { id: "q2", label: "What are you WONDERING? Write at least three questions about waves, signals, or radiation that this demo raises.", rows: 3 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Wave",
    content: "You can't fix what you can't measure. Before this unit can explain a blocked signal, you have to be able to <span style=\"font-weight:700\">read a wave</span> — point to its parts and say what each one controls. Using a string and the Wave Properties Explorer, learn to spot <span style=\"font-weight:700\">amplitude, wavelength, frequency, and period</span>, and figure out which one decides how much <span style=\"font-weight:700\">energy</span> the wave carries.\n\nThere are levels. They get harder. Same rule as always: write down what you see before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "🌊", style: "info", title: "What a wave is",
    content: "A <span style=\"font-weight:700\">wave</span> is a disturbance that moves through a medium — or, for some waves, through empty space. Today the medium is a <span style=\"font-weight:700\">string or slinky</span>. The <span style=\"font-weight:700\">system</span> we study is the string plus the hand (or motor) that shakes it.\n\nEnergy enters the system when you shake the string, travels along the string as a wave, and can leave at the far end. Watch one thing closely: when a pulse runs down the spring, does a piece of the spring travel all the way across the room — or does the disturbance travel while the spring stays put? Hold that question. It matters for every wave we meet, including light." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan and Sketch — predict the demo (before the explorer)",
    instructions: "Sketch the Bluetooth speaker outside the microwave, then inside with the door closed. Draw what you THINK is happening to the signal in each case. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-microwave-mystery",
    title: "Class Challenge Board — Read the Wave",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading what.",
    levels: [
      { n: 1, name: "Spot the Crest and Trough", nameEs: "Identifica Cresta y Valle" },
      { n: 2, name: "Measure Amplitude", nameEs: "Mide la Amplitud" },
      { n: 3, name: "Measure Wavelength", nameEs: "Mide la Longitud de Onda" },
      { n: 4, name: "Read Frequency and Period", nameEs: "Lee Frecuencia y Período" },
      { n: 5, name: "Find What Carries the Energy", nameEs: "Halla Qué Lleva la Energía" },
    ] },

  { id: id("embed-explorer"), type: "embed", url: EXPLORER, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Wave Trace Log",
    intro: "As you work the explorer and the levels: <span style=\"font-weight:700\">before you decide what a change \"does,\" write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Testing the wave",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "changed", label: "What I changed", placeholder: "amplitude, frequency…" },
        { key: "saw", label: "What happened to the wave", placeholder: "taller / closer crests…" },
        { key: "energy", label: "More or less energy?", placeholder: "and how I can tell" },
      ], minRows: 3, addRowLabel: "Add a test" } ] },

  { id: id("draw-anatomy"), type: "sketch", title: "Draw the Anatomy of a Wave",
    instructions: "Redraw a transverse wave now that you've measured one. Mark the rest line, label amplitude (rest line to a crest), wavelength (crest to next crest), and note where you'd count frequency. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-measure"), type: "mission_log", title: "Mission Log — Wave Readout",
    intro: "Record the wave you built in the explorer. One row per property — give a value or a clear word.",
    sections: [ { id: "readout", kind: "table", title: "My wave",
      columns: [
        { key: "prop", label: "Wave property", placeholder: "amplitude, wavelength…" },
        { key: "value", label: "Value or description", placeholder: "tall / 2 boxes / 3 Hz" },
        { key: "controls", label: "What it controls", placeholder: "energy / pitch / spacing" },
      ], minRows: 4, addRowLabel: "Add a property" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause and Process — pencils up",
    content: "Stop testing. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we wiggled a string\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does the wave actually do?",
      prompts: [
        { id: "q1", label: "You held frequency the same and made the wave taller. What happened to the energy it carries, and how could you tell?", rows: 2 },
        { id: "q2", label: "A student says, \"The string particles move from one end of the room to the other inside the wave.\" Using what you saw, is that right? CLAIM, then EVIDENCE (string motion vs. disturbance motion), then REASONING (the definition of a wave).", rows: 4 },
        { id: "q3", label: "Period and frequency are linked by $T = \\frac{1}{f}$. In your own words, what does it mean for a wave to have a high frequency but a short period?", rows: 2 },
        { id: "q4", label: "Back to the mystery: the Bluetooth signal is a wave too, even though you can't see it. What about today makes you think a wave could be blocked by a metal box?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — period and frequency",
    content: "A wave on a spring sends <span style=\"font-weight:700\">5 crests</span> past your hand every <span style=\"font-weight:700\">second</span>. What is its frequency, and what is its period?\n\nStep 1 — frequency is waves per second: $f = 5\\,\\text{Hz}$ (5 hertz).\n\nStep 2 — period is the time for ONE wave, and it's the flip of frequency: $T = \\dfrac{1}{f} = \\dfrac{1}{5\\,\\text{Hz}} = 0.2\\,\\text{s}$.\n\nSo one full wave takes two-tenths of a second to pass. Notice: a <span style=\"font-weight:700\">higher</span> frequency means a <span style=\"font-weight:700\">shorter</span> period — they're inverses. Amplitude isn't in this equation at all, because amplitude controls the wave's <span style=\"font-weight:700\">energy</span>, not its timing." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Build Our Class Wave Model — round 1",
    intro: "Start our class model for the unit. Draw a wave, label its parts (amplitude, wavelength, frequency, period), and note which part controls the <span style=\"font-weight:700\">energy</span>. We'll tweak this same model every arc as we learn how signals get sent. Copy it into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l1",
    title: "Driving Question Board",
    intro: "Our unit-long board. Post at least one question you have about waves, signals, or whether radiation is safe. We'll come back and check off the ones we can answer.",
    starters: [
      "How can a signal travel through ___ but get blocked by ___?",
      "Is the radiation from ___ actually dangerous?",
      "What's the difference between a wave you can see and ___?",
      "How does a phone send a signal without ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the wave ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"wave,\" \"amplitude,\" \"wavelength,\" \"frequency,\" \"period,\" \"medium,\" \"disturbance,\" \"radiation\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "You're shaking a long spring across the floor, sending wave after wave toward a friend at the other end. You can make the waves taller or shorter, and you can shake faster or slower. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what travels down the spring and what stays put. Then say which change — taller waves or faster shaking — puts more energy into the spring, and how you'd know. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "On a transverse wave, the amplitude is measured as the —",
    options: [
      "distance from one crest to the very next crest along the wave.",
      "maximum displacement of the medium from its rest position.",
      "number of complete waves that pass a fixed point each second.",
      "total time it takes for one full wave to pass a fixed point.",
    ], correctIndex: 1,
    explanation: "Amplitude is the maximum displacement from the rest line — how far the medium moves from its resting position. Crest-to-crest is wavelength, waves-per-second is frequency, and time-for-one-wave is period." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "You keep the frequency the same and increase a wave's amplitude. What happens to the energy the wave carries?",
    options: [
      "It decreases, because a taller wave moves more slowly down the string.",
      "It stays the same, because only frequency can change a wave's energy.",
      "It increases, because a larger amplitude carries more energy.",
      "It drops to zero, because amplitude and energy are unrelated here.",
    ], correctIndex: 2,
    explanation: "For a wave on a string, amplitude is the main indicator of energy. A larger amplitude moves the medium farther from rest, storing more kinetic and potential energy in the system." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A pulse travels from one end of a long spring to the other. What actually moves all the way across the room?",
    options: [
      "The disturbance moves across while the spring coils stay roughly in place.",
      "The spring coils themselves travel the full length of the room with the pulse.",
      "Both the disturbance and the spring coils move across the room together.",
      "Neither one moves; the spring only appears to carry a pulse across the room.",
    ], correctIndex: 0,
    explanation: "A wave transfers energy, not matter. The disturbance travels the length of the spring while each coil only wiggles around its own rest position and stays put." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "The distance from one crest of a wave to the very next crest is called the wave's —",
    options: [
      "amplitude, since both describe the size of a single wave.",
      "frequency, since it counts how often the crests repeat.",
      "period, since it measures the gap between two crests.",
      "wavelength, the distance between two matching points.",
    ], correctIndex: 3,
    explanation: "Wavelength is the distance from one crest to the next crest (or trough to trough) — the length of one full wave. Amplitude is height, frequency is waves per second, and period is time per wave." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Frequency is measured in hertz (Hz). One hertz means —",
    options: [
      "one complete wave passes a fixed point every second.",
      "one meter of distance between two crests of the wave.",
      "one second for a single wave to travel down the string.",
      "one unit of energy carried by the wave as it moves.",
    ], correctIndex: 0,
    explanation: "Frequency counts how many complete waves pass a point each second. One hertz is one wave per second. Distance between crests is wavelength, and time per wave is period." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A wave has a frequency of 4 Hz. Using $T = \\frac{1}{f}$, what is its period?",
    options: [
      "4 seconds, because the period always equals the frequency value.",
      "0.25 seconds, because the period is one divided by the frequency.",
      "8 seconds, because you double the frequency to find the period.",
      "1 second, because every wave on a string has a period of one second.",
    ], correctIndex: 1,
    explanation: "Period is the inverse of frequency: $T = \\frac{1}{f} = \\frac{1}{4\\,\\text{Hz}} = 0.25\\,\\text{s}$. A higher frequency always means a shorter period." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement best describes what a wave does as it travels through a medium?",
    options: [
      "It permanently carries pieces of the medium along to a new location.",
      "It creates brand-new energy at each point the disturbance reaches.",
      "It transfers energy through the medium without transporting the matter.",
      "It speeds up the medium until every particle drifts in one direction.",
    ], correctIndex: 2,
    explanation: "A wave is a disturbance that transfers energy through a medium while the matter stays roughly in place. The energy moves; the particles only vibrate around their rest positions." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Two waves move on identical strings. Wave X has a higher frequency than Wave Y. Compared with Wave Y, the crests of Wave X are —",
    options: [
      "always taller, because higher frequency means a larger amplitude.",
      "spaced farther apart, because faster waves stretch out their wavelength.",
      "carrying no energy, because only amplitude can carry a wave's energy.",
      "spaced closer together, because more waves pass each second.",
    ], correctIndex: 3,
    explanation: "Higher frequency means more waves pass per second, so on identical strings the crests are packed closer together (shorter wavelength). Frequency does not set amplitude, and both waves still carry energy." },

  { id: id("sc-draw"), type: "sketch", title: "Jot and Draw",
    instructions: "Sketch two waves on the same line: a low-energy wave and a high-energy wave. Make the difference between them ONLY the amplitude. Label the rest line and the amplitude on each. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about waves that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You learned to read a wave today — found its parts, and found the one part (amplitude) that carries the energy. Next class we put waves to work and figure out how they actually carry a signal across the room. The microwave's still waiting. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Microwave Mystery",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5101,
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
