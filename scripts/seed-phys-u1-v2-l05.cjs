// seed-phys-u1-v2-l05.cjs
// U1 v2 PILOT — Arc 5: "Run the Grid" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (The Grid as a System) + L08 (When the System Fails) into one
// challenge-arc: "Run the Grid." Generation must continuously match demand, second by
// second; read a daily LOAD CURVE (peak vs. minimum); what keeps the grid stable and
// what happens when balance breaks (blackout); and WHAT PHYSICALLY FAILED in Superstorm
// Sandy — outage + restoration data over time. Through-line: match supply to a day's
// demand, then the storm hits and you keep the most buildings on (pays off Arc 1's
// "Storm Hits" level). Revise the class model with the delivery-vs-generation insight.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as Arc 2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source/arc5.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l05-run-the-grid";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The grid-reliability-simulator URL is from arc5.md.
const SIM = "https://paps-tools.web.app/grid-reliability-simulator.html?mode=learn";

let _n = 0;
const id = (slug) => `v2l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⚡", title: "Run the Grid",
    subtitle: "Unit 1 · Arc 5 — Energy & the Grid" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you <span style=\"font-weight:700\">made your own electricity</span> — spun a magnet, induced a current, lit a building by hand. Today you stop cranking one generator and take the operator's seat for a whole region. The job: keep generation matching demand <span style=\"font-weight:700\">every single second</span>, all day. Then a storm rolls in — the same storm from Arc 1 — and you find out what actually breaks. Fun is still allowed. Panic is optional." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Flip a light switch at 3 AM and the bulb lights. Flip the same switch at 6 PM, when millions of people are also using electricity — and it still lights. Behind that simple fact is a constant balancing act: at every instant, the power being <span style=\"font-weight:700\">generated</span> must equal the power being <span style=\"font-weight:700\">used</span>. There's almost no place to store the extra, and no big reserve to grab from if generation falls short.\n\nSo how do grid operators keep the lights on when demand never stops moving?" },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 4 — quantity over polish. Then we go run a grid.",
    sections: [ { id: "recall", kind: "prompts", title: "From one generator to a whole region",
      prompts: [
        { id: "q1", label: "Last arc you spun a magnet to make current. Name ONE reason a real region needs MANY generators, not one.", rows: 2 },
        { id: "q2", label: "It's 6 PM and everyone gets home and turns on lights, AC, and the stove at once. What do you think the power company has to do *right then*?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Run the Grid",
    content: "You're the grid operator. Across a full day, <span style=\"font-weight:700\">match the power you generate to the power people demand</span> — second by second. Demand is never flat: it dips overnight and spikes in the evening. Generate too little and the grid sags into a blackout; too much and you damage equipment. Then the storm hits and you have to keep the <span style=\"font-weight:700\">most buildings on</span> with what survives.\n\nThere are levels. They get harder. Same rule as always — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔌", style: "info", title: "The system you're running",
    content: "The <span style=\"font-weight:700\">grid</span> is a system: every generator, transmission line, substation, and user, all connected. It's stable only when inputs and outputs stay balanced.\n\n• <span style=\"font-weight:700\">Generation</span> = the power fed IN by power plants, solar farms, and wind turbines.\n• <span style=\"font-weight:700\">Load</span> (demand) = the power drawn OUT by homes, schools, businesses, factories.\n\nGeneration must match load. If generation drops too low, the grid frequency sags and protective equipment shuts sections down — a blackout. Operators keep some plants — often quick-starting natural-gas \"peakers\" — ready to ramp up the moment demand rises." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your day of demand (before the sim)",
    instructions: "Sketch a graph: time of day across the bottom (midnight → midnight), power demand up the side. Draw the curve you EXPECT for a normal day. Where's the lowest point? Where's the peak? Mark them. Wrong is fine — we sketch first so we can compare to the real shape later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-run-the-grid",
    title: "Class Challenge Board — Run the Grid",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's keeping their region powered.",
    levels: [
      { n: 1, name: "Read the Load Curve", nameEs: "Lee la Curva de Demanda" },
      { n: 2, name: "Match Supply to Demand", nameEs: "Equilibra Oferta y Demanda" },
      { n: 3, name: "Cover the Evening Peak", nameEs: "Cubre el Pico de la Tarde" },
      { n: 4, name: "Survive the Storm", nameEs: "Sobrevive la Tormenta" },
      { n: 5, name: "Keep the Most Buildings On", nameEs: "Mantén Más Edificios Encendidos" },
    ] },

  { id: id("embed-sim"), type: "embed", url: SIM, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Load Curve Log",
    intro: "Pull the values straight off the simulator's daily load curve. <span style=\"font-weight:700\">Before you decide a plant should turn on or off, write what the demand is doing.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "loadlog", kind: "table", title: "Reading the day",
      columns: [
        { key: "time", label: "Time of day", width: "110px", placeholder: "6 PM" },
        { key: "demand", label: "Demand (MW)", placeholder: "9,000" },
        { key: "gen", label: "Generation you ran (MW)", placeholder: "baseload + peaker" },
        { key: "note", label: "Balanced? Why / why not", placeholder: "matched / short / over" },
      ], minRows: 4, addRowLabel: "Add a time" } ] },

  { id: id("draw-curve"), type: "sketch", title: "Draw the Real Load Curve",
    instructions: "Redraw the daily demand curve now that you've run it. Mark the PEAK (highest demand) and the MINIMUM (lowest demand), and label the gap between them. Then sketch where you had to bring extra plants online. Neat doesn't matter — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-balance"), type: "mission_log", title: "Mission Log — Supply & Demand Balance",
    intro: "Account for how you covered demand at a few key times. One row per time — say what sources you ran and whether they covered the load.",
    sections: [ { id: "balance", kind: "table", title: "Matching the load",
      columns: [
        { key: "time", label: "Time", placeholder: "3 AM / noon / 6 PM" },
        { key: "demand", label: "Demand (MW)", placeholder: "3,500 / 7,000 / 9,000" },
        { key: "sources", label: "Sources you ran", placeholder: "nuclear + solar + peaker" },
        { key: "result", label: "Covered? / blackout?", placeholder: "matched / fell short" },
      ], minRows: 3, addRowLabel: "Add a time" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running the sim. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we kept some lights on\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does it take to run a grid?",
      prompts: [
        { id: "q1", label: "In your own words, why does the grid have to constantly balance supply and demand? What did the simulator show you about what happens when it can't?", rows: 3 },
        { id: "q2", label: "Why do operators keep some power plants idle until demand peaks instead of just running everything full-blast all day?", rows: 2 },
        { id: "q3", label: "Explain why a grid can't rely on solar panels alone if demand stays high after sunset. Use at least two of these terms: *generation*, *demand*, *peak*, *storage*.", rows: 3 },
        { id: "q4", label: "**The storm hit.** Most power plants kept generating just fine — yet millions lost power. If generation survived, what part of the grid must have broken? Explain.", rows: 3 },
        { id: "q5", label: "Go back to the grid model you've been building since Arc 1. Where exactly did the path break during the storm — generation, or delivery? Defend your answer.", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — sizing the daily swing",
    content: "A region's <span style=\"font-weight:700\">illustrative</span> daily load curve (a typical shape, not one real day) peaks and dips like this:\n\nMidnight ≈ 4,000 MW · 6 AM ≈ 5,000 MW · 9 AM ≈ 7,500 MW · Noon ≈ 7,000 MW · 6 PM ≈ 9,000 MW · 9 PM ≈ 7,000 MW.\n\nStep 1 — find the peak: highest demand is <span style=\"font-weight:700\">9,000 MW at 6 PM</span>.\n\nStep 2 — find the minimum: lowest is <span style=\"font-weight:700\">4,000 MW at midnight</span>.\n\nStep 3 — the swing operators must be ready to cover:\n\n$$9{,}000\\,\\text{MW} - 4{,}000\\,\\text{MW} = 5{,}000\\,\\text{MW}$$\n\nThat 5,000 MW gap is why quick-starting \"peaker\" plants exist — they ramp up to chase the evening spike, then back off overnight. (Daily-demand shape: U.S. EIA.)" },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — operate it, then break it",
    intro: "Same model we've grown since Arc 1. Today we tweak it twice: first show generation <span style=\"font-weight:700\">balancing</span> demand across the day (peakers ramping for the evening), then mark where the <span style=\"font-weight:700\">delivery</span> path — substations and lines — broke in the storm even though the plants kept running. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have about running the grid or surviving the storm. These drive where the unit heads next.",
    starters: [
      "How does the grid balance supply and demand when ___?",
      "Why does a flooded substation take so long to ___?",
      "What would it take to keep the lights on when ___?",
      "How fast can crews restore power after ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, would the grid ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"grid,\" \"generation,\" \"load/demand,\" \"peak,\" \"baseload,\" \"peaker,\" \"frequency,\" \"substation,\" \"delivery,\" \"outage,\" \"restoration,\" \"resilience\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "🌀", style: "default", title: "The scenario",
    content: "On the night of October 29, 2012, Superstorm Sandy made landfall near Brigantine, New Jersey. Within hours, millions of homes went dark — yet most of the state's power plants were still running. The blackout wasn't mainly a failure of generation. It was a failure of <span style=\"font-weight:700\">delivery</span>: storm surge flooded substations under 4 to 8 feet of water, and ~80 mph winds drove trees into the lines. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> The power plants kept generating electricity, yet customers lost power. Explain where in the grid the failure happened and why a flooded substation takes far longer to fix than a downed line. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "If electricity demand suddenly exceeds supply on the grid and nothing adjusts, what is the *most likely* result?",
    options: [
      "The voltage rises across the grid and the connected appliances simply run faster.",
      "The extra demand is automatically stored away and saved for use later that day.",
      "The grid frequency drops and parts of the grid shut off to protect the equipment.",
      "Nothing happens, because on the grid supply is always exactly equal to demand.",
    ], correctIndex: 2,
    explanation: "When load outruns generation, generators are pulled harder than they can sustain and the grid frequency sags. Protective equipment disconnects sections to prevent damage — that is a blackout." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "On a typical daily load curve for a region, demand is usually *highest* —",
    options: [
      "in the early evening, around 6 PM.",
      "at midnight, while most people sleep.",
      "at 9 AM, during the morning ramp-up.",
      "at noon, during the midday dip in use.",
    ], correctIndex: 0,
    explanation: "Demand peaks in the early evening (around 6 PM) when people get home and run lights, appliances, heating, or cooling all at once. The illustrative curve shows ~9,000 MW at 6 PM, its highest value." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why do grid operators keep some power plants idle until demand peaks?",
    options: [
      "To store electricity inside the plants so it can be released to homes later.",
      "To reduce the total amount of electricity that customers are able to use.",
      "To save money by making sure those plants never run at full power at all.",
      "To have extra generation ready to ramp up quickly when demand rises.",
    ], correctIndex: 3,
    explanation: "Demand changes through the day. Operators keep \"peaker\" plants and spare capacity available so they can increase generation quickly when load rises, keeping supply equal to demand." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Based on the evidence, what was the main physical reason New Jersey lost power during Sandy — even though the power plants kept generating electricity?",
    options: [
      "Flooded substations and downed lines broke the delivery system.",
      "Too little electricity was generated to actually meet the demand.",
      "The power plants ran out of fuel partway through the long storm.",
      "Customers used so much power that the wires overheated and melted.",
    ], correctIndex: 0,
    explanation: "Generation survived — NJ's thermal plants kept producing electricity. The failure was in delivery: storm surge flooded substations under 4–8 ft of water and ~80 mph winds drove trees into transmission lines." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Why does restoring a flooded substation usually take longer than repairing a downed line?",
    options: [
      "Substations generate all the electricity used by an entire neighborhood.",
      "Downed lines do not actually need any repairs before power can return.",
      "Flooded substations must be drained, cleaned, dried, and inspected first.",
      "Substations are always located far from where the repair crews are based.",
    ], correctIndex: 2,
    explanation: "Substations route and step down power. Once flooded — often with salt water — the equipment must be carefully drained, cleaned, dried, and inspected to avoid short circuits and corrosion. Downed lines can often be repaired faster." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "According to the Sandy outage data, approximately how many U.S. customers were still without power on October 30, 2012 — the largest U.S. outage by customer count?",
    options: [
      "About 2.7 million customers.",
      "About 8.2 million customers.",
      "About 775,000 customers.",
      "About 90% of customers.",
    ], correctIndex: 1,
    explanation: "The national Oct 30 figure was ~8.2 million customers without power. The 2.7 million figure is NJ's peak; 775,000 is NJ one week later; 90% is the national restoration share by Nov 8." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "New Jersey's peak outage was ~2.7 million customers, and about 775,000 were still without power one week later. About how many NJ customers got power back during that first week?",
    options: [
      "About 90,000 customers were restored in the first week.",
      "About 775,000 customers were restored in the first week.",
      "About 2,700,000 customers were restored in the first week.",
      "About 1,925,000 customers were restored in the first week.",
    ], correctIndex: 3,
    explanation: "Subtract the one-week count from the peak: $2{,}700{,}000 - 775{,}000 = 1{,}925{,}000$ customers restored — about 71% of the peak outage." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "In physics, the \"grid frequency\" in the United States is normally —",
    options: [
      "60 Hz, the rate at which the AC current oscillates.",
      "kept at exactly zero whenever the demand is balanced.",
      "the total number of power plants connected to the grid.",
      "the voltage delivered to a home, measured in volts.",
    ], correctIndex: 0,
    explanation: "Grid frequency is the rate at which the AC current oscillates; in the U.S. it is normally 60 Hz. When generation can't keep up with load, that frequency sags — the signal that triggers protective shutoffs." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the grid path from a power plant to a home: plant → transmission line → substation → distribution line → house. Now mark with an X exactly where the storm broke the path during Sandy (flooded substation, downed line), and circle the part that kept working fine (the plant). Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "Which Sandy outage number *surprised* you the most, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You ran a whole region today — matched supply to demand second by second, covered the evening peak, then took a real storm and found out the plants weren't the weak link; the delivery path was. That's the payoff to the very first night the lights went out in Arc 1. Next class we ask the harder question: when power comes back, who gets it first? See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Run the Grid",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1105,
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
