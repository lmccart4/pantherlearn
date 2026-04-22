const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const slugs = [
  "algorithm-how-it-works",
  "algorithm-attention-economy",
  "algorithm-filter-bubbles",
  "feed-architect",
  "algorithm-virality",
];

(async () => {
  for (const s of slugs) {
    const doc = await db.doc(`courses/digital-literacy/lessons/${s}`).get();
    if (!doc.exists) { console.log(`\n${s}: NOT FOUND`); continue; }
    const d = doc.data();
    const progSnap = await db.collection(`courses/digital-literacy/lessons/${s}/progress`).get();
    const students = progSnap.size;
    let submitted = 0, withScores = 0, totalScoreSum = 0;
    const sample = [];
    progSnap.forEach(p => {
      const pd = p.data();
      if (pd.submitted) submitted++;
      const scores = pd.blockScores || pd.scores || {};
      const scoreCount = Object.keys(scores).length;
      if (scoreCount > 0) withScores++;
      if (sample.length < 3) sample.push({ uid: p.id.slice(0,8), submitted: pd.submitted, scoreCount, completedAt: pd.completedAt?.toDate?.().toISOString?.() || pd.completedAt });
    });
    console.log(`\n━━━ ${s} (order ${d.order}) ━━━`);
    console.log(`Title: ${d.title}`);
    console.log(`dueDate: ${d.dueDate || "none"} | gradesReleased: ${d.gradesReleased ?? "unset"}`);
    console.log(`Progress records: ${students} | submitted: ${submitted} | with scores: ${withScores}`);
    if (sample.length) console.log(`Sample:`, sample);
  }
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
