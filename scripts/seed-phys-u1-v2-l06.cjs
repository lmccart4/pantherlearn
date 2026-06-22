// seed-phys-u1-v2-l06.cjs
// U1 v2 PILOT — Arc 6: "Who Gets the Power Back?" (OpenSciEd-spine / Rober-engine).
// Merges v1 L09 (Who Lost Power?) + L10 (Mid-Unit Mastery Check) into one challenge-arc:
// "Restore Fairly." The HUMAN scale — disparities in who lost power and who got it back
// first after Sandy, the values + trade-offs behind restoration decisions, engineering as
// a human endeavor. This arc's Status Check IS the mid-unit mastery checkpoint: students
// explain the Sandy blackout across all THREE scales (electron/charge · system/grid ·
// human/equity) and use $P = IV$ and $E = Pt$.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as Arc 1/2. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source/arc6.md (already sourced/audited). No embed.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l06-power-back";
// No embed for this arc — the challenge is a paper/discussion triage case on Sandy county data.

let _n = 0;
const id = (slug) => `v2l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⚖️", title: "Who Gets the Power Back?",
    subtitle: "Unit 1 · Arc 6 — Energy & the Grid" },

  // ── CONNECT: recall Arc 5 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you ran the grid and watched the storm break it — flooded substations, downed lines, the delivery system failing while the plants kept humming. The lights went out. But here's the thing nobody tells you: they didn't come back on for everyone at the same time. Some neighborhoods waited <span style=\"font-weight:700\">days longer</span> than others. Today's question isn't a physics equation. It's harder: <span style=\"font-weight:700\">who decides who gets power back first — and is that fair?</span>" },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "When the power's out, you don't think \"resistive losses\" or \"electromagnetic induction.\" You think: is the food going bad? Is grandma's oxygen machine still running? Can I get to work? \n\nA utility can't fix everything at once. They make choices — and those choices are <span style=\"font-weight:700\">value judgments</span>, not physics. Physics can tell you it's faster to dry out one switching station than to repair a thousand scattered downed lines. It <span style=\"font-weight:700\">cannot</span> tell you whether a hospital, a senior-housing complex, or a low-income neighborhood <em>should</em> come first. People decide that. Engineering is a human endeavor." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall before we get into the hard part. Quantity over polish.",
    sections: [ { id: "recall", kind: "prompts", title: "What broke, and who felt it?",
      prompts: [
        { id: "q1", label: "From last arc: name ONE part of the grid that failed during Sandy (not the power plants).", rows: 2 },
        { id: "q2", label: "If your house went dark for 10 days, name TWO things in your life that would get hard fast.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Restore Fairly",
    content: "You're advising the utility after the storm. You have limited crews and a whole state in the dark. Using the <span style=\"font-weight:700\">real Sandy county outage data</span>, your team has to decide a restoration order — who gets power back first, second, last — and <span style=\"font-weight:700\">justify it</span>. There's no answer key. \"Fair\" is a value judgment, so your <em>reasoning</em> is the grade. \n\nThere are levels. They get harder. Same rule as always: write down what you see in the data before you decide what's right." },

  { id: id("setup"), type: "callout", icon: "🗺️", style: "info", title: "The situation you're triaging",
    content: "When a storm knocks out power for millions, standard practice is to prioritize <span style=\"font-weight:700\">hospitals, emergency services, and densely populated areas</span> — places where the most people, or the most vulnerable people, depend on power. That's a reasonable starting point. But it means <em>someone</em> waits longer, and the order isn't decided by physics alone. \n\nOne thing that shaped your experience: <span style=\"font-weight:700\">Perth Amboy is served by JCP&L</span> (Jersey Central Power & Light), not PSE&G. Which utility you happened to live under shaped how long you stayed in the dark." },

  { id: id("data-callout"), type: "callout", icon: "📊", style: "default", title: "The data you're working from",
    content: "<span style=\"font-weight:700\">NJ Outage Duration After Sandy — longest-tail counties (avg. days without power):</span>\n\n• Monmouth — about 10 days\n• Somerset — about 9 days\n• Union — about 9 days\n• Ocean — about 8 days\n• Some individual NJ towns — up to 22 days\n\nStatewide, 17% of NJ towns had outages lasting longer than 10 days. <em>Source: Center for American Progress (NJ town/county data).</em> Note: the source doesn't separately report Middlesex County, so you'll have to estimate Perth Amboy's experience from nearby counties." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your restoration order (before you justify it)",
    instructions: "Sketch a simple priority list: who gets power back 1st, 2nd, 3rd, last? Use categories — hospital, emergency services, dense neighborhood, low-income area, scattered rural homes, etc. Don't justify it yet — just commit to a first-draft order so you can defend or change it later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-restore-fairly",
    title: "Class Challenge Board — Restore Fairly",
    intro: "Name your team, then mark each level as you clear it. The whole class can see how different teams are weighing the same trade-offs.",
    levels: [
      { n: 1, name: "Read the Data", nameEs: "Lee los Datos" },
      { n: 2, name: "Rank the Order", nameEs: "Ordena la Prioridad" },
      { n: 3, name: "Name the Trade-Off", nameEs: "Nombra el Sacrificio" },
      { n: 4, name: "Defend with Evidence", nameEs: "Defiende con Evidencia" },
      { n: 5, name: "Make It Fairer Next Time", nameEs: "Hazlo Más Justo la Próxima Vez" },
    ] },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Triage Decision Log",
    intro: "As your team works the case: <span style=\"font-weight:700\">before you rank anyone, write what the data says.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "triage", kind: "table", title: "Your restoration decisions",
      columns: [
        { key: "order", label: "Order (1st, 2nd…)", width: "90px", placeholder: "1st" },
        { key: "who", label: "Who gets power", placeholder: "hospital, dense area…" },
        { key: "why", label: "Why them first?", placeholder: "the value you're weighing" },
        { key: "cost", label: "Who waits because of it?", placeholder: "the trade-off" },
      ], minRows: 3, addRowLabel: "Add a decision" } ] },

  { id: id("worked-equity"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how much longer did Monmouth wait than Ocean?",
    content: "The table gives these average outage durations:\n\n• Monmouth County: about 10 days\n• Ocean County: about 8 days\n\n<span style=\"font-weight:700\">Step 1</span> — identify the two values you need. \n<span style=\"font-weight:700\">Step 2</span> — subtract the shorter from the longer:\n\n$$10\\,\\text{days} - 8\\,\\text{days} = 2\\,\\text{days}$$\n\n<span style=\"font-weight:700\">Step 3</span> — put it in context. Two extra days without power means two extra days of spoiled food, no heat, and no way to charge medical devices. The difference isn't just a number — it shapes how people <em>experienced</em> the storm." },

  { id: id("draw-revise"), type: "sketch", title: "Redraw Your Restoration Order",
    instructions: "Now that you've read the data and named the trade-offs, redraw your priority list. Did the data change your mind? Mark anything you moved, and draw a small arrow showing what made you move it. Neat doesn't matter — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop ranking. Now we figure out what it means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we made a list\" into a real argument about fairness." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the data actually show?",
      prompts: [
        { id: "q1", label: "The lesson says 55% of storm-surge victims in New York City were very-low-income renters (avg. household income about $18,000/yr). How might a long power outage hurt low-income families MORE than wealthier families? Give at least one specific reason.", rows: 3 },
        { id: "q2", label: "Whose voices should help decide how our community's grid gets rebuilt — and who gets power back first? Think residents, utilities, hospitals, emergency planners, local government, and groups hit hardest. Explain your reasoning.", rows: 3 },
        { id: "q3", label: "Was the order in which power was restored after Sandy fair? Make a CLAIM (yes / no / it depends), back it with EVIDENCE (the county-duration table, the 22-day figure, the NYC equity data, or the \"tale of two utilities\"), and give your REASONING.", rows: 4 },
        { id: "q4", label: "If you were advising Perth Amboy on making the next recovery fairer, what is ONE change you'd recommend? Explain in two or three sentences.", rows: 3 },
        { id: "q5", label: "Why is it true that \"engineering is a human endeavor\"? Use the restoration decisions as your example.", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — add the people",
    intro: "Same model we've built all unit. Today's tweak is the big one: add the <span style=\"font-weight:700\">human layer</span>. Show the grid AND the people who depend on it — mark where a failure hits the most vulnerable, and where a human decision (not physics) shapes who waits. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l6",
    title: "Class Question Board",
    intro: "Post at least one question you still have about fairness, restoration, or who the grid is built for. These drive where the unit heads next.",
    starters: [
      "Why does the order in which power comes back depend on ___?",
      "How could a utility make restoration fairer for ___?",
      "Is it fair that ___ waited longer than ___?",
      "Who should get to decide ___ when the next storm hits?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE question for next time",
        label: "Could be a fairness question OR a physics question — the unit needs both.",
        placeholder: "If we ___, would the recovery be ___?",
        hint: "*A good one makes the class argue or makes us go find out.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"outage,\" \"restoration,\" \"infrastructure,\" \"critical load,\" \"resilience,\" \"equity\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check = the MID-UNIT MASTERY CHECK (all three scales) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Mid-Unit Mastery",
    subtitle: "This one's bigger: it pulls together everything from Arcs 1–6. Take your time and show your reasoning." },

  { id: id("sc-intro"), type: "callout", icon: "🧩", style: "tip", title: "Pull the whole story together",
    content: "We've spent this unit pulling the Sandy blackout apart one piece at a time — what energy is, how it moves through a wire, how the whole grid hangs together as a <span style=\"font-weight:700\">system</span>, and how people decided what to fix first. Now pull it back together across <span style=\"font-weight:700\">all three scales</span>: \n\n• <span style=\"font-weight:700\">Electron / charge scale</span> — the moving charges in the wires. \n• <span style=\"font-weight:700\">System / grid scale</span> — generation → transmission → substations → distribution → homes. \n• <span style=\"font-weight:700\">Human scale</span> — who lost power, who got it back, and who decided. \n\nQuick recap: energy goes chemical → thermal → mechanical → electrical → light/heat/motion. Current is the flow of charge (electrons in metal wires). Voltage is the \"push.\" Power is how fast energy moves: $P = IV$. Energy used over time is $E = Pt$." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "During Sandy, most NJ power plants kept running — yet millions of customers lost power, and some neighborhoods stayed dark for over three weeks. A natural-gas plant burns fuel, the energy travels across the state to your wall, and a space heater plugged into a $120\\,\\text{V}$ outlet warms a room. Use that whole picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> In a few sentences, explain how the Sandy blackout happened by connecting at least two scales — for example, electrons/energy moving in the wires AND a part of the grid system that failed. Use what you've built all unit." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In a natural-gas power plant, the energy transformations are best described as —",
    options: [
      "chemical → thermal → mechanical → electrical.",
      "chemical → electrical → thermal → mechanical, in that order.",
      "electrical → mechanical → thermal → chemical, in that order.",
      "mechanical → electrical → thermal → chemical, in that order.",
    ], correctIndex: 0,
    explanation: "Natural gas is burned (chemical → thermal), the heat turns water to steam that spins a turbine (thermal → mechanical), and the turbine spins a generator (mechanical → electrical)." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why is electricity sent across long distances at very high voltages?",
    options: [
      "Because high voltage makes the electrons travel faster through the wire.",
      "High voltage reduces energy losses in the transmission lines.",
      "Because high voltage converts AC into DC automatically at every substation.",
      "Because high voltage removes the need for any substations on the grid.",
    ], correctIndex: 1,
    explanation: "Higher voltage allows lower current for the same power, which reduces resistive losses ($P_{loss} = I^2R$) in the transmission lines. Substations are still needed to step voltage down." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A $1500\\,\\text{W}$ space heater is plugged into a $120\\,\\text{V}$ outlet. Using $P = IV$, how much current does it draw?",
    options: [
      "About $0.08\\,\\text{A}$, found by dividing the voltage by the power.",
      "About $1380\\,\\text{A}$, found by subtracting voltage from power.",
      "About $12.5\\,\\text{A}$.",
      "About $180{,}000\\,\\text{A}$, found by multiplying power times voltage.",
    ], correctIndex: 2,
    explanation: "Rearrange $P = IV$ to $I = \\frac{P}{V} = \\frac{1500\\,\\text{W}}{120\\,\\text{V}} = 12.5\\,\\text{A}$." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "That same $1500\\,\\text{W}$ heater runs for 2 hours. Using $E = Pt$, how much electrical energy does it use?",
    options: [
      "$750\\,\\text{Wh}$, found by dividing the power by the time it ran.",
      "$1502\\,\\text{Wh}$, found by adding the time to the power rating.",
      "$0.75\\,\\text{kWh}$, found by dividing power by time and converting.",
      "$3000\\,\\text{Wh}$, which is $3.0\\,\\text{kWh}$.",
    ], correctIndex: 3,
    explanation: "$E = Pt = 1500\\,\\text{W} \\cdot 2\\,\\text{h} = 3000\\,\\text{Wh} = 3.0\\,\\text{kWh}$. That energy had to be generated, stepped up, transmitted, stepped down, and delivered — every step a possible failure point." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "During Sandy, many NJ power plants kept running, but customers still lost power. What does that tell you about the cause of the blackout?",
    options: [
      "The blackout was caused by a shortage of fuel at the generating plants.",
      "The blackout happened because people were using far too much electricity.",
      "It was mainly a failure of the delivery system, not generation.",
      "The blackout was caused by the AC current reversing direction too often.",
    ], correctIndex: 2,
    explanation: "Since generation was largely intact, the failure was in transmission, substations, and distribution — the parts that deliver electricity to homes." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "According to the NJ outage-duration data, which county had the longest average outage after Sandy?",
    options: [
      "Ocean County, at about 8 days without power on average.",
      "Union County, at about 9 days without power on average.",
      "Somerset County, at about 9 days without power on average.",
      "Monmouth County, about 10 days.",
    ], correctIndex: 3,
    explanation: "The table lists Monmouth County at about 10 days, the longest average shown (Somerset and Union were about 9, Ocean about 8)." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which groups are typically prioritized when utilities restore power after a major storm?",
    options: [
      "Hospitals, emergency services, and densely populated areas.",
      "Shopping malls, schools, and large sports stadiums first.",
      "The newest buildings and the most expensive neighborhoods first.",
      "Whichever areas happen to sit farthest from the utility headquarters.",
    ], correctIndex: 0,
    explanation: "FEMA and utility restoration guidelines prioritize critical facilities and places where the most people — or the most vulnerable people — depend on power." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "If a town was without power for 22 days, about how many weeks is that (rounded to the nearest whole week)?",
    options: [
      "About 2 weeks, since 22 days is just under two full weeks of outage.",
      "3 weeks.",
      "About 4 weeks, since you round 22 days up to the next whole week.",
      "About 5 weeks, since each week of an outage counts as roughly 4 days.",
    ], correctIndex: 1,
    explanation: "$22 \\div 7 \\approx 3.14$, which rounds to 3 weeks." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw — the whole chain, all three scales",
    instructions: "Sketch the path from a power plant to a Perth Amboy home. Label the stages (generation → transmission → substation → distribution → home) and add ONE failure mode that could happen at a stage during a storm. Then add the human layer: mark who decides what gets fixed first. Show your current thinking — neat doesn't matter.",
    canvasHeight: 340 },

  { id: id("sc-transfer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Tie the scales together.</span> The unit's driving question was: \"Why did the lights go out during Superstorm Sandy?\" Write a one-paragraph answer that connects at least THREE scales — (1) electrons/energy in the wire, (2) a part of the grid system that failed, and (3) a human decision about restoration. CLAIM: in one sentence, what fundamentally caused the blackout to happen and last so long. EVIDENCE: cite specific physics ideas AND specific Sandy facts (county outage durations, the 22-day figure, or the NYC equity data). REASONING: explain how the small-scale physics connects to the system failure and to the human decisions." },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel about the whole Sandy story now?</span> Tap your stars — there's no wrong answer. This tells Mr. McCarthy what to firm up before we move on." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest part of pulling all three scales together:", rows: 1 },
        { id: "surprise", label: "One thing about who-got-power-back that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You just did something most adults can't: you explained a blackout from the electrons in the wire all the way up to the human decisions about whose lights come back first. That's the whole point of this unit — physics is never <em>just</em> physics. It's always about people. Next arc, we start fixing it. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Who Gets the Power Back?",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1106,
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
