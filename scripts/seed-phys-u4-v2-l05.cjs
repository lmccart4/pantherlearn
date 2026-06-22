// seed-phys-u4-v2-l05.cjs
// U4 v2 — Arc 5: "Shape the Orbit, Read the Energy" (OpenSciEd-spine / Rober-engine).
// Merges v1 L09 (Orbits Have a Shape) + L10 (Gravitational Energy Transfer) into one
// challenge-arc: orbits are ELLIPSES (eccentricity, semi-major axis, perihelion/aphelion);
// an asteroid's stretched orbit can cross Earth's near-circular one; an orbiting object
// SPEEDS UP as it falls inward and SLOWS as it climbs out — a GPE ↔ KE trade with the
// Sun-object system's total energy conserved. Through-line: "Deflect the Asteroid" — know
// the orbit's shape AND its energy, and you know where + how fast the rock will arrive.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as U1. Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u4/u4-arc5.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u4-v2-l05-orbit-energy";
// Orbit simulator in ellipses mode — exact URL from _v1-source-u4/u4-arc5.md (L09 embed).
const ORBIT = "https://paps-tools.web.app/orbit-gravity-sim.html?mode=ellipses";

let _n = 0;
const id = (slug) => `v2u4l5-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🛰️", title: "Orbit Shape & Energy",
    subtitle: "Unit 4 · Arc 5 — Gravity, Orbits & Energy" },

  // ── CONNECT: recall prior arc → today's question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you learned why the Moon doesn't fall on our heads and you pulled Kepler's rule straight out of orbit data: $T^2 \\propto a^3$. Today we ask two questions that decide whether we can <span style=\"font-weight:700\">deflect</span> an incoming rock: what <span style=\"font-weight:700\">shape</span> is its orbit, and why does it <span style=\"font-weight:700\">speed up</span> as it dives toward us? Know the shape and the energy, and you know where — and how fast — the asteroid arrives." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "A circle is the boring case. Most orbits are <span style=\"font-weight:700\">ellipses</span> — stretched circles with the Sun sitting at one focus, not the center. The same fall-forever idea from last arc still runs the show: the rock is always falling toward the Sun, it just keeps missing. But on a stretched orbit it gets <span style=\"font-weight:700\">close</span> sometimes and <span style=\"font-weight:700\">far</span> other times — and that's exactly when its speed changes. That speed change is the whole reason a far-off asteroid can show up fast enough to do real damage." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from Arc 4 — quantity over polish. Then we go shape some orbits.",
    sections: [ { id: "recall", kind: "prompts", title: "What keeps something in orbit?",
      prompts: [
        { id: "q1", label: "In one sentence: why doesn't the Moon fall down onto Earth, even though gravity is pulling on it the whole time?", rows: 2 },
        { id: "q2", label: "If a rock in the asteroid belt is so far away, why should anyone on Earth worry about it ever reaching us?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Shape the Orbit, Read the Energy",
    content: "Take control of one object orbiting the Sun. Change its starting distance and its sideways (tangential) speed, and figure out what controls the <span style=\"font-weight:700\">shape</span> of the orbit — circle, ellipse, or escape. Then track its <span style=\"font-weight:700\">energy</span>: where is it fastest, where is it slowest, and where did that speed come from? Your job isn't done until you can predict the orbit AND explain the speed at any point using energy.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🔭", style: "info", title: "The system you're working with",
    content: "Your <span style=\"font-weight:700\">system</span> is the Sun plus one orbiting object — an asteroid, say. The path is fixed by two things: how far out it starts, and how fast it's moving <span style=\"font-weight:700\">sideways</span> (tangentially). Too little speed and it falls in. Too much speed and it escapes for good. Just the right speed gives a repeating ellipse.\n\nGravity is the only interaction doing work in this system, so we treat it as <span style=\"font-weight:700\">isolated</span>: energy only moves between gravitational potential energy and kinetic energy — it never leaks out. Clue for later: the asteroid that hit near Chelyabinsk was a far-traveler that arrived <span style=\"font-weight:700\">fast</span>. Today you'll see where that speed comes from." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your orbit (before you test it)",
    instructions: "Sketch the Sun and one stretched, oval orbit around it. Mark the point where you think the object moves FASTEST and the point where you think it moves SLOWEST. You'll test your guess in the simulator next — wrong is totally fine.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u4-asteroid-model",
    title: "Class Challenge Board — Shape the Orbit, Read the Energy",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's mapped which orbits.",
    levels: [
      { n: 1, name: "Make a Circle", nameEs: "Haz un Círculo" },
      { n: 2, name: "Stretch It to an Ellipse", nameEs: "Estírala a una Elipse" },
      { n: 3, name: "Find Fast and Slow", nameEs: "Encuentra Rápido y Lento" },
      { n: 4, name: "Trade GPE for KE", nameEs: "Cambia GPE por KE" },
      { n: 5, name: "Cross Earth's Orbit", nameEs: "Cruza la Órbita de la Tierra" },
    ] },

  { id: id("embed-orbit"), type: "embed", url: ORBIT, scored: true, weight: 5 },

  { id: id("ml-trials"), type: "mission_log", title: "Mission Log — Orbit Trials",
    intro: "Keep the starting distance the same and change the tangential speed across trials. <span style=\"font-weight:700\">Write what you saw before you name the shape.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "trials", kind: "table", title: "Shaping the orbit",
      columns: [
        { key: "trial", label: "Trial", width: "70px", placeholder: "1" },
        { key: "speed", label: "Tangential speed (rel. units)", placeholder: "low / circular / faster…" },
        { key: "shape", label: "Orbit shape observed", placeholder: "falls in / circle / ellipse / escapes" },
        { key: "bound", label: "Still bound to the Sun? (yes / no)", placeholder: "yes" },
      ], minRows: 4, addRowLabel: "Add a trial" } ] },

  { id: id("draw-energy"), type: "sketch", title: "Draw the Energy Around the Orbit",
    instructions: "Redraw your ellipse. Label the closest point (perihelion) and the farthest point (aphelion). At each end write whether KE is high or low and whether GPE is high or low. Add a short arrow for the object's speed at each end — long arrow = fast. Show your current thinking; neat doesn't matter.",
    canvasHeight: 340 },

  { id: id("ml-account"), type: "mission_log", title: "Mission Log — Energy Accounting",
    intro: "Account for the energy at the two ends of the orbit. The total ($KE + GPE$) should read the SAME on both rows — that's conservation.",
    sections: [ { id: "account", kind: "table", title: "Energy at each end of the orbit",
      columns: [
        { key: "location", label: "Location", placeholder: "perihelion / aphelion" },
        { key: "gpe", label: "GPE (high / low)", placeholder: "low = closest, high = farthest" },
        { key: "ke", label: "KE and speed (high / low)", placeholder: "high = fast" },
        { key: "total", label: "KE + GPE (same both rows?)", placeholder: "constant" },
      ], minRows: 2, addRowLabel: "Add a location" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop simulating. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we watched a dot loop around\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What shapes the orbit, and where does the speed come from?",
      prompts: [
        { id: "q1", label: "You kept the starting distance fixed and slowly increased the tangential speed. Describe the sequence of orbit shapes you got, from too-slow all the way to escape.", rows: 3 },
        { id: "q2", label: "An object speeds up as it falls toward the Sun and slows as it moves away. Explain this using gravitational potential energy and kinetic energy. Where is it fastest? Slowest?", rows: 3 },
        { id: "q3", label: "Earth's orbit is nearly a circle, but some asteroids ride stretched ellipses that cross Earth's path. Explain how an asteroid can start far out in the belt and still end up on a collision course with us.", rows: 3 },
        { id: "q4", label: "A comet is moving away from the Sun toward the outer solar system. What is happening to its GPE, its KE, and its speed — and why?", rows: 2 },
        { id: "q5", label: "Connect it to the mission: why is a faster-arriving asteroid a bigger impact threat than a slow one, even if they're the same size?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked idea — the energy trade around an ellipse",
    content: "Treat the Sun plus the asteroid as an isolated system. Gravity is the only interaction doing work, so the total mechanical energy stays constant:\n\n$$KE + GPE = \\text{constant}$$\n\nAt <span style=\"font-weight:700\">perihelion</span> (closest to the Sun) the GPE is at its lowest (most negative), so the KE must be highest — the asteroid is moving <span style=\"font-weight:700\">fastest</span>. At <span style=\"font-weight:700\">aphelion</span> (farthest) the GPE is at its highest (least negative), so the KE is lowest — it crawls along at its <span style=\"font-weight:700\">slowest</span>. As it falls inward, GPE converts into KE: $\\Delta KE = -\\Delta GPE$, where $KE = \\frac{1}{2}mv^2$.\n\nEscape is just the special case where there's enough KE to climb all the way out of the gravity well: $KE + GPE \\geq 0$, so the object never falls back. Below that, it stays bound and keeps tracing the ellipse." },

  { id: id("consensus"), type: "consensus_model", roundId: "u4-asteroid-model",
    title: "Tweak Our Class Model — add orbit shape + energy",
    intro: "Same asteroid model we've been building all unit. Today we tweak it: show the orbit as a stretched <span style=\"font-weight:700\">ellipse</span> with the Sun at one focus, and add where the rock is <span style=\"font-weight:700\">fast</span> (close, low GPE / high KE) and where it's <span style=\"font-weight:700\">slow</span> (far, high GPE / low KE). Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u4-l5",
    title: "Class Question Board",
    intro: "Post at least one question you still have about orbit shape or orbital energy. These drive where the unit heads next.",
    starters: [
      "If total energy is conserved, why does the speed ___?",
      "What sets how stretched an orbit is when ___?",
      "Could we change an asteroid's orbit by changing its ___?",
      "Where does the energy go if an orbiting object ___?",
    ] },

  // ── NAVIGATE: testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc — where we actually try to deflect the rock. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we change the ___, will the orbit ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"ellipse,\" \"eccentricity,\" \"semi-major axis,\" \"perihelion,\" \"aphelion,\" \"tangential,\" \"escape velocity\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "An asteroid rides a long, stretched ellipse with the Sun at one focus. Right now it's way out near aphelion, crawling slowly. Over the next few years it falls inward toward perihelion — and its path happens to cross Earth's nearly circular orbit. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> As the asteroid falls from aphelion toward perihelion, describe what happens to its gravitational potential energy, its kinetic energy, and its speed — and explain why a faster arrival makes it a bigger threat. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "In the simulator you keep the starting distance the same but steadily increase the tangential speed. What happens to the orbit?",
    options: [
      "It becomes more circular, then more elliptical, and can eventually escape.",
      "It always stays a perfect circle no matter how fast the object is moving.",
      "It shrinks into a tighter circle and then crashes straight into the Sun.",
      "It immediately reverses its direction and spirals inward toward the Sun.",
    ], correctIndex: 0,
    explanation: "At low speed the object falls inward; at just the right speed it circles; at higher speeds the ellipse stretches; above escape speed it's no longer bound and leaves." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "An asteroid moves from aphelion (far from the Sun) inward to perihelion (close to the Sun). Which energy statement is correct?",
    options: [
      "Both its kinetic energy and its gravitational potential energy stay the same.",
      "Its kinetic energy increases and its gravitational potential energy decreases.",
      "Its kinetic energy decreases and its gravitational potential energy increases.",
      "Its total energy increases the whole way because the asteroid is speeding up.",
    ], correctIndex: 1,
    explanation: "Falling toward the Sun, GPE converts into KE — so KE rises and GPE drops. The total energy of the isolated system stays constant." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Around an elliptical orbit, where is an orbiting object moving the fastest?",
    options: [
      "At aphelion, the farthest point, because it has had the most time to build speed.",
      "Exactly halfway between aphelion and perihelion, where the two effects cancel.",
      "At perihelion, the closest point to the Sun, where its kinetic energy is highest.",
      "Its speed is the same everywhere because the total energy never changes at all.",
    ], correctIndex: 2,
    explanation: "At perihelion GPE is lowest, so KE — and therefore speed — is highest. The object is fastest at its closest approach." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "What does the eccentricity ($e$) of an orbit describe?",
    options: [
      "How massive the central body at the focus of the orbit happens to be.",
      "How long the orbiting object takes to complete one full trip around.",
      "The total distance the object travels during a single complete orbit.",
      "How stretched the ellipse is — $e = 0$ is a circle, $0 \\lt e \\lt 1$ is an ellipse.",
    ], correctIndex: 3,
    explanation: "Eccentricity measures how stretched an orbit is. A value of 0 is a perfect circle; values between 0 and 1 are increasingly stretched ellipses." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "In an elliptical orbit around the Sun, where is the Sun actually located?",
    options: [
      "At one of the two foci of the ellipse, not at its geometric center.",
      "Exactly at the center of the ellipse, halfway between the two ends.",
      "At the perihelion end, the point where the orbit comes closest in.",
      "Outside the orbit entirely, off to one side of the whole ellipse.",
    ], correctIndex: 0,
    explanation: "For an orbit, the central body sits at one focus of the ellipse — offset from the center. That's why one end (perihelion) is closer than the other (aphelion)." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "How can an asteroid that starts far out in the asteroid belt end up crossing Earth's nearly circular orbit?",
    options: [
      "Earth's gravity reaches all the way out and drags the asteroid inward to us.",
      "Its stretched, eccentric orbit shares the Sun as a focus and dips into the inner system.",
      "The asteroid speeds up so much that it leaves its own orbit and finds a new one.",
      "Asteroids have no orbit at all, so they drift in random straight lines toward Earth.",
    ], correctIndex: 1,
    explanation: "A highly eccentric orbit with the Sun at one focus can swing from the belt down into the inner solar system, crossing Earth's near-circular path at the right moment." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Treating the Sun plus one orbiting asteroid as an isolated system, what stays constant as the asteroid loops around its orbit?",
    options: [
      "Its kinetic energy alone, since speed is what really matters for an orbit.",
      "Its gravitational potential energy alone, since its position keeps shifting.",
      "The sum of its kinetic energy and gravitational potential energy together.",
      "Nothing at all stays constant once the orbit is a stretched-out ellipse.",
    ], correctIndex: 2,
    explanation: "Gravity is the only interaction doing work, so the total mechanical energy $KE + GPE$ is conserved. KE and GPE trade back and forth, but their sum is fixed." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "What does it mean for an object to reach escape velocity?",
    options: [
      "Its kinetic energy is just large enough to climb out of the gravity well and not fall back.",
      "It is moving fast enough to settle into the smallest possible circular orbit it can.",
      "It has slowed down so much at aphelion that gravity can no longer hold onto it.",
      "Its gravitational potential energy has dropped low enough to trap it near the Sun.",
    ], correctIndex: 0,
    explanation: "At escape velocity the object's KE is enough that $KE + GPE \\geq 0$ — it can climb all the way out of the gravitational well and never falls back. Below it, the object stays bound." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch the Sun at one focus of a stretched ellipse. Draw the asteroid at perihelion with a long speed arrow (fast, low GPE / high KE) and at aphelion with a short speed arrow (slow, high GPE / low KE). Add a note that KE + GPE is the same at both ends. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about orbit shape or orbital energy that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You shaped real orbits today — stretched a circle into an ellipse, found where the rock is fast and where it's slow, and traced the energy trading back and forth without ever leaking away. That's exactly what we need to know to catch an asteroid before it gets here. Next class we try to deflect it. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Orbit Shape & Energy",
  unit: "Unit 4: Gravity, Orbits & Energy — v2",
  order: 4105,
  visible: false,
  gradesReleased: true,
  challengeId: "u4-orbit-energy",
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
