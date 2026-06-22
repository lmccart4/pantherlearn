// seed-phys-u3-v2-l08.cjs
// U3 v2 — Arc 8 (CAPSTONE): "Showcase + Transfer" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L14 (Showcase + Transfer Task) into the capstone challenge-arc for
// Unit 3 "Survive the Crash." Students PRESENT + DEFEND their safer-crash design, then
// TRANSFER the momentum/impulse/force model to a brand-new collision (bike-helmet head
// impact), peer-evaluate, and revisit the DQB + initial-vs-final crash model.
//
// Through-line: "Survive the Crash." The whole unit has tracked one question — when a
// vehicle slams to a stop, what decides whether the people inside survive? Today the
// model gets tested against a collision we never studied.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U1 v2 pilot. No embed (capstone is
// argument-heavy). Content repackaged from _v1-source-u3/u3-arc8.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l08-showcase";

let _n = 0;
const id = (slug) => `v2u3l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🏁", title: "Showcase + Transfer",
    subtitle: "Unit 3 · Arc 8 — Forces & Momentum (Capstone)" },

  // ── CONNECT: recall the whole unit → today's question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "We opened this unit with a hard truth: most of the time a car \"works\" fine — until it doesn't, and then physics decides who walks away. Since then you've built a real model: <span style=\"font-weight:700\">momentum</span> ($p=mv$), conservation of momentum, elastic vs. inelastic collisions, and <span style=\"font-weight:700\">impulse</span> ($F\\Delta t=\\Delta p$). Last arc you used it to <span style=\"font-weight:700\">design a safer crash</span>. Today you do two things: defend that design like an engineer, then prove your model travels — apply it to a collision we never studied." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A real model isn't one you can only recite back for the exact thing you practiced on. It's one you can <span style=\"font-weight:700\">carry to a situation you've never seen</span> and still make sense of. That's the whole point of today. If your crumple-zone reasoning only works on cars, it was memorizing. If it works on a bike helmet, a phone case, a gym mat — it was understanding." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall before showcase — quantity over polish. Reload the model you're about to defend.",
    sections: [ { id: "recall", kind: "prompts", title: "Reload your crash model",
      prompts: [
        { id: "q1", label: "In one sentence: what does a crumple zone or airbag actually DO to the physics of a crash? (Think impulse.)", rows: 2 },
        { id: "q2", label: "The same change in momentum can produce a big force or a small force. What's the one thing you change to make the force smaller?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge (two parts) ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Showcase, then Transfer",
    content: "<span style=\"font-weight:700\">Part 1 — Showcase.</span> Present your Arc 7 safer-crash design to the class in about two minutes. Be ready to explain WHAT structure you chose, WHY (which physics idea + what trade-off you accepted), and HOW it performed (point to the exact simulator result that clears the safety threshold).\n\n<span style=\"font-weight:700\">Part 2 — Transfer.</span> Take your momentum/impulse model to a collision you've never studied — a cyclist's head hitting the pavement — and explain why a helmet works, then improve it.\n\nYour job isn't to be perfect. It's to make a <span style=\"font-weight:700\">clear argument from evidence</span>, the way an engineer defends a design." },

  { id: id("ml-defense"), type: "mission_log", title: "Mission Log — Build Your Defense",
    intro: "Before you present, get your argument straight on paper. Two minutes goes fast — say the physics, not just the story.",
    sections: [ { id: "defense", kind: "prompts", title: "Your safer-crash design defense",
      prompts: [
        { id: "what", label: "WHAT did you build? Name the structure: material, length, and how it's meant to collapse.", rows: 2 },
        { id: "why", label: "WHY that structure? Name the physics idea it uses and the trade-off you accepted (e.g., more crush room vs. cabin space).", rows: 3 },
        { id: "how", label: "HOW did it perform? Cite the exact simulator result (peak force / stopping time) that shows it clears the safety threshold.", rows: 3 },
      ] } ] },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your design at a glance (before you present)",
    instructions: "Sketch your safer-crash design so the class can see it while you talk. Show the structure, an arrow for the incoming motion, and label WHERE the stopping time gets stretched out. One clean visual beats a paragraph.",
    canvasHeight: 340 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-showcase",
    title: "Class Challenge Board — Showcase + Transfer",
    intro: "Name your team, then mark each level as you clear it. The capstone is where the whole unit's points come home.",
    levels: [
      { n: 1, name: "Defend the Design", nameEs: "Defiende el Diseño" },
      { n: 2, name: "Cite the Evidence", nameEs: "Cita la Evidencia" },
      { n: 3, name: "Transfer the Model", nameEs: "Transfiere el Modelo" },
      { n: 4, name: "Engineer the Upgrade", nameEs: "Diseña la Mejora" },
      { n: 5, name: "Survive Peer Review", nameEs: "Sobrevive la Revisión de Pares" },
    ] },

  // showcase artifact upload
  { id: id("evidence"), type: "evidence_upload", title: "Upload your showcase evidence",
    instructions: "Upload a photo of your design sketch and/or a screenshot of the simulator result that clears the safety threshold. This is the proof behind your two-minute defense." },

  // ── the transfer scenario ──
  { id: id("transfer-setup"), type: "callout", icon: "🚲", style: "info", title: "The transfer task — a collision you never studied",
    content: "Here's a different crash entirely: a cyclist's head hitting the pavement.\n\nIn a bike crash, the rider's head can go from full speed to a stop in a very short distance. Without a helmet, the skull and brain absorb that stop <span style=\"font-weight:700\">almost instantly</span>. With a helmet, a layer of foam <span style=\"font-weight:700\">crushes</span> and stretches out the stopping time. The head has the same mass and the same change in velocity either way — but the force on the brain comes out very different. Sound familiar? It should." },

  { id: id("ml-transfer-data"), type: "mission_log", title: "Mission Log — Bike Helmet Impact: What We Know",
    intro: "Fill in what the model predicts for each row, then use this as your evidence in the transfer task below.",
    sections: [ { id: "helmet", kind: "table", title: "Without helmet vs. with certified helmet",
      columns: [
        { key: "factor", label: "What happens", placeholder: "stopping time…" },
        { key: "nohelmet", label: "Without helmet", placeholder: "very short / large…" },
        { key: "helmet", label: "With certified helmet", placeholder: "longer / reduced…" },
      ], minRows: 4, addRowLabel: "Add a factor" } ] },

  { id: id("helmet-facts"), type: "callout", icon: "📋", style: "default", title: "Reference — the helmet facts (qualitative)",
    content: "<span style=\"font-weight:700\">Stopping distance:</span> without a helmet, very small — the skull stops almost instantly; with a certified helmet, larger — the foam crushes over several centimeters.\n<span style=\"font-weight:700\">Stopping time:</span> very short without; longer with.\n<span style=\"font-weight:700\">Peak force on brain:</span> large without; reduced with.\n<span style=\"font-weight:700\">Energy transformation:</span> without a helmet, kinetic energy goes into deforming the skull and brain; with a helmet, it goes into crushing the foam liner instead." },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — same momentum change, different force",
    content: "Impulse says the change in momentum equals force times time:\n\n$$F_{avg}\\,\\Delta t = \\Delta p$$\n\nSuppose a rider's head ($m = 5.0\\,\\text{kg}$) hits the ground at $6.0\\,\\text{m/s}$ and stops, so $\\Delta p = m\\,\\Delta v = 5.0 \\cdot 6.0 = 30\\,\\text{kg·m/s}$.\n\n<span style=\"font-weight:700\">No helmet</span> — stop in $\\Delta t = 0.005\\,\\text{s}$: $F_{avg} = \\dfrac{\\Delta p}{\\Delta t} = \\dfrac{30}{0.005} = 6000\\,\\text{N}$.\n\n<span style=\"font-weight:700\">With helmet</span> — foam stretches the stop to $\\Delta t = 0.025\\,\\text{s}$: $F_{avg} = \\dfrac{30}{0.025} = 1200\\,\\text{N}$.\n\nSame $\\Delta p$. Five times longer stop → one-fifth the force on the brain. That's impulse doing the saving. (Numbers illustrative — the relationship is the real lesson.)" },

  { id: id("draw-helmet"), type: "sketch", title: "Draw the Transfer",
    instructions: "Sketch the head-on-pavement collision twice — once without a helmet, once with. For each, draw the stopping distance and an arrow for the force on the brain (longer arrow = bigger force). Make your two force arrows show the difference the foam makes.",
    canvasHeight: 340 },

  // ── INTEGRATE: the transfer CER + sensemaking ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sketching. The transfer task below is the heart of the capstone — it's where you prove the model is yours. Write the full argument before you discuss. <span style=\"font-weight:700\">Do not skip this.</span>" },

  { id: id("transfer-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">TRANSFER TASK (CER).</span> Apply your momentum and impulse model to explain WHY a bike helmet reduces injury, then propose ONE design change that would make a helmet even safer.\n\n<span style=\"font-weight:700\">CLAIM:</span> In one sentence, why does a helmet reduce brain injury — and what is the one design change you would make?\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite the stopping-distance, stopping-time, and peak-force differences from the table.\n<span style=\"font-weight:700\">REASONING:</span> Use $F_{avg}\\Delta t=\\Delta p$ to explain why a longer stopping time means a smaller peak force on the brain — and why your design change would help." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does this prove about your model?",
      prompts: [
        { id: "q1", label: "The head has the SAME mass and SAME change in velocity with or without a helmet. So what, exactly, is the helmet changing — and why does that matter for the force?", rows: 3 },
        { id: "q2", label: "A car crumple zone and a bike helmet are completely different objects. Name the ONE physics idea they both rely on. Why does that mean your unit model 'transferred'?", rows: 3 },
        { id: "q3", label: "Someone says 'a stiffer, harder helmet would protect your head better because it's stronger.' Use impulse to explain why that is exactly backwards.", rows: 3 },
      ] } ] },

  { id: id("peer-eval"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">PEER EVALUATION.</span> You just watched a classmate's showcase. Give them one piece of evidence-based feedback: name ONE thing their design or argument did well (point to the physics), and ONE specific question or improvement you'd push them on. Be the engineer in the room, not the cheerleader." },

  // ── consensus: initial-vs-final crash model (U3 override) ──
  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Final Crash Model — initial vs. final, side by side",
    intro: "Pull up the crash model we've been building all unit. Today is the last tweak: put your <span style=\"font-weight:700\">INITIAL</span> model from Arc 1 (the one you drew before you knew any of this) next to your <span style=\"font-weight:700\">FINAL</span> model now. Show what changed: momentum, conservation, impulse, and how a design stretches stopping time to cut the force. Copy the side-by-side into your Mission Log — this is the unit, in one picture." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l8",
    title: "Class Question Board",
    intro: "Revisit the Driving Question Board from Day 1. Post one question you can NOW answer — and one new question the unit opened up that you still wonder about.",
    starters: [
      "We used to ask ___ — and now I can explain it with ___.",
      "If impulse cuts the force, why don't we ___?",
      "Where ELSE would this model work — what about ___?",
      "What would happen in a crash if ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "The unit's done, but a real scientist always has the next question loaded. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "One new testable question this unit left me with",
        label: "The kind we could answer by DOING something — measuring, building, simulating — not just looking it up.",
        placeholder: "If we ___, would the force ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — finish your collection",
        instructions: "The words this unit earned — \"momentum,\" \"impulse,\" \"inelastic,\" \"conservation,\" \"crumple zone,\" \"peak force\"? Catch the last ones here with what you now know they mean. You earned every one of these." },
    ] },

  // ── PROCESS: Status Check (composed) — 3 factual concept-check MC ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy see what landed." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Two riders fall and hit the pavement at the same speed. One wears a certified foam helmet; one wears nothing. Both heads have the same mass and the same change in velocity on impact. Use that picture — and your whole-unit model — for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain, in your own words, why the rider in the helmet ends up with a much smaller force on the brain even though both heads have the same change in momentum. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Two heads have the same mass and the same change in velocity on impact. The helmeted one stops over a longer time. Compared to the bare head, the average force on the helmeted head is —",
    options: [
      "larger, because the foam adds extra mass to the collision.",
      "exactly the same, because the change in momentum is identical.",
      "smaller, because the same change in momentum is spread over more time.",
      "zero, because the certified foam fully absorbs the entire impact.",
    ], correctIndex: 2,
    explanation: "Impulse: $F_{avg}\\Delta t = \\Delta p$. With $\\Delta p$ the same for both, a longer stopping time $\\Delta t$ means a smaller average force. The foam stretches out the stop, so the force drops." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "The impulse on an object is equal to —",
    options: [
      "its change in momentum, $\\Delta p$.",
      "its total kinetic energy at impact.",
      "its mass times its acceleration only.",
      "its velocity divided by the stopping time.",
    ], correctIndex: 0,
    explanation: "Impulse is force times the time it acts, $F\\Delta t$, and it equals the change in momentum: $F\\Delta t = \\Delta p$. That is the impulse–momentum theorem the whole unit was built on." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "When a helmet's foam liner crushes during an impact, the rider's kinetic energy is mostly —",
    options: [
      "destroyed, since energy is used up in any crash.",
      "stored in the helmet to be released back into the head.",
      "transformed into electrical energy inside the foam cells.",
      "transformed into deforming the foam instead of the skull.",
    ], correctIndex: 3,
    explanation: "The kinetic energy goes into crushing and deforming the foam liner rather than deforming the skull and brain. Energy is conserved — it's transformed, not destroyed — and the foam takes the damage instead of the rider." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A crumple zone in a car and the foam in a bike helmet protect people using the same core idea. That idea is —",
    options: [
      "increasing the mass so momentum is harder to change at all.",
      "extending the stopping time so the peak force is reduced.",
      "reflecting the momentum straight back the way it came.",
      "raising the speed so the collision finishes much faster.",
    ], correctIndex: 1,
    explanation: "Both extend the stopping time over which the momentum changes. Since $F_{avg} = \\Delta p / \\Delta t$, a longer $\\Delta t$ means a smaller peak force. Same physics, different object — that's why the model transfers." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "In one quick sketch, show the same change in momentum producing TWO different forces: a short stopping time with a big force arrow, and a long stopping time with a small force arrow. Label $\\Delta t$ and $F$ on each. This is your whole unit in one diagram.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy what landed across the unit." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go — last one of the unit",
      prompts: [
        { id: "proud", label: "The part of your design or argument you're most proud of today:", rows: 2 },
        { id: "transfer", label: "The moment you realized your crash model also explained the helmet — describe it:", rows: 2 },
        { id: "word", label: "One word from this whole unit you'll actually keep *(→ Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "That's the unit. You started by drawing a crash you didn't understand, and you're ending it by defending an engineered design AND explaining a collision you never studied — with the same model. That's not memorizing physics. That's owning it. Proud of you. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Showcase + Transfer",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3108,
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
