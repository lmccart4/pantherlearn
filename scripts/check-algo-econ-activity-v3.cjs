const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const slugs = new Set([
  "algorithm-how-it-works",
  "algorithm-attention-economy",
  "algorithm-filter-bubbles",
  "feed-architect",
  "algorithm-virality",
]);

(async () => {
  // collectionGroup on "lessons" — every student's progress/{uid}/courses/{cid}/lessons/{slug} doc
  const cg = await db.collectionGroup("lessons").get();
  console.log(`Total lesson progress docs (all students, all courses): ${cg.size}`);
  const counts = {};
  for (const slug of slugs) counts[slug] = { records:0, submitted:0, withScores:0, completed:0 };
  cg.forEach(d => {
    const id = d.id;
    if (!slugs.has(id)) return;
    const pd = d.data();
    // Confirm this is under digital-literacy course path
    const path = d.ref.path;
    if (!path.includes("/courses/digital-literacy/lessons/")) return;
    counts[id].records++;
    if (pd.submitted) counts[id].submitted++;
    const scores = pd.blockScores || pd.scores || {};
    if (Object.keys(scores).length) counts[id].withScores++;
    if (pd.completedAt || pd.completed) counts[id].completed++;
  });
  console.log();
  for (const [slug, c] of Object.entries(counts)) console.log(`${slug}:`, c);
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
