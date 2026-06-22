// seed-phys-u4-v2-l02.cjs
// U4 v2 — Arc 2: "Energy in the Airburst" (OpenSciEd-spine / Rober-engine).
// Merges v1 L03 (Energy in the Airburst) + L04 (Searching for Pieces) into one
// challenge-arc: "Account for the Airburst Energy." Kinetic energy KE = (1/2)mv^2;
// how a meteoroid's KE transfers in an airburst vs a surface impact; how scientists
// locate/recover meteorites (density + magnetism); what meteorites reveal about the
// early solar system. Through-line: "Deflect the Asteroid" — to deflect a rock you
// must first know how much energy it carries and what it's made of.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// platform blocks + composed Status Check as U1 Arc 2. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc2.md (sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l02-airburst-energy";
// No embed for this arc. Status Check scenario is described in text; a generated diagram
// can be added in a later image pass.

let _n = 0;
const id = (slug) => `v2u4l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "☄️", title: "Energy in the Airburst",
    subtitle: "Unit 4 · Arc 2 — Gravity, Orbits & Energy" },

  // ── CONNECT: recall L1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, a fireball lit up the sky over Chelyabinsk and you sorted out the words for what fell — <span style=\"font-weight:700\">meteoroid, meteor, meteorite, asteroid, comet</span>. But here's the thing that still bugs people: the rock <span style=\"font-weight:700\">exploded high in the air</span> and never touched the ground — yet it blew out windows for miles and sent over a thousand people to the hospital. How? Today we follow the <span style=\"font-weight:700\">energy</span>. To deflect an asteroid someday, we first have to know how much punch one is carrying." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture a bowling ball rolling slowly toward your foot — annoying. Now picture the same ball fired out of a cannon. Same ball, wildly different outcome. The difference is <span style=\"font-weight:700\">speed</span>, and it doesn't add up the way you'd guess — double the speed and the damage goes up by <span style=\"font-weight:700\">four</span>. The Chelyabinsk rock came in around 19,000 meters per second. That's the thread we pull all arc: a moving object stores <span style=\"font-weight:700\">kinetic energy</span>, and that energy can't just disappear — it has to go somewhere." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go find the energy.",
    sections: [ { id: "recall", kind: "prompts", title: "From fireball to question",
      prompts: [
        { id: "q1", label: "In your own words: what is the difference between a *meteor* (the streak of light) and a *meteorite* (the rock on the ground)?", rows: 2 },
        { id: "q2", label: "The rock never hit the ground, yet windows broke for miles. Before we do any math — where do you think all that energy went?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Account for the Airburst Energy",
    content: "An incoming rock carries a budget of <span style=\"font-weight:700\">kinetic energy</span>. Your job: figure out how big that budget is, then track where every bit of it goes when the rock breaks apart in the air. Useful for the mission ahead? Absolutely — you can't plan to nudge an asteroid off course until you know how much energy it's packing.\n\nThere are levels. They get harder. Same rule as always — write down what you measure before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "💥", style: "info", title: "What 'airburst' even means",
    content: "Coming in fast, the rock slams into thicker and thicker air. The air can't get out of the way fast enough, so it piles up and heats to thousands of degrees — that's the blinding flash. The pressure becomes so extreme the rock <span style=\"font-weight:700\">shatters and explodes in mid-air</span> instead of hitting the surface. That's an <span style=\"font-weight:700\">airburst</span>.\n\nSo where does the kinetic energy go? Mostly into the <span style=\"font-weight:700\">atmosphere</span> — as heat, light, sound, and a shock wave that races outward and reaches the ground a minute or two later. Clue for later: the energy didn't vanish. It got transferred. Your whole job is to follow it." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — where does the energy go? (before the data)",
    instructions: "Sketch the incoming rock with one big arrow labeled 'kinetic energy.' Now draw smaller arrows showing every place you think that energy goes when the rock explodes in the air. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-airburst",
    title: "Class Challenge Board — Account for the Airburst Energy",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's accounting for what.",
    levels: [
      { n: 1, name: "Compute One KE", nameEs: "Calcula Una Energía Cinética" },
      { n: 2, name: "Compare the Speeds", nameEs: "Compara las Velocidades" },
      { n: 3, name: "Follow the Airburst Energy", nameEs: "Sigue la Energía de la Explosión" },
      { n: 4, name: "Airburst vs. Surface Impact", nameEs: "Explosión Aérea vs. Impacto en Superficie" },
      { n: 5, name: "Spot the Real Meteorite", nameEs: "Identifica el Meteorito Real" },
    ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how much energy was Chelyabinsk carrying?",
    content: "The kinetic energy of a moving object is $KE = \\frac{1}{2}mv^2$, where $m$ is mass in kilograms and $v$ is speed in meters per second.\n\nFor Chelyabinsk, estimates put the mass at about $m = 1.2 \\times 10^7\\,\\text{kg}$ and the speed at about $v = 1.9 \\times 10^4\\,\\text{m/s}$.\n\nStep 1 — square the speed: $v^2 = (1.9 \\times 10^4)^2 \\approx 3.6 \\times 10^8\\,\\text{m}^2/\\text{s}^2$.\n\nStep 2 — put it together: $KE = \\frac{1}{2}(1.2 \\times 10^7)(3.6 \\times 10^8) \\approx 2.2 \\times 10^{15}\\,\\text{J}$.\n\nThat's roughly <span style=\"font-weight:700\">500 kilotons of TNT</span>. NASA's sensor-based analysis put the real total near <span style=\"font-weight:700\">440 kilotons</span> — about 30 Hiroshima bombs. Our estimate and the measurement agree closely, which tells us we're in the right ballpark. Notice in $KE = \\frac{1}{2}mv^2$ that speed is <span style=\"font-weight:700\">squared</span> — that's why a fast rock is so dangerous even if it isn't huge." },

  { id: id("ml-ke"), type: "mission_log", title: "Mission Log — Kinetic Energy Calculations",
    intro: "Use $KE = \\frac{1}{2}mv^2$ for each object. <span style=\"font-weight:700\">Show what you plug in before you write an answer.</span> Documented work = a scientist move = points.",
    sections: [ { id: "kelog", kind: "table", title: "Compute and compare",
      columns: [
        { key: "object", label: "Object", placeholder: "car, meteoroid…" },
        { key: "mass", label: "Mass (kg)", width: "120px", placeholder: "1500" },
        { key: "speed", label: "Speed (m/s)", width: "120px", placeholder: "30" },
        { key: "ke", label: "KE (J)", placeholder: "½mv²" },
      ], minRows: 3, addRowLabel: "Add an object" } ] },

  { id: id("setup2"), type: "callout", icon: "🔍", style: "info", title: "Now go find the pieces",
    content: "After the airburst, the small surviving fragments rained down as <span style=\"font-weight:700\">meteorites</span> — dark, fragile rocks scattered across the snow. Teams of scientists and volunteers searched for them. But how do you tell a real meteorite from an ordinary field rock?\n\nTwo quick field tests: <span style=\"font-weight:700\">density</span> (meteorites pack iron and nickel, so they're unusually heavy for their size — weigh it, measure its volume by water displacement) and <span style=\"font-weight:700\">magnetism</span> (that iron-nickel means a strong magnet sticks; most Earth rocks aren't magnetic at all). Match both tests and you've likely got a visitor from space." },

  { id: id("draw-path"), type: "sketch", title: "Draw the Energy Path",
    instructions: "Redraw the airburst now that you've run the numbers. Show the rock's big kinetic-energy arrow splitting into where it actually went: heat in the air, light, sound, the shock wave heading for the ground, and a tiny bit left in the surviving fragments. Label rough sizes. Neat doesn't matter — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-meteorite"), type: "mission_log", title: "Mission Log — Meteorite Field Lab",
    intro: "Four candidate rocks were recovered. Typical Earth rocks have densities around 2.5–3.0 g/cm³; iron-nickel meteorites run about 7–8 g/cm³. Use density AND the magnet test to decide.",
    sections: [ { id: "field", kind: "table", title: "Meteorite or Earth rock?",
      columns: [
        { key: "sample", label: "Sample", width: "90px", placeholder: "A / B / C / D" },
        { key: "verdict", label: "Meteorite? (yes / no / unclear)", placeholder: "yes" },
        { key: "evidence", label: "Evidence (density + magnetism)", placeholder: "dense AND magnet sticks…" },
      ], minRows: 4, addRowLabel: "Add a sample" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop calculating. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we did some math\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the energy?",
      prompts: [
        { id: "q1", label: "In $KE = \\frac{1}{2}mv^2$, speed is squared but mass is not. Use that to explain why a small fast meteoroid can out-punch a heavy slow car.", rows: 3 },
        { id: "q2", label: "The rock exploded ~23 km up and never touched the surface. Explain, using energy transfer, how it still broke windows on the ground.", rows: 3 },
        { id: "q3", label: "Most of the kinetic energy went into the *atmosphere* as heat, light, sound, and a shock wave. Why is it wrong to say the energy was \"destroyed\" in the explosion?", rows: 2 },
        { id: "q4", label: "Compare an airburst to a surface impact. If the same object had hit the ground intact instead, what would have been different about where the energy went?", rows: 2 },
        { id: "q5", label: "How do density and magnetism together let a searcher rule out an ordinary field rock and flag a likely meteorite?", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — add the energy",
    intro: "Same model we started in Arc 1. Today we tweak it: add the incoming rock's <span style=\"font-weight:700\">kinetic energy</span> as one big input, then show it splitting into heat, light, sound, and the shock wave during the airburst. Mark the tiny bit that survives as meteorites. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about the airburst energy or the meteorites. These drive where the unit heads next.",
    starters: [
      "If the energy isn't destroyed, why does the rock ___?",
      "How fast would a rock have to go to ___?",
      "Why does an airburst spread its energy differently than ___?",
      "What can a recovered meteorite tell us about ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the energy ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"kinetic energy,\" \"airburst,\" \"shock wave,\" \"transfer,\" \"density,\" \"meteorite,\" \"kiloton\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A meteoroid roughly the size of a house comes in at about 19,000 meters per second. High in the atmosphere it heats up, shatters, and explodes in a brilliant flash. No crater forms — yet seconds later a shock wave reaches the town below and rattles windows. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Trace the rock's kinetic energy from the moment it enters the atmosphere to the moment windows rattle on the ground. Name where the energy goes, and explain why nothing was \"destroyed.\" Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "During the Chelyabinsk airburst, most of the object's kinetic energy was ultimately —",
    options: [
      "stored forever inside the small rock fragments that survived.",
      "transferred to the atmosphere as thermal energy and shock waves.",
      "destroyed by the explosion, so no energy remained afterward.",
      "converted into a completely new and different form of matter.",
    ], correctIndex: 1,
    explanation: "Energy is conserved. The meteoroid's kinetic energy was transferred to the air as heat, light, sound, and a shock wave — not destroyed and not turned into matter." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Which equation correctly gives the kinetic energy of a moving object?",
    options: [
      "$KE = mgh$, the mass times gravity times the height.",
      "$KE = mv$, the object's mass multiplied by its speed.",
      "$KE = \\frac{1}{2}mv^2$, one-half the mass times speed squared.",
      "$KE = \\frac{1}{2}mv$, one-half the mass times the speed.",
    ], correctIndex: 2,
    explanation: "Kinetic energy is $KE = \\frac{1}{2}mv^2$. Because speed is squared, doubling the speed makes the kinetic energy four times larger." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Two objects have the same mass, but object B moves twice as fast as object A. How does object B's kinetic energy compare to object A's?",
    options: [
      "It is four times as large, because speed is squared in the formula.",
      "It is exactly twice as large, matching the doubling of the speed.",
      "It is half as large, since faster objects spend less time moving.",
      "It is the same, because the two objects have an identical mass.",
    ], correctIndex: 0,
    explanation: "In $KE = \\frac{1}{2}mv^2$, the speed is squared. Doubling $v$ multiplies $v^2$ by four, so the kinetic energy is four times as large." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "How does an airburst differ from a surface impact in terms of where the energy goes?",
    options: [
      "A surface impact spreads all of its energy harmlessly into the upper air.",
      "An airburst and a surface impact transfer energy in exactly the same way.",
      "An airburst always releases far more total energy than any surface impact.",
      "An airburst dumps most energy into the atmosphere; an impact digs a crater.",
    ], correctIndex: 3,
    explanation: "In an airburst, most of the kinetic energy is transferred to the atmosphere as heat and a shock wave high above the ground. A surface impact instead transfers energy into the ground, excavating a crater and ejecting debris." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A magnet sticks strongly to a dark, dense rock found near the Chelyabinsk fall site. What does this magnetism most likely indicate?",
    options: [
      "The rock contains iron-nickel metal, which is common in meteorites.",
      "The rock is an ordinary granite stone of the kind found everywhere.",
      "The rock formed very recently in a nearby volcano's lava flow.",
      "The rock is hollow inside and therefore much lighter than it looks.",
    ], correctIndex: 0,
    explanation: "Most meteorites contain enough iron-nickel metal that a strong magnet sticks to them. Many ordinary Earth rocks are not magnetic, so the magnet test helps flag likely meteorites." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Four recovered rocks are tested. Typical Earth rocks measure 2.5–3.0 g/cm³; iron-nickel meteorites measure about 7–8 g/cm³. Which sample is the strongest meteorite candidate?",
    options: [
      "A glassy black rock at 2.5 g/cm³ that a magnet does not stick to.",
      "A reddish rough rock at 2.5 g/cm³ that a magnet does not stick to.",
      "A dark dense rock at 7.8 g/cm³ that a strong magnet sticks to firmly.",
      "A light porous rock at 2.0 g/cm³ that a magnet does not stick to at all.",
    ], correctIndex: 2,
    explanation: "Meteorites are unusually dense (around 7–8 g/cm³) and magnetic because of their iron-nickel content. The 7.8 g/cm³ rock that a magnet sticks to matches both criteria." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Why do scientists study recovered meteorites so closely?",
    options: [
      "Meteorites are valuable mostly because they are rare and hard to find.",
      "Meteorites are among the oldest solid material in the solar system.",
      "Meteorites are made of elements that exist nowhere else on Earth.",
      "Meteorites slowly grow larger and heavier the longer they sit on Earth.",
    ], correctIndex: 1,
    explanation: "Meteorites are some of the oldest solid material in the solar system, so they offer a direct sample of the material that formed the early Earth and other planets." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A meteoroid explodes about 23 km above a city, yet people on the ground are injured. What carried the energy down to them?",
    options: [
      "Falling chunks of the rock struck nearly everyone on the ground directly.",
      "The bright flash of light alone was hot enough to injure people below it.",
      "A pressure shock wave from the airburst spread outward and reached the ground.",
      "The meteoroid's gravity pulled objects and people toward the blast point.",
    ], correctIndex: 2,
    explanation: "The airburst released a powerful pressure shock wave that traveled outward through the air and reached the ground a minute or two later, shattering windows and injuring people from flying glass." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the incoming rock with one big arrow labeled with its kinetic energy. Show the airburst splitting that arrow into pieces: heat and light in the air, sound, the shock wave heading to the ground, and a tiny bit kept by the surviving fragments. Label rough sizes so the pieces add back up to the original. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the airburst energy that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you put a number on a fireball — $2.2 \\times 10^{15}$ joules, give or take — and followed every bit of it into the air as heat, light, sound, and a window-rattling shock wave. Nothing was destroyed; it just spread out. And you learned how to tell a real space rock from a plain old field stone. Next class we read the craters the bigger ones leave behind. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Energy in the Airburst",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4102,
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
