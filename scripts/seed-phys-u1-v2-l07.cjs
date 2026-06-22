// seed-phys-u1-v2-l07.cjs
// U1 v2 PILOT — Arc 7: "Store & Source" (OpenSciEd-spine / Rober-engine).
// Merges v1 L11 (Storing Energy) + L12 (Where Should Our Energy Come From?) into one
// challenge-arc: "Stock the Supply." Ways to store energy + the form each uses; storage
// buffers intermittent solar/wind; PE=mgh for pumped-hydro; why batteries alone can't
// fully solve intermittency; compare sources by cost vs emissions; build a CER for Perth
// Amboy's best energy mix. Through-line: design storage + pick a source mix that survives
// a quiet-sun, low-wind week.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as Arc 2. Content repackaged from
// drafts/physics-content-review/u1-v2/_v1-source/arc7.md (already sourced/audited).
// arc7.md shows NO embed (printable link + calc only) → worked-example callouts instead.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l07-store-and-source";
// Status Check scenario is described in text (no new image asset this arc). Sources cited via
// external_link blocks (EIA / NREL). NJ 2024 mix figures are from arc7.md (EIA, already audited).

let _n = 0;
const id = (slug) => `v2l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🔋", title: "Store & Source",
    subtitle: "Unit 1 · Arc 7 — Energy & the Grid" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you ran the grid and survived the storm — matching supply to demand minute by minute. But that only works if there's supply *to* match. Today's two questions: how do you <span style=\"font-weight:700\">bank energy</span> for when the sun's down and the wind's dead, and where should that energy <span style=\"font-weight:700\">come from</span> in the first place? You're about to make a real engineering call for Perth Amboy." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Your phone battery lets you text for hours after you unplug it. Now scale that up: could a battery keep an entire city running through a week-long blackout?\n\nDuring Sandy, some neighborhoods went dark for more than a week. A roof full of solar panels might have made plenty of power at noon the day before — but once the sun went down, that energy was <span style=\"font-weight:700\">gone</span> unless someone stored it. Storage is what turns a moment of sunshine into light after dark. That's the thread today: where do we park energy, and where do we get it from?" },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from last arc — quantity over polish. Then we go stock the supply.",
    sections: [ { id: "recall", kind: "prompts", title: "Supply, demand, and the gap",
      prompts: [
        { id: "q1", label: "Last arc, name ONE moment where demand spiked but supply struggled to keep up.", rows: 2 },
        { id: "q2", label: "If solar makes the most power at noon but people use the most at dinner — what's the problem, and how might you fix it?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Stock the Supply",
    content: "Design an energy setup for Perth Amboy that survives a <span style=\"font-weight:700\">quiet-sun, low-wind week</span> — clouds for days, barely a breeze. You'll pick how to <span style=\"font-weight:700\">store</span> energy (and in what form), then pick a <span style=\"font-weight:700\">source mix</span> by weighing cost against emissions and reliability. Your job isn't done until you can defend the whole plan with a claim, evidence, and reasoning.\n\nThere are levels. They get harder. Same rule as always — write what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔌", style: "info", title: "Three ways to bank energy — each in a different FORM",
    content: "<span style=\"font-weight:700\">Batteries</span> store energy as <span style=\"font-weight:700\">chemical</span> energy in the bonds inside their cells; the chemicals react to release electrical energy on demand. <span style=\"font-weight:700\">Pumped-hydro</span> stores energy as <span style=\"font-weight:700\">gravitational potential</span> energy — pumps lift water uphill when there's extra electricity, then the water falls through a turbine later. <span style=\"font-weight:700\">Thermal storage</span> stores energy as <span style=\"font-weight:700\">heat</span> — warming a big tank of molten salt or water, then drawing the heat back out to boil water and spin a turbine.\n\nIn every case the energy is transferred and transformed, never created. We're just holding it in a convenient form until the grid needs it back." },

  { id: id("why-storage"), type: "callout", icon: "🦆", style: "warning", title: "Why storage matters — supply and demand don't line up in time",
    content: "Solar panels make the most power around <span style=\"font-weight:700\">midday</span>, when the sun is highest. But electricity demand in many U.S. communities peaks in the <span style=\"font-weight:700\">evening</span> — families get home, flip on lights, cook dinner, run the AC. By then the sun is low or gone.\n\nStorage is the fix: bank extra energy when there's plenty, release it later when it's needed. Without storage, a grid running on solar and wind would have power at the wrong times. (Look up the EIA \"duck curve\" — it's exactly this gap, drawn out.)" },

  { id: id("src-duck"), type: "external_link",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=56880",
    title: "EIA — the \"duck curve\" (solar midday vs. evening demand)",
    description: "U.S. Energy Information Administration explainer on why solar output and demand peak at different times.",
    buttonLabel: "Open EIA duck curve", icon: "🔗", openInNewTab: true },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your storage + source plan (before the math)",
    instructions: "Sketch a rough plan for Perth Amboy: where does the energy come FROM (gas? nuclear? solar? wind?), and how do you STORE the extra for the quiet-sun week? Label the energy form at each storage box. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-stock-the-supply",
    title: "Class Challenge Board — Stock the Supply",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's stocking what.",
    levels: [
      { n: 1, name: "Name the Storage Form", nameEs: "Nombra la Forma de Almacenamiento" },
      { n: 2, name: "Run the PE = mgh Math", nameEs: "Resuelve PE = mgh" },
      { n: 3, name: "Cover the Evening Gap", nameEs: "Cubre el Hueco de la Noche" },
      { n: 4, name: "Compare the Sources", nameEs: "Compara las Fuentes" },
      { n: 5, name: "Defend Your Energy Mix", nameEs: "Defiende Tu Mezcla de Energía" },
    ] },

  { id: id("ml-storage-trace"), type: "mission_log", title: "Mission Log — Storage Trace Log",
    intro: "As you work the levels: <span style=\"font-weight:700\">before you decide one storage type beats another, write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Comparing the storage options",
      columns: [
        { key: "type", label: "Storage type", placeholder: "battery / pumped-hydro / thermal" },
        { key: "form", label: "Energy FORM stored", placeholder: "chemical / gravitational PE / heat" },
        { key: "speed", label: "Response speed", placeholder: "fast / slow" },
        { key: "fit", label: "Good fit for Perth Amboy? Why?", placeholder: "land, cost, duration…" },
      ], minRows: 3, addRowLabel: "Add a storage type" } ] },

  // ── worked example: PE = mgh (arc has equations, no embed) ──
  { id: id("worked-pe"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how much energy is actually stored?",
    content: "A small town weighs two storage options.\n\n<span style=\"font-weight:700\">Part A — Battery bank.</span> Lithium-ion batteries rated at $E_\\text{battery} = 10\\,\\text{kWh}$. The rating already tells us the stored energy — enough to run ten $1\\,\\text{kW}$ window AC units for one hour, or one for ten hours.\n\n<span style=\"font-weight:700\">Part B — Pumped-hydro reservoir.</span> A tank holds $5{,}000\\,\\text{kg}$ of water $80\\,\\text{m}$ above the turbine. Use gravitational potential energy (system = water + Earth):\n\n$$PE = mgh = (5{,}000\\,\\text{kg})(9.8\\,\\text{m/s}^2)(80\\,\\text{m}) = 3{,}920{,}000\\,\\text{J} \\approx 3.9\\,\\text{MJ}$$\n\nConvert to kilowatt-hours using $1\\,\\text{kWh} = 3.6\\,\\text{MJ}$:\n\n$$PE = \\frac{3.9\\,\\text{MJ}}{3.6\\,\\text{MJ/kWh}} \\approx 1.1\\,\\text{kWh}$$\n\n<span style=\"font-weight:700\">Comparison:</span> for the same setup, this small pumped-hydro stores less than the battery bank. But REAL pumped-hydro uses millions of kg of water and heights of hundreds of meters, so its stored energy can dwarf a battery. The trade-off is speed and location: batteries respond in milliseconds and go almost anywhere; pumped-hydro needs specific geography and ramps slower." },

  { id: id("ml-pe-calc"), type: "mission_log", title: "Mission Log — Run the PE = mgh Math",
    intro: "Your turn. Show each step. A fraction or an estimate beats a blank.",
    sections: [ { id: "calc", kind: "prompts", title: "Stored-energy calculations",
      prompts: [
        { id: "q1", label: "A pumped-hydro reservoir holds 8,000 kg of water 120 m above the turbines. Calculate the stored gravitational PE in joules ($PE = mgh$, $g = 9.8$ m/s²), then convert to kWh ($1$ kWh $= 3.6\\times10^6$ J). Show your work.", rows: 4 },
        { id: "q2", label: "If a small school uses 40 kW at peak, how many hours could that stored energy run the school?", rows: 2 },
        { id: "q3", label: "A grid-scale battery bank is rated at 500 kWh. How many hours could it supply 50 kW? And how many average homes (≈1 kW each in the evening) could it power for one hour?", rows: 3 },
      ] } ] },

  { id: id("storage-table"), type: "callout", icon: "📊", style: "default", title: "Typical energy-storage trade-offs",
    content: "<span style=\"font-weight:700\">Battery</span> — form: chemical · response: fast · cost: high · duration: hours.\n<span style=\"font-weight:700\">Pumped-hydro</span> — form: gravitational PE · response: slow · cost: low · duration: hours to days.\n<span style=\"font-weight:700\">Thermal</span> — form: heat · response: slow · cost: low · duration: hours to days.\n\n*These are typical characteristics, not exact specs for any one facility. Real systems vary by design, location, and age.*" },

  // ── EXPLORE part 2: where should the energy come from? ──
  { id: id("sources-intro"), type: "callout", icon: "⚡", style: "info", title: "Where should our energy come from?",
    content: "Flip a switch in Perth Amboy and the electricity might come from a nuclear reactor running full speed 24/7, a natural-gas plant that fires up when demand spikes, or a solar panel that only works while the sun shines. Every option has a cost. Every option has an impact. None is perfect.\n\nThe main sources on the table: <span style=\"font-weight:700\">natural gas, nuclear, solar, wind, hydro</span>. New Jersey leans hard on just two. In <span style=\"font-weight:700\">2024</span>, NJ's electricity was roughly <span style=\"font-weight:700\">49.6% natural gas</span> and <span style=\"font-weight:700\">45% nuclear</span> — together over 90%. Solar added ~2.9%, biomass ~1.1%. Gas + nuclear have supplied over nine-tenths of NJ's power every year since 2011, and both are thermal plants. So here's the question worth chewing on: should that change?" },

  { id: id("src-njmix"), type: "external_link",
    url: "https://www.eia.gov/electricity/state/newjersey/",
    title: "New Jersey's Real Energy Mix (U.S. EIA)",
    description: "Official state electricity profile — the source for NJ's 2024 generation mix.",
    buttonLabel: "Open NJ energy data", icon: "🔗", openInNewTab: true },

  { id: id("sources-table"), type: "callout", icon: "⚖️", style: "default", title: "Typical energy-source trade-offs",
    content: "<span style=\"font-weight:700\">Natural gas</span> — cost: moderate · emissions: emits CO₂ · reliability: high, dispatchable on demand · land: moderate.\n<span style=\"font-weight:700\">Nuclear</span> — cost: high upfront · emissions: very low direct carbon · reliability: high, runs around the clock · land: low.\n<span style=\"font-weight:700\">Solar</span> — cost: falling · emissions: very low direct carbon · reliability: intermittent (only when sunny) · land: high.\n<span style=\"font-weight:700\">Wind</span> — cost: falling · emissions: very low direct carbon · reliability: intermittent (only when windy) · land: moderate to high.\n\nNotice: there is <span style=\"font-weight:700\">no perfect source.</span> Anything cheap or clean gives something up somewhere — emissions, reliability, cost, or land. Engineers don't hunt for a flawless answer that doesn't exist; they weigh trade-offs against criteria and pick the best fit for a place. The hard part isn't the physics — it's deciding which criteria matter most.\n\n*Typical trade-offs, not exact figures for any single facility.*" },

  { id: id("worked-source"), type: "callout", icon: "🧮", style: "info", title: "Worked example — a 1,000 kWh month",
    content: "Suppose a Perth Amboy household uses $1{,}000\\,\\text{kWh}$ in one month. Compare two supplies.\n\n<span style=\"font-weight:700\">Source A — natural gas:</span> ~$0.9\\,\\text{lb CO}_2/\\text{kWh}$ (EIA emissions factor); about 5 cents/kWh illustrative wholesale cost.\n<span style=\"font-weight:700\">Source B — utility-scale solar:</span> near-zero direct CO₂ while operating; about 3 cents/kWh illustrative cost.\n\n<span style=\"font-weight:700\">Monthly emissions:</span> $1{,}000\\,\\text{kWh} \\times 0.9\\,\\text{lb/kWh} = 900\\,\\text{lb CO}_2$ for gas; about $0$ for solar.\n<span style=\"font-weight:700\">Monthly cost (illustrative):</span> gas ≈ 50 dollars (1,000 kWh × 5 cents); solar ≈ 30 dollars (1,000 kWh × 3 cents).\n\n<span style=\"font-weight:700\">Trade-off:</span> solar wins on direct emissions and this simplified cost — but it only produces when the sun shines, so a solar-heavy grid needs storage or backup. Gas runs anytime but emits CO₂ and its fuel can be cut off by pipeline problems." },

  { id: id("ml-source-compare"), type: "mission_log", title: "Mission Log — Compare the Sources",
    intro: "One row per source you're considering. Rank or weigh — there's no single right answer, but you have to defend it.",
    sections: [ { id: "compare", kind: "table", title: "Source comparison for Perth Amboy",
      columns: [
        { key: "source", label: "Source", placeholder: "gas / nuclear / solar / wind" },
        { key: "cost", label: "Cost", placeholder: "moderate / high / falling…" },
        { key: "emit", label: "Emissions", placeholder: "CO₂ / very low" },
        { key: "rely", label: "Reliability / when available", placeholder: "24-7 / intermittent" },
      ], minRows: 3, addRowLabel: "Add a source" } ] },

  { id: id("draw-plan"), type: "sketch", title: "Draw Your Stocked Supply",
    instructions: "Redraw your plan now that you've done the math and compared the sources. Show your source mix feeding the grid, your storage box(es) labeled with the energy form, and an arrow showing how the storage covers the quiet-sun, low-wind week. Neat doesn't matter — show your current thinking.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop building. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we picked some boxes\" into an engineering argument." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What did the storage + sources tell us?",
      prompts: [
        { id: "q1", label: "A city gets most of its electricity from solar. When is storage most needed to keep the lights on — and why?", rows: 2 },
        { id: "q2", label: "A classmate says: \"If we just build enough batteries, we can run the whole grid on solar and wind and never worry about cloudy or calm days.\" Is that right? Use battery cost, storage duration, response speed, and how long cloudy/calm spells last.", rows: 4 },
        { id: "q3", label: "Why might a city still use some natural gas even if solar has lower direct emissions AND lower illustrative cost?", rows: 2 },
        { id: "q4", label: "In one or two sentences: why can't we simply replace every power plant with batteries and solar panels? Name at least one battery limitation that makes other sources or storage types necessary.", rows: 3 },
        { id: "q5", label: "Tonight, ask an adult at home: \"For the electricity that powers our home, what matters most to you — cost, reliability, clean air, or something else?\" Write what they said and why it mattered to them.", rows: 3 },
      ] } ] },

  { id: id("cer-claim"), type: "callout", icon: "🏗️", style: "tip", title: "Build the argument — Perth Amboy's energy mix (CER)",
    content: "Time for the real call. What energy mix should Perth Amboy aim for over the next 20 years?\n\n<span style=\"font-weight:700\">CLAIM</span> — the mix you'd choose (mostly gas + nuclear? mostly solar + wind + storage? a balanced combination?).\n<span style=\"font-weight:700\">EVIDENCE</span> — cite specific trade-offs from the table (cost, emissions, reliability, land) AND facts about NJ's current mix or Sandy.\n<span style=\"font-weight:700\">REASONING</span> — explain why the criteria that matter most for Perth Amboy lead you to that mix, and name one weakness your mix still has.\n\nThere's no single right answer. There IS a difference between a defended choice and a guess." },

  { id: id("cer-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Your CER for Perth Amboy's energy mix.</span> Write your CLAIM (the mix), your EVIDENCE (specific trade-offs + NJ/Sandy facts), and your REASONING (why those criteria win here, plus one weakness your mix still has)." },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — add storage + sources",
    intro: "Same model we've grown all unit. Today we tweak it: add a <span style=\"font-weight:700\">storage</span> box (label the energy form), and show where the grid's energy <span style=\"font-weight:700\">comes from</span> (your source mix). Show how storage covers the quiet-sun, low-wind gap. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about storing energy or choosing sources. These drive where the unit heads next.",
    starters: [
      "If batteries are so fast, why don't we ___?",
      "How much storage would Perth Amboy actually need to ___?",
      "Why does New Jersey rely so heavily on ___?",
      "What happens to the energy mix if ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the capstone. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the stored energy ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"intermittency,\" \"pumped-hydro,\" \"capacity,\" \"discharge,\" \"dispatchable,\" \"baseload,\" \"renewable,\" \"emissions\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "It's a cloudy, windless week in Perth Amboy. The solar farm is barely producing and the wind turbines are still. The lights are staying on anyway — because somebody planned ahead with storage and a smart source mix. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain how Perth Amboy keeps the lights on through a quiet-sun, low-wind week. Name at least one storage method (and the energy form it uses) and at least one source that can run no matter the weather. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A pumped-hydro facility stores energy by pumping water uphill. What form of energy is being stored?",
    options: [
      "Gravitational potential energy, because the water is raised against gravity.",
      "Thermal energy, because friction between the water and the pipes warms them up a lot.",
      "Chemical energy, because the water molecules are rearranged by the pump.",
      "Kinetic energy, because the water moves quickly while it is being pumped.",
    ], correctIndex: 0,
    explanation: "Lifting water increases the gravitational potential energy of the water-Earth system. That energy is recovered later when the water falls and turns a turbine. $PE = mgh$." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A battery stores energy in which form, and releases it in which form?",
    options: [
      "Stores thermal energy; releases it later as that same thermal energy.",
      "Stores chemical energy; releases it on demand as electrical energy.",
      "Stores gravitational PE; releases it as electrical energy when needed.",
      "Stores electrical energy directly; releases that electrical energy back.",
    ], correctIndex: 1,
    explanation: "A battery stores energy as chemical energy in the bonds inside its cells. When the grid needs power, the chemicals react and release electrical energy." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A city gets most of its electricity from solar panels. When is storage most needed to keep the lights on?",
    options: [
      "In the middle of the day, when the sun is brightest and panels make the most power.",
      "Never — solar panels can make power at night by using stored moonlight to glow.",
      "In the evening, after the sun sets but people still use lights, cooking, and AC.",
      "In the early morning hours, before sunrise, when the panels are still warming up.",
    ], correctIndex: 2,
    explanation: "Solar output drops at sunset, but evening demand stays high. Storage filled during the day can discharge in the evening to cover the gap — the \"duck curve.\"" },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "If two systems store the same amount of energy, why might an engineer still choose the battery bank over pumped-hydro?",
    options: [
      "Batteries usually cost much less per stored kilowatt-hour than pumped-hydro.",
      "Batteries can store their energy for many weeks without losing any of it.",
      "Batteries use water and gravity, so they work anywhere a hill is available.",
      "Batteries respond fast and don't need specific geography like hills or water.",
    ], correctIndex: 3,
    explanation: "Batteries can be placed almost anywhere and respond in milliseconds, which is useful for sudden demand spikes — even though they often cost more per stored kWh than pumped-hydro." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Which energy source has very low direct carbon emissions but is only available when the wind is blowing?",
    options: [
      "Wind, because turbines generate only when weather conditions provide enough wind.",
      "Nuclear, because reactors run continuously with very low carbon emissions.",
      "Solar, because panels only make power during the daylight hours.",
      "Natural gas, because plants can be turned on whenever demand is high and the pipeline supply holds.",
    ], correctIndex: 0,
    explanation: "Wind power has very low direct operating emissions, but turbines only generate when the wind blows, so their availability depends on the weather." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Which two sources supplied more than 90% of New Jersey's electricity in 2024?",
    options: [
      "Coal-fired plants and onshore wind turbines along the shore.",
      "Natural gas and nuclear.",
      "Utility-scale solar farms and hydroelectric dams on the rivers.",
      "Oil-fired peaker plants and wood-burning biomass facilities.",
    ], correctIndex: 1,
    explanation: "Per U.S. EIA data for New Jersey, natural gas provided about 49.6% and nuclear about 45% of the state's electricity in 2024 — together more than 90%." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "When energy is stored in a battery, pumped-hydro reservoir, or thermal tank, what is true about the energy?",
    options: [
      "Some of the energy is created by the storage device while it sits waiting.",
      "The energy is destroyed while stored, then re-created when it is needed.",
      "The energy is transferred and transformed into another form, never created.",
      "The energy permanently disappears the moment the system finishes charging up.",
    ], correctIndex: 2,
    explanation: "Storage doesn't create or destroy energy — it transfers and transforms it into a convenient form (chemical, gravitational PE, or heat) and holds it until the grid needs it back." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Engineers describe natural-gas plants as \"dispatchable.\" What does that mean?",
    options: [
      "They produce electricity only while the sun is shining on their panels.",
      "They release zero carbon dioxide when they generate electricity.",
      "They store leftover electricity inside the fuel pipes for later use.",
      "They can be turned on or ramped up quickly to meet rising demand.",
    ], correctIndex: 3,
    explanation: "Dispatchable means a source can be turned on or increased quickly to meet demand. Natural-gas plants are dispatchable, which is why grids use them to cover spikes that intermittent solar and wind can't." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch Perth Amboy's grid surviving the quiet-sun, low-wind week: show one source that runs no matter the weather feeding the grid, plus one storage box (label its energy form) discharging to cover the gap. Add a short arrow showing energy flowing from storage to homes. Neat doesn't matter — show your current thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("src-nrel"), type: "external_link",
    url: "https://www.nrel.gov/energy-storage/",
    title: "Energy Storage Basics — National Renewable Energy Laboratory",
    description: "NREL overview of grid-scale storage technologies and how they support the grid.",
    buttonLabel: "Open NREL storage basics", icon: "🔗", openInNewTab: true },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about storage OR sources that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you stocked the supply — banked energy in three different forms, ran the $PE = mgh$ math, and made a real call about where Perth Amboy's power should come from. There's no perfect source; there's only the best fit for your community. Next class we put it all together and redesign the whole grid to be Sandy-proof. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Store & Source",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1107,
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
