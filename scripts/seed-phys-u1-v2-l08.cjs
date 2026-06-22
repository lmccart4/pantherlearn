// seed-phys-u1-v2-l08.cjs
// U1 v2 PILOT — Arc 8: "Design a Resilient Grid" (OpenSciEd-spine / Rober-engine).
// CAPSTONE (~3 periods). Merges v1 L13 (Design Challenge: A Resilient Grid for Perth
// Amboy) + L14 (Showcase + Transfer Task) into the unit-closing challenge-arc:
// "Redesign for Resilience." The class is the Perth Amboy Resilience Task Force —
// design an energy system that meets reliability + cost + emissions criteria AND
// survives a Sandy-scale storm without blacking out; justify the energy mix + storage
// with evidence from the WHOLE unit; showcase + peer-eval; TRANSFER task (apply the
// model to the brand-new Texas 2021 / Winter Storm Uri blackout); revisit the Driving
// Question Board and compare the class's initial-vs-final model.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false). Design/argument-
// heavy: favors short_answer (design justification, CER, transfer task, peer-eval) over
// MC — only 4 factual MC concept checks. Embed = grid-reliability-simulator ?mode=design
// (exact URL from arc8.md). consensus_model frames the INITIAL-vs-FINAL compare.
//
// Content repackaged verbatim from drafts/physics-content-review/u1-v2/_v1-source/arc8.md
// (already sourced/audited). Real-world figures (2.7M NJ customers, Sandy; 4.5M Texas
// homes, Winter Storm Uri / ERCOT; PSE&G Energy Strong) carry their source links as
// external_link blocks. No invented numbers.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l08-resilient-grid";
// Capstone embed: the grid-reliability simulator in DESIGN mode. Exact URL from arc8.md.
const SIM = "https://paps-tools.web.app/grid-reliability-simulator.html?mode=design";

let _n = 0;
const id = (slug) => `v2l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🏙️", title: "Design a Resilient Grid",
    subtitle: "Unit 1 · Arc 8 — Energy & the Grid · CAPSTONE" },

  // ── CONNECT: recall the whole unit → the original question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Day one, the lights went out and you sketched a guess about why. Since then you've followed the energy, taken the grid apart, built your own electricity, run a day's demand, restored power fairly, and stocked the supply. Today you answer the question we opened with: <span style=\"font-weight:700\">How can we design a more reliable energy system for our community?</span> You're not guessing anymore. You're engineering it." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "You and your team are the <span style=\"font-weight:700\">Perth Amboy Resilience Task Force</span>. The city hired you to redesign the grid so the next storm doesn't repeat October 2012 — when Superstorm Sandy left roughly <span style=\"font-weight:700\">2.7 million</span> New Jersey customers in the dark, some for more than a week.\n\nYour grid has to keep the lights on every hour, stay inside budget, run clean, and <span style=\"font-weight:700\">keep serving the city even when the storm hits</span>. Everything you've learned this unit feeds this one build." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Pull the whole unit back into your head before you design — quantity over polish.",
    sections: [ { id: "recall", kind: "prompts", title: "What do you know going in?",
      prompts: [
        { id: "q1", label: "Name ONE thing that actually failed during Sandy in 2012 (from the unit). How will your design avoid repeating it?", rows: 2 },
        { id: "q2", label: "Name TWO trade-offs between energy sources you'll have to balance (cheap vs. clean, steady vs. weather-dependent, etc.).", rows: 2 },
      ] } ] },

  // ── EXPLORE: the capstone challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "The job: Redesign for Resilience",
    content: "Build an energy system for Perth Amboy that satisfies <span style=\"font-weight:700\">all four criteria</span> below — these are the exact targets the simulator checks when you hit <span style=\"font-weight:700\">Submit Design</span> — and then prove it survives a Sandy-scale storm.\n\nThe rule still holds: write down what you see in each simulator run before you decide what to change." },

  { id: id("criteria"), type: "callout", icon: "📋", style: "info", title: "Criteria & Constraints (all four must pass)",
    content: "<span style=\"font-weight:700\">Reliability — at least 95%</span> of hours served on a normal day. Supply must meet or beat demand nearly every hour; demand swings from a ~600 MW overnight base to a ~1,500 MW evening peak <span style=\"font-weight:400\">(simulator parameters, not real Perth Amboy load data)</span>.\n\n<span style=\"font-weight:700\">Budget — 30 build points or less.</span> Each unit costs points: solar/wind 2 each, gas 3, battery 4, nuclear 6. Spend over 30 and you're out.\n\n<span style=\"font-weight:700\">Emissions — keep it clean.</span> No high-carbon sources. Natural gas is the only high-carbon option in the kit, so a clean design leans on nuclear, solar, wind, and batteries.\n\n<span style=\"font-weight:700\">Storm survival — hold up under Sandy.</span> Click ⛈ Run the Sandy Storm (severity 0.9): it floods out flood-vulnerable sites, hides the sun, and leaves only light wind. Your grid must stay within ~15% of the reliability target (about 80% of hours served) through the storm." },

  { id: id("tradeoff"), type: "callout", icon: "⚖️", style: "warning", title: "The trade-off you have to solve",
    content: "The cheap, dispatchable source (natural gas) is <span style=\"font-weight:700\">flood-vulnerable</span> and <span style=\"font-weight:700\">emits CO₂</span> — exactly the kind of source that failed or strained during Sandy. The clean sources (solar, wind) are <span style=\"font-weight:700\">weather-dependent</span>, so the storm guts them right when you need them most. Nuclear is clean and storm-proof but expensive, and <span style=\"font-weight:700\">batteries</span> only give back energy you stored earlier. Balancing supply against demand <span style=\"font-weight:700\">every hour — including the storm hour</span> — is the whole challenge." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your first design (before you run it)",
    instructions: "Before you touch the simulator, sketch the energy mix you think will work: how many of each source, where storage fits, and which sources you're counting on to ride out the storm. Label your reasoning. Wrong is fine — we sketch first so we can compare after.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-resilient-grid",
    title: "Class Challenge Board — Redesign for Resilience",
    intro: "Name your task force, then mark each level as you clear it. This is the capstone — the whole class can see who's hit a resilient grid.",
    levels: [
      { n: 1, name: "Meet Demand", nameEs: "Cumple la Demanda" },
      { n: 2, name: "Stay in Budget", nameEs: "Respeta el Presupuesto" },
      { n: 3, name: "Run It Clean", nameEs: "Hazlo Limpio" },
      { n: 4, name: "Survive the Sandy Storm", nameEs: "Sobrevive la Tormenta Sandy" },
      { n: 5, name: "Defend Your Design", nameEs: "Defiende Tu Diseño" },
    ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — one possible design (not the only answer)",
    content: "A student team proposes this mix:\n\n• <span style=\"font-weight:700\">2 nuclear</span> ($6 \\times 2 = 12$) • <span style=\"font-weight:700\">3 solar</span> ($2 \\times 3 = 6$) • <span style=\"font-weight:700\">3 wind</span> ($2 \\times 3 = 6$) • <span style=\"font-weight:700\">1 battery</span> ($4 \\times 1 = 4$) • <span style=\"font-weight:700\">0 gas</span>.\n\nTotal cost: $12 + 6 + 6 + 4 = 28$ points — within the 30-point budget.\n\n<span style=\"font-weight:700\">Why it might pass on a normal day:</span> nuclear holds a steady baseload around the clock, solar covers midday demand, wind adds clean power when it blows, and the battery stores midday solar to discharge in the evening peak.\n\n<span style=\"font-weight:700\">Why it might still fail the storm:</span> the Sandy run cuts solar and wind output, and with only one battery the stored energy runs out fast. The team may need more batteries — or to accept a little gas as backup. Your job is to check each criterion, find the weak spot, and iterate. Your final design may look nothing like this." },

  { id: id("embed-sim"), type: "embed", url: SIM, scored: true, weight: 5 },

  { id: id("ml-runlog"), type: "mission_log", title: "Mission Log — Design Run Log",
    intro: "Each time you Submit Design, log the run BEFORE you change anything: <span style=\"font-weight:700\">document what you saw, then decide what to fix.</span> That's the engineer move.",
    sections: [ { id: "runlog", kind: "table", title: "Iterating toward a passing design",
      columns: [
        { key: "run", label: "Run", width: "60px", placeholder: "1" },
        { key: "mix", label: "Your mix (sources + storage)", placeholder: "2 nuclear, 3 solar…" },
        { key: "cost", label: "Cost ($)", width: "90px", placeholder: "28" },
        { key: "result", label: "Reliability / storm result", placeholder: "97% normal, 72% storm" },
        { key: "fix", label: "Weak spot → next change", placeholder: "storm fails → +1 battery" },
      ], minRows: 3, addRowLabel: "Add a run" } ] },

  { id: id("draw-final"), type: "sketch", title: "Draw Your Final Design",
    instructions: "Once a run passes all four criteria, redraw your final grid: each source as a labeled box, your storage, and an arrow or note showing what carries the load DURING the storm hour. Show your current thinking — neat doesn't matter.",
    canvasHeight: 340 },

  // ── INTEGRATE: design justification (CER) → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop iterating. Now you argue for your design like an engineer defending it to the city. Write first, then we showcase. <span style=\"font-weight:700\">Do not skip this</span> — this is where a build becomes a justified design." },

  { id: id("sa-strongest-weakest"), type: "question", questionType: "short_answer",
    prompt: "Before you finalize, look at your simulator results. Which criterion is your design <span style=\"font-weight:700\">strongest</span> on, and which one is it <span style=\"font-weight:700\">weakest</span> on? What is one change you could make to fix the weak spot?" },

  { id: id("sa-justify"), type: "question", questionType: "short_answer",
    prompt: "Justify your final design using evidence from this entire unit. Address ALL of these:\n\n• <span style=\"font-weight:700\">Energy mix:</span> which sources you chose and *why*, in terms of the energy transformations each one runs (chemical / nuclear / radiant / kinetic → electrical).\n• <span style=\"font-weight:700\">Supply & demand:</span> how your design keeps supply balanced against demand across the day, especially at the evening peak.\n• <span style=\"font-weight:700\">Storage trade-offs:</span> what role batteries play, and the limits of leaning on storage.\n• <span style=\"font-weight:700\">Lessons from Sandy:</span> what actually failed in 2012, and how your design avoids repeating it under the storm." },

  { id: id("sa-cer-design"), type: "question", questionType: "short_answer",
    prompt: "Your team claims your design is the best fit for Perth Amboy. Make that claim and back it with evidence and reasoning:\n\n• <span style=\"font-weight:700\">CLAIM:</span> in one sentence, why your design is a good fit for Perth Amboy.\n• <span style=\"font-weight:700\">EVIDENCE:</span> cite specific simulator results (reliability %, budget, emissions, storm survival) and facts from the unit (Sandy failures, source trade-offs, storage limits).\n• <span style=\"font-weight:700\">REASONING:</span> explain how your energy mix, storage, and redundancy work together to meet the criteria — and name one trade-off you accepted." },

  { id: id("link-energystrong"), type: "external_link",
    url: "https://poweringprogress.pseg.com/energy-strong/",
    title: "PSE&G Energy Strong — Post-Sandy Grid Hardening",
    description: "Real utilities do exactly this design work after major storms. After Sandy, PSE&G's Energy Strong program spent billions raising and flood-proofing substations, replacing gas mains in flood zones, and adding smarter grid monitoring. Resilience isn't just a classroom exercise.",
    buttonLabel: "See PSE&G Energy Strong", icon: "🔗", openInNewTab: true },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Final Class Model — initial vs. final",
    intro: "This is the same model you started on day one and tweaked every arc. Today is the FINAL round: put your <span style=\"font-weight:700\">day-one sketch</span> next to your <span style=\"font-weight:700\">final design</span> and show how the class's thinking changed — energy forms, transfers, what a resilient grid needs. Copy the side-by-side comparison into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l8",
    title: "Class Question Board — what's still open",
    intro: "We close the unit, but real engineers never fully close it. Post one question your design still doesn't fully answer — these are the threads a real Resilience Task Force keeps pulling.",
    starters: [
      "Could a real Perth Amboy grid actually afford ___?",
      "What happens to my design if the storm is even worse than ___?",
      "How would adding ___ change the trade-off?",
      "Where would my design still fail if ___?",
    ] },

  // ── NAVIGATE: testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "Even a finished design raises new questions. Capture one — and lock in the vocabulary you earned across the whole unit.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question about resilient grids",
        label: "The kind we could investigate by DOING or modeling something — not just looking it up.",
        placeholder: "If we ___, would the grid survive ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "The capstone vocabulary you earned: \"criteria,\" \"constraints,\" \"trade-off,\" \"resilience,\" \"redundancy,\" \"dispatchable,\" \"baseload,\" \"intermittency,\" \"storage.\" Catch the ones you kept reaching for, with what you THINK they mean. These are yours now — you earned them." },
    ] },

  // ── PROCESS: Status Check — showcase, peer-eval, transfer task, concept checks ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check — Showcase, Peer Review & Transfer",
    subtitle: "This closes the unit. Present your design, review a peer, then prove your model travels to a storm you've never studied." },

  { id: id("showcase"), type: "callout", icon: "🎤", style: "tip", title: "The showcase (~2 minutes)",
    content: "Present your resilient-grid design to the class. Be ready to explain: <span style=\"font-weight:700\">what mix</span> of sources you chose (and roughly how much of each), <span style=\"font-weight:700\">why</span> that mix — what each source brings and what its weakness is — and <span style=\"font-weight:700\">how it survives a storm</span>: point to the exact moment in your simulator run where your design held when a weaker one would have failed.\n\nYour job isn't to be perfect — it's to make a clear argument from evidence, the way an engineer defends a design." },

  { id: id("evidence"), type: "evidence_upload", title: "Upload your design evidence",
    instructions: "Upload a screenshot of your passing simulator run (showing reliability, cost, emissions, and storm survival) and/or your final design sketch. This is the evidence you'll point to during your showcase." },

  { id: id("sa-peer"), type: "question", questionType: "short_answer",
    prompt: "Listen to one classmate's showcase, then answer:\n\n1. What energy mix did they choose?\n2. What was their <span style=\"font-weight:700\">strongest</span> piece of evidence?\n3. What is one <span style=\"font-weight:700\">question</span> you have about their design?" },

  // Transfer task — brand-new blackout (Texas / Winter Storm Uri 2021, ERCOT)
  { id: id("transfer-intro"), type: "callout", icon: "🧊", style: "info", title: "The transfer task — a storm you've never studied",
    content: "A real model isn't one you can recite back for the phenomenon you studied — it's one you can carry to a situation you've never seen and still make sense of. So here's a different storm, a different grid: does your model still explain it?\n\nIn <span style=\"font-weight:700\">February 2021</span>, Winter Storm Uri pushed extreme cold across <span style=\"font-weight:700\">Texas</span>. Texas runs its own grid, managed by <span style=\"font-weight:700\">ERCOT</span>, largely separated from the rest of the country. As the cold settled in, roughly <span style=\"font-weight:700\">4.5 million</span> homes and businesses lost power — many for days, in freezing temperatures.\n\nYou never studied Texas. That's the point. Read the facts below, then apply *your* model." },

  { id: id("transfer-table"), type: "mission_log", title: "Texas, February 2021 — What Happened (approximate)",
    intro: "Approximate figures, drawn from the UT Energy Institute's report on the February 2021 Texas blackouts (source linked below).",
    sections: [ { id: "txfacts", kind: "table", title: "What changed during Winter Storm Uri",
      columns: [
        { key: "change", label: "What changed", placeholder: "What froze / demand spike / no imports / scale" },
        { key: "what", label: "Roughly what happened", placeholder: "describe it" },
      ], minRows: 4, addRowLabel: "Add a row" } ] },

  { id: id("transfer-facts"), type: "callout", icon: "📊", style: "default", title: "The facts to work with",
    content: "<span style=\"font-weight:700\">What froze:</span> natural-gas wellheads, pipes, and instruments — and some wind turbines — froze in the extreme cold, so they could not produce power.\n\n<span style=\"font-weight:700\">Demand spike:</span> heating demand surged as millions ran electric heat at once during the freeze.\n\n<span style=\"font-weight:700\">Why no imports:</span> the Texas (ERCOT) grid is largely isolated from neighboring grids, so it could not import enough power to cover the shortfall.\n\n<span style=\"font-weight:700\">Scale of outage:</span> roughly 4.5 million homes and businesses lost power, many for several days." },

  { id: id("exemplar"), type: "callout", icon: "⭐", style: "info", title: "Exemplar — how to explain a new blackout with your model",
    content: "<span style=\"font-weight:700\">Sample claim:</span> the Texas grid failed because supply crashed and demand spiked at the same time, and the isolated ERCOT grid could not import backup power.\n\n<span style=\"font-weight:700\">Sample evidence:</span> natural-gas equipment froze, so a major dispatchable source went offline. Wind turbines also froze, cutting another source. Meanwhile demand for electric heat jumped. Because ERCOT is mostly isolated, Texas couldn't buy enough power from outside to close the gap.\n\n<span style=\"font-weight:700\">Sample reasoning:</span> a grid must balance supply and demand every hour. When multiple supply sources fail at once and demand rises sharply, the balance breaks. Storage covers short-term gaps and interconnections let a grid import power when local generation fails — Texas lacked both at the scale needed.\n\nYours doesn't need to match this exactly — it needs to use *your* model." },

  { id: id("sa-transfer"), type: "question", questionType: "short_answer",
    prompt: "Apply your energy and grid model to explain <span style=\"font-weight:700\">WHY the Texas 2021 grid failed</span>, then propose <span style=\"font-weight:700\">ONE</span> resilience fix that would have helped. Use the facts above as your evidence:\n\n• <span style=\"font-weight:700\">CLAIM:</span> in one sentence, why the Texas grid failed — and name the one fix you would make.\n• <span style=\"font-weight:700\">EVIDENCE:</span> cite specific facts (what froze, the demand spike, the isolation) and connect them to ideas from this unit.\n• <span style=\"font-weight:700\">REASONING:</span> explain, using energy transfer/conservation and how a grid balances supply and demand, why those facts caused the failure and why your fix would help." },

  // Concept-check MC — 4 factual items (capstone is argument-heavy; MC is light)
  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In the simulator, which criterion requires your design to supply electricity for at least 95% of hours on a normal day?",
    options: [
      "Budget — the design must cost $30 or less to build out.",
      "Reliability — supply must meet demand for nearly every hour.",
      "Emissions — the design must avoid all high-carbon sources.",
      "Storm survival — the design must hold up under the Sandy storm.",
    ], correctIndex: 1,
    explanation: "The reliability criterion checks that your grid meets demand for at least 95% of hours on a normal day. Budget, emissions, and storm survival are the other three criteria." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A team spends 32 build points in the simulator. What happens to their design?",
    options: [
      "The grid automatically loses the storm-survival test for that run.",
      "The emissions criterion is ignored because the budget was exceeded.",
      "It fails — it costs more than the $30 budget limit.",
      "The reliability target is raised to 100% as a penalty for that team.",
    ], correctIndex: 2,
    explanation: "The budget constraint is $30 or less. Spending 32 points violates the budget, so the design fails regardless of how it performs on the other criteria." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In the design kit, why is leaning entirely on solar and wind risky for surviving the Sandy storm?",
    options: [
      "Solar and wind are weather-dependent, so the storm cuts their output.",
      "Solar and wind are the most expensive sources in the simulator kit.",
      "Solar and wind emit the most CO₂, so they fail the emissions check.",
      "Solar and wind can only be turned on after the storm has fully passed.",
    ], correctIndex: 0,
    explanation: "Solar and wind are intermittent — they only generate when the weather allows. The Sandy storm run hides the sun and leaves only light wind, gutting their output right when demand is highest." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Based on the unit, what is the role of a battery in a resilient grid design?",
    options: [
      "It creates extra energy during a storm to cover any supply shortfall.",
      "It permanently removes high-carbon emissions from the grid's gas units.",
      "It raises the reliability target so the grid is easier to pass.",
      "It stores energy generated earlier and releases it later when needed.",
    ], correctIndex: 3,
    explanation: "A battery only gives back energy you stored earlier — it doesn't create energy. It shifts supply in time (e.g., storing midday solar to discharge at the evening peak), but its stored energy can run out during a long storm." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw — your final answer to the driving question",
    instructions: "Sketch your one-sentence answer to the unit's driving question — How can we design a more reliable energy system for our community? — as a quick diagram: your energy mix, your storage, and the one feature that keeps it running when a storm hits. Show your current thinking; neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sa-driving-question"), type: "question", questionType: "short_answer",
    prompt: "The unit opened with this question: <span style=\"font-weight:700\">How can we design a more reliable energy system for our community?</span> How has your answer changed since day one? Name at least one <span style=\"font-weight:700\">physics</span> idea and one <span style=\"font-weight:700\">engineering</span> idea that shaped your final answer." },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel about your design and your model right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy where the class landed." },

  { id: id("link-ut"), type: "external_link",
    url: "https://energy.utexas.edu/research/ercot-blackout-2021",
    title: "UT Energy Institute — The February 2021 Texas Grid Blackouts",
    description: "Source for the Texas / Winter Storm Uri figures: timeline and events of the February 2021 ERCOT blackouts.",
    buttonLabel: "Read the UT report", icon: "🔗", openInNewTab: true },

  { id: id("link-eia"), type: "external_link",
    url: "https://www.eia.gov/energyexplained/electricity/",
    title: "U.S. EIA — Energy Explained: Electricity",
    description: "Background on how electricity is generated, moved, and used in the U.S. — the official federal source.",
    buttonLabel: "Open EIA Energy Explained", icon: "🔗", openInNewTab: true },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Unit Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go — the unit's done",
      prompts: [
        { id: "proud", label: "The part of your resilient-grid design you're most proud of, and why:", rows: 2 },
        { id: "changed", label: "One thing you believed on day one that you now think differently about:", rows: 2 },
        { id: "word", label: "One word you earned this unit that you couldn't have explained in Arc 1 *(→ Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "We started in the dark — the night Sandy took the lights out of Perth Amboy. You followed the energy, took the grid apart, built your own electricity, ran a day's demand, restored power fairly, and today you engineered a grid that holds when the storm hits — and proved your model travels all the way to Texas. That's a real model. That's physics. Proud of you. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Design a Resilient Grid",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1108,
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
