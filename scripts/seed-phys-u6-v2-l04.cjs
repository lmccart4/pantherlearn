// seed-phys-u6-v2-l04.cjs
// U6 v2 — Arc 4: "A Star's Life Story" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (A Star's Life Story) + L08 (Where Do Elements Come From?) into one
// challenge-arc. Stars are born, live, and die: nebula → main sequence → giant →
// final stage. A star's MASS determines its fate. Life-cycle stages map to H-R
// positions. Stars are element factories: fusion builds elements up to IRON;
// supernovae (and neutron-star collisions) forge the heavier ones (nucleosynthesis).
// Most atoms in our bodies were forged in stars. Through-line: "Read the Starlight."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as the U1 v2 pilot. Content repackaged
// verbatim from drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc4.md.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l04-star-life";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The star-lifecycle-model embed URL is from u6-arc4.md.
const LIFECYCLE = "https://paps-tools.web.app/star-lifecycle-model.html";

let _n = 0;
const id = (slug) => `v2u6l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⭐", title: "A Star's Life Story",
    subtitle: "Unit 6 · Arc 4 — Stars & the Cosmos" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc we cracked the code on <span style=\"font-weight:700\">why</span> stars shine — fusion in the core, mass turned straight into energy. So a star is a furnace. But furnaces burn down. Today we read the whole life story written in the starlight: how a star is born, how it lives, how it dies — and the twist nobody sees coming, which is that <span style=\"font-weight:700\">you</span> are partly made of dead stars. Fun is still allowed in this room." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Our \"new star\" — the one that appeared, blazed, then faded into a glowing cloud — was never new. It was a star <span style=\"font-weight:700\">dying</span>, and dying loud. To read that record we need the rest of the story: what happens to a furnace when it runs out of fuel?\n\nThe answer turns out to depend almost entirely on one thing the star was born with: how much <span style=\"font-weight:700\">mass</span> it had. Same starting cloud, wildly different endings. That's the thread we pull on all arc." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from last arc — quantity over polish. Then we read the life story.",
    sections: [ { id: "recall", kind: "prompts", title: "What powers a star?",
      prompts: [
        { id: "q1", label: "In your own words: where does a star's light actually come from? Name the process.", rows: 2 },
        { id: "q2", label: "Our \"new star\" appeared, brightened, then faded into a glowing cloud of debris. Guess: what do you think just happened to that star?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Life Story",
    content: "Pick a star — small like a red dwarf, medium like our Sun, or a giant much heavier than the Sun — and <span style=\"font-weight:700\">trace its whole life</span>, stage by stage, birth to remnant. Name what's happening at each stage. Find where it lands on the H-R diagram. Then predict its ending: white dwarf, neutron star, or black hole.\n\nThere are levels. They get harder. The rule still holds — write down your reasoning before you decide a star's fate." },

  { id: id("setup"), type: "callout", icon: "🌌", style: "info", title: "The story you're tracing",
    content: "Every star begins the same way: a cold cloud of gas and dust called a <span style=\"font-weight:700\">nebula</span>. Gravity pulls it together, heating it until fusion ignites. For most of its life the star fuses hydrogen on the <span style=\"font-weight:700\">main sequence</span>. What happens NEXT depends almost entirely on <span style=\"font-weight:700\">mass</span>.\n\nLow- and medium-mass stars (like our Sun) puff up into a red giant, then gently shed their outer layers and end as a <span style=\"font-weight:700\">white dwarf</span>. High-mass stars swell into a red supergiant, then their core collapses and the outer layers blow apart in a <span style=\"font-weight:700\">supernova</span>, leaving a neutron star or a black hole. The glowing debris in our 'new star' record is exactly that — a supernova." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your star's life path (before the model)",
    instructions: "Pick ONE star (small, Sun-like, or giant). Sketch the path of its life from the nebula to its final remnant. Label each stage you think it passes through. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-star-life",
    title: "Class Challenge Board — Read the Life Story",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading which star.",
    levels: [
      { n: 1, name: "Find the Stages", nameEs: "Encuentra las Etapas" },
      { n: 2, name: "Place It on the H-R", nameEs: "Ubícalo en el H-R" },
      { n: 3, name: "Let Mass Decide", nameEs: "Deja que la Masa Decida" },
      { n: 4, name: "Name the Remnant", nameEs: "Nombra el Remanente" },
      { n: 5, name: "Trace the Whole Life", nameEs: "Traza Toda la Vida" },
    ] },

  { id: id("embed-lifecycle"), type: "embed", url: LIFECYCLE, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Life-Cycle Trace Log",
    intro: "As you work the model and the levels: <span style=\"font-weight:700\">before you decide a star's fate, write what mass it started with.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracing the life",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "stage", label: "Stage", placeholder: "nebula, main sequence, giant…" },
        { key: "happening", label: "What's happening here", placeholder: "gravity collapses cloud…" },
        { key: "hr", label: "H-R position", placeholder: "diagonal band / upper right…" },
      ], minRows: 3, addRowLabel: "Add a stage" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw Your Star's Life Path",
    instructions: "Redraw your star's life now that you've traced it. Show each stage as a labeled box, an arrow from one stage to the next, and mark roughly where each stage sits on an H-R diagram (hot-left/cool-right, bright-top/dim-bottom). Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-elements"), type: "mission_log", title: "Mission Log — Element Factory",
    intro: "Stars don't just shine — they build atoms. For each element below, say where it was mainly forged: the Big Bang, fusion inside a star, or a supernova / neutron-star collision.",
    sections: [ { id: "factory", kind: "table", title: "Where the elements were made",
      columns: [
        { key: "element", label: "Element", placeholder: "carbon, iron, gold…" },
        { key: "origin", label: "Where it mainly forms", placeholder: "Big Bang / star fusion / supernova" },
        { key: "why", label: "Why there", placeholder: "fusion stops at iron, so…" },
      ], minRows: 3, addRowLabel: "Add an element" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop tracing. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we read some star stages\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the starlight tell us?",
      prompts: [
        { id: "q1", label: "How does mass determine whether a star ends as a white dwarf, a neutron star, or a black hole? State the relationship.", rows: 3 },
        { id: "q2", label: "Our \"new star\" brightened, then faded into a glowing cloud. Which life-cycle event explains that, and what mass of star does it take?", rows: 2 },
        { id: "q3", label: "Stars build elements by fusion all the way up to iron — then stop. Why does fusion stop at iron instead of continuing to heavier elements?", rows: 3 },
        { id: "q4", label: "The calcium in your bones and the iron in your blood are heavier than helium. Trace where they were most likely forged, and how they ended up in you.", rows: 3 },
        { id: "q5", label: "**Predict:** the Sun is a low- to medium-mass star. Predict its final state, and explain why it will NOT become a black hole.", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Tracing one path — the Sun vs. a giant",
    content: "Two stars, same nebula nursery, different mass — totally different endings.\n\n<span style=\"font-weight:700\">The Sun (low-to-medium mass):</span> nebula → protostar → main sequence (where it is now, fusing hydrogen) → red giant → planetary nebula → <span style=\"font-weight:700\">white dwarf</span>. It never had enough mass for its core to collapse violently, so no supernova, no black hole.\n\n<span style=\"font-weight:700\">A high-mass giant:</span> nebula → protostar → main sequence → red supergiant → <span style=\"font-weight:700\">supernova</span> → neutron star OR black hole. Massive stars burn their fuel faster, so they live shorter, more spectacular lives.\n\nThe fuel ladder is the same for both: fusion climbs hydrogen → helium → carbon → oxygen → ... → <span style=\"font-weight:700\">iron</span>, and stops. Iron has the most stable nucleus there is — fusing it would <span style=\"font-weight:700\">take</span> energy instead of releasing it, so a star can't power itself past iron. Everything heavier than iron — the gold in a ring, the iodine in your thyroid, the uranium in the ground — was forged in the violence of a supernova or a neutron-star collision, then recycled into new clouds like the one that made us." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Tweak Our Class Model — add the life cycle",
    intro: "Same model we've been building all unit. Today we tweak it: show a star's life as a sequence of stages, branch the ending by <span style=\"font-weight:700\">mass</span>, and add where the elements in our bodies came from. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about how stars live, die, and build the stuff we're made of. These drive where the unit heads next.",
    starters: [
      "If a star's mass decides its fate, what happens to a star exactly ___?",
      "How do scientists know an element was made in ___?",
      "Why does fusion stop at iron instead of ___?",
      "What happens to all the stuff a supernova ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could investigate with data or a model in here — not just look up.",
        placeholder: "If a star had ___, would it ___?",
        hint: "*A good one can be answered by doing something with data or a model, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"nebula,\" \"main sequence,\" \"red giant,\" \"supernova,\" \"white dwarf,\" \"neutron star,\" \"nucleosynthesis,\" \"remnant\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Out in space, a cold nebula slowly pulls itself together under gravity. Millions of years later a star ignites, lives, and finally dies — and depending on how much mass it started with, it leaves behind something very different. Some of the atoms it scatters will end up in a brand-new star, a planet… maybe even a person. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Trace a star's life from the nebula to its final remnant. Name the stages in order, say how its mass decides the ending, and explain how the heavy elements it built could end up inside a person. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Which factor has the *biggest* influence on how a star evolves and what remnant it leaves behind?",
    options: [
      "The star's mass, because it sets how the star burns and how it ends.",
      "The star's color, since the reddest stars always die the most violently.",
      "The star's distance from Earth, which controls how fast it ages.",
      "The star's age measured in human years from when we first saw it.",
    ], correctIndex: 0,
    explanation: "A star's mass determines how long it fuses, how hot it burns, and whether it ends as a white dwarf, a neutron star, or a black hole. Color and distance don't decide its fate." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A \"new star\" suddenly appears, blazes brightly, then fades and leaves a glowing cloud of debris. Which life-cycle event best explains this?",
    options: [
      "A protostar joining the main sequence for the very first time.",
      "A low-mass star quietly cooling down into a small white dwarf.",
      "A high-mass star exploding as a supernova at the end of its life.",
      "A red giant slowly contracting back into a cold, dark nebula.",
    ], correctIndex: 2,
    explanation: "A sudden brightening followed by a fading remnant cloud matches a supernova — the explosive death of a high-mass star." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Where does *every* star begin its life, before fusion ever starts?",
    options: [
      "As a white dwarf that gradually heats back up over time.",
      "As a fully formed main-sequence star fusing hydrogen.",
      "As a supernova remnant left behind by an older star.",
      "As a cold cloud of gas and dust called a nebula.",
    ], correctIndex: 3,
    explanation: "Stars are born in nebulae — cold clouds of gas and dust. Gravity pulls the cloud together and heats it until fusion can begin." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Our Sun is a low- to medium-mass star. What is its most likely *final* state?",
    options: [
      "A black hole, since every star out there eventually collapses into one.",
      "A white dwarf, the remnant left after it sheds its outer layers.",
      "A neutron star formed when its core violently collapses inward.",
      "A second nebula that quickly forms a brand-new Sun-like star.",
    ], correctIndex: 1,
    explanation: "Low- and medium-mass stars like the Sun end as white dwarfs. It lacks the mass needed for the violent core collapse that makes a neutron star or black hole." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Why can't a normal star make elements much heavier than iron by fusion?",
    options: [
      "Fusing nuclei heavier than iron takes energy instead of releasing it.",
      "Iron fusion releases so much energy it instantly blows the star apart.",
      "Stars simply run out of protons before they ever reach heavy elements.",
      "Gravity is far too weak to squeeze heavy nuclei close enough to fuse.",
    ], correctIndex: 0,
    explanation: "Iron has the most stable nucleus. Fusing lighter elements releases energy, but building elements past iron requires energy input — so a star can no longer power itself, and fusion stops." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Most of the calcium in your bones and the iron in your blood was most likely produced by —",
    options: [
      "the Big Bang, in the same first minutes that made hydrogen and helium.",
      "fusion inside the Sun during its main-sequence life happening right now.",
      "nuclear processes in the supernova explosions of massive stars.",
      "radioactive decay of uranium buried deep in Earth's crust over time.",
    ], correctIndex: 2,
    explanation: "Calcium and iron are heavier than helium and aren't made in significant amounts by the Big Bang. They're forged in massive stars and scattered by supernovae, later becoming part of new solar systems like ours." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which two elements were formed mainly in the first few minutes after the Big Bang?",
    options: [
      "Carbon and oxygen, the elements that make up most living things.",
      "Iron and gold, the dense metals found deep in planets and rings.",
      "Calcium and uranium, which are common in bones and in the ground.",
      "Hydrogen and helium, the lightest and most abundant atoms there are.",
    ], correctIndex: 3,
    explanation: "In its first few minutes the universe was hot and dense enough to fuse protons and neutrons into hydrogen, helium, and a trace of lithium — the lightest elements. Heavier ones came later from stars and supernovae." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Astronomer Carl Sagan said, \"We are made of star stuff.\" What did he mean?",
    options: [
      "Human bodies still give off starlight left over from the early universe.",
      "Many atoms in our bodies were forged inside stars and then recycled.",
      "People are literally tiny stars that slowly burn fuel over a lifetime.",
      "All matter on Earth fell directly out of the Sun when it first formed.",
    ], correctIndex: 1,
    explanation: "The heavier elements in our bodies — carbon, oxygen, calcium, iron — were built by fusion in stars and by supernovae, then scattered into clouds that later formed our solar system. We're made of recycled star material." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch two life paths starting from the SAME nebula: one for a Sun-like star ending as a white dwarf, and one for a high-mass star ending in a supernova → neutron star or black hole. Label the branch point as 'mass decides here.' Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about stars (or about you being made of them) that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read a whole life story written in light today — birth in a nebula, a long burn on the main sequence, and an ending decided before the star was even done forming, by its mass. And the kicker: the atoms in your hand were cooked inside stars that died long before the Sun. You really are made of star stuff. Next class we keep reading the cosmos. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "A Star's Life Story",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6104,
  visible: false,
  gradesReleased: true,
  challengeId: "u6-star-life",
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
