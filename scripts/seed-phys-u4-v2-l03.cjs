// seed-phys-u4-v2-l03.cjs
// U4 v2 — Arc 3: "Craters & Gravity" (OpenSciEd-spine / Rober-engine).
// Merges v1 L05 (Craters Tell a Story) + L06 (A Force That Reaches Across Space) into
// one challenge-arc. Physics: impactor mass + speed shape crater size (KE = ½mv²);
// Newton's law of universal gravitation F = G m1 m2 / r²; force grows with mass and
// falls with the SQUARE of distance. Through-line: "Deflect the Asteroid" — read the
// crater to size up the threat, then learn the force that aims every rock at Earth.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// platform blocks + composed Status Check as the U1 v2 template.
// Content repackaged verbatim from drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc3.md.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l03-craters-gravity";
// Embed URL taken EXACTLY from u4-arc3.md (v1 L05 [embed] line).
const CRATER_SIM = "https://paps-tools.web.app/impact-crater-sim.html";

let _n = 0;
const id = (slug) => `v2u4l3-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌑", title: "Craters & Gravity",
    subtitle: "Unit 4 · Arc 3 — Gravity, Orbits & Energy" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you put a number on the Chelyabinsk fireball — the energy of a rock dropping out of the sky. Today two questions: when a rock <span style=\"font-weight:700\">hits</span>, what does the hole it punches tell us about it? And the deeper one for the whole unit — what <span style=\"font-weight:700\">force</span> aimed that rock at us in the first place, reaching across empty space to do it? If we want to deflect an asteroid, we'd better understand the force that's pulling it in." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Earth is covered in scars. <span style=\"font-weight:700\">Meteor Crater in Arizona</span> is about 1,200 meters across — carved roughly 50,000 years ago by an iron rock only about 50 meters wide. The crater is way bigger than the thing that made it. That's a clue: the size of the hole records the <span style=\"font-weight:700\">energy</span> of the impact, not just the size of the rock. And the rock was moving because something pulled it — the same something that keeps the Moon circling overhead instead of crashing down. That's the thread: <span style=\"font-weight:700\">gravity</span>." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 2 — quantity over polish. Then we go read some craters.",
    sections: [ { id: "recall", kind: "prompts", title: "From energy to impact",
      prompts: [
        { id: "q1", label: "Last arc you found the impactor's kinetic energy depends on mass and speed. Which one mattered MORE, and why?", rows: 2 },
        { id: "q2", label: "A 50-meter rock left a 1,200-meter crater. In your own words, how can the hole be so much bigger than the rock?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Crater, Find the Force",
    content: "Two missions in one. First, become a crater detective: run impacts in the simulator and figure out <span style=\"font-weight:700\">what controls how big the crater gets</span> — mass, speed, or surface. Then zoom out and pin down the force that put the rock on a collision course: Newton's law of <span style=\"font-weight:700\">universal gravitation</span>. Your job isn't done until you can predict how the force changes when you change the masses or the distance between them.\n\nThere are levels. They get harder. Write down what you SEE before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "💥", style: "info", title: "What controls crater size",
    content: "Kinetic energy depends on both mass and speed: $KE = \\frac{1}{2}mv^2$. Because speed is <span style=\"font-weight:700\">squared</span>, a small change in speed has a much bigger effect than the same change in mass. The surface material matters too — a soft surface makes a deeper, simpler crater than solid rock.\n\n<span style=\"font-weight:700\">Define the system:</span> the impactor + the patch of ground it hits. Energy flows IN as the impactor's kinetic energy and OUT as kinetic energy of flung debris, thermal energy, sound, and seismic waves. The atmosphere is part of the surroundings.\n\nFor scale: the Arizona crater came from a ~50 m iron rock; the Chicxulub impact tied to the dinosaur extinction left a crater about 180 kilometers across." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the crater (before you run it)",
    instructions: "Sketch what you think a crater looks like in cross-section. Draw the incoming rock, the hole, and arrows for where the energy goes when it hits. Then write your prediction: which change makes the BIGGEST crater — more mass, more speed, or softer ground? Wrong is fine — we sketch first so we can compare.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-craters-gravity",
    title: "Class Challenge Board — Read the Crater, Find the Force",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's cracked the gravity code.",
    levels: [
      { n: 1, name: "Run One Impact", nameEs: "Lanza Un Impacto" },
      { n: 2, name: "Find What Controls Crater Size", nameEs: "Halla Qué Controla el Tamaño" },
      { n: 3, name: "Speed Beats Mass", nameEs: "La Velocidad Vence a la Masa" },
      { n: 4, name: "Write the Gravity Law", nameEs: "Escribe la Ley de Gravedad" },
      { n: 5, name: "Predict the Force Change", nameEs: "Predice el Cambio de Fuerza" },
    ] },

  { id: id("embed-crater"), type: "embed", url: CRATER_SIM, scored: true, weight: 5 },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Impact Run Log",
    intro: "As you run the simulator: <span style=\"font-weight:700\">predict the crater diameter BEFORE each run, then record what you actually got.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "runlog", kind: "table", title: "Tracking your impacts",
      columns: [
        { key: "run", label: "Run", width: "60px", placeholder: "1" },
        { key: "mass", label: "Mass (kg)", placeholder: "1000" },
        { key: "speed", label: "Speed (km/s)", placeholder: "12" },
        { key: "predicted", label: "Predicted diameter (m)", placeholder: "your guess" },
        { key: "observed", label: "Observed diameter (m)", placeholder: "what you got" },
      ], minRows: 3, addRowLabel: "Add a run" } ] },

  { id: id("draw-gravity"), type: "sketch", title: "Draw the Gravity Pair",
    instructions: "Draw two objects in space — say Earth and the Moon, or the Sun and an asteroid. Show the gravitational pull between them as a pair of arrows. Then redraw it with the two objects FARTHER apart and show how the arrows change. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-forcetable"), type: "mission_log", title: "Mission Log — Force Response Table",
    intro: "Use the gravity law to fill in how the force responds when you change one thing at a time. The pattern is the whole point.",
    sections: [ { id: "forcetable", kind: "table", title: "How the gravitational force responds",
      columns: [
        { key: "change", label: "Change you make", placeholder: "double the distance…" },
        { key: "effect", label: "Effect on the force", placeholder: "×2, ×4, ×¼ …" },
        { key: "why", label: "Why (mass or distance?)", placeholder: "distance is squared…" },
      ], minRows: 3, addRowLabel: "Add a change" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running impacts. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we made some craters\" into physics." },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — the gravity law in action",
    content: "Newton's law of universal gravitation gives the pull between any two masses:\n\n$$F_g = G \\frac{m_1 m_2}{r^2}$$\n\nHere $G$ is the universal gravitational constant, $m_1$ and $m_2$ are the two masses, and $r$ is the distance between their centers. Two things to notice: <span style=\"font-weight:700\">more mass means more force</span>, and <span style=\"font-weight:700\">force falls off with the square of the distance</span>.\n\nSuppose two asteroids drift twice as far apart. The distance $r$ doubled, so the denominator changes by $2^2 = 4$. The force becomes $\\frac{1}{4}$ as strong — not half. Now double ONE mass instead: the top of the fraction doubles, so the force just doubles. Because $r$ is squared, distance pulls harder on the answer than mass does." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does the crater — and the force — tell you?",
      prompts: [
        { id: "q1", label: "How does the size of an impact crater help scientists figure out what hit Earth and how fast it was moving?", rows: 3 },
        { id: "q2", label: "In the simulator, which single change usually made the crater biggest — doubling mass, or doubling speed? Use $KE = \\frac{1}{2}mv^2$ to explain why.", rows: 3 },
        { id: "q3", label: "The distance between two asteroids is doubled. What happens to the gravitational force between them, and why? Point to the equation.", rows: 2 },
        { id: "q4", label: "In Unit 1 you saw the electric force also follows an inverse-square law, $F_e = k \\frac{q_1 q_2}{r^2}$. Name one way gravity is SIMILAR to the electric force and one important way it is DIFFERENT.", rows: 3 },
        { id: "q5", label: "Use the gravity law to explain why the Moon stays in orbit instead of flying off in a straight line. The Moon already has a sideways velocity — how can a force pointed at Earth bend its path into a circle?", rows: 3 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — add the force",
    intro: "Same asteroid model we've been building. Today we tweak it: add the <span style=\"font-weight:700\">gravitational force</span> as an arrow pulling the rock toward Earth, and note that the force gets stronger as the rock gets closer (it's $1/r^2$). Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l3",
    title: "Class Question Board",
    intro: "Post at least one question you still have about craters or the gravity force. These drive where the unit heads next.",
    starters: [
      "If gravity reaches across empty space, how does it ___?",
      "Why doesn't the Moon ___?",
      "Could we deflect an asteroid by ___?",
      "How big would the crater be if ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"kinetic energy,\" \"impactor,\" \"crater,\" \"gravitation,\" \"mass,\" \"inverse-square,\" \"orbit\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A small asteroid is drifting toward Earth. As it falls, it speeds up, and the closer it gets, the harder Earth seems to pull it. If it lands, it will punch a crater far wider than the rock itself. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the asteroid speeds up as it nears Earth (name the force and how it depends on distance), and why the crater it makes will be much bigger than the rock. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In the impact simulator, which single change usually produces the biggest increase in crater diameter?",
    options: [
      "Doubling the impactor's mass, since more mass means more matter.",
      "Doubling the impactor's speed, because kinetic energy depends on speed squared.",
      "Halving the impactor's mass before it reaches the ground.",
      "Making the target surface rockier and harder than before.",
    ], correctIndex: 1,
    explanation: "Kinetic energy depends on speed squared ($v^2$), so doubling speed quadruples KE. That larger energy deposit generally makes a wider crater than doubling mass, which only doubles KE." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "The distance between two asteroids is doubled. What happens to the gravitational force between them?",
    options: [
      "It becomes one-fourth as strong as it was before the change.",
      "It stays exactly the same as it was before the change.",
      "It doubles, growing larger as the two asteroids move apart.",
      "It becomes half as strong, dropping in step with the distance.",
    ], correctIndex: 0,
    explanation: "Gravitational force is inversely proportional to the square of distance ($1/r^2$). Doubling $r$ makes the denominator $2^2 = 4$, so the force drops to one-fourth." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why is the crater at Meteor Crater, Arizona (about 1,200 m across) so much wider than the iron impactor (about 50 m wide) that made it?",
    options: [
      "The iron rock expanded to fill the hole after it landed.",
      "The crater grew slowly by erosion over the 50,000 years since.",
      "The impactor's kinetic energy blasted out far more rock than its own size.",
      "Scientists measured the rim wrong; the rock was actually 1,200 m.",
    ], correctIndex: 2,
    explanation: "The crater records the impact's ENERGY, not the rock's size. The impactor's huge kinetic energy was deposited into the ground, flinging out far more material than the rock itself." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "In Newton's law of universal gravitation, $F_g = G \\frac{m_1 m_2}{r^2}$, what does $r$ represent?",
    options: [
      "The radius of the larger of the two objects involved.",
      "The combined mass of the two objects added together.",
      "The speed at which the two objects approach each other.",
      "The distance between the centers of the two objects.",
    ], correctIndex: 3,
    explanation: "In the gravitation equation, $r$ is the distance between the centers of the two masses. Because it is squared in the denominator, distance has a strong effect on the force." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "According to Newton's law of universal gravitation, gravity acts between —",
    options: [
      "every pair of masses in the universe, even across empty space.",
      "only objects that are physically touching one another.",
      "only objects that carry an electric charge of some kind.",
      "only objects here on Earth, not things out in space.",
    ], correctIndex: 0,
    explanation: "Universal gravitation means every mass attracts every other mass, no matter how far apart — the force reaches across the vacuum of space, which is why it acts between Earth and the Moon." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Both gravitational force and electric force follow an inverse-square law. What does \"inverse-square\" mean here?",
    options: [
      "The force grows larger as the square of the distance between objects.",
      "The force shrinks as the square of the distance between the objects.",
      "The force depends only on the square of the smaller object's mass.",
      "The force flips direction whenever the distance is squared.",
    ], correctIndex: 1,
    explanation: "Inverse-square means the force is proportional to $1/r^2$: as the distance grows, the force shrinks as the square of that distance. Double the distance and the force drops to one-fourth." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "If you DOUBLE one of the two masses but leave the distance unchanged, the gravitational force —",
    options: [
      "is cut in half, since spreading mass weakens the pull.",
      "stays the same, because only distance changes the force.",
      "doubles, because force is proportional to each mass.",
      "quadruples, since mass is squared in the equation.",
    ], correctIndex: 2,
    explanation: "Force is directly proportional to each mass ($F_g \\propto m_1 m_2$). Doubling one mass doubles the top of the fraction, so the force doubles. Only distance is squared, not mass." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why does the Moon stay in orbit around Earth instead of flying off in a straight line?",
    options: [
      "The Moon has no forces on it, so it simply floats in place.",
      "Earth's atmosphere reaches the Moon and pushes it back each orbit.",
      "The Moon is too heavy to move, so it is stuck above the Earth.",
      "Earth's gravity constantly bends the Moon's sideways motion into a curve.",
    ], correctIndex: 3,
    explanation: "The Moon has a sideways velocity, and Earth's gravity pulls it toward Earth. The force continuously bends that straight-line motion into a closed orbit instead of letting it fly off." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the Moon moving sideways past Earth. Draw an arrow for the Moon's velocity, and a second arrow for Earth's gravitational pull. Show how combining them bends the Moon's path into a curving orbit instead of a straight line. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about craters or gravity that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you learned to read a crater like a detective — the hole records the energy, not just the rock — and you met the force that aims those rocks at us: gravity, reaching across empty space and growing stronger the closer things get. Next arc we ask the flip side: why doesn't the Moon fall? See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Craters & Gravity",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4103,
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
