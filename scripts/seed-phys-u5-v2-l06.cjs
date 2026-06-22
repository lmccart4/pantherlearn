// seed-phys-u5-v2-l06.cjs
// U5 v2 — Arc 6: "Send the Signal" (OpenSciEd-spine / Rober-engine).
// Merges v1 L11 (Sending Information Through Space) + L12 (Signals in the City) into one
// challenge-arc: "Cover the City." EM waves carry INFORMATION, not just energy — a property
// of a carrier wave is deliberately changed (modulated): amplitude (AM), frequency (FM), or
// digital on/off (WiFi/cell/5G). Carrier frequency sets a tradeoff: low freq → long range +
// strong building penetration but less data; high freq → short range but huge data capacity.
// Students map cell-tower coverage on a city map and DEFEND a tower-placement plan with evidence.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5 new
// platform blocks + composed Status Check as the U1 v2 template. Content repackaged verbatim
// from drafts/physics-content-review/u1-v2/_v1-source-u5/u5-arc6.md (already sourced/audited).
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke controls
// go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u5-v2-l06-signals";
// Two embed URLs from u5-arc6.md: the base mapper (L11) and the ?mode=city variant (L12).
// Separate scored blocks, weight 5 each.
const MAPPER = "https://paps-tools.web.app/signal-tower-mapper.html";
const MAPPER_CITY = "https://paps-tools.web.app/signal-tower-mapper.html?mode=city";

let _n = 0;
const id = (slug) => `v2u5l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "📡", title: "Sending Signals Through the City",
    subtitle: "Unit 5 · Arc 6 — Waves & EM Radiation" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arc you nailed down what an EM wave <span style=\"font-weight:700\">is</span> — a self-propagating ripple of electric and magnetic fields that carries energy across empty space. Today we ask the question that built the modern world: how do you make that wave carry a <span style=\"font-weight:700\">message</span>? Then we get the real job — cover an actual city with signal without wasting a fortune. Fun is still allowed in this room." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Hold up your phone. Right now it's catching invisible waves out of thin air and turning them into texts, calls, and video. Nothing physical traveled to you — no wire, no mail truck. The <span style=\"font-weight:700\">information</span> rode in on an EM wave whose shape was deliberately changed to spell out your message. Change the wave on purpose and you can encode anything. That's the thread we pull on all arc: a wave can carry not just <span style=\"font-weight:700\">energy</span> but <span style=\"font-weight:700\">data</span> — and the frequency you pick decides how far it goes and how much it can say." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall from last arc — quantity over polish. Then we go send a signal.",
    sections: [ { id: "recall", kind: "prompts", title: "What does a wave carry?",
      prompts: [
        { id: "q1", label: "Name ONE thing an EM wave carries across empty space. Now name a *second* kind of thing it can carry that isn't energy.", rows: 2 },
        { id: "q2", label: "Your phone has no wire to the tower. Take a guess: how does the actual message — the words you typed — get from the tower onto the wave?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Cover the City",
    content: "You're the network engineer. Your job is to <span style=\"font-weight:700\">cover a strip of Perth Amboy with signal</span> — a school, a residential block, a commercial strip, the waterfront. Pick your carrier frequencies, place your towers, and make the coverage work without blowing the budget. Your plan isn't done until you can <span style=\"font-weight:700\">defend every placement</span> with the frequency–range–data tradeoff.\n\nThere are levels. They get harder. The rule still holds — write down what you see before you decide what's happening." },

  { id: id("setup"), type: "callout", icon: "🛰️", style: "info", title: "How a wave carries a message",
    content: "To send information, you take a plain <span style=\"font-weight:700\">carrier wave</span> and <span style=\"font-weight:700\">modulate</span> it — deliberately change one of its properties to represent the signal. Three ways:\n\n<span style=\"font-weight:700\">Amplitude modulation (AM)</span> — the height of the wave changes (AM radio).\n<span style=\"font-weight:700\">Frequency modulation (FM)</span> — the frequency shifts slightly (FM radio, some Bluetooth modes).\n<span style=\"font-weight:700\">Digital modulation</span> — the wave is switched on/off or phase-shifted to send 0s and 1s (WiFi, cell, 5G).\n\nThe information rides on top of the carrier like writing on a sheet of paper. The carrier's base frequency is chosen for the job: <span style=\"font-weight:700\">lower</span> frequencies travel farther and bend around obstacles; <span style=\"font-weight:700\">higher</span> frequencies carry more data per second but need a clearer line of sight." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — modulate a carrier (before the build)",
    instructions: "Draw a plain repeating carrier wave. Then, underneath it, draw the SAME carrier modulated two different ways: once by changing its height (AM) and once by switching it on and off in pulses (digital). Label which is which. Wrong is fine — we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u5-signals",
    title: "Class Challenge Board — Send the Signal",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's covering what.",
    levels: [
      { n: 1, name: "Modulate One Carrier", nameEs: "Modula Una Portadora" },
      { n: 2, name: "Read the Tradeoff", nameEs: "Lee el Compromiso" },
      { n: 3, name: "Map the Coverage", nameEs: "Mapea la Cobertura" },
      { n: 4, name: "Mix the Frequencies", nameEs: "Mezcla las Frecuencias" },
      { n: 5, name: "Defend the City Plan", nameEs: "Defiende el Plan de la Ciudad" },
    ] },

  { id: id("embed-mapper"), type: "embed", url: MAPPER, scored: true, weight: 5 },

  { id: id("ml-tradeoff"), type: "mission_log", title: "Mission Log — Coverage Tradeoff Log",
    intro: "As you work the mapper: <span style=\"font-weight:700\">before you decide a frequency \"wins,\" write what you saw.</span> Documented reasoning = a scientist move = points. Use this tradeoff table as your reference.",
    sections: [ { id: "tradeoff", kind: "table", title: "What each carrier buys you",
      columns: [
        { key: "carrier", label: "Carrier type", placeholder: "low-band / mid-band / mmWave" },
        { key: "freq", label: "Typical frequency", placeholder: "600–900 MHz, 2.5–3.7 GHz…" },
        { key: "range", label: "Range + penetration", placeholder: "long+strong / short+weak" },
        { key: "data", label: "Data capacity", placeholder: "lower / higher / very high" },
      ], minRows: 3, addRowLabel: "Add a carrier" } ] },

  { id: id("ref-table"), type: "callout", icon: "📋", style: "info", title: "Coverage tradeoffs at a glance",
    content: "<span style=\"font-weight:700\">Macro tower (4G/5G low-band)</span> — 600–900 MHz · long range · strong building penetration · lower data capacity. One tower can cover many square miles but can't send a huge amount of data.\n\n<span style=\"font-weight:700\">Mid-band 5G</span> — 2.5–3.7 GHz · medium range · moderate penetration · higher data capacity.\n\n<span style=\"font-weight:700\">mmWave 5G</span> — 24–39 GHz · short range · weak penetration · very high data capacity. A small cell can move enormous data but may only reach a few hundred meters and gets blocked by walls, windows, even rain.\n\nReal networks <span style=\"font-weight:700\">mix all three</span>." },

  { id: id("embed-city"), type: "embed", url: MAPPER_CITY, scored: true, weight: 5 },

  { id: id("draw-map"), type: "sketch", title: "Draw Your Coverage Map",
    instructions: "Sketch your 1-mile strip of Perth Amboy: school, residential block, commercial strip. Drop a symbol for each tower you'd place, label its frequency band, and shade roughly how far each one reaches. Don't worry about neat — show your current thinking.",
    canvasHeight: 340 },

  { id: id("ml-plan"), type: "mission_log", title: "Mission Log — Tower Placement Plan",
    intro: "Lay out your plan. One row per tower — where it goes, what frequency, and the ONE reason that location needs that frequency.",
    sections: [ { id: "plan", kind: "table", title: "My tower plan",
      columns: [
        { key: "where", label: "Location", placeholder: "near the school / waterfront…" },
        { key: "type", label: "Tower type + frequency", placeholder: "low-band 700 MHz, mmWave…" },
        { key: "why", label: "Why this frequency here", placeholder: "wide coverage / dense data…" },
      ], minRows: 3, addRowLabel: "Add a tower" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop mapping. Now we figure out what it all means. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we dropped some towers\" into engineering." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What does the frequency actually buy you?",
      prompts: [
        { id: "q1", label: "In your own words: what does it mean to *modulate* a carrier wave? Name one property you can change to encode a message.", rows: 3 },
        { id: "q2", label: "A cell tower switches from a 700 MHz carrier to a 3.5 GHz carrier. What happens to its range AND to how much data it can carry? Explain why both change.", rows: 3 },
        { id: "q3", label: "Why is digital modulation (0s and 1s) more robust against noise than AM or FM for sending a text message?", rows: 3 },
        { id: "q4", label: "Why do real networks mix low-band, mid-band, AND mmWave instead of just using the one with the most data capacity everywhere?", rows: 2 },
        { id: "q5", label: "**Predict:** you replace a downtown's mmWave small cells with a single far-away low-band tower. What happens to coverage AND to data speed for everyone downtown? Why?", rows: 2 },
      ] } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — read the frequency, predict the tradeoff",
    content: "A carrier wave's frequency $f$ and wavelength $\\lambda$ are tied together by the wave equation, since EM waves all travel at the speed of light $c$:\n\n$$c = f\\lambda$$\n\nSo a higher frequency means a shorter wavelength. Compare two carriers (using $c = 3.0 \\times 10^8\\,\\text{m/s}$):\n\n<span style=\"font-weight:700\">700 MHz (low-band):</span> $\\lambda = \\dfrac{c}{f} = \\dfrac{3.0 \\times 10^8}{7.0 \\times 10^8} \\approx 0.43\\,\\text{m}$ — a long wavelength that bends around buildings and travels far.\n\n<span style=\"font-weight:700\">3.5 GHz (mid-band):</span> $\\lambda = \\dfrac{3.0 \\times 10^8}{3.5 \\times 10^9} \\approx 0.086\\,\\text{m}$ — about 5 times shorter, so it's blocked more easily but can be switched far faster, carrying more data per second.\n\nThe rule of thumb: lower frequency buys <span style=\"font-weight:700\">range</span>; higher frequency buys <span style=\"font-weight:700\">data capacity</span>. You can't max out both with one tower — that's why you mix them." },

  { id: id("consensus"), type: "consensus_model", roundId: "u5-wave-model",
    title: "Tweak Our Class Model — add the signal",
    intro: "Same wave model we've built all unit. Today we tweak it: show a carrier wave getting <span style=\"font-weight:700\">modulated</span> to carry information, and add how its <span style=\"font-weight:700\">frequency</span> sets the range-vs-data tradeoff. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u5-l6",
    title: "Class Question Board",
    intro: "Post at least one question you still have about sending signals. These drive where the unit heads next.",
    starters: [
      "If higher frequency carries more data, why don't we use ___?",
      "How does the phone know which tower to ___?",
      "What happens to the signal when ___?",
      "Why can't one tower just ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will the signal ___?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"modulate,\" \"carrier,\" \"amplitude,\" \"frequency,\" \"bandwidth,\" \"penetration,\" \"small cell\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "A carrier is wiring up downtown Perth Amboy. They want blazing-fast 5G for the crowded blocks near the waterfront, plus reliable coverage out to the quieter residential streets. They have low-band towers, mid-band 5G, and mmWave small cells to work with. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> If you were the engineer, what mix of frequencies would you use for the crowded waterfront versus the quieter residential streets, and why? Use the frequency–range–data tradeoff you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "What does it mean to *modulate* a carrier wave?",
    options: [
      "To boost the carrier's energy so its signal can travel much farther.",
      "To deliberately change a property of the wave to represent information.",
      "To slow the carrier down until it matches the speed of an audio signal.",
      "To split the carrier into many smaller waves that each carry one bit.",
    ], correctIndex: 1,
    explanation: "Modulation means deliberately changing one property of a carrier wave — its amplitude, frequency, or on/off state — so the wave represents a message. The information rides on top of the carrier." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A cell tower switches from a 700 MHz carrier to a 3.5 GHz carrier. What tradeoff is most likely?",
    options: [
      "The new signal travels farther and also carries much less data.",
      "The new signal keeps the same range and the same data capacity.",
      "The new signal travels shorter distances but carries more data.",
      "The new signal travels farther and also carries much more data.",
    ], correctIndex: 2,
    explanation: "Higher-frequency carriers have shorter wavelengths, which generally travel shorter distances and are blocked more easily by obstacles, but they can be modulated faster and therefore carry more data per second." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A carrier wants to cover a dense downtown with very fast 5G. Which choice best matches that goal?",
    options: [
      "A few low-band towers spread far apart across the whole downtown.",
      "Many mmWave small cells placed close together throughout downtown.",
      "One high-power AM radio transmitter mounted on the tallest building.",
      "A single satellite overhead beaming signal down to the whole city.",
    ], correctIndex: 1,
    explanation: "Dense downtowns need high data capacity in many small coverage cells. mmWave provides very high data rates but short range, so carriers deploy many small cells close together." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "Which carrier type generally has the LONGEST range and the STRONGEST building penetration?",
    options: [
      "mmWave 5G in the 24–39 GHz band, because its waves are the shortest.",
      "Mid-band 5G in the 2.5–3.7 GHz band, because it balances both factors.",
      "AM radio, because amplitude modulation always beats digital for range.",
      "Low-band macro towers in the 600–900 MHz band, the lowest frequency.",
    ], correctIndex: 3,
    explanation: "Lower-frequency, longer-wavelength signals travel farther and bend around or pass through obstacles more easily. Low-band macro towers (600–900 MHz) have the longest range and strongest penetration." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "WiFi and cell networks use digital modulation (sending 0s and 1s). Why is that more robust against noise than AM?",
    options: [
      "A receiver only has to tell \"on\" from \"off,\" so small noise rarely flips a bit.",
      "Digital signals travel much faster than analog signals, outrunning the noise.",
      "Digital waves have no amplitude at all, so noise has nothing it can change.",
      "Noise only ever affects low frequencies, and digital uses high frequencies.",
    ], correctIndex: 0,
    explanation: "Digital modulation only needs the receiver to distinguish discrete states (like on vs. off). Small amounts of noise usually aren't enough to flip a clear 0 into a 1, so the message survives. AM's continuously varying height is corrupted by any added noise." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "Why do real cellular networks MIX low-band, mid-band, and mmWave carriers instead of using only the highest-capacity one?",
    options: [
      "Because mixing frequencies is required by law for all licensed carriers.",
      "Because low-band towers are the only type that can send any data at all.",
      "Because no single frequency gives both wide range and very high capacity.",
      "Because mmWave signals are dangerous and must be diluted with low-band.",
    ], correctIndex: 2,
    explanation: "Each frequency band trades range against data capacity. Low-band covers wide areas with less data; mmWave moves huge data over short distances. Mixing them is the only way to get broad coverage AND high capacity where it's needed." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "Which property of a carrier wave is deliberately changed in amplitude modulation (AM)?",
    options: [
      "The frequency of the wave shifts slightly up and down over time.",
      "The wave is switched fully on and off to send discrete 0s and 1s.",
      "The speed of the wave changes as it carries the signal outward.",
      "The height of the wave changes to represent the signal being sent.",
    ], correctIndex: 3,
    explanation: "In amplitude modulation, the amplitude — the height of the wave — is varied to encode the signal. (FM varies the frequency; digital switches the wave on and off.)" },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "A neighborhood needs solid coverage over a fairly wide area but also decent data speeds. Which carrier is the best single compromise?",
    options: [
      "Mid-band 5G around 2.5–3.7 GHz, balancing medium range with higher data.",
      "Low-band 600 MHz only, since the widest possible range is all that matters.",
      "mmWave around 39 GHz, since maximum data speed is all that ever matters.",
      "An AM broadcast transmitter, since AM reaches the whole region at once.",
    ], correctIndex: 0,
    explanation: "Mid-band 5G (2.5–3.7 GHz) sits between low-band and mmWave: medium range, moderate penetration, and higher data capacity. It's the standard compromise for suburban-style neighborhoods." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a 1-mile city strip with three zones: a crowded waterfront, a residential block, and a school. Place a tower in each zone, label the frequency band you'd pick (low / mid / mmWave), and write one word for why. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about how signals travel that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You took an invisible wave and made it carry a message today — then you covered a whole city with it by trading range against data, tower by tower. Every cell tower you'll ever drive past is somebody making exactly these calls. Next class we keep building. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "Sending Signals Through the City",
  unit: "Unit 5: Waves & Electromagnetic Radiation — v2",
  order: 5106,
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
