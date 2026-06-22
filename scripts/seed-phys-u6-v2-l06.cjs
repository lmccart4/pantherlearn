// seed-phys-u6-v2-l06.cjs
// U6 v2 — Arc 6: "The Redshift Mystery" (OpenSciEd-spine / Rober-engine).
// Merges v1 L10 (The Redshift Mystery) + L11 (An Expanding Universe) into one
// challenge-arc: read the shifted starlight, calculate redshift, and use the pattern
// to argue the universe is expanding — then run the film backward to the Big Bang.
// Through-line: "Read the Starlight." Physics: interpret absorption spectra from
// distant galaxies; a shift to longer wavelengths = motion away; redshift
// z = Δλ/λ₀; redshift data → expanding universe; run expansion backward → hot dense
// early universe; "expansion of space" vs objects moving through space.
//
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) using the same 5
// platform blocks + composed Status Check as U1 Arc 2 (the shipped template).
// Content repackaged verbatim from
// drafts/physics-content-review/u1-v2/_v1-source-u6/u6-arc6.md (sourced/audited).
// All galaxy/redshift numbers come from that source's data table — none invented.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke
// controls go-live). English-primary; ES via the app translation layer + challenge nameEs.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u6-v2-l06-redshift";
// Embed URL is exact from u6-arc6.md (the spectra-redshift-explorer in redshift mode).
const EXPLORER = "https://paps-tools.web.app/spectra-redshift-explorer.html?mode=redshift";

let _n = 0;
const id = (slug) => `v2u6l6-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "🌌", title: "The Redshift Mystery",
    subtitle: "Unit 6 · Arc 6 — Read the Starlight" },

  // ── CONNECT: recall prior arc → the new question ──
  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "Last arcs you learned to <span style=\"font-weight:700\">read starlight</span> — spread it into a spectrum and the dark lines tell you which elements are there. Today we point that same trick at galaxies billions of light-years away, and something is off. The fingerprints are all there… but they're in the <span style=\"font-weight:700\">wrong place</span>. Solve that, and you'll figure out something wild about the whole universe." },

  { id: id("recall"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "You've heard a siren change pitch as a car races past — higher coming toward you, lower going away. That's the <span style=\"font-weight:700\">Doppler effect</span>, and light does the same thing. Light from a source moving <span style=\"font-weight:700\">away</span> gets stretched to longer wavelengths — toward the red. Light from a source moving <span style=\"font-weight:700\">toward</span> you gets squeezed to shorter wavelengths — toward the blue. Hold onto that — it's the whole key today." },

  { id: id("ml-recall"), type: "mission_log", title: "Mission Log — Warm-Up Recall",
    intro: "Quick recall before we look at the galaxies — quantity over polish.",
    sections: [ { id: "recall", kind: "prompts", title: "What does starlight tell us?",
      prompts: [
        { id: "q1", label: "From the last arcs: what do the dark absorption lines in a star's spectrum tell you about that star?", rows: 2 },
        { id: "q2", label: "A siren moving away from you sounds *lower*. What do you predict happens to the *color* of a light source moving away from you?", rows: 2 },
      ] } ] },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🧾", style: "tip", title: "Here's the job: Read the Shift",
    content: "Each galaxy's spectrum shows the same element fingerprints as our Sun — hydrogen, calcium, sodium — but <span style=\"font-weight:700\">shifted toward the red</span>. Your job: measure how far each fingerprint moved, turn that into a number, and use the pattern across many galaxies to figure out what the universe as a whole is doing.\n\nThere are levels. They get harder. The rule still holds — write down what you <span style=\"font-weight:700\">see</span> before you decide what it means." },

  { id: id("setup"), type: "callout", icon: "📏", style: "info", title: "How we measure the shift",
    content: "Each spectrum has dark <span style=\"font-weight:700\">absorption lines</span> from atoms in the galaxy soaking up light at specific wavelengths. We know the wavelength those lines have in a lab on Earth — the <span style=\"font-weight:700\">rest wavelength</span> ($\\lambda_0$, also written $\\lambda_{rest}$). We measure where the line actually shows up — the <span style=\"font-weight:700\">observed wavelength</span> ($\\lambda_{observed}$). The redshift is how big that gap is compared to the rest wavelength:\n\n$$z = \\frac{\\Delta\\lambda}{\\lambda_0} = \\frac{\\lambda_{observed} - \\lambda_{rest}}{\\lambda_{rest}}$$\n\nLines shifted to <span style=\"font-weight:700\">longer</span> wavelengths (bigger observed value) mean the galaxy is moving <span style=\"font-weight:700\">away</span>. The bigger the shift, the faster it's going." },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch — predict the shift (before the tool)",
    instructions: "Draw a short stretch of spectrum with one dark absorption line. Now draw a SECOND copy below it showing where you predict that same line would sit for a galaxy racing away from us. Which direction does it move, and why? Wrong is fine — we sketch first so we can compare.",
    canvasHeight: 340 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u6-redshift",
    title: "Class Challenge Board — Read the Starlight",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's reading which galaxy.",
    levels: [
      { n: 1, name: "Spot the Shift", nameEs: "Detecta el Desplazamiento" },
      { n: 2, name: "Measure One Galaxy", nameEs: "Mide Una Galaxia" },
      { n: 3, name: "Calculate the Redshift", nameEs: "Calcula el Corrimiento al Rojo" },
      { n: 4, name: "Find the Pattern", nameEs: "Encuentra el Patrón" },
      { n: 5, name: "Read the Whole Universe", nameEs: "Lee Todo el Universo" },
    ] },

  { id: id("embed-explorer"), type: "embed", url: EXPLORER, scored: true, weight: 5 },

  { id: id("ml-tracelog"), type: "mission_log", title: "Mission Log — Galaxy Redshift Data",
    intro: "Work the explorer and these three galaxies from our data set. <span style=\"font-weight:700\">Use</span> $z = (\\lambda_{observed} - \\lambda_{rest}) / \\lambda_{rest}$. Show the subtraction AND the division — documented work = points.",
    sections: [ { id: "tracelog", kind: "table", title: "Measuring the shift",
      columns: [
        { key: "galaxy", label: "Galaxy", width: "80px", placeholder: "A / B / C" },
        { key: "rest", label: "Rest λ (nm)", placeholder: "500" },
        { key: "obs", label: "Observed λ (nm)", placeholder: "525" },
        { key: "dlam", label: "Δλ = obs − rest (nm)", placeholder: "25" },
        { key: "z", label: "Redshift z = Δλ / rest", placeholder: "0.05" },
      ], minRows: 3, addRowLabel: "Add a galaxy" } ] },

  { id: id("worked"), type: "callout", icon: "🧮", style: "info", title: "Worked example — Galaxy A's redshift",
    content: "Galaxy A: an absorption line sits at a rest wavelength of <span style=\"font-weight:700\">500 nm</span> in the lab, but we observe it at <span style=\"font-weight:700\">525 nm</span>.\n\nStep 1 — find the shift: $\\Delta\\lambda = \\lambda_{observed} - \\lambda_{rest} = 525\\,\\text{nm} - 500\\,\\text{nm} = 25\\,\\text{nm}$.\n\nStep 2 — divide by the rest wavelength: $z = \\dfrac{\\Delta\\lambda}{\\lambda_0} = \\dfrac{25\\,\\text{nm}}{500\\,\\text{nm}} = 0.050$.\n\nThe line landed at a longer wavelength, so Galaxy A is moving <span style=\"font-weight:700\">away</span> from us. A redshift of $0.050$ means its light is stretched about 5 percent. Now do Galaxy B and Galaxy C the same way." },

  { id: id("draw-path"), type: "sketch", title: "Draw the Shift",
    instructions: "Redraw your spectrum now that you've measured it. Show the lab (rest) line, the observed line shifted toward red, and label Δλ as the gap between them. Add a little arrow showing which way the galaxy is moving. Don't worry about neat — show your current thinking.",
    canvasHeight: 320 },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — pencils up",
    content: "Stop measuring. Now we figure out what it all means. Edwin Hubble measured the redshift of galaxy after galaxy — and found that almost <span style=\"font-weight:700\">every</span> galaxy is redshifted, and the <span style=\"font-weight:700\">more distant</span> ones are shifted <span style=\"font-weight:700\">more</span>. Write first, then we discuss. <span style=\"font-weight:700\">Do not skip this</span> — it's the move that turns \"we measured some shifts\" into physics." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What is the universe doing?",
      prompts: [
        { id: "q1", label: "A distant galaxy's hydrogen lines are shifted toward the red. Use the Doppler effect to explain what that tells us about how the galaxy is moving.", rows: 3 },
        { id: "q2", label: "Hubble found that more distant galaxies have LARGER redshifts. CLAIM what that pattern implies about galaxy motion. EVIDENCE: state the pattern. REASONING: connect redshift to direction and speed of motion.", rows: 4 },
        { id: "q3", label: "Almost EVERY galaxy is moving away from almost every OTHER galaxy — not just away from us. Why is that strange if you picture an ordinary explosion sending debris from one center?", rows: 3 },
        { id: "q4", label: "Picture a balloon with dots drawn on it. As it inflates, every dot moves away from every other dot, and no dot is the center. What does the rubber represent? What do the dots represent?", rows: 2 },
        { id: "q5", label: "If a galaxy showed BLUEshifted lines instead of redshifted ones, what would that mean about its motion? Name one place we actually observe blueshift in our local neighborhood.", rows: 2 },
      ] } ] },

  { id: id("expand"), type: "callout", icon: "🎈", style: "info", title: "Run the film backward",
    content: "Here's the deeper puzzle: galaxies aren't racing away from a special spot in space. <span style=\"font-weight:700\">Space itself is stretching</span>, carrying the galaxies along — like dots on an inflating balloon or raisins in rising bread. The galaxies mostly sit still relative to the space around them; the space <span style=\"font-weight:700\">between</span> them grows.\n\nNow run that backward. If space is stretching today, yesterday it was a little smaller. A year ago, smaller still. Keep going and the whole observable universe was once incredibly <span style=\"font-weight:700\">small, hot, and dense</span>. That beginning of the expansion is what we call the <span style=\"font-weight:700\">Big Bang</span> — not an explosion <span style=\"font-weight:700\">in</span> space, but the stretching <span style=\"font-weight:700\">of</span> space itself." },

  { id: id("consensus"), type: "consensus_model", roundId: "u6-star-model",
    title: "Tweak Our Class Model — add the expanding universe",
    intro: "Same starlight model we've been building all unit. Today we tweak it: show that the shifted fingerprints mean galaxies are moving <span style=\"font-weight:700\">away</span>, that more distant galaxies move away faster, and that <span style=\"font-weight:700\">space itself</span> is stretching between them. Copy the updated model into your Mission Log." },

  { id: id("qboard"), type: "question_board", boardId: "u6-l6",
    title: "Class Question Board",
    intro: "Post at least one question you still have about redshift or the expanding universe. These drive where the unit heads next.",
    starters: [
      "If space itself is stretching, what is it stretching ___?",
      "How do we know the redshift is from motion and not ___?",
      "If we run the expansion all the way back, what was there ___?",
      "Why doesn't the space INSIDE galaxies stretch too, pulling apart ___?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions could open the next arc. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could chase down with data or a model — not just look up.",
        placeholder: "If a galaxy is ___, then its redshift should ___?",
        hint: "*A good one can be answered by doing or modeling something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Words you kept reaching for this arc — \"redshift,\" \"blueshift,\" \"Doppler,\" \"wavelength,\" \"absorption line,\" \"expansion,\" \"Big Bang\"? Catch them here with what you THINK they mean. We sharpen the definitions as we earn them." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-scenario"), type: "callout", icon: "💡", style: "default", title: "The scenario",
    content: "Astronomers point a telescope at a faraway galaxy and spread its light into a spectrum. The hydrogen absorption lines are right where they should be in pattern — but every one of them sits at a <span style=\"font-weight:700\">longer wavelength</span> than the same lines measured in a lab on Earth. Use that picture for the questions below." },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "<span style=\"font-weight:700\">What's going on here?</span> Explain what the shift toward longer wavelengths tells us about how this galaxy is moving, and how astronomers turn that shift into a number. Use what you figured out today." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "A distant galaxy's hydrogen absorption lines are shifted toward the red end of the spectrum. What does this tell us?",
    options: [
      "The galaxy is moving away from us, so its light gets stretched to longer wavelengths.",
      "The galaxy is cooler than the nearby stars we usually observe.",
      "The galaxy is made of different elements than our own Sun is.",
      "The galaxy is rotating faster than the Milky Way rotates.",
    ], correctIndex: 0,
    explanation: "Redshift means the light waves are stretched to longer wavelengths. For light, stretching happens when the source is moving away from the observer — the Doppler effect applied to light." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "A galaxy has an absorption line whose rest wavelength is 500 nm, but it is observed at 525 nm. What is the redshift $z$?",
    options: [
      "0.500, because the line moved by 25 of a total of 50 nm.",
      "0.100, because the line moved 25 nm out toward the red side.",
      "0.050, because $(525 - 500)/500 = 25/500 = 0.05$.",
      "0.025, because half of the 50 nm shift counts as redshift.",
    ], correctIndex: 2,
    explanation: "$z = (\\lambda_{observed} - \\lambda_{rest})/\\lambda_{rest} = (525 - 500)/500 = 25/500 = 0.05$. The observed wavelength is 5 percent longer than the rest wavelength." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "A galaxy has a rest wavelength of 450 nm observed at 472 nm. Using $z = \\Delta\\lambda/\\lambda_0$, the redshift is closest to —",
    options: [
      "0.489, since 22 divided by 45 is about one half overall.",
      "0.049, since $(472 - 450)/450 = 22/450 \\approx 0.049$.",
      "0.220, since the line shifted by a full 22 nanometers.",
      "0.022, since you halve the 44 nm of total spectrum shift.",
    ], correctIndex: 1,
    explanation: "$\\Delta\\lambda = 472 - 450 = 22\\,\\text{nm}$, so $z = 22/450 \\approx 0.049$. Divide the shift by the rest wavelength, not by anything else." },

  { id: id("sc-mc4"), type: "question", questionType: "multiple_choice",
    prompt: "If a galaxy's absorption lines were instead shifted toward the BLUE (shorter wavelengths), what would that tell us?",
    options: [
      "The galaxy is much hotter than every other galaxy near it.",
      "The galaxy is exactly the same distance away as the Milky Way.",
      "The galaxy is standing perfectly still relative to the Earth.",
      "The galaxy is moving toward us, so its light gets squeezed shorter.",
    ], correctIndex: 3,
    explanation: "Blueshift means wavelengths are squeezed shorter, which happens when the source moves toward the observer. The nearby Andromeda galaxy is actually blueshifted — it is heading toward the Milky Way." },

  { id: id("sc-mc5"), type: "question", questionType: "multiple_choice",
    prompt: "Edwin Hubble found that more distant galaxies have LARGER redshifts than nearby galaxies. The best interpretation is that —",
    options: [
      "more distant galaxies are moving away from us faster than nearby ones.",
      "more distant galaxies are made of heavier and rarer chemical elements.",
      "more distant galaxies are all clustered around one center of the cosmos.",
      "more distant galaxies are colder, which is what reddens their light.",
    ], correctIndex: 0,
    explanation: "Larger redshift means faster recession. Hubble's pattern — farther galaxies moving away faster — is the core evidence that the universe is expanding." },

  { id: id("sc-mc6"), type: "question", questionType: "multiple_choice",
    prompt: "In the raisin-bread model of the expanding universe, the raisins move apart because —",
    options: [
      "hot air trapped inside the dough pushes every raisin outward.",
      "the dough between the raisins expands, carrying them along with it.",
      "the raisins chemically react and slowly drift away from each other.",
      "gravity between raisins is far weaker than gravity between galaxies.",
    ], correctIndex: 1,
    explanation: "The dough represents space and the raisins represent galaxies. The dough expands everywhere, so every raisin moves away from every other one — and none is at the center." },

  { id: id("sc-mc7"), type: "question", questionType: "multiple_choice",
    prompt: "If we run the expansion of the universe backward in time, what do we conclude?",
    options: [
      "The universe will eventually collapse back into one giant black hole.",
      "All the galaxies must have started at the very same point in today's space.",
      "The universe was once smaller, hotter, and denser than it is today.",
      "The Milky Way is the oldest galaxy and everything expanded out from it.",
    ], correctIndex: 2,
    explanation: "Running expansion backward means the universe was smaller and denser in the past, and hotter because the same energy was packed into less volume — a hot, dense early state, not a point in today's space." },

  { id: id("sc-mc8"), type: "question", questionType: "multiple_choice",
    prompt: "Why is \"the Big Bang was an explosion that flung galaxies outward from one point in space\" not the best description?",
    options: [
      "Because galaxies are actually moving toward each other, not apart.",
      "Because the explosion happened inside our own Milky Way galaxy.",
      "Because only the most distant galaxies are moving, and the rest sit still.",
      "Because space itself stretches between galaxies; there is no center point.",
    ], correctIndex: 3,
    explanation: "Redshift shows every galaxy receding from every other, with no special center. That fits expansion OF space — the balloon/raisin-bread picture — not an explosion IN space from one location." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Draw a balloon with several dots on it, then a second, bigger balloon showing the same dots farther apart. Use it to explain why a galaxy twice as far away shows about twice the redshift. Label the rubber and the dots. Show your current thinking — neat doesn't matter.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "<span style=\"font-weight:700\">How sure do you feel right now?</span> Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "surprise", label: "One thing about the expanding universe that *surprised* you, and why:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You read light from galaxies billions of years old, measured how far it got stretched, and used that one number to figure out that the whole universe is expanding — and once was small, hot, and dense. That's the Big Bang, read straight off the starlight. Next class we hunt for more evidence. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Redshift Mystery",
  unit: "Unit 6: Stars & the Cosmos — v2",
  order: 6106,
  visible: false,
  gradesReleased: true,
  challengeId: "u6-redshift",
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
