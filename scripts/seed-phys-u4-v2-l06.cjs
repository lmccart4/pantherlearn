// seed-phys-u4-v2-l06.cjs
// U4 v2 — Arc 6: "Mid-Unit Mastery: From Belt to Earth" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L11 (Mid-Unit Mastery Check) into the v2 challenge-arc engine.
// Through-line: "Deflect the Asteroid." This is the MID-UNIT MASTERY arc — the Status
// Check IS the assessment. Students explain the FULL path of an object from the asteroid
// belt to Earth, connecting gravity (universal gravitation), orbital shape (ellipse /
// eccentricity / perihelion / aphelion), and energy transfer (GPE <-> KE) into one model.
//
// Mastery-heavy: LIGHT challenge_tracker (it's an assessment day, not a build day),
// NO embed. Status Check = 8 factual MC (gravity / orbits / energy) + an integrated
// short_answer explaining the belt->Earth path (CER) + a speed/energy short_answer.
//
// Physics repackaged verbatim from drafts/physics-content-review/u1-v2/_v1-source-u4/
// (arcs 2-5: KE=1/2 mv^2, F_g = G m1 m2 / r^2 and inverse-square behavior, orbit = falling
// + sideways, Kepler T^2 ~ a^3, ellipse/eccentricity/perihelion/aphelion, GPE<->KE trade).
// No new real-world numbers introduced beyond what the sourced arcs already cite.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false). Same 5 platform
// blocks + composed Status Check as the other arcs. safeSeed only (brand-new doc, 0
// responses -> creates it). English-primary; ES via app translation + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l06-mastery";
// No embed for this arc — mastery day is assessment-only.

let _n = 0;
const id = (slug) => `v2u4l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🏁", title: "Mid-Unit Mastery: From Belt to Earth",
    subtitle: "Unit 4 · Arc 6 — Gravity, Orbits & Energy" },

  // ── CONNECT: recall the arc so far → today's mission ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Halfway through \"Deflect the Asteroid\" — and you've stacked up a real model. A fireball over Chelyabinsk carried a staggering amount of <span style=\"font-weight:700\">kinetic energy</span> ($KE=\\frac{1}{2}mv^2$). <span style=\"font-weight:700\">Gravity</span> reaches across space and pulls every mass toward every other ($F_g = G\\frac{m_1 m_2}{r^2}$). Orbits are just falling-while-moving-sideways, and they trace <span style=\"font-weight:700\">ellipses</span>. As an object falls toward the Sun, stored energy turns into speed. Today you pull all of it into ONE story." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A strong mastery answer doesn't just list facts. It <span style=\"font-weight:700\">tells the whole journey</span> — how an object that sat quietly in the asteroid belt for billions of years can end up screaming into Earth's sky. Gravity bends its path, the orbit's shape decides where it goes, and energy transfer decides how fast it's moving when it arrives. Today: connect the small-scale physics to the large-scale path, in words, in a diagram, and with the equations backing you up." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the arc so far — quantity over polish. Get the tools loaded before the check.",
    sections: [ { id: "recall", kind: "prompts", title: "What do we already know?",
      prompts: [
        { id: "q1", label: "In your own words: what does Newton's law of universal gravitation say about how force depends on mass and distance?", rows: 2 },
        { id: "q2", label: "Why doesn't the Moon fall straight into Earth? (Hint: it IS falling — what else is it doing?)", rows: 2 },
        { id: "q3", label: "As an asteroid falls toward the Sun, what happens to its kinetic energy and its speed? Why?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the mastery mission ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Trace the Whole Path",
    content: "Today's mission is a <span style=\"font-weight:700\">mastery check</span> — it counts. Your job: take ONE object and trace its entire journey from the asteroid belt to a possible Earth impact, accounting for it three ways that all agree.\n\n<span style=\"font-weight:700\">(1)</span> Explain how gravity shapes its orbit. <span style=\"font-weight:700\">(2)</span> Explain how the orbit's shape lets it cross Earth's path. <span style=\"font-weight:700\">(3)</span> Explain how energy transfer makes it dangerously fast by the time it arrives. The rule from the whole arc still holds: show your reasoning, not just your answer." },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-mastery",
    title: "Class Challenge Board — Mastery Check",
    intro: "Light board today — it's a check, not a build. Mark each piece as you finish it so you can see your own progress.",
    levels: [
      { n: 1, name: "Map the Path", nameEs: "Traza el Recorrido" },
      { n: 2, name: "Explain the Orbit", nameEs: "Explica la Órbita" },
      { n: 3, name: "Account for the Energy", nameEs: "Contabiliza la Energía" },
    ] },

  { id: id("setup"), type: "callout", icon: "☄️", style: "info", title: "The object you're tracing",
    content: "Use this picture for everything below. An asteroid has orbited safely in the <span style=\"font-weight:700\">asteroid belt</span> (between Mars and Jupiter) for billions of years on a nearly circular path. A close pass by Jupiter nudges its speed, stretching its orbit into an <span style=\"font-weight:700\">ellipse</span> that now reaches inward past Mars and crosses Earth's orbit. On its next swing toward the Sun, it arrives at Earth's neighborhood — moving fast.\n\nClue for the energy part: at <span style=\"font-weight:700\">aphelion</span> (far out, in the belt) it crawls; by the time it falls in to <span style=\"font-weight:700\">perihelion</span> (close to the Sun) it's racing. Hold onto that — it's the whole reason an impact carries so much energy." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — the journey (before you write)",
    instructions: "Sketch the Sun at one focus, Earth's nearly-circular orbit, and the asteroid's stretched ellipse crossing it. Mark perihelion (closest) and aphelion (farthest). Add a short speed arrow at aphelion and a long speed arrow at perihelion to show where it moves fast vs. slow. Don't write the full explanation yet — just lay out the map you'll explain.",
    canvasHeight: 360 },

  { id: id("ml-map"), type: "mission_log", title: "Mission Log — Map the Steps",
    intro: "Before the written check, lay out the steps of the journey in order. <span style=\"font-weight:700\">Name the physics idea behind each step</span> — documented reasoning = a scientist move = points.",
    sections: [ { id: "maptable", kind: "table", title: "Belt → Earth, step by step",
      columns: [
        { key: "step", label: "Step in the journey", placeholder: "in the belt / nudged / falling in / arrives" },
        { key: "idea", label: "Physics idea", placeholder: "gravity / orbit shape / energy transfer" },
        { key: "what", label: "What's happening here", placeholder: "force, orbit, speed, or energy change" },
      ], minRows: 4, addRowLabel: "Add a step" } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — the speed-and-energy move",
    content: "This is the TOOL, not your full answer — a quick example so the energy step is clean.\n\nAn asteroid at <span style=\"font-weight:700\">aphelion</span> moves slowly; at <span style=\"font-weight:700\">perihelion</span> it moves fast. Why? In the isolated Sun-asteroid system, total energy is constant:\n\n$$KE + GPE = \\text{constant}$$\n\nFar from the Sun (aphelion): high $GPE$, low $KE$, so slow. Close to the Sun (perihelion): low $GPE$, high $KE$, so fast. The gravitational potential energy didn't vanish — it was <span style=\"font-weight:700\">transferred</span> into kinetic energy as the asteroid fell inward.\n\nAnd faster means a harder hit, because kinetic energy depends on speed <span style=\"font-weight:700\">squared</span>: $KE=\\frac{1}{2}mv^2$. Double the speed, quadruple the energy delivered on impact. That's why an object that fell a long way in is so dangerous." },

  { id: id("ml-orbit"), type: "mission_log", title: "Mission Log — Why the Orbit Crosses Earth's",
    intro: "Use the orbit-shape vocabulary you earned this arc. Explain in writing how a belt asteroid's path can reach all the way to Earth.",
    sections: [ { id: "orbit", kind: "text", title: "My orbit explanation",
      label: "Use ellipse, eccentricity, perihelion, and aphelion. Both Earth and the asteroid share the Sun as a focus — explain how a stretched ellipse lets the paths cross.",
      placeholder: "Earth's orbit is nearly circular (low eccentricity), but the asteroid's orbit is a stretched ellipse, so…",
      hint: "*Both orbits share the Sun as a focus. A high-eccentricity ellipse reaches from the belt all the way into the inner solar system — and can cross Earth's path at the right time.*", rows: 6 } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "You have the steps mapped. Now make them <span style=\"font-weight:700\">connect</span>. A list of facts isn't a model — the model is showing how each step <span style=\"font-weight:700\">causes</span> the next. Write the connections before we discuss; this is the move that turns a vocabulary dump into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "How do gravity, orbits, and energy connect into one story?",
      prompts: [
        { id: "q1", label: "Gravity gets weaker with distance ($1/r^2$). The asteroid belt is far from the Sun. Explain how gravity can still hold an object in orbit way out there — and still bend its path.", rows: 3 },
        { id: "q2", label: "A nudge stretched the orbit from a near-circle into a long ellipse. Explain why a more eccentric orbit lets the asteroid travel from the belt all the way to Earth's neighborhood.", rows: 3 },
        { id: "q3", label: "Using $KE + GPE = \\text{constant}$, explain why the asteroid is moving much faster at perihelion than at aphelion — without saying \"because gravity makes it faster.\" Use the energy trade.", rows: 3 },
        { id: "q4", label: "Why does a faster asteroid transfer so much more energy on impact? Tie your answer to $KE=\\frac{1}{2}mv^2$ and the fact that speed is squared.", rows: 2 },
        { id: "q5", label: "**Predict:** to *deflect* such an asteroid, would it be easier to change its path while it's far out in the belt (moving slowly) or right before impact (moving fast)? Reason it out before next arc.", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Asteroid Model — connect the three ideas",
    intro: "Same model we've built all arc. Today we tweak it: draw the gravity force arrow pointing at the Sun ALONG the path, label where the orbit's shape lets it cross Earth's, and add the $KE$/$GPE$ swap (slow-and-far vs. fast-and-close). The three ideas should now read as ONE connected story. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l6",
    title: "Class Question Board",
    intro: "Post one question you still have about gravity, orbits, or energy after today's check. These steer the second half of the unit — including how we'd actually deflect one.",
    starters: [
      "If gravity gets weaker with distance, why does ___?",
      "How fast would an asteroid be moving if ___?",
      "What would change the orbit's shape if ___?",
      "How could we deflect an asteroid that ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the asteroid's orbit ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"gravitation,\" \"orbit,\" \"ellipse,\" \"eccentricity,\" \"perihelion,\" \"aphelion,\" \"kinetic energy,\" \"gravitational potential energy\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check IS the mastery assessment ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "This one counts. Show me you can connect gravity, orbital shape, and energy into one story." },

  { id: id("sc-scenario"), type: "callout", icon: "☄️", style: "default", title: "The scenario",
    content: "An asteroid has orbited safely in the asteroid belt for billions of years. A close pass by Jupiter stretches its orbit into an ellipse that crosses Earth's path. On its next swing toward the Sun, it arrives at Earth's neighborhood moving fast. Use this picture for everything below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Explain the full story: how can an asteroid that orbited safely in the belt for billions of years end up colliding with Earth?</span> Connect gravity, orbital shape, and energy transfer into one model.\n\n<span style=\"font-weight:700\">CLAIM:</span> In one or two sentences, state why a belt asteroid can leave the belt and eventually hit Earth.\n<span style=\"font-weight:700\">EVIDENCE:</span> Give at least two pieces — how gravity shapes the orbit, and how energy changes as the asteroid moves.\n<span style=\"font-weight:700\">REASONING:</span> Connect each step to the next: why gravity makes the path curve, why the orbit can cross Earth's, and why the impact transfers so much energy." },

  { id: id("sc-speed"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Explain the speed changes.</span> At two points on the orbit — aphelion (far from the Sun) and perihelion (close to the Sun) — describe the asteroid's speed and energy. Use gravitational potential energy and kinetic energy ($KE + GPE = \\text{constant}$), and explain WHY each one is high or low at each point." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Newton's law of universal gravitation, $F_g = G\\frac{m_1 m_2}{r^2}$, says the gravitational force between two objects —",
    options: [
      "grows larger with more mass and weaker with more distance.",
      "depends only on the heavier of the two objects involved.",
      "stays exactly the same no matter how far apart they are.",
      "acts only between objects that are physically touching.",
    ], correctIndex: 0,
    explanation: "$F_g = G\\frac{m_1 m_2}{r^2}$: more mass means more force, and force falls off with the square of distance. It acts across empty space between any two masses." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "The distance between two asteroids is doubled. What happens to the gravitational force between them?",
    options: [
      "It doubles, because force is proportional to distance.",
      "It stays the same, because mass did not change at all.",
      "It becomes one-fourth as strong, because of the inverse-square law.",
      "It drops to zero, because gravity cannot reach that far in space.",
    ], correctIndex: 2,
    explanation: "Gravity follows an inverse-square law ($1/r^2$). Doubling $r$ makes the denominator $2^2 = 4$, so the force drops to one-fourth." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why doesn't the Moon fall straight down into Earth?",
    options: [
      "Earth's gravity does not actually reach as far as the Moon does.",
      "It is moving sideways fast enough that it keeps falling and missing.",
      "Another planet's pull exactly cancels Earth's pull on the Moon.",
      "The Moon is too massive for Earth's gravity to bend its straight path.",
    ], correctIndex: 1,
    explanation: "An orbit is a fall that never lands. The Moon is falling toward Earth, but its sideways (tangential) velocity is large enough that the ground curves away as fast as it falls — so it keeps missing." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Kepler's first law says that a planet's orbit is —",
    options: [
      "a perfect circle with the Sun at the exact center.",
      "a spiral that slowly winds inward toward the Sun.",
      "a straight line bent only when planets pass nearby.",
      "an ellipse with the Sun at one focus, not the center.",
    ], correctIndex: 3,
    explanation: "Kepler's first law: orbits are ellipses with the central body at one focus. A circle is just the special case where eccentricity is zero." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A newly found asteroid orbits the Sun with a semi-major axis of $a = 4.0$ AU. Using Kepler's third law ($T^2 \\approx a^3$), about how long is its year?",
    options: [
      "About 8 years, because $T \\approx \\sqrt{a^3} = \\sqrt{64}$.",
      "About 4 years, because the period equals the distance.",
      "About 12 years, because the period triples the distance.",
      "About 16 years, because the period squares the distance.",
    ], correctIndex: 0,
    explanation: "Kepler's third law: $T^2 \\propto a^3$. For $a = 4$ AU, $a^3 = 64$, so $T = \\sqrt{64} = 8$ years." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "An asteroid moves from aphelion (far from the Sun) toward perihelion (close to the Sun). Which energy statement is correct?",
    options: [
      "Both kinetic and gravitational potential energy stay the same.",
      "Kinetic energy increases and gravitational potential energy decreases.",
      "Kinetic energy decreases and gravitational potential energy increases.",
      "Total energy increases because the asteroid is clearly speeding up.",
    ], correctIndex: 1,
    explanation: "As the asteroid falls toward the Sun, gravitational potential energy is converted into kinetic energy, so it speeds up. The total energy of the isolated Sun-asteroid system stays constant." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "How can an asteroid's orbit cross Earth's nearly circular orbit, even though it started far out in the belt?",
    options: [
      "Earth reaches out and pulls the asteroid off its original path.",
      "The asteroid's orbit must be smaller than Earth's to reach inward.",
      "Its stretched, eccentric ellipse reaches from the belt to inside Earth's orbit.",
      "The two orbits cross only because they circle around different stars.",
    ], correctIndex: 2,
    explanation: "Both orbits share the Sun as a focus. A high-eccentricity ellipse stretches from the belt all the way into the inner solar system, so its path can cross Earth's near-circular orbit." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Kinetic energy is $KE = \\frac{1}{2}mv^2$. If an incoming asteroid's speed doubles while its mass stays the same, the kinetic energy it can deliver on impact —",
    options: [
      "stays the same, since only its mass sets the impact energy.",
      "is cut in half, because faster objects pass through more quickly.",
      "also just doubles, matching the doubling of the speed value.",
      "quadruples, because the speed term is squared in the equation.",
    ], correctIndex: 3,
    explanation: "Because $KE = \\frac{1}{2}mv^2$ depends on speed squared, doubling the speed multiplies the kinetic energy by $2^2 = 4$. Speed matters far more than mass for impact energy." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw the asteroid's elliptical orbit with the Sun at one focus and Earth's near-circular orbit crossing it. Mark perihelion and aphelion. Add a short speed arrow at aphelion and a long speed arrow at perihelion, and a small label showing GPE high/low and KE high/low at each point. Neat doesn't matter; show your thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy what to review before the second half of the unit." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest part of today's check:", rows: 1 },
        { id: "surprise", label: "One connection between gravity, orbits, and energy that *clicked* for you today, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You connected three big ideas into one story — gravity that reaches across space, an orbit shaped into an ellipse, and energy that turns distance into speed. That's the whole picture of how a quiet rock in the belt becomes a threat. Next arc we put it to work: how do we actually track these things and deflect one? See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Mid-Unit Mastery: From Belt to Earth",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4106,
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
