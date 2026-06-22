// seed-phys-u1-v2-l02.cjs
// U1 v2 PILOT — Arc 2: "Follow the Energy" (OpenSciEd-spine / Rober-engine).
// Merges v1 L02 (Following the Energy) + L03 (Energy Doesn't Disappear) into one
// challenge-arc: "Account for the Energy." Energy = the ability to cause change;
// energy is transferred & transformed; CONSERVATION (never created/destroyed);
// "lost" energy = low-grade heat dumped to the surroundings. Through-line: power a
// chain, find where it ALL goes — nothing vanishes, some always escapes as heat.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as Arc 1. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source/arc2.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l02-follow-the-energy";
// Status Check scenario is described in text (no new image asset for this arc); a generated
// diagram can be added in a later image pass. The energy-flow-tracer embed URL is from arc2.md.
const TRACER = "https://paps-tools.web.app/energy-flow-tracer.html";

let _n = 0;
const id = (slug) => `v2l2-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🔋", title: "Follow the Energy",
    subtitle: "Unit 1 · Arc 2 — Energy & the Grid" },

  // ── CONNECT: recall L1 → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, the lights went out — and you kept saying the \"stuff\" got <span style=\"font-weight:700\">shared</span> or <span style=\"font-weight:700\">used up</span>. Today we chase that stuff down and answer the real question: when it gets \"used up,\" where does it actually <span style=\"font-weight:700\">go</span>? Spoiler — it never disappears. Fun is still allowed in this room." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Take out your phone. Battery at 20%? You know it'll shut off eventually. When it does — where did the energy go?\n\nIt didn't vanish. It got <span style=\"font-weight:700\">transformed</span> into light, sound, motion… and heat. Even the heat is still energy; it just spread into the air where it's too spread out to use. That's the thread we pull on all arc: the \"stuff\" you've been tracking is <span style=\"font-weight:700\">energy</span> — the ability to cause change — and it gets handed from form to form without ever being created or destroyed." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 1 — quantity over polish. Then we go find the energy.",
    sections: [ { id: "recall", kind: "prompts", title: "Where did the \"stuff\" go?",
      prompts: [
        { id: "q1", label: "In your build last arc, name ONE place the \"stuff\" went that you couldn't fully explain.", rows: 2 },
        { id: "q2", label: "When a building got *dim* instead of bright — where do you think the missing brightness went?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Account for the Energy",
    content: "Pick any chain — phone, lamp, the whole power plant → your outlet — and <span style=\"font-weight:700\">account for every bit of energy</span> in it. Name the form at each step. Find where the useful part went AND find the part that leaked away as heat. Your job isn't done until the energy budget <span style=\"font-weight:700\">balances</span>: what went in = useful out + heat to the surroundings.\n\nThere are levels. They get harder. The rule from last arc still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔌", style: "info", title: "The path you're tracing",
    content: "At a power plant, a fuel's <span style=\"font-weight:700\">chemical</span> energy is released as <span style=\"font-weight:700\">thermal</span> energy when it burns. That heat boils water to steam, which spins a turbine — now it's <span style=\"font-weight:700\">mechanical</span>. The turbine drives a generator that makes <span style=\"font-weight:700\">electrical</span> energy. That races through transmission lines, steps down at substations, and reaches your wall.\n\nIn New Jersey, almost all of our electricity comes from <span style=\"font-weight:700\">natural gas and nuclear</span> plants — both are *thermal* plants (make heat, boil water, spin turbines). Clue for later: during Sandy the plants were mostly fine. Something else in this path broke." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your energy path (before the build)",
    instructions: "Pick ONE device (lamp, phone, projector…). Sketch the path the energy takes from the original fuel to the useful output. Label each form you think it passes through. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-account-for-the-energy",
    title: "Class Challenge Board — Account for the Energy",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's accounting for what.",
    levels: [
      { n: 1, name: "Trace One Transfer", nameEs: "Rastrea Una Transferencia" },
      { n: 2, name: "Name the Forms", nameEs: "Nombra las Formas" },
      { n: 3, name: "Find the Lost Heat", nameEs: "Encuentra el Calor Perdido" },
      { n: 4, name: "Balance the Budget", nameEs: "Equilibra el Presupuesto" },
      { n: 5, name: "Account for the Whole Chain", nameEs: "Contabiliza Toda la Cadena" },
    ] },

  { id: id("embed-tracer"), type: "embed", url: TRACER, scored: true, weight: 5 },

  { id: id("ml-buildfail"), type: "mission_log", title: "Mission Log — Energy Trace Log",
    intro: "As you work the tracer and the levels: <span style=\"font-weight:700\">before you decide a step \"loses\" energy, write what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracing the chain",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "step", label: "Step / device", placeholder: "boiler, turbine, bulb…" },
        { key: "form", label: "Energy FORM here", placeholder: "chemical / thermal / …" },
        { key: "tx", label: "Transfer or Transform?", placeholder: "and where the heat leaks" },
      ], minRows: 3, addRowLabel: "Add a step" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw Your Energy Path",
    instructions: "Redraw your chain now that you've traced it. Show each form as a labeled box, an arrow for each transfer/transform, and a little arrow OFF the path everywhere heat leaks to the surroundings. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — Energy Accounting",
    intro: "Account for the energy in your chosen chain. One row per form — say where it is and roughly how much (a fraction is fine if you don't have numbers).",
    sections: [ { id: "account", kind: "table", title: "Energy budget",
      columns: [
        { key: "form", label: "Energy form", placeholder: "thermal, radiant…" },
        { key: "where", label: "Where it ended up", placeholder: "useful output / surroundings" },
        { key: "amount", label: "How much (J, Wh, or a fraction)", placeholder: "≈ 45% / 650 J / most of it" },
      ], minRows: 3, addRowLabel: "Add a form" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop tracing. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we followed some arrows\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the energy?",
      prompts: [
        { id: "q1", label: "Explain the difference between an energy *transfer* and an energy *transformation*. Give one example of each from your chain.", rows: 3 },
        { id: "q2", label: "At every step, some energy escaped as low-grade heat. Name two specific places in the power-plant path where that happens.", rows: 2 },
        { id: "q3", label: "A power plant releases 1000 J of chemical energy, but only 350 J reach homes as electricity. Where did the other 650 J go? Defend it with conservation of energy.", rows: 3 },
        { id: "q4", label: "Why is \"used up\" the wrong way to describe what happens to the energy in a phone? What actually happens to it?", rows: 2 },
        { id: "q5", label: "**Predict:** a combined-cycle gas plant is ~45% efficient. If you fed it twice as much fuel, what happens to the useful electricity AND to the waste heat? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — where did the battery energy go?",
    content: "A phone battery stores <span style=\"font-weight:700\">10 Wh</span>. The phone uses <span style=\"font-weight:700\">2.0 W</span> while a student watches videos for <span style=\"font-weight:700\">4.0 h</span>.\n\nStep 1 — useful energy used: $E = P \\cdot t = 2.0\\,\\text{W} \\cdot 4.0\\,\\text{h} = 8.0\\,\\text{Wh}$.\n\nStep 2 — account for the rest: $10\\,\\text{Wh} - 8.0\\,\\text{Wh} = 2.0\\,\\text{Wh}$.\n\nStep 3 — where'd it go? That 2.0 Wh became thermal energy — the phone warmed up and dumped it to the air and your hand. The budget balances:\n\n$$10\\,\\text{Wh (battery)} = 8.0\\,\\text{Wh (useful)} + 2.0\\,\\text{Wh (heat to surroundings)}$$\n\nNothing created, nothing destroyed. Engineers measure how good a system is with $\\text{efficiency} = \\dfrac{E_\\text{useful}}{E_\\text{input}}$." },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Tweak Our Class Model — add the energy",
    intro: "Same model we started in Arc 1. Today we tweak it: relabel the \"stuff\" as <span style=\"font-weight:700\">energy</span>, show it changing form along the path, and add where it leaks away as heat. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l2",
    title: "Class Question Board",
    intro: "Post at least one question you still have about where the energy goes. These drive where the unit heads next.",
    starters: [
      "If energy is never destroyed, why does it ___?",
      "How much energy is lost when ___?",
      "Where exactly does the heat go after ___?",
      "How does the real grid deal with ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the energy ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"transfer,\" \"transform,\" \"conserve,\" \"efficiency,\" \"dissipate,\" \"surroundings,\" \"thermal\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "You flip on a desk lamp powered by the grid. Somewhere far away, a natural-gas plant burned fuel; the energy traveled all the way to the bulb in front of you, and the bulb glows warm. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Trace the energy from the burning fuel to the glowing bulb. Name the forms it passes through in order, and say where some of it leaks away as heat. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "At a natural-gas power plant, what is the *first* energy transformation that happens when the fuel is burned?",
    options: [
      "Chemical energy is transformed into thermal energy as the fuel burns.",
      "Electrical energy is transformed into thermal energy at the plant.",
      "Mechanical energy is transformed into electrical energy by a coil.",
      "Radiant energy is transformed into chemical energy inside the fuel.",
    ], correctIndex: 0,
    explanation: "Burning fuel releases the chemical energy stored in its bonds as thermal energy (heat). That heat then boils water to spin a turbine (mechanical), which drives a generator (electrical). Chemical → thermal comes first." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Electricity moves from a high-voltage transmission line to a lower-voltage distribution line at a substation. What happens to the energy?",
    options: [
      "It is created at the substation when the voltage is stepped down.",
      "It is transferred to another grid part and is still electrical energy.",
      "It is destroyed by the transformer, so less of it reaches homes.",
      "It is transformed into thermal energy and then back into electrical.",
    ], correctIndex: 1,
    explanation: "A substation transfers electrical energy from transmission lines to distribution lines. The voltage changes, but the energy is still electrical — it is transferred, not transformed into another form." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In a power plant, hot steam spins a turbine. What form of energy does the spinning turbine have?",
    options: [
      "Thermal energy, because the steam that hits the turbine is hot.",
      "Electrical energy, because the turbine is wired to a generator.",
      "Mechanical energy, because a moving object has mechanical energy.",
      "Chemical energy, because the metal blades react with the steam.",
    ], correctIndex: 2,
    explanation: "A spinning turbine is moving, so its energy is mechanical. The generator then converts that mechanical energy into electrical energy." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "You turn on a desk lamp and the bulb glows. What is the *last* energy transformation in the path from power plant to light?",
    options: [
      "Chemical energy in the wire becomes thermal energy in the bulb.",
      "Mechanical energy from a turbine becomes electrical energy in lines.",
      "Thermal energy from the bulb becomes chemical energy in the wire.",
      "Electrical energy is transformed into radiant energy, which is light.",
    ], correctIndex: 3,
    explanation: "Inside the bulb, electrical energy is transformed into radiant energy (light). Some also becomes thermal energy (heat), but the useful output we wanted was light." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "In physics, when we say energy is \"conserved,\" we mean it —",
    options: [
      "cannot be created or destroyed; it only changes form.",
      "is saved whenever we remember to turn off the lights.",
      "is slowly decreasing across the entire known universe.",
      "can be stored only inside batteries and chemical fuels.",
    ], correctIndex: 0,
    explanation: "Conservation of energy means the total energy in a closed system stays constant. It can be transferred or transformed, but never created or destroyed." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A power plant releases 1000 J of chemical energy by burning fuel, but only 350 J reach homes as electrical energy. How much energy was \"lost,\" and where did it go?",
    options: [
      "350 J, stored permanently inside the transmission wires.",
      "650 J, transformed into thermal energy that escapes as heat.",
      "1350 J, since the generator adds extra energy to the system.",
      "0 J, because energy is conserved so nothing is ever lost.",
    ], correctIndex: 1,
    explanation: "Conservation means every joule is accounted for. $1000\\,\\text{J} - 350\\,\\text{J} = 650\\,\\text{J}$ didn't reach homes, so it left the useful path as low-grade heat at the boiler, turbine, and lines." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A modern combined-cycle natural-gas plant converts about 45% of its fuel's chemical energy into electricity. What happens to the other 55%?",
    options: [
      "It is destroyed by the generator to protect the rest of the grid.",
      "It is stored inside the transmission towers for use later on.",
      "It leaves the plant as low-grade heat that warms the surroundings.",
      "It turns back into natural gas inside the distribution pipes.",
    ], correctIndex: 2,
    explanation: "The other 55% becomes thermal energy that escapes into the surroundings as waste heat. Energy is conserved, so it isn't destroyed — it just becomes less useful." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why is \"used up\" the wrong way to describe what happens to the energy in a phone?",
    options: [
      "The phone keeps creating brand-new energy from its chemicals as it runs.",
      "The battery quietly absorbs heat from the air to recharge its own cells.",
      "Energy disappears for good the moment the battery icon reads 0% charge.",
      "The energy changes form and spreads out, but the total stays the same.",
    ], correctIndex: 3,
    explanation: "Energy is conserved. It isn't used up or destroyed; it's transformed into other forms (light, sound, heat) and transferred to the surroundings." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a 1000 J input arrow into a power plant and show it splitting: an arrow for the useful electrical energy that reaches homes, and an arrow for the heat that leaks to the surroundings. Label rough amounts so your two arrows add back up to 1000 J. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One place the energy went that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You chased the energy down today — named every form, found the part that does the work, and found the part that always sneaks off as heat. Nothing vanished; it just spread out. Next class we keep building the grid. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Follow the Energy",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1102,
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
