// seed-phys-u6-v2-l08.cjs
// U6 v2 — Arc 8: UNIT + COURSE CAPSTONE (transfer). "Transfer: A New \"New Star\""
// (OpenSciEd-spine / Rober-engine). Repackages v1 L14 (Transfer Task: A New "New Star")
// into the capstone challenge-arc for "Read the Starlight." Students apply the whole unit
// model to a BRAND-NEW astronomical observation, evaluate a sensationalized media claim
// using evidence from spectra / H-R / fusion / redshift, and communicate a reasoned CER
// conclusion. Revisits the DQB + initial-vs-final class model. This also CLOSES the physics
// year — the final transfer task of the whole course.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the 5 platform
// blocks + composed Status Check. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc8.md (already sourced/audited).
//
// Argument-heavy capstone: favors short_answer (transfer CER, media-claim eval, peer-eval,
// year-end reflection) over MC; only 3 factual concept-check MC. No embed.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). gradesReleased:true. English-primary; ES via app translation + nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l08-transfer";
// Capstone — no embed (per task). Status Check scenario is described in text; a generated
// diagram (new "new star" light curve / spectrum) can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u6l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌟", title: "Transfer: A New \"New Star\"",
    subtitle: "Unit 6 · Arc 8 — Capstone · Read the Starlight" },

  // ── CONNECT: recall the unit + course → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "All unit, you learned to <span style=\"font-weight:700\">read starlight</span> — spectra are element fingerprints, the H-R diagram sorts stars by mass and life stage, fusion turns mass into light ($E=mc^2$), and redshift shows the universe expanding. Today is the real test: a <span style=\"font-weight:700\">brand-new</span> \"new star\" just lit up, a scary headline is going viral, and you're the science advisor. Can your model handle a situation you've never seen?\n\nThis is also the <span style=\"font-weight:700\">last day of physics this year</span>. Let's finish strong." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A model you can only repeat back isn't worth much. A model you can <span style=\"font-weight:700\">carry to a new situation</span> and still make sense of — that's the real thing. That's what a transfer task checks.\n\nWe opened this unit with a \"new star\" that appeared where there wasn't one. You couldn't explain it on day one. Today a different \"new star\" shows up, with a panic headline attached, and you get to be the expert in the room. Write down what you see before you decide what's happening — same rule as day one." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from across the unit — quantity over polish. Pull the tools you'll need today out of the toolbox.",
    sections: [ { id: "recall", kind: "prompts", title: "Your starlight toolkit",
      prompts: [
        { id: "q1", label: "Name ONE thing a star's spectrum can tell you (think: what the emission lines mean).", rows: 2 },
        { id: "q2", label: "What event, that you studied this unit, can make a star suddenly get thousands of times brighter? Name at least one.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Advise on the \"New Star\"",
    content: "Astronomers report that a faint star in a nearby galaxy <span style=\"font-weight:700\">suddenly brightened by thousands of times</span>. A popular news headline screams: <span style=\"font-weight:700\">\"MYSTERIOUS STAR EXPLOSION COULD WIPE OUT EARTH, SCIENTISTS WARN.\"</span>\n\nYou are the science advisor. Use the unit's model to figure out (1) what is most likely happening, (2) whether the headline is justified, and (3) what evidence would settle the question. Your job isn't done until your claim is backed by <span style=\"font-weight:700\">specific evidence</span> — spectra, brightness, distance, life cycle, nucleosynthesis — and clear reasoning.\n\nThere are levels. They get harder. Write what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔭", style: "info", title: "The data from the announcement",
    content: "<span style=\"font-weight:700\">Location:</span> a nearby galaxy roughly 2 million light-years away.\n<span style=\"font-weight:700\">Event:</span> a faint star suddenly became one of the brightest objects in the galaxy.\n<span style=\"font-weight:700\">Spectrum:</span> strong emission lines of hydrogen, helium, oxygen, and iron.\n<span style=\"font-weight:700\">Duration:</span> brightened over days, stayed bright for weeks.\n<span style=\"font-weight:700\">Distance:</span> the galaxy is far outside our Milky Way; the light took about 2 million years to reach us.\n\nClue for later: light travels at a fixed speed, so 2 million light-years away means you are seeing this event as it happened <span style=\"font-weight:700\">2 million years ago</span>. The scenario is realistic but simplified for class." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — what could do this? (before you commit)",
    instructions: "Sketch your first guess: what kind of object or event could make a star jump thousands of times brighter, then fade over weeks? Label what the iron and helium lines might be telling you. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-transfer",
    title: "Class Challenge Board — Advise on the \"New Star\"",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracked the case.",
    levels: [
      { n: 1, name: "Read the Spectrum", nameEs: "Lee el Espectro" },
      { n: 2, name: "Name the Event", nameEs: "Nombra el Evento" },
      { n: 3, name: "Weigh the Distance", nameEs: "Pesa la Distancia" },
      { n: 4, name: "Judge the Headline", nameEs: "Juzga el Titular" },
      { n: 5, name: "Advise the Public", nameEs: "Asesora al Público" },
    ] },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Evidence Inventory",
    intro: "Before you argue anything: <span style=\"font-weight:700\">list the evidence first.</span> One row per clue. Documented reasoning = a scientist move = points.",
    sections: [ { id: "evlog", kind: "table", title: "What the observation tells me",
      columns: [
        { key: "clue", label: "Clue from the data", width: "150px", placeholder: "iron + helium lines" },
        { key: "tool", label: "Unit tool that reads it", placeholder: "spectra / H-R / fusion / redshift" },
        { key: "means", label: "What it most likely means", placeholder: "a massive star exploded…" },
      ], minRows: 3, addRowLabel: "Add a clue" } ] },

  { id: id("brainstorm"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Brainstorm first.</span> List at least THREE pieces of evidence or reasoning from this unit that help you interpret the observation. (You'll use these in your full write-up — get them on paper now.)" },

  { id: id("draw-event"), type: "sketch", title: "Draw the Event",
    instructions: "Redraw the event now that you've inventoried the evidence. Show the star before and after, an arrow for the brightness jump, and label what the spectrum lines reveal about what it was made of. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop gathering. Now we reason. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — this is the move that turns \"a star got bright\" into an evidence-based conclusion." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What is actually happening?",
      prompts: [
        { id: "q1", label: "The spectrum shows heavy elements like oxygen and iron. What does that tell you about the kind of star this was and what stage it reached? Tie it back to the life-cycle and nucleosynthesis ideas from this unit.", rows: 3 },
        { id: "q2", label: "The object brightened thousands of times over days, then stayed bright for weeks. What kind of event behaves like that? Name your best candidate and one alternative.", rows: 3 },
        { id: "q3", label: "The galaxy is ~2 million light-years away. Explain, using the speed of light, why the event you are seeing already happened ~2 million years ago — and why that matters for the \"WIPE OUT EARTH\" claim.", rows: 3 },
        { id: "q4", label: "What ADDITIONAL evidence would you want to collect to strengthen or weaken your conclusion? Name two specific observations and what each would tell you.", rows: 3 },
        { id: "q5", label: "<span style=\"font-weight:700\">Compare:</span> back in Arc 1 you couldn't explain a \"new star\" at all. What can you explain now that you couldn't on day one? Be specific.", rows: 3 },
      ] } ] },

  { id: id("transfer-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Write your science-advisory response to the headline. Should people panic?</span> Use the data table and the unit model to justify your conclusion in CER form:\n\n• <span style=\"font-weight:700\">CLAIM</span> — State clearly what you think is happening and whether the headline is justified.\n• <span style=\"font-weight:700\">EVIDENCE</span> — Cite specific evidence: spectral lines, brightness change, distance, stellar life cycle, nucleosynthesis.\n• <span style=\"font-weight:700\">REASONING</span> — Explain how the evidence supports your claim. Address why distance matters and what additional observations would strengthen or weaken your conclusion." },

  { id: id("media-claim"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Evaluate the media claim itself.</span> Headlines like \"COULD WIPE OUT EARTH, SCIENTISTS WARN\" are written to get clicks. Quote the most misleading part of that headline and rewrite it as a single accurate, non-sensational sentence a reporter could actually publish." },

  { id: id("peer-eval"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Peer review.</span> Trade advisory responses with a partner. Name ONE piece of evidence they used well, and ONE place their reasoning could be tighter or is missing a link between evidence and claim. Be a helpful editor, not a critic." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Initial vs. Final — close the model",
    intro: "This is the same class model we started in Arc 1 — back then it was mostly questions. Pull up our <span style=\"font-weight:700\">initial</span> draft next to where it is <span style=\"font-weight:700\">now</span>. As a class, mark what we can finally explain (spectra, fusion, life cycle, redshift) and anything still open. Copy the final model into your Mission Log — this is the model you carried all the way to a brand-new \"new star.\"" },

  { id: id("qboard"), type: "question_board", boardId: "u6-l8",
    title: "Class Question Board — and the Driving Question",
    intro: "Revisit our unit Driving Question Board. Post which original questions we can now answer, and one cosmic question you STILL have. Curiosity doesn't end when the course does.",
    starters: [
      "We can finally explain how ___ because ___.",
      "I still wonder how scientists know ___.",
      "If light takes millions of years to reach us, how do we ___?",
      "What would it take to actually threaten Earth from ___?",
    ] },

  // ── NAVIGATE: closing the course ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Last Question + Word Tracker",
    intro: "Last entry of the year. Make it count.",
    sections: [
      { id: "testable", kind: "text", title: "The ONE cosmic question I'd still chase",
        label: "If you had a telescope and a year — what would you want to read in the starlight?",
        placeholder: "If we looked at ___, could we tell whether ___?",
        hint: "*A good one points at evidence you could actually go collect.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — final collection",
        instructions: "The words that powered this unit — \"spectrum,\" \"emission line,\" \"fusion,\" \"nucleosynthesis,\" \"supernova,\" \"light-year,\" \"redshift\" — catch the ones you finally own with what they mean. This is your year-end glossary, in your own words." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy see how the model landed." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A faint star in a galaxy ~2 million light-years away suddenly brightened by thousands of times and stayed bright for weeks. Its spectrum shows strong lines of hydrogen, helium, oxygen, and iron. A headline warns it could \"wipe out Earth.\" Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> In a few sentences, say what the event most likely is, what the spectrum tells you, and whether Earth is actually in danger. Use what you built all unit." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "The object's spectrum shows strong emission lines of specific elements. In this unit, what do an object's spectral lines tell us?",
    options: [
      "Which chemical elements are present, because each element emits its own pattern.",
      "How fast the object is spinning around its own central rotational axis.",
      "The exact temperature of every planet that happens to be orbiting it.",
      "How many other galaxies are located directly behind the object we see.",
    ], correctIndex: 0,
    explanation: "Each element emits and absorbs light at its own characteristic set of wavelengths, so spectral lines act as element fingerprints. The hydrogen, helium, oxygen, and iron lines tell us what the object contains." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "The galaxy is about 2 million light-years away. What does that distance mean for what we observe?",
    options: [
      "The event is happening live and could reach Earth within a few days.",
      "The light we see left the object about 2 million years ago.",
      "The object must be moving toward Earth at nearly the speed of light.",
      "The light has lost all of its energy and tells us nothing useful.",
    ], correctIndex: 1,
    explanation: "A light-year is the distance light travels in one year, so light from 2 million light-years away took about 2 million years to arrive. We are seeing the event as it was 2 million years ago — and anything it released is no threat to Earth now." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "The spectrum contains heavy elements like iron. Based on the unit, where are elements heavier than helium mainly produced?",
    options: [
      "Inside Earth's core, then scattered outward into space by volcanoes.",
      "In the empty cold vacuum between galaxies, far from any starlight.",
      "Inside stars and their explosive deaths, through nuclear fusion processes.",
      "Only during the first three minutes after the Big Bang and never again.",
    ], correctIndex: 2,
    explanation: "Stars fuse light elements into heavier ones, and the heaviest elements are forged in massive stars and their supernova explosions (nucleosynthesis). Seeing iron points to an evolved, massive star — consistent with an exploding star rather than a doomsday ray aimed at Earth." },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how the year's model landed." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Year-End Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go — for real this time",
      prompts: [
        { id: "carried", label: "The idea from THIS YEAR of physics I'm most likely to carry with me:", rows: 2 },
        { id: "surprise", label: "One thing about stars (or the universe) that genuinely surprised me, and why:", rows: 2 },
        { id: "proud", label: "One moment this year I was proud of how I thought like a scientist:", rows: 2 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You did it. You took a model you built from scratch and carried it all the way to a brand-new \"new star\" — read its light, named the event, weighed the distance, and called out a fear-mongering headline with evidence. That's not repeating facts; that's <span style=\"font-weight:700\">thinking like a physicist</span>.\n\nThat's the whole course. From energy and the grid, through forces, momentum, gravity, and waves, to the light of dying stars — you learned to read the world. Keep looking up, and keep asking what the evidence actually says. Proud of you. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Transfer: A New \"New Star\"",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6108,
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
