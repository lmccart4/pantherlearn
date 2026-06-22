// seed-phys-u5-v2-l07.cjs
// U5 v2 — Arc 7: "Evaluating Radiation Safety Claims" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L13 (Evaluating Safety Claims) into one challenge-arc: "Read the
// Claim." Distinguish evidence vs correlation vs causation in media radiation-safety
// posts; use FREQUENCY (ionizing vs non-ionizing) + INTENSITY/exposure to evaluate the
// physics of a claim; write a sourced evaluation in CER format. Through-line: "Send the
// Signal" — the same RF that carries your signal also carries the scare headlines; learn
// to tell a real risk from a viral one. Non-ionizing-RF safety: evidence-based + calm,
// NOT fearmongering.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U1 v2 template (seed-phys-u1-v2-l02.cjs).
// Content repackaged from drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc7.md
// (already sourced/audited). No embed for this arc.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l07-safety-claims";
// No embed for this arc. Real sources cited via external_link blocks (from u5-arc7.md):
const WHO_5G = "https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks-and-health";
const FCC_RF = "https://www.fcc.gov/radiofrequency-safety";

let _n = 0;
const id = (slug) => `v2u5l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Evaluating Radiation Safety Claims",
    subtitle: "Unit 5 · Arc 7 — Waves & Electromagnetic Radiation" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you got a real signal across town — towers, antennas, the works. So you already know the air around you is full of radio waves carrying everyone's calls, WiFi, and Bluetooth. Today someone in your feed claims those same waves are <span style=\"font-weight:700\">making people sick</span>. Your job isn't to panic and it isn't to scoff — it's to <span style=\"font-weight:700\">evaluate the claim like a physicist</span>. Bring the science, stay calm." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "You've seen the headlines: \"5G causes cancer,\" \"WiFi is frying your brain,\" \"hold your phone away from your head.\" Some of those posts point to real studies. Most misread <span style=\"font-weight:700\">correlation</span> as <span style=\"font-weight:700\">causation</span>, ignore the gap between <span style=\"font-weight:700\">frequency</span> and <span style=\"font-weight:700\">intensity</span>, or cite a source that falls apart the second you check it.\n\nHere's the physics that cuts through the noise. Radiation splits into two camps by the <span style=\"font-weight:700\">energy each photon carries</span>, and that energy depends on the frequency: $E = h f$. High-frequency photons (UV, X-rays, gamma) carry enough energy to knock electrons loose and damage DNA — that's <span style=\"font-weight:700\">ionizing</span>. Radio, microwave, WiFi, and all of 5G are far lower frequency — <span style=\"font-weight:700\">non-ionizing</span>. They can warm things up, but they can't break the molecular bonds in DNA. That single threshold decides whether a claim is even physically plausible." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall + first reactions — quantity over polish. Then we go evaluate a real claim.",
    sections: [ { id: "recall", kind: "prompts", title: "What do you already believe?",
      prompts: [
        { id: "q1", label: "Write down ONE thing you've heard online about phones, WiFi, 5G, or towers being dangerous. (Just report it — we'll test it later.)", rows: 2 },
        { id: "q2", label: "On a gut level, do you believe it? What would it take to *change* your mind either way?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Claim",
    content: "Find a real radiation-safety claim — a post, a headline, a video — and <span style=\"font-weight:700\">put it on trial</span>. Ask the two questions that cut through everything: what's the <span style=\"font-weight:700\">frequency</span> (ionizing or not?) and what's the <span style=\"font-weight:700\">intensity/exposure</span> (how much energy, how close, how long?). Separate the <span style=\"font-weight:700\">evidence</span> from the <span style=\"font-weight:700\">correlation</span> from the <span style=\"font-weight:700\">causation</span>. Your verdict isn't \"I feel like it's fine\" — it's a sourced <span style=\"font-weight:700\">CER</span> you could defend out loud.\n\nThere are levels. They get harder. The rule still holds — name what the claim actually says before you decide if it's true." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "Two questions that cut through the noise",
    content: "<span style=\"font-weight:700\">1. What is the frequency?</span> Ionizing radiation (UV, X-rays, gamma) has enough energy per photon to damage DNA. Non-ionizing radiation (radio, microwave, visible light, and all 5G including mmWave) does not — it sits far below the ionization threshold.\n\n<span style=\"font-weight:700\">2. What is the intensity / exposure?</span> A high-intensity source held close to your body for a long time delivers more energy than a weak source far away. Intensity and exposure time matter — but for non-ionizing waves the effect is warming, not DNA damage.\n\nA claim like \"5G causes cancer\" needs <span style=\"font-weight:700\">two</span> things to be convincing: (1) evidence that exposed people develop cancer at a higher rate than similar unexposed people, AND (2) a physical mechanism for how 5G photons could damage cells. So far major health agencies report no consistent evidence at consumer frequencies and power levels." },

  { id: id("link-who"), type: "external_link", url: WHO_5G,
    title: "Sample Claim Set A — WHO: 5G mobile networks and health",
    description: "The World Health Organization's Q&A on 5G and health — a reliable agency source to test claims against.",
    buttonLabel: "Open WHO 5G Q&A", icon: "🌐", openInNewTab: true },

  { id: id("link-fcc"), type: "external_link", url: FCC_RF,
    title: "Sample Claim Set B — FCC Radio Frequency Safety",
    description: "The FCC's page on radio-frequency exposure limits and safety — the US regulator's evidence base.",
    buttonLabel: "Open FCC RF Safety", icon: "📶", openInNewTab: true },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — where does YOUR claim's radiation sit?",
    instructions: "Draw a simple line for the EM spectrum from radio on the left to gamma on the right. Mark the ionization threshold (somewhere in the UV range). Then mark where the source in your chosen claim sits — WiFi, 5G, a phone, a tower. Is it left of the line (non-ionizing) or right (ionizing)? Wrong is fine — sketch first so we can check it later.",
    canvasHeight: 340 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-safety-claims",
    title: "Class Challenge Board — Read the Claim",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's putting which claim on trial.",
    levels: [
      { n: 1, name: "Find a Real Claim", nameEs: "Encuentra una Afirmación Real" },
      { n: 2, name: "Frequency Check", nameEs: "Revisa la Frecuencia" },
      { n: 3, name: "Correlation or Causation?", nameEs: "¿Correlación o Causalidad?" },
      { n: 4, name: "Judge the Source", nameEs: "Evalúa la Fuente" },
      { n: 5, name: "Write the Verdict (CER)", nameEs: "Escribe el Veredicto (CER)" },
    ] },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Claim Trace Log",
    intro: "As you put your claim on trial: <span style=\"font-weight:700\">before you call something \"proof,\" write what the source actually shows.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "claimlog", kind: "table", title: "Putting the claim on trial",
      columns: [
        { key: "part", label: "Claim part", width: "120px", placeholder: "the headline / the stat" },
        { key: "freq", label: "Frequency: ionizing or not?", placeholder: "non-ionizing (radio/WiFi)" },
        { key: "type", label: "Evidence / correlation / causation?", placeholder: "correlation only" },
        { key: "source", label: "Source quality", placeholder: "WHO / random blog / no source" },
      ], minRows: 3, addRowLabel: "Add a part" } ] },

  { id: id("draw-verdict"), type: "sketch", title: "Draw Your Verdict Map",
    instructions: "Map your claim: draw the source on one side, an arrow to the supposed effect, and label that arrow \"correlation\" or \"causation.\" Add a note for the frequency (ionizing/non-ionizing) and the intensity/exposure. Circle the weakest link in the argument. Don't worry about neat — show your current thinking.",
    canvasHeight: 320 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop scrolling. Now we figure out what your evidence actually means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"a post said so\" into a real evaluation." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does your claim really show?",
      prompts: [
        { id: "q1", label: "Explain the difference between *correlation* and *causation* in your own words. Give one example from your claim where the two got mixed up.", rows: 3 },
        { id: "q2", label: "Is the radiation in your claim ionizing or non-ionizing? Use the frequency to justify it. Why does that distinction matter for whether DNA damage is even possible?", rows: 3 },
        { id: "q3", label: "Two things are needed to support a causation claim: (1) higher rates in exposed people, and (2) a physical mechanism. Which one (or both) does your claim fail to show?", rows: 3 },
        { id: "q4", label: "Why is it weak reasoning to say \"cancer rates rose the same year 5G towers went up, so 5G caused it\"? Name a *third factor* that could explain both trends.", rows: 2 },
        { id: "q5", label: "<span style=\"font-weight:700\">Apply:</span> a friend says \"a stronger WiFi router is more dangerous because it's higher intensity.\" Using the ionizing/non-ionizing idea, how would you respond — calmly and with physics?", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — does the photon have enough energy?",
    content: "Whether radiation can ionize comes down to the energy of one photon: $E = h f$, where $h$ is Planck's constant and $f$ is the frequency. Breaking a molecular bond in DNA takes roughly the energy of an <span style=\"font-weight:700\">ultraviolet</span> photon or higher — that's the ionization threshold.\n\nA 5G mid-band signal sits around $f \\approx 3.5 \\times 10^9\\,\\text{Hz}$ (a few gigahertz). A UV photon that can damage DNA sits around $f \\approx 1 \\times 10^{15}\\,\\text{Hz}$. Because $E$ is proportional to $f$, that UV photon carries on the order of $\\frac{10^{15}}{3.5 \\times 10^9} \\approx 3 \\times 10^5$ times more energy per photon than the 5G one.\n\nSo no matter how many low-frequency photons you pile up, none of them individually carries enough energy to ionize. Turning up the <span style=\"font-weight:700\">intensity</span> sends more photons (more warming) but does not raise the energy <span style=\"font-weight:700\">per</span> photon. That's the whole reason non-ionizing radiation can't break DNA bonds the way UV or X-rays can." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Model — add the safety lens",
    intro: "Same wave/EM model we've built all unit. Today we tweak it: mark the <span style=\"font-weight:700\">ionization threshold</span> on the spectrum, label which signals fall non-ionizing vs ionizing, and add a note for how <span style=\"font-weight:700\">intensity</span> differs from <span style=\"font-weight:700\">frequency</span>. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about radiation, evidence, or how to judge a claim. These drive where the unit heads next.",
    starters: [
      "How do scientists actually test whether ___ causes ___?",
      "If non-ionizing radiation just warms things, why do people worry about ___?",
      "How would I check whether a source about ___ is reliable?",
      "What level of exposure to ___ would actually matter?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the capstone. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by gathering and checking evidence — not just by having an opinion.",
        placeholder: "How could we tell if ___ really ___?",
        hint: "*A good one can be answered by checking evidence, not just by arguing.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"ionizing,\" \"non-ionizing,\" \"correlation,\" \"causation,\" \"intensity,\" \"exposure,\" \"mechanism,\" \"evidence\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A post in your feed reads: \"Cancer rates in our town went up the same year the new 5G tower was installed — so the 5G tower is causing cancer. Share to warn your family.\" It has thousands of shares and no source link. Use the physics from today to decide what to do with it." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Evaluate the radiation-safety claim.</span> Decide whether it is <span style=\"font-weight:700\">supported, unsupported, or misleading</span>, and write your verdict in <span style=\"font-weight:700\">CER</span> format.\n\n<span style=\"font-weight:700\">CLAIM:</span> State whether the claim is supported, unsupported, or misleading.\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite a real source and what it actually says about the frequency/intensity involved and any study or data.\n<span style=\"font-weight:700\">REASONING:</span> Explain how the physics of ionization (frequency), exposure (intensity), and correlation-vs-causation shapes your evaluation. Stay evidence-based and calm — no fear, no scoffing." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A blog post says, \"Cancer rates rose in the same year 5G towers were installed, so 5G must cause cancer.\" What is the main flaw in this argument?",
    options: [
      "The claim ignores the wavelength of the 5G signals involved.",
      "The claim confuses correlation with causation in its reasoning.",
      "The claim assumes that all radiation must be ionizing radiation.",
      "The claim reports the cancer rates using too many decimal places.",
    ], correctIndex: 1,
    explanation: "Two trends happening in the same year does not prove one caused the other. A causation claim needs a controlled study showing higher rates in exposed people AND a plausible physical mechanism." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "What is the key physical difference between ionizing and non-ionizing radiation?",
    options: [
      "Ionizing photons carry enough energy to knock electrons loose and damage DNA.",
      "Non-ionizing radiation always travels faster than ionizing radiation does.",
      "Ionizing radiation is artificial while non-ionizing radiation is natural.",
      "Non-ionizing radiation has a shorter wavelength than ionizing radiation.",
    ], correctIndex: 0,
    explanation: "Ionizing radiation (UV, X-rays, gamma) has enough energy per photon to remove electrons from atoms and damage DNA. Non-ionizing radiation (radio, microwave, WiFi, 5G) does not." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Which list contains ONLY non-ionizing types of radiation?",
    options: [
      "X-rays, gamma rays, and ultraviolet light from the Sun.",
      "Gamma rays, microwaves, and the visible light from a lamp.",
      "Radio waves, microwaves, WiFi, and 5G mobile signals.",
      "Ultraviolet light, radio waves, and the WiFi in a school.",
    ], correctIndex: 2,
    explanation: "Radio, microwave, WiFi, and all 5G sit below the ionization threshold — they are non-ionizing. UV, X-rays, and gamma are ionizing, so any list including them is wrong." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "The energy of a single photon is given by $E = h f$. What does this tell you about a 5G signal compared with an X-ray?",
    options: [
      "The 5G photon carries more energy because 5G towers use more power.",
      "Both photons carry equal energy because they are both forms of light.",
      "The X-ray photon carries more energy because it has a higher frequency.",
      "The 5G photon carries more energy because it has a longer wavelength.",
    ], correctIndex: 2,
    explanation: "Energy per photon is proportional to frequency ($E = h f$). X-rays have a far higher frequency than 5G, so each X-ray photon carries far more energy — enough to ionize." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A claim that \"5G causes cancer\" would be convincing only if it provided which TWO things?",
    options: [
      "A scary headline and a large number of shares on social media.",
      "Higher cancer rates in exposed people AND a physical mechanism.",
      "A long list of decimal places and a famous person's endorsement.",
      "A photo of a 5G tower AND a quote from an unnamed expert source.",
    ], correctIndex: 1,
    explanation: "Supporting a causation claim takes evidence that exposed people develop cancer at higher rates than similar unexposed people, plus a physical mechanism explaining how the radiation could cause the damage." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Turning up the intensity of a WiFi router sends MORE photons. Why does that still not make it able to damage DNA?",
    options: [
      "Higher intensity actually lowers the frequency below a safe level.",
      "The extra photons cancel each other out before reaching any cells.",
      "More photons means more heating, which always repairs DNA damage.",
      "Each non-ionizing photon still lacks the energy to ionize an atom.",
    ], correctIndex: 3,
    explanation: "Intensity changes how MANY photons arrive, not the energy of EACH one. Since every WiFi photon is non-ionizing, piling up more of them adds warming but never the per-photon energy needed to break DNA bonds." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the EM spectrum as a line from radio (left) to gamma (right). Mark the ionization threshold. Place 5G/WiFi and X-rays on it. Then add a short note: \"correlation\" vs \"causation\" — what's the difference? Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about radiation or evidence that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You put a viral claim on trial today — checked the frequency, separated correlation from causation, judged the source, and wrote a verdict you could defend. That's the most useful kind of physics: the kind that keeps you (and your family) from getting played by a scary headline. Next class we pull it all together. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Evaluating Radiation Safety Claims",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5107,
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
