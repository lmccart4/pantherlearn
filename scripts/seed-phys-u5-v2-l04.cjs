// seed-phys-u5-v2-l04.cjs
// U5 v2 — Arc 4: "Why the Microwave Blocks Bluetooth" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (Why the Microwave Blocks Bluetooth) + L08 (Hot and Cold Spots) into one
// challenge-arc that RESOLVES the unit anchor. Physics: when EM radiation meets matter it is
// TRANSMITTED, ABSORBED, or REFLECTED; a metal mesh reflects waves whose wavelength is much
// larger than its holes (so it blocks 12 cm Bluetooth but lets 500 nm light out); inside a
// closed oven the bouncing waves form STANDING WAVES with fixed hot spots (antinodes) and cold
// spots (nodes) spaced about half a wavelength apart. Through-line: "Send the Signal."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the rest of U5 v2. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc4.md (v1 L07+L08, already sourced).
// Real-world figures (2.45 GHz, ~12 cm, 1-2 mm mesh, 400-700 nm) traced to the U5 EM data pack
// (references/research/openscied-u5-em-data-pack-2026-06-19.md). No new image asset; no embed.
//
// Grade-safety: brand-new doc, 0 responses -> safeSeed creates it. visible:false (Luke controls
// go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l04-microwave-bluetooth";
// No embed for this arc (per consolidation map U5 row + override). Hands-on testing is in-room.

let _n = 0;
const id = (slug) => `v2u5l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Why the Microwave Blocks Bluetooth",
    subtitle: "Unit 5 · Arc 4 — Waves & Electromagnetic Radiation" },

  // ── CONNECT: recall prior arc → the question that resolves the anchor ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you laid out the whole <span style=\"font-weight:700\">EM spectrum</span> — radio, microwaves, light, all the same kind of wave, just different wavelengths. Today we cash that in and finally crack the mystery we opened the unit with: a Bluetooth speaker goes silent inside a closed, <span style=\"font-weight:700\">unplugged</span> microwave. No power. No magic. Just waves and metal. Let's solve it." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Same box, two jobs. A microwave oven runs at about <span style=\"font-weight:700\">2.45 GHz</span> — wavelength roughly <span style=\"font-weight:700\">12 cm</span>. Bluetooth runs at about <span style=\"font-weight:700\">2.4 GHz</span> — wavelength also roughly <span style=\"font-weight:700\">12 cm</span>. Nearly the same wave. So why does the oven cook your food but only block your speaker? And why can you still SEE your food through the door while the signal can't get out?\n\nThat last clue is everything: light gets through the door, Bluetooth doesn't. Same door. The difference has to be the <span style=\"font-weight:700\">wavelength</span>." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 3 — quantity over polish. Then we go solve the anchor.",
    sections: [ { id: "recall", kind: "prompts", title: "What do we already know?",
      prompts: [
        { id: "q1", label: "Bluetooth and visible light are both EM waves. Name ONE way they are different.", rows: 2 },
        { id: "q2", label: "When a wave hits a material, list every outcome you can think of that could happen to it.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Crack the Microwave",
    content: "Your job is to <span style=\"font-weight:700\">fully explain the anchor</span>: why a Bluetooth signal dies inside a closed, powered-off microwave — while light passes right through the same door. Then go further and explain why a RUNNING microwave heats food in patches, not evenly.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔬", style: "info", title: "The three things a wave can do",
    content: "When an EM wave reaches a material, exactly three things can happen, and the material decides which:\n\n<span style=\"font-weight:700\">Transmitted</span> — the wave passes through (light through glass).\n<span style=\"font-weight:700\">Absorbed</span> — the wave's energy is transferred into the material, often as heat (water in food soaking up microwaves).\n<span style=\"font-weight:700\">Reflected</span> — the wave bounces off (microwaves off the metal oven walls).\n\nThe <span style=\"font-weight:700\">system</span> we're studying is the Bluetooth signal plus the metal oven enclosure. Hold onto the door clue: the metal mesh reflects waves whose wavelength is much bigger than its holes — and those holes are only about <span style=\"font-weight:700\">1–2 mm</span> across." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the door (before the test)",
    instructions: "Draw the microwave door mesh as a row of small holes (~1–2 mm). Draw a Bluetooth wave (~12 cm wavelength) and a light wave (~500 nm) heading toward it. For each, predict: does it pass through, bounce off, or get absorbed? Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-microwave-bluetooth",
    title: "Class Challenge Board — Crack the Microwave",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who has cracked what.",
    levels: [
      { n: 1, name: "Transmit, Absorb, or Reflect", nameEs: "Transmite, Absorbe o Refleja" },
      { n: 2, name: "Test the Materials", nameEs: "Prueba los Materiales" },
      { n: 3, name: "Size Up the Mesh", nameEs: "Mide la Malla" },
      { n: 4, name: "Map the Hot Spots", nameEs: "Mapea los Puntos Calientes" },
      { n: 5, name: "Solve the Anchor", nameEs: "Resuelve el Misterio" },
    ] },

  { id: id("ml-test"), type: "mission_log", title: "Mission Log — Material Test Log",
    intro: "In groups, place each material between a Bluetooth source and a receiver. <span style=\"font-weight:700\">Predict first</span> — transmit, absorb, or reflect — then record what actually happens. The door mesh is the key test: light passes through it, so why doesn't Bluetooth?",
    sections: [ { id: "testlog", kind: "table", title: "Testing materials",
      columns: [
        { key: "material", label: "Material", placeholder: "paper, glass, hand, mesh…" },
        { key: "prediction", label: "Prediction (transmit / absorb / reflect)", placeholder: "transmit" },
        { key: "result", label: "Observed result", placeholder: "signal kept / dropped" },
      ], minRows: 5, addRowLabel: "Add a material" } ] },

  { id: id("draw-mesh"), type: "sketch", title: "Draw the Mesh Showdown",
    instructions: "Redraw the door mesh now that you've tested it. Show a ~12 cm Bluetooth wave reflecting OFF the mesh (it can't fit through the tiny holes) and a ~500 nm light wave passing straight THROUGH the same holes. Label the hole size and both wavelengths. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-hotspots"), type: "mission_log", title: "Mission Log — Hot-Spot Map",
    intro: "Now power matters. With a tray of marshmallows or thermal paper and the turntable OFF, a short burst reveals where the energy piles up. Measure the distance between two melted (hot) spots — that spacing is about half a wavelength.",
    sections: [ { id: "hotmap", kind: "table", title: "Mapping the standing wave",
      columns: [
        { key: "trial", label: "Trial", width: "70px", placeholder: "1" },
        { key: "spacing", label: "Hot-spot spacing (cm)", placeholder: "≈ 6" },
        { key: "lambda", label: "Calculated λ = 2 × spacing (cm)", placeholder: "≈ 12" },
      ], minRows: 3, addRowLabel: "Add a trial" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop testing. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we melted some marshmallows\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the waves?",
      prompts: [
        { id: "q1", label: "Visible light has a wavelength around 500 nm; Bluetooth is around 12 cm. Explain why light passes through the door mesh but Bluetooth does not.", rows: 3 },
        { id: "q2", label: "For your team, give one material that mostly TRANSMITTED the signal and one that mostly REFLECTED it. What about each material explains the difference?", rows: 2 },
        { id: "q3", label: "Inside a running oven the waves bounce off the metal walls and overlap, making fixed hot and cold spots. Use your measured spacing to estimate the wavelength, and explain why neighboring hot spots are about $\\frac{\\lambda}{2}$ apart.", rows: 3 },
        { id: "q4", label: "Write the full CER: why does a Bluetooth speaker lose its connection inside a closed, unpowered microwave? Claim what happens to the signal; evidence from the wavelength-vs-mesh comparison and your tests; reasoning that links the wave-matter interaction to the wavelength.", rows: 4 },
        { id: "q5", label: "**Predict:** if a microwave ran at a much HIGHER frequency (shorter wavelength), how would the hot-spot spacing change? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — find the wavelength from the hot spots",
    content: "A group maps the oven and finds two neighboring hot spots <span style=\"font-weight:700\">6.1 cm</span> apart.\n\nStep 1 — neighboring hot spots (antinodes) are about half a wavelength apart: $\\frac{\\lambda}{2} \\approx 6.1\\,\\text{cm}$.\n\nStep 2 — solve for the wavelength: $\\lambda \\approx 2 \\times 6.1\\,\\text{cm} = 12.2\\,\\text{cm}$.\n\nStep 3 — check it. A microwave oven runs at $f = 2.45\\,\\text{GHz} = 2.45 \\times 10^{9}\\,\\text{Hz}$. Using $v = f\\lambda$ with $v = c$:\n\n$$\\lambda = \\frac{c}{f} = \\frac{3.0 \\times 10^{8}\\,\\text{m/s}}{2.45 \\times 10^{9}\\,\\text{Hz}} \\approx 0.122\\,\\text{m} = 12.2\\,\\text{cm}$$\n\nThe melted marshmallows and the wave equation agree. That ~12 cm wavelength is also why the wave can't squeeze through 1–2 mm mesh holes — it's about a hundred times too big." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Model — add the box",
    intro: "Same wave model we've grown all unit. Today we tweak it: show the metal mesh <span style=\"font-weight:700\">reflecting</span> the long Bluetooth wave while <span style=\"font-weight:700\">transmitting</span> short light waves, and show the waves bouncing inside to make standing-wave hot and cold spots. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about waves, signals, or the microwave. These drive where the unit heads next.",
    starters: [
      "If the holes were bigger than ___, would the signal ___?",
      "Why does a metal wall reflect waves but glass ___?",
      "What would change if the wavelength were ___?",
      "How does the real grid of Wi-Fi in a building deal with ___?",
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
        instructions: "Words you kept reaching for this arc — \"transmit,\" \"absorb,\" \"reflect,\" \"standing wave,\" \"antinode,\" \"node,\" \"mesh,\" \"wavelength\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "You drop a playing Bluetooth speaker inside a microwave oven and close the door — the oven is unplugged. The music cuts out almost completely, but you can still see the speaker glowing through the door window. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the Bluetooth signal is blocked but you can still see the speaker. Name what happens to the Bluetooth wave at the mesh and what happens to the light, and tie it to wavelength. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Why does the metal mesh in a microwave door block Bluetooth signals?",
    options: [
      "The microwave oven still pulls power and jams the signal even when it appears off.",
      "The mesh holes are much smaller than the Bluetooth wavelength, so the wave reflects.",
      "The glass door layer absorbs the Bluetooth signal before it can exit the oven.",
      "The mesh reflects every kind of electromagnetic wave back equally, including light.",
    ], correctIndex: 1,
    explanation: "A metal mesh reflects EM waves whose wavelength is much larger than the hole size. Bluetooth's wavelength is about 12 cm, while the mesh holes are only a few millimeters across, so the wave can't pass and is reflected." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Visible light has a wavelength near 500 nm; Bluetooth is near 12 cm. Why does light pass through the same mesh that blocks Bluetooth?",
    options: [
      "Light is not an electromagnetic wave, so the metal mesh cannot reflect it at all.",
      "The oven is designed to let light leak out on purpose so you can watch food cook.",
      "Light's wavelength is far smaller than the holes, so it passes through easily.",
      "Light carries less energy than Bluetooth, so the mesh lets the weaker wave through.",
    ], correctIndex: 2,
    explanation: "A mesh reflects waves whose wavelength is much larger than its holes. Visible light's wavelength (~500 nm) is tiny compared with the 1–2 mm holes, so light is transmitted while the much longer Bluetooth wave is reflected." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "When an electromagnetic wave is *absorbed* by a material, what happens to its energy?",
    options: [
      "Its energy is transferred into the material, often as thermal energy.",
      "Its energy bounces off the surface and travels back the way it came.",
      "Its energy passes straight through the material without any change.",
      "Its energy is destroyed, since absorbed waves simply cease to exist.",
    ], correctIndex: 0,
    explanation: "Absorption means the wave's energy is transferred into the material — frequently raising its thermal energy. (Reflection bounces the wave; transmission lets it pass; energy is never destroyed.)" },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Inside a running microwave oven, why do fixed hot spots and cold spots form?",
    options: [
      "The oven sprays the microwaves only at certain spots on the turntable below.",
      "Food in some spots is simply colder to begin with than food in other spots.",
      "Different parts of the food are made of metal that attracts the microwaves.",
      "Waves reflect off the metal walls and overlap, forming a standing wave pattern.",
    ], correctIndex: 3,
    explanation: "Microwaves reflect off the metal walls and overlap with incoming waves, forming a standing wave. Antinodes (hot spots) are where the waves add up; nodes (cold spots) are where they cancel." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "In a standing wave, the distance between two neighboring hot spots (antinodes) is about —",
    options: [
      "one full wavelength, the same as the distance between two crests.",
      "half a wavelength, $\\frac{\\lambda}{2}$, between neighboring antinodes.",
      "twice the wavelength, since the waves overlap and stretch out.",
      "one-quarter of a wavelength, from a node to the next antinode.",
    ], correctIndex: 1,
    explanation: "Neighboring antinodes of a standing wave are about half a wavelength apart. So if two hot spots are 6 cm apart, the wavelength is about 12 cm." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Two neighboring hot spots inside a microwave are about 6 cm apart. About what wavelength does that imply?",
    options: [
      "About 24 cm, because you multiply the spacing by four to get the wavelength.",
      "About 3 cm, because the spacing is twice the full wavelength of the wave.",
      "About 12 cm, because the spacing is about half of one full wavelength.",
      "About 6 cm, because the spacing already equals one full wavelength.",
    ], correctIndex: 2,
    explanation: "Neighboring hot spots are about half a wavelength apart, so the wavelength is about $2 \\times 6\\,\\text{cm} = 12\\,\\text{cm}$ — matching the ~12 cm wavelength of 2.45 GHz microwaves." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A microwave oven runs at 2.45 GHz and Bluetooth runs at about 2.4 GHz. Why does the oven heat food but a Bluetooth speaker barely warms your phone?",
    options: [
      "Bluetooth uses a completely different kind of wave that cannot carry any energy.",
      "The oven's wave is much shorter, so it slips between the molecules in the food.",
      "Food only absorbs waves above 2.45 GHz, and Bluetooth is just below that line.",
      "The oven emits far more power, so much more energy is absorbed by the food.",
    ], correctIndex: 3,
    explanation: "Both are near 2.4 GHz, so wavelength isn't the difference. A microwave oven emits hundreds of watts, while a Bluetooth speaker emits only a few thousandths of a watt — far less energy to be absorbed." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why does turning on the turntable help food heat more evenly in a microwave?",
    options: [
      "Rotating the food moves it through the fixed hot and cold spots over time.",
      "Spinning the food creates brand-new microwaves that fill in the cold spots.",
      "The turntable cools the hot spots down so the food never overheats at all.",
      "Rotation changes the oven's frequency so the standing wave disappears fully.",
    ], correctIndex: 0,
    explanation: "The standing wave's hot and cold spots stay fixed in space. Rotating the food carries each part through both hot and cold regions, averaging out the heating so it's more even." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the inside of a microwave oven. Draw waves bouncing off the metal walls and show two hot spots (antinodes) with a cold spot (node) between them. Label the spacing between hot spots as ≈ λ/2 and write the wavelength it implies. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the microwave that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You cracked it. The mystery from day one comes down to a wave being too big to fit through a hole — the mesh reflects 12 cm Bluetooth but waves through 500 nm light — and to waves overlapping inside a metal box to make hot and cold spots. Same physics, two payoffs. Next class we ask whether a wave is the whole story. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Why the Microwave Blocks Bluetooth",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5104,
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
