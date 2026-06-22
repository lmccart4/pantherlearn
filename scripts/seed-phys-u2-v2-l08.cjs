// seed-phys-u2-v2-l08.cjs
// U2 v2 — Arc 8: UNIT CAPSTONE (CER). "Could a Rift Open in New Jersey?"
// Repackages v1 L14 (Could a New Rift Open in New Jersey?) into the capstone arc of
// the "Crack the Earth" through-line. Students transfer the WHOLE unit model — forces
// (balanced vs unbalanced), energy transfer (radioactive heat → mantle convection),
// plate-boundary types — to evaluate New Jersey geology and write an evidence-based
// CER. Revisits the DQB and the class's initial-vs-final rift model.
//
// Argument-heavy: short_answer-dominant (CER claim/evidence/reasoning, transfer, peer
// eval). Only 4 factual concept-check MC. NO embed (capstone is a written argument).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) via safeSeed.
// Content repackaged verbatim from _v1-source-u2/u2-arc8.md (already sourced/audited).
// NJ geology facts (Newark Basin, Palisades Sill, ~200 Mya, Mid-Atlantic Ridge, Ramapo
// Fault) come ONLY from that source. visible:false (Luke controls go-live).

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l08-nj-rift";

let _n = 0;
const id = (slug) => `v2u2l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🗽", title: "Could a Rift Open in New Jersey?",
    subtitle: "Unit 2 · Arc 8 — Plate Tectonics & Forces (Capstone)" },

  // ── CONNECT: recall the whole unit → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "We started this unit watching the ground tear open in Afar in 2005, and you built an explanation out of <span style=\"font-weight:700\">forces</span>, <span style=\"font-weight:700\">energy transfer</span>, <span style=\"font-weight:700\">convection</span>, and <span style=\"font-weight:700\">plate tectonics</span>. Today is the final boss: take that whole model and point it at the ground under your own feet. Could a new rift open in <span style=\"font-weight:700\">New Jersey</span>? You're not looking it up — you're <span style=\"font-weight:700\">arguing</span> it, with evidence. This is the capstone." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Be honest — when we started, \"the Earth is cracking\" sounded like a faraway-Africa problem. But the same physics doesn't care where you stand. A rift needs <span style=\"font-weight:700\">unbalanced forces pulling the crust apart</span> and an <span style=\"font-weight:700\">energy source</span> (mantle convection) to keep driving them. So the real question isn't \"is NJ special?\" It's: <span style=\"font-weight:700\">are those conditions present here?</span> That's a model you can test. Let's go." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Pull the unit model back into your head before you argue with it. Quantity over polish.",
    sections: [ { id: "recall", kind: "prompts", title: "What does it take to open a rift?",
      prompts: [
        { id: "q1", label: "In one sentence: what kind of FORCES are needed to start a rift, and where do they come from?", rows: 2 },
        { id: "q2", label: "What ENERGY SOURCE keeps a rift's plate motion going? Trace it back to its start.", rows: 2 },
        { id: "q3", label: "From Arc 7: what's the difference between a rift that *succeeds* and one that *fails*?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge brief + the NJ evidence ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Build the CER",
    content: "Your task: decide whether a new rift could open in New Jersey, and <span style=\"font-weight:700\">defend it with evidence from this whole unit</span>. You'll write a <span style=\"font-weight:700\">CER</span> — Claim, Evidence, Reasoning. A claim with no evidence is an opinion. Evidence with no reasoning is a pile of facts. The physics is in the <span style=\"font-weight:700\">reasoning</span>: connect NJ's situation to the forces and energy a rift requires.\n\nThe rule from all unit holds — say what the evidence is before you decide what it means." },

  { id: id("evidence"), type: "callout", icon: "🗺️", style: "info", title: "What you know about New Jersey",
    content: "Here's the evidence on the table — all of it is fair game for your CER:\n\n<span style=\"font-weight:700\">1.</span> New Jersey sits on top of the ancient <span style=\"font-weight:700\">Newark Basin rift system</span>, and the <span style=\"font-weight:700\">Palisades Sill</span> nearby is evidence of past rift volcanism.\n\n<span style=\"font-weight:700\">2.</span> Those rifts are <span style=\"font-weight:700\">failed rifts</span> — the forces that opened them stopped acting roughly <span style=\"font-weight:700\">200 million years ago</span>.\n\n<span style=\"font-weight:700\">3.</span> New Jersey is currently far from any active divergent plate boundary. The nearest active rifting is in the middle of the Atlantic Ocean, along the <span style=\"font-weight:700\">Mid-Atlantic Ridge</span>.\n\n<span style=\"font-weight:700\">4.</span> NJ still has small earthquakes today along old faults like the <span style=\"font-weight:700\">Ramapo Fault</span> — but small quakes on an existing fault are <span style=\"font-weight:700\">not</span> the same as a rift opening. Your job is to evaluate <span style=\"font-weight:700\">rifting</span>, not whether NJ ever has earthquakes." },

  { id: id("system"), type: "callout", icon: "🧭", style: "info", title: "Defining the System",
    content: "For this transfer task, the <span style=\"font-weight:700\">system</span> is the crust and upper mantle beneath New Jersey and the surrounding region. The <span style=\"font-weight:700\">surroundings</span> include the convecting mantle below, neighboring tectonic plates, and the atmosphere above. A new rift would require <span style=\"font-weight:700\">unbalanced forces from the surroundings</span> to pull the system apart." },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-nj-rift",
    title: "Class Challenge Board — Build the NJ Rift CER",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's nailed which part of the argument.",
    levels: [
      { n: 1, name: "State a Clear Claim", nameEs: "Plantea una Afirmación Clara" },
      { n: 2, name: "Gather the Evidence", nameEs: "Reúne la Evidencia" },
      { n: 3, name: "Reason with Forces & Energy", nameEs: "Razona con Fuerzas y Energía" },
      { n: 4, name: "Address the Counter-Evidence", nameEs: "Aborda la Contraevidencia" },
      { n: 5, name: "Write the Full CER", nameEs: "Escribe el CER Completo" },
    ] },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — map your argument (before you write)",
    instructions: "Before you write a word of the CER, sketch it as a map: a box for your CLAIM, branches for each piece of EVIDENCE you'll use, and arrows showing the REASONING that links each piece to forces or energy. This is your outline — messy is fine.",
    canvasHeight: 360 },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Evidence Sort",
    intro: "Sort the evidence before you argue with it. For each piece, decide whether it points TOWARD a new rift being likely, AGAINST it, or is irrelevant to *rifting* — and say why.",
    sections: [ { id: "evtable", kind: "table", title: "Sorting the New Jersey evidence",
      columns: [
        { key: "evidence", label: "Evidence", placeholder: "Newark Basin, Palisades Sill…" },
        { key: "points", label: "Points FOR / AGAINST / irrelevant?", placeholder: "for / against / irrelevant" },
        { key: "why", label: "Why — connect it to forces or energy", placeholder: "because the forces…" },
      ], minRows: 4, addRowLabel: "Add a piece of evidence" } ] },

  { id: id("draw-model"), type: "sketch", title: "Draw — NJ through the unit model",
    instructions: "Redraw New Jersey's crust + upper mantle as our unit model would show it. Mark whether the forces on the system are balanced or unbalanced right now, where (if anywhere) mantle convection is driving motion, and what plate-boundary setting NJ is in. Show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sorting. Now turn the evidence into reasoning. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — the reasoning is what makes it physics instead of a guess." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Turn the evidence into reasoning",
      prompts: [
        { id: "q1", label: "A rift needs unbalanced forces pulling the crust apart. Are those forces acting on New Jersey right now? What's your evidence?", rows: 3 },
        { id: "q2", label: "The Newark Basin IS a rift — so why doesn't its existence prove a *new* rift is coming? Connect it to *failed* rifts.", rows: 3 },
        { id: "q3", label: "The Ramapo Fault produces small earthquakes. Explain why that is NOT evidence for a new rift opening. (What's the difference?)", rows: 3 },
        { id: "q4", label: "Mantle convection drives plate motion. Is there an active convection-driven divergent boundary at New Jersey? Where is the nearest one?", rows: 2 },
        { id: "q5", label: "<span style=\"font-weight:700\">Time scale matters.</span> Why does \"could a rift open\" need a time frame attached to be a scientific claim? Compare \"in your lifetime\" vs \"in 200 million years.\"", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Final Model — initial vs. final",
    intro: "This is the LAST tweak. Pull up the rift model the class first drew back in Arc 1 — the day the ground split in Afar. Set it next to the model you'd draw today. Mark every place your thinking changed (forces, energy source, convection, boundary types) and copy the <span style=\"font-weight:700\">final</span> model into your Mission Log. That before-and-after IS your unit growth." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l8",
    title: "Class Question Board — back to the DQB",
    intro: "Open the Driving Question Board from Arc 1. Which questions did we answer this unit? Post ONE question you can now answer (with the answer) AND one question you still have. Capstones close some doors and open others.",
    starters: [
      "We can now answer \"___\" because ___.",
      "I still wonder how ___ if ___.",
      "If the forces on NJ ever changed, would ___?",
      "How do scientists know a rift has truly *failed* and not just ___?",
    ] },

  // ── NAVIGATE: lock the CER as the testable claim + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Lock Your Claim + Word Tracker",
    intro: "Before you write the full CER, lock the claim you'll defend. A sharp claim makes the rest easier.",
    sections: [
      { id: "claim", kind: "text", title: "My locked CLAIM (with a time scale)",
        label: "State whether a new rift is likely, unlikely, or impossible — and over what time scale.",
        placeholder: "A new rift in NJ is ___ within ___ because ___.",
        hint: "*A claim without a time scale isn't testable. Attach one.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "The words you needed to argue this — \"rift,\" \"failed rift,\" \"divergent boundary,\" \"convection,\" \"unbalanced force,\" \"fault,\" \"transfer\"? Catch them here with what you THINK they mean. This is the unit's whole vocabulary, earned." },
    ] },

  // ── PROCESS: the CER write + transfer + peer eval (argument-heavy) ──
  { id: id("sc-hdr"), type: "section_header", icon: "✍️", title: "Write the CER",
    subtitle: "This is the capstone deliverable — your evidence-based argument. Take it seriously." },

  { id: id("upload"), type: "evidence_upload", title: "Attach your CER map or notes (optional)",
    instructions: "If you sketched your argument map on paper or built a slide, snap a photo and attach it here alongside your written CER below." },

  { id: id("cer-claim"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">CLAIM.</span> State clearly whether you think a new rift is likely, unlikely, or impossible in New Jersey — and over what time scale. One or two sentences." },

  { id: id("cer-evidence"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">EVIDENCE.</span> Cite the specific evidence that supports your claim: NJ's ancient rifts (Newark Basin / Palisades Sill), its current plate setting and distance from the Mid-Atlantic Ridge, the Ramapo Fault, and the forces/energy transfer a rift requires. Use at least three pieces." },

  { id: id("cer-reasoning"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">REASONING.</span> This is the physics. Explain HOW unbalanced forces, mantle convection, and the conditions for a *successful* rift apply to New Jersey. Connect each piece of your evidence to the claim — don't just list facts, explain why they support (or push against) a new rift." },

  { id: id("transfer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Transfer.</span> A geologist studying East Africa says the Afar region is an *active, succeeding* rift while New Jersey's Newark Basin is a *failed* one. Using the unit model, explain what is physically different between the two places — in terms of forces and energy — that makes one keep going and the other stop." },

  { id: id("sc-hdr2"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy see what stuck across the unit." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What basic force condition is required for a new rift to begin pulling the crust apart?",
    options: [
      "Balanced forces, because the crust must stay perfectly still to crack.",
      "Unbalanced forces that pull the crust apart in opposite directions.",
      "No forces at all, since rifts form only where the ground is at rest.",
      "Compression forces that squeeze the crust together from both sides.",
    ], correctIndex: 1,
    explanation: "A rift opens when unbalanced (net) forces pull the crust apart. Balanced forces produce no change; compression squeezes crust together (forming mountains), it doesn't open a rift." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "What ultimately provides the energy that drives the plate motion needed for rifting?",
    options: [
      "Sunlight warming the surface of the crust from directly above it.",
      "The kinetic energy of ocean tides pulling on the edges of plates.",
      "Mantle convection, driven by heat from radioactive decay inside Earth.",
      "Friction between two plates sliding past each other along a fault.",
    ], correctIndex: 2,
    explanation: "Heat from radioactive decay in Earth's interior drives mantle convection, which transfers thermal energy into the mechanical motion of plates. That motion is what can pull crust apart." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "New Jersey's Newark Basin is described as a \"failed rift.\" What does that mean?",
    options: [
      "It is a rift that opened but then the forces driving it stopped acting.",
      "It is a rift that is still actively widening a little more with each passing year.",
      "It is a place where a rift collapsed and built a tall mountain range.",
      "It is a fault that produces earthquakes but never opened any rift.",
    ], correctIndex: 0,
    explanation: "A failed rift opened in the past but the unbalanced forces that drove it stopped — for the Newark Basin, roughly 200 million years ago. It is no longer actively widening." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Why are the small earthquakes on New Jersey's Ramapo Fault NOT evidence that a new rift is opening?",
    options: [
      "Because earthquakes only ever happen near active volcanoes and never along old faults.",
      "Because those quakes are too large to be caused by ordinary rifting.",
      "Because New Jersey is located directly on the Mid-Atlantic Ridge today.",
      "Because slipping on an existing old fault is not the same as crust pulling apart.",
    ], correctIndex: 3,
    explanation: "Small quakes mean stored stress is releasing along an old fault — the crust slipping, not separating. Rifting is the crust being pulled apart by unbalanced divergent forces, which is a different process." },

  { id: id("sc-peer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Peer evaluation.</span> Trade CERs with a partner. Name ONE thing their argument does well, and ONE place their reasoning could connect the evidence to forces or energy more clearly. Be specific and kind — you're helping them strengthen it." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw — the verdict",
    instructions: "In one quick sketch, show your final verdict: NJ's crust with arrows for the forces acting on it right now (balanced or unbalanced?), and a label for whether a new rift is likely on a human time scale. This is your argument in one picture.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel about your CER right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to wrap up the unit." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Unit Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go — close the unit",
      prompts: [
        { id: "changed", label: "Compare your Arc 1 rift model to today's. The biggest thing that changed in your thinking:", rows: 2 },
        { id: "evidence", label: "The single strongest piece of evidence in your NJ argument, and why:", rows: 2 },
        { id: "word", label: "One word from this unit you now actually own *(→ Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You took a model you built from a crack in Africa and used it to make a defensible call about the ground under your own school. That's the whole game — physics isn't a list of facts, it's a tool you point at new questions. Forces, energy, convection, plates: you've got them now. Great unit. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Could a Rift Open in New Jersey?",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2108,
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
