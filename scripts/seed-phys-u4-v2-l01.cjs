// seed-phys-u4-v2-l01.cjs
// U4 v2 — Arc 1 (ANCHOR): "The Fireball Over Russia" (OpenSciEd-spine / Rober-engine).
// Merges v1 L01 (The Fireball Over Russia) + L02 (What Is a Meteor?) into one anchor
// challenge-arc. The 2013 Chelyabinsk meteor is the unit anchor; students notice/wonder,
// learn to classify meteoroid/meteor/meteorite/asteroid/comet, figure out what we can
// see from NJ, build an initial model, and seed the Driving Question Board.
// Unit through-line: "Deflect the Asteroid."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as U1 v2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc1.md (already sourced/audited).
// All real-world figures (date, size, mass, speed, energy, casualties, buildings) come
// from that dump. No embed in this arc.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l01-fireball";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. No embed in this anchor arc.

let _n = 0;
const id = (slug) => `v2u4l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "☄️", title: "The Fireball Over Russia",
    subtitle: "Unit 4 · Arc 1 — Gravity, Orbits & Energy" },

  // ── CONNECT: open the unit → today's question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "New unit, new mission: <span style=\"font-weight:700\">Deflect the Asteroid</span>. To pull that off someday, you first have to understand what's actually flying around out there and what happens when one of those rocks finds us. So we start with a real morning in 2013 when the sky over a Russian city lit up brighter than the Sun. Watch the footage. Then we figure out what we're even looking at." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "You've seen \"shooting stars\" before — a quick streak of light at night. Most of those are specks of dust burning up. The thing over Chelyabinsk was the same idea, just <span style=\"font-weight:700\">enormous</span>. A rock about <span style=\"font-weight:700\">20 meters across</span> hit the top of our air going so fast that the air in front of it caught fire. That's the thread we pull all unit: where do these rocks come from, why do they hit us, and could we ever stop one?" },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Notice & Wonder",
    intro: "Before we explain anything, we observe. Quantity over polish — list what you SEE, then what you WONDER.",
    sections: [ { id: "nw", kind: "prompts", title: "What do you notice? What are you wondering?",
      prompts: [
        { id: "q1", label: "List everything you observe about the fireball, the explosion, the damage, or the object's path. There are no wrong answers — just careful observations.", rows: 3 },
        { id: "q2", label: "Write at least THREE questions you have — where this object came from, why it hit Earth, what if it were bigger, or how we'd predict the next one.", rows: 3 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Name What You're Looking At",
    content: "Before we can explain <span style=\"font-weight:700\">why</span> Chelyabinsk happened, we have to agree on <span style=\"font-weight:700\">what</span> we're even talking about. \"Meteor,\" \"meteoroid,\" \"meteorite\" sound almost identical and mean totally different things — mix them up and your whole model falls apart later.\n\nYour challenge: become the person in the room who never confuses them. Sort the space objects, nail the vocabulary, then connect it to what you can actually see from a dark night in Perth Amboy. There are levels. They get harder. Same rule as always — write what you observe before you decide what it is." },

  { id: id("setup"), type: "callout", icon: "🌌", style: "info", title: "The cast of characters out there",
    content: "Same rock can have three names depending on <span style=\"font-weight:700\">where it is</span> and <span style=\"font-weight:700\">what it's doing</span>:\n\n• <span style=\"font-weight:700\">Asteroid</span> — a rocky or metallic object orbiting the Sun, mostly in the asteroid belt between Mars and Jupiter.\n• <span style=\"font-weight:700\">Comet</span> — a small icy body that releases gas and dust when it nears the Sun, forming a tail.\n• <span style=\"font-weight:700\">Meteoroid</span> — a small rocky or metallic body traveling through space (smaller than an asteroid).\n• <span style=\"font-weight:700\">Meteor</span> — the streak of light made when a meteoroid enters Earth's atmosphere and heats up.\n• <span style=\"font-weight:700\">Meteorite</span> — any part of a meteoroid that survives the fall and lands on Earth's surface.\n\nClue for later: the Chelyabinsk object never made a big crater. It broke apart and mostly vaporized in the air — an <span style=\"font-weight:700\">airburst</span>. Why?" },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — one rock, three names (before)",
    instructions: "Sketch ONE space rock's journey: out in space → glowing across the sky → landing on the ground. Label each stage with the word you think fits (meteoroid / meteor / meteorite). Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-name-the-object",
    title: "Class Challenge Board — Name What You're Looking At",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's nailing the vocabulary.",
    levels: [
      { n: 1, name: "Streak or Rock?", nameEs: "¿Estela o Roca?" },
      { n: 2, name: "Sort the Five", nameEs: "Clasifica los Cinco" },
      { n: 3, name: "Space vs. Sky vs. Ground", nameEs: "Espacio vs. Cielo vs. Suelo" },
      { n: 4, name: "Read the Chelyabinsk Numbers", nameEs: "Lee los Números de Chelyabinsk" },
      { n: 5, name: "Explain the Whole Event", nameEs: "Explica Todo el Evento" },
    ] },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Classification Log",
    intro: "As you sort the objects: <span style=\"font-weight:700\">before you label something, write what tells you which name it gets</span> — is it in space, in the sky, or on the ground? Documented reasoning = a scientist move = points.",
    sections: [ { id: "sortlog", kind: "table", title: "Sorting the objects",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "object", label: "Object / clue", placeholder: "icy body with a tail…" },
        { key: "name", label: "Correct name", placeholder: "asteroid / comet / meteor…" },
        { key: "why", label: "Why — where is it / what's it doing?", placeholder: "in space, near the Sun…" },
      ], minRows: 3, addRowLabel: "Add an object" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Chelyabinsk Path",
    instructions: "Redraw the 2013 event now that you have the words. Show the meteoroid arriving from space, the meteor streak as it heats up, the airburst high over the city, and the dust trail left behind. Label each stage with the right vocabulary. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — The Chelyabinsk Numbers",
    intro: "Pull the real figures from the event into one place — you'll use them all unit. One row per fact.",
    sections: [ { id: "facts", kind: "table", title: "Event data",
      columns: [
        { key: "quantity", label: "Quantity", placeholder: "size, speed, energy…" },
        { key: "value", label: "Value", placeholder: "≈ 20 m / 19 km/s…" },
        { key: "meaning", label: "What it tells you", placeholder: "why it glowed / why it burst" },
      ], minRows: 3, addRowLabel: "Add a fact" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sorting. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we labeled some rocks\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened over Russia?",
      prompts: [
        { id: "q1", label: "You see a bright streak in the night sky, and the next morning a small rock is found nearby. Which is the meteor and which is the meteorite? Explain how you know.", rows: 3 },
        { id: "q2", label: "The Perseid meteor shower is visible every August — you can catch bright meteors from Perth Amboy on a dark night. In your own words, why is a meteor shower NOT the same as a bunch of meteorites hitting the ground?", rows: 3 },
        { id: "q3", label: "The Chelyabinsk object broke apart in an airburst and made no large crater. Using what you know, why might a rock explode in the air instead of punching a hole in the ground?", rows: 3 },
        { id: "q4", label: "How do scientists know meteorites come from space, not from somewhere here on Earth? CLAIM whether they're Earth rocks or space rocks. EVIDENCE: name at least two clues (melted fusion crust, metal or isotopes unlike Earth rocks, cosmic-ray exposure). REASONING: why that evidence is hard to explain if the rock formed on Earth.", rows: 4 },
        { id: "q5", label: "Predict: the rock was ~20 m across. If a rock TWICE as wide hit the same way, do you think the damage would be twice as bad, or more than twice? Take a guess and say why.", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Reading example — sizing up the Chelyabinsk event",
    content: "Let's read the anchor's numbers like a scientist. On <span style=\"font-weight:700\">February 15, 2013</span>, a rock about <span style=\"font-weight:700\">20 meters across</span>, massing roughly <span style=\"font-weight:700\">7,000 to 13,000 metric tons</span>, hit our atmosphere at about <span style=\"font-weight:700\">19 kilometers per second</span> — over <span style=\"font-weight:700\">40,000 miles per hour</span>.\n\nStep 1 — why it glowed: at that speed the air in front of it compressed and heated so intensely the rock began to vaporize. That glow is the <span style=\"font-weight:700\">meteor</span>.\n\nStep 2 — the airburst: the rock couldn't hold together, so it exploded in the air, releasing the energy of about <span style=\"font-weight:700\">440 kilotons of TNT</span> — roughly 30 times the Hiroshima bomb.\n\nStep 3 — the damage on the ground: shockwaves shattered windows, damaged more than <span style=\"font-weight:700\">7,000 buildings</span>, and injured about <span style=\"font-weight:700\">1,500 people</span> — mostly from flying glass, not from the rock itself. No large crater formed, because it broke up and mostly vaporized before reaching the ground." },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Build Our Class Model — what happened over Chelyabinsk",
    intro: "This is our \"before\" model for the whole unit — we'll tweak it every arc. Show the rock coming in from space, why it glowed, why it burst in the air, and where the damage came from. Use the new vocabulary. Copy the class model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l1",
    title: "Driving Question Board",
    intro: "Our unit Driving Question: <span style=\"font-weight:700\">How have collisions with space objects changed Earth, past and future?</span> Post at least one question you still have. We'll check these off as we answer them across the unit.",
    starters: [
      "Where did the Chelyabinsk rock come from before it ___?",
      "Why did it explode in the air instead of ___?",
      "What would have happened if the rock were ___?",
      "How could scientists predict or stop ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If a rock were ___, would the ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"meteoroid,\" \"meteor,\" \"meteorite,\" \"asteroid,\" \"comet,\" \"airburst,\" \"atmosphere\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "It's a clear August night in Perth Amboy. You're outside and a bright streak flashes across the sky and disappears. The next morning, a friend across town finds a small, dark, dense rock with a melted-looking crust in their yard. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Name the streak you saw and the rock your friend found, using the correct terms. Explain where the object started (in space) and what changed as it moved through each stage. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "You see a bright streak flash across the night sky. The next morning, a small rock is found on the ground nearby. Which statement uses the correct terms?",
    options: [
      "The streak is a meteorite and the rock is a meteoroid.",
      "The streak is an asteroid and the rock is a comet.",
      "The streak is a meteor and the rock is a meteorite.",
      "The streak is a meteoroid and the rock is an asteroid.",
    ], correctIndex: 2,
    explanation: "The glowing streak in the sky is a meteor — the visible light from a meteoroid heating up in the atmosphere. Any surviving solid material that reaches the ground is a meteorite." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A rocky object is orbiting the Sun out in the belt between Mars and Jupiter. What is it called?",
    options: [
      "A meteor, because all space rocks are called meteors out there.",
      "An asteroid, a rocky or metallic object orbiting the Sun.",
      "A meteorite, because it has not yet landed on any planet.",
      "A comet, since everything past Mars is made of solid ice.",
    ], correctIndex: 1,
    explanation: "An asteroid is a rocky or metallic object orbiting the Sun, mostly in the asteroid belt between Mars and Jupiter. It only becomes a meteor if it enters Earth's atmosphere and glows." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "On February 15, 2013, the Chelyabinsk object exploded high in the air instead of hitting the ground. What is that mid-air explosion called?",
    options: [
      "An airburst — the object exploded in the air before reaching the ground.",
      "A crater, which is the hole a space rock leaves on the ground.",
      "A meteor shower, when many small specks of dust burn up at once.",
      "A fusion crust, the melted outer shell formed during the fall.",
    ], correctIndex: 0,
    explanation: "An airburst is an explosion in the air, before reaching the ground. The Chelyabinsk object broke apart and mostly vaporized in the atmosphere, so no large crater formed." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "About how fast was the Chelyabinsk object moving when it hit Earth's atmosphere?",
    options: [
      "About 19 kilometers per hour, slower than a city bus on a highway.",
      "About 1,900 kilometers per second, faster than light itself travels.",
      "About 19 meters per second, roughly the speed of a thrown baseball.",
      "About 19 kilometers per second, over 40,000 miles per hour.",
    ], correctIndex: 3,
    explanation: "The object hit the atmosphere at about 19 kilometers per second — more than 40,000 miles per hour. That extreme speed is why the air compressed and heated enough to make it glow and explode." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "What was the MAIN cause of the roughly 1,500 injuries in Chelyabinsk?",
    options: [
      "Flying glass from windows shattered by the blast's shockwaves.",
      "The space rock itself directly crushing buildings on impact.",
      "Radiation released by the rock as it burned in the atmosphere.",
      "A large crater that opened up beneath the center of the city.",
    ], correctIndex: 0,
    explanation: "Most of the roughly 1,500 injuries came from flying glass, as shockwaves from the airburst shattered windows across the region. The rock itself never reached the ground intact." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A meteor shower like the Perseids lights up the August sky over New Jersey. Why is a meteor shower NOT the same as meteorites raining down on the ground?",
    options: [
      "Because meteor showers only ever happen far out over the ocean.",
      "Because the streaks are tiny specks of dust that burn up in the air.",
      "Because showers are made of comets that never enter the atmosphere.",
      "Because each streak is a large asteroid safely orbiting the Earth.",
    ], correctIndex: 1,
    explanation: "A meteor shower is mostly tiny specks of dust that burn up completely in the atmosphere, producing streaks of light (meteors). Very little — if anything — survives to reach the ground as a meteorite." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Scientists are confident meteorites come from space, not from Earth. Which piece of evidence best supports that?",
    options: [
      "Meteorites are always found near active volcanoes on Earth's surface.",
      "Meteorites are softer and lighter than every common rock on Earth.",
      "Meteorites have a melted fusion crust and metal unlike ordinary Earth rocks.",
      "Meteorites glow brightly on their own even years after they land.",
    ], correctIndex: 2,
    explanation: "A melted fusion crust (from heating during the fall) plus metal or isotopic composition unlike Earth rocks — along with cosmic-ray exposure — are hard to explain if the rock formed here on Earth." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Which sequence correctly describes one rock's journey from space to the ground?",
    options: [
      "Meteorite in space, then meteor on the ground, then meteoroid in the sky.",
      "Comet in space, then asteroid in the sky, then meteoroid on the ground.",
      "Meteor in space, then meteoroid in the sky, then meteorite far above us.",
      "Meteoroid in space, then meteor glowing in the sky, then meteorite on the ground.",
    ], correctIndex: 3,
    explanation: "Same rock, three names by stage: a meteoroid traveling through space, a meteor when it glows in the atmosphere, and a meteorite once a surviving piece lands on the ground." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch one rock's full journey in three labeled stages: (1) out in space, (2) glowing as it crosses the sky, (3) landed on the ground. Write the correct name under each stage and one phrase saying what's happening. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the Chelyabinsk event that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you met the rocks: meteoroid in space, meteor in the sky, meteorite on the ground — and you read the real numbers from the morning the sky over Russia caught fire. That's our anchor for the whole unit. Next class we start chasing the energy behind that airburst. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Fireball Over Russia",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4101,
  visible: false,
  gradesReleased: true,
  challengeId: "u4-fireball",
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
