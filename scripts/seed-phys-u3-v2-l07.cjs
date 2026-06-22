// seed-phys-u3-v2-l07.cjs
// U3 v2 — Arc 7: "Design a Safer Crash" (OpenSciEd-spine / Rober-engine).
// Merges v1 L12 (Seatbelts, Airbags & Crumple Zones) + L13 (Design Challenge: Safer
// Crash) into one challenge-arc. Physics: seatbelts/airbags/crumple zones EXTEND the
// stopping time for a fixed momentum change → LOWER the peak force ($F_{avg}\\Delta t =
// \\Delta p$). Students analyze crash-test data, then design a crumple-zone/restraint
// system that keeps peak force under a limit while trading off cost and weight, and
// justify it with momentum/impulse/force (CER). Through-line: "Survive the Crash."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1 Arc 2. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc7.md (already sourced/audited).
// All crash-test numbers come from that source's table (explicitly illustrative/rounded).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l07-safer-crash";
// crumple-zone-designer embed URL is from u3-arc7.md (exact).
const DESIGNER = "https://paps-tools.web.app/crumple-zone-designer.html";

let _n = 0;
const id = (slug) => `v2u3l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🚗", title: "Design a Safer Crash",
    subtitle: "Unit 3 · Arc 7 — Forces & Momentum" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you proved it with the math: for a fixed momentum change, a longer <span style=\"font-weight:700\">stopping time</span> means a smaller peak <span style=\"font-weight:700\">force</span> — that's impulse, $F_{avg}\\Delta t = \\Delta p$. Today we put that idea to work and answer the question this whole unit has been driving at: <span style=\"font-weight:700\">how do we make a crash survivable?</span> You're going to design the car that does it." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A crash is brutally simple physics. The car is moving; then it isn't. That change in momentum, $\\Delta p$, is locked in the second you hit the wall — your speed and mass set it, and no safety feature can shrink it.\n\nSo if you can't change $\\Delta p$, what's left to control? The <span style=\"font-weight:700\">time</span>. Stretch the stop from a few thousandths of a second to a tenth of a second and the peak force drops hard. Seatbelts stretch. Airbags squish. Crumple zones fold. Every one of them is doing the exact same job: <span style=\"font-weight:700\">buy time, kill force.</span>" },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from last arc — quantity over polish. Then we go build a safer car.",
    sections: [ { id: "recall", kind: "prompts", title: "What can — and can't — a crash change?",
      prompts: [
        { id: "q1", label: "In a crash, which is fixed the instant you hit the wall: the momentum change $\\Delta p$, or the stopping time? Explain in one line.", rows: 2 },
        { id: "q2", label: "Name ONE thing in a real car you think is there to make the stop *take longer*. Why do you think it works?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Design a Safer Crash",
    content: "You're on a vehicle-safety engineering team. Your car hits a rigid wall at a fixed speed — you <span style=\"font-weight:700\">cannot</span> change the speed or the car's mass. What you CAN control is the front end: the material, the length of the crumple zone, and how it collapses, plus the restraints inside.\n\nThe goal: keep the peak force on the passenger cell <span style=\"font-weight:700\">under the injury threshold</span> — while staying inside the cost budget and the weight limit. The levels get harder. Write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🛡️", style: "info", title: "How the three features work together",
    content: "The <span style=\"font-weight:700\">system</span> here is the car + occupant. Each feature is a structure with one function: turn a dangerous peak force into a smaller, longer-lasting one.\n\n<span style=\"font-weight:700\">Crumple zones</span> at the front and rear deform on impact, stretching out the time the car's own momentum takes to reach zero, so the passenger cell slows more gradually. <span style=\"font-weight:700\">Seatbelts</span> keep the occupant moving with the car instead of flying forward, and stretch a little to add stopping time. <span style=\"font-weight:700\">Airbags</span> fill the gap to the wheel or dash, inflate fast, then let air bleed out as the person sinks in — spreading the force over a bigger area and a longer time.\n\nThe trade-off you'll fight: a longer, softer crumple zone is safer but heavier and pricier; a stiff, short front end is cheap and light but slams the peak force back up. Find the mix that passes all three tests." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your front end (before the build)",
    instructions: "Sketch the front of a car heading into a wall. Draw where you'd put a crumple zone and how long it is, and show the occupant + restraints. With arrows, show how you expect the force on the passenger cell to change as the front end folds. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-safer-crash",
    title: "Class Challenge Board — Survive the Crash",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's keeping their passenger alive.",
    levels: [
      { n: 1, name: "Read the Crash Data", nameEs: "Lee los Datos del Choque" },
      { n: 2, name: "Add a Restraint", nameEs: "Agrega una Sujeción" },
      { n: 3, name: "Build a Crumple Zone", nameEs: "Construye una Zona de Deformación" },
      { n: 4, name: "Beat the Force Limit", nameEs: "Vence el Límite de Fuerza" },
      { n: 5, name: "Pass Cost AND Weight", nameEs: "Aprueba Costo Y Peso" },
    ] },

  { id: id("embed-designer"), type: "embed", url: DESIGNER, scored: true, weight: 5 },

  // Crash-test data from u3-arc7.md (explicitly illustrative + rounded in the source).
  { id: id("ml-data"), type: "mission_log", title: "Mission Log — Crash-Test Data Log",
    intro: "Approximate frontal crash-test data (illustrative — values are rounded for comparison; real tests vary by vehicle and crash configuration). Read each row, then log what you notice <span style=\"font-weight:700\">before</span> the designer run.",
    sections: [
      { id: "given", kind: "text", title: "The data table you're working from",
        label: "No seatbelt, no airbag: stopping time 0.005 s, peak chest force 50 kN.  •  Seatbelt only: 0.040 s, 8 kN.  •  Seatbelt + airbag: 0.080 s, 4 kN.  •  Seatbelt + airbag + crumple zone: 0.150 s, 2 kN.",
        placeholder: "(Copy any row you want to reason from here.)", rows: 2 },
      { id: "tracelog", kind: "table", title: "What the data shows",
        columns: [
          { key: "config", label: "Configuration", placeholder: "belt only, belt+airbag…" },
          { key: "time", label: "Stopping time (s)", width: "120px", placeholder: "0.040" },
          { key: "force", label: "Peak force (kN)", width: "120px", placeholder: "8" },
          { key: "why", label: "Why time ↑ → force ↓", placeholder: "fixed Δp, longer Δt…" },
        ], minRows: 3, addRowLabel: "Add a configuration" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw Your Force-vs-Time Picture",
    instructions: "Draw two stops on the same axes: a rigid car (short, tall force spike) and a crumpling car (longer, lower force bump). Shade each one — the AREA under each curve is the impulse, and both must equal the same fixed $\\Delta p$. Show the trade: shorter time forces a taller spike. Neat doesn't matter; show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-design"), type: "mission_log", title: "Mission Log — Design Iterations",
    intro: "Log each design you run in the simulator. One row per attempt — including the ones that fail. Failed designs are evidence, not embarrassment.",
    sections: [ { id: "iter", kind: "table", title: "Design log",
      columns: [
        { key: "try", label: "Try #", width: "70px", placeholder: "1" },
        { key: "choice", label: "Material / length / collapse", placeholder: "soft, long, controlled fold" },
        { key: "result", label: "Peak force / cost / weight", placeholder: "under limit? over budget?" },
        { key: "change", label: "What you changed next, and why", placeholder: "shortened to drop weight…" },
      ], minRows: 3, addRowLabel: "Add an iteration" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop building. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we got a design to pass\" into physics you can defend." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Why does crumpling save lives?",
      prompts: [
        { id: "q1", label: "<span style=\"font-weight:700\">Structure and function.</span> Pick ONE feature (seatbelt, airbag, or crumple zone). Describe its structure, then explain how that structure lets it do its safety job.", rows: 3 },
        { id: "q2", label: "The occupant's momentum change is fixed by the crash. So what, exactly, do all three safety features change? Be precise.", rows: 2 },
        { id: "q3", label: "Use the data: going from \"no restraint\" (0.005 s) to \"belt + airbag + crumple\" (0.150 s), the peak force dropped from 50 kN to 2 kN. Tie that drop to $F_{avg}\\Delta t = \\Delta p$ in your own words.", rows: 3 },
        { id: "q4", label: "Why is a car that *crumples* safer than one built to stay perfectly rigid, even though the rigid car \"looks tougher\"?", rows: 2 },
        { id: "q5", label: "<span style=\"font-weight:700\">Predict:</span> if a crumple zone is too short and runs out of room to collapse before the car stops, what happens to the peak force? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — same Δp, two different stops",
    content: "A passenger has momentum change $\\Delta p = 1500\\,\\text{kg}\\cdot\\text{m/s}$ in a crash. That number is FIXED — it's set by mass and speed.\n\n<span style=\"font-weight:700\">Rigid car</span> — the stop takes $\\Delta t = 0.005\\,\\text{s}$:\n$$F_{avg} = \\frac{\\Delta p}{\\Delta t} = \\frac{1500}{0.005} = 300{,}000\\,\\text{N}$$\n\n<span style=\"font-weight:700\">Crumpling car</span> — the same stop is stretched to $\\Delta t = 0.150\\,\\text{s}$:\n$$F_{avg} = \\frac{1500}{0.150} = 10{,}000\\,\\text{N}$$\n\nSame momentum change, but 30 times longer to stop, so the average force is 30 times smaller. That's the entire job of a crumple zone: spend time to buy a lower force. Your design's whole game is maximizing $\\Delta t$ without running out of crush space." },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Model — add the safety system",
    intro: "Same crash model we've built across the unit. Today we tweak it: add the crumple zone, belt, and airbag, and show with arrows how each one stretches the stopping time and pulls the peak force down. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about crash safety and design. These drive where the unit heads next.",
    starters: [
      "If a longer crumple zone is safer, why don't cars just ___?",
      "How do engineers decide the injury threshold for ___?",
      "What happens to the peak force when ___?",
      "Why does a real crash test use ___ instead of ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the capstone. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the peak force ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"impulse,\" \"crumple zone,\" \"peak force,\" \"injury threshold,\" \"restraint,\" \"trade-off,\" \"deform\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💥", style: "default", title: "The scenario",
    content: "Two identical cars hit the same wall at the same speed. Car A is built stiff and rigid; it stops in 0.005 s. Car B has a long crumple zone, a seatbelt, and an airbag; it stops in 0.150 s. The passenger's momentum change is the same in both. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the passenger in Car B is far safer than the passenger in Car A, even though both cars hit the wall at the same speed. Use stopping time, peak force, and momentum change in your answer." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "According to the crash-test data, what is the main effect of adding seatbelts, airbags, and crumple zones together?",
    options: [
      "They reduce the total momentum change of the occupant during the whole crash.",
      "They make the car much more rigid so its front end does not deform at all in the crash.",
      "They extend the stopping time and so reduce the peak force on the occupant.",
      "They increase the total momentum change of the occupant during the whole crash.",
    ], correctIndex: 2,
    explanation: "The occupant's momentum change is fixed by the car's speed and mass — safety features cannot change it. What they do is extend the stopping time, which lowers the peak force via $F_{avg}\\Delta t = \\Delta p$." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why is a car designed to crumple in a frontal crash, rather than to stay perfectly rigid?",
    options: [
      "Crumpling lengthens the stopping time, which lowers the peak force on the people inside.",
      "Crumpling makes the car cheaper to build because it uses less metal in the front end.",
      "Crumpling reduces the car's momentum before the crash so it has less to lose.",
      "Crumpling stores the crash energy in the frame so the car can be reused later.",
    ], correctIndex: 0,
    explanation: "A controlled crumple stretches out the time over which the car and occupant stop. For a fixed momentum change, longer $\\Delta t$ means smaller $F_{avg}$, so the people inside feel a lower peak force." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A seatbelt stretches slightly during a crash. How does that small stretch help the occupant?",
    options: [
      "It lowers the occupant's mass, which directly reduces the momentum change.",
      "It increases the car's overall stiffness so the passenger cabin does not deform at all in the crash.",
      "It speeds the occupant up to match the airbag and balance the two forces out.",
      "It adds a little more stopping time, which lowers the peak force on the body.",
    ], correctIndex: 3,
    explanation: "The stretch extends the time over which the occupant slows down. A longer stopping time means a smaller peak force for the same momentum change." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "In the crash-test data, going from \"seatbelt only\" (0.040 s, 8 kN) to \"seatbelt + airbag + crumple zone\" (0.150 s, 2 kN), what is the relationship between stopping time and peak force?",
    options: [
      "As the stopping time goes up, the peak force goes up too.",
      "As the stopping time goes up, the peak force goes down.",
      "Stopping time and peak force both stay the same across rows.",
      "Stopping time changes but peak force is unrelated to it.",
    ], correctIndex: 1,
    explanation: "The data shows an inverse relationship: longer stopping time, smaller peak force. The momentum change is fixed, so spreading it over more time lowers the average force." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "What is the system we analyze when reasoning about crash safety with these features?",
    options: [
      "Only the engine block, because that is the heaviest part of the car.",
      "Only the wall, because the wall is what the car's momentum pushes against.",
      "Only the airbag, because it is the feature closest to the person's head.",
      "The car plus the occupant, since the features manage how both slow down.",
    ], correctIndex: 3,
    explanation: "The relevant system is the car + occupant. Crumple zones, belts, and airbags all manage how the car and the person slow down together, turning a deadly peak force into a smaller, longer one." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A crumple zone is built too short and runs out of room to collapse before the car has fully stopped. What happens to the peak force on the passenger cell?",
    options: [
      "It rises sharply, because the remaining stop happens in a much shorter time.",
      "It stays exactly the same, because the momentum change has not changed at all.",
      "It drops to zero, because the crumple zone already absorbed all of the impact.",
      "It falls a little, because a shorter crumple zone is always lighter and softer.",
    ], correctIndex: 0,
    explanation: "Once the crumple zone bottoms out, the rest of the stop happens almost instantly. That short $\\Delta t$ for the remaining momentum change spikes the peak force back up — the design failed." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "An engineering team is choosing a crumple-zone design. Which trade-off do they face?",
    options: [
      "A longer, softer crumple zone is cheaper and lighter but raises the peak force.",
      "A longer, softer crumple zone lowers the peak force but adds weight and cost.",
      "A shorter, stiffer front end lowers the peak force but costs much more money.",
      "A shorter, stiffer front end lowers both the peak force and the car's weight.",
    ], correctIndex: 1,
    explanation: "A longer, softer crumple zone gives more collapse time and a lower peak force, but it uses more material — adding weight and cost. The stiff, short option is light and cheap but produces a higher peak force." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Using $F_{avg}\\Delta t = \\Delta p$, a passenger with a fixed momentum change of 1500 kg·m/s is stopped in 0.150 s instead of 0.005 s. The average force is —",
    options: [
      "larger, because a longer stop must push harder against the seatbelt.",
      "unchanged, because the momentum change is exactly the same in both stops.",
      "30 times smaller, because the same momentum change is spread over 30 times the time.",
      "30 times larger, because the longer stop multiplies the force by the time.",
    ], correctIndex: 2,
    explanation: "$F_{avg} = \\Delta p / \\Delta t$. The momentum change is fixed, so multiplying the time by 30 divides the average force by 30: from 300,000 N down to 10,000 N." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the same crash as a force-vs-time graph for two designs: a rigid car (tall, narrow spike) and your crumpling car (lower, wider bump). Make the AREA under both curves equal — that area is the fixed momentum change. Label rough peak-force values. Show your current thinking; neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  // Summative design rationale — CER (this arc folds in v1 L13's summative design challenge).
  { id: id("sc-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Design rationale (CER).</span> Justify your final crumple-zone/restraint design using evidence from this unit. Address all four:\n\n<span style=\"font-weight:700\">Claim:</span> state your final design (material, crumple-zone length, collapse pattern, restraints) and that it keeps peak force under the limit while passing cost and weight.\n<span style=\"font-weight:700\">Evidence:</span> cite the peak force, cost, and weight your design hit in the simulator, plus at least one row of the crash-test data.\n<span style=\"font-weight:700\">Reasoning:</span> use $F_{avg}\\Delta t = \\Delta p$ to explain why your choices lower the peak force.\n<span style=\"font-weight:700\">Iteration:</span> describe at least one design that FAILED and exactly what you changed to fix it." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One trade-off in your design that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You did the thing real safety engineers do today: you couldn't change the crash, so you changed the <span style=\"font-weight:700\">time</span> — and saved a life with it. Buy time, kill force. That's the whole unit in one move. Next class we put it all together. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Design a Safer Crash",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3107,
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
