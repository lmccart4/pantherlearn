// seed-phys-u4-v2-l07.cjs
// U4 v2 — Arc 7: "Deflect an Asteroid" (OpenSciEd-spine / Rober-engine).
// Merges v1 L12 (Tracking Near-Earth Objects) + L13 (Design Challenge: Deflect an
// Asteroid) into one challenge-arc: "Deflect an Asteroid." How astronomers detect/track
// NEOs; interpret impact-probability + energy data; communicate risk without panic;
// design a mission that changes an asteroid's velocity enough to miss Earth (trade off
// mission type, time-to-impact, mass, energy); justify with gravity/orbits/energy.
// Through-line: Deflect the Asteroid.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as Arc 2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc7.md (already sourced/audited).
// All NEO probability/energy figures sourced to NASA JPL CNEOS / Sentry (approximate).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l07-deflect";
// Deflection-mode orbit simulator — exact URL from u4-arc7.md (v1 L13 embed).
const SIM = "https://paps-tools.web.app/orbit-gravity-sim.html?mode=deflect";

let _n = 0;
const id = (slug) => `v2u4l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "☄️", title: "Deflect an Asteroid",
    subtitle: "Unit 4 · Arc 7 — Gravity, Orbits & Energy" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you watched a tiny nudge to an orbit grow into a giant change far down the road — that's the whole reason orbits are <span style=\"font-weight:700\">predictable</span> but also <span style=\"font-weight:700\">sensitive</span>. Today we point that idea at the scariest version of the question: a rock is crossing Earth's path. How do we even <span style=\"font-weight:700\">find</span> it, how do we talk about the risk without screaming, and — if we had to — how would we <span style=\"font-weight:700\">push it out of the way</span>? You're on the planetary-defense team now." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Quick gut-check: a 20-meter rock entered the air over Chelyabinsk, Russia in 2013 — <span style=\"font-weight:700\">nobody saw it coming</span>. It released about half a megaton of energy and blew out windows across a city. Now here's the wild part: the energy that did all that damage was just the <span style=\"font-weight:700\">kinetic energy</span> it already had from moving fast — the same $KE = \\frac{1}{2}mv^2$ you've been using all unit. Today we ask what we could have done if we'd spotted it years earlier." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the orbits arcs — quantity over polish. Then we go hunting for asteroids.",
    sections: [ { id: "recall", kind: "prompts", title: "What do we already know about orbits?",
      prompts: [
        { id: "q1", label: "Last arc, you nudged an orbiting object's speed a tiny bit. What happened to its path far in the future — and why?", rows: 2 },
        { id: "q2", label: "An asteroid and the Earth both orbit the Sun. Name ONE thing that decides whether their paths ever cross.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Deflect an Asteroid",
    content: "A small asteroid has been tracked and its orbit <span style=\"font-weight:700\">intersects Earth's</span>. You can't move Earth. What you CAN control is <span style=\"font-weight:700\">when, where, and how</span> you apply a small push or pull to the asteroid. Your mission has to clear three bars: the new orbit misses Earth by a safe margin, you act before the close approach, and your mission type is something we could actually build.\n\nThere are levels. They get harder. The rule from all unit still holds — read the data before you decide what to do. A panicked engineer is a useless engineer." },

  { id: id("setup"), type: "callout", icon: "🔭", style: "info", title: "How we even find these things",
    content: "Astronomers scan the sky for small <span style=\"font-weight:700\">moving</span> points of light. Once an object is spotted, they measure its position over days or weeks, fit an orbit, and predict where it'll be years out. The <span style=\"font-weight:700\">system</span> we track is the asteroid + the Sun + the planets whose gravity tweaks its path.\n\nHere's the catch: tiny uncertainties in today's position and speed <span style=\"font-weight:700\">grow</span> over time. So we don't get a clean yes/no. We get a <span style=\"font-weight:700\">probability</span> — and it updates as we collect more observations. That's not scientists hedging; that's the only honest way to talk about a path we can't measure perfectly yet." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your deflection plan (before the sim)",
    instructions: "Sketch the asteroid's orbit crossing Earth's orbit around the Sun. Mark roughly WHERE along the orbit you'd give it a push, and draw an arrow for the new path you're hoping for. Wrong is fine — we sketch first so we can compare after the sim.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-deflect",
    title: "Class Challenge Board — Deflect an Asteroid",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's saving the planet.",
    levels: [
      { n: 1, name: "Read the Threat Data", nameEs: "Lee los Datos de Amenaza" },
      { n: 2, name: "Communicate the Risk", nameEs: "Comunica el Riesgo" },
      { n: 3, name: "Make It Miss (Any Push)", nameEs: "Hazlo Fallar (Cualquier Empuje)" },
      { n: 4, name: "Act Early, Push Less", nameEs: "Actúa Temprano, Empuja Menos" },
      { n: 5, name: "Justify a Feasible Mission", nameEs: "Justifica una Misión Factible" },
    ] },

  { id: id("ml-threat"), type: "mission_log", title: "Mission Log — Near-Earth Object Threat Log",
    intro: "Read the tracked NEOs below before you touch the sim. <span style=\"font-weight:700\">Write what the data says before you decide how scared to be.</span> Documented reasoning = a scientist move = points.\n\n<span style=\"font-weight:700\">Selected near-Earth objects</span> (approximate values for comparison). Energy is in megatons of TNT — the Chelyabinsk airburst was about 0.5.\n\n| Object | Est. diameter | Impact probability (known) | Est. energy (megatons TNT) | Next close approach |\n| --- | --- | --- | --- | --- |\n| Apophis | ~340 m | Effectively zero for 100 years | ~1,150 | 2029-04-13 |\n| Bennu | ~500 m | 1 in 2,700 by 2182 | ~1,450 | 2135 |\n| Chelyabinsk object | ~20 m | Not detected before entry | ~0.5 | 2013-02-15 |\n| 2024 YR4 | ~50 m | Varying; monitoring | ~8 | 2032 |\n\n<span style=\"font-style:italic\">Data: NASA JPL CNEOS / Sentry (approximate). Probabilities change as observations improve.</span>",
    sections: [ { id: "threatlog", kind: "table", title: "Sizing up the threat",
      columns: [
        { key: "object", label: "Object", width: "120px", placeholder: "Bennu" },
        { key: "worst", label: "What could go wrong in a worst case?", placeholder: "if it hit…" },
        { key: "reassuring", label: "What is reassuring about the data?", placeholder: "the probability is…" },
      ], minRows: 3, addRowLabel: "Add an object" } ] },

  { id: id("ext-cneos"), type: "external_link",
    url: "https://cneos.jpl.nasa.gov/sentry/",
    title: "NASA CNEOS — Sentry: Earth Impact Monitoring",
    description: "NASA's live system for tracking near-Earth objects and their impact probabilities. These numbers update as new observations come in.",
    buttonLabel: "Open NASA Sentry", icon: "🛰️", openInNewTab: true },

  { id: id("embed-sim"), type: "embed", url: SIM, scored: true, weight: 5 },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Deflection Attempt Log",
    intro: "As you work the sim and the levels: <span style=\"font-weight:700\">before you decide an attempt failed, write what you saw.</span> Failed attempts that you document are worth more than a lucky win you can't explain.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracing your attempts",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "mission", label: "Mission type tried", placeholder: "kinetic impactor / gravity tractor / nuclear standoff" },
        { key: "when", label: "How early did you push?", placeholder: "years before approach" },
        { key: "result", label: "Result + what you changed", placeholder: "missed by ___ / changed ___" },
      ], minRows: 3, addRowLabel: "Add an attempt" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw Your Successful Deflection",
    instructions: "Redraw the asteroid's orbit now that you've run the sim. Show the original path heading toward Earth, the spot where you applied your push (label the mission type), and the new path that safely misses. Add a little label for how early you acted. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running the sim. Now we figure out WHY the early pushes worked so much better than the late ones. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"I nudged it and it missed\" into physics you can defend to a review board." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened?",
      prompts: [
        { id: "q1", label: "Why do astronomers report impact risk as a probability (like \"1 in 2,700\") instead of a flat yes or no? Connect it to how we measure an orbit.", rows: 3 },
        { id: "q2", label: "In the sim, why did pushing the asteroid EARLY require a much smaller velocity change than pushing it late? Use what you know about orbits being sensitive to initial conditions.", rows: 3 },
        { id: "q3", label: "Compare a kinetic impactor and a gravity tractor. What does each one trade away? When would you pick one over the other?", rows: 3 },
        { id: "q4", label: "The Chelyabinsk rock was only ~20 m across but did real damage. Using $KE = \\frac{1}{2}mv^2$, explain why even a small asteroid carries so much energy.", rows: 2 },
        { id: "q5", label: "<span style=\"font-weight:700\">Predict:</span> two identical asteroids are on impact courses, one due in 2 years and one due in 30 years. Which is easier to deflect, and why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why early beats late",
    content: "Picture a deflection as a tiny sideways nudge that opens up a small angle in the path. The sideways miss distance at Earth is roughly that velocity change times the travel time:\n\n$$d_\\text{miss} \\approx \\Delta v \\cdot t$$\n\nSuppose you can only manage a nudge of $\\Delta v = 0.001\\,\\text{m/s}$ (about a millimeter per second — truly tiny).\n\nAct <span style=\"font-weight:700\">1 year early</span> ($t \\approx 3.15 \\times 10^{7}\\,\\text{s}$): $d_\\text{miss} \\approx 0.001 \\cdot 3.15 \\times 10^{7} \\approx 3.2 \\times 10^{4}\\,\\text{m}$ — about 32 km. Not enough; Earth is ~12,700 km wide, so you've barely shifted it.\n\nAct <span style=\"font-weight:700\">20 years early</span>: $d_\\text{miss} \\approx 0.001 \\cdot (20 \\cdot 3.15 \\times 10^{7}) \\approx 6.3 \\times 10^{5}\\,\\text{m}$ — about 630 km, and it keeps compounding as the orbit replays. Same tiny push, twenty times the result. <span style=\"font-weight:700\">Time is the cheapest fuel you have.</span>" },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — add deflection",
    intro: "Same asteroid model we've built all unit. Today we tweak it: add the spot where a push is applied, show the new orbit branching off the old one, and label why an EARLIER push needs a smaller change. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about tracking or deflecting asteroids. These drive where we go next.",
    starters: [
      "If we acted early enough, could we deflect ___?",
      "How do astronomers know an asteroid's orbit well enough to ___?",
      "What happens to the asteroid's energy when ___?",
      "Why can't we just ___ to stop an impact?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the capstone. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in the sim — not just looking it up.",
        placeholder: "If we ___, will the asteroid ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"near-Earth object,\" \"impact probability,\" \"deflection,\" \"kinetic impactor,\" \"gravity tractor,\" \"velocity change,\" \"feasibility\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A friend sends you a screenshot of a scary headline: \"ASTEROID BENNU COULD HIT EARTH.\" You pull up the tracking data: Bennu is about 500 m across, with an impact probability of about 1 in 2,700 by the year 2182. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Write the short, accurate explanation you'd send your friend. CLAIM: is Bennu likely to hit Earth in the next century? EVIDENCE: use the probability and diameter. REASONING: explain why a small probability is not the same as zero — and not the same as a guarantee — and why we keep monitoring it." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Why do astronomers report asteroid impact risk as a probability (like \"1 in 2,700\") instead of a flat yes-or-no answer?",
    options: [
      "Because asteroids randomly speed up and slow down for no physical reason at all.",
      "Small uncertainties in the measured position and velocity grow over time, so the future path is uncertain.",
      "Because the asteroid's orbit is already known exactly and probability is just a public-relations choice.",
      "Because probabilities are easier to turn into movie plots than exact predictions are.",
    ], correctIndex: 1,
    explanation: "Orbits are fit from limited observations. Tiny errors in today's position and velocity become larger uncertainties far in the future, so risk is reported as a probability that updates as more data come in." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "How do astronomers first detect a near-Earth asteroid?",
    options: [
      "They look for a small point of light that moves against the fixed background stars.",
      "They wait for the asteroid to enter the atmosphere and glow as a fireball.",
      "They detect the radio signals that all large asteroids naturally broadcast.",
      "They feel the change in Earth's gravity as the asteroid passes nearby us.",
    ], correctIndex: 0,
    explanation: "Asteroids are found as faint points of light that move from night to night relative to the background stars. Repeated position measurements over days or weeks let astronomers fit an orbit." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Two identical asteroids are on impact courses — one will arrive in 2 years, the other in 30 years. Which is easier to deflect with a small push?",
    options: [
      "The 2-year one, because there is less time for anything else to disturb its path.",
      "Neither — the time before impact has no effect on how hard deflection is.",
      "The 30-year one, because a small velocity change applied early grows into a large miss distance.",
      "The 2-year one, because a closer deadline forces the spacecraft to push harder.",
    ], correctIndex: 2,
    explanation: "The earlier you push, the more time the small velocity change has to compound along the orbit. A tiny nudge years out becomes a huge miss distance later — time is the cheapest fuel." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement best describes a kinetic impactor compared with a gravity tractor?",
    options: [
      "A kinetic impactor slowly tows the asteroid, while a gravity tractor slams into it fast.",
      "Both methods change the asteroid's mass rather than its velocity to make it miss Earth.",
      "Neither method changes the asteroid's velocity; they only change Earth's orbit instead.",
      "A kinetic impactor is fast but transfers less total momentum to a large asteroid; a gravity tractor is slow but works on almost any size.",
    ], correctIndex: 3,
    explanation: "A kinetic impactor slams into the asteroid quickly but delivers limited momentum to a big rock. A gravity tractor hovers nearby and tugs it slowly using gravity, working on nearly any size given enough time." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "When we define the \"system\" for an asteroid-deflection problem, what should it include?",
    options: [
      "The asteroid, the Earth, and the Sun, plus the spacecraft during the brief maneuver.",
      "Only the asteroid by itself, since nothing else affects its motion through space.",
      "Only the spacecraft, because it is the single object we are actually controlling.",
      "Every object in the entire solar system, with none of them ever left out.",
    ], correctIndex: 0,
    explanation: "The relevant system is the asteroid, Earth, and Sun, plus the spacecraft during the deflection. Tiny outside effects (Jupiter's gravity, solar radiation) are the surroundings — small enough to ignore for the maneuver." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "The 2013 Chelyabinsk object was only about 20 m across, yet it released roughly 0.5 megatons of energy. Where did that energy come from?",
    options: [
      "From a chemical explosion of gases trapped deep inside the asteroid's rocky core.",
      "From its kinetic energy — a fast-moving mass carries energy equal to one-half m v-squared.",
      "From sunlight that the dark asteroid had been absorbing and storing for centuries.",
      "From Earth's gravity adding brand-new energy to the rock as it fell toward us.",
    ], correctIndex: 1,
    explanation: "The energy was the asteroid's kinetic energy, $KE = \\frac{1}{2}mv^2$. Because $v$ is squared and the entry speed is enormous, even a small mass carries a huge amount of energy." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "An impact probability of \"1 in 2,700\" for Bennu most accurately means —",
    options: [
      "Bennu is guaranteed to strike Earth exactly 2,700 years from the present day.",
      "Bennu has already been confirmed to be on a direct collision course with Earth.",
      "there is a small but non-zero chance of impact, and the number updates with new data.",
      "scientists have no real idea what Bennu will do, so they invented a random number.",
    ], correctIndex: 2,
    explanation: "A small probability like 1 in 2,700 means the chance is low but not zero. It is not a guarantee in either direction, and it changes as astronomers refine Bennu's orbit with more observations." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why is acting early the central principle of asteroid deflection?",
    options: [
      "Because a spacecraft launched sooner can carry far more fuel and explosives.",
      "Because asteroids slow down on their own if you simply give them enough time.",
      "Because Earth's orbit shifts over time and eventually moves out of the way itself.",
      "Because a small velocity change applied early has years to grow into a large miss distance.",
    ], correctIndex: 3,
    explanation: "Orbits are sensitive to initial conditions. A small velocity change made years before the close approach compounds over time into a large miss distance, so early action needs far less energy." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch an asteroid orbit crossing Earth's path. Draw a small push arrow applied EARLY at one spot, and show how the new path peels away to miss Earth. Then draw a second, faded version where the push is applied LATE — show why it needs a much bigger arrow to miss. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about deflecting an asteroid that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you went from \"scary headline\" to \"planetary-defense engineer.\" You read the real data, talked about risk like a scientist instead of a movie trailer, and found the single most important idea in deflection: <span style=\"font-weight:700\">act early, push less.</span> A tiny nudge, given enough time, moves a mountain. Next class we put it all together. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Deflect an Asteroid",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4107,
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
