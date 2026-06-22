// seed-phys-u4-v2-l04.cjs
// U4 v2 — Arc 4: "Why the Moon Doesn't Fall" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (Why Doesn't the Moon Fall Down?) + L08 (Kepler's Laws from Data)
// into one challenge-arc: orbital motion = tangential velocity + gravity pulling
// inward; the conditions for a stable orbit; Kepler's 1st + 2nd laws; and Kepler's
// 3rd law (T^2 ∝ a^3) to predict periods from orbital distance. Through-line:
// "Deflect the Asteroid" — to move a rock off a collision course you have to know
// how orbits actually work, so first we figure out why the Moon never lands.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// new platform blocks + composed Status Check as the U1 pilot. Content repackaged
// verbatim from drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc4.md
// (already sourced/audited). Orbital data = NASA JPL Horizons (from the source).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l04-orbits";
// orbit-gravity-sim embed URL from u4-arc4.md (exact).
const SIM = "https://paps-tools.web.app/orbit-gravity-sim.html";

let _n = 0;
const id = (slug) => `v2u4l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌙", title: "Why the Moon Doesn't Fall",
    subtitle: "Unit 4 · Arc 4 — Deflect the Asteroid" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc, gravity wrote its name in the ground: every crater was a rock that <span style=\"font-weight:700\">fell</span>, pulled in by the same universal force that holds your feet to the floor. So here's the thing that should bug you — the Moon is a giant rock sitting right next to Earth, and gravity is yanking on it constantly. Why hasn't it crashed into us? If we want to push an asteroid <span style=\"font-weight:700\">off</span> a collision course someday, we'd better understand why some rocks never land." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Hold up a pen and let go. It falls. Throw it sideways — it still falls, just farther out. Throw it harder — farther still. Now imagine throwing it so fast that, as it drops toward the ground, the <span style=\"font-weight:700\">ground curves away beneath it</span> at exactly the same rate. It would keep falling and keep missing — forever. That's not a trick. That's an <span style=\"font-weight:700\">orbit</span>. The Moon <span style=\"font-weight:700\">is</span> falling. It's just moving sideways fast enough to keep missing Earth. The thread we pull all arc: gravity supplies the inward pull, sideways speed does the rest, and together they make a path." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the last arc — quantity over polish. Then we go find out why the Moon stays put.",
    sections: [ { id: "recall", kind: "prompts", title: "From craters to orbits",
      prompts: [
        { id: "q1", label: "Last arc you used Newton's law of gravitation. In one sentence, what does gravity do to every meteoroid heading toward Earth?", rows: 2 },
        { id: "q2", label: "If gravity is always pulling the Moon toward Earth, write your best first guess for why it hasn't crashed into us yet.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Find the Stable Orbit",
    content: "You'll fly a satellite in the simulator and figure out the <span style=\"font-weight:700\">exact conditions</span> that turn a fall into a forever-loop. Too slow and it crashes. Too fast and it escapes. Somewhere in between, it circles. Then you'll take <span style=\"font-weight:700\">real orbital data</span> for planets and asteroids and crack the pattern that lets you predict an object's year just from how far out it orbits.\n\nThere are levels. They get harder. Same rule as always — write down what you <span style=\"font-weight:700\">see</span> before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🛰️", style: "info", title: "What's actually happening up there",
    content: "An orbit is a balance between two things: how fast the object moves <span style=\"font-weight:700\">sideways</span> (its tangential velocity) and how hard gravity pulls it <span style=\"font-weight:700\">inward</span> (toward the central body). Gravity never stops pulling — the object is genuinely falling the whole time. But if its sideways speed is just right, the curve of its fall matches the curve of the planet, and it never gets any closer.\n\nThe <span style=\"font-weight:700\">system</span> we'll study is one small object — a planet, moon, or asteroid — orbiting one much bigger central body, like the Sun or Earth. We treat them as an isolated two-body system and ignore the tiny pulls from everything else." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the path (before the sim)",
    instructions: "Draw a planet. Draw a satellite next to it with an arrow for gravity (which way does it point?) and an arrow for the satellite's sideways speed. Sketch the path you THINK it'll take. Then sketch what you think happens if you give it WAY more sideways speed. Wrong is fine — we sketch first so we can compare to the sim later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-orbits",
    title: "Class Challenge Board — Find the Stable Orbit",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's flying what.",
    levels: [
      { n: 1, name: "Make It Fall", nameEs: "Haz que Caiga" },
      { n: 2, name: "Make It Circle", nameEs: "Haz que Orbite en Círculo" },
      { n: 3, name: "Make It Escape", nameEs: "Haz que Escape" },
      { n: 4, name: "Crack Kepler's Pattern", nameEs: "Descifra el Patrón de Kepler" },
      { n: 5, name: "Predict an Unknown Year", nameEs: "Predice un Año Desconocido" },
    ] },

  { id: id("embed-sim"), type: "embed", url: SIM, scored: true, weight: 5 },

  { id: id("ml-trace"), type: "mission_log", title: "Mission Log — Orbit Trial Log",
    intro: "As you fly each launch: <span style=\"font-weight:700\">before you decide why an orbit crashed or escaped, write what you set and what you saw.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "trials", kind: "table", title: "Launch trials",
      columns: [
        { key: "trial", label: "Trial", width: "70px", placeholder: "1" },
        { key: "distance", label: "Starting distance (units)", placeholder: "e.g. 200" },
        { key: "speed", label: "Sideways speed (units)", placeholder: "e.g. 60" },
        { key: "orbit", label: "Result (circle / ellipse / crash / escape)", placeholder: "circle" },
      ], minRows: 3, addRowLabel: "Add a trial" } ] },

  { id: id("draw-orbit"), type: "sketch", title: "Draw the Stable Orbit",
    instructions: "Redraw your scene now that you've flown it. Show the planet, the satellite, the gravity arrow pointing inward, and the sideways-velocity arrow. Draw the actual path you got for a stable orbit. Add a second faint path for the one that escaped. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-kepler-data"), type: "mission_log", title: "Mission Log — Kepler's Data Hunt",
    intro: "Real orbital data below (NASA JPL Horizons, approximate). $a$ is the semi-major axis in AU (1 AU = the average Earth–Sun distance); $T$ is the orbital period in years; $e$ is eccentricity. Fill in $a^3$, $T^2$, and their ratio for each object, then watch what the ratio does.",
    sections: [ { id: "kepler", kind: "table", title: "Distance vs. period — find the pattern",
      columns: [
        { key: "object", label: "Object", width: "90px", placeholder: "Earth" },
        { key: "a3", label: "a³ (AU³)", placeholder: "1.000" },
        { key: "t2", label: "T² (years²)", placeholder: "1.000" },
        { key: "ratio", label: "T² / a³", placeholder: "≈ 1.0" },
      ], minRows: 6, addRowLabel: "Add an object" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop flying. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we crashed a lot of satellites\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "Why doesn't the Moon fall?",
      prompts: [
        { id: "q1", label: "Use tangential velocity and gravitational force to explain why the Moon orbits Earth instead of falling straight down. (Claim: it is BOTH falling and moving sideways. Evidence: what you saw in the sim at just the right speed. Reasoning: connect Newton's gravity to the curved path.)", rows: 4 },
        { id: "q2", label: "Before you ran the sim, what did you predict would happen with more sideways speed? Did the result match? Explain any difference.", rows: 3 },
        { id: "q3", label: "Kepler's 1st law: orbits are ellipses with the central body at one focus — not at the center. Earth's eccentricity is 0.017 (almost a circle); Mercury's is 0.206. What does a bigger eccentricity tell you about an orbit's shape and where the Sun sits?", rows: 3 },
        { id: "q4", label: "Kepler's 2nd law: a line from a planet to the Sun sweeps equal areas in equal times. What does that force a planet to do when it's close to the Sun versus far away?", rows: 2 },
        { id: "q5", label: "**Predict:** a new asteroid orbits the Sun at a = 4.0 AU. Using your $T^2 \\propto a^3$ pattern, estimate its year in Earth-years and show the step.", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — Kepler's 3rd law predicts a year",
    content: "Kepler's third law says the period squared is proportional to the semi-major axis cubed: $$T^2 \\propto a^3$$\n\nIn our Sun-centered units (years and AU), the proportionality constant is just 1, so $T^2 = a^3$.\n\nStep 1 — a newly found asteroid orbits at $a = 4.0\\,\\text{AU}$. Cube it: $a^3 = 4.0^3 = 64$.\n\nStep 2 — that equals $T^2$, so $T = \\sqrt{64} = 8.0$ years.\n\nThe asteroid takes about <span style=\"font-weight:700\">8 Earth-years</span> to circle the Sun once — and we never had to measure it directly. Notice the period grows <span style=\"font-weight:700\">faster</span> than the distance: 4× the distance is 8× the period, because $T$ goes like $a^{3/2}$. Plot $T^2$ against $a^3$ for every planet and they all fall on one straight line through the origin." },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — add the orbit",
    intro: "Same model we've been building all unit. Today we tweak it: show that an orbiting object is <span style=\"font-weight:700\">falling and moving sideways at once</span>, draw gravity pointing inward and velocity tangent to the path, and label the orbit as an ellipse. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about orbits, gravity, or Kepler's laws. These drive where the unit heads next — especially toward actually moving an asteroid.",
    starters: [
      "If the Moon is falling, why doesn't it ___?",
      "What would happen to Earth's orbit if ___?",
      "How could we change an asteroid's orbit so it ___?",
      "Why does the period grow faster than ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we change the ___ of an orbit, will the ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"orbit,\" \"tangential,\" \"velocity,\" \"ellipse,\" \"eccentricity,\" \"semi-major axis,\" \"period,\" \"escape\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A satellite is launched sideways from high above Earth. Gravity pulls it straight down toward the planet the entire time, yet it never crashes — it keeps circling, week after week. Far away, the same physics keeps the Moon looping around Earth and keeps every planet looping around the Sun. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain why the satellite (or the Moon) keeps circling instead of falling straight down. Use the words tangential velocity and gravity, and describe what \"falling but always missing\" means. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In the simulator you launch a satellite from the same distance but give it a *larger* sideways speed. What happens to its orbit?",
    options: [
      "It enters a larger orbit or escapes the planet entirely.",
      "It falls straight down toward the planet much faster.",
      "It stops moving and hovers at the starting distance.",
      "It spirals inward and crashes into the planet's surface.",
    ], correctIndex: 0,
    explanation: "A higher sideways speed means the satellite travels farther while falling the same vertical distance, so its falling path matches a larger ellipse — and with enough speed it becomes an open escape trajectory." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "Why doesn't the Moon fall straight down into Earth, even though gravity constantly pulls it toward Earth?",
    options: [
      "Earth's gravity is too weak to reach as far as the Moon's distance.",
      "It is moving sideways fast enough to keep missing Earth as it falls.",
      "The Moon makes its own outward force that exactly cancels gravity.",
      "The Sun pulls the Moon upward and away from Earth's surface.",
    ], correctIndex: 1,
    explanation: "The Moon is falling toward Earth the whole time, but its tangential (sideways) speed is large enough that Earth curves away beneath it just as fast. An orbit is a fall that never lands." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Kepler's first law describes the shape of planetary orbits. According to it, orbits are —",
    options: [
      "perfect circles with the Sun fixed exactly at the center point.",
      "spirals that slowly wind the planet inward toward the Sun.",
      "ellipses, with the Sun located at one focus of the ellipse.",
      "straight lines until a planet is deflected by another planet.",
    ], correctIndex: 2,
    explanation: "Kepler's first law: every orbit is an ellipse with the central body at one focus, not at the center. Even a nearly circular orbit (small eccentricity) has the Sun slightly off-center." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Earth's orbital eccentricity is 0.017 and Mercury's is 0.206. What does Mercury's larger eccentricity tell you?",
    options: [
      "Mercury orbits the Sun much faster than Earth does at every point.",
      "Mercury is more massive, so its gravity stretches its own orbit out.",
      "Mercury's orbit is exactly circular while Earth's is the elliptical one.",
      "Mercury's orbit is more stretched-out, so the Sun is farther off-center.",
    ], correctIndex: 3,
    explanation: "Eccentricity measures how stretched an ellipse is. A larger value means a more elongated orbit with the Sun farther from the center; Earth's tiny 0.017 means its orbit is nearly circular." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Kepler's second law says a line from a planet to the Sun sweeps out equal areas in equal times. This means a planet —",
    options: [
      "moves faster when it is closer to the Sun than when it is far away.",
      "always travels at one constant speed around its entire orbit.",
      "moves faster when it is farther from the Sun than when it is close.",
      "speeds up and slows down at random points all along its orbit.",
    ], correctIndex: 0,
    explanation: "To sweep equal areas in equal times, a planet must cover more arc when it is near the Sun — so it moves fastest at its closest approach and slowest when farthest away." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "A newly discovered asteroid orbits the Sun at a semi-major axis of $a = 4.0$ AU. Using Kepler's third-law pattern ($T^2 \\propto a^3$), about how long is its year?",
    options: [
      "About 4 years, because the period simply equals the distance in AU.",
      "About 8 years, because $T^2 \\approx a^3$ gives $T \\approx \\sqrt{4^3} = \\sqrt{64}$.",
      "About 16 years, because the period is the distance squared each time.",
      "About 2 years, because larger orbits always finish more quickly.",
    ], correctIndex: 1,
    explanation: "Kepler's third law: $T^2 \\propto a^3$. For $a = 4$ AU, $a^3 = 64$, so $T = \\sqrt{64} = 8$ years." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "As the semi-major axis of an orbit gets larger, how does the orbital period change?",
    options: [
      "It stays the same, because every orbit takes exactly one year to finish.",
      "It gets shorter, because objects farther out move faster around the Sun.",
      "It grows, and it grows faster than the distance does ($T$ goes like $a^{3/2}$).",
      "It grows in direct proportion, so doubling distance doubles the period.",
    ], correctIndex: 2,
    explanation: "From $T^2 \\propto a^3$, the period scales as $a^{3/2}$, so it grows faster than the distance: 4× the distance gives 8× the period, not 4×." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "In the two-body system we studied, what two ingredients combine to produce a stable orbit?",
    options: [
      "An outward push from the planet plus a constant pull from the distant Sun.",
      "A tangential (sideways) velocity plus gravity pulling the object inward.",
      "Two equal gravitational pulls from two planets that cancel each other out.",
      "A steady forward thrust from the object's engine plus air resistance.",
    ], correctIndex: 1,
    explanation: "A stable orbit comes from the object's sideways (tangential) velocity combined with gravity pulling it continuously inward. There is no outward force and no engine — just falling and missing." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a planet with a satellite in a stable circular orbit. Draw one arrow for gravity (which way?) and one arrow for the satellite's velocity (which way?). Then draw a faint second path showing what happens if you doubled the sideways speed. Label which is which. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about orbits that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "Today you found out the Moon never falls because it's <span style=\"font-weight:700\">always</span> falling — it just keeps missing. You found the conditions for a stable orbit and cracked Kepler's pattern, so now you can predict a world's year from nothing but its distance. Next we use all of this to do the thing we actually came here for: figure out how to nudge an asteroid off a collision course. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Why the Moon Doesn't Fall",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4104,
  visible: false,
  gradesReleased: true,
  challengeId: "u4-orbits",
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
