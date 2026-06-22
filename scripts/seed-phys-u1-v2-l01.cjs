// seed-phys-u1-v2-l01.cjs
// U1 v2 PILOT — "The Night the Lights Went Out" (OpenSciEd-spine / Rober-engine).
// Creates a NEW lesson doc in physics-2026 (new id, visible:false) that exercises the
// 5 new platform blocks (mission_log ×5 section-kinds, confidence_check, challenge_tracker,
// question_board, consensus_model) PLUS the composed Status Check (image + question MC/SA +
// sketch + confidence_check). Content faithful to drafts/physics-content-review/u1-v2/L1/.
//
// Grade-safety: brand-new doc, 0 responses → safeSeed creates it. visible:false (Luke controls
// go-live). English-primary; ES via the app translation layer + *_es fields filled in a polish pass.

const admin = require("firebase-admin");
const cert = require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(cert), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
const { safeSeed } = require("./safe-seed.cjs");

const COURSE = "physics-2026";
const LESSON = "phys-u1-v2-l01-night-lights";
const IMG = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/u1v2/l1-status-check-broken-line.jpg";

let _n = 0;
const id = (slug) => `v2l1-${String(++_n).padStart(2, "0")}-${slug}`;

const blocks = [
  { id: id("hdr"), type: "section_header", icon: "⚡", title: "The Night the Lights Went Out",
    subtitle: "Unit 1 · Lesson 1 — Energy & the Grid" },

  { id: id("today"), type: "callout", icon: "🎯", style: "tip", title: "Today's mission",
    content: "You're going to run a power company. You'll light up a model neighborhood, watch it fail, and start figuring out *why* — exactly like the people who run the real grid. Fun is allowed in this room." },

  // ── CONNECT: cold open ──
  { id: id("coldopen-video"), type: "callout", icon: "🎬", style: "info", title: "Cold open — watch first, no talking yet",
    content: "**[Hook montage plays here — the Superstorm Sandy NJ blackout, built from public-domain / CC sources per the teacher guide. Finalize the video URL before go-live.]**\n\nWatch. Then I want three things from you. No talking yet — just notice." },

  { id: id("coldopen-text"), type: "callout", icon: "🗣️", style: "default", title: "",
    content: "Late October, 2012. A storm called Sandy hits the Jersey coast. And then — across the state — the lights just… go out. Not for an hour. For some towns, for **weeks.** No phones charging. No fridge. No heat. Traffic lights dead. Hospitals on backup generators. Gas stations with lines around the block — because the pumps need electricity too." },

  { id: id("ml-ntw"), type: "mission_log", title: "Mission Log — Notice / Think / Wonder",
    intro: "Get at least **two** in each column. Quantity over polish — facts in *Notice*, guesses in *Think*, questions in *Wonder*.",
    sections: [ { id: "ntw", kind: "ntw", title: "What did you see?", minPerColumn: 2 } ] },

  { id: id("turn-compare"), type: "text",
    content: "**Turn & compare.** Trade your *Notice / Wonder* lists with a partner. Steal one you wish you'd written and add it to yours — write \"(from ___)\" next to it. Crediting your source is a science move." },

  // ── EXPLORE: the challenge ──
  { id: id("challenge-brief"), type: "callout", icon: "🔌", style: "tip", title: "Here's the job: Keep the Lights On",
    content: "Sandy knocked out power for about **2.7 million** New Jersey homes and businesses — the biggest blackout in state history. Some towns waited up to **22 days** to get it back.\n\nYour team is the power company. You've got a pile of cheap stuff and one little power source. Get that power across a model neighborhood and light it up — then keep it lit as the neighborhood grows. There are levels. They get harder. You *will* fail some. That's not a bug — every failure is a clue." },

  { id: id("source-eia"), type: "external_link", icon: "📊",
    title: "Source: ~2.7 million NJ customers lost power (largest in state history)",
    description: "U.S. Energy Information Administration — Today in Energy, Nov 9, 2012.",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=8730",
    buttonLabel: "See the EIA data", openInNewTab: true },

  { id: id("plan-sketch"), type: "sketch", title: "Plan & Sketch (before you build)",
    instructions: "Before you touch anything — sketch your first plan. Where's the source? How will you connect a building? It's fine to be wrong; we sketch first so we can compare later.",
    canvasHeight: 360 },

  { id: id("challenge-tracker"), type: "challenge_tracker", challengeId: "u1-keep-the-lights-on",
    title: "Class Challenge Board — Keep the Lights On",
    intro: "Name your team, then mark each level as you clear it. The whole class can see who's clearing what.",
    levels: [
      { n: 1, name: "First Light", nameEs: "Primera Luz" },
      { n: 2, name: "The Neighborhood Grows", nameEs: "El Barrio Crece" },
      { n: 3, name: "Reach Across Town", nameEs: "Cruzar el Pueblo" },
      { n: 4, name: "Everybody On", nameEs: "Todos Encendidos" },
      { n: 5, name: "The Storm Hits", nameEs: "Llega la Tormenta" },
      { n: 6, name: "Resilience", nameEs: "Resiliencia" },
    ] },

  { id: id("ml-buildfail"), type: "mission_log", title: "Mission Log — Build & Fail Log",
    intro: "The rule on every challenge card: **before you change something that isn't working, write down what you saw.** That's your data. Documented failure = a scientist move = points.",
    sections: [ { id: "buildfail", kind: "table", title: "What we tried",
      columns: [
        { key: "level", label: "Level", width: "70px", placeholder: "1" },
        { key: "tried", label: "What we TRIED", placeholder: "…" },
        { key: "happened", label: "What HAPPENED", placeholder: "what we saw" },
        { key: "changed", label: "What we CHANGED next", placeholder: "…" },
      ], minRows: 3, addRowLabel: "Add a level" } ] },

  // ── INTEGRATE: sensemaking → consensus → question board ──
  { id: id("pause"), type: "callout", icon: "✋", style: "warning", title: "Pause & Process — hands off your build",
    content: "Pencils up. We did the build; now we figure out what actually happened. Write first, then we discuss. **Do not skip this** — it's the move that separates a science class from a craft project." },

  { id: id("ml-sense"), type: "mission_log", title: "Mission Log — Sensemaking",
    sections: [ { id: "sense", kind: "prompts", title: "What just happened?",
      prompts: [
        { id: "q1", label: "When you added a second building, did the first one change? What did you see?", rows: 2 },
        { id: "q2", label: "What made a building go *dim* instead of fully off — or fully off instead of dim?", rows: 2 },
        { id: "q3", label: "In the \"Storm\" round, why couldn't you save *everything*? What were you trading off?", rows: 2 },
        { id: "q4", label: "Where did the \"stuff\" that lit your buildings actually *come from*? Did it run out? Could it be in two places at full strength at once?", rows: 2 },
        { id: "q5", label: "**Predict:** if your source had to feed *twice* as many buildings, what happens? Why?", rows: 2 },
      ] } ] },

  { id: id("consensus"), type: "consensus_model", roundId: "u1-grid-model",
    title: "Our Class Model (first draft)",
    intro: "Together, we'll build a first-draft picture of *how a neighborhood gets powered, and why it fails* — in our own words. Copy it into your Mission Log. It's allowed to be wrong; we fix it every lesson." },

  { id: id("qboard"), type: "question_board", boardId: "u1-l1",
    title: "Class Question Board",
    intro: "Post at least one question you still have after the build. These questions drive where the unit goes next.",
    starters: [
      "Why did ___ happen when we ___?",
      "What would happen if ___?",
      "How does the real grid handle ___?",
      "How could you stop ___ from failing?",
    ] },

  // ── NAVIGATE: the testable question + word tracker ──
  { id: id("ml-navigate"), type: "mission_log", title: "Mission Log — Your Question + Word Tracker",
    intro: "One of *your* testable questions is going to open Lesson 2. Make it a good one.",
    sections: [
      { id: "testable", kind: "text", title: "My ONE testable question for next time",
        label: "The kind we could answer by DOING something in here — not just looking it up.",
        placeholder: "If we ___, will ___ happen?",
        hint: "*A good one can be answered by doing something, not just looking it up.*", rows: 2 },
      { id: "words", kind: "word_tracker", title: "Word Tracker — be a word collector",
        instructions: "Did you keep needing a word you don't have a sharp definition for yet — \"power,\" \"energy,\" \"current,\" \"circuit,\" something else? Catch it here. We'll *earn* real definitions as the unit goes." },
    ] },

  // ── PROCESS: Status Check (composed) ──
  { id: id("sc-hdr"), type: "section_header", icon: "🔎", title: "Status Check",
    subtitle: "Quick check — NOT a test for points. It just helps Mr. McCarthy plan next class." },

  { id: id("sc-img"), type: "image", url: IMG, width: 720,
    alt: "Top-down cartoon: one battery on the left connected by a single wire to four houses; three are lit, the fourth is dark, and the wire has a clear break before the dark house.",
    caption: "What's going on here?" },

  { id: id("sc-write"), type: "question", questionType: "short_answer",
    prompt: "Look at the picture. **What's going on here?** Why do you think three houses are lit but the fourth one is dark? Use what you figured out in today's build." },

  { id: id("sc-mc1"), type: "question", questionType: "multiple_choice",
    prompt: "Your team lit one building easily. Then you added three more buildings to the same power source, and **all** of them got dimmer. What does the dimming most likely tell you?",
    options: [
      "The power source has a limit, and adding more buildings spreads it thinner.",
      "The buildings closer to the source always stay the brightest ones.",
      "Dimmer buildings mean the colored lights were simply weaker bulbs.",
      "Adding buildings made the wires longer and that cooled them down.",
    ], correctIndex: 0,
    explanation: "A source can only supply so much. Add more buildings to share it and each one gets less — the felt precursor to thinking about limited supply." },

  { id: id("sc-mc2"), type: "question", questionType: "multiple_choice",
    prompt: "During the \"Storm\" round, the teacher took **one** line down and a building went dark. Which change would most likely keep that building on if a single line fails again?",
    options: [
      "Decorate the building so the team pays closer attention to it.",
      "Give that building a second, separate line back to the source.",
      "Move every other building much farther away from it.",
      "Turn the other buildings off so there is more to go around.",
    ], correctIndex: 1,
    explanation: "A second, separate path = redundancy. If one line fails, the other still carries power — exactly how the real grid is hardened after storms like Sandy." },

  { id: id("sc-mc3"), type: "question", questionType: "multiple_choice",
    prompt: "In the picture above, the far house is dark while the others are lit. The **best** first thing a power-company worker should do is —",
    options: [
      "Replace the light inside the dark house right away.",
      "Add brand-new houses on the far end of the line.",
      "Check and fix the break in the line before that house.",
      "Tell the other three houses to share their light.",
    ], correctIndex: 2,
    explanation: "The break cuts off everything past it. Find and fix the broken path first — the lit houses prove the source and the rest of the line are fine." },

  { id: id("sc-draw"), type: "sketch", title: "Jot & Draw",
    instructions: "Sketch a power source and **two** buildings, and show the path the \"stuff\" takes to light them. Add one arrow showing which way you think it travels. Don't worry about being neat or \"right\" — show your current thinking.",
    canvasHeight: 320 },

  { id: id("sc-confidence"), type: "confidence_check",
    prompt: "**How sure do you feel right now?** Tap your stars — there's no wrong answer. This just tells Mr. McCarthy how to plan next class." },

  { id: id("ml-reflect"), type: "mission_log", title: "Mission Log — Reflection",
    sections: [ { id: "reflect", kind: "prompts", title: "Before you go",
      prompts: [
        { id: "hardest", label: "The hardest level we cleared today:", rows: 1 },
        { id: "failed", label: "One thing that **failed** today and what it taught us:", rows: 2 },
        { id: "word", label: "One word I kept needing but couldn't fully explain *(→ put it in the Word Tracker)*:", rows: 1 },
      ] } ] },

  { id: id("close"), type: "callout", icon: "🌙", style: "tip", title: "",
    content: "You ran a power company today. You lit a neighborhood, watched it fail, and started figuring out *why*. Next class — we test the question YOU wrote. See you then. — Mr. M" },
];

const lessonData = {
  id: LESSON,
  title: "The Night the Lights Went Out (v2)",
  unit: "Unit 1: Energy & the Grid — v2 pilot",
  order: 1101,
  visible: false,
  gradesReleased: true,
  blocks,
};

(async () => {
  // MC distribution report (rule: always report)
  const mc = blocks.filter((b) => b.questionType === "multiple_choice");
  const dist = [0, 0, 0, 0];
  mc.forEach((q) => { dist[q.correctIndex]++; });
  console.log(`MC items: ${mc.length} | correct positions A/B/C/D = ${dist.join("/")}`);
  mc.forEach((q) => {
    const lens = q.options.map((o) => o.length);
    const correctLen = lens[q.correctIndex];
    const wrongAvg = (lens.reduce((a, b) => a + b, 0) - correctLen) / (lens.length - 1);
    console.log(`  "${q.prompt.slice(0, 40)}…" correct/wrongAvg len = ${(correctLen / wrongAvg).toFixed(2)}`);
  });

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
