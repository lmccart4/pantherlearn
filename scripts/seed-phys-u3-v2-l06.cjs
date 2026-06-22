// seed-phys-u3-v2-l06.cjs
// U3 v2 — Arc 6: "Crash Forces: Mid-Unit Mastery" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L11 (Mid-Unit Mastery Check) into the v2 challenge-arc engine.
// Through-line: "Survive the Crash." This is the MID-UNIT MASTERY arc — the Status
// Check IS the assessment. Students explain a collision integrating momentum, impulse,
// and force, AND solve a 1D momentum-conservation problem, then connect the math back
// to a physical explanation of the crash.
//
// Mastery-heavy: light challenge_tracker (it's an assessment day, not a build day),
// no embed. Status Check = 6-8 factual MC (force/momentum/impulse) + a worked 1D
// conservation short_answer + a CER-style explanation short_answer.
//
// The 1D conservation problem uses ROUND TEACHING NUMBERS framed as an illustrative
// scenario (not a real-world statistic) — no NEEDS-RESEARCH figures required.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false). Same 5 platform
// blocks + composed Status Check as the other arcs. safeSeed only (brand-new doc, 0
// responses → creates it). English-primary; ES via app translation + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l06-mastery";
// No embed for this arc — mastery day is assessment-only.

let _n = 0;
const id = (slug) => `v2u3l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🏁", title: "Crash Forces: Mid-Unit Mastery",
    subtitle: "Unit 3 · Arc 6 — Forces & Momentum" },

  // ── CONNECT: recall the arc so far → today's mission ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Halfway through \"Survive the Crash\" — and you've stacked up a real model. Force is a push or pull ($F=ma$). Crashes are <span style=\"font-weight:700\">interactions</span> — equal-and-opposite forces (Newton's 3rd). Momentum is $p=mv$, and in an isolated system the total is <span style=\"font-weight:700\">conserved</span>. Impulse links force, time, and momentum change. Today you pull all of it together to explain — and <span style=\"font-weight:700\">calculate</span> — a real crash." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A good crash answer doesn't just land the right number. It <span style=\"font-weight:700\">tells the story</span> of the collision — in words, in a diagram, and in math that all agree with each other. That's the whole game today: calculate what happens, then explain what the numbers <span style=\"font-weight:700\">mean</span> for the people inside the cars." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the arc so far — quantity over polish. Get the tools loaded before the check.",
    sections: [ { id: "recall", kind: "prompts", title: "What do we already know?",
      prompts: [
        { id: "q1", label: "In your own words: what does it mean to say momentum is *conserved* in a collision?", rows: 2 },
        { id: "q2", label: "Two cars crash. Write the equal-and-opposite force pair (Newton's 3rd). Which car feels the bigger force?", rows: 2 },
        { id: "q3", label: "Impulse links force and time. Why does making a crash *last longer* make it safer?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the mastery mission ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Reconstruct the Crash",
    content: "Today's mission is a <span style=\"font-weight:700\">mastery check</span> — it counts. Your job: take one collision and account for it three ways that all agree.\n\n<span style=\"font-weight:700\">(1)</span> Calculate the after-crash velocity using conservation of momentum. <span style=\"font-weight:700\">(2)</span> Explain in physical terms why the passengers feel a jolt. <span style=\"font-weight:700\">(3)</span> Connect the math to the design — why crumple zones change the force people feel. The rule from the whole arc still holds: show your reasoning, not just your answer." },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-mastery",
    title: "Class Challenge Board — Mastery Check",
    intro: "Light board today — it's a check, not a build. Mark each piece as you finish it so you can see your own progress.",
    levels: [
      { n: 1, name: "Set Up Conservation", nameEs: "Plantea la Conservación" },
      { n: 2, name: "Solve for Final Velocity", nameEs: "Resuelve la Velocidad Final" },
      { n: 3, name: "Explain the Jolt", nameEs: "Explica el Golpe" },
    ] },

  { id: id("setup"), type: "callout", icon: "🚗", style: "info", title: "The collision you're reconstructing",
    content: "Use this scenario for everything below (round teaching numbers — an illustrative crash, not a news report):\n\nA <span style=\"font-weight:700\">1500 kg</span> car drives east at <span style=\"font-weight:700\">20 m/s</span> and rear-ends a <span style=\"font-weight:700\">1000 kg</span> car sitting still (0 m/s) at a red light. The two cars <span style=\"font-weight:700\">lock together</span> and slide off as one (a perfectly inelastic collision). Ignore friction during the brief moment of impact.\n\nClue for later: the cars crumple over about <span style=\"font-weight:700\">0.2 s</span> instead of stopping instantly. Hold onto that — it's the whole reason anyone walks away." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — before and after (before you calculate)",
    instructions: "Sketch the crash in two frames. BEFORE: both cars with mass + velocity arrows (length = speed). AFTER: the locked-together pair with one velocity arrow. Don't compute yet — just show what you predict the after-arrow looks like compared to the before-arrows.",
    canvasHeight: 340 },

  { id: id("ml-setup"), type: "mission_log", title: "Mission Log — Set Up the Math",
    intro: "Before plugging numbers, lay out the bookkeeping. <span style=\"font-weight:700\">Write what each symbol stands for</span> — documented setup = a scientist move = points.",
    sections: [ { id: "setuptable", kind: "table", title: "Momentum bookkeeping",
      columns: [
        { key: "car", label: "Car", width: "90px", placeholder: "moving / parked" },
        { key: "mass", label: "Mass (kg)", placeholder: "1500" },
        { key: "vbefore", label: "Velocity BEFORE (m/s)", placeholder: "20" },
        { key: "pbefore", label: "Momentum BEFORE (kg·m/s)", placeholder: "mass × velocity" },
      ], minRows: 2, addRowLabel: "Add a car" } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how to attack a 1D conservation problem",
    content: "This is the TOOL, not the answer to your scenario — a different crash so you see the moves.\n\nA <span style=\"font-weight:700\">2.0 kg</span> cart moving at <span style=\"font-weight:700\">3.0 m/s</span> hits a <span style=\"font-weight:700\">1.0 kg</span> cart at rest; they stick together. Find their shared speed.\n\nStep 1 — total momentum before equals total momentum after:\n$$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\\,v_f$$\n\nStep 2 — substitute with units:\n$2.0\\,\\text{kg} \\cdot 3.0\\,\\text{m/s} + 1.0\\,\\text{kg} \\cdot 0\\,\\text{m/s} = (2.0 + 1.0)\\,\\text{kg} \\cdot v_f$\n\nStep 3 — solve: $6.0\\,\\text{kg}\\cdot\\text{m/s} = 3.0\\,\\text{kg} \\cdot v_f$, so $v_f = 2.0\\,\\text{m/s}$ in the original direction.\n\nNotice the combined cart is <span style=\"font-weight:700\">slower</span> than the first cart was — the same momentum is now spread over more mass. That's exactly the move your scenario needs." },

  { id: id("ml-solve"), type: "mission_log", title: "Mission Log — Solve It",
    intro: "Now run YOUR scenario (the 1500 kg + 1000 kg crash). Show every line — the equation, the substitution with units, and the boxed final answer with direction.",
    sections: [ { id: "solve", kind: "text", title: "My full solution",
      label: "Write the conservation equation, substitute the numbers with units, and solve for the after-crash speed and direction.",
      placeholder: "m₁v₁ + m₂v₂ = (m₁ + m₂)vf  →  …",
      hint: "*Check: is your combined speed slower than 20 m/s? It should be — more mass is now carrying the same momentum.*", rows: 6 } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "You have a number. Now make it <span style=\"font-weight:700\">mean</span> something. A velocity with no physical story is half an answer. Write the explanation before we discuss — this is the move that turns arithmetic into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does the math actually tell us about the crash?",
      prompts: [
        { id: "q1", label: "Your combined speed came out *lower* than 20 m/s. Explain why, using momentum and mass — not just \"because the equation said so.\"", rows: 3 },
        { id: "q2", label: "During impact, the moving car pushes the parked car. By Newton's 3rd law, what does the parked car do back? Which passengers feel a bigger jolt, and why?", rows: 3 },
        { id: "q3", label: "The cars crumple over about 0.2 s instead of stopping instantly. Using $J = F\\,\\Delta t = \\Delta p$, explain how stretching the time changes the force on the passengers.", rows: 3 },
        { id: "q4", label: "Same momentum change either way. Why is a longer crash a *safer* crash? Tie it back to impulse.", rows: 2 },
        { id: "q5", label: "**Predict:** if the heavier car had been moving at 30 m/s instead of 20 m/s, would the combined speed go up or down? Reason it out before you compute.", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Crash Model — add the math",
    intro: "Same crash model we've built all arc. Today we tweak it: show the before/after momentum bookkeeping ON the model, mark the equal-and-opposite force pair at impact, and add the crumple-time arrow that stretches $\\Delta t$ to shrink the force. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l6",
    title: "Class Question Board",
    intro: "Post one question you still have about crashes, momentum, or force after today's check. These steer the rest of the unit.",
    starters: [
      "If momentum is always conserved, why does ___?",
      "How much force would the passengers feel if ___?",
      "Why does a longer crash time ___?",
      "What would change if the cars didn't ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the force on the passengers ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"momentum,\" \"impulse,\" \"conserved,\" \"inelastic,\" \"isolated system,\" \"crumple zone\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check IS the mastery assessment ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "This one counts. Show me you can calculate the crash AND explain what the numbers mean." },

  { id: id("sc-scenario"), type: "callout", icon: "💥", style: "default", title: "The scenario",
    content: "A 1500 kg car moving east at 20 m/s rear-ends a 1000 kg car stopped at a light. The cars lock together and slide off as one. The crash plays out over about 0.2 s as the front ends crumple. Use this picture for everything below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Solve for the velocity of the two cars just after the collision.</span> Write your momentum-conservation equation, substitute the values with units, and state the final speed and direction. Show every line." },

  { id: id("sc-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Now explain the same collision in physical terms.</span> Use momentum, impulse, and force to describe why the passengers feel a jolt and why modern cars use crumple zones.\n\n<span style=\"font-weight:700\">CLAIM:</span> State what determines how much force the passengers experience.\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite the masses, speeds, and the 0.2 s crash time from the scenario.\n<span style=\"font-weight:700\">REASONING:</span> Connect the total momentum of the system to the final velocity, then use impulse ($F_\\text{avg}\\,\\Delta t = \\Delta p$) to explain how crumple zones change the force on passengers." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Newton's second law is written $F = ma$. In words, it says the net force on an object equals its —",
    options: [
      "mass divided by its acceleration.",
      "mass multiplied by its acceleration.",
      "weight multiplied by its top speed.",
      "velocity divided by the elapsed time.",
    ], correctIndex: 1,
    explanation: "$F = ma$: net force equals mass times acceleration. A bigger force, or a smaller mass, produces a bigger acceleration." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Two cars collide. According to Newton's third law, the force the first car exerts on the second is —",
    options: [
      "larger, because the first car was the one moving the fastest.",
      "smaller, because the second car was parked and weighed less.",
      "equal in size and opposite in direction to the force back.",
      "zero, because only the heavier car can exert any real force at all.",
    ], correctIndex: 2,
    explanation: "Newton's third law: forces come in equal-and-opposite pairs. Each car pushes on the other with the same size force in opposite directions — even if one is heavier or was the one moving." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "The momentum of an object is defined as —",
    options: [
      "its mass times its velocity, $p = mv$.",
      "its mass times its acceleration value.",
      "one-half its mass times its speed squared.",
      "its weight divided by the time of contact.",
    ], correctIndex: 0,
    explanation: "Momentum is $p = mv$ — mass times velocity. It's a vector, so direction matters. (One-half mass times speed squared is kinetic energy, a different quantity.)" },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "In an isolated system (no outside forces), the total momentum of the objects before a collision compared to after the collision is —",
    options: [
      "always larger afterward, since the crash releases extra stored-up energy.",
      "the same — total momentum is conserved in an isolated system.",
      "always smaller after, because some momentum turns into heat.",
      "unrelated, since each object keeps its own separate momentum.",
    ], correctIndex: 1,
    explanation: "Conservation of momentum: with no outside forces, the total momentum of the system is the same before and after. Individual objects swap momentum, but the total is unchanged." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A crash where the objects lock together and move off as one is called a —",
    options: [
      "elastic collision, because the objects bounce cleanly apart.",
      "balanced collision, because the two forces cancel each other.",
      "perfectly inelastic collision, because the objects stick together.",
      "frictionless collision, because no outside forces are acting.",
    ], correctIndex: 2,
    explanation: "When objects stick together and move as one, it's a perfectly inelastic collision. Momentum is still conserved, but the most kinetic energy is lost (to heat, sound, and deformation)." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Impulse is the link between force and momentum. It is written —",
    options: [
      "$J = F\\,\\Delta t = \\Delta p$, force times time equals momentum change.",
      "$J = \\frac{1}{2}mv^2$, the same thing as the object's total kinetic energy.",
      "$J = mgh$, the force of gravity acting over some vertical height.",
      "$J = \\frac{m}{a}$, the mass of the object divided by its acceleration.",
    ], correctIndex: 0,
    explanation: "Impulse $J = F\\,\\Delta t = \\Delta p$: a force acting over a time produces a change in momentum. Spreading the same $\\Delta p$ over a longer $\\Delta t$ means a smaller average force." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Why does a crumple zone make a crash safer for the passengers?",
    options: [
      "It increases the car's momentum so the crash transfers less force.",
      "It removes the momentum change entirely so no force is needed.",
      "It makes the collision elastic so the car bounces away unharmed.",
      "It stretches out the stopping time, which lowers the average force.",
    ], correctIndex: 3,
    explanation: "From $F\\,\\Delta t = \\Delta p$: the momentum change $\\Delta p$ is fixed by the crash, but crumpling stretches $\\Delta t$. A longer time means a smaller average force $F$ on the passengers." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A 1500 kg car at 20 m/s strikes and locks onto a 1000 kg parked car. Without computing exactly, the combined cars move off at a speed that is —",
    options: [
      "exactly 20 m/s, because the total momentum is always conserved in a crash.",
      "less than 20 m/s, because the same momentum now moves more mass.",
      "more than 20 m/s, because two cars together have more momentum.",
      "exactly 10 m/s, because the speed always splits evenly in half.",
    ], correctIndex: 1,
    explanation: "Total momentum is conserved, but it's now carried by 2500 kg instead of 1500 kg. The same momentum spread over more mass gives a smaller speed — less than 20 m/s. (It works out to 12 m/s.)" },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw the crash as a before/after momentum diagram. BEFORE: a long arrow for the moving car's momentum and a zero arrow for the parked car. AFTER: one combined arrow for the locked-together pair. Make your after-arrow the same total length as the before-arrows added up — that's conservation. Neat doesn't matter; show your thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy what to review before the second half of the unit." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest part of today's check:", rows: 1 },
        { id: "surprise", label: "One thing about the crash math that *clicked* for you today, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You reconstructed a crash three ways — math, words, and a diagram — and made them all agree. That's exactly what an engineer does before they design a thing that keeps people alive. Next arc we put that to work and design a safer crash. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Crash Forces: Mid-Unit Mastery",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3106,
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
