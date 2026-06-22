// seed-phys-u3-v2-l04.cjs
// U3 v2 — Arc 4: "Track the Momentum" (OpenSciEd-spine / Rober-engine).
// Merges v1 L07 (Momentum) + L08 (Conservation of Momentum) into one challenge-arc.
// Physics: momentum p = mv as a VECTOR; predict 1D collision outcomes; CONSERVATION of
// momentum (define the system; total before = total after for an isolated system).
// Through-line: "Survive the Crash" — to understand a crash you must track the momentum,
// and in an isolated system it never disappears, it only gets shared.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U1 pilot arcs. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u3/u3-arc4.md (sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses -> safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u3-v2-l04-momentum";
// Both embed URLs come straight from u3-arc4.md: the open collision sim (L07) and its
// closed-system mode (L08). Two separate scored embed blocks.
const COLLISION_SIM = "https://paps-tools.web.app/collision-sim-1d.html";
const COLLISION_SIM_CLOSED = "https://paps-tools.web.app/collision-sim-1d.html?mode=closed-system";

let _n = 0;
const id = (slug) => `v2u3l4-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🚗", title: "Momentum",
    subtitle: "Unit 3 · Arc 4 — Survive the Crash" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you proved a crash is an <span style=\"font-weight:700\">interaction</span> — Newton's 3rd law, the two cars push on each other with equal and opposite force. Good. But force alone won't tell you which way the wreck slides afterward. Today we add the missing piece: <span style=\"font-weight:700\">momentum</span>. Track it through a crash and you can predict the outcome — and find out why it never actually disappears. Surviving the crash starts with tracking the momentum." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Picture a parked semi-truck and a soccer ball rolling at it. The ball bounces off and barely budges the truck. Now picture that same truck rolling slowly into a parked car. The car gets launched. Same speed isn't the whole story — <span style=\"font-weight:700\">mass matters too</span>.\n\nThat combination of mass and motion is what we're chasing today. It's called <span style=\"font-weight:700\">momentum</span>, and it's the quantity that actually gets shared and traded when things collide." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from the last arc — quantity over polish. Then we go track the momentum.",
    sections: [ { id: "recall", kind: "prompts", title: "Forces in a crash",
      prompts: [
        { id: "q1", label: "From last arc: when two cars collide, how do the forces they exert on each other compare? (Newton's 3rd law.)", rows: 2 },
        { id: "q2", label: "A heavy, slow truck and a light, fast car — which one is *harder to stop*? Make a guess and say why.", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Track the Momentum",
    content: "Take any 1D collision — head-on, rear-end, one car parked — and <span style=\"font-weight:700\">track the momentum all the way through it</span>. Find the momentum of each object before. Predict what happens. Then add it all up after and prove the total didn't change. Your job isn't done until you can show the momentum <span style=\"font-weight:700\">before equals the momentum after</span> for the whole system.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🛻", style: "info", title: "The quantity you're tracking",
    content: "<span style=\"font-weight:700\">Momentum</span> ($\\vec{p}$) is the product of an object's <span style=\"font-weight:700\">mass</span> ($m$) and its <span style=\"font-weight:700\">velocity</span> ($\\vec{v}$): $\\vec{p} = m\\vec{v}$. Because velocity has a direction, momentum is a <span style=\"font-weight:700\">vector</span> — it points the way the object moves. Two objects can have the same speed but opposite momenta if they head in opposite directions.\n\n<span style=\"font-weight:700\">Define the system.</span> Today the system is two vehicles on a straight track. We ignore friction and outside forces, so the system is <span style=\"font-weight:700\">isolated</span>. In an isolated system, the total momentum before a collision equals the total momentum after — that's the rule we test." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — your crash (before the build)",
    instructions: "Pick a 1D collision (head-on, rear-end, or one car parked). Sketch the two objects with an arrow on each showing how fast and which way it moves. Then predict — draw what you think happens right after they hit. Wrong is fine; we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u3-momentum",
    title: "Class Challenge Board — Track the Momentum",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's tracking what.",
    levels: [
      { n: 1, name: "Find One Momentum", nameEs: "Encuentra Un Momento" },
      { n: 2, name: "Compare Two Momenta", nameEs: "Compara Dos Momentos" },
      { n: 3, name: "Predict the Outcome", nameEs: "Predice el Resultado" },
      { n: 4, name: "Add It Up After", nameEs: "Súmalo Después" },
      { n: 5, name: "Prove It's Conserved", nameEs: "Demuestra que se Conserva" },
    ] },

  { id: id("embed-sim"), type: "embed", url: COLLISION_SIM, scored: true, weight: 5 },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Collision Trace Log",
    intro: "As you run the simulator and the levels: <span style=\"font-weight:700\">predict before you peek.</span> Documented reasoning = a scientist move = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Tracking the collision",
      columns: [
        { key: "trial", label: "Trial", width: "120px", placeholder: "same mass, head-on" },
        { key: "pred_speed", label: "Predicted final speed(s) (m/s)", placeholder: "?" },
        { key: "pred_dir", label: "Predicted direction(s)", placeholder: "left / right / stop" },
        { key: "sim_speed", label: "Simulator final speed(s) (m/s)", placeholder: "from the sim" },
        { key: "sim_dir", label: "Simulator direction(s)", placeholder: "from the sim" },
      ], minRows: 3, addRowLabel: "Add a trial" } ] },

  { id: id("draw-after"), type: "sketch", title: "Draw the Collision",
    instructions: "Redraw your collision now that you've run it. Show each object as a box with a momentum arrow (longer arrow = more momentum) BEFORE, and a second pair of arrows AFTER. Make the before-arrows and after-arrows add up to the same total. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  // The closed-system mode of the same sim (from L08): a second scored embed.
  { id: id("setup-closed"), type: "callout", icon: "🔒", style: "info", title: "Now lock the system",
    content: "Switch to the <span style=\"font-weight:700\">closed-system</span> mode below. Same sim, but now it tallies the total momentum of <span style=\"font-weight:700\">both vehicles together</span> before and after each crash. Watch that total as the individual cars change velocity — your job is to catch it staying the same." },

  { id: id("embed-sim-closed"), type: "embed", url: COLLISION_SIM_CLOSED, scored: true, weight: 5 },

  { id: id("ml-budget"), type: "mission_log", title: "Mission Log — Momentum Accounting",
    intro: "Account for the momentum in your collision. One row per object — its momentum before and after. The two BEFORE values should add to the same total as the two AFTER values.",
    sections: [ { id: "budget", kind: "table", title: "Momentum budget (sign = direction)",
      columns: [
        { key: "object", label: "Object", placeholder: "Car A / Truck B" },
        { key: "p_before", label: "Momentum BEFORE (kg·m/s, + or −)", placeholder: "+800" },
        { key: "p_after", label: "Momentum AFTER (kg·m/s, + or −)", placeholder: "−100" },
      ], minRows: 3, addRowLabel: "Add an object" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop running trials. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we crashed some carts\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened to the momentum?",
      prompts: [
        { id: "q1", label: "Why is momentum a *vector*? Give one example from your trials where two objects had the same speed but opposite momenta.", rows: 3 },
        { id: "q2", label: "After several trials, describe the pattern you saw in the *total* momentum before vs. after each collision.", rows: 2 },
        { id: "q3", label: "Car A has momentum $+800$ kg·m/s and Car B has $-500$ kg·m/s before a crash on icy (frictionless) road. What is the total momentum of the two-car system right after? Defend it with conservation of momentum.", rows: 3 },
        { id: "q4", label: "Define your system. What objects did you include? Name one external force (road, air, ground) that would make the system *not* perfectly isolated.", rows: 2 },
        { id: "q5", label: "**Predict:** a small car rear-ends a massive truck stopped at a red light. What happens to the *total* momentum of the two-vehicle system, and why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — does the momentum balance?",
    content: "Truck A: mass <span style=\"font-weight:700\">2,000 kg</span>, moving right at <span style=\"font-weight:700\">10 m/s</span>. Car B: mass <span style=\"font-weight:700\">1,000 kg</span>, moving left at <span style=\"font-weight:700\">20 m/s</span>. Right = positive.\n\nStep 1 — momentum before (use $p = mv$ with sign for direction):\n\n$$p_A = (2000)(+10) = +20{,}000\\,\\text{kg·m/s}$$\n$$p_B = (1000)(-20) = -20{,}000\\,\\text{kg·m/s}$$\n\nStep 2 — total before:\n\n$$p_{total} = +20{,}000 + (-20{,}000) = 0\\,\\text{kg·m/s}$$\n\nStep 3 — the system is isolated, so the total after must ALSO be $0$. If the two stick together, the wreck sits still. If they bounce, whatever momentum one carries away, the other carries the opposite — the vector sum stays zero. The momentum didn't disappear; it balanced.\n\nIn one dimension, for two objects: $m_1 v_{1,i} + m_2 v_{2,i} = m_1 v_{1,f} + m_2 v_{2,f}$." },

  { id: id("consensus"), type: "consensus_model", roundId: "u3-crash-model",
    title: "Tweak Our Class Crash Model — add the momentum",
    intro: "Same crash model we've been building. Today we tweak it: label each object with a <span style=\"font-weight:700\">momentum vector</span> ($p = mv$), draw the system boundary around both vehicles, and show the total momentum staying the same before and after. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u3-l4",
    title: "Class Question Board",
    intro: "Post at least one question you still have about momentum in a crash. These drive where the unit heads next.",
    starters: [
      "If total momentum is always conserved, why does ___?",
      "What happens to the momentum when ___?",
      "How does the system change if we include ___?",
      "Could two cars ever end up with more total momentum than ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the momentum ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"momentum,\" \"vector,\" \"velocity,\" \"system,\" \"isolated,\" \"conserved\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Two cars meet on a flat, icy road where friction barely matters. Car A rolls east; Car B rolls west. They collide. Treat the two cars together as your system, and use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Describe the momentum of each car before the crash (mass, speed, direction) and explain what conservation of momentum tells you about the total momentum of the two-car system right after. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Truck A has a mass of 2,000 kg and a speed of 10 m/s. Truck B has a mass of 1,000 kg and a speed of 20 m/s. Both move the same direction. Which one has more momentum?",
    options: [
      "Truck A, because a heavier object always carries more momentum.",
      "Truck B, because a faster object always carries more momentum.",
      "They have the same momentum, since each one works out to 20,000 kg·m/s.",
      "There is not enough information, because the directions are not given.",
    ], correctIndex: 2,
    explanation: "Momentum is $p = mv$. Truck A: $2{,}000 \\times 10 = 20{,}000$ kg·m/s. Truck B: $1{,}000 \\times 20 = 20{,}000$ kg·m/s. The magnitudes are equal." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A 1,500 kg car moves east at 12 m/s. A second identical car moves west at 12 m/s. How do their momenta compare?",
    options: [
      "They have equal magnitude but point in opposite directions.",
      "They are exactly equal, because the two cars are identical.",
      "The eastbound car has more, because east counts as positive.",
      "They are the same, because momentum has no direction at all.",
    ], correctIndex: 0,
    explanation: "Momentum is a vector. Equal masses and equal speeds give equal magnitudes, but opposite velocities give opposite (oppositely-signed) momenta." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "Why do physicists say momentum is a vector rather than just a number?",
    options: [
      "Because momentum is always a very large number in a real crash.",
      "Because momentum is found by multiplying two different masses together.",
      "Because momentum can be measured only while an object speeds up.",
      "Because momentum has a direction — it points the way the object moves.",
    ], correctIndex: 3,
    explanation: "Momentum is $\\vec{p} = m\\vec{v}$. Velocity carries a direction, so momentum carries that same direction. That's what makes it a vector, not just a magnitude." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "What does it mean to treat the two crashing cars as an \"isolated system\"?",
    options: [
      "No outside force acts on the pair, so their total momentum is conserved.",
      "The two cars are parked far apart and never actually touch each other.",
      "Each car is studied completely on its own, ignoring the other car.",
      "The cars are sealed off so that absolutely no energy can ever escape.",
    ], correctIndex: 0,
    explanation: "An isolated system has no net external force. During the brief collision, the cars' forces on each other dwarf outside forces, so we treat the pair as isolated and the total momentum is conserved." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Two cars collide on a flat, icy road where friction is negligible. Car A has momentum $+800$ kg·m/s and Car B has $-500$ kg·m/s before the crash. What is the total momentum of the two-car system right after?",
    options: [
      "It becomes $+1300$ kg·m/s, since the two momenta simply add as numbers.",
      "It stays $+300$ kg·m/s, because momentum is conserved in the isolated pair.",
      "It becomes $-300$ kg·m/s, because the negative value flips the total over.",
      "It cannot be found, because the crumpling of the cars changes the total.",
    ], correctIndex: 1,
    explanation: "Total momentum is conserved for the isolated two-car system: $800 + (-500) = +300$ kg·m/s. Crumpling changes kinetic energy, but it does not change the system's total momentum." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "In a head-on collision between a heavy, slow truck and a light, fast car with equal-magnitude momenta, what happens right after they hit (if they stick together)?",
    options: [
      "The combined wreck speeds up, because two momenta always add together.",
      "The truck keeps its full original speed, since heavier objects never slow.",
      "The wreck is momentarily at rest, since the opposite momenta sum to zero.",
      "The car reverses to its original speed, since it was the faster of the two.",
    ], correctIndex: 2,
    explanation: "Equal-magnitude, opposite-direction momenta sum to zero. Conservation says the total after must also be zero, so a stuck-together wreck has zero momentum — momentarily at rest." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "A small car rear-ends a massive truck that is stopped at a red light. From just before to just after, what happens to the *total* momentum of the two-vehicle system?",
    options: [
      "It rises sharply, because the violent impact pumps in extra momentum.",
      "It drops to zero, because the truck was not moving before the crash.",
      "It reverses direction, because the truck pushes harder than the small car.",
      "It stays the same, because the isolated system conserves total momentum.",
    ], correctIndex: 3,
    explanation: "The two-vehicle system is treated as isolated during the crash, so the total momentum is conserved. The car had momentum and the truck had zero; afterward they share that same total." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "During a crash, the cars crumple and a lot of kinetic energy is lost to bending metal. What does this do to the total momentum of the isolated two-car system?",
    options: [
      "Nothing — the total momentum is still conserved even though energy is lost.",
      "It lowers the total momentum, because crumpling soaks up some of the motion.",
      "It raises the total momentum, because crumpling stores it inside the metal.",
      "It zeroes the total momentum, because a wreck that crumples always stops.",
    ], correctIndex: 0,
    explanation: "Crumpling converts kinetic energy into internal (deformation and thermal) energy, but it is an internal interaction. With no net external force, the total momentum of the isolated system is unchanged." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch two cars approaching head-on with momentum arrows (label one $+800$ kg·m/s, the other $-500$ kg·m/s). Then draw the moment right after the crash and label the total momentum of the system. Show that your before-total and after-total match. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about momentum in a crash that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You tracked the momentum through a crash today — found it for each object, used its direction, and proved that for an isolated system the total before equals the total after. The momentum didn't vanish in the wreck; it just got shared. Next class we keep figuring out how to survive the crash. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Momentum",
  unit: "Unit 3: Forces & Momentum — v2",
  order: 3104,
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
