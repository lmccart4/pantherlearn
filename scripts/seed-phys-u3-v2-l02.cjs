// seed-phys-u3-v2-l02.cjs
// U3 v2 — Arc 2: "Speed & Stopping Distance" (OpenSciEd-spine / Rober-engine).
// Merges v1 L03 (Speed & Stopping Distance) + L04 (Force, Mass & Changing Motion)
// into one challenge-arc. Physics: reaction distance + braking distance vs speed
// (braking grows with the SQUARE of speed → small speed changes matter a lot);
// Newton's 2nd law a = F_net/m → heavier vehicle, same braking force, less
// acceleration, longer stop. Through-line: "Survive the Crash" — the faster you
// go and the heavier you are, the more road you need before you can stop.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as the U1 v2 template. Content
// repackaged from drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc2.md
// (already sourced/audited; stopping-distance table values are v1-sourced estimates).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l02-speed-stopping";
// Both embed URLs are from u3-arc2.md — separate scored embed blocks.
const STOPPING = "https://paps-tools.web.app/stopping-distance.html";
const FORCE = "https://paps-tools.web.app/force-and-motion-basics.html";

let _n = 0;
const id = (slug) => `v2u3l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🚗", title: "Speed & Stopping Distance",
    subtitle: "Unit 3 · Arc 2 — Survive the Crash" },

  // ── CONNECT: recall Arc 1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, a distracted driver kept the gas down too long — that lag is <span style=\"font-weight:700\">reaction distance</span>, the road you cover before your foot even hits the brake. Today we add the part that actually scares engineers: <span style=\"font-weight:700\">speed</span>. Going faster doesn't just add a little stopping distance — it adds a <span style=\"font-weight:700\">lot</span>. We're going to find out exactly how much, and why a heavier ride needs even more room. Still a fun room. Just buckle up." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture two cars on the same street. One is doing 30, one is doing 60 — double the speed. A kid steps out. Both drivers slam the brakes at the exact same moment.\n\nGut check: does the 60 car need <span style=\"font-weight:700\">twice</span> the room to stop, or more? Most people guess twice. The answer is way scarier than that — and the reason is hiding in the word <span style=\"font-weight:700\">squared</span>. That's the thread we pull on all arc: how much road a car really needs, and what decides it." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go chase the numbers.",
    sections: [ { id: "recall", kind: "prompts", title: "Before your foot hits the brake",
      prompts: [
        { id: "q1", label: "In your own words: what is *reaction distance*, and what makes it longer?", rows: 2 },
        { id: "q2", label: "Gut guess — if a car doubles its speed, does the road it needs to stop double, or more than double? Commit to a guess.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Find How Much Road a Car Really Needs",
    content: "Using the stopping-distance simulator, you're going to <span style=\"font-weight:700\">predict, then measure</span> how far a car needs to stop at different speeds — and then explain the pattern. Reaction distance grows steadily. Braking distance does something sneakier. Your job isn't done until you can say, with numbers, <span style=\"font-weight:700\">how</span> total stopping distance grows as speed climbs — and what happens when the vehicle gets heavier.\n\nThere are levels. They get harder. The rule from last arc still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "📏", style: "info", title: "Two pieces of stopping distance",
    content: "Total stopping distance is two parts added together. <span style=\"font-weight:700\">Reaction distance</span> is how far you roll while your brain notices and your foot moves — it grows steadily with speed. <span style=\"font-weight:700\">Braking distance</span> is how far you travel once the brakes grab — and it grows with the <span style=\"font-weight:700\">square</span> of speed. Double the speed and the braking part roughly quadruples.\n\nHere's reference data for dry pavement and a 1.5 second reaction time (rounded estimates for a typical passenger vehicle):" },

  { id: id("ref-table"), type: "text",
    content: "<span style=\"font-weight:700\">Speed 20 mph</span> → reaction 44 ft + braking 20 ft = <span style=\"font-weight:700\">64 ft total</span>\n<span style=\"font-weight:700\">Speed 30 mph</span> → reaction 66 ft + braking 45 ft = <span style=\"font-weight:700\">111 ft total</span>\n<span style=\"font-weight:700\">Speed 40 mph</span> → reaction 88 ft + braking 80 ft = <span style=\"font-weight:700\">168 ft total</span>\n<span style=\"font-weight:700\">Speed 50 mph</span> → reaction 110 ft + braking 125 ft = <span style=\"font-weight:700\">235 ft total</span>\n<span style=\"font-weight:700\">Speed 60 mph</span> → reaction 132 ft + braking 180 ft = <span style=\"font-weight:700\">312 ft total</span>" },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the shape (before the sim)",
    instructions: "Sketch a graph: speed on the bottom, total stopping distance up the side. Plot what you THINK the line looks like from 20 to 60 mph. Is it a straight line, or does it curve up? Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-speed-stopping",
    title: "Class Challenge Board — Find How Much Road",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracked the pattern.",
    levels: [
      { n: 1, name: "Stop at One Speed", nameEs: "Frena a Una Velocidad" },
      { n: 2, name: "Split Reaction vs Braking", nameEs: "Separa Reacción y Frenado" },
      { n: 3, name: "Catch the Square", nameEs: "Atrapa el Cuadrado" },
      { n: 4, name: "Add the Mass", nameEs: "Agrega la Masa" },
      { n: 5, name: "Predict an Unknown Speed", nameEs: "Predice una Velocidad Nueva" },
    ] },

  { id: id("embed-stopping"), type: "embed", url: STOPPING, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Stopping-Distance Trace Log",
    intro: "As you run each speed in the sim: <span style=\"font-weight:700\">write what you saw before you decide what the pattern is.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Speed vs stopping distance",
      columns: [
        { key: "speed", label: "Speed (mph)", width: "90px", placeholder: "30" },
        { key: "react", label: "Reaction dist (ft)", placeholder: "66" },
        { key: "brake", label: "Braking dist (ft)", placeholder: "45" },
        { key: "total", label: "Total (ft)", placeholder: "111" },
      ], minRows: 3, addRowLabel: "Add a speed" } ] },

  { id: id("ml-predict"), type: "mission_log", title: "Mission Log — Predict, Then Check",
    intro: "Predict the total stopping distance for these in-between speeds FIRST. Then run them in the sim and find your difference. One row each.",
    sections: [ { id: "predict", kind: "table", title: "Your predictions vs the simulator",
      columns: [
        { key: "speed", label: "Speed", width: "90px", placeholder: "25 / 35 / 45 mph" },
        { key: "pred", label: "Your predicted total (ft)", placeholder: "your guess" },
        { key: "sim", label: "Simulator total (ft)", placeholder: "from the tool" },
        { key: "diff", label: "Difference (ft)", placeholder: "off by…" },
      ], minRows: 3, addRowLabel: "Add a speed" } ] },

  { id: id("draw-graph"), type: "sketch", title: "Draw Your Stopping-Distance Graph",
    instructions: "Now plot your real data: speed across the bottom, total stopping distance up the side, one point per speed from your trace log. Connect them. Does the line stay straight, or bend upward? Draw a second, lighter line for just the BRAKING part and compare its shape. Neat doesn't matter — show your thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running speeds. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we ran some numbers\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does the pattern mean?",
      prompts: [
        { id: "q1", label: "Describe how total stopping distance changes as speed increases. Is the relationship a straight line? Use two numbers from the table to back it up.", rows: 3 },
        { id: "q2", label: "Reaction distance and braking distance both grow with speed — but in different ways. Explain the difference in HOW each one grows.", rows: 3 },
        { id: "q3", label: "A city council wants to drop a neighborhood limit from 40 mph to 30 mph. Make the safety case (CER): does it meaningfully cut stopping distance? Use the table numbers as your EVIDENCE.", rows: 3 },
        { id: "q4", label: "Define the system. A fully loaded truck and an empty car brake with the *same* force. Which one is your system, and name one object OUTSIDE it that pushes on it during braking.", rows: 2 },
        { id: "q5", label: "**Predict:** two vehicles brake with the same force, but one carries twice the mass. Using $a = \\frac{F_{net}}{m}$, what happens to its acceleration, and to how long it takes to stop? Why?", rows: 2 },
      ] } ] },

  { id: id("embed-force"), type: "embed", url: FORCE, scored: true, weight: 5 },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — same push, different mass",
    content: "Once the brakes grab, the car slows down — that slowing is an <span style=\"font-weight:700\">acceleration</span> (a change in velocity). Newton's second law tells us exactly how much you get for a given push:\n\n$$a = \\frac{F_{net}}{m}$$\n\nThe acceleration is directly proportional to the net force and inversely proportional to the mass. Try it: a braking force of $F_{net} = 6000\\,\\text{N}$ acts on two vehicles.\n\nLight car, $m = 1000\\,\\text{kg}$: $a = \\frac{6000\\,\\text{N}}{1000\\,\\text{kg}} = 6.0\\,\\text{m/s}^2$.\n\nLoaded truck, $m = 3000\\,\\text{kg}$: $a = \\frac{6000\\,\\text{N}}{3000\\,\\text{kg}} = 2.0\\,\\text{m/s}^2$.\n\nSame push, but the truck's bigger mass gives it only a third of the slowing. Smaller acceleration means more time and more road before it stops. <span style=\"font-weight:700\">Define the system:</span> the system is the vehicle; the road is outside it and supplies the friction force that does the slowing." },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Crash Model — add speed and mass",
    intro: "Same crash model we started in Arc 1. Today we tweak it: show that total stopping distance is <span style=\"font-weight:700\">reaction + braking</span>, mark that braking grows with the <span style=\"font-weight:700\">square</span> of speed, and add an arrow showing that more mass means less slowing for the same force. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about speed, mass, and stopping. These drive where the unit heads next.",
    starters: [
      "If braking distance grows with the square of speed, what happens at ___?",
      "How much farther does it take to stop when ___?",
      "Does a heavier vehicle ALWAYS take longer to stop, even if ___?",
      "How do real roads and brakes deal with ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the stopping distance ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"reaction distance,\" \"braking distance,\" \"acceleration,\" \"net force,\" \"mass,\" \"inertia,\" \"proportional\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Two cars travel down the same dry street. One is doing 30 mph; the other is doing 60 mph — exactly double. A ball rolls out and both drivers hit the brakes at the same instant. Using the table from today, the 30 mph car needs about 111 ft to stop. The 60 mph car needs about 312 ft. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> The 60 mph car is going twice as fast but needs almost three times the road. Explain why — break total stopping distance into its two parts and say which part is doing the damage and why. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A car doubles its speed from 30 mph to 60 mph. About how much does the *braking distance* change?",
    options: [
      "It stays about the same, since the brakes apply the same force.",
      "It doubles, because the car is moving exactly twice as fast.",
      "It is cut roughly in half, because faster wheels grip the road.",
      "It roughly quadruples, because braking distance grows with speed squared.",
    ], correctIndex: 3,
    explanation: "Braking distance is proportional to the square of speed. Doubling speed multiplies the braking distance by about four — in the table it jumps from 45 ft to 180 ft." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Total stopping distance is the sum of which two parts?",
    options: [
      "Reaction distance plus braking distance.",
      "Acceleration plus the vehicle's total mass.",
      "Engine power plus the force of the tires.",
      "The speed limit plus the driver's age.",
    ], correctIndex: 0,
    explanation: "Total stopping distance = reaction distance (rolling before you brake) + braking distance (slowing once the brakes grab)." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "You push a small cart and a large cart with the *same net force*. How do their accelerations compare?",
    options: [
      "Both carts accelerate equally, since the net force on each is the same.",
      "The small cart accelerates more, because it has less mass.",
      "The large cart accelerates more, because it has more inertia to give.",
      "Neither cart accelerates at all unless friction is removed first.",
    ], correctIndex: 1,
    explanation: "From $a = \\frac{F_{net}}{m}$, acceleration is inversely proportional to mass. With the same net force, the less-massive cart gets the larger acceleration." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A fully loaded truck and an empty car brake with the *same maximum force* from the same speed. Which takes longer to stop?",
    options: [
      "The car, because lighter vehicles always have more inertia.",
      "They stop in the same distance whenever the brakes are equally good.",
      "The truck, because its larger mass gives it a smaller acceleration.",
      "The truck, because heavier objects naturally travel at higher speeds.",
    ], correctIndex: 2,
    explanation: "With the same braking force, the truck's larger mass gives it a smaller acceleration ($a = F_{net}/m$), so it needs more time and more distance to stop." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "According to Newton's second law, $a = \\frac{F_{net}}{m}$, what happens to acceleration if the net force stays the same but the mass increases?",
    options: [
      "The acceleration increases, because more mass stores more force.",
      "The acceleration stays exactly the same, since the force did not change.",
      "The acceleration drops to zero the instant any mass is added on.",
      "The acceleration decreases, because mass is in the denominator.",
    ], correctIndex: 3,
    explanation: "Acceleration is inversely proportional to mass. With net force held constant, a bigger mass in the denominator means a smaller acceleration." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Using today's table, a city lowers a limit from 40 mph (168 ft to stop) to 30 mph (111 ft to stop). About how much shorter is the stopping distance?",
    options: [
      "About 6 ft shorter, which is too small to matter for safety.",
      "About 57 ft shorter, which is more than four car lengths.",
      "There is no change, because reaction time stays the same.",
      "About 279 ft shorter, since the two distances add together.",
    ], correctIndex: 1,
    explanation: "$168\\,\\text{ft} - 111\\,\\text{ft} = 57\\,\\text{ft}$ — roughly four car lengths shorter, which can be the difference between stopping in time and a crash." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement best describes how reaction distance behaves as speed increases?",
    options: [
      "It grows with the square of speed, exploding upward fast.",
      "It shrinks as speed rises, since fast reactions cover less road.",
      "It stays fixed regardless of speed, because reaction time is constant.",
      "It grows steadily — roughly in proportion to the speed.",
    ], correctIndex: 3,
    explanation: "Reaction time is fixed, so the distance covered during it grows in direct proportion to speed (steadily). It is braking distance that grows with the square of speed." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "In the truck-and-car braking comparison, which choice correctly names the system and an outside force on it?",
    options: [
      "System: the road; outside force: the vehicle pressing down on it.",
      "System: the vehicle; outside force: friction from the road on the tires.",
      "System: the air; outside force: the driver's foot on the brake pedal.",
      "System: the brakes alone; outside force: the engine pushing forward.",
    ], correctIndex: 1,
    explanation: "We analyze the vehicle as the system; the road is outside it and supplies the friction force on the tires that slows the vehicle down." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw two arrows pointing into a braking car: the braking force from the road, and the car's motion. Then sketch two stopping-distance bars side by side — a 30 mph bar (~111 ft) and a 60 mph bar (~312 ft) — roughly to scale so the difference is obvious. Show your current thinking; neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One number about stopping distance that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You found it today: doubling your speed doesn't double the danger — it roughly quadruples the braking part, and piling on mass only makes it worse. Speed and mass both decide how much road you need before you can stop. Next class we look at what happens when a car can't stop in time — the crash itself. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Speed & Stopping Distance",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3102,
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
