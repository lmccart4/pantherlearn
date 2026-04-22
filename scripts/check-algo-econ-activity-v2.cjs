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
  // Get all users with progress
  const users = await db.collection("progress").get();
  console.log(`Scanning ${users.size} students...`);
  const counts = Object.fromEntries(slugs.map(s=>[s, {records:0, submitted:0, withScores:0, anyScore:0}]));
  let totalChecked = 0;
  for (const u of users.docs) {
    for (const slug of slugs) {
      const ref = db.doc(`progress/${u.id}/courses/digital-literacy/lessons/${slug}`);
      const d = await ref.get();
      if (!d.exists) continue;
      totalChecked++;
      const pd = d.data();
      counts[slug].records++;
      if (pd.submitted) counts[slug].submitted++;
      const scores = pd.blockScores || pd.scores || {};
      if (Object.keys(scores).length) counts[slug].withScores++;
      if (pd.score || pd.totalScore) counts[slug].anyScore++;
    }
  }
  console.log(`\nTotal progress docs found: ${totalChecked}\n`);
  for (const s of slugs) {
    console.log(`${s}:`, counts[s]);
  }
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
