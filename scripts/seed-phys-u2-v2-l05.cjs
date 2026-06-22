// seed-phys-u2-v2-l05.cjs
// U2 v2 — Arc 5: "Forces at the Boundaries" (OpenSciEd-spine / Rober-engine).
// Merges v1 L09 (Forces at Plate Boundaries) + L10 (Vectors: Direction Matters) into
// one challenge-arc. Physics: forces at divergent/convergent/transform boundaries
// (balanced vs unbalanced); representing a force as a VECTOR (magnitude + direction);
// adding vectors qualitatively to find the NET FORCE → predict plate motion + hazards.
// Through-line: "Crack the Earth" — read the force arrows, predict the motion.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as U1 v2. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc5.md (sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l05-boundary-forces";
// Two embeds for this arc, exact URLs from u2-arc5.md.
const BUILDER = "https://paps-tools.web.app/plate-boundary-builder.html";
const VECTORS = "https://paps-tools.web.app/vector-addition.html";

let _n = 0;
const id = (slug) => `v2u2l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🧭", title: "Forces at the Boundaries",
    subtitle: "Unit 2 · Arc 5 — Plate Tectonics & Forces" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you figured out the <span style=\"font-weight:700\">engine</span>: heat from radioactive decay drives mantle convection, and the moving mantle drags the plates around. So the plates are getting pushed and pulled — fine. But here's the thing nobody told you: the same plate can get <span style=\"font-weight:700\">pulled apart</span> in one spot, <span style=\"font-weight:700\">slammed together</span> in another, and <span style=\"font-weight:700\">slide sideways</span> in a third. Today's question: if I show you the pushes and pulls at a boundary, can you predict the motion — and the hazard? Yes. You just have to learn to read arrows." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture a rope in a tug-of-war. Two teams pull <span style=\"font-weight:700\">equally hard</span> in opposite directions and the flag in the middle… doesn't move. Now one team gets a new recruit. The flag jerks their way. Nothing changed about the pulling except the <span style=\"font-weight:700\">balance</span> of it.\n\nThat's the whole arc. Plates are the flag. The mantle and neighboring plates are the teams. When the pushes and pulls are <span style=\"font-weight:700\">balanced</span>, no acceleration. When they're <span style=\"font-weight:700\">unbalanced</span>, the plate speeds up, slows down, or changes direction. To predict any of it, you have to track not just how hard each force pushes, but <span style=\"font-weight:700\">which way</span>." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 4 — quantity over polish. Then we go read some force arrows.",
    sections: [ { id: "recall", kind: "prompts", title: "What's pushing the plates?",
      prompts: [
        { id: "q1", label: "From last arc: name ONE force the mantle puts on a plate, and which way it pushes or pulls.", rows: 2 },
        { id: "q2", label: "If two forces act on the same plate, what do you think decides whether the plate moves — and which way?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Forces, Call the Motion",
    content: "Your mission: at any plate boundary I hand you, <span style=\"font-weight:700\">read the force arrows</span>, decide if they're balanced or unbalanced, add them up to find the <span style=\"font-weight:700\">net force</span>, and then predict the motion AND the hazard. Divergent, convergent, transform — same skill, three answers.\n\nThere are levels. They get harder. The rule still holds — write down the arrows you actually see before you decide what the plate does." },

  { id: id("setup"), type: "callout", icon: "🌎", style: "info", title: "The three boundaries you're reading",
    content: "Plates meet at <span style=\"font-weight:700\">boundaries</span>, and what happens there depends entirely on the direction of the forces:\n\n• <span style=\"font-weight:700\">Divergent</span> — plates pull apart → they move away from each other → rifting, earthquakes, volcanic eruptions.\n• <span style=\"font-weight:700\">Convergent</span> — plates push together → they move toward each other → big earthquakes, tsunamis, volcanic arcs, mountains, deep trenches.\n• <span style=\"font-weight:700\">Transform</span> — plates slide past each other → horizontal motion → sudden earthquakes along the fault.\n\nClue for our anchor: the Afar region in East Africa sits at a <span style=\"font-weight:700\">divergent</span> boundary. Keep that in your back pocket." },

  { id: id("system"), type: "callout", icon: "🔲", style: "warning", title: "Define the system first",
    content: "Before you draw a single arrow, say what your <span style=\"font-weight:700\">system</span> is. For a boundary, the system is the <span style=\"font-weight:700\">two plates meeting there</span> (or just one plate you're tracking). The <span style=\"font-weight:700\">surroundings</span> are the mantle below, the ocean or air above, and neighboring plates. Forces cross that boundary when the mantle drags a plate and when the plates push or pull on each other. Get the system straight and the arrows tell the truth." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your prediction (before the build)",
    instructions: "Pick ONE boundary type (divergent, convergent, or transform). Draw the two plates and sketch the force arrows you THINK act on them. Then guess the net force and the motion. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-boundary-forces",
    title: "Class Challenge Board — Read the Forces",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's calling which boundary.",
    levels: [
      { n: 1, name: "Spot the Boundary Type", nameEs: "Identifica el Tipo de Borde" },
      { n: 2, name: "Draw the Force Arrows", nameEs: "Dibuja las Flechas de Fuerza" },
      { n: 3, name: "Balanced or Unbalanced?", nameEs: "¿Equilibrado o Desequilibrado?" },
      { n: 4, name: "Add to Find the Net Force", nameEs: "Suma para Hallar la Fuerza Neta" },
      { n: 5, name: "Predict Motion + Hazard", nameEs: "Predice Movimiento y Peligro" },
    ] },

  { id: id("embed-builder"), type: "embed", url: BUILDER, scored: true, weight: 5 },

  { id: id("ml-buildtrace"), type: "mission_log", title: "Mission Log — Boundary Trace Log",
    intro: "As you work the plate-boundary builder: <span style=\"font-weight:700\">before you decide what a boundary does, write the arrows you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Reading each boundary",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "type", label: "Boundary type", placeholder: "divergent / convergent / transform" },
        { key: "forces", label: "Force arrows (which way?)", placeholder: "← plate1   plate2 →" },
        { key: "motion", label: "Net force → motion + hazard", placeholder: "balanced? then predict" },
      ], minRows: 3, addRowLabel: "Add a boundary" } ] },

  { id: id("vectors-intro"), type: "callout", icon: "➡️", style: "info", title: "Forces are vectors — the missing piece",
    content: "A force is more than a number. It has a <span style=\"font-weight:700\">direction</span>. Push a box north while a friend pushes it south just as hard, and the box doesn't move — the forces <span style=\"font-weight:700\">cancel</span>. Push harder one way and the box goes that way.\n\nWe draw a force as a <span style=\"font-weight:700\">vector</span>: an arrow whose <span style=\"font-weight:700\">length</span> shows the magnitude (how big) and whose <span style=\"font-weight:700\">arrowhead</span> shows the direction (which way). When two forces act along the same line, add them as signed numbers. A force $+F$ to the right plus a force $-F$ to the left gives $F_{net} = F + (-F) = 0$. If the rightward force is bigger, $F_{net}$ points right and the plate accelerates right.\n\nNext tool lets you build and add vectors yourself." },

  { id: id("embed-vectors"), type: "embed", url: VECTORS, scored: true, weight: 5 },

  { id: id("draw-net"), type: "sketch", title: "Draw the Net Force",
    instructions: "Redraw your boundary now that you've added vectors. Show each force as a labeled arrow (longer = stronger), then draw ONE net-force arrow that's the sum. If the net force is zero, show why the arrows cancel. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — Force Accounting",
    intro: "Account for the forces on one plate. One row per force — name it, say which way it points, and how big (a relative size like 'large/small' is fine if you don't have numbers).",
    sections: [ { id: "account", kind: "table", title: "Force budget on one plate",
      columns: [
        { key: "force", label: "Force", placeholder: "mantle drag, slab pull…" },
        { key: "dir", label: "Direction (which way?)", placeholder: "east / west / toward other plate" },
        { key: "mag", label: "Magnitude (units or large/small)", placeholder: "4 units / large / ≈ equal" },
      ], minRows: 3, addRowLabel: "Add a force" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop building. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we drew some arrows\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What do the forces actually tell you?",
      prompts: [
        { id: "q1", label: "**Apply to Afar.** Afar is at a divergent boundary. Describe the direction of the forces, the net force, and the surface motion you would predict.", rows: 3 },
        { id: "q2", label: "Choose one boundary type. Explain how UNBALANCED forces there lead to a specific motion AND a specific hazard. (CLAIM: name the boundary + motion. EVIDENCE: the force arrows. REASONING: net force → motion → hazard.)", rows: 4 },
        { id: "q3", label: "A plate is pushed east by mantle drag and west by slab pull. (Here the mantle moves slower than the plate, so mantle drag acts AGAINST the motion.) If slab pull is stronger, describe the net force and predict the plate's acceleration.", rows: 3 },
        { id: "q4", label: "Why does the DIRECTION of a force matter when predicting plate motion? Give an example where two forces are the same size but point different ways.", rows: 3 },
        { id: "q5", label: "**Predict:** if the driving and resisting forces at a boundary were ever EXACTLY balanced, what would happen to the plate's motion? (Careful — balanced does not mean 'stopped.')", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — adding forces along a line",
    content: "A plate feels two forces along the east–west line: mantle drag pulls it <span style=\"font-weight:700\">west</span> at 3 units, slab pull tugs it <span style=\"font-weight:700\">east</span> at 5 units.\n\nStep 1 — pick a positive direction. Let east be $+$. Then mantle drag is $-3$ and slab pull is $+5$.\n\nStep 2 — add the vectors as signed numbers: $F_{net} = (+5) + (-3) = +2 \\text{ units}$.\n\nStep 3 — read the result: $F_{net} = +2$ units means a net force of 2 units pointing <span style=\"font-weight:700\">east</span>. The forces are <span style=\"font-weight:700\">unbalanced</span>, so the plate accelerates east — toward the stronger pull.\n\nIf instead both were 4 units in opposite directions: $F_{net} = (+4) + (-4) = 0$. Balanced. No acceleration — though the plate could still drift at constant velocity. Direction is doing all the work here: same magnitudes, completely different outcome." },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — add the forces",
    intro: "Same model we started at the anchor. Today we tweak it: at each boundary in our model, add <span style=\"font-weight:700\">force arrows</span> (length = magnitude, arrowhead = direction), then show the <span style=\"font-weight:700\">net force</span> and the motion it predicts. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have about forces at boundaries. These drive where the unit heads next.",
    starters: [
      "If the forces are balanced, why does the plate still ___?",
      "What sets the SIZE of the force at a ___ boundary?",
      "How do scientists actually measure the force on a ___?",
      "What happens at a boundary where forces point ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we change the ___ force, will the plate ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"vector,\" \"magnitude,\" \"direction,\" \"net force,\" \"balanced,\" \"unbalanced,\" \"divergent,\" \"convergent,\" \"transform\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Two ocean plates are pushing directly toward each other. The mantle drags each one inward; neither side gives. The seafloor between them buckles, a deep trench forms, and the region is a hotspot for big earthquakes. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Name this boundary type, describe the force arrows acting on the two plates, work out the direction of the net force, and predict both the motion and a hazard. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "At a convergent boundary, two plates push directly toward each other. What can you conclude about the net force?",
    options: [
      "The net force is zero, so the plates stop moving completely.",
      "The net force pushes the plates together, causing compression.",
      "The net force pulls the plates apart, opening up a new rift zone.",
      "The net force only affects the ocean above, never the solid land.",
    ], correctIndex: 1,
    explanation: "When two plates push toward each other, the net force is directed inward. This unbalanced compressive force builds mountains and creates deep trenches at convergent boundaries." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A plate feels a 4-unit force to the east and a 4-unit force to the west. What is the net force?",
    options: [
      "8 units east, because the two forces add up in size.",
      "16 units total, found by summing the magnitudes of both.",
      "Zero, so the plate does not accelerate from these forces.",
      "8 units west, because the westward force always wins out.",
    ], correctIndex: 2,
    explanation: "Equal and opposite forces along the same line cancel. The net force is zero, so the plate does not accelerate — although it may still be moving at constant velocity." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "What does the LENGTH of a force vector arrow represent?",
    options: [
      "The direction the force points, shown by how the arrow leans.",
      "The amount of time the force has been acting on the object.",
      "The number of separate forces combined into a single arrow.",
      "The magnitude of the force — how big the push or pull is.",
    ], correctIndex: 3,
    explanation: "A vector arrow shows two things: its length shows the magnitude (how big the force is) and its arrowhead shows the direction (which way it points)." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "At a divergent boundary, the forces pull the two plates apart. What motion and hazard would you predict?",
    options: [
      "The plates move away from each other; rifting and volcanic eruptions.",
      "The plates lock together permanently with no motion and no hazard at all.",
      "The plates pile up into tall mountains with deep ocean trenches.",
      "The plates slide horizontally past one another with no eruptions.",
    ], correctIndex: 0,
    explanation: "Divergent boundaries pull plates apart, so they move away from each other. This opens rifts and lets magma rise, producing earthquakes and volcanic eruptions — exactly what we see in Afar." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Why is it not enough to know only the SIZE of each force acting on a plate?",
    options: [
      "Because forces always come in pairs that automatically cancel out.",
      "Because the size of a force changes randomly from moment to moment.",
      "Because the direction also matters; opposite forces can cancel out.",
      "Because only the largest single force ever acts on a plate at once.",
    ], correctIndex: 2,
    explanation: "A force is a vector — it has both magnitude and direction. Two forces of equal size can cancel (if opposite) or add (if same direction), so you must track direction to find the net force." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A plate is pushed east by a 5-unit force and west by a 2-unit force along the same line. What is the net force?",
    options: [
      "3 units east, because the eastward force is larger by 3 units.",
      "7 units east, because you add the two magnitudes together.",
      "3 units west, because the smaller force sets the direction.",
      "Zero, because any two opposing forces will always cancel out exactly.",
    ], correctIndex: 0,
    explanation: "Adding along a line: let east be positive, so $(+5) + (-2) = +3$. The net force is 3 units east — toward the larger force — so the plate accelerates east." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "At a transform boundary, two plates slide horizontally past each other. What is the characteristic hazard?",
    options: [
      "Towering volcanic arcs fed by rising magma from deep below.",
      "Tsunamis triggered as one whole plate dives beneath the other.",
      "Wide rift valleys that gradually split a continent into pieces.",
      "Sudden earthquakes that release along the slipping fault line.",
    ], correctIndex: 3,
    explanation: "Transform boundaries grind sideways. Stress builds as the plates stick, then releases suddenly — producing earthquakes along the fault, without the volcanism of divergent or convergent zones." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "At real plate boundaries, the driving and resisting forces are almost never EXACTLY balanced. What does this tell us about plate motion over geologic time?",
    options: [
      "Plates remain perfectly frozen in place for many billions of years.",
      "Plates slowly speed up, slow down, or change direction over time.",
      "Plates instantly snap to a new position whenever a force shifts.",
      "Plates move only when a brand-new force is created from nothing.",
    ], correctIndex: 1,
    explanation: "Because the forces are slightly unbalanced, there's a small net force, so over geologic time the plates slowly accelerate — speeding up, slowing down, or changing direction." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the two converging plates from the scenario. Draw a force arrow on each plate (length = how strong), then draw the single net-force arrow that results. Label the boundary type, the motion you predict, and one hazard. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about force direction that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you stopped guessing and started reading. Force arrows in, net force out, motion and hazard predicted — divergent, convergent, transform. Direction turned out to be the whole game: same sizes, opposite ways, completely different Earth. Next class we keep cracking it open. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Forces at the Boundaries",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2105,
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
