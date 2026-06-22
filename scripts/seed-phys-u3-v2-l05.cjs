// seed-phys-u3-v2-l05.cjs
// U3 v2 — Arc 5: "Survive the Crash" (OpenSciEd-spine / Rober-engine).
// Merges v1 L09 (Elastic & Inelastic Collisions) + L10 (Impulse) into one
// challenge-arc: "Soften the Hit." Momentum is conserved in every collision;
// KE is conserved ONLY in elastic collisions — in inelastic ones the "missing" KE
// becomes thermal energy, sound, and work crumpling metal. IMPULSE: J = F_avg·Δt = Δp;
// for a fixed Δp, a LONGER collision time → LOWER peak force → safer. Through-line:
// you can't change how much momentum a crash removes — but you can stretch the TIME.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as Arc 2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc5.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l05-impulse";
// Two scored embeds from u3-arc5.md: the 1D collision sim in elastic-inelastic mode,
// and the impulse / crumple-zone explorer. Each gets its own scored block (weight:5).
const COLLISION = "https://paps-tools.web.app/collision-sim-1d.html?mode=elastic-inelastic";
const IMPULSE = "https://paps-tools.web.app/impulse-crumple-explorer.html";

let _n = 0;
const id = (slug) => `v2u3l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "💥", title: "Impulse & Collisions",
    subtitle: "Unit 3 · Arc 5 — Survive the Crash" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you proved momentum is <span style=\"font-weight:700\">conserved</span> in a crash — add it up before, add it up after, same total. Tidy. So here's the thing that should bug you: if momentum is always conserved, why does one crash leave a scratch and another sends people to the hospital? Today we chase the part momentum doesn't tell you — the <span style=\"font-weight:700\">energy</span> that goes missing, and the <span style=\"font-weight:700\">time</span> it takes to stop. That's the whole game of surviving a crash." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Catch a water balloon two ways. Stiff hands, snap it to a stop — it bursts. Pull your hands back as you catch — same balloon, same speed, but it survives. The balloon lost the <span style=\"font-weight:700\">same</span> momentum both times. What changed was how <span style=\"font-weight:700\">long</span> the stop took. That difference is everything. A car is a much bigger balloon, and a crumple zone is just you pulling your hands back." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 4 — quantity over polish. Then we go find the missing energy.",
    sections: [ { id: "recall", kind: "prompts", title: "What momentum doesn't tell you",
      prompts: [
        { id: "q1", label: "In the crashes you modeled last arc, momentum was conserved. Name ONE thing about the crash that momentum alone could NOT tell you.", rows: 2 },
        { id: "q2", label: "Two cars hit at the same speed. One barely dents; one is destroyed. If the momentum change is the same, where did the difference go?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Soften the Hit",
    content: "Take a crash you can't avoid — the momentum has to change by a fixed amount, no getting around it. Your job is to make that <span style=\"font-weight:700\">same</span> stop hurt less. Classify what kind of collision you're dealing with, find where the kinetic energy went, then redesign the hit so the <span style=\"font-weight:700\">peak force</span> on the people inside drops as far as you can push it.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🚗", style: "info", title: "The two ideas you're working with",
    content: "<span style=\"font-weight:700\">Collisions split into two kinds.</span> In an <span style=\"font-weight:700\">elastic</span> collision the objects bounce and total kinetic energy after ≈ before — think two steel spheres clacking. In an <span style=\"font-weight:700\">inelastic</span> collision the objects crumple, bend, and heat up; that deformation does work, so kinetic energy after is <span style=\"font-weight:700\">less</span> than before. Momentum is still conserved either way — only KE changes. Real car crashes live near the inelastic end.\n\n<span style=\"font-weight:700\">Impulse is your lever.</span> Impulse $J = F_{avg}\\Delta t = \\Delta p$. The momentum change in a crash is locked in by mass and speed. But you get to choose the <span style=\"font-weight:700\">time</span> — stretch the stop out and the peak force drops. That's the one knob a car designer can actually turn." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your crash (before the build)",
    instructions: "Pick a crash (a car into a wall, a phone dropped on tile, a player tackled). Sketch what happens to the moving object as it stops. Mark where you think kinetic energy goes, and circle the moment the force is biggest. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-impulse",
    title: "Class Challenge Board — Survive the Crash",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's softening which hit.",
    levels: [
      { n: 1, name: "Classify the Collision", nameEs: "Clasifica la Colisión" },
      { n: 2, name: "Find the Missing KE", nameEs: "Encuentra la EC Perdida" },
      { n: 3, name: "Measure the Impulse", nameEs: "Mide el Impulso" },
      { n: 4, name: "Stretch the Time", nameEs: "Estira el Tiempo" },
      { n: 5, name: "Drop the Peak Force", nameEs: "Reduce la Fuerza Máxima" },
    ] },

  { id: id("embed-collision"), type: "embed", url: COLLISION, scored: true, weight: 5 },

  { id: id("ml-collision"), type: "mission_log", title: "Mission Log — Collision Data Log",
    intro: "Run the sim in elastic and inelastic modes. <span style=\"font-weight:700\">Add up momentum AND kinetic energy before and after each run</span> before you decide which kind it is. Documented reasoning = a scientist move = points.",
    sections: [ { id: "collog", kind: "table", title: "Tracking momentum vs. kinetic energy",
      columns: [
        { key: "trial", label: "Trial", width: "150px", placeholder: "elastic / inelastic / real-world" },
        { key: "p_before", label: "Total p before (kg·m/s)", placeholder: "" },
        { key: "p_after", label: "Total p after (kg·m/s)", placeholder: "" },
        { key: "ke_before", label: "Total KE before (J)", placeholder: "" },
        { key: "ke_after", label: "Total KE after (J)", placeholder: "" },
        { key: "kind", label: "Elastic / Inelastic / In between", placeholder: "" },
      ], minRows: 3, addRowLabel: "Add a trial" } ] },

  { id: id("embed-impulse"), type: "embed", url: IMPULSE, scored: true, weight: 5 },

  { id: id("ml-impulse"), type: "mission_log", title: "Mission Log — Impulse & Peak Force Log",
    intro: "In the crumple explorer, keep the momentum change FIXED and change only the stopping time. Watch what the peak force does. Record before you explain.",
    sections: [ { id: "implog", kind: "table", title: "Same Δp, different stopping time",
      columns: [
        { key: "run", label: "Run", width: "140px", placeholder: "stiff / crumple" },
        { key: "dt", label: "Stopping time Δt (s)", placeholder: "0.05 / 0.20" },
        { key: "dp", label: "Momentum change Δp (kg·m/s)", placeholder: "kept the same" },
        { key: "fpeak", label: "Peak / average force (N)", placeholder: "" },
      ], minRows: 2, addRowLabel: "Add a run" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Two Stops",
    instructions: "Draw two force-vs-time graphs for the SAME crash: one stiff stop (tall, narrow spike) and one crumple stop (short, wide hump). The area under each curve is the impulse — make the two areas look equal. Label which one is safer and why. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running sims. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we watched some crashes\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened in the crash?",
      prompts: [
        { id: "q1", label: "In your inelastic trial, momentum was conserved but kinetic energy was NOT. Where did the missing kinetic energy go? Name at least two places.", rows: 3 },
        { id: "q2", label: "Pick a real crash — two billiard balls, a car hitting a concrete barrier, or a football tackle — and explain whether it's closer to elastic or inelastic, and why.", rows: 3 },
        { id: "q3", label: "A car stops in $0.05\\,\\text{s}$ against a stiff wall, then the same car stops in $0.20\\,\\text{s}$ with a crumple zone. The momentum change is identical. Use $F_{avg}\\Delta t = \\Delta p$ to explain what happens to the average force.", rows: 3 },
        { id: "q4", label: "Name two safety features that intentionally INCREASE collision time. For each, say what it protects and how it stretches $\\Delta t$.", rows: 2 },
        { id: "q5", label: "**Claim:** Does a longer collision time make a crash safer for the people inside? Defend it with the impulse-momentum theorem — be clear about what is held constant.", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why the crumple zone wins",
    content: "Two crash tests, same car, same speed, so the same momentum change: $\\Delta p = 1.5\\times10^{4}\\,\\text{kg}\\cdot\\text{m/s}$.\n\n<span style=\"font-weight:700\">Test A — stiff front end,</span> stops in $\\Delta t = 0.05\\,\\text{s}$:\n$$F_{avg} = \\frac{\\Delta p}{\\Delta t} = \\frac{1.5\\times10^{4}}{0.05} = 3.0\\times10^{5}\\,\\text{N}$$\n\n<span style=\"font-weight:700\">Test B — crumple zone,</span> same $\\Delta p$, stops in $\\Delta t = 0.20\\,\\text{s}$:\n$$F_{avg} = \\frac{1.5\\times10^{4}}{0.20} = 7.5\\times10^{4}\\,\\text{N}$$\n\nThe stopping time went up by a factor of 4, so the average force dropped to <span style=\"font-weight:700\">one-fourth</span>. The impulse $J = F_{avg}\\Delta t = \\Delta p$ is identical in both — the area under the force-time curve is the same. The crumple zone didn't change how much momentum left the car; it just spread that change over more time. That is the whole reason crumple zones, airbags, and seatbelts save lives." },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Model — add impulse",
    intro: "Same crash model we've been building this unit. Today we tweak it: split collisions into elastic vs inelastic, show where the kinetic energy goes when things crumple, and add the <span style=\"font-weight:700\">time</span> knob — stretch $\\Delta t$, drop the peak force. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have about collisions, energy, or impulse. These drive where the unit heads next.",
    starters: [
      "If momentum is always conserved, why does ___?",
      "Where exactly does the kinetic energy go when ___?",
      "How much would the peak force drop if ___?",
      "How do real engineers stretch the collision time in ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the peak force ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"elastic,\" \"inelastic,\" \"impulse,\" \"peak force,\" \"crumple zone,\" \"deform,\" \"impulse-momentum theorem\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A 1500 kg car driving at highway speed crashes into a concrete barrier and stops. In one version the front end is a stiff steel box; in another it's a modern crumple zone that collapses on impact. Same car, same speed, same stop. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the crumple-zone version is safer for the driver even though the car's momentum change is exactly the same in both crashes. Use the words impulse, force, and time. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A 1500 kg car moving at $10\\,\\text{m/s}$ rear-ends a 1500 kg car moving at $2\\,\\text{m/s}$ in the same direction. After the crash the two cars lock together and move as one. Which quantity is conserved, and which is not?",
    options: [
      "Both momentum and kinetic energy are conserved because no objects ever leave the closed system.",
      "Momentum is conserved, but kinetic energy is not because the cars crumple and heat up.",
      "Kinetic energy is conserved, but momentum is not because the two cars stick together.",
      "Neither is conserved because the collision is inelastic and the cars lock together.",
    ], correctIndex: 1,
    explanation: "Momentum is conserved for the isolated two-car system in any collision. Kinetic energy is not conserved here because the cars lock together and deform — some KE becomes thermal energy, sound, and work done on the metal. This is an inelastic collision." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Two steel spheres collide and bounce apart, and the total kinetic energy afterward is almost exactly the same as before. What kind of collision is this?",
    options: [
      "An inelastic collision, because the spheres are made of solid steel.",
      "A perfectly inelastic collision, since the two spheres stick together.",
      "An elastic collision, because the total kinetic energy is conserved.",
      "Neither, because momentum is never conserved when objects bounce.",
    ], correctIndex: 2,
    explanation: "When total kinetic energy after ≈ before, the collision is elastic. Two hard spheres clacking apart is a good approximation of an elastic collision. Momentum is conserved in every collision; KE conservation is what makes this one elastic." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In a typical car crash, where does the \"missing\" kinetic energy go?",
    options: [
      "It becomes thermal energy, sound, and work deforming the crumpling metal.",
      "It is destroyed, which is why total energy goes down in a real crash.",
      "It turns into extra momentum that pushes the wreck farther down the road.",
      "It is stored in the unbent steel and released later when the car is repaired.",
    ], correctIndex: 0,
    explanation: "Energy is conserved overall, but kinetic energy is not conserved in an inelastic crash. The lost KE becomes thermal energy (the metal heats up), sound, and work done deforming the car." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "The impulse-momentum theorem can be written as —",
    options: [
      "$J = m\\,a$, the product of an object's mass and its acceleration.",
      "$J = \\frac{1}{2}mv^2$, the kinetic energy gained during the collision.",
      "$J = m\\,g\\,h$, the gravitational energy stored before the impact.",
      "$J = F_{avg}\\Delta t = \\Delta p$, impulse equals the change in momentum.",
    ], correctIndex: 3,
    explanation: "Impulse is the average net force times the time it acts, and it equals the change in momentum: $J = F_{avg}\\Delta t = \\Delta p$. The other expressions are force, kinetic energy, and gravitational potential energy — not impulse." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A car crashes into a wall. In Test A a stiff front end stops it in $0.05\\,\\text{s}$. In Test B a crumple zone stops the same car in $0.20\\,\\text{s}$. The change in momentum is identical. How does the average force in Test B compare to Test A?",
    options: [
      "Test B has one-fourth the average force of Test A.",
      "Test B has four times the average force of Test A, since it stops over a longer time.",
      "Test B has the exact same average force as Test A.",
      "Test B has one-half the average force of Test A.",
    ], correctIndex: 0,
    explanation: "Impulse equals the change in momentum: $F_{avg}\\Delta t = \\Delta p$. For the same $\\Delta p$, multiplying $\\Delta t$ by 4 (0.05 s → 0.20 s) divides $F_{avg}$ by 4. This is exactly why crumple zones save lives." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "For a fixed change in momentum, a longer collision time produces —",
    options: [
      "a larger peak force, because the crash drags on for a noticeably longer period of time.",
      "a smaller peak force, because the same impulse is spread over more time.",
      "no change in peak force, since only the momentum change matters.",
      "a larger momentum change, because more time means more total impulse.",
    ], correctIndex: 1,
    explanation: "Since $F_{avg}\\Delta t = \\Delta p$ and $\\Delta p$ is fixed, a longer $\\Delta t$ means a smaller $F_{avg}$. The impulse stays the same, but spreading it over more time lowers the peak force on the passengers." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Why does an airbag reduce injury in a crash?",
    options: [
      "It adds momentum to the passenger, canceling out the car's momentum.",
      "It makes the collision perfectly elastic so no kinetic energy is lost.",
      "It increases the time over which the passenger stops, lowering peak force.",
      "It removes the passenger's momentum instantly so the stop is over fast.",
    ], correctIndex: 2,
    explanation: "An airbag extends the stopping time $\\Delta t$ for the passenger. Because $F_{avg}\\Delta t = \\Delta p$ and $\\Delta p$ is fixed, a longer $\\Delta t$ means a smaller average force on the body — the same idea as a crumple zone." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "In a real car crash, which of these is true about momentum and kinetic energy?",
    options: [
      "Both are perfectly conserved, just like in an elastic collision of spheres.",
      "Momentum is conserved for the system, but kinetic energy is not.",
      "Kinetic energy is conserved, but the system's total momentum decreases.",
      "Both are lost, since the crumpling cars destroy energy and momentum.",
    ], correctIndex: 1,
    explanation: "Momentum is conserved for the isolated system in any collision. A real crash is inelastic, so kinetic energy is not conserved — some becomes thermal energy, sound, and deformation. Momentum stays; KE does not." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw two force-vs-time curves for the same crash on the same axes: a tall narrow spike (stiff stop) and a short wide hump (crumple stop). Shade both so the areas look equal — that equal area is the impulse, $\\Delta p$. Label which curve is safer and why. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about crashes that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you found the part momentum doesn't tell you: in a real crash kinetic energy goes missing into heat and crumpled metal — and the way to survive is to stretch the stop out in time so the peak force drops. You can't cheat the momentum change. You CAN buy time. Next class we put that to work designing the crash. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Impulse & Collisions",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3105,
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
