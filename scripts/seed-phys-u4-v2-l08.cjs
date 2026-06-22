// seed-phys-u4-v2-l08.cjs
// U4 v2 — Arc 8 (CAPSTONE): "Showcase + Transfer" (OpenSciEd-spine / Rober-engine).
// Repackages v1 L14 (Showcase + Transfer Task) into the v2 challenge-arc capstone for
// "Deflect the Asteroid." Two jobs: (1) present + DEFEND your asteroid-deflection design;
// (2) TRANSFER the gravity/orbits/energy model to a NEW impact phenomenon (Chicxulub).
// Closes the unit: revisit the DQB + the initial-vs-final class model, peer evaluation.
//
// Argument-heavy capstone — favors short_answer (design defense, transfer CER, peer-eval)
// over MC. Only 4 factual concept-check MC. No embed (this is showcase + writing).
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U4 arcs. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc8.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l08-showcase";
// No embed for this capstone arc (showcase + transfer writing). The deflection simulator
// students cite was used in Arc 7 (orbit-gravity-sim deflect mode).

let _n = 0;
const id = (slug) => `v2u4l8-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🛰️", title: "Showcase + Transfer",
    subtitle: "Unit 4 · Arc 8 — Gravity, Orbits & Energy (Capstone)" },

  // ── CONNECT: recall the whole unit → today's two jobs ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "We opened this unit with a fireball ripping across the sky over Chelyabinsk and one big question: how have collisions with space objects changed Earth, past and future? Since then you've built a whole model — <span style=\"font-weight:700\">gravity</span>, orbital motion, Kepler's laws, gravitational energy, near-Earth-object tracking, and an actual asteroid-deflection mission. Today is the last day of the unit, and it's where it all comes together. Two jobs: <span style=\"font-weight:700\">defend your design</span>, then <span style=\"font-weight:700\">carry your model to a brand-new impact</span> you've never studied." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Here's the real test of whether you actually have a model: can you use it somewhere you've never been? A model you can only recite back for Chelyabinsk isn't a model — it's a memory. A model you can carry to a situation you've never seen and still make sense of? That's physics. Today we find out which one you've got." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from across the unit — quantity over polish. Then we showcase.",
    sections: [ { id: "recall", kind: "prompts", title: "What does your model carry?",
      prompts: [
        { id: "q1", label: "In one sentence: what makes an asteroid impact destructive? (You'll sharpen this all class.)", rows: 2 },
        { id: "q2", label: "Name ONE idea from this unit (gravity, orbits, Kepler, energy, deflection) you feel solid on — and one you're still shaky on.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the capstone challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Showcase + Transfer",
    content: "Two parts, both about <span style=\"font-weight:700\">making an argument from evidence</span> — the way a real engineer or scientist does.\n\n<span style=\"font-weight:700\">Part 1 — Showcase.</span> Present your Arc 7 deflection design to the class (about two minutes). Defend the physics behind your choices.\n\n<span style=\"font-weight:700\">Part 2 — Transfer.</span> Take the model you built and apply it to an impact you never studied: the Chicxulub impact, 66 million years ago. Explain what happened using your own model.\n\nThere are levels. Clearing them means making a clearer, better-defended argument — not getting a \"right answer.\"" },

  { id: id("setup"), type: "callout", icon: "🎤", style: "info", title: "Defending a design (be ready for these)",
    content: "When you showcase your deflection mission, be ready to explain three things:\n\n<span style=\"font-weight:700\">What mission type</span> you chose — kinetic impactor, gravity tractor, or nuclear standoff.\n\n<span style=\"font-weight:700\">Why</span> that mission — which physics idea it uses (momentum transfer? a slow gravitational tug? a sudden energy release?) and what trade-off you accepted (lead time, mass, certainty).\n\n<span style=\"font-weight:700\">How it performed</span> — point to the exact simulator result from Arc 7 that shows the asteroid missing Earth. Evidence, not vibes." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your 2-minute showcase (before you present)",
    instructions: "Sketch the one slide / one drawing you'd put up to defend your deflection design. Show the asteroid's path, your intervention (where + how), and the new path that misses Earth. Label the physics idea you're leaning on. This is your visual aid — keep it clear, not pretty.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-showcase",
    title: "Class Challenge Board — Showcase + Transfer",
    intro: "Mark each level as you clear it. Clearing a level here means a stronger, better-defended argument — the whole class can see who's locked in their reasoning.",
    levels: [
      { n: 1, name: "Name Your Mission + Why", nameEs: "Nombra Tu Misión y Por Qué" },
      { n: 2, name: "Defend With Simulator Evidence", nameEs: "Defiende con Evidencia del Simulador" },
      { n: 3, name: "Showcase to the Class", nameEs: "Presenta a la Clase" },
      { n: 4, name: "Transfer the Model to Chicxulub", nameEs: "Transfiere el Modelo a Chicxulub" },
      { n: 5, name: "Write a Full CER", nameEs: "Escribe un CER Completo" },
    ] },

  // ── Part 1 showcase upload + peer evaluation ──
  { id: id("showcase-upload"), type: "evidence_upload", title: "Showcase Evidence — your deflection design",
    instructions: "Upload the artifact you used to defend your design: your slide, your sketch, or a screenshot of your Arc 7 simulator result showing the asteroid missing Earth. This is the evidence behind your two-minute argument." },

  { id: id("ml-peereval"), type: "mission_log", title: "Mission Log — Peer Evaluation",
    intro: "As you watch two other teams present, evaluate their ARGUMENT — not their drawing. A good defense names a physics idea, cites a simulator result, and is honest about its trade-off.",
    sections: [ { id: "peereval", kind: "table", title: "Evaluate two showcases",
      columns: [
        { key: "team", label: "Team", placeholder: "team name" },
        { key: "mission", label: "Mission type they chose", placeholder: "impactor / tractor / nuclear" },
        { key: "physics", label: "Physics idea they used", placeholder: "momentum, gravity tug, energy…" },
        { key: "evidence", label: "Did they cite a simulator result? Strong / weak?", placeholder: "strong — showed the miss" },
      ], minRows: 2, addRowLabel: "Add a team" } ] },

  // ── Part 2 transfer task: Chicxulub ──
  { id: id("transfer-intro"), type: "callout", icon: "🦖", style: "warning", title: "Part 2 — The Transfer Task: Chicxulub",
    content: "Now the real test. Here's an impact you never studied: the <span style=\"font-weight:700\">Chicxulub impact</span>, about 66 million years ago. A rock roughly <span style=\"font-weight:700\">10–15 kilometers</span> across struck Earth near the Yucatán Peninsula. The impact released enormous energy, threw debris into the atmosphere, and is linked to a mass extinction that wiped out most non-avian dinosaurs.\n\nYou weren't there to measure it. <span style=\"font-weight:700\">That's the point.</span> Use your gravity, orbits, and energy model to explain what happened." },

  { id: id("ml-chicxulub"), type: "mission_log", title: "Mission Log — Chicxulub: What We Know",
    intro: "The evidence scientists actually have. Pull from this table when you build your CER — cite specific rows.",
    sections: [ { id: "evidence", kind: "table", title: "Chicxulub impact evidence",
      columns: [
        { key: "feature", label: "Feature", placeholder: "Crater size" },
        { key: "evidence", label: "Evidence", placeholder: "what we measured / observed" },
      ],
      minRows: 5, addRowLabel: "Add a row" } ] },

  { id: id("chicxulub-table"), type: "callout", icon: "📋", style: "info", title: "Chicxulub impact — the evidence (copy into your Mission Log)",
    content: "<span style=\"font-weight:700\">Crater size:</span> roughly 180 km wide, buried under Yucatán Peninsula sediments.\n\n<span style=\"font-weight:700\">Impactor size:</span> estimated 10–15 km diameter, from crater modeling.\n\n<span style=\"font-weight:700\">Energy:</span> roughly 100 million megatons of TNT — far larger than any human-made explosion.\n\n<span style=\"font-weight:700\">Global effects:</span> a worldwide iridium layer, soot, shocked quartz, and a mass-extinction fossil record.\n\n<span style=\"font-weight:700\">Timing:</span> about 66 million years ago, matching the K-Pg boundary.\n\n<span style=\"font-style:italic\">Data: scientific consensus from geologic and paleontological evidence.</span>" },

  { id: id("draw-impact"), type: "sketch", title: "Draw the Energy Story",
    instructions: "Sketch the Chicxulub impact as an ENERGY story: a fast-moving asteroid (lots of kinetic energy) hits Earth, and that energy transfers into the atmosphere and surface — heat, shock, ejecta thrown worldwide. Label where the kinetic energy goes. This is your visual for the CER.",
    canvasHeight: 340 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop sketching. Before you write the CER, get your reasoning straight. The whole game here is connecting a <span style=\"font-weight:700\">small object</span> to <span style=\"font-weight:700\">global</span> destruction — and the bridge between them is energy. Write first, then we discuss." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "From a 10 km rock to a global catastrophe",
      prompts: [
        { id: "q1", label: "The Chicxulub impactor was 'only' 10–15 km across — tiny next to Earth. So why did it cause worldwide damage? Point at the right variable.", rows: 3 },
        { id: "q2", label: "Kinetic energy is $KE = \\frac{1}{2}mv^2$. Which term in that equation does the most work in making an impact destructive — the mass, or the speed? Explain why.", rows: 3 },
        { id: "q3", label: "Energy is conserved. When the asteroid slams to a stop, where does all its kinetic energy GO? Name at least three places.", rows: 3 },
        { id: "q4", label: "Connect it back: how is the Chicxulub impact the SAME physics as the Chelyabinsk airburst you started the unit with? How is it different?", rows: 3 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — why speed dominates",
    content: "Kinetic energy is $KE = \\frac{1}{2}mv^2$. The mass term is linear, but the speed term is <span style=\"font-weight:700\">squared</span> — so speed dominates.\n\nDouble the mass: $KE$ doubles. Double the speed: $KE$ goes up by a factor of $2^2 = 4$.\n\nThat's why a 'small' rock is so dangerous. Asteroids hit Earth at tens of kilometers per second. A 10 km rock isn't destructive because it's heavy — it's destructive because it's moving so fast that the $v^2$ term is enormous. All that kinetic energy has to go somewhere when it stops, and by conservation of energy it transfers into heat, shock waves, and ejecta blasted across the planet:\n\n$$KE_\\text{asteroid} \\rightarrow \\text{heat} + \\text{shock} + \\text{ejected debris}$$" },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — final version",
    intro: "This is the same model we started on day one of the unit. Today is the LAST tweak. Pull up your <span style=\"font-weight:700\">initial</span> version from Arc 1 and put it next to where the model is now. Then update it one last time so it explains BOTH Chelyabinsk and Chicxulub. Copy the final model into your Mission Log — and notice how far it came." },

  { id: id("ml-initialfinal"), type: "mission_log", title: "Mission Log — Initial vs. Final Model",
    intro: "Look back at the model you drew on day one of this unit, then at the one you have now. This comparison IS the learning.",
    sections: [ { id: "compare", kind: "prompts", title: "How far did your model come?",
      prompts: [
        { id: "q1", label: "What did your DAY-ONE model get wrong or leave out about why impacts are destructive?", rows: 2 },
        { id: "q2", label: "What can your model explain NOW that it couldn't on day one? Be specific.", rows: 2 },
      ] } ] },

  { id: id("qboard"), type: "question_board", boardId: "u4-l8",
    title: "Class Question Board — revisit the DQB",
    intro: "Pull up the unit's Driving Question Board from Arc 1. Mark which questions we ANSWERED this unit. Then post one question you STILL have — the kind that could open a whole new investigation.",
    starters: [
      "We started asking ___ — did we fully answer it?",
      "If an asteroid like Chicxulub were heading at us today, could we ___?",
      "How do scientists know the energy of an impact that happened ___?",
      "What other place in the universe uses the same gravity/energy model as ___?",
    ] },

  // ── NAVIGATE: the CER + testable question + word tracker ──
  { id: id("transfer-cer"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">TRANSFER TASK — Full CER.</span> Apply your gravity, orbits, and energy model to explain WHY the Chicxulub impact was so destructive, even though the asteroid was only 10–15 km across. Use the evidence table.\n\n<span style=\"font-weight:700\">CLAIM:</span> State why a relatively small object caused global damage.\n\n<span style=\"font-weight:700\">EVIDENCE:</span> Cite the energy estimate, the impactor size, and at least one global effect from the table.\n\n<span style=\"font-weight:700\">REASONING:</span> Explain, using kinetic energy $KE = \\frac{1}{2}mv^2$ and the transfer of energy from the asteroid into Earth's atmosphere and surface, why the impact had worldwide consequences." },

  { id: id("design-defense"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">DESIGN DEFENSE.</span> In writing, defend your Arc 7 asteroid-deflection mission. Name your mission type (kinetic impactor, gravity tractor, or nuclear standoff), state the ONE physics idea it relies on, name the trade-off you accepted, and cite the simulator result that showed your asteroid missing Earth." },

  { id: id("peer-feedback"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">PEER EVALUATION.</span> Pick one OTHER team's showcase from your Mission Log. What was the strongest part of their argument from evidence? What is one specific question you'd ask to push their reasoning further? (Be the kind of reviewer you'd want.)" },

  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "The unit's closing — but a good model always opens new questions. Catch the last words too.",
    sections: [
      { id: "testable", kind: "text", title: "One question this unit opened up for me",
        label: "What do you want to know now that you didn't before? The kind we could actually investigate.",
        placeholder: "Now that I know ___, I want to find out whether ___.",
        hint: "*The best questions at the END of a unit are bigger than the ones at the start.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "The words you earned across this whole unit — \"kinetic energy,\" \"ejecta,\" \"gravitational,\" \"orbit,\" \"eccentricity,\" \"impactor,\" \"conservation,\" \"transfer\"? Catch any you're still fuzzy on with what you THINK they mean. Last chance to sharpen them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick concept check — NOT a test for points. It just helps Mr. McCarthy see where the unit landed." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A small asteroid, just a few kilometers across, is on a path that crosses Earth's. It's moving at tens of kilometers per second. If it hits, the damage could be global — even though the rock itself is tiny compared to Earth. Use what you built this unit for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain how a small, fast asteroid can cause global damage. Name the energy involved, say what happens to that energy on impact, and connect it to conservation of energy. Use what you figured out this unit." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "An asteroid's kinetic energy is $KE = \\frac{1}{2}mv^2$. Which change increases its kinetic energy the MOST?",
    options: [
      "Doubling its mass, which doubles the kinetic energy.",
      "Doubling its speed, which makes the kinetic energy four times larger.",
      "Halving its mass, because a lighter object always hits harder.",
      "Painting its surface darker so it absorbs more sunlight.",
    ], correctIndex: 1,
    explanation: "Speed is squared in $KE = \\frac{1}{2}mv^2$. Doubling speed multiplies $KE$ by $2^2 = 4$, while doubling mass only doubles it. That's why a small but very fast asteroid is so dangerous." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "When an asteroid slams into Earth and stops, conservation of energy tells us its kinetic energy —",
    options: [
      "is destroyed on impact, which is why the asteroid vanishes.",
      "stays locked inside the asteroid fragments and goes nowhere.",
      "is created anew as the crater forms and grows outward.",
      "transforms into heat, shock waves, and ejected debris.",
    ], correctIndex: 3,
    explanation: "Energy is conserved — it can't be destroyed. The asteroid's kinetic energy transforms into thermal energy, shock waves, and material blasted across the planet. That's why a small impactor can have global effects." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "The Chicxulub impactor was only about 10–15 km across — tiny next to Earth. Why was its impact still globally destructive?",
    options: [
      "Its enormous speed gave it an immense amount of kinetic energy.",
      "It was made of a rare, naturally explosive type of space metal.",
      "Earth's gravity multiplied the rock's mass as it fell to the ground.",
      "It blocked the Sun directly by physically covering the whole sky.",
    ], correctIndex: 0,
    explanation: "Despite its small size, the impactor's huge speed (tens of km/s) meant the $v^2$ term in $KE = \\frac{1}{2}mv^2$ was enormous. That kinetic energy transferred to Earth as heat, shock, and globe-spanning ejecta." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "In a Claim-Evidence-Reasoning argument about the Chicxulub impact, which statement best fits the EVIDENCE part?",
    options: [
      "A small asteroid caused global damage because it was moving fast.",
      "The squared speed term explains why the energy was so enormous.",
      "The crater is ~180 km wide and the energy was ~100 million megatons.",
      "Conservation of energy means the kinetic energy had to go somewhere.",
    ], correctIndex: 2,
    explanation: "Evidence is the specific, measured data: the ~180 km crater and ~100 million megaton energy estimate. The claim is the conclusion; the reasoning is the physics that ties evidence to claim." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch an incoming asteroid with a big arrow labeled 'kinetic energy.' Then show that energy splitting on impact into smaller labeled arrows — heat, shock, ejected debris. Make your arrows add up so the energy is conserved. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how the unit landed." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "proud", label: "The part of my showcase or CER I'm most proud of:", rows: 1 },
        { id: "transfer", label: "The moment my model 'clicked' for a NEW situation (Chicxulub), and why:", rows: 2 },
        { id: "word", label: "One word from this unit I finally understand that I didn't on day one:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You started this unit watching a fireball you couldn't explain. Today you defended a real deflection mission and then carried your model 66 million years into the past to make sense of an impact you'd never studied. That's the whole point of physics — a model you can take anywhere. Look back at your day-one drawing. You're smarter than that kid was. That was the plan all along. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Showcase + Transfer",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4108,
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
