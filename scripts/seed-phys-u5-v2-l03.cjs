// seed-phys-u5-v2-l03.cjs
// U5 v2 — Arc 3: "From Charges to the EM Spectrum" (OpenSciEd-spine / Rober-engine).
// Merges v1 L05 (From Charges to Changing Fields) + L06 (The Electromagnetic Spectrum)
// into one challenge-arc. Physics: moving charges produce magnetic fields; changing
// electric + magnetic fields travel through space as EM radiation (the wave model of
// light); locate everyday tech on the EM spectrum; compare frequency/wavelength/energy
// across regions; why different frequencies interact with matter differently.
// Through-line: "Send the Signal" — to send a wireless signal you wiggle charges, and
// where it lands on the spectrum decides what it can do.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as Arc 2. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc3.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l03-em-spectrum";
// EM spectrum explorer embed URL — exact, from u5-arc3.md.
const EXPLORER = "https://paps-tools.web.app/em-spectrum-explorer.html";

let _n = 0;
const id = (slug) => `v2u5l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "From Charges to the EM Spectrum",
    subtitle: "Unit 5 · Arc 3 — Waves & Electromagnetic Radiation" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you nailed $v = f\\lambda$ and proved a wave moves <span style=\"font-weight:700\">energy, not matter</span> — the medium just jiggles in place. But here's the thing that should bug you: your Bluetooth earbuds and the WiFi work just fine across an empty room. No string. No water. No air needed at all. So today's question: <span style=\"font-weight:700\">how does a signal travel through nothing?</span> And once we crack that — how do we aim it so it does the right job?" },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Mechanical waves — sound, waves on a string, ripples on water — all need a <span style=\"font-weight:700\">medium</span> to travel through. Take the medium away and the wave dies. Yet light from the Sun crosses 150 million km of empty space to reach you, and a Bluetooth signal crosses your room with no air doing the work.\n\nThat's the thread we pull all arc: the \"signal\" is an <span style=\"font-weight:700\">electromagnetic wave</span>, and to launch one you don't shake a string — you <span style=\"font-weight:700\">wiggle a charge</span>. Where that wave lands on the spectrum decides everything it can do." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 2 — quantity over polish. Then we go figure out how a signal crosses empty space.",
    sections: [ { id: "recall", kind: "prompts", title: "What carries the wave?",
      prompts: [
        { id: "q1", label: "Name TWO waves you know that need a medium (and say what the medium is for each).", rows: 2 },
        { id: "q2", label: "A Bluetooth signal reaches your earbuds with no string, no water, no air in between. What do you THINK is carrying it?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Send the Signal",
    content: "Build the chain from a <span style=\"font-weight:700\">wiggling charge</span> to a working wireless signal — then place that signal on the <span style=\"font-weight:700\">electromagnetic spectrum</span> and predict what it can do. Your job isn't done until you can explain BOTH how the wave gets launched through empty space AND why its spot on the spectrum decides whether it warms food, carries data, or fogs an X-ray film.\n\nThere are levels. They get harder. The rule still holds — write down what you observe before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🧲", style: "info", title: "The link you're building on",
    content: "Earlier this year we saw it: an electric <span style=\"font-weight:700\">current</span> in a wire produces a <span style=\"font-weight:700\">magnetic field</span> around the wire. Today we push that further.\n\nA <span style=\"font-weight:700\">changing</span> electric field creates a changing magnetic field, and a changing magnetic field creates a changing electric field. Linked together, they can travel through space on their own as an <span style=\"font-weight:700\">electromagnetic wave</span>.\n\nOne key detail: a charge moving at a <span style=\"font-weight:700\">steady</span> rate makes a steady field — no wave. It's a charge that <span style=\"font-weight:700\">accelerates</span> (speeds up, slows down, or wiggles back and forth) that launches a wave. That's exactly what an antenna does: it drives charges back and forth to send out a signal." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — how does the signal get out? (before the demos)",
    instructions: "Sketch your best guess for how a Bluetooth signal gets from a phone's antenna, across empty space, to your earbuds. What's happening at the antenna? What's traveling in between? Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-em-spectrum",
    title: "Class Challenge Board — Send the Signal",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's getting their signal out.",
    levels: [
      { n: 1, name: "Wiggle a Charge", nameEs: "Mueve una Carga" },
      { n: 2, name: "Link the Fields", nameEs: "Enlaza los Campos" },
      { n: 3, name: "Launch the Wave", nameEs: "Lanza la Onda" },
      { n: 4, name: "Place It on the Spectrum", nameEs: "Ubícala en el Espectro" },
      { n: 5, name: "Predict What It Can Do", nameEs: "Predice lo Que Puede Hacer" },
    ] },

  { id: id("demo"), type: "callout", icon: "🔬", style: "default", title: "Classroom demo — fields are linked (watch closely)",
    content: "Mr. McCarthy connects a coil of wire to a battery and sets a compass nearby. When current flows, the compass needle <span style=\"font-weight:700\">deflects</span> — the current produces a magnetic field. Then he moves a magnet near a SECOND coil wired to a meter. When the magnet <span style=\"font-weight:700\">moves</span>, the meter reads a current — a changing magnetic field pushed charges in the wire.\n\nThe <span style=\"font-weight:700\">system</span> is the coils, the magnet, and the space around them. Energy goes IN when the magnet moves or the current changes, and it can leave as induced current OR as radiation that escapes into the surrounding space. Log what you see in both halves." },

  { id: id("embed-explorer"), type: "embed", url: EXPLORER, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Spectrum Trace Log",
    intro: "As you work the explorer and the levels: <span style=\"font-weight:700\">before you decide what a region of the spectrum does, write what you observed about its frequency and wavelength.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Placing signals on the spectrum",
      columns: [
        { key: "tech", label: "Technology / wave", placeholder: "WiFi, X-ray, FM radio…" },
        { key: "freq", label: "Frequency (rough)", placeholder: "2.4 GHz, 10^18 Hz…" },
        { key: "region", label: "Spectrum region", placeholder: "radio / microwave / …" },
        { key: "does", label: "What it interacts with / does", placeholder: "carries data, ionizes…" },
      ], minRows: 3, addRowLabel: "Add a signal" } ] },

  { id: id("table-freq"), type: "callout", icon: "📊", style: "info", title: "Everyday frequencies — place familiar tech on the spectrum",
    content: "All EM waves travel at the same speed in empty space, $c \\approx 3 \\times 10^8\\,\\text{m/s}$. Because $c = f\\lambda$ is fixed, <span style=\"font-weight:700\">high frequency means short wavelength</span> and low frequency means long wavelength. Use these to place technologies as you build your trace log:\n\n• FM radio — about $100\\,\\text{MHz}$, about $3\\,\\text{m}$ — <span style=\"font-weight:700\">Radio</span>\n• WiFi / Bluetooth — about $2.4\\,\\text{GHz}$, about $12.5\\,\\text{cm}$ — <span style=\"font-weight:700\">Microwave</span>\n• Microwave oven — about $2.45\\,\\text{GHz}$, about $12.2\\,\\text{cm}$ — <span style=\"font-weight:700\">Microwave</span>\n• 5G (sub-6) — about $3.5\\,\\text{GHz}$, about $8.6\\,\\text{cm}$ — <span style=\"font-weight:700\">Microwave / Radio</span>\n• Visible red light — about $430\\,\\text{THz}$, about $700\\,\\text{nm}$ — <span style=\"font-weight:700\">Visible</span>\n• Medical X-ray — about $10^{18}\\,\\text{Hz}$, about $0.3\\,\\text{nm}$ — <span style=\"font-weight:700\">X-ray</span>" },

  { id: id("draw-wave"), type: "sketch", title: "Draw the EM Wave",
    instructions: "Redraw a signal launching now that you've seen the demos. Show an accelerating (wiggling) charge at an antenna, then the electric (E) and magnetic (B) fields oscillating perpendicular to each other AND to the direction the wave travels. Add an arrow off to the side for energy radiating into space. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-place"), type: "mission_log", title: "Mission Log — Spectrum Map",
    intro: "Lay out the spectrum in order and mark where your signal lives. One row per region — note how frequency, wavelength, and energy change as you move across it.",
    sections: [ { id: "spectrum", kind: "table", title: "Low → high frequency",
      columns: [
        { key: "region", label: "Region (in order)", placeholder: "radio, microwave…" },
        { key: "freqtrend", label: "Frequency low or high?", placeholder: "lowest / rising / highest" },
        { key: "wavetrend", label: "Wavelength long or short?", placeholder: "longest / shrinking / shortest" },
        { key: "tech", label: "An example technology", placeholder: "FM radio, X-ray…" },
      ], minRows: 3, addRowLabel: "Add a region" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop exploring. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we played with a slider\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the signal?",
      prompts: [
        { id: "q1", label: "Connect the two demos: how do they TOGETHER support the idea that electric and magnetic fields are linked? Use the words *current*, *magnetic field*, and *changing*.", rows: 3 },
        { id: "q2", label: "A classmate says, \"EM waves can't be real waves because they don't need air or water to travel.\" Respond using what you learned. If there's no medium, what carries the energy?", rows: 3 },
        { id: "q3", label: "Bluetooth, WiFi, and a microwave oven all use frequencies near $2.4\\,\\text{GHz}$. Using the spectrum table, explain why they don't interfere with each other constantly.", rows: 3 },
        { id: "q4", label: "As you move from radio toward gamma rays, frequency goes UP. What happens to wavelength, and what happens to the energy each wave carries? Why does that make high-frequency radiation interact with matter more dramatically?", rows: 3 },
        { id: "q5", label: "A social media post claims 5G signals are a form of X-ray radiation. Use the spectrum to evaluate it: compare the frequency of 5G to X-rays, and explain why that difference matters for how each one affects your body.", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — where does WiFi sit, and how big is its wave?",
    content: "WiFi runs near $f = 2.4\\,\\text{GHz} = 2.4 \\times 10^9\\,\\text{Hz}$. EM waves travel at $c = 3 \\times 10^8\\,\\text{m/s}$. How long is one wavelength?\n\nRearrange $c = f\\lambda$ to solve for wavelength: $\\lambda = \\dfrac{c}{f}$.\n\n$$\\lambda = \\frac{3 \\times 10^8\\,\\text{m/s}}{2.4 \\times 10^9\\,\\text{Hz}} \\approx 0.125\\,\\text{m} = 12.5\\,\\text{cm}$$\n\nAbout the width of your hand — that puts WiFi in the <span style=\"font-weight:700\">microwave</span> region, right next to your microwave oven near $2.45\\,\\text{GHz}$. Now compare an X-ray near $10^{18}\\,\\text{Hz}$: same $c$, but billions of times more frequency means a wavelength near $0.3\\,\\text{nm}$ and far more energy per photon — enough to <span style=\"font-weight:700\">ionize</span> atoms. Same speed, wildly different jobs — frequency is what changes." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Wave Model — add the EM spectrum",
    intro: "Same wave model we've been building this unit. Today we tweak it: show a signal launching from an <span style=\"font-weight:700\">accelerating charge</span>, traveling as linked E and B fields through empty space, and landing somewhere on the <span style=\"font-weight:700\">spectrum</span> that decides what it can do. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about EM waves or the spectrum. These drive where the unit heads next.",
    starters: [
      "If EM waves all travel at the same speed, why does ___?",
      "How does an antenna actually ___?",
      "Why can ___ pass through walls but ___ can't?",
      "What decides whether a wave is dangerous or ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the signal ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"electromagnetic,\" \"field,\" \"accelerate,\" \"antenna,\" \"frequency,\" \"wavelength,\" \"spectrum,\" \"ionize,\" \"radiation\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Your phone's antenna wiggles charges back and forth to send a Bluetooth signal. The signal crosses the empty air of the room and reaches your earbuds, which pull the data back out. No wire connects them. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Trace the signal from the wiggling charge at the antenna to your earbuds. Explain what gets launched, what travels across the empty room, and why no medium is needed. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Which of the following produces a magnetic field?",
    options: [
      "A neutral atom sitting at rest, because it still contains charges.",
      "A single stationary positive charge sitting alone in empty space.",
      "A moving electric charge, such as a current flowing through a wire.",
      "A stationary magnet placed near a wire, because they are close together.",
    ], correctIndex: 2,
    explanation: "A magnetic field is produced by moving electric charges (an electric current). A stationary charge makes only an electric field, a neutral atom at rest makes no significant field, and a stationary magnet does not create a new field just by being near a wire." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "What kind of charge motion is needed to *launch* an electromagnetic wave?",
    options: [
      "A charge that accelerates — speeds up, slows down, or wiggles back and forth.",
      "A charge moving at a perfectly steady, unchanging speed in a wire.",
      "A charge that stays completely still inside a strong magnet.",
      "A charge that is heated until it glows but does not move at all.",
    ], correctIndex: 0,
    explanation: "A charge moving at a steady rate makes a steady field — no wave. It is an accelerating charge (speeding up, slowing down, or oscillating) that launches an electromagnetic wave. That is exactly how an antenna works." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "How can an electromagnetic wave travel through the vacuum of empty space with no medium?",
    options: [
      "Tiny invisible air particles always fill space and carry the wave along.",
      "The wave borrows energy from nearby stars to push itself through the gap.",
      "It cannot — EM waves actually need a hidden medium we just can't detect.",
      "Changing electric and magnetic fields continuously regenerate each other.",
    ], correctIndex: 3,
    explanation: "A changing electric field creates a changing magnetic field, which creates a changing electric field, and so on. These linked fields sustain each other and travel through empty space — no medium required." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which type of electromagnetic wave has the highest frequency?",
    options: [
      "Radio waves, which are used to broadcast music to car stereos.",
      "Gamma rays, found at the high-frequency end beyond X-rays.",
      "Microwaves, the kind used by WiFi and to heat up food.",
      "Visible light, the part of the spectrum that human eyes can see.",
    ], correctIndex: 1,
    explanation: "Gamma rays sit at the high-frequency end of the electromagnetic spectrum, beyond X-rays. Radio waves are lowest, microwaves are just above radio, and visible light sits between infrared and ultraviolet." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "As you move across the spectrum from radio waves toward gamma rays, frequency increases. What happens to the wavelength?",
    options: [
      "The wavelength gets shorter, because $c = f\\lambda$ stays constant.",
      "The wavelength gets longer, because higher frequency stretches it out.",
      "The wavelength stays exactly the same all the way across the spectrum.",
      "The wavelength first grows and then shrinks back near the gamma end.",
    ], correctIndex: 0,
    explanation: "All EM waves travel at the same speed $c$, and $c = f\\lambda$ is fixed. So if frequency goes up, wavelength must go down — high frequency means short wavelength." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "WiFi, Bluetooth, and a microwave oven all operate at frequencies near 2.4 GHz. What does that tell you about them?",
    options: [
      "They are all forms of dangerous ionizing radiation like X-rays are.",
      "They must constantly interfere and cannot ever be used in one room.",
      "They all sit in the microwave region of the electromagnetic spectrum.",
      "They each travel at a different speed because they carry different data.",
    ], correctIndex: 2,
    explanation: "A frequency near 2.4 GHz places all three in the microwave region of the spectrum. They share that region but use different channels, encoding, and power levels, so they don't constantly interfere — and microwaves are not ionizing." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Why can high-frequency radiation like UV, X-rays, and gamma rays *ionize* atoms while radio waves cannot?",
    options: [
      "Radio waves move far too slowly through space to ever reach an atom.",
      "Higher-frequency radiation carries more energy per photon than radio does.",
      "Radio waves are blocked by the air, so they never actually touch matter.",
      "Low-frequency waves are made of particles while high ones are made of fields.",
    ], correctIndex: 1,
    explanation: "Higher frequency means more energy per photon. UV, X-rays, and gamma rays carry enough energy per photon to knock electrons off atoms (ionize them); radio and microwave photons carry far too little to do that." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A social media post claims that 5G phone signals are a form of X-ray radiation. Using the spectrum, the best response is —",
    options: [
      "Correct, since both 5G and X-rays are invisible they belong together.",
      "Correct, because any signal strong enough to reach a phone must be an X-ray.",
      "Partly true, because 5G turns into X-rays only when it passes through walls.",
      "False — 5G is microwave-region radiation, billions of times lower in frequency than X-rays.",
    ], correctIndex: 3,
    explanation: "5G (sub-6) runs near 3.5 GHz, in the microwave region. Medical X-rays are near $10^{18}$ Hz — hundreds of millions of times higher in frequency and energy. 5G is non-ionizing; X-rays are ionizing. The claim is false." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw a horizontal spectrum line. Mark radio, microwave, infrared, visible, ultraviolet, X-ray, and gamma in order. Add an arrow showing which way frequency and energy increase, and an arrow showing which way wavelength increases. Then place WiFi and a medical X-ray on the line. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about EM waves or the spectrum that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you learned the secret to wireless: don't shake a string — wiggle a charge, and let the linked electric and magnetic fields carry the energy across empty space. Where the wave lands on the spectrum decides everything it can do — from carrying your texts to lighting up an X-ray film. Next class we figure out why the microwave oven knocks out your Bluetooth. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "From Charges to the EM Spectrum",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5103,
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
