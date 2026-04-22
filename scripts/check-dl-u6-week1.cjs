const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const slugs = ["creator-economy","finding-your-niche","value-proposition","branding-101","revenue-models"];

(async () => {
  for (const s of slugs) {
    const doc = await db.doc(`courses/digital-literacy/lessons/${s}`).get();
    if (!doc.exists) { console.log(`${s}: NOT FOUND`); continue; }
    const d = doc.data();
    const blocks = d.blocks || [];
    const types = {};
    const scoredEmbeds = [];
    const externalLinks = [];
    const questions = [];
    let hasQOD = !!d.questionOfTheDay;
    let hasObjectives = false;
    blocks.forEach(b => {
      types[b.type] = (types[b.type]||0)+1;
      if (b.type === "objectives") hasObjectives = true;
      if (b.type === "embed") scoredEmbeds.push({ id: b.id, scored: b.scored, weight: b.weight, url: b.url||b.src });
      if (b.type === "external_link") externalLinks.push({ title: b.title, url: b.url });
      if (b.type === "question") questions.push({ id: b.id, qType: b.questionType, hasAnswer: b.questionType==="multiple_choice" ? (typeof b.correctAnswer === "number") : true });
    });
    console.log(`\n=== ${s} (order ${d.order}, visible=${d.visible}) ===`);
    console.log(`   title: ${d.title}`);
    console.log(`   QOD: ${hasQOD ? "yes" : "MISSING"}  |  objectives: ${hasObjectives ? "yes" : "MISSING"}`);
    console.log(`   blocks: ${blocks.length}  types:`, types);
    console.log(`   questions: ${questions.length}`, questions.filter(q=>q.qType==="multiple_choice").length ? `(MC: ${questions.filter(q=>q.qType==="multiple_choice").length})` : "");
    if (scoredEmbeds.length) console.log(`   embeds:`, scoredEmbeds);
    if (externalLinks.length) console.log(`   externalLinks:`, externalLinks);
    console.log(`   gradesReleased: ${d.gradesReleased}, dueDate: ${d.dueDate||"—"}`);
  }
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
