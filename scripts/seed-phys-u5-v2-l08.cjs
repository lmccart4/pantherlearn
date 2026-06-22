// seed-phys-u5-v2-l08.cjs
// U5 v2 — Arc 8 (CAPSTONE / CER): "Make a Recommendation" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L14 (Make a Recommendation) into the v2 challenge-arc transfer task:
// apply BOTH the wave model and the photon model to a NEW real-world decision (the
// school WiFi upgrade); use evidence to recommend a safe, effective use of radiation;
// defend the decision in CER format using THIS unit's physics. Revisit the DQB and the
// initial-vs-final class model. Through-line: "Send the Signal."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the other arcs. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc8.md (already sourced/audited).
// Argument-heavy capstone: favors short_answer (recommendation CER, transfer, peer-eval)
// over MC; only 4 factual concept-check MC. No embed for this arc.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l08-recommendation";

let _n = 0;
const id = (slug) => `v2u5l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Make a Recommendation",
    subtitle: "Unit 5 · Arc 8 — Waves and EM Radiation · CAPSTONE" },

  // ── CONNECT: recall the whole unit → the transfer question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "This is the last arc — the one where you prove the model is <span style=\"font-weight:700\">real</span>. A real model isn't one you can recite; it's one you can carry to a brand-new situation and still make a good call with. You cracked the microwave-vs-Bluetooth mystery, mapped the EM spectrum, figured out how radiation interacts with matter, how information rides on a wave, and how to tell a real safety claim from a scary one. Today you point all of that at a decision your own school actually has to make." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Pull up everything you earned this unit. <span style=\"font-weight:700\">Frequency</span> and <span style=\"font-weight:700\">wavelength</span> ($v = f\\lambda$). The spectrum, from radio up through visible to X-rays. Whether a wave gets <span style=\"font-weight:700\">absorbed, reflected, or transmitted</span> by a wall. <span style=\"font-weight:700\">Intensity</span> dropping off with distance. The difference between <span style=\"font-weight:700\">ionizing</span> and <span style=\"font-weight:700\">non-ionizing</span> radiation. Correlation versus causation. You're not learning new physics today — you're spending it. Every idea above is a tool you'll use in the next hour." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Unit Recall",
    intro: "Fast inventory of your toolkit before the task. Quantity over polish — just get the ideas on the page.",
    sections: [ { id: "recall", kind: "prompts", title: "What did this unit give you?",
      prompts: [
        { id: "q1", label: "Name TWO ideas from this unit about how frequency or wavelength affects how a signal travels (range, data, going through walls).", rows: 2 },
        { id: "q2", label: "In ONE sentence: how do you tell whether a radiation-safety worry is backed by physics or is just fear?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the capstone challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Make the Call",
    content: "Perth Amboy High School is upgrading its wireless network. The IT team put <span style=\"font-weight:700\">two proposals</span> on the table, and the principal wants a <span style=\"font-weight:700\">student recommendation backed by physics</span>. The building is a mix of old brick walls, big windows, and a central courtyard. The budget covers Proposal A <span style=\"font-weight:700\">or</span> Proposal B — not both. (You may also propose a justified hybrid if you can keep it inside that budget.)\n\nYour job isn't to pick a winner and stop. It's to explain <span style=\"font-weight:700\">why</span> that choice makes sense for THIS building, using frequency, wavelength, range, data capacity, building penetration, intensity, and safety. Then defend it in CER." },

  { id: id("setup"), type: "callout", icon: "🏫", style: "info", title: "The decision in front of you",
    content: "Routers have to cover classrooms <span style=\"font-weight:700\">through thick brick walls</span> and reach across a courtyard; signal slips far more easily through the windows. A smart meter sits on the exterior. Higher-frequency signals (like 6 GHz) carry more data but have <span style=\"font-weight:700\">shorter range</span> and are <span style=\"font-weight:700\">absorbed more by walls</span>; lower-frequency signals (like 2.4 GHz) travel farther and penetrate walls better but carry less data. Hold that trade-off the whole time." },

  { id: id("ml-proposals"), type: "mission_log", title: "Mission Log — Read the Two Proposals",
    intro: "Here are the two options. Copy the key facts into the table, then add ONE physics note per row — what this unit says about each frequency choice.",
    sections: [
      { id: "proptext", kind: "text", title: "The proposals on the table",
        label: "Proposal A: FEWER high-power WiFi 6 access points · 2.4 GHz + 5 GHz · wide coverage, moderate data · concern: some parents worry about constant RF exposure near classrooms.\nProposal B: MANY low-power WiFi 6E access points · 6 GHz + some 5 GHz · spot coverage, very high data, needs more units · concern: more total transmitters, shorter range per unit.",
        placeholder: "Anything you want to jot about the two options before you compare…",
        rows: 3 },
      { id: "compare", kind: "table", title: "Compare the proposals (add a physics note per row)",
        columns: [
          { key: "factor", label: "Factor", width: "150px", placeholder: "frequency / range / data / walls / safety" },
          { key: "a", label: "Proposal A (2.4 + 5 GHz)", placeholder: "what A does" },
          { key: "b", label: "Proposal B (6 GHz + 5 GHz)", placeholder: "what B does" },
          { key: "physics", label: "Physics note (this unit)", placeholder: "why, in wave/photon terms" },
        ], minRows: 4, addRowLabel: "Add a factor" } ] },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — map the building",
    instructions: "Sketch the school from above: brick walls, windows, the courtyard, a few classrooms. Mark where signal will struggle (through brick) and where it flows easily (windows, open courtyard). Drop access points where YOUR pick would put them. Rough is fine — this is your reasoning made visible.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-recommendation",
    title: "Class Challenge Board — Make the Call",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's built which part of the argument.",
    levels: [
      { n: 1, name: "Read Both Proposals", nameEs: "Lee Ambas Propuestas" },
      { n: 2, name: "Match Physics to the Building", nameEs: "Conecta la Física al Edificio" },
      { n: 3, name: "Weigh the Safety Claim", nameEs: "Evalúa la Afirmación de Seguridad" },
      { n: 4, name: "Make the Recommendation", nameEs: "Haz la Recomendación" },
      { n: 5, name: "Defend It in CER", nameEs: "Defiéndela en CER" },
    ] },

  { id: id("draw-call"), type: "sketch", title: "Draw Your Recommendation",
    instructions: "Redraw your building plan with your FINAL decision locked in: which proposal (or hybrid), where the access points go, and a short arrow-note at each tricky spot saying WHY the physics supports your placement. This sketch is the picture your CER will put into words.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause and Process — pencils up",
    content: "Stop comparing. Before you write the recommendation, get the reasoning straight on paper. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"I just like B\" into an argument a principal would actually trust." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Build the Argument",
    sections: [ { id: "sense", kind: "prompts", title: "Reason it out before you recommend",
      prompts: [
        { id: "q1", label: "The building has thick brick walls. Which frequency choice penetrates walls better, and why? Use $v = f\\lambda$ or absorption to explain.", rows: 3 },
        { id: "q2", label: "Proposal B carries much more data per access point but covers a smaller area. Why does higher frequency tend to mean more data but shorter range?", rows: 3 },
        { id: "q3", label: "A parent worries about \"constant RF exposure near classrooms.\" Is WiFi ionizing or non-ionizing radiation? Use intensity-with-distance and the ionizing/non-ionizing idea to respond fairly — neither dismiss nor exaggerate the worry.", rows: 3 },
        { id: "q4", label: "Why is naming the school's SPECIFIC features (brick, courtyard, window count, classroom density) stronger evidence than just saying \"B has more data\"?", rows: 2 },
        { id: "q5", label: "**Predict:** if the school later knocks out the brick walls and goes open-plan, would that push your recommendation toward A or B? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — the physics behind the trade-off",
    content: "Both bands are EM waves, so $v = f\\lambda$ with $v = 3.0 \\times 10^{8}\\,\\text{m/s}$.\n\nFor 2.4 GHz: $\\lambda = \\dfrac{v}{f} = \\dfrac{3.0 \\times 10^{8}\\,\\text{m/s}}{2.4 \\times 10^{9}\\,\\text{Hz}} \\approx 0.125\\,\\text{m}$ (about 12.5 cm).\n\nFor 6 GHz: $\\lambda = \\dfrac{3.0 \\times 10^{8}\\,\\text{m/s}}{6.0 \\times 10^{9}\\,\\text{Hz}} \\approx 0.050\\,\\text{m}$ (about 5 cm).\n\nThe longer 2.4 GHz wave diffracts around and penetrates brick more easily, so it reaches farther; the shorter 6 GHz wave gets absorbed and reflected more by walls but packs more cycles per second, so it can carry more data. That single trade-off — <span style=\"font-weight:700\">reach versus data</span> — is the heart of your whole recommendation. And both bands are non-ionizing: too low in photon energy to knock electrons off atoms, unlike X-rays or gamma rays farther up the spectrum." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Final Class Model — initial vs. final",
    intro: "This is the same class model you started on day one of this unit, when the microwave killed the Bluetooth. Pull up your INITIAL model and set it next to where you are now. Update it one last time so it captures everything: waves carry energy and information, frequency sets range and data, walls absorb/reflect/transmit, and non-ionizing radiation is low-energy. Then note: what does your FINAL model explain that your initial one couldn't?" },

  { id: id("qboard"), type: "question_board", boardId: "u5-l8",
    title: "Class Question Board",
    intro: "Last board of the unit. Post a question this capstone raised — about WiFi, radiation, or where these wave ideas show up next. Loose ends are how the next unit starts.",
    starters: [
      "If higher frequency means more data, why don't we just use ___?",
      "Is the radiation from ___ actually something to worry about?",
      "How do engineers decide where to place ___?",
      "Where else does the absorb/reflect/transmit idea show up in ___?",
    ] },

  // ── NAVIGATE: the CER recommendation + word tracker ──
  { id: id("cer-brief"), type: "callout", icon: "📝", style: "tip", title: "Now write it — CER format",
    content: "Time to make the call official. Write a recommendation a principal could act on. Three parts:\n\n<span style=\"font-weight:700\">CLAIM</span> — State your recommendation clearly (Proposal A, Proposal B, or a justified hybrid) and the main reason in one sentence.\n\n<span style=\"font-weight:700\">EVIDENCE</span> — Cite specific facts: from the proposal table (frequency, coverage, data, units needed) AND from this unit (range, building penetration, intensity, ionizing vs. non-ionizing).\n\n<span style=\"font-weight:700\">REASONING</span> — Connect the physics to THIS school's specific needs: the brick walls, the courtyard, classroom density, and the parent safety concern. This is where you earn the recommendation." },

  { id: id("sa-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Your recommendation (CER).</span> Recommend Proposal A, Proposal B, or a justified hybrid for the school WiFi upgrade, and defend it using this unit's physics.\n\n• CLAIM: your recommendation + the main reason.\n• EVIDENCE: facts from the proposal table AND from this unit (frequency, range, data capacity, building penetration, intensity, safety).\n• REASONING: how the physics connects to this school's specific needs — brick walls, courtyard, classroom density, parent concerns." },

  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Word Tracker (final)",
    intro: "Last words of the unit. The ones you reached for while building this argument are the ones you've earned.",
    sections: [
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept needing this arc — \"frequency,\" \"wavelength,\" \"penetration,\" \"absorb,\" \"transmit,\" \"intensity,\" \"non-ionizing,\" \"trade-off\"? Catch them here with what you now think they mean. This is the unit's whole vocabulary, earned." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A neighboring school made the opposite choice from yours and is unhappy: signal is strong in the open library but drops out in the brick-walled science wing, and a few parents are still asking about safety. Use the wave and photon models you built this unit to read the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Using this unit's physics, explain why the neighboring school's signal is strong in the open library but weak in the brick science wing — and give that school ONE physics-based fix. Use the ideas you earned (frequency, range, penetration, intensity)." },

  { id: id("sc-transfer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Transfer.</span> A hospital wants WiFi that reaches every room but is worried about interfering with sensitive equipment, and a city wants to blanket a downtown with public WiFi. Pick ONE. Would you lean toward higher-frequency (more data, shorter reach) or lower-frequency (more reach, less data) access points there, and why? Use this unit's physics." },

  { id: id("sc-peereval"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Peer review.</span> A classmate wrote: \"Pick Proposal B because 6 GHz is just better — it has the biggest numbers.\" Using CER, explain what's MISSING from their argument and how they'd fix it. (Hint: do the numbers connect to this building's brick walls and budget?)" },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Both 2.4 GHz and 6 GHz WiFi signals are electromagnetic waves. In a vacuum (or through air), how do their speeds compare?",
    options: [
      "The 6 GHz signal is faster because it has the higher frequency.",
      "They travel at the same speed — the speed of light for all EM waves.",
      "The 2.4 GHz signal is faster because its wavelength is longer.",
      "Their speeds depend only on the power of the access point sending them.",
    ], correctIndex: 1,
    explanation: "All electromagnetic waves travel at the speed of light ($3.0 \\times 10^{8}\\,\\text{m/s}$) in a vacuum, regardless of frequency. Higher frequency means shorter wavelength, not higher speed — that's what $v = f\\lambda$ tells you." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why does a lower-frequency 2.4 GHz signal generally pass through thick brick walls better than a higher-frequency 6 GHz signal?",
    options: [
      "Lower-frequency waves are ionizing, so they break through solid matter.",
      "Lower-frequency waves carry more data, which pushes them through walls.",
      "Higher-frequency waves are absorbed and reflected more by the wall material.",
      "Higher-frequency waves move too slowly to make it through dense brick.",
    ], correctIndex: 2,
    explanation: "Higher-frequency (shorter-wavelength) waves are absorbed and reflected more strongly by walls, so less of the signal transmits through. Lower-frequency waves penetrate solid material more easily. Speed is the same for both, and neither is ionizing." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "WiFi, Bluetooth, and visible light are all part of the electromagnetic spectrum. WiFi is classified as non-ionizing radiation. What does \"non-ionizing\" mean?",
    options: [
      "Its photons lack the energy to knock electrons off atoms or break bonds.",
      "It cannot travel through the air and needs a wire to carry the signal.",
      "It is the most dangerous form of radiation on the entire EM spectrum.",
      "It carries no energy at all, so it can never heat up any material.",
    ], correctIndex: 0,
    explanation: "Non-ionizing radiation (radio, microwave, WiFi, visible light) has photons with too little energy to ionize atoms — to knock electrons loose or break chemical bonds. Ionizing radiation (UV, X-rays, gamma) has high enough photon energy to do that. Non-ionizing waves still carry energy and can warm things, but they can't ionize." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "As you move farther from a WiFi access point, the signal gets weaker. What is happening to the wave's intensity?",
    options: [
      "Intensity increases with distance as the wave gathers more energy.",
      "Intensity stays exactly the same no matter how far away you stand.",
      "Intensity decreases because the same energy spreads over more area.",
      "Intensity decreases because the wave's speed drops as it travels out.",
    ], correctIndex: 2,
    explanation: "Intensity is energy spread over area. As the wave spreads out from the source, the same energy covers a larger area, so the intensity at any one spot drops with distance. The wave's speed does not change." },

  { id: id("sc-draw"), type: "sketch", title: "Jot and Draw",
    instructions: "Sketch a single access point in a hallway with a brick wall on one side and an open doorway on the other. Draw the signal: show it weakening as it spreads (intensity dropping), mostly blocked by the brick, and passing easily through the doorway. Label each effect. Neat doesn't matter — show your thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest part of building the recommendation:", rows: 1 },
        { id: "surprise", label: "One idea from this unit you ended up USING that surprised you, and why:", rows: 2 },
        { id: "proud", label: "The strongest piece of evidence in your CER, and why it's strong:", rows: 2 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "That's the unit. You started with a microwave that killed a Bluetooth signal and a pile of questions — and you just used wave physics to make a real recommendation a principal could act on. That's what a model is for: not to memorize, but to carry into a new room and make a good call. Proud of the work you did here. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Make a Recommendation",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5108,
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
