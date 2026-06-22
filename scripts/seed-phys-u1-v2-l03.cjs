// seed-phys-u1-v2-l03.cjs
// U1 v2 PILOT — Arc 3: "Control the Flow" (OpenSciEd-spine / Rober-engine).
// Merges v1 L04 (Electrons on the Move) + L05 (Voltage, Current & Power) into one
// challenge-arc: "Control the Flow." What physically MOVES (charge/current); AC vs DC;
// voltage vs current vs power; P = IV and E = Pt; why the grid transmits at very high
// voltage (low current → far less I^2R heat loss). Through-line: make buildings brighter
// or dimmer on purpose, then push power "across town" without losing it.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as Arcs 1–2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source/arc3.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.
//
// No scored embed: arc3.md shows only an OPTIONAL PhET external link (not a scored embed),
// so per the brief we surface the math via worked-example callouts instead.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l03-whats-moving";

let _n = 0;
const id = (slug) => `v2l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⚡", title: "What's Actually Moving?",
    subtitle: "Unit 1 · Arc 3 — Energy & the Grid" },

  // ── CONNECT: recall Arc 2 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you chased the energy all the way down the chain and proved nothing ever vanishes. But we kept hand-waving about the wires — \"the energy races through them.\" <span style=\"font-weight:700\">What is physically moving inside that wire?</span> And how do engineers make some buildings bright and others dim — on purpose? That's the job today. Yes, fun is still mandatory." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Flip on a desk lamp. The bulb lights up <span style=\"font-weight:700\">instantly</span> — but the electrons inside the wall did NOT just sprint all the way from the power plant to your room in that split second. The wire was already <span style=\"font-weight:700\">full</span> of electrons. The outlet just gave the ones nearby a push, and that push traveled down the wire like a wave.\n\nSo what's moving is charge that was already there. Today we name it, measure it, and learn the two equations that let you control exactly how much power reaches a building." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 2 — quantity over polish. Then we go find out what's moving.",
    sections: [ { id: "recall", kind: "prompts", title: "From energy to the wires",
      prompts: [
        { id: "q1", label: "Last arc, the electrical energy \"raced through the transmission lines.\" In your own words, what do you think is actually moving in there?", rows: 2 },
        { id: "q2", label: "A lamp turns on the *instant* you flip the switch. If the moving stuff is slow, how can the light be instant? Take a guess.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Control the Flow",
    content: "You're now the grid operator for your model neighborhood. Your job: <span style=\"font-weight:700\">make specific buildings brighter or dimmer on purpose</span>, then send power \"across town\" without bleeding it all away as heat in the wires. To do that you have to control three different things people constantly mix up — <span style=\"font-weight:700\">voltage</span>, <span style=\"font-weight:700\">current</span>, and <span style=\"font-weight:700\">power</span> — and use the two equations that tie them together.\n\nThere are levels. They get harder. Same rule as always — write what you observe before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔌", style: "info", title: "What's moving, and the three words that get mixed up",
    content: "In a metal wire the atoms are locked in place, but some electrons are <span style=\"font-weight:700\">free to drift</span>. Hook the wire to a power source and they all drift the same general way — that drift is <span style=\"font-weight:700\">electric current</span>. The drift itself is slow (about <span style=\"font-weight:700\">1 mm/s</span>, like a crawling ant), but the *signal* telling them to move travels near the speed of light — that's why the lamp seems instant.\n\nThree words to keep straight:\n• <span style=\"font-weight:700\">Voltage</span> — the electrical \"push\" that drives charge, in volts (V).\n• <span style=\"font-weight:700\">Current</span> — how fast charge flows past a point, in amps (A).\n• <span style=\"font-weight:700\">Power</span> — how fast energy is delivered, in watts (W).\n\nClue for later: two of those are *rates* (current and power). That's exactly why the grid can play a trick with them." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — what's in the wire (before the reveal)",
    instructions: "Draw a slice of copper wire connecting a battery to a bulb. Show what you think is moving, which way it goes, and roughly how fast. Then label where you think the \"push\" comes from. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-control-the-flow",
    title: "Class Challenge Board — Control the Flow",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's controlling what.",
    levels: [
      { n: 1, name: "Name What's Moving", nameEs: "Nombra Lo Que Se Mueve" },
      { n: 2, name: "AC or DC?", nameEs: "¿CA o CC?" },
      { n: 3, name: "Find the Power (P = IV)", nameEs: "Halla la Potencia (P = IV)" },
      { n: 4, name: "Energy Over Time (E = Pt)", nameEs: "Energía en el Tiempo (E = Pt)" },
      { n: 5, name: "Push It Across Town", nameEs: "Envíala por la Ciudad" },
    ] },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Flow Control Log",
    intro: "As you work the levels: <span style=\"font-weight:700\">write what you observe before you decide what's happening.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "flowlog", kind: "table", title: "Controlling the flow",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "device", label: "Device / line", placeholder: "lamp, battery, transmission line…" },
        { key: "viw", label: "V, I, or P here", placeholder: "120 V / 0.5 A / 60 W" },
        { key: "acdc", label: "AC or DC? Why", placeholder: "DC — battery, one direction" },
      ], minRows: 3, addRowLabel: "Add a row" } ] },

  { id: id("draw-grid"), type: "sketch", title: "Draw Your Flow Plan",
    instructions: "Redraw your neighborhood line now. Show the power source, the long transmission line, and at least two buildings. Mark where voltage is HIGH and where it's stepped DOWN, and use arrow thickness to show where current is large vs. small. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-budget"), type: "mission_log", title: "Mission Log — Power Budget",
    intro: "Pick two devices in your plan. For each, record voltage, current, and the power you get from $P = IV$. One row per device.",
    sections: [ { id: "budget", kind: "table", title: "Power for each device",
      columns: [
        { key: "device", label: "Device", placeholder: "phone charger, lamp…" },
        { key: "volts", label: "Voltage (V)", placeholder: "5 V / 120 V" },
        { key: "amps", label: "Current (A)", placeholder: "2 A / 0.5 A" },
        { key: "watts", label: "Power = V × I (W)", placeholder: "10 W / 60 W" },
      ], minRows: 2, addRowLabel: "Add a device" } ] },

  // ── worked examples (no scored embed for this arc) ──
  { id: id("worked-q"), type: "callout", icon: "🧮", style: "info", title: "Worked example — how much charge actually flows?",
    content: "A small LED lamp draws a steady current of <span style=\"font-weight:700\">0.50 A</span>. How much charge passes through it in <span style=\"font-weight:700\">30 s</span>?\n\nStep 1 — the current equation: $I = \\dfrac{q}{t}$.\n\nStep 2 — rearrange for charge: $q = I \\cdot t = 0.50\\,\\text{A} \\cdot 30\\,\\text{s} = 15\\,\\text{C}$.\n\nStep 3 — that's a *pile* of electrons. One coulomb is about $6.2 \\times 10^{18}$ electrons, so $15\\,\\text{C} \\approx 9.3 \\times 10^{19}$ electrons — about 93 quintillion — drifting through in half a minute. They were already in the wire; the source just kept them moving." },

  { id: id("worked-piv"), type: "callout", icon: "🧮", style: "info", title: "Worked example — P = IV and E = Pt",
    content: "<span style=\"font-weight:700\">Power</span> is how fast energy is delivered, and there are two ways to write it:\n\n$$P = IV \\qquad P = \\dfrac{E}{t} \\;\\Longrightarrow\\; E = P \\cdot t$$\n\nThe first says power = current × voltage. The second says power is energy per unit time — so the energy used is just power × time.\n\nExample: a desk lamp runs on <span style=\"font-weight:700\">120 V</span> and draws <span style=\"font-weight:700\">0.50 A</span>.\nPower: $P = IV = 120\\,\\text{V} \\cdot 0.50\\,\\text{A} = 60\\,\\text{W}$.\nLeave it on for <span style=\"font-weight:700\">8.0 h</span>: $E = P \\cdot t = 60\\,\\text{W} \\cdot 8.0\\,\\text{h} = 480\\,\\text{Wh} = 0.48\\,\\text{kWh}$.\n\nThat $1\\,\\text{W} = 1\\,\\text{J/s}$ — a 100 W bulb moves 100 J of energy every second." },

  { id: id("worked-hv"), type: "callout", icon: "🗼", style: "tip", title: "Worked example — why the grid uses very high voltage",
    content: "Because $P = IV$, the <span style=\"font-weight:700\">same power</span> can travel as high-voltage/low-current OR low-voltage/high-current. The grid picks high voltage on purpose. Heat lost in the wires is $P_\\text{loss} = I^2 R$ — it grows with the <span style=\"font-weight:700\">square</span> of the current.\n\nSend $1{,}200{,}000\\,\\text{W}$ down a line with resistance $R = 0.10\\,\\Omega$:\n• At $1{,}200\\,\\text{V}$: $I = \\dfrac{P}{V} = 1{,}000\\,\\text{A}$, so $P_\\text{loss} = (1000)^2 \\cdot 0.10 = 100{,}000\\,\\text{W}$ wasted.\n• At $120{,}000\\,\\text{V}$: $I = 10\\,\\text{A}$, so $P_\\text{loss} = (10)^2 \\cdot 0.10 = 10\\,\\text{W}$ wasted.\n\nRaise the voltage 100×, the current drops 100×, and the heat loss drops $100^2 = 10{,}000$×. That's why transmission towers run at enormous voltages and a transformer steps it back down before it reaches your house. <span style=\"font-weight:700\">These numbers are illustrative</span> — real lines run tens to hundreds of thousands of volts (see EIA below)." },

  { id: id("eia-link"), type: "external_link",
    url: "https://www.eia.gov/energyexplained/electricity/delivery-to-consumers.php",
    title: "EIA — How Electricity Is Delivered to Consumers",
    description: "U.S. Energy Information Administration: how power moves from plant to home, and why high-voltage transmission is used.",
    buttonLabel: "Open EIA source", icon: "🔗", openInNewTab: true },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running levels. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we plugged numbers in\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What is actually moving, and how do we control it?",
      prompts: [
        { id: "q1", label: "A student says \"electrons travel all the way from the power plant, through the cord, into my laptop.\" Fix that statement so it's correct.", rows: 3 },
        { id: "q2", label: "Explain the difference between *direct current (DC)* and *alternating current (AC)*. Give one device that uses each.", rows: 2 },
        { id: "q3", label: "Use $P = IV$: a phone charger runs on 5 V and 2 A; a desk lamp runs on 120 V and 0.5 A. Which uses more power? Show the numbers.", rows: 2 },
        { id: "q4", label: "The grid sends power across the state at hundreds of thousands of volts, then steps it down for your house. Using $P = IV$ and $P_\\text{loss} = I^2R$, explain why high voltage means less wasted energy.", rows: 3 },
        { id: "q5", label: "In a working circuit, are electrons created, destroyed, or neither? Make a claim and back it with what you know about charge and conservation.", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — add the flow",
    intro: "Same model we've been building since Arc 1. Today we tweak it: show <span style=\"font-weight:700\">charge drifting</span> through the wires (not springing from the plant), label where the voltage is high vs. stepped down, and mark where current is large (thick arrow) vs. small (thin arrow). Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about what's moving or how power is controlled. These drive where the unit heads next.",
    starters: [
      "If the wire is already full of electrons, why does ___?",
      "How do they change the voltage from ___ to ___?",
      "What decides how much current a device draws when ___?",
      "Why does the grid use AC instead of ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the current ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"current,\" \"charge,\" \"coulomb,\" \"voltage,\" \"power,\" \"watt,\" \"AC,\" \"DC,\" \"transformer,\" \"transmission\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A power plant sends electricity to a distant town. It leaves on a transmission tower at very high voltage and low current, then a substation steps it down before it reaches the houses. One of those houses flips on a hair dryer that draws a big current from the wall. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what is physically moving in the transmission line, why the plant sends it at high voltage and low current, and what changes at the substation before it reaches the house. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A student says, \"When I plug in my laptop, electrons from the power plant travel through the cord and into my laptop.\" What is the best response?",
    options: [
      "Correct — the electrons really do travel all the way from the generating station into your device.",
      "Partly correct — the wire already holds free electrons, and the source just pushes them to drift.",
      "Incorrect — electrons don't move at all in wires; only energy travels from the source to the device.",
      "Incorrect — protons are the charged particles that actually move through a metal wire.",
    ], correctIndex: 1,
    explanation: "The copper wire already contains free electrons. The power source pushes them to drift; it does not pump electrons in from the plant. Protons are locked in atomic nuclei and don't move through metal." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Which statement correctly compares alternating current (AC) and direct current (DC)?",
    options: [
      "DC flows one steady way; AC reverses, so transformers can step its voltage up and down.",
      "AC flows one steady way like a battery, while DC reverses direction many times each second.",
      "Both AC and DC flow one steady way, but AC is used in outlets because it carries higher voltage.",
      "DC reverses direction periodically, so it cannot ever be changed by a transformer at all.",
    ], correctIndex: 0,
    explanation: "DC (battery-style) flows steadily in one direction. AC periodically reverses; transformers need changing current, so the grid uses AC to step voltage up and down." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In the United States, the current in a wall outlet reverses direction about 60 times each second. This is called —",
    options: [
      "static electricity, which is the steady buildup of charge on a surface.",
      "direct current (DC), a charge flow that holds one steady direction.",
      "electron drift, the slow one-way creep of charge through the metal.",
      "alternating current (AC), reversing 60 times per second.",
    ], correctIndex: 3,
    explanation: "AC periodically reverses direction. The 60 Hz U.S. grid frequency means the current switches direction 60 times per second." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Current ($I$) is measured in amps. What does current actually measure?",
    options: [
      "The electrical \"push,\" measured as the potential difference across the wire.",
      "How much charge flows past a point each second as the electrons drift.",
      "The total energy stored inside the battery before it is connected.",
      "How fast the energy is delivered to a device per unit of time.",
    ], correctIndex: 1,
    explanation: "Current is the rate of charge flow past a point: $I = q/t$, measured in amperes. The push is voltage; the rate of energy delivery is power." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "A phone charger runs on $5\\,\\text{V}$ and draws $2\\,\\text{A}$. A desk lamp runs on $120\\,\\text{V}$ and draws $0.5\\,\\text{A}$. Using $P = IV$, which uses more power?",
    options: [
      "The desk lamp, since at $60\\,\\text{W}$ it beats the charger's $10\\,\\text{W}$.",
      "The phone charger, because it pulls the larger current of the two devices.",
      "They use the same power, since one has high voltage and one has high current.",
      "You cannot tell which uses more until you know how long each one runs.",
    ], correctIndex: 0,
    explanation: "$P = IV$. Charger: $5 \\cdot 2 = 10\\,\\text{W}$. Lamp: $120 \\cdot 0.5 = 60\\,\\text{W}$. The lamp uses more — voltage and current together set the power." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "One watt is equal to —",
    options: [
      "one volt per second.",
      "one amp per volt.",
      "one joule per second.",
      "one joule per coulomb.",
    ], correctIndex: 2,
    explanation: "Power is the rate of energy transfer, $P = E/t$, so one watt is one joule of energy delivered each second ($1\\,\\text{W} = 1\\,\\text{J/s}$). A joule per coulomb is a volt; the others aren't standard units." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Transmission lines run at very high voltage mainly in order to —",
    options: [
      "make the electricity reach distant homes much faster than it otherwise would.",
      "reduce the current so less energy is lost as heat.",
      "increase the total amount of energy that gets delivered to the customers.",
      "stop the transmission wires from carrying any electric current at all.",
    ], correctIndex: 1,
    explanation: "For a fixed power, $P = IV$ means higher voltage lets the current be smaller. Since heat loss grows with the square of current ($I^2R$), a smaller current wastes far less energy as heat." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A power line carries a fixed amount of power. The operator raises the voltage by a factor of 10, which drops the current by a factor of 10. The energy lost as heat in the wire ($P_\\text{loss} = I^2R$) changes by what factor?",
    options: [
      "It drops to one-tenth, matching the drop in the current exactly.",
      "It stays the same, because the total power being carried is unchanged.",
      "It rises by 10, because higher voltage forces more heating in the wire.",
      "It drops to one-hundredth, because loss depends on current squared.",
    ], correctIndex: 3,
    explanation: "$P_\\text{loss} = I^2R$ depends on the square of the current. Drop the current 10×, and the loss drops $10^2 = 100$× — to one-hundredth. That square is exactly why the grid uses high voltage." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a power plant, a long transmission line, a step-down transformer, and a house. Use a THIN arrow for current where the voltage is high, and a THICKER arrow where the voltage has been stepped down. Add a small \"heat\" arrow leaking off the line. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about what's *moving* (or how power is controlled) that surprised you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you found out what's really in the wire (charge that was already there), told AC from DC, and learned the two equations — $P = IV$ and $E = Pt$ — that let you dial power up or down on purpose. You even cracked the grid's big trick: high voltage, low current, way less wasted heat. Next class we make our OWN electricity. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "What's Actually Moving?",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1103,
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
