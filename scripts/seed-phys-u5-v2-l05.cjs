// seed-phys-u5-v2-l05.cjs
// U5 v2 — Arc 5: "Two Models, One Radiation" (OpenSciEd-spine / Rober-engine).
// Merges v1 L09 (Wave Model vs. Photon Model) + L10 (Mid-Unit Mastery Check) into one
// challenge-arc that DOUBLES as the mid-unit mastery. Physics: when the WAVE model of EM
// radiation is useful vs when the PHOTON model ($E = hf$) is needed; argue from evidence
// which model better explains a phenomenon; AND the summative — explain the
// microwave/Bluetooth anchor using wave properties + how EM radiation interacts with matter.
// Through-line: "Send the Signal." This is the unit's mid-point checkpoint.
//
// MASTERY-HEAVY: the Status Check IS the assessment — 8 factual MC (wave properties +
// EM-matter interactions + wave/photon model) + an integrated short_answer that explains
// the anchor. Challenge tracker is light (the work is the mastery write-up, not levels).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U1 v2 template. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc5.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.
// NO embed for this arc (per U5 consolidation map row 5).

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l05-wave-photon-mastery";

let _n = 0;
const id = (slug) => `v2u5l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Two Models, One Radiation",
    subtitle: "Unit 5 · Arc 5 — Waves & Electromagnetic Radiation" },

  // ── CONNECT: recall prior arcs → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you cracked the anchor: a microwave's metal mesh <span style=\"font-weight:700\">reflects</span> the waves and the closed box won't let the Bluetooth signal through. You've been treating EM radiation as a <span style=\"font-weight:700\">wave</span> the whole time — wavelength, frequency, interference, standing-wave hot spots. Today we hit the one place the wave model <span style=\"font-weight:700\">breaks</span>, meet a second model, and then — fair warning — you pull <span style=\"font-weight:700\">everything</span> together. This arc is the mid-unit checkpoint. Let's send the signal." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture a dim purple UV lamp and a bright red flashlight aimed at the same sheet of metal. The wave model says the brighter light should always dump more energy in — so the bright red one should win, right?\n\nIt doesn't. The dim UV light kicks electrons off the metal and the bright red light can't, no matter how bright you make it. That single stubborn fact is why physics keeps <span style=\"font-weight:700\">two</span> models for the same radiation. Today we figure out when to grab which one." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the arcs so far — quantity over polish. Then we go find where the wave model breaks.",
    sections: [ { id: "recall", kind: "prompts", title: "What do we already know about these waves?",
      prompts: [
        { id: "q1", label: "Name ONE thing the wave model has explained for us this unit (hot spots, the mesh, the spectrum…).", rows: 2 },
        { id: "q2", label: "Higher frequency means a *shorter* wavelength — and what about the energy each wave carries? Take a guess.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Argue the Model",
    content: "For any phenomenon I throw at you, decide <span style=\"font-weight:700\">which model</span> explains it — wave or photon — and back it with evidence. Diffraction, interference, standing waves, the spreading of a radio signal? Wave. Light ejecting electrons only above a certain frequency? Photon. Your job isn't done until you can look at a new situation and pick the right tool <span style=\"font-weight:700\">and say why</span>.\n\nThe rule from this whole unit still holds: write down what you observe before you decide which model owns it." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "The two models you're choosing between",
    content: "<span style=\"font-weight:700\">Wave model</span> — EM radiation spreads out like a wave. It has wavelength, frequency, and amplitude; it can interfere, diffract, and form standing waves. This is what explained the microwave hot spots, why Bluetooth passes through some materials and not others, and the entire electromagnetic spectrum.\n\n<span style=\"font-weight:700\">Photon model</span> — EM radiation also comes in energy packets called <span style=\"font-weight:700\">photons</span>, each carrying $E = hf$. A higher-frequency photon carries more energy. This explains the photoelectric effect — why a dim UV light ejects electrons while a bright red light can't — and why a single X-ray photon can knock electrons out of atoms but a single microwave photon cannot.\n\nBoth are real. We choose the one that explains the evidence in front of us." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — same radiation, two pictures",
    instructions: "Draw the SAME beam of light twice. On the left, draw it the wave way (a spread-out wave with a wavelength). On the right, draw it the photon way (a stream of little energy packets). Label which everyday behaviors you'd explain with each picture. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-mastery",
    title: "Class Challenge Board — Argue the Model",
    intro: "Name your team, then mark each level as you clear it. Light board today — the real work is the mastery write-up at the bottom. The whole class can see who's locked in which model.",
    levels: [
      { n: 1, name: "Spot a Wave Behavior", nameEs: "Detecta un Comportamiento de Onda" },
      { n: 2, name: "Spot a Photon Behavior", nameEs: "Detecta un Comportamiento de Fotón" },
      { n: 3, name: "Defend Your Pick", nameEs: "Defiende tu Elección" },
      { n: 4, name: "Explain the Anchor", nameEs: "Explica el Fenómeno Ancla" },
      { n: 5, name: "Pull It All Together", nameEs: "Une Todo" },
    ] },

  // NO embed for Arc 5 (per U5 consolidation map row 5).

  { id: id("ml-models"), type: "mission_log", title: "Mission Log — Model Sorting Log",
    intro: "As you work through the phenomena: <span style=\"font-weight:700\">before you assign a model, write what you actually observed.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "sortlog", kind: "table", title: "Which model owns this behavior?",
      columns: [
        { key: "phenom", label: "Phenomenon", placeholder: "diffraction, photoelectric…" },
        { key: "obs", label: "What you observe", placeholder: "bends around an edge / ejects e⁻" },
        { key: "model", label: "Wave or Photon?", width: "120px", placeholder: "wave / photon" },
        { key: "why", label: "Why that model", placeholder: "depends on frequency, not brightness" },
      ], minRows: 3, addRowLabel: "Add a phenomenon" } ] },

  { id: id("draw-spectrum"), type: "sketch", title: "Draw the Photon Energy Trend",
    instructions: "Sketch the EM spectrum as a left-to-right line from radio (low frequency) to gamma (high frequency). On top of it, draw little photon packets that get LARGER in energy as frequency goes up. Mark roughly where microwaves, visible light, UV, and X-rays sit. Show your current thinking — neat doesn't matter.",
    canvasHeight: 340 },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Evidence Table",
    intro: "Build the case for keeping BOTH models. One row per piece of evidence — name it and say which model it forces us to use.",
    sections: [ { id: "evidence", kind: "table", title: "Evidence for two models",
      columns: [
        { key: "ev", label: "Evidence / observation", placeholder: "dim UV ejects electrons…" },
        { key: "model", label: "Which model it needs", placeholder: "wave / photon" },
        { key: "fail", label: "Why the OTHER model can't explain it", placeholder: "brightness should've worked…" },
      ], minRows: 3, addRowLabel: "Add evidence" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sorting. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we labeled some phenomena\" into physics you can defend on the mastery check." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened — and why keep two models?",
      prompts: [
        { id: "q1", label: "Why do we keep BOTH the wave model and the photon model in physics instead of picking just one? Give one behavior each model wins.", rows: 3 },
        { id: "q2", label: "The photon energy is $E = hf$. In plain words, what does that equation tell you about a higher-frequency photon?", rows: 2 },
        { id: "q3", label: "A 5G tower emits at a higher frequency than an FM radio tower. Explain why 5G can carry more data but doesn't travel as far around obstacles — and why that's a *wave-model* story, not a photon-model one.", rows: 3 },
        { id: "q4", label: "A single X-ray photon can knock an electron out of an atom; a single microwave photon can't, even though a microwave oven is powerful. Use $E = hf$ to explain the difference.", rows: 2 },
        { id: "q5", label: "**Predict:** you keep a red light but crank its brightness way up. The wave model says \"more energy in.\" Why does the metal STILL eject no electrons? Which model explains that?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — does this photon have enough energy?",
    content: "The photon energy is $E = hf$, where $h$ is Planck's constant and $f$ is the frequency. The bigger the frequency, the bigger each packet of energy.\n\nCompare two photons:\n\nStep 1 — a microwave photon has a low frequency, so $E = hf$ is small. One packet can't ionize an atom; it mostly just makes molecules jiggle (heat).\n\nStep 2 — an X-ray photon has a much higher frequency, so $hf$ is large. One single packet carries enough energy to eject an electron from an atom (ionization).\n\nStep 3 — the takeaway: $$E_\\text{photon} = h \\cdot f$$ Energy rides on <span style=\"font-weight:700\">frequency</span>, not brightness. Brightness is just <span style=\"font-weight:700\">more</span> photons; it does not make each photon stronger. That single idea is why dim UV beats bright red at the photoelectric effect — and the wave model alone could never explain it." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Model — add the photon",
    intro: "Same model we've been building all unit. Today we tweak it: keep the wave picture that explains the mesh and the spectrum, and <span style=\"font-weight:700\">add</span> the photon picture for the frequency-dependent effects. Mark on the model which phenomena each side of it explains. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the two models or how radiation interacts with matter. These drive where the unit heads next.",
    starters: [
      "If light is a wave, how can it also be ___?",
      "Why does frequency decide the energy instead of ___?",
      "Which model explains ___?",
      "What happens to a photon when it ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the second half of the unit. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the signal ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"photon,\" \"frequency,\" \"photoelectric,\" \"ionize,\" \"wavelength,\" \"diffraction,\" \"amplitude\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) — THIS IS THE MID-UNIT MASTERY ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "Pull everything together. Show what you can do with the wave model, the photon model, and how radiation meets matter." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "Back to the mystery that started it all",
    content: "Remember the anchor: a Bluetooth speaker keeps playing on your desk, but the moment you set it inside a closed microwave oven — oven OFF — it loses the connection. You now have every tool you need: wave properties, the electromagnetic spectrum, absorption / reflection / transmission, standing waves, and the photon model. Use them to explain the mystery for real this time." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Explain the anchor — for real this time.</span> Why does a Bluetooth speaker lose its connection when it's placed inside a closed microwave oven? Make your reasoning visible.<br><br><span style=\"font-weight:700\">CLAIM:</span> State, in one sentence, why the Bluetooth signal is blocked.<br><span style=\"font-weight:700\">EVIDENCE:</span> Cite the frequency/wavelength of Bluetooth and microwaves, the behavior of metal, and the mesh screen in the door.<br><span style=\"font-weight:700\">REASONING:</span> Connect those facts to reflection, absorption, and the size of the holes in the mesh relative to the wavelength." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Which observation is best explained by the <span style=\"font-weight:700\">photon</span> model rather than the wave model?",
    options: [
      "A dim ultraviolet light can eject electrons from a metal surface.",
      "A radio wave spreads out as it leaves a tall broadcast tower.",
      "Microwaves form standing-wave hot spots inside a closed oven.",
      "A beam of light bends around the edge of a small obstacle.",
    ], correctIndex: 0,
    explanation: "The photoelectric effect — electrons ejected based on frequency, not brightness — is the classic evidence for photons. The other three (spreading, standing waves, bending around an edge) are all wave behaviors." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "The photon energy equation is $E = hf$. What does it tell you about a higher-frequency photon?",
    options: [
      "It travels faster through empty space than a lower-frequency one.",
      "It carries more energy than a lower-frequency photon does.",
      "It has a longer wavelength than a lower-frequency photon.",
      "It is always brighter than a lower-frequency photon is.",
    ], correctIndex: 1,
    explanation: "Energy is proportional to frequency, so a higher-frequency photon carries more energy. All photons travel at the speed of light, higher frequency means SHORTER wavelength, and brightness is about the NUMBER of photons, not each one's energy." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A bright red light shines on a metal and ejects no electrons. A dim UV light ejects electrons easily. What does this show?",
    options: [
      "Red light must be moving more slowly than the UV light here.",
      "The metal happens to absorb red light and reflect all the UV.",
      "Brighter light always carries more energy into the metal surface.",
      "Whether electrons are ejected depends on frequency, not brightness.",
    ], correctIndex: 3,
    explanation: "This is the photoelectric effect. Ejection depends on each photon's frequency (and so its energy), not on how bright the light is. UV photons are above the threshold frequency; red photons aren't, no matter how many you send." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Bluetooth and microwave-oven radiation both sit near the same part of the spectrum. Why does a closed metal oven block the Bluetooth signal?",
    options: [
      "The metal walls and mesh reflect the waves and trap them inside.",
      "The oven's photons are too high in frequency to leave the box.",
      "The signal is destroyed by the metal, since metal absorbs all energy.",
      "The speaker runs out of power the moment the oven door is shut.",
    ], correctIndex: 0,
    explanation: "Metal reflects these microwave-range waves, and the mesh holes in the door are far smaller than the wavelength, so the radiation can't pass through. The closed metal box acts as a shield — the signal is reflected/contained, not destroyed." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A 5G tower transmits at a higher frequency than an FM radio tower. Compared with FM radio, 5G signals —",
    options: [
      "are made of photons that can ionize atoms in the human body.",
      "travel faster through the air than the FM radio signals do.",
      "carry more data but don't bend as well around buildings.",
      "have a longer wavelength, so they reach much farther away.",
    ], correctIndex: 2,
    explanation: "Higher frequency means more bandwidth (more data) but a shorter wavelength that diffracts less around obstacles, so the range/line-of-sight is worse. Both signals travel at light speed, 5G has a SHORTER wavelength, and these frequencies are far too low to ionize atoms." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Why do physicists keep BOTH the wave model and the photon model instead of choosing only one?",
    options: [
      "The two models disagree, so we keep them until one is proven wrong.",
      "The wave model is for old physics and the photon model replaced it.",
      "Each model explains different evidence, so we use whichever one fits.",
      "Photons are real but waves are only a convenient math shortcut.",
    ], correctIndex: 2,
    explanation: "The wave model explains interference, diffraction, and standing waves; the photon model explains the photoelectric effect and ionization. Both describe real behavior, so we choose the model that explains the evidence in front of us." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A single X-ray photon can knock an electron out of an atom, but a single microwave photon cannot. Why?",
    options: [
      "The X-ray photon is brighter than the microwave photon is.",
      "The X-ray photon moves faster than the microwave photon does.",
      "There are simply far more X-ray photons hitting the atom at once.",
      "The X-ray photon has a higher frequency, so $E = hf$ is larger.",
    ], correctIndex: 3,
    explanation: "Energy rides on frequency ($E = hf$). X-rays are very high frequency, so each photon carries enough energy to ionize an atom; a single low-frequency microwave photon doesn't, regardless of how many there are." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "When EM radiation hits a material, the energy can be reflected, absorbed, or transmitted. Microwaves passing through the glass of a window are mostly —",
    options: [
      "transmitted, because the glass lets that radiation pass through it.",
      "ionized, because the glass breaks the waves into smaller photons.",
      "reflected, because clear glass bounces microwaves like a mirror does.",
      "absorbed, because glass heats up strongly under any radio waves.",
    ], correctIndex: 0,
    explanation: "Whether radiation reflects, absorbs, or transmits depends on the material and the wavelength. Microwaves largely pass THROUGH (transmit) ordinary glass, which is why they aren't blocked the way the oven's metal mesh blocks them." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw — the anchor, explained",
    instructions: "Draw the Bluetooth speaker inside the closed microwave oven. Show the Bluetooth waves trying to get OUT and what the metal walls + door mesh do to them (draw the waves reflecting back). Add a quick label for why the mesh holes block these waves (hole size vs. wavelength). Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This is the mid-unit checkpoint, so it tells Mr. McCarthy exactly what to reteach before we keep going." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest idea we pulled together today:", rows: 1 },
        { id: "surprise", label: "One thing about the wave/photon split that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "That's the halfway mark. You can now look at any glowing, buzzing, broadcasting thing and pick the right model — wave when it spreads and interferes, photon when frequency decides the energy — and you closed the loop on the microwave/Bluetooth mystery for real. Second half of the unit, we use this to send information across a whole city. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Wave vs Photon: Mid-Unit Mastery",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5105,
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
