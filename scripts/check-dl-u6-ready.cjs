const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const slugs = [
  "entrepreneurship-creator-economy",
  "entrepreneurship-niche",
  "entrepreneurship-value-prop",
  "entrepreneurship-branding",
  "entrepreneurship-revenue",
];

function summarizeBlocks(blocks) {
  const types = {};
  const issues = [];
  const details = { questions: [], embeds: [], externalLinks: [], activities: [] };
  blocks.forEach((b, i) => {
    types[b.type] = (types[b.type]||0)+1;
    if (b.type === "question") {
      const isMC = b.questionType === "multiple_choice";
      const hasOpts = Array.isArray(b.options) && b.options.length >= 2;
      const hasAns = isMC ? (typeof b.correctAnswer === "number" || typeof b.correctAnswerIndex === "number") : true;
      details.questions.push({ i, qType: b.questionType, opts: hasOpts ? b.options.length : 0, correct: isMC ? (b.correctAnswer ?? b.correctAnswerIndex) : "—", prompt: (b.prompt||b.question||"").slice(0,70) });
      if (isMC && !hasAns) issues.push(`Q${i}: MC missing correct answer`);
      if (isMC && !hasOpts) issues.push(`Q${i}: MC missing options`);
    }
    if (b.type === "embed") {
      details.embeds.push({ i, url: b.url||b.src, scored: b.scored, weight: b.weight, height: b.height });
      if (b.scored && !b.weight) issues.push(`Embed${i}: scored but no weight`);
      if (!b.url && !b.src) issues.push(`Embed${i}: no url`);
    }
    if (b.type === "external_link") details.externalLinks.push({ i, title: b.title, url: b.url });
    if (b.type === "activity") details.activities.push({ i, title: b.title });
  });
  return { types, issues, details };
}

(async () => {
  for (const s of slugs) {
    const doc = await db.doc(`courses/digital-literacy/lessons/${s}`).get();
    if (!doc.exists) { console.log(`\n❌ ${s}: NOT FOUND`); continue; }
    const d = doc.data();
    const blocks = d.blocks || [];
    const { types, issues, details } = summarizeBlocks(blocks);
    console.log(`\n━━━ ${s} (order ${d.order}, vis=${d.visible}) ━━━`);
    console.log(`Title: ${d.title}`);
    console.log(`QOD: ${d.questionOfTheDay ? "✓" : "MISSING"} | gradesReleased: ${d.gradesReleased ?? "unset"} | dueDate: ${d.dueDate||"none"}`);
    console.log(`Blocks: ${blocks.length} →`, types);
    if (details.questions.length) {
      console.log(`Questions (${details.questions.length}):`);
      details.questions.forEach(q => console.log(`  [${q.i}] ${q.qType} opts=${q.opts} ans=${q.correct} — ${q.prompt}`));
    }
    if (details.embeds.length) {
      console.log(`Embeds:`); details.embeds.forEach(e => console.log(`  [${e.i}] scored=${e.scored} w=${e.weight} h=${e.height} ${e.url}`));
    }
    if (details.externalLinks.length) {
      console.log(`External links:`); details.externalLinks.forEach(l => console.log(`  [${l.i}] ${l.title} → ${l.url}`));
    }
    if (details.activities.length) {
      console.log(`Activities:`); details.activities.forEach(a => console.log(`  [${a.i}] ${a.title}`));
    }
    if (issues.length) console.log(`⚠️  Issues:`, issues);
    else console.log(`✓ no structural issues`);
  }
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
