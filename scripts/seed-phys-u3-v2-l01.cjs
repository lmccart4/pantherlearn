// seed-phys-u3-v2-l01.cjs
// U3 v2 — Arc 1: "The Reversing Trend" (OpenSciEd-spine / Rober-engine).
// Merges v1 L01 (The Reversing Trend) + L02 (Distracted Driving) into one challenge-arc.
// Anchor: U.S./NJ traffic-fatality reversing trend. Reaction time → reaction distance →
// total stopping distance; distraction widens the gap. Through-line: "Survive the Crash."
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1 v2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc1.md (already sourced/audited).
// All real-world numbers (40,000 US deaths/yr, 600+ NJ, ~2020 reversal, 1.5 s / 3.0 s
// reaction times) come from that dump — none invented.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l01-reversing-trend";
// Stopping-distance calculator embed URL is taken exactly from u3-arc1.md (v1 L02).
const STOPPER = "https://paps-tools.web.app/stopping-distance.html";

let _n = 0;
const id = (slug) => `v2u3l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🚗", title: "The Reversing Trend",
    subtitle: "Unit 3 · Arc 1 — Forces & Momentum" },

  // ── CONNECT: the anchor → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "New unit, new challenge. For decades, driving in America kept getting <span style=\"font-weight:700\">safer</span> — better brakes, stronger frames, airbags. Crash deaths fell year after year. Then, around <span style=\"font-weight:700\">2020, the trend reversed</span> and the numbers started climbing again, even though cars are safer than ever. Our whole-unit question: <span style=\"font-weight:700\">What can we do to make driving safer for everyone?</span> By the end, YOU design a safer collision. Fun is allowed in this room." },

  { id: id("anchor"), type: "callout", icon: "📈", style: "info", title: "The numbers",
    content: "In a typical year, more than <span style=\"font-weight:700\">40,000 people</span> die on U.S. roads — about the size of a small city, gone every year. In New Jersey alone, more than <span style=\"font-weight:700\">600 people</span> die in motor-vehicle crashes annually, and thousands more are injured. After decades of falling, the count turned back upward around 2020. Why? That's our anchor mystery for the whole unit." },

  { id: id("ml-ntw"), type: "mission_log", title: "Mission Log — Notice / Think / Wonder",
    intro: "Before we explain anything, we observe. Scientists start by noticing carefully and asking good questions. Quantity over polish — get at least two in each column.",
    sections: [ { id: "ntw", kind: "ntw", title: "The reversing fatality trend", minPerColumn: 2 } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Survive the Crash",
    content: "All unit, your team works one mission — <span style=\"font-weight:700\">Survive the Crash</span>. It starts with the thing that goes wrong <span style=\"font-weight:700\">before</span> the brakes even touch: the gap between seeing a hazard and reacting to it. Today you'll measure how far a car travels during that gap, and how much worse it gets when the driver is distracted.\n\nThere are levels. They get harder. The one rule on every card: <span style=\"font-weight:700\">write down what you saw before you decide what's happening.</span>" },

  { id: id("setup"), type: "callout", icon: "⏱️", style: "info", title: "The two parts of stopping",
    content: "When a hazard appears, stopping a car happens in two stages:\n\n<span style=\"font-weight:700\">Reaction distance</span> — how far the car travels while the driver is still reacting (before the brakes are touched).\n\n<span style=\"font-weight:700\">Braking distance</span> — how far the car travels after the brakes are applied.\n\nAdd them together and you get the <span style=\"font-weight:700\">total stopping distance</span>. For an attentive driver, planners use a perception-reaction time of about <span style=\"font-weight:700\">1.5 seconds</span> (the value NHTSA uses for stopping-distance estimates). For a distracted driver — texting, changing a song, glancing at a passenger — it can double or triple to around 3.0 seconds. The car keeps moving at full speed the whole time the brain is catching up." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the stopping path (before the tool)",
    instructions: "Sketch a car spotting a hazard ahead. Draw where you think it FIRST starts braking (reaction distance) and where it finally stops (braking distance). Now draw a SECOND path for the same car with a distracted driver. Which gets longer, and why? Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-reversing-trend",
    title: "Class Challenge Board — Survive the Crash (Arc 1)",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's surviving which crash.",
    levels: [
      { n: 1, name: "Read the Trend", nameEs: "Lee la Tendencia" },
      { n: 2, name: "Clock the Reaction", nameEs: "Cronometra la Reacción" },
      { n: 3, name: "Measure the Gap", nameEs: "Mide la Distancia" },
      { n: 4, name: "Add the Distraction", nameEs: "Agrega la Distracción" },
      { n: 5, name: "Make the Case", nameEs: "Defiende tu Caso" },
    ] },

  { id: id("embed-stopper"), type: "embed", url: STOPPER, scored: true, weight: 5 },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Stopping-Distance Log",
    intro: "As you work the calculator: <span style=\"font-weight:700\">before you decide why a number changed, write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Reaction vs. braking distance",
      columns: [
        { key: "driver", label: "Driver", width: "120px", placeholder: "attentive / distracted" },
        { key: "speed", label: "Speed (mph)", placeholder: "30" },
        { key: "reactdist", label: "Reaction distance (ft)", placeholder: "from the tool" },
        { key: "totaldist", label: "Total stopping distance (ft)", placeholder: "from the tool" },
      ], minRows: 3, addRowLabel: "Add a run" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Stopping Path",
    instructions: "Redraw your two stopping paths now that you've run the numbers. Show the reaction distance and the braking distance as separate labeled segments for an attentive driver and a distracted one, roughly to scale. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running numbers. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we made a chart\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the numbers tell you?",
      prompts: [
        { id: "q1", label: "Describe how reaction time, speed, and total stopping distance are related, in your own words.", rows: 3 },
        { id: "q2", label: "A driver is going 30 mph and their reaction time doubles. What happens to the *reaction distance*? Why?", rows: 2 },
        { id: "q3", label: "Does distraction mainly change the reaction distance, the braking distance, or both? Cite a number from the calculator to back it up.", rows: 3 },
        { id: "q4", label: "Why does distracted driving raise the chance of a crash even when the car and the road are exactly the same?", rows: 2 },
        { id: "q5", label: "**Predict:** at highway speed, which adds more to the total stopping distance — a wet road that doubles braking distance, or a distracted driver who triples reaction time? Why?", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Build Our Class Model — what makes driving risky",
    intro: "Start our class model of the anchor: <span style=\"font-weight:700\">what makes driving dangerous, and why might crash deaths be rising again?</span> Draw and label the path of a car spotting a hazard — the reaction gap, the braking part, and where distraction makes it worse. We tweak this same model every arc this unit. Copy it into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l1",
    title: "Class Driving Question Board",
    intro: "Post at least one question you still have about why driving got more dangerous and what could be done about it. These drive where the unit heads next — we check them off as we answer them.",
    starters: [
      "Why did crash deaths start rising again after ___?",
      "What would happen to the stopping distance if ___?",
      "How does a real car try to make up for ___?",
      "How could you make a crash more survivable when ___?",
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
        instructions: "Words you kept reaching for this arc — \"reaction time,\" \"reaction distance,\" \"braking distance,\" \"stopping distance,\" \"distraction,\" \"hazard\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Two cars travel the exact same road at the exact same speed. A dog darts out ahead of both. One driver is paying full attention; the other is reading a text. Both slam the brakes the instant they realize — but one stops much farther down the road. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the distracted driver stops farther down the road, even though both cars have the same brakes, speed, and road. Use reaction distance, braking distance, and total stopping distance in your answer." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A driver is traveling at 30 mph. If their reaction time doubles, what happens to the *reaction distance*?",
    options: [
      "It also doubles, since the car covers more ground before the driver brakes.",
      "It stays the same because the braking distance is the part that is unchanged.",
      "It is cut in half because the driver brakes more carefully when distracted.",
      "It becomes zero the instant the driver finally applies the brakes.",
    ], correctIndex: 0,
    explanation: "Reaction distance depends on speed × reaction time. If reaction time doubles while speed stays the same, the distance traveled during the reaction period also doubles." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Which of these is the *reaction distance*?",
    options: [
      "The distance the car rolls after the brakes are already pressed down.",
      "How far the car travels while the driver is still reacting, before braking.",
      "The total of the reaction part and the braking part added together as one.",
      "The distance the car would travel if the brakes failed completely on it.",
    ], correctIndex: 1,
    explanation: "Reaction distance is how far the car travels during the driver's reaction time — before the brakes are applied. Braking distance is the part after the brakes are pressed; total stopping distance is the sum of the two." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Total stopping distance is best described as —",
    options: [
      "only the braking distance, since reaction time is far too short to matter.",
      "only the reaction distance, because brakes stop a car almost instantly.",
      "the reaction distance plus the braking distance added together.",
      "the speed of the car multiplied directly by the weight of the car.",
    ], correctIndex: 2,
    explanation: "Total stopping distance = reaction distance + braking distance. Both stages matter, and distraction lengthens the reaction part." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "At 40 mph, which change would *most increase* a car's total stopping distance?",
    options: [
      "A heavier passenger load while the brakes and tires stay the same.",
      "A cooler day that has no real effect on the car or the road surface.",
      "A slightly newer set of headlights mounted on the front of the car.",
      "A distracted driver whose reaction time roughly triples before braking.",
    ], correctIndex: 3,
    explanation: "At 40 mph, reaction distance is already a large fraction of the total. Tripling the reaction time roughly triples that large fraction, usually adding more distance than other small changes." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Roughly how many people die on U.S. roads in a typical recent year?",
    options: [
      "More than 40,000 people every year, about the size of a small city.",
      "Fewer than 1,000 people, since modern cars are extremely safe now.",
      "Exactly 600 people, which is the number for the whole United States.",
      "About 4 million people, more than any other cause of death by far.",
    ], correctIndex: 0,
    explanation: "More than 40,000 people die on U.S. roads in a typical year. New Jersey alone sees more than 600 motor-vehicle deaths annually." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "What is unusual about the U.S. traffic-fatality trend that opens this unit?",
    options: [
      "Crash deaths have fallen steadily every single year with no interruption.",
      "After decades of decline, deaths reversed and rose again around 2020.",
      "Deaths have stayed at exactly the same number for the last fifty years.",
      "Crash deaths only ever happen on highways and never on local roads.",
    ], correctIndex: 1,
    explanation: "For decades U.S. traffic deaths fell as cars and roads got safer. Around 2020 the trend reversed and deaths began climbing again — the mystery this unit investigates." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Why does distraction increase crash risk even if the car, speed, and road are identical?",
    options: [
      "It weakens the brakes, so the braking distance grows much longer than usual.",
      "It makes the tires lose grip, which only affects the braking part of stopping.",
      "It changes the speed limit of the road and forces the car to travel faster.",
      "It lengthens the reaction time, so the car travels farther before braking starts.",
    ], correctIndex: 3,
    explanation: "Distraction adds to reaction time, not braking. The car covers more ground at full speed before the brakes are even applied, so the total stopping distance grows." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A common planning value for an *attentive* driver's perception-reaction time is about —",
    options: [
      "0.1 seconds, fast enough that reaction distance can safely be ignored.",
      "10 seconds, which is why long stopping distances are mostly unavoidable.",
      "1.5 seconds, the value planners such as NHTSA use for stopping estimates.",
      "60 seconds, roughly the time it takes to read and reply to a text message.",
    ], correctIndex: 2,
    explanation: "Planners use about 1.5 seconds of perception-reaction time for an attentive driver. A distracted driver's can double or triple to around 3.0 seconds." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw two cars on the same road at the same speed spotting the same hazard. For each, mark where it starts braking and where it stops. Label which is attentive and which is distracted, and shade the EXTRA distance the distracted car travels. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about stopping distance that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You started the mystery today — why driving got more dangerous, and how a split-second of distraction stretches a car's stopping path way down the road. Next class we test what YOU wrote on the board and start pulling on the forces behind a crash. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Reversing Trend",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3101,
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
