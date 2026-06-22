// seed-phys-u2-v2-l07.cjs
// U2 v2 — Arc 7: "Ancient Rifts" (OpenSciEd-spine / Rober-engine).
// Merges v1 L12 (Ancient Rifts of North America) + L13 (Why Some Rifts Succeed and
// Others Fail) into one challenge-arc. Rifts have opened & closed across Earth for
// billions of years; some leave scars we can still read (Newark Basin, Palisades Sill,
// Midcontinent Rift). A rift SUCCEEDS when unbalanced forces keep pulling; it FAILS
// when the forces become balanced or plate motion changes. Through-line: "Crack the
// Earth" — read the rock record, argue from evidence why a rift succeeds or fails.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as the U1 v2 arcs. Content repackaged
// verbatim from drafts/physics-content-review/u1-v2/_v1-source-u2/u2-arc7.md
// (already sourced/audited). No embed for this arc.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u2-v2-l07-ancient-rifts";
// No embed for this arc — challenge is a data-analysis / argument-construction arc.

let _n = 0;
const id = (slug) => `v2u2l7-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🪨", title: "Ancient Rifts",
    subtitle: "Unit 2 · Arc 7 — Plate Tectonics & Forces" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc we used <span style=\"font-weight:700\">net force as vectors</span> to predict how plates move at boundaries. The Afar rift is splitting Africa apart <span style=\"font-weight:700\">right now</span>. Today's question: rifts have been cracking the Earth for billions of years — so why did some keep going and split continents, while others started, stretched the crust, and just… stopped? And here's the kicker: one of those failed rifts runs straight through <span style=\"font-weight:700\">New Jersey</span>." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Stand on the Palisades cliffs along the Hudson and you're standing on the leftovers of a rift that tried to crack the continent ~200 million years ago — and failed. The forces that drive a rift are the same balanced-vs-unbalanced forces we've tracked all unit. A rift keeps opening only while the forces pulling it apart stay <span style=\"font-weight:700\">stronger</span> than the forces holding the crust together. When that stops being true, the rift freezes. That's the thread we pull today: read the rock record, then argue from evidence why a rift succeeds or fails." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the boundary arc — quantity over polish. Then we go read some ancient rock.",
    sections: [ { id: "recall", kind: "prompts", title: "Forces and motion at a rift",
      prompts: [
        { id: "q1", label: "At a divergent boundary like Afar, which way do the forces pull the crust — together or apart? What keeps it moving?", rows: 2 },
        { id: "q2", label: "If the unbalanced force pulling a rift apart suddenly weakened, what would you predict happens to the rift's motion?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Crack the Earth — read the rifts",
    content: "Your team is handed rift data — location, age, evidence in the rock, and the forces below. <span style=\"font-weight:700\">Read it</span> and build the case: which rifts succeeded, which failed, and <span style=\"font-weight:700\">why</span>. By the end you'll argue, from evidence, what separates an Afar (still opening) from a Newark Basin (frozen 200 million years ago).\n\nThere are levels. They get harder. The rule from all unit still holds — write down what the evidence <span style=\"font-weight:700\">says</span> before you decide what it <span style=\"font-weight:700\">means</span>." },

  { id: id("setup"), type: "callout", icon: "🗺️", style: "info", title: "Three scars in North American rock",
    content: "Three features tell us the crust under North America was once pulled apart:\n\n• <span style=\"font-weight:700\">Newark Basin</span> — a sunken (down-dropped) block of crust through New Jersey and Pennsylvania, filled with layered sedimentary rock as the crust stretched. Age ~200 million years.\n• <span style=\"font-weight:700\">Palisades Sill</span> — a thick sheet of igneous rock along the Hudson River that pushed in between sedimentary layers during rift-related volcanism, later tilted and exposed as steep cliffs by erosion. Age ~200 million years.\n• <span style=\"font-weight:700\">Midcontinent Rift</span> — a much older, giant crack through the Great Lakes region (MN/WI/MI/Ontario), filled with a huge volume of volcanic rock. Age ~1.1 billion years.\n\nAll three formed when forces inside Earth pulled the crust apart. None of them split the continent — they all failed." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict before you read the data",
    instructions: "Before the data table: sketch what you think a FAILED rift leaves behind in the rock versus a SUCCESSFUL one. Where does the crust sink? Where does magma rise? Label your guess. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u2-ancient-rifts",
    title: "Class Challenge Board — Crack the Earth",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading which rift.",
    levels: [
      { n: 1, name: "Locate the Rift", nameEs: "Localiza el Rift" },
      { n: 2, name: "Read the Evidence", nameEs: "Lee la Evidencia" },
      { n: 3, name: "Order Them by Age", nameEs: "Ordénalos por Edad" },
      { n: 4, name: "Compare Forces Below", nameEs: "Compara las Fuerzas Abajo" },
      { n: 5, name: "Argue Succeed vs Fail", nameEs: "Argumenta Éxito vs Fracaso" },
    ] },

  { id: id("ml-evidence"), type: "mission_log", title: "Mission Log — Ancient Rift Evidence",
    intro: "Log the evidence for each ancient North American rift. <span style=\"font-weight:700\">Before you decide a rift \"failed,\" write what the rock actually shows.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "evidence", kind: "table", title: "Ancient rift evidence in North America",
      columns: [
        { key: "feature", label: "Feature", placeholder: "Newark Basin…" },
        { key: "location", label: "Location", placeholder: "NJ / PA" },
        { key: "age", label: "Age (approx.)", placeholder: "~200 million yrs" },
        { key: "evidence", label: "Evidence of rifting", placeholder: "down-dropped basin, intruded sill…" },
      ], minRows: 3, addRowLabel: "Add a feature" } ] },

  { id: id("draw-path"), type: "sketch", title: "Draw the Rift Story",
    instructions: "Redraw a rift now that you've read the evidence. Show: the crust stretching and thinning, a down-dropped basin filling with sediment, magma rising to form an igneous sheet, and an arrow OFF to the side showing where the pulling force came from. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-compare"), type: "mission_log", title: "Mission Log — Compare the Rifts",
    intro: "Now compare an active rift with the failed ones. One row per rift — its status, the forces below, and why it stopped or kept going.",
    sections: [ { id: "compare", kind: "table", title: "Afar vs Midcontinent Rift vs Newark Basin",
      columns: [
        { key: "feature", label: "Feature", placeholder: "Afar Rift…" },
        { key: "status", label: "Status", placeholder: "active / failed" },
        { key: "forces", label: "Forces below", placeholder: "mantle upwelling pulls crust apart…" },
        { key: "outcome", label: "Why it stopped or kept going", placeholder: "forces stayed unbalanced / became balanced…" },
      ], minRows: 3, addRowLabel: "Add a rift" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop reading data. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we looked at some rocks\" into an evidence-based argument." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What is the rock record telling us?",
      prompts: [
        { id: "q1", label: "Using the evidence table: which feature is the oldest, and which is the youngest? What does that tell you about whether rifting in North America happened only once?", rows: 3 },
        { id: "q2", label: "What evidence shows that New Jersey was once part of an active rift system? Name at least two specific features.", rows: 2 },
        { id: "q3", label: "For BOTH the Midcontinent Rift and the Newark Basin, describe what changed so that the rift stopped opening.", rows: 3 },
        { id: "q4", label: "Use the taffy analogy: if you keep pulling, taffy thins and breaks; if you stop, it stays stretched. Which is a successful rift, and which is a failed one? Explain.", rows: 2 },
        { id: "q5", label: "**Predict:** if the Midcontinent Rift's mantle upwelling had stayed strong for another 100 million years instead of weakening, what do you think would exist in the Great Lakes region today? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — reading the age data",
    content: "The evidence table gives us three ages. Put them on a number line (most-recent on the right):\n\n$$\\text{Midcontinent Rift} \\;(\\sim 1{,}100\\ \\text{Myr}) \\;\\longrightarrow\\; \\text{Newark Basin and Palisades Sill} \\;(\\sim 200\\ \\text{Myr})$$\n\nThe gap is about $1{,}100\\ \\text{Myr} - 200\\ \\text{Myr} = 900\\ \\text{Myr}$. That's a 900-million-year span between two separate rifting events in North America. The takeaway isn't the arithmetic — it's the <span style=\"font-weight:700\">interpretation</span>: rifting wasn't a one-time event. The same kind of unbalanced force has cracked this crust more than once, hundreds of millions of years apart, and each time the rift eventually failed when the forces stopped winning." },

  { id: id("consensus"), type: "consensus_model", roundId: "u2-rift-model",
    title: "Tweak Our Class Model — succeed vs fail",
    intro: "Same model we've built all unit. Today we tweak it: add a <span style=\"font-weight:700\">successful</span> rift (forces stay unbalanced → continent splits) next to a <span style=\"font-weight:700\">failed</span> one (forces balance out → rift freezes, leaves a basin/sill behind). Show the force arrows for each. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u2-l7",
    title: "Class Question Board",
    intro: "Post at least one question you still have about why rifts succeed or fail. These drive where the unit heads next — including tomorrow's big question.",
    starters: [
      "If the forces became balanced, what made them ___?",
      "How do geologists know a rift is ___ years old?",
      "Could the Newark Basin start opening again if ___?",
      "What would it take for a brand-new rift to ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE investigable question for next time",
        label: "The kind we could answer by analyzing evidence — not just looking up a single fact.",
        placeholder: "If the forces below a rift ___, then the rock record would show ___?",
        hint: "*A good one can be answered by reasoning from evidence, not just one quick lookup.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"rift,\" \"divergent,\" \"basin,\" \"sill,\" \"intrude,\" \"unbalanced force,\" \"mantle upwelling,\" \"failed rift\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "🌋", style: "default", title: "The scenario",
    content: "You're standing on the Palisades cliffs along the Hudson River. Beneath your feet is a thick sheet of igneous rock that pushed up between sedimentary layers ~200 million years ago, when this region was being pulled apart — and right across the river is the down-dropped Newark Basin. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what the Palisades Sill and Newark Basin tell you about New Jersey's deep past. Was this region always stable? What forces left these features behind, and why did the rifting eventually stop? Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What does the presence of the Newark Basin and Palisades Sill tell us about New Jersey's geological past?",
    options: [
      "New Jersey has always been a stable, unchanging part of the continent.",
      "Forces inside Earth once pulled this region apart, similar to Afar today.",
      "The Palisades were carved by glaciers moving south during the last ice age.",
      "The basin formed when ocean water slowly flooded an ancient meteor crater.",
    ], correctIndex: 1,
    explanation: "The Newark Basin and Palisades Sill are evidence that crustal stretching and rift-related volcanism once affected what is now New Jersey, much like the active rifting seen in Afar today." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Which condition is most likely to let a rift keep opening and eventually split a continent?",
    options: [
      "The mantle below keeps rising and pulling the crust apart.",
      "The crust grows so thick and heavy that it sinks down quickly.",
      "Every force acting on the crust stays perfectly balanced forever.",
      "The rift forms far away from any plate boundary or source of heat.",
    ], correctIndex: 0,
    explanation: "A rift succeeds when unbalanced forces keep pulling the crust apart. Persistent mantle upwelling is one of the main drivers that can maintain those forces over millions of years." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "The Midcontinent Rift is about 1.1 billion years old, while the Newark Basin is about 200 million years old. What does this difference tell you?",
    options: [
      "The two rifts must have formed during the exact same event.",
      "Rifting can only happen once in any single continent's history.",
      "Rifting has cracked North America more than once, far apart in time.",
      "Older rifts are always much larger and far deeper than any younger rifts are.",
    ], correctIndex: 2,
    explanation: "The roughly 900-million-year gap between the two ages shows rifting was not a one-time event — the same kind of unbalanced force has pulled North America's crust apart in separate episodes far apart in time." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "A failed rift, like the Newark Basin, stops opening. Using the taffy analogy, what is a failed rift most like?",
    options: [
      "Taffy that snapped cleanly into two completely separate pieces.",
      "Taffy that was never pulled or stretched by anything at all.",
      "Taffy melted back together into a smooth, unstretched blob again.",
      "Taffy that got pulled, thinned out, and then was left stretched.",
    ], correctIndex: 3,
    explanation: "A failed rift is crust that was stretched and thinned, but the pulling stopped before it broke apart — like taffy left thinned and stretched once you stop pulling. A successful rift is taffy you keep pulling until it breaks." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "What is the best evidence that the Palisades Sill formed during rift-related volcanism?",
    options: [
      "It is a smooth layer of beach sand left behind by an ancient sea.",
      "It is a thick sheet of igneous rock that intruded between rock layers.",
      "It is a deep crater that was punched into the crust by an impact.",
      "It is a band of glacier-scratched bedrock running along the Hudson.",
    ], correctIndex: 1,
    explanation: "The Palisades Sill is a thick igneous rock sheet that pushed (intruded) in between sedimentary layers. Igneous rock forms from magma, so its presence is evidence of the rift-related volcanism that occurred ~200 million years ago." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Why is the Afar rift still opening today while the Midcontinent Rift froze in place long ago?",
    options: [
      "Afar is located much closer to the center of the Earth's core.",
      "The Midcontinent Rift was never pulled apart by any real force.",
      "At Afar the unbalanced mantle forces have kept pulling the crust apart.",
      "Afar happens to be made of a special kind of rock that simply cannot ever stop moving.",
    ], correctIndex: 2,
    explanation: "Afar succeeds because strong mantle upwelling keeps the forces unbalanced, so the crust is still being pulled apart. At the Midcontinent Rift the forces became balanced or the plate motion changed, so the rift stopped." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch two rifts side by side. On the left, a SUCCESSFUL rift: strong unbalanced force arrows still pulling, crust splitting into two. On the right, a FAILED rift: weaker/balanced force arrows, a stretched basin that froze and filled with sediment. Label the force arrows on each. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">Argue it (CER):</span> Why did the Afar rift succeed while the Midcontinent Rift and Newark Basin failed?\n\n<span style=\"font-weight:700\">CLAIM:</span> State what makes Afar different from the ancient North American rifts.\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite at least two differences from the comparison table or from the unit.\n<span style=\"font-weight:700\">REASONING:</span> Explain how unbalanced forces, energy transfer, and time determine whether a rift keeps opening." },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about New Jersey's deep past that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read the rock record today — located the rifts, ordered them by age, and argued from evidence why some crack a continent and others freeze. The same unbalanced forces we've tracked all unit are written into the cliffs across the Hudson. Tomorrow, the big question: could a brand-new rift open in New Jersey? See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Ancient Rifts",
  unit: "Unit 2: Plate Tectonics & Forces — v2",
  order: 2107,
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
